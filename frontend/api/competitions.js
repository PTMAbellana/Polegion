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