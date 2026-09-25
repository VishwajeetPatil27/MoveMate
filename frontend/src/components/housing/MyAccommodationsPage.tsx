import React, { useState, useEffect } from 'react';
import { AccommodationDto } from '../../types/accommodation';
import { accommodationService } from '../../services/accommodationService';
import { AccommodationCard } from './AccommodationCard';

interface MyAccommodationsPageProps {
  onSelectAccommodation: (accommodation: AccommodationDto) => void;
  onBackToDiscovery: () => void;
  onCreateListing: () => void;
}

export const MyAccommodationsPage: React.FC<MyAccommodationsPageProps> = ({
  onSelectAccommodation,
  onBackToDiscovery,
  onCreateListing
}) => {
  const [accommodations, setAccommodations] = useState<AccommodationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await accommodationService.getMyAccommodations();
      if (res.success && res.data) {
        setAccommodations(res.data.content || []);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load your listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDeleteListing = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to remove this property listing?')) {
      return;
    }
    try {
      const res = await accommodationService.deleteAccommodation(id);
      if (res.success) {
        setAccommodations(prev => prev.filter(item => item.id !== id));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button onClick={onBackToDiscovery} className="btn btn-secondary" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            ← Back to All Accommodations
          </button>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            My Property Listings
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem', margin: '0.3rem 0 0 0' }}>
            Manage your listed rooms, PGs, and flatmate posts
          </p>
        </div>

        <button onClick={onCreateListing} className="btn btn-primary" style={{ backgroundColor: '#0F766E' }}>
          + Add New Listing
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
          <p style={{ color: '#64748B' }}>Loading your property listings...</p>
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
            <div key={acc.id} style={{ position: 'relative' }}>
              <AccommodationCard
                accommodation={acc}
                onSelect={onSelectAccommodation}
              />
              <button
                onClick={(e) => handleDeleteListing(acc.id, e)}
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  background: '#FEF2F2',
                  border: '1px solid #FCA5A5',
                  color: '#991B1B',
                  borderRadius: '6px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                🗑️ Delete Listing
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && accommodations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#FFFFFF', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
            No Listings Published Yet
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            You haven't posted any property listings. Click below to list your room, PG, or flat.
          </p>
          <button onClick={onCreateListing} className="btn btn-primary" style={{ backgroundColor: '#0F766E' }}>
            + Create Your First Listing
          </button>
        </div>
      )}
    </div>
  );
};
