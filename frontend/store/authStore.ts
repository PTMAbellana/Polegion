import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authUtils } from '@/api/axios';
import { getUserProfile } from '@/api/users';

interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  gender?: string;
  phone?: string;
  profile_pic?: string;
  [key: string]: unknown;
}

interface AuthState {
  // State
  isLoggedIn: boolean;
  authToken: string | null;
  userProfile: UserProfile | null;
  authLoading: boolean;
  appLoading: boolean;
  
  // Actions
  setIsLoggedIn: (state: boolean) => void;
  setAuthToken: (token: string | null) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setAppLoading: (loading: boolean) => void;
  refreshUserSession: () => Promise<boolean>;
  logout: () => void;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      isLoggedIn: false,
      authToken: null,
      userProfile: null,
      authLoading: false,
      appLoading: true,

      // Actions
      setIsLoggedIn: (state) => set({ isLoggedIn: state }),
      setAuthToken: (token) => set({ authToken: token }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setAuthLoading: (loading) => set({ authLoading: loading }),
      setAppLoading: (loading) => set({ appLoading: loading }),

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