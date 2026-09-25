import axios from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
  timestamp: string;
  path: string;
}

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('movemate_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.warn(`[API Client Error] ${error.response.status}:`, error.response.data);
      if (error.response.status === 401) {
        localStorage.removeItem('movemate_token');
        localStorage.removeItem('movemate_refresh_token');
      }
    } else if (error.request) {
      console.error('[API Network Error] No response received:', error.message);
    } else {
      console.error('[API Client Internal Error]:', error.message);
    }
    return Promise.reject(error);
  }
);
