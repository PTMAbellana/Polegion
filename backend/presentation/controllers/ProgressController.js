class ProgressController {
  constructor(progressService) {
    this.progressService = progressService;
  }

  /**
   * POST /api/progress/castles/initialize
   * Initialize castle progress for a user
   */
  initializeCastleProgress = async (req, res) => {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      console.log('[ProgressController] Initializing castle progress for user:', userId);

      const result = await this.progressService.initializeCastleProgress(userId);

      res.json(result);
    } catch (error) {
      console.error('[ProgressController] Error initializing castle progress:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to initialize castle progress'
      });
    }
  };

  /**
   * POST /api/progress/chapters/initialize
   * Initialize chapter progress for a castle
   */
  initializeChapterProgress = async (req, res) => {
    try {
      const { userId, castleId } = req.body;

      if (!userId || !castleId) {
        return res.status(400).json({
          success: false,
          error: 'User ID and Castle ID are required'
        });
      }

      console.log('[ProgressController] Initializing chapter progress:', { userId, castleId });

      const result = await this.progressService.initializeChapterProgress(userId, castleId);

      res.json(result);
    } catch (error) {
      console.error('[ProgressController] Error initializing chapter progress:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to initialize chapter progress'
      });
    }
  };

  /**
   * GET /api/progress/castles/:userId
   * Get all castle progress for a user
   */
  getUserCastleProgress = async (req, res) => {
    try {
      const { userId } = req.params;

      console.log('[ProgressController] Getting castle progress for user:', userId);

      const progress = await this.progressService.getUserCastleProgress(userId);

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('[ProgressController] Error getting castle progress:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch castle progress'
      });
    }
  };

  /**
   * GET /api/progress/chapters/:castleId/:userId
   * Get chapter progress for a castle
   */
  getChapterProgress = async (req, res) => {
    try {
      const { userId, castleId } = req.params;

      console.log('[ProgressController] Getting chapter progress:', { userId, castleId });

      const progress = await this.progressService.getChapterProgress(userId, castleId);

      res.json({
        success: true,
        data: progress
      });
    } catch (error) {
      console.error('[ProgressController] Error getting chapter progress:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch chapter progress'
      });
    }
  };

  /**
   * PUT /api/progress/castles/:castleId
   * Update castle progress
   */
  updateCastleProgress = async (req, res) => {
    try {
      const { castleId } = req.params;
      const { userId, ...updates } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      console.log('[ProgressController] Updating castle progress:', { userId, castleId, updates });

      const updatedProgress = await this.progressService.updateCastleProgress(userId, castleId, updates);

      res.json({
        success: true,
        data: updatedProgress
      });
    } catch (error) {
      console.error('[ProgressController] Error updating castle progress:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update castle progress'
      });
    }
  };

  /**
   * PUT /api/progress/chapters/:chapterId
   * Update chapter progress
   */
  updateChapterProgress = async (req, res) => {
    try {
      const { chapterId } = req.params;
      const { userId, ...updates } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      console.log('[ProgressController] Updating chapter progress:', { userId, chapterId, updates });

      const updatedProgress = await this.progressService.updateChapterProgress(userId, chapterId, updates);

      res.json({
        success: true,
        data: updatedProgress
      });
    } catch (error) {
      console.error('[ProgressController] Error updating chapter progress:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update chapter progress'
      });
    }
  };

  /**
   * POST /api/progress/castles/:castleId/unlock-next
   * Unlock next castle after completing current one
   */
  unlockNextCastle = async (req, res) => {
    try {
      const { castleId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      console.log('[ProgressController] Unlocking next castle after:', castleId);

      const result = await this.progressService.unlockNextCastle(userId, castleId);

      res.json(result);
    } catch (error) {
      console.error('[ProgressController] Error unlocking next castle:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to unlock next castle'
      });
    }
  };

  /**
   * POST /api/progress/chapters/:chapterId/unlock-next
   * Unlock next chapter after completing current one
   */
  unlockNextChapter = async (req, res) => {
    try {
      const { chapterId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
      }

      console.log('[ProgressController] Unlocking next chapter after:', chapterId);

      const result = await this.progressService.unlockNextChapter(userId, chapterId);

      res.json(result);
    } catch (error) {
      console.error('[ProgressController] Error unlocking next chapter:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to unlock next chapter'
      });
    }
  };

  /**
   * GET /api/progress/overview/:userId
   * Get complete progress overview (castles + chapters)
   */
  getProgressOverview = async (req, res) => {
    try {
      const { userId } = req.params;

      console.log('[ProgressController] Getting progress overview for user:', userId);

      const castleProgress = await this.progressService.getUserCastleProgress(userId);

      // Get chapter progress for each castle
      const overview = await Promise.all(
        castleProgress.map(async (castle) => {
          const chapters = await this.progressService.getChapterProgress(userId, castle.castleId);
          return {
            castle,
            chapters
          };
        })
      );

      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      console.error('[ProgressController] Error getting progress overview:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch progress overview'
      });
    }
  };
}

module.exports = ProgressController;