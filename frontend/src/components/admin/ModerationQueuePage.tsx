import React, { useEffect, useState } from 'react';
import { adminService, PageResponse } from '../../services/adminService';
import { ModerationReport, ModerationReportStatus } from '../../types/admin';

export const ModerationQueuePage: React.FC = () => {
  const [reportsPage, setReportsPage] = useState<PageResponse<ModerationReport> | null>(null);
  const [statusFilter, setStatusFilter] = useState<ModerationReportStatus | 'ALL'>('PENDING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchReports(statusFilter, page);
  }, [statusFilter, page]);

  const fetchReports = async (filter: ModerationReportStatus | 'ALL', p: number) => {
    try {
      setLoading(true);
      setError(null);
      const filterParam = filter === 'ALL' ? undefined : filter;
      const data = await adminService.getReports(filterParam, p, 15);
      setReportsPage(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch moderation reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId: number, status: ModerationReportStatus) => {
    const action = prompt(`Action taken for report #${reportId}:`, status === 'RESOLVED' ? 'Content removed' : 'Dismissed as non-violating');
    if (action === null) return;

    try {
      await adminService.resolveReport(reportId, status, action, 'Processed via Admin Moderation Queue');
      await fetchReports(statusFilter, page);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update report status');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: 700 }}>
            🚨 Content Moderation Queue
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            Review user flags, inspect reported content, and take moderation enforcement actions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(['PENDING', 'RESOLVED', 'DISMISSED', 'ALL'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(0);
              }}
              style={{
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: statusFilter === st ? '#3b82f6' : '#fff',
                color: statusFilter === st ? '#fff' : '#475569',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading moderation queue...</div>
      ) : reportsPage && reportsPage.content.length > 0 ? (
        <div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Report ID</th>
                  <th style={{ padding: '12px 16px' }}>Target</th>
                  <th style={{ padding: '12px 16px' }}>Reason</th>
                  <th style={{ padding: '12px 16px' }}>Description</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reportsPage.content.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#334155' }}>#{r.id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 600, color: '#1e40af' }}>{r.targetType}</span> #{r.targetId}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#991b1b' }}>{r.reason}</td>
                    <td style={{ padding: '12px 16px', color: '#475569', maxWidth: '300px' }}>{r.description || 'No description provided'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: r.status === 'PENDING' ? '#fee2e2' : r.status === 'RESOLVED' ? '#d1fae5' : '#f3f4f6',
                          color: r.status === 'PENDING' ? '#991b1b' : r.status === 'RESOLVED' ? '#065f46' : '#4b5563',
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {r.status === 'PENDING' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleResolve(r.id, 'RESOLVED')}
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
                            Resolve & Action
                          </button>
                          <button
                            onClick={() => handleResolve(r.id, 'DISMISSED')}
                            style={{
                              padding: '4px 10px',
                              backgroundColor: '#64748b',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: 600,
                            }}
                          >
                            Dismiss
                          </button>
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
              Page {page + 1} of {reportsPage.totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= reportsPage.totalPages}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: page + 1 >= reportsPage.totalPages ? '#f1f5f9' : '#fff',
                cursor: page + 1 >= reportsPage.totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next Page
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          🎉 No moderation reports found matching filter "{statusFilter}".
        </div>
      )}
    </div>
  );
};
