import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/eventService';
import { EventDto } from '../../types/event';
import { EventCard } from './EventCard';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Search, Plus, MapPin, Ticket } from 'lucide-react';

interface EventsDiscoveryPageProps {
  onViewEventDetails: (id: number) => void;
  onCreateEvent: () => void;
  onViewMyEvents: () => void;
}

export const EventsDiscoveryPage: React.FC<EventsDiscoveryPageProps> = ({
  onViewEventDetails,
  onCreateEvent,
  onViewMyEvents
}) => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await eventService.searchEvents({
        search: searchQuery || undefined,
        city: selectedCity || undefined,
        page: 0,
        size: 20
      });
      setEvents(page.content);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load community events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedCity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents();
  };

  const handleRsvpToggle = async (eventId: number, currentAttending: boolean) => {
    if (!isAuthenticated) {
      alert('Please sign in to RSVP for events.');
      return;
    }
    try {
      if (currentAttending) {
        const updated = await eventService.leaveEvent(eventId);
        setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
      } else {
        const updated = await eventService.rsvpEvent(eventId, 'ATTENDING');
        setEvents(prev => prev.map(e => e.id === eventId ? updated : e));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update RSVP status');
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #D97706 120%)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '650px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            color: '#FDE68A',
            fontSize: '0.75rem',
            fontWeight: 700,
            marginBottom: '0.75rem'
          }}>
            <Calendar size={14} />
            <span>Community Events & Mixers</span>
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#FFFFFF', margin: '0 0 0.5rem 0', lineHeight: 1.2 }}>
            Discover Events Near You
          </h1>
          <p style={{ fontSize: '1rem', color: '#E2E8F0', margin: 0, lineHeight: 1.5 }}>
            Weekend meetups, social chai sessions, city discovery walks, and career networking in your new city.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isAuthenticated && (
            <>
              <button
                onClick={onViewMyEvents}
                className="btn btn-secondary"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Ticket size={15} />
                <span>My Events</span>
              </button>
              <button
                onClick={onCreateEvent}
                className="btn btn-accent"
              >
                <Plus size={16} />
                <span>Create Event</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <form onSubmit={handleSearchSubmit} className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search events by title, description, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
            style={{ paddingLeft: '2.25rem' }}
          />
          <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="form-control"
          style={{ width: '180px' }}
        >
          <option value="">All Cities</option>
          <option value="Pune">Pune</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Sangli">Sangli</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Hyderabad">Hyderabad</option>
        </select>

        <button type="submit" className="btn btn-accent">
          <span>Search</span>
        </button>
      </form>

      {/* Events Stream */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <Skeleton height="180px" borderRadius="1rem" />
          <Skeleton height="180px" borderRadius="1rem" />
          <Skeleton height="180px" borderRadius="1rem" />
        </div>
      ) : error ? (
        <div style={{ padding: '1.25rem', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 'var(--radius-lg)', color: '#991B1B' }}>
          {error}
        </div>
      ) : events.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No events found"
          description="Try modifying your search or check back soon for upcoming community meetups."
          actionText={isAuthenticated ? "+ Create First Event" : undefined}
          onAction={isAuthenticated ? onCreateEvent : undefined}
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {events.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onViewDetails={onViewEventDetails}
              onRsvpToggle={handleRsvpToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
