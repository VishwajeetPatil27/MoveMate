import { apiClient } from './apiClient';

export const chatService = {
  // REST API Endpoints
  getUserConversations: async () => {
    const response = await apiClient.get('/conversations');
    return response.data;
  },

  createOrGetConversation: async (recipientId) => {
    const request = { recipientId };
    const response = await apiClient.post('/conversations', request);
    return response.data;
  },

  getConversation: async (conversationId) => {
    const response = await apiClient.get(`/conversations/${conversationId}`);
    return response.data;
  },

  getConversationMessages: async (conversationId, page = 0, size = 30) => {
    const response = await apiClient.get(`/conversations/${conversationId}/messages`, {
      params: { page, size }
    });
    return response.data;
  },

  sendMessage: async (conversationId, messageText) => {
    const request = { message: messageText };
    const response = await apiClient.post(`/conversations/${conversationId}/messages`, request);
    return response.data;
  },

  markAsRead: async (conversationId) => {
    const response = await apiClient.put(`/conversations/${conversationId}/read`);
    return response.data;
  }
};

