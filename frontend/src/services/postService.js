import { apiClient } from './apiClient';

export const postService = {
  async getCommunityPosts(communityId, type, page = 0, size = 10) {
    const params = { page, size };
    if (type) params.type = type;

    const response = await apiClient.get(
      `/communities/${communityId}/posts`,
      { params }
    );
    return response.data;
  },

  async createPost(communityId, request) {
    const response = await apiClient.post(`/communities/${communityId}/posts`, request);
    return response.data;
  },

  async getPostById(postId) {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
  },

  async updatePost(postId, request) {
    const response = await apiClient.put(`/posts/${postId}`, request);
    return response.data;
  },

  async deletePost(postId) {
    const response = await apiClient.delete(`/posts/${postId}`);
    return response.data;
  },

  async toggleLike(postId) {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
  },

  async getPostComments(postId) {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data;
  },

  async addComment(postId, request) {
    const response = await apiClient.post(`/posts/${postId}/comments`, request);
    return response.data;
  },

  async updateComment(commentId, request) {
    const response = await apiClient.put(`/comments/${commentId}`, request);
    return response.data;
  },

  async deleteComment(commentId) {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  },

  async reportPost(postId, reason, description) {
    const request = {
      targetType: 'POST',
      targetId: postId,
      reason,
      description
    };
    const response = await apiClient.post(`/posts/${postId}/report`, request);
    return response.data;
  },

  async reportComment(commentId, reason, description) {
    const request = {
      targetType: 'COMMENT',
      targetId: commentId,
      reason,
      description
    };
    const response = await apiClient.post(`/comments/${commentId}/report`, request);
    return response.data;
  }
};

