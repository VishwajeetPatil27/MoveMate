import React, { useEffect, useState } from 'react';
import { Sparkles, Calendar, Compass, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { communityService } from '../../services/communityService';
import { eventService } from '../../services/eventService';
import { CommunityDto } from '../../types/community';
import { EventDto } from '../../types/event';

export interface RightSidebarProps {
  onNavigateCommunities: () => void;
  onNavigateEvents: () => void;
  onSelectCommunity?: (community: CommunityDto) => void;
  onSelectEvent?: (eventId: number) => void;
  onNavigateRelocation?: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  onNavigateCommunities,
  onNavigateEvents,
  onSelectCommunity,
  onSelectEvent,
  onNavigateRelocation
}) => {
  const [suggestedCommunities, setSuggestedCommunities] = useState<CommunityDto[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventDto[]>([]);

  useEffect(() => {
    communityService.searchCommunities(undefined, undefined, undefined, 0, 3)
      .then(res => {
        if (res.success && res.data) {
          setSuggestedCommunities(res.data.content.slice(0, 3));
        }
      })
      .catch(() => {});

    eventService.searchEvents({ page: 0, size: 2 })
      .then(res => {
        if (res && res.content) {
          setUpcomingEvents(res.content.slice(0, 2));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <aside style={{
      width: '290px',
      flexShrink: 0,
      padding: '1.25rem 0.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      alignSelf: 'flex-start'
    }}>
      {/* Relocation Quick Checklist / Tip */}
      <div style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-xl, 1rem)',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)',
        color: '#FFFFFF',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={18} color="#2DD4BF" />
          <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
            Relocating Soon?
          </h4>
        </div>
        <p style={{ fontSize: '0.8125rem', color: '#CBD5E1', lineHeight: 1.45, margin: '0 0 1rem 0' }}>
          Declare your origin & destination city to receive tailored housing recommendations and regional community invites.
        </p>
        <button
          onClick={onNavigateRelocation}
          className="btn btn-accent btn-sm"
          style={{ width: '100%', fontSize: '0.8125rem' }}
        >
          <span>Declare Relocation</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Suggested Communities */}
      <div style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-xl, 1rem)',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border-subtle, #E2E8F0)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main, #0F172A)', margin: 0 }}>
            Suggested Groups
          </h4>
          <button
            onClick={onNavigateCommunities}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-brand-accent, #0D9488)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Explore
          </button>
        </div>

        {suggestedCommunities.length === 0 ? (
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted, #64748B)' }}>
            No community suggestions yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {suggestedCommunities.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectCommunity && onSelectCommunity(c)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.4rem 0.5rem',
                  borderRadius: 'var(--radius-md, 0.5rem)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-subtle, #F1F5F9)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--color-brand-accent-light, #CCFBF1)',
                  color: 'var(--color-brand-accent-hover, #0F766E)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8125rem',
                  flexShrink: 0
                }}>
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: 'var(--color-text-main, #0F172A)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted, #64748B)' }}>
                    {c.memberCount} members
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Events Mini Widget */}
      <div style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-xl, 1rem)',
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--color-border-subtle, #E2E8F0)',
        boxShadow: 'var(--shadow-xs)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main, #0F172A)', margin: 0 }}>
            Upcoming Meetups
          </h4>
          <button
            onClick={onNavigateEvents}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-brand-accent, #0D9488)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0
            }}
          >
            All Events
          </button>
        </div>

        {upcomingEvents.length === 0 ? (
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted, #64748B)' }}>
            No upcoming events posted yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent && onSelectEvent(evt.id)}
                style={{
                  padding: '0.5rem',
                  borderRadius: 'var(--radius-md, 0.5rem)',
                  cursor: 'pointer',
                  border: '1px solid var(--color-border-subtle, #E2E8F0)',
                  backgroundColor: 'var(--color-bg-page, #F8FAFC)'
                }}
              >
                <div style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--color-text-main, #0F172A)',
                  marginBottom: '0.2rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {evt.title}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--color-text-muted, #64748B)' }}>
                  <Calendar size={12} />
                  <span>{new Date(evt.eventDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  <span>•</span>
                  <span>{evt.location || 'Local'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MoveMate Safety & Verification Trust Badge */}
      <div style={{
        padding: '0.875rem 1rem',
        borderRadius: 'var(--radius-lg, 0.75rem)',
        backgroundColor: 'var(--color-surface-subtle, #F1F5F9)',
        border: '1px solid var(--color-border-subtle, #E2E8F0)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <ShieldCheck size={24} color="#0D9488" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #64748B)', lineHeight: 1.35 }}>
          <strong style={{ color: 'var(--color-text-main, #0F172A)', display: 'block' }}>Verified Platform</strong>
          Listings and community organizers undergo community moderation.
        </div>
      </div>
    </aside>
  );
};
