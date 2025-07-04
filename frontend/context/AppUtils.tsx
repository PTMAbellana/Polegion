"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Loader from "@/components/Loader";
import { authUtils, getUserProfile } from "@/lib/apiService";

// Define proper types for user profile
interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  gender?: string;
  phone?: string;
  [key: string]: any; // For any additional properties
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
  const refreshUserSession = async (): Promise<boolean> => {
    if (isRefreshing.current) return isLoggedIn;

    setAuthLoading(true);
    try {
      isRefreshing.current = true;
      const authData = authUtils.getAuthData();

      if (authData.accessToken && authUtils.isTokenValid()) {
        setAuthToken(authData.accessToken);

        if (authData.user && Object.keys(authData.user).length > 0) {
          setUserProfile(authData.user);
        }

        setIsLoggedIn(true);

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
        } catch (err: any) {
          if (err.response && err.response.status === 401) {
            logout();
            return false;
          }
        }

        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
    } finally {
      isRefreshing.current = false;
      setAuthLoading(false);
    }
  };

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
  }, []);

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

export const myAppHook = () => {
  const context = useContext(AppUtilsContext);
  if (!context) {
    throw new Error(
      "App Utils functions must be wrapped inside AppUtils Provider",
    );
  }
  return context;
};