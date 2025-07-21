import api from './axios'
import { supabase } from '../lib/supabaseClient'

export const createCompe = async (room_id, title) => {
    try {
        const res = await api.post(`competitions/`, {
            room_id,
            title
        })
        return res.data 
    } catch (error) {
        throw error
    }
}

export const getAllCompe = async (room_id, type  = 'admin') => {
    try {
        const res = await api.get(`competitions/${room_id}?type=${type}`)
        return res.data 
    } catch (error) {
        throw error
    }
}

export const getCompeById = async (room_id, compe_id, type='creator') => {
    try {
        const res = await api.get(`competitions/${room_id}/${compe_id}?type=${type}`)
        return res.data 
    } catch (error) {
        throw error
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
        const nextIndex = current_index + 1;
        const isFinished = nextIndex >= problems.length;
        
        // Update competition with next problem or mark as done
        const { data, error } = await supabase
            .from('competitions')
            .update({ 
                current_problem_index: nextIndex,
                current_problem_id: isFinished ? null : problems[nextIndex]?.id,
                status: isFinished ? 'DONE' : 'ONGOING',
                updated_at: new Date().toISOString()
            })
            .eq('id', compe_id)
            .select()
            .single();

        if (error) throw error;
        
        // Send broadcast to notify all clients
        const channel = supabase.channel(`competition-${compe_id}`);
        await channel.send({
            type: 'broadcast',
            event: 'competition_update',
            payload: data
        });
        
        console.log('📡 Next problem broadcasted!');
        return { data, competition_finished: isFinished };
    } catch (error) {
        throw error
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
        const res = await api.post(`competitions/${compe_id}/auto-advance`)
        return res.data 
    } catch (error) {
        throw error
    }
}