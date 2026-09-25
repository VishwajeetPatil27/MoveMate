import React, { useEffect, useState } from 'react';
import { RecommendationDto } from '../../types/localService';
import { localServiceService } from '../../services/localServiceService';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Heart,
  MessageSquare,
  Clock,
  Phone,
  ExternalLink,
  Navigation,
  ShieldCheck,
  Star
} from 'lucide-react';

interface ServiceDetailPageProps {
  serviceId: number;
  onBack: () => void;
  onOpenDirectChat: (recipientId: number) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  serviceId,
  onBack,
  onOpenDirectChat
}) => {
  const { user, isAuthenticated } = useAuth();
  const [service, setService] = useState<RecommendationDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await localServiceService.getServiceById(serviceId);
        if (res.success && res.data) {
          setService(res.data);
          setIsSaved(res.data.isSaved);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load place details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [serviceId]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to save places to your favorites.');
      return;
    }
    try {
      setIsSaving(true);
      const res = await localServiceService.toggleFavorite(serviceId);
      if (res.success && res.data) {
        setIsSaved(res.data.saved);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update saved place.');
    } finally {
      setIsSaving(false);
    }
  };

  const isOwner = user && service && user.id === service.creatorId;

  if (loading) return <LoadingSpinner label="Loading service details..." size="lg" />;
  if (error || !service) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
        <p style={{ color: '#EF4444', marginBottom: '1rem' }}>{error || 'Place details not found.'}</p>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Services</span>
        </button>
      </div>
    );
  }

  const mapsUrl = service.latitude && service.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${service.latitude},${service.longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(service.title + ' ' + (service.address || service.city))}`;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Local Services</span>
        </button>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <span className="badge badge-teal" style={{ marginBottom: '0.5rem' }}>
              📍 {service.category.replace('_', ' ')} {service.subcategory ? `• ${service.subcategory}` : ''}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0.25rem 0', lineHeight: 1.25 }}>
              {service.title}
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', margin: 0 }}>
              {service.area ? `${service.area}, ` : ''}{service.city}, {service.state}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleFavoriteToggle}
              disabled={isSaving}
              className="btn btn-secondary"
            >
              <Heart size={16} color={isSaved ? '#E11D48' : '#64748B'} fill={isSaved ? '#E11D48' : 'none'} />
              <span>{isSaved ? 'Saved Place' : 'Save Place'}</span>
            </button>

            {!isOwner && (
              <button
                onClick={() => onOpenDirectChat(service.creatorId)}
                className="btn btn-accent"
              >
                <MessageSquare size={16} />
                <span>Contact Provider</span>
              </button>
            )}
          </div>
        </div>

        {/* Highlights Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          backgroundColor: 'var(--color-bg-page)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: '1.5rem'
        }}>
          {service.distanceFromUserKm !== undefined && service.distanceFromUserKm !== null && (
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Distance from You</span>
              <strong style={{ fontSize: '1rem', color: 'var(--color-accent-blue)' }}>
                🚗 {service.distanceFromUserKm} km
              </strong>
            </div>
          )}

          {service.openingHours && (
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Operating Hours</span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
                {service.openingHours}
              </strong>
            </div>
          )}

          {service.rating && (
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Community Rating</span>
              <strong style={{ fontSize: '1rem', color: 'var(--color-accent-amber)' }}>
                ★ {service.rating} / 5.0
              </strong>
            </div>
          )}

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block' }}>Provider</span>
            <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-main)' }}>
              {service.creatorName}
            </strong>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
            About This Place / Service
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0, fontSize: '0.925rem' }}>
            {service.description || 'No detailed description available.'}
          </p>
        </div>

        {/* Address & Navigation */}
        <div style={{
          padding: '1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', fontWeight: 600 }}>LOCATION & DIRECTIONS</span>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.925rem', color: 'var(--color-text-main)' }}>
              📍 {service.address || `${service.city}, ${service.state}`}
            </p>
            {service.phone && (
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                📞 {service.phone}
              </p>
            )}
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-sm"
          >
            <span>Open in Google Maps</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
