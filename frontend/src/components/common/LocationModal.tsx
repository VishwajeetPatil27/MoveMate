import React, { useEffect, useState } from 'react';
import { MapPin, X, Compass, Check } from 'lucide-react';
import { LocationSelector } from './LocationSelector';
import { LocationDto } from '../../types/location';
import { locationService } from '../../services/locationService';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCityName: string;
  onSelectCity: (location: LocationDto) => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentCityName,
  onSelectCity
}) => {
  const [popularLocations, setPopularLocations] = useState<LocationDto[]>([]);

  useEffect(() => {
    if (isOpen) {
      locationService.searchLocations()
        .then(res => {
          if (res.success && res.data) {
            setPopularLocations(res.data.slice(0, 8));
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-2xl, 1.25rem)',
          border: '1px solid var(--color-border-subtle, #E2E8F0)',
          boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(15, 23, 42, 0.15))',
          padding: '1.75rem',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted, #64748B)',
            cursor: 'pointer',
            padding: '0.25rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Compass size={22} color="#5EEAD4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main, #0F172A)' }}>
              Where are you exploring?
            </h3>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--color-text-muted, #64748B)' }}>
              Select your active city to find relevant local communities, housing, and services.
            </p>
          </div>
        </div>

        {/* Current Active City Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.85rem',
          backgroundColor: 'var(--color-surface-subtle, #F1F5F9)',
          borderRadius: 'var(--radius-lg, 0.75rem)',
          marginBottom: '1.25rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary, #334155)'
        }}>
          <MapPin size={16} color="#0D9488" />
          <span>Currently selected city:</span>
          <strong style={{ color: 'var(--color-brand-accent-hover, #0F766E)' }}>{currentCityName}</strong>
        </div>

        {/* Live Location and Search Dropdown */}
        <LocationSelector
          label="Search or detect your city"
          placeholder="Search city, state or locality..."
          onSelectLocation={(loc) => {
            onSelectCity(loc);
            onClose();
          }}
        />

        {/* Available Cities Quick Pills */}
        {popularLocations.length > 0 && (
          <div style={{ marginTop: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted, #64748B)', marginBottom: '0.5rem' }}>
              Available Cities
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {popularLocations.map((loc) => {
                const isSelected = loc.city.toLowerCase() === currentCityName.toLowerCase();
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      onSelectCity(loc);
                      onClose();
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.375rem 0.75rem',
                      borderRadius: 'var(--radius-full, 9999px)',
                      border: isSelected ? '1px solid var(--color-brand-accent, #0D9488)' : '1px solid var(--color-border-subtle, #E2E8F0)',
                      backgroundColor: isSelected ? 'var(--color-brand-accent-light, #CCFBF1)' : '#FFFFFF',
                      color: isSelected ? 'var(--color-brand-accent-hover, #0F766E)' : 'var(--color-text-secondary, #334155)',
                      fontSize: '0.8125rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{loc.city}</span>
                    {isSelected && <Check size={13} />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
