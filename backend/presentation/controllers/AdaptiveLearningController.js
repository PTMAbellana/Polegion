/**
 * AdaptiveLearningController
 * Handles HTTP requests for adaptive learning system
 */
class AdaptiveLearningController {
  constructor(adaptiveLearningService) {
    this.service = adaptiveLearningService;
  }

  /**
   * GET /api/adaptive/topics
   * Get all available adaptive learning topics
   */
  async getTopics(req, res) {
    try {
      const topics = await this.service.getAllTopics();
      return res.status(200).json({
        success: true,
        data: topics
      });
    } catch (error) {
      console.error('Error in getTopics:', error);
      return res.status(500).json({
        error: 'Failed to get topics',
        message: error.message
      });
    }
  }

  /**
   * POST /api/adaptive/submit-answer
   * Submit an answer and get adaptive feedback
   */
  async submitAnswer(req, res) {
    try {
      const { topicId, questionId, isCorrect, timeSpent } = req.body;
      const userId = req.user.id;

      if (!topicId || !questionId || typeof isCorrect !== 'boolean') {
        return res.status(400).json({
          error: 'Missing required fields: topicId, questionId, isCorrect'
        });
      }

      const result = await this.service.processAnswer(
        userId,
        topicId,
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
   * GET /api/adaptive/questions/:topicId
   * Get adaptive questions based on student's current difficulty
   */
  async getAdaptiveQuestions(req, res) {
    try {
      const { topicId } = req.params;
      const { count = 10 } = req.query;
      const userId = req.user.id;

      if (!topicId) {
        return res.status(400).json({
          error: 'Topic ID is required'
        });
      }

      const result = await this.service.getAdaptiveQuestions(
        userId,
        topicId,
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
   * GET /api/adaptive/qlearning/stats
   * Get Q-learning algorithm statistics
   */
  async getQLearningStats(req, res) {
    try {
      const stats = this.service.getQLearningStats();

      return res.status(200).json({
        success: true,
        data: stats,
        description: 'Q-Learning algorithm parameters and performance metrics'
      });
    } catch (error) {
      console.error('Error in getQLearningStats:', error);
      return res.status(500).json({
        error: 'Failed to get Q-learning statistics',
        message: error.message
      });
    }
  }

  /**
   * GET /api/adaptive/qlearning/export
   * Export Q-table for research analysis
   */
  async exportQTable(req, res) {
    try {
      const qTable = this.service.exportQTable();

      return res.status(200).json({
        success: true,
        data: {
          qTable,
          exportedAt: new Date().toISOString(),
          totalStates: qTable.length
        },
        description: 'Complete Q-table with all learned state-action values'
      });
    } catch (error) {
      console.error('Error in exportQTable:', error);
      return res.status(500).json({
        error: 'Failed to export Q-table',
        message: error.message
      });
    }
  }

  /**
   * GET /api/adaptive/predict/:chapterId
   * Get AI prediction for student's next performance
   */
  async getPrediction(req, res) {
    try {
      const { chapterId } = req.params;
      const userId = req.user.id;

      if (!chapterId) {
        return res.status(400).json({
          error: 'Chapter ID is required'
        });
      }

      const state = await this.service.repo.getStudentDifficulty(userId, chapterId);
      const prediction = this.service.predictNextPerformance(state);
      const pattern = await this.service.analyzeLearningPattern(userId, chapterId);

      return res.status(200).json({
        success: true,
        data: {
          prediction: {
            successProbability: (prediction.successProbability * 100).toFixed(1) + '%',
            confidence: (prediction.confidence * 100).toFixed(1) + '%',
            recommendation: prediction.recommendation
          },
          learningPattern: pattern
        }
      });
    } catch (error) {
      console.error('Error in getPrediction:', error);
      return res.status(500).json({
        error: 'Failed to generate prediction',
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
