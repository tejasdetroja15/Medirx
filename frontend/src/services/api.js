import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle session expiration
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to login if needed
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;