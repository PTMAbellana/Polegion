import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useCompetitionRealtime = (competitionId, isLoading, roomId) => {
  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
  const channelRef = useRef(null);
  const mountedRef = useRef(true);
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isLoading || !competitionId) {
      console.log('⏳ [Realtime] Not ready yet - isLoading:', isLoading, 'competitionId:', competitionId);
      return;
    }

    console.log('🚀 [Realtime] Starting realtime for competition:', competitionId);
    setConnectionStatus('CONNECTING');

    // Clean up existing channel
    if (channelRef.current) {
      console.log('🧹 [Realtime] Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create simple realtime channel
    const channel = supabase
      .channel(`competition-${competitionId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'competitions',
        filter: `id=eq.${competitionId}`
      }, (payload) => {
        if (!mountedRef.current) return;
        console.log('🔥 [Realtime] Competition update:', payload);
        if (payload?.new) {
          setCompetition(payload.new);
          setPollCount(prev => prev + 1);
        }
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'competition_leaderboards',
        filter: `competition_id=eq.${competitionId}`
      }, (payload) => {
        if (!mountedRef.current) return;
        console.log('🏆 [Realtime] Leaderboard update:', payload);
        setPollCount(prev => prev + 1);
        // Handle leaderboard updates
      })
      .subscribe((status) => {
        console.log('📡 [Realtime] Status:', status);
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
          setConnectionStatus('CONNECTED');
          console.log('✅ [Realtime] Connected successfully');
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
          setConnectionStatus('ERROR');
          console.error('❌ [Realtime] Channel error');
        } else if (status === 'CLOSED') {
          setIsConnected(false);
          setConnectionStatus('DISCONNECTED');
          console.log('📪 [Realtime] Connection closed');
        }
      });

    channelRef.current = channel;

    return () => {
      if (channel) {
        console.log('🧹 [Realtime] Cleanup on unmount');
        supabase.removeChannel(channel);
      }
    };
  }, [competitionId, isLoading, roomId]);

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
