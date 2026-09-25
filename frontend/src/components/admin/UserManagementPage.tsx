import React, { useEffect, useState } from 'react';
import { adminService, PageResponse } from '../../services/adminService';
import { AdminUser, UserAccountStatus } from '../../types/admin';

export const UserManagementPage: React.FC = () => {
  const [usersPage, setUsersPage] = useState<PageResponse<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const fetchUsers = async (p: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getUsers(p, 15);
      setUsersPage(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user list');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: number, newStatus: UserAccountStatus) => {
    const reason = prompt(`Reason for changing user #${userId} status to ${newStatus}:`, 'Admin action');
    if (reason === null) return;

    try {
      setUpdatingId(userId);
      await adminService.updateUserStatus(userId, newStatus, reason);
      await fetchUsers(page);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: 700 }}>
          👥 User Account Management
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>
          View user accounts, verify status, and manage active/suspended access state.
        </p>
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading user directory...</div>
      ) : usersPage ? (
        <div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>User ID</th>
                  <th style={{ padding: '12px 16px' }}>Email Address</th>
                  <th style={{ padding: '12px 16px' }}>Role</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersPage.content.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#334155' }}>#{u.id}</td>
                    <td style={{ padding: '12px 16px', color: '#0f172a', fontWeight: 500 }}>{u.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: u.role === 'ADMIN' ? '#dbeafe' : '#f1f5f9',
                          color: u.role === 'ADMIN' ? '#1e40af' : '#475569',
                        }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: u.status === 'ACTIVE' ? '#d1fae5' : u.status === 'SUSPENDED' ? '#fee2e2' : '#f3f4f6',
                          color: u.status === 'ACTIVE' ? '#065f46' : u.status === 'SUSPENDED' ? '#991b1b' : '#4b5563',
                        }}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {updatingId === u.id ? (
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Updating...</span>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {u.status !== 'ACTIVE' && (
                            <button
                              onClick={() => handleStatusChange(u.id, 'ACTIVE')}
                              style={{
                                padding: '4px 10px',
                                backgroundColor: '#10b981',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: 600,
                              }}
                            >
                              Activate
                            </button>
                          )}
                          {u.status !== 'SUSPENDED' && (
                            <button
                              onClick={() => handleStatusChange(u.id, 'SUSPENDED')}
                              style={{
                                padding: '4px 10px',
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                fontWeight: 600,
                              }}
                            >
                              Suspend
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: page === 0 ? '#f1f5f9' : '#fff',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Previous Page
            </button>
            <span style={{ fontSize: '14px', color: '#64748b' }}>
              Page {page + 1} of {usersPage.totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= usersPage.totalPages}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: page + 1 >= usersPage.totalPages ? '#f1f5f9' : '#fff',
                cursor: page + 1 >= usersPage.totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next Page
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
