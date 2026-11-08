import { apiClient } from './apiClient';

export const localServiceService = {
  async searchServices(params) {
    const response = await apiClient.get('/services', { params });
    return response.data;
  },

  async getNearbyServices(params) {
    const response = await apiClient.get('/services/nearby', { params });
    return response.data;
  },

  async createService(req) {
    const response = await apiClient.post('/services', req);
    return response.data;
  },

  async getServiceById(id, coords) {
    const params = coords || {};
    const response = await apiClient.get(`/services/${id}`, { params });
    return response.data;
  },

  async updateService(id, req) {
    const response = await apiClient.put(`/services/${id}`, req);
    return response.data;
  },

  async deleteService(id) {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },

  async toggleFavorite(id) {
    const response = await apiClient.post(`/services/${id}/favorite`);
    return response.data;
  },

  async getSavedPlaces(params) {
    const response = await apiClient.get('/services/saved', { params });
    return response.data;
  }
};

