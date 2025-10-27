const BaseRepo = require('./BaseRepo');

class CastleRepo extends BaseRepo {
  constructor(supabase) {
    super(supabase, 'castles');  // Make sure 'castles' is passed
  }

  /**
   * Find all castles
   */
  async findAll() {
    try {
      console.log('[CastleRepo] Finding all castles from table:', this.table);
      
      const { data, error } = await this.supabase
        .from('castles')  // Explicit table name
        .select('*')
        .order('unlock_order', { ascending: true });

      if (error) {
        console.error('[CastleRepo] Supabase error:', error);
        throw error;
      }
      
      console.log('[CastleRepo] Found castles:', data?.length || 0);
      return data || [];
    } catch (error) {
      console.error('[CastleRepo] Error finding all castles:', error);
      throw error;
    }
  }

  /**
   * Find castle by ID
   */
  async findById(id) {
    try {
      const { data, error } = await this.supabase
        .from('castles')  // Explicit table name
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[CastleRepo] Error finding castle by ID:', error);
      throw error;
    }
  }

  /**
   * Create new castle
   */
  async create(castleData) {
    try {
      const { data, error } = await this.supabase
        .from('castles')  // Explicit table name
        .insert(castleData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[CastleRepo] Error creating castle:', error);
      throw error;
    }
  }

  /**
   * Update castle
   */
  async update(id, castleData) {
    try {
      const { data, error } = await this.supabase
        .from('castles')  // Explicit table name
        .update(castleData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('[CastleRepo] Error updating castle:', error);
      throw error;
    }
  }

  /**
   * Delete castle
   */
  async delete(id) {
    try {
      const { error } = await this.supabase
        .from('castles')  // Explicit table name
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('[CastleRepo] Error deleting castle:', error);
      throw error;
    }
  }
}

module.exports = CastleRepo;