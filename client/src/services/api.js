import axios from 'axios';

// Determine the API base URL: from Vite env, or fallback to relative '/api'
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Attach JWT token automatically to every outgoing request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format error messages consistently
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token expired or unauthorized, we can dispatch an event or clear local state
    if (error.response && error.response.status === 401) {
      // Don't auto-redirect on login or register failure
      const currentUrl = error.config?.url || '';
      if (!currentUrl.includes('/auth/login') && !currentUrl.includes('/auth/register')) {
        // clear expired session
        localStorage.removeItem('cc_token');
        localStorage.removeItem('cc_user');
      }
    }

    const message =
      error.response?.data?.message ||
      (error.response?.data?.errors && error.response.data.errors[0]) ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    return Promise.reject(new Error(message));
  }
);

export default api;
