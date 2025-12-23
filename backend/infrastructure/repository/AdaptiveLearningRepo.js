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
   * Get or create student's difficulty level for a chapter
   */
  async getStudentDifficulty(userId, chapterId) {
    try {
      const cacheKey = cache.generateKey('student_difficulty', userId, chapterId);
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const { data, error } = await this.supabase
        .from('student_difficulty_levels')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If not exists, create default
      if (!data) {
        return await this.createStudentDifficulty(userId, chapterId);
      }

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
  async createStudentDifficulty(userId, chapterId) {
    try {
      const { data, error } = await this.supabase
        .from('student_difficulty_levels')
        .insert({
          user_id: userId,
          chapter_id: chapterId,
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
      const cacheKey = cache.generateKey('student_difficulty', userId, chapterId);
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
  async updateStudentDifficulty(userId, chapterId, updates) {
    try {
      const { data, error } = await this.supabase
        .from('student_difficulty_levels')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .select()
        .single();

      if (error) throw error;

      // Invalidate cache
      const cacheKey = cache.generateKey('student_difficulty', userId, chapterId);
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
        .from('mdp_state_transitions')
        .insert({
          user_id: transitionData.userId,
          chapter_id: transitionData.chapterId,
          prev_mastery_level: transitionData.prevState.masteryLevel,
          prev_difficulty: transitionData.prevState.difficultyLevel,
          prev_correct_streak: transitionData.prevState.correctStreak,
          prev_wrong_streak: transitionData.prevState.wrongStreak,
          prev_total_attempts: transitionData.prevState.totalAttempts,
          action: transitionData.action,
          action_reason: transitionData.actionReason,
          new_mastery_level: transitionData.newState.masteryLevel,
          new_difficulty: transitionData.newState.difficultyLevel,
          new_correct_streak: transitionData.newState.correctStreak,
          new_wrong_streak: transitionData.newState.wrongStreak,
          new_total_attempts: transitionData.newState.totalAttempts,
          reward: transitionData.reward,
          question_id: transitionData.questionId,
          was_correct: transitionData.wasCorrect,
          time_spent_seconds: transitionData.timeSpent,
          session_id: transitionData.sessionId,
          metadata: transitionData.metadata || {}
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
   */
  async getQuestionsByDifficulty(chapterId, difficultyLevel, limit = 10) {
    try {
      const cacheKey = cache.generateKey('questions_difficulty', chapterId, difficultyLevel);
      const cached = cache.get(cacheKey);
      if (cached) return cached;

      const { data, error } = await this.supabase
        .from('questions')
        .select('*')
        .eq('chapter_id', chapterId)
        .eq('difficulty_level', difficultyLevel)
        .limit(limit);

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
  async getPerformanceHistory(userId, chapterId, limit = 20) {
    try {
      const { data, error } = await this.supabase
        .from('mdp_state_transitions')
        .select('*')
        .eq('user_id', userId)
        .eq('chapter_id', chapterId)
        .order('timestamp', { ascending: false })
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
}

module.exports = AdaptiveLearningRepository;
