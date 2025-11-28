import { useEffect, useRef, useState } from 'react';
import { autoAdvanceCompetition } from '../api/competitions';
import { supabase } from '../lib/supabaseClient';

export const useCompetitionTimer = (competitionId, competition) => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [formattedTime, setFormattedTime] = useState('00:00');
  const [isExpired, setIsExpired] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const timerChannelRef = useRef(null);

  const [lastProblemIndex, setLastProblemIndex] = useState(null);
  const [lastTimerStartedAt, setLastTimerStartedAt] = useState(null);

  useEffect(() => {
    if (!competition || !competitionId) {
      setTimeRemaining(0);
      setIsTimerActive(false);
      setFormattedTime('00:00');
      setIsExpired(false);
      setIsPaused(false);
      return;
    }

    console.log('⏱️ [Timer] Competition data received:', {
      status: competition.status,
      gameplay_indicator: competition.gameplay_indicator,
      timer_started_at: competition.timer_started_at,
      timer_duration: competition.timer_duration
    });

    const isPausedState = competition.gameplay_indicator === 'PAUSE';
    setIsPaused(isPausedState);

    if (isPausedState) {
      setIsTimerActive(false);
      return;
    }

    if (competition.status !== 'ONGOING') {
      setTimeRemaining(0);
      setIsTimerActive(false);
      setFormattedTime('00:00');
      setIsExpired(false);
      return;
    }

    // ✅ FIXED: Timer calculation with correct duration handling
    const calculateTimeRemaining = () => {
      if (!competition.timer_started_at || !competition.timer_duration) {
        console.log('⏱️ [Timer] Missing timer data:', { 
          timer_started_at: competition.timer_started_at, 
          timer_duration: competition.timer_duration 
        });
        return 0;
      }

      const startTime = new Date(competition.timer_started_at).getTime();
      const currentTime = new Date().getTime();
      const elapsedMs = currentTime - startTime;
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
      
      // ✅ FIXED: timer_duration is already in seconds, don't multiply by 60
      const totalSeconds = competition.timer_duration;
      
      const remaining = Math.max(0, totalSeconds - elapsedSeconds);
      return remaining;
    };

    const remaining = calculateTimeRemaining();
    setTimeRemaining(remaining);
    setIsExpired(remaining <= 0);
    setIsTimerActive(remaining > 0);

    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    setFormattedTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

    if (remaining > 0 && !isPausedState) {
      const interval = setInterval(() => {
        if (competition.gameplay_indicator === 'PAUSE') {
          clearInterval(interval);
          setIsTimerActive(false);
          return;
        }

        const newRemaining = calculateTimeRemaining();
        setTimeRemaining(newRemaining);
        
        // Always update formatted time first
        const newMinutes = Math.floor(newRemaining / 60);
        const newSeconds = newRemaining % 60;
        setFormattedTime(`${newMinutes.toString().padStart(2, '0')}:${newSeconds.toString().padStart(2, '0')}`);
        
        if (newRemaining <= 0) {
          setIsExpired(true);
          setIsTimerActive(false);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }

  }, [
    competition?.status, 
    competition?.gameplay_indicator,
    competition?.timer_started_at, 
    competition?.timer_duration,
    competition?.current_problem_id,
    competitionId
  ]);

  return {
    timeRemaining,
    isTimerActive,
    formattedTime,
    isExpired,
    isPaused
  };
};