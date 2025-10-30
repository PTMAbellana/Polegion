import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export class CompetitionTimer {
  constructor(competitionId) {
    this.competitionId = competitionId;
    this.timerInterval = null;
    this.isRunning = false;
    this.timeRemaining = 0;
    this.channel = null;
  }

  // Start timer for host (broadcasts to all participants)
  startTimer(duration, onTick, onComplete) {
    this.timeRemaining = duration;
    this.isRunning = true;
    
    // Set up broadcast channel
    this.channel = supabase.channel(`timer-${this.competitionId}`);
    
    // Broadcast initial timer state
    this.broadcastTimer();
    
    this.timerInterval = setInterval(() => {
      if (this.isRunning && this.timeRemaining > 0) {
        this.timeRemaining--;
        this.broadcastTimer();
        
        if (onTick) onTick(this.timeRemaining);
        
        if (this.timeRemaining === 0) {
          this.stopTimer();
          if (onComplete) onComplete();
        }
      }
    }, 1000);
  }

  // Pause timer
  pauseTimer() {
    this.isRunning = false;
    this.broadcastTimer();
  }

  // Resume timer
  resumeTimer() {
    this.isRunning = true;
    this.broadcastTimer();
  }

  // Stop timer
  stopTimer() {
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.broadcastTimer();
  }

  // Broadcast timer state to all participants
  broadcastTimer() {
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'timer_update',
        payload: {
          time_remaining: this.timeRemaining,
          is_running: this.isRunning,
          competition_id: this.competitionId,
          timestamp: Date.now()
        }
      });
    }
  }

  // Listen to timer updates (for participants)
  subscribeToTimer(onUpdate) {
    this.channel = supabase
      .channel(`timer-${this.competitionId}`)
      .on('broadcast', { event: 'timer_update' }, (payload) => {
        const { time_remaining, is_running, timestamp } = payload.payload;
        
        // Update local state
        this.timeRemaining = time_remaining;
        this.isRunning = is_running;
        
        if (onUpdate) {
          onUpdate({
            timeRemaining: time_remaining,
            isRunning: is_running,
            timestamp: timestamp
          });
        }
      })
      .subscribe();
  }

  // Clean up
  cleanup() {
    this.stopTimer();
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  // Get formatted time string
  getFormattedTime() {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}
