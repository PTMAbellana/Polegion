/**
 * Adaptive Learning Analytics Controller
 * Handles API requests for adaptive learning session tracking and statistics
 */

class AdaptiveLearningAnalyticsController {
  constructor(repo) {
    this.repo = repo;
    console.log('[AdaptiveLearningAnalyticsController] Controller initialized');
  }

  /**
   * POST /api/adaptive-analytics/session/start
   * Start a new adaptive learning session
   */
  async startSession(req, res) {
    try {
      const userId = req.user.id;
      const { topicId, topicName, startingMastery } = req.body;
      
      if (!topicId || !topicName) {
        return res.status(400).json({
          success: false,
          message: 'Topic ID and name are required'
        });
      }
      
      // Check if there's already an active session
      const activeSession = await this.repo.getActiveSession(userId);
      if (activeSession) {
        console.log('[AdaptiveAnalytics] User already has active session, returning existing');
        return res.status(200).json({
          success: true,
          data: activeSession,
          message: 'Active session already exists'
        });
      }
      
      const session = await this.repo.createSession(
        userId,
        topicId,
        topicName,
        startingMastery || 0
      );
      
      res.status(201).json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error starting session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start session'
      });
    }
  }

  /**
   * PUT /api/adaptive-analytics/session/:sessionId
   * Update session activity (questions answered)
   */
  async updateSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { questionsAttempted, questionsCorrect } = req.body;
      
      const session = await this.repo.updateSessionActivity(
        sessionId,
        questionsAttempted,
        questionsCorrect
      );
      
      res.json({
        success: true,
        data: session
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error updating session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update session'
      });
    }
  }

  /**
   * POST /api/adaptive-analytics/session/:sessionId/end
   * End a session
   */
  async endSession(req, res) {
    try {
      const { sessionId } = req.params;
      const { endingMastery, questionsAttempted, questionsCorrect, cognitiveDomains } = req.body;
      
      const session = await this.repo.endSession(
        sessionId,
        endingMastery || 0,
        questionsAttempted || 0,
        questionsCorrect || 0,
        cognitiveDomains || []
      );
      
      res.json({
        success: true,
        data: session,
        message: 'Session ended successfully'
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error ending session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to end session'
      });
    }
  }

  /**
   * GET /api/adaptive-analytics/summary
   * Get comprehensive statistics summary
   */
  async getSummary(req, res) {
    try {
      const userId = req.user.id;
      
      const stats = await this.repo.getUserStats(userId);
      
      res.json({
        success: true,
        data: {
          currentStreak: stats.current_streak,
          longestStreak: stats.longest_streak,
          totalActiveDays: stats.total_active_days,
          totalSessions: stats.total_sessions,
          totalTime: stats.total_time_seconds,
          totalQuestions: stats.total_questions_answered,
          totalCorrect: stats.total_questions_correct,
          overallAccuracy: parseFloat(stats.overall_accuracy || 0),
          firstSessionDate: stats.first_session_date,
          lastActivityDate: stats.last_activity_date
        }
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error getting summary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics summary'
      });
    }
  }

  /**
   * GET /api/adaptive-analytics/simple
   * Get simple stats from adaptive progress (no sessions required)
   */
  async getSimpleStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await this.repo.getSimpleStats(userId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error getting simple stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get statistics'
      });
    }
  }

  /**
   * GET /api/adaptive-analytics/weekly
   * Get weekly activity (last 7 days)
   */
  async getWeeklyActivity(req, res) {
    try {
      const userId = req.user.id;
      const weeklyData = await this.repo.getWeeklyActivity(userId);
      
      res.json({
        success: true,
        data: weeklyData
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error getting weekly activity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get weekly activity'
      });
    }
  }

  /**
   * GET /api/adaptive-analytics/sessions
   * Get recent sessions
   */
  async getSessions(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 5;
      
      const sessions = await this.repo.getRecentSessions(userId, limit);
      
      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error getting sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get sessions'
      });
    }
  }

  /**
   * GET /api/adaptive-analytics/daily
   * Get daily activity for date range
   */
  async getDailyActivity(req, res) {
    try {
      const userId = req.user.id;
      const days = parseInt(req.query.days) || 30;
      
      const dailyData = await this.repo.getDailyActivity(userId, days);
      
      res.json({
        success: true,
        data: dailyData
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error getting daily activity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get daily activity'
      });
    }
  }

  /**
   * GET /api/adaptive-analytics/topics
   * Get topic breakdown
   */
  async getTopicBreakdown(req, res) {
    try {
      const userId = req.user.id;
      const days = parseInt(req.query.days) || 30;
      
      const topics = await this.repo.getTopicBreakdown(userId, days);
      
      res.json({
        success: true,
        data: topics
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error getting topic breakdown:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get topic breakdown'
      });
    }
  }

  /**
   * GET /api/adaptive-analytics/active-session
   * Get current active session if any
   */
  async getActiveSession(req, res) {
    try {
      console.log('[AdaptiveAnalyticsController] getActiveSession called, user:', req.user?.id);
      const userId = req.user.id;
      const session = await this.repo.getActiveSession(userId);
      
      res.json({
        success: true,
        data: session,
        hasActiveSession: !!session
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error getting active session:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get active session'
      });
    }
  }

  /**
   * POST /api/adaptive-analytics/sync-stats
   * Force recalculation of user stats (for debugging)
   */
  async syncStats(req, res) {
    try {
      const userId = req.user.id;
      await this.repo.syncUserStats(userId);
      
      const stats = await this.repo.getUserStats(userId);
      
      res.json({
        success: true,
        data: stats,
        message: 'Stats synchronized successfully'
      });
    } catch (error) {
      console.error('[AdaptiveAnalyticsController] Error syncing stats:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to sync stats'
      });
    }
  }
}

module.exports = AdaptiveLearningAnalyticsController;
