const BaseRepo = require('./BaseRepo');
const Castle = require('../../domain/models/Castle');

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
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data ? Castle.fromDatabase(data) : null;
        } catch (error) {
            console.error('[CastleRepo] Error in getCastleById:', error);
            throw error;
        }
    }

    async getAllCastles() {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .order('unlock_order', { ascending: true });

            if (error) throw error;
            return data.map(Castle.fromDatabase);
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
            
            // Get all castles
            const { data: castles, error: castlesError } = await this.supabase
                .from(this.tableName)
                .select('*')
                .order('unlock_order', { ascending: true });

            if (castlesError) {
                console.error('[CastleRepo] Error fetching castles:', castlesError);
                throw castlesError;
            }

            console.log('[CastleRepo] Fetched castles count:', castles?.length);

            // Get user progress for all castles
            const { data: progress, error: progressError } = await this.supabase
                .from('user_castle_progress')
                .select('*')
                .eq('user_id', userId);

            if (progressError) {
                console.error('[CastleRepo] Error fetching progress:', progressError);
                throw progressError;
            }

            console.log('[CastleRepo] Fetched progress count:', progress?.length);

            // Map castles with their progress
            return castles.map(castle => {
                const castleData = Castle.fromDatabase(castle).toJSON();
                const castleProgress = progress?.find(p => p.castle_id === castle.id);
                
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
            
            // Get castle
            const { data: castle, error: castleError } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('id', castleId)
                .single();

            if (castleError) throw castleError;
            if (!castle) return null;

            const castleData = Castle.fromDatabase(castle).toJSON();

            // Get user progress
            const { data: progress, error: progressError } = await this.supabase
                .from('user_castle_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('castle_id', castleId)
                .single();

            if (!progressError && progress) {
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