import React, { useState } from 'react';
import { CommentDto } from '../../types/post';
import { postService } from '../../services/postService';

interface CommentItemProps {
  comment: CommentDto;
  onUpdate: (updated: CommentDto) => void;
  onDelete: (commentId: number) => void;
  onReport: (commentId: number) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, onUpdate, onDelete, onReport }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [saving, setSaving] = useState(false);

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

  const handleSaveEdit = async () => {
    if (!editContent.trim()) return;
    try {
      setSaving(true);
      const res = await postService.updateComment(comment.id, { content: editContent.trim() });
      if (res.success && res.data) {
        onUpdate(res.data);
        setIsEditing(false);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update comment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const res = await postService.deleteComment(comment.id);
      if (res.success) {
        onDelete(comment.id);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div style={{
      background: '#F8FAFC',
      border: '1px solid #E2E8F0',
      borderRadius: '10px',
      padding: '0.75rem 1rem',
      marginBottom: '0.65rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: '#0D9488',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.75rem',
            fontWeight: 'bold'
          }}>
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
          <strong style={{ fontSize: '0.85rem', color: '#1E293B' }}>{comment.authorName}</strong>
          {comment.authorProfession && (
            <span style={{ fontSize: '0.75rem', color: '#64748B' }}>• {comment.authorProfession}</span>
          )}
          <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>• {formatRelativeTime(comment.createdAt)}</span>
          {comment.status === 'EDITED' && (
            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontStyle: 'italic' }}>(edited)</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem' }}>
          {comment.canEdit && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              style={{ background: 'none', border: 'none', color: '#0F766E', cursor: 'pointer', fontWeight: 600 }}
            >
              Edit
            </button>
          )}
          {comment.canDelete && (
            <button
              onClick={handleDelete}
              style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontWeight: 600 }}
            >
              Delete
            </button>
          )}
          <button
            onClick={() => onReport(comment.id)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
          >
            🚩
          </button>
        </div>
      </div>

      {isEditing ? (
        <div style={{ marginTop: '0.5rem' }}>
          <textarea
            rows={2}
            className="form-control"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ width: '100%', fontSize: '0.85rem', padding: '0.4rem 0.6rem', marginBottom: '0.4rem' }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsEditing(false)}
              disabled={saving}
              style={{ background: 'none', border: 'none', color: '#64748B', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={saving}
              className="btn btn-accent"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <p style={{ fontSize: '0.875rem', color: '#334155', margin: 0, lineHeight: '1.4', whiteSpace: 'pre-line' }}>
          {comment.content}
        </p>
      )}
    </div>
  );
};
