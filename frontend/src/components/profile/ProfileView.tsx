import React, { useState, useEffect } from 'react';
import { ProfileDto } from '../../types/profile';
import { RelocationRequestDto } from '../../types/relocation';
import { profileService } from '../../services/profileService';
import { relocationService } from '../../services/relocationService';
import { ProfileEditModal } from './ProfileEditModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  User,
  Compass,
  Edit3,
  MapPin,
  Building2,
  GraduationCap,
  Languages,
  Sparkles,
  ArrowRight,
  Briefcase
} from 'lucide-react';

interface ProfileViewProps {
  onNavigateRelocation: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigateRelocation }) => {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [relocations, setRelocations] = useState<RelocationRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileRes, relocRes] = await Promise.all([
        profileService.getMyProfile(),
        relocationService.getMyRelocations()
      ]);

      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
      }
      if (relocRes.success && relocRes.data) {
        setRelocations(relocRes.data);
      }
    } catch (err: any) {
      console.error('Failed to load profile data', err);
      setError('Failed to load user profile information.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <LoadingSpinner size="lg" label="Loading Profile..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <p style={{ color: '#EF4444' }}>{error || 'Profile not found.'}</p>
        <button onClick={loadData} className="btn btn-accent" style={{ marginTop: '1rem' }}>
          Retry Loading
        </button>
      </div>
    );
  }

  const activeRelocation = relocations.find(r => r.status === 'ACTIVE');

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Profile Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0F766E 100%)',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.25rem',
              fontWeight: 800,
              color: '#FFFFFF',
              boxShadow: '0 8px 20px rgba(13, 148, 136, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.25)'
            }}>
              {profile.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>{profile.fullName}</h1>
              <p style={{ color: '#94A3B8', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>{profile.email}</p>
              {profile.profession && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: 'rgba(20, 184, 166, 0.15)', color: '#5EEAD4', border: '1px solid rgba(20, 184, 166, 0.3)', borderRadius: '20px', padding: '0.25rem 0.875rem', fontSize: '0.8125rem', fontWeight: 600, marginTop: '0.5rem' }}>
                  <Briefcase size={13} />
                  <span>{profile.profession} {profile.company ? `@ ${profile.company}` : ''}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsEditOpen(true)}
              className="btn btn-accent btn-sm"
            >
              <Edit3 size={15} />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={onNavigateRelocation}
              className="btn btn-secondary btn-sm"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
            >
              <Compass size={15} />
              <span>Relocation Plan</span>
            </button>
          </div>
        </div>

        {/* Profile Completion Bar */}
        <div style={{ marginTop: '2rem', background: 'rgba(15, 23, 42, 0.5)', padding: '1.25rem', borderRadius: 'var(--radius-xl)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#CBD5E1' }}>Profile Completeness</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: profile.completionPercentage >= 70 ? '#5EEAD4' : '#FCD34D' }}>
              {profile.completionPercentage}%
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.15)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${profile.completionPercentage}%`,
              height: '100%',
              background: profile.completionPercentage >= 70
                ? 'linear-gradient(90deg, #0D9488 0%, #14B8A6 100%)'
                : 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
              transition: 'width 0.5s ease-in-out'
            }} />
          </div>
        </div>
      </div>

      {/* Locations & Relocation Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#EDE9FE',
            color: '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            <Building2 size={18} />
          </div>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', margin: 0, fontWeight: 700 }}>
            Hometown / Native
          </h3>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', margin: '0.35rem 0 0 0' }}>
            {profile.nativeLocation ? profile.nativeLocation.displayName : 'Not Specified'}
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#CCFBF1',
            color: '#0D9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            <MapPin size={18} />
          </div>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', margin: 0, fontWeight: 700 }}>
            Current Residence
          </h3>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', margin: '0.35rem 0 0 0' }}>
            {profile.currentLocation ? profile.currentLocation.displayName : 'Not Specified'}
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.75rem'
          }}>
            <Compass size={18} />
          </div>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', margin: 0, fontWeight: 700 }}>
            Relocation Route
          </h3>
          {activeRelocation ? (
            <div style={{ marginTop: '0.35rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-brand-accent)' }}>
                {activeRelocation.originLocation.city} ➔ {activeRelocation.destinationLocation.city}
              </span>
              <div style={{ fontSize: '0.78125rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                Move Date: {activeRelocation.movingDate || 'Flexible'}
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '0.95rem', color: 'var(--color-text-light)', margin: '0.35rem 0 0 0' }}>
              No Active Move Plan
            </p>
          )}
        </div>
      </div>

      {/* Profile Details & Bio */}
      <div className="card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--color-text-main)' }}>
          About & Personal Background
        </h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', margin: '0 0 0.35rem 0', fontWeight: 600 }}>
            Bio
          </h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>
            {profile.bio || 'No bio added yet. Click Edit Profile to introduce yourself to your city community.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-subtle)' }}>
          <div>
            <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-muted)', display: 'block', fontWeight: 500 }}>Education / Alma Mater</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{profile.college || 'Not Specified'}</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-muted)', display: 'block', fontWeight: 500 }}>Languages Spoken</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{profile.languages || 'Not Specified'}</strong>
          </div>

          <div>
            <span style={{ fontSize: '0.78125rem', color: 'var(--color-text-muted)', display: 'block', fontWeight: 500 }}>Interests & Hobbies</span>
            <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{profile.interests || 'Not Specified'}</strong>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditOpen && (
        <ProfileEditModal
          profile={profile}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          onSuccess={(updated) => setProfile(updated)}
        />
      )}
    </div>
  );
};
