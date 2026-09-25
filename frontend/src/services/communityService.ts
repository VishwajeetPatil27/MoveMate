import { apiClient, ApiResponse } from './apiClient';
import {
  CommunityDto,
  CommunityMemberDto,
  CreateCommunityRequest,
  UpdateCommunityRequest,
  PageResponse,
  CommunityCategory
} from '../types/community';

export const communityService = {
  async searchCommunities(
    search?: string,
    category?: CommunityCategory,
    destinationLocationId?: number,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<CommunityDto>>> {
    const params: Record<string, any> = { page, size };
    if (search) params.search = search;
    if (category) params.category = category;
    if (destinationLocationId) params.destinationLocationId = destinationLocationId;

    const response = await apiClient.get<ApiResponse<PageResponse<CommunityDto>>>('/communities', { params });
    return response.data;
  },

  async getMyJoinedCommunities(): Promise<ApiResponse<CommunityDto[]>> {
    const response = await apiClient.get<ApiResponse<CommunityDto[]>>('/communities/me');
    return response.data;
  },

  async getRecommendedCommunities(): Promise<ApiResponse<CommunityDto[]>> {
    const response = await apiClient.get<ApiResponse<CommunityDto[]>>('/communities/recommended');
    return response.data;
  },

  async getCommunityDetails(idOrSlug: string | number): Promise<ApiResponse<CommunityDto>> {
    const response = await apiClient.get<ApiResponse<CommunityDto>>(`/communities/${idOrSlug}`);
    return response.data;
  },

  async createCommunity(request: CreateCommunityRequest): Promise<ApiResponse<CommunityDto>> {
    const response = await apiClient.post<ApiResponse<CommunityDto>>('/communities', request);
    return response.data;
  },

  async updateCommunity(id: number, request: UpdateCommunityRequest): Promise<ApiResponse<CommunityDto>> {
    const response = await apiClient.put<ApiResponse<CommunityDto>>(`/communities/${id}`, request);
    return response.data;
  },

  async joinCommunity(id: number): Promise<ApiResponse<CommunityDto>> {
    const response = await apiClient.post<ApiResponse<CommunityDto>>(`/communities/${id}/join`);
    return response.data;
  },

  async leaveCommunity(id: number): Promise<ApiResponse<CommunityDto>> {
    const response = await apiClient.delete<ApiResponse<CommunityDto>>(`/communities/${id}/leave`);
    return response.data;
  },

  async getCommunityMembers(id: number): Promise<ApiResponse<CommunityMemberDto[]>> {
    const response = await apiClient.get<ApiResponse<CommunityMemberDto[]>>(`/communities/${id}/members`);
    return response.data;
  }
};
