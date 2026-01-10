import { ROUTES } from "@/constants/routes";
import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create completely isolated axios instance for refresh token calls (NO INTERCEPTORS)
const refreshAxios = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000, // 30 seconds for token refresh
});

// Create base axios instance
const baseAxios = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 60000, // 60 seconds for production (cold starts, heavy operations)
});

// Setup cache interceptor
const api = setupCache(baseAxios, {
	ttl: 10 * 60 * 1000, // 10 minutes default cache
	methods: ['get'], // Only cache GET requests
	cachePredicate: {
		statusCheck: (status) => status >= 200 && status < 300,
	},
	// Interpret cache headers
	interpretHeader: false,
	etag: false,
	modifiedSince: false,
	// Don't send cache headers to avoid CORS issues
	headerInterpreter: () => ({}),
	// Don't add cache-control headers to requests
	requestInterceptor: (config) => {
		// Remove cache headers that can cause CORS issues
		// Check both lowercase and capitalized versions
		if (config.headers) {
			delete config.headers['cache-control'];
			delete config.headers['Cache-Control'];
			delete config.headers['if-none-match'];
			delete config.headers['If-None-Match'];
			delete config.headers['if-modified-since'];
			delete config.headers['If-Modified-Since'];
			delete config.headers['pragma'];
			delete config.headers['Pragma'];
		}
		return config;
	},
	// Debug mode
	// debug: process.env.NODE_ENV === 'development' ? console.log : undefined,
});

// Auth utilities
export const authUtils = {
	// In authUtils.saveAuthData, add:
	saveAuthData: (authData) => {
	    if (authData?.session) {
	        const { session, user } = authData;
	        const expiresAt = session.expires_at;
	        console.log("💾 Saving auth data:", {
	            accessToken: session.access_token ? "✅ Present" : "❌ Missing",
	            refreshToken: session.refresh_token ? "✅ Present" : "❌ Missing",
	            expiresAt: new Date(expiresAt * 1000).toLocaleString(),
	            user: user ? "✅ Present" : "❌ Missing"
	        });
	        
	        localStorage.setItem("access_token", session.access_token);
	        localStorage.setItem("refresh_token", session.refresh_token);
	        localStorage.setItem("user", JSON.stringify(user));
	        localStorage.setItem("expires_at", expiresAt.toString());
	        
	        console.log("✅ Auth data saved to localStorage");
	    } else {
	        console.error("❌ Invalid authData structure:", authData);
	    }
	},

	getAuthData: () => {
		try {
			const accessToken = localStorage.getItem("access_token");
			const refreshToken = localStorage.getItem("refresh_token");
			const userStr = localStorage.getItem("user");
			const expiresAtStr = localStorage.getItem("expires_at");

			return {
				accessToken,
				refreshToken,
				user: userStr ? JSON.parse(userStr) : {},
				expiresAt: expiresAtStr ? parseInt(expiresAtStr) : 0,
			};
		} catch (error) {
			console.error("❌ Error parsing user data from localStorage", error);
			return { accessToken: null, refreshToken: null, user: {}, expiresAt: 0 };
		}
	},

	isTokenExpired: () => {
		const expiresAt = parseInt(localStorage.getItem("expires_at") || "0");
		if (!expiresAt) return true;
		
		const now = Math.floor(Date.now() / 1000);
		// Add 5 minute buffer instead of 30 seconds to prevent frequent refreshes during active use
		const bufferSeconds = 5 * 60; // 5 minutes
		const isExpired = expiresAt <= (now + bufferSeconds);
		
		if (isExpired && expiresAt > 0) {
			const timeUntilExpiry = expiresAt - now;
			console.log("⏰ Token expiring soon:", {
				expiresAt: new Date(expiresAt * 1000).toLocaleString(),
				timeUntilExpiry: `${Math.floor(timeUntilExpiry / 60)}m ${timeUntilExpiry % 60}s`,
				willRefresh: isExpired
			});
		}
		
		return isExpired;
	},

	hasValidToken: () => {
		const accessToken = localStorage.getItem("access_token");
		if (!accessToken) return false;
		return !authUtils.isTokenExpired();
	},

	clearAuthData: () => {
		console.log("🗑️ Clearing auth data");
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
			console.error("❌ Error updating user profile in localStorage", error);
		}
	},
};

// Token refresh state management
let isRefreshing = false;
let refreshPromise = null;

// Request interceptor - Check token validity BEFORE making request
api.interceptors.request.use(
	async (config) => {
		// Log all requests in development
		if (process.env.NODE_ENV === 'development') {
			console.log(`📤 Request: ${config.method?.toUpperCase()} ${config.url}`);
		}
		
		// 🚨 CRITICAL: Skip ALL processing for refresh-token endpoint to prevent circular dependency
		if (config.url?.includes('refresh-token')) {
			console.log('⚠️ Skipping interceptor for refresh-token');
			// Return config as-is, no auth headers, no token checks
			return config;
		}

		// Skip token check for auth endpoints and public endpoints
		// Check both with and without leading slash, and with full URL
		const isAuthEndpoint = 
			config.url?.includes('auth/login') || 
			config.url?.includes('auth/register') ||
			config.url?.includes('auth/logout');
		
		const isPublicEndpoint = 
			(config.url?.includes('castles') && config.method?.toLowerCase() === 'get') ||
			(config.url?.includes('chapters') && config.method?.toLowerCase() === 'get');
		
		if (isAuthEndpoint || isPublicEndpoint) {
			if (process.env.NODE_ENV === 'development') {
				console.log('✅ Auth/public endpoint detected, skipping token check');
			}
			// Still add token if available for public endpoints (to get user-specific data)
			const accessToken = localStorage.getItem("access_token");
			if (accessToken && !authUtils.isTokenExpired()) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		}

		// Rest of the interceptor logic for protected endpoints...
		const accessToken = localStorage.getItem("access_token");
		
		if (!accessToken) {
			console.error("❌ No access token found for protected request:", config.url);
			console.error("💡 Hint: User might not be logged in or token was cleared");
			return config; // Let request fail with 401
		}

		// Check if token is expired or expiring soon
		if (authUtils.isTokenExpired()) {
			console.log("⚠️ Token expired/expiring, refreshing before request:", config.url);
			
			// If already refreshing, wait for it
			if (isRefreshing && refreshPromise) {
				console.log("⏳ Waiting for ongoing token refresh...");
				try {
					const newToken = await refreshPromise;
					config.headers.Authorization = `Bearer ${newToken}`;
					return config;
				} catch (error) {
					console.error("❌ Token refresh failed while waiting:", error);
					throw error;
				}
			}

			// Start token refresh
			isRefreshing = true;
			refreshPromise = refreshAccessToken();

			try {
				const newToken = await refreshPromise;
				config.headers.Authorization = `Bearer ${newToken}`;
				console.log("✅ Token refreshed proactively, proceeding with request");
			} catch (error) {
				console.error("❌ Failed to refresh token proactively:", error);
				// Let the request proceed, it will fail with 401 and trigger response interceptor
			} finally {
				isRefreshing = false;
				refreshPromise = null;
			}
		} else {
			// Token is valid, use it
			config.headers.Authorization = `Bearer ${accessToken}`;
		}

		return config;
	},
	(error) => {
		console.error("❌ Request interceptor error:", error);
		return Promise.reject(error);
	}
);

// Refresh token function
export async function refreshAccessToken() {
	// 1. First check if another tab has already refreshed the token
	if (!authUtils.isTokenExpired()) {
		const currentAccessToken = localStorage.getItem("access_token");
		if (currentAccessToken) {
			console.log("✅ Token was already refreshed by another tab/window");
			return currentAccessToken;
		}
	}

	const refreshToken = localStorage.getItem("refresh_token");
	
	if (!refreshToken) {
		console.error("❌ No refresh token available");
		throw new Error("No refresh token");
	}

	try {
		console.log("🔄 Refreshing access token...");
		console.log("🔑 Refresh token (first 20 chars):", refreshToken.substring(0, 20) + "...");
		
		// 🚨 CRITICAL: Use the completely isolated axios instance (NO INTERCEPTORS)
		const response = await refreshAxios.post("/auth/refresh-token", {
			refresh_token: refreshToken
		});

		// Rest of the function remains the same...
		if (response.status === 200) {
		    const newData = response.data.data;
		    
		    // ✅ Validate response structure
		    if (!newData?.session?.access_token || !newData?.session?.refresh_token) {
		        console.error("❌ Invalid response structure from backend:", newData);
		        throw new Error("Invalid token refresh response");
		    }
		    
			console.log("✅ Token refresh successful!");
			console.log("📋 New session data:", {
				hasAccessToken: !!newData.session.access_token,
				hasRefreshToken: !!newData.session.refresh_token,
				hasExpiresAt: !!newData.session.expires_at,
				hasUser: !!newData.user
			});
			
			// ✅ Update localStorage with COMPLETE data
			authUtils.saveAuthData(newData);
			
			// ✅ Update Zustand store properly
			if (typeof window !== 'undefined') {
				try {
					// Get the current Zustand state and update it properly
                    const { useAuthStore } = await import("@/store/authStore");
					const authStore = useAuthStore.getState();
					authStore.setAuthToken(newData.session.access_token);
					authStore.setUserProfile(newData.user);
					authStore.setIsLoggedIn(true);
					
					console.log("✅ Zustand store updated successfully");
				} catch (e) {
					console.error("❌ Failed to update Zustand store:", e);
				}
				
				// Dispatch event to notify other parts of the app
				window.dispatchEvent(new Event('token-refreshed'));
			}

			// Clear cache after token refresh
			api.storage.clear();
			console.log("🗑️ Cache cleared after token refresh");

			return newData.session.access_token;
		} else {
			throw new Error("Token refresh failed");
		}
	} catch (error) {
		console.error("❌ Token refresh failed:", error);
		console.error("❌ Error response:", error.response?.data);
		console.error("❌ Error status:", error.response?.status);
		
		// Only clear and redirect if it's a 401/403 (invalid refresh token)
		if (error.response?.status === 401 || error.response?.status === 403) {
			// CRITICAL: Check if another tab updated the token while we were failing
			const currentRefreshToken = localStorage.getItem("refresh_token");
			if (currentRefreshToken && currentRefreshToken !== refreshToken) {
				console.log("⚠️ Refresh token mismatch - another tab likely refreshed it. Recovering...");
				const currentAccessToken = localStorage.getItem("access_token");
				if (currentAccessToken && !authUtils.isTokenExpired()) {
					console.log("✅ Recovered with new token from other tab");
					return currentAccessToken;
				}
			}

			console.log("❌ Refresh token is invalid, logging out");
			authUtils.clearAuthData();
			localStorage.removeItem('auth-storage');
			
			if (typeof window !== 'undefined') {
				window.location.href = ROUTES.HOME;
			}
		} else if (error.response?.status === 400) {
			// 400 means bad request - likely refresh token is malformed or missing
			console.error("❌ Bad refresh token request - clearing auth and redirecting");
			authUtils.clearAuthData();
			localStorage.removeItem('auth-storage');
			
			if (typeof window !== 'undefined') {
				window.location.href = ROUTES.HOME;
			}
		} else {
			// For other errors (network, timeout), throw and let request fail naturally
			console.warn("⚠️ Token refresh failed due to network/timeout, will retry on next request");
		}
		
		throw error;
	}
}

// Response interceptor - Handle 401 errors as backup
api.interceptors.response.use(
	(response) => {
		// Log cache hits in development
		if (process.env.NODE_ENV === 'development' && response.cached) {
			console.log(`💾 Cache HIT: ${response.config.url}`);
		} else if (process.env.NODE_ENV === 'development') {
			console.log(`🌐 API CALL: ${response.config.url}`);
		}
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// If not 401 or already retried, reject immediately
		if (error.response?.status !== 401 || originalRequest._retry) {
			return Promise.reject(error);
		}

		console.log("� 401 Unauthorized - Token invalid");

		// Mark as retried to prevent infinite loops
		originalRequest._retry = true;

		// If already refreshing, wait for it
		if (isRefreshing && refreshPromise) {
			console.log("⏳ Token refresh in progress, waiting...");
			try {
				const newToken = await refreshPromise;
				originalRequest.headers.Authorization = `Bearer ${newToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}

		// Start token refresh
		isRefreshing = true;
		refreshPromise = refreshAccessToken();

		try {
			const newToken = await refreshPromise;
			originalRequest.headers.Authorization = `Bearer ${newToken}`;
			console.log("✅ Retrying request with new token");
			return api(originalRequest);
		} catch (refreshError) {
			console.error("❌ Cannot retry request, token refresh failed");
			return Promise.reject(refreshError);
		} finally {
			isRefreshing = false;
			refreshPromise = null;
		}
	}
);

// Export cache control utilities
export const cacheControl = {
	clear: () => {
		api.storage.clear();
		console.log("🗑️ All cache cleared");
	},
	get stats() {
		return {
			size: api.storage.data?.size || 0,
			keys: Array.from(api.storage.data?.keys() || [])
		};
	}
};

// Make cache control available in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
	window.cacheControl = cacheControl;
	console.log("💡 Cache control available: window.cacheControl");
}

export default api;