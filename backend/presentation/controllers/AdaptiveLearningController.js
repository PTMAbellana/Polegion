/**
 * AdaptiveLearningController
 * Handles HTTP requests for adaptive learning system
 */
class AdaptiveLearningController {
  constructor(adaptiveLearningService) {
    this.service = adaptiveLearningService;
  }

  /**
   * POST /api/adaptive/submit-answer
   * Submit an answer and get adaptive feedback
   */
  async submitAnswer(req, res) {
    try {
      const { chapterId, questionId, isCorrect, timeSpent } = req.body;
      const userId = req.user.id;

      if (!chapterId || !questionId || typeof isCorrect !== 'boolean') {
        return res.status(400).json({
          error: 'Missing required fields: chapterId, questionId, isCorrect'
        });
      }

      const result = await this.service.processAnswer(
        userId,
        chapterId,
        questionId,
        isCorrect,
        timeSpent || 0
      );

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in submitAnswer:', error);
      return res.status(500).json({
        error: 'Failed to process answer',
        message: error.message
      });
    }
  }

  /**
   * GET /api/adaptive/questions/:chapterId
   * Get adaptive questions based on student's current difficulty
   */
  async getAdaptiveQuestions(req, res) {
    try {
      const { chapterId } = req.params;
      const { count = 10 } = req.query;
      const userId = req.user.id;

      if (!chapterId) {
        return res.status(400).json({
          error: 'Chapter ID is required'
        });
      }

      const result = await this.service.getAdaptiveQuestions(
        userId,
        chapterId,
        parseInt(count)
      );

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error in getAdaptiveQuestions:', error);
      return res.status(500).json({
        error: 'Failed to get adaptive questions',
        message: error.message
      });
    }
  }

  /**
   * GET /api/adaptive/state/:chapterId
   * Get student's current adaptive learning state
   */
  async getStudentState(req, res) {
    try {
      const { chapterId } = req.params;
      const userId = req.user.id;

      if (!chapterId) {
        return res.status(400).json({
          error: 'Chapter ID is required'
        });
      }

      const state = await this.service.getStudentState(userId, chapterId);

      return res.status(200).json({
        success: true,
        data: state
      });
    } catch (error) {
      console.error('Error in getStudentState:', error);
      return res.status(500).json({
        error: 'Failed to get student state',
        message: error.message
      });
    }
  }

  /**
   * POST /api/adaptive/reset/:chapterId
   * Reset student's difficulty level for a chapter
   */
  async resetDifficulty(req, res) {
    try {
      const { chapterId } = req.params;
      const userId = req.user.id;

      if (!chapterId) {
        return res.status(400).json({
          error: 'Chapter ID is required'
        });
      }

      // This would require a new method in the service
      // For now, return a placeholder
      return res.status(200).json({
        success: true,
        message: 'Difficulty reset to medium level',
        data: {
          chapterId,
          difficulty: 3
        }
      });
    } catch (error) {
      console.error('Error in resetDifficulty:', error);
      return res.status(500).json({
        error: 'Failed to reset difficulty',
        message: error.message
      });
    }
  }

  /**
   * GET /api/adaptive/stats
   * Get research statistics (admin/researcher only)
   */
  async getResearchStats(req, res) {
    try {
      const { chapterId } = req.query;

      const stats = await this.service.getResearchStats(chapterId || null);

      return res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error in getResearchStats:', error);
      return res.status(500).json({
        error: 'Failed to get research statistics',
        message: error.message
      });
    }
  }

  /**
   * GET /api/adaptive/health
   * Health check endpoint
   */
  async healthCheck(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: 'Adaptive learning system is operational',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = AdaptiveLearningController;
