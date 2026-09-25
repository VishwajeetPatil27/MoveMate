import React from 'react';

export interface LoadingSpinnerProps {
  message?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  label,
  size = 'md',
  color
}) => {
  const displayText = label || message;
  const dimensions = size === 'sm' ? '18px' : size === 'lg' ? '40px' : '26px';
  const borderWidth = size === 'sm' ? '2px' : '3px';
  const accentColor = color || 'var(--color-brand-accent, #0D9488)';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0.75rem' }}>
      <div style={{
        width: dimensions,
        height: dimensions,
        border: `${borderWidth} solid rgba(13, 148, 136, 0.15)`,
        borderTop: `${borderWidth} solid ${accentColor}`,
        borderRadius: '50%',
        animation: 'movemate-spin 0.8s linear infinite'
      }} />
      {displayText && (
        <span style={{
          marginTop: '0.5rem',
          fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
          color: 'var(--color-text-muted, #64748B)',
          fontWeight: 500
        }}>
          {displayText}
        </span>
      )}
      <style>{`
        @keyframes movemate-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
