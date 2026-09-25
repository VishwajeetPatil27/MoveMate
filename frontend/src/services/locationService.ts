import { apiClient, ApiResponse } from './apiClient';
import { LocationDto } from '../types/location';

export const locationService = {
  async searchLocations(search?: string): Promise<ApiResponse<LocationDto[]>> {
    const params = search ? { search } : {};
    const response = await apiClient.get<ApiResponse<LocationDto[]>>('/locations', { params });
    return response.data;
  },

  async getLocationById(id: number): Promise<ApiResponse<LocationDto>> {
    const response = await apiClient.get<ApiResponse<LocationDto>>(`/locations/${id}`);
    return response.data;
  }
};
