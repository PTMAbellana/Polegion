// api/problems.js - Problems API (Student-only build)
import api from './axios';

// Students can view problems in rooms they've joined
export const getRoomProblems = async(room_id, type='student') => {
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

export const getCompeProblems = async(competition_id) => {
  try {
    const res = await api.get(`/problems/compe-problems/${competition_id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

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
    console.log('📤 Submitting problem attempt:', {
      problem_id,
      shapes_count: solution?.shapes?.length,
      time_spent: solution?.time_spent
    });
    
    const res = await api.post(`/problems/${problem_id}/attempt`, { solution });
    
    console.log('✅ Submission successful:', res.data);
    
    return {
      success: true,
      data: res.data.data
    };
  } catch (error) {
    console.error('❌ Submission failed:', {
      status: error.response?.status,
      message: error.response?.data?.message,
      error: error.response?.data?.error,
      fullError: error
    });
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to submit attempt',
      error: error.response?.data?.error || error.message,
      status: error.response?.status
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

// REMOVED: Teacher-only functions
// - createProblem (teacher only)
// - deleteProblem (teacher only)
// - updateProblem (teacher only)
// - updateTimer (teacher only)
// - addCompeProblem (teacher only)
// - removeCompeProblem (teacher only)
// - getAllProblems (teacher library view)