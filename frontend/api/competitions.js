// api/competitions.js - Competition API (Student-only build)
import api from './axios';

// Students can view competitions in rooms they've joined
export const getAllCompe = async (room_id, type = 'student') => {
    try {
        const res = await api.get(`competitions/${room_id}?type=${type}`);
        return {
            success: true,
            data: res.data.data,
            message: 'Competitions fetched successfully'
        };
    } catch (error) {
        console.log('Error fetching competitions:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'Server error fetching competitions',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Students can view specific competition details
export const getCompeById = async (room_id, compe_id, type='student') => {
    try {
        const res = await api.get(`competitions/${room_id}/${compe_id}?type=${type}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

// REMOVED: Teacher-only functions
// - createCompe (teacher only)
// - startCompetition (teacher only)
// - nextProblem (teacher only)
// - pauseCompetition (teacher only)
// - resumeCompetition (teacher only)
// - autoAdvanceCompetition (teacher only)