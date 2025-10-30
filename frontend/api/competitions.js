import api from './axios';

export const createCompe = async (room_id, title) => {
    try {
        const res = await api.post(`competitions/`, {
            room_id,
            title
        });
        
        return res.data;
    } catch (error) {
        throw error;
    }
}

export const getAllCompe = async (room_id, type  = 'admin') => {
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

export const getCompeById = async (room_id, compe_id, type='creator') => {
    try {
        const res = await api.get(`competitions/${room_id}/${compe_id}?type=${type}`);
        return res.data;
    } catch (error) {
        throw error;
    }
}

// PROPER BACKEND API CALLS - NO MORE DIRECT SUPABASE!
export const startCompetition = async (compe_id, problems) => {
    try {
        // Call your actual backend endpoint
        const res = await api.post(`competitions/${compe_id}/start`, {
            problems: problems || []
        });
        
        console.log('🚀 Competition started via backend!');
        return res.data;
    } catch (error) {
        console.error('❌ Backend start competition error:', error.response?.data || error.message);
        throw error;
    }
}

export const nextProblem = async (compe_id, problems, current_index) => {
    try {
        console.log('🚀 Calling backend next-problem API...', { compe_id, current_index });
        
        // Call your backend API instead of direct Supabase
        const response = await api.patch(`/competitions/${compe_id}/next`, {
        problems: problems,
        current_index: current_index
        });
        
        console.log('✅ Backend next-problem response:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('❌ Backend next-problem error:', error);
        throw error;
    }
}

export const pauseCompetition = async (compe_id) => {
    try {
        // Call your actual backend endpoint
        const res = await api.patch(`competitions/${compe_id}/pause`);
        
        console.log('⏸️ Competition paused via backend!');
        return res.data;
    } catch (error) {
        console.error('❌ Backend pause competition error:', error.response?.data || error.message);
        throw error;
    }
}

export const resumeCompetition = async (compe_id) => {
    try {
        // Call your actual backend endpoint
        const res = await api.patch(`competitions/${compe_id}/resume`);
        
        console.log('▶️ Competition resumed via backend!');
        return res.data;
    } catch (error) {
        console.error('❌ Backend resume competition error:', error.response?.data || error.message);
        throw error;
    }
}

export const autoAdvanceCompetition = async (compe_id) => {
    try {
        // This can be implemented later if needed
        const res = await api.post(`competitions/${compe_id}/auto-advance`);
        
        return res.data;
    } catch (error) {
        throw error;
    }
}