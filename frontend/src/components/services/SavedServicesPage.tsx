import React, { useEffect, useState } from 'react';
import { RecommendationDto } from '../../types/localService';
import { localServiceService } from '../../services/localServiceService';
import { ServiceCard } from './ServiceCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';

interface SavedServicesPageProps {
  onSelectService: (service: RecommendationDto) => void;
  onBackToDiscovery: () => void;
}

export const SavedServicesPage: React.FC<SavedServicesPageProps> = ({
  onSelectService,
  onBackToDiscovery
}) => {
  const [savedPlaces, setSavedPlaces] = useState<RecommendationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await localServiceService.getSavedPlaces();
      if (res.success && res.data) {
        setSavedPlaces(res.data.content);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load saved places.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button onClick={onBackToDiscovery} className="btn btn-secondary" style={{ marginBottom: '0.75rem' }}>
            ← Back to Local Services Discovery
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            ❤️ Saved Places & Bookmarked Services
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Your bookmarked hospitals, clinics, transit stops, ATMs, and markets.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching your saved places..." />
      ) : error ? (
        <div style={{ padding: '1.5rem', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '0.75rem', color: '#991B1B' }}>
          {error}
        </div>
      ) : savedPlaces.length === 0 ? (
        <EmptyState
          title="No saved places yet"
          description="Bookmark important hospitals, pharmacies, bus stops, and markets while exploring local services."
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {savedPlaces.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={onSelectService}
              onToggleFavoriteSuccess={fetchSavedPlaces}
            />
          ))}
        </div>
      )}
    </div>
  );
};
