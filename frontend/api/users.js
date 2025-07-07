import api, { authUtils } from './axios';

export const getUserProfile = async () => {
  return await api.get("/users/profile");
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put("/users/profile", profileData);
    const curr = authUtils.getAuthData();
    if (response.data) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...curr.user,
          ...response.data,
        }),
      );
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateEmail = async (newEmail) => {
  console.log(newEmail);
  try {
    const response = await api.put('/users/change-email', { newEmail });
    const curr = authUtils.getAuthData();
    if (response.data) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...curr.user,
          ...response.data
        })
      );
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (newPassword) => {
  try {
    const response = await api.put('/users/change-password', { newPassword });
    const curr = authUtils.getAuthData();
    if (response.data) {
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...curr.user,
          ...response.data
        })
      );
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const deactivateAccount = async () => {
  try {
    const response = await api.put('/users/deactivate');
    return response;
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (formData) => {
  try {
    console.log("Uploading banner image...");

    // Use the NEW separated endpoint
    const response = await api.post("/users/upload-profile-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000, // Longer timeout for file uploads
    });

    console.log("Image upload response:", response.data);
    return response;
  } catch (error) {
    console.error("Error uploading banner image:", error);

    // Enhanced error handling for file uploads
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
}