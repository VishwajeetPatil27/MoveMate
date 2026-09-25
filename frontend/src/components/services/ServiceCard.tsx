import React from 'react';
import { RecommendationDto, ServiceCategory } from '../../types/localService';
import { useAuth } from '../../context/AuthContext';
import { localServiceService } from '../../services/localServiceService';
import { MapPin, Heart, Clock, Star, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: RecommendationDto;
  onSelect: (service: RecommendationDto) => void;
  onToggleFavoriteSuccess?: () => void;
}

const CATEGORY_ICONS: Record<ServiceCategory, string> = {
  HEALTHCARE: '🏥',
  FOOD: '🍴',
  TRANSPORT: '🚇',
  GROCERY: '🛒',
  FINANCIAL: '🏦',
  ESSENTIAL_SERVICES: '🔧',
  EDUCATION: '🎓',
  PUBLIC_SERVICES: '🏛️',
  FITNESS: '💪',
  EMERGENCY: '🚨',
  OTHER: '📍'
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, onToggleFavoriteSuccess }) => {
  const { isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = React.useState<boolean>(service.isSaved);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to save places to your favorites.');
      return;
    }
    try {
      setIsSaving(true);
      const res = await localServiceService.toggleFavorite(service.id);
      if (res.success && res.data) {
        setIsSaved(res.data.saved);
        if (onToggleFavoriteSuccess) onToggleFavoriteSuccess();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update saved place.');
    } finally {
      setIsSaving(false);
    }
  };

  const icon = CATEGORY_ICONS[service.category] || '📍';

  return (
    <div
      onClick={() => onSelect(service)}
      className="card card-interactive"
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-xl, 1rem)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        height: '100%'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <span className="badge badge-teal">
            <span>{icon}</span> {service.category.replace('_', ' ')}
          </span>

          <button
            onClick={handleFavoriteToggle}
            disabled={isSaving}
            style={{
              backgroundColor: isSaved ? '#FEF2F2' : 'var(--color-bg-page)',
              border: `1px solid ${isSaved ? '#FECACA' : 'var(--color-border-subtle)'}`,
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title={isSaved ? 'Remove from saved' : 'Save place'}
          >
            <Heart size={15} color={isSaved ? '#E11D48' : '#64748B'} fill={isSaved ? '#E11D48' : 'none'} />
          </button>
        </div>

        <h3 style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: 'var(--color-text-main)',
          marginBottom: '0.25rem',
          lineHeight: 1.35,
          display: '-webkit-box',
          WebkitLineClamp: 1,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {service.title}
        </h3>

        {service.subcategory && (
          <span style={{ fontSize: '0.78125rem', fontWeight: 600, color: 'var(--color-brand-accent)', display: 'block', marginBottom: '0.5rem' }}>
            {service.subcategory}
          </span>
        )}

        {service.address && (
          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            margin: '0 0 0.75rem 0',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4
          }}>
            📍 {service.address}
          </p>
        )}
      </div>

      <div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--color-border-subtle)',
          fontSize: '0.78125rem'
        }}>
          {service.distanceFromUserKm !== undefined && service.distanceFromUserKm !== null && (
            <span style={{ fontWeight: 700, color: 'var(--color-accent-blue)', backgroundColor: 'var(--color-accent-blue-light)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
              🚗 {service.distanceFromUserKm} km
            </span>
          )}

          {service.openingHours && (
            <span style={{ color: 'var(--color-accent-emerald)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Clock size={12} /> {service.openingHours}
            </span>
          )}

          {service.rating && (
            <span style={{ fontWeight: 700, color: 'var(--color-accent-amber)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <Star size={12} fill="#D97706" /> {service.rating}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            {service.area ? `${service.area}, ` : ''}{service.city}
          </span>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-brand-accent)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <span>Details</span>
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </div>
  );
};
