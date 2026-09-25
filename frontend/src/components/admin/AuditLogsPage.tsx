import React, { useEffect, useState } from 'react';
import { adminService, PageResponse } from '../../services/adminService';
import { AuditLogItem } from '../../types/admin';

export const AuditLogsPage: React.FC = () => {
  const [logsPage, setLogsPage] = useState<PageResponse<AuditLogItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchAuditLogs(page);
  }, [page]);

  const fetchAuditLogs = async (p: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getAuditLogs(p, 15);
      setLogsPage(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch audit trail logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: 700 }}>
          📋 Security & Administrative Audit Logs
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>
          Immutable log of administrative enforcement, moderation resolution, and status changes.
        </p>
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading security audit trail...</div>
      ) : logsPage && logsPage.content.length > 0 ? (
        <div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  <th style={{ padding: '12px 16px' }}>Admin Actor</th>
                  <th style={{ padding: '12px 16px' }}>Action</th>
                  <th style={{ padding: '12px 16px' }}>Target</th>
                  <th style={{ padding: '12px 16px' }}>Enforcement Details</th>
                </tr>
              </thead>
              <tbody>
                {logsPage.content.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '13px' }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0f172a' }}>
                      {log.actorEmail || `Admin #${log.actorId}`}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: '#e0e7ff',
                          color: '#3730a3',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#334155' }}>
                      {log.targetType} #{log.targetId || 'N/A'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontSize: '13px' }}>{log.details}</td>
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
              Page {page + 1} of {logsPage.totalPages || 1}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page + 1 >= logsPage.totalPages}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: page + 1 >= logsPage.totalPages ? '#f1f5f9' : '#fff',
                cursor: page + 1 >= logsPage.totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next Page
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          📋 No audit trail logs recorded yet.
        </div>
      )}
    </div>
  );
};
