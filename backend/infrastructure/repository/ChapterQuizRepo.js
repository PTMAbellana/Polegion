const BaseRepo = require('./BaseRepo');
const ChapterQuiz = require('../../domain/models/ChapterQuiz');

class ChapterQuizRepo extends BaseRepo {
    async createChapterQuiz(data) {
        const insertData = {
            chapter_id: data.chapter_id,
            title: data.title,
            description: data.description,
            quiz_config: data.quiz_config,
            xp_reward: data.xp_reward,
            passing_score: data.passing_score,
            time_limit: data.time_limit
        };

        // Include custom ID if provided (for seeding)
        if (data.id) {
            insertData.id = data.id;
        }

        const { data: result, error } = await this.supabase
            .from('chapter_quizzes')
            .insert(insertData)
            .select()
            .single();
        
        if (error) throw error;
        return ChapterQuiz.fromDatabase(result);
    }

    async getChapterQuizById(id) {
        const { data, error } = await this.supabase
            .from('chapter_quizzes')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error && error.code !== 'PGRST116') throw error;
        return data ? ChapterQuiz.fromDatabase(data) : null;
    }

    async getChapterQuizzesByChapterId(chapterId) {
        const { data, error } = await this.supabase
            .from('chapter_quizzes')
            .select('*')
            .eq('chapter_id', chapterId);
        
        if (error) throw error;
        return data ? data.map(ChapterQuiz.fromDatabase) : [];
    }

    async getAllChapterQuizzes() {
        const { data, error } = await this.supabase
            .from('chapter_quizzes')
            .select('*');
        
        if (error) throw error;
        return data ? data.map(ChapterQuiz.fromDatabase) : [];
    }

    async updateChapterQuiz(id, updateData) {
        const { data, error } = await this.supabase
            .from('chapter_quizzes')
            .update({
                title: updateData.title,
                description: updateData.description,
                quiz_config: updateData.quiz_config,
                xp_reward: updateData.xp_reward,
                passing_score: updateData.passing_score,
                time_limit: updateData.time_limit
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? ChapterQuiz.fromDatabase(data) : null;
    }

    async deleteChapterQuiz(id) {
        const { data, error } = await this.supabase
            .from('chapter_quizzes')
            .delete()
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? ChapterQuiz.fromDatabase(data) : null;
    }
}

module.exports = ChapterQuizRepo;