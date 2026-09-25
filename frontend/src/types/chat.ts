export type ConversationType = 'DIRECT' | 'COMMUNITY' | 'GROUP';
export type MessageType = 'TEXT' | 'IMAGE' | 'LOCATION';

export interface MessageDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderProfession?: string;
  message: string;
  messageType: MessageType;
  isRead: boolean;
  isMine: boolean;
  createdAt: string;
}

export interface ConversationDto {
  id: number;
  type: ConversationType;
  participantId?: number;
  participantName?: string;
  participantProfession?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  createdAt: string;
}

export interface CreateConversationRequest {
  recipientId: number;
}

export interface SendMessageRequest {
  message: string;
  messageType?: MessageType;
}
