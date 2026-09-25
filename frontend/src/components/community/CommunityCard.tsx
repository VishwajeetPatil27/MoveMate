import React, { useState } from 'react';
import { CommunityDto } from '../../types/community';
import { communityService } from '../../services/communityService';
import { useAuth } from '../../context/AuthContext';
import { Users, MapPin, ArrowRight, ShieldCheck, Check } from 'lucide-react';

interface CommunityCardProps {
  community: CommunityDto;
  onSelect?: (community: CommunityDto) => void;
  onToggleJoin?: (updated: CommunityDto) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community, onSelect, onToggleJoin }) => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentComm, setCurrentComm] = useState<CommunityDto>(community);

  const handleJoinToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please sign in to join MoveMate communities.');
      return;
    }

    try {
      setLoading(true);
      if (currentComm.joined) {
        const res = await communityService.leaveCommunity(currentComm.id);
        if (res.success && res.data) {
          setCurrentComm(res.data);
          if (onToggleJoin) onToggleJoin(res.data);
        }
      } else {
        const res = await communityService.joinCommunity(currentComm.id);
        if (res.success && res.data) {
          setCurrentComm(res.data);
          if (onToggleJoin) onToggleJoin(res.data);
        }
      }
    } catch (err: any) {
      console.error('Failed to toggle community membership', err);
      alert(err.response?.data?.message || 'Failed to update community membership');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'REGIONAL': return 'badge-indigo';
      case 'PROFESSIONAL': return 'badge-teal';
      case 'STUDENT': return 'badge-amber';
      case 'JOB': return 'badge-blue';
      case 'HOUSING': return 'badge-green';
      default: return 'badge-gray';
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(currentComm)}
      className="card card-interactive"
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-xl, 1rem)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onSelect ? 'pointer' : 'default',
        height: '100%',
        backgroundColor: '#FFFFFF',
        position: 'relative'
      }}
    >
      <div>
        {/* Cover / Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '0.75rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
            color: '#5EEAD4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}>
            {currentComm.name.charAt(0).toUpperCase()}
          </div>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <span className={`badge ${getCategoryBadgeClass(currentComm.category)}`}>
              {currentComm.category}
            </span>
            {currentComm.memberRole === 'LEADER' && (
              <span className="badge badge-amber">Leader</span>
            )}
          </div>
        </div>

        {/* Title & Route */}
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          margin: '0 0 0.35rem 0',
          color: 'var(--color-text-main)',
          lineHeight: 1.35
        }}>
          {currentComm.name}
        </h3>

        <div style={{
          fontSize: '0.8125rem',
          color: 'var(--color-brand-accent-hover)',
          fontWeight: 600,
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem'
        }}>
          <MapPin size={14} color="#0D9488" />
          <span>{currentComm.originLocation.city}</span>
          <span style={{ color: 'var(--color-text-light)' }}>➔</span>
          <span>{currentComm.destinationLocation.city}</span>
        </div>

        {/* Description Snippet */}
        <p style={{
          fontSize: '0.875rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.5,
          margin: '0 0 1.25rem 0',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {currentComm.description || 'Welcome to our local relocation community.'}
        </p>
      </div>

      {/* Footer Metrics & Action Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid var(--color-border-subtle)'
      }}>
        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Users size={14} />
          <strong>{currentComm.memberCount} {currentComm.memberCount === 1 ? 'member' : 'members'}</strong>
        </div>

        <button
          onClick={handleJoinToggle}
          disabled={loading}
          className={`btn btn-sm ${currentComm.joined ? 'btn-secondary' : 'btn-accent'}`}
          style={{
            borderRadius: 'var(--radius-full)'
          }}
        >
          {loading ? 'Updating...' : currentComm.joined ? (
            <>
              <Check size={14} />
              <span>Joined</span>
            </>
          ) : (
            '+ Join'
          )}
        </button>
      </div>
    </div>
  );
};
