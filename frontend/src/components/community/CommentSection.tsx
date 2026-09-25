import React, { useState, useEffect } from 'react';
import { CommentDto } from '../../types/post';
import { postService } from '../../services/postService';
import { useAuth } from '../../context/AuthContext';
import { CommentItem } from './CommentItem';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface CommentSectionProps {
  postId: number;
  onCommentCountChange?: (newCount: number) => void;
  onReportComment?: (commentId: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, onCommentCountChange, onReportComment }) => {
  const { isAuthenticated } = useAuth();
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await postService.getPostComments(postId);
      if (res.success && res.data) {
        setComments(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load comments', err);
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in to comment.');
      return;
    }
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      const res = await postService.addComment(postId, { content: newComment.trim() });
      if (res.success && res.data) {
        const updated = [...comments, res.data];
        setComments(updated);
        setNewComment('');
        if (onCommentCountChange) onCommentCountChange(updated.length);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = (updated: CommentDto) => {
    setComments(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleDeleteComment = (commentId: number) => {
    const updated = comments.filter(c => c.id !== commentId);
    setComments(updated);
    if (onCommentCountChange) onCommentCountChange(updated.length);
  };

  return (
    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
      <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.75rem' }}>
        Comments ({comments.length})
      </h4>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
          {error}
        </div>
      )}

      {/* Add Comment Input */}
      {isAuthenticated ? (
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={submitting}
            style={{ flex: 1, fontSize: '0.85rem', padding: '0.5rem 0.75rem', borderRadius: '20px' }}
          />
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="btn btn-accent"
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', borderRadius: '20px' }}
          >
            {submitting ? 'Posting...' : 'Post'}
          </button>
        </form>
      ) : (
        <p style={{ fontSize: '0.8rem', color: '#64748B', fontStyle: 'italic', marginBottom: '0.75rem' }}>
          Sign in to post a comment.
        </p>
      )}

      {/* Comments List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
          <LoadingSpinner size="sm" label="Loading comments..." />
        </div>
      ) : comments.length === 0 ? (
        <p style={{ fontSize: '0.8125rem', color: '#94A3B8', textAlign: 'center', padding: '0.75rem 0', margin: 0 }}>
          No comments yet. Be the first to start the conversation!
        </p>
      ) : (
        comments.map(comment => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onUpdate={handleUpdateComment}
            onDelete={handleDeleteComment}
            onReport={(id) => onReportComment && onReportComment(id)}
          />
        ))
      )}
    </div>
  );
};
