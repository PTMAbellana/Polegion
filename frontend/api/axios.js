import { ROUTES } from "@/constants/routes";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
});

// Simplified auth utilities
export const authUtils = {
	saveAuthData: (authData) => {
		if (authData?.session) {
			const { session, user } = authData;
			console.log("Session data:", session);
			console.log("User data:", user);
			localStorage.setItem("access_token", session.access_token);
			localStorage.setItem("refresh_token", session.refresh_token);
			localStorage.setItem("user", JSON.stringify(user));
			localStorage.setItem("expires_at", session.expires_at);
		}
	},

	getAuthData: () => {
		try {
			return {
				accessToken: localStorage.getItem("access_token"),
				refreshToken: localStorage.getItem("refresh_token"),
				user: JSON.parse(localStorage.getItem("user") || "{}"),
				expiresAt: parseInt(localStorage.getItem("expires_at") || "0"),
			};
		} catch (error) {
			console.error("Error parsing user data from localStorage", error);
			return { accessToken: null, refreshToken: null, user: {}, expiresAt: 0 };
		}
	},

	isTokenValid: () => {
		const expiresAt = parseInt(localStorage.getItem("expires_at") || 0);
		return expiresAt > Math.floor(Date.now() / 1000);
	},

	clearAuthData: () => {
		[
			"access_token", 
			"refresh_token", 
			"user", 
			"expires_at", 
		].forEach(
			(key) => localStorage.removeItem(key)
		);
	},

	updateUserProfile: (updatedProfile) => {
		try {
			localStorage.setItem("user", JSON.stringify(updatedProfile));
		} catch (error) {
			console.error("Error updating user profile in localStorage", error);
		}
	},
};

// Request interceptor
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

// Simplified response interceptor
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    isRefreshing = false;
    failedQueue = [];
};

// ✅ NEW: Function to update authStore after token refresh
const updateAuthStoreAfterRefresh = (newData) => {
	try {
		// Dynamically import to avoid circular dependencies
		import('@/store/authStore').then(({ useAuthStore }) => {
			const store = useAuthStore.getState();
			
			if (newData?.user && newData?.session) {
				const profile = {
					id: newData.user.id,
					email: newData.user.email,
					first_name: newData.user.first_name,
					last_name: newData.user.last_name,
					gender: newData.user.gender,
					phone: newData.user.phone,
					profile_pic: newData.user.profile_pic,
					role: newData.user.role,
				};
				
				store.setAuthToken(newData.session.access_token);
				store.setUserProfile(profile);
				store.setIsLoggedIn(true);
				
				console.log('✅ AuthStore updated after token refresh');
			}
		}).catch(error => {
			console.error('Error importing authStore:', error);
		});
	} catch (error) {
		console.error('Error updating authStore after refresh:', error);
	}
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call your refresh token endpoint
                const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                    refresh_token: authUtils.getAuthData().refreshToken
                });

                if (response.data.success) {
                    const newAccessToken = response.data.data.session.access_token;
                    
                    // Update stored auth data
                    authUtils.saveAuthData(response.data.data);
                    
                    // ✅ NEW: Update authStore to keep UI in sync
                    updateAuthStoreAfterRefresh(response.data.data);

                    // Update the original request with new token
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    
                    // Process queued requests with new token
                    processQueue(null, newAccessToken);
                    
                    // Retry original request
                    return api(originalRequest);
                } else {
                    // Refresh failed, logout user
                    authUtils.clearAuthData();
                    localStorage.removeItem('auth-storage');
                    window.location.href = ROUTES.HOME; 
                    processQueue(new Error('Token refresh failed'), null);
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                authUtils.clearAuthData();
                localStorage.removeItem('auth-storage');
                window.location.href = ROUTES.HOME;
                processQueue(refreshError, null);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;