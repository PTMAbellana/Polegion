const BaseRepo = require('../BaseRepo');
const UserCastleProgress = require('../../../domain/models/world/UserCastleProgress');

class UserCastleProgressRepo extends BaseRepo {
    async createUserCastleProgress(data) {
        return await this.withRetry(async () => {
            console.log('[UserCastleProgressRepo] Creating progress for user:', data.user_id, 'castle:', data.castle_id);
            
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
            
            // ✅ FIX: Handle duplicate key error (race condition)
            if (error) {
                if (error.code === '23505') { // PostgreSQL duplicate key error
                    console.warn('[UserCastleProgressRepo] Progress already exists (race condition), fetching existing');
                    const existing = await this.getUserCastleProgressByUserAndCastle(data.user_id, data.castle_id);
                    if (existing) {
                        return existing;
                    }
                    // If still not found, throw original error
                }
                
                console.error('[UserCastleProgressRepo] Insert error:', error);
                console.error('[UserCastleProgressRepo] Error code:', error.code);
                console.error('[UserCastleProgressRepo] Error details:', error.details);
                throw error;
            }
            
            console.log('[UserCastleProgressRepo] Successfully created progress');
            return UserCastleProgress.fromDatabase(result);
        });
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
        return await this.withRetry(async () => {
            const { data, error } = await this.supabase
                .from('user_castle_progress')
                .select('*')
                .eq('user_id', userId)
                .eq('castle_id', castleId)
                .maybeSingle();
            
            if (error) {
                console.error('[UserCastleProgressRepo] Error fetching progress:', error);
                throw error;
            }
            return data ? UserCastleProgress.fromDatabase(data) : null;
        });
    }

    async getAllUserCastleProgress() {
        return await this.withRetry(async () => {
            const { data, error } = await this.supabase
                .from('user_castle_progress')
                .select('*');
            
            if (error) {
                console.error('[UserCastleProgressRepo] Error fetching all progress:', error);
                throw error;
            }
            return (data || []).map(UserCastleProgress.fromDatabase);
        });
    }

    async updateUserCastleProgress(id, updateData) {
        // Build update object with only provided fields
        const updateObj = {};
        if (updateData.unlocked !== undefined) updateObj.unlocked = updateData.unlocked;
        if (updateData.completed !== undefined) updateObj.completed = updateData.completed;
        // Use total_xp_earned (correct database column name)
        if (updateData.total_xp_earned !== undefined) updateObj.total_xp_earned = updateData.total_xp_earned;
        if (updateData.completion_percentage !== undefined) updateObj.completion_percentage = updateData.completion_percentage;
        if (updateData.started_at !== undefined) updateObj.started_at = updateData.started_at;
        if (updateData.completed_at !== undefined) updateObj.completed_at = updateData.completed_at;
        
        const { data, error } = await this.supabase
            .from('user_castle_progress')
            .update(updateObj)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? UserCastleProgress.fromDatabase(data) : null;
    }

    async upsertUserCastleProgress(userId, castleId, updateData) {
        try {
            const { data, error } = await this.supabase
                .from('user_castle_progress')
                .upsert({
                    user_id: userId,
                    castle_id: castleId,
                    unlocked: updateData.unlocked,
                    completed: updateData.completed,
                    // Use total_xp_earned (correct database column name)
                    total_xp_earned: updateData.total_xp_earned,
                    completion_percentage: updateData.completion_percentage,
                    started_at: updateData.started_at,
                    completed_at: updateData.completed_at
                }, {
                    onConflict: 'user_id,castle_id'
                })
                .select()
                .single();
            
            // ✅ FIX: Handle RLS policy errors gracefully
            if (error) {
                if (error.code === '42501') { // RLS policy violation
                    console.warn('[UserCastleProgressRepo] RLS policy blocking upsert - attempting to fetch existing record');
                    // Try to fetch existing record - if it exists, user already has progress
                    const existing = await this.getUserCastleProgressByUserAndCastle(userId, castleId);
                    if (existing) {
                        console.log('[UserCastleProgressRepo] Found existing progress despite RLS error');
                        return existing;
                    }
                    // If no existing record, this is a genuine permissions issue
                    console.error('[UserCastleProgressRepo] RLS policy prevents creating castle progress - check Supabase RLS policies for user_castle_progress table');
                    throw error;
                }
                throw error;
            }
            return data ? UserCastleProgress.fromDatabase(data) : null;
        } catch (error) {
            console.error('[UserCastleProgressRepo] Error in upsertUserCastleProgress:', error);
            throw error;
        }
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