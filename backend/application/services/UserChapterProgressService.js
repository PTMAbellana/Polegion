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
            // Create new progress record with 0 XP
            // XP will be calculated correctly when markChapterCompleted is called
            progress = await this.userChapterProgressRepo.createUserChapterProgress({
                user_id: userId,
                chapter_id: chapterId,
                xp_earned: 0,
                is_completed: false
            });
            console.log(`[UserChapterProgressService] Created new chapter progress for user ${userId}, chapter ${chapterId}`);
        } else {
            // Progress already exists - DON'T modify xp_earned
            // The XP will be recalculated correctly by markChapterCompleted
            console.log(`[UserChapterProgressService] Chapter progress already exists - XP will be recalculated on completion`);
        }
        
        this._invalidateUserChapterProgressCache(progress?.id);
        return progress;
    }

    async recalculateChapterXP(userId, chapterId) {
        // Calculate total XP from lesson, minigame, and quiz
        let totalXP = 0;
        let quizPassed = false;
        
        // 1. Get the chapter details
        const currentChapter = await this.chapterRepo.getChapterById(chapterId);
        if (!currentChapter) {
            throw new Error('Chapter not found');
        }
        
        // 2. Get minigame and quiz XP rewards to calculate lesson XP
        // Lesson XP = Total Chapter XP - Sum of All Minigame Rewards - Sum of All Quiz Rewards
        let minigameReward = 0;
        let quizReward = 0;
        
        // Get all minigame rewards for this chapter
        const { data: minigames, error: minigameError } = await this.userMinigameAttemptRepo.supabase
            .from('minigames')
            .select('xp_reward')
            .eq('chapter_id', chapterId);
        
        if (minigameError) {
            console.error('[UserChapterProgressService] Error fetching minigames:', minigameError);
        }
        
        if (minigames && minigames.length > 0) {
            minigameReward = minigames.reduce((sum, m) => sum + (m.xp_reward || 0), 0);
            console.log(`[UserChapterProgressService] Found ${minigames.length} minigames, total reward: ${minigameReward}`);
        } else {
            console.log(`[UserChapterProgressService] No minigames found for chapter ${chapterId}`);
        }
        
        // Get all quiz rewards for this chapter
        const { data: quizzes, error: quizError } = await this.userQuizAttemptRepo.supabase
            .from('chapter_quizzes')
            .select('xp_reward')
            .eq('chapter_id', chapterId);
        
        if (quizError) {
            console.error('[UserChapterProgressService] Error fetching quizzes:', quizError);
        }
        
        if (quizzes && quizzes.length > 0) {
            quizReward = quizzes.reduce((sum, q) => sum + (q.xp_reward || 0), 0);
            console.log(`[UserChapterProgressService] Found ${quizzes.length} quizzes, total reward: ${quizReward}`);
        } else {
            console.log(`[UserChapterProgressService] No quizzes found for chapter ${chapterId}`);
        }
        
        // Calculate lesson XP
        const lessonXP = (currentChapter.xpReward || 0) - minigameReward - quizReward;
        totalXP += lessonXP;
        console.log(`[UserChapterProgressService] Lesson XP: ${lessonXP} (Total: ${currentChapter.xpReward} - Minigame: ${minigameReward} - Quiz: ${quizReward})`);
        
        // 3. Get highest minigame XP for this chapter
        if (this.userMinigameAttemptRepo) {
            const { data: minigameAttempts, error: minigameAttemptError } = await this.userMinigameAttemptRepo.supabase
                .from('user_minigame_attempts')
                .select('xp_earned, minigames!inner(chapter_id)')
                .eq('user_id', userId)
                .eq('minigames.chapter_id', chapterId)
                .order('xp_earned', { ascending: false })
                .limit(1);
            
            if (minigameAttemptError) {
                console.error('[UserChapterProgressService] Error fetching minigame attempts:', minigameAttemptError);
            }
            
            if (minigameAttempts && minigameAttempts.length > 0) {
                const highestMinigameXP = minigameAttempts[0].xp_earned || 0;
                totalXP += highestMinigameXP;
                console.log(`[UserChapterProgressService] Highest minigame XP: ${highestMinigameXP}`);
            } else {
                console.log(`[UserChapterProgressService] No minigame attempts found for user ${userId}, chapter ${chapterId}`);
            }
        }
        
        // 4. Get highest quiz XP for this chapter
        if (this.userQuizAttemptRepo) {
            const { data: quizAttempts, error: quizAttemptError } = await this.userQuizAttemptRepo.supabase
                .from('user_quiz_attempts')
                .select('xp_earned, passed, chapter_quizzes!inner(chapter_id)')
                .eq('user_id', userId)
                .eq('chapter_quizzes.chapter_id', chapterId)
                .order('xp_earned', { ascending: false })
                .limit(1);
            
            if (quizAttemptError) {
                console.error('[UserChapterProgressService] Error fetching quiz attempts:', quizAttemptError);
            }
            
            if (quizAttempts && quizAttempts.length > 0) {
                const highestQuizXP = quizAttempts[0].xp_earned || 0;
                quizPassed = quizAttempts[0].passed || false;
                totalXP += highestQuizXP;
                console.log(`[UserChapterProgressService] Highest quiz XP: ${highestQuizXP}, Passed: ${quizPassed}`);
            } else {
                console.log(`[UserChapterProgressService] No quiz attempts found for user ${userId}, chapter ${chapterId}`);
            }
        }
        
        console.log(`[UserChapterProgressService] Total XP for chapter ${chapterId}: ${totalXP}`);
        return { totalXP, quizPassed };
    }

    async markChapterCompleted(userId, chapterId) {
        // Get or create user chapter progress
        let progress = await this.userChapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, chapterId);
        
        if (!progress) {
            throw new Error('Chapter progress not found');
        }
        
        // Recalculate XP from highest attempts
        const { totalXP, quizPassed } = await this.recalculateChapterXP(userId, chapterId);
        
        // Get the chapter details for castle information
        const currentChapter = await this.chapterRepo.getChapterById(chapterId);
        if (!currentChapter) {
            throw new Error('Chapter not found');
        }
        
        // Mark as completed with calculated XP and quiz status
        progress = await this.userChapterProgressRepo.updateUserChapterProgress(progress.id, {
            completed: true,
            lesson_completed: true,
            minigame_completed: true,
            quiz_completed: true,
            quiz_passed: quizPassed,
            xp_earned: totalXP
        });
        
        // Update castle progress XP by recalculating from all chapters
        const castleProgress = await this.userCastleProgressRepo.getUserCastleProgressByUserAndCastle(userId, currentChapter.castleId);
        if (castleProgress) {
            // Get all chapter progress for this castle to recalculate total XP
            const { data: allChapterProgress, error } = await this.userChapterProgressRepo.supabase
                .from('user_chapter_progress')
                .select('*, chapters!inner(castle_id)')
                .eq('user_id', userId)
                .eq('chapters.castle_id', currentChapter.castleId);
            
            if (error) {
                console.error('[UserChapterProgressService] Error fetching chapter progress:', error);
            }
            
            // Calculate total XP from all completed chapters in this castle
            const totalCastleXP = allChapterProgress?.reduce((sum, progress) => {
                return sum + (progress.xp_earned || 0);
            }, 0) || 0;
            
            // Count completed chapters
            const completedChaptersCount = allChapterProgress?.filter(progress => progress.completed).length || 0;
            
            // Get total chapters in this castle
            const allChapters = await this.chapterRepo.getChaptersByCastleId(currentChapter.castleId);
            const totalChapters = allChapters.length;
            const isCastleCompleted = completedChaptersCount === totalChapters;
            
            // Calculate completion percentage
            const completionPercentage = totalChapters > 0 
                ? Math.round((completedChaptersCount / totalChapters) * 100) 
                : 0;
            
            console.log(`[UserChapterProgressService] Recalculated castle XP from all chapters: ${totalCastleXP}`);
            console.log(`[UserChapterProgressService] Completed chapters: ${completedChaptersCount}/${totalChapters}`);
            console.log(`[UserChapterProgressService] Completion percentage: ${completionPercentage}%`);
            console.log(`[UserChapterProgressService] Castle completed: ${isCastleCompleted}`);
            
            // Update castle progress
            // Note: completion_percentage is also calculated automatically by database trigger
            // when chapters are marked complete, but we update it here for immediate consistency
            await this.userCastleProgressRepo.updateUserCastleProgress(castleProgress.id, {
                total_xp_earned: totalCastleXP,
                completion_percentage: completionPercentage,
                completed: isCastleCompleted
            });
        }
        
        // Unlock next chapter or castle
        const allChapters = await this.chapterRepo.getChaptersByCastleId(currentChapter.castleId);
        const sortedChapters = allChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
        const currentIndex = sortedChapters.findIndex(ch => ch.id === chapterId);
        
        console.log(`[UserChapterProgressService] Current chapter index: ${currentIndex}, Total chapters: ${sortedChapters.length}`);
        
        if (currentIndex !== -1 && currentIndex < sortedChapters.length - 1) {
            // Unlock next chapter in same castle
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
        } else if (currentIndex === sortedChapters.length - 1) {
            // This is the last chapter in the castle - check if we should unlock next castle
            console.log(`[UserChapterProgressService] Last chapter completed! Checking for next castle...`);
            
            // Get current castle details
            const { data: castles } = await this.userCastleProgressRepo.supabase
                .from('castles')
                .select('*')
                .order('unlock_order', { ascending: true });
            
            if (castles && castles.length > 0) {
                const currentCastleIndex = castles.findIndex(c => c.id === currentChapter.castleId);
                
                if (currentCastleIndex !== -1 && currentCastleIndex < castles.length - 1) {
                    const nextCastle = castles[currentCastleIndex + 1];
                    console.log(`[UserChapterProgressService] Unlocking next castle: ${nextCastle.name}`);
                    
                    // Check if user has progress for next castle
                    let nextCastleProgress = await this.userCastleProgressRepo.getUserCastleProgressByUserAndCastle(userId, nextCastle.id);
                    
                    if (nextCastleProgress) {
                        // Update existing progress
                        await this.userCastleProgressRepo.updateUserCastleProgress(nextCastleProgress.id, {
                            unlocked: true
                        });
                        console.log(`[UserChapterProgressService] Updated existing castle progress`);
                    } else {
                        // Create new castle progress
                        nextCastleProgress = await this.userCastleProgressRepo.createUserCastleProgress({
                            user_id: userId,
                            castle_id: nextCastle.id,
                            unlocked: true,
                            completed: false,
                            total_xp_earned: 0,
                            completion_percentage: 0
                        });
                        console.log(`[UserChapterProgressService] Created new castle progress`);
                    }
                    
                    // Also unlock the first chapter of the next castle
                    const nextCastleChapters = await this.chapterRepo.getChaptersByCastleId(nextCastle.id);
                    if (nextCastleChapters && nextCastleChapters.length > 0) {
                        const sortedNextChapters = nextCastleChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
                        const firstChapter = sortedNextChapters[0];
                        
                        const firstChapterProgress = await this.userChapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, firstChapter.id);
                        
                        if (firstChapterProgress) {
                            await this.userChapterProgressRepo.updateUserChapterProgress(firstChapterProgress.id, {
                                unlocked: true
                            });
                        } else {
                            await this.userChapterProgressRepo.createUserChapterProgress({
                                user_id: userId,
                                chapter_id: firstChapter.id,
                                unlocked: true,
                                completed: false
                            });
                        }
                        console.log(`[UserChapterProgressService] Unlocked first chapter of next castle: ${firstChapter.title}`);
                    }
                } else {
                    console.log(`[UserChapterProgressService] This is the last castle - no next castle to unlock`);
                }
            }
        } else {
            console.log(`[UserChapterProgressService] No next chapter to unlock (not found)`);
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