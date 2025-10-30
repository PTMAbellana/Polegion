const BaseRepo = require('./BaseRepo');
const UserCastleProgress = require('../../domain/models/UserCastleProgress');

class UserCastleProgressRepo extends BaseRepo {
    async createUserCastleProgress(data) {
        const { data: result, error } = await this.supabase
            .from('user_castle_progress')
            .insert({
                user_id: data.user_id,
                castle_id: data.castle_id,
                unlocked: data.unlocked,
                completed: data.completed,
                total_xp_earned: data.total_xp_earned,
                completion_percentage: data.completion_percentage,
                started_at: data.started_at,
                completed_at: data.completed_at
            })
            .select()
            .single();
        
        if (error) throw error;
        return UserCastleProgress.fromDatabase(result);
    }

    async getUserCastleProgressById(id) {
        const { data, error } = await this.supabase
            .from('user_castle_progress')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data ? UserCastleProgress.fromDatabase(data) : null;
    }

    async getUserCastleProgressByUserAndCastle(userId, castleId) {
        const { data, error } = await this.supabase
            .from('user_castle_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('castle_id', castleId)
            .maybeSingle();
        
        if (error) throw error;
        return data ? UserCastleProgress.fromDatabase(data) : null;
    }

    async getAllUserCastleProgress() {
        const { data, error } = await this.supabase
            .from('user_castle_progress')
            .select('*');
        
        if (error) throw error;
        return data.map(UserCastleProgress.fromDatabase);
    }

    async updateUserCastleProgress(id, updateData) {
        const { data, error } = await this.supabase
            .from('user_castle_progress')
            .update({
                unlocked: updateData.unlocked,
                completed: updateData.completed,
                total_xp_earned: updateData.total_xp_earned,
                completion_percentage: updateData.completion_percentage,
                started_at: updateData.started_at,
                completed_at: updateData.completed_at
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? UserCastleProgress.fromDatabase(data) : null;
    }

    async upsertUserCastleProgress(userId, castleId, updateData) {
        const { data, error } = await this.supabase
            .from('user_castle_progress')
            .upsert({
                user_id: userId,
                castle_id: castleId,
                unlocked: updateData.unlocked,
                completed: updateData.completed,
                total_xp_earned: updateData.total_xp_earned,
                completion_percentage: updateData.completion_percentage,
                started_at: updateData.started_at,
                completed_at: updateData.completed_at
            }, {
                onConflict: 'user_id,castle_id'
            })
            .select()
            .single();
        
        if (error) throw error;
        return data ? UserCastleProgress.fromDatabase(data) : null;
    }

    async deleteUserCastleProgress(id) {
        const { data, error } = await this.supabase
            .from('user_castle_progress')
            .delete()
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? UserCastleProgress.fromDatabase(data) : null;
    }
}

module.exports = UserCastleProgressRepo;