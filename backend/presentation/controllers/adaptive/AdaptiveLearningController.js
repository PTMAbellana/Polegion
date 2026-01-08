/**
 * AdaptiveLearningController
 * Handles HTTP requests for adaptive learning system
 */
class AdaptiveLearningController {
  constructor(adaptiveLearningService) {
    this.service = adaptiveLearningService;
  }

  /**
   * GET /api/adaptive/stuck-students
   * Get students who are stuck on questions (teacher dashboard)
   */
  async getStuckStudents(req, res) {
    try {
      const { minAttempts = 3, minMinutesStuck = 5 } = req.query;
      const stuckStudents = await this.service.repo.getStuckStudents(
        parseInt(minAttempts),
        parseInt(minMinutesStuck)
      );

      return res.status(200).json({
        success: true,
        data: stuckStudents,
        count: stuckStudents.length
      });
    } catch (error) {
      console.error('Error in getStuckStudents:', error);
      return res.status(500).json({
        error: 'Failed to get stuck students',
        message: error.message
      });
    }
  }

  /**
   * GET /api/adaptive/cognitive-performance
   * Get cognitive domain performance for a user (radar chart data)
   */
  async getCognitiveDomainPerformance(req, res) {
    try {
      const userId = req.user.id; // Always use authenticated user's ID
      const performance = await this.service.repo.getCognitiveDomainPerformance(userId);

      return res.status(200).json({
        success: true,
        data: performance
      });
    } catch (error) {
      console.error('Error in getCognitiveDomainPerformance:', error);
      return res.status(500).json({
        error: 'Failed to get cognitive domain performance',
        message: error.message
      });
    }
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
      // Only check req.query for forceNew since this is a GET endpoint (GET requests don't have body)
      const forceNew = req.query.forceNew === 'true';

      if (!topicId) {
        return res.status(400).json({
          error: 'Topic ID is required'
        });
      }

      // Prevent duplicate concurrent requests using a simple in-memory lock
      const requestKey = `${userId}_${topicId}`;
      if (!this.pendingRequests) {
        this.pendingRequests = new Map();
      }
      
      if (this.pendingRequests.has(requestKey)) {
        console.log(`[AdaptiveController] Duplicate request detected for ${requestKey}, waiting for first request...`);
        // Wait for the first request to complete
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      this.pendingRequests.set(requestKey, true);
      
      try {
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
          sessionId,
          [], // excludeQuestionIds
          forceNew // Force new question if requested
        );

        if (!question) {
          console.error('[AdaptiveController] generateQuestion returned null/undefined');
          return res.status(500).json({
            error: 'Failed to generate question',
            message: 'Question generation returned no result'
          });
        }

        console.log('[AdaptiveController] Question generated successfully, sending response');
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
      } finally {
        // Remove lock after request completes
        this.pendingRequests.delete(requestKey);
      }
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
      const inMemoryQTable = this.service.exportQTable();
      const persistedQValues = await this.service.repo.getAllQValues();
      const mode = (process.env.ADAPTIVE_MODE || 'adaptive').toLowerCase();

      return res.status(200).json({
        success: true,
        data: {
          inMemoryQTable,
          persistedQValues,
          cohortMode: mode,
          exportedAt: new Date().toISOString(),
          totalStates: inMemoryQTable.length,
          totalPersisted: persistedQValues.length
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
   * GET /api/adaptive/qlearning/export.csv
   * Export persisted Q-values as CSV
   */
  async exportQValuesCSV(req, res) {
    try {
      const rows = await this.service.repo.getAllQValues();
      const headers = ['state_key','action','q_value','updated_at'];

      // Build CSV content
      const escape = (val) => {
        if (val === null || val === undefined) return '';
        const s = String(val);
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      };

      const csv = [headers.join(',')]
        .concat((rows || []).map(r => [
          escape(r.state_key),
          escape(r.action),
          escape(r.q_value),
          escape(r.updated_at)
        ].join(',')))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="adaptive_q_values.csv"');
      return res.status(200).send(csv);
    } catch (error) {
      console.error('Error in exportQValuesCSV:', error);
      return res.status(500).json({
        error: 'Failed to export Q-values CSV',
        message: error.message
      });
    }
  }

  /**
   * GET /api/adaptive/qlearning/transitions.csv
   * Export adaptive state transitions as CSV for research
   */
  async exportTransitionsCSV(req, res) {
    try {
      const { topicId, userId } = req.query;
      const rows = await this.service.repo.getTransitionsForExport({ topicId, userId });
      const headers = [
        'user_id','topic_id','prev_mastery','prev_difficulty','new_mastery','new_difficulty',
        'action','action_reason','reward','was_correct','time_spent','used_exploration',
        'q_value','epsilon','session_id','question_id'
      ];

      const escape = (val) => {
        if (val === null || val === undefined) return '';
        const s = String(val);
        return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      };

      const csv = [headers.join(',')]
        .concat((rows || []).map(r => [
          escape(r.user_id),
          escape(r.topic_id),
          escape(r.prev_mastery),
          escape(r.prev_difficulty),
          escape(r.new_mastery),
          escape(r.new_difficulty),
          escape(r.action),
          escape(r.action_reason),
          escape(r.reward),
          escape(r.was_correct),
          escape(r.time_spent),
          escape(r.used_exploration),
          escape(r.q_value),
          escape(r.epsilon),
          escape(r.session_id),
          escape(r.question_id)
        ].join(',')))
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="adaptive_state_transitions.csv"');
      return res.status(200).send(csv);
    } catch (error) {
      console.error('Error in exportTransitionsCSV:', error);
      return res.status(500).json({
        error: 'Failed to export transitions CSV',
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
        console.error('[AdaptiveController] Missing topicId or isCorrect:', { topicId, isCorrect });
        return res.status(400).json({
          error: 'Missing required fields: topicId, isCorrect'
        });
      }

      // Validate questionId - don't process if it's null or missing
      if (!questionId) {
        console.error('[AdaptiveController] submitAnswerEnhanced called with null/missing questionId');
        console.error('[AdaptiveController] Request body:', JSON.stringify(req.body, null, 2));
        return res.status(400).json({
          error: 'Missing required field: questionId',
          message: 'Question ID is required to track attempt. Please refresh and try again.'
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
      console.error('Error stack:', error.stack);
      console.error('Request body:', JSON.stringify(req.body, null, 2));
      
      // Differentiate between validation errors (400) and server errors (500)
      const is400Error = error.message && (
        error.message.includes('required') ||
        error.message.includes('invalid') ||
        error.message.includes('missing')
      );
      
      return res.status(is400Error ? 400 : 500).json({
        error: 'Failed to process answer',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  /**
   * Update hint count for a question attempt
   */
  async updateHintCount(req, res) {
    try {
      const { topicId } = req.params;
      const { questionId, hintsRequested } = req.body;
      const userId = req.user?.id;

      if (!userId || !questionId || hintsRequested === undefined) {
        return res.status(400).json({
          error: 'Missing required fields: questionId, hintsRequested'
        });
      }

      // Increment cumulative hint count (persisted per topic)
      const currentState = await this.service.repo.getStudentDifficulty(userId, topicId);
      const currentHints = currentState?.hints_shown_count || 0;
      const newHintTotal = currentHints + 1; // one hint per question (frontend already guards)

      const result = await this.service.repo.updateStudentDifficulty(userId, topicId, {
        hints_shown_count: newHintTotal
      });

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Error updating hint count:', error);
      return res.status(500).json({
        error: 'Failed to update hint count',
        message: error.message
      });
    }
  }

  /**
   * POST /api/adaptive/generate-explanation
   * Generate AI explanation for wrong answer
   */
  async generateWrongAnswerExplanation(req, res) {
    try {
      const { topicId, questionText, correctAnswer, userAnswer, topic } = req.body;

      if (!questionText || !correctAnswer || !userAnswer) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'questionText, correctAnswer, and userAnswer are required'
        });
      }

      // Use AIExplanationService to generate explanation
      const AIExplanationService = require('../../../application/services/adaptive/AIExplanationService');
      const explanationService = new AIExplanationService();

      const explanation = await explanationService.generateExplanation({
        questionText,
        correctAnswer,
        userAnswer,
        isCorrect: false,
        topicName: topic || 'Geometry',
        difficultyLevel: 3,
        options: [] // Not needed for wrong answer explanation
      });

      return res.status(200).json({
        success: true,
        data: {
          explanation
        }
      });
    } catch (error) {
      console.error('Error generating explanation:', error);
      return res.status(500).json({
        error: 'Failed to generate explanation',
        message: error.message
      });
    }
  }
}

module.exports = AdaptiveLearningController;
