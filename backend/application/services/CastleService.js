class CastleService {
    constructor(castleRepo, progressRepo) {
        this.castleRepo = castleRepo;
        this.progressRepo = progressRepo;
    }

    async getCastlesWithProgress(userId) {
        try {
            console.log(`[CastleService] Getting castles with progress for user: ${userId}`);
            
            // Get all castles ordered by unlock_order
            const castles = await this.castleRepo.findAll();
            console.log(`[CastleService] Found castles: ${castles.length}`);

            // Sort by unlock_order
            castles.sort((a, b) => a.unlock_order - b.unlock_order);

            if (!userId) {
                // If no userId provided, return castles without progress
                return castles.map(castle => ({
                    ...castle,
                    progress: null
                }));
            }

            // Get all castle progress for this user
            let progressRecords = await this.progressRepo.findAllCastleProgress(userId);
            console.log(`[CastleService] Found progress records: ${progressRecords.length}`);

            // If no progress exists at all, initialize the first castle
            if (progressRecords.length === 0 && castles.length > 0) {
                console.log(`[CastleService] No progress found, initializing first castle`);
                
                const firstCastle = castles[0]; // unlock_order = 1
                const initialProgress = await this.progressRepo.createCastleProgress({
                    user_id: userId,
                    castle_id: firstCastle.id,
                    unlocked: true,
                    completed: false,
                    total_xp_earned: 0,
                    completion_percentage: 0,
                    started_at: new Date().toISOString()
                });

                progressRecords = [initialProgress];
                console.log(`[CastleService] First castle initialized: ${firstCastle.name}`);
            }

            // Map castles with their progress
            const castlesWithProgress = castles.map(castle => {
                const progress = progressRecords.find(p => p.castle_id === castle.id);
                
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

            console.log(`[CastleService] Returning castles with progress: ${castlesWithProgress.length}`);
            return castlesWithProgress;
        } catch (error) {
            console.error('[CastleService] Error getting castles with progress:', error);
            throw error;
        }
    }

    async getCastleById(castleId, userId = null) {
        try {
            console.log(`[CastleService] Getting castle: ${castleId}`);
            
            const castle = await this.castleRepo.findById(castleId);
            
            if (!castle) {
                throw new Error('Castle not found');
            }

            if (!userId) {
                return {
                    ...castle,
                    progress: null
                };
            }

            // Get progress for this castle
            const progress = await this.progressRepo.findCastleProgress(userId, castleId);

            return {
                ...castle,
                progress: progress || {
                    unlocked: castle.unlock_order === 1, // First castle is always accessible
                    completed: false,
                    total_xp_earned: 0,
                    completion_percentage: 0
                }
            };
        } catch (error) {
            console.error('[CastleService] Error getting castle:', error);
            throw error;
        }
    }

    async unlockCastle(userId, castleId) {
        try {
            console.log(`[CastleService] Unlocking castle ${castleId} for user ${userId}`);

            // Check if castle exists
            const castle = await this.castleRepo.findById(castleId);
            if (!castle) {
                throw new Error('Castle not found');
            }

            // Check if progress already exists
            let progress = await this.progressRepo.findCastleProgress(userId, castleId);

            if (progress) {
                // If already exists, just update to unlocked
                progress = await this.progressRepo.updateCastleProgress(userId, castleId, {
                    unlocked: true,
                    started_at: progress.started_at || new Date().toISOString()
                });
            } else {
                // Create new progress record
                progress = await this.progressRepo.createCastleProgress({
                    user_id: userId,
                    castle_id: castleId,
                    unlocked: true,
                    completed: false,
                    total_xp_earned: 0,
                    completion_percentage: 0,
                    started_at: new Date().toISOString()
                });
            }

            console.log(`[CastleService] Castle unlocked successfully`);
            return progress;
        } catch (error) {
            console.error('[CastleService] Error unlocking castle:', error);
            throw error;
        }
    }

    async getAllCastles() {
        try {
            const castles = await this.castleRepo.findAll();
            // Sort by unlock_order
            return castles.sort((a, b) => a.unlock_order - b.unlock_order);
        } catch (error) {
            console.error('[CastleService] Error getting all castles:', error);
            throw error;
        }
    }
}

module.exports = CastleService;