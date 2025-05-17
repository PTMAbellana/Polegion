"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
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
    isLoading: boolean;
    setIsLoading: (state: boolean) => void;
    refreshUserSession: () => Promise<boolean>;
    logout: () => void;
}

const AppUtilsContext = createContext<AppUtilsType | undefined>(undefined);

export const AppUtilsProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [authToken, setAuthToken] = useState<string | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // const [isRefreshing, setIsRefreshing] = useState(false);

    const isRefreshing = useRef(false)
    const hasInitialized = useRef(false)

    // Function to refresh user session data from localStorage
    const refreshUserSession = async () : Promise<boolean> => {
        if (isRefreshing.current) return isLoggedIn
        
        try {
            isRefreshing.current = true
            console.log('Start session refresh...')

            const authData = authUtils.getAuthData()
            
            console.log("Auth data from storage:", {
                hasToken: !!authData.accessToken,
                isTokenValid: authUtils.isTokenValid(),
                userProfile: authData.user
            });
        
            if (
                authData.accessToken 
                // && authUtils.isTokenValid()      //da kapoya aning tokenvalid oiiiii rarararar gi kapoy nako nimoooooooooooooooooo
            ) {
                console.log('Access token exists, treating as valid')
                setAuthToken(authData.accessToken);
            
                if (
                    authData.user && 
                    Object.keys(authData.user).length > 0
                ) {
                    console.log('Setting user profile from storage: ', authData.user)
                    setUserProfile(authData.user)
                }
                
                setIsLoggedIn(true)
                
                try {
                    console.log('Fetching fresh profile data... ')
                    const pr = await getUserProfile()
                    if (pr?.data){
                        console.log('Fresh profile data received: ' , pr.data)
                        setUserProfile(pr.data)
                        // console.log(userProfile)
                        const updateUser = {
                            ...authData.user,
                            ...pr.data
                        }
                        localStorage.setItem('user', JSON.stringify(updateUser))
                    }
                } catch (err) {
                    console.error('Error fetching user profile: ', err)
                    
                    if ( err.response && err.response.status === 401) {
                        console.log('Unauthorized access - logging out');
                        logout();
                        return false;
                    }
                }

                console.log("Session restored: User is logged in");
                return true
            } else {
                // If token is expired and can't be refreshed, reset state
                console.log("No valid token found: User is logged out");
                setAuthToken(null);
                setUserProfile(null);
                setIsLoggedIn(false);
                return false
            }
        } catch (error) {
            console.error('Session refresh error: ', error)
            setIsLoggedIn(false)
            return false
        } finally {
            isRefreshing.current = false
            hasInitialized.current = false
            setIsLoading(false)
            console.log('Session refresh completed, loading state set to false')
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
            hasInitialized.current = true
            refreshUserSession();
        }
    }, []);

    return (
        <AppUtilsContext.Provider 
        value={{ 
            isLoggedIn, 
            setIsLoggedIn, 
            authToken, 
            setAuthToken, 
            userProfile, 
            setUserProfile, 
            isLoading, 
            setIsLoading,
            refreshUserSession,
            logout
        }}
        >
        {isLoading ? <Loader /> : children}
        </AppUtilsContext.Provider>
    );
};

export const myAppHook = () => {
    const context = useContext(AppUtilsContext);
    if (!context) {
        throw new Error("App Utils functions must be wrapped inside AppUtils Provider");
    }
    return context;
};