import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { EventDto } from '../../types/event';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  Users,
  MessageSquare,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface EventDetailPageProps {
  eventId: number;
  onBack: () => void;
  onNavigateCommunity: (communityId: number) => void;
  onContactOrganizer: (creatorId: number) => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({
  eventId,
  onBack,
  onNavigateCommunity,
  onContactOrganizer
}) => {
  const [event, setEvent] = useState<EventDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getEventById(eventId);
      setEvent(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [eventId]);

  const handleRsvpToggle = async () => {
    if (!event) return;
    setActionLoading(true);
    try {
      if (event.attending) {
        const updated = await eventService.leaveEvent(event.id);
        setEvent(updated);
      } else {
        const updated = await eventService.rsvpEvent(event.id, 'ATTENDING');
        setEvent(updated);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update RSVP status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!event || !window.confirm('Are you sure you want to cancel this event? Attendees will be notified.')) return;
    setActionLoading(true);
    try {
      const updated = await eventService.cancelEvent(event.id);
      setEvent(updated);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel event');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading event details..." size="lg" />;
  if (error || !event) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
        <button onClick={onBack} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Events</span>
        </button>
        <div style={{ padding: '1.5rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius-lg)' }}>
          {error || 'Event content is no longer available.'}
        </div>
      </div>
    );
  }

  const isFull = event.capacity ? event.attendeeCount >= event.capacity : false;
  const eventDateObj = new Date(event.eventDate);

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back Button */}
      <div>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Events</span>
        </button>
      </div>

      {/* Main Event Box */}
      <div className="card" style={{ overflow: 'hidden' }}>
        {/* Banner Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0D9488 100%)',
          color: '#FFFFFF',
          padding: '2.5rem 2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <button
                onClick={() => onNavigateCommunity(event.communityId)}
                className="badge badge-teal"
                style={{
                  cursor: 'pointer',
                  border: 'none',
                  fontSize: '0.8125rem',
                  marginBottom: '0.75rem'
                }}
              >
                👥 {event.communityName}
              </button>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: 0, color: '#FFFFFF', lineHeight: 1.25 }}>
                {event.title}
              </h1>
            </div>

            {event.status === 'CANCELLED' && (
              <span className="badge badge-red" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                EVENT CANCELLED
              </span>
            )}
          </div>
        </div>

        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Key Details Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            backgroundColor: 'var(--color-bg-page)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={13} /> Date & Time
              </span>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {eventDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {eventDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={13} color="#0D9488" /> Venue Location
              </span>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {event.location}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.8125rem', color: 'var(--color-brand-accent)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.2rem' }}
              >
                <span>Google Maps</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Users size={13} /> Attendance
              </span>
              <p style={{ margin: '0.35rem 0 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                {event.attendeeCount} {event.capacity ? `/ ${event.capacity}` : ''} Attending
              </p>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: isFull ? '#EF4444' : 'var(--color-accent-emerald)', fontWeight: 600 }}>
                {isFull ? 'Event is Full' : 'Spots Available'}
              </p>
            </div>
          </div>

          {/* Organizer Info & Chat */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1.25rem',
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>EVENT HOST</span>
              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1rem', color: 'var(--color-text-main)', fontWeight: 700 }}>
                {event.creatorName}
              </h4>
            </div>

            <button
              onClick={() => onContactOrganizer(event.creatorId)}
              className="btn btn-secondary btn-sm"
            >
              <MessageSquare size={15} />
              <span>Contact Host</span>
            </button>
          </div>

          {/* Event Description */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem' }}>
              About This Event
            </h3>
            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>
              {event.description || 'No detailed description provided for this community event.'}
            </p>
          </div>

          {/* Action Bar */}
          {event.status !== 'CANCELLED' && (
            <div style={{
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              <button
                onClick={handleRsvpToggle}
                disabled={actionLoading || (isFull && !event.attending)}
                className={`btn btn-lg ${event.attending ? 'btn-secondary' : 'btn-accent'}`}
                style={{
                  flex: 1,
                  backgroundColor: event.attending ? 'var(--color-accent-emerald-light)' : undefined,
                  color: event.attending ? '#065F46' : undefined,
                  borderColor: event.attending ? '#6EE7B7' : undefined
                }}
              >
                {event.attending ? '✓ You Are Attending (Click to Cancel RSVP)' : isFull ? 'Event Fully Booked' : 'RSVP & Join Event'}
              </button>

              <button
                onClick={handleCancelEvent}
                className="btn btn-outline btn-sm"
                style={{ color: '#EF4444', borderColor: '#FCA5A5' }}
              >
                Cancel Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
