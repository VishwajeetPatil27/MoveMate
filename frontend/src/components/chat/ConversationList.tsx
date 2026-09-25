import React, { useState } from 'react';
import { ConversationDto } from '../../types/chat';
import { Search, MessageSquare, User } from 'lucide-react';

interface ConversationListProps {
  conversations: ConversationDto[];
  activeConversationId: number | null;
  onSelectConversation: (id: number) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation
}) => {
  const [search, setSearch] = useState('');

  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diffSec < 60) return 'now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
      return `${Math.floor(diffSec / 86400)}d`;
    } catch {
      return '';
    }
  };

  const filtered = conversations.filter(c => {
    const name = c.participantName || '';
    return name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFFFFF' }}>
      {/* Header & Search */}
      <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.85rem 0', color: 'var(--color-text-main)' }}>
          Direct Messages
        </h2>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ borderRadius: 'var(--radius-lg)', fontSize: '0.8125rem', paddingLeft: '2.25rem', backgroundColor: 'var(--color-bg-page)' }}
          />
          <Search size={15} color="#94A3B8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      {/* Conversations List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            {conversations.length === 0 ? 'No conversations yet. Message a community member or accommodation provider to chat.' : 'No matching conversations.'}
          </div>
        ) : (
          filtered.map(c => {
            const isActive = c.id === activeConversationId;
            return (
              <div
                key={c.id}
                onClick={() => onSelectConversation(c.id)}
                style={{
                  padding: '1rem 1.25rem',
                  borderBottom: '1px solid var(--color-surface-subtle)',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--color-brand-accent-light)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--color-brand-accent)' : '4px solid transparent',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  flexShrink: 0
                }}>
                  {(c.participantName || 'C').charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                    <strong style={{ fontSize: '0.875rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.participantName || 'Conversation'}
                    </strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                      {formatRelativeTime(c.lastMessageTime)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{
                      margin: 0,
                      fontSize: '0.8125rem',
                      color: c.unreadCount > 0 ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                      fontWeight: c.unreadCount > 0 ? 700 : 400,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '180px'
                    }}>
                      {c.lastMessage || 'Start conversation...'}
                    </p>

                    {c.unreadCount > 0 && (
                      <span style={{
                        backgroundColor: '#EF4444',
                        color: '#FFFFFF',
                        borderRadius: '9999px',
                        padding: '0.1rem 0.45rem',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        lineHeight: 1
                      }}>
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
