import api from './axios';

/**
 * Progress API - Handles all progress tracking requests
 */

// Get complete user progress (all castles + chapters)
export const getProgressOverview = async (userId) => {
    try {
        const res = await api.get(`progress/overview/${userId}`)
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Progress overview fetched successfully'
        }
    } catch (error) {
        console.log('Error fetching progress overview:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error fetching progress overview',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Get all castle progress for a user
export const getCastleProgress = async (userId) => {
    try {
        const res = await api.get(`progress/castles/${userId}`)
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Castle progress fetched successfully'
        }
    } catch (error) {
        console.log('Error fetching castle progress:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error fetching castle progress',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Get user progress for a specific castle (includes castle + all chapter progress)
export const getUserProgress = async (userId, castleId) => {
    try {
        const res = await api.get(`progress/user/${userId}/castle/${castleId}`)
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Progress fetched successfully'
        }
    } catch (error) {
        console.log('Error fetching progress:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error fetching progress',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Get chapter progress for a specific castle
export const getChapterProgress = async (userId, castleId) => {
    try {
        const res = await api.get(`progress/chapters/${castleId}/${userId}`)
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Chapter progress fetched successfully'
        }
    } catch (error) {
        console.log('Error fetching chapter progress:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error fetching chapter progress',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Update chapter progress (unlock, complete, update XP)
export const updateChapterProgress = async (userId, chapterId, progressData) => {
    try {
        const res = await api.patch(`progress/user/${userId}/chapter/${chapterId}`, progressData)
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Chapter progress updated successfully'
        }
    } catch (error) {
        console.log('Error updating chapter progress:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error updating chapter progress',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Complete a chapter (marks as completed + awards XP)
export const completeChapter = async (userId, chapterId, quizScore) => {
    try {
        const res = await api.post(`progress/user/${userId}/chapter/${chapterId}/complete`, {
            quiz_score: quizScore
        })
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Chapter completed successfully'
        }
    } catch (error) {
        console.log('Error completing chapter:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error completing chapter',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Initialize castle progress (called automatically by backend on first access)
export const initializeCastleProgress = async (userId) => {
    try {
        const res = await api.post('progress/castles/initialize', { userId })
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Castle progress initialized successfully'
        }
    } catch (error) {
        console.log('Error initializing castle progress:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error initializing castle progress',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Initialize chapter progress for a castle
export const initializeChapterProgress = async (userId, castleId) => {
    try {
        const res = await api.post('progress/chapters/initialize', {
            userId,
            castleId
        })
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Chapter progress initialized successfully'
        }
    } catch (error) {
        console.log('Error initializing chapter progress:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error initializing chapter progress',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Record minigame attempt
export const recordMinigameAttempt = async (userId, minigameId, attemptData) => {
    try {
        const res = await api.post(`progress/minigames/${minigameId}/attempt`, {
            userId,
            ...attemptData
        })
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Minigame attempt recorded successfully'
        }
    } catch (error) {
        console.log('Error recording minigame attempt:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error recording minigame attempt',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Record quiz attempt
export const recordQuizAttempt = async (userId, chapterQuizId, quizData) => {
    try {
        const res = await api.post(`progress/quizzes/${chapterQuizId}/attempt`, {
            userId,
            ...quizData
        })
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Quiz attempt recorded successfully'
        }
    } catch (error) {
        console.log('Error recording quiz attempt:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error recording quiz attempt',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

import axiosInstance from './axios';

export const startChapter = async (chapterId) => {
  const response = await axiosInstance.post(`/progress/chapters/${chapterId}/start`);
  return response.data;
};

export const awardLessonXP = async (chapterId, xpAmount) => {
  const response = await axiosInstance.post(`/progress/chapters/${chapterId}/xp/lesson`, {
    xpAmount
  });
  return response.data;
};