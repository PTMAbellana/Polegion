const cache = require('../../cache');
const castleModel = require('../../../domain/models/world/Castle');

class CastleService {
    constructor(castleRepo, userCastleProgressRepo = null, chapterRepo = null, userChapterProgressRepo = null, chapterSeeder = null, quizAndMinigameSeeder = null) {
        this.castleRepo = castleRepo;
        this.userCastleProgressRepo = userCastleProgressRepo;
        this.chapterRepo = chapterRepo;
        this.userChapterProgressRepo = userChapterProgressRepo;
        this.chapterSeeder = chapterSeeder;
        this.quizAndMinigameSeeder = quizAndMinigameSeeder;
        this.CACHE_TTL = 1 * 60 * 1000; // ✅ REDUCED: 1 minute for better concurrency
    }

    _invalidateCastleCache(castleId = null, userId = null) {
        if (castleId) {
            const key = cache.generateKey('castle', castleId);
            cache.delete(key);
            
            // ✅ FIX: Invalidate user-specific cache for this castle
            if (userId) {
                const userCastleKey = cache.generateKey('castle_user', castleId, userId);
                cache.delete(userCastleKey);
            }
        }
        
        // ✅ FIX: Invalidate all-castles cache
        cache.delete(cache.generateKey('all_castles'));
        
        // ✅ FIX: Invalidate user's worldmap cache
        if (userId) {
            const userCastlesKey = cache.generateKey('all_castles_user', userId);
            cache.delete(userCastlesKey);
        }
    }

    async createCastle(data) {
        const result = await this.castleRepo.createCastle(data);
        this._invalidateCastleCache();
        return result;
    }

    async getCastleById(castleId) {
        const cacheKey = cache.generateKey('castle', castleId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const castle = await this.castleRepo.getCastleById(castleId);
        cache.set(cacheKey, castle);
        return castle;
    }

    async getAllCastles() {
        const cacheKey = cache.generateKey('all_castles');
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const castles = await this.castleRepo.getAllCastles();
        cache.set(cacheKey, castles);
        return castles;
    }

    async updateCastle(castleId, data) {
        const result = await this.castleRepo.updateCastle(castleId, data);
        this._invalidateCastleCache(castleId);
        return result;
    }

    async deleteCastle(castleId) {
        const result = await this.castleRepo.deleteCastle(castleId);
        this._invalidateCastleCache(castleId);
        return result;
    }

    async getAllCastlesWithUserProgress(userId) {
        console.log(`[CastleService] getAllCastlesWithUserProgress for userId: ${userId}`);
        // Always fetch fresh to avoid stale worldmap progress; user-specific caching caused stale completion bars
        const cacheKey = cache.generateKey('all_castles_user', userId);
        cache.delete(cacheKey);

        let castles = await this.castleRepo.getAllCastlesWithUserProgress(userId);
        
        // Auto-initialize Castle 0 for new users
        if (this.userCastleProgressRepo && castles.length > 0) {
            const hasAnyProgress = castles.some(c => c.progress);
            
            if (!hasAnyProgress) {
                console.log(`[CastleService] New user detected - auto-initializing Castle 0 (Pretest)`);
                
                // ✅ FIX: Clear cache BEFORE initialization to prevent race conditions
                cache.delete(cacheKey);
                
                // Find Castle 0
                const castle0 = castles.find(c => c.unlock_order === 0);
                
                if (castle0) {
                    try {
                        // ✅ FIX: Use UPSERT to handle concurrent initialization attempts
                        const castle0Progress = await this.userCastleProgressRepo.upsertUserCastleProgress(
                            userId,
                            castle0.id,
                            {
                                unlocked: true, // Auto-unlock Castle 0 for new users
                                completed: false,
                                total_xp_earned: 0,
                                completion_percentage: 0,
                                started_at: new Date().toISOString()
                            }
                        );
                        
                        console.log(`[CastleService] Castle 0 auto-unlocked for new user ${userId}`);
                        
                        // Refetch castles to include the new progress
                        castles = await this.castleRepo.getAllCastlesWithUserProgress(userId);
                    } catch (error) {
                        // ✅ FIX: Handle RLS errors gracefully - don't block worldmap
                        if (error.code === '42501') {
                            console.error(`[CastleService] RLS policy blocks Castle 0 initialization`);
                            console.error(`[CastleService] Please fix Supabase RLS policies for user_castle_progress table`);
                            console.error(`[CastleService] Required policy: Allow users to INSERT their own progress records`);
                            // Return castles anyway - user can still see locked state
                        } else {
                            console.error(`[CastleService] Error auto-initializing Castle 0:`, error);
                        }
                        // Continue even if initialization fails - return castles in locked state
                    }
                }
            }
        }
        
        return castles;
    }

    async getCastleByIdWithUserProgress(castleId, userId) {
        const cacheKey = cache.generateKey('castle_user', castleId, userId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const castle = await this.castleRepo.getCastleByIdWithUserProgress(castleId, userId);
        cache.set(cacheKey, castle, this.CACHE_TTL);
        return castle;
    }

    /**
     * Initialize user progress for a castle
     * Creates castle progress and chapter progress records if they don't exist
     * Unlocks first chapter by default
     */
    async initializeUserCastleProgress(userId, castleRoute) {
        console.log(`[CastleService] initializeUserCastleProgress - userId: ${userId}, castleRoute: ${castleRoute}`);
        
        if (!this.userCastleProgressRepo || !this.chapterRepo || !this.userChapterProgressRepo) {
            throw new Error('Required repositories not injected in CastleService');
        }

        try {
            // 1. Get castle by route
            const castles = await this.castleRepo.getAllCastles();
            const castle = castles.find(c => c.route === castleRoute);
            
            if (!castle) {
                throw new Error(`Castle with route '${castleRoute}' not found`);
            }

            console.log(`[CastleService] Found castle:`, castle.toJSON());

            // 2. ✅ FIX: Use UPSERT to handle concurrent initialization atomically
            //    IMPORTANT: Never re-lock a castle that is already unlocked.
            let initialUnlocked = castle.unlockOrder === 0; // Only auto-unlock Castle 0 (Pretest)

            // For non-pretest castles, preserve existing unlocked status if it exists
            if (castle.unlockOrder !== 0) {
                try {
                    const existingProgress = await this.userCastleProgressRepo.getUserCastleProgressByUserAndCastle(userId, castle.id);
                    if (existingProgress && typeof existingProgress.unlocked === 'boolean') {
                        initialUnlocked = existingProgress.unlocked;
                        console.log(`[CastleService] Preserving existing unlocked status for castle ${castle.id}:`, initialUnlocked);
                    }
                } catch (lookupError) {
                    console.warn('[CastleService] Warning: failed to read existing castle progress before upsert:', lookupError.message);
                }
            }

            let castleProgress = await this.userCastleProgressRepo.upsertUserCastleProgress(
                userId,
                castle.id,
                {
                    unlocked: initialUnlocked,
                    completed: false,
                    total_xp_earned: 0,
                    completion_percentage: 0,
                    started_at: new Date().toISOString()
                }
            );
            
            console.log(`[CastleService] Castle progress initialized/fetched for user ${userId}`);

            // 3. Get all chapters for this castle (seed if needed)
            let chapters = await this.chapterRepo.getChaptersByCastleId(castle.id);
            
            // If no chapters exist and we have a seeder, seed them
            if (chapters.length === 0 && this.chapterSeeder) {
                console.log(`[CastleService] No chapters found, seeding for ${castleRoute}`);
                chapters = await this.chapterSeeder.seedChaptersForCastle(castle.id, castleRoute);
            }
            
            console.log(`[CastleService] Found ${chapters.length} chapters`);

            // 3.5. Seed quizzes and minigames for each chapter if needed
            if (this.quizAndMinigameSeeder) {
                for (const chapter of chapters) {
                    console.log(`[CastleService] Chapter object:`, chapter);
                    console.log(`[CastleService] Chapter properties:`, {
                        hasChapterNumber: 'chapterNumber' in chapter,
                        hasChapter_number: 'chapter_number' in chapter,
                        chapterNumberValue: chapter.chapterNumber,
                        chapter_numberValue: chapter.chapter_number,
                        allKeys: Object.keys(chapter)
                    });
                    console.log(`[CastleService] Castle properties:`, {
                        hasUnlockOrder: 'unlockOrder' in castle,
                        hasUnlock_order: 'unlock_order' in castle,
                        unlockOrderValue: castle.unlockOrder,
                        unlock_orderValue: castle.unlock_order,
                        allKeys: Object.keys(castle)
                    });
                    console.log(`[CastleService] Seeding quiz/minigame for chapter:`, {
                        id: chapter.id,
                        number: chapter.chapterNumber,
                        castle: castle.unlockOrder
                    });
                    // Use unlockOrder as castle number (Castle 1 has unlockOrder=1, Castle 2 has unlockOrder=2, etc.)
                    await this.quizAndMinigameSeeder.seedForChapter(
                        chapter.id, 
                        chapter.chapterNumber,  // Use camelCase from Chapter model
                        castle.unlockOrder      // Use camelCase from Castle model
                    );
                }
            }

            // 4. ✅ FIX: Initialize chapter progress with better concurrency handling
            const chapterProgresses = [];
            
            for (const chapter of chapters) {
                try {
                    // Try to fetch existing progress first
                    let existing = await this.userChapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, chapter.id);
                    
                    if (!existing) {
                        console.log(`[CastleService] Creating progress for chapter ${chapter.chapterNumber}`);
                        // Create new progress (createUserChapterProgress now handles race conditions)
                        existing = await this.userChapterProgressRepo.createUserChapterProgress({
                            user_id: userId,
                            chapter_id: chapter.id,
                            unlocked: castleProgress.unlocked && chapter.chapterNumber === 1,
                            completed: false,
                            xp_earned: 0,
                            quiz_passed: false
                        });
                    }
                    
                    chapterProgresses.push(existing);
                } catch (error) {
                    console.error(`[CastleService] Error with chapter progress:`, error);
                    chapterProgresses.push(null);
                }
            }

            // 5. Return combined data with null safety
            return {
                castle: castle?.toJSON() || null,
                castleProgress: castleProgress?.toJSON() || null,
                chapters: (chapters || []).map((chapter, index) => ({
                    ...chapter?.toJSON() || {},
                    progress: chapterProgresses[index] ? chapterProgresses[index]?.toJSON() : null
                }))
            };

        } catch (error) {
            console.error('[CastleService] Error initializing user castle progress:', error);
            throw error;
        }
    }

    /**
     * Manually seed quiz and minigame data for a specific chapter
     * @param {string} chapterId - The chapter ID
     * @param {number} chapterNumber - The chapter number (1, 2, 3...)
     * @param {number} castleNumber - The castle number (1, 2, 3...)
     * @returns {Promise<Object>} - Seeding result with created quizzes and minigames
     */
    async seedChapterData(chapterId, chapterNumber, castleNumber) {
        try {
            console.log(`[CastleService] Manually seeding Castle ${castleNumber}, Chapter ${chapterNumber}`);
            
            if (!this.quizAndMinigameSeeder) {
                throw new Error('QuizAndMinigameSeeder not available');
            }

            const result = await this.quizAndMinigameSeeder.seedForChapter(
                chapterId, 
                chapterNumber, 
                castleNumber
            );

            console.log(`[CastleService] Seeding complete: ${result.quizzes.length} quizzes, ${result.minigames.length} minigames`);
            return result;

        } catch (error) {
            console.error('[CastleService] Error seeding chapter data:', error);
            throw error;
        }
    }
}

module.exports = CastleService;