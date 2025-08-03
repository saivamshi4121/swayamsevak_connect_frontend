import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Force local development
});

// Add Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token but don't redirect automatically
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api; 