import { apiClient } from './apiClient';

export const locationService = {
  async searchLocations(search) {
    const params = search ? { search } : {};
    const response = await apiClient.get('/locations', { params });
    return response.data;
  },

  async getLocationById(id) {
    const response = await apiClient.get(`/locations/${id}`);
    return response.data;
  }
};

