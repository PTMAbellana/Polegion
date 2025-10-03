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

			const expiresAt = session.expires_at
				? session.expires_at * 1000
				: Date.now() + 24 * 60 * 60 * 1000;

			localStorage.setItem("expires_at", expiresAt.toString());
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
		const expiresAt = parseInt(localStorage.getItem("expires_at") || "0");
		return expiresAt > Date.now();
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
	failedQueue.forEach((prom) => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		
		// Don't retry for certain errors
		if (
			error.code === "ECONNABORTED" ||
			error.message === "Network Error" ||
			[403, 404].includes(error.response?.status)
		) {
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			
			const authData = authUtils.getAuthData();
			if (authData.refreshToken && !isRefreshing) {
				isRefreshing = true;
				
				try {
					const refreshResponse = await axios.post(`${API_URL}/auth/refresh`, {
						refresh_token: authData.refreshToken
					});
					
					if (refreshResponse.data.success) {
						const newSession = refreshResponse.data.data.session;
						const userData = refreshResponse.data.data.user;
						
						// Update localStorage
						authUtils.saveAuthData({
							session: newSession,
							user: userData
						});
						
						// Update the authorization header
						api.defaults.headers.common['Authorization'] = `Bearer ${newSession.access_token}`;
						originalRequest.headers['Authorization'] = `Bearer ${newSession.access_token}`;
						
						processQueue(null, newSession.access_token);
						return api(originalRequest);
					} else {
						processQueue(error, null);
						authUtils.clearAuthData();
						window.location.href = '/auth/login';
						return Promise.reject(error);
					}
				} catch (refreshError) {
					processQueue(refreshError, null);
					authUtils.clearAuthData();
					window.location.href = '/auth/login';
					return Promise.reject(refreshError);
				} finally {
					isRefreshing = false;
				}
			} else {
				authUtils.clearAuthData();
				window.location.href = '/auth/login';
			}
		}
		
		return Promise.reject(error);
	}
);

export default api;