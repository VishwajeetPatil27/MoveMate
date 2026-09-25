import { apiClient, ApiResponse } from './apiClient';
import { NotificationDto, UnreadCountResponse } from '../types/notification';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export const notificationService = {
  async getNotifications(page = 0, size = 20): Promise<PageResponse<NotificationDto>> {
    const response = await apiClient.get<ApiResponse<PageResponse<NotificationDto>>>(
      `/notifications?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  async getUnreadCount(): Promise<number> {
    const response = await apiClient.get<ApiResponse<UnreadCountResponse>>('/notifications/unread-count');
    return response.data.data.unreadCount;
  },

  async markAsRead(id: number): Promise<NotificationDto> {
    const response = await apiClient.put<ApiResponse<NotificationDto>>(`/notifications/${id}/read`);
    return response.data.data;
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put<ApiResponse<void>>('/notifications/read-all');
  },

  async deleteNotification(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<void>>(`/notifications/${id}`);
  }
};
