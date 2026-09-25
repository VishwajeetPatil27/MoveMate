import React from 'react';

interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No Records Found',
  description = 'There are no active records available for this section yet.',
  actionText,
  onAction
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3.5rem 1.5rem',
      backgroundColor: '#FFFFFF',
      border: '1px dashed var(--color-border-medium, #CBD5E1)',
      borderRadius: 'var(--radius-xl, 1rem)',
      margin: '1.5rem 0',
      boxShadow: 'var(--shadow-xs, 0 1px 2px 0 rgba(0,0,0,0.04))'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '16px',
        backgroundColor: 'var(--color-surface-subtle, #F1F5F9)',
        color: 'var(--color-brand-accent, #0D9488)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.75rem',
        margin: '0 auto 1rem auto'
      }}>
        {icon || '📦'}
      </div>
      <h4 style={{
        color: 'var(--color-text-main, #0F172A)',
        fontSize: '1.125rem',
        fontWeight: 700,
        marginBottom: '0.35rem'
      }}>
        {title}
      </h4>
      <p style={{
        color: 'var(--color-text-muted, #64748B)',
        fontSize: '0.875rem',
        maxWidth: '440px',
        margin: '0 auto 1.25rem auto',
        lineHeight: 1.5
      }}>
        {description}
      </p>
      {actionText && onAction && (
        <button onClick={onAction} className="btn btn-accent btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
};
