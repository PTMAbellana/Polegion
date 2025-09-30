// api/rooms.js - Room related API calls
import api from './axios';

export const getRooms = async () => {
  try {
    const res = await api.get("/rooms");
    return {
      success: true,
      data: res.data.data,
      message: 'Rooms fetched successfully'
    }
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
    return await api.get(`/rooms/id/${id}`);
  } catch (error) {
    console.error("Error fetching room by ID:", error);
    throw error;
  }
};

export const getRoomByCode = async (code, type='join') => {
  try {
    return type === 'join' ? 
    await api.get(`/rooms/user/code/${code}`) :
    await api.get(`/rooms/admin/code/${code}`) 
  } catch (error) {
    console.error("Error fetching room by code:", error);
    throw error;
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
    const res =  await api.delete(`/rooms/id/${id}`);
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
    return response;
  } catch (error) {
    console.error("Error uploading banner image:", error);

    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Upload timeout - file may be too large");
    } else if (error.message === "Network Error") {
      throw new Error("Network error - please check your connection");
    } else if (error.response?.status === 404) {
      throw new Error("Upload endpoint not found - check server configuration");
    } else {
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
};

export const changeVisibility = async (visibility, room_id) => {
  try {
    const response = await api.put("/rooms/change-visibility", {
      room_id,
      visibility
    })
    return response.data
  } catch (error){
    throw error
  }
}