import React, { useState, useEffect } from 'react';
import { AccommodationDto } from '../../types/accommodation';
import { accommodationService } from '../../services/accommodationService';
import { AccommodationCard } from './AccommodationCard';

interface SavedAccommodationsPageProps {
  onSelectAccommodation: (accommodation: AccommodationDto) => void;
  onBackToDiscovery: () => void;
}

export const SavedAccommodationsPage: React.FC<SavedAccommodationsPageProps> = ({
  onSelectAccommodation,
  onBackToDiscovery
}) => {
  const [accommodations, setAccommodations] = useState<AccommodationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await accommodationService.getSavedAccommodations();
      if (res.success && res.data) {
        setAccommodations(res.data.content || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load saved properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedListings();
  }, []);

  const handleToggleFavorite = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await accommodationService.toggleFavorite(id);
      if (res.success) {
        setAccommodations(prev => prev.filter(item => item.id !== id));
      }
    } catch (err: any) {
      alert('Failed to remove favorite.');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={onBackToDiscovery} className="btn btn-secondary" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          ← Back to All Accommodations
        </button>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
          Saved Properties
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.95rem', margin: '0.3rem 0 0 0' }}>
          Your bookmarked accommodation listings
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
          <p style={{ color: '#64748B' }}>Loading your saved properties...</p>
        </div>
      )}

      {error && !loading && (
        <div style={{ padding: '1.5rem', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: '1rem', marginBottom: '2rem' }}>
          {error}
        </div>
      )}

      {!loading && !error && accommodations.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {accommodations.map(acc => (
            <AccommodationCard
              key={acc.id}
              accommodation={{ ...acc, favorite: true }}
              onSelect={onSelectAccommodation}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {!loading && !error && accommodations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❤️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
            No Saved Properties
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            Click the heart icon on any accommodation card to save properties to your favorites list.
          </p>
          <button onClick={onBackToDiscovery} className="btn btn-primary" style={{ backgroundColor: '#0F766E' }}>
            Explore Accommodation Listings
          </button>
        </div>
      )}
    </div>
  );
};
