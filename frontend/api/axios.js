import axios from "axios";
import { ROUTES } from "@/constants/routes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Auth utilities
export const authUtils = {
  saveAuthData: (authData) => {
    if (authData && authData.session) {
      localStorage.setItem("access_token", authData.session.access_token);
      localStorage.setItem("refresh_token", authData.session.refresh_token);
      localStorage.setItem("user", JSON.stringify(authData.user));

      if (authData.session.expires_at) {
        const expiresAt = authData.session.expires_at * 1000;
        localStorage.setItem("expires_at", expiresAt.toString());
      } else {
        const defaultExpiry = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem("expires_at", defaultExpiry.toString());
        console.error("Warning: `expires_at` is missing in authData!");
      }
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
      return {
        accessToken: null,
        refreshToken: null,
        user: {},
        expiresAt: 0,
      };
    }
  },

  isTokenValid: () => {
    const expiresAt = parseInt(localStorage.getItem("expires_at") || "0");
    // console.log("Token expires at:", new Date(expiresAt).toLocaleString());
    // console.log("Current time:", new Date().toLocaleString());
    return expiresAt > Date.now();
  },

  clearAuthData: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("expires_at");
  },
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor with token refresh logic
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const orig = error.config;

    if (
      error.code === "ECONNABORTED" ||
      error.message === "Network Error" ||
      error.response?.status === 403 ||
      error.response?.status === 404
    )
      return Promise.reject(error);

    if (error.response?.status === 401 && !orig._retry) {
      orig._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        })
          .then((token) => {
            orig.headers.Authorization = `Bearer ${token}`;
            return axios(orig);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const rt = localStorage.getItem("refresh_token");
        if (!rt) throw new Error("No refresh token available");

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refresh_token: rt,
        });

        if (response.data && response.data.session) {
          authUtils.saveAuthData(response.data);
          const nt = response.data.session.access_token;
          orig.headers.Authorization = `Bearer ${nt}`;
          processQueue(null, nt);
          return axios(orig);
        } else throw new Error("Invalid refresh response");
      } catch (re) {
        processQueue(re, null);
        authUtils.clearAuthData();
        if (typeof window !== "undefined") window.location.href = ROUTES.LOGIN;
        return Promise.reject(re);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;