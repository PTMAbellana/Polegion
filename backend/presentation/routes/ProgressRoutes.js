const express = require('express');

class ProgressRoutes {
  constructor(progressController, authMiddleware) {
    this.router = express.Router();
    this.progressController = progressController;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @route   GET /api/progress/castle/:castleId
     * @desc    Get castle progress for user
     * @access  Private
     */
    this.router.get('/castle/:castleId',
      this.authMiddleware.protect.bind(this.authMiddleware),
      (req, res) => this.progressController.getCastleProgress(req, res)
    );

    /**
     * @route   GET /api/progress/chapter/:chapterId
     * @desc    Get chapter progress for user
     * @access  Private
     */
    this.router.get('/chapter/:chapterId',
      this.authMiddleware.protect.bind(this.authMiddleware),
      (req, res) => this.progressController.getChapterProgress(req, res)
    );

    /**
     * @route   GET /api/progress/user/:userId
     * @desc    Get all progress for user
     * @access  Private
     */
    this.router.get('/user/:userId',
      this.authMiddleware.protect.bind(this.authMiddleware),
      (req, res) => this.progressController.getUserProgress(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ProgressRoutes;