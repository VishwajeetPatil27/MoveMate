import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { communityService } from '../../services/communityService';
import { accommodationService } from '../../services/accommodationService';
import { localServiceService } from '../../services/localServiceService';
import { eventService } from '../../services/eventService';
import { CommunityDto } from '../../types/community';
import { AccommodationDto } from '../../types/accommodation';
import { RecommendationDto } from '../../types/localService';
import { EventDto } from '../../types/event';
import { CommunityCard } from '../community/CommunityCard';
import { AccommodationCard } from '../housing/AccommodationCard';
import { ServiceCard } from '../services/ServiceCard';
import { EventCard } from '../events/EventCard';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import {
  Users,
  Building2,
  MapPin,
  Calendar,
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Heart,
  Navigation
} from 'lucide-react';

interface HomeDashboardProps {
  onNavigateCommunities: () => void;
  onNavigateAccommodation: () => void;
  onNavigateServices: () => void;
  onNavigateEvents: () => void;
  onNavigateRelocation: () => void;
  onSelectCommunity: (community: CommunityDto) => void;
  onSelectAccommodation: (accommodation: AccommodationDto) => void;
  onSelectService: (service: RecommendationDto) => void;
  onSelectEvent: (eventId: number) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onNavigateCommunities,
  onNavigateAccommodation,
  onNavigateServices,
  onNavigateEvents,
  onNavigateRelocation,
  onSelectCommunity,
  onSelectAccommodation,
  onSelectService,
  onSelectEvent
}) => {
  const { user, isAuthenticated } = useAuth();

  const [communities, setCommunities] = useState<CommunityDto[]>([]);
  const [accommodations, setAccommodations] = useState<AccommodationDto[]>([]);
  const [services, setServices] = useState<RecommendationDto[]>([]);
  const [events, setEvents] = useState<EventDto[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHomeData();
  }, [isAuthenticated]);

  const loadHomeData = async () => {
    setLoading(true);
    try {
      const [commRes, accRes, srvRes, evtRes] = await Promise.allSettled([
        isAuthenticated ? communityService.getRecommendedCommunities() : communityService.searchCommunities(undefined, undefined, undefined, 0, 4),
        accommodationService.searchAccommodations({ page: 0, size: 4 }),
        localServiceService.searchServices({ page: 0, size: 4 }),
        eventService.searchEvents({ page: 0, size: 3 })
      ]);

      if (commRes.status === 'fulfilled' && commRes.value.success && commRes.value.data) {
        const commData = Array.isArray(commRes.value.data)
          ? commRes.value.data
          : (commRes.value.data as any).content || [];
        setCommunities(commData.slice(0, 4));
      }

      if (accRes.status === 'fulfilled' && accRes.value.success && accRes.value.data) {
        setAccommodations(accRes.value.data.content.slice(0, 4));
      }

      if (srvRes.status === 'fulfilled' && srvRes.value.success && srvRes.value.data) {
        setServices(srvRes.value.data.content.slice(0, 4));
      }

      if (evtRes.status === 'fulfilled' && evtRes.value && evtRes.value.content) {
        setEvents(evtRes.value.content.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Hero Welcome Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0F766E 100%)',
        color: '#FFFFFF',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        padding: '3rem 2.5rem',
        boxShadow: 'var(--shadow-lg)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle decorative circle */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '720px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            color: '#5EEAD4',
            fontSize: '0.8125rem',
            fontWeight: 600,
            marginBottom: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <Sparkles size={15} />
            <span>Community-Driven Relocation</span>
          </div>

          <h1 style={{
            color: '#FFFFFF',
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            marginBottom: '0.875rem'
          }}>
            {isAuthenticated && user?.fullName
              ? `Welcome to your new city, ${user.fullName.split(' ')[0]}!`
              : 'Welcome to your new community'}
          </h1>

          <p style={{
            color: '#E2E8F0',
            fontSize: '1.0625rem',
            lineHeight: 1.6,
            marginBottom: '2rem',
            maxWidth: '620px'
          }}>
            Discover people, places, and opportunities in your city. Connect with fellow relocators, find verified accommodations, and explore local services.
          </p>

          {/* Quick Actions Shortcuts */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={onNavigateCommunities}
              className="btn btn-accent btn-lg"
              style={{ boxShadow: '0 4px 14px rgba(13, 148, 136, 0.4)' }}
            >
              <Users size={18} />
              <span>Explore Communities</span>
            </button>
            <button
              onClick={onNavigateAccommodation}
              className="btn btn-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <Building2 size={18} />
              <span>Find Accommodation</span>
            </button>
            <button
              onClick={onNavigateServices}
              className="btn btn-lg"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <MapPin size={18} />
              <span>Local Services</span>
            </button>
          </div>
        </div>
      </section>

      {/* Quick Category Hub Highlights */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '1rem'
      }}>
        <div
          onClick={onNavigateCommunities}
          className="card card-interactive"
          style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#EDE9FE',
            color: '#6366F1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>Communities</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Regional & career groups</span>
          </div>
        </div>

        <div
          onClick={onNavigateAccommodation}
          className="card card-interactive"
          style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#E0F2FE',
            color: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>Accommodation</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Rooms, PGs & flatmates</span>
          </div>
        </div>

        <div
          onClick={onNavigateServices}
          className="card card-interactive"
          style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#CCFBF1',
            color: '#0D9488',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>Local Services</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Hospitals, transit & shops</span>
          </div>
        </div>

        <div
          onClick={onNavigateEvents}
          className="card card-interactive"
          style={{ padding: '1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Calendar size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>Events</h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>Weekend meetups & socials</span>
          </div>
        </div>
      </section>

      {/* Recommended Communities Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Recommended Communities
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
              Connect with fellow relocators and locals moving along your route
            </p>
          </div>
          <button
            onClick={onNavigateCommunities}
            className="btn btn-outline btn-sm"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <Skeleton height="180px" borderRadius="1rem" />
            <Skeleton height="180px" borderRadius="1rem" />
            <Skeleton height="180px" borderRadius="1rem" />
          </div>
        ) : communities.length === 0 ? (
          <EmptyState
            icon="👥"
            title="No Communities Yet"
            description="Be the first to create a community for your relocation destination!"
            actionText="+ Create Community"
            onAction={onNavigateCommunities}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {communities.map((comm) => (
              <CommunityCard
                key={comm.id}
                community={comm}
                onSelect={onSelectCommunity}
                onToggleJoin={loadHomeData}
              />
            ))}
          </div>
        )}
      </section>

      {/* Featured Accommodation Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Available Accommodation
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
              Single rooms, PGs, shared apartments, and flatmates in your destination city
            </p>
          </div>
          <button
            onClick={onNavigateAccommodation}
            className="btn btn-outline btn-sm"
          >
            <span>Browse All</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <Skeleton height="260px" borderRadius="1rem" />
            <Skeleton height="260px" borderRadius="1rem" />
            <Skeleton height="260px" borderRadius="1rem" />
            <Skeleton height="260px" borderRadius="1rem" />
          </div>
        ) : accommodations.length === 0 ? (
          <EmptyState
            icon="🏠"
            title="No Accommodation Listings Yet"
            description="Explore our accommodation marketplace or list your property."
            actionText="Find Accommodation"
            onAction={onNavigateAccommodation}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {accommodations.map((acc) => (
              <AccommodationCard
                key={acc.id}
                accommodation={acc}
                onSelect={onSelectAccommodation}
              />
            ))}
          </div>
        )}
      </section>

      {/* Nearby Local Services & Places */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Nearby Essential Services
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
              Hospitals, supermarkets, transit stations, and trusted local helpers
            </p>
          </div>
          <button
            onClick={onNavigateServices}
            className="btn btn-outline btn-sm"
          >
            <span>Explore Places</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <Skeleton height="160px" borderRadius="1rem" />
            <Skeleton height="160px" borderRadius="1rem" />
            <Skeleton height="160px" borderRadius="1rem" />
          </div>
        ) : services.length === 0 ? (
          <EmptyState
            icon="📍"
            title="No Local Services Listed Yet"
            description="Discover hospitals, transit stops, and markets around your location."
            actionText="Discover Services"
            onAction={onNavigateServices}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {services.map((srv) => (
              <ServiceCard
                key={srv.id}
                service={srv}
                onSelect={onSelectService}
              />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Community Events */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Upcoming Community Events
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
              Connect in person at weekend meetups, city walks, and interest clubs
            </p>
          </div>
          <button
            onClick={onNavigateEvents}
            className="btn btn-outline btn-sm"
          >
            <span>All Events</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            <Skeleton height="180px" borderRadius="1rem" />
            <Skeleton height="180px" borderRadius="1rem" />
          </div>
        ) : events.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No Upcoming Events"
            description="Check back soon or create the first community meetup in your city!"
            actionText="Browse Events"
            onAction={onNavigateEvents}
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {events.map((evt) => (
              <EventCard
                key={evt.id}
                event={evt}
                onSelect={(id) => onSelectEvent(id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Relocation Checklist Guide for Newcomers */}
      <section style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border-subtle, #E2E8F0)',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        padding: '2rem',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--color-brand-accent-light, #CCFBF1)',
            color: 'var(--color-brand-accent-hover, #0F766E)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Compass size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
              Newcomer's Relocation Checklist
            </h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Essential steps to settle smoothly into your destination
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-lg, 0.75rem)',
            backgroundColor: 'var(--color-bg-page, #F8FAFC)',
            border: '1px solid var(--color-border-subtle, #E2E8F0)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <CheckCircle2 size={16} color="#0D9488" />
              <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>1. Declare Move Intent</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
              Set your target date and monthly budget to get matched with flatmates and regional hometown circles.
            </p>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-lg, 0.75rem)',
            backgroundColor: 'var(--color-bg-page, #F8FAFC)',
            border: '1px solid var(--color-border-subtle, #E2E8F0)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <CheckCircle2 size={16} color="#0D9488" />
              <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>2. Secure Housing</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
              Filter single rooms, PGs, and shared flats with verified distance to transit hubs and essential stores.
            </p>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-lg, 0.75rem)',
            backgroundColor: 'var(--color-bg-page, #F8FAFC)',
            border: '1px solid var(--color-border-subtle, #E2E8F0)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <CheckCircle2 size={16} color="#0D9488" />
              <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>3. Map Local Essentials</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
              Bookmark 24/7 pharmacies, nearby hospitals, metro stations, and local groceries within walking distance.
            </p>
          </div>

          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-lg, 0.75rem)',
            backgroundColor: 'var(--color-bg-page, #F8FAFC)',
            border: '1px solid var(--color-border-subtle, #E2E8F0)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <CheckCircle2 size={16} color="#0D9488" />
              <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>4. Attend Meetups</strong>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
              RSVP to community weekend chai mixers and city discovery walks to meet fellow relocators early.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
