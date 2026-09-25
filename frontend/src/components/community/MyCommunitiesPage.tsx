import React, { useState, useEffect } from 'react';
import { CommunityDto } from '../../types/community';
import { communityService } from '../../services/communityService';
import { CommunityCard } from './CommunityCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface MyCommunitiesPageProps {
  onSelectCommunity: (community: CommunityDto) => void;
  onNavigateDiscovery: () => void;
}

export const MyCommunitiesPage: React.FC<MyCommunitiesPageProps> = ({
  onSelectCommunity,
  onNavigateDiscovery
}) => {
  const [communities, setCommunities] = useState<CommunityDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMyCommunities();
  }, []);

  const loadMyCommunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await communityService.getMyJoinedCommunities();
      if (res.success && res.data) {
        setCommunities(res.data);
      } else {
        setError(res.message || 'Failed to load your communities');
      }
    } catch (err: any) {
      console.error('Failed to load user joined communities', err);
      setError('Failed to fetch joined communities. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <LoadingSpinner size="lg" label="Loading Joined Communities..." />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '950px', margin: '2rem auto' }}>
      {/* Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
        borderRadius: '20px',
        padding: '2.5rem',
        color: '#FFFFFF',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span className="badge badge-teal" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
              My Community Dashboard
            </span>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
              My Joined Communities ({communities.length})
            </h1>
            <p style={{ color: '#94A3B8', marginTop: '0.5rem', fontSize: '1rem', maxWidth: '600px' }}>
              Your active regional, career, and housing relocation networks.
            </p>
          </div>

          <button
            onClick={onNavigateDiscovery}
            className="btn btn-accent"
            style={{ fontSize: '0.95rem', padding: '0.75rem 1.5rem' }}
          >
            + Discover More Communities
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '10px', color: '#FCA5A5', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {communities.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3.5rem 2rem', textAlign: 'center', margin: '1rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤝</div>
          <h2 style={{ fontSize: '1.5rem', color: '#1E293B', marginBottom: '0.5rem' }}>You Haven't Joined Any Communities Yet</h2>
          <p style={{ color: '#64748B', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
            Discover regional groups for your destination city, tech networks, and student housing groups to prepare for your move.
          </p>
          <button onClick={onNavigateDiscovery} className="btn btn-accent" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
            Explore Relocation Communities
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {communities.map(comm => (
            <CommunityCard
              key={comm.id}
              community={comm}
              onSelect={onSelectCommunity}
              onToggleJoin={() => loadMyCommunities()}
            />
          ))}
        </div>
      )}
    </div>
  );
};
