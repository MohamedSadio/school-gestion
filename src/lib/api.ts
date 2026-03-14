import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
  timestamp?: string;
}

export function extractApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error) && error.response?.data) {
    return error.response.data as ApiError;
  }
  return { status: 500, message: 'Une erreur inattendue est survenue.' };
}
