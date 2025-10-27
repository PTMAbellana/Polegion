const BaseRepo = require('./BaseRepo');

class ChapterRepo extends BaseRepo {
  constructor(supabase) {
    super(supabase, 'chapters');
  }

  /**
   * Find all chapters for a castle
   */
  async findByCastleId(castleId) {
    try {
      console.log('[ChapterRepo] Finding chapters for castle:', castleId);
      
      const { data, error } = await this.supabase
        .from('chapters')
        .select('*')
        .eq('castle_id', castleId)
        .order('chapter_number', { ascending: true });

      if (error) {
        console.error('[ChapterRepo] Supabase error:', error);
        throw error;
      }
      
      console.log('[ChapterRepo] Found chapters:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('[ChapterRepo] Error finding chapters by castle ID:', error);
      throw error;
    }
  }

  /**
   * Find chapter by ID
   */
  async findById(id) {
    try {
      const { data, error } = await this.supabase
        .from('chapters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[ChapterRepo] Error finding chapter by ID:', error);
      throw error;
    }
  }

  /**
   * Create new chapter
   */
  async create(chapterData) {
    try {
      const { data, error } = await this.supabase
        .from('chapters')
        .insert(chapterData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[ChapterRepo] Error creating chapter:', error);
      throw error;
    }
  }

  /**
   * Update chapter
   */
  async update(id, chapterData) {
    try {
      const { data, error } = await this.supabase
        .from('chapters')
        .update(chapterData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[ChapterRepo] Error updating chapter:', error);
      throw error;
    }
  }

  /**
   * Delete chapter
   */
  async delete(id) {
    try {
      const { error } = await this.supabase
        .from('chapters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('[ChapterRepo] Error deleting chapter:', error);
      throw error;
    }
  }

  /**
   * Get chapter count for a castle
   */
  async getChapterCount(castleId) {
    try {
      const { count, error } = await this.supabase
        .from('chapters')
        .select('*', { count: 'exact', head: true })
        .eq('castle_id', castleId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('[ChapterRepo] Error getting chapter count:', error);
      throw error;
    }
  }
}

module.exports = ChapterRepo;