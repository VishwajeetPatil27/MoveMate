import React from 'react';
import { AccommodationDto } from '../../types/accommodation';
import { MapPin, Heart, Home, User, Sparkles } from 'lucide-react';

interface AccommodationCardProps {
  accommodation: AccommodationDto;
  onSelect: (accommodation: AccommodationDto) => void;
  onToggleFavorite?: (id: number, e: React.MouseEvent) => void;
}

export const AccommodationCard: React.FC<AccommodationCardProps> = ({
  accommodation,
  onSelect,
  onToggleFavorite
}) => {
  const primaryImage = accommodation.imageUrls && accommodation.imageUrls.length > 0
    ? accommodation.imageUrls[0]
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rent);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'FLAT': return { label: 'Flat', class: 'badge-blue' };
      case 'PG': return { label: 'PG / Co-living', class: 'badge-amber' };
      case 'ROOM': return { label: 'Single Room', class: 'badge-teal' };
      case 'HOSTEL': return { label: 'Hostel', class: 'badge-indigo' };
      case 'FLATMATE': return { label: 'Flatmate Wanted', class: 'badge-green' };
      default: return { label: type, class: 'badge-gray' };
    }
  };

  const badge = getTypeBadge(accommodation.type);

  return (
    <div
      onClick={() => onSelect(accommodation)}
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl, 1rem)',
        overflow: 'hidden',
        cursor: 'pointer',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: '190px', width: '100%', backgroundColor: '#F1F5F9' }}>
        <img
          src={primaryImage}
          alt={accommodation.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Property Type Badge */}
        <span
          className={`badge ${badge.class}`}
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {badge.label}
        </span>

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => onToggleFavorite(accommodation.id, e)}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-sm)',
              transition: 'transform 0.15s ease'
            }}
            aria-label="Save listing"
          >
            <Heart
              size={17}
              color={accommodation.favorite ? '#E11D48' : '#64748B'}
              fill={accommodation.favorite ? '#E11D48' : 'none'}
            />
          </button>
        )}
      </div>

      {/* Details Body */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-brand-primary, #0F172A)' }}>
              {formatRent(accommodation.rent)}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted, #64748B)' }}>/ month</span>
          </div>

          <h3 style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: 'var(--color-text-main, #0F172A)',
            marginBottom: '0.35rem',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {accommodation.title}
          </h3>

          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted, #64748B)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            margin: '0 0 0.85rem 0'
          }}>
            <MapPin size={14} color="#0D9488" />
            <span>{accommodation.area ? `${accommodation.area}, ` : ''}{accommodation.city || 'India'}</span>
          </p>
        </div>

        {/* Feature Badges */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--color-border-subtle, #E2E8F0)',
          fontSize: '0.75rem',
          color: 'var(--color-text-secondary, #334155)'
        }}>
          <span style={{
            backgroundColor: 'var(--color-bg-page, #F8FAFC)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm, 0.375rem)',
            border: '1px solid var(--color-border-subtle, #E2E8F0)'
          }}>
            {accommodation.furnished.replace('_', ' ')}
          </span>
          <span style={{
            backgroundColor: 'var(--color-bg-page, #F8FAFC)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm, 0.375rem)',
            border: '1px solid var(--color-border-subtle, #E2E8F0)'
          }}>
            For {accommodation.genderPreference}
          </span>
        </div>
      </div>
    </div>
  );
};
