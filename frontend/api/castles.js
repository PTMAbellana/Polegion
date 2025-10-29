import api from './axios'

// Get all castles with optional user progress
export const getAllCastles = async (userId) => {
    try {
        const endpoint = userId ? `castles?userId=${userId}` : 'castles'
        console.log('[CastleAPI] Fetching from endpoint:', endpoint)
        const res = await api.get(endpoint)
        console.log('[CastleAPI] Response:', res.data)
        return res.data.data || []
    } catch (error) {
        console.error('[CastleAPI] Error fetching castles:', error)
        console.error('[CastleAPI] Error response:', error.response?.data)
        throw error
    }
}

// Get castle by ID with optional user progress
export const getCastleById = async (castleId, userId) => {
    try {
        const endpoint = userId 
            ? `castles/${castleId}?userId=${userId}` 
            : `castles/${castleId}`
        const res = await api.get(endpoint)
        return res.data.data
    } catch (error) {
        console.error('Error fetching castle:', error)
        throw error
    }
}

// Initialize user progress for a castle
export const initializeCastleProgress = async (userId, castleRoute) => {
    try {
        console.log('[CastleAPI] Initializing castle progress:', { userId, castleRoute })
        const res = await api.post('castles/initialize', { userId, castleRoute })
        console.log('[CastleAPI] Initialize response:', res.data)
        return res.data
    } catch (error) {
        console.error('[CastleAPI] Error initializing castle:', error)
        console.error('[CastleAPI] Error type:', error.name)
        console.error('[CastleAPI] Error message:', error.message)
        console.error('[CastleAPI] Error response:', error.response?.data)
        console.error('[CastleAPI] Error request:', error.request ? 'Request was made but no response' : 'Request was not made')
        console.error('[CastleAPI] Error config:', error.config?.url, error.config?.method)
        
        // Provide more specific error messages
        if (!error.response) {
            if (error.request) {
                throw new Error('Server not responding. Please check if the backend is running.')
            } else {
                throw new Error('Failed to make request: ' + error.message)
            }
        }
        
        throw error
    }
}