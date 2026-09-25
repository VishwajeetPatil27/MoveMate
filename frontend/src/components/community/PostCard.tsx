import React, { useState } from 'react';
import { PostDto } from '../../types/post';
import { postService } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import { CommentSection } from './CommentSection';
import { Heart, MessageSquare, Flag, Edit3, Trash2 } from 'lucide-react';

interface PostCardProps {
  post: PostDto;
  onUpdatePost?: (updated: PostDto) => void;
  onDeletePost?: (postId: number) => void;
  onEditPost?: (post: PostDto) => void;
  onReportPost?: (postId: number) => void;
  onReportComment?: (commentId: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onUpdatePost,
  onDeletePost,
  onEditPost,
  onReportPost,
  onReportComment
}) => {
  const { isAuthenticated } = useAuth();
  const [currentPost, setCurrentPost] = useState<PostDto>(post);
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (diffSec < 60) return 'just now';
      if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
      if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
      return `${Math.floor(diffSec / 86400)}d ago`;
    } catch {
      return dateStr;
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      alert('Please sign in to like posts.');
      return;
    }
    try {
      setLikeLoading(true);
      const res = await postService.toggleLike(currentPost.id);
      if (res.success && res.data) {
        setCurrentPost(res.data);
        if (onUpdatePost) onUpdatePost(res.data);
      }
    } catch (err: any) {
      console.error('Like toggle failed', err);
      alert(err.response?.data?.message || 'Failed to update reaction.');
    } finally {
      setLikeLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await postService.deletePost(currentPost.id);
      if (res.success && onDeletePost) {
        onDeletePost(currentPost.id);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete post.');
    }
  };

  const getPostTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'QUESTION': return 'badge-amber';
      case 'ACCOMMODATION': return 'badge-teal';
      case 'CAREER': return 'badge-indigo';
      case 'HELP': return 'badge-rose';
      default: return 'badge-indigo';
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
      {/* Header: Author & Metadata */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
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
            {currentPost.authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{currentPost.authorName}</strong>
              <span className={`badge ${getPostTypeBadgeClass(currentPost.postType)}`} style={{ fontSize: '0.6875rem' }}>
                {currentPost.postType}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', gap: '0.35rem' }}>
              {currentPost.authorProfession && <span>{currentPost.authorProfession} • </span>}
              <span>{formatRelativeTime(currentPost.createdAt)}</span>
              {currentPost.status === 'EDITED' && <span style={{ fontStyle: 'italic' }}>(edited)</span>}
            </div>
          </div>
        </div>

        {/* Action Menu */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {currentPost.canEdit && onEditPost && (
            <button
              onClick={() => onEditPost(currentPost)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--color-brand-accent)' }}
            >
              <Edit3 size={14} />
              <span>Edit</span>
            </button>
          )}
          {currentPost.canDelete && (
            <button
              onClick={handleDelete}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#EF4444' }}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          )}
          {onReportPost && (
            <button
              onClick={() => onReportPost(currentPost.id)}
              className="btn btn-ghost btn-sm"
              style={{ padding: '0.25rem', color: 'var(--color-text-light)' }}
              title="Report post"
            >
              <Flag size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Post Title & Content Body */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-main)', margin: '0 0 0.5rem 0', lineHeight: 1.35 }}>
        {currentPost.title}
      </h3>
      <p style={{ fontSize: '0.925rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, margin: '0 0 1rem 0', whiteSpace: 'pre-line' }}>
        {currentPost.content}
      </p>

      {/* Footer Reactions & Comment Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)' }}>
        <button
          onClick={handleToggleLike}
          disabled={likeLoading}
          className="btn btn-secondary btn-sm"
          style={{
            borderRadius: 'var(--radius-full)',
            backgroundColor: currentPost.likedByCurrentUser ? 'var(--color-accent-rose-light)' : undefined,
            color: currentPost.likedByCurrentUser ? 'var(--color-accent-rose)' : undefined,
            borderColor: currentPost.likedByCurrentUser ? '#FECDD3' : undefined
          }}
        >
          <Heart size={15} color={currentPost.likedByCurrentUser ? '#E11D48' : '#64748B'} fill={currentPost.likedByCurrentUser ? '#E11D48' : 'none'} />
          <span>{currentPost.likeCount} {currentPost.likeCount === 1 ? 'Like' : 'Likes'}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="btn btn-secondary btn-sm"
          style={{ borderRadius: 'var(--radius-full)' }}
        >
          <MessageSquare size={15} />
          <span>{currentPost.commentCount} {currentPost.commentCount === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {/* Embedded Comments Section */}
      {showComments && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
          <CommentSection
            postId={currentPost.id}
            onCommentCountChange={(count) => setCurrentPost(prev => ({ ...prev, commentCount: count }))}
            onReportComment={onReportComment}
          />
        </div>
      )}
    </div>
  );
};
