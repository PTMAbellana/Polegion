/**
 * QuestionAttemptRepository
 * Handles question attempts, tracking, and pending question management
 */
class QuestionAttemptRepository {
  constructor(supabase) {
    this.supabase = supabase;
  }

  /**
   * Track question attempt
   */
  async trackQuestionAttempt(userId, questionId, topicId, sessionId, isCorrect, questionMetadata = null) {
    try {
      const attemptData = {
        user_id: userId,
        question_id: questionId,
        topic_id: topicId,
        session_id: sessionId,
        is_correct: isCorrect,
        last_attempt_at: new Date().toISOString(), // ✅ FIX: attempted_at → last_attempt_at
        question_metadata: questionMetadata || {}
      };

      const { data, error } = await this.supabase
        .from('question_attempts')
        .insert(attemptData)
        .select()
        .single();

      if (error) {
        console.warn('[QuestionAttemptRepo] Could not track attempt (column may not exist):', error.message);
        return null;
      }
      return data;
    } catch (error) {
      console.warn('[QuestionAttemptRepo] Error tracking question attempt (non-critical):', error.message);
      return null;
    }
  }

  /**
   * Update hint count for a question attempt
   */
  async updateHintCount(userId, questionId, sessionId, hintsRequested) {
    try {
      const { data, error } = await this.supabase
        .from('question_attempts')
        .update({ hints_requested: hintsRequested })
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .eq('session_id', sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating hint count:', error);
      throw error;
    }
  }

  /**
   * Get question attempt count for current session
   */
  async getQuestionAttemptCount(userId, questionId, sessionId) {
    try {
      const { count, error } = await this.supabase
        .from('question_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('question_id', questionId)
        .eq('session_id', sessionId);

      if (error) throw error;
      return count || 0;
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
        .from('question_attempts')
        .select('question_id')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .eq('session_id', sessionId);

      if (error) throw error;
      return (data || []).map(row => row.question_id);
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
        .from('question_attempts')
        .select('question_metadata')
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .order('last_attempt_at', { ascending: false }) // ✅ FIX: attempted_at → last_attempt_at
        .limit(limit);

      if (error) throw error;
      
      return (data || [])
        .map(row => row.question_metadata?.question_type)
        .filter(Boolean);
    } catch (error) {
      console.error('Error getting recent question types:', error);
      return [];
    }
  }

  /**
   * Get cognitive domain performance for a user across all topics
   */
  async getCognitiveDomainPerformance(userId) {
    try {
      const { data, error } = await this.supabase
        .from('question_attempts')
        .select('question_metadata, is_correct')
        .eq('user_id', userId);

      if (error) throw error;

      const domainStats = {};
      const domains = ['knowledge_recall', 'comprehension', 'application', 'analysis', 'synthesis', 'evaluation'];
      
      domains.forEach(domain => {
        domainStats[domain] = { correct: 0, total: 0 };
      });

      (data || []).forEach(attempt => {
        const domain = attempt.question_metadata?.cognitive_domain || 'knowledge_recall';
        if (domainStats[domain]) {
          domainStats[domain].total++;
          if (attempt.is_correct) {
            domainStats[domain].correct++;
          }
        }
      });

      const performance = {};
      domains.forEach(domain => {
        const stats = domainStats[domain];
        performance[domain] = stats.total > 0 
          ? (stats.correct / stats.total) * 100 
          : 0;
      });

      return performance;
    } catch (error) {
      console.error('Error getting cognitive domain performance:', error);
      throw error;
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
   * Check if submission is duplicate (idempotency)
   */
  async checkSubmissionDuplicate(userId, topicId, submissionId) {
    try {
      const fiveSecondsAgo = new Date(Date.now() - 5000).toISOString();
      
      const { count, error } = await this.supabase
        .from('submission_log')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('topic_id', topicId)
        .eq('submission_id', submissionId)
        .gte('created_at', fiveSecondsAgo);

      if (error) throw error;
      return count > 0;
    } catch (error) {
      console.error('Error checking submission duplicate:', error);
      return false;
    }
  }

  /**
   * Record submission ID to enable idempotency
   */
  async recordSubmission(userId, topicId, submissionId) {
    try {
      const { error } = await this.supabase
        .from('submission_log')
        .insert({
          user_id: userId,
          topic_id: topicId,
          submission_id: submissionId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error recording submission:', error);
      return false;
    }
  }
}

module.exports = QuestionAttemptRepository;
