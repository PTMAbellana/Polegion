import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authUtils } from '@/api/axios';
import { 
    login as apiLogin, 
    register as apiRegister,
    logout as apiLogout, 
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
                    const response = await apiRegister(formData, userType);
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

            refreshUserSession: async (): Promise<boolean> => {
                const { setAuthLoading, setAuthToken, setIsLoggedIn, setUserProfile, logout } = get();
                
                setAuthLoading(true);
                try {
                    const authData = authUtils.getAuthData();
                    console.log('Auth data from storage:', authData);

                    if (authData.accessToken) {
                        setAuthToken(authData.accessToken);
                        setIsLoggedIn(true);

                        if (authData.user && Object.keys(authData.user).length > 0) {
                            console.log('Loading existing user profile from localStorage');
                            setUserProfile(authData.user); // ← Use your formatted data
                        }
                        
                        return true;
                    } else if (!authData.accessToken && !authData.refreshToken) {
                        logout();
                        return false;
                    }

                    return true;
                } catch (error) {
                    console.error("Session refresh error:", error);
                    return get().isLoggedIn;
                } finally {
                    setAuthLoading(false);
                }
            },

            logout: async () => {
                await apiLogout();
                authUtils.clearAuthData();
                localStorage.removeItem('auth-storage');
                set({
                    authToken: null,
                    userProfile: null,
                    isLoggedIn: false,
                });
            },

            initialize: async () => {
                const { refreshUserSession, setAppLoading } = get();
                    setAppLoading(true);
                try {
                    await refreshUserSession();
                } finally {
                    setAppLoading(false);
                }
            },

            // Profile management methods
            updateProfile: async (data: Partial<UserProfileDTO>): Promise<AuthActionResult> => {
                set({ authLoading: true });
                try {
                    const response = await updateUserProfile(data); 
                    
                    if (response.status === 200 && response.data) {
                        // Update user profile in store
                        const currentProfile = get().userProfile;
                        const updatedProfile = { ...currentProfile, ...response.data.user };
                        set({ userProfile: updatedProfile as UserProfileDTO });
                        
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
                            error: response.data?.message || 'Failed to update profile' 
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
                    formData.append('profileImage', file);
                    
                    const response = await uploadImage(formData);
                    if (response.status === 200 && response.data) {
                        // Update profile image URL in store
                        const currentProfile = get().userProfile;
                        if (currentProfile) {
                            const updatedProfile = { 
                                ...currentProfile, 
                                profile_pic: response.data.profileImageUrl 
                            };
                            set({ userProfile: updatedProfile });
                            authUtils.updateUserProfile(updatedProfile);
                        }
                        
                        return { 
                            success: true, 
                            message: 'Profile image updated successfully',
                            data: { profileImageUrl: response.data.profileImageUrl }
                        };
                    } else {
                        return { 
                            success: false, 
                            error: response.data?.message || 'Failed to upload profile image' 
                        };
                    }
                } catch (error: unknown) {
                    console.error('Profile image upload error:', error);
                    const errorMessage = error instanceof Error ? error.message : "An error occurred while uploading your profile image";
                    return { success: false, error: errorMessage };
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
            }),
        }
    )
);