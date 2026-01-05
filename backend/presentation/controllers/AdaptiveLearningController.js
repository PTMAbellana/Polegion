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
      const { topicId, questionId, isCorrect, timeSpent, questionData } = req.body;
      const userId = req.user.id;

      console.log('[AdaptiveController] submitAnswer called with:', { topicId, questionId, isCorrect, userId });

      if (!topicId || typeof isCorrect !== 'boolean') {
        return res.status(400).json({
          error: 'Missing required fields: topicId, isCorrect'
        });
      }

      const result = await this.service.processAnswer(
        userId,
        topicId,
        questionId,
        isCorrect,
        timeSpent || 0,
        questionData // Pass question data for AI explanation
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
      const { count = 10, representationType = 'text' } = req.query;
      const userId = req.user.id;

      if (!topicId) {
        return res.status(400).json({
          error: 'Topic ID is required'
        });
      }

      const result = await this.service.getAdaptiveQuestions(
        userId,
        topicId,
        parseInt(count),
        null, // targetCognitiveDomain
        representationType // Pass representation type from query
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
   * GET /api/adaptive/state/:topicId
   * Get student's current adaptive learning state
   */
  async getStudentState(req, res) {
    try {
      const { topicId } = req.params;
      const userId = req.user.id;

      if (!topicId) {
        return res.status(400).json({
          error: 'Topic ID is required'
        });
      }

      const state = await this.service.getStudentState(userId, topicId);

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
   * GET /api/adaptive/question/:topicId
   * Generate a new question for the topic based on student's current difficulty
   */
  async generateQuestion(req, res) {
    try {
      const { topicId } = req.params;
      const userId = req.user.id;

      if (!topicId) {
        return res.status(400).json({
          error: 'Topic ID is required'
        });
      }

      // Get current state to determine difficulty
      const state = await this.service.getStudentState(userId, topicId);
      
      // Generate session ID (use crypto.randomUUID for proper UUID format)
      const crypto = require('crypto');
      const sessionId = req.headers['x-session-id'] || crypto.randomUUID();
      
      // Generate question with session tracking (prevents duplicates)
      const question = await this.service.generateQuestion(
        userId,
        topicId,
        state.currentDifficulty,
        sessionId
      );

      return res.status(200).json({
        success: true,
        data: {
          question: question.question_text,
          options: question.options,
          questionId: question.id || question.questionId,
          hint: question.hint,
          difficulty: state.currentDifficulty,
          cognitiveDomain: question.cognitive_domain,
          representationType: question.representation_type || 'text',
          sessionId, // Return session ID to frontend
          metadata: {
            type: question.type,
            parameters: question.parameters,
            generated_at: question.generated_at
          }
        }
      });
    } catch (error) {
      console.error('Error in generateQuestion:', error);
      return res.status(500).json({
        error: 'Failed to generate question',
        message: error.message
      });
    }
  }

  /**
   * POST /api/adaptive/reset/:topicId
   * Reset student's difficulty level for a topic
   */
  async resetDifficulty(req, res) {
    try {
      const { topicId } = req.params;
      const userId = req.user.id;

      if (!topicId) {
        return res.status(400).json({
          error: 'Topic ID is required'
        });
      }

      // This would require a new method in the service
      // For now, return a placeholder
      return res.status(200).json({
        success: true,
        message: 'Difficulty reset to medium level',
        data: {
          topicId,
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
      const { topicId } = req.query;

      const stats = await this.service.getResearchStats(topicId || null);

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
   * GET /api/adaptive/predict/:topicId
   * Get AI prediction for student's next performance
   */
  async getPrediction(req, res) {
    try {
      const { topicId } = req.params;
      const userId = req.user.id;

      if (!topicId) {
        return res.status(400).json({
          error: 'Topic ID is required'
        });
      }

      const state = await this.service.repo.getStudentDifficulty(userId, topicId);
      const prediction = this.service.predictNextPerformance(state);
      const pattern = await this.service.analyzeLearningPattern(userId, topicId);

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

  // ================================================================
  // NEW ENDPOINTS FOR TOPIC UNLOCKING & ENHANCED FLOW
  // ================================================================

  /**
   * GET /api/adaptive/topics-with-progress
   * Get all topics with unlock/mastery status for current user
   */
  async getTopicsWithProgress(req, res) {
    try {
      const userId = req.user.id;
      console.log('[AdaptiveController] getTopicsWithProgress for user:', userId);
      
      const startTime = Date.now();
      
      // Increased timeout to 30 seconds (for new user initialization)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout: topics fetch took too long')), 30000)
      );
      
      const topicsPromise = this.service.getTopicsWithProgress(userId);
      const topics = await Promise.race([topicsPromise, timeoutPromise]);
      
      const elapsed = Date.now() - startTime;
      console.log(`[AdaptiveController] Topics fetched in ${elapsed}ms`);

      return res.status(200).json({
        success: true,
        data: topics
      });
    } catch (error) {
      console.error('Error in getTopicsWithProgress:', error);
      return res.status(500).json({
        error: 'Failed to get topics with progress',
        message: error.message
      });
    }
  }

  /**
   * POST /api/adaptive/initialize-topics
   * Initialize topic progress for a new user (Topic 1 unlocked, rest locked)
   */
  async initializeTopics(req, res) {
    try {
      const userId = req.user.id;
      await this.service.repo.initializeTopicsForUser(userId);

      return res.status(200).json({
        success: true,
        message: 'Topics initialized successfully'
      });
    } catch (error) {
      console.error('Error in initializeTopics:', error);
      return res.status(500).json({
        error: 'Failed to initialize topics',
        message: error.message
      });
    }
  }

  /**
   * GET /api/adaptive/topic-progress/:topicId
   * Get unlock/mastery progress for a specific topic
   */
  async getTopicProgress(req, res) {
    try {
      const { topicId } = req.params;
      const userId = req.user.id;

      const progress = await this.service.repo.getTopicProgress(userId, topicId);

      return res.status(200).json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('Error in getTopicProgress:', error);
      return res.status(500).json({
        error: 'Failed to get topic progress',
        message: error.message
      });
    }
  }

  /**
   * POST /api/adaptive/generate-ai-question
   * Generate AI-powered question for difficulty 4-5
   */
  async generateAIQuestion(req, res) {
    try {
      const { topicId, difficultyLevel, cognitiveDomain } = req.body;
      const userId = req.user.id;

      if (!topicId || !difficultyLevel) {
        return res.status(400).json({
          error: 'topicId and difficultyLevel are required'
        });
      }

      if (difficultyLevel < 4) {
        return res.status(400).json({
          error: 'AI generation only available for difficulty 4-5'
        });
      }

      // Generate session ID
      const sessionId = this.service.generateSessionId(userId);

      const question = await this.service.generateQuestion(
        userId,
        topicId,
        difficultyLevel,
        sessionId
      );

      return res.status(200).json({
        success: true,
        data: question
      });
    } catch (error) {
      console.error('Error in generateAIQuestion:', error);
      return res.status(500).json({
        error: 'Failed to generate AI question',
        message: error.message
      });
    }
  }

  /**
   * POST /api/adaptive/submit-answer-enhanced
   * Enhanced submit answer with hint logic and try-again flow
   */
  async submitAnswerEnhanced(req, res) {
    try {
      const { topicId, questionId, isCorrect, timeSpent, questionData, sessionId } = req.body;
      const userId = req.user.id;

      if (!topicId || typeof isCorrect !== 'boolean') {
        return res.status(400).json({
          error: 'Missing required fields: topicId, isCorrect'
        });
      }

      // Generate session ID if not provided
      const actualSessionId = sessionId || this.service.generateSessionId(userId);

      // Track attempt and check hint status
      const attemptInfo = await this.service.trackAttemptAndCheckHint(
        userId,
        questionId,
        topicId,
        actualSessionId,
        isCorrect,
        questionData
      );

      // Process answer (updates Q-learning, difficulty, mastery)
      const result = await this.service.processAnswer(
        userId,
        topicId,
        questionId,
        isCorrect,
        timeSpent || 0,
        questionData
      );

      // Check for topic unlock
      const masteryLevel = this.service.getMasteryLevel(result.masteryLevel);
      const unlockResult = await this.service.checkAndUnlockNextTopic(
        userId,
        topicId,
        masteryLevel
      );

      // Prepare response
      const response = {
        ...result,
        attemptCount: attemptInfo.attemptCount,
        showHint: attemptInfo.showHint && result.aiHint,
        hint: attemptInfo.showHint ? result.aiHint : null,
        keepQuestion: attemptInfo.keepQuestion,
        generateSimilar: attemptInfo.generateSimilar
      };

      // Add unlock notification if applicable
      if (unlockResult && unlockResult.unlocked) {
        response.topicUnlocked = unlockResult;
      }

      // Add mastery celebration if reached level 5
      if (masteryLevel >= 5) {
        response.masteryAchieved = {
          level: 5,
          message: '🎉 Congratulations! You\'ve mastered this topic!',
          celebration: 'confetti'
        };
      }

      return res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      console.error('Error in submitAnswerEnhanced:', error);
      return res.status(500).json({
        error: 'Failed to process answer',
        message: error.message
      });
    }
  }
}

module.exports = AdaptiveLearningController;
