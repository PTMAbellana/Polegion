class CastleController {
  constructor(castleService) {
    this.castleService = castleService;
  }

  /**
   * Get all castles with user progress
   * GET /api/castles?userId=xxx
   */
  async getCastlesWithProgress(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const castles = await this.castleService.getCastlesWithProgress(userId);

      res.status(200).json({
        success: true,
        data: castles
      });
    } catch (error) {
      console.error('[CastleController] Error getting castles:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch castles'
      });
    }
  }

  /**
   * Get castle by ID with progress
   * GET /api/castles/:id?userId=xxx
   */
  async getCastleById(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const castle = await this.castleService.getCastleById(id, userId);

      res.status(200).json({
        success: true,
        data: castle
      });
    } catch (error) {
      console.error('[CastleController] Error getting castle:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch castle'
      });
    }
  }

  /**
   * Get chapters for a castle with user progress
   * GET /api/castles/:id/chapters?userId=xxx
   */
  async getChaptersWithProgress(req, res) {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const chapters = await this.castleService.getChaptersWithProgress(id, userId);

      res.status(200).json({
        success: true,
        data: chapters
      });
    } catch (error) {
      console.error('[CastleController] Error getting chapters:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch chapters'
      });
    }
  }
}

module.exports = CastleController;