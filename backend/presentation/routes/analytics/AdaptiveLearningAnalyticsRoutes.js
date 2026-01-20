/**
 * Adaptive Learning Analytics Routes
 * API endpoints for adaptive learning session tracking and statistics
 */

const express = require('express');

class AdaptiveLearningAnalyticsRoutes {
  constructor(controller, authMiddleware) {
    this.router = express.Router();
    this.controller = controller;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  initializeRoutes() {
    // All routes require authentication
    this.router.use(this.authMiddleware.protect.bind(this.authMiddleware));
    
    console.log('[AdaptiveLearningAnalyticsRoutes] Initializing routes...');

    /**
     * @route   POST /api/adaptive-analytics/session/start
     * @desc    Start a new adaptive learning session
     * @access  Private (authenticated users)
     * @body    { topicId, topicName, startingMastery }
     */
    this.router.post(
      '/session/start',
      this.controller.startSession.bind(this.controller)
    );

    /**
     * @route   PUT /api/adaptive-analytics/session/:sessionId
     * @desc    Update session activity (questions answered)
     * @access  Private (authenticated users)
     * @body    { questionsAttempted, questionsCorrect }
     */
    this.router.put(
      '/session/:sessionId',
      this.controller.updateSession.bind(this.controller)
    );

    /**
     * @route   POST /api/adaptive-analytics/session/:sessionId/end
     * @desc    End an adaptive learning session
     * @access  Private (authenticated users)
     * @body    { endingMastery, questionsAttempted, questionsCorrect, cognitiveDomains }
     */
    this.router.post(
      '/session/:sessionId/end',
      this.controller.endSession.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive-analytics/summary
     * @desc    Get comprehensive statistics summary
     * @access  Private (authenticated users)
     */
    this.router.get(
      '/summary',
      this.controller.getSummary.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive-analytics/simple
     * @desc    Get simple stats from adaptive progress (no sessions required)
     * @access  Private (authenticated users)
     */
    this.router.get(
      '/simple',
      this.controller.getSimpleStats.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive-analytics/weekly
     * @desc    Get weekly activity (last 7 days)
     * @access  Private (authenticated users)
     */
    this.router.get(
      '/weekly',
      this.controller.getWeeklyActivity.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive-analytics/sessions
     * @desc    Get recent sessions
     * @access  Private (authenticated users)
     * @query   limit - Number of sessions to return (default: 5)
     */
    this.router.get(
      '/sessions',
      this.controller.getSessions.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive-analytics/daily
     * @desc    Get daily activity for date range
     * @access  Private (authenticated users)
     * @query   days - Number of days to retrieve (default: 30)
     */
    this.router.get(
      '/daily',
      this.controller.getDailyActivity.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive-analytics/topics
     * @desc    Get topic breakdown (most practiced topics)
     * @access  Private (authenticated users)
     * @query   days - Number of days to analyze (default: 30)
     */
    this.router.get(
      '/topics',
      this.controller.getTopicBreakdown.bind(this.controller)
    );

    /**
     * @route   GET /api/adaptive-analytics/active-session
     * @desc    Get current active session if any
     * @access  Private (authenticated users)
     */
    this.router.get(
      '/active-session',
      this.controller.getActiveSession.bind(this.controller)
    );

    /**
     * @route   POST /api/adaptive-analytics/sync-stats
     * @desc    Force recalculation of user stats (for debugging)
     * @access  Private (authenticated users)
     */
    this.router.post(
      '/sync-stats',
      this.controller.syncStats.bind(this.controller)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = AdaptiveLearningAnalyticsRoutes;
