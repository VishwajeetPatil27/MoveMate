import React, { useEffect, useState } from 'react';
import { fetchHealthStatus, HealthStatus } from '../../services/healthService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export const HealthCard: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHealthStatus();
      setHealth(data);
    } catch (err: any) {
      setError(err?.message || 'Unable to connect to MoveMate backend API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealth();
  }, []);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', margin: '2rem 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--color-brand-primary)' }}>Backend System Health</h3>
        <button onClick={loadHealth} className="btn btn-primary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}>
          Refresh Ping
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Pinging Spring Boot backend health endpoint..." />
      ) : error ? (
        <div style={{
          padding: '1rem',
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: '0.5rem',
          color: '#991B1B',
          fontSize: '0.875rem'
        }}>
          <strong>Backend Connection Notice:</strong> {error}
          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#B91C1C' }}>
            Verify that Spring Boot backend is running on target port 8080 (`/api/v1/health`).
          </div>
        </div>
      ) : health ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#F1F5F9', borderRadius: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>SYSTEM STATUS</span>
            <strong style={{ color: '#0F766E', fontSize: '1.125rem' }}>🟢 {health.status}</strong>
          </div>
          <div style={{ padding: '1rem', background: '#F1F5F9', borderRadius: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>SERVICE NAME</span>
            <strong style={{ color: 'var(--color-brand-primary)', fontSize: '1rem' }}>{health.service}</strong>
          </div>
          <div style={{ padding: '1rem', background: '#F1F5F9', borderRadius: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>ACTIVE PROFILE</span>
            <strong style={{ color: '#B45309', fontSize: '1rem' }}>{health.environment}</strong>
          </div>
          <div style={{ padding: '1rem', background: '#F1F5F9', borderRadius: '0.5rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>UPTIME</span>
            <strong style={{ color: '#334155', fontSize: '1rem' }}>{health.uptimeSeconds}</strong>
          </div>
        </div>
      ) : null}
    </div>
  );
};
