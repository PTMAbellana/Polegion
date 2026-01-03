// api/rooms.js - Room related API calls (Student-only build)
import api from './axios';

// Students can view rooms they've joined
export const getRoomById = async (id) => {
  try {
    const res = await api.get(`/rooms/id/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    throw error;
  }
};

// Students access rooms by code
export const getRoomByCode = async (code, type='student') => {
  try {
    const response = await api.get(`/rooms/student/code/${code}`);
    
    return {
      success: true,
      data: response.data.data,
      message: 'Room fetched successfully'
    };
  } catch (error) {
    console.log("Error fetching room by code:", error);
    return {
      success: false,
      message: error.response?.data?.message || 'Error fetching room by code',
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    }
  }
};

// REMOVED: Teacher-only functions
// - getRooms (list all rooms - teacher only)
// - createRoom (teacher only)
// - updateRoom (teacher only)
// - deleteRoom (teacher only)
// - uploadImage (teacher only)
// - changeVisibility (teacher only)