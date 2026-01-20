/**
 * Question Orchestration Service
 * 
 * SINGLE RESPONSIBILITY: Coordinate question generation and management
 * 
 * Handles:
 * - Question generation orchestration
 * - Similar question generation
 * - Question attempt tracking
 * - Hint eligibility checking
 */

class QuestionOrchestrationService {
  constructor(questionGenerator, aiQuestionGenerator, csvQuestionBank, adaptiveLearningRepo) {
    this.questionGenerator = questionGenerator;
    this.aiQuestionGenerator = aiQuestionGenerator;
    this.csvQuestionBank = csvQuestionBank;
    this.repo = adaptiveLearningRepo;
    
    // Configuration
    this.MIN_DIFFICULTY_FOR_AI = 4;
    this.MAX_ATTEMPTS_BEFORE_HINT = 2;
  }

  /**
   * Generate a question for a student
   * Orchestrates between cached, parametric, AI, and CSV question sources
   */
  async generateQuestion(userId, topicId, difficultyLevel, sessionId, excludeQuestionIds = [], forceNew = false) {
    try {
      let question = null;
      let source = 'parametric';

      // Priority 0: Check cached questions first (if not forcing new)
      if (!forceNew) {
        try {
          const cachedQuestions = await this.repo.getCachedQuestions(topicId, difficultyLevel, excludeQuestionIds);
          if (cachedQuestions && cachedQuestions.length > 0) {
            // Get a random cached question
            const randomCached = cachedQuestions[Math.floor(Math.random() * cachedQuestions.length)];
            question = {
              question_text: randomCached.question_text,
              options: randomCached.options,
              correctAnswer: randomCached.correct_answer,
              type: randomCached.question_type,
              cognitive_domain: randomCached.cognitive_domain,
              representation_type: randomCached.representation_type || 'text',
              id: `cached_${randomCached.id}`,
              source: 'cached_db'
            };
            source = 'cached_db';
            console.log(`[QuestionOrchestration] ✅ Using cached question from database for topic ${topicId}, difficulty ${difficultyLevel}`);
          }
        } catch (cacheError) {
          console.log(`[QuestionOrchestration] Cache lookup failed (${cacheError.message}), generating new question`);
        }
      }

      // Priority 1: Try CSV Question Bank (highest priority - guaranteed correct answers)
      if (!question && this.csvQuestionBank && !forceNew) {
        try {
          question = await this.csvQuestionBank.getRandomQuestion(
            topicId,
            difficultyLevel,
            excludeQuestionIds
          );
          
          if (question) {
            source = 'csv_bank';
            console.log(`[QuestionOrchestration] ✅ Using CSV question bank for topic ${topicId}, difficulty ${difficultyLevel}`);
          }
        } catch (csvError) {
          console.log(`[QuestionOrchestration] CSV bank unavailable (${csvError.message}), falling back to generation`);
        }
      }

      // Priority 2: AI Generation (for difficulty 4-5 or when requested)
      if (!question && (difficultyLevel >= this.MIN_DIFFICULTY_FOR_AI || forceNew)) {
        try {
          question = await this.aiQuestionGenerator.generateQuestion(topicId, difficultyLevel);
          source = 'ai_groq';
          console.log(`[QuestionOrchestration] ✅ Generated AI question for topic ${topicId}, difficulty ${difficultyLevel}`);
        } catch (aiError) {
          console.log(`[QuestionOrchestration] AI generation failed (${aiError.message}), falling back to parametric`);
        }
      }

      // Priority 3: Parametric Generation (fallback, always works)
      if (!question) {
        question = this.questionGenerator.generateQuestion(difficultyLevel, topicId);
        source = 'parametric';
        console.log(`[QuestionOrchestration] ✅ Generated parametric question for topic ${topicId}, difficulty ${difficultyLevel}`);
        
        // 🚀 PERFORMANCE: Save generated question with SVG content to database for caching
        try {
          if (question && question.question_text && question.question_text.includes('<svg')) {
            await this.repo.saveQuestion({
              topicId: topicId,
              questionText: question.question_text,
              questionType: question.type,
              options: question.options,
              correctAnswer: question.correctAnswer,
              difficultyLevel: difficultyLevel,
              cognitiveDomain: question.cognitive_domain || 'knowledge_recall',
              generationParams: question.parameters || {},
              representationType: question.representation_type || 'text'
            });
            console.log(`[QuestionOrchestration] 💾 Cached question with SVG content to database`);
          }
        } catch (saveError) {
          // Don't fail the request if saving fails - just log it
          console.warn(`[QuestionOrchestration] ⚠️ Failed to cache question:`, saveError.message);
        }
      }

      if (!question) {
        throw new Error('Failed to generate question from all sources');
      }

      // Add metadata
      question.source = source;
      question.difficulty = difficultyLevel;
      question.sessionId = sessionId;

      // ✅ Save as pending question so it can be restored on page refresh
      try {
        console.log(`[QuestionOrchestration] Saving question as current for user ${userId}, topic ${topicId}`);
        await this.repo.savePendingQuestion(userId, topicId, {
          id: question.id || question.questionId,
          question_text: question.question,
          options: question.options,
          hint: question.hint,
          difficulty: difficultyLevel,
          difficultyLevel: difficultyLevel,
          cognitive_domain: question.cognitive_domain,
          representation_type: question.representation_type,
          session_id: sessionId,
          source: source,
          type: question.type,
          metadata: {
            type: question.type,
            parameters: question.parameters,
            generated_at: question.generated_at || new Date().toISOString()
          }
        });
        console.log(`[QuestionOrchestration] ✅ Question saved as current`);
      } catch (saveError) {
        // Don't fail the request if saving fails - just log it
        console.warn(`[QuestionOrchestration] ⚠️ Failed to save current question:`, saveError.message);
      }

      return question;
    } catch (error) {
      console.error('[QuestionOrchestration] Error generating question:', error);
      throw error;
    }
  }

  /**
   * Generate a similar question (for retry after wrong answer)
   */
  async generateSimilarQuestion(userId, topicId, previousQuestion, sessionId) {
    try {
      const difficultyLevel = previousQuestion.difficulty || 3;
      const excludeIds = [previousQuestion.id];

      // Try to generate from same source
      if (previousQuestion.source === 'csv_bank' && this.csvQuestionBank) {
        try {
          const question = await this.csvQuestionBank.getRandomQuestion(
            topicId,
            difficultyLevel,
            excludeIds
          );
          
          if (question) {
            question.source = 'csv_bank';
            question.sessionId = sessionId;
            return question;
          }
        } catch (error) {
          // Fall through to other sources
        }
      }

      if (previousQuestion.source === 'ai_groq' || difficultyLevel >= this.MIN_DIFFICULTY_FOR_AI) {
        try {
          const question = await this.aiQuestionGenerator.generateQuestion(topicId, difficultyLevel);
          question.source = 'ai_groq';
          question.sessionId = sessionId;
          return question;
        } catch (error) {
          // Fall through to parametric
        }
      }

      // Fallback: parametric generation
      const question = this.questionGenerator.generateQuestion(topicId, difficultyLevel);
      question.source = 'parametric';
      question.difficulty = difficultyLevel;
      question.sessionId = sessionId;
      
      return question;
    } catch (error) {
      console.error('[QuestionOrchestration] Error generating similar question:', error);
      throw error;
    }
  }

  /**
   * Track attempt and check if hint should be shown
   * Returns hint information if eligible
   */
  async trackAttemptAndCheckHint(userId, questionId, topicId, sessionId, isCorrect, questionData) {
    try {
      // Get or create attempt tracking
      let attempt = await this.repo.getQuestionAttempt(userId, questionId);
      
      if (!attempt) {
        // First attempt
        attempt = await this.repo.createQuestionAttempt({
          userId,
          questionId,
          topicId,
          sessionId,
          attempts: 1,
          isCorrect,
          answeredCorrectlyEver: isCorrect,
          currentSessionAttempts: 1,
          questionMetadata: questionData
        });
        
        return {
          attemptCount: 1,
          currentSessionAttempts: 1,
          showHint: false
        };
      }

      // Update existing attempt
      const newAttemptCount = attempt.attempts + 1;
      const newSessionAttempts = (attempt.current_session_attempts || 0) + 1;
      const answeredCorrectlyEver = attempt.answered_correctly_ever || isCorrect;
      
      await this.repo.updateQuestionAttempt(userId, questionId, {
        attempts: newAttemptCount,
        isCorrect,
        answeredCorrectlyEver,
        currentSessionAttempts: newSessionAttempts
      });

      // Check if hint should be shown
      const showHint = !isCorrect && 
                       !answeredCorrectlyEver && 
                       newSessionAttempts >= this.MAX_ATTEMPTS_BEFORE_HINT;

      return {
        attemptCount: newAttemptCount,
        currentSessionAttempts: newSessionAttempts,
        showHint,
        answeredCorrectlyEver
      };
    } catch (error) {
      console.error('[QuestionOrchestration] Error tracking attempt:', error);
      return {
        attemptCount: 1,
        currentSessionAttempts: 1,
        showHint: false
      };
    }
  }

  /**
   * Update hint count for a question
   */
  async updateHintCount(userId, questionId, sessionId, hintsRequested) {
    try {
      await this.repo.updateQuestionAttemptHints(userId, questionId, hintsRequested);
    } catch (error) {
      console.error('[QuestionOrchestration] Error updating hint count:', error);
    }
  }
}

module.exports = QuestionOrchestrationService;
