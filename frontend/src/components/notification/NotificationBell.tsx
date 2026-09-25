import React, { useState, useEffect, useRef } from 'react';
import { notificationService } from '../../services/notificationService';
import { NotificationDto } from '../../types/notification';
import { Bell, Check, ArrowRight } from 'lucide-react';

interface NotificationBellProps {
  onNavigateNotifications: () => void;
  onNavigateTarget?: (type: string, referenceId?: number) => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({
  onNavigateNotifications,
  onNavigateTarget
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUnread = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch {
      // Ignore background fetch error
    }
  };

  const fetchRecentNotifications = async () => {
    try {
      const page = await notificationService.getNotifications(0, 5);
      setNotifications(page.content);
    } catch {
      // Ignore background fetch error
    }
  };

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchRecentNotifications();
      fetchUnread();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch {
      // Handle error
    }
  };

  const handleItemClick = (notif: NotificationDto) => {
    setIsOpen(false);
    if (!notif.read) {
      notificationService.markAsRead(notif.id).catch(() => {});
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    if (onNavigateTarget) {
      onNavigateTarget(notif.type, notif.referenceId);
    } else {
      onNavigateNotifications();
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'POST_LIKED': return '❤️';
      case 'POST_COMMENTED':
      case 'COMMENT_REPLIED': return '💬';
      case 'NEW_MESSAGE': return '✉️';
      case 'EVENT_CREATED':
      case 'EVENT_UPDATED': return '📅';
      case 'EVENT_CANCELLED': return '⚠️';
      case 'ACCOMMODATION_MESSAGE': return '🏡';
      default: return '🔔';
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={toggleDropdown}
        title="Notifications"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.45rem',
          borderRadius: '50%',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-text-secondary)',
          transition: 'background-color 0.15s ease'
        }}
        aria-label="View notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            backgroundColor: '#EF4444',
            color: '#FFFFFF',
            fontSize: '0.65rem',
            fontWeight: 700,
            borderRadius: '9999px',
            padding: '0.1rem 0.35rem',
            minWidth: '1rem',
            textAlign: 'center',
            lineHeight: 1
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 'calc(100% + 8px)',
          width: '320px',
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-xl, 1rem)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--color-border-subtle)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--color-bg-page)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--color-text-main)' }}>
              Notifications
            </span>
            <button
              onClick={() => { setIsOpen(false); onNavigateNotifications(); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-brand-accent)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem'
              }}
            >
              <span>View All</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                No recent notifications
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => handleItemClick(notif)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderBottom: '1px solid var(--color-surface-subtle)',
                    backgroundColor: notif.read ? '#FFFFFF' : 'var(--color-accent-blue-light)',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                    transition: 'background-color 0.15s'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{getIconForType(notif.type)}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '0.8125rem',
                      fontWeight: notif.read ? 500 : 700,
                      color: 'var(--color-text-main)',
                      lineHeight: 1.3
                    }}>
                      {notif.title}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-text-muted)',
                      marginTop: '0.15rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {notif.message}
                    </div>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={(e) => handleMarkRead(notif.id, e)}
                      title="Mark as read"
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-brand-accent)',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        marginTop: '0.35rem',
                        flexShrink: 0
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
