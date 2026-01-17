/**
 * StudentStateRepository
 * Handles student difficulty levels and learning state
 */
class StudentStateRepository {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Get or create student's difficulty level for a topic
   */
  async getStudentDifficulty(userId, topicId) {
    try {
      return await this.withRetry(async () => {
        const { data, error } = await this.supabase
          .from('adaptive_learning_state')
          .select('*')
          .eq('user_id', userId)
          .eq('topic_id', topicId)
          .single();

        if (error && error.code === 'PGRST116') {
          return await this.createStudentDifficulty(userId, topicId);
        }

        if (error) throw error;
        return data;
      });
    } catch (error) {
      console.error('Error getting student difficulty:', error);
      throw error;
    }
  }

  /**
   * Create initial difficulty level for student (with UPSERT to handle race conditions)
   */
  async createStudentDifficulty(userId, topicId) {
    try {
      return await this.withRetry(async () => {
        const { data, error } = await this.supabase
          .from('adaptive_learning_state')
          .upsert(
            {
              user_id: userId,
              topic_id: topicId,
              difficulty_level: 3,
              mastery_level: 0,
              exploration_count: 0,
              exploitation_count: 0,
              correct_answers: 0, // ✅ FIX: correct_count → correct_answers
              wrong_answers: 0, // ✅ FIX: incorrect_count → wrong_answers
              correct_streak: 0, // ✅ FIX: current_correct_streak → correct_streak
              wrong_streak: 0 // ✅ FIX: Added wrong_streak
            },
            { onConflict: 'user_id,topic_id', ignoreDuplicates: false }
          )
          .select()
          .single();

        if (error) throw error;
        return data;
      });
    } catch (error) {
      console.error('Error creating student difficulty:', error);
      throw error;
    }
  }

  /**
   * Update student's difficulty level and performance metrics
   */
  async updateStudentDifficulty(userId, topicId, updates) {
    try {
      const updateData = { ...updates };
      
      if (updates.increment_exploration) {
        delete updateData.increment_exploration;
        const { data } = await this.supabase.rpc('increment_exploration', {
          p_user_id: userId,
          p_topic_id: topicId
        });
        updateData.exploration_count = data;
      }
      
      if (updates.increment_exploitation) {
        delete updateData.increment_exploitation;
        const { data } = await this.supabase.rpc('increment_exploitation', {
          p_user_id: userId,
          p_topic_id: topicId
        });
        updateData.exploitation_count = data;
      }
      
      const { data, error } = await this.supabase
        .from('adaptive_learning_state')
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
          last_attempt_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating student difficulty:', error);
      throw error;
    }
  }

  /**
   * Get all adaptive states for a user
   */
  async getAllStatesForUser(userId) {
    try {
      const { data, error } = await this.supabase
        .from('adaptive_learning_state')
        .select('topic_id')
        .eq('user_id', userId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting all states for user:', error);
      return [];
    }
  }

  /**
   * Get all students' current difficulty levels (for research analysis)
   */
  async getAllStudentDifficulties(chapterId = null) {
    try {
      let query = this.supabase
        .from('adaptive_learning_state')
        .select(`
          *,
          users:user_id (email, name),
          topics:topic_id (topic_name, topic_code)
        `)
        .order('updated_at', { ascending: false });

      if (chapterId) {
        query = query.eq('topic_id', chapterId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting all student difficulties:', error);
      throw error;
    }
  }

  /**
   * Retry helper for race condition handling
   */
  async withRetry(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 100 * (i + 1)));
      }
    }
  }
}

module.exports = StudentStateRepository;
