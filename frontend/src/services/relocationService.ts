import { apiClient, ApiResponse } from './apiClient';
import { RelocationRequestDto, CreateRelocationRequest, UpdateRelocationRequest } from '../types/relocation';

export const relocationService = {
  async getMyRelocations(): Promise<ApiResponse<RelocationRequestDto[]>> {
    const response = await apiClient.get<ApiResponse<RelocationRequestDto[]>>('/relocations/me');
    return response.data;
  },

  async createRelocation(request: CreateRelocationRequest): Promise<ApiResponse<RelocationRequestDto>> {
    const response = await apiClient.post<ApiResponse<RelocationRequestDto>>('/relocations', request);
    return response.data;
  },

  async getRelocationById(id: number): Promise<ApiResponse<RelocationRequestDto>> {
    const response = await apiClient.get<ApiResponse<RelocationRequestDto>>(`/relocations/${id}`);
    return response.data;
  },

  async updateRelocation(id: number, request: UpdateRelocationRequest): Promise<ApiResponse<RelocationRequestDto>> {
    const response = await apiClient.put<ApiResponse<RelocationRequestDto>>(`/relocations/${id}`, request);
    return response.data;
  },

  async cancelRelocation(id: number): Promise<ApiResponse<RelocationRequestDto>> {
    const response = await apiClient.patch<ApiResponse<RelocationRequestDto>>(`/relocations/${id}/cancel`);
    return response.data;
  }
};
