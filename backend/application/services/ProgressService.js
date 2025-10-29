class ProgressService {
    constructor(progressRepo, castleRepo, chapterRepo) {
        this.progressRepo = progressRepo;
        this.castleRepo = castleRepo;
        this.chapterRepo = chapterRepo;
    }

    /**
     * Get or initialize user progress for a specific castle
     * Auto-creates castle progress and chapter progress if they don't exist
     */
    async getUserCastleProgress(userId, castleId) {
        try {
            console.log(`[ProgressService] Getting/initializing progress for user ${userId}, castle ${castleId}`);

            // 1. Get the castle
            const castle = await this.castleRepo.findById(castleId);
            if (!castle) {
                throw new Error('Castle not found');
            }

            // 2. Check if user has castle progress
            let castleProgress = await this.progressRepo.findCastleProgress(userId, castleId);

            // 3. If no castle progress, check if this castle should be unlocked
            if (!castleProgress) {
                console.log(`[ProgressService] No castle progress found, checking unlock status...`);
                
                const shouldUnlock = await this.shouldUnlockCastle(userId, castle.unlock_order);

                if (shouldUnlock) {
                    // Initialize castle progress
                    castleProgress = await this.progressRepo.createCastleProgress({
                        user_id: userId,
                        castle_id: castleId,
                        unlocked: true,
                        completed: false,
                        total_xp_earned: 0,
                        completion_percentage: 0,
                        started_at: new Date().toISOString()
                    });

                    console.log(`[ProgressService] ✅ Created castle progress`);
                } else {
                    throw new Error('Castle is locked. Complete previous castles first.');
                }
            }

            // 4. Get all chapters for this castle
            const chapters = await this.chapterRepo.findByCastleId(castleId);
            console.log(`[ProgressService] Found ${chapters.length} chapters for castle`);

            if (chapters.length === 0) {
                console.warn(`[ProgressService] ⚠️ No chapters found for castle ${castle.name}`);
                return {
                    castleProgress,
                    chapterProgress: [],
                    chapters: []
                };
            }

            // 5. Get or initialize chapter progress for ALL chapters
            const chapterProgress = [];

            for (const chapter of chapters) {
                let progress = await this.progressRepo.findChapterProgress(userId, chapter.id);

                if (!progress) {
                    // Initialize chapter progress
                    // Only Chapter 1 (chapter_number === 1) is unlocked by default
                    const isFirstChapter = chapter.chapter_number === 1;

                    progress = await this.progressRepo.createChapterProgress({
                        user_id: userId,
                        chapter_id: chapter.id,
                        unlocked: isFirstChapter,
                        completed: false,
                        xp_earned: 0,
                        quiz_passed: false,
                        started_at: isFirstChapter ? new Date().toISOString() : null
                    });

                    console.log(`[ProgressService] ✅ Created chapter progress: Chapter ${chapter.chapter_number} (${isFirstChapter ? 'UNLOCKED' : 'LOCKED'})`);
                }

                // Merge chapter data with progress
                chapterProgress.push({
                    ...chapter,
                    progress: {
                        id: progress.id,
                        user_id: progress.user_id,
                        chapter_id: progress.chapter_id,
                        unlocked: progress.unlocked,
                        completed: progress.completed,
                        xp_earned: progress.xp_earned,
                        quiz_passed: progress.quiz_passed,
                        started_at: progress.started_at,
                        completed_at: progress.completed_at,
                        created_at: progress.created_at,
                        updated_at: progress.updated_at
                    }
                });
            }

            // Sort by chapter_number
            chapterProgress.sort((a, b) => a.chapter_number - b.chapter_number);

            console.log(`[ProgressService] ✅ Returning progress:`, {
                castle: castle.name,
                totalChapters: chapterProgress.length,
                unlockedChapters: chapterProgress.filter(c => c.progress.unlocked).length,
                completedChapters: chapterProgress.filter(c => c.progress.completed).length
            });

            return {
                castleProgress,
                chapterProgress,
                chapters // Keep for backward compatibility
            };
        } catch (error) {
            console.error('[ProgressService] Error in getUserCastleProgress:', error);
            throw error;
        }
    }

    /**
     * Check if user should have access to this castle
     */
    async shouldUnlockCastle(userId, unlockOrder) {
        console.log(`[ProgressService] Checking unlock status for order ${unlockOrder}`);

        // First castle (unlock_order = 1) is always unlocked
        if (unlockOrder === 1) {
            console.log(`[ProgressService] ✅ First castle, auto-unlocking`);
            return true;
        }

        // Check if user has completed previous castle
        const castles = await this.castleRepo.findAll();
        const previousCastle = castles.find(c => c.unlock_order === unlockOrder - 1);

        if (!previousCastle) {
            console.log(`[ProgressService] ❌ No previous castle found for order ${unlockOrder}`);
            return false;
        }

        const previousProgress = await this.progressRepo.findCastleProgress(userId, previousCastle.id);
        
        if (!previousProgress) {
            console.log(`[ProgressService] ❌ No progress found for previous castle`);
            return false;
        }

        console.log(`[ProgressService] Previous castle completed: ${previousProgress.completed}`);
        return previousProgress.completed;
    }

    /**
     * Complete a chapter and unlock next chapter
     */
    async completeChapter(userId, chapterId, quizScore, xpEarned) {
        try {
            console.log(`[ProgressService] Completing chapter ${chapterId} for user ${userId}`);

            // 1. Get chapter info
            const chapter = await this.chapterRepo.findById(chapterId);
            if (!chapter) {
                throw new Error('Chapter not found');
            }

            // 2. Check if chapter progress exists
            let chapterProgress = await this.progressRepo.findChapterProgress(userId, chapterId);
            
            if (!chapterProgress) {
                // Create it if it doesn't exist (shouldn't happen, but safety check)
                chapterProgress = await this.progressRepo.createChapterProgress({
                    user_id: userId,
                    chapter_id: chapterId,
                    unlocked: true,
                    completed: false,
                    xp_earned: 0,
                    quiz_passed: false,
                    started_at: new Date().toISOString()
                });
            }

            // 3. Update chapter progress
            chapterProgress = await this.progressRepo.updateChapterProgress(userId, chapterId, {
                completed: true,
                xp_earned: xpEarned,
                quiz_passed: quizScore >= 70, // Assuming 70% is passing
                completed_at: new Date().toISOString()
            });

            console.log(`[ProgressService] ✅ Chapter ${chapter.chapter_number} marked as completed`);

            // 4. Unlock next chapter if exists
            const nextChapterNumber = chapter.chapter_number + 1;
            const chapters = await this.chapterRepo.findByCastleId(chapter.castle_id);
            const nextChapter = chapters.find(ch => ch.chapter_number === nextChapterNumber);

            if (nextChapter) {
                // Check if next chapter progress exists
                let nextProgress = await this.progressRepo.findChapterProgress(userId, nextChapter.id);
                
                if (!nextProgress) {
                    // Create progress for next chapter
                    nextProgress = await this.progressRepo.createChapterProgress({
                        user_id: userId,
                        chapter_id: nextChapter.id,
                        unlocked: true,
                        completed: false,
                        xp_earned: 0,
                        quiz_passed: false,
                        started_at: new Date().toISOString()
                    });
                    console.log(`[ProgressService] ✅ Created and unlocked Chapter ${nextChapterNumber}`);
                } else if (!nextProgress.unlocked) {
                    // Update existing progress to unlock
                    await this.progressRepo.updateChapterProgress(userId, nextChapter.id, {
                        unlocked: true,
                        started_at: new Date().toISOString()
                    });
                    console.log(`[ProgressService] ✅ Unlocked Chapter ${nextChapterNumber}`);
                }
            } else {
                // No more chapters - mark castle as completed
                console.log(`[ProgressService] No more chapters, completing castle...`);
                await this.completeCastle(userId, chapter.castle_id);
            }

            return chapterProgress;
        } catch (error) {
            console.error('[ProgressService] Error completing chapter:', error);
            throw error;
        }
    }

    /**
     * Complete castle and unlock next castle
     */
    async completeCastle(userId, castleId) {
        try {
            console.log(`[ProgressService] Completing castle ${castleId} for user ${userId}`);

            // 1. Get all chapters for this castle
            const chapters = await this.chapterRepo.findByCastleId(castleId);
            const chapterProgress = [];

            for (const chapter of chapters) {
                const progress = await this.progressRepo.findChapterProgress(userId, chapter.id);
                if (progress) {
                    chapterProgress.push(progress);
                }
            }

            // 2. Calculate total XP earned
            const totalXp = chapterProgress.reduce((sum, cp) => sum + (cp?.xp_earned || 0), 0);
            const completionPercentage = 100;

            // 3. Update castle progress
            await this.progressRepo.updateCastleProgress(userId, castleId, {
                completed: true,
                total_xp_earned: totalXp,
                completion_percentage: completionPercentage,
                completed_at: new Date().toISOString()
            });

            console.log(`[ProgressService] ✅ Castle completed with ${totalXp} XP`);

            // 4. Unlock next castle if exists
            const castle = await this.castleRepo.findById(castleId);
            const allCastles = await this.castleRepo.findAll();
            const nextCastle = allCastles.find(c => c.unlock_order === castle.unlock_order + 1);

            if (nextCastle) {
                // Check if next castle progress exists
                const nextCastleProgress = await this.progressRepo.findCastleProgress(userId, nextCastle.id);
                
                if (!nextCastleProgress) {
                    await this.progressRepo.createCastleProgress({
                        user_id: userId,
                        castle_id: nextCastle.id,
                        unlocked: true,
                        completed: false,
                        total_xp_earned: 0,
                        completion_percentage: 0,
                        started_at: new Date().toISOString()
                    });
                    console.log(`[ProgressService] ✅ Unlocked next castle: ${nextCastle.name}`);
                }
            }
        } catch (error) {
            console.error('[ProgressService] Error completing castle:', error);
            throw error;
        }
    }

    /**
     * Get progress overview for all castles
     */
    async getProgressOverview(userId) {
        try {
            const castles = await this.castleRepo.findAll();
            const progressData = [];

            for (const castle of castles) {
                const progress = await this.progressRepo.findCastleProgress(userId, castle.id);
                progressData.push({
                    ...castle,
                    progress: progress || {
                        unlocked: castle.unlock_order === 1,
                        completed: false,
                        total_xp_earned: 0,
                        completion_percentage: 0
                    }
                });
            }

            return progressData;
        } catch (error) {
            console.error('[ProgressService] Error getting overview:', error);
            throw error;
        }
    }

    /**
     * Get all castle progress for a user
     */
    async getCastleProgress(userId) {
        try {
            return await this.progressRepo.findAllCastleProgress(userId);
        } catch (error) {
            console.error('[ProgressService] Error getting castle progress:', error);
            throw error;
        }
    }

    /**
     * Get chapter progress for a specific castle
     */
    async getChapterProgress(userId, castleId) {
        try {
            return await this.progressRepo.findAllChapterProgressForCastle(userId, castleId);
        } catch (error) {
            console.error('[ProgressService] Error getting chapter progress:', error);
            throw error;
        }
    }

    /**
     * Update chapter progress
     */
    async updateChapterProgressData(userId, chapterId, progressData) {
        try {
            return await this.progressRepo.updateChapterProgress(userId, chapterId, progressData);
        } catch (error) {
            console.error('[ProgressService] Error updating chapter progress:', error);
            throw error;
        }
    }

    /**
     * Record minigame attempt
     */
    async recordMinigameAttempt(userId, minigameId, attemptData) {
        try {
            const { data, error } = await this.progressRepo.supabase
                .from('user_minigame_attempts')
                .insert({
                    user_id: userId,
                    minigame_id: minigameId,
                    ...attemptData,
                    attempted_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('[ProgressService] Error recording minigame attempt:', error);
            throw error;
        }
    }

    /**
     * Record quiz attempt
     */
    async recordQuizAttempt(userId, chapterQuizId, quizData) {
        try {
            const { data, error } = await this.progressRepo.supabase
                .from('user_quiz_attempts')
                .insert({
                    user_id: userId,
                    chapter_quiz_id: chapterQuizId,
                    ...quizData,
                    attempted_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('[ProgressService] Error recording quiz attempt:', error);
            throw error;
        }
    }

    /**
     * Add XP to chapter progress incrementally (for lesson, minigame, quiz)
     */
    async addChapterXP(userId, chapterId, xpAmount, source) {
        try {
            console.log(`[ProgressService] Adding ${xpAmount} XP to chapter ${chapterId} from ${source}`);

            // Get current chapter progress
            let chapterProgress = await this.progressRepo.findChapterProgress(userId, chapterId);
            
            if (!chapterProgress) {
                throw new Error('Chapter progress not found. User must start chapter first.');
            }

            // Calculate new XP
            const newXpEarned = (chapterProgress.xp_earned || 0) + xpAmount;

            // Update chapter progress
            const updated = await this.progressRepo.updateChapterProgress(userId, chapterId, {
                xp_earned: newXpEarned,
                updated_at: new Date().toISOString()
            });

            console.log(`[ProgressService] ✅ Updated chapter XP: ${chapterProgress.xp_earned} → ${newXpEarned} (source: ${source})`);

            // Update castle totals
            const chapter = await this.chapterRepo.findById(chapterId);
            await this.updateCastleTotals(userId, chapter.castle_id);

            return updated;
        } catch (error) {
            console.error('[ProgressService] Error adding chapter XP:', error);
            throw error;
        }
    }

    /**
     * Update castle total XP and completion percentage
     */
    async updateCastleTotals(userId, castleId) {
        try {
            console.log(`[ProgressService] Updating castle totals for ${castleId}`);

            // Get all chapters in castle
            const chapters = await this.chapterRepo.findByCastleId(castleId);
            const chapterProgress = [];

            for (const chapter of chapters) {
                const progress = await this.progressRepo.findChapterProgress(userId, chapter.id);
                if (progress) {
                    chapterProgress.push({
                        ...progress,
                        chapter_xp_reward: chapter.xp_reward
                    });
                }
            }

            // Calculate total XP earned
            const totalXpEarned = chapterProgress.reduce((sum, cp) => sum + (cp.xp_earned || 0), 0);

            // Calculate expected total XP for castle
            const expectedTotalXp = chapters.reduce((sum, ch) => sum + ch.xp_reward, 0);

            // Calculate completion percentage
            const completedChapters = chapterProgress.filter(cp => cp.completed).length;
            const completionPercentage = Math.round((completedChapters / chapters.length) * 100);

            // Check if all chapters are completed
            const allCompleted = completedChapters === chapters.length;

            // Update castle progress
            await this.progressRepo.updateCastleProgress(userId, castleId, {
                total_xp_earned: totalXpEarned,
                completion_percentage: completionPercentage,
                completed: allCompleted,
                completed_at: allCompleted ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
            });

            console.log(`[ProgressService] ✅ Castle totals updated: ${totalXpEarned}/${expectedTotalXp} XP, ${completionPercentage}% complete`);

            // If castle completed, unlock next castle
            if (allCompleted) {
                await this.unlockNextCastle(userId, castleId);
            }

            return {
                totalXpEarned,
                expectedTotalXp,
                completionPercentage,
                allCompleted
            };
        } catch (error) {
            console.error('[ProgressService] Error updating castle totals:', error);
            throw error;
        }
    }

    /**
     * Unlock next castle (separated from completeCastle)
     */
    async unlockNextCastle(userId, currentCastleId) {
        try {
            const castle = await this.castleRepo.findById(currentCastleId);
            const allCastles = await this.castleRepo.findAll();
            const nextCastle = allCastles.find(c => c.unlock_order === castle.unlock_order + 1);

            if (nextCastle) {
                const nextCastleProgress = await this.progressRepo.findCastleProgress(userId, nextCastle.id);
                
                if (!nextCastleProgress) {
                    await this.progressRepo.createCastleProgress({
                        user_id: userId,
                        castle_id: nextCastle.id,
                        unlocked: true,
                        completed: false,
                        total_xp_earned: 0,
                        completion_percentage: 0,
                        started_at: new Date().toISOString()
                    });
                    console.log(`[ProgressService] ✅ Unlocked next castle: ${nextCastle.name}`);
                }
            } else {
                console.log(`[ProgressService] No more castles to unlock`);
            }
        } catch (error) {
            console.error('[ProgressService] Error unlocking next castle:', error);
            throw error;
        }
    }

    /**
     * Check if chapter is ready to be completed
     */
    async checkChapterCompletion(userId, chapterId) {
        try {
            const chapter = await this.chapterRepo.findById(chapterId);
            const progress = await this.progressRepo.findChapterProgress(userId, chapterId);

            if (!chapter || !progress) {
                return { canComplete: false, reason: 'Chapter or progress not found' };
            }

            // Check if XP earned >= chapter's total XP reward
            const hasEnoughXp = progress.xp_earned >= chapter.xp_reward;

            // Check if quiz is passed
            const quizPassed = progress.quiz_passed;

            const canComplete = hasEnoughXp && quizPassed;

            console.log(`[ProgressService] Chapter completion check:`, {
                chapterId,
                xpEarned: progress.xp_earned,
                xpRequired: chapter.xp_reward,
                hasEnoughXp,
                quizPassed,
                canComplete
            });

            return {
                canComplete,
                hasEnoughXp,
                quizPassed,
                xpEarned: progress.xp_earned,
                xpRequired: chapter.xp_reward
            };
        } catch (error) {
            console.error('[ProgressService] Error checking chapter completion:', error);
            throw error;
        }
    }

    /**
     * Mark quiz as passed (separate from adding XP)
     */
    async markQuizPassed(userId, chapterId) {
        try {
            console.log(`[ProgressService] Marking quiz as passed for chapter ${chapterId}`);

            const updated = await this.progressRepo.updateChapterProgress(userId, chapterId, {
                quiz_passed: true,
                updated_at: new Date().toISOString()
            });

            // Check if chapter can now be completed
            const completionCheck = await this.checkChapterCompletion(userId, chapterId);

            if (completionCheck.canComplete) {
                console.log(`[ProgressService] Chapter ready to complete, auto-completing...`);
                await this.autoCompleteChapter(userId, chapterId);
            }

            return updated;
        } catch (error) {
            console.error('[ProgressService] Error marking quiz passed:', error);
            throw error;
        }
    }

    /**
     * Auto-complete chapter when conditions are met
     */
    async autoCompleteChapter(userId, chapterId) {
        try {
            console.log(`[ProgressService] Auto-completing chapter ${chapterId}`);

            // Get chapter info
            const chapter = await this.chapterRepo.findById(chapterId);
            
            // Update chapter progress
            await this.progressRepo.updateChapterProgress(userId, chapterId, {
                completed: true,
                completed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

            console.log(`[ProgressService] ✅ Chapter ${chapter.chapter_number} auto-completed`);

            // Unlock next chapter
            const nextChapterNumber = chapter.chapter_number + 1;
            const chapters = await this.chapterRepo.findByCastleId(chapter.castle_id);
            const nextChapter = chapters.find(ch => ch.chapter_number === nextChapterNumber);

            if (nextChapter) {
                let nextProgress = await this.progressRepo.findChapterProgress(userId, nextChapter.id);
                
                if (!nextProgress) {
                    await this.progressRepo.createChapterProgress({
                        user_id: userId,
                        chapter_id: nextChapter.id,
                        unlocked: true,
                        completed: false,
                        xp_earned: 0,
                        quiz_passed: false,
                        started_at: new Date().toISOString()
                    });
                    console.log(`[ProgressService] ✅ Created and unlocked Chapter ${nextChapterNumber}`);
                } else if (!nextProgress.unlocked) {
                    await this.progressRepo.updateChapterProgress(userId, nextChapter.id, {
                        unlocked: true,
                        started_at: new Date().toISOString()
                    });
                    console.log(`[ProgressService] ✅ Unlocked Chapter ${nextChapterNumber}`);
                }
            } else {
                // No more chapters - update castle totals (will mark as complete if all done)
                console.log(`[ProgressService] No more chapters, updating castle totals...`);
                await this.updateCastleTotals(userId, chapter.castle_id);
            }

            return true;
        } catch (error) {
            console.error('[ProgressService] Error auto-completing chapter:', error);
            throw error;
        }
    }

    async startChapter(userId, chapterId) {
        const chapter = await this.chapterRepo.findById(chapterId);
        if (!chapter) throw new Error('Chapter not found');

        // Check if already started
        const existing = await this.progressRepo.findChapterProgress(userId, chapterId);
        if (existing) return existing;

        // Create new progress
        const progress = await this.progressRepo.createChapterProgress({
            user_id: userId,
            chapter_id: chapterId,
            unlocked: true,
            started_at: new Date()
        });

        // Also ensure castle progress exists
        await this.ensureCastleProgress(userId, chapter.castle_id);

        return progress;
        }

        /**
         * Update chapter progress (called when completing lessons/minigames/quizzes)
         */
        async updateChapterProgress(userId, chapterId, updates) {
        const progress = await this.progressRepo.findChapterProgress(userId, chapterId);
        if (!progress) throw new Error('Chapter not started');

        // Update progress
        const updated = await this.progressRepo.updateChapterProgress(progress.id, {
            ...updates,
            updated_at: new Date()
        });

        // Check if chapter is now completed
        if (updates.completed) {
            await this.onChapterComplete(userId, chapterId);
        }

        return updated;
        }

        /**
         * Award XP for chapter activities (lesson, minigame, quiz)
         */
        async awardChapterXP(userId, chapterId, xpAmount, source) {
        const progress = await this.progressRepo.findChapterProgress(userId, chapterId);
        if (!progress) throw new Error('Chapter not started');

        // Update chapter XP
        const newXP = (progress.xp_earned || 0) + xpAmount;
        await this.progressRepo.updateChapterProgress(progress.id, {
            xp_earned: newXP,
            updated_at: new Date()
        });

        // Update castle XP
        const chapter = await this.chapterRepo.findById(chapterId);
        await this.addCastleXP(userId, chapter.castle_id, xpAmount);

        return { newXP, source };
        }

        /**
         * Complete chapter and unlock next
         */
        async onChapterComplete(userId, chapterId) {
        const chapter = await this.chapterRepo.findById(chapterId);
        
        // Mark as completed
        await this.progressRepo.updateChapterProgress(
            (await this.progressRepo.findChapterProgress(userId, chapterId)).id,
            {
            completed: true,
            completed_at: new Date(),
            updated_at: new Date()
            }
        );

        // Unlock next chapter
        const nextChapter = await this.chapterRepo.findNextChapter(
            chapter.castle_id,
            chapter.chapter_number
        );

        if (nextChapter) {
            await this.progressRepo.createOrUpdateChapterProgress({
            user_id: userId,
            chapter_id: nextChapter.id,
            unlocked: true,
            updated_at: new Date()
            });
        }

        // Update castle completion percentage
        await this.updateCastleCompletion(userId, chapter.castle_id);
        }

        /**
         * Update castle completion percentage
         */
        async updateCastleCompletion(userId, castleId) {
        const chapters = await this.chapterRepo.findByCastleId(castleId);
        const userProgress = await Promise.all(
            chapters.map(ch => this.progressRepo.findChapterProgress(userId, ch.id))
        );

        const completedCount = userProgress.filter(p => p && p.completed).length;
        const percentage = Math.round((completedCount / chapters.length) * 100);

        const castleProgress = await this.progressRepo.findCastleProgress(userId, castleId);
        
        await this.progressRepo.updateCastleProgress(castleProgress.id, {
            completion_percentage: percentage,
            completed: percentage === 100,
            completed_at: percentage === 100 ? new Date() : null,
            updated_at: new Date()
        });

        return percentage;
        }

        /**
         * Add XP to castle total
         */
        async addCastleXP(userId, castleId, xpAmount) {
        const castleProgress = await this.progressRepo.findCastleProgress(userId, castleId);
        
        await this.progressRepo.updateCastleProgress(castleProgress.id, {
            total_xp_earned: (castleProgress.total_xp_earned || 0) + xpAmount,
            updated_at: new Date()
        });
        }

        /**
         * Ensure castle progress exists
         */
        async ensureCastleProgress(userId, castleId) {
        const existing = await this.progressRepo.findCastleProgress(userId, castleId);
        if (existing) return existing;

        return await this.progressRepo.createCastleProgress({
            user_id: userId,
            castle_id: castleId,
            unlocked: true,
            started_at: new Date()
        });
    }
}

module.exports = ProgressService;