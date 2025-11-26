import api from './axios'

// Get all castles with optional user progress
export const getAllCastles = async (userId) => {
    try {
        // Add timestamp to bypass all caching layers
        const timestamp = Date.now()
        const endpoint = userId ? `castles?userId=${userId}&_t=${timestamp}` : `castles?_t=${timestamp}`
        console.log('[CastleAPI] Fetching from endpoint:', endpoint)
        
        // Bypass cache for user-specific castle data to ensure fresh progress
        const config = {
            cache: {
                ttl: 0, // No caching
                interpretHeader: false
            },
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache'
            }
        }
        
        const res = await api.get(endpoint, config)
        
        console.log('[CastleAPI] Response:', res.data)
        return res.data.data || []
    } catch (error) {
        console.error('[CastleAPI] Error fetching castles:', error)
        console.error('[CastleAPI] Error name:', error.name)
        console.error('[CastleAPI] Error message:', error.message)
        
        if (error.response) {
            // Server responded with error status
            console.error('[CastleAPI] Error response:', error.response.data)
            console.error('[CastleAPI] Error status:', error.response.status)
        } else if (error.request) {
            // Request made but no response received
            console.error('[CastleAPI] No response received from server')
            console.error('[CastleAPI] Is backend running on', endpoint, '?')
        } else {
            // Error in request setup
            console.error('[CastleAPI] Request setup error:', error.message)
        }
        
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