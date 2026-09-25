import { apiClient, ApiResponse } from './apiClient';
import { ConversationDto, MessageDto, CreateConversationRequest, SendMessageRequest } from '../types/chat';

export const chatService = {
  // REST API Endpoints
  getUserConversations: async (): Promise<ApiResponse<ConversationDto[]>> => {
    const response = await apiClient.get<ApiResponse<ConversationDto[]>>('/conversations');
    return response.data;
  },

  createOrGetConversation: async (recipientId: number): Promise<ApiResponse<ConversationDto>> => {
    const request: CreateConversationRequest = { recipientId };
    const response = await apiClient.post<ApiResponse<ConversationDto>>('/conversations', request);
    return response.data;
  },

  getConversation: async (conversationId: number): Promise<ApiResponse<ConversationDto>> => {
    const response = await apiClient.get<ApiResponse<ConversationDto>>(`/conversations/${conversationId}`);
    return response.data;
  },

  getConversationMessages: async (conversationId: number, page = 0, size = 30): Promise<ApiResponse<{ content: MessageDto[]; totalPages: number }>> => {
    const response = await apiClient.get<ApiResponse<{ content: MessageDto[]; totalPages: number }>>(`/conversations/${conversationId}/messages`, {
      params: { page, size }
    });
    return response.data;
  },

  sendMessage: async (conversationId: number, messageText: string): Promise<ApiResponse<MessageDto>> => {
    const request: SendMessageRequest = { message: messageText };
    const response = await apiClient.post<ApiResponse<MessageDto>>(`/conversations/${conversationId}/messages`, request);
    return response.data;
  },

  markAsRead: async (conversationId: number): Promise<ApiResponse<void>> => {
    const response = await apiClient.put<ApiResponse<void>>(`/conversations/${conversationId}/read`);
    return response.data;
  }
};
