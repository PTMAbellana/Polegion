const cache = require('../../../application/cache');

/**
 * TopicRepository
 * Handles basic topic CRUD operations
 */
class TopicRepository {
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
}

module.exports = TopicRepository;
