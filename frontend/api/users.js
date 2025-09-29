export const getUserProfile = async () => {
  return await api.get("/users/profile");
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.patch("/users/profile", profileData);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Profile update failed',
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status
    };
  }
};

export const updateEmail = async (newEmail) => {
  console.log(newEmail);
  try {
    const response = await api.patch('/users/change-email', { newEmail });
    console.log('Email update response:', response);
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Email update failed',
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status
    };
  }
};

export const updatePassword = async (newPassword) => {
  try {
    const response = await api.patch('/users/change-password', { newPassword });
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Password update failed',
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status
    }
  }
};

export const deactivateAccount = async () => {
  try {
    const response = await api.patch('/users/deactivate');
    return {
      success: true,
      message: response.data.message
    };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Account deactivation failed',
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status
    };
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
    return response.data;
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