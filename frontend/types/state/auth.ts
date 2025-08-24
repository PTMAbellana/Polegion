import { UserProfileDTO } from '../dto';

import { RegisterFormData } from '../auth';

export interface AuthState {
    // Data
    isLoggedIn: boolean;
    authToken: string | null;
    userProfile: UserProfileDTO | null;
    
    // Loading states
    authLoading: boolean;
    appLoading: boolean;
    loginLoading: boolean;
    
    // Actions
    setIsLoggedIn: (state: boolean) => void;
    setAuthToken: (token: string | null) => void;
    setUserProfile: (profile: UserProfileDTO | null) => void;
    setAuthLoading: (loading: boolean) => void;
    setAppLoading: (loading: boolean) => void;
    setLoginLoading: (loading: boolean) => void;
    
    // Async Actions
    login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthActionResult>;
    refreshUserSession: () => Promise<boolean>;
    logout: () => void;
    register: (data: RegisterFormData) => Promise<AuthActionResult>;
    resetPassword: (token: string, password: string) => Promise<AuthActionResult>;
    initialize: () => Promise<void>;
}

export interface AuthActionResult {
    success: boolean;
    error?: string;
    data?: any;
}
