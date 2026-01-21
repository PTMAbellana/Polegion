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
   * 
   * CRITICAL: Checks for pending questions FIRST before generating new ones
   * This ensures questions persist across page refreshes and topic switches
   */
  async generateQuestion(userId, topicId, difficultyLevel, sessionId, excludeQuestionIds = [], forceNew = false) {
    try {
      // 🔍 BUGFIX: Fetch topic to get topic_code for filtering
      // topicId is a UUID, but templates are filtered by topic_code (e.g., "points", "volume")
      const topic = await this.repo.getTopicById(topicId);
      const topicCode = topic?.topic_code || null;
      const topicName = topic?.topic_name || 'Unknown Topic';
      
      if (!topicCode) {
        console.warn(`[QuestionOrchestration] No topic_code found for topicId ${topicId}`);
      } else {
        console.log(`[QuestionOrchestration] Topic: ${topicName}, Code: ${topicCode}`);
      }
      
      // ✅ PRIORITY 0: Check for PENDING QUESTION first (unless forcing new)
      // This prevents questions from changing on page refresh or topic switch
      if (!forceNew) {
        try {
          const pendingQuestion = await this.repo.getPendingQuestion(userId, topicId);
          
          if (pendingQuestion && pendingQuestion.question_text) {
            console.log(`[QuestionOrchestration] 🔄 RESTORED pending question for topic ${topicName}:`, pendingQuestion.id);
            
            // Return the pending question with proper format
            return {
              question: pendingQuestion.question_text,
              options: pendingQuestion.options,
              questionId: pendingQuestion.id,
              hint: pendingQuestion.hint,
              difficulty: pendingQuestion.difficulty || pendingQuestion.difficultyLevel,
              cognitive_domain: pendingQuestion.cognitive_domain || pendingQuestion.cognitiveDomain,
              representation_type: pendingQuestion.representation_type || pendingQuestion.representationType || 'text',
              sessionId: pendingQuestion.session_id || sessionId,
              source: pendingQuestion.source || 'restored_pending',
              type: pendingQuestion.type,
              metadata: pendingQuestion.metadata,
              // Include all fields for compatibility
              question_text: pendingQuestion.question_text,
              id: pendingQuestion.id
            };
          } else {
            console.log(`[QuestionOrchestration] No pending question found for topic ${topicName}, generating new...`);
          }
        } catch (pendingError) {
          console.warn(`[QuestionOrchestration] Error checking pending question:`, pendingError.message);
          // Continue to generate new question
        }
      } else {
        console.log(`[QuestionOrchestration] forceNew=true, skipping pending question check`);
      }
      
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
            topicCode,
            difficultyLevel,
            excludeQuestionIds
          );
          
          if (question) {
            source = 'csv_bank';
            console.log(`[QuestionOrchestration] ✅ Using CSV question bank for topic ${topicName} (${topicCode}), difficulty ${difficultyLevel}`);
          }
        } catch (csvError) {
          console.log(`[QuestionOrchestration] CSV bank unavailable (${csvError.message}), falling back to generation`);
        }
      }

      // Priority 2: AI Generation (for difficulty 4-5 or when requested)
      // ⚠️ DISABLED for topics requiring precision (definitions, terminology, classifications)
      // AI excels at: word problems, calculations, varied scenarios
      // AI struggles with: exact definitions, terminology, conceptual clarity
      const DISABLE_AI_FOR_TOPICS = [
        'points', 'line_', 'segment_', 'ray_', 'plane_', 'parallel',  // Points, Lines, Planes
        'angle_',  // Kinds of Angles (classification)
        'complementary_', 'supplementary_',  // Angle relationships (simple math, but safer with templates)
        'circle_parts', 'radius_', 'diameter_', 'chord_',  // Parts of a Circle (terminology)
        'polygon_interior',  // Interior Angles (formulas)
        'polygon_identify', 'polygon_sides',  // Polygon Identification (classification)
        'plane_vs_solid', 'solid_figure', 'face_', 'edge_', 'vertex_',  // Plane/3D (classification)
        'rectangle_', 'square_', 'triangle_', 'shape_'  // Basic Geometric Figures (definitions)
      ];
      
      const shouldUseAI = topicCode && !DISABLE_AI_FOR_TOPICS.some(prefix => topicCode.includes(prefix));
      
      if (!question && shouldUseAI && (difficultyLevel >= this.MIN_DIFFICULTY_FOR_AI || forceNew)) {
        try {
          question = await this.aiQuestionGenerator.generateQuestion(topicName, difficultyLevel);
          source = 'ai_groq';
          console.log(`[QuestionOrchestration] ✅ Generated AI question for topic ${topicName}, difficulty ${difficultyLevel}`);
        } catch (aiError) {
          console.log(`[QuestionOrchestration] AI generation failed (${aiError.message}), falling back to parametric`);
        }
      }

      // Priority 3: Parametric Generation (fallback, always works)
      if (!question) {
        question = this.questionGenerator.generateQuestion(
          difficultyLevel, 
          null,  // chapterId
          null,  // seed
          null,  // cognitiveDomain
          'text', // representationType
          topicCode // ✅ BUGFIX: Use topic_code instead of UUID for filtering
        );
        source = 'parametric';
        console.log(`[QuestionOrchestration] ✅ Generated parametric question for topic ${topicName} (${topicCode}), difficulty ${difficultyLevel}`);
        
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
      // Fetch topic to get topic_code (same as generateQuestion)
      const topic = await this.repo.getTopicById(topicId);
      const topicCode = topic?.topic_code || null;
      const topicName = topic?.topic_name || 'Unknown Topic';
      
      const difficultyLevel = previousQuestion.difficulty || 3;
      const excludeIds = [previousQuestion.id];

      // Try to generate from same source
      if (previousQuestion.source === 'csv_bank' && this.csvQuestionBank) {
        try {
          const question = await this.csvQuestionBank.getRandomQuestion(
            topicCode,
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

      // Try AI generation if applicable (skip for precision-requiring topics)
      const DISABLE_AI_FOR_TOPICS = [
        'points', 'line_', 'segment_', 'ray_', 'plane_', 'parallel',
        'angle_', 'complementary_', 'supplementary_',
        'circle_parts', 'radius_', 'diameter_', 'chord_',
        'polygon_interior', 'polygon_identify', 'polygon_sides',
        'plane_vs_solid', 'solid_figure', 'face_', 'edge_', 'vertex_',
        'rectangle_', 'square_', 'triangle_', 'shape_'
      ];
      const shouldUseAI = topicCode && !DISABLE_AI_FOR_TOPICS.some(prefix => topicCode.includes(prefix));
      
      if (previousQuestion.source === 'ai_groq' && shouldUseAI) {
        try {
          const question = await this.aiQuestionGenerator.generateQuestion(topicName, difficultyLevel);
          question.source = 'ai_groq';
          question.sessionId = sessionId;
          return question;
        } catch (error) {
          // Fall through to parametric
        }
      }

      // Fallback: parametric generation
      const question = this.questionGenerator.generateQuestion(
        difficultyLevel,
        null,  // chapterId
        null,  // seed
        null,  // cognitiveDomain
        'text', // representationType
        topicCode // Use topic_code for filtering
      );
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
      // 🔧 DISABLED: getQuestionAttempt method doesn't exist in repo
      // This feature tracks hints but isn't critical for functionality
      // let attempt = await this.repo.getQuestionAttempt(userId, questionId);
      
      // Simplified: Return null (no hint eligibility tracking for now)
      return null;
      
      /* DISABLED: Hint tracking feature (incomplete implementation)
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
      */
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
