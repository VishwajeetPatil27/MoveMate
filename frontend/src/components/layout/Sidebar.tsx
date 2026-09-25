import React from 'react';
import {
  Home,
  Users,
  Building2,
  MapPin,
  Calendar,
  MessageSquare,
  Bookmark,
  Compass,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  unreadMessagesCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  unreadMessagesCount = 0
}) => {
  const { user, isAuthenticated } = useAuth();

  const isViewActive = (views: string[]) => {
    return views.includes(currentView);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={19} />,
      activeViews: ['home']
    },
    {
      id: 'communities',
      label: 'Communities',
      icon: <Users size={19} />,
      activeViews: ['communities', 'community-detail', 'my-communities']
    },
    {
      id: 'accommodation',
      label: 'Accommodation',
      icon: <Building2 size={19} />,
      activeViews: ['accommodation', 'accommodation-detail', 'my-accommodations', 'saved-accommodations']
    },
    {
      id: 'services',
      label: 'Local Services',
      icon: <MapPin size={19} />,
      activeViews: ['services', 'service-detail', 'saved-services']
    },
    {
      id: 'events',
      label: 'Events & Meetups',
      icon: <Calendar size={19} />,
      activeViews: ['events', 'event-detail', 'my-events']
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: <MessageSquare size={19} />,
      activeViews: ['messages'],
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      authRequired: true
    },
    {
      id: 'saved-accommodations',
      label: 'Saved Items',
      icon: <Bookmark size={19} />,
      activeViews: ['saved-accommodations', 'saved-services'],
      authRequired: true
    },
    {
      id: 'relocation',
      label: 'Relocation Plans',
      icon: <Compass size={19} />,
      activeViews: ['relocation'],
      authRequired: true
    }
  ];

  return (
    <aside style={{
      width: '240px',
      flexShrink: 0,
      padding: '1.25rem 0.75rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
      background: '#FFFFFF',
      borderRight: '1px solid var(--color-border-subtle, #E2E8F0)',
      minHeight: 'calc(100vh - 65px)',
      position: 'sticky',
      top: '65px',
      alignSelf: 'flex-start'
    }}>
      <div style={{
        padding: '0.25rem 0.75rem 0.75rem 0.75rem',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--color-text-light, #94A3B8)'
      }}>
        Navigation
      </div>

      {navItems.map((item) => {
        if (item.authRequired && !isAuthenticated) return null;
        const active = isViewActive(item.activeViews);

        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-lg, 0.75rem)',
              border: 'none',
              backgroundColor: active ? 'var(--color-brand-accent-light, #CCFBF1)' : 'transparent',
              color: active ? 'var(--color-brand-accent-hover, #0F766E)' : 'var(--color-text-secondary, #334155)',
              fontWeight: active ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all var(--transition-fast, 150ms ease)'
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'var(--color-surface-subtle, #F1F5F9)';
                e.currentTarget.style.color = 'var(--color-text-main, #0F172A)';
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-secondary, #334155)';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                color: active ? 'var(--color-brand-accent, #0D9488)' : 'var(--color-text-muted, #64748B)',
                display: 'flex',
                alignItems: 'center'
              }}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </div>

            {item.badge ? (
              <span style={{
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.125rem 0.5rem',
                lineHeight: 1
              }}>
                {item.badge}
              </span>
            ) : null}
          </button>
        );
      })}

      {/* Admin Panel Link if Admin */}
      {user?.role === 'ADMIN' && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle, #E2E8F0)' }}>
          <div style={{
            padding: '0 0.75rem 0.5rem 0.75rem',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: '#DC2626'
          }}>
            Administration
          </div>
          <button
            onClick={() => onNavigate('admin')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              width: '100%',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-lg, 0.75rem)',
              border: 'none',
              backgroundColor: currentView.startsWith('admin') ? '#FEE2E2' : 'transparent',
              color: currentView.startsWith('admin') ? '#991B1B' : '#B91C1C',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <ShieldCheck size={19} />
            <span>Admin Center</span>
          </button>
        </div>
      )}

      {/* User Status / Quick Profile summary at sidebar bottom */}
      {isAuthenticated && user && (
        <div style={{
          marginTop: 'auto',
          padding: '0.875rem',
          borderRadius: 'var(--radius-lg, 0.75rem)',
          backgroundColor: 'var(--color-surface-subtle, #F1F5F9)',
          border: '1px solid var(--color-border-subtle, #E2E8F0)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-brand-primary, #0F172A)',
              color: 'var(--color-brand-accent-light, #CCFBF1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.875rem'
            }}>
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
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
                {user.fullName}
              </div>
              <div style={{
                fontSize: '0.72rem',
                color: 'var(--color-text-muted, #64748B)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} />
                Online
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
