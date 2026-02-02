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
      // Extract cognitive domain from questionMetadata
      const cognitiveDomain = questionMetadata?.cognitive_domain 
        || questionMetadata?.cognitiveDomain 
        || 'knowledge_recall';

      // Log for debugging
      console.log('[QuestionAttemptRepo] Tracking attempt with cognitive_domain:', cognitiveDomain);
      if (!questionMetadata?.cognitive_domain && !questionMetadata?.cognitiveDomain) {
        console.warn('[QuestionAttemptRepo] ⚠️  questionMetadata missing cognitive_domain, defaulting to knowledge_recall');
        console.warn('[QuestionAttemptRepo] questionMetadata keys:', questionMetadata ? Object.keys(questionMetadata) : 'null');
      }

      const attemptData = {
        user_id: userId,
        question_id: questionId,
        topic_id: topicId,
        session_id: sessionId,
        is_correct: isCorrect,
        last_attempt_at: new Date().toISOString(), // ✅ FIX: attempted_at → last_attempt_at
        question_metadata: {
          ...questionMetadata,
          cognitive_domain: cognitiveDomain // Ensure it's always set
        }
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
      console.log('[QuestionAttemptRepo] 🔍 Fetching cognitive performance for user:', userId);
      
      const { data, error } = await this.supabase
        .from('question_attempts')
        .select('question_metadata, is_correct')
        .eq('user_id', userId);

      if (error) throw error;

      // Logging silenced to reduce Railway log volume (hitting 500 logs/sec limit)
      // console.log('[QuestionAttemptRepo] 📊 Raw data from DB - Total attempts:', data?.length || 0);
      
      // Log first few attempts for debugging
      if (data && data.length > 0) {
        // console.log('[QuestionAttemptRepo] Sample attempts:');
        // data.slice(0, 3).forEach((attempt, idx) => {
        //   console.log(`  Attempt ${idx + 1}:`, {
        //     cognitive_domain: attempt.question_metadata?.cognitive_domain,
        //     is_correct: attempt.is_correct,
        //     metadata_keys: attempt.question_metadata ? Object.keys(attempt.question_metadata) : 'null'
        //   });
        // });
      } else {
        // Silenced - normal for new users
        // console.warn('[QuestionAttemptRepo] ⚠️ No attempts found in database for this user!');
      }

      const domainStats = {};
      const domains = [
        'knowledge_recall',
        'concept_understanding',
        'procedural_skills',
        'analytical_thinking',
        'problem_solving',
        'higher_order_thinking'
      ];
      
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

      console.log('[QuestionAttemptRepo] 📈 Domain statistics:', domainStats);

      const performance = {};
      domains.forEach(domain => {
        const stats = domainStats[domain];
        performance[domain] = stats.total > 0 
          ? (stats.correct / stats.total) * 100 
          : 0;
      });

      console.log('[QuestionAttemptRepo] ✅ Final performance:', performance);
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
          representation_type: questionData.representationType || 'text',
          generation_params: questionData.generationParams,
          created_at: new Date().toISOString()
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
   * Get cached questions from database for performance optimization
   */
  async getCachedQuestions(topicId, difficultyLevel, excludeQuestionIds = []) {
    try {
      let query = this.supabase
        .from('adaptive_questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('difficulty_level', difficultyLevel)
        .limit(5); // Get up to 5 cached questions

      // Exclude specific question IDs if provided
      if (excludeQuestionIds && excludeQuestionIds.length > 0) {
        // Filter out cached questions by their IDs
        const excludeIds = excludeQuestionIds
          .filter(id => id && id.toString().startsWith('cached_'))
          .map(id => id.toString().replace('cached_', ''));
        
        if (excludeIds.length > 0) {
          query = query.not('id', 'in', `(${excludeIds.join(',')})`);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      
      console.log(`[QuestionAttemptRepo] 💾 Found ${data?.length || 0} cached questions for topic ${topicId}, difficulty ${difficultyLevel}`);
      return data || [];
    } catch (error) {
      console.error('Error getting cached questions:', error);
      return []; // Return empty array on error, don't fail the request
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
