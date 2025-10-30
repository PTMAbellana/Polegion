const cache = require('../cache');
const userChapterProgressModel = require('../../domain/models/UserChapterProgress');

class UserChapterProgressService {
    constructor(userChapterProgressRepo, chapterRepo, userCastleProgressRepo, userMinigameAttemptRepo, userQuizAttemptRepo) {
        this.userChapterProgressRepo = userChapterProgressRepo;
        this.chapterRepo = chapterRepo;
        this.userCastleProgressRepo = userCastleProgressRepo;
        this.userMinigameAttemptRepo = userMinigameAttemptRepo;
        this.userQuizAttemptRepo = userQuizAttemptRepo;
        this.CACHE_TTL = 10 * 60 * 1000;
    }

    _invalidateUserChapterProgressCache(progressId = null) {
        if (progressId) {
            cache.delete(cache.generateKey('user_chapter_progress', progressId));
        }
        cache.delete(cache.generateKey('all_user_chapter_progress'));
    }

    async createUserChapterProgress(data) {
        // Example: use this.chapterService if needed for business logic
        const result = await this.userChapterProgressRepo.createUserChapterProgress(data);
        this._invalidateUserChapterProgressCache();
        return result;
    }

    async getUserChapterProgressById(progressId) {
        const cacheKey = cache.generateKey('user_chapter_progress', progressId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const progress = await this.userChapterProgressRepo.getUserChapterProgressById(progressId);
        cache.set(cacheKey, progress);
        return progress;
    }

    async getAllUserChapterProgress() {
        const cacheKey = cache.generateKey('all_user_chapter_progress');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const progresses = await this.userChapterProgressRepo.getAllUserChapterProgress();
        cache.set(cacheKey, progresses);
        return progresses;
    }

    async awardChapterXP(userId, chapterId, xpAmount) {
        // Get or create user chapter progress
        let progress = await this.userChapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, chapterId);
        
        if (!progress) {
            // Create new progress record
            progress = await this.userChapterProgressRepo.createUserChapterProgress({
                user_id: userId,
                chapter_id: chapterId,
                xp_earned: xpAmount,
                is_completed: false
            });
        } else {
            // Update existing progress
            const newXP = (progress.xp_earned || 0) + xpAmount;
            progress = await this.userChapterProgressRepo.updateUserChapterProgress(progress.id, {
                xp_earned: newXP
            });
        }
        
        this._invalidateUserChapterProgressCache(progress?.id);
        return progress;
    }

    async markChapterCompleted(userId, chapterId) {
        // Get or create user chapter progress
        let progress = await this.userChapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, chapterId);
        
        if (!progress) {
            throw new Error('Chapter progress not found');
        }
        
        // Calculate total XP earned from attempts
        let totalXP = 0;
        
        // 1. Get the chapter details to find associated quizzes and minigames
        const currentChapter = await this.chapterRepo.getChapterById(chapterId);
        if (!currentChapter) {
            throw new Error('Chapter not found');
        }
        
        // 2. Lesson XP (always awarded when chapter is completed)
        const lessonXP = 20; // Fixed lesson XP
        totalXP += lessonXP;
        
        // 3. Get highest minigame XP for this chapter
        if (this.userMinigameAttemptRepo) {
            const { data: minigameAttempts } = await this.userMinigameAttemptRepo.supabase
                .from('user_minigame_attempts')
                .select('*, minigames!inner(chapter_id)')
                .eq('user_id', userId)
                .eq('minigames.chapter_id', chapterId)
                .order('xp_earned', { ascending: false })
                .limit(1);
            
            if (minigameAttempts && minigameAttempts.length > 0) {
                const highestMinigameXP = minigameAttempts[0].xp_earned || 0;
                totalXP += highestMinigameXP;
                console.log(`[UserChapterProgressService] Highest minigame XP: ${highestMinigameXP}`);
            }
        }
        
        // 4. Get highest quiz XP for this chapter
        if (this.userQuizAttemptRepo) {
            const { data: quizAttempts } = await this.userQuizAttemptRepo.supabase
                .from('user_quiz_attempts')
                .select('*, chapter_quizzes!inner(chapter_id)')
                .eq('user_id', userId)
                .eq('chapter_quizzes.chapter_id', chapterId)
                .order('xp_earned', { ascending: false })
                .limit(1);
            
            if (quizAttempts && quizAttempts.length > 0) {
                const highestQuizXP = quizAttempts[0].xp_earned || 0;
                totalXP += highestQuizXP;
                console.log(`[UserChapterProgressService] Highest quiz XP: ${highestQuizXP}`);
            }
        }
        
        console.log(`[UserChapterProgressService] Total XP for chapter: ${totalXP} (Lesson: ${lessonXP} + Minigame + Quiz)`);
        
        // Mark as completed with calculated XP
        progress = await this.userChapterProgressRepo.updateUserChapterProgress(progress.id, {
            completed: true,
            lesson_completed: true,
            minigame_completed: true,
            quiz_completed: true,
            xp_earned: totalXP
        });
        
        // Update castle progress XP
        const castleProgress = await this.userCastleProgressRepo.getUserCastleProgressByUserAndCastle(userId, currentChapter.castleId);
        if (castleProgress) {
            const newXP = (castleProgress.total_xp_earned || 0) + totalXP;
            console.log(`[UserChapterProgressService] Updating castle XP: ${castleProgress.total_xp_earned} + ${totalXP} = ${newXP}`);
            await this.userCastleProgressRepo.updateUserCastleProgress(castleProgress.id, {
                total_xp_earned: newXP
            });
        }
        
        // Unlock next chapter
        const allChapters = await this.chapterRepo.getChaptersByCastleId(currentChapter.castleId);
        const sortedChapters = allChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
        const currentIndex = sortedChapters.findIndex(ch => ch.id === chapterId);
        
        console.log(`[UserChapterProgressService] Current chapter index: ${currentIndex}, Total chapters: ${sortedChapters.length}`);
        
        if (currentIndex !== -1 && currentIndex < sortedChapters.length - 1) {
            const nextChapter = sortedChapters[currentIndex + 1];
            console.log(`[UserChapterProgressService] Unlocking next chapter: ${nextChapter.title}`);
            const nextProgress = await this.userChapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, nextChapter.id);
            
            if (nextProgress) {
                await this.userChapterProgressRepo.updateUserChapterProgress(nextProgress.id, {
                    unlocked: true
                });
                console.log(`[UserChapterProgressService] Updated existing progress for chapter ${nextChapter.chapter_number}`);
            } else {
                await this.userChapterProgressRepo.createUserChapterProgress({
                    user_id: userId,
                    chapter_id: nextChapter.id,
                    unlocked: true,
                    completed: false
                });
                console.log(`[UserChapterProgressService] Created new progress for chapter ${nextChapter.chapter_number}`);
            }
        } else {
            console.log(`[UserChapterProgressService] No next chapter to unlock (last chapter or not found)`);
        }
        
        this._invalidateUserChapterProgressCache(progress?.id);
        return progress;
    }

    async updateUserChapterProgress(progressId, data) {
        const result = await this.userChapterProgressRepo.updateUserChapterProgress(progressId, data);
        this._invalidateUserChapterProgressCache(progressId);
        return result;
    }

    async deleteUserChapterProgress(progressId) {
        const result = await this.userChapterProgressRepo.deleteUserChapterProgress(progressId);
        this._invalidateUserChapterProgressCache(progressId);
        return result;
    }
}

module.exports = UserChapterProgressService;