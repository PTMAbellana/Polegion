const express = require('express');

/**
 * AdaptiveLearningRoutes
 * API routes for adaptive learning system
 */
class AdaptiveLearningRoutes {
  constructor(adaptiveLearningController, authMiddleware) {
    this.controller = adaptiveLearningController;
    this.authMiddleware = authMiddleware;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Apply authentication to all routes
    this.router.use(this.authMiddleware.protect);

    /**
     * @route   GET /api/adaptive/topics
     * @desc    Get all available adaptive learning topics
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/topics',
      this.controller.getTopics.bind(this.controller)
    );

    /**
     * @route   POST /api/adaptive/submit-answer
     * @desc    Submit answer and get adaptive feedback
     * @access  Private (authenticated students)
     */
    this.router.post(
      '/submit-answer',
      this.controller.submitAnswer.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/questions/:topicId
     * @desc    Get adaptive questions based on student's difficulty
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/questions/:topicId',
      this.controller.getAdaptiveQuestions.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/state/:topicId
     * @desc    Get student's current adaptive learning state
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/state/:topicId',
      this.controller.getStudentState.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/question/:topicId
     * @desc    Generate a new question for the topic
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/question/:topicId',
      this.controller.generateQuestion.bind(this.controller)
    );

    /**
     * @route   POST /api/adaptive/reset/:topicId
     * @desc    Reset difficulty level for a topic
     * @access  Private (authenticated students)
     */
    this.router.post(
      '/reset/:topicId',
      this.controller.resetDifficulty.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/stats
     * @desc    Get research statistics
     * @access  Private (authenticated - for research)
     */
    this.router.get(
      '/stats',
      this.controller.getResearchStats.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/qlearning/stats
     * @desc    Get Q-learning algorithm statistics
     * @access  Private (authenticated - for research)
     */
    this.router.get(
      '/qlearning/stats',
      this.controller.getQLearningStats.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/qlearning/export
     * @desc    Export Q-table for research analysis
     * @access  Private (authenticated - for research)
     */
    this.router.get(
      '/qlearning/export',
      this.controller.exportQTable.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/predict/:topicId
     * @desc    Get AI prediction for next performance
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/predict/:topicId',
      this.controller.getPrediction.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/health
     * @desc    Health check for adaptive system
     * @access  Private
     */
    this.router.get(
      '/health',
      this.controller.healthCheck.bind(this.controller)
    );

    // ================================================================
    // NEW ROUTES FOR TOPIC UNLOCKING & ENHANCED FLOW
    // ================================================================

    /**
     * @route   GET /api/adaptive/topics-with-progress
     * @desc    Get all topics with unlock/mastery status
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/topics-with-progress',
      this.controller.getTopicsWithProgress.bind(this.controller)
    );

    /**
     * @route   POST /api/adaptive/initialize-topics
     * @desc    Initialize topics for new user
     * @access  Private (authenticated students)
     */
    this.router.post(
      '/initialize-topics',
      this.controller.initializeTopics.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/topic-progress/:topicId
     * @desc    Get progress for specific topic
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/topic-progress/:topicId',
      this.controller.getTopicProgress.bind(this.controller)
    );

    /**
     * @route   POST /api/adaptive/generate-ai-question
     * @desc    Generate AI-powered question (difficulty 4-5)
     * @access  Private (authenticated students)
     */
    this.router.post(
      '/generate-ai-question',
      this.controller.generateAIQuestion.bind(this.controller)
    );

    /**
     * @route   POST /api/adaptive/submit-answer-enhanced
     * @desc    Enhanced submit with hint logic and try-again flow
     * @access  Private (authenticated students)
     */
    this.router.post(
      '/submit-answer-enhanced',
      this.controller.submitAnswerEnhanced.bind(this.controller)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AdaptiveLearningRoutes;
