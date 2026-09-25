export interface PlatformAnalytics {
  totalUsers: number;
  activeUsers: number;
  totalCommunities: number;
  totalPosts: number;
  totalComments: number;
  totalMessages: number;
  totalAccommodations: number;
  totalServices: number;
  totalEvents: number;
  pendingReports: number;
  totalNotifications: number;
}

export type UserAccountStatus = 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
export type UserRole = 'USER' | 'ADMIN';

export interface AdminUser {
  id: number;
  email: string;
  role: UserRole;
  status: UserAccountStatus;
  createdAt?: string;
  lastLogin?: string;
}

export type ModerationReportStatus = 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
export type ModerationTargetType = 'COMMUNITY' | 'POST' | 'COMMENT' | 'USER' | 'ACCOMMODATION' | 'SERVICE' | 'EVENT';

export interface ModerationReport {
  id: number;
  reporter?: {
    id: number;
    email: string;
  };
  targetType: ModerationTargetType;
  targetId: number;
  reason: string;
  description?: string;
  status: ModerationReportStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface AuditLogItem {
  id: number;
  actorId: number;
  actorName: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId?: number;
  details?: string;
  createdAt: string;
}
