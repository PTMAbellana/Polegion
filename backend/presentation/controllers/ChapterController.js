class ChapterController {
  constructor(chapterService) {
    this.chapterService = chapterService;
  }

  /**
   * GET /api/castles/:castleId/chapters
   * Get chapters for a castle with progress
   */
  getChaptersWithProgress = async (req, res) => {
    try {
      const { castleId } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      const chapters = await this.chapterService.getChaptersWithProgress(userId, castleId);

      res.json({
        success: true,
        data: chapters
      });
    } catch (error) {
      console.error('[ChapterController] Error getting chapters:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch chapters'
      });
    }
  };

  /**
   * POST /api/castles/:castleId/chapters/initialize
   * Initialize chapter progress
   */
  initializeProgress = async (req, res) => {
    try {
      const { castleId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      const result = await this.chapterService.initializeChapterProgress(userId, castleId);

      res.json(result);
    } catch (error) {
      console.error('[ChapterController] Error initializing chapter progress:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to initialize chapters'
      });
    }
  };

  /**
   * GET /api/chapters/:chapterId
   * Get chapter details
   */
  getChapterDetails = async (req, res) => {
    try {
      const { chapterId } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      const chapter = await this.chapterService.getChapterDetails(userId, chapterId);

      res.json({
        success: true,
        data: chapter
      });
    } catch (error) {
      console.error('[ChapterController] Error getting chapter details:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch chapter'
      });
    }
  };

  /**
   * PUT /api/chapters/:chapterId/complete
   * Complete a chapter
   */
  completeChapter = async (req, res) => {
    try {
      const { chapterId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      const result = await this.chapterService.completeChapter(userId, chapterId);

      res.json(result);
    } catch (error) {
      console.error('[ChapterController] Error completing chapter:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to complete chapter'
      });
    }
  };

  /**
   * PUT /api/chapters/:chapterId/quiz
   * Update quiz status
   */
  updateQuizStatus = async (req, res) => {
    try {
      const { chapterId } = req.params;
      const { userId, passed, xpEarned } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      const result = await this.chapterService.updateQuizStatus(userId, chapterId, passed, xpEarned);

      res.json(result);
    } catch (error) {
      console.error('[ChapterController] Error updating quiz status:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update quiz'
      });
    }
  };
}

module.exports = ChapterController;