const BaseRepo = require('./BaseRepo');

class ProgressRepo extends BaseRepo {
  constructor(supabase) {
    super(supabase, 'user_castle_progress'); // Fixed table name
  }

  /**
   * Find all castle progress for a user
   */
  async findByUserId(userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_castle_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[ProgressRepo] Error finding progress by user ID:', error);
      throw error;
    }
  }

  /**
   * Find castle progress for a specific user and castle
   */
  async findByCastleAndUser(castleId, userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_castle_progress')
        .select('*')
        .eq('castle_id', castleId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      console.error('[ProgressRepo] Error finding castle progress:', error);
      throw error;
    }
  }

  /**
   * Find all chapter progress for a user
   */
  async findChapterProgressByUser(userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_chapter_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('[ProgressRepo] Error finding chapter progress:', error);
      throw error;
    }
  }

  /**
   * Create or update castle progress
   */
  async upsertCastleProgress(progressData) {
    try {
      const { data, error } = await this.supabase
        .from('user_castle_progress')
        .upsert(progressData, {
          onConflict: 'user_id,castle_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[ProgressRepo] Error upserting castle progress:', error);
      throw error;
    }
  }

  /**
   * Create or update chapter progress
   */
  async upsertChapterProgress(progressData) {
    try {
      const { data, error } = await this.supabase
        .from('user_chapter_progress')
        .upsert(progressData, {
          onConflict: 'user_id,chapter_id'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[ProgressRepo] Error upserting chapter progress:', error);
      throw error;
    }
  }

  /**
   * Update castle progress percentage
   */
  async updateCastleProgressPercentage(userId, castleId, percentage, xpEarned) {
    try {
      const { data, error } = await this.supabase
        .from('user_castle_progress')
        .update({
          completion_percentage: percentage,
          total_xp_earned: xpEarned,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('castle_id', castleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[ProgressRepo] Error updating castle progress percentage:', error);
      throw error;
    }
  }

  /**
   * Mark castle as completed
   */
  async completeCastle(userId, castleId) {
    try {
      const { data, error } = await this.supabase
        .from('user_castle_progress')
        .update({
          completed: true,
          completion_percentage: 100,
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('castle_id', castleId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[ProgressRepo] Error completing castle:', error);
      throw error;
    }
  }

  /**
   * Unlock a castle for a user
   */
  async unlockCastle(userId, castleId) {
    try {
      // Check if progress exists
      const existing = await this.findByCastleAndUser(castleId, userId);

      if (existing) {
        // Update existing record
        const { data, error } = await this.supabase
          .from('user_castle_progress')
          .update({
            unlocked: true,
            started_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('castle_id', castleId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new record
        const { data, error } = await this.supabase
          .from('user_castle_progress')
          .insert({
            user_id: userId,
            castle_id: castleId,
            unlocked: true,
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('[ProgressRepo] Error unlocking castle:', error);
      throw error;
    }
  }
}

module.exports = ProgressRepo;