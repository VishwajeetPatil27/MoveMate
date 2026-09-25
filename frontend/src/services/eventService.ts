import { apiClient, ApiResponse } from './apiClient';
import { EventDto, CreateEventRequest, UpdateEventRequest, EventStatus, RsvpStatus } from '../types/event';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export const eventService = {
  async searchEvents(params?: {
    communityId?: number;
    city?: string;
    search?: string;
    status?: EventStatus;
    page?: number;
    size?: number;
  }): Promise<PageResponse<EventDto>> {
    const query = new URLSearchParams();
    if (params?.communityId) query.append('communityId', params.communityId.toString());
    if (params?.city) query.append('city', params.city);
    if (params?.search) query.append('search', params.search);
    if (params?.status) query.append('status', params.status);
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.size !== undefined) query.append('size', params.size.toString());

    const response = await apiClient.get<ApiResponse<PageResponse<EventDto>>>(
      `/events?${query.toString()}`
    );
    return response.data.data;
  },

  async getUserEvents(page = 0, size = 12): Promise<PageResponse<EventDto>> {
    const response = await apiClient.get<ApiResponse<PageResponse<EventDto>>>(
      `/events/my?page=${page}&size=${size}`
    );
    return response.data.data;
  },

  async getEventById(id: number): Promise<EventDto> {
    const response = await apiClient.get<ApiResponse<EventDto>>(`/events/${id}`);
    return response.data.data;
  },

  async createEvent(request: CreateEventRequest): Promise<EventDto> {
    const response = await apiClient.post<ApiResponse<EventDto>>('/events', request);
    return response.data.data;
  },

  async updateEvent(id: number, request: UpdateEventRequest): Promise<EventDto> {
    const response = await apiClient.put<ApiResponse<EventDto>>(`/events/${id}`, request);
    return response.data.data;
  },

  async cancelEvent(id: number): Promise<EventDto> {
    const response = await apiClient.patch<ApiResponse<EventDto>>(`/events/${id}/cancel`);
    return response.data.data;
  },

  async rsvpEvent(id: number, status: RsvpStatus = 'ATTENDING'): Promise<EventDto> {
    const response = await apiClient.post<ApiResponse<EventDto>>(`/events/${id}/rsvp?status=${status}`);
    return response.data.data;
  },

  async leaveEvent(id: number): Promise<EventDto> {
    const response = await apiClient.delete<ApiResponse<EventDto>>(`/events/${id}/rsvp`);
    return response.data.data;
  }
};
