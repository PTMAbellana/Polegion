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
        .order('cognitive_domain')
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
      const cacheKey = cache.generateKey('student_difficulty', userId, topicId);
      const cached = cache.get(cacheKey);
      if (cached) return cached;

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
      cache.set(cacheKey, data, this.CACHE_TTL);
      return data;
    } catch (error) {
      console.error('Error getting student difficulty:', error);
      throw error;
    }
  }

  /**
   * Create initial difficulty level for student
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

      if (error) throw error;

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

      // Invalidate cache
      const cacheKey = cache.generateKey('student_difficulty', userId, topicId);
      cache.delete(cacheKey);

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
      const { data, error } = await this.supabase
        .from('adaptive_state_transitions')
        .insert({
          user_id: transitionData.userId,
          topic_id: transitionData.topicId,
          prev_mastery: transitionData.prevState.mastery_level || transitionData.prevState.masteryLevel || 0,
          prev_difficulty: transitionData.prevState.difficulty_level || transitionData.prevState.difficultyLevel || 3,
          new_mastery: transitionData.newState.mastery_level || transitionData.newState.masteryLevel || 0,
          new_difficulty: transitionData.newState.difficulty_level || transitionData.newState.difficultyLevel || 3,
          action: transitionData.action,
          action_reason: transitionData.actionReason,
          reward: transitionData.reward,
          question_id: transitionData.questionId,
          was_correct: transitionData.wasCorrect,
          time_spent: transitionData.timeSpent,
          used_exploration: transitionData.usedExploration || false,
          q_value: transitionData.qValue || 0,
          epsilon: transitionData.epsilon || 0,
          session_id: transitionData.sessionId
        })
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
   * Log that a question was shown to a user
   */
  async logQuestionShown(userId, questionId, topicId, difficultyLevel, masteryLevel) {
    try {
      const { data, error } = await this.supabase
        .from('user_question_history')
        .insert({
          user_id: userId,
          question_id: questionId,
          topic_id: topicId,
          difficulty_at_time: difficultyLevel,
          mastery_at_time: masteryLevel,
          shown_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging question shown:', error);
      throw error;
    }
  }

  /**
   * Update user's answer to a question with AI explanation
   */
  async updateQuestionAnswer(historyId, userAnswer, isCorrect, timeSpent, transitionId = null, aiExplanation = null) {
    try {
      const updateData = {
        user_answer: userAnswer,
        is_correct: isCorrect,
        time_spent: timeSpent,
        transition_id: transitionId,
        answered_at: new Date().toISOString()
      };

      // Add AI explanation if provided
      if (aiExplanation) {
        updateData.ai_explanation = aiExplanation;
        updateData.explanation_generated_at = new Date().toISOString();
      }

      const { data, error } = await this.supabase
        .from('user_question_history')
        .update(updateData)
        .eq('id', historyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating question answer:', error);
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
}

module.exports = AdaptiveLearningRepository;
