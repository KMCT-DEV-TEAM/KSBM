import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this in production
  withCredentials: true, // Crucial for sending and receiving httpOnly cookies
});

let activeRequests = 0;
let loadingTimer = null;

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
    activeRequests++;
    updateLoadingState();
    
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
    activeRequests--;
    updateLoadingState();
    return response;
  },
  async (error) => {
    activeRequests--;
    updateLoadingState();
    
    const originalRequest = error.config;

    // If the error is 401 and we haven't already retried this request, and it's not the refresh endpoint itself
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/users/refresh') {
      originalRequest._retry = true;

      try {
        // Attempt to get a new access token using the httpOnly refresh cookie
        const { data } = await axios.post('http://localhost:5000/api/users/refresh', {}, { withCredentials: true });

        // Update the access token in local storage
        localStorage.setItem('accessToken', data.accessToken);

        // Update the authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh token is also expired or invalid, log the user out
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
