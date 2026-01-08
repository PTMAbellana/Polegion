/**
 * State Management Service
 * 
 * SINGLE RESPONSIBILITY: Manage Q-learning state representation
 * 
 * Extracted from AdaptiveLearningService to follow SRP.
 * Handles state discretization, epsilon calculation, and state key generation
 * for the Q-learning algorithm.
 */

class StateManagementService {
  constructor(options = {}) {
    this.INITIAL_EPSILON = options.initialEpsilon || 1.0;
    this.EPSILON_DECAY = options.epsilonDecay || 0.995;
    this.MIN_EPSILON = options.minEpsilon || 0.01;
  }

  /**
   * Generate state key for Q-table
   * Discretizes continuous state space into buckets
   * 
   * @param {Object} state - Current learning state
   * @returns {string} State key (e.g., "M2_D3_C1_W0")
   */
  getStateKey(state) {
    // Discretize mastery level into ranges
    const masteryBucket = Math.floor(state.mastery_level / 20); // 0-4 (0-20, 20-40, 40-60, 60-80, 80-100)
    
    // Discretize streaks (cap at 5+)
    const correctStreakBucket = Math.min(Math.floor(state.correct_streak / 2), 3); // 0, 1-2, 3-4, 5+
    const wrongStreakBucket = Math.min(state.wrong_streak, 3); // 0, 1, 2, 3+
    
    // Current difficulty level
    const difficulty = state.difficulty_level;
    
    // Create state key combining all features
    return `M${masteryBucket}_D${difficulty}_C${correctStreakBucket}_W${wrongStreakBucket}`;
  }

  /**
   * Calculate exploration rate (epsilon) based on attempt count
   * 
   * Formula: epsilon = max(MIN_EPSILON, INITIAL_EPSILON * EPSILON_DECAY^attempts)
   * 
   * Decays over time: start high (explore), end low (exploit)
   * 
   * @param {number} attemptCount - Total attempts made by student
   * @returns {number} Epsilon value (0.01 to 1.0)
   */
  getCurrentEpsilon(attemptCount) {
    return Math.max(
      this.MIN_EPSILON,
      this.INITIAL_EPSILON * Math.pow(this.EPSILON_DECAY, attemptCount)
    );
  }

  /**
   * Generate session ID for tracking (used for research logs)
   * 
   * @param {string} userId - User ID
   * @returns {string} Session ID based on date
   */
  generateSessionId(userId) {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `${userId}_${date}`;
  }
}

module.exports = StateManagementService;
