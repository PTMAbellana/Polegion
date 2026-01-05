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
      const { data, error } = await this.supabase
        .from('adaptive_learning_state')
        .update({
          ...updates,
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
   */
  async logStateTransition(transitionData) {
    try {
      // Only include question_id if it's a valid UUID (from adaptive_questions table)
      // Skip it for parametric/AI-generated questions (which are strings)
      const isUUID = transitionData.questionId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(transitionData.questionId);
      
      const insertData = {
        user_id: transitionData.userId,
        topic_id: transitionData.topicId,
        prev_mastery: transitionData.prevState.mastery_level || transitionData.prevState.masteryLevel || 0,
        prev_difficulty: transitionData.prevState.difficulty_level || transitionData.prevState.difficultyLevel || 3,
        new_mastery: transitionData.newState.mastery_level || transitionData.newState.masteryLevel || 0,
        new_difficulty: transitionData.newState.difficulty_level || transitionData.newState.difficultyLevel || 3,
        action: transitionData.action,
        action_reason: transitionData.actionReason,
        reward: transitionData.reward,
        was_correct: transitionData.wasCorrect,
        time_spent: transitionData.timeSpent,
        used_exploration: transitionData.usedExploration || false,
        q_value: transitionData.qValue || 0,
        epsilon: transitionData.epsilon || 0,
        session_id: transitionData.sessionId
      };
      
      // Only add question_id if it's a valid UUID
      if (isUUID) {
        insertData.question_id = transitionData.questionId;
      }

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
          console.warn('Warning: Batch insert had issues:', error.message);
          // Don't throw - race conditions are ok, some may already exist
        }
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
        .select('question_id, question_type')
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
}

module.exports = AdaptiveLearningRepository;
