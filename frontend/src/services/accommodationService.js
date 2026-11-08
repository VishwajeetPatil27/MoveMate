import { apiClient } from './apiClient';

export const accommodationService = {
  async searchAccommodations(params = {}) {
    const res = await apiClient.get('/accommodations', { params });
    return res.data;
  },

  async getAccommodationById(id) {
    const res = await apiClient.get(`/accommodations/${id}`);
    return res.data;
  },

  async createAccommodation(request) {
    const res = await apiClient.post('/accommodations', request);
    return res.data;
  },

  async updateAccommodation(id, request) {
    const res = await apiClient.put(`/accommodations/${id}`, request);
    return res.data;
  },

  async deleteAccommodation(id) {
    const res = await apiClient.delete(`/accommodations/${id}`);
    return res.data;
  },

  async getMyAccommodations(page = 0, size = 10) {
    const res = await apiClient.get('/accommodations/me', {
      params: { page, size }
    });
    return res.data;
  },

  async getSavedAccommodations(page = 0, size = 10) {
    const res = await apiClient.get('/accommodations/saved', {
      params: { page, size }
    });
    return res.data;
  },

  async toggleFavorite(id) {
    const res = await apiClient.post(`/accommodations/${id}/favorite`);
    return res.data;
  }
};

