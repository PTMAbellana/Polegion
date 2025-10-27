import api from './axios';

/**
 * Progress API - Handles all progress tracking requests
 */

// Get complete progress overview
export const getProgressOverview = async (userId) => {
  try {
    const response = await api.get(`/progress/overview/${userId}`);
    return response.data;
  } catch (error) {
    console.error('[Progress API] Error fetching progress overview:', error);
    throw error;
  }
};

// Get castle progress
export const getCastleProgress = async (userId) => {
  try {
    const response = await api.get(`/progress/castles/${userId}`);
    return response.data;
  } catch (error) {
    console.error('[Progress API] Error fetching castle progress:', error);
    throw error;
  }
};

// Get chapter progress for a castle
export const getChapterProgress = async (castleId, userId) => {
  try {
    const response = await api.get(`/progress/chapters/${castleId}/${userId}`);
    return response.data;
  } catch (error) {
    console.error('[Progress API] Error fetching chapter progress:', error);
    throw error;
  }
};

// Initialize castle progress (auto-called by backend)
export const initializeCastleProgress = async (userId) => {
  try {
    const response = await api.post('/progress/castles/initialize', { userId });
    return response.data;
  } catch (error) {
    console.error('[Progress API] Error initializing castle progress:', error);
    throw error;
  }
};

// Initialize chapter progress (auto-called by backend)
export const initializeChapterProgress = async (userId, castleId) => {
  try {
    const response = await api.post('/progress/chapters/initialize', {
      userId,
      castleId
    });
    return response.data;
  } catch (error) {
    console.error('[Progress API] Error initializing chapter progress:', error);
    throw error;
  }
};