import React, { useState, useEffect } from 'react';
import { ConversationDto, MessageDto } from '../../types/chat';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { ConversationList } from './ConversationList';
import { ChatWindow } from './ChatWindow';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { MessageSquare, AlertCircle } from 'lucide-react';

interface MessagesPageProps {
  initialConversationId?: number | null;
}

export const MessagesPage: React.FC<MessagesPageProps> = ({ initialConversationId }) => {
  const { isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [activeId, setActiveId] = useState<number | null>(initialConversationId || null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (activeId) {
      loadMessages(activeId);
      markRead(activeId);
    }
  }, [activeId]);

  // Periodic poll interval for live chat updates
  useEffect(() => {
    if (!activeId || !isAuthenticated) return;
    const interval = setInterval(() => {
      fetchMessagesSilently(activeId);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeId, isAuthenticated]);

  const loadConversations = async () => {
    try {
      setLoadingConvs(true);
      setError(null);
      const res = await chatService.getUserConversations();
      if (res.success && res.data) {
        setConversations(res.data);
        if (!activeId && res.data.length > 0 && window.innerWidth >= 768) {
          setActiveId(res.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations', err);
      setError('Failed to load conversations.');
    } finally {
      setLoadingConvs(false);
    }
  };

  const loadMessages = async (convId: number) => {
    try {
      setLoadingMsgs(true);
      const res = await chatService.getConversationMessages(convId, 0, 50);
      if (res.success && res.data) {
        setMessages([...res.data.content].reverse());
      }
    } catch (err) {
      console.error('Failed to load messages', err);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const fetchMessagesSilently = async (convId: number) => {
    try {
      const res = await chatService.getConversationMessages(convId, 0, 50);
      if (res.success && res.data) {
        setMessages([...res.data.content].reverse());
      }
    } catch {
      // Ignore background poll errors
    }
  };

  const markRead = async (convId: number) => {
    try {
      await chatService.markAsRead(convId);
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, unreadCount: 0 } : c));
    } catch (err) {
      console.error('Failed to mark read', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeId) return;
    try {
      const res = await chatService.sendMessage(activeId, text);
      if (res.success && res.data) {
        const newMsg = res.data;
        setMessages(prev => [...prev, newMsg]);

        // Update last message in conversation list
        setConversations(prev => prev.map(c => {
          if (c.id === activeId) {
            return {
              ...c,
              lastMessage: newMsg.message,
              lastMessageTime: newMsg.createdAt
            };
          }
          return c;
        }));
      }
    } catch (err: any) {
      console.error('Send message error', err);
      alert(err.response?.data?.message || 'Failed to send message.');
    }
  };

  if (!isAuthenticated) {
    return (
      <EmptyState
        icon="💬"
        title="Sign In Required"
        description="Please sign in to access your direct messages and community conversations."
      />
    );
  }

  const activeConv = conversations.find(c => c.id === activeId) || null;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      height: 'calc(100vh - 150px)',
      minHeight: '560px',
      borderRadius: 'var(--radius-xl, 1rem)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow-md)',
      display: 'flex',
      backgroundColor: '#FFFFFF',
      border: '1px solid var(--color-border-subtle, #E2E8F0)'
    }}>
      {/* Left Conversation List Sidebar - hidden on mobile when conversation is active */}
      <div
        className={`messages-sidebar ${activeId ? 'messages-sidebar-hidden-mobile' : ''}`}
        style={{
          width: '340px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid var(--color-border-subtle)'
        }}
      >
        {loadingConvs ? (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Skeleton height="40px" borderRadius="0.5rem" />
            <Skeleton height="60px" borderRadius="0.5rem" />
            <Skeleton height="60px" borderRadius="0.5rem" />
            <Skeleton height="60px" borderRadius="0.5rem" />
          </div>
        ) : (
          <ConversationList
            conversations={conversations}
            activeConversationId={activeId}
            onSelectConversation={(id) => setActiveId(id)}
          />
        )}
      </div>

      {/* Right Chat Window Area - full screen on mobile when conversation is active */}
      <div
        className={`messages-content ${!activeId ? 'messages-content-hidden-mobile' : ''}`}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        <ChatWindow
          conversation={activeConv}
          messages={messages}
          loading={loadingMsgs}
          onSendMessage={handleSendMessage}
          onBackMobile={() => setActiveId(null)}
        />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .messages-sidebar-hidden-mobile {
            display: none !important;
          }
          .messages-content-hidden-mobile {
            display: none !important;
          }
          .messages-sidebar {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};
