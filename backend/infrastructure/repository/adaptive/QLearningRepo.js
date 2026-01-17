/**
 * QLearningRepository
 * Handles Q-learning algorithm data: Q-values and state transitions
 */
class QLearningRepository {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Log MDP state transition for research analysis
   */
  async logStateTransition(transitionData) {
    try {
      const insertData = {
        user_id: transitionData.userId,
        topic_id: transitionData.topicId,
        prev_mastery: transitionData.prevState?.mastery_level ?? transitionData.prevState?.masteryLevel ?? 0,
        prev_difficulty: transitionData.prevState?.difficulty_level ?? transitionData.prevState?.difficultyLevel ?? 3,
        new_mastery: transitionData.newState?.mastery_level ?? transitionData.newState?.masteryLevel ?? 0,
        new_difficulty: transitionData.newState?.difficulty_level ?? transitionData.newState?.difficultyLevel ?? 3,
        action: transitionData.action || 'MAINTAIN_DIFFICULTY', // Default to MAINTAIN_DIFFICULTY if action is missing
        action_reason: transitionData.actionReason || 'Action not specified',
        reward: transitionData.reward ?? 0,
        was_correct: transitionData.wasCorrect,
        time_spent: transitionData.timeSpent,
        used_exploration: transitionData.usedExploration || false,
        q_value: transitionData.qValue ?? 0,
        epsilon: transitionData.epsilon ?? 0,
        session_id: transitionData.sessionId,
        question_id: transitionData.questionId || null,
        cognitive_domain: transitionData.cognitiveDomain || 'knowledge_recall'
      };

      // Validation: Warn if action was missing
      if (!transitionData.action) {
        console.warn('[QLearning] WARNING: Action was null/undefined, defaulting to MAINTAIN_DIFFICULTY');
        console.warn('[QLearning] TransitionData:', JSON.stringify(transitionData, null, 2));
      }

      console.log('[QLearning] Logging state transition:', {
        action: insertData.action,
        epsilon: insertData.epsilon,
        q_value: insertData.q_value,
        question_id: insertData.question_id
      });

      const { data, error } = await this.supabase
        .from('adaptive_state_transitions')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging state transition:', error);
      throw error;
    }
  }

  /**
   * Persist Q-value for a given state-action
   */
  async saveQValue(userId, stateKey, action, qValue) {
    try {
      if (!userId) {
        throw new Error('userId is required for saveQValue');
      }

      const payload = {
        user_id: userId,
        state_key: stateKey,
        action,
        q_value: Number.isFinite(qValue) ? qValue : 0,
        last_updated: new Date().toISOString()
      };

      const { data, error } = await this.supabase
        .from('adaptive_q_values')
        .upsert(payload, { onConflict: 'user_id,state_key,action' })
        .select()
        .single();

      if (error) throw error;
      console.log(`[QLearning] Saved Q-value for user ${userId}: ${stateKey}_${action} = ${qValue.toFixed(4)}`);
      return data;
    } catch (error) {
      console.error('[QLearning] Error saving Q-value:', { userId, stateKey, action, qValue, error });
      return null;
    }
  }

  /**
   * Retrieve Q-value for a specific state-action
   */
  async getQValue(userId, stateKey, action) {
    try {
      if (!userId) {
        throw new Error('userId is required for getQValue');
      }

      const { data, error } = await this.supabase
        .from('adaptive_q_values')
        .select('q_value')
        .eq('user_id', userId)
        .eq('state_key', stateKey)
        .eq('action', action)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data?.q_value ?? null;
    } catch (error) {
      console.error('[QLearning] Error getting Q-value:', { userId, stateKey, action, error });
      return null;
    }
  }

  /**
   * Retrieve all Q-values for a given state
   */
  async getQValuesByState(userId, stateKey) {
    try {
      if (!userId) {
        throw new Error('userId is required for getQValuesByState');
      }

      const { data, error } = await this.supabase
        .from('adaptive_q_values')
        .select('action,q_value')
        .eq('user_id', userId)
        .eq('state_key', stateKey);

      if (error) throw error;
      const map = {};
      (data || []).forEach(row => { map[row.action] = row.q_value; });
      return map;
    } catch (error) {
      console.error('[QLearning] Error getting Q-values by state:', { userId, stateKey, error });
      return {};
    }
  }

  /**
   * Retrieve all persisted Q-values (for research export & Q-table loading)
   */
  async getAllQValues() {
    try {
      const { data, error } = await this.supabase
        .from('adaptive_q_values')
        .select('user_id,state_key,action,q_value,update_count,last_updated')
        .order('last_updated', { ascending: false });

      if (error) throw error;
      
      console.log(`[QLearning] Retrieved ${data?.length || 0} Q-values from database`);
      return data || [];
    } catch (error) {
      console.error('[QLearning] Error getting all Q-values:', error);
      return [];
    }
  }

  /**
   * Retrieve adaptive state transitions for CSV export
   */
  async getTransitionsForExport({ topicId = null, userId = null } = {}) {
    try {
      let query = this.supabase
        .from('adaptive_state_transitions')
        .select('user_id,topic_id,prev_mastery,prev_difficulty,new_mastery,new_difficulty,action,action_reason,reward,was_correct,time_spent,used_exploration,q_value,epsilon,session_id,question_id');

      if (topicId) query = query.eq('topic_id', topicId);
      if (userId) query = query.eq('user_id', userId);

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting transitions for export:', error);
      return [];
    }
  }

  /**
   * Get student's performance history
   */
  async getPerformanceHistory(userId, topicId, limit = 20) {
    try {
      const { data, error } = await this.supabase
        .from('adaptive_state_transitions')
        .select('*')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting performance history:', error);
      throw error;
    }
  }

  /**
   * Get recent attempts for misconception detection
   */
  async getRecentAttempts(userId, topicId, limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('adaptive_state_transitions')
        .select('*')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting recent attempts:', error);
      return [];
    }
  }

  /**
   * Get aggregated statistics for research analysis
   */
  async getResearchStatistics(chapterId = null) {
    try {
      let query = this.supabase
        .from('adaptive_learning_state')
        .select('*');

      if (chapterId) {
        query = query.eq('topic_id', chapterId);
      }

      const { data, error } = await query;
      if (error) throw error;

      const stats = {
        totalStudents: data.length,
        averageMastery: data.reduce((sum, s) => sum + parseFloat(s.mastery_level || 0), 0) / data.length,
        averageDifficulty: data.reduce((sum, s) => sum + s.difficulty_level, 0) / data.length,
        difficultyDistribution: {
          level1: data.filter(s => s.difficulty_level === 1).length,
          level2: data.filter(s => s.difficulty_level === 2).length,
          level3: data.filter(s => s.difficulty_level === 3).length,
          level4: data.filter(s => s.difficulty_level === 4).length,
          level5: data.filter(s => s.difficulty_level === 5).length,
        },
        masteryDistribution: {
          low: data.filter(s => s.mastery_level < 50).length,
          medium: data.filter(s => s.mastery_level >= 50 && s.mastery_level < 80).length,
          high: data.filter(s => s.mastery_level >= 80).length,
        }
      };

      return stats;
    } catch (error) {
      console.error('Error getting research statistics:', error);
      throw error;
    }
  }
}

module.exports = QLearningRepository;
