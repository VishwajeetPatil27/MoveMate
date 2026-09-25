import React, { useEffect, useRef } from 'react';
import { ConversationDto, MessageDto } from '../../types/chat';
import { MessageComposer } from './MessageComposer';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ArrowLeft, MessageSquare, ShieldCheck, User } from 'lucide-react';

interface ChatWindowProps {
  conversation: ConversationDto | null;
  messages: MessageDto[];
  loading: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onBackMobile?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  loading,
  onSendMessage,
  onBackMobile
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!conversation) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
        color: 'var(--color-text-muted)',
        backgroundColor: 'var(--color-bg-page)'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
          color: 'var(--color-brand-accent)'
        }}>
          <MessageSquare size={28} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.35rem' }}>
          Select a Conversation
        </h3>
        <p style={{ fontSize: '0.875rem', maxWidth: '360px', textAlign: 'center', margin: 0 }}>
          Choose a conversation from the sidebar or click "Message" on any community profile or housing listing.
        </p>
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFFFFF' }}>
      {/* Active Conversation Header */}
      <div style={{
        padding: '0.875rem 1.25rem',
        borderBottom: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {onBackMobile && (
            <button
              onClick={onBackMobile}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.35rem' }}
              aria-label="Back to conversations list"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.95rem'
          }}>
            {(conversation.participantName || 'C').charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>
              {conversation.participantName || 'Direct Conversation'}
            </h3>
            {conversation.participantProfession ? (
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {conversation.participantProfession}
              </span>
            ) : (
              <span style={{ fontSize: '0.72rem', color: 'var(--color-brand-accent)', fontWeight: 600 }}>
                MoveMate Member
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{
            display: 'inline-block',
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10B981'
          }} />
          <span style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>Connected</span>
        </div>
      </div>

      {/* Messages Stream */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          padding: '1.25rem',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          backgroundColor: 'var(--color-bg-page, #F8FAFC)'
        }}
      >
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <LoadingSpinner size="md" label="Loading messages..." />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--color-text-muted)' }}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>No messages in this conversation yet.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>Send a message below to start chatting!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.isMine ? 'flex-end' : 'flex-start',
                maxWidth: '75%',
                alignSelf: msg.isMine ? 'flex-end' : 'flex-start'
              }}
            >
              {!msg.isMine && (
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginBottom: '0.2rem', paddingLeft: '0.25rem', fontWeight: 500 }}>
                  {msg.senderName}
                </span>
              )}
              <div
                style={{
                  padding: '0.625rem 0.9375rem',
                  borderRadius: msg.isMine ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  backgroundColor: msg.isMine ? 'var(--color-brand-accent, #0D9488)' : '#FFFFFF',
                  color: msg.isMine ? '#FFFFFF' : 'var(--color-text-main, #0F172A)',
                  boxShadow: 'var(--shadow-xs)',
                  border: msg.isMine ? 'none' : '1px solid var(--color-border-subtle)',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line'
                }}
              >
                {msg.message}
              </div>
              <span style={{ fontSize: '0.65rem', color: 'var(--color-text-light)', marginTop: '0.2rem', padding: '0 0.25rem' }}>
                {formatTime(msg.createdAt)}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer Composer */}
      <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--color-border-subtle)', backgroundColor: '#FFFFFF' }}>
        <MessageComposer onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};
