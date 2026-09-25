import React, { useEffect, useState } from 'react';
import { RecommendationDto, ServiceCategory } from '../../types/localService';
import { localServiceService } from '../../services/localServiceService';
import { locationService } from '../../services/locationService';
import { LocationDto } from '../../types/location';
import { ServiceCard } from './ServiceCard';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  Search,
  Navigation,
  Bookmark,
  Plus,
  Compass
} from 'lucide-react';

interface ServicesDiscoveryPageProps {
  onSelectService: (service: RecommendationDto) => void;
  onNavigateSavedPlaces: () => void;
  onCreateService: () => void;
}

const CATEGORIES: { key: ServiceCategory | 'ALL'; label: string; icon: string }[] = [
  { key: 'ALL', label: 'All Services', icon: '✨' },
  { key: 'HEALTHCARE', label: 'Healthcare', icon: '🏥' },
  { key: 'TRANSPORT', label: 'Transport', icon: '🚇' },
  { key: 'GROCERY', label: 'Grocery & Supplies', icon: '🛒' },
  { key: 'FOOD', label: 'Food & Dining', icon: '🍴' },
  { key: 'FINANCIAL', label: 'Banks & ATMs', icon: '🏦' },
  { key: 'ESSENTIAL_SERVICES', label: 'Repairs & Services', icon: '🔧' },
  { key: 'FITNESS', label: 'Gym & Fitness', icon: '💪' },
  { key: 'EDUCATION', label: 'Education', icon: '🎓' },
  { key: 'PUBLIC_SERVICES', label: 'Public Services', icon: '🏛️' },
  { key: 'EMERGENCY', label: 'Emergency', icon: '🚨' }
];

export const ServicesDiscoveryPage: React.FC<ServicesDiscoveryPageProps> = ({
  onSelectService,
  onNavigateSavedPlaces,
  onCreateService
}) => {
  const { user, isAuthenticated } = useAuth();
  const [services, setServices] = useState<RecommendationDto[]>([]);
  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('Pune');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // User Geolocation Coordinates (e.g. Pune Hinjawadi defaults 18.5912, 73.7389)
  const [userCoords, setUserCoords] = useState<{ latitude?: number; longitude?: number }>({
    latitude: 18.5912,
    longitude: 73.7389
  });

  useEffect(() => {
    locationService.searchLocations().then(res => {
      if (res.success && res.data) {
        setLocations(res.data);
      }
    }).catch(() => {});
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await localServiceService.searchServices({
        city: searchQuery || selectedCity,
        category: selectedCategory === 'ALL' ? undefined : selectedCategory,
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        page: 0,
        size: 30
      });
      if (res.success && res.data) {
        setServices(res.data.content);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load local services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [selectedCity, selectedCategory, userCoords]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        (err) => {
          alert(`Location access denied or unavailable: ${err.message}. Using selected city coordinates.`);
        }
      );
    } else {
      alert('Browser geolocation is not supported.');
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        padding: '2.5rem 2rem',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
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
              <MapPin size={14} />
              <span>Local Essentials & Discovery</span>
            </div>
            <h1 style={{ color: '#FFFFFF', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>
              Discover Services Around You
            </h1>
            <p style={{ color: '#E2E8F0', fontSize: '1rem', margin: 0, lineHeight: 1.5 }}>
              Find verified hospitals, pharmacies, transit stops, grocery markets, ATMs, gyms, and local helpers in your city.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {isAuthenticated && (
              <>
                <button
                  onClick={onNavigateSavedPlaces}
                  className="btn btn-secondary"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
                >
                  <Bookmark size={15} />
                  <span>Saved Places</span>
                </button>
                <button onClick={onCreateService} className="btn btn-accent">
                  <Plus size={16} />
                  <span>List Service</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search & Location Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.75rem' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search hospitals, supermarkets, transit, mechanics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ backgroundColor: '#FFFFFF', paddingLeft: '2.25rem' }}
            />
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          </div>

          <select
            className="form-control"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ width: '180px', backgroundColor: '#FFFFFF', fontWeight: 600 }}
          >
            <option value="Pune">Pune</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Sangli">Sangli</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>

          <button type="submit" className="btn btn-accent">
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="btn btn-secondary"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            title="Sort by distance from your current location"
          >
            <Navigation size={15} />
            <span>Near Me</span>
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '9999px',
              border: selectedCategory === cat.key ? '2px solid var(--color-brand-accent)' : '1px solid var(--color-border-subtle)',
              backgroundColor: selectedCategory === cat.key ? 'var(--color-brand-accent-light)' : '#FFFFFF',
              color: selectedCategory === cat.key ? 'var(--color-brand-accent-hover)' : 'var(--color-text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.15s ease'
            }}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
          {selectedCategory === 'ALL' ? 'All Local Places' : `${selectedCategory.replace('_', ' ')} Places`} in {selectedCity}
        </h2>
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
          Showing {services.length} verified listings
        </span>
      </div>

      {/* Main Grid Content */}
      {loading ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          <Skeleton height="180px" borderRadius="1rem" />
          <Skeleton height="180px" borderRadius="1rem" />
          <Skeleton height="180px" borderRadius="1rem" />
        </div>
      ) : error ? (
        <div style={{ padding: '1.25rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-lg)', color: '#991B1B' }}>
          {error}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          icon="📍"
          title="No local services found"
          description={`No verified places match your category '${selectedCategory}' in ${selectedCity}.`}
          actionText={isAuthenticated ? "+ List a Service" : undefined}
          onAction={isAuthenticated ? onCreateService : undefined}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={onSelectService}
              onToggleFavoriteSuccess={fetchServices}
            />
          ))}
        </div>
      )}
    </div>
  );
};
