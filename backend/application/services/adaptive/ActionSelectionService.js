/**
 * Action Selection Service
 * 
 * SINGLE RESPONSIBILITY: Select optimal pedagogical actions using Q-learning
 * 
 * Extracted from AdaptiveLearningService to follow SRP.
 * Handles epsilon-greedy action selection, rule-based fallback, and
 * misconception detection for adaptive teaching strategies.
 */

class ActionSelectionService {
  constructor(adaptiveLearningRepo, actions, experimentMode = 'adaptive') {
    this.repo = adaptiveLearningRepo;
    this.ACTIONS = actions;
    this.EXPERIMENT_MODE = experimentMode;
  }

  /**
   * Select optimal pedagogical action using epsilon-greedy Q-Learning
   * 
   * @param {string} userId - User ID for per-student Q-learning
   * @param {string} stateKey - Encoded state
   * @param {Object} state - Current learning state
   * @param {number} epsilon - Exploration rate
   * @param {Function} getQValueFn - Function to get Q-value
   * @param {Function} preloadQValuesFn - Function to preload Q-values
   * @returns {Object} Selected action with metadata
   */
  async selectAction(userId, stateKey, state, epsilon, getQValueFn, preloadQValuesFn) {
    // Experiment mode: Control cohort uses fixed policy
    if (this.EXPERIMENT_MODE === 'control') {
      return {
        action: this.ACTIONS.MAINTAIN_DIFFICULTY,
        reason: '[Control Mode] Fixed policy: maintain difficulty',
        usedExploration: false
      };
    }

    await preloadQValuesFn(userId, stateKey);
    const random = Math.random();

    // High mastery override
    if (state.mastery_level >= 80) {
      console.log(`[ActionSelection] Mastery ${state.mastery_level}% >= 80% - using optimal policy`);
      const fallback = await this.determineActionRuleBased(state);
      return {
        ...fallback,
        usedExploration: false,
        reason: `[High Mastery Override] ${fallback.reason}`
      };
    }

    // Exploration: Try random action
    if (random < epsilon) {
      const validActions = this._filterValidActions(state);
      const randomAction = validActions[Math.floor(Math.random() * validActions.length)];
        
      return {
        action: randomAction,
        reason: `[Exploration] Trying ${randomAction} (ε=${epsilon.toFixed(3)})`,
        usedExploration: true
      };
    }

    // Exploitation: Choose best Q-value
    let bestAction = null;
    let bestQValue = -Infinity;

    for (const action of Object.values(this.ACTIONS)) {
      const qValue = getQValueFn(userId, stateKey, action);
      if (qValue > bestQValue) {
        bestQValue = qValue;
        bestAction = action;
      }
    }

    // Fallback to rule-based if no Q-values
    if (bestAction === null || bestQValue === 0) {
      const fallback = await this.determineActionRuleBased(state);
      return {
        ...fallback,
        usedExploration: false,
        reason: `[Bootstrap] ${fallback.reason} (no Q-values yet)`
      };
    }

    return {
      action: bestAction,
      reason: `[Exploitation] Best action Q=${bestQValue.toFixed(2)}`,
      usedExploration: false
    };
  }

  /**
   * Filter pedagogically valid actions based on current state
   * @private
   */
  _filterValidActions(state) {
    const actions = Object.values(this.ACTIONS);
    
    return actions.filter(action => {
      // Don't increase difficulty if wrong_streak >= 2
      if (action === this.ACTIONS.INCREASE_DIFFICULTY && state.wrong_streak >= 2) {
        return false;
      }
      // Don't decrease if at minimum
      if (action === this.ACTIONS.DECREASE_DIFFICULTY && state.difficulty_level <= 1) {
        return false;
      }
      // Don't increase if at maximum
      if (action === this.ACTIONS.INCREASE_DIFFICULTY && state.difficulty_level >= 5) {
        return false;
      }
      // Prioritize hints when struggling
      if (state.wrong_streak >= 2 && ![
        this.ACTIONS.GIVE_HINT_THEN_RETRY,
        this.ACTIONS.DECREASE_DIFFICULTY,
        this.ACTIONS.REVIEW_PREREQUISITE_TOPIC
      ].includes(action)) {
        return Math.random() < 0.2; // 20% chance for other actions
      }
      return true;
    });
  }

  /**
   * Rule-based policy fallback
   * Used when Q-values not yet learned or for high-mastery students
   */
  async determineActionRuleBased(state) {
    try {
      const { 
        mastery_level = 0, 
        correct_streak = 0, 
        wrong_streak = 0, 
        difficulty_level = 3,
        user_id,
        topic_id
      } = state;

      // Detect misconceptions
      let misconception = null;
      if (user_id && topic_id) {
        try {
          misconception = await this._detectMisconception(user_id, topic_id);
        } catch (error) {
          console.error('[ActionSelection] Error detecting misconception:', error);
          misconception = null;
        }
      }
    
      if (misconception && wrong_streak >= 2) {
        return {
          action: this.ACTIONS.GIVE_HINT_RETRY,
          reason: `Misconception detected (${misconception.type}). Providing scaffolding.`,
          pedagogicalStrategy: 'scaffolding',
          representationType: 'text'
        };
      }

      // Rule 1: Severe Frustration
      if (wrong_streak >= 3 && mastery_level < 60) {
        if (difficulty_level > 1) {
          return {
            action: this.ACTIONS.DECREASE_DIFFICULTY,
            reason: `Frustration: ${wrong_streak} errors, ${mastery_level.toFixed(1)}% mastery.`,
            pedagogicalStrategy: 'confidence_building'
          };
        } else {
          return {
            action: this.ACTIONS.GIVE_HINT_RETRY,
            reason: `At easiest level, still struggling. Adding hints.`,
            pedagogicalStrategy: 'scaffolding'
          };
        }
      }

      // Rule 2: Mastery Achieved
      if (mastery_level >= 85 && correct_streak >= 3) {
        if (difficulty_level < 5) {
          return {
            action: this.ACTIONS.INCREASE_DIFFICULTY,
            reason: `Mastery ${mastery_level.toFixed(1)}%. Increasing challenge.`,
            pedagogicalStrategy: 'progressive_challenge'
          };
        } else {
          return {
            action: this.ACTIONS.ADVANCE_TOPIC,
            reason: `Mastery at max difficulty.`,
            pedagogicalStrategy: 'progression'
          };
        }
      }

      // Rule 3: Flow State
      if (mastery_level >= 60 && mastery_level < 85 && wrong_streak <= 1 && correct_streak >= 2) {
        return {
          action: this.ACTIONS.MAINTAIN_DIFFICULTY,
          reason: `Flow state: ${mastery_level.toFixed(1)}% mastery.`,
          pedagogicalStrategy: 'flow_maintenance'
        };
      }

      // Rule 4: Boredom
      if (correct_streak >= 7 && difficulty_level <= 2 && mastery_level >= 75) {
        return {
          action: this.ACTIONS.INCREASE_DIFFICULTY,
          reason: `Boredom risk: ${correct_streak} streak at easy level.`,
          pedagogicalStrategy: 'engagement'
        };
      }

      // Default: Steady practice
      return {
        action: this.ACTIONS.MAINTAIN_DIFFICULTY,
        reason: `Steady progress: ${mastery_level.toFixed(1)}% mastery.`,
        pedagogicalStrategy: 'steady_practice'
      };
    } catch (error) {
      console.error('[ActionSelection] Error:', error);
      return {
        action: this.ACTIONS.MAINTAIN_DIFFICULTY,
        reason: 'Error in rule-based decision',
        pedagogicalStrategy: 'error_recovery'
      };
    }
  }

  /**
   * Detect misconception patterns from recent history
   * @private
   */
  async _detectMisconception(userId, topicId) {
    try {
      // TODO: Implement getRecentAnswers in repository
      // Temporarily return null until method is implemented
      return null;
      
      // const recentHistory = await this.repo.getRecentAnswers(userId, topicId, 5);
      
      if (!recentHistory || recentHistory.length < 2) {
        return null;
      }

      const incorrectAnswers = recentHistory.filter(a => !a.was_correct);
      
      if (incorrectAnswers.length < 2) {
        return null;
      }

      // Pattern 1: Same representation failing
      const representations = incorrectAnswers.map(a => a.representation_type || 'text');
      const sameRepCount = representations.filter(r => r === representations[0]).length;
      
      if (sameRepCount === incorrectAnswers.length && incorrectAnswers.length >= 2) {
        return {
          type: 'representation_issue',
          pattern: representations[0],
          count: sameRepCount
        };
      }

      // Pattern 2: Prerequisite gaps
      const beginnerFailures = incorrectAnswers.filter(a => 
        (a.prev_difficulty || a.new_difficulty || 3) <= 2
      );
      if (beginnerFailures.length >= 3) {
        return {
          type: 'prerequisite_gap',
          pattern: 'basic_concept_confusion',
          count: beginnerFailures.length
        };
      }

      return null;
    } catch (error) {
      console.error('[ActionSelection] Error detecting misconception:', error);
      return null;
    }
  }
}

module.exports = ActionSelectionService;
