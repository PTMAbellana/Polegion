import api from './axios'

export const getRoomLeaderboards = async (room_id) => {
    try {
        const res = await api.get(`leaderboards/room/${room_id}`)
        return res.data 
    } catch (error) {
        throw error
    }
}

export const getCompetitionLeaderboards = async (room_id) => {
    try {
        const res = await api.get(`leaderboards/competition/${room_id}`)
        return res.data 
    } catch (error) {
        throw error
    }
}