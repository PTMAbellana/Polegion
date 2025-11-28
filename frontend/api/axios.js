import { ROUTES } from "@/constants/routes";
import axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create base axios instance
const baseAxios = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
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
	// Debug mode
	debug: process.env.NODE_ENV === 'development' ? console.log : undefined,
});

// Auth utilities
export const authUtils = {
	saveAuthData: (authData) => {
		if (authData?.session) {
			const { session, user } = authData;
			const expiresAt = session.expires_at;
			console.log("💾 Saving auth data - Token expires at:", new Date(expiresAt * 1000).toLocaleString());
			
			localStorage.setItem("access_token", session.access_token);
			localStorage.setItem("refresh_token", session.refresh_token);
			localStorage.setItem("user", JSON.stringify(user));
			localStorage.setItem("expires_at", expiresAt.toString());
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
		// Add 30 second buffer to refresh before actual expiry
		const isExpired = expiresAt <= (now + 30);
		
		if (isExpired && expiresAt > 0) {
			console.log("⏰ Token expired or expiring soon at:", new Date(expiresAt * 1000).toLocaleString());
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
		// Skip token check for auth endpoints and public endpoints (castles, chapters)
		if (config.url?.includes('/auth/login') || 
		    config.url?.includes('/auth/register') || 
		    config.url?.includes('/auth/refresh-token') ||
		    (config.url?.startsWith('castles') && config.method?.toLowerCase() === 'get') ||
		    (config.url?.startsWith('chapters') && config.method?.toLowerCase() === 'get')) {
			// Still add token if available for public endpoints (to get user-specific data)
			const accessToken = localStorage.getItem("access_token");
			if (accessToken && !authUtils.isTokenExpired()) {
				config.headers.Authorization = `Bearer ${accessToken}`;
			}
			return config;
		}

		const accessToken = localStorage.getItem("access_token");
		
		if (!accessToken) {
			console.warn("⚠️ No access token found for request:", config.url);
			return config;
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
async function refreshAccessToken() {
	const refreshToken = localStorage.getItem("refresh_token");
	
	if (!refreshToken) {
		console.error("❌ No refresh token available");
		throw new Error("No refresh token");
	}

	try {
		console.log("🔄 Refreshing access token...");
		
		// // Use plain axios for refresh to avoid interceptor loop
		// const plainAxios = axios.create({
		// 	baseURL: API_URL,
		// 	timeout: 10000,
		// });

		const response = await api.post("/auth/refresh-token", {
			refresh_token: refreshToken
		});

		if (response.status === 200) {
			const newData = response.data.data;
			const newAccessToken = newData.session.access_token;
			
			console.log("✅ Token refresh successful!");
			
			// Update localStorage
			authUtils.saveAuthData(newData);
			
			// Update Zustand store
			if (typeof window !== 'undefined') {
				try {
					const authStorage = localStorage.getItem('auth-storage');
					if (authStorage) {
						const parsed = JSON.parse(authStorage);
						parsed.state.authToken = newAccessToken;
						parsed.state.userProfile = newData.user;
						parsed.state.isLoggedIn = true;
						localStorage.setItem('auth-storage', JSON.stringify(parsed));
					}
				} catch (e) {
					console.error("Failed to update Zustand store:", e);
				}
				
				// Dispatch event to notify other parts of the app
				window.dispatchEvent(new Event('token-refreshed'));
			}

			// Clear cache after token refresh
			api.storage.clear();
			console.log("🗑️ Cache cleared after token refresh");

			return newAccessToken;
		} else {
			throw new Error("Token refresh failed");
		}
	} catch (error) {
		console.error("❌ Token refresh failed:", error);
		
		// Only clear and redirect if it's a 401/403 (invalid refresh token)
		if (error.response?.status === 401 || error.response?.status === 403) {
			console.log("❌ Refresh token is invalid, logging out");
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