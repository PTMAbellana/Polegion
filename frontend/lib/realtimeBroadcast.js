import { supabase } from './supabaseClient';

/**
 * Utility functions for broadcasting real-time competition updates
 * Uses Supabase Broadcast (free tier) instead of database replication
 */

export const broadcastCompetitionUpdate = async (competitionId, competitionData) => {
  try {
    console.log('📡 Broadcasting competition update:', competitionId, competitionData);
    
    const channel = supabase.channel(`competition-${competitionId}`);
    
    await channel.send({
      type: 'broadcast',
      event: 'competition_update',
      payload: {
        competition: competitionData,
        timestamp: Date.now()
      }
    });

    console.log('✅ Competition update broadcasted successfully');
    
    // Clean up channel
    supabase.removeChannel(channel);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to broadcast competition update:', error);
    return { success: false, error };
  }
};

export const broadcastTimerUpdate = async (competitionId, competitionData) => {
  try {
    console.log('⏰ Broadcasting timer update:', competitionId, competitionData);
    
    const channel = supabase.channel(`competition-${competitionId}`);
    
    await channel.send({
      type: 'broadcast',
      event: 'timer_update',
      payload: {
        competition: competitionData,
        timestamp: Date.now()
      }
    });

    // Also broadcast to timer-specific channel
    const timerChannel = supabase.channel(`competition-timer-${competitionId}`);
    
    await timerChannel.send({
      type: 'broadcast',
      event: 'timer_update',
      payload: {
        competition: competitionData,
        timestamp: Date.now()
      }
    });

    console.log('✅ Timer update broadcasted successfully');
    
    // Clean up channels
    supabase.removeChannel(channel);
    supabase.removeChannel(timerChannel);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to broadcast timer update:', error);
    return { success: false, error };
  }
};

export const broadcastLeaderboardUpdate = async (competitionId, participants) => {
  try {
    console.log('🏆 Broadcasting leaderboard update:', competitionId, participants?.length);
    
    const channel = supabase.channel(`competition-${competitionId}`);
    
    await channel.send({
      type: 'broadcast',
      event: 'leaderboard_update',
      payload: {
        participants: participants,
        timestamp: Date.now()
      }
    });

    console.log('✅ Leaderboard update broadcasted successfully');
    
    // Clean up channel
    supabase.removeChannel(channel);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to broadcast leaderboard update:', error);
    return { success: false, error };
  }
};

export const broadcastCompetitionStarted = async (competitionId, competitionData) => {
  try {
    console.log('🚀 Broadcasting competition started:', competitionId);
    
    const channel = supabase.channel(`competition-${competitionId}`);
    
    await channel.send({
      type: 'broadcast',
      event: 'competition_started',
      payload: {
        competition: competitionData,
        message: 'Competition has started!',
        timestamp: Date.now()
      }
    });

    console.log('✅ Competition started broadcast sent successfully');
    
    // Clean up channel
    supabase.removeChannel(channel);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to broadcast competition started:', error);
    return { success: false, error };
  }
};

export const broadcastProblemAdvanced = async (competitionId, competitionData) => {
  try {
    console.log('⏭️ Broadcasting problem advanced:', competitionId);
    
    const channel = supabase.channel(`competition-${competitionId}`);
    
    await channel.send({
      type: 'broadcast',
      event: 'problem_advanced',
      payload: {
        competition: competitionData,
        message: 'Advanced to next problem!',
        timestamp: Date.now()
      }
    });

    console.log('✅ Problem advanced broadcast sent successfully');
    
    // Clean up channel
    supabase.removeChannel(channel);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to broadcast problem advanced:', error);
    return { success: false, error };
  }
};

export const broadcastCompetitionCompleted = async (competitionId, competitionData) => {
  try {
    console.log('🏁 Broadcasting competition completed:', competitionId);
    
    const channel = supabase.channel(`competition-${competitionId}`);
    
    await channel.send({
      type: 'broadcast',
      event: 'competition_completed',
      payload: {
        competition: competitionData,
        message: 'Competition completed!',
        timestamp: Date.now()
      }
    });

    console.log('✅ Competition completed broadcast sent successfully');
    
    // Clean up channel
    supabase.removeChannel(channel);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Failed to broadcast competition completed:', error);
    return { success: false, error };
  }
};
