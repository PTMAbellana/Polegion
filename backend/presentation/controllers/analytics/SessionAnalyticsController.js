/**
 * Session Analytics Controller
 * Handles API requests for session analytics and user statistics
 */

class SessionAnalyticsController {
  constructor(sessionAnalyticsRepo) {
    this.repo = sessionAnalyticsRepo;
  }

  /**
   * GET /api/analytics/summary
   * Get user's analytics summary
   */
  async getSummary(req, res) {
    try {
      const userId = req.user.id;
      const days = parseInt(req.query.days) || 30;
      
      const summary = await this.repo.getUserAnalyticsSummary(userId, days);
      const streak = await this.repo.getUserStreak(userId);
      
      res.json({
        success: true,
        data: {
          ...summary,
          streak: streak || { currentStreak: 0, longestStreak: 0, totalLoginDays: 0 }
        }
      });
    } catch (error) {
      console.error('[AnalyticsController] Error getting summary:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics summary'
      });
    }
  }

  /**
   * GET /api/analytics/daily/:userId
   * Get daily activity for specific user (admin or self)
   */
  async getDailyActivity(req, res) {
    try {
      const { userId } = req.params;
      const requestingUserId = req.user.id;
      
      // Check authorization (user can only view own data unless admin)
      if (userId !== requestingUserId && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to view this data'
        });
      }
      
      const days = parseInt(req.query.days) || 30;
      const summary = await this.repo.getUserAnalyticsSummary(userId, days);
      
      res.json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('[AnalyticsController] Error getting daily activity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get daily activity'
      });
    }
  }

  /**
   * GET /api/analytics/streak
   * Get user's login streak
   */
  async getStreak(req, res) {
    try {
      const userId = req.user.id;
      const streak = await this.repo.getUserStreak(userId);
      
      res.json({
        success: true,
        data: streak || { 
          currentStreak: 0, 
          longestStreak: 0, 
          lastLoginDate: null, 
          totalLoginDays: 0 
        }
      });
    } catch (error) {
      console.error('[AnalyticsController] Error getting streak:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get streak'
      });
    }
  }

  /**
   * GET /api/analytics/sessions
   * Get recent sessions
   */
  async getSessions(req, res) {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit) || 10;
      
      const sessions = await this.repo.getRecentSessions(userId, limit);
      
      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('[AnalyticsController] Error getting sessions:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get sessions'
      });
    }
  }

  /**
   * GET /api/analytics/weekly
   * Get weekly activity chart data
   */
  async getWeeklyActivity(req, res) {
    try {
      const userId = req.user.id;
      const data = await this.repo.getWeeklyActivity(userId);
      
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('[AnalyticsController] Error getting weekly activity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get weekly activity'
      });
    }
  }
}

module.exports = SessionAnalyticsController;
