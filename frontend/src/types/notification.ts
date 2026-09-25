export type NotificationType =
  | 'POST_LIKED'
  | 'POST_COMMENTED'
  | 'COMMENT_REPLIED'
  | 'NEW_MESSAGE'
  | 'COMMUNITY_INVITATION'
  | 'COMMUNITY_ANNOUNCEMENT'
  | 'EVENT_CREATED'
  | 'EVENT_UPDATED'
  | 'EVENT_CANCELLED'
  | 'EVENT_REMINDER'
  | 'ACCOMMODATION_MESSAGE'
  | 'SYSTEM';

export interface NotificationDto {
  id: number;
  recipientId: number;
  type: NotificationType;
  title: string;
  message: string;
  referenceId?: number;
  read: boolean;
  createdAt: string;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
