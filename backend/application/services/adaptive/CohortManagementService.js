/**
 * Cohort Management Service
 * 
 * SINGLE RESPONSIBILITY: Manage research cohort assignments
 * 
 * Handles:
 * - Balanced cohort assignment (adaptive vs control)
 * - Cohort verification
 * - Assignment logging
 * - Fallback to adaptive mode
 */

class CohortManagementService {
  constructor(adaptiveLearningRepo) {
    this.repo = adaptiveLearningRepo;
  }

  /**
   * Ensure user has a cohort assignment
   * Assigns to balanced cohort if not already assigned
   * 
   * @param {string} userId - User UUID
   * @returns {Promise<string>} - 'adaptive' or 'control'
   */
  async ensureUserHasCohort(userId) {
    try {
      // Check if user already has cohort assignment
      const existingCohort = await this.repo.getUserCohort(userId);
      
      if (existingCohort) {
        console.log(`[CohortManagement] User ${userId} already in cohort: ${existingCohort}`);
        return existingCohort;
      }
      
      // Assign user to balanced cohort
      const assignedCohort = await this.repo.assignUserToBalancedCohort(userId);
      
      if (assignedCohort) {
        console.log(`[CohortManagement] User ${userId} assigned to cohort: ${assignedCohort}`);
        
        // Log cohort counts for monitoring (optional)
        try {
          const counts = await this.repo.getCohortCounts();
          console.log(`[CohortManagement] Current distribution - Adaptive: ${counts.adaptive}, Control: ${counts.control}`);
        } catch (countError) {
          // Ignore count errors
        }
      } else {
        console.log(`[CohortManagement] Could not assign cohort, defaulting to 'adaptive'`);
      }
      
      return assignedCohort || 'adaptive';
    } catch (error) {
      console.warn('[CohortManagement] Error in cohort assignment (non-critical):', error.message);
      // Fallback to 'adaptive' if assignment fails (system continues to work)
      return 'adaptive';
    }
  }

  /**
   * Get user's cohort for conditional feature enablement
   * 
   * @param {string} userId - User UUID
   * @returns {Promise<string>} - 'adaptive', 'control', or 'adaptive' (fallback)
   */
  async getUserCohort(userId) {
    try {
      const cohort = await this.repo.getUserCohort(userId);
      return cohort || 'adaptive'; // Default to adaptive if not assigned
    } catch (error) {
      console.error('[CohortManagement] Error getting user cohort:', error);
      return 'adaptive'; // Fallback to adaptive
    }
  }

  /**
   * Get cohort distribution statistics
   * 
   * @returns {Promise<Object>} - { adaptive: number, control: number }
   */
  async getCohortCounts() {
    try {
      return await this.repo.getCohortCounts();
    } catch (error) {
      console.error('[CohortManagement] Error getting cohort counts:', error);
      return { adaptive: 0, control: 0 };
    }
  }

  /**
   * Check if user is in adaptive cohort
   * 
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} - true if adaptive, false if control
   */
  async isAdaptiveCohort(userId) {
    const cohort = await this.getUserCohort(userId);
    return cohort === 'adaptive';
  }

  /**
   * Check if user is in control cohort
   * 
   * @param {string} userId - User UUID
   * @returns {Promise<boolean>} - true if control, false if adaptive
   */
  async isControlCohort(userId) {
    const cohort = await this.getUserCohort(userId);
    return cohort === 'control';
  }
}

module.exports = CohortManagementService;
