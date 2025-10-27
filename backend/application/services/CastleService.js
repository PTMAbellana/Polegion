class CastleService {
  constructor(castleRepo, progressRepo, chapterRepo) {
    this.castleRepo = castleRepo;
    this.progressRepo = progressRepo;
    this.chapterRepo = chapterRepo;

    // Add logging to debug
    console.log('[CastleService] Initialized with repos:', {
      castleRepo: !!this.castleRepo,
      progressRepo: !!this.progressRepo,
      chapterRepo: !!this.chapterRepo
    });
  }

  /**
   * Get all castles with user progress
   */
  async getCastlesWithProgress(userId) {
    try {
      console.log('[CastleService] Getting castles with progress for user:', userId);

      // Get all castles
      const castles = await this.castleRepo.findAll();
      console.log('[CastleService] Found castles:', castles.length);

      // Check if progressRepo exists
      if (!this.progressRepo) {
        console.error('[CastleService] progressRepo is undefined!');
        throw new Error('ProgressRepo is not initialized');
      }

      // Get user's progress for all castles
      const allProgress = await this.progressRepo.findByUserId(userId);
      console.log('[CastleService] Found progress records:', allProgress.length);

      // Map progress to castles
      const castlesWithProgress = castles.map((castle) => {
        const progress = allProgress.find((p) => p.castle_id === castle.id);

        // If no progress exists, create default unlocked state for first castle
        if (!progress && castle.unlock_order === 1) {
          return {
            ...castle,
            progress: {
              unlocked: true,
              completed: false,
              total_xp_earned: 0,
              completion_percentage: 0
            }
          };
        }

        return {
          ...castle,
          progress: progress || {
            unlocked: false,
            completed: false,
            total_xp_earned: 0,
            completion_percentage: 0
          }
        };
      });

      console.log('[CastleService] Returning castles with progress:', castlesWithProgress.length);
      return castlesWithProgress;
    } catch (error) {
      console.error('[CastleService] Error getting castles with progress:', error);
      throw error;
    }
  }

  /**
   * Get castle by ID with progress
   */
  async getCastleById(castleId, userId) {
    try {
      const castle = await this.castleRepo.findById(castleId);
      
      if (!castle) {
        throw new Error('Castle not found');
      }

      const progress = await this.progressRepo.findByCastleAndUser(castleId, userId);

      return {
        ...castle,
        progress: progress || {
          unlocked: false,
          completed: false,
          total_xp_earned: 0,
          completion_percentage: 0
        }
      };
    } catch (error) {
      console.error('[CastleService] Error getting castle by ID:', error);
      throw error;
    }
  }

  /**
   * Get chapters with progress for a castle
   */
  async getChaptersWithProgress(castleId, userId) {
    try {
      console.log('[CastleService] Getting chapters for castle:', castleId);

      // Get all chapters for the castle
      const chapters = await this.chapterRepo.findByCastleId(castleId);
      console.log('[CastleService] Found chapters:', chapters.length);

      // Get user's chapter progress
      const allProgress = await this.progressRepo.findChapterProgressByUser(userId);
      console.log('[CastleService] Found chapter progress records:', allProgress.length);

      // Map progress to chapters
      const chaptersWithProgress = chapters.map((chapter, index) => {
        const progress = allProgress.find((p) => p.chapter_id === chapter.id);

        // If no progress exists, unlock the first chapter
        if (!progress && index === 0) {
          return {
            ...chapter,
            progress: {
              unlocked: true,
              completed: false,
              xp_earned: 0,
              quiz_passed: false
            }
          };
        }

        return {
          ...chapter,
          progress: progress || {
            unlocked: false,
            completed: false,
            xp_earned: 0,
            quiz_passed: false
          }
        };
      });

      return chaptersWithProgress;
    } catch (error) {
      console.error('[CastleService] Error getting chapters with progress:', error);
      throw error;
    }
  }

  /**
   * Unlock next castle for user
   */
  async unlockNextCastle(userId, currentCastleId) {
    try {
      // Get current castle
      const currentCastle = await this.castleRepo.findById(currentCastleId);
      
      if (!currentCastle) {
        throw new Error('Current castle not found');
      }

      // Get next castle by unlock order
      const nextOrder = currentCastle.unlock_order + 1;
      const allCastles = await this.castleRepo.findAll();
      const nextCastle = allCastles.find((c) => c.unlock_order === nextOrder);

      if (!nextCastle) {
        console.log('[CastleService] No next castle to unlock');
        return null;
      }

      // Unlock the next castle
      const unlockedProgress = await this.progressRepo.unlockCastle(userId, nextCastle.id);
      
      return {
        ...nextCastle,
        progress: unlockedProgress
      };
    } catch (error) {
      console.error('[CastleService] Error unlocking next castle:', error);
      throw error;
    }
  }
}

module.exports = CastleService;