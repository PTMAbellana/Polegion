import api from './axios';

export const getUserProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
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
    console.error('Error updating email:', error);
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
    return {
      success: true,
      imageUrl: response.data.data.imageUrl,
      message: response.data.message || 'Image uploaded successfully'
    };
  } catch (error) {
    console.error("Error uploading banner image:", error);

    // Enhanced error handling for file uploads
    if (error.response?.data?.error) {
      return {
        success: false,
        error: error.response.data.error,
        message: error.response.data.message || 'Image upload failed',
        status: error.response.status
      }
    } else if (error.code === "ECONNABORTED") {
      return {
        success: false,
        error: 'Upload timeout - please try again with a smaller file or check your connection',
        message: 'The upload took too long and was aborted.',
        status: 408 // Request Timeout
      }
    } else if (error.message === "Network Error") {
      return {
        success: false,
        error: 'Network error - please check your internet connection',
        message: 'A network error occurred while trying to upload the image.',
        status: 503 // Service Unavailable
      }
    } else if (error.response?.status === 404) {
      return {
        success: false,
        error: 'Endpoint not found - please contact support',
        message: 'The upload endpoint could not be found.',
        status: 404
      }
    } else {
      return {
        success: false,
        error: 'An unknown error occurred during image upload',
        message: 'Please try again later.',
        status: error.response?.status || 500
      }
    }
  } 
}

// Get student progress by user ID (castles + competitions)
export const getStudentProgress = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/progress`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch student progress',
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status
    };
  }
};

// Get user's castle progress
export const getUserCastleProgress = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/castle-progress`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error fetching castle progress:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch castle progress',
      status: error.response?.status
    };
  }
};

// Get user's assessment scores (pretest and posttest)
export const getUserAssessmentScores = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/assessment-scores`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error fetching assessment scores:', error);
    return {
      success: false,
      error: error.response?.data?.error || 'Failed to fetch assessment scores',
      status: error.response?.status
    };
  }
};