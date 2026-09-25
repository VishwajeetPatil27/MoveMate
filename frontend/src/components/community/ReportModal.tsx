import React, { useState } from 'react';
import { ReportTargetType } from '../../types/post';
import { postService } from '../../services/postService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ReportModalProps {
  targetType: ReportTargetType;
  targetId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ targetType, targetId, isOpen, onClose }) => {
  const [reason, setReason] = useState('SPAM');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      let res;
      if (targetType === 'POST') {
        res = await postService.reportPost(targetId, reason, description.trim() || undefined);
      } else {
        res = await postService.reportComment(targetId, reason, description.trim() || undefined);
      }

      if (res.success) {
        alert('Thank you for flagging this content. Our moderation team will review it.');
        onClose();
      } else {
        setError(res.message || 'Failed to submit report');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit report. You may have already reported this content.');
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
        maxWidth: '500px',
        color: '#FFFFFF',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Report {targetType}</h2>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>Help us keep MoveMate safe and helpful</p>
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
            fontSize: '0.85rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Reason for Report *
            </label>
            <select
              className="form-control"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
            >
              <option value="SPAM">Spam or Unsolicited Promotion</option>
              <option value="HARASSMENT">Harassment or Offensive Behavior</option>
              <option value="MISINFORMATION">Scam or Misinformation</option>
              <option value="INAPPROPRIATE">Inappropriate Content</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              className="form-control"
              placeholder="Provide context for moderators..."
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
              {submitting ? <LoadingSpinner size="sm" label="Submitting..." /> : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
