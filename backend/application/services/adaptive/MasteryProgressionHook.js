/**
 * INTEGRATION HOOK for MasteryProgressionService
 * 
 * This file provides a non-invasive way to integrate mastery progression
 * into AdaptiveLearningService without modifying its core logic.
 * 
 * HOW IT WORKS:
 * 1. AdaptiveLearningService processes answer normally
 * 2. After successful processing, this hook is called
 * 3. Hook calls MasteryProgressionService to check/unlock chapters
 * 4. Returns unlock notification to be sent to frontend
 * 
 * This pattern keeps AdaptiveLearningService focused on MDP/Q-Learning
 * while MasteryProgressionService handles progression logic separately.
 */

// Use the shared services registry defined at application/services.js
const servicesRegistry = require('../services.js');

/**
 * Hook: Called after AdaptiveLearningService processes an answer
 * 
 * @param {string} userId 
 * @param {number} topicId 
 * @param {Object} updatedState - New adaptive learning state
 * @param {Object} mdpMetrics - {action, reward, etc.}
 * @returns {Promise<{masteryLevel: number, chapterUnlocked: object|null}>}
 */
async function afterAnswerProcessed(userId, topicId, updatedState, mdpMetrics) {
  try {
    const services = servicesRegistry.getServices();
    const masteryService = services.masteryProgressionService;
    
    if (!masteryService) {
      console.warn('[IntegrationHook] MasteryProgressionService not available');
      return { masteryLevel: 0, chapterUnlocked: null };
    }
    
    // Call mastery progression service
    const result = await masteryService.updateMasteryAndUnlock(
      userId,
      topicId,
      updatedState,
      mdpMetrics
    );
    
    return result;
    
  } catch (error) {
    console.error('[IntegrationHook] Error in afterAnswerProcessed:', error);
    // Non-blocking: return safe defaults
    return { masteryLevel: 0, chapterUnlocked: null };
  }
}

module.exports = {
  afterAnswerProcessed
};
