import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { EventDto } from '../../types/event';
import { EventCard } from './EventCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';

interface MyEventsPageProps {
  onViewEventDetails: (id: number) => void;
  onBackToDiscovery: () => void;
}

export const MyEventsPage: React.FC<MyEventsPageProps> = ({
  onViewEventDetails,
  onBackToDiscovery
}) => {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await eventService.getUserEvents(0, 30);
      setEvents(page.content);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load your joined events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleRsvpToggle = async (eventId: number, currentAttending: boolean) => {
    try {
      if (currentAttending) {
        await eventService.leaveEvent(eventId);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } else {
        const updated = await eventService.rsvpEvent(eventId, 'ATTENDING');
        setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update RSVP status');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-brand-primary)', margin: 0 }}>
            🎟️ My Joined Events & RSVPs
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
            Manage upcoming meetups, workshops, and community events you are attending.
          </p>
        </div>

        <button
          onClick={onBackToDiscovery}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#F1F5F9',
            border: '1px solid #CBD5E1',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          ← Explore All Events
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div style={{ padding: '1rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: '0.5rem' }}>
          {error}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          title="No joined events yet"
          description="Browse community events and click '+ Join Event' to confirm your RSVP for upcoming meetups."
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onViewDetails={onViewEventDetails}
              onRsvpToggle={handleRsvpToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
