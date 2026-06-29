import axios from 'axios';
import { useExamStore } from '../store/useExamStore';
import { API_BASE_URL } from '../config';

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors (expired token only)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Jangan redirect jika 401 berasal dari endpoint auth (login/register).
      // Biarkan halaman Login menangani error-nya sendiri via catch block.
      const requestUrl = error.config?.url || '';
      const isAuthEndpoint = requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register');

      if (!isAuthEndpoint) {
        // Hanya redirect untuk 401 dari endpoint terproteksi (token expired/invalid)
        useExamStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
