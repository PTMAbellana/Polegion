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
     * @route   POST /api/adaptive/submit-answer
     * @desc    Submit answer and get adaptive feedback
     * @access  Private (authenticated students)
     */
    this.router.post(
      '/submit-answer',
      this.controller.submitAnswer.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/questions/:chapterId
     * @desc    Get adaptive questions based on student's difficulty
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/questions/:chapterId',
      this.controller.getAdaptiveQuestions.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive/state/:chapterId
     * @desc    Get student's current adaptive learning state
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/state/:chapterId',
      this.controller.getStudentState.bind(this.controller)
    );

    /**
     * @route   POST /api/adaptive/reset/:chapterId
     * @desc    Reset difficulty level for a chapter
     * @access  Private (authenticated students)
     */
    this.router.post(
      '/reset/:chapterId',
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
     * @route   GET /api/adaptive/predict/:chapterId
     * @desc    Get AI prediction for next performance
     * @access  Private (authenticated students)
     */
    this.router.get(
      '/predict/:chapterId',
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
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AdaptiveLearningRoutes;
