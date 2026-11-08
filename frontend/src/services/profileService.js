import { apiClient } from './apiClient';

export const profileService = {
  async getMyProfile() {
    const response = await apiClient.get('/profile/me');
    return response.data;
  },

  async updateMyProfile(request) {
    const response = await apiClient.put('/profile/me', request);
    return response.data;
  },

  async getPublicProfile(userId) {
    const response = await apiClient.get(`/users/${userId}/profile`);
    return response.data;
  }
};

