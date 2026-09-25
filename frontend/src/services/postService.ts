import { apiClient, ApiResponse } from './apiClient';
import {
  PostDto,
  CommentDto,
  CreatePostRequest,
  UpdatePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  CreateReportRequest,
  ReportDto,
  PostType
} from '../types/post';
import { PageResponse } from '../types/community';

export const postService = {
  async getCommunityPosts(
    communityId: number,
    type?: PostType,
    page: number = 0,
    size: number = 10
  ): Promise<ApiResponse<PageResponse<PostDto>>> {
    const params: Record<string, any> = { page, size };
    if (type) params.type = type;

    const response = await apiClient.get<ApiResponse<PageResponse<PostDto>>>(
      `/communities/${communityId}/posts`,
      { params }
    );
    return response.data;
  },

  async createPost(communityId: number, request: CreatePostRequest): Promise<ApiResponse<PostDto>> {
    const response = await apiClient.post<ApiResponse<PostDto>>(`/communities/${communityId}/posts`, request);
    return response.data;
  },

  async getPostById(postId: number): Promise<ApiResponse<PostDto>> {
    const response = await apiClient.get<ApiResponse<PostDto>>(`/posts/${postId}`);
    return response.data;
  },

  async updatePost(postId: number, request: UpdatePostRequest): Promise<ApiResponse<PostDto>> {
    const response = await apiClient.put<ApiResponse<PostDto>>(`/posts/${postId}`, request);
    return response.data;
  },

  async deletePost(postId: number): Promise<ApiResponse<PostDto>> {
    const response = await apiClient.delete<ApiResponse<PostDto>>(`/posts/${postId}`);
    return response.data;
  },

  async toggleLike(postId: number): Promise<ApiResponse<PostDto>> {
    const response = await apiClient.post<ApiResponse<PostDto>>(`/posts/${postId}/like`);
    return response.data;
  },

  async getPostComments(postId: number): Promise<ApiResponse<CommentDto[]>> {
    const response = await apiClient.get<ApiResponse<CommentDto[]>>(`/posts/${postId}/comments`);
    return response.data;
  },

  async addComment(postId: number, request: CreateCommentRequest): Promise<ApiResponse<CommentDto>> {
    const response = await apiClient.post<ApiResponse<CommentDto>>(`/posts/${postId}/comments`, request);
    return response.data;
  },

  async updateComment(commentId: number, request: UpdateCommentRequest): Promise<ApiResponse<CommentDto>> {
    const response = await apiClient.put<ApiResponse<CommentDto>>(`/comments/${commentId}`, request);
    return response.data;
  },

  async deleteComment(commentId: number): Promise<ApiResponse<CommentDto>> {
    const response = await apiClient.delete<ApiResponse<CommentDto>>(`/comments/${commentId}`);
    return response.data;
  },

  async reportPost(postId: number, reason: string, description?: string): Promise<ApiResponse<ReportDto>> {
    const request: CreateReportRequest = {
      targetType: 'POST',
      targetId: postId,
      reason,
      description
    };
    const response = await apiClient.post<ApiResponse<ReportDto>>(`/posts/${postId}/report`, request);
    return response.data;
  },

  async reportComment(commentId: number, reason: string, description?: string): Promise<ApiResponse<ReportDto>> {
    const request: CreateReportRequest = {
      targetType: 'COMMENT',
      targetId: commentId,
      reason,
      description
    };
    const response = await apiClient.post<ApiResponse<ReportDto>>(`/comments/${commentId}/report`, request);
    return response.data;
  }
};
