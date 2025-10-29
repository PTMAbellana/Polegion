const BaseRepo = require('./BaseRepo');

class ChapterRepo extends BaseRepo {
    constructor(supabase) {
        super(supabase, 'chapters'); // ✅ Pass 'chapters' to BaseRepo
        this.tableName = 'chapters'; // ✅ Explicitly set tableName
    }

    async findByCastleId(castleId) {
        try {
            console.log(`[ChapterRepo] Finding chapters for castle ${castleId}`);
            console.log(`[ChapterRepo] Using table: ${this.tableName}`); // Debug log
            
            const { data, error } = await this.supabase
                .from('chapters') // ✅ Use hardcoded table name to be safe
                .select('*')
                .eq('castle_id', castleId)
                .order('chapter_number', { ascending: true });

            if (error) {
                console.error('[ChapterRepo] Error finding chapters:', error);
                throw error;
            }

            console.log(`[ChapterRepo] Found ${data?.length || 0} chapters`);
            return data || [];
        } catch (error) {
            console.error('[ChapterRepo] Error in findByCastleId:', error);
            throw error;
        }
    }

    async findById(chapterId) {
        try {
            console.log(`[ChapterRepo] Finding chapter ${chapterId}`);
            
            const { data, error } = await this.supabase
                .from('chapters') // ✅ Use hardcoded table name
                .select('*')
                .eq('id', chapterId)
                .single();

            if (error) {
                console.error('[ChapterRepo] Error finding chapter:', error);
                throw error;
            }

            console.log(`[ChapterRepo] Chapter found:`, !!data);
            return data;
        } catch (error) {
            console.error('[ChapterRepo] Error in findById:', error);
            throw error;
        }
    }

    async create(chapterData) {
        try {
            console.log(`[ChapterRepo] Creating chapter:`, chapterData.title);
            
            const { data, error } = await this.supabase
                .from('chapters')
                .insert(chapterData)
                .select()
                .single();

            if (error) {
                console.error('[ChapterRepo] Error creating chapter:', error);
                throw error;
            }

            console.log(`[ChapterRepo] ✅ Chapter created:`, data.id);
            return data;
        } catch (error) {
            console.error('[ChapterRepo] Error in create:', error);
            throw error;
        }
    }

    async update(chapterId, updates) {
        try {
            console.log(`[ChapterRepo] Updating chapter ${chapterId}`);
            
            const { data, error } = await this.supabase
                .from('chapters')
                .update(updates)
                .eq('id', chapterId)
                .select()
                .single();

            if (error) {
                console.error('[ChapterRepo] Error updating chapter:', error);
                throw error;
            }

            console.log(`[ChapterRepo] ✅ Chapter updated`);
            return data;
        } catch (error) {
            console.error('[ChapterRepo] Error in update:', error);
            throw error;
        }
    }

    async delete(chapterId) {
        try {
            console.log(`[ChapterRepo] Deleting chapter ${chapterId}`);
            
            const { error } = await this.supabase
                .from('chapters')
                .delete()
                .eq('id', chapterId);

            if (error) {
                console.error('[ChapterRepo] Error deleting chapter:', error);
                throw error;
            }

            console.log(`[ChapterRepo] ✅ Chapter deleted`);
            return true;
        } catch (error) {
            console.error('[ChapterRepo] Error in delete:', error);
            throw error;
        }
    }

    async findAll() {
        try {
            console.log(`[ChapterRepo] Finding all chapters`);
            
            const { data, error } = await this.supabase
                .from('chapters')
                .select('*')
                .order('castle_id', { ascending: true })
                .order('chapter_number', { ascending: true });

            if (error) {
                console.error('[ChapterRepo] Error finding all chapters:', error);
                throw error;
            }

            console.log(`[ChapterRepo] Found ${data?.length || 0} chapters`);
            return data || [];
        } catch (error) {
            console.error('[ChapterRepo] Error in findAll:', error);
            throw error;
        }
    }

    async findNextChapter(castleId, currentChapterNumber) {
        try {
            console.log(`[ChapterRepo] Finding next chapter for castle ${castleId}, current chapter number ${currentChapterNumber}`);
            
            const { data, error } = await this.supabase
                .from('chapters')
                .select('*')
                .eq('castle_id', castleId)
                .eq('chapter_number', currentChapterNumber + 1)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('[ChapterRepo] Error finding next chapter:', error);
                throw error;
            }

            console.log(`[ChapterRepo] Next chapter found:`, !!data);
            return data;
        } catch (error) {
            console.error('[ChapterRepo] Error in findNextChapter:', error);
            throw error;
        }
    }
}

module.exports = ChapterRepo;