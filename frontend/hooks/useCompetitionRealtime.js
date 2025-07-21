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

    console.log('🚀 [Realtime] Starting SIMPLE connection for competition:', competitionId);
    
    // Just set connected immediately for testing
    setConnectionStatus('CONNECTED');
    setIsConnected(true);
    
    // Simple polling every 3 seconds (less aggressive)
    let pollInterval = null;
    
    const pollCompetition = async () => {
      try {
        const { data, error } = await supabase
          .from('competitions')
          .select('*')
          .eq('id', competitionId);

        if (!error && data && data.length > 0) {
          setCompetition(data[0]);
          setPollCount(prev => prev + 1);
          console.log('✅ [Polling] Updated:', data[0].status);
        }
      } catch (error) {
        console.log('⚠️ [Polling] Skip error:', error);
      }
    };

    // Start polling after 1 second
    setTimeout(() => {
      pollCompetition();
      pollInterval = setInterval(pollCompetition, 3000);
    }, 1000);

    // Also create a simple broadcast channel
    const channel = supabase
      .channel(`competition-${competitionId}`)
      .on('broadcast', { event: 'competition_update' }, (payload) => {
        if (payload?.payload) {
          setCompetition(payload.payload);
          setPollCount(prev => prev + 1);
          console.log('🔥 [Broadcast] Received:', payload.payload.status);
        }
      })
      .subscribe();

    return () => {
      console.log('🧹 [Realtime] Cleanup');
      if (pollInterval) clearInterval(pollInterval);
      if (channel) supabase.removeChannel(channel);
    };
  }, [shouldConnect, competitionId]);

  // Provide setParticipants function for external updates
  const setParticipantsWrapper = (newParticipants) => {
    setParticipants(newParticipants);
  };

  return {
    competition,
    participants,
    isConnected,
    connectionStatus,
    setParticipants: setParticipantsWrapper,
    pollCount
  };
};
