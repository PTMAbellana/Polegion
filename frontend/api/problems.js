import api from './axios';
import { cacheControl } from './axios';

export const createProblem = async (problemData, room_code) => {
  try {
    const res = await api.post('/problems', {
      problemData,
      room_code
    });
    
    return {
      success: true,
      message: res.data.message,
      data: res.data.data
    }
  } catch (error){
    console.error('createProblem error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create problem',
      error: error.response?.data?.error || error.message,
      status: error.response?.status || 500
    }
  }
};

export const getRoomProblems = async(room_id, type='admin') => {
  try {
    const res = await api.get(`/problems/${room_id}`, { params: { type } });
    return {
      success: true,
      message: 'Problems fetched successfully',
      data: res.data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Server error failed to get problems',
      error: error.response?.data?.error || error.message,
      status: error.response?.status || 500
    }
  }
}

export const getRoomProblemsByCode = async(room_code) => {
  try {
    const res = await api.get(`/problems/room-code/${room_code}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const getProblem = async(problem_id) => {
  try {
    const res = await api.get(`/problems/${problem_id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const getCompeProblem = async(compe_prob_id) => {
  try {
    const res = await api.get(`/problems/compe-problem/${compe_prob_id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const deleteProblem = async(problem_id) => {
  try {
    const res = await api.delete(`/problems/${problem_id}`);
    
    return {
      success: true,
      message: res.data.message
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Server error failed to delete problem',
      error: error.response?.data?.error || error.message,
      status: error.response?.status || 500
    }
  }
}

export const updateProblem = async(problem_id, problemData) => {
  try {
    // Clear cache to ensure fresh data
    cacheControl.clear();
    
    // Add cache busting timestamp to ensure fresh data
    const res = await api.put(`/problems/${problem_id}?t=${Date.now()}`, problemData);
    
    return {
      success: true,
      message: res.data.message,
      data: res.data.data
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Server error failed to update problem',
      error: error.response?.data?.error || error.message,
      status: error.response?.status || 500
    }
  }
}

export const updateTimer = async(problem_id, timer) => {
  try {
    const res = await api.put(`/problems/update-timer/${problem_id}`, { timer });
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const getCompeProblems = async(competition_id) => {
  console.log('getCompeProblems competition_id', competition_id);
  try {
    const res = await api.get(`/problems/compe-problems/${competition_id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const addCompeProblem = async(problem_id, competition_id) => {
  try {
    const res = await api.post(`/problems/${problem_id}/${competition_id}`);
    
    // Clear cache for this competition's problems
    await api.storage.remove(`get-/problems/compe-problems/${competition_id}`);
    
    return res.data;
  } catch (error) {
    throw error;
  }
}

export const removeCompeProblem = async(problem_id, competition_id) => {
  try {
    const res = await api.delete(`/problems/${problem_id}/${competition_id}`);
    
    // Clear cache for this competition's problems
    await api.storage.remove(`get-/problems/compe-problems/${competition_id}`);
    
    return res.data;
  } catch (error) {
    throw error;
  }
}

// ===== NEW: Public Problems & Grading =====

export const getPublicProblems = async(room_id) => {
  try {
    const res = await api.get(`/problems/public/${room_id}`);
    return {
      success: true,
      data: res.data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch public problems',
      error: error.response?.data?.error || error.message
    };
  }
};

export const getProblemLeaderboard = async(problem_id, limit = 50) => {
  try {
    const res = await api.get(`/problems/${problem_id}/leaderboard`, { params: { limit } });
    return {
      success: true,
      data: res.data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch leaderboard',
      error: error.response?.data?.error || error.message
    };
  }
};

export const submitProblemAttempt = async(problem_id, solution) => {
  try {
    const res = await api.post(`/problems/${problem_id}/attempt`, { solution });
    return {
      success: true,
      data: res.data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit attempt',
      error: error.response?.data?.error || error.message
    };
  }
};

export const getUserProblemStats = async(problem_id) => {
  try {
    const res = await api.get(`/problems/${problem_id}/stats`);
    return {
      success: true,
      data: res.data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch stats',
      error: error.response?.data?.error || error.message
    };
  }
};   