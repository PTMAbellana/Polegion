import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../api/axios';

export const useCompetitionRealtime = (competitionId, isLoading, roomId = '', userType = 'participant') => {
  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [activeParticipants, setActiveParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const channelRef = useRef(null);
  const mountedRef = useRef(true);
  const [pollCount, setPollCount] = useState(0);
  const [shouldConnect, setShouldConnect] = useState(false);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Effect to determine when we should connect
  useEffect(() => {
    console.log('🔄 [Realtime] Connection readiness check - isLoading:', isLoading, 'competitionId:', competitionId);
    
    if (!isLoading && competitionId) {
      console.log('✅ [Realtime] Ready to connect!');
      setShouldConnect(true);
    } else {
      console.log('⏳ [Realtime] Not ready yet - isLoading:', isLoading, 'competitionId:', competitionId);
      setShouldConnect(false);
    }
  }, [isLoading, competitionId]);

  // Effect to handle the actual connection
  useEffect(() => {
    if (!shouldConnect || !competitionId) {
      return;
    }

    console.log('🚀 [Realtime] Starting connection for competition:', competitionId);
    
    setConnectionStatus('CONNECTED');
    setIsConnected(true);
    
    let pollInterval = null;
    
    const pollCompetition = async () => {
      try {
        console.log('🔍 [Polling] Fetching competition with ID:', competitionId, 'roomId:', roomId);
        
        if (!roomId || roomId === '') {
          console.warn('⚠️ [Polling] Missing roomId in URL - skipping fetch. Please navigate to this page with ?room=X parameter');
          return;
        }

        // Use backend API with roomId for proper authorization
        const [compResponse, leaderResponse] = await Promise.all([
          api.get(`/competitions/${roomId}/${competitionId}?type=${userType}`),
          api.get(`/leaderboards/competition/${roomId}?competition_id=${competitionId}`)
        ]);
        
        const data = compResponse.data;
        const leaderboardData = leaderResponse.data?.data || [];
        
        console.log('📊 [Polling] Backend API result:', { data, participants: leaderboardData });
        
        // Extract participants from grouped leaderboard response
        // Backend returns: [{ id, title, data: [{accumulated_xp, participants}] }]
        // We need to flatten to get just the participants
        const participantsArray = leaderboardData.length > 0 && leaderboardData[0]?.data 
          ? leaderboardData[0].data.map((item, idx) => ({
              id: item.participants.id || `participant-${idx}`, // Unique ID (UUID from User)
              user_id: item.participants.id, // User ID
              fullName: `${item.participants.firstName || item.participants.first_name || ''} ${item.participants.lastName || item.participants.last_name || ''}`.trim(),
              profile_pic: item.participants.profile_pic,
              accumulated_xp: item.accumulated_xp
            }))
          : [];
        
        console.log('✅ [Polling] Formatted participants:', participantsArray);
        
        // Update participants
        setParticipants(participantsArray);
        
        if (data) {
          const newCompetition = data;
        
        // ✅ Better change detection with logging
        setCompetition(prevCompetition => {
          // Always set on first load
          if (!prevCompetition) {
            console.log('🎯 [Polling] Initial competition data loaded:', newCompetition);
            setPollCount(prev => prev + 1);
            return newCompetition;
          }
          
          const statusChanged = prevCompetition?.status !== newCompetition?.status;
          const timerStartChanged = prevCompetition?.timer_started_at !== newCompetition?.timer_started_at;
          const problemChanged = prevCompetition?.current_problem_index !== newCompetition?.current_problem_index;
          const gameplayChanged = prevCompetition?.gameplay_indicator !== newCompetition?.gameplay_indicator;
          
          if (statusChanged || timerStartChanged || problemChanged || gameplayChanged) {
            console.log('🔥 [Polling] Competition update detected:', {
              changes: {
                status: statusChanged ? `${prevCompetition?.status} → ${newCompetition?.status}` : 'no change',
                timer_started: timerStartChanged ? `${prevCompetition?.timer_started_at} → ${newCompetition?.timer_started_at}` : 'no change',
                problem: problemChanged ? `${prevCompetition?.current_problem_index} → ${newCompetition?.current_problem_index}` : 'no change',
                gameplay: gameplayChanged ? `${prevCompetition?.gameplay_indicator} → ${newCompetition?.gameplay_indicator}` : 'no change'
              },
              newData: {
                status: newCompetition.status,
                timer_started_at: newCompetition.timer_started_at,
                timer_duration: newCompetition.timer_duration,
                current_problem_index: newCompetition.current_problem_index,
                gameplay_indicator: newCompetition.gameplay_indicator
              }
            });
            
            setPollCount(prev => prev + 1);
            return newCompetition;
          }
          
          return prevCompetition;
        });
        }
      } catch (error) {
        console.error('⚠️ [Polling] Exception:', error.response?.data || error.message);
      }
    };

    // ✅ More frequent polling during competition start
    const startPolling = () => {
      pollCompetition(); // Initial poll
      pollInterval = setInterval(pollCompetition, 1500); // Poll every 1.5 seconds
    };

    // Start polling immediately
    startPolling();

    // Setup Realtime Presence for tracking active participants
    const channel = supabase.channel(`competition-${competitionId}`, {
      config: {
        presence: {
          key: competitionId,
        },
      },
    });

    // Track presence state changes
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        console.log('👥 [Presence] Current participants:', presenceState);
        
        // Extract active participants from presence state
        const active = Object.values(presenceState).flatMap(presences => 
          presences.map(p => p.user)
        );
        setActiveParticipants(active);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('✅ [Presence] User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('❌ [Presence] User left:', leftPresences);
      })
      .on('broadcast', { event: 'competition_update' }, (payload) => {
        if (payload?.payload) {
          console.log('🔥 [Broadcast] Received update:', payload.payload);
          console.log('🎯 [Broadcast] Key fields:', {
            status: payload.payload.status,
            gameplay_indicator: payload.payload.gameplay_indicator,
            current_problem_index: payload.payload.current_problem_index,
            timer_started_at: payload.payload.timer_started_at
          });
          setCompetition(payload.payload);
          setPollCount(prev => prev + 1);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Get current user info from localStorage or auth
          const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
          
          // Track this user's presence
          await channel.track({
            user: {
              id: userProfile.id,
              first_name: userProfile.first_name,
              last_name: userProfile.last_name,
              profile_pic: userProfile.profile_pic,
              online_at: new Date().toISOString(),
            },
          });
        }
      });

    return () => {
      console.log('🧹 [Realtime] Cleanup for competition:', competitionId);
      if (pollInterval) clearInterval(pollInterval);
      if (channel) supabase.removeChannel(channel);
    };
  }, [shouldConnect, competitionId, roomId]);

  return {
    competition,
    participants,
    activeParticipants,
    isConnected,
    connectionStatus,
    setParticipants: (newParticipants) => setParticipants(newParticipants),
    pollCount
  };
};