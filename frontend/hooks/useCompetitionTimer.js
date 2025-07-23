import { useEffect, useRef, useState } from 'react';
import { autoAdvanceCompetition } from '../api/competitions';
import { supabase } from '../lib/supabaseClient';

export const useCompetitionTimer = (competitionId, competition) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const intervalRef = useRef(null);
  const timerChannelRef = useRef(null);

  // Track the current problem index AND timer_started_at to detect changes
  const [lastProblemIndex, setLastProblemIndex] = useState(null);
  const [lastTimerStartedAt, setLastTimerStartedAt] = useState(null);

  // Calculate time remaining from database values
  const calculateTimeRemaining = (competition) => {
    if (!competition?.timer_started_at || !competition?.timer_duration) {
      console.log('⏰ Missing timer data:', {
        timer_started_at: competition?.timer_started_at,
        timer_duration: competition?.timer_duration
      });
      return 0;
    }

    const startTime = new Date(competition.timer_started_at).getTime();
    const duration = competition.timer_duration * 1000; // Convert to milliseconds
    const now = Date.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, duration - elapsed);
    
    console.log('⏰ Timer calculation:', {
      startTime: new Date(startTime).toISOString(),
      duration: competition.timer_duration,
      elapsed: Math.floor(elapsed / 1000),
      remaining: Math.floor(remaining / 1000)
    });
    
    return Math.floor(remaining / 1000); // Convert back to seconds
  };

  // ✅ FIXED: Detect both problem changes AND initial timer start
  useEffect(() => {
    const currentProblemIndex = competition?.current_problem_index;
    const currentTimerStartedAt = competition?.timer_started_at;
    
    // Check if problem changed OR timer started for the first time
    const problemChanged = currentProblemIndex !== lastProblemIndex && currentProblemIndex !== null;
    const timerStarted = currentTimerStartedAt !== lastTimerStartedAt && currentTimerStartedAt !== null;
    
    if (problemChanged || timerStarted) {
      console.log('🔄 Timer restart triggered!', {
        reason: problemChanged ? 'Problem changed' : 'Timer started',
        oldIndex: lastProblemIndex,
        newIndex: currentProblemIndex,
        oldTimerStart: lastTimerStartedAt,
        newTimerStart: currentTimerStartedAt,
        competition: {
          status: competition?.status,
          gameplay_indicator: competition?.gameplay_indicator
        }
      });
      
      // Clear existing timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      
      // Calculate new time remaining
      const newTimeRemaining = calculateTimeRemaining(competition);
      setTimeRemaining(newTimeRemaining);
      
      // Start timer if competition is ongoing and not paused
      const shouldStartTimer = competition?.status === 'ONGOING' && 
                              competition?.gameplay_indicator !== 'PAUSE' &&
                              newTimeRemaining > 0;
      
      console.log('⏰ Timer decision:', {
        shouldStartTimer,
        status: competition?.status,
        gameplay_indicator: competition?.gameplay_indicator,
        timeRemaining: newTimeRemaining
      });
      
      setIsTimerActive(shouldStartTimer);
      
      // Update tracking variables
      setLastProblemIndex(currentProblemIndex);
      setLastTimerStartedAt(currentTimerStartedAt);
    }
  }, [
    competition?.current_problem_index, 
    competition?.timer_started_at,
    competition?.status, 
    competition?.gameplay_indicator,
    lastProblemIndex,
    lastTimerStartedAt
  ]);

  // ✅ FIXED: Initial timer synchronization (fallback)
  useEffect(() => {
    if (!competition || !competitionId) return;

    // Only do initial sync if we haven't tracked this timer yet
    if (!lastTimerStartedAt && competition.timer_started_at) {
      console.log('🎬 Initial timer sync for competition:', competitionId);
      
      const timeLeft = calculateTimeRemaining(competition);
      setTimeRemaining(timeLeft);

      const shouldStart = competition.status === 'ONGOING' && 
                         competition.gameplay_indicator !== 'PAUSE' && 
                         timeLeft > 0;
      
      console.log('🎬 Initial timer state:', {
        timeLeft,
        shouldStart,
        status: competition.status,
        gameplay_indicator: competition.gameplay_indicator
      });
      
      setIsTimerActive(shouldStart);
      setLastTimerStartedAt(competition.timer_started_at);
      setLastProblemIndex(competition.current_problem_index);
    }
  }, [competitionId, competition, lastTimerStartedAt]);

  // Timer countdown logic
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      console.log('⏰ Starting countdown interval');
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            console.log('⏰ Timer expired!');
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        console.log('⏰ Clearing countdown interval');
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    isTimerActive,
    formattedTime: formatTime(timeRemaining),
    isExpired: timeRemaining === 0 && competition?.status === 'ONGOING'
  };
};