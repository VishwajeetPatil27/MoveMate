import React, { useState, useEffect } from 'react';
import { CommunityCategory, CommunityDto } from '../../types/community';
import { LocationDto } from '../../types/location';
import { communityService } from '../../services/communityService';
import { locationService } from '../../services/locationService';
import { useAuth } from '../../context/AuthContext';
import { CommunityCard } from './CommunityCard';
import { CreateCommunityModal } from './CreateCommunityModal';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { Users, Search, Plus, MapPin, Sparkles, Filter } from 'lucide-react';

interface CommunityDiscoveryPageProps {
  onSelectCommunity: (community: CommunityDto) => void;
  onNavigateMyCommunities: () => void;
}

export const CommunityDiscoveryPage: React.FC<CommunityDiscoveryPageProps> = ({
  onSelectCommunity,
  onNavigateMyCommunities
}) => {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CommunityCategory | ''>('');
  const [selectedLocationId, setSelectedLocationId] = useState<number | undefined>(undefined);

  const [recommended, setRecommended] = useState<CommunityDto[]>([]);
  const [communities, setCommunities] = useState<CommunityDto[]>([]);
  const [locations, setLocations] = useState<LocationDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    fetchLocations();
    if (isAuthenticated) {
      fetchRecommended();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCommunities();
  }, [searchTerm, selectedCategory, selectedLocationId]);

  const fetchLocations = async () => {
    try {
      const res = await locationService.searchLocations();
      if (res.success && res.data) {
        setLocations(res.data);
      }
    } catch (err) {
      console.error('Failed to load locations', err);
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await communityService.getRecommendedCommunities();
      if (res.success && res.data) {
        setRecommended(res.data);
      }
    } catch (err) {
      console.error('Failed to load recommended communities', err);
    }
  };

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await communityService.searchCommunities(
        searchTerm || undefined,
        (selectedCategory as CommunityCategory) || undefined,
        selectedLocationId
      );
      if (res.success && res.data) {
        setCommunities(res.data.content);
      } else {
        setError(res.message || 'Failed to search communities');
      }
    } catch (err: any) {
      console.error('Failed to load communities', err);
      setError('Failed to load community catalog.');
    } finally {
      setLoading(false);
    }
  };

  const categories: { label: string; value: CommunityCategory | '' }[] = [
    { label: 'All Communities', value: '' },
    { label: 'Regional Hometown', value: 'REGIONAL' },
    { label: 'Professional & Tech', value: 'PROFESSIONAL' },
    { label: 'Job Seekers', value: 'JOB' },
    { label: 'Students', value: 'STUDENT' },
    { label: 'Housing & Flatmates', value: 'HOUSING' },
    { label: 'General Relocation', value: 'GENERAL' },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0F766E 100%)',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        padding: '2.5rem 2rem',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '650px' }}>
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
            <Users size={14} />
            <span>Find Your Tribe</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#FFFFFF', lineHeight: 1.2 }}>
            Find Your Relocation Community
          </h1>
          <p style={{ color: '#E2E8F0', fontSize: '1rem', margin: 0, lineHeight: 1.5 }}>
            Connect with people who live, work, or are moving to your destination city. Join regional groups, career networks, and flatmate hubs.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isAuthenticated && (
            <>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="btn btn-accent"
              >
                <Plus size={16} />
                <span>Create Community</span>
              </button>
              <button
                onClick={onNavigateMyCommunities}
                className="btn btn-secondary"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                My Groups
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar Card */}
      <div className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              Search Keywords
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by community name or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '2.25rem' }}
              />
              <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              Destination City
            </label>
            <select
              className="form-control"
              value={selectedLocationId || ''}
              onChange={(e) => setSelectedLocationId(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">All Destination Cities...</option>
              {locations.map(loc => (
                <option key={`disc-loc-${loc.id}`} value={loc.id}>
                  {loc.displayName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-muted)', marginRight: '0.25rem' }}>Category:</span>
          {categories.map(cat => (
            <button
              key={`cat-pill-${cat.value}`}
              onClick={() => setSelectedCategory(cat.value)}
              className={`btn btn-sm ${selectedCategory === cat.value ? 'btn-accent' : 'btn-secondary'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.78125rem'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Section (If Authenticated) */}
      {isAuthenticated && recommended.length > 0 && !searchTerm && !selectedCategory && !selectedLocationId && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sparkles size={18} color="#0D9488" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
              Recommended for Your Route
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {recommended.map(comm => (
              <CommunityCard
                key={`rec-${comm.id}`}
                community={comm}
                onSelect={onSelectCommunity}
                onToggleJoin={fetchCommunities}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Communities Catalog Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
            All Communities ({communities.length})
          </h2>
        </div>

        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', padding: '1rem', borderRadius: 'var(--radius-lg)', color: '#991B1B', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <Skeleton height="200px" borderRadius="1rem" />
            <Skeleton height="200px" borderRadius="1rem" />
            <Skeleton height="200px" borderRadius="1rem" />
          </div>
        ) : communities.length === 0 ? (
          <EmptyState
            icon="🏙️"
            title="No Communities Found"
            description="No communities match your current filters. Clear your search or create the first community for this city."
            actionText={isAuthenticated ? "+ Create Community" : undefined}
            onAction={isAuthenticated ? () => setIsCreateOpen(true) : undefined}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {communities.map(comm => (
              <CommunityCard
                key={comm.id}
                community={comm}
                onSelect={onSelectCommunity}
                onToggleJoin={fetchCommunities}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create Community Modal */}
      {isCreateOpen && (
        <CreateCommunityModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={(newComm) => {
            setCommunities(prev => [newComm, ...prev]);
            onSelectCommunity(newComm);
          }}
        />
      )}
    </div>
  );
};
