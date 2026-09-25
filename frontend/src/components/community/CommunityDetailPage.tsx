import React, { useState, useEffect } from 'react';
import { CommunityDto, CommunityMemberDto } from '../../types/community';
import { PostDto, PostType } from '../../types/post';
import { communityService } from '../../services/communityService';
import { postService } from '../../services/postService';
import { eventService } from '../../services/eventService';
import { EventDto } from '../../types/event';
import { useAuth } from '../../context/AuthContext';
import { EditCommunityModal } from './EditCommunityModal';
import { PostCard } from './PostCard';
import { PostComposerModal } from './PostComposerModal';
import { EditPostModal } from './EditPostModal';
import { ReportModal } from './ReportModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { EmptyState } from '../ui/EmptyState';
import {
  ArrowLeft,
  Users,
  MapPin,
  Calendar,
  MessageSquare,
  ShieldCheck,
  Plus,
  Settings,
  Check,
  Send
} from 'lucide-react';

interface CommunityDetailPageProps {
  communityIdOrSlug: string | number;
  onBack: () => void;
  onOpenDirectChat?: (recipientId: number) => void;
  onNavigateEventDetails?: (eventId: number) => void;
  onCreateEventForCommunity?: (communityId: number) => void;
}

export const CommunityDetailPage: React.FC<CommunityDetailPageProps> = ({
  communityIdOrSlug,
  onBack,
  onOpenDirectChat,
  onNavigateEventDetails,
  onCreateEventForCommunity
}) => {
  const { user, isAuthenticated } = useAuth();
  const [community, setCommunity] = useState<CommunityDto | null>(null);
  const [members, setMembers] = useState<CommunityMemberDto[]>([]);
  const [posts, setPosts] = useState<PostDto[]>([]);
  const [events, setEvents] = useState<EventDto[]>([]);

  const [selectedPostType, setSelectedPostType] = useState<PostType | ''>('');
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals state
  const [isEditCommOpen, setIsEditCommOpen] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostDto | null>(null);
  const [reportingTarget, setReportingTarget] = useState<{ type: 'POST' | 'COMMENT'; id: number } | null>(null);

  useEffect(() => {
    loadData();
  }, [communityIdOrSlug]);

  useEffect(() => {
    if (community) {
      fetchFeed(community.id, selectedPostType);
    }
  }, [communityIdOrSlug, selectedPostType]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await communityService.getCommunityDetails(communityIdOrSlug);
      if (res.success && res.data) {
        setCommunity(res.data);
        fetchMembers(res.data.id);
        fetchEvents(res.data.id);
        fetchFeed(res.data.id, selectedPostType);
      } else {
        setError(res.message || 'Community not found');
      }
    } catch (err: any) {
      console.error('Failed to load community details', err);
      setError('Failed to fetch community information.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (id: number) => {
    try {
      const res = await communityService.getCommunityMembers(id);
      if (res.success && res.data) {
        setMembers(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch members', err);
    }
  };

  const fetchEvents = async (id: number) => {
    try {
      const page = await eventService.searchEvents({ communityId: id, size: 3 });
      setEvents(page.content);
    } catch (err) {
      console.error('Failed to fetch community events', err);
    }
  };

  const fetchFeed = async (id: number, typeFilter?: PostType | '') => {
    try {
      setPostsLoading(true);
      const res = await postService.getCommunityPosts(id, typeFilter || undefined);
      if (res.success && res.data) {
        setPosts(res.data.content);
      }
    } catch (err) {
      console.error('Failed to fetch community posts', err);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleJoinToggle = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to join MoveMate communities.');
      return;
    }
    if (!community) return;

    try {
      setActionLoading(true);
      if (community.joined) {
        const res = await communityService.leaveCommunity(community.id);
        if (res.success && res.data) {
          setCommunity(res.data);
          fetchMembers(community.id);
        }
      } else {
        const res = await communityService.joinCommunity(community.id);
        if (res.success && res.data) {
          setCommunity(res.data);
          fetchMembers(community.id);
        }
      }
    } catch (err: any) {
      console.error('Join error', err);
      alert(err.response?.data?.message || 'Failed to update membership');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePostInList = (updated: PostDto) => {
    setPosts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeletePostInList = (deletedId: number) => {
    setPosts(prev => prev.filter(p => p.id !== deletedId));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <LoadingSpinner size="lg" label="Loading Community..." />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
        <p style={{ color: '#EF4444' }}>{error || 'Community not found.'}</p>
        <button onClick={onBack} className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} />
          <span>Back to Communities</span>
        </button>
      </div>
    );
  }

  const isOwner = user && community.creatorId === user.id;

  const postTypeFilters: { label: string; value: PostType | '' }[] = [
    { label: 'All Discussions', value: '' },
    { label: 'Questions', value: 'QUESTION' },
    { label: 'Housing Queries', value: 'ACCOMMODATION' },
    { label: 'Career & Jobs', value: 'CAREER' },
    { label: 'Mutual Help', value: 'HELP' },
    { label: 'General', value: 'GENERAL' }
  ];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <button onClick={onBack} className="btn btn-secondary btn-sm">
          <ArrowLeft size={16} />
          <span>Back to Communities</span>
        </button>
      </div>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 60%, #0D9488 100%)',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              boxShadow: '0 8px 20px rgba(13, 148, 136, 0.35)',
              border: '2px solid rgba(255, 255, 255, 0.25)'
            }}>
              {community.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>{community.name}</h1>
              <div style={{ color: '#5EEAD4', fontSize: '0.9rem', fontWeight: 600, marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={15} />
                <span>{community.originLocation.displayName}</span>
                <span>➔</span>
                <span>{community.destinationLocation.displayName}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.6rem' }}>
                <span className="badge badge-teal">{community.category}</span>
                <span className="badge badge-indigo">Language: {community.language || 'English'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {isOwner && (
              <button
                onClick={() => setIsEditCommOpen(true)}
                className="btn btn-secondary btn-sm"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', borderColor: 'rgba(255, 255, 255, 0.3)' }}
              >
                <Settings size={15} />
                <span>Settings</span>
              </button>
            )}

            <button
              onClick={handleJoinToggle}
              disabled={actionLoading}
              className={`btn ${community.joined ? 'btn-secondary' : 'btn-accent'}`}
            >
              {actionLoading ? 'Updating...' : community.joined ? (
                <>
                  <Check size={16} />
                  <span>Joined Community</span>
                </>
              ) : (
                '+ Join Community'
              )}
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.12)', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Total Members</span>
            <strong style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>{community.memberCount}</strong>
          </div>

          <div>
            <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Discussions</span>
            <strong style={{ fontSize: '1.25rem', color: '#FFFFFF' }}>{posts.length}</strong>
          </div>

          <div>
            <span style={{ color: '#94A3B8', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600 }}>Community Leader</span>
            <strong style={{ fontSize: '1.05rem', color: '#5EEAD4' }}>{community.creatorName}</strong>
          </div>
        </div>
      </div>

      {/* About Community */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>About This Community</h2>
        <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
          {community.description || 'Welcome to our relocation group! Share local advice, ask questions, and connect with fellow relocators.'}
        </p>
      </div>

      {/* Upcoming Community Events Section */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--color-text-main)', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={18} color="#0D9488" />
            <span>Community Events & Meetups ({events.length})</span>
          </h3>
          {onCreateEventForCommunity && (
            <button
              onClick={() => onCreateEventForCommunity(community.id)}
              className="btn btn-accent btn-sm"
            >
              <Plus size={14} />
              <span>Host Meetup</span>
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
            No upcoming events scheduled for this community yet.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.85rem' }}>
            {events.map(ev => (
              <div
                key={ev.id}
                onClick={() => onNavigateEventDetails && onNavigateEventDetails(ev.id)}
                className="card card-interactive"
                style={{
                  backgroundColor: 'var(--color-bg-page)',
                  padding: '0.85rem 1rem',
                  cursor: 'pointer'
                }}
              >
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                  {ev.title}
                </div>
                <div style={{ fontSize: '0.78125rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                  📍 {ev.location} • 🎟️ {ev.attendeeCount} Attending
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Feed Section */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
              Discussion Feed
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', margin: '0.2rem 0 0 0' }}>
              Ask questions, share recommendations, and connect with members
            </p>
          </div>

          {isAuthenticated ? (
            <button
              onClick={() => setIsComposerOpen(true)}
              className="btn btn-accent btn-sm"
            >
              <Plus size={16} />
              <span>Write a Post</span>
            </button>
          ) : (
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              Sign in to post in this community
            </span>
          )}
        </div>

        {/* Post Type Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {postTypeFilters.map(f => (
            <button
              key={`post-filter-${f.value}`}
              onClick={() => setSelectedPostType(f.value)}
              className={`btn btn-sm ${selectedPostType === f.value ? 'btn-accent' : 'btn-secondary'}`}
              style={{
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.78125rem'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Feed List */}
        {postsLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <LoadingSpinner size="md" label="Loading posts..." />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon="💬"
            title="No Posts in This Category Yet"
            description="Be the first to start a conversation, ask a question, or share local recommendations!"
            actionText={isAuthenticated ? "+ Write First Post" : undefined}
            onAction={isAuthenticated ? () => setIsComposerOpen(true) : undefined}
          />
        ) : (
          posts.map(p => (
            <PostCard
              key={p.id}
              post={p}
              onUpdatePost={handleUpdatePostInList}
              onDeletePost={handleDeletePostInList}
              onEditPost={(target) => setEditingPost(target)}
              onReportPost={(id) => setReportingTarget({ type: 'POST', id })}
              onReportComment={(id) => setReportingTarget({ type: 'COMMENT', id })}
            />
          ))
        )}
      </section>

      {/* Member Directory */}
      <div className="card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text-main)' }}>
          Active Members ({members.length})
        </h3>

        {members.length === 0 ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No active members listed.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
            {members.map((m) => (
              <div
                key={m.id}
                style={{
                  backgroundColor: 'var(--color-bg-page)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: '0.75rem 0.85rem',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'var(--color-brand-accent)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {m.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', display: 'block' }}>{m.userName}</strong>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      {m.role} {m.userProfession ? `• ${m.userProfession}` : ''}
                    </span>
                  </div>
                </div>

                {user && user.id !== m.userId && onOpenDirectChat && (
                  <button
                    onClick={() => onOpenDirectChat(m.userId)}
                    className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.75rem', color: 'var(--color-brand-accent)', padding: '0.25rem 0.5rem' }}
                  >
                    <MessageSquare size={13} />
                    <span>Chat</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {isEditCommOpen && (
        <EditCommunityModal
          community={community}
          isOpen={isEditCommOpen}
          onClose={() => setIsEditCommOpen(false)}
          onSuccess={(updated) => setCommunity(updated)}
        />
      )}

      {isComposerOpen && (
        <PostComposerModal
          communityId={community.id}
          communityName={community.name}
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
          onSuccess={(newPost) => setPosts(prev => [newPost, ...prev])}
        />
      )}

      {editingPost && (
        <EditPostModal
          post={editingPost}
          isOpen={!!editingPost}
          onClose={() => setEditingPost(null)}
          onSuccess={(updated) => handleUpdatePostInList(updated)}
        />
      )}

      {reportingTarget && (
        <ReportModal
          targetType={reportingTarget.type}
          targetId={reportingTarget.id}
          isOpen={!!reportingTarget}
          onClose={() => setReportingTarget(null)}
        />
      )}
    </div>
  );
};
