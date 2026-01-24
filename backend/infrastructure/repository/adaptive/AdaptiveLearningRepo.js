const TopicRepository = require('./TopicRepo');
const StudentStateRepository = require('./StudentStateRepo');
const QLearningRepository = require('./QLearningRepo');
const QuestionAttemptRepository = require('./QuestionAttemptRepo');
const TopicProgressRepository = require('./TopicProgressRepo');
const CohortRepository = require('./CohortRepo');

/**
 * AdaptiveLearningRepository (Main Coordinator)
 * Delegates to specialized repositories for better code organization
 * This is the main entry point that maintains backward compatibility
 */
class AdaptiveLearningRepository {
  constructor(supabase) {
    this.supabase = supabase;
    
    // Initialize specialized repositories
    this.topicRepo = new TopicRepository(supabase);
    this.studentStateRepo = new StudentStateRepository(supabase);
    this.qLearningRepo = new QLearningRepository(supabase);
    this.questionAttemptRepo = new QuestionAttemptRepository(supabase);
    this.topicProgressRepo = new TopicProgressRepository(supabase);
    this.cohortRepo = new CohortRepository(supabase);
  }

  // ================================================================
  // TOPIC OPERATIONS (delegates to TopicRepo)
  // ================================================================
  
  async getAllTopics() {
    return this.topicRepo.getAllTopics();
  }

  async getTopicById(topicId) {
    return this.topicRepo.getTopicById(topicId);
  }

  // ================================================================
  // STUDENT STATE OPERATIONS (delegates to StudentStateRepo)
  // ================================================================
  
  async getStudentDifficulty(userId, topicId) {
    return this.studentStateRepo.getStudentDifficulty(userId, topicId);
  }

  async createStudentDifficulty(userId, topicId) {
    return this.studentStateRepo.createStudentDifficulty(userId, topicId);
  }

  async updateStudentDifficulty(userId, topicId, updates) {
    return this.studentStateRepo.updateStudentDifficulty(userId, topicId, updates);
  }

  async getAllStatesForUser(userId) {
    return this.studentStateRepo.getAllStatesForUser(userId);
  }

  async getAllStudentDifficulties(chapterId = null) {
    return this.studentStateRepo.getAllStudentDifficulties(chapterId);
  }

  // ================================================================
  // Q-LEARNING OPERATIONS (delegates to QLearningRepo)
  // ================================================================
  
  async logStateTransition(transitionData) {
    return this.qLearningRepo.logStateTransition(transitionData);
  }

  async saveQValue(userId, stateKey, action, qValue) {
    return this.qLearningRepo.saveQValue(userId, stateKey, action, qValue);
  }

  async upsertQValue(userId, stateKey, action, qValue) {
    return this.qLearningRepo.upsertQValue(userId, stateKey, action, qValue);
  }

  async getQValue(userId, stateKey, action) {
    return this.qLearningRepo.getQValue(userId, stateKey, action);
  }

  async getQValuesByState(userId, stateKey) {
    return this.qLearningRepo.getQValuesByState(userId, stateKey);
  }

  async getQValuesForState(userId, stateKey) {
    return this.qLearningRepo.getQValuesForState(userId, stateKey);
  }

  async getAllQValues() {
    return this.qLearningRepo.getAllQValues();
  }

  async getTransitionsForExport(options = {}) {
    return this.qLearningRepo.getTransitionsForExport(options);
  }

  async getPerformanceHistory(userId, topicId, limit = 20) {
    return this.qLearningRepo.getPerformanceHistory(userId, topicId, limit);
  }

  async getRecentAttempts(userId, topicId, limit = 10) {
    return this.qLearningRepo.getRecentAttempts(userId, topicId, limit);
  }

  // Add the missing getRecentTransitions method that PerformanceAnalyticsService expects
  async getRecentTransitions(userId, topicId, limit = 10) {
    return this.qLearningRepo.getPerformanceHistory(userId, topicId, limit);
  }

  // Add getUserTopicState alias for compatibility
  async getUserTopicState(userId, topicId) {
    return this.studentStateRepo.getStudentDifficulty(userId, topicId);
  }

  async getResearchStatistics(chapterId = null) {
    return this.qLearningRepo.getResearchStatistics(chapterId);
  }

  // ================================================================
  // QUESTION ATTEMPT OPERATIONS (delegates to QuestionAttemptRepo)
  // ================================================================
  
  async trackQuestionAttempt(userId, questionId, topicId, sessionId, isCorrect, questionMetadata = null) {
    return this.questionAttemptRepo.trackQuestionAttempt(userId, questionId, topicId, sessionId, isCorrect, questionMetadata);
  }

  async updateHintCount(userId, questionId, sessionId, hintsRequested) {
    return this.questionAttemptRepo.updateHintCount(userId, questionId, sessionId, hintsRequested);
  }

  async getQuestionAttemptCount(userId, questionId, sessionId) {
    return this.questionAttemptRepo.getQuestionAttemptCount(userId, questionId, sessionId);
  }

  async getShownQuestionsInSession(userId, topicId, sessionId) {
    return this.questionAttemptRepo.getShownQuestionsInSession(userId, topicId, sessionId);
  }

  async getRecentQuestionTypes(userId, topicId, limit = 5) {
    return this.questionAttemptRepo.getRecentQuestionTypes(userId, topicId, limit);
  }

  async getCognitiveDomainPerformance(userId) {
    return this.questionAttemptRepo.getCognitiveDomainPerformance(userId);
  }

  async saveQuestion(questionData) {
    return this.questionAttemptRepo.saveQuestion(questionData);
  }

  // Get cached questions from database for performance optimization
  async getCachedQuestions(topicId, difficultyLevel, excludeQuestionIds = []) {
    return this.questionAttemptRepo.getCachedQuestions(topicId, difficultyLevel, excludeQuestionIds);
  }

  async getQuestionsByTopicAndDifficulty(topicId, difficultyLevel, limit = 10) {
    return this.questionAttemptRepo.getQuestionsByTopicAndDifficulty(topicId, difficultyLevel, limit);
  }

  async checkSubmissionDuplicate(userId, topicId, submissionId) {
    return this.questionAttemptRepo.checkSubmissionDuplicate(userId, topicId, submissionId);
  }

  async recordSubmission(userId, topicId, submissionId) {
    return this.questionAttemptRepo.recordSubmission(userId, topicId, submissionId);
  }

  // ================================================================
  // TOPIC PROGRESS OPERATIONS (delegates to TopicProgressRepo)
  // ================================================================
  
  async getTopicProgress(userId, topicId) {
    return this.topicProgressRepo.getTopicProgress(userId, topicId);
  }

  async createTopicProgress(userId, topicId, unlocked = false) {
    return this.topicProgressRepo.createTopicProgress(userId, topicId, unlocked);
  }

  async updateTopicMastery(userId, topicId, masteryPercentage) {
    return this.topicProgressRepo.updateTopicMastery(userId, topicId, masteryPercentage);
  }

  async updateLongestStreak(userId, topicId, currentStreak) {
    return this.topicProgressRepo.updateLongestStreak(userId, topicId, currentStreak);
  }

  async getAllTopicProgress(userId) {
    return this.topicProgressRepo.getAllTopicProgress(userId);
  }

  async updateTopicProgress(userId, topicId, updates) {
    return this.topicProgressRepo.updateTopicProgress(userId, topicId, updates);
  }

  async initializeTopicsForUser(userId) {
    const allTopics = await this.topicRepo.getAllTopics();
    return this.topicProgressRepo.initializeTopicsForUser(userId, allTopics);
  }

  async savePendingQuestion(userId, topicId, questionData) {
    return this.topicProgressRepo.savePendingQuestion(userId, topicId, questionData);
  }

  async clearPendingQuestion(userId, topicId) {
    return this.topicProgressRepo.clearPendingQuestion(userId, topicId);
  }

  async clearPendingForOtherTopics(userId, currentTopicId) {
    return this.topicProgressRepo.clearPendingForOtherTopics(userId, currentTopicId);
  }

  async incrementAttemptCount(userId, topicId) {
    return this.topicProgressRepo.incrementAttemptCount(userId, topicId);
  }

  async getPendingQuestion(userId, topicId) {
    return this.topicProgressRepo.getPendingQuestion(userId, topicId);
  }

  async markHintShown(userId, topicId) {
    return this.topicProgressRepo.markHintShown(userId, topicId);
  }

  async getStuckStudents(minAttempts = 3, minMinutesStuck = 5) {
    return this.topicProgressRepo.getStuckStudents(minAttempts, minMinutesStuck);
  }

  // ================================================================
  // COHORT OPERATIONS (delegates to CohortRepo)
  // ================================================================
  
  async getUserCohort(userId) {
    return this.cohortRepo.getUserCohort(userId);
  }

  async getCohortCounts() {
    return this.cohortRepo.getCohortCounts();
  }

  async assignUserToBalancedCohort(userId) {
    return this.cohortRepo.assignUserToBalancedCohort(userId);
  }

  async setUserCohort(userId, cohort) {
    return this.cohortRepo.setUserCohort(userId, cohort);
  }

  // ================================================================
  // BACKWARD COMPATIBILITY (deprecated methods)
  // ================================================================
  
  async getQuestionsByDifficulty(topicId, difficultyLevel, limit = 10) {
    // Legacy method - questions now generated parametrically
    return [];
  }

  async getQuizQuestionsByDifficulty(chapterQuizId, difficultyLevel, limit = 5) {
    // Legacy method - kept for compatibility
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

  async unlockNextTopic(userId, currentTopicId) {
    // Legacy method - now handled by MasteryProgressionService
    try {
      const currentTopic = await this.getTopicById(currentTopicId);
      if (!currentTopic) return null;

      const allTopics = await this.getAllTopics();
      const currentIndex = allTopics.findIndex(t => t.id === currentTopicId);
      
      if (currentIndex === -1 || currentIndex >= allTopics.length - 1) {
        return null;
      }

      const nextTopic = allTopics[currentIndex + 1];
      let nextProgress = await this.getTopicProgress(userId, nextTopic.id);

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

  // ================================================================
  // QUESTION HISTORY OPERATIONS
  // ================================================================
  
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

  // Helper method for retry logic
  async withRetry(fn, maxRetries = 3) {
    return this.studentStateRepo.withRetry(fn, maxRetries);
  }

  /**
   * Get user profile from user_profiles table
   * Used to fetch learning_strategy field
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }
}

module.exports = AdaptiveLearningRepository;
