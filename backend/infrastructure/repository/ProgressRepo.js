const BaseRepo = require('./BaseRepo');

class ProgressRepo extends BaseRepo {
    constructor(supabase) {
        super(supabase, 'user_castle_progress');
        this.castleProgressTable = 'user_castle_progress';
        this.chapterProgressTable = 'user_chapter_progress';
    }

    // ==================== CASTLE PROGRESS ====================
    
    async findCastleProgress(userId, castleId) {
        try {
            console.log(`[ProgressRepo] Finding castle progress for user ${userId}, castle ${castleId}`);
            
            const { data, error } = await this.supabase
                .from(this.castleProgressTable)
                .select('*')
                .eq('user_id', userId)
                .eq('castle_id', castleId)
                .maybeSingle();

            if (error) {
                console.error('[ProgressRepo] Error finding castle progress:', error);
                throw error;
            }

            console.log(`[ProgressRepo] Castle progress found:`, !!data);
            return data;
        } catch (error) {
            console.error('[ProgressRepo] Error in findCastleProgress:', error);
            throw error;
        }
    }

    async createCastleProgress(progressData) {
        try {
            console.log(`[ProgressRepo] Creating castle progress:`, {
                user_id: progressData.user_id,
                castle_id: progressData.castle_id,
                unlocked: progressData.unlocked
            });

            const { data, error } = await this.supabase
                .from(this.castleProgressTable)
                .insert(progressData)
                .select()
                .single();

            if (error) {
                console.error('[ProgressRepo] Error creating castle progress:', error);
                throw error;
            }

            console.log(`[ProgressRepo] ✅ Castle progress created:`, data.id);
            return data;
        } catch (error) {
            console.error('[ProgressRepo] Error in createCastleProgress:', error);
            throw error;
        }
    }

    async updateCastleProgress(userId, castleId, updates) {
        try {
            console.log(`[ProgressRepo] Updating castle progress:`, {
                user_id: userId,
                castle_id: castleId,
                updates
            });

            const { data, error } = await this.supabase
                .from(this.castleProgressTable)
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('castle_id', castleId)
                .select()
                .single();

            if (error) {
                console.error('[ProgressRepo] Error updating castle progress:', error);
                throw error;
            }

            console.log(`[ProgressRepo] ✅ Castle progress updated`);
            return data;
        } catch (error) {
            console.error('[ProgressRepo] Error in updateCastleProgress:', error);
            throw error;
        }
    }

    async findAllCastleProgress(userId) {
        try {
            console.log(`[ProgressRepo] Finding all castle progress for user ${userId}`);
            
            const { data, error } = await this.supabase
                .from(this.castleProgressTable)
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('[ProgressRepo] Error finding all castle progress:', error);
                throw error;
            }

            console.log(`[ProgressRepo] Found ${data?.length || 0} castle progress records`);
            return data || [];
        } catch (error) {
            console.error('[ProgressRepo] Error in findAllCastleProgress:', error);
            throw error;
        }
    }

    // ==================== CHAPTER PROGRESS ====================
    
    async findChapterProgress(userId, chapterId) {
        try {
            console.log(`[ProgressRepo] Finding chapter progress for user ${userId}, chapter ${chapterId}`);
            
            const { data, error } = await this.supabase
                .from(this.chapterProgressTable)
                .select('*')
                .eq('user_id', userId)
                .eq('chapter_id', chapterId)
                .maybeSingle();

            if (error) {
                console.error('[ProgressRepo] Error finding chapter progress:', error);
                throw error;
            }

            console.log(`[ProgressRepo] Chapter progress found:`, !!data);
            return data;
        } catch (error) {
            console.error('[ProgressRepo] Error in findChapterProgress:', error);
            throw error;
        }
    }

    async createChapterProgress(progressData) {
        try {
            console.log(`[ProgressRepo] Creating chapter progress:`, {
                user_id: progressData.user_id,
                chapter_id: progressData.chapter_id,
                unlocked: progressData.unlocked
            });

            const { data, error } = await this.supabase
                .from(this.chapterProgressTable)
                .insert(progressData)
                .select()
                .single();

            if (error) {
                console.error('[ProgressRepo] Error creating chapter progress:', error);
                throw error;
            }

            console.log(`[ProgressRepo] ✅ Chapter progress created:`, data.id);
            return data;
        } catch (error) {
            console.error('[ProgressRepo] Error in createChapterProgress:', error);
            throw error;
        }
    }

    async updateChapterProgress(userId, chapterId, updates) {
        try {
            console.log(`[ProgressRepo] Updating chapter progress:`, {
                user_id: userId,
                chapter_id: chapterId,
                updates
            });

            const { data, error } = await this.supabase
                .from(this.chapterProgressTable)
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('user_id', userId)
                .eq('chapter_id', chapterId)
                .select()
                .single();

            if (error) {
                console.error('[ProgressRepo] Error updating chapter progress:', error);
                throw error;
            }

            console.log(`[ProgressRepo] ✅ Chapter progress updated`);
            return data;
        } catch (error) {
            console.error('[ProgressRepo] Error in updateChapterProgress:', error);
            throw error;
        }
    }

    async createOrUpdateChapterProgress(progressData) {
        try {
            console.log(`[ProgressRepo] Creating or updating chapter progress:`, {
                user_id: progressData.user_id,
                chapter_id: progressData.chapter_id,
                unlocked: progressData.unlocked
            });

            const existing = await this.findChapterProgress(
                progressData.user_id,
                progressData.chapter_id
            );

            if (existing) {
                return await this.updateChapterProgress(existing.id, progressData);
            }

            return await this.createChapterProgress(progressData);
        } catch (error) {
            console.error('[ProgressRepo] Error in createOrUpdateChapterProgress:', error);
            throw error;
        }
    }

    async findAllChapterProgressForCastle(userId, castleId) {
        try {
            console.log(`[ProgressRepo] Finding all chapter progress for user ${userId}, castle ${castleId}`);
            
            // First get all chapters for this castle
            const { data: chapters, error: chaptersError } = await this.supabase
                .from('chapters')
                .select('id')
                .eq('castle_id', castleId);

            if (chaptersError) {
                console.error('[ProgressRepo] Error finding chapters:', chaptersError);
                throw chaptersError;
            }

            if (!chapters || chapters.length === 0) {
                console.log(`[ProgressRepo] No chapters found for castle ${castleId}`);
                return [];
            }

            const chapterIds = chapters.map(ch => ch.id);
            console.log(`[ProgressRepo] Found ${chapterIds.length} chapters, fetching progress...`);

            // Then get progress for those chapters
            const { data, error } = await this.supabase
                .from(this.chapterProgressTable)
                .select('*')
                .eq('user_id', userId)
                .in('chapter_id', chapterIds)
                .order('created_at', { ascending: true });

            if (error) {
                console.error('[ProgressRepo] Error finding chapter progress:', error);
                throw error;
            }

            console.log(`[ProgressRepo] Found ${data?.length || 0} chapter progress records`);
            return data || [];
        } catch (error) {
            console.error('[ProgressRepo] Error in findAllChapterProgressForCastle:', error);
            throw error;
        }
    }
}

module.exports = ProgressRepo;