/**
 * MasteryProgressionController
 * 
 * Handles API requests for mastery-based progression system
 * This controller feeds unlock data to WorldMap WITHOUT modifying WorldMap code
 */

class MasteryProgressionController {
  constructor(masteryProgressionService) {
    this.service = masteryProgressionService;
  }

  /**
   * GET /api/mastery/unlocked-chapters/:userId
   * Returns all unlocked chapters for a student
   * WorldMap can call this endpoint to get current unlock states
   */
  async getUnlockedChapters(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      const unlockStates = await this.service.getUnlockedChapters(userId);
      
      return res.status(200).json({
        success: true,
        data: unlockStates
      });
      
    } catch (error) {
      console.error('[MasteryProgressionController] Error getting unlocked chapters:', error);
      return res.status(500).json({
        error: 'Failed to get unlocked chapters',
        details: error.message
      });
    }
  }

  /**
   * POST /api/mastery/validate-access
   * Validates if a student can access a specific chapter
   * Used to prevent URL hacking
   */
  async validateChapterAccess(req, res) {
    try {
      const { userId, chapterId } = req.body;
      
      if (!userId || !chapterId) {
        return res.status(400).json({
          error: 'User ID and Chapter ID are required'
        });
      }

      const validation = await this.service.validateChapterAccess(userId, chapterId);
      
      return res.status(200).json({
        success: true,
        data: validation
      });
      
    } catch (error) {
      console.error('[MasteryProgressionController] Error validating access:', error);
      return res.status(500).json({
        error: 'Failed to validate chapter access',
        details: error.message
      });
    }
  }

  /**
   * GET /api/mastery/analytics/:userId
   * Returns cognitive domain analytics for radar chart
   */
  async getMasteryAnalytics(req, res) {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          error: 'User ID is required'
        });
      }

      const analytics = await this.service.getMasteryAnalytics(userId);
      
      return res.status(200).json({
        success: true,
        data: analytics
      });
      
    } catch (error) {
      console.error('[MasteryProgressionController] Error getting analytics:', error);
      return res.status(500).json({
        error: 'Failed to get mastery analytics',
        details: error.message
      });
    }
  }
}

module.exports = MasteryProgressionController;
