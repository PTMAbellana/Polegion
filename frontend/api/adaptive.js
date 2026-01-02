import axiosInstance from './axios';

/**
 * Adaptive Learning API
 * Client-side API functions for adaptive learning system
 */

/**
 * Submit an answer and get adaptive feedback
 */
export const submitAdaptiveAnswer = async (data) => {
  const response = await axiosInstance.post('/adaptive/submit-answer', data);
  return response.data;
};

/**
 * Get adaptive questions for a chapter
 */
export const getAdaptiveQuestions = async (chapterId, count = 10) => {
  const response = await axiosInstance.get(`/adaptive/questions/${chapterId}`, {
    params: { count }
  });
  return response.data;
};

/**
 * Get student's current adaptive learning state
 */
export const getAdaptiveState = async (chapterId) => {
  const response = await axiosInstance.get(`/adaptive/state/${chapterId}`);
  return response.data;
};

/**
 * Get AI prediction for next performance
 */
export const getAdaptivePrediction = async (chapterId) => {
  const response = await axiosInstance.get(`/adaptive/predict/${chapterId}`);
  return response.data;
};

/**
 * Reset difficulty level for a chapter
 */
export const resetAdaptiveDifficulty = async (chapterId) => {
  const response = await axiosInstance.post(`/adaptive/reset/${chapterId}`);
  return response.data;
};

/**
 * Get research statistics (for research/admin)
 */
export const getAdaptiveResearchStats = async (chapterId = null) => {
  const params = chapterId ? { chapterId } : {};
  const response = await axiosInstance.get('/adaptive/stats', { params });
  return response.data;
};

/**
 * Get Q-Learning algorithm statistics
 */
export const getQLearningStats = async () => {
  const response = await axiosInstance.get('/adaptive/qlearning/stats');
  return response.data;
};

/**
 * Export Q-table for research analysis
 */
export const exportQTable = async () => {
  const response = await axiosInstance.get('/adaptive/qlearning/export');
  return response.data;
};

/**
 * Health check for adaptive learning system
 */
export const checkAdaptiveHealth = async () => {
  const response = await axiosInstance.get('/adaptive/health');
  return response.data;
};

export default {
  submitAdaptiveAnswer,
  getAdaptiveQuestions,
  getAdaptiveState,
  getAdaptivePrediction,
  resetAdaptiveDifficulty,
  getAdaptiveResearchStats,
  getQLearningStats,
  exportQTable,
  checkAdaptiveHealth
};
