import { apiClient } from './apiClient';

export const communityService = {
  async searchCommunities(search, category, destinationLocationId, page = 0, size = 10) {
    const params = { page, size };
    if (search) params.search = search;
    if (category) params.category = category;
    if (destinationLocationId) params.destinationLocationId = destinationLocationId;

    const response = await apiClient.get('/communities', { params });
    return response.data;
  },

  async getMyJoinedCommunities() {
    const response = await apiClient.get('/communities/me');
    return response.data;
  },

  async getRecommendedCommunities() {
    const response = await apiClient.get('/communities/recommended');
    return response.data;
  },

  async getCommunityDetails(idOrSlug) {
    const response = await apiClient.get(`/communities/${idOrSlug}`);
    return response.data;
  },

  async createCommunity(request) {
    const response = await apiClient.post('/communities', request);
    return response.data;
  },

  async updateCommunity(id, request) {
    const response = await apiClient.put(`/communities/${id}`, request);
    return response.data;
  },

  async joinCommunity(id) {
    const response = await apiClient.post(`/communities/${id}/join`);
    return response.data;
  },

  async leaveCommunity(id) {
    const response = await apiClient.delete(`/communities/${id}/leave`);
    return response.data;
  },

  async getCommunityMembers(id) {
    const response = await apiClient.get(`/communities/${id}/members`);
    return response.data;
  }
};

