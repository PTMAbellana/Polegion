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