import { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../api/axios';

export const useCompetitionRealtime = (competitionId, isLoading, roomId = '', userType = 'participant') => {
  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [activeParticipants, setActiveParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const [pollCount, setPollCount] = useState(0);
  
  // Refs for cleanup and tracking
  const channelRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const mountedRef = useRef(true);
  const setupCompleteRef = useRef(false);
  const currentCompIdRef = useRef(null);
  
  // Memoize the competition ID string to prevent unnecessary re-renders
  const compIdStr = useMemo(() => {
    return competitionId ? String(competitionId) : null;
  }, [competitionId]);
  
  // Memoize roomId to prevent reference changes
  const stableRoomId = useMemo(() => roomId || '', [roomId]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Main effect for polling and presence
  useEffect(() => {
    // Don't connect if still loading or no competitionId
    if (isLoading || !compIdStr || !stableRoomId) {
      console.log('⏳ [Realtime] Not ready:', { isLoading, compIdStr, stableRoomId });
      return;
    }

    // Skip if already set up for this competition
    if (currentCompIdRef.current === compIdStr && channelRef.current) {
      console.log('🔄 [Realtime] Already set up for:', compIdStr);
      return;
    }

    console.log('🚀 [Realtime] Setting up for competition:', compIdStr);
    currentCompIdRef.current = compIdStr;

    // Polling function
    const pollCompetition = async () => {
      if (!mountedRef.current) return;
      
      try {
        const timestamp = Date.now();
        const [compResponse, leaderResponse] = await Promise.all([
          api.get(`/competitions/${stableRoomId}/${compIdStr}?type=${userType}&_t=${timestamp}`, {
            headers: { 'Cache-Control': 'no-cache' },
            cache: false
          }),
          api.get(`/leaderboards/competition/${stableRoomId}?competition_id=${compIdStr}&_t=${timestamp}`, {
            headers: { 'Cache-Control': 'no-cache' },
            cache: false
          })
        ]);
        
        if (!mountedRef.current) return;
        
        const data = compResponse.data;
        const leaderboardData = leaderResponse.data?.data || [];
        
        // Extract participants
        const participantsArray = leaderboardData.length > 0 && leaderboardData[0]?.data 
          ? leaderboardData[0].data.map((item, idx) => ({
              id: item.participants.id || `participant-${idx}`,
              user_id: item.participants.id,
              fullName: `${item.participants.firstName || item.participants.first_name || ''} ${item.participants.lastName || item.participants.last_name || ''}`.trim(),
              profile_pic: item.participants.profile_pic,
              accumulated_xp: item.accumulated_xp
            }))
          : [];
        
        setParticipants(participantsArray);
        
        if (data) {
          setCompetition(prev => {
            if (!prev) {
              setPollCount(c => c + 1);
              return data;
            }
            
            // Check for any significant changes
            const changed = 
              prev.status !== data.status ||
              prev.timer_started_at !== data.timer_started_at ||
              prev.current_problem_index !== data.current_problem_index ||
              prev.current_problem_id !== data.current_problem_id ||
              prev.gameplay_indicator !== data.gameplay_indicator ||
              prev.timer_duration !== data.timer_duration;
            
            if (changed) {
              console.log('🔥 [Polling] Competition updated:', {
                status: data.status,
                gameplay_indicator: data.gameplay_indicator,
                current_problem_index: data.current_problem_index,
                current_problem_id: data.current_problem_id,
                timer_started_at: data.timer_started_at
              });
              setPollCount(c => c + 1);
              return data;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('⚠️ [Polling] Error:', error.message);
      }
    };

    // Start polling
    pollCompetition();
    pollIntervalRef.current = setInterval(pollCompetition, 2000);

    // Setup presence channel
    const channel = supabase.channel(`competition-${compIdStr}`, {
      config: {
        presence: { key: compIdStr },
      },
    });

    console.log(`🔌 [Presence] Setting up channel: competition-${compIdStr}`);

    channel
      .on('presence', { event: 'sync' }, () => {
        if (!mountedRef.current) return;
        
        const presenceState = channel.presenceState();
        console.log(`👥 [Presence] Sync:`, presenceState);
        
        const active = Object.values(presenceState).flatMap(presences => 
          presences.map(p => p.user).filter(Boolean)
        );
        
        console.log('👥 [Presence] Active users:', active.length, active.map(u => u?.first_name));
        
        // Always trust the sync event - it's the source of truth
        setActiveParticipants(active);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log(`✅ [Presence] Join:`, newPresences?.map(p => p.user?.first_name));
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log(`❌ [Presence] Leave:`, leftPresences?.map(p => p.user?.first_name));
      })
      .on('broadcast', { event: 'competition_update' }, (payload) => {
        if (!mountedRef.current) return;
        if (payload?.payload) {
          console.log('🔥 [Broadcast] Update received');
          setCompetition(payload.payload);
          setPollCount(c => c + 1);
        }
      })
      .subscribe(async (status) => {
        console.log(`📡 [Presence] Status: ${status}`);
        
        if (status === 'SUBSCRIBED' && mountedRef.current) {
          setIsConnected(true);
          setConnectionStatus('CONNECTED');
          
          // Track this user's presence
          const userProfile = JSON.parse(localStorage.getItem('user') || '{}');
          
          if (userProfile.id) {
            console.log(`🎯 [Presence] Tracking user: ${userProfile.first_name} (${userProfile.role})`);
            
            await channel.track({
              user: {
                id: userProfile.id,
                first_name: userProfile.first_name,
                last_name: userProfile.last_name,
                profile_pic: userProfile.profile_pic,
                role: userProfile.role,
                online_at: new Date().toISOString(),
              },
            });
            
            setupCompleteRef.current = true;
            console.log(`✅ [Presence] User tracked successfully`);
          }
        }
      });

    channelRef.current = channel;

    // Cleanup function - only runs on unmount or when competition actually changes
    return () => {
      console.log('🧹 [Realtime] Cleaning up for competition:', compIdStr);
      currentCompIdRef.current = null;
      
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      
      setupCompleteRef.current = false;
      setIsConnected(false);
      setConnectionStatus('DISCONNECTED');
    };
  }, [compIdStr, stableRoomId, isLoading, userType]);

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
