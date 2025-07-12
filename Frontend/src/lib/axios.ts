// src/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5555/api', // Change if your backend runs elsewhere
  withCredentials: true, // Important for cookies/session auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token if available
instance.interceptors.request.use(
  (config) => {
    // For now, we'll rely on cookies for authentication
    // The backend will handle both cookie and Bearer token auth
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
