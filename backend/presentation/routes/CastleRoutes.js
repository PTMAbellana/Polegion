const express = require('express');

class CastleRoutes {
  constructor(castleController, authMiddleware) {
    this.router = express.Router();
    this.castleController = castleController;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @route   GET /api/castles
     * @desc    Get all castles with user progress
     * @access  Private
     */
    this.router.get('/',
      this.authMiddleware.protect.bind(this.authMiddleware),
      (req, res) => this.castleController.getCastlesWithProgress(req, res)
    );

    /**
     * @route   GET /api/castles/:id
     * @desc    Get castle by ID with progress
     * @access  Private
     */
    this.router.get('/:id',
      this.authMiddleware.protect.bind(this.authMiddleware),
      (req, res) => this.castleController.getCastleById(req, res)
    );

    /**
     * @route   GET /api/castles/:id/chapters
     * @desc    Get chapters for a castle with user progress
     * @access  Private
     */
    this.router.get('/:id/chapters',
      this.authMiddleware.protect.bind(this.authMiddleware),
      (req, res) => this.castleController.getChaptersWithProgress(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = CastleRoutes;