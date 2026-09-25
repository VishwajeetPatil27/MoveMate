import { apiClient, ApiResponse } from './apiClient';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/auth';

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', payload);
  return response.data.data;
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
  return response.data.data;
}

export async function refreshTokenApi(refreshToken: string): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken });
  return response.data.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}
