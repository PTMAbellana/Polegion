import axios from 'axios'
import { ROUTES } from '@/constants/routes'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const authUtils = {
    saveAuthData: (authData) => {
        if ( authData && authData.session){
            localStorage.setItem('access_token', authData.session.access_token)
            localStorage.setItem('refresh_token', authData.session.refresh_token)
            localStorage.setItem('user', JSON.stringify(authData.user))
            
            if (authData.session.expires_at) {
                localStorage.setItem('expires_at', new Date(authData.session.expires_at).getTime().toString())
            } else {
                const defaultExpiry = Date.now() + (24 * 60 * 60 * 1000);
                localStorage.setItem('expires_at', defaultExpiry.toString());
                console.error("Warning: `expires_at` is missing in authData!")
            }
        }
    },

    getAuthData: () => {
        try {
            return {
                accessToken: localStorage.getItem('access_token'),
                refreshToken: localStorage.getItem('refresh_token'),
                user: JSON.parse(localStorage.getItem('user') || '{}'),
                expiresAt: parseInt(localStorage.getItem('expires_at') || '0')
            }
        } catch (error) {
            console.error('Error parsing user data from localStorage', error)
            return {
                accessToken: null,
                refreshToken: null,
                user: {},
                expiresAt: 0
            }
        }
    },
    
    isTokenValid: () => {
        const expiresAt = parseInt(localStorage.getItem('expires_at') || '0')
        console.log('Token expires at:', new Date(expiresAt).toLocaleString())
        console.log('Current time:', new Date().toLocaleString())
        return expiresAt > Date.now()   
        // return (expiresAt + Date.now()) > Date.now()   
        // return true   
    },

    clearAuthData: () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        localStorage.removeItem('expires_at')
    }
}

const api = axios.create({
    baseURL: API_URL,
    headers:{
        'Content-Type' : 'application/json'
    },
    timeout: 10000
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(
        prom => {
            if (error) prom.reject(error)
            else prom.resolve(token)
        }
    )

    failedQueue = []
}

api.interceptors.response.use(
    (response) => response, 
    async (error) => {
        const orig = error.config

        if ( 
            error.code === 'ECONNABORTED' ||
            error.message === 'Network Error'
        ) return Promise.reject(error)

        if (
            error.response?.status === 401 &&
            !orig._retry
        ) {
            orig._retry = true

            if (isRefreshing){
                return new Promise (
                    (resolve, reject) => {
                        failedQueue.push({
                            resolve,
                            reject
                        })
                    }
                )
                .then(token => {
                    orig.headers.Authorization = `Bearer ${token}`
                    return axios(orig)
                })
                .catch(err => {
                    return Promise.reject(err)
                })
            }

            isRefreshing = true

            try {
                const rt = localStorage.getItem('refresh_token')

                if (!rt) throw new Error ('No refresh token available') 

                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refresh_token: rt
                })

                if (response.data && response.data.session){
                    authUtils.saveAuthData(response.data)
                    const nt = response.data.session.access_token

                    orig.headers.Authorization = `Bearer ${nt}`
                    processQueue(null, nt)
                    return axios(orig)
                } else throw new Error('Invallid refresh response')
            } catch (re) {
                processQueue(re, null)
                authUtils.clearAuthData()
                if (typeof window !== 'undefined') window.location.href = ROUTES.LOGIN
                return Promise.reject(re)
            }
        }
        return Promise.reject(error)
    }
)

// auth api
export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { 
            email, 
            password
        })
        authUtils.saveAuthData(response.data)
        return response
    } catch (error) {
        throw error
    }
}

// di lng ko mag authUtils ani kay mu redirect mn ni sha sa login
// si login nay bahala sa session
// but if you want, na ig human register deretso sa dashboar
// it is possible
export const register = async (userData) => {
    return await api.post('/auth/register', userData)
}

export const resetPassword = async (email) => {
    return await api.post('/auth/reset-password', {
        email
    })
}

export const logout = async () => {
    try {
        const response = await api.post('/auth/logout')
        authUtils.clearAuthData()
        return response
    } catch (error) {
        authUtils.clearAuthData()
        throw error
    }

}

export const isAuthenticated = () => {
    return !!localStorage.getItem('access_token') && authUtils.isTokenValid()
}

export const getCurrentUser = () => {
    return authUtils.getAuthData().user
}

// user api
export const getUserProfile = async () => {
    return await api.get('/users/profile')
}

export const updateUserProfile = async (profileData) => {
    try {
        const response = await api.put('/users/profile', profileData)
        const curr = authUtils.getAuthData()
        if (response.data){
            localStorage.setItem(
                'user', 
                JSON.stringify({
                    ...curr.user,
                    ...response.data
                })
            )
        }
        return response
    } catch (error) {
        throw error
    }
}

// export mga rooms api 
export const getRooms = async () => {
    const res = await api.get('/rooms')
    console.log('from api getrooms: ', res)
    return res
}

export const getRoomById = async (id) => {
    return await api.get(`/rooms/id/${id}`)
}

export const getRoomByCode = async (code) => {
    return await api.get(`/rooms/code/${code}`)
}

export const createRoom = async (roomData) => {
    return await api.post('/rooms', roomData)
}

export const updateRoom = async (id, roomData) => {
    return await api.put(`/rooms/id/${id}`, roomData)
}

export const deleteRoom = async (id) => {
    return await api.delete(`/rooms/id/${id}`)
}

export const uploadImage = async (formData) => {
    return await api.post('/rooms/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export { authUtils }
export default api  