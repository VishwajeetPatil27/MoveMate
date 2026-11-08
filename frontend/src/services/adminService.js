import { apiClient } from './apiClient';

export const adminService = {
  getPlatformAnalytics: async () => {
    const res = await apiClient.get('/admin/analytics');
    return res.data.data;
  },

  getUsers: async (page = 0, size = 20) => {
    const res = await apiClient.get('/admin/users', { params: { page, size } });
    return res.data.data;
  },

  updateUserStatus: async (userId, status, reason) => {
    const res = await apiClient.put(`/admin/users/${userId}/status`, { status, reason });
    return res.data.data;
  },

  getReports: async (status, page = 0, size = 20) => {
    const res = await apiClient.get('/admin/reports', { params: { status, page, size } });
    return res.data.data;
  },

  resolveReport: async (reportId, status, resolutionAction, adminNotes) => {
    const res = await apiClient.put(`/admin/reports/${reportId}/resolve`, {
      status,
      resolutionAction,
      adminNotes,
    });
    return res.data.data;
  },

  getAuditLogs: async (page = 0, size = 20) => {
    const res = await apiClient.get('/admin/audit-logs', { params: { page, size } });
    return res.data.data;
  },
};

