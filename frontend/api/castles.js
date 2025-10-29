import api from './axios'

// Get all castles with optional user progress
export const getAllCastles = async (userId) => {
    try {
        const endpoint = userId ? `castles/?userId=${userId}` : 'castles/'
        const res = await api.get(endpoint)
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Castles fetched successfully'
        }
    } catch (error) {
        console.log('Error fetching castles:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error fetching castles',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Get castle by ID with optional user progress
export const getCastleById = async (castleId, userId) => {
    try {
        const endpoint = userId 
            ? `castles/${castleId}?userId=${userId}` 
            : `castles/${castleId}`
        const res = await api.get(endpoint)
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Castle fetched successfully'
        }
    } catch (error) {
        console.log('Error fetching castle:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error fetching castle',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Get chapters for a castle with user progress
export const getChaptersWithProgress = async (castleId, userId) => {
    try {
        const res = await api.get(`castles/${castleId}/chapters?userId=${userId}`)
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Chapters fetched successfully'
        }
    } catch (error) {
        console.log('Error fetching chapters:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error fetching chapters',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}

// Unlock a castle for a user
export const unlockCastle = async (userId, castleId) => {
    try {
        const res = await api.post(`castles/${castleId}/unlock`, { userId })
        return {
            success: true,
            data: res.data.data,
            message: res.data.message || 'Castle unlocked successfully'
        }
    } catch (error) {
        console.log('Error unlocking castle:', error)
        return {
            success: false,
            message: error.response?.data?.message || 'Server error unlocking castle',
            error: error.response?.data?.error || error.message,
            status: error.response?.status || 500
        }
    }
}