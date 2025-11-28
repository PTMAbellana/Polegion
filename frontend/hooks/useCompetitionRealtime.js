import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../api/axios';

export const useCompetitionRealtime = (competitionId, isLoading, roomId = '', userType = 'participant') => {
  console.log('🎣 [HOOK] useCompetitionRealtime called with:', { competitionId, isLoading, roomId, userType });
  
  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [activeParticipants, setActiveParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const [pollCount, setPollCount] = useState(0);
  const [presenceReady, setPresenceReady] = useState(false);
  
  // Refs for cleanup and tracking
  const channelRef = useRef(null);
  const pollIntervalRef = useRef(null);
  const mountedRef = useRef(true);
  const setupCompleteRef = useRef(false);
  const currentCompIdRef = useRef(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef(null);
  const maxRetries = 3;
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

  // Main effect for polling and presence
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

    // Polling function
    const pollCompetition = async () => {
      if (!mountedRef.current) return;
      
      try {
        const timestamp = Date.now();
        console.log(`🔄 [Polling] Starting poll for competition ${compIdStr}, room ${stableRoomId}, userType ${userType}`);
        
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
        console.error('⚠️ [Polling] Error:', error.message);
      }
    };

    // Start polling
    pollCompetition();
    pollIntervalRef.current = setInterval(pollCompetition, 2000);

    // Remove any existing channel with the same name first
    const existingChannels = supabase.getChannels();
    const existingChannel = existingChannels.find(ch => ch.topic === `realtime:competition-${compIdStr}`);
    if (existingChannel) {
      console.log(`🗑️ [Presence] Removing existing channel: competition-${compIdStr}`);
      supabase.removeChannel(existingChannel);
    }

    // Setup presence channel
    const channel = supabase.channel(`competition-${compIdStr}`, {
      config: {
        presence: { key: compIdStr },
      },
    });

    console.log(`🔌 [Presence] Setting up channel: competition-${compIdStr} (roomId: ${stableRoomId})`);
    console.log(`🔌 [Presence] Supabase client state:`, {
      hasClient: !!supabase,
      clientType: typeof supabase,
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        if (!mountedRef.current) return;
        
        const presenceState = channel.presenceState();
        const stateKeys = Object.keys(presenceState);
        console.log(`👥 [Presence] Sync for competition-${compIdStr}: ${stateKeys.length} presence keys`);
        console.log(`👥 [Presence] Full state:`, JSON.stringify(presenceState, null, 2));
        console.log(`👥 [Presence] Channel name: competition-${compIdStr}`);
        console.log(`👥 [Presence] My user type: ${userType}`);
        
        const active = Object.values(presenceState).flatMap(presences => 
          presences.map(p => p.user).filter(Boolean)
        );
        
        console.log('👥 [Presence] Active users:', active.length, active);
        console.log('👥 [Presence] User details:', active.map(u => ({ id: u?.id, name: u?.first_name, role: u?.role })));
        
        // Always trust the sync event - it's the source of truth
        setActiveParticipants(active);
        console.log('✅ [Presence] Set activeParticipants to:', active.length, 'users');
        
        // If no users detected, log a warning
        if (active.length === 0) {
          console.warn('⚠️ [Presence] No users detected in presence state. Are students on the competition page?');
        }
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
      .subscribe(async (status, err) => {
        console.log(`📡 [Presence] Status: ${status} for competition-${compIdStr}`);
        if (err) {
          console.error(`❌ [Presence] Subscription error:`, err);
        }
        console.log(`📡 [Presence] Channel details:`, {
          channelName: `competition-${compIdStr}`,
          state: channel.state,
          userType: userType,
          error: err
        });
        
        if (status === 'SUBSCRIBED' && mountedRef.current) {
          setIsConnected(true);
          setConnectionStatus('CONNECTED');
          retryCountRef.current = 0; // Reset retry count on success
          
          // Mark presence as ready after a short delay to allow sync
          setTimeout(() => {
            if (mountedRef.current) {
              setPresenceReady(true);
              console.log('✅ [Presence] Marked as ready');
            }
          }, 1000);
          
          // Track this user's presence
          let userProfile = null;
          try {
            // Try auth-storage first (Zustand persist)
            const authStorage = localStorage.getItem('auth-storage');
            if (authStorage) {
              const parsed = JSON.parse(authStorage);
              userProfile = parsed?.state?.userProfile;
            }
            
            // Fallback to 'user' key if auth-storage doesn't have profile
            if (!userProfile?.id) {
              const userStr = localStorage.getItem('user');
              userProfile = userStr ? JSON.parse(userStr) : null;
            }
          } catch (e) {
            console.error('❌ [Presence] Failed to parse user from localStorage:', e);
          }
          
          if (userProfile?.id) {
            console.log(`🎯 [Presence] Tracking user: ${userProfile.first_name} (${userProfile.role}) with ID: ${userProfile.id}`);
            
            try {
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
              
              // Force an immediate sync after tracking
              setTimeout(() => {
                if (!mountedRef.current) return;
                const presenceState = channel.presenceState();
                console.log(`👥 [Presence] Forced sync after track - state:`, presenceState);
                
                const active = Object.values(presenceState).flatMap(presences => 
                  presences.map(p => p.user).filter(Boolean)
                );
                console.log(`👥 [Presence] Forced sync - active count: ${active.length}`);
                setActiveParticipants(active);
              }, 500); // 500ms delay to allow presence propagation
            } catch (trackError) {
              console.error('❌ [Presence] Failed to track user:', trackError);
            }
          } else {
            console.warn('⚠️ [Presence] No user profile found in localStorage');
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          const errorType = status === 'CHANNEL_ERROR' ? 'Channel error' : 'Connection timed out';
          console.warn(`⚠️ [Presence] ${errorType} (attempt ${retryCountRef.current + 1}/${maxRetries})`);
          setConnectionStatus(status === 'CHANNEL_ERROR' ? 'ERROR' : 'TIMEOUT');
          setIsConnected(false);
          
          // Retry with exponential backoff
          if (retryCountRef.current < maxRetries && mountedRef.current) {
            retryCountRef.current += 1;
            const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 8000); // 1s, 2s, 4s, max 8s
            
            console.log(`🔄 [Presence] Retrying in ${retryDelay}ms...`);
            
            retryTimeoutRef.current = setTimeout(() => {
              if (!mountedRef.current) return;
              
              // Remove old channel and resubscribe
              if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
                channelRef.current = null;
              }
              
              // Trigger re-setup by clearing currentCompIdRef
              currentCompIdRef.current = null;
              // Force a re-render to trigger the effect again
              setPollCount(c => c + 1);
            }, retryDelay);
          } else if (retryCountRef.current >= maxRetries) {
            console.error(`❌ [Presence] Max retries (${maxRetries}) exceeded. Polling will continue working.`);
            // Polling still works even if presence fails
          }
        }
      });

    channelRef.current = channel;
    console.log(`✅ [Presence] Channel stored in ref, waiting for SUBSCRIBED status...`);
    
    // Add a small delay to prevent immediate cleanup in strict mode
    const setupTimeoutRef = setTimeout(() => {
      setupCompleteRef.current = true;
    }, 100);
    
    // Add timeout to detect if subscription hangs
    const subscriptionTimeout = setTimeout(() => {
      if (channelRef.current && channelRef.current.state !== 'joined') {
        console.error(`⏱️ [Presence] Subscription timeout! Channel state: ${channelRef.current.state}`);
        console.error(`⏱️ [Presence] The subscription callback was never called. Possible issues:`);
        console.error(`  1. Supabase Realtime not enabled in dashboard`);
        console.error(`  2. Network/firewall blocking WebSocket connections`);
        console.error(`  3. Invalid Supabase credentials`);
      }
    }, 5000); // 5 second timeout
    
    // Cleanup function - only runs on unmount or when competition actually changes
    return () => {
      clearTimeout(subscriptionTimeout);
      clearTimeout(setupTimeoutRef);
      
      // Don't cleanup if setup just started (within 100ms) - strict mode workaround
      if (!setupCompleteRef.current) {
        console.log('⏭️ [Realtime] Skipping premature cleanup (strict mode remount)');
        return;
      }
      
      isCleaningUpRef.current = true;
      console.log('🧹 [Realtime] Cleaning up for competition:', compIdStr);
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
      
      if (channelRef.current) {
        // Explicitly untrack presence before removing channel
        channelRef.current.untrack().then(() => {
          console.log('✅ [Realtime] Untracked presence successfully');
        }).catch((error) => {
          console.error('⚠️ [Realtime] Error untracking presence:', error);
        });
        
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      
      retryCountRef.current = 0;
      setupCompleteRef.current = false;
      currentCompIdRef.current = null;
      setIsConnected(false);
      setConnectionStatus('DISCONNECTED');
      setPresenceReady(false);
    };
  }, [compIdStr, isLoading, stableRoomId]); // Include stableRoomId in dependencies

  return {
    competition,
    participants,
    activeParticipants,
    isConnected,
    connectionStatus,
    presenceReady,
    setParticipants: (newParticipants) => setParticipants(newParticipants),
    pollCount
  };
};
