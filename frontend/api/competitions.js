import api from './axios'

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

export const startCompetition = async (compe_id, problems) => {
    try {
        const res = await api.post(`competitions/${compe_id}/start`, { problems })
        return res.data 
    } catch (error) {
        throw error
    }
}

export const nextProblem = async (compe_id, problems, current_index) => {
    try {
        const res = await api.post(`competitions/${compe_id}/next`, { 
            problems, 
            current_index 
        })
        return res.data 
    } catch (error) {
        throw error
    }
}

export const pauseCompetition = async (compe_id) => {
    try {
        const res = await api.patch(`competitions/${compe_id}/pause`)
        return res.data 
    } catch (error) {
        throw error
    }
}

export const resumeCompetition = async (compe_id) => {
    try {
        const res = await api.patch(`competitions/${compe_id}/resume`)
        return res.data 
    } catch (error) {
        throw error
    }
}

export const autoAdvanceCompetition = async (compe_id) => {
    try {
        const res = await api.post(`competitions/${compe_id}/auto-advance`)
        return res.data 
    } catch (error) {
        throw error
    }
}