import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { NotificationDto } from '../../types/notification';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import { Bell, CheckCheck, Trash2, ArrowRight } from 'lucide-react';

interface NotificationsPageProps {
  onNavigateTarget?: (type: string, referenceId?: number) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigateTarget }) => {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const page = await notificationService.getNotifications(0, 50);
      setNotifications(page.content);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch {
      // Ignore
    }
  };

  const handleMarkSingleRead = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch {
      // Ignore
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch {
      // Ignore
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

  const formatTimestamp = (tsString: string) => {
    try {
      const date = new Date(tsString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return tsString;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid var(--color-border-subtle)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 800 }}>
            Notifications Center
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '0.25rem 0 0' }}>
            Alerts on community posts, housing inquiries, direct messages, and events.
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="btn btn-secondary btn-sm"
          >
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading notifications..." size="lg" />
      ) : error ? (
        <div style={{ padding: '1rem', backgroundColor: '#FEE2E2', color: '#991B1B', borderRadius: 'var(--radius-lg)' }}>
          {error}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="🔔"
          title="No notifications yet"
          description="When members comment on your posts, send direct messages, or publish community events, alerts will appear here."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => onNavigateTarget && onNavigateTarget(notif.type, notif.referenceId)}
              className="card card-interactive"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                padding: '1rem 1.25rem',
                backgroundColor: notif.read ? '#FFFFFF' : 'var(--color-accent-blue-light)',
                borderColor: notif.read ? 'var(--color-border-subtle)' : '#BAE6FD',
                cursor: 'pointer'
              }}
            >
              <div style={{
                fontSize: '1.25rem',
                padding: '0.5rem',
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xs)'
              }}>
                {getIconForType(notif.type)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
                  <h4 style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    fontWeight: notif.read ? 600 : 700,
                    color: 'var(--color-text-main)'
                  }}>
                    {notif.title}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                    {formatTimestamp(notif.createdAt)}
                  </span>
                </div>

                <p style={{
                  margin: '0.25rem 0 0',
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.45
                }}>
                  {notif.message}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                {!notif.read && (
                  <button
                    onClick={(e) => handleMarkSingleRead(notif.id, e)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', color: 'var(--color-brand-accent)', padding: '0.25rem 0.5rem' }}
                  >
                    Mark Read
                  </button>
                )}
                <button
                  onClick={(e) => handleDelete(notif.id, e)}
                  title="Delete notification"
                  className="btn btn-ghost btn-sm"
                  style={{ color: 'var(--color-text-light)', padding: '0.35rem' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
