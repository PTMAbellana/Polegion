/**
 * Adaptive Learning Analytics Repository
 * Handles database operations for adaptive learning session tracking and statistics
 */

class AdaptiveLearningAnalyticsRepo {
  constructor() {
    // Lazy-load supabase to avoid circular dependencies
    this.supabase = null;
  }

  getSupabase() {
    if (!this.supabase) {
      this.supabase = require('../../../config/supabase');
    }
    return this.supabase;
  }
  /**
   * Create a new adaptive learning session
   */
  async createSession(userId, topicId, topicName, startingMastery = 0) {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase
        .from('adaptive_learning_sessions')
        .insert({
          user_id: userId,
          topic_id: topicId,
          topic_name: topicName,
          session_start: new Date().toISOString(),
          starting_mastery_level: startingMastery
        })
        .select()
        .single();
      
      if (error) throw error;
      console.log(`[AdaptiveAnalytics] ✅ Created session for user ${userId}: ${data.id}`);
      return data;
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error creating session:', error);
      throw error;
    }
  }

  /**
   * Update session activity (questions answered)
   */
  async updateSessionActivity(sessionId, questionsAttempted, questionsCorrect) {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase
        .from('adaptive_learning_sessions')
        .update({
          questions_attempted: questionsAttempted,
          questions_correct: questionsCorrect,
          accuracy_percentage: questionsAttempted > 0 
            ? (questionsCorrect / questionsAttempted * 100).toFixed(2)
            : 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error updating session activity:', error);
      throw error;
    }
  }

  /**
   * End a session and calculate final metrics
   */
  async endSession(sessionId, endingMastery, questionsAttempted, questionsCorrect, cognitiveDomains = []) {
    try {
      const supabase = this.getSupabase();
      // Get session start time
      const { data: session } = await supabase
        .from('adaptive_learning_sessions')
        .select('session_start, user_id, topic_name, starting_mastery_level')
        .eq('id', sessionId)
        .single();
      
      if (!session) throw new Error('Session not found');
      
      const sessionEnd = new Date();
      const sessionStart = new Date(session.session_start);
      const durationSeconds = Math.floor((sessionEnd - sessionStart) / 1000);
      
      const masteryGained = endingMastery - session.starting_mastery_level;
      
      // Update session with final data
      const { data, error } = await supabase
        .from('adaptive_learning_sessions')
        .update({
          session_end: sessionEnd.toISOString(),
          duration_seconds: durationSeconds,
          questions_attempted: questionsAttempted,
          questions_correct: questionsCorrect,
          accuracy_percentage: questionsAttempted > 0 
            ? (questionsCorrect / questionsAttempted * 100).toFixed(2)
            : 0,
          ending_mastery_level: endingMastery,
          mastery_gained: masteryGained,
          cognitive_domains_practiced: cognitiveDomains,
          updated_at: sessionEnd.toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      
      console.log(`[AdaptiveAnalytics] ✅ Ended session ${sessionId}: ${durationSeconds}s, ${questionsAttempted} questions`);
      
      // The database trigger will automatically:
      // 1. Update adaptive_daily_activity
      // 2. Update adaptive_user_stats
      // 3. Calculate streaks
      
      return data;
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error ending session:', error);
      throw error;
    }
  }

  /**
   * Get user's adaptive learning statistics
   */
  async getUserStats(userId) {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase
        .from('adaptive_user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
      
      // Return default stats if user has no data yet
      if (!data) {
        return {
          user_id: userId,
          current_streak: 0,
          longest_streak: 0,
          last_activity_date: null,
          total_active_days: 0,
          total_sessions: 0,
          total_time_seconds: 0,
          total_questions_answered: 0,
          total_questions_correct: 0,
          overall_accuracy: 0,
          first_session_date: null
        };
      }
      
      return data;
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Get weekly activity (last 7 days)
   */
  async getWeeklyActivity(userId) {
    try {
      const supabase = this.getSupabase();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // Last 7 days including today
      
      const { data, error } = await supabase
        .from('adaptive_daily_activity')
        .select('*')
        .eq('user_id', userId)
        .gte('activity_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });
      
      if (error) throw error;
      
      // Fill in missing days with zeros
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayData = data.find(d => d.activity_date === dateStr);
        weeklyData.push({
          date: dateStr,
          sessions_count: dayData?.sessions_count || 0,
          total_time_seconds: dayData?.total_time_seconds || 0,
          questions_answered: dayData?.questions_answered || 0,
          questions_correct: dayData?.questions_correct || 0,
          topics_practiced: dayData?.topics_practiced || [],
          unique_topics_count: dayData?.unique_topics_count || 0
        });
      }
      
      return weeklyData;
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error getting weekly activity:', error);
      throw error;
    }
  }

  /**
   * Get recent sessions
   */
  async getRecentSessions(userId, limit = 5) {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase
        .from('adaptive_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .not('session_end', 'is', null) // Only completed sessions
        .order('session_start', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error getting recent sessions:', error);
      throw error;
    }
  }

  /**
   * Get daily activity for a specific date range
   */
  async getDailyActivity(userId, days = 30) {
    try {
      const supabase = this.getSupabase();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('adaptive_daily_activity')
        .select('*')
        .eq('user_id', userId)
        .gte('activity_date', startDate.toISOString().split('T')[0])
        .order('activity_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error getting daily activity:', error);
      throw error;
    }
  }

  /**
   * Get topic breakdown (which topics practiced most)
   */
  async getTopicBreakdown(userId, days = 30) {
    try {
      const supabase = this.getSupabase();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const { data, error } = await supabase
        .from('adaptive_learning_sessions')
        .select('topic_name, questions_attempted, questions_correct, duration_seconds')
        .eq('user_id', userId)
        .gte('session_start', startDate.toISOString())
        .not('session_end', 'is', null);
      
      if (error) throw error;
      
      // Aggregate by topic
      const topicMap = {};
      (data || []).forEach(session => {
        const topic = session.topic_name || 'Unknown';
        if (!topicMap[topic]) {
          topicMap[topic] = {
            topic_name: topic,
            sessions: 0,
            questions_attempted: 0,
            questions_correct: 0,
            total_time_seconds: 0
          };
        }
        topicMap[topic].sessions += 1;
        topicMap[topic].questions_attempted += session.questions_attempted || 0;
        topicMap[topic].questions_correct += session.questions_correct || 0;
        topicMap[topic].total_time_seconds += session.duration_seconds || 0;
      });
      
      // Convert to array and calculate accuracy
      const topics = Object.values(topicMap).map(topic => ({
        ...topic,
        accuracy: topic.questions_attempted > 0
          ? ((topic.questions_correct / topic.questions_attempted) * 100).toFixed(2)
          : 0
      }));
      
      // Sort by sessions (most practiced first)
      topics.sort((a, b) => b.sessions - a.sessions);
      
      return topics;
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error getting topic breakdown:', error);
      throw error;
    }
  }

  /**
   * Force recalculation of user stats (for admin/debugging)
   */
  async syncUserStats(userId) {
    try {
      const supabase = this.getSupabase();
      const { error } = await supabase.rpc('update_adaptive_user_stats', {
        p_user_id: userId
      });
      
      if (error) throw error;
      console.log(`[AdaptiveAnalytics] ✅ Synced stats for user ${userId}`);
      return true;
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error syncing user stats:', error);
      throw error;
    }
  }

  /**
   * Get active session for a user (if any)
   */
  async getActiveSession(userId) {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase
        .from('adaptive_learning_sessions')
        .select('*')
        .eq('user_id', userId)
        .is('session_end', null) // Session not ended yet
        .order('session_start', { ascending: false })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error getting active session:', error);
      return null;
    }
  }

  /**
   * Get simple stats from adaptive state (no sessions required)
   */
  async getSimpleStats(userId) {
    try {
      const supabase = this.getSupabase();
      
      // Get all user's adaptive learning states with timestamps
      const { data: states, error: stateError } = await supabase
        .from('adaptive_learning_state')
        .select('total_attempts, correct_answers, updated_at, created_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      
      if (stateError) throw stateError;
      
      // Default values
      let totalQuestions = 0;
      let totalCorrect = 0;
      let currentStreak = 0;
      let longestStreak = 0;
      let totalActiveDays = 0;
      let totalTime = 0;
      
      // Get questions from adaptive states
      if (states && states.length > 0) {
        states.forEach(state => {
          totalQuestions += state.total_attempts || 0;
          totalCorrect += state.correct_answers || 0;
        });
        
        // Calculate active days from unique dates
        const uniqueDates = new Set();
        states.forEach(state => {
          if (state.updated_at) {
            const date = new Date(state.updated_at).toDateString();
            uniqueDates.add(date);
          }
        });
        totalActiveDays = uniqueDates.size;
        
        // Calculate streak from dates
        const sortedDates = Array.from(uniqueDates)
          .map(d => new Date(d))
          .sort((a, b) => b - a); // Most recent first
        
        if (sortedDates.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const mostRecent = new Date(sortedDates[0]);
          mostRecent.setHours(0, 0, 0, 0);
          
          // Check if most recent activity is today or yesterday
          const daysDiff = Math.floor((today - mostRecent) / (1000 * 60 * 60 * 24));
          
          if (daysDiff <= 1) {
            // Calculate current streak
            currentStreak = 1;
            for (let i = 1; i < sortedDates.length; i++) {
              const prevDate = new Date(sortedDates[i - 1]);
              const currDate = new Date(sortedDates[i]);
              prevDate.setHours(0, 0, 0, 0);
              currDate.setHours(0, 0, 0, 0);
              
              const diff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
              if (diff === 1) {
                currentStreak++;
              } else {
                break;
              }
            }
            longestStreak = Math.max(longestStreak, currentStreak);
          }
          
          // Calculate longest streak ever
          let tempStreak = 1;
          for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);
            prevDate.setHours(0, 0, 0, 0);
            currDate.setHours(0, 0, 0, 0);
            
            const diff = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));
            if (diff === 1) {
              tempStreak++;
              longestStreak = Math.max(longestStreak, tempStreak);
            } else {
              tempStreak = 1;
            }
          }
        }
        
        // Estimate time: ~45 seconds per question on average
        totalTime = totalQuestions * 45;
      }
      
      const overallAccuracy = totalQuestions > 0 
        ? ((totalCorrect / totalQuestions) * 100).toFixed(1)
        : 0;
      
      return {
        totalQuestions,
        totalCorrect,
        overallAccuracy: parseFloat(overallAccuracy),
        totalActiveDays,
        currentStreak,
        longestStreak,
        totalTime
      };
    } catch (error) {
      console.error('[AdaptiveAnalytics] Error getting simple stats:', error);
      throw error;
    }
  }
}

module.exports = AdaptiveLearningAnalyticsRepo;
