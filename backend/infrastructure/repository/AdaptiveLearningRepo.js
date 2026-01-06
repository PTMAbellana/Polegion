const cache = require('../../application/cache');

/**
 * AdaptiveLearningRepository
 * Handles database operations for adaptive learning system
 */
class AdaptiveLearningRepository {
  constructor(supabase) {
    this.supabase = supabase;
    this.CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get all available adaptive learning topics
   */
  async getAllTopics() {
    try {
      const cacheKey = cache.generateKey('adaptive_topics');
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const { data, error } = await this.supabase
        .from('adaptive_learning_topics')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('topic_name');

      if (error) throw error;

      cache.set(cacheKey, data, this.CACHE_TTL);
      return data || [];
    } catch (error) {
      console.error('Error getting adaptive topics:', error);
      throw error;
    }
  }

  /**
   * Get a single topic by ID
   */
  async getTopicById(topicId) {
    try {
      const cacheKey = cache.generateKey('adaptive_topic', topicId);
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const { data, error } = await this.supabase
        .from('adaptive_learning_topics')
        .select('*')
        .eq('id', topicId)
        .single();

      if (error) throw error;

      cache.set(cacheKey, data, this.CACHE_TTL);
      return data;
    } catch (error) {
      console.error('Error getting topic by ID:', error);
      return null;
    }
  }

  /**
   * Get or create student's difficulty level for a topic
   */
  async getStudentDifficulty(userId, topicId) {
    try {
      // CACHING DISABLED - Always fetch fresh data for accurate mastery tracking
      const { data, error } = await this.supabase
        .from('adaptive_learning_state')
        .select('*')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If not exists, create default
      if (!data) {
        return await this.createStudentDifficulty(userId, topicId);
      }

      console.log('[Repo] getStudentDifficulty returned:', JSON.stringify(data, null, 2));
      return data;
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
      const { data, error } = await this.supabase
        .from('adaptive_learning_state')
        .insert({
          user_id: userId,
          topic_id: topicId,
          difficulty_level: 3, // Start at medium
          mastery_level: 0,
          correct_streak: 0,
          wrong_streak: 0,
          total_attempts: 0,
          correct_answers: 0
        })
        .select()
        .single();

      if (error) {
        // If duplicate key error (race condition), fetch existing record
        if (error.code === '23505') {
          const { data: existingData, error: fetchError } = await this.supabase
            .from('adaptive_learning_state')
            .select('*')
            .eq('user_id', userId)
            .eq('topic_id', topicId)
            .single();
          
          if (fetchError) throw fetchError;
          return existingData;
        }
        throw error;
      }

      // Invalidate cache
      const cacheKey = cache.generateKey('student_difficulty', userId, topicId);
      cache.delete(cacheKey);

      return data;
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
      // Increment exploration/exploitation counters if specified
      const updateData = { ...updates };
      
      if (updates.increment_exploration) {
        delete updateData.increment_exploration;
        // Use SQL increment to avoid race conditions
        const { data: currentData } = await this.supabase
          .from('adaptive_learning_state')
          .select('exploration_count')
          .eq('user_id', userId)
          .eq('topic_id', topicId)
          .single();
        
        if (currentData) {
          updateData.exploration_count = (currentData.exploration_count || 0) + 1;
        }
      }
      
      if (updates.increment_exploitation) {
        delete updateData.increment_exploitation;
        const { data: currentData } = await this.supabase
          .from('adaptive_learning_state')
          .select('exploitation_count')
          .eq('user_id', userId)
          .eq('topic_id', topicId)
          .single();
        
        if (currentData) {
          updateData.exploitation_count = (currentData.exploitation_count || 0) + 1;
        }
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
   * Log MDP state transition for research analysis
   * 
   * CRITICAL CHANGES:
   * 1. Always log questionId (parametric or AI) for traceability
   * 2. Store actual epsilon value for research analysis
   * 3. Store updated Q-value to track learning progress
   * 4. Handle questionId as text (parametric IDs are strings, not UUIDs)
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
        action: transitionData.action,
        action_reason: transitionData.actionReason,
        reward: transitionData.reward ?? 0, // Default to 0 if NaN or undefined
        was_correct: transitionData.wasCorrect,
        time_spent: transitionData.timeSpent,
        used_exploration: transitionData.usedExploration || false,
        q_value: transitionData.qValue ?? 0, // Updated Q-value after learning
        epsilon: transitionData.epsilon ?? 0, // Actual exploration rate
        session_id: transitionData.sessionId,
        question_id: transitionData.questionId || null // Always log for traceability (text field)
      };

      // Log what we're about to insert (for debugging)
      console.log('[Repo] Logging state transition:', {
        action: insertData.action,
        epsilon: insertData.epsilon,
        q_value: insertData.q_value,
        question_id: insertData.question_id,
        used_exploration: insertData.used_exploration
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
   * Get questions by difficulty level for a chapter
   * Note: Questions are now generated parametrically, not from database
   * This method kept for backwards compatibility
   */
  async getQuestionsByDifficulty(topicId, difficultyLevel, limit = 10) {
    try {
      const cacheKey = cache.generateKey('questions_difficulty', topicId, difficultyLevel);
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      // Return empty for now - questions generated by QuestionGeneratorService
      const data = [];
      return data;

      if (error) throw error;

      cache.set(cacheKey, data, this.CACHE_TTL);
      return data;
    } catch (error) {
      console.error('Error getting questions by difficulty:', error);
      throw error;
    }
  }

  /**
   * Get quiz questions by difficulty level
   */
  async getQuizQuestionsByDifficulty(chapterQuizId, difficultyLevel, limit = 5) {
    try {
      const { data, error } = await this.supabase
        .from('chapter_quiz_questions')
        .select('*')
        .eq('chapter_quiz_id', chapterQuizId)
        .eq('difficulty_level', difficultyLevel)
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting quiz questions by difficulty:', error);
      throw error;
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
   * Get all students' current difficulty levels (for research analysis)
   */
  async getAllStudentDifficulties(chapterId = null) {
    try {
      let query = this.supabase
        .from('student_difficulty_levels')
        .select(`
          *,
          users:user_id (email, name),
          chapters:chapter_id (title)
        `)
        .order('updated_at', { ascending: false });

      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
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
   * Get aggregated statistics for research analysis
   */
  async getResearchStatistics(chapterId = null) {
    try {
      let query = this.supabase
        .from('student_difficulty_levels')
        .select('*');

      if (chapterId) {
        query = query.eq('chapter_id', chapterId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Calculate statistics
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
  /**
   * Get recent attempts for misconception detection
   * Returns last N state transitions for a student in a chapter
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
      return []; // Return empty array on error, don't crash
    }
  }

  /**
   * Save a generated question to the database
   */
  async saveQuestion(questionData) {
    try {
      const { data, error } = await this.supabase
        .from('adaptive_questions')
        .insert({
          topic_id: questionData.topicId,
          question_text: questionData.questionText,
          question_type: questionData.questionType,
          options: questionData.options,
          correct_answer: questionData.correctAnswer,
          difficulty_level: questionData.difficultyLevel,
          cognitive_domain: questionData.cognitiveDomain,
          generation_params: questionData.generationParams
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving question:', error);
      throw error;
    }
  }

  /**
   * Get questions for a specific topic and difficulty
   */
  async getQuestionsByTopicAndDifficulty(topicId, difficultyLevel, limit = 10) {
    try {
      const { data, error } = await this.supabase
        .from('adaptive_questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('difficulty_level', difficultyLevel)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting questions:', error);
      return [];
    }
  }

  /**
   * Get all adaptive states for a user (for concept unlocking)
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

  // ================================================================
  // TOPIC UNLOCKING METHODS
  // ================================================================

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

      // If not exists, create default (locked)
      if (!data) {
        return await this.createTopicProgress(userId, topicId, false);
      }

      return data;
    } catch (error) {
      console.error('Error getting topic progress:', error);
      throw error;
    }
  }

  /**
   * Create initial topic progress (locked by default)
   */
  async createTopicProgress(userId, topicId, unlocked = false) {
    try {
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .insert({
          user_id: userId,
          topic_id: topicId,
          unlocked: unlocked,
          mastered: false,
          mastery_level: 0,
          mastery_percentage: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating topic progress:', error);
      throw error;
    }
  }

  /**
   * Update mastery percentage in user_topic_progress
   * This syncs with adaptive_learning_state.mastery_level
   */
  async updateTopicMastery(userId, topicId, masteryPercentage) {
    try {
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .update({
          mastery_percentage: masteryPercentage,
          mastery_level: Math.floor(masteryPercentage / 20), // 0-5 scale
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .select()
        .single();

      if (error && error.code === 'PGRST116') {
        // Record doesn't exist, create it
        const { data: newData, error: insertError } = await this.supabase
          .from('user_topic_progress')
          .insert({
            user_id: userId,
            topic_id: topicId,
            unlocked: true,
            mastered: masteryPercentage >= 85,
            mastery_level: Math.floor(masteryPercentage / 20),
            mastery_percentage: masteryPercentage
          })
          .select()
          .single();
        
        if (insertError) throw insertError;
        return newData;
      }

      if (error) throw error;

      // Invalidate cache
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
      // Get current longest streak
      const { data: progress } = await this.supabase
        .from('user_topic_progress')
        .select('longest_correct_streak')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .single();
      
      const currentLongest = progress?.longest_correct_streak || 0;
      
      // Only update if current streak beats the record
      if (currentStreak > currentLongest) {
        const { error } = await this.supabase
          .from('user_topic_progress')
          .update({
            longest_correct_streak: currentStreak,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('topic_id', topicId);
        
        if (error) throw error;
        
        // Invalidate cache
        const cacheKey = cache.generateKey('user_topic_progress', userId);
        cache.delete(cacheKey);
        
        console.log(`[Repo] 🏆 New longest streak record for user ${userId} topic ${topicId}: ${currentStreak} (previous: ${currentLongest})`);
      }
      
      return currentStreak;
    } catch (error) {
      console.error('Error updating longest streak:', error);
      // Don't throw - this is not critical
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

      // Invalidate cache
      const cacheKey = cache.generateKey('user_topic_progress', userId);
      cache.delete(cacheKey);

      return data;
    } catch (error) {
      console.error('Error updating topic progress:', error);
      throw error;
    }
  }

  /**
   * Unlock next topic for user
   */
  async unlockNextTopic(userId, currentTopicId) {
    try {
      // Get current topic order
      const currentTopic = await this.getTopicById(currentTopicId);
      if (!currentTopic) return null;

      // Get all topics in order
      const allTopics = await this.getAllTopics();
      const currentIndex = allTopics.findIndex(t => t.id === currentTopicId);
      
      if (currentIndex === -1 || currentIndex >= allTopics.length - 1) {
        return null; // No next topic
      }

      const nextTopic = allTopics[currentIndex + 1];

      // Get or create progress for next topic
      let nextProgress = await this.getTopicProgress(userId, nextTopic.id);

      // Unlock it
      nextProgress = await this.updateTopicProgress(userId, nextTopic.id, {
        unlocked: true,
        unlocked_at: new Date().toISOString()
      });

      return {
        topic: nextTopic,
        progress: nextProgress
      };
    } catch (error) {
      console.error('Error unlocking next topic:', error);
      throw error;
    }
  }

  /**
   * Initialize all topics for a new user (Topic 1 unlocked, rest locked)
   * Optimized: Uses single batch query instead of N queries
   */
  async initializeTopicsForUser(userId) {
    try {
      console.log('[Repo] initializeTopicsForUser - start');
      const topicsStart = Date.now();
      const allTopics = await this.getAllTopics();
      console.log(`[Repo] getAllTopics took ${Date.now() - topicsStart}ms`);
      
      // Fetch all existing progress in ONE query instead of N queries
      const checkStart = Date.now();
      const { data: existingProgress } = await this.supabase
        .from('user_topic_progress')
        .select('topic_id')
        .eq('user_id', userId);
      console.log(`[Repo] Check existing progress took ${Date.now() - checkStart}ms, found: ${existingProgress?.length || 0}`);
      
      const existingTopicIds = new Set(existingProgress?.map(p => p.topic_id) || []);
      
      // Prepare batch insert for missing topics
      const toInsert = allTopics
        .map((topic, i) => ({
          user_id: userId,
          topic_id: topic.id,
          unlocked: i === 0, // Only first topic unlocked
          mastery_level: 0,
          mastery_percentage: 0,
          mastered: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
        .filter(record => !existingTopicIds.has(record.topic_id)); // Only insert missing ones
      
      // Batch insert all at once (much faster than looping)
      if (toInsert.length > 0) {
        console.log(`[Repo] Batch inserting ${toInsert.length} topic progress records`);
        const insertStart = Date.now();
        const { error } = await this.supabase
          .from('user_topic_progress')
          .insert(toInsert);
        console.log(`[Repo] Batch insert took ${Date.now() - insertStart}ms`);
        
        if (error) {
          console.error('[Repo] ERROR during batch insert:', error);
          console.error('[Repo] Error details:', JSON.stringify(error, null, 2));
          // Return false to signal failure instead of silently continuing
          return false;
        }
        
        // Clear cache after successful insert to force fresh data on next read
        const cacheKey = cache.generateKey('user_topic_progress', userId);
        cache.delete(cacheKey);
        console.log('[Repo] Cleared cache for user topic progress');
      } else {
        console.log('[Repo] All topics already initialized, nothing to insert');
      }

      console.log('[Repo] initializeTopicsForUser - complete');
      return true;
    } catch (error) {
      console.error('Error initializing topics for user:', error);
      return false;
    }
  }

  // ================================================================
  // QUESTION ATTEMPT TRACKING
  // ================================================================

  /**
   * Track question attempt
   */
  async trackQuestionAttempt(userId, questionId, topicId, sessionId, isCorrect, questionMetadata = null) {
    try {
      // Check if already exists
      const { data: existing, error: selectError } = await this.supabase
        .from('question_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .eq('session_id', sessionId)
        .single();

      if (selectError && selectError.code !== 'PGRST116') {
        throw selectError;
      }

      if (existing) {
        // Update existing
        const { data, error } = await this.supabase
          .from('question_attempts')
          .update({
            attempts: existing.attempts + 1,
            current_session_attempts: existing.current_session_attempts + 1,
            is_correct: isCorrect,
            answered_correctly_ever: existing.answered_correctly_ever || isCorrect,
            last_attempt_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Create new
        const { data, error } = await this.supabase
          .from('question_attempts')
          .insert({
            user_id: userId,
            question_id: questionId,
            topic_id: topicId,
            session_id: sessionId,
            attempts: 1,
            current_session_attempts: 1,
            is_correct: isCorrect,
            answered_correctly_ever: isCorrect,
            question_metadata: questionMetadata
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    } catch (error) {
      console.error('Error tracking question attempt:', error);
      return null; // Don't fail the whole flow
    }
  }

  /**
   * Update hint count for a question attempt
   */
  async updateHintCount(userId, questionId, sessionId, hintsRequested) {
    try {
      // Validate inputs to prevent UUID errors
      if (!userId || !questionId || !sessionId || sessionId === 'undefined') {
        console.warn('[Repo] updateHintCount - invalid parameters:', { userId, questionId, sessionId });
        return null;
      }

      const { data, error } = await this.supabase
        .from('question_attempts')
        .update({
          hints_requested: hintsRequested
        })
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .eq('session_id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating hint count:', error);
      return null;
    }
  }

  /**
   * Get question attempt count for current session
   */
  async getQuestionAttemptCount(userId, questionId, sessionId) {
    try {
      const { data, error } = await this.supabase
        .from('question_attempts')
        .select('current_session_attempts')
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data ? data.current_session_attempts : 0;
    } catch (error) {
      console.error('Error getting question attempt count:', error);
      return 0;
    }
  }

  /**
   * Get shown questions for session (to prevent repeats)
   */
  async getShownQuestionsInSession(userId, topicId, sessionId) {
    try {
      const { data, error } = await this.supabase
        .from('user_session_questions')
        .select('question_id, question_type, question_data')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .eq('session_id', sessionId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting shown questions:', error);
      return [];
    }
  }

  /**
   * Get recently shown question types (last 5) to avoid immediate repeats
   */
  async getRecentQuestionTypes(userId, topicId, limit = 5) {
    try {
      const { data, error } = await this.supabase
        .from('user_session_questions')
        .select('question_data')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      
      // Extract question types from question_data
      const questionTypes = (data || [])
        .map(row => row.question_data?.type)
        .filter(Boolean);
      
      return questionTypes;
    } catch (error) {
      console.error('Error getting recent question types:', error);
      return [];
    }
  }

  /**
   * Get the most recent unanswered question for a user/topic
   * We ignore session to keep the question stable across refreshes
   */
  async getLatestUnansweredQuestion(userId, topicId) {
    try {
      const { data, error } = await this.supabase
        .from('user_session_questions')
        .select('question_data')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .is('is_correct', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.question_data : null;
    } catch (error) {
      console.error('Error getting latest unanswered question:', error);
      return null;
    }
  }

  /**
   * Mark a question as answered (update is_correct field)
   */
  async markQuestionAnswered(userId, topicId, questionId, isCorrect) {
    try {
      const { error } = await this.supabase
        .from('user_session_questions')
        .update({ is_correct: isCorrect })
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .eq('question_id', questionId)
        .is('is_correct', null); // Only update if not already answered

      if (error) {
        console.error('[Repo] Error marking question answered:', error);
        return false;
      }
      
      console.log(`[Repo] Marked question ${questionId} as ${isCorrect ? 'correct' : 'incorrect'}`);
      return true;
    } catch (error) {
      console.error('Error marking question answered:', error);
      return false;
    }
  }

  /**
   * Mark all pending (unanswered) questions as answered
   * Used when forcing new question generation
   */
  async markPendingQuestionsAnswered(userId, topicId) {
    try {
      const { error } = await this.supabase
        .from('user_session_questions')
        .update({ is_correct: false }) // Mark as incorrect to clear them
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .is('is_correct', null); // Only update unanswered questions

      if (error) {
        console.error('[Repo] Error marking pending questions answered:', error);
        return false;
      }
      
      console.log(`[Repo] Marked all pending questions for user ${userId} topic ${topicId} as answered`);
      return true;
    } catch (error) {
      console.error('Error marking pending questions answered:', error);
      return false;
    }
  }

  /**
   * Add question to session history
   */
  async addToQuestionHistory(userId, topicId, sessionId, questionId, questionType, difficultyLevel, isCorrect, questionData = null) {
    try {
      const { data, error } = await this.supabase
        .from('user_session_questions')
        .insert({
          user_id: userId,
          topic_id: topicId,
          session_id: sessionId,
          question_id: questionId,
          question_type: questionType,
          difficulty_level: difficultyLevel,
          is_correct: isCorrect,
          question_data: questionData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding to question history:', error);
      return null;
    }
  }

  /**
   * Save pending question to user_topic_progress
   * This enables question persistence across page refreshes
   */
  async savePendingQuestion(userId, topicId, questionData) {
    try {
      // Try multiple field names for question ID
      const questionId = questionData?.questionId || questionData?.id || questionData?.question_id;
      
      if (!questionId) {
        console.error('[Repo] ERROR: Cannot save pending question - no question ID found');
        console.error('[Repo] Question data keys:', Object.keys(questionData || {}));
        console.error('[Repo] Question data:', JSON.stringify(questionData, null, 2).substring(0, 500));
        // Don't throw - just log and return (non-critical failure)
        return null;
      }
      
      console.log(`[Repo] Attempting to save pending question: userId=${userId}, topicId=${topicId}, questionId=${questionId}`);
      
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .update({
          pending_question_id: questionId,
          pending_question_data: questionData,
          attempt_count: 0,
          hint_shown: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .select()
        .single();

      if (error && error.code === 'PGRST116') {
        // Record doesn't exist, create it with pending question
        console.log(`[Repo] Record not found, creating new with pending question`);
        const { data: newData, error: insertError } = await this.supabase
          .from('user_topic_progress')
          .insert({
            user_id: userId,
            topic_id: topicId,
            unlocked: true,
            pending_question_id: questionId,
            pending_question_data: questionData,
            attempt_count: 0,
            hint_shown: false
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('[Repo] ERROR: Failed to insert pending question:', insertError);
          throw insertError;
        }
        console.log(`[Repo] ✅ Created user_topic_progress with pending question for user ${userId} topic ${topicId}`);
        return newData;
      }

      if (error) {
        console.error('[Repo] ERROR: Failed to update pending question:', error);
        throw error;
      }

      if (!data) {
        console.error('[Repo] ERROR: Update returned no data - RLS policy may be blocking');
        throw new Error('Update succeeded but returned no data');
      }

      // Invalidate cache
      const cacheKey = cache.generateKey('user_topic_progress', userId);
      cache.delete(cacheKey);

      console.log(`[Repo] ✅ Saved pending question for user ${userId} topic ${topicId}, questionId=${questionId}`);
      return data;
    } catch (error) {
      console.error('[Repo] Error saving pending question:', error);
      throw error;
    }
  }

  /**
   * Clear pending question from user_topic_progress
   * Called after correct answer or when generating similar question (2nd wrong)
   */
  async clearPendingQuestion(userId, topicId) {
    try {
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .update({
          pending_question_id: null,
          pending_question_data: null,
          attempt_count: 0,
          hint_shown: false,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .select()
        .single();

      if (error) throw error;

      // Invalidate cache
      const cacheKey = cache.generateKey('user_topic_progress', userId);
      cache.delete(cacheKey);

      console.log(`[Repo] Cleared pending question for user ${userId} topic ${topicId}`);
      return data;
    } catch (error) {
      console.error('Error clearing pending question:', error);
      throw error;
    }
  }

  /**
   * Increment attempt count for pending question (ATOMIC)
   * Called when user answers wrong
   * Uses SQL function to prevent race conditions on concurrent submits
   */
  async incrementAttemptCount(userId, topicId) {
    try {
      // Use atomic SQL function to prevent race condition
      const { data, error } = await this.supabase
        .rpc('increment_attempt_count_atomic', {
          p_user_id: userId,
          p_topic_id: topicId
        });

      if (error) throw error;

      // Function returns array with single row
      const result = data && data[0];
      if (!result) {
        throw new Error('increment_attempt_count_atomic returned no data');
      }

      // Invalidate cache
      const cacheKey = cache.generateKey('user_topic_progress', userId);
      cache.delete(cacheKey);

      console.log(`[Repo] Atomically incremented attempt_count to ${result.new_attempt_count} for user ${userId} topic ${topicId}`);
      
      // Return in expected format
      return {
        attempt_count: result.new_attempt_count,
        pending_question_id: result.pending_question_id,
        pending_question_data: result.pending_question_data
      };
    } catch (error) {
      console.error('Error incrementing attempt count:', error);
      throw error;
    }
  }

  /**
   * Get pending question from user_topic_progress
   * Returns null if no pending question exists
   */
  async getPendingQuestion(userId, topicId) {
    try {
      const { data, error } = await this.supabase
        .from('user_topic_progress')
        .select('pending_question_id, pending_question_data, attempt_count, hint_shown')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Return null if no record or no pending question
      if (!data || !data.pending_question_id) return null;

      console.log(`[Repo] Retrieved pending question for user ${userId} topic ${topicId}, attempt_count: ${data.attempt_count}`);
      return data;
    } catch (error) {
      console.error('Error getting pending question:', error);
      return null;
    }
  }

  /**
   * Clear pending questions for all topics except current
   * Called when user switches topics to prevent stale state
   */
  async clearPendingForOtherTopics(userId, currentTopicId) {
    try {
      const { data, error } = await this.supabase
        .rpc('clear_all_pending_except', {
          p_user_id: userId,
          p_keep_topic_id: currentTopicId
        });

      if (error) throw error;

      const clearedCount = data || 0;
      if (clearedCount > 0) {
        console.log(`[Repo] Cleared ${clearedCount} pending questions for user ${userId} (keeping topic ${currentTopicId})`);
      }

      // Invalidate cache
      const cacheKey = cache.generateKey('user_topic_progress', userId);
      cache.delete(cacheKey);

      return clearedCount;
    } catch (error) {
      console.error('Error clearing pending for other topics:', error);
      return 0;
    }
  }

  /**
   * Check if submission is duplicate (idempotency)
   * Returns true if same submission_id was processed within last 5 seconds
   */
  async checkSubmissionDuplicate(userId, topicId, submissionId) {
    try {
      const { data, error } = await this.supabase
        .rpc('check_submission_duplicate', {
          p_user_id: userId,
          p_topic_id: topicId,
          p_submission_id: submissionId
        });

      if (error) throw error;
      return data === true;
    } catch (error) {
      console.error('Error checking submission duplicate:', error);
      return false; // On error, assume not duplicate (safer)
    }
  }

  /**
   * Record submission ID to enable idempotency
   */
  async recordSubmission(userId, topicId, submissionId) {
    try {
      const { error } = await this.supabase
        .from('adaptive_learning_state')
        .update({
          last_submission_id: submissionId,
          last_submission_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId);

      if (error) throw error;
      console.log(`[Repo] Recorded submission ${submissionId} for user ${userId} topic ${topicId}`);
    } catch (error) {
      console.error('Error recording submission:', error);
      // Non-critical - don't throw
    }
  }

  /**
   * Mark hint as shown (for analytics)
   */
  async markHintShown(userId, topicId) {
    try {
      const { error } = await this.supabase
        .from('user_topic_progress')
        .update({
          hint_shown: true,
          hint_shown_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('topic_id', topicId);

      if (error) throw error;
      console.log(`[Repo] Marked hint as shown for user ${userId} topic ${topicId}`);

      // Invalidate cache
      const cacheKey = cache.generateKey('user_topic_progress', userId);
      cache.delete(cacheKey);
    } catch (error) {
      console.error('Error marking hint shown:', error);
      // Non-critical - don't throw
    }
  }

  /**
   * Get stuck students analysis from database view
   * Provides teacher dashboard data showing students struggling on questions
   */
  async getStuckStudents(minAttempts = 3, minMinutesStuck = 5) {
    try {
      const { data, error } = await this.supabase
        .from('stuck_students_analysis')
        .select('*')
        .gte('attempt_count', minAttempts)
        .gte('minutes_stuck', minMinutesStuck)
        .order('attempt_count', { ascending: false })
        .order('minutes_stuck', { ascending: false });

      if (error) {
        // View might not exist if migration 03 hasn't run
        console.warn('[Repo] stuck_students_analysis view not available:', error.message);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting stuck students:', error);
      return [];
    }
  }

  /**
   * Get cognitive domain performance for a user across all topics
   * Returns mastery level for each of the 6 cognitive domains
   * Uses question_attempts table with question_metadata containing cognitive domain
   */
  async getCognitiveDomainPerformance(userId) {
    try {
      const { data, error } = await this.supabase
        .from('question_attempts')
        .select('is_correct, question_metadata')
        .eq('user_id', userId)
        .not('question_metadata', 'is', null);

      if (error) throw error;

      // Calculate accuracy per domain
      const domains = {
        knowledge_recall: { correct: 0, total: 0 },
        concept_understanding: { correct: 0, total: 0 },
        procedural_skills: { correct: 0, total: 0 },
        analytical_thinking: { correct: 0, total: 0 },
        problem_solving: { correct: 0, total: 0 },
        higher_order_thinking: { correct: 0, total: 0 }
      };

      data.forEach(attempt => {
        // Extract cognitive domain from question metadata
        const domain = attempt.question_metadata?.cognitiveDomain || 
                      attempt.question_metadata?.cognitive_domain;
        
        if (domain && domains[domain]) {
          domains[domain].total++;
          if (attempt.is_correct) {
            domains[domain].correct++;
          }
        }
      });

      // Calculate percentages
      const performance = Object.keys(domains).map(domain => ({
        domain,
        score: domains[domain].total > 0 
          ? Math.round((domains[domain].correct / domains[domain].total) * 100)
          : 0,
        attempts: domains[domain].total
      }));

      return performance;
    } catch (error) {
      console.error('Error getting cognitive domain performance:', error);
      throw error;
    }
  }
}

module.exports = AdaptiveLearningRepository;
