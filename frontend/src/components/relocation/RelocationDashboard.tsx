import React, { useState, useEffect } from 'react';
import { RelocationRequestDto } from '../../types/relocation';
import { relocationService } from '../../services/relocationService';
import { RelocationModal } from './RelocationModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import {
  Compass,
  Plus,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Briefcase,
  AlertCircle
} from 'lucide-react';

interface RelocationDashboardProps {
  onNavigateProfile: () => void;
}

export const RelocationDashboard: React.FC<RelocationDashboardProps> = ({ onNavigateProfile }) => {
  const [relocations, setRelocations] = useState<RelocationRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    loadRelocations();
  }, []);

  const loadRelocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await relocationService.getMyRelocations();
      if (res.success && res.data) {
        setRelocations(res.data);
      } else {
        setError(res.message || 'Failed to load relocation requests');
      }
    } catch (err: any) {
      console.error('Failed to fetch relocations', err);
      setError('Failed to fetch relocation records.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!window.confirm('Are you sure you want to cancel this relocation plan?')) {
      return;
    }
    try {
      setCancellingId(id);
      const res = await relocationService.cancelRelocation(id);
      if (res.success && res.data) {
        setRelocations(prev => prev.map(r => r.id === id ? res.data : r));
      }
    } catch (err: any) {
      console.error(err);
      alert('Failed to cancel relocation plan');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <LoadingSpinner size="lg" label="Loading Relocation Plans..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0D9488 100%)',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        padding: '2.5rem 2rem',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#5EEAD4',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '0.75rem'
            }}>
              <Compass size={14} />
              <span>Relocation Intent</span>
            </div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF', lineHeight: 1.2 }}>
              My Relocation Plans
            </h1>
            <p style={{ color: '#E2E8F0', marginTop: '0.5rem', fontSize: '1rem', maxWidth: '600px', lineHeight: 1.5 }}>
              Declare your upcoming city moves, preferences, and timeline to unlock tailored community matching and housing discovery.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn btn-accent"
            >
              <Plus size={16} />
              <span>New Relocation Plan</span>
            </button>
            <button
              onClick={onNavigateProfile}
              className="btn btn-secondary"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Profile</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#FEF2F2',
          border: '1px solid #FCA5A5',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          color: '#991B1B'
        }}>
          {error}
        </div>
      )}

      {/* Relocation Cards List */}
      {relocations.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Relocation Plans Created Yet"
          description="Declare where you are moving to connect with regional groups, local helpers, and housing listings."
          actionText="+ Create Your First Relocation Plan"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {relocations.map((reloc) => (
            <div
              key={reloc.id}
              className="card"
              style={{
                padding: '1.75rem',
                borderLeft: reloc.status === 'ACTIVE' ? '6px solid var(--color-brand-accent)' : '6px solid #94A3B8',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                      {reloc.originLocation.city} ➔ {reloc.destinationLocation.city}
                    </h3>
                    <span className={`badge ${reloc.status === 'ACTIVE' ? 'badge-teal' : 'badge-amber'}`}>
                      {reloc.status}
                    </span>
                    <span className="badge badge-indigo">
                      Purpose: {reloc.purpose}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '0.35rem 0 0 0' }}>
                    Route: {reloc.originLocation.displayName} to {reloc.destinationLocation.displayName}
                    {reloc.destinationArea ? ` (${reloc.destinationArea})` : ''}
                  </p>
                </div>

                {reloc.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleCancel(reloc.id)}
                    disabled={cancellingId === reloc.id}
                    className="btn btn-outline btn-sm"
                    style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
                  >
                    {cancellingId === reloc.id ? 'Cancelling...' : 'Cancel Plan'}
                  </button>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-border-subtle)',
                fontSize: '0.875rem'
              }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                    Target Moving Date
                  </span>
                  <strong style={{ color: 'var(--color-text-main)' }}>{reloc.movingDate || 'Flexible'}</strong>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                    Monthly Budget
                  </span>
                  <strong style={{ color: 'var(--color-text-main)' }}>
                    {reloc.budget ? `₹${Number(reloc.budget).toLocaleString('en-IN')}` : 'Not Specified'}
                  </strong>
                </div>

                <div>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700 }}>
                    Profession
                  </span>
                  <strong style={{ color: 'var(--color-text-main)' }}>{reloc.profession || 'Not Specified'}</strong>
                </div>
              </div>

              {reloc.requirements && (
                <div style={{
                  marginTop: '1rem',
                  backgroundColor: 'var(--color-bg-page)',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-subtle)'
                }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase' }}>
                    Preferences & Requirements:
                  </span>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0, whiteSpace: 'pre-line' }}>
                    {reloc.requirements}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Relocation Modal */}
      {isModalOpen && (
        <RelocationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={(newReloc) => {
            setRelocations(prev => [newReloc, ...prev]);
          }}
        />
      )}
    </div>
  );
};
