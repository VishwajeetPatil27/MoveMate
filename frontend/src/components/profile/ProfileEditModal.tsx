import React, { useState, useEffect } from 'react';
import { ProfileDto, ProfileUpdateRequest } from '../../types/profile';
import { LocationDto } from '../../types/location';
import { locationService } from '../../services/locationService';
import { profileService } from '../../services/profileService';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { LocationSelector } from '../common/LocationSelector';

interface ProfileEditModalProps {
  profile: ProfileDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: ProfileDto) => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  profile,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [fullName, setFullName] = useState(profile.fullName || '');
  const [profilePhoto, setProfilePhoto] = useState(profile.profilePhoto || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [profession, setProfession] = useState(profile.profession || '');
  const [company, setCompany] = useState(profile.company || '');
  const [college, setCollege] = useState(profile.college || '');
  const [languages, setLanguages] = useState(profile.languages || '');
  const [interests, setInterests] = useState(profile.interests || '');
  const [nativeLocationId, setNativeLocationId] = useState<number | undefined>(profile.nativeLocation?.id);
  const [currentLocationId, setCurrentLocationId] = useState<number | undefined>(profile.currentLocation?.id);

  const [locations, setLocations] = useState<LocationDto[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFullName(profile.fullName || '');
      setProfilePhoto(profile.profilePhoto || '');
      setBio(profile.bio || '');
      setProfession(profile.profession || '');
      setCompany(profile.company || '');
      setCollege(profile.college || '');
      setLanguages(profile.languages || '');
      setInterests(profile.interests || '');
      setNativeLocationId(profile.nativeLocation?.id);
      setCurrentLocationId(profile.currentLocation?.id);
      setError(null);
      fetchLocations();
    }
  }, [isOpen, profile]);

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
    if (!fullName.trim()) {
      setError('Full name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updateReq: ProfileUpdateRequest = {
        fullName: fullName.trim(),
        profilePhoto: profilePhoto.trim() || undefined,
        bio: bio.trim() || undefined,
        profession: profession.trim() || undefined,
        company: company.trim() || undefined,
        college: college.trim() || undefined,
        languages: languages.trim() || undefined,
        interests: interests.trim() || undefined,
        nativeLocationId: nativeLocationId,
        currentLocationId: currentLocationId
      };

      const res = await profileService.updateMyProfile(updateReq);
      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while saving profile');
    } finally {
      setSaving(false);
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
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#FFFFFF',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Edit User Profile</h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>Update your personal identity, locations, and interests</p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
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
                Full Name *
              </label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Profession
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Software Engineer, Designer"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Native / Hometown Location
              </label>
              <select
                className="form-control"
                value={nativeLocationId || ''}
                onChange={(e) => setNativeLocationId(e.target.value ? Number(e.target.value) : undefined)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              >
                <option value="">Select Native Location...</option>
                {locations.map((loc) => (
                  <option key={`native-${loc.id}`} value={loc.id}>
                    {loc.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <LocationSelector
                label="Current Residence Location"
                selectedLocationId={currentLocationId}
                onSelectLocation={(loc) => setCurrentLocationId(loc.id)}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Short Bio & About Me
            </label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Tell fellow relocators about yourself, your background, and goals..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Company / Workplace
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Google, Microsoft, Startup"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                College / University
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. COEP, IIT, VTU"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Languages Spoken
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Marathi, English, Hindi"
                value={languages}
                onChange={(e) => setLanguages(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Interests & Hobbies
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Badminton, Trekking, Coding"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#E2E8F0',
                borderRadius: '8px',
                padding: '0.65rem 1.25rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-accent"
              style={{ padding: '0.65rem 1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {saving ? <LoadingSpinner size="sm" label="Saving..." /> : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
