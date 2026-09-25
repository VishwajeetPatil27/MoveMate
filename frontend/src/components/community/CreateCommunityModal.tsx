import React, { useState, useEffect } from 'react';
import { CreateCommunityRequest, CommunityCategory, CommunityDto } from '../../types/community';
import { LocationDto } from '../../types/location';
import { locationService } from '../../services/locationService';
import { communityService } from '../../services/communityService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (created: CommunityDto) => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [originLocationId, setOriginLocationId] = useState<number | undefined>(undefined);
  const [destinationLocationId, setDestinationLocationId] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState<CommunityCategory>('REGIONAL');
  const [language, setLanguage] = useState('English');
  const [coverImage, setCoverImage] = useState('');

  const [locations, setLocations] = useState<LocationDto[]>([]);
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
      const res = await locationService.searchLocations();
      if (res.success && res.data) {
        setLocations(res.data);
      }
    } catch (err) {
      console.error('Failed to load locations', err);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Community name is required');
      return;
    }
    if (!originLocationId || !destinationLocationId) {
      setError('Please select both Origin and Destination locations.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const request: CreateCommunityRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        originLocationId,
        destinationLocationId,
        category,
        language: language.trim() || undefined,
        coverImage: coverImage.trim() || undefined
      };

      const res = await communityService.createCommunity(request);
      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to create community');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create community. Check if name is unique.');
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
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Create New Community</h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>Build a regional, professional or interest community for relocators</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.5rem', cursor: 'pointer' }}>
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
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Community Name *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Pune Tech Professionals Hub"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Origin Location (Hometown / Source) *
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
                  <option key={`comm-origin-${loc.id}`} value={loc.id}>
                    {loc.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Destination Location (Target City) *
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
                  <option key={`comm-dest-${loc.id}`} value={loc.id}>
                    {loc.displayName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Community Category *
              </label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunityCategory)}
                required
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              >
                <option value="REGIONAL">Regional Community</option>
                <option value="PROFESSIONAL">Professional / Career</option>
                <option value="STUDENT">Student / College</option>
                <option value="JOB">Job Seekers</option>
                <option value="HOUSING">Housing & Flatmates</option>
                <option value="GENERAL">General Relocation</option>
                <option value="INTEREST">Interest & Hobbies</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Primary Language
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. English, Marathi, Hindi"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Description & Purpose
            </label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Describe who should join this community, what topics are covered, and how members support each other..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {submitting ? <LoadingSpinner size="sm" label="Creating..." /> : 'Create Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
