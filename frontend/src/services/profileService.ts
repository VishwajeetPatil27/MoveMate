import { apiClient, ApiResponse } from './apiClient';
import { ProfileDto, ProfileUpdateRequest } from '../types/profile';

export const profileService = {
  async getMyProfile(): Promise<ApiResponse<ProfileDto>> {
    const response = await apiClient.get<ApiResponse<ProfileDto>>('/profile/me');
    return response.data;
  },

  async updateMyProfile(request: ProfileUpdateRequest): Promise<ApiResponse<ProfileDto>> {
    const response = await apiClient.put<ApiResponse<ProfileDto>>('/profile/me', request);
    return response.data;
  },

  async getPublicProfile(userId: number): Promise<ApiResponse<ProfileDto>> {
    const response = await apiClient.get<ApiResponse<ProfileDto>>(`/users/${userId}/profile`);
    return response.data;
  }
};
