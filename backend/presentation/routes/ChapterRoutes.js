const express = require('express');

class ChapterRoutes {
  constructor(chapterController, authMiddleware) {
    this.router = express.Router();
    this.chapterController = chapterController;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  initializeRoutes() {
    /**
     * @route   POST /api/chapters/:id/complete
     * @desc    Mark chapter as complete
     * @access  Private
     */
    this.router.post('/:id/complete',
      this.authMiddleware.protect.bind(this.authMiddleware),
      (req, res) => this.chapterController.completeChapter(req, res)
    );

    /**
     * @route   POST /api/chapters/:id/quiz
     * @desc    Submit quiz result
     * @access  Private
     */
    this.router.post('/:id/quiz',
      this.authMiddleware.protect.bind(this.authMiddleware),
      (req, res) => this.chapterController.submitQuiz(req, res)
    );

    /**
     * @route   GET /api/chapters/:id
     * @desc    Get chapter by ID
     * @access  Private
     */
    this.router.get('/:id',
      this.authMiddleware.protect.bind(this.authMiddleware),
      (req, res) => this.chapterController.getChapterById(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = ChapterRoutes;