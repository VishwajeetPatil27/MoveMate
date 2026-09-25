import React, { useState, useEffect } from 'react';
import { CreateRelocationRequest, RelocationPurpose, RelocationRequestDto } from '../../types/relocation';
import { LocationDto } from '../../types/location';
import { locationService } from '../../services/locationService';
import { relocationService } from '../../services/relocationService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface RelocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (relocation: RelocationRequestDto) => void;
}

export const RelocationModal: React.FC<RelocationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [originLocationId, setOriginLocationId] = useState<number | undefined>(undefined);
  const [destinationLocationId, setDestinationLocationId] = useState<number | undefined>(undefined);
  const [destinationArea, setDestinationArea] = useState('');
  const [purpose, setPurpose] = useState<RelocationPurpose>('JOB');
  const [profession, setProfession] = useState('');
  const [budget, setBudget] = useState<string>('');
  const [movingDate, setMovingDate] = useState('');
  const [requirements, setRequirements] = useState('');

  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      fetchLocations();
    }
  }, [isOpen]);

  const fetchLocations = async () => {
    try {
      setLoadingLocations(true);
      const res = await locationService.searchLocations();
      if (res.success && res.data) {
        setLocations(res.data);
      }
    } catch (err) {
      console.error('Failed to load locations', err);
    } finally {
      setLoadingLocations(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originLocationId || !destinationLocationId) {
      setError('Please select both Origin and Destination locations.');
      return;
    }

    if (originLocationId === destinationLocationId) {
      setError('Origin and Destination locations must be different.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const request: CreateRelocationRequest = {
        originLocationId,
        destinationLocationId,
        destinationArea: destinationArea.trim() || undefined,
        purpose,
        profession: profession.trim() || undefined,
        budget: budget ? Number(budget) : undefined,
        movingDate: movingDate || undefined,
        requirements: requirements.trim() || undefined
      };

      const res = await relocationService.createRelocation(request);
      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to create relocation plan');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create relocation request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#FFFFFF',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Create Relocation Plan</h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>Declare your upcoming move, timeline, budget & housing needs</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '0.875rem 1rem',
            marginBottom: '1.25rem',
            color: '#FCA5A5',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Origin Location (Moving From) *
              </label>
              <select
                className="form-control"
                value={originLocationId || ''}
                onChange={(e) => setOriginLocationId(Number(e.target.value))}
                required
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              >
                <option value="">Select Origin Location...</option>
                {locations.map((loc) => (
                  <option key={`origin-${loc.id}`} value={loc.id}>
                    {loc.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Destination Location (Moving To) *
              </label>
              <select
                className="form-control"
                value={destinationLocationId || ''}
                onChange={(e) => setDestinationLocationId(Number(e.target.value))}
                required
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              >
                <option value="">Select Destination Location...</option>
                {locations.map((loc) => (
                  <option key={`dest-${loc.id}`} value={loc.id}>
                    {loc.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Destination Preferred Area
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Whitefield, Hinjawadi, Bandra"
                value={destinationArea}
                onChange={(e) => setDestinationArea(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Relocation Purpose *
              </label>
              <select
                className="form-control"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as RelocationPurpose)}
                required
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              >
                <option value="JOB">Employment / New Job</option>
                <option value="EDUCATION">Higher Education / College</option>
                <option value="BUSINESS">Business / Startup</option>
                <option value="FAMILY">Family Relocation</option>
                <option value="OTHER">Other Purpose</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Target Moving Date
              </label>
              <input
                type="date"
                className="form-control"
                value={movingDate}
                onChange={(e) => setMovingDate(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Housing Budget (₹ / Month)
              </label>
              <input
                type="number"
                className="form-control"
                placeholder="e.g. 15000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Relocation Requirements & Notes
            </label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Specify room type preference (1BHK, PG, Flatmate), commute preference, or community help needed..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#E2E8F0', borderRadius: '8px', padding: '0.65rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-accent"
              style={{ padding: '0.65rem 1.5rem', fontWeight: 600 }}
            >
              {submitting ? <LoadingSpinner size="sm" label="Creating..." /> : 'Save Relocation Intent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
