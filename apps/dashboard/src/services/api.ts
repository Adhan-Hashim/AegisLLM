import axios from "axios";

// Base API URL configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

// Create configured axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor for simple error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // We could dispatch an event to Sonner toast here, but usually better handled in TanStack query
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
