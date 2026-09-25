import React, { useState } from 'react';
import { eventService } from '../../services/eventService';
import { CreateEventRequest } from '../../types/event';

interface CreateEventModalProps {
  communityId?: number;
  onClose: () => void;
  onSuccess: (newEventId: number) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  communityId,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CreateEventRequest>({
    communityId: communityId || 1,
    title: '',
    description: '',
    location: '',
    eventDate: '',
    capacity: 50
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.eventDate) {
      setError('Please fill in title, location, and event date.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const created = await eventService.createEvent(formData);
      onSuccess(created.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create community event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '0.75rem',
        width: '100%',
        maxWidth: '550px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        border: '1px solid #E2E8F0'
      }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#F8FAFC'
        }}>
          <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-brand-primary)' }}>
            📅 Create Community Event
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.25rem' }}>
              Target Community ID *
            </label>
            <input
              type="number"
              value={formData.communityId}
              onChange={(e) => setFormData({ ...formData, communityId: parseInt(e.target.value) || 1 })}
              required
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.25rem' }}>
              Event Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Pune Weekend Flat Hunting & Chai Meetup"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.875rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.25rem' }}>
                Date & Time *
              </label>
              <input
                type="datetime-local"
                value={formData.eventDate}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                required
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.25rem' }}>
                Capacity (Seats)
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 50 })}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.25rem' }}>
              Location Address / Venue *
            </label>
            <input
              type="text"
              placeholder="e.g. Cafe Goodluck, FC Road, Pune"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.875rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-dark)', marginBottom: '0.25rem' }}>
              Event Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe the meetup agenda, contact rules, or what attendees should bring..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '0.6rem', border: '1px solid #CBD5E1', borderRadius: '0.375rem', fontSize: '0.875rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.6rem 1.25rem', backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ padding: '0.6rem 1.25rem', backgroundColor: 'var(--color-brand-primary)', color: '#FFFFFF', border: 'none', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
            >
              {loading ? 'Publishing...' : 'Publish Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
