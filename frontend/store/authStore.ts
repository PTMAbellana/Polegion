import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authUtils } from '@/api/axios';
import { getUserProfile } from '@/api/users';
import { login as apiLogin, register as apiRegister, resetPassword as apiResetPassword } from '@/api/auth';
import { AuthState, UserProfileDTO, RegisterFormData } from '@/types'; 
import api from '@/api/axios';

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

            login: async (email: string, password: string, rememberMe = false) => {
                set({ loginLoading: true });
                try {
                    const response = await apiLogin(email, password);

                    if (response?.data?.session?.access_token) {
                        set({
                            authToken: response.data.session.access_token,
                            isLoggedIn: true,
                        });

                        if (rememberMe) {
                            localStorage.setItem("remember_user", "true");
                        }

                        if (response.data.user) {
                            const userProfile: UserProfileDTO = {
                                id: response.data.user.id,
                                email: response.data.user.email,
                                fullName: response.data.user.user_metadata?.fullName,
                                gender: response.data.user.user_metadata?.gender,
                                phone: response.data.user.user_metadata?.phone,
                                profile_pic: response.data.user.user_metadata?.avatar_url,
                                created_at: response.data.user.created_at,
                                updated_at: response.data.user.updated_at,
                            };
                            set({ userProfile });
                        }

                        return { success: true };
                    } else {
                        return { success: false, error: "Invalid login response" };
                    }
                } catch (error: any) {
                    console.error("Login error: ", error);
                    return { 
                        success: false, 
                        error: error?.response?.data?.error || "An error occurred during login" 
                    };
                } finally {
                    set({ loginLoading: false });
                }
            },

            register: async (formData: RegisterFormData) => {
                set({ loginLoading: true });
                try {
                    const response = await apiRegister(formData);
                    if (response) {
                        return { success: true };
                    } else {
                        return { success: false, error: "Failed to register user" };
                    }
                } catch (error: any) {
                    console.error('Register Error: ', error);
                    return {
                        success: false,
                        error: error?.response?.data?.error || "An error occurred during registration"
                    };
                } finally {
                    set({ loginLoading: false });
                }
            },

            resetPassword: async (token: string, password: string) => {
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
                } catch (error: any) {
                    console.error('Error resetting password:', error);
                    return {
                        success: false,
                        error: error?.response?.data?.error || 'An error occurred while resetting your password'
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

                if (authData.accessToken) {
                    setAuthToken(authData.accessToken);
                    setIsLoggedIn(true);

                    try {
                        const profileResponse = await getUserProfile();
                        if (profileResponse?.data) {
                            setUserProfile(profileResponse.data);
                            const updatedUser = {
                                ...authData.user,
                                ...profileResponse.data,
                            };
                            localStorage.setItem("user", JSON.stringify(updatedUser));
                        }
                        return true;
                    } catch {
                    console.log("Profile fetch failed, but keeping user logged in - axios interceptor will handle token refresh");
                        return true;
                    }
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

            logout: () => {
                authUtils.clearAuthData();
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