import { useEffect, useRef, useState } from 'react';
import { autoAdvanceCompetition } from '../api/competitions';
import { supabase } from '../lib/supabaseClient';

export const useCompetitionTimer = (competitionId, competition) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const intervalRef = useRef(null);
  const timerChannelRef = useRef(null);

  // Calculate time remaining from database values
  const calculateTimeRemaining = (competition) => {
    if (!competition?.timer_started_at || !competition?.timer_duration) {
      return 0;
    }

    const startTime = new Date(competition.timer_started_at).getTime();
    const duration = competition.timer_duration * 1000; // Convert to milliseconds
    const now = Date.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, Math.floor((duration - elapsed) / 1000));
    
    return remaining;
  };

  // Start timer synchronization
  useEffect(() => {
    if (!competitionId || !competition) return;

    console.log('🕐 Setting up timer for competition:', competitionId);

    // Subscribe to timer updates via real-time
    const timerChannel = supabase
      .channel(`competition-timer-${competitionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'competitions',
        filter: `id=eq.${competitionId}`
      }, (payload) => {
        console.log('🔄 Timer update received:', payload.new);
        
        if (payload.new.timer_started_at && payload.new.timer_duration) {
          const remaining = calculateTimeRemaining(payload.new);
          setTimeRemaining(remaining);
          setIsTimerActive(payload.new.status === 'ONGOING' && payload.new.gameplay_indicator === 'PLAY' && remaining > 0);
        }
      })
      .subscribe();

    timerChannelRef.current = timerChannel;

    // Initialize timer from current competition state
    if (competition.status === 'ONGOING' && competition.timer_started_at) {
      const remaining = calculateTimeRemaining(competition);
      setTimeRemaining(remaining);
      setIsTimerActive(remaining > 0 && competition.gameplay_indicator === 'PLAY');
    }

    return () => {
      if (timerChannelRef.current) {
        supabase.removeChannel(timerChannelRef.current);
      }
    };
  }, [competitionId, competition]);

  // Timer countdown logic
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          const newTime = prev - 1;
          
          // Auto-advance when timer hits 0
          if (newTime <= 0) {
            setIsTimerActive(false);
            console.log('⏰ Timer expired! Auto-advancing competition...');
            
            // Call auto-advance API using proper API function
            autoAdvanceCompetition(competitionId)
              .then(result => {
                console.log('✅ Auto-advance successful:', result);
              })
              .catch(err => console.error('❌ Failed to auto-advance:', err));
          }
          
          return Math.max(0, newTime);
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerActive, timeRemaining, competitionId]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    isTimerActive,
    formattedTime: formatTime(timeRemaining),
    isExpired: timeRemaining === 0
  };
};
