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
            
            // This is the last chapter - check if castle should be marked as completed and unlock next castle
            console.log(`[UserChapterProgressService] Last chapter completed - checking if all chapters are done`);
            
            // Check if all chapters in this castle are completed
            const allChapterProgress = await Promise.all(
                sortedChapters.map(ch => this.userChapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, ch.id))
            );
            
            const allCompleted = allChapterProgress.every(prog => prog && prog.completed);
            console.log(`[UserChapterProgressService] All chapters completed: ${allCompleted}`);
            
            if (allCompleted && castleProgress) {
                // Mark castle as completed
                await this.userCastleProgressRepo.updateUserCastleProgress(castleProgress.id, {
                    completed: true
                });
                console.log(`[UserChapterProgressService] Castle marked as completed`);
                
                // Get the current castle details
                const CastleRepo = require('../../infrastructure/repository/CastleRepo');
                const castleRepo = new CastleRepo();
                const currentCastle = await castleRepo.getCastleById(currentChapter.castleId);
                
                if (currentCastle && currentCastle.unlockOrder) {
                    // Find the next castle by unlock order
                    const allCastles = await castleRepo.getAllCastles();
                    const nextCastle = allCastles.find(c => c.unlockOrder === currentCastle.unlockOrder + 1);
                    
                    if (nextCastle) {
                        console.log(`[UserChapterProgressService] Found next castle: ${nextCastle.title} (unlock order: ${nextCastle.unlockOrder})`);
                        
                        // Check if user already has progress for next castle
                        let nextCastleProgress = await this.userCastleProgressRepo.getUserCastleProgressByUserAndCastle(userId, nextCastle.id);
                        
                        if (nextCastleProgress) {
                            // Update existing progress to unlock
                            await this.userCastleProgressRepo.updateUserCastleProgress(nextCastleProgress.id, {
                                unlocked: true
                            });
                            console.log(`[UserChapterProgressService] Unlocked next castle: ${nextCastle.title}`);
                        } else {
                            // Create new progress record for next castle
                            await this.userCastleProgressRepo.createUserCastleProgress({
                                user_id: userId,
                                castle_id: nextCastle.id,
                                unlocked: true,
                                completed: false,
                                total_xp_earned: 0
                            });
                            console.log(`[UserChapterProgressService] Created and unlocked next castle: ${nextCastle.title}`);
                        }
                    } else {
                        console.log(`[UserChapterProgressService] No next castle found - this was the final castle`);
                    }
                }
            }
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