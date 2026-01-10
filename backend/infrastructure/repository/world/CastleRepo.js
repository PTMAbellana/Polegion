const BaseRepo = require('../BaseRepo');
const Castle = require('../../../domain/models/world/Castle');

class CastleRepo extends BaseRepo {
    constructor(supabase) {
        super(supabase);
        this.tableName = 'castles';
    }

    async createCastle(data) {
        try {
            const { data: castle, error } = await this.supabase
                .from(this.tableName)
                .insert({
                    name: data.name,
                    region: data.region,
                    description: data.description,
                    difficulty: data.difficulty,
                    terrain: data.terrain,
                    image_number: data.image_number,
                    total_xp: data.total_xp,
                    unlock_order: data.unlock_order,
                    route: data.route
                })
                .select()
                .single();

            if (error) throw error;
            return Castle.fromDatabase(castle);
        } catch (error) {
            console.error('[CastleRepo] Error in createCastle:', error);
            throw error;
        }
    }

    async getCastleById(id) {
        try {
            return await this.withRetry(async () => {
                const { data, error } = await this.supabase
                    .from(this.tableName)
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('[CastleRepo] Database error in getCastleById:', error);
                    throw error;
                }
                
                console.log(`[CastleRepo] Successfully fetched castle with id: ${id}`);
                return data ? Castle.fromDatabase(data) : null;
            });
        } catch (error) {
            console.error('[CastleRepo] Error in getCastleById:', error);
            throw error;
        }
    }

    async getAllCastles() {
        try {
            return await this.withRetry(async () => {
                const { data, error } = await this.supabase
                    .from(this.tableName)
                    .select('*')
                    .order('unlock_order', { ascending: true });

                if (error) {
                    console.error('[CastleRepo] Database error in getAllCastles:', error);
                    throw error;
                }
                
                console.log(`[CastleRepo] Successfully fetched ${data?.length || 0} castles`);
                return data.map(Castle.fromDatabase);
            });
        } catch (error) {
            console.error('[CastleRepo] Error in getAllCastles:', error);
            throw error;
        }
    }

    async updateCastle(id, data) {
        try {
            const { data: castle, error } = await this.supabase
                .from(this.tableName)
                .update({
                    name: data.name,
                    region: data.region,
                    description: data.description,
                    difficulty: data.difficulty,
                    terrain: data.terrain,
                    image_number: data.image_number,
                    total_xp: data.total_xp,
                    unlock_order: data.unlock_order,
                    route: data.route
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return castle ? Castle.fromDatabase(castle) : null;
        } catch (error) {
            console.error('[CastleRepo] Error in updateCastle:', error);
            throw error;
        }
    }

    async deleteCastle(id) {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .delete()
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data ? Castle.fromDatabase(data) : null;
        } catch (error) {
            console.error('[CastleRepo] Error in deleteCastle:', error);
            throw error;
        }
    }

    async getAllCastlesWithUserProgress(userId) {
        try {
            console.log('[CastleRepo] getAllCastlesWithUserProgress for userId:', userId);
            console.log('[CastleRepo] userId type:', typeof userId);
            
            // Validate userId
            if (!userId) {
                throw new Error('userId is required for getAllCastlesWithUserProgress');
            }
            
            // Use retry logic for all database queries
            const [castles, progress, chapterCounts] = await Promise.all([
                // Get all castles with retry
                this.withRetry(async () => {
                    console.log('[CastleRepo] Fetching castles...');
                    const { data, error } = await this.supabase
                        .from(this.tableName)
                        .select('*')
                        .order('unlock_order', { ascending: true });
                    
                    if (error) {
                        console.error('[CastleRepo] Error fetching castles:', error);
                        throw error;
                    }
                    console.log('[CastleRepo] Fetched castles count:', data?.length);
                    return data || [];
                }),
                
                // Get user progress with retry
                this.withRetry(async () => {
                    console.log('[CastleRepo] Fetching progress for user_id:', userId);
                    const { data, error } = await this.supabase
                        .from('user_castle_progress')
                        .select('*')
                        .eq('user_id', userId);
                    
                    if (error) {
                        console.error('[CastleRepo] Error fetching progress:', error);
                        console.error('[CastleRepo] Progress error code:', error.code);
                        console.error('[CastleRepo] Progress error details:', error.details);
                        throw error;
                    }
                    console.log('[CastleRepo] Fetched progress count:', data?.length);
                    return data || [];
                }),
                
                // Get chapter counts with retry (non-critical, so catch errors)
                this.withRetry(async () => {
                    console.log('[CastleRepo] Fetching chapter counts...');
                    const { data, error } = await this.supabase
                        .from('chapters')
                        .select('castle_id');
                    
                    if (error) {
                        console.error('[CastleRepo] Error fetching chapters:', error);
                        return [];
                    }
                    console.log('[CastleRepo] Fetched chapter counts');
                    return data || [];
                }).catch(err => {
                    console.warn('[CastleRepo] Failed to fetch chapter counts (non-critical):', err.message);
                    return [];
                })
            ]);

            if (!castles || castles.length === 0) {
                console.warn('[CastleRepo] No castles found in database');
                return [];
            }

            // Count chapters per castle
            const chapterCountMap = {};
            if (chapterCounts) {
                chapterCounts.forEach(chapter => {
                    chapterCountMap[chapter.castle_id] = (chapterCountMap[chapter.castle_id] || 0) + 1;
                });
            }

            // Map castles with their progress
            return castles.map(castle => {
                const castleData = Castle.fromDatabase(castle).toJSON();
                const castleProgress = progress?.find(p => p.castle_id === castle.id);
                
                // Add chapter count
                castleData.total_chapters = chapterCountMap[castle.id] || 0;
                
                if (castleProgress) {
                    castleData.progress = {
                        id: castleProgress.id,
                        user_id: castleProgress.user_id,
                        castle_id: castleProgress.castle_id,
                        unlocked: castleProgress.unlocked,
                        completed: castleProgress.completed,
                        // Map total_xp_earned from database
                        total_xp_earned: castleProgress.total_xp_earned,
                        completion_percentage: castleProgress.completion_percentage,
                        started_at: castleProgress.started_at,
                        completed_at: castleProgress.completed_at
                    };
                }
                
                return castleData;
            });
        } catch (error) {
            console.error('[CastleRepo] Error in getAllCastlesWithUserProgress:', error);
            throw error;
        }
    }

    async getCastleByIdWithUserProgress(castleId, userId) {
        try {
            console.log('[CastleRepo] getCastleByIdWithUserProgress for castle:', castleId, 'user:', userId);
            
            // Use retry logic and fetch castle and progress in parallel
            const [castle, progress] = await Promise.all([
                // Get castle with retry
                this.withRetry(async () => {
                    const { data, error } = await this.supabase
                        .from(this.tableName)
                        .select('*')
                        .eq('id', castleId)
                        .single();
                    
                    if (error) throw error;
                    return data;
                }),
                
                // Get user progress with retry (may not exist)
                this.withRetry(async () => {
                    const { data, error } = await this.supabase
                        .from('user_castle_progress')
                        .select('*')
                        .eq('user_id', userId)
                        .eq('castle_id', castleId)
                        .maybeSingle();
                    
                    // PGRST116 means no rows found, which is ok
                    if (error && error.code !== 'PGRST116') throw error;
                    return data;
                })
            ]);

            if (!castle) return null;

            const castleData = Castle.fromDatabase(castle).toJSON();

            if (progress) {
                castleData.progress = {
                    id: progress.id,
                    user_id: progress.user_id,
                    castle_id: progress.castle_id,
                    unlocked: progress.unlocked,
                    completed: progress.completed,
                    // Map total_xp_earned from database
                    total_xp_earned: progress.total_xp_earned,
                    completion_percentage: progress.completion_percentage,
                    started_at: progress.started_at,
                    completed_at: progress.completed_at
                };
            }

            return castleData;
        } catch (error) {
            console.error('[CastleRepo] Error in getCastleByIdWithUserProgress:', error);
            throw error;
        }
    }
}

module.exports = CastleRepo;