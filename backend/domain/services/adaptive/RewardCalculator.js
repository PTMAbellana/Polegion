/**
 * Reward Calculator Domain Service
 * Encapsulates educational reward logic for reinforcement learning
 * Based on learning psychology and pedagogical principles
 */
class RewardCalculator {
  constructor() {
    this.REWARDS = {
      // Positive outcomes
      ADVANCE_WITH_MASTERY: 10,           // Student ready to progress
      OPTIMAL_CHALLENGE_ZONE: 7,          // "Flow state" - just right difficulty
      IMPROVED_AFTER_STRATEGY: 3,         // Strategy change helped
      CORRECT_ANSWER: 2,                  // Basic positive reinforcement
      MAINTAINED_HIGH_MASTERY: 3,         // Student maintaining excellence
      RAPID_MASTERY: 8,                   // Fast improvement
      MASTERY_IMPROVED: 5,                // Positive mastery change reward

      // Negative outcomes (pedagogical failures)
      BOREDOM: -3,                        // Too easy, long correct streak
      FRUSTRATION: -5,                    // Too hard, repeated failures
      POOR_ADAPTATION: -7,                // Repeating failures with no strategy change
      MASTERY_DECREASED: -2,              // Regression
      MISCONCEPTION_REPEATED: -6          // Same error pattern without intervention
    };
  }

  /**
   * Calculate reward based on answer correctness and state change
   */
  calculateReward(currentState, newState, wasCorrect, reward = 0) {
    let baseReward = wasCorrect ? this.REWARDS.CORRECT_ANSWER : -1;

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

    // Penalize frustration (multiple wrong answers)
    // FIX #8: Scale penalty by mastery - beginners (<30%) get gentler treatment
    if (!wasCorrect && newState.wrongStreak >= 3) {
      const masteryLevel = newState.mastery?.value || 0;
      if (masteryLevel < 30) {
        // Beginners: gentle penalty to avoid discouragement
        baseReward += Math.max(this.REWARDS.FRUSTRATION * 0.4, -2); // Max -2 instead of -5
      } else {
        // Experienced students: full penalty
        baseReward += this.REWARDS.FRUSTRATION;
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
   * Calculate reward for strategy/representation change
   */
  calculateStrategyChangeReward(wasStrategyChanged, improved) {
    if (wasStrategyChanged && improved) {
      return this.REWARDS.IMPROVED_AFTER_STRATEGY;
    }
    if (wasStrategyChanged && !improved) {
      return this.REWARDS.POOR_ADAPTATION;
    }
    return 0;
  }

  /**
   * Detect misconception (same error pattern)
   */
  detectMisconception(previousErrors, currentError) {
    if (!previousErrors || previousErrors.length === 0) {
      return false;
    }

    // Check if current error matches recent errors
    const recentErrors = previousErrors.slice(-3);
    return recentErrors.some(error => this.isSameErrorPattern(error, currentError));
  }

  /**
   * Check if two errors are of the same type
   */
  isSameErrorPattern(error1, error2) {
    // Simple string matching; in production, could be more sophisticated
    return error1 && error2 && error1.type === error2.type;
  }

  /**
   * Calculate penalty for repeated misconception
   */
  calculateMisconceptionPenalty(misconceptionCount) {
    // First misconception: small penalty
    // Repeated misconceptions: increasing penalty
    return -Math.min(misconceptionCount * 2, this.REWARDS.MISCONCEPTION_REPEATED);
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
