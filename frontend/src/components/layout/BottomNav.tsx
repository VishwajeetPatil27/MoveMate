import React from 'react';
import { Home, Users, Building2, MapPin, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface BottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  unreadMessagesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  unreadMessagesCount = 0
}) => {
  const { isAuthenticated } = useAuth();

  const isViewActive = (views: string[]) => {
    return views.includes(currentView);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: <Home size={20} />,
      activeViews: ['home']
    },
    {
      id: 'communities',
      label: 'Communities',
      icon: <Users size={20} />,
      activeViews: ['communities', 'community-detail', 'my-communities']
    },
    {
      id: 'accommodation',
      label: 'Housing',
      icon: <Building2 size={20} />,
      activeViews: ['accommodation', 'accommodation-detail', 'my-accommodations', 'saved-accommodations']
    },
    {
      id: 'services',
      label: 'Services',
      icon: <MapPin size={20} />,
      activeViews: ['services', 'service-detail', 'saved-services']
    },
    {
      id: isAuthenticated ? 'messages' : 'login',
      label: 'Chat',
      icon: <MessageSquare size={20} />,
      activeViews: ['messages'],
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined
    }
  ];

  return (
    <nav className="mobile-bottom-nav" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--color-border-subtle, #E2E8F0)',
      display: 'none',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
    }}>
      {navItems.map((item) => {
        const active = isViewActive(item.activeViews);
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              height: '100%',
              color: active ? 'var(--color-brand-accent, #0D9488)' : 'var(--color-text-muted, #64748B)',
              cursor: 'pointer',
              position: 'relative',
              padding: '4px 0'
            }}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.icon}
              {item.badge ? (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  borderRadius: '9999px',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.35rem',
                  lineHeight: 1
                }}>
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span style={{ fontSize: '0.6875rem', fontWeight: active ? 700 : 500, marginTop: '2px' }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
