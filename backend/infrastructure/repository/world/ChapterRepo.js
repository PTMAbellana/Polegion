const BaseRepo = require('../BaseRepo');
const Chapter = require('../../../domain/models/world/Chapter');

class ChapterRepo extends BaseRepo {
    async createChapter(data) {
        const insertData = {
            castle_id: data.castle_id,
            title: data.title,
            description: data.description,
            chapter_number: data.chapter_number,
            xp_reward: data.xp_reward
        };

        // Include custom ID if provided (for seeding)
        if (data.id) {
            insertData.id = data.id;
        }

        const { data: result, error } = await this.supabase
            .from('chapters')
            .insert(insertData)
            .select()
            .single();
        
        if (error) throw error;
        return Chapter.fromDatabase(result);
    }

    async getChapterById(id) {
        try {
            return await this.withRetry(async () => {
                const { data, error } = await this.supabase
                    .from('chapters')
                    .select('*')
                    .eq('id', id)
                    .single();
                
                if (error && error.code !== 'PGRST116') {
                    console.error('[ChapterRepo] Error in getChapterById:', error);
                    throw error;
                }
                return data ? Chapter.fromDatabase(data) : null;
            });
        } catch (error) {
            console.error('[ChapterRepo] Failed to get chapter by id:', id, error);
            return null;
        }
    }

    async getChaptersByCastleId(castleId) {
        try {
            return await this.withRetry(async () => {
                const { data, error } = await this.supabase
                    .from('chapters')
                    .select('*')
                    .eq('castle_id', castleId)
                    .order('chapter_number', { ascending: true });
                
                if (error) {
                    console.error('[ChapterRepo] Error in getChaptersByCastleId:', error);
                    throw error;
                }
                
                console.log(`[ChapterRepo] Fetched ${data?.length || 0} chapters for castle ${castleId}`);
                return data ? data.map(Chapter.fromDatabase) : [];
            });
        } catch (error) {
            console.error('[ChapterRepo] Failed to get chapters for castle:', castleId, error);
            return [];
        }
    }

    async getAllChapters() {
        const { data, error } = await this.supabase
            .from('chapters')
            .select('*')
            .order('chapter_number', { ascending: true });
        
        if (error) throw error;
        return data ? data.map(Chapter.fromDatabase) : [];
    }

    async updateChapter(id, data) {
        const { data: result, error } = await this.supabase
            .from('chapters')
            .update({
                title: data.title,
                description: data.description,
                chapter_number: data.chapter_number,
                xp_reward: data.xp_reward
            })
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return result ? Chapter.fromDatabase(result) : null;
    }

    async deleteChapter(id) {
        const { data, error } = await this.supabase
            .from('chapters')
            .delete()
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data ? Chapter.fromDatabase(data) : null;
    }
}

module.exports = ChapterRepo;