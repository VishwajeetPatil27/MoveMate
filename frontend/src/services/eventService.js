import { apiClient } from './apiClient';

export const eventService = {
  async searchEvents(params) {
    const query = new URLSearchParams();
    if (params?.communityId) query.append('communityId', params.communityId.toString());
    if (params?.city) query.append('city', params.city);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());

    const response = await apiClient.get(
      `/events?${query.toString()}`
    );
    return response.data.data;
  },

  async getUserEvents(page = 0, size = 12) {
    const response = await apiClient.get(
      `/events/my?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  async getEventById(id) {
    const response = await apiClient.get(`/events/${id}`);
    return response.data.data;
  },

  async createEvent(request) {
    const response = await apiClient.post('/events', request);
    return response.data.data;
  },

  async updateEvent(id, request) {
    const response = await apiClient.put(`/events/${id}`, request);
    return response.data.data;
  },

  async cancelEvent(id) {
    const response = await apiClient.patch(`/events/${id}/cancel`);
    return response.data.data;
  },

  async rsvpEvent(id, status = 'ATTENDING') {
    const response = await apiClient.post(`/events/${id}/rsvp?status=${status}`);
    return response.data.data;
  },

  async leaveEvent(id) {
    const response = await apiClient.delete(`/events/${id}/rsvp`);
    return response.data.data;
  }
};

