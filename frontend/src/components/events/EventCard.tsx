import React from 'react';
import { EventDto } from '../../types/event';
import { Calendar, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: EventDto;
  onSelect?: (id: number) => void;
  onViewDetails?: (id: number) => void;
  onRsvpToggle?: (id: number, currentAttending: boolean) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onViewDetails,
  onRsvpToggle
}) => {
  const handleView = () => {
    if (onSelect) onSelect(event.id);
    else if (onViewDetails) onViewDetails(event.id);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        month: d.toLocaleString('default', { month: 'short' }).toUpperCase(),
        day: d.getDate(),
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    } catch {
      return { month: 'SEP', day: 15, time: '6:00 PM' };
    }
  };

  const { month, day, time } = formatDate(event.eventDate);
  const isFull = event.capacity ? event.attendeeCount >= event.capacity : false;

  return (
    <div className="card card-interactive" style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      borderRadius: 'var(--radius-xl, 1rem)',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Date Calendar Badge */}
        <div style={{
          backgroundColor: 'var(--color-accent-blue-light, #E0F2FE)',
          border: '1px solid #BAE6FD',
          borderRadius: 'var(--radius-lg, 0.75rem)',
          padding: '0.5rem 0.75rem',
          textAlign: 'center',
          minWidth: '54px',
          flexShrink: 0
        }}>
          <span style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 800, color: '#0284C7', letterSpacing: '0.05em' }}>
            {month}
          </span>
          <span style={{ display: 'block', fontSize: '1.35rem', fontWeight: 800, color: '#0369A1', lineHeight: 1.1 }}>
            {day}
          </span>
        </div>

        {/* Info Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
            <span className="badge badge-indigo">
              {event.communityName}
            </span>
            {event.status === 'CANCELLED' && (
              <span className="badge badge-red">
                CANCELLED
              </span>
            )}
          </div>

          <h3
            onClick={handleView}
            style={{
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--color-text-main)',
              margin: '0 0 0.35rem 0',
              cursor: 'pointer',
              lineHeight: 1.35,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {event.title}
          </h3>

          <p style={{
            fontSize: '0.8125rem',
            color: 'var(--color-text-muted)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            <MapPin size={13} color="#0D9488" />
            <span>{event.location}</span>
            <span>•</span>
            <Clock size={13} />
            <span>{time}</span>
          </p>
        </div>
      </div>

      {event.description && (
        <div style={{
          padding: '0 1.25rem 0.75rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-secondary)',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {event.description}
        </div>
      )}

      {/* Footer / RSVP Bar */}
      <div style={{
        padding: '0.75rem 1.25rem',
        backgroundColor: 'var(--color-bg-page)',
        borderTop: '1px solid var(--color-border-subtle)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto'
      }}>
        <div style={{ fontSize: '0.78125rem', color: 'var(--color-text-muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Users size={14} />
          <span><strong>{event.attendeeCount}</strong> {event.capacity ? `/ ${event.capacity}` : ''} Attending</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={handleView}
            className="btn btn-secondary btn-sm"
          >
            Details
          </button>

          {onRsvpToggle && event.status !== 'CANCELLED' && (
            <button
              onClick={() => onRsvpToggle(event.id, event.attending)}
              disabled={isFull && !event.attending}
              className={`btn btn-sm ${event.attending ? 'btn-secondary' : 'btn-accent'}`}
              style={{
                backgroundColor: event.attending ? 'var(--color-accent-emerald-light)' : undefined,
                color: event.attending ? '#065F46' : undefined,
                borderColor: event.attending ? '#6EE7B7' : undefined
              }}
            >
              {event.attending ? '✓ Attending' : isFull ? 'Event Full' : '+ RSVP'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
