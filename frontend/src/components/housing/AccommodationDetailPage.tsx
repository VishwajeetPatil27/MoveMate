import React, { useState, useEffect } from 'react';
import { AccommodationDto } from '../../types/accommodation';
import { accommodationService } from '../../services/accommodationService';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  ArrowLeft,
  MapPin,
  Heart,
  MessageSquare,
  Building2,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Sparkles
} from 'lucide-react';

interface AccommodationDetailPageProps {
  accommodationId: number | string;
  onBack: () => void;
  onOpenDirectChat?: (recipientId: number) => void;
}

export const AccommodationDetailPage: React.FC<AccommodationDetailPageProps> = ({
  accommodationId,
  onBack,
  onOpenDirectChat
}) => {
  const { user, isAuthenticated } = useAuth();
  const [accommodation, setAccommodation] = useState<AccommodationDto | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await accommodationService.getAccommodationById(accommodationId);
      if (response.success && response.data) {
        setAccommodation(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load accommodation details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [accommodationId]);

  const handleToggleFavorite = async () => {
    if (!isAuthenticated || !accommodation) {
      alert('Please sign in to save accommodations.');
      return;
    }
    try {
      const res = await accommodationService.toggleFavorite(accommodation.id);
      if (res.success && res.data) {
        setAccommodation({ ...accommodation, favorite: res.data.isFavorite });
      }
    } catch (err: any) {
      alert('Failed to update favorite status.');
    }
  };

  const formatRent = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}>
        <LoadingSpinner size="lg" label="Loading accommodation details..." />
      </div>
    );
  }

  if (error || !accommodation) {
    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Accommodations</span>
        </button>
        <div style={{ padding: '2rem', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', borderRadius: 'var(--radius-xl)' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>Property Not Found</h3>
          <p style={{ margin: 0 }}>{error || 'This listing may have been removed or is no longer available.'}</p>
        </div>
      </div>
    );
  }

  const galleryImages = accommodation.imageUrls && accommodation.imageUrls.length > 0
    ? accommodation.imageUrls
    : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'];

  const facilitiesList = accommodation.facilities
    ? accommodation.facilities.split(',').map(f => f.trim()).filter(Boolean)
    : [];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back Button */}
      <div>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Accommodations</span>
        </button>
      </div>

      {/* Main Image Gallery */}
      <div className="card" style={{ padding: '1rem', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: '#F1F5F9', marginBottom: '1rem' }}>
          <img
            src={galleryImages[selectedImageIndex]}
            alt={accommodation.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80';
            }}
          />
        </div>

        {/* Gallery Thumbnails */}
        {galleryImages.length > 1 && (
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
            {galleryImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setSelectedImageIndex(idx)}
                style={{
                  width: '90px',
                  height: '65px',
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  border: idx === selectedImageIndex ? '2px solid var(--color-brand-accent)' : '1px solid var(--color-border-subtle)',
                  opacity: idx === selectedImageIndex ? 1 : 0.65,
                  transition: 'all 0.15s ease'
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property Overview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="badge badge-teal">{accommodation.type}</span>
              <span className="badge badge-amber">{accommodation.furnished.replace('_', ' ')}</span>
              <span className="badge badge-gray">Gender: {accommodation.genderPreference}</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '0.5rem', lineHeight: 1.25 }}>
              {accommodation.title}
            </h1>

            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
              <MapPin size={16} color="#0D9488" />
              <span>{accommodation.area ? `${accommodation.area}, ` : ''}{accommodation.city || 'India'}</span>
            </p>
          </div>

          {/* Description Card */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.75rem' }}>
              About This Property
            </h3>
            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line', margin: 0, fontSize: '0.925rem' }}>
              {accommodation.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Facilities / Amenities */}
          {facilitiesList.length > 0 && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '1rem' }}>
                Amenities & Facilities
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {facilitiesList.map((facility, idx) => (
                  <span
                    key={idx}
                    className="badge badge-teal"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8125rem' }}
                  >
                    ✨ {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Local Essentials & Services */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="#0D9488" />
              <span>Nearby Local Essentials ({accommodation.city})</span>
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 700, display: 'block' }}>🏥 Emergency Care</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>City Hospital / Clinic</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.2rem' }}>~1.2 km away • 24/7 ICU</span>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: '#0284C7', fontWeight: 700, display: 'block' }}>🚇 Public Transit</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>Bus & Metro Station</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.2rem' }}>~0.5 km away</span>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-bg-page)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'block' }}>🛒 Supermarket</span>
                <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-main)' }}>Local Market & Daily Needs</strong>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '0.2rem' }}>~0.8 km away</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Owner Action Card */}
        <div>
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'block' }}>Monthly Rent</span>
                <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-brand-primary)' }}>
                  {formatRent(accommodation.rent)}
                </span>
              </div>
              <button
                onClick={handleToggleFavorite}
                className="btn btn-secondary btn-sm"
              >
                <Heart size={16} color={accommodation.favorite ? '#E11D48' : '#64748B'} fill={accommodation.favorite ? '#E11D48' : 'none'} />
                <span>{accommodation.favorite ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            {accommodation.deposit && (
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-surface-subtle)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Security Deposit: </span>
                <strong style={{ color: 'var(--color-text-main)' }}>{formatRent(accommodation.deposit)}</strong>
              </div>
            )}

            {/* Provider Details Box */}
            <div style={{ paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'block', marginBottom: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Property Provider
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}>
                  {accommodation.ownerName ? accommodation.ownerName.charAt(0).toUpperCase() : 'P'}
                </div>
                <div>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', display: 'block' }}>{accommodation.ownerName}</strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-brand-accent)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <ShieldCheck size={14} /> Verified Provider
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {user && user.id === accommodation.ownerId ? (
                <div style={{ padding: '0.75rem', backgroundColor: 'var(--color-accent-amber-light)', border: '1px solid var(--color-accent-amber)', color: '#B45309', borderRadius: 'var(--radius-md)', fontSize: '0.8125rem', textAlign: 'center', fontWeight: 600 }}>
                  You are the owner of this property listing.
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      alert('Please sign in to message the provider.');
                      return;
                    }
                    if (onOpenDirectChat) {
                      onOpenDirectChat(accommodation.ownerId);
                    }
                  }}
                  className="btn btn-accent btn-lg"
                  style={{ width: '100%' }}
                >
                  <MessageSquare size={18} />
                  <span>Contact Provider</span>
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', textAlign: 'center' }}>
              Listed on {new Date(accommodation.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
