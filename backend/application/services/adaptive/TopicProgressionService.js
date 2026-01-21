/**
 * Topic Progression Service
 * 
 * SINGLE RESPONSIBILITY: Manage topic unlocking and progression
 * 
 * Handles:
 * - Topic unlocking based on mastery and stability
 * - Checking unlock eligibility
 * - Getting practiced topics with progress
 * - Topic availability queries
 */

class TopicProgressionService {
  constructor(adaptiveLearningRepo) {
    this.repo = adaptiveLearningRepo;
    
    // Unlock requirements
    this.MIN_MASTERY_FOR_UNLOCK = 60;
    this.MIN_ACCURACY_FOR_UNLOCK = 0.70;  // 70% accuracy
    this.MIN_CONSECUTIVE_CORRECT = 2;
    this.RECENT_ATTEMPTS_WINDOW = 5;
  }

  /**
   * Check if topic should be unlocked based on mastery and stability
   * 
   * Requirements:
   * - Mastery ≥ 60%
   * - Stability criteria (one of):
   *   - Accuracy ≥ 70% over last 5 attempts
   *   - 2+ consecutive correct answers
   *   - Correct without hint at difficulty ≥ 3
   */
  async checkAndUnlockNextTopic(userId, topicId, currentMasteryLevel) {
    try {
      // Check if mastery threshold is met
      if (currentMasteryLevel < this.MIN_MASTERY_FOR_UNLOCK) {
        return null;
      }

      // Get recent performance for stability check
      const recentAttempts = await this.repo.getRecentAttempts(userId, topicId, this.RECENT_ATTEMPTS_WINDOW);
      
      // Calculate recent accuracy
      const correctCount = recentAttempts.filter(a => a.is_correct).length;
      const recentAccuracy = recentAttempts.length > 0 
        ? correctCount / recentAttempts.length 
        : 0;

      // Get current state for consecutive correct check
      const currentState = await this.repo.getUserTopicState(userId, topicId);
      const consecutiveCorrect = currentState?.correct_streak || 0;

      // Check stability criteria
      const isStable = 
        recentAccuracy >= this.MIN_ACCURACY_FOR_UNLOCK ||
        consecutiveCorrect >= this.MIN_CONSECUTIVE_CORRECT;

      if (!isStable) {
        console.log(`[TopicProgression] User ${userId} topic ${topicId}: Mastery OK (${currentMasteryLevel}%) but not stable yet (accuracy=${(recentAccuracy*100).toFixed(1)}%, streak=${consecutiveCorrect})`);
        return null;
      }

      // Find next topic to unlock
      const allTopics = await this.repo.getAllTopics();
      const currentTopicIndex = allTopics.findIndex(t => t.id === topicId);
      
      if (currentTopicIndex === -1 || currentTopicIndex >= allTopics.length - 1) {
        console.log(`[TopicProgression] No next topic to unlock after ${topicId}`);
        return null;
      }

      const nextTopic = allTopics[currentTopicIndex + 1];

      // Check if already unlocked
      const isAlreadyUnlocked = await this.isTopicUnlocked(userId, nextTopic.id);
      
      if (isAlreadyUnlocked) {
        console.log(`[TopicProgression] Topic ${nextTopic.id} already unlocked for user ${userId}`);
        return null;
      }

      // Unlock the next topic
      await this.repo.updateTopicProgress(userId, nextTopic.id, {
        unlocked: true,
        unlocked_at: new Date().toISOString()
      });
      
      console.log(`[TopicProgression] ✅ Unlocked topic ${nextTopic.id} (${nextTopic.topic_name}) for user ${userId} with mastery ${currentMasteryLevel}% and stability`);

      return {
        unlocked: true,
        topic: nextTopic,
        message: `🎉 New topic unlocked: ${nextTopic.topic_name}!`,
        reason: `Achieved ${currentMasteryLevel}% mastery with stable performance`
      };
    } catch (error) {
      console.error('[TopicProgression] Error checking/unlocking next topic:', error);
      return null;
    }
  }

  /**
   * Check if a topic is unlocked for a user
   */
  async isTopicUnlocked(userId, topicId) {
    try {
      const progress = await this.repo.getUserTopicProgress(userId, topicId);
      
      // Topic is unlocked if:
      // 1. It's the first topic (always unlocked)
      // 2. Progress exists and unlocked flag is true
      const allTopics = await this.repo.getAllTopics();
      const isFirstTopic = allTopics.length > 0 && allTopics[0].id === topicId;
      
      return isFirstTopic || (progress && progress.unlocked);
    } catch (error) {
      console.error(`[TopicProgression] Error checking if topic ${topicId} is unlocked:`, error);
      return false;
    }
  }

  /**
   * Get all topics the user has practiced with progress
   */
  async getPracticedTopics(userId) {
    try {
      const topics = await this.repo.getPracticedTopics(userId);
      
      return topics.map(topic => ({
        ...topic,
        mastery_level: parseFloat(topic.mastery_level || 0),
        mastery_percentage: parseFloat(topic.mastery_percentage || 0),
        total_attempts: parseInt(topic.total_attempts || 0),
        correct_answers: parseInt(topic.correct_answers || 0)
      }));
    } catch (error) {
      console.error('[TopicProgression] Error getting practiced topics:', error);
      return [];
    }
  }

  /**
   * Get all topics with unlock status and progress
   */
  async getTopicsWithProgress(userId, retryCount = 0) {
    try {
      const allTopics = await this.repo.getAllTopics();
      const userProgress = await this.repo.getAllTopicProgress(userId);
      
      // Create a map of topic progress
      const progressMap = new Map();
      userProgress.forEach(p => {
        progressMap.set(p.topic_id, p);
      });
      
      // Always unlock first topic
      const firstTopicId = allTopics.length > 0 ? allTopics[0].id : null;
      
      const topicsWithProgress = allTopics.map((topic, index) => {
        const progress = progressMap.get(topic.id);
        const isFirstTopic = topic.id === firstTopicId;
        
        return {
          id: topic.id,
          topic_code: topic.topic_code,
          topic_name: topic.topic_name,
          description: topic.description,
          cognitive_domain: topic.cognitive_domain,
          display_order: topic.display_order || index,
          unlocked: isFirstTopic || (progress?.unlocked || false),
          mastered: progress?.mastered || false,
          mastery_level: parseFloat(progress?.mastery_level || 0),
          mastery_percentage: parseFloat(progress?.mastery_percentage || 0),
          total_attempts: parseInt(progress?.total_attempts || 0),
          correct_answers: parseInt(progress?.correct_answers || 0),
          current_difficulty: parseInt(progress?.difficulty_level || 1),
          last_practiced: progress?.updated_at
        };
      });
      
      return topicsWithProgress.sort((a, b) => a.display_order - b.display_order);
    } catch (error) {
      console.error('[TopicProgression] Error getting topics with progress:', error);
      
      // Retry logic for transient database errors
      if (retryCount < 2) {
        console.log(`[TopicProgression] Retrying... (attempt ${retryCount + 1}/2)`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return this.getTopicsWithProgress(userId, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Get all available topics (basic info)
   */
  async getAllTopics() {
    return this.repo.getAllTopics();
  }
}

module.exports = TopicProgressionService;
