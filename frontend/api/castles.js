import api from './axios';

/**
 * Castle API - Handles all castle-related requests
 */

// Get all castles with user progress
export const getCastlesWithProgress = async (userId) => {
  try {
    const response = await api.get(`/castles?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('[Castles API] Error fetching castles:', error);
    throw error;
  }
};

/**
 * Get castle by ID with progress
 */
export const getCastleById = async (castleId, userId) => {
  try {
    const response = await api.get(`/castles/${castleId}?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('[Castles API] Error fetching castle:', error);
    throw error;
  }
};

/**
 * Get chapters for a castle with user progress
 */
export const getChaptersWithProgress = async (castleId, userId) => {
  try {
    const response = await api.get(`/castles/${castleId}/chapters?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('[Castles API] Error fetching chapters:', error);
    throw error;
  }
};