import api from './axios';

/**
 * Chapter API - Handles all chapter-related requests
 */

// Complete a chapter
export const completeChapter = async (chapterId, userId, xpEarned) => {
  try {
    const response = await api.post(`/chapters/${chapterId}/complete`, {
      userId,
      xpEarned
    });
    return response.data;
  } catch (error) {
    console.error('[Chapters API] Error completing chapter:', error);
    throw error;
  }
};

/**
 * Update quiz status
 */
export const updateQuizStatus = async (chapterId, userId, passed, xpEarned) => {
  try {
    const response = await api.post(`/chapters/${chapterId}/quiz`, {
      userId,
      passed,
      xpEarned
    });
    return response.data;
  } catch (error) {
    console.error('[Chapters API] Error updating quiz status:', error);
    throw error;
  }
};

/**
 * Get chapter by ID
 */
export const getChapterById = async (chapterId, userId) => {
  try {
    const response = await api.get(`/chapters/${chapterId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('[Chapters API] Error fetching chapter:', error);
    throw error;
  }
};