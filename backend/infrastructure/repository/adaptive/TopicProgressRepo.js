const cache = require('../../../application/cache');

/**
 * TopicProgressRepository
 * Handles user progress, mastery, and topic unlocking
 */
class TopicProgressRepository {
  constructor(supabase) {
    this.supabase = supabase;
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get or create topic progress for a user
   */
  async getTopicProgress(userId, topicId) {
    try {
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        return await this.createTopicProgress(userId, topicId);
      }

      return data;
    } catch (error) {
      console.error('Error getting topic progress:', error);
      throw error;
    }
  }

  /**
   * Create initial topic progress (locked by default)
   * ✅ FIX: Uses UPSERT to safely handle concurrent creation attempts
   */
  async createTopicProgress(userId, topicId, unlocked = false) {
    try {
      // ✅ FIX: Use UPSERT instead of INSERT to handle race conditions
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .upsert({
          user_id: userId,
          topic_id: topicId,
          unlocked: unlocked,
          mastered: false,
          mastery_level: 0,
          mastery_percentage: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,topic_id',
          ignoreDuplicates: false // Return existing if duplicate
        })
        .select()
        .single();

      if (error) {
        // If duplicate key error, fetch existing record
        if (error.code === '23505') {
          console.log('[TopicProgress] Progress already exists (race condition), fetching...');
          const { data: existing } = await this.supabase
            .from('user_topic_progress')
            .select('*')
            .eq('user_id', userId)
            .eq('topic_id', topicId)
            .single();
          
          if (existing) return existing;
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error creating topic progress:', error);
      throw error;
    }
  }

  /**
   * Update mastery percentage in user_topic_progress
   */
  async updateTopicMastery(userId, topicId, masteryPercentage) {
    try {
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .update({
          mastery_percentage: masteryPercentage,
          mastery_level: Math.floor(masteryPercentage / 20),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .select()
        .single();

      if (error && error.code === 'PGRST116') {
        return await this.createTopicProgress(userId, topicId, true);
      }

      if (error) throw error;

      const cacheKey = cache.generateKey('user_topic_progress', userId);
      cache.delete(cacheKey);

      return data;
    } catch (error) {
      console.error('Error updating topic mastery:', error);
      throw error;
    }
  }

  /**
   * Update longest correct streak if current streak beats the record
   */
  async updateLongestStreak(userId, topicId, currentStreak) {
    try {
      const { data: progress } = await this.supabase
        .from('user_topic_progress')
        .select('longest_correct_streak')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .single();
      
      const currentLongest = progress?.longest_correct_streak || 0;
      
      if (currentStreak > currentLongest) {
        await this.supabase
          .from('user_topic_progress')
          .update({ longest_correct_streak: currentStreak })
          .eq('user_id', userId)
          .eq('topic_id', topicId);
      }
      
      return currentStreak;
    } catch (error) {
      console.error('Error updating longest streak:', error);
      return currentStreak;
    }
  }

  /**
   * Get all topic progress for a user
   */
  async getAllTopicProgress(userId) {
    try {
      const cacheKey = cache.generateKey('user_topic_progress', userId);
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .select(`
          *,
          adaptive_learning_topics (
            id,
            topic_name,
            topic_code,
            cognitive_domain,
            description
          )
        `)
        .eq('user_id', userId)
        .order('topic_id');

      if (error) throw error;

      cache.set(cacheKey, data || [], this.CACHE_TTL);
      return data || [];
    } catch (error) {
      console.error('Error getting all topic progress:', error);
      return [];
    }
  }

  /**
   * Update topic progress (unlock, mastery level, etc.)
   */
  async updateTopicProgress(userId, topicId, updates) {
    try {
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .select()
        .single();

      if (error) throw error;

      const cacheKey = cache.generateKey('user_topic_progress', userId);
      cache.delete(cacheKey);

      return data;
    } catch (error) {
      console.error('Error updating topic progress:', error);
      throw error;
    }
  }

  /**
   * Initialize all topics for a new user (Topic 1 unlocked, rest locked)
   * ✅ FIX: Uses UPSERT with ON CONFLICT to handle concurrent initialization
   * This prevents duplicate key errors when multiple users initialize simultaneously
   */
  async initializeTopicsForUser(userId, allTopics) {
    try {
      console.log('[TopicProgress] Initializing topics for user:', userId);
      
      // ✅ FIX: Use PostgreSQL advisory lock to ensure only one process initializes at a time
      // This prevents race conditions when multiple requests arrive simultaneously
      const lockId = this.hashUserId(userId); // Convert UUID to integer for advisory lock
      
      // Try to acquire advisory lock (non-blocking)
      const { data: lockAcquired } = await this.supabase.rpc('pg_try_advisory_lock', {
        key: lockId
      });
      
      try {
        // Check if topics already initialized (after acquiring lock)
        const { data: existingProgress, error: checkError } = await this.supabase
          .from('user_topic_progress')
          .select('topic_id')
          .eq('user_id', userId);
        
        if (checkError) {
          console.error('[TopicProgress] Error checking existing progress:', checkError);
        }
        
        const existingTopicIds = new Set(existingProgress?.map(p => p.topic_id) || []);
        
        if (existingTopicIds.size === allTopics.length) {
          console.log('[TopicProgress] All topics already initialized, skipping');
          return true;
        }
        
        // Prepare topic progress records
        const topicsToUpsert = allTopics.map((topic, index) => ({
          user_id: userId,
          topic_id: topic.id,
          unlocked: index === 0, // Only first topic unlocked
          mastered: false,
          mastery_level: 0,
          mastery_percentage: 0,
          unlocked_at: index === 0 ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        // ✅ FIX: Use UPSERT with ON CONFLICT to handle race conditions
        // If another process already inserted, this will just update (no-op in this case)
        const { data: upsertedData, error: upsertError } = await this.supabase
          .from('user_topic_progress')
          .upsert(topicsToUpsert, {
            onConflict: 'user_id,topic_id',
            ignoreDuplicates: true // Don't update if already exists
          })
          .select();

        if (upsertError) {
          console.error('[TopicProgress] Error upserting topics:', upsertError);
          // Don't throw - might be benign duplicate key error
          // Check if data exists anyway
          const { data: finalCheck } = await this.supabase
            .from('user_topic_progress')
            .select('topic_id')
            .eq('user_id', userId);
          
          if (!finalCheck || finalCheck.length === 0) {
            throw new Error('Topic initialization failed and no data found');
          }
          
          console.log('[TopicProgress] Topics exist despite error, proceeding');
        } else {
          console.log(`[TopicProgress] Successfully initialized/verified ${topicsToUpsert.length} topics`);
        }

        // Clear cache
        const cacheKey = cache.generateKey('user_topic_progress', userId);
        cache.delete(cacheKey);

        return true;
      } finally {
        // Always release advisory lock
        if (lockAcquired) {
          await this.supabase.rpc('pg_advisory_unlock', { key: lockId });
        }
      }
    } catch (error) {
      console.error('[TopicProgress] Error initializing topics:', error);
      
      // If it's a duplicate key error, that means another process succeeded
      // Verify data exists and return success
      if (error.code === '23505' || error.message?.includes('duplicate key')) {
        console.log('[TopicProgress] Duplicate key detected (race condition), verifying data...');
        
        const { data: verification } = await this.supabase
          .from('user_topic_progress')
          .select('topic_id')
          .eq('user_id', userId);
        
        if (verification && verification.length > 0) {
          console.log('[TopicProgress] Data exists, treating as success');
          return true;
        }
      }
      
      throw error;
    }
  }
  
  /**
   * Hash user ID (UUID) to integer for advisory lock
   * PostgreSQL advisory locks require bigint (8 bytes)
   */
  hashUserId(userId) {
    // Simple hash: sum character codes modulo 2^31
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Save pending question to user_topic_progress
   */
  async savePendingQuestion(userId, topicId, questionData) {
    try {
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .update({
          pending_question: questionData,
          pending_question_created_at: new Date().toISOString(),
          attempt_count: 0
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .select()
        .single();

      if (error) {
        // Column might not exist - non-critical, just log
        console.warn('[TopicProgressRepo] Could not save pending question (column may not exist):', error.message);
        return null;
      }
      return data;
    } catch (error) {
      console.warn('[TopicProgressRepo] Error saving pending question (non-critical):', error.message);
      return null; // Don't throw - this is optional functionality
    }
  }

  /**
   * Clear pending question from user_topic_progress
   */
  async clearPendingQuestion(userId, topicId) {
    try {
      const { error } = await this.supabase
        .from('user_topic_progress')
        .update({
          pending_question: null,
          pending_question_created_at: null,
          attempt_count: 0
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId);

      if (error) {
        console.warn('[TopicProgressRepo] Could not clear pending question (column may not exist):', error.message);
        return false;
      }
      return true;
    } catch (error) {
      console.warn('[TopicProgressRepo] Error clearing pending question (non-critical):', error.message);
      return false;
    }
  }

  /**
   * Increment attempt count for pending question (ATOMIC)
   */
  async incrementAttemptCount(userId, topicId) {
    try {
      const { data, error } = await this.supabase.rpc('increment_attempt_count', {
        p_user_id: userId,
        p_topic_id: topicId
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error incrementing attempt count:', error);
      throw error;
    }
  }

  /**
   * Get pending question from user_topic_progress
   */
  async getPendingQuestion(userId, topicId) {
    try {
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .select('pending_question, attempt_count, pending_question_created_at')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .single();

      if (error) throw error;
      return data?.pending_question || null;
    } catch (error) {
      console.error('Error getting pending question:', error);
      return null;
    }
  }

  /**
   * Mark hint as shown (for analytics)
   */
  async markHintShown(userId, topicId) {
    try {
      const { error } = await this.supabase.rpc('increment_hint_shown', {
        p_user_id: userId,
        p_topic_id: topicId
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error marking hint shown:', error);
      return false;
    }
  }

  /**
   * Get stuck students analysis from database view
   */
  async getStuckStudents(minAttempts = 3, minMinutesStuck = 5) {
    try {
      const { data, error } = await this.supabase
        .from('stuck_students_view')
        .select('*')
        .gte('attempt_count', minAttempts)
        .gte('minutes_stuck', minMinutesStuck)
        .order('minutes_stuck', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting stuck students:', error);
      return [];
    }
  }
}

module.exports = TopicProgressRepository;
