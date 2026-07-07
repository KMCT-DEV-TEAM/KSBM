import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this in production
  withCredentials: true, // Crucial for sending and receiving httpOnly cookies
});

// Request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to get a new access token using the httpOnly refresh cookie
        const { data } = await api.post('/users/refresh');

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
