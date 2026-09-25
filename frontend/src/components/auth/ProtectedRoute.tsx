import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { LoginPage } from './LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  onNavigateRegister?: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  onNavigateRegister
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <LoadingSpinner size="lg" label="Verifying security credentials..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div>
        <div style={{
          maxWidth: '600px',
          margin: '1.5rem auto -1rem auto',
          padding: '0.75rem 1.25rem',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '8px',
          color: '#FCD34D',
          fontSize: '0.9rem',
          textAlign: 'center'
        }}>
          Authentication Required: Please sign in to access this protected area.
        </div>
        <LoginPage onNavigateRegister={onNavigateRegister} />
      </div>
    );
  }

  if (requiredRole && user && user.role !== requiredRole && user.role !== 'ADMIN') {
    return (
      <div style={{
        maxWidth: '500px',
        margin: '4rem auto',
        padding: '2rem',
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        borderRadius: '12px',
        color: '#FCA5A5',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>403 Access Denied</h3>
        <p style={{ fontSize: '0.95rem' }}>
          Your role ({user.role}) does not have permission to view this resource. Requires {requiredRole}.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
