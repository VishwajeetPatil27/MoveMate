import { apiClient, ApiResponse } from './apiClient';
import { RecommendationDto, CreateRecommendationRequest, UpdateRecommendationRequest, ServiceCategory, PageResponse } from '../types/localService';

export const localServiceService = {
  async searchServices(params?: {
    locationId?: number;
    city?: string;
    category?: ServiceCategory;
    latitude?: number;
    longitude?: number;
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
  }): Promise<ApiResponse<PageResponse<RecommendationDto>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<RecommendationDto>>>('/services', { params });
    return response.data;
  },

  async getNearbyServices(params: {
    latitude: number;
    longitude: number;
    category?: ServiceCategory;
    page?: number;
    size?: number;
  }): Promise<ApiResponse<PageResponse<RecommendationDto>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<RecommendationDto>>>('/services/nearby', { params });
    return response.data;
  },

  async createService(req: CreateRecommendationRequest): Promise<ApiResponse<RecommendationDto>> {
    const response = await apiClient.post<ApiResponse<RecommendationDto>>('/services', req);
    return response.data;
  },

  async getServiceById(id: number, coords?: { latitude?: number; longitude?: number }): Promise<ApiResponse<RecommendationDto>> {
    const params = coords || {};
    const response = await apiClient.get<ApiResponse<RecommendationDto>>(`/services/${id}`, { params });
    return response.data;
  },

  async updateService(id: number, req: UpdateRecommendationRequest): Promise<ApiResponse<RecommendationDto>> {
    const response = await apiClient.put<ApiResponse<RecommendationDto>>(`/services/${id}`, req);
    return response.data;
  },

  async deleteService(id: number): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(`/services/${id}`);
    return response.data;
  },

  async toggleFavorite(id: number): Promise<ApiResponse<{ saved: boolean }>> {
    const response = await apiClient.post<ApiResponse<{ saved: boolean }>>(`/services/${id}/favorite`);
    return response.data;
  },

  async getSavedPlaces(params?: { page?: number; size?: number }): Promise<ApiResponse<PageResponse<RecommendationDto>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<RecommendationDto>>>('/services/saved', { params });
    return response.data;
  }
};
