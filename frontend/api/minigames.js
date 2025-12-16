import api from './axios';

// Retry helper for production reliability
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Only retry on network errors or 5xx errors
      const shouldRetry = 
        !error.response || 
        (error.response.status >= 500 && error.response.status < 600) ||
        error.code === 'ECONNABORTED';
      
      if (!shouldRetry) throw error;
      
      console.log(`Retry attempt ${i + 1}/${retries} after ${delay * (i + 1)}ms`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export const getMinigamesByChapter = async (chapterId) => {
  return retryRequest(async () => {
    const res = await api.get(`/minigames/chapter/${chapterId}`, {
      timeout: 15000 // 15 seconds for fetching minigames
    });
    return res.data;
  });
};

export const submitMinigameAttempt = async (minigameId, attemptData) => {
  return retryRequest(async () => {
    const res = await api.post(`/user-minigame-attempts`, {
      minigame_id: minigameId,
      ...attemptData
    }, {
      timeout: 30000, // 30 seconds for submission
      cache: false // Never cache submissions
    });
    return res.data;
  });
};