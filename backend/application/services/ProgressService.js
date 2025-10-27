class ProgressService {
  constructor(progressRepo, castleRepo, chapterRepo, xpService) {
    this.progressRepo = progressRepo;
    this.castleRepo = castleRepo;
    this.chapterRepo = chapterRepo;
    this.xpService = xpService;
  }

  /**
   * Initialize castle progress for a new user
   * Auto-unlocks first castle (Euclidean Spire)
   */
  async initializeCastleProgress(userId) {
    try {
      console.log('[ProgressService] Initializing castle progress for user:', userId);

      // Check if user already has progress
      const existingProgress = await this.progressRepo.findByUserId(userId);
      
      if (existingProgress.length > 0) {
        console.log('[ProgressService] User already has progress');
        return {
          success: true,
          message: 'Progress already initialized',
          alreadyExists: true,
          data: existingProgress
        };
      }

      // Get all castles ordered by unlock_order
      const castles = await this.castleRepo.findAll();

      if (castles.length === 0) {
        throw new Error('No castles found in database');
      }

      console.log('[ProgressService] Found castles:', castles.length);

      // Create progress for all castles (only first is unlocked)
      const progressRecords = castles.map((castle, index) => ({
        userId,
        castleId: castle.id,
        unlocked: index === 0, // First castle (Euclidean Spire) unlocked
        completed: false,
        totalXpEarned: 0,
        completionPercentage: 0,
        startedAt: index === 0 ? new Date().toISOString() : null
      }));

      const createdProgress = await this.progressRepo.bulkCreateProgress(progressRecords);

      console.log('[ProgressService] Castle progress initialized successfully');

      return {
        success: true,
        message: 'Castle progress initialized successfully',
        castlesInitialized: castles.length,
        data: createdProgress
      };
    } catch (error) {
      console.error('[ProgressService] Error initializing castle progress:', error);
      throw error;
    }
  }

  /**
   * Initialize chapter progress for a castle
   * Auto-unlocks first chapter
   */
  async initializeChapterProgress(userId, castleId) {
    try {
      console.log('[ProgressService] Initializing chapter progress for castle:', castleId);

      // Check if chapters already initialized
      const existingProgress = await this.progressRepo.findChapterProgressByCastle(userId, castleId);
      
      if (existingProgress.length > 0) {
        console.log('[ProgressService] Chapter progress already exists');
        return {
          success: true,
          message: 'Chapter progress already exists',
          alreadyExists: true,
          data: existingProgress
        };
      }

      // Get all chapters for this castle
      const chapters = await this.chapterRepo.findByCastleId(castleId);

      if (chapters.length === 0) {
        return {
          success: true,
          message: 'No chapters to initialize',
          data: []
        };
      }

      console.log('[ProgressService] Found chapters:', chapters.length);

      // Create progress for all chapters (first chapter unlocked)
      const progressRecords = chapters.map((chapter, index) => ({
        userId,
        chapterId: chapter.id,
        unlocked: index === 0, // First chapter unlocked
        completed: false,
        xpEarned: 0,
        quizPassed: false,
        startedAt: index === 0 ? new Date().toISOString() : null
      }));

      const createdProgress = await this.progressRepo.bulkCreateChapterProgress(progressRecords);

      console.log('[ProgressService] Chapter progress initialized successfully');

      return {
        success: true,
        message: 'Chapter progress initialized',
        chaptersInitialized: chapters.length,
        data: createdProgress
      };
    } catch (error) {
      console.error('[ProgressService] Error initializing chapter progress:', error);
      throw error;
    }
  }

  /**
   * Get all castle progress for a user
   */
  async getUserCastleProgress(userId) {
    try {
      const progress = await this.progressRepo.findByUserId(userId);
      return progress.map(p => p.toJSON ? p.toJSON() : p);
    } catch (error) {
      console.error('[ProgressService] Error getting user progress:', error);
      throw error;
    }
  }

  /**
   * Get chapter progress for a castle
   */
  async getChapterProgress(userId, castleId) {
    try {
      const progress = await this.progressRepo.findChapterProgressByCastle(userId, castleId);
      return progress;
    } catch (error) {
      console.error('[ProgressService] Error getting chapter progress:', error);
      throw error;
    }
  }

  /**
   * Update castle progress
   */
  async updateCastleProgress(userId, castleId, updates) {
    try {
      const updatedProgress = await this.progressRepo.updateProgress(userId, castleId, updates);
      return updatedProgress.toJSON ? updatedProgress.toJSON() : updatedProgress;
    } catch (error) {
      console.error('[ProgressService] Error updating castle progress:', error);
      throw error;
    }
  }

  /**
   * Update chapter progress
   */
  async updateChapterProgress(userId, chapterId, updates) {
    try {
      const updatedProgress = await this.progressRepo.updateChapterProgress(userId, chapterId, updates);
      return updatedProgress;
    } catch (error) {
      console.error('[ProgressService] Error updating chapter progress:', error);
      throw error;
    }
  }

  /**
   * Unlock next castle after completing current one
   */
  async unlockNextCastle(userId, currentCastleId) {
    try {
      const currentCastle = await this.castleRepo.findById(currentCastleId);
      const nextCastle = await this.castleRepo.findByUnlockOrder(currentCastle.unlockOrder + 1);

      if (!nextCastle) {
        console.log('[ProgressService] No next castle to unlock');
        return {
          success: true,
          message: 'All castles completed!',
          hasNext: false
        };
      }

      await this.progressRepo.updateProgress(userId, nextCastle.id, {
        unlocked: true,
        startedAt: new Date().toISOString()
      });

      console.log('[ProgressService] Next castle unlocked:', nextCastle.name);

      return {
        success: true,
        message: `${nextCastle.name} unlocked!`,
        hasNext: true,
        nextCastle: nextCastle.toJSON()
      };
    } catch (error) {
      console.error('[ProgressService] Error unlocking next castle:', error);
      throw error;
    }
  }

  /**
   * Unlock next chapter after completing current one
   */
  async unlockNextChapter(userId, currentChapterId) {
    try {
      const currentChapter = await this.chapterRepo.findById(currentChapterId);
      const nextChapter = await this.chapterRepo.findNextChapter(
        currentChapter.castleId,
        currentChapter.chapterNumber
      );

      if (!nextChapter) {
        console.log('[ProgressService] No next chapter to unlock');
        return {
          success: true,
          message: 'All chapters completed!',
          hasNext: false
        };
      }

      await this.progressRepo.updateChapterProgress(userId, nextChapter.id, {
        unlocked: true,
        startedAt: new Date().toISOString()
      });

      console.log('[ProgressService] Next chapter unlocked:', nextChapter.title);

      return {
        success: true,
        message: `${nextChapter.title} unlocked!`,
        hasNext: true,
        nextChapter: nextChapter.toJSON()
      };
    } catch (error) {
      console.error('[ProgressService] Error unlocking next chapter:', error);
      throw error;
    }
  }
}

module.exports = ProgressService;