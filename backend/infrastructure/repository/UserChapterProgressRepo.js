const BaseRepo = require('./BaseRepo');
const UserChapterProgress = require('../../domain/models/UserChapterProgress');

class UserChapterProgressRepo extends BaseRepo {
    async createUserChapterProgress(data) {
        const { data: result, error } = await this.supabase
            .from('user_chapter_progress')
            .insert({
                user_id: data.user_id,
                chapter_id: data.chapter_id,
                unlocked: data.unlocked || false,
                completed: data.completed || false,
                xp_earned: data.xp_earned || 0,
                quiz_passed: data.quiz_passed || false,
                started_at: data.started_at || null,
                completed_at: data.completed_at || null
            })
            .select()
            .single();
        
        if (error) throw error;
        return UserChapterProgress.fromDatabase(result);
    }

    async getUserChapterProgressById(id) {
        const { data, error } = await this.supabase
            .from('user_chapter_progress')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data ? UserChapterProgress.fromDatabase(data) : null;
    }

    async getUserChapterProgressByUserAndChapter(userId, chapterId) {
        const { data, error } = await this.supabase
            .from('user_chapter_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('chapter_id', chapterId)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data ? UserChapterProgress.fromDatabase(data) : null;
    }

    async getAllUserChapterProgressByUser(userId) {
        const { data, error } = await this.supabase
            .from('user_chapter_progress')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        return data ? data.map(UserChapterProgress.fromDatabase) : [];
    }

    async getAllUserChapterProgress() {
        const { data, error } = await this.supabase
            .from('user_chapter_progress')
            .select('*');
        
        if (error) throw error;
        return data ? data.map(UserChapterProgress.fromDatabase) : [];
    }

    async updateUserChapterProgress(id, data) {
        const updateData = {};
        if (data.unlocked !== undefined) updateData.unlocked = data.unlocked;
        if (data.completed !== undefined) updateData.completed = data.completed;
        if (data.xp_earned !== undefined) updateData.xp_earned = data.xp_earned;
        if (data.quiz_passed !== undefined) updateData.quiz_passed = data.quiz_passed;
        if (data.started_at !== undefined) updateData.started_at = data.started_at;
        if (data.completed_at !== undefined) updateData.completed_at = data.completed_at;
        
        updateData.updated_at = new Date().toISOString();

        const { data: result, error } = await this.supabase
            .from('user_chapter_progress')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return result ? UserChapterProgress.fromDatabase(result) : null;
    }

    async deleteUserChapterProgress(id) {
        const { data, error } = await this.supabase
            .from('user_chapter_progress')
            .delete()
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? UserChapterProgress.fromDatabase(data) : null;
    }
}

module.exports = UserChapterProgressRepo;