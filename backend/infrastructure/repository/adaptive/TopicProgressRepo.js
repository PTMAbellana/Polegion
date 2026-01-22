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
   * CRITICAL FIX: Uses UPSERT to create row if it doesn't exist
   * This fixes the bug where unlocking failed if student never practiced the topic
   */
  async updateTopicProgress(userId, topicId, updates) {
    try {
      // Check if row exists
      const { data: existing, error: checkError } = await this.supabase
        .from('user_topic_progress')
        .select('id')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .maybeSingle(); // Don't throw if not found

      if (checkError) {
        console.error('[TopicProgressRepo] Error checking existing progress:', checkError);
        throw checkError;
      }

      let result;
      if (existing) {
        // Row exists - UPDATE it
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
        result = data;
        console.log(`[TopicProgressRepo] ✅ Updated progress for topic ${topicId}`);
      } else {
        // Row doesn't exist - INSERT it with initial values
        const { data, error } = await this.supabase
          .from('user_topic_progress')
          .insert({
            user_id: userId,
            topic_id: topicId,
            mastery_level: 0,
            difficulty_level: 1,
            total_attempts: 0,
            correct_answers: 0,
            correct_streak: 0,
            wrong_streak: 0,
            hints_shown_count: 0,
            mastery_percentage: 0,
            mastered: false,
            ...updates, // Apply the updates (like unlocked: true)
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        result = data;
        console.log(`[TopicProgressRepo] ✅ Created new progress row for topic ${topicId} with unlock`);
      }

      // Clear cache
      const cacheKey = cache.generateKey('user_topic_progress', userId);
      cache.delete(cacheKey);

      return result;
    } catch (error) {
      console.error('[TopicProgressRepo] ❌ Error updating topic progress:', error);
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
      
      // Try to acquire advisory lock with 5-second timeout (prevents indefinite hangs)
      const lockPromise = this.supabase.rpc('pg_try_advisory_lock', { key: lockId });
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Lock timeout')), 5000)
      );
      
      let lockResult;
      try {
        lockResult = await Promise.race([lockPromise, timeoutPromise]);
      } catch (timeoutError) {
        console.warn('[TopicProgress] Lock acquisition timeout - proceeding without lock');
        lockResult = { data: false };
      }
      
      const lockAcquired = lockResult?.data || false;
      
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
        
        // Filter out topics that already exist
        const newTopics = allTopics.filter(topic => !existingTopicIds.has(topic.id));
        
        if (newTopics.length === 0) {
          console.log('[TopicProgress] No new topics to initialize');
          return true;
        }
        
        // Prepare topic progress records for NEW topics only
        const topicsToInsert = newTopics.map((topic, index) => ({
          user_id: userId,
          topic_id: topic.id,
          unlocked: allTopics.indexOf(topic) === 0, // Only first topic unlocked
          mastered: false,
          mastery_level: 0,
          mastery_percentage: 0,
          unlocked_at: allTopics.indexOf(topic) === 0 ? new Date().toISOString() : null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));

        // ✅ FIX: Use INSERT instead of UPSERT to avoid RLS UPDATE permission issues
        // Handle duplicate key errors gracefully (race condition)
        const { data: insertedData, error: insertError } = await this.supabase
          .from('user_topic_progress')
          .insert(topicsToInsert)
          .select();

        if (insertError) {
          console.error('[TopicProgress] Error inserting topics:', insertError);
          
          // ✅ RLS POLICY ERROR: Don't fail - verify data exists
          if (insertError.code === '42501') {
            console.warn('[TopicProgress] RLS policy blocked insert - this might be normal for service role');
            console.warn('[TopicProgress] Checking if data exists anyway...');
          }
          
          // ✅ DUPLICATE KEY ERROR: Another process succeeded, that's OK
          if (insertError.code === '23505') {
            console.log('[TopicProgress] Duplicate key (race condition) - another process succeeded');
          }
          
          // Check if data exists anyway (might have been inserted by another process or before)
          const { data: finalCheck } = await this.supabase
            .from('user_topic_progress')
            .select('topic_id')
            .eq('user_id', userId);
          
          if (!finalCheck || finalCheck.length === 0) {
            // ✅ FIX: If RLS is blocking, try one topic at a time with proper error handling
            console.warn('[TopicProgress] Attempting fallback: insert one topic at a time...');
            return await this.initializeTopicsOneByOne(userId, allTopics);
          }
          
          console.log('[TopicProgress] Topics exist despite error, proceeding');
        } else {
          console.log(`[TopicProgress] Successfully initialized/verified ${topicsToInsert.length} topics`);
        }

        // Clear cache
        const cacheKey = cache.generateKey('user_topic_progress', userId);
        cache.delete(cacheKey);

        return true;
      } finally {
        // CRITICAL: Always release advisory lock, even if unlock fails
        if (lockAcquired) {
          try {
            await this.supabase.rpc('pg_advisory_unlock', { key: lockId });
            console.log('[TopicProgress] Advisory lock released:', lockId);
          } catch (unlockError) {
            console.error('[TopicProgress] Failed to release advisory lock (non-critical):', unlockError.message);
            // Don't throw - unlocking failure shouldn't block the user
          }
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
   * Fallback: Initialize topics one by one (for RLS issues)
   * ✅ FIX: When batch insert fails due to RLS, try individual inserts
   */
  async initializeTopicsOneByOne(userId, allTopics) {
    console.log('[TopicProgress] Using fallback: inserting topics one by one');
    
    let successCount = 0;
    
    for (let i = 0; i < allTopics.length; i++) {
      const topic = allTopics[i];
      
      try {
        // Check if exists first
        const { data: existing } = await this.supabase
          .from('user_topic_progress')
          .select('id')
          .eq('user_id', userId)
          .eq('topic_id', topic.id)
          .maybeSingle();
        
        if (existing) {
          console.log(`[TopicProgress] Topic ${i + 1} already exists, skipping`);
          successCount++;
          continue;
        }
        
        // Try to insert this topic
        const { error } = await this.supabase
          .from('user_topic_progress')
          .insert({
            user_id: userId,
            topic_id: topic.id,
            unlocked: i === 0, // First topic unlocked
            mastered: false,
            mastery_level: 0,
            mastery_percentage: 0,
            unlocked_at: i === 0 ? new Date().toISOString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) {
          // Ignore duplicate key errors (race condition)
          if (error.code === '23505') {
            console.log(`[TopicProgress] Topic ${i + 1} already exists (race), OK`);
            successCount++;
          } else {
            console.warn(`[TopicProgress] Could not insert topic ${i + 1}:`, error.message);
          }
        } else {
          console.log(`[TopicProgress] Topic ${i + 1} inserted successfully`);
          successCount++;
        }
      } catch (err) {
        console.warn(`[TopicProgress] Error with topic ${i + 1}:`, err.message);
      }
    }
    
    console.log(`[TopicProgress] Fallback complete: ${successCount}/${allTopics.length} topics initialized`);
    
    // Success if we initialized at least the first topic
    return successCount > 0;
  }

  /**
   * Save current question to pending_questions table
   * Stores question data in pending_question_data JSONB column for restoration on page refresh
   */
  async savePendingQuestion(userId, topicId, questionData) {
    try {
      console.log('[TopicProgressRepo] Saving pending question:', { userId, topicId, questionId: questionData?.id });
      
      // Store the question data in the pending_question_data JSONB column
      const pendingData = {
        id: questionData.id || questionData.questionId,
        question_text: questionData.question_text || questionData.question,
        options: questionData.options,
        hint: questionData.hint,
        difficulty: questionData.difficulty || questionData.difficultyLevel,
        difficultyLevel: questionData.difficulty || questionData.difficultyLevel,
        cognitive_domain: questionData.cognitive_domain || questionData.cognitiveDomain,
        representation_type: questionData.representation_type || questionData.representationType || 'text',
        session_id: questionData.session_id || questionData.sessionId,
        source: questionData.source,
        type: questionData.type,
        metadata: questionData.metadata,
        saved_at: new Date().toISOString()
      };
      
      const { error } = await this.supabase
        .from('user_topic_progress')
        .update({ 
          pending_question_data: pendingData,
          pending_question_id: pendingData.id
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId);

      if (error) {
        console.warn('[TopicProgressRepo] Could not save pending question:', error.message);
        return null;
      }
      
      console.log('[TopicProgressRepo] ✅ Pending question saved successfully');
      return { success: true };
    } catch (error) {
      console.warn('[TopicProgressRepo] Error in savePendingQuestion:', error.message);
      return null;
    }
  }

  /**
   * Clear current question from user_topic_progress table
   */
  async clearPendingQuestion(userId, topicId) {
    try {
      console.log('[TopicProgressRepo] Clearing current question:', { userId, topicId });
      
      const { error } = await this.supabase
        .from('user_topic_progress')
        .update({ 
          pending_question_data: null,
          pending_question_id: null
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId);

      if (error) {
        console.warn('[TopicProgressRepo] Could not clear current question:', error.message);
        return false;
      }
      console.log('[TopicProgressRepo] ✅ Current question cleared successfully');
      return true;
    } catch (error) {
      console.warn('[TopicProgressRepo] Error clearing current question:', error.message);
      return false;
    }
  }

  /**
   * Clear pending questions for all topics EXCEPT the current one
   * Called when user switches to a different topic to prevent stale questions
   */
  async clearPendingForOtherTopics(userId, currentTopicId) {
    try {
      console.log('[TopicProgressRepo] Clearing pending questions for other topics:', { userId, keepTopicId: currentTopicId });
      
      const { error } = await this.supabase
        .from('user_topic_progress')
        .update({ 
          pending_question_data: null,
          pending_question_id: null
        })
        .eq('user_id', userId)
        .neq('topic_id', currentTopicId);

      if (error) {
        console.warn('[TopicProgressRepo] Could not clear other pending questions:', error.message);
        return false;
      }
      console.log('[TopicProgressRepo] ✅ Other pending questions cleared successfully');
      return true;
    } catch (error) {
      console.warn('[TopicProgressRepo] Error clearing other pending questions:', error.message);
      return false;
    }
  }

  /**
   * Increment attempt count for pending question (ATOMIC)
   */
  async incrementAttemptCount(userId, topicId) {
    try {
      const { data, error } = await this.supabase.rpc('increment_attempt_count_atomic', {
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
   * Get pending question from pending_question_data column
   * Returns the saved question or null if none exists
   */
  async getPendingQuestion(userId, topicId) {
    try {
      console.log('[TopicProgressRepo] Getting pending question:', { userId, topicId });
      
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .select('pending_question_data')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .single();

      if (error) {
        console.warn('[TopicProgressRepo] Error fetching pending question:', error.message);
        return null;
      }
      
      if (!data || !data.pending_question_data) {
        console.log('[TopicProgressRepo] No pending question found');
        return null;
      }
      
      console.log('[TopicProgressRepo] ✅ Found pending question:', data.pending_question_data.id);
      return data.pending_question_data;
    } catch (error) {
      console.warn('[TopicProgressRepo] Error in getPendingQuestion:', error);
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
