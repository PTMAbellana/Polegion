import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authUtils } from '@/api/axios';
import { 
    login as apiLogin, 
    register as apiRegister,
    logout as apiLogout,
    // refreshToken,  // ✅ REMOVED: axios interceptor handles this now
    // resetPassword as apiResetPassword 
} from '@/api/auth';
import { AuthState, UserProfileDTO, AuthActionResult } from '@/types';
import { RegisterFormData } from '@/types/forms/auth'; 
import api from '@/api/axios';
import { 
    updateEmail as apiUpdateEmail, 
    updatePassword as apiUpdatePassword, 
    deactivateAccount, 
    updateUserProfile, 
    uploadImage 
} from '@/api/users';
import { useChapterStore } from '@/store/chapterStore';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            isLoggedIn: false,
            authToken: null,
            userProfile: null,
            authLoading: false,
            appLoading: true,
            loginLoading: false,

            // Actions
            setIsLoggedIn: (state) => set({ isLoggedIn: state }),
            setAuthToken: (token) => set({ authToken: token }),
            setUserProfile: (profile) => set({ userProfile: profile }),
            setAuthLoading: (loading) => set({ authLoading: loading }),
            setAppLoading: (loading) => set({ appLoading: loading }),
            setLoginLoading: (loading) => set({ loginLoading: loading }),

            login: async (email: string, password: string): Promise<AuthActionResult> => {
                set({ loginLoading: true });
                try {
                    const response = await apiLogin(email, password);
                    
                    if (!response.success) {
                        return {
                            success: false, 
                            error: response.message || response.error || "Login failed",
                        }
                    }   
                    const data = response.data;
                    
                    if (!data.user) {
                        console.warn("Login successful but user data is missing in response");
                        return {
                            success: false,
                            error: "Login successful but user profile data is missing. Please try again."
                        };
                    }
                    const user = data.user;
                    console.log('Logged in user data:', user.role);
                    const profile: UserProfileDTO = {
                        id: user.id,
                        email: user.email,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        gender: user.gender,
                        phone: user.phone,
                        profile_pic: user.profile_pic,
                        role: user.role,
                    };

                    // 🎯 SAVE CONSISTENT DATA TO LOCALSTORAGE
                    const authDataForStorage = {
                        session: data.session,
                        user: profile  // ← Save the SAME format you use in store
                    };
                    authUtils.saveAuthData(authDataForStorage);

                    set({
                        authToken: data.session.access_token,
                        isLoggedIn: true,
                        userProfile: profile,
                    });

                    return { 
                        success: true,
                        message: response.message 
                    };
                    
                } catch (error: unknown) {
                    console.error("Login error: ", error);
                    const errorMessage = error instanceof Error ? error.message : "An error occurred during login";
                    return { 
                        success: false, 
                        error: errorMessage 
                    };
                } finally {
                    set({ loginLoading: false });
                }
            },

            register: async (formData: RegisterFormData, userType: 'student' | 'teacher'): Promise<AuthActionResult> => {
                set({ loginLoading: true });
                try {
                    // Transform frontend form data to match backend API expectations
                    const apiData = {
                        email: formData.email,
                        password: formData.password,
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        gender: formData.gender.toLowerCase(), // Convert to lowercase to match backend expectation
                        phone: formData.phone,
                        role: userType // Backend expects 'role' instead of 'userType'
                    };
                    
                    const response = await apiRegister(apiData, userType);
                    if (response.success) {
                        return { 
                            success: true,
                            message: response.message,
                            data: response.data 
                        };
                    } else {
                        return { 
                            success: false, 
                            message: response.message || response.error || "Registration failed",
                        };
                    }
                } catch (error: unknown) {
                    console.error('Register Error: ', error);
                    const errorMessage = error instanceof Error ? error.message : "An error occurred during registration";
                    return {
                        success: false,
                        error: errorMessage
                    };
                } finally {
                    set({ loginLoading: false });
                }
            },

            resetPassword: async (token: string, password: string): Promise<AuthActionResult> => {
                set({ loginLoading: true });
                try {
                    const response = await api.post('/auth/reset-password/confirm', {
                        token,
                        password
                    });
                    
                    if (response.status === 200) {
                        return { success: true };
                    } else {
                        return { success: false, error: "Failed to reset password" };
                    }
                } catch (error: unknown) {
                    console.error('Error resetting password:', error);
                    let errorMessage = 'An error occurred while resetting your password';
                    if (error && typeof error === 'object' && 'response' in error) {
                        const axiosError = error as { response?: { data?: { error?: string } } };
                        errorMessage = axiosError?.response?.data?.error || errorMessage;
                    }
                    return {
                        success: false,
                        error: errorMessage
                    };
                } finally {
                    set({ loginLoading: false });
                }
            },

            syncAuthToken: () => {
                const authData = authUtils.getAuthData();
                if (authData.accessToken) {
                    set({
                        authToken: authData.accessToken,
                        isLoggedIn: true
                    });
                    console.log('✅ Auth token synced from localStorage');
                }
            },

            refreshUserSession: async (): Promise<boolean> => {
                const authData = authUtils.getAuthData();
                
                console.log('🔄 Refreshing user session...');
                
                if (!authData.accessToken) {
                    console.log('❌ No access token found');
                    set({
                        authToken: null,
                        userProfile: null,
                        isLoggedIn: false,
                    });
                    return false;
                }

                // ✅ If token expired, refresh it IMMEDIATELY
                if (authUtils.isTokenExpired()) {
                    try {
                        console.log('🔄 Token expired on init, refreshing...');
                        const refreshResult = await api.post('/auth/refresh-token', {
                            refresh_token: authData.refreshToken
                        });
                        
                        if (refreshResult.data.success) {
                            const newData = refreshResult.data.data;
                            authUtils.saveAuthData(newData);
                            set({
                                authToken: newData.session.access_token,
                                isLoggedIn: true,
                                userProfile: newData.user
                            });
                            console.log('✅ Token refreshed successfully on init');
                            return true;
                        }
                    } catch (error) {
                        console.error('❌ Failed to refresh token on init:', error);
                        set({ isLoggedIn: false, authToken: null });
                        return false;
                    }
                }

                // Token is still valid
                set({
                    authToken: authData.accessToken,
                    userProfile: authData.user,
                    isLoggedIn: true
                });
                console.log('✅ Session restored from localStorage with valid token');
                return true;
            },

            logout: async () => {
                await apiLogout();
                authUtils.clearAuthData();
                localStorage.removeItem('auth-storage');
                
                // Clear all chapter progress when logging out
                useChapterStore.getState().reset();
                
                set({
                    authToken: null,
                    userProfile: null,
                    isLoggedIn: false,
                });
            },

            initialize: async () => {
                set({ appLoading: true });
                try {
                    const isValid = await get().refreshUserSession();
                    
                    if (!isValid) {
                        console.log('Session invalid, user not logged in');
                    } else {
                        console.log('Session valid, user logged in');
                    }
                } catch (error) {
                    console.error('Initialization error:', error);
                } finally {
                    set({ appLoading: false });
                }
            },

            // Profile management methods
            updateProfile: async (data: Partial<UserProfileDTO>): Promise<AuthActionResult> => {
                set({ authLoading: true });
                try {
                    const response = await updateUserProfile(data); 
                    
                    if (response.success) {
                        // Update user profile in store
                        const currentProfile = get().userProfile;
                        const updatedProfile = { 
                            ...currentProfile, 
                            ...response.data 
                        };
                        set({ userProfile: updatedProfile });
                        
                        // Update localStorage as well
                        authUtils.updateUserProfile(updatedProfile);
                        
                        return { 
                            success: true, 
                            message: 'Profile updated successfully',
                            data: response.data 
                        };
                    } else {
                        return { 
                            success: false, 
                            error: response.message || 'Failed to update profile' 
                        };
                    }
                } catch (error: unknown) {
                    console.error('Profile update error:', error);
                    const errorMessage = error instanceof Error ? error.message : "An error occurred while updating your profile";
                    return { success: false, error: errorMessage };
                } finally {
                    set({ authLoading: false });
                }
            },

            updateEmail: async (email: string): Promise<AuthActionResult> => {
                set({ authLoading: true });
                try {
                    const response = await apiUpdateEmail(email);

                    if (!response.success) {
                        console.log('Email update failed response:', response);
                        alert(response || 'Failed to update email');
                        return { 
                            success: false, 
                            error: response.message || 'Failed to update email' 
                        };
                    }
                   const { logout } = get();
                   await logout(); // Log out the user after email change
                    return { 
                        success: true, 
                        message: 'Email updated successfully' 
                    };
                } catch (error: unknown) {
                    console.error('Email update error:', error);
                    const errorMessage = error instanceof Error ? error.message : "An error occurred while updating your email";
                    return { success: false, error: errorMessage };
                } finally {
                    set({ authLoading: false });
                }
            },

            updatePassword: async (newPassword: string): Promise<AuthActionResult> => {
                set({ authLoading: true });
                try {
                    const response = await apiUpdatePassword( newPassword );
                    
                    if (!response.success) {
                        return { 
                            success: false, 
                            error: response.message || 'Failed to update password' 
                        };
                    }
                    const { logout } = get();
                    await logout(); // Log out the user after password change
                    return { 
                        success: true, 
                        message: 'Password updated successfully' 
                    };
                } catch (error: unknown) {
                    console.error('Password update error:', error);
                    const errorMessage = error instanceof Error ? error.message : "An error occurred while updating your password";
                    return { 
                        success: false, 
                        error: errorMessage 
                    };
                } finally {
                    set({ authLoading: false });
                }
            },

            deactivate: async (): Promise<AuthActionResult> => {
                set({ authLoading: true });
                try {
                    const response = await deactivateAccount();
                    if (!response.success) {
                        console.log('Account deactivation failed response:', response);
                        alert(response || 'Failed to deactivate account');
                        return {
                            success: false,
                            error: response.message || 'Failed to deactivate account'
                        };
                    }
                    const { logout } = get();
                    await logout(); // Log out the user after account deactivation
                    return {
                        success: true,
                        message: 'Account deactivated successfully'
                    };
                } catch (error: unknown) {
                    console.error('Account deactivation error:', error);
                    const errorMessage = error instanceof Error ? error.message : "An error occurred while deactivating your account";
                    return { success: false, error: errorMessage };
                } finally {
                    set({ authLoading: false });
                }
            },

            uploadProfileImage: async (file: File): Promise<AuthActionResult> => {
                set({ authLoading: true });
                try {
                    const formData = new FormData();
                    formData.append('image', file);
                    
                    const response = await uploadImage(formData);
                    if (response.success) {
                        // Update profile image URL in store
                        const currentProfile = get().userProfile;
                        if (currentProfile) {
                            const updatedProfile = { 
                                ...currentProfile, 
                                profile_pic: response.imageUrl 
                            };
                            set({ userProfile: updatedProfile });
                            authUtils.updateUserProfile(updatedProfile);
                        }
                        
                        return { 
                            success: true, 
                            message: 'Profile image updated successfully',
                            data: { profileImageUrl: response.imageUrl }
                        };
                    } else {
                        return { 
                            success: false, 
                            error: response.message || 'Failed to upload profile image' 
                        };
                    }
                } catch (error: unknown) {
                    console.error('Profile image upload error:', error);
                    const errorMessage = error instanceof Error ? error.message : "An error occurred while uploading your profile image";
                    return { 
                        success: false, 
                        error: errorMessage 
                    };
                } finally {
                    set({ authLoading: false });
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                userProfile: state.userProfile,
                authToken: state.authToken,
            }),
        }
    )
);