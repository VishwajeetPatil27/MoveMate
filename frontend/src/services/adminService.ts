import { apiClient } from './apiClient';
import { PlatformAnalytics, AdminUser, ModerationReport, AuditLogItem, UserAccountStatus, ModerationReportStatus } from '../types/admin';

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export const adminService = {
  getPlatformAnalytics: async (): Promise<PlatformAnalytics> => {
    const res = await apiClient.get('/admin/analytics');
    return res.data.data;
  },

  getUsers: async (page = 0, size = 20): Promise<PageResponse<AdminUser>> => {
    const res = await apiClient.get('/admin/users', { params: { page, size } });
    return res.data.data;
  },

  updateUserStatus: async (userId: number, status: UserAccountStatus, reason?: string): Promise<AdminUser> => {
    const res = await apiClient.put(`/admin/users/${userId}/status`, { status, reason });
    return res.data.data;
  },

  getReports: async (status?: ModerationReportStatus, page = 0, size = 20): Promise<PageResponse<ModerationReport>> => {
    const res = await apiClient.get('/admin/reports', { params: { status, page, size } });
    return res.data.data;
  },

  resolveReport: async (
    reportId: number,
    status: ModerationReportStatus,
    resolutionAction?: string,
    adminNotes?: string
  ): Promise<ModerationReport> => {
    const res = await apiClient.put(`/admin/reports/${reportId}/resolve`, {
      status,
      resolutionAction,
      adminNotes,
    });
    return res.data.data;
  },

  getAuditLogs: async (page = 0, size = 20): Promise<PageResponse<AuditLogItem>> => {
    const res = await apiClient.get('/admin/audit-logs', { params: { page, size } });
    return res.data.data;
  },
};
