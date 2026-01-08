/**
 * MasteryProgressionRoutes
 * 
 * API routes for mastery-based progression system
 * These endpoints feed data to WorldMap without modifying WorldMap code
 */

const express = require('express');

class MasteryProgressionRoutes {
  constructor(controller, authMiddleware) {
    this.controller = controller;
    this.authMiddleware = authMiddleware;
    this.router = express.Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Apply authentication middleware to all routes
    this.router.use(this.authMiddleware.protect);

    // Get all unlocked chapters for a student
    // WorldMap calls this to get current unlock states
    this.router.get(
      '/unlocked-chapters/:userId',
      this.controller.getUnlockedChapters.bind(this.controller)
    );

    // Validate chapter access (prevent URL hacking)
    this.router.post(
      '/validate-access',
      this.controller.validateChapterAccess.bind(this.controller)
    );

    // Get mastery analytics for radar chart
    this.router.get(
      '/analytics/:userId',
      this.controller.getMasteryAnalytics.bind(this.controller)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = MasteryProgressionRoutes;
