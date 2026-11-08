import { apiClient } from './apiClient';

export const relocationService = {
  async getMyRelocations() {
    const response = await apiClient.get('/relocations/me');
    return response.data;
  },

  async createRelocation(request) {
    const response = await apiClient.post('/relocations', request);
    return response.data;
  },

  async getRelocationById(id) {
    const response = await apiClient.get(`/relocations/${id}`);
    return response.data;
  },

  async updateRelocation(id, request) {
    const response = await apiClient.put(`/relocations/${id}`, request);
    return response.data;
  },

  async cancelRelocation(id) {
    const response = await apiClient.patch(`/relocations/${id}/cancel`);
    return response.data;
  }
};

