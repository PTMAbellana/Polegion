import { useEffect, useState, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import api from '../api/axios';

/**
 * TRUE REAL-TIME Competition Hook using Supabase Subscriptions
 * 
 * Replaces polling with instant database updates via Supabase real-time subscriptions
 * - Competition status changes (NEW → ONGOING → DONE)
 * - Participant joins/leaves
 * - XP updates from submissions
 * - Problem changes
 * - Pause/resume events
 */
export const useCompetitionRealtime = (competitionId, isLoading, roomId = '', userType = 'participant') => {
  console.log('🎣 [HOOK] useCompetitionRealtime called with:', { competitionId, isLoading, roomId, userType });
  
  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [activeParticipants, setActiveParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const [presenceReady, setPresenceReady] = useState(false);
  
  // Refs for cleanup and tracking
  const presenceChannelRef = useRef(null);
  const competitionSubscriptionRef = useRef(null);
  const leaderboardSubscriptionRef = useRef(null);
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

  // Main effect for real-time subscriptions and presence
  useEffect(() => {
    console.log('🔄 [Realtime] Effect running with:', { 
      compIdStr, 
      isLoading, 
      stableRoomId,
      currentCompId: currentCompIdRef.current,
      hasPresenceChannel: !!presenceChannelRef.current
    });
    
    // Don't connect if still loading or no competitionId
    if (isLoading || !compIdStr || !stableRoomId) {
      console.log('⏳ [Realtime] Not ready:', { isLoading, compIdStr, stableRoomId, userType });
      return;
    }

    // Skip if already set up for this competition
    if (currentCompIdRef.current === compIdStr && presenceChannelRef.current && !isCleaningUpRef.current) {
      console.log('🔄 [Realtime] Already set up for:', compIdStr, 'skipping setup');
      return;
    }

    console.log('🚀 [Realtime] Setting up REAL-TIME subscriptions for competition:', compIdStr, 'userType:', userType, 'roomId:', stableRoomId);
    currentCompIdRef.current = compIdStr;
    isCleaningUpRef.current = false;

    // Initial data fetch
    const fetchInitialData = async () => {
      if (!mountedRef.current) return;
      
      try {
        const timestamp = Date.now();
        console.log(`📥 [Initial Fetch] Loading competition ${compIdStr} data...`);
        
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
        
        console.log('📊 [Initial Fetch] Leaderboard data:', leaderboardData);
        
        // Extract participants - filter out teachers/admins
        const participantsArray = leaderboardData.length > 0 && leaderboardData[0]?.data 
          ? leaderboardData[0].data
              .filter(item => item.participants && item.participants.id)
              .map((item, idx) => ({
                id: item.participants?.id || `participant-${idx}`,
                user_id: item.participants?.id,
                fullName: `${item.participants?.first_name || ''} ${item.participants?.last_name || ''}`.trim(),
                profile_pic: item.participants?.profile_pic,
                accumulated_xp: item.accumulated_xp,
                role: 'student'
              }))
          : [];
        
        console.log('📊 [Initial Fetch] Loaded', participantsArray.length, 'participants');
        
        setParticipants(participantsArray);
        if (data) {
          setCompetition(data);
          console.log('✅ [Initial Fetch] Competition loaded:', {
            status: data.status,
            current_problem: data.current_problem_index,
            timer: data.timer_duration
          });
        }
      } catch (error) {
        console.error('⚠️ [Initial Fetch] Error:', error.message);
      }
    };

    // Fetch initial data
    fetchInitialData();

    // ============================================
    // REAL-TIME SUBSCRIPTION: Competition Table
    // ============================================
    console.log('🔔 [Subscription] Setting up competition table subscription...');
    competitionSubscriptionRef.current = supabase
      .channel(`competition-updates-${compIdStr}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'competitions',
          filter: `id=eq.${compIdStr}`
        },
        async (payload) => {
          if (!mountedRef.current) return;
          
          console.log('🔥 [Competition UPDATE] Real-time change detected:', {
            event: payload.eventType,
            new: payload.new,
            old: payload.old
          });
          
          // Fetch fresh competition data to get all fields
          try {
            const timestamp = Date.now();
            const response = await api.get(
              `/competitions/${stableRoomId}/${compIdStr}?type=${userType}&_t=${timestamp}`,
              { headers: { 'Cache-Control': 'no-cache' }, cache: false }
            );
            
            if (response.data && mountedRef.current) {
              setCompetition(response.data);
              console.log('✅ [Competition UPDATE] State updated:', {
                status: response.data.status,
                problem: response.data.current_problem_index,
                timer_started: response.data.timer_started_at
              });
            }
          } catch (error) {
            console.error('⚠️ [Competition UPDATE] Fetch error:', error.message);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 [Competition Subscription] Status:', status);
      });

    // ============================================
    // REAL-TIME SUBSCRIPTION: Problem Leaderboards (for participant XP updates)
    // ============================================
    console.log('🔔 [Subscription] Setting up leaderboard subscription...');
    leaderboardSubscriptionRef.current = supabase
      .channel(`leaderboard-updates-${compIdStr}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'problem_leaderboards',
          filter: `competition_id=eq.${compIdStr}`
        },
        async (payload) => {
          if (!mountedRef.current) return;
          
          console.log('🏆 [Leaderboard UPDATE] Real-time XP change:', {
            event: payload.eventType,
            participant_id: payload.new?.participant_id,
            new_xp: payload.new?.accumulated_xp
          });
          
          // Fetch fresh leaderboard data
          try {
            const timestamp = Date.now();
            const response = await api.get(
              `/leaderboards/competition/${stableRoomId}?competition_id=${compIdStr}&_t=${timestamp}`,
              { headers: { 'Cache-Control': 'no-cache' }, cache: false }
            );
            
            const leaderboardData = response.data?.data || [];
            
            const participantsArray = leaderboardData.length > 0 && leaderboardData[0]?.data 
              ? leaderboardData[0].data
                  .filter(item => item.participants && item.participants.id)
                  .map((item, idx) => ({
                    id: item.participants?.id || `participant-${idx}`,
                    user_id: item.participants?.id,
                    fullName: `${item.participants?.first_name || ''} ${item.participants?.last_name || ''}`.trim(),
                    profile_pic: item.participants?.profile_pic,
                    accumulated_xp: item.accumulated_xp,
                    role: 'student'
                  }))
              : [];
            
            if (mountedRef.current) {
              setParticipants(participantsArray);
              console.log('✅ [Leaderboard UPDATE] XP updated for', participantsArray.length, 'participants');
            }
          } catch (error) {
            console.error('⚠️ [Leaderboard UPDATE] Fetch error:', error.message);
          }
        }
      )
      .subscribe((status) => {
        console.log('📡 [Leaderboard Subscription] Status:', status);
      });

    // ============================================
    // PRESENCE CHANNEL: Track active participants
    // ============================================
    // ============================================
    // PRESENCE CHANNEL: Track active participants
    // ============================================
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

    channel
      .on('presence', { event: 'sync' }, () => {
        if (!mountedRef.current) return;
        
        const presenceState = channel.presenceState();
        const stateKeys = Object.keys(presenceState);
        console.log(`👥 [Presence] Sync for competition-${compIdStr}: ${stateKeys.length} presence keys`);
        
        const active = Object.values(presenceState).flatMap(presences => 
          presences.map(p => p.user).filter(Boolean)
        );
        
        console.log('👥 [Presence] Active users:', active.length, active);
        setActiveParticipants(active);
        
        if (active.length === 0) {
          console.warn('⚠️ [Presence] No users detected in presence state');
        }
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log(`✅ [Presence] Join:`, newPresences?.map(p => p.user?.first_name));
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log(`❌ [Presence] Leave:`, leftPresences?.map(p => p.user?.first_name));
      })
      .subscribe(async (status, err) => {
        console.log(`📡 [Presence] Status: ${status} for competition-${compIdStr}`);
        if (err) {
          console.error(`❌ [Presence] Subscription error:`, err);
        }
        
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
          const retryDelay = Math.min(1000 * Math.pow(2, retryCountRef.current - 1), 8000);
          
          console.log(`🔄 [Presence] Retrying in ${retryDelay}ms...`);
          
          retryTimeoutRef.current = setTimeout(() => {
            if (!mountedRef.current) return;
            
            if (presenceChannelRef.current) {
              supabase.removeChannel(presenceChannelRef.current);
              presenceChannelRef.current = null;
            }
            
            currentCompIdRef.current = null;
          }, retryDelay);
        } else if (retryCountRef.current >= maxRetries) {
          console.error(`❌ [Presence] Max retries (${maxRetries}) exceeded`);
        }
      }
    });

    presenceChannelRef.current = channel;
    console.log(`✅ [Real-time] All subscriptions active: competition updates + leaderboard updates + presence`);
    
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
      console.log('🧹 [Realtime] Cleaning up subscriptions for competition:', compIdStr);
      
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      
      // Unsubscribe from competition updates
      if (competitionSubscriptionRef.current) {
        supabase.removeChannel(competitionSubscriptionRef.current);
        competitionSubscriptionRef.current = null;
        console.log('✅ [Cleanup] Competition subscription removed');
      }
      
      // Unsubscribe from leaderboard updates
      if (leaderboardSubscriptionRef.current) {
        supabase.removeChannel(leaderboardSubscriptionRef.current);
        leaderboardSubscriptionRef.current = null;
        console.log('✅ [Cleanup] Leaderboard subscription removed');
      }
      
      // Remove presence channel
      if (presenceChannelRef.current) {
        presenceChannelRef.current.untrack().then(() => {
          console.log('✅ [Cleanup] Presence untracked successfully');
        }).catch((error) => {
          console.error('⚠️ [Cleanup] Error untracking presence:', error);
        });
        
        supabase.removeChannel(presenceChannelRef.current);
        presenceChannelRef.current = null;
        console.log('✅ [Cleanup] Presence channel removed');
      }
      
      retryCountRef.current = 0;
      setupCompleteRef.current = false;
      currentCompIdRef.current = null;
      setIsConnected(false);
      setConnectionStatus('DISCONNECTED');
      setPresenceReady(false);
    };
  }, [compIdStr, isLoading, stableRoomId, userType]); // Include all dependencies

  return {
    competition,
    participants,
    activeParticipants,
    isConnected,
    connectionStatus,
    presenceReady,
    setParticipants: (newParticipants) => setParticipants(newParticipants),
