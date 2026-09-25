import React, { useState, useEffect } from 'react';
import { AccommodationDto } from '../../types/accommodation';
import { RecommendationDto } from '../../types/localService';
import { accommodationService } from '../../services/accommodationService';
import { localServiceService } from '../../services/localServiceService';
import { AccommodationCard } from '../housing/AccommodationCard';
import { ServiceCard } from '../services/ServiceCard';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { Bookmark, Building2, MapPin, ArrowLeft } from 'lucide-react';

interface SavedItemsPageProps {
  initialTab?: 'accommodation' | 'services';
  onSelectAccommodation: (accommodation: AccommodationDto) => void;
  onSelectService: (service: RecommendationDto) => void;
  onBackToDiscovery: () => void;
}

export const SavedItemsPage: React.FC<SavedItemsPageProps> = ({
  initialTab = 'accommodation',
  onSelectAccommodation,
  onSelectService,
  onBackToDiscovery
}) => {
  const [activeTab, setActiveTab] = useState<'accommodation' | 'services'>(initialTab);
  const [accommodations, setAccommodations] = useState<AccommodationDto[]>([]);
  const [savedServices, setSavedServices] = useState<RecommendationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSavedData();
  }, [activeTab]);

  const loadSavedData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'accommodation') {
        const res = await accommodationService.getSavedAccommodations();
        if (res.success && res.data) {
          setAccommodations(res.data.content || []);
        }
      } else {
        const res = await localServiceService.getSavedPlaces();
        if (res.success && res.data) {
          setSavedServices(res.data.content || []);
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load saved items.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavoriteAccommodation = async (id: number, e: React.MouseEvent) => {
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <button onClick={onBackToDiscovery} className="btn btn-secondary btn-sm" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            backgroundColor: 'var(--color-brand-accent-light)',
            color: 'var(--color-brand-accent-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bookmark size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Saved Items
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: '0.2rem 0 0 0' }}>
              Your bookmarked accommodation listings and essential local places
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '0.5rem' }}>
        <button
          onClick={() => setActiveTab('accommodation')}
          className={`btn btn-sm ${activeTab === 'accommodation' ? 'btn-accent' : 'btn-ghost'}`}
          style={{ gap: '0.4rem' }}
        >
          <Building2 size={16} />
          <span>Saved Accommodation ({accommodations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`btn btn-sm ${activeTab === 'services' ? 'btn-accent' : 'btn-ghost'}`}
          style={{ gap: '0.4rem' }}
        >
          <MapPin size={16} />
          <span>Saved Places & Services ({savedServices.length})</span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          <Skeleton height="260px" borderRadius="1rem" />
          <Skeleton height="260px" borderRadius="1rem" />
          <Skeleton height="260px" borderRadius="1rem" />
        </div>
      ) : error ? (
        <div style={{ padding: '1.25rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-lg)', color: '#991B1B' }}>
          {error}
        </div>
      ) : activeTab === 'accommodation' ? (
        accommodations.length === 0 ? (
          <EmptyState
            icon="🏠"
            title="No Saved Properties"
            description="Your saved accommodation listings will appear here. Click the heart icon on any property to save it."
            actionText="Find Accommodation"
            onAction={onBackToDiscovery}
          />
        ) : (
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
                onToggleFavorite={handleToggleFavoriteAccommodation}
              />
            ))}
          </div>
        )
      ) : (
        savedServices.length === 0 ? (
          <EmptyState
            icon="📍"
            title="No Saved Places"
            description="Your bookmarked local services and essential places will appear here."
            actionText="Explore Local Services"
            onAction={onBackToDiscovery}
          />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {savedServices.map(srv => (
              <ServiceCard
                key={srv.id}
                service={srv}
                onSelect={onSelectService}
                onToggleFavoriteSuccess={loadSavedData}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};
