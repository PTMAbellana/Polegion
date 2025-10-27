class ChapterService {
  constructor(chapterRepo, progressRepo, castleService, xpService) {
    this.chapterRepo = chapterRepo;
    this.progressRepo = progressRepo;
    this.castleService = castleService;
    this.xpService = xpService;
  }

  /**
   * Get chapters for a castle with progress
   */
  async getChaptersWithProgress(userId, castleId) {
    try {
      // Delegate to CastleService which handles auto-initialization
      return await this.castleService.getChaptersForCastle(userId, castleId);
    } catch (error) {
      console.error('[ChapterService] Error getting chapters:', error);
      throw error;
    }
  }

  /**
   * Get specific chapter details
   */
  async getChapterDetails(userId, chapterId) {
    try {
      const chapter = await this.chapterRepo.findById(chapterId);
      const progress = await this.progressRepo.findChapterProgress(userId, chapterId);

      return {
        ...chapter.toJSON(),
        progress: progress || {
          unlocked: false,
          completed: false,
          xp_earned: 0,
          quiz_passed: false
        }
      };
    } catch (error) {
      console.error('[ChapterService] Error getting chapter details:', error);
      throw error;
    }
  }

  /**
   * Complete a chapter and unlock next
   */
  async completeChapter(userId, chapterId) {
    try {
      const chapter = await this.chapterRepo.findById(chapterId);

      // Mark as completed
      await this.progressRepo.updateChapterProgress(userId, chapterId, {
        completed: true,
        completedAt: new Date().toISOString(),
        xpEarned: chapter.xpReward
      });

      // Award XP
      await this.xpService.awardXP(userId, chapter.xpReward, `Completed ${chapter.title}`);

      // Unlock next chapter
      const nextChapter = await this.chapterRepo.findNextChapter(
        chapter.castleId,
        chapter.chapterNumber
      );

      if (nextChapter) {
        await this.progressRepo.updateChapterProgress(userId, nextChapter.id, {
          unlocked: true,
          startedAt: new Date().toISOString()
        });
      }

      // Recalculate castle progress
      await this.castleService.recalculateCastleProgress(userId, chapter.castleId);

      // Check if all chapters completed
      const allChapters = await this.chapterRepo.findByCastleId(chapter.castleId);
      const allProgress = await this.progressRepo.findChapterProgressByCastle(userId, chapter.castleId);
      const allCompleted = allProgress.every(p => p.completed);

      if (allCompleted && allProgress.length === allChapters.length) {
        await this.castleService.completeCastle(userId, chapter.castleId);
      }

      return {
        success: true,
        message: 'Chapter completed successfully',
        xpAwarded: chapter.xpReward,
        nextChapterUnlocked: !!nextChapter,
        castleCompleted: allCompleted
      };
    } catch (error) {
      console.error('[ChapterService] Error completing chapter:', error);
      throw error;
    }
  }

  /**
   * Update quiz status
   */
  async updateQuizStatus(userId, chapterId, passed, xpEarned) {
    try {
      await this.progressRepo.updateChapterProgress(userId, chapterId, {
        quizPassed: passed,
        xpEarned
      });

      if (passed) {
        await this.xpService.awardXP(userId, xpEarned, `Passed chapter quiz`);
      }

      return {
        success: true,
        message: passed ? 'Quiz passed!' : 'Quiz failed',
        xpAwarded: passed ? xpEarned : 0
      };
    } catch (error) {
      console.error('[ChapterService] Error updating quiz status:', error);
      throw error;
    }
  }
}

module.exports = ChapterService;