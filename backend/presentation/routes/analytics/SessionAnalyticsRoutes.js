/**
 * Session Analytics Routes
 * API endpoints for session analytics and user statistics
 */

const express = require('express');

class SessionAnalyticsRoutes {
  constructor(controller, authMiddleware) {
    this.controller = controller;
    this.authMiddleware = authMiddleware;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // All routes require authentication
    this.router.use(this.authMiddleware.protect.bind(this.authMiddleware));

    /**
     * @route   GET /api/analytics/summary
     * @desc    Get user's analytics summary (last 30 days by default)
     * @query   days - Number of days to look back (default: 30)
     * @access  Private
     */
    this.router.get(
      '/summary',
      this.controller.getSummary.bind(this.controller)
    );

    /**
     * @route   GET /api/analytics/daily/:userId
     * @desc    Get daily activity for specific user
     * @access  Private (own data or admin)
     */
    this.router.get(
      '/daily/:userId',
      this.controller.getDailyActivity.bind(this.controller)
    );

    /**
     * @route   GET /api/analytics/streak
     * @desc    Get user's login streak
     * @access  Private
     */
    this.router.get(
      '/streak',
      this.controller.getStreak.bind(this.controller)
    );

    /**
     * @route   GET /api/analytics/sessions
     * @desc    Get recent sessions
     * @query   limit - Number of sessions to return (default: 10)
     * @access  Private
     */
    this.router.get(
      '/sessions',
      this.controller.getSessions.bind(this.controller)
    );

    /**
     * @route   GET /api/analytics/weekly
     * @desc    Get weekly activity chart data
     * @access  Private
     */
    this.router.get(
      '/weekly',
      this.controller.getWeeklyActivity.bind(this.controller)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = SessionAnalyticsRoutes;
