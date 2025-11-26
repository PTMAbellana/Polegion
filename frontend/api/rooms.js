// api/rooms.js - Room related API calls
import api from './axios';

export const getRooms = async () => {
  try {
    const res = await api.get("/rooms");
    return {
      success: true,
      data: res.data.data,
      message: 'Rooms fetched successfully'
    };
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return {
      success: false,
      message: error.response?.data?.error || 'Error fetching rooms',
      error: error.response?.data?.error || error.message,
      status: error.response?.status 
    };
  }
};

export const getRoomById = async (id) => {
  try {
    const res = await api.get(`/rooms/id/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    throw error;
  }
};

export const getRoomByCode = async (code, type='admin') => {
  try {
    let response;
    switch (type) {
      case 'student':
        response = await api.get(`/rooms/student/code/${code}`);
        break;
      case 'teacher':
        response = await api.get(`/rooms/teacher/code/${code}`);
        break;
      default:
        throw new Error(`Unknown room type: ${type}`);
    }

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

export const createRoom = async (roomData) => {
  try {
    const res = await api.post("/rooms", roomData);
    return {
      success: true,
      data: res.data.data,
      message: 'Room created successfully'
    }
  } catch (error) {
    console.error("Error creating room:", error);
    return {
      success: false,
      message: error.response?.data?.error || 'Error creating room',
      error: error.response?.data?.error || error.message,
      status: error.response?.status 
    }
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const res = await api.put(`/rooms/id/${id}`, roomData);
    return {
      success: true,
      data: res.data.data,
      message: 'Room updated successfully'
    }
  } catch (error) {
    console.error("Error updating room:", error);
    return {
      success: false,
      message: error.response?.data?.error || 'Error updating room',
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    };
  }
};

export const deleteRoom = async (id) => {
  try {
    const res = await api.delete(`/rooms/id/${id}`);
    return {
      success: true,
      message: res.data.message || 'Room deleted successfully'
    }
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

export const uploadImage = async (formData) => {
  try {
    console.log("Uploading banner image...");

    const response = await api.post("/rooms/upload-banner", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });

    console.log("Image upload response:", response.data);
    return {
      success: true,
      imageUrl: response.data.data.imageUrl,
      message: response.data.message || 'Image uploaded successfully'
    };
  } catch (error) {
    console.error("Error uploading banner image:", error);

    if (error.response?.data?.error) {
      return {
        success: false,
        message: error.response.data.message,
        error: error.response.data.error, 
        status: error.response.status
      };
    } else if (error.code === "ECONNABORTED") {
      return {
        success: false,
        message: 'Image upload timed out - please try again',
        error: 'Timeout Error',
        status: 408
      };
    } else if (error.message === "Network Error") {
      return {
        success: false,
        message: 'Network error - please check your connection',
        error: 'Network Error',
        status: null
      }
    } else if (error.response?.status === 404) {
      return {
        success: false,
        message: 'Upload endpoint not found (404)',
        error: 'Not Found',
        status: 404
      };
    } else {
      return {
        success: false,
        message: 'An unknown error occurred during image upload',
        error: error.message,
        status: null
      }
    }
  }
};

export const changeVisibility = async (visibility, room_id) => {
  try {
    const response = await api.put("/rooms/change-visibility", {
      room_id,
      visibility
    });
    
    // Invalidate room cache
    await cacheInvalidation.room(room_id);
    
    return response.data;
  } catch (error){
    throw error;
  }
}