import React, { useState, useEffect } from 'react';
import { CommunityCategory, CommunityDto, CommunityStatus, UpdateCommunityRequest } from '../../types/community';
import { communityService } from '../../services/communityService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface EditCommunityModalProps {
  community: CommunityDto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: CommunityDto) => void;
}

export const EditCommunityModal: React.FC<EditCommunityModalProps> = ({ community, isOpen, onClose, onSuccess }) => {
  const [description, setDescription] = useState(community.description || '');
  const [category, setCategory] = useState<CommunityCategory>(community.category);
  const [language, setLanguage] = useState(community.language || 'English');
  const [status, setStatus] = useState<CommunityStatus>(community.status);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDescription(community.description || '');
      setCategory(community.category);
      setLanguage(community.language || 'English');
      setStatus(community.status);
      setError(null);
    }
  }, [isOpen, community]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      const request: UpdateCommunityRequest = {
        description: description.trim() || undefined,
        category,
        language: language.trim() || undefined,
        status
      };

      const res = await communityService.updateCommunity(community.id, request);
      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to update community');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update community details');
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
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#FFFFFF',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Edit Community Details</h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>Manage settings for {community.name}</p>
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value as CommunityCategory)}
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
                Community Status
              </label>
              <select
                className="form-control"
                value={status}
                onChange={(e) => setStatus(e.target.value as CommunityStatus)}
                style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Primary Language
            </label>
            <input
              type="text"
              className="form-control"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Description
            </label>
            <textarea
              rows={4}
              className="form-control"
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
              {submitting ? <LoadingSpinner size="sm" label="Saving..." /> : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
