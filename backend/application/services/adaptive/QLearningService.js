/**
 * Q-Learning Service
 * 
 * SINGLE RESPONSIBILITY: Manage Q-learning algorithm operations
 * 
 * Handles:
 * - Q-table initialization and persistence
 * - Q-value updates using Bellman equation
 * - Preloading Q-values for efficient access
 * - State-action pair management
 * 
 * Research Parameters (IJRISS & EduQate papers):
 * - Learning Rate (α): 0.1
 * - Discount Factor (γ): 0.95
 * - Epsilon-greedy exploration with decay
 */

class QLearningService {
  constructor(adaptiveLearningRepo) {
    this.repo = adaptiveLearningRepo;
    
    // Q-Learning hyperparameters
    this.LEARNING_RATE = 0.1;       // Alpha: how quickly to update Q-values
    this.DISCOUNT_FACTOR = 0.95;    // Gamma: importance of future rewards
    
    // In-memory Q-table for fast access
    this.qTable = new Map();
    this.isInitialized = false;
    this.initializationPromise = null;
  }

  /**
   * Ensure Q-table is loaded from database
   * Call this before any Q-learning operation
   */
  async ensureInitialized() {
    if (this.isInitialized) {
      return;
    }
    
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    
    this.initializationPromise = this._loadQTableFromDatabase();
    await this.initializationPromise;
    this.isInitialized = true;
  }

  /**
   * Load Q-values from database into memory
   * Restores learning progress after server restarts
   */
  async _loadQTableFromDatabase() {
    try {
      console.log('[QLearning] Loading Q-table from database...');
      const startTime = Date.now();
      
      const qValues = await this.repo.getAllQValues();
      
      // Build in-memory Q-table
      this.qTable.clear();
      let loadedCount = 0;
      
      for (const entry of qValues) {
        const stateKey = entry.state_key;
        const action = entry.action;
        const qValue = parseFloat(entry.q_value);
        
        if (!this.qTable.has(stateKey)) {
          this.qTable.set(stateKey, new Map());
        }
        this.qTable.get(stateKey).set(action, qValue);
        loadedCount++;
      }
      
      const elapsed = Date.now() - startTime;
      console.log(`[QLearning] ✅ Loaded ${loadedCount} Q-values in ${elapsed}ms`);
    } catch (error) {
      console.error('[QLearning] ⚠️ Failed to load Q-table:', error.message);
      // Continue with empty Q-table
    }
  }

  /**
   * Get Q-value for state-action pair
   * Returns 0 if never seen before (optimistic initialization)
   */
  getQValue(userId, stateKey, action) {
    const userStateKey = `${userId}:${stateKey}`;
    
    if (!this.qTable.has(userStateKey)) {
      return 0.0;
    }
    
    const stateActions = this.qTable.get(userStateKey);
    return stateActions.has(action) ? stateActions.get(action) : 0.0;
  }

  /**
   * Preload Q-values for a state (optimization)
   * Fetches from database if not in memory
   */
  async preloadQValuesForState(userId, stateKey) {
    const userStateKey = `${userId}:${stateKey}`;
    
    if (this.qTable.has(userStateKey)) {
      return; // Already loaded
    }
    
    try {
      const qValues = await this.repo.getQValuesForState(userId, stateKey);
      
      if (qValues && qValues.length > 0) {
        const stateActions = new Map();
        
        for (const entry of qValues) {
          stateActions.set(entry.action, parseFloat(entry.q_value));
        }
        
        this.qTable.set(userStateKey, stateActions);
        console.log(`[QLearning] Preloaded ${qValues.length} Q-values for state ${stateKey}`);
      }
    } catch (error) {
      console.error('[QLearning] Error preloading Q-values:', error.message);
    }
  }

  /**
   * Update Q-value using Bellman equation
   * 
   * Q(s,a) ← Q(s,a) + α[R + γ·max Q(s',a') - Q(s,a)]
   * 
   * @param {string} userId - User ID
   * @param {string} currentStateKey - Current state
   * @param {string} action - Action taken
   * @param {number} reward - Immediate reward
   * @param {string} nextStateKey - Next state
   */
  async updateQValue(userId, currentStateKey, action, reward, nextStateKey) {
    try {
      await this.ensureInitialized();
      
      // Get current Q-value
      const currentQ = this.getQValue(userId, currentStateKey, action);
      
      // Get max Q-value for next state
      const maxNextQ = await this._getMaxQValueForState(userId, nextStateKey);
      
      // Bellman equation
      const tdError = reward + (this.DISCOUNT_FACTOR * maxNextQ) - currentQ;
      const newQ = currentQ + (this.LEARNING_RATE * tdError);
      
      // Update in-memory Q-table
      const userStateKey = `${userId}:${currentStateKey}`;
      if (!this.qTable.has(userStateKey)) {
        this.qTable.set(userStateKey, new Map());
      }
      this.qTable.get(userStateKey).set(action, newQ);
      
      // Persist to database
      await this.repo.upsertQValue(userId, currentStateKey, action, newQ);
      
      console.log(`[QLearning] Q-update: Q(${currentStateKey}, ${action}) = ${currentQ.toFixed(3)} → ${newQ.toFixed(3)} (reward=${reward}, TD-error=${tdError.toFixed(3)})`);
      
      return newQ;
    } catch (error) {
      console.error('[QLearning] Error updating Q-value:', error.message);
      throw error;
    }
  }

  /**
   * Get maximum Q-value for a state (max over all actions)
   */
  async _getMaxQValueForState(userId, stateKey) {
    await this.preloadQValuesForState(userId, stateKey);
    
    const userStateKey = `${userId}:${stateKey}`;
    
    if (!this.qTable.has(userStateKey)) {
      return 0.0; // Optimistic initialization
    }
    
    const stateActions = this.qTable.get(userStateKey);
    
    if (stateActions.size === 0) {
      return 0.0;
    }
    
    return Math.max(...stateActions.values());
  }

  /**
   * Get best action for a state (greedy policy)
   */
  async getBestAction(userId, stateKey, possibleActions) {
    await this.preloadQValuesForState(userId, stateKey);
    
    let bestAction = null;
    let bestQValue = -Infinity;
    
    for (const action of possibleActions) {
      const qValue = this.getQValue(userId, stateKey, action);
      
      if (qValue > bestQValue) {
        bestQValue = qValue;
        bestAction = action;
      }
    }
    
    return { action: bestAction, qValue: bestQValue };
  }

  /**
   * Get all Q-values for a state (for analysis/debugging)
   */
  async getAllQValuesForState(userId, stateKey) {
    await this.preloadQValuesForState(userId, stateKey);
    
    const userStateKey = `${userId}:${stateKey}`;
    
    if (!this.qTable.has(userStateKey)) {
      return {};
    }
    
    const stateActions = this.qTable.get(userStateKey);
    const qValues = {};
    
    for (const [action, value] of stateActions.entries()) {
      qValues[action] = value;
    }
    
    return qValues;
  }
}

module.exports = QLearningService;
