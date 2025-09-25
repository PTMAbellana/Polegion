import api, { authUtils } from './axios';

export const refreshToken = async () => {
  try {
    return await api.post(`auth/refresh-token`, {
      refresh_token: localStorage.getItem("refresh_token"),
    });
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    authUtils.saveAuthData(response.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const register = async (userData, userType) => {
  return await api.post("/auth/register", { ...userData, userType });
};

export const resetPassword = async (email) => {
  return await api.post("/auth/reset-password", {
    email,
  });
};

export const logout = async () => {
  try {
    const response = await api.post("/auth/logout");
    authUtils.clearAuthData();
    return response;
  } catch (error) {
    authUtils.clearAuthData();
    throw error;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token") && authUtils.isTokenValid();
};

export const getCurrentUser = () => {
  return authUtils.getAuthData().user;
};