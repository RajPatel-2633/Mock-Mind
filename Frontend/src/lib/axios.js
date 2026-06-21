import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
  withCredentials: true, // Send cookies across cross-origin requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptor for token refresh
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
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't already retried this request
    // Also ensure we don't try to intercept the refresh route itself
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh') {
      
      if (isRefreshing) {
        // If a refresh is already in progress, queue this request
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token using HttpOnly cookies
        await api.post('/auth/refresh');
        
        // If successful, process all queued requests
        processQueue(null);
        
        // Retry the original request that triggered the 401
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g., refresh token expired/invalid), process queue with error
        processQueue(refreshError, null);
        
        // Redirect user to login page if not already on login or signup
        if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
