import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

const api = axios.create({
    baseURL: API_URL,
    headers:{
        'Content-Type' : 'application/json'
    }
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    (error) => Promise.reject(error)
)

// auth api
export const login = async (email, password) => {
    return api.post('/auth/login', { 
        email, 
        password
    })
}

export const register = async (userData) => {
    return api.post('/auth/register', userData)
}

export const resetPassword = async (email) => {
    return api.post('/auth/reset-password', {
        email
    })
}

// teka ende ko alam pano mag logout TTOTT
// pero ok ramn ang backend ani
// so why? hmm
export const logout = async () => {
    try {
        const response = await api.post('/auth/logout')
        localStorage.removeItem('access_token')
        return response
    } catch (error) {
        localStorage.removeItem('access_token')
        throw error
    }

}

// user api
export const getUserProfile = async () => {
    return api.get('/users/profile')
}

export const updateUserProfile = async (profileData) => {
    return api.put('/users/profile', profileData)
}

// export mga rooms api 
export const getRooms = async () => {
    return api.get('/rooms')
}

export const getRoom = async (id) => {
    return api.get(`/rooms/${id}`)
}

export const createRoom = async (roomData) => {
    return api.post('/rooms', roomData)
}

export const updateRoom = async (id, roomData) => {
    return api.put(`/rooms/${id}`, roomData)
}

export const deleteRoom = async (id) => {
    return api.delete(`/rooms/${id}`)
}

export const uploadImage = async (file) => {
    const formData = new FormData()
    formData.append('image', file)

    return api.post('/rooms/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export default api