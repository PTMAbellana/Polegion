"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import Loader from "@/components/Loader";
import { authUtils } from "@/api/axios";
import { getUserProfile } from "@/api/users";

// Define proper types for user profile
interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  gender?: string;
  phone?: string;
  profile_pic?: string,
  [key: string]: unknown; // For any additional properties
}

interface AppUtilsType {
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  userProfile: UserProfile | null;
  setUserProfile: (profile: UserProfile | null) => void;
  authLoading: boolean;
  appLoading: boolean;
  setAppLoading: (state: boolean) => void;
  refreshUserSession: () => Promise<boolean>;
  logout: () => void;
}

const AppUtilsContext = createContext<AppUtilsType | undefined>(undefined);

export const AppUtilsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Separate loading states
  const [authLoading, setAuthLoading] = useState(true);
  const [appLoading, setAppLoading] = useState(true);

  const isRefreshing = useRef(false);
  const hasInitialized = useRef(false);

  // Function to refresh user session data from localStorage
const refreshUserSession = useCallback(async (): Promise<boolean> => {
  // alert(1)
  if (isRefreshing.current) return isLoggedIn;

  setAuthLoading(true);
  try {
    isRefreshing.current = true;
    const authData = authUtils.getAuthData();

    // ✅ If we have an access token, use it (don't check expiration here)
    if (authData.accessToken) {
      setAuthToken(authData.accessToken);
      setIsLoggedIn(true);

      // ✅ Try to fetch user profile to verify token is still valid
      try {
        const pr = await getUserProfile();
        if (pr?.data) {
          setUserProfile(pr.data);
          const updateUser = {
            ...authData.user,
            ...pr.data,
          };
          localStorage.setItem("user", JSON.stringify(updateUser));
        }
        return true;
      } catch {
        // If getUserProfile fails, the axios interceptor will handle token refresh automatically
        // Don't logout here, just set the basic auth state
        console.log("Profile fetch failed, but keeping user logged in - axios interceptor will handle token refresh");
        return true;
      }
    }
    // ❌ Only logout if we have no token at all
    else if (!authData.accessToken && !authData.refreshToken) {
      logout();
      return false;
    }

    return true;
  } catch (error) {
    console.error("Session refresh error:", error);
    // Don't automatically logout on error - let axios interceptor handle it
    return isLoggedIn;
  } finally {
    isRefreshing.current = false;
    setAuthLoading(false);
  }
}, [isLoggedIn]);


  // Function to handle logout
  const logout = () => {
    authUtils.clearAuthData();
    setAuthToken(null);
    setUserProfile(null);
    setIsLoggedIn(false);
  };

  // Initialize on component mount
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      setAppLoading(true);
      refreshUserSession().finally(() => {
        setAppLoading(false);
      });
    }
  }, [refreshUserSession]);

  // Debug logging for state changes
  useEffect(() => {
    // You can keep or remove this log
    // console.log("Auth state changed:", {
    //   isLoggedIn,
    //   hasToken: !!authToken,
    //   hasProfile: !!userProfile,
    // });
  }, [isLoggedIn, authToken, userProfile]);

  // Show loader if either authLoading or appLoading is true
  return (
    <AppUtilsContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        authToken,
        setAuthToken,
        userProfile,
        setUserProfile,
        authLoading,
        appLoading,
        setAppLoading,
        refreshUserSession,
        logout,
      }}
    >
      {(authLoading || appLoading) ? <Loader /> : children}
    </AppUtilsContext.Provider>
  );
};

export const useMyApp = () => {
  const context = useContext(AppUtilsContext);
  if (!context) {
    throw new Error(
      "App Utils functions must be wrapped inside AppUtils Provider",
    );
  }
  return context;
};
