import { useEffect, useRef, useState } from 'react';
import { autoAdvanceCompetition } from '../api/competitions';
import { supabase } from '../lib/supabaseClient';

export const useCompetitionTimer = (competitionId, competition) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const intervalRef = useRef(null);
  const timerChannelRef = useRef(null);

  // Track the current problem index to detect changes
  const [lastProblemIndex, setLastProblemIndex] = useState(null);

  // Calculate time remaining from database values
  const calculateTimeRemaining = (competition) => {
    if (!competition?.timer_started_at || !competition?.timer_duration) {
      return 0;
    }

    const startTime = new Date(competition.timer_started_at).getTime();
    const duration = competition.timer_duration * 1000; // Convert to milliseconds
    const now = Date.now();
    const elapsed = now - startTime;
    const remaining = Math.max(0, duration - elapsed);
    
    return Math.floor(remaining / 1000); // Convert back to seconds
  };

  // IMPORTANT: Restart timer when problem changes
  useEffect(() => {
    const currentProblemIndex = competition?.current_problem_index;
    
    // Check if problem changed
    if (currentProblemIndex !== lastProblemIndex && currentProblemIndex !== null) {
      console.log('🔄 Problem changed! Restarting timer...', {
        oldIndex: lastProblemIndex,
        newIndex: currentProblemIndex
      });
      
      // Clear existing timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Calculate new time remaining
      const newTimeRemaining = calculateTimeRemaining(competition);
      setTimeRemaining(newTimeRemaining);
      
      // Start timer if competition is ongoing and not paused
      const shouldStartTimer = competition?.status === 'ONGOING' && 
                              competition?.gameplay_indicator !== 'PAUSE' &&
                              newTimeRemaining > 0;
      
      setIsTimerActive(shouldStartTimer);
      
      // Update last problem index
      setLastProblemIndex(currentProblemIndex);
    }
  }, [competition?.current_problem_index, competition?.status, competition?.gameplay_indicator]);

  // Start timer synchronization
  useEffect(() => {
    if (!competition || !competitionId) return;

    const timeLeft = calculateTimeRemaining(competition);
    setTimeRemaining(timeLeft);

    const shouldStart = competition.status === 'ONGOING' && 
                       competition.gameplay_indicator !== 'PAUSE' && 
                       timeLeft > 0;
    
    setIsTimerActive(shouldStart);
  }, [competitionId, competition]);

  // Timer countdown logic
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            console.log('⏰ Timer expired!');
            return 0;
          }
          return prev - 1;
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
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining,
    isTimerActive,
    formattedTime: formatTime(timeRemaining),
    isExpired: timeRemaining === 0 && competition?.status === 'ONGOING'
  };
};
