import React, { useState, useEffect } from 'react';
import { AccommodationDto, AccommodationFilterParams, AccommodationType, FurnishingStatus, GenderPreference } from '../../types/accommodation';
import { accommodationService } from '../../services/accommodationService';
import { AccommodationCard } from './AccommodationCard';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import {
  Building2,
  Search,
  Filter,
  Plus,
  SlidersHorizontal,
  Bookmark,
  MapPin,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

interface AccommodationDiscoveryPageProps {
  onSelectAccommodation: (accommodation: AccommodationDto) => void;
  onNavigateMyListings: () => void;
  onNavigateSavedListings: () => void;
  onCreateListing: () => void;
}

export const AccommodationDiscoveryPage: React.FC<AccommodationDiscoveryPageProps> = ({
  onSelectAccommodation,
  onNavigateMyListings,
  onNavigateSavedListings,
  onCreateListing
}) => {
  const { isAuthenticated } = useAuth();
  const [accommodations, setAccommodations] = useState<AccommodationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [cityInput, setCityInput] = useState<string>('');
  const [selectedType, setSelectedType] = useState<AccommodationType | ''>('');
  const [minRent, setMinRent] = useState<string>('');
  const [maxRent, setMaxRent] = useState<string>('');
  const [genderPref, setGenderPref] = useState<GenderPreference | ''>('');
  const [furnishing, setFurnishing] = useState<FurnishingStatus | ''>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [direction, setDirection] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalElements, setTotalElements] = useState<number>(0);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: AccommodationFilterParams = {
        city: cityInput.trim() || undefined,
        type: selectedType ? selectedType : undefined,
        minRent: minRent ? Number(minRent) : undefined,
        maxRent: maxRent ? Number(maxRent) : undefined,
        genderPreference: genderPref ? genderPref : undefined,
        furnished: furnishing ? furnishing : undefined,
        page,
        size: 9,
        sortBy,
        direction
      };

      const response = await accommodationService.searchAccommodations(params);
      if (response.success && response.data) {
        setAccommodations(response.data.content || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load accommodations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [page, sortBy, direction]);

  const handleApplySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchListings();
  };

  const handleToggleFavorite = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to save accommodations.');
      return;
    }
    try {
      const res = await accommodationService.toggleFavorite(id);
      if (res.success && res.data) {
        setAccommodations(prev => prev.map(item => item.id === id ? { ...item, favorite: res.data.isFavorite } : item));
      }
    } catch (err: any) {
      alert('Failed to update favorite.');
    }
  };

  const resetFilters = () => {
    setCityInput('');
    setSelectedType('');
    setMinRent('');
    setMaxRent('');
    setGenderPref('');
    setFurnishing('');
    setPage(0);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #0F766E 100%)',
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
            <Building2 size={14} />
            <span>Accommodation Marketplace</span>
          </div>
          <h1 style={{ color: '#FFFFFF', fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>
            Find a Place to Call Home
          </h1>
          <p style={{ color: '#E2E8F0', fontSize: '1rem', lineHeight: 1.5, margin: 0 }}>
            Discover verified single rooms, PGs, shared apartments, and flatmate listings in your destination city.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isAuthenticated && (
            <>
              <button onClick={onCreateListing} className="btn btn-accent">
                <Plus size={16} />
                <span>List Accommodation</span>
              </button>
              <button
                onClick={onNavigateMyListings}
                className="btn btn-secondary"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                My Listings
              </button>
              <button
                onClick={onNavigateSavedListings}
                className="btn btn-secondary"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Bookmark size={15} />
                <span>Saved</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <form onSubmit={handleApplySearch} className="card" style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          {/* City / Area Search */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              City or Area
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. Pune, Hinjawadi"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '2.25rem' }}
              />
              <MapPin size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Property Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              Property Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as AccommodationType | '')}
              className="form-control"
            >
              <option value="">All Types</option>
              <option value="FLAT">Flat / Apartment</option>
              <option value="PG">PG (Paying Guest)</option>
              <option value="ROOM">Single Room</option>
              <option value="HOSTEL">Hostel</option>
              <option value="FLATMATE">Flatmate Wanted</option>
            </select>
          </div>

          {/* Max Rent */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              Max Rent (₹/mo)
            </label>
            <input
              type="number"
              placeholder="e.g. 15000"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Furnishing Status */}
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '0.35rem' }}>
              Furnishing
            </label>
            <select
              value={furnishing}
              onChange={(e) => setFurnishing(e.target.value as FurnishingStatus | '')}
              className="form-control"
            >
              <option value="">Any Furnishing</option>
              <option value="UNFURNISHED">Unfurnished</option>
              <option value="SEMI_FURNISHED">Semi-Furnished</option>
              <option value="FULLY_FURNISHED">Fully-Furnished</option>
            </select>
          </div>

          {/* Submit Search & Reset */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
              <Search size={16} />
              <span>Search</span>
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-secondary"
              title="Reset Filters"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </form>

      {/* Results Header & Sort Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
          Available Properties ({totalElements})
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <label style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>Sort By:</label>
          <select
            value={`${sortBy}-${direction}`}
            onChange={(e) => {
              const [sb, dir] = e.target.value.split('-');
              setSortBy(sb);
              setDirection(dir as 'ASC' | 'DESC');
            }}
            className="form-control"
            style={{ width: 'auto', padding: '0.35rem 0.75rem', fontSize: '0.8125rem' }}
          >
            <option value="createdAt-DESC">Newest First</option>
            <option value="rent-ASC">Price: Low to High</option>
            <option value="rent-DESC">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          <Skeleton height="320px" borderRadius="1rem" />
          <Skeleton height="320px" borderRadius="1rem" />
          <Skeleton height="320px" borderRadius="1rem" />
        </div>
      )}

      {error && !loading && (
        <div style={{ padding: '1.25rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 'var(--radius-lg)' }}>
          <strong>Notice:</strong> {error}
        </div>
      )}

      {/* Accommodation Cards Grid */}
      {!loading && !error && accommodations.length > 0 && (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {accommodations.map(acc => (
              <AccommodationCard
                key={acc.id}
                accommodation={acc}
                onSelect={onSelectAccommodation}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                disabled={page === 0}
                onClick={() => setPage(prev => Math.max(0, prev - 1))}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600, padding: '0 0.5rem' }}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !error && accommodations.length === 0 && (
        <EmptyState
          icon="🏠"
          title="No Accommodation Found"
          description="Try adjusting your filters, searching another city, or list your property."
          actionText={isAuthenticated ? "+ List Accommodation" : undefined}
          onAction={isAuthenticated ? onCreateListing : undefined}
        />
      )}
    </div>
  );
};
