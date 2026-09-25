import React, { useState } from 'react';
import { CreatePostRequest, PostDto, PostType } from '../../types/post';
import { postService } from '../../services/postService';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface PostComposerModalProps {
  communityId: number;
  communityName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (created: PostDto) => void;
}

export const PostComposerModal: React.FC<PostComposerModalProps> = ({
  communityId,
  communityName,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('GENERAL');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!content.trim()) {
      setError('Content is required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const request: CreatePostRequest = {
        title: title.trim(),
        content: content.trim(),
        postType
      };

      const res = await postService.createPost(communityId, request);
      if (res.success && res.data) {
        onSuccess(res.data);
        onClose();
      } else {
        setError(res.message || 'Failed to create post');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create post. Please check content limits.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1.5rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        width: '100%',
        maxWidth: '650px',
        maxHeight: '90vh',
        overflowY: 'auto',
        color: '#FFFFFF',
        padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Create Post</h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', margin: '0.25rem 0 0 0' }}>Post to {communityName}</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '1.5rem', cursor: 'pointer' }}>
            &times;
          </button>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '0.875rem 1rem',
            marginBottom: '1.25rem',
            color: '#FCA5A5',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Category / Post Topic *
            </label>
            <select
              className="form-control"
              value={postType}
              onChange={(e) => setPostType(e.target.value as PostType)}
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
            >
              <option value="GENERAL">General Discussion</option>
              <option value="QUESTION">Question / Inquiry</option>
              <option value="ACCOMMODATION">Housing & Flatmate Request</option>
              <option value="CAREER">Career & Tech Opportunity</option>
              <option value="HELP">Help Needed</option>
              <option value="LOCAL_INFO">Local Info & Advice</option>
              <option value="TRAVEL">Commute & Transport</option>
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Post Title *
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Which areas are good for IT employees near Hinjawadi?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
              Post Content & Details *
            </label>
            <textarea
              rows={5}
              className="form-control"
              placeholder="Provide context, budget, requirements, or specific details for community members..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#FFF', borderRadius: '8px', padding: '0.6rem 0.8rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#E2E8F0', borderRadius: '8px', padding: '0.65rem 1.25rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-accent"
              style={{ padding: '0.65rem 1.5rem', fontWeight: 600 }}
            >
              {submitting ? <LoadingSpinner size="sm" label="Publishing..." /> : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
