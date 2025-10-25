import api, { authUtils } from './axios';

export const refreshToken = async () => {
  try {
    const response = await api.post(`auth/refresh-token`, {
      refresh_token: localStorage.getItem("refresh_token"),
    });
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || 'Token refresh failed',
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status
    }
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    console.log('Login response data:', response.data);
    // Don't save auth data here, let the auth store handle it
    // authUtils.saveAuthData(response.data);
    return {
      success: true,
      message: response.data.message,
      data: response.data.data || response.data  // Handle both nested and direct data
    };
  } catch (error) {
    console.log('Login error:', error)
    return {
      success: false,
      error: error.response?.data?.error || 'Login failed',
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status
    }
  }
};

export const register = async (userData, userType) => {
  try {
    const response = await api.post("/auth/register", {
      ...userData,
      userType,
    });
    return {
      success: true,
      message: response.data.message,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response.data.error,
      message: error.response.data.message,
      status: error.response.status
    }
  }
};

// babalik ako sayo, sa kanang return nimo
// tarongon nya tika
export const resetPassword = async (email) => {
  return await api.post("/auth/reset-password", {
    email,
  });
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    authUtils.clearAuthData();
    return response.data;
  } catch (error) {
    authUtils.clearAuthData();
    return {
      success: false,
      error: error.response?.data?.error || 'Logout failed',
      message: error.response?.data?.message || 'An error occurred',
      status: error.response?.status
    }
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token") && authUtils.isTokenValid();
};

export const getCurrentUser = () => {
  return authUtils.getAuthData().user;
};