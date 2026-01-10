/**
 * Reward Calculator Domain Service
 * Encapsulates educational reward logic for reinforcement learning
 * Based on learning psychology and pedagogical principles
 * 
 * RESEARCH-ALIGNED REWARD STRUCTURE:
 * - Correct on 1st try: +8 to +10 (demonstrates understanding)
 * - Correct after hint: +4 to +6 (learned with scaffolding)
 * - Wrong answer: -3 to -5 (indicates knowledge gap)
 * - Mastery milestone: +10 (major achievement)
 * - Frustration pattern: -8 (pedagogical failure)
 */
class RewardCalculator {
  constructor() {
    this.REWARDS = {
      // Positive outcomes
      ADVANCE_WITH_MASTERY: 10,           // Student ready to progress
      OPTIMAL_CHALLENGE_ZONE: 7,          // "Flow state" - just right difficulty
      IMPROVED_AFTER_STRATEGY: 3,         // Strategy change helped
      
      // Context-dependent correct answer rewards
      CORRECT_FIRST_TRY: 10,              // ★ High reward: demonstrates understanding
      CORRECT_AFTER_HINT: 6,              // ★ Moderate reward: learned with scaffolding
      CORRECT_AFTER_RETRY: 4,             // ★ Low reward: perseverance but struggled
      CORRECT_ANSWER: 2,                  // Basic positive reinforcement (legacy)
      
      MAINTAINED_HIGH_MASTERY: 3,         // Student maintaining excellence
      RAPID_MASTERY: 8,                   // Fast improvement
      MASTERY_IMPROVED: 5,                // Positive mastery change reward

      // Negative outcomes (pedagogical failures)
      BOREDOM: -3,                        // Too easy, long correct streak
      FRUSTRATION: -8,                    // ★ INCREASED: Too hard, repeated failures
      MASTERY_DECREASED: -2,              // Regression
      WRONG_ANSWER: -4                    // Base wrong answer penalty
    };
  }

  /**
   * Calculate reward based on answer correctness and attempt context
   * NOW CONSIDERS: First try vs retry vs hint usage
   * 
   * @param {Object} currentState - State before answer
   * @param {Object} newState - State after answer
   * @param {boolean} wasCorrect - Whether answer was correct
   * @param {number} reward - Override reward (if specified)
   * @returns {number} Calculated reward value
   */
  calculateReward(currentState, newState, wasCorrect, reward = 0) {
    let baseReward = 0;
    
    // Determine attempt context
    const correctStreak = newState.correctStreak || 0;
    const wrongStreak = newState.wrongStreak || 0;
    const isFirstTry = correctStreak >= 1 && wrongStreak === 0;
    const usedHint = wrongStreak >= 2;
    
    if (wasCorrect) {
      // Apply context-dependent reward
      if (isFirstTry) {
        baseReward = this.REWARDS.CORRECT_FIRST_TRY; // +10
      } else if (usedHint && wrongStreak === 1) {
        baseReward = this.REWARDS.CORRECT_AFTER_HINT; // +6
      } else if (wrongStreak >= 2) {
        baseReward = this.REWARDS.CORRECT_AFTER_RETRY; // +4
      } else {
        baseReward = this.REWARDS.CORRECT_ANSWER; // +2 (fallback)
      }
    } else {
      baseReward = this.REWARDS.WRONG_ANSWER; // -4
    }

    // Adjust for mastery improvement
    const masteryChange = newState.mastery.value - currentState.mastery.value;
    if (masteryChange > 10) {
      baseReward += this.REWARDS.RAPID_MASTERY;
    } else if (masteryChange > 5) {
      baseReward += this.REWARDS.MASTERY_IMPROVED;
    } else if (masteryChange < -5) {
      baseReward += this.REWARDS.MASTERY_DECREASED;
    }

    // Adjust for difficulty appropriateness
    if (wasCorrect && currentState.difficulty.level >= 2) {
      baseReward += this.REWARDS.OPTIMAL_CHALLENGE_ZONE;
    }

    // Penalize frustration (multiple wrong answers) - INCREASED TO -8
    // FIX #8: Scale penalty by mastery - beginners (<30%) get gentler treatment
    if (!wasCorrect && newState.wrongStreak >= 3) {
      const masteryLevel = newState.mastery?.value || 0;
      if (masteryLevel < 30) {
        // Beginners: gentle penalty to avoid discouragement
        baseReward += Math.max(this.REWARDS.FRUSTRATION * 0.4, -3); // Max -3 instead of -8
      } else {
        // Experienced students: full penalty
        baseReward += this.REWARDS.FRUSTRATION; // -8
      }
    }

    // Penalize boredom (too easy, too many correct)
    if (wasCorrect && currentState.correctStreak > 10 && currentState.difficulty.level === 1) {
      baseReward += this.REWARDS.BOREDOM;
    }

    // Reward advancing to next topic
    if (newState.isReadyToAdvance() && !currentState.isReadyToAdvance()) {
      baseReward += this.REWARDS.ADVANCE_WITH_MASTERY;
    }

    // Apply any override reward
    if (reward !== 0) {
      baseReward = reward;
    }

    return baseReward;
  }

  /**
   * Calculate reward for difficulty change
   */
  calculateDifficultyReward(currentDifficulty, newDifficulty, isCorrect) {
    let reward = 0;

    if (isCorrect && newDifficulty.level > currentDifficulty.level) {
      // Rewarding successful difficulty increase
      reward = this.REWARDS.OPTIMAL_CHALLENGE_ZONE;
    } else if (!isCorrect && newDifficulty.level < currentDifficulty.level) {
      // Penalizing difficulty decrease due to failure
      reward = this.REWARDS.FRUSTRATION;
    }

    return reward;
  }

  /**
   * Clamp reward to reasonable bounds
   */
  clampReward(reward) {
    return Math.max(-10, Math.min(reward, 10));
  }

  /**
   * Get reward label for logging
   */
  getRewardLabel(reward) {
    if (reward > 8) return 'Excellent';
    if (reward > 5) return 'Good';
    if (reward > 0) return 'Positive';
    if (reward === 0) return 'Neutral';
    if (reward > -5) return 'Minor Penalty';
    return 'Major Penalty';
  }
}

module.exports = RewardCalculator;
