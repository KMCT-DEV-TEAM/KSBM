import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000/api' : 'https://ksbm-bs43.onrender.com/api'),
  withCredentials: true, // Crucial for sending and receiving httpOnly cookies
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  }
});
// const api = axios.create({
//   baseURL: 'https://ksbm-bs43.onrender.com/api', // Adjust this in production
//   withCredentials: true, // Crucial for sending and receiving httpOnly cookies
// });

let activeRequests = 0;
let loadingTimer = null;
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

const updateLoadingState = () => {
  if (activeRequests > 0) {
    if (loadingTimer) clearTimeout(loadingTimer);
    window.dispatchEvent(new CustomEvent('axios-loading', { detail: true }));
  } else {
    // Small debounce to prevent flashing on sequential requests
    loadingTimer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('axios-loading', { detail: false }));
    }, 300);
  }
};

// Request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    if (!config.hideLoader) {
      activeRequests++;
      updateLoadingState();
    }

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration (401)
api.interceptors.response.use(
  (response) => {
    if (!response.config.hideLoader) {
      activeRequests--;
      updateLoadingState();
    }
    return response;
  },
  async (error) => {
    if (!error.config?.hideLoader) {
      activeRequests--;
      updateLoadingState();
    }

    const originalRequest = error.config;

    // If the error is 401 and we haven't already retried this request, and it's not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/users/refresh') {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to get a new access token using the httpOnly refresh cookie
        const { data } = await axios.post(`${api.defaults.baseURL}/users/refresh`, {}, { withCredentials: true });

        // Update the access token in local storage
        localStorage.setItem('accessToken', data.accessToken);

        // Process any queued requests
        processQueue(null, data.accessToken);

        // Update the authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // If the refresh token is also expired or invalid, log the user out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
