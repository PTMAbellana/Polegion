/**
 * Q-Learning Policy Domain Service
 * Encapsulates the core Q-learning algorithm logic
 * Pure business logic with no external dependencies
 */
class QLearningPolicy {
  constructor(options = {}) {
    // Q-Learning Parameters (Research-backed from IJRISS & EduQate papers)
    this.LEARNING_RATE = options.learningRate || 0.1;       // Alpha
    this.DISCOUNT_FACTOR = options.discountFactor || 0.95;  // Gamma
    this.INITIAL_EPSILON = options.initialEpsilon || 1.0;
    this.EPSILON_DECAY = options.epsilonDecay || 0.995;
    this.MIN_EPSILON = options.minEpsilon || 0.01;

    // Available actions in MDP
    this.ACTIONS = {
      DECREASE_DIFFICULTY: 'decrease_difficulty',
      MAINTAIN_DIFFICULTY: 'maintain_difficulty',
      INCREASE_DIFFICULTY: 'increase_difficulty',
      REPEAT_DIFFERENT_REPRESENTATION: 'repeat_same_concept_different_representation',
      SWITCH_TO_VISUAL: 'switch_to_visual_example',
      SWITCH_TO_REAL_WORLD: 'switch_to_real_world_context',
      GIVE_HINT_RETRY: 'give_hint_then_retry',
      ADVANCE_TOPIC: 'advance_to_next_topic',
      REVIEW_PREREQUISITE: 'review_prerequisite_topic',
      REPEAT_CURRENT: 'repeat_current'
    };
  }

  /**
   * Calculate exploration rate (epsilon) based on attempt count
   * Decays over time: start high (explore), end low (exploit)
   */
  calculateEpsilon(attemptCount) {
    return Math.max(
      this.MIN_EPSILON,
      this.INITIAL_EPSILON * Math.pow(this.EPSILON_DECAY, attemptCount)
    );
  }

  /**
   * Epsilon-greedy action selection
   * Explore with probability epsilon, exploit with probability (1-epsilon)
   */
  selectAction(stateKey, qValues, explorationRate) {
    if (Math.random() < explorationRate) {
      // Exploration: random action
      const actions = Object.values(this.ACTIONS);
      return actions[Math.floor(Math.random() * actions.length)];
    } else {
      // Exploitation: best action
      let bestAction = null;
      let bestQ = -Infinity;

      for (const action of Object.values(this.ACTIONS)) {
        const q = qValues[action] || 0;
        if (q > bestQ) {
          bestQ = q;
          bestAction = action;
        }
      }

      return bestAction || this.ACTIONS.MAINTAIN_DIFFICULTY;
    }
  }

  /**
   * Bellman equation: Update Q-value based on reward and next state
   * Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
   *
   * Parameters:
   *   currentQ: Current Q-value for state-action pair
   *   reward: Immediate reward from this transition
   *   nextMaxQ: Best Q-value in the next state (max over all actions)
   *
   * Returns: New Q-value after learning
   */
  updateQValue(currentQ, reward, nextMaxQ) {
    const temporalDifference = reward + (this.DISCOUNT_FACTOR * nextMaxQ) - currentQ;
    return currentQ + (this.LEARNING_RATE * temporalDifference);
  }

  /**
   * Get best action for a state (pure exploitation)
   */
  getBestAction(qValues) {
    let bestAction = null;
    let bestQ = -Infinity;

    for (const [action, q] of Object.entries(qValues)) {
      if (q > bestQ) {
        bestQ = q;
        bestAction = action;
      }
    }

    return bestAction || this.ACTIONS.MAINTAIN_DIFFICULTY;
  }

  /**
   * Validate action is legal for current state
   */
  isValidAction(action, state) {
    // Don't decrease difficulty if already at minimum
    if (action === this.ACTIONS.DECREASE_DIFFICULTY && state.difficulty.isMinimum()) {
      return false;
    }
    // Don't increase difficulty if already at maximum
    if (action === this.ACTIONS.INCREASE_DIFFICULTY && state.difficulty.isMaximum()) {
      return false;
    }
    // Don't give hint retry if wrong streak is 0
    if (action === this.ACTIONS.GIVE_HINT_RETRY && state.wrongStreak === 0) {
      return false;
    }

    return Object.values(this.ACTIONS).includes(action);
  }

  /**
   * Filter valid actions based on state
   */
  getValidActions(state) {
    return Object.values(this.ACTIONS).filter(action => this.isValidAction(action, state));
  }

  /**
   * Get default action (safe fallback)
   */
  getDefaultAction() {
    return this.ACTIONS.MAINTAIN_DIFFICULTY;
  }
}

module.exports = QLearningPolicy;
