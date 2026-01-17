/**
 * CohortRepository
 * Handles A/B testing cohort assignments for research
 */
class CohortRepository {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Get user's research cohort assignment
   * @returns {string|null} 'adaptive', 'control', or null if not assigned
   */
  async getUserCohort(userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_research_cohort')
        .select('cohort')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.cohort || null;
    } catch (error) {
      console.error('Error getting user cohort:', error);
      return null;
    }
  }

  /**
   * Get current cohort counts for balancing
   * @returns {Object} { adaptive: number, control: number }
   */
  async getCohortCounts() {
    try {
      const { data, error } = await this.supabase
        .from('user_research_cohort')
        .select('cohort');

      if (error) throw error;

      const counts = { adaptive: 0, control: 0 };
      (data || []).forEach(row => {
        if (row.cohort === 'adaptive') counts.adaptive++;
        if (row.cohort === 'control') counts.control++;
      });

      return counts;
    } catch (error) {
      console.error('Error getting cohort counts:', error);
      return { adaptive: 0, control: 0 };
    }
  }

  /**
   * Assign user to balanced cohort using database function
   */
  async assignUserToBalancedCohort(userId) {
    try {
      const { data, error } = await this.supabase.rpc('assign_user_to_cohort', {
        p_user_id: userId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error assigning user to cohort:', error);
      throw error;
    }
  }

  /**
   * Manually set user cohort (admin override)
   */
  async setUserCohort(userId, cohort) {
    try {
      if (!['adaptive', 'control'].includes(cohort)) {
        throw new Error('Invalid cohort type. Must be "adaptive" or "control"');
      }

      const { data, error } = await this.supabase
        .from('user_research_cohort')
        .upsert({
          user_id: userId,
          cohort: cohort,
          assigned_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;
      console.log(`[Cohort] User ${userId} assigned to ${cohort} cohort`);
      return data;
    } catch (error) {
      console.error('Error setting user cohort:', error);
      throw error;
    }
  }
}

module.exports = CohortRepository;
