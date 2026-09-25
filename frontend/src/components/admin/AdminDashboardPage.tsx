import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { PlatformAnalytics } from '../../types/admin';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<PlatformAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getPlatformAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch platform analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#0f172a', margin: 0, fontWeight: 700 }}>
            🛡️ Platform Administration & Analytics
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            Real-time platform metrics, user management, moderation queue, and audit logs.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          style={{
            padding: '10px 18px',
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          {loading ? 'Refreshing...' : '🔄 Refresh Data'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', backgroundColor: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '24px' }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>Loading real-time analytics...</div>
      ) : analytics ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <StatCard title="Total Registered Users" value={analytics.totalUsers} icon="👥" color="#3b82f6" />
          <StatCard title="Active User Accounts" value={analytics.activeUsers} icon="✅" color="#10b981" />
          <StatCard title="Total Communities" value={analytics.totalCommunities} icon="🏘️" color="#8b5cf6" />
          <StatCard title="Community Feed Posts" value={analytics.totalPosts} icon="📝" color="#f59e0b" />
          <StatCard title="Discussion Comments" value={analytics.totalComments} icon="💬" color="#ec4899" />
          <StatCard title="Direct Messages Sent" value={analytics.totalMessages} icon="✉️" color="#06b6d4" />
          <StatCard title="Housing & Accommodations" value={analytics.totalAccommodations} icon="🏠" color="#6366f1" />
          <StatCard title="Local Services & Places" value={analytics.totalServices} icon="📍" color="#14b8a6" />
          <StatCard title="Community Events" value={analytics.totalEvents} icon="📅" color="#84cc16" />
          <StatCard title="Pending Moderation Reports" value={analytics.pendingReports} icon="🚨" color="#ef4444" highlight={analytics.pendingReports > 0} />
          <StatCard title="Total System Notifications" value={analytics.totalNotifications} icon="🔔" color="#64748b" />
        </div>
      ) : null}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
  highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, highlight }) => (
  <div
    style={{
      backgroundColor: highlight ? '#fef2f2' : '#ffffff',
      borderRadius: '12px',
      padding: '20px',
      border: highlight ? '2px solid #ef4444' : '1px solid #e2e8f0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
    }}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '10px',
        backgroundColor: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{title}</div>
      <div style={{ fontSize: '24px', fontWeight: 700, color: highlight ? '#ef4444' : '#0f172a', marginTop: '2px' }}>
        {value.toLocaleString()}
      </div>
    </div>
  </div>
);
