/**
 * Session Analytics Repository
 * Handles database operations for session tracking and analytics
 */

const supabase = require('../../../config/supabase');

class SessionAnalyticsRepo {
  /**
   * Create new session
   */
  async createSession(userId, deviceInfo = null, ipAddress = null, userAgent = null) {
    try {
      const { data, error } = await supabase
        .from('user_session_analytics')
        .insert({
          user_id: userId,
          session_start: new Date().toISOString(),
          device_info: deviceInfo,
          ip_address: ipAddress,
          user_agent: userAgent
        })
        .select()
        .single();
      
      if (error) throw error;
      console.log(`[SessionAnalytics] ✅ Created session for user ${userId}: ${data.id}`);
      return data;
    } catch (error) {
      console.error('[SessionAnalytics] Error creating session:', error);
      return null;
    }
  }

  /**
   * Update session on activity
   */
  async updateSession(sessionId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_session_analytics')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[SessionAnalytics] Error updating session:', error);
      return null;
    }
  }

  /**
   * End session and calculate duration
   */
  async endSession(sessionId) {
    try {
      const { data: session } = await supabase
        .from('user_session_analytics')
        .select('session_start, user_id')
        .eq('id', sessionId)
        .single();
      
      if (!session) return null;
      
      const sessionEnd = new Date();
      const sessionStart = new Date(session.session_start);
      const durationSeconds = Math.floor((sessionEnd - sessionStart) / 1000);
      
      const { data, error } = await supabase
        .from('user_session_analytics')
        .update({
          session_end: sessionEnd.toISOString(),
          duration_seconds: durationSeconds,
          updated_at: sessionEnd.toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update daily activity with session duration
      const today = sessionEnd.toISOString().split('T')[0];
      await this.recordDailyActivity(session.user_id, today, {
        sessionsCount: 1,
        timeSeconds: durationSeconds
      });
      
      console.log(`[SessionAnalytics] ✅ Ended session ${sessionId}: ${durationSeconds}s`);
      return data;
    } catch (error) {
      console.error('[SessionAnalytics] Error ending session:', error);
      return null;
    }
  }

  /**
   * Increment question count for session
   */
  async incrementQuestionCount(sessionId, isCorrect) {
    try {
      const { data: session } = await supabase
        .from('user_session_analytics')
        .select('questions_attempted, questions_correct')
        .eq('id', sessionId)
        .single();
      
      if (!session) return null;
      
      const { data, error } = await supabase
        .from('user_session_analytics')
        .update({
          questions_attempted: (session.questions_attempted || 0) + 1,
          questions_correct: (session.questions_correct || 0) + (isCorrect ? 1 : 0),
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[SessionAnalytics] Error incrementing question count:', error);
      return null;
    }
  }

  /**
   * Record daily activity (upsert)
   */
  async recordDailyActivity(userId, date, updates) {
    try {
      const { data, error } = await supabase
        .rpc('upsert_daily_activity', {
          p_user_id: userId,
          p_date: date,
          p_sessions_count: updates.sessionsCount || 0,
          p_time_seconds: updates.timeSeconds || 0,
          p_questions_answered: updates.questionsAnswered || 0,
          p_questions_correct: updates.questionsCorrect || 0,
          p_topics: updates.topics || []
        });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[SessionAnalytics] Error recording daily activity:', error);
      return null;
    }
  }

  /**
   * Update login streak
   */
  async updateLoginStreak(userId) {
    try {
      const { data, error } = await supabase
        .rpc('update_login_streak', { p_user_id: userId });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const streak = data[0];
        console.log(`[SessionAnalytics] ✅ Updated streak for ${userId}: ${streak.current_streak} days`);
        return {
          currentStreak: streak.current_streak,
          longestStreak: streak.longest_streak
        };
      }
      
      return null;
    } catch (error) {
      console.error('[SessionAnalytics] Error updating streak:', error);
      return null;
    }
  }

  /**
   * Get user analytics summary
   */
  async getUserAnalyticsSummary(userId, days = 30) {
    try {
      const { data, error } = await supabase
        .from('user_daily_activity')
        .select('*')
        .eq('user_id', userId)
        .order('activity_date', { ascending: false })
        .limit(days);
      
      if (error) throw error;
      
      // Calculate summary
      const summary = {
        totalDays: data.length,
        totalTime: data.reduce((sum, d) => sum + (d.total_time_seconds || 0), 0),
        totalSessions: data.reduce((sum, d) => sum + (d.sessions_count || 0), 0),
        totalQuestions: data.reduce((sum, d) => sum + (d.questions_answered || 0), 0),
        totalCorrect: data.reduce((sum, d) => sum + (d.questions_correct || 0), 0),
        averageTimePerDay: 0,
        accuracyRate: 0,
        recentActivity: data.slice(0, 7)
      };
      
      if (summary.totalDays > 0) {
        summary.averageTimePerDay = Math.floor(summary.totalTime / summary.totalDays);
      }
      
      if (summary.totalQuestions > 0) {
        summary.accuracyRate = parseFloat((summary.totalCorrect / summary.totalQuestions * 100).toFixed(1));
      }
      
      return summary;
    } catch (error) {
      console.error('[SessionAnalytics] Error getting analytics summary:', error);
      return null;
    }
  }

  /**
   * Get user login streak
   */
  async getUserStreak(userId) {
    try {
      const { data, error } = await supabase
        .from('user_login_streak')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('[SessionAnalytics] Error getting user streak:', error);
      return null;
    }
  }

  /**
   * Get recent sessions
   */
  async getRecentSessions(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('user_session_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('session_start', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      // Add computed duration_minutes field
      return data.map(session => ({
        ...session,
        duration_minutes: session.duration_seconds ? Math.round(session.duration_seconds / 60) : 0
      }));
    } catch (error) {
      console.error('[SessionAnalytics] Error getting recent sessions:', error);
      return [];
    }
  }

  /**
   * Get weekly activity chart data
   */
  async getWeeklyActivity(userId) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('user_daily_activity')
        .select('activity_date, total_time_seconds, questions_answered, questions_correct')
        .eq('user_id', userId)
        .gte('activity_date', sevenDaysAgo.toISOString().split('T')[0])
        .order('activity_date', { ascending: true });
      
      if (error) throw error;
      
      // Format data with day names and computed minutes
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return data.map(day => ({
        date: day.activity_date,
        dayName: daysOfWeek[new Date(day.activity_date).getDay()],
        questionsAnswered: day.questions_answered || 0,
        questionsCorrect: day.questions_correct || 0,
        totalTimeMinutes: day.total_time_seconds ? Math.round(day.total_time_seconds / 60) : 0
      }));
    } catch (error) {
      console.error('[SessionAnalytics] Error getting weekly activity:', error);
      return [];
    }
  }
}

module.exports = SessionAnalyticsRepo;
