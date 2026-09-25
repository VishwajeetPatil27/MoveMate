import { apiClient, ApiResponse } from './apiClient';
import {
  AccommodationDto,
  AccommodationFilterParams,
  CreateAccommodationRequest,
  UpdateAccommodationRequest
} from '../types/accommodation';

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty: boolean;
}

export const accommodationService = {
  async searchAccommodations(params: AccommodationFilterParams = {}): Promise<ApiResponse<PageResponse<AccommodationDto>>> {
    const res = await apiClient.get<ApiResponse<PageResponse<AccommodationDto>>>('/accommodations', { params });
    return res.data;
  },

  async getAccommodationById(id: number | string): Promise<ApiResponse<AccommodationDto>> {
    const res = await apiClient.get<ApiResponse<AccommodationDto>>(`/accommodations/${id}`);
    return res.data;
  },

  async createAccommodation(request: CreateAccommodationRequest): Promise<ApiResponse<AccommodationDto>> {
    const res = await apiClient.post<ApiResponse<AccommodationDto>>('/accommodations', request);
    return res.data;
  },

  async updateAccommodation(id: number | string, request: UpdateAccommodationRequest): Promise<ApiResponse<AccommodationDto>> {
    const res = await apiClient.put<ApiResponse<AccommodationDto>>(`/accommodations/${id}`, request);
    return res.data;
  },

  async deleteAccommodation(id: number | string): Promise<ApiResponse<void>> {
    const res = await apiClient.delete<ApiResponse<void>>(`/accommodations/${id}`);
    return res.data;
  },

  async getMyAccommodations(page = 0, size = 10): Promise<ApiResponse<PageResponse<AccommodationDto>>> {
    const res = await apiClient.get<ApiResponse<PageResponse<AccommodationDto>>>('/accommodations/me', {
      params: { page, size }
    });
    return res.data;
  },

  async getSavedAccommodations(page = 0, size = 10): Promise<ApiResponse<PageResponse<AccommodationDto>>> {
    const res = await apiClient.get<ApiResponse<PageResponse<AccommodationDto>>>('/accommodations/saved', {
      params: { page, size }
    });
    return res.data;
  },

  async toggleFavorite(id: number | string): Promise<ApiResponse<{ isFavorite: boolean }>> {
    const res = await apiClient.post<ApiResponse<{ isFavorite: boolean }>>(`/accommodations/${id}/favorite`);
    return res.data;
  }
};
