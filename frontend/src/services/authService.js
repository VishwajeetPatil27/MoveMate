import { apiClient } from './apiClient';

export async function registerUser(payload) {
  const response = await apiClient.post('/auth/register', payload);
  return response.data.data;
}

export async function loginUser(payload) {
  const response = await apiClient.post('/auth/login', payload);
  return response.data.data;
}

export async function refreshTokenApi(refreshToken) {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  return response.data.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get('/auth/me');
  return response.data.data;
}

