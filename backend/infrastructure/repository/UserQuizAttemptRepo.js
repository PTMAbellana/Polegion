const BaseRepo = require('./BaseRepo');
const UserQuizAttempt = require('../../domain/models/UserQuizAttempt');

class UserQuizAttemptRepo extends BaseRepo {
    async createUserQuizAttempt(data) {
        const { data: result, error } = await this.supabase
            .from('user_quiz_attempts')
            .insert({
                user_id: data.user_id,
                chapter_quiz_id: data.chapter_quiz_id,
                score: data.score,
                passing_score: data.passing_score,
                passed: data.passed,
                xp_earned: data.xp_earned || 0,
                answers: data.answers,
                time_taken: data.time_taken,
                attempt_number: data.attempt_number || 1,
                attempted_at: data.attempted_at || new Date().toISOString()
            })
            .select()
            .single();
        
        if (error) {
            console.error('Error creating quiz attempt:', error);
            throw error;
        }
        return UserQuizAttempt.fromDatabase(result);
    }

    async getUserQuizAttemptById(id) {
        const { data, error } = await this.supabase
            .from('user_quiz_attempts')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data ? UserQuizAttempt.fromDatabase(data) : null;
    }

    async getAllUserQuizAttempts() {
        const { data, error } = await this.supabase
            .from('user_quiz_attempts')
            .select('*');
        
        if (error) throw error;
        return data.map(UserQuizAttempt.fromDatabase);
    }

    async updateUserQuizAttempt(id, data) {
        const { data: result, error } = await this.supabase
            .from('user_quiz_attempts')
            .update({
                score: data.score,
                passing_score: data.passing_score,
                passed: data.passed,
                xp_earned: data.xp_earned,
                answers: data.answers,
                time_taken: data.time_taken,
                attempt_number: data.attempt_number,
                attempted_at: data.attempted_at
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return result ? UserQuizAttempt.fromDatabase(result) : null;
    }

    async deleteUserQuizAttempt(id) {
        const { data, error } = await this.supabase
            .from('user_quiz_attempts')
            .delete()
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? UserQuizAttempt.fromDatabase(data) : null;
    }

    get db() {
        return this.supabase;
    }
}

module.exports = UserQuizAttemptRepo;