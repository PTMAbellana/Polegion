import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useCompetitionRealtime = (competitionId, isLoading) => {
  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
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
        const { data, error } = await supabase
          .from('competitions')
          .select('*')
          .eq('id', competitionId);

        if (!error && data && data.length > 0) {
          const newCompetition = data[0];
          
          // ✅ Better change detection with logging
          setCompetition(prevCompetition => {
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
        console.log('⚠️ [Polling] Error (ignoring):', error.message);
      }
    };

    // ✅ More frequent polling during competition start
    const startPolling = () => {
      pollCompetition(); // Initial poll
      pollInterval = setInterval(pollCompetition, 1500); // Poll every 1.5 seconds
    };

    // Start polling immediately
    startPolling();

    // Also create a broadcast channel for real-time updates
    const channel = supabase
      .channel(`competition-${competitionId}`)
      .on('broadcast', { event: 'competition_update' }, (payload) => {
        if (payload?.payload) {
          console.log('🔥 [Broadcast] Received update:', payload.payload);
          setCompetition(payload.payload);
          setPollCount(prev => prev + 1);
        }
      })
      .subscribe();

    return () => {
      console.log('🧹 [Realtime] Cleanup for competition:', competitionId);
      if (pollInterval) clearInterval(pollInterval);
      if (channel) supabase.removeChannel(channel);
    };
  }, [shouldConnect, competitionId]);

  return {
    competition,
    participants,
    isConnected,
    connectionStatus,
    setParticipants: (newParticipants) => setParticipants(newParticipants),
    pollCount
  };
};