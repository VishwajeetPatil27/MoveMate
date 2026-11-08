import { apiClient } from './apiClient';

export const notificationService = {
  async getNotifications(page = 0, size = 20) {
    const response = await apiClient.get(
      `/notifications?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  async getUnreadCount() {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.data.unreadCount;
  },

  async markAsRead(id) {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data.data;
  },

  async markAllAsRead() {
    await apiClient.put('/notifications/read-all');
  },

  async deleteNotification(id) {
    await apiClient.delete(`/notifications/${id}`);
  }
};

