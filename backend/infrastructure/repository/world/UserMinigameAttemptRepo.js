const BaseRepo = require('../BaseRepo');
const UserMinigameAttempt = require('../../../domain/models/world/UserMinigameAttempt');

class UserMinigameAttemptRepo extends BaseRepo {
    async createUserMinigameAttempt(data) {
        const { data: result, error } = await this.supabase
            .from('user_minigame_attempts')
            .insert({
                user_id: data.user_id,
                minigame_id: data.minigame_id,
                score: data.score,
                time_taken: data.time_taken,
                xp_earned: data.xp_earned || 0,
                completed: data.completed || false,
                attempt_data: data.attempt_data,
                attempted_at: data.attempted_at || new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) {
            console.error('Error creating minigame attempt:', error);
            throw error;
        }
        return UserMinigameAttempt.fromDatabase(result);
    }

    async getUserMinigameAttemptById(id) {
        const { data, error } = await this.supabase
            .from('user_minigame_attempts')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data ? UserMinigameAttempt.fromDatabase(data) : null;
    }

    async getAllUserMinigameAttempts() {
        const { data, error } = await this.supabase
            .from('user_minigame_attempts')
            .select('*');
        
        if (error) throw error;
        return data.map(UserMinigameAttempt.fromDatabase);
    }

    async updateUserMinigameAttempt(id, data) {
        const { data: result, error } = await this.supabase
            .from('user_minigame_attempts')
            .update({
                score: data.score,
                time_taken: data.time_taken,
                xp_earned: data.xp_earned,
                completed: data.completed,
                attempt_data: data.attempt_data,
                attempted_at: data.attempted_at
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return result ? UserMinigameAttempt.fromDatabase(result) : null;
    }

    async deleteUserMinigameAttempt(id) {
        const { data, error } = await this.supabase
            .from('user_minigame_attempts')
            .delete()
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? UserMinigameAttempt.fromDatabase(data) : null;
    }
}

module.exports = UserMinigameAttemptRepo;