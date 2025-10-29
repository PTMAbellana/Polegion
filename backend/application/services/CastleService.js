const cache = require('../cache');
const castleModel = require('../../domain/models/Castle');

class CastleService {
    constructor(castleRepo, userCastleProgressRepo = null, chapterRepo = null, userChapterProgressRepo = null, chapterSeeder = null, quizAndMinigameSeeder = null) {
        this.castleRepo = castleRepo;
        this.userCastleProgressRepo = userCastleProgressRepo;
        this.chapterRepo = chapterRepo;
        this.userChapterProgressRepo = userChapterProgressRepo;
        this.chapterSeeder = chapterSeeder;
        this.quizAndMinigameSeeder = quizAndMinigameSeeder;
        this.CACHE_TTL = 10 * 60 * 1000; // 10 minutes
    }

    _invalidateCastleCache(castleId = null) {
        if (castleId) {
            const key = cache.generateKey('castle', castleId);
            cache.delete(key);
        }
        cache.delete(cache.generateKey('all_castles'));
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
        const cacheKey = cache.generateKey('all_castles_user', userId);
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const castles = await this.castleRepo.getAllCastlesWithUserProgress(userId);
        cache.set(cacheKey, castles, this.CACHE_TTL);
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

            // 2. Check if user has castle progress
            let castleProgress = await this.userCastleProgressRepo.getUserCastleProgressByUserAndCastle(userId, castle.id);
            
            if (!castleProgress) {
                console.log(`[CastleService] Creating castle progress for user ${userId}`);
                // Create castle progress - unlocked if it's the first castle (unlock_order = 1)
                castleProgress = await this.userCastleProgressRepo.createUserCastleProgress({
                    user_id: userId,
                    castle_id: castle.id,
                    unlocked: castle.unlockOrder === 1, // Auto-unlock first castle
                    completed: false,
                    total_xp_earned: 0,
                    completion_percentage: 0,
                    started_at: new Date().toISOString()
                });
            }

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
                    // Use unlock_order as castle number (Castle 1 has unlock_order=1, Castle 2 has unlock_order=2, etc.)
                    await this.quizAndMinigameSeeder.seedForChapter(
                        chapter.id, 
                        chapter.chapterNumber, 
                        castle.unlockOrder
                    );
                }
            }

            // 4. Initialize chapter progress for each chapter
            const chapterProgressPromises = chapters.map(async (chapter) => {
                const existing = await this.userChapterProgressRepo.getUserChapterProgressByUserAndChapter(userId, chapter.id);
                
                if (!existing) {
                    console.log(`[CastleService] Creating progress for chapter ${chapter.chapterNumber}`);
                    // Unlock first chapter if castle is unlocked
                    return await this.userChapterProgressRepo.createUserChapterProgress({
                        user_id: userId,
                        chapter_id: chapter.id,
                        unlocked: castleProgress.unlocked && chapter.chapterNumber === 1,
                        completed: false,
                        xp_earned: 0,
                        quiz_passed: false
                    });
                }
                return existing;
            });

            const chapterProgresses = await Promise.all(chapterProgressPromises);

            // 5. Return combined data
            return {
                castle: castle.toJSON(),
                castleProgress: castleProgress.toJSON(),
                chapters: chapters.map((chapter, index) => ({
                    ...chapter.toJSON(),
                    progress: chapterProgresses[index] ? chapterProgresses[index].toJSON() : null
                }))
            };

        } catch (error) {
            console.error('[CastleService] Error initializing user castle progress:', error);
            throw error;
        }
    }
}

module.exports = CastleService;