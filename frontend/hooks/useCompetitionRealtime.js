import { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../api/axios';
import { getActiveParticipants, getActiveCompetitionParticipants } from '../api/participants';

export const useCompetitionRealtime = (competitionId, isLoading, roomId = '', userType = 'participant') => {
  console.log('🎣 [HOOK] useCompetitionRealtime called with:', { competitionId, isLoading, roomId, userType });
  
  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [activeParticipants, setActiveParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const [pollCount, setPollCount] = useState(0);
  const [error, setError] = useState(null);
  
  // Refs for cleanup and tracking
  const channelRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const mountedRef = useRef(true);
  const setupCompleteRef = useRef(false);
  const currentCompIdRef = useRef(null);
  const isCleaningUpRef = useRef(false);
  
  // Memoize the competition ID string to prevent unnecessary re-renders
  const compIdStr = useMemo(() => {
    const result = competitionId ? String(competitionId) : null;
    console.log('🔢 [HOOK] compIdStr computed:', result);
    return result;
  }, [competitionId]);
  
  // Memoize roomId to prevent reference changes
  const stableRoomId = useMemo(() => {
    const result = roomId || '';
    console.log('🏠 [HOOK] stableRoomId computed:', result);
    return result;
  }, [roomId]);

  console.log('🎯 [HOOK] About to set up useEffects. compIdStr:', compIdStr, 'stableRoomId:', stableRoomId);

  // Cleanup on unmount
  useEffect(() => {
    console.log('🧹 [HOOK] Mount effect running');
    mountedRef.current = true;
    return () => {
      console.log('🧹 [HOOK] Mount effect cleanup');
      mountedRef.current = false;
    };
  }, []);

  // Main effect for polling and database subscriptions
  useEffect(() => {
    console.log('🔄 [Realtime] Effect running with:', { 
      compIdStr, 
      isLoading, 
      stableRoomId,
      currentCompId: currentCompIdRef.current,
      hasChannel: !!channelRef.current
    });
    
    // Don't connect if still loading or no competitionId
    if (isLoading || !compIdStr || !stableRoomId) {
      console.log('⏳ [Realtime] Not ready:', { isLoading, compIdStr, stableRoomId, userType });
      return;
    }

    // Skip if already set up for this competition
    if (currentCompIdRef.current === compIdStr && channelRef.current && !isCleaningUpRef.current) {
      console.log('🔄 [Realtime] Already set up for:', compIdStr, 'skipping setup');
      return;
    }

    console.log('🚀 [Realtime] Setting up for competition:', compIdStr, 'userType:', userType, 'roomId:', stableRoomId);
    currentCompIdRef.current = compIdStr;
    isCleaningUpRef.current = false;

    // Function to fetch active participants
    const fetchActiveParticipants = async () => {
      if (!mountedRef.current) return;
      
      try {
        console.log('👥 [ActiveTracking] Fetching active participants for competition:', compIdStr);
        
        // Fetch from database-backed active tracking
        const result = await getActiveCompetitionParticipants(compIdStr);
        
        if (result.success && result.data) {
          console.log('👥 [ActiveTracking] Active participants:', result.data.length, result.data);
          setActiveParticipants(result.data);
        } else {
          console.warn('⚠️ [ActiveTracking] Failed to fetch:', result.error);
        }
      } catch (error) {
        console.error('❌ [ActiveTracking] Error:', error);
      }
    };

    // Polling function
    const pollCompetition = async () => {
      if (!mountedRef.current) return;
      
      try {
        const timestamp = Date.now();
        console.log(`🔄 [Polling] Starting poll for competition ${compIdStr}, room ${stableRoomId}, userType ${userType}`);
        console.log(`🔄 [Polling] Making requests to:
          - /competitions/${stableRoomId}/${compIdStr}?type=${userType}
          - /leaderboards/competition/${stableRoomId}?competition_id=${compIdStr}`);
        
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
        
        console.log(`✅ [Polling] Received responses:
          - Competition: ${compResponse?.data ? 'SUCCESS' : 'NO DATA'}
          - Leaderboard: ${leaderResponse?.data ? 'SUCCESS' : 'NO DATA'}`);
        
        if (!mountedRef.current) return;
        
        const data = compResponse.data;
        const leaderboardData = leaderResponse.data?.data || [];
        
        console.log('📊 [Polling] Leaderboard response:', leaderResponse.data);
        console.log('📊 [Polling] Leaderboard data array:', leaderboardData);
        
        // Extract participants
        const participantsArray = leaderboardData.length > 0 && leaderboardData[0]?.data 
          ? leaderboardData[0].data.map((item, idx) => {
              console.log(`📊 [Polling] Processing participant ${idx}:`, item);
              return {
                id: item.participants?.id || `participant-${idx}`,
                user_id: item.participants?.id,
                fullName: `${item.participants?.first_name || ''} ${item.participants?.last_name || ''}`.trim(),
                profile_pic: item.participants?.profile_pic,
                accumulated_xp: item.accumulated_xp
              };
            })
          : [];
        
        console.log('📊 [Polling] Participants with XP:', participantsArray.map(p => ({ 
          name: p.fullName, 
          id: p.id,
          user_id: p.user_id,
          xp: p.accumulated_xp
        })));
        
        // Always update participants to ensure XP changes are reflected
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
        console.error('❌ [Polling] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
          fullError: error
        });
        setError(error);
      }
    };

    // Start polling
    pollCompetition();
    pollIntervalRef.current = setInterval(pollCompetition, 2000);

    // Fetch initial active participants
    fetchActiveParticipants();
    
    // Poll active participants every 5 seconds
    const activeParticipantsInterval = setInterval(fetchActiveParticipants, 5000);

    // Setup database subscription for active participant changes
    const channel = supabase.channel(`competition-${compIdStr}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_participants',
          filter: `room_id=eq.${stableRoomId}`
        },
        (payload) => {
          console.log('🔥 [DBSubscription] room_participants changed:', payload);
          console.log('🔥 [DBSubscription] Event type:', payload.eventType);
          console.log('🔥 [DBSubscription] New data:', payload.new);
          // Refetch active participants whenever room_participants table changes
          fetchActiveParticipants();
        }
      )
      .on('broadcast', { event: 'competition_update' }, (payload) => {
        if (!mountedRef.current) return;
        if (payload?.payload) {
          console.log('🔥 [Broadcast] Update received');
          setCompetition(payload.payload);
          setPollCount(c => c + 1);
        }
      })
      .subscribe((status, err) => {
        console.log(`📡 [DBSubscription] Status: ${status} for competition-${compIdStr}`);
        console.log(`📡 [DBSubscription] Channel state:`, channel.state);
        if (err) {
          console.error(`⚠️ [DBSubscription] Subscription error:`, err);
        }
        
        if (status === 'SUBSCRIBED' && mountedRef.current) {
          setIsConnected(true);
          setConnectionStatus('CONNECTED');
          setupCompleteRef.current = true;
          console.log('✅ [DBSubscription] Successfully subscribed to database changes');
          console.log('✅ [DBSubscription] Listening for changes on room_participants where room_id =', stableRoomId);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(`❌ [DBSubscription] Failed to connect:`, status);
          setConnectionStatus(status === 'CHANNEL_ERROR' ? 'ERROR' : 'TIMEOUT');
          setIsConnected(false);
        }
      });

    channelRef.current = channel;
    console.log(`✅ [DBSubscription] Channel stored in ref, waiting for SUBSCRIBED status...`);
    
    // Add a small delay to prevent immediate cleanup in strict mode
    const setupTimeoutRef = setTimeout(() => {
      setupCompleteRef.current = true;
    }, 100);
    
    // Cleanup function - only runs on unmount or when competition actually changes
    return () => {
      clearTimeout(setupTimeoutRef);
      
      // Don't cleanup if setup just started (within 100ms) - strict mode workaround
      if (!setupCompleteRef.current) {
        console.log('⏭️ [Realtime] Skipping premature cleanup (strict mode remount)');
        return;
      }
      
      isCleaningUpRef.current = true;
      console.log('🧹 [Realtime] Cleaning up for competition:', compIdStr);
      
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      
      clearInterval(activeParticipantsInterval);
      
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      
      setupCompleteRef.current = false;
      currentCompIdRef.current = null;
      setIsConnected(false);
      setConnectionStatus('DISCONNECTED');
    };
  }, [compIdStr, isLoading, stableRoomId, userType]);

  return {
    competition,
    participants,
    activeParticipants,
    isConnected,
    connectionStatus,
    error,
    setParticipants: (newParticipants) => setParticipants(newParticipants),
    pollCount
  };
};
