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
        .select('research_cohort') // ✅ FIX: Changed from 'cohort' to 'cohort_type'
        .eq('user_id', userId)
        .maybeSingle(); // ✅ FIX: Use maybeSingle instead of single

      if (error && error.code !== 'PGRST116') {
        console.warn('[CohortRepo] Error getting user cohort (non-critical):', error.message);
        return null;
      }
      return data?.research_cohort || null; // ✅ FIX: Changed from cohort to research_cohort
    } catch (error) {
      console.warn('[CohortRepo] Error getting user cohort (non-critical):', error.message);
      return null; // ✅ Non-blocking: Return null instead of throwing
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
        .select('research_cohort'); // ✅ FIX: Changed from 'cohort' to 'cohort_type'

      if (error) {
        console.warn('[CohortRepo] Error getting cohort counts (non-critical):', error.message);
        return { adaptive: 0, control: 0 };
      }

      const counts = { adaptive: 0, control: 0 };
      (data || []).forEach(row => {
        if (row.research_cohort === 'adaptive') counts.adaptive++; // ✅ FIX: cohort_type
        if (row.research_cohort === 'control') counts.control++; // ✅ FIX: cohort_type
      });

      return counts;
    } catch (error) {
      console.warn('[CohortRepo] Error getting cohort counts (non-critical):', error.message);
      return { adaptive: 0, control: 0 };
    }
  }

  /**
   * Assign user to balanced cohort using database function
   * ✅ FIX: Updated to use correct function name from database
   */
  async assignUserToBalancedCohort(userId) {
    try {
      // ✅ FIX: Changed from 'assign_user_to_cohort' to 'assign_user_to_balanced_cohort'
      const { data, error } = await this.supabase.rpc('assign_user_to_balanced_cohort', {
        p_user_id: userId
      });

      if (error) {
        console.warn('[CohortRepo] Error assigning cohort (non-critical):', error.message);
        // ✅ FIX: Don't throw - cohort assignment is optional for research
        return null;
      }
      return data;
    } catch (error) {
      console.warn('[CohortRepo] Error assigning user to cohort (non-critical):', error.message);
      // ✅ FIX: Return null instead of throwing - don't block topic loading
      return null;
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
          research_cohort: cohort, // ✅ FIX: Changed from 'cohort' to 'cohort_type'
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
