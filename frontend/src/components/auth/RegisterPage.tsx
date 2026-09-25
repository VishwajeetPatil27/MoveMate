import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../types/auth';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  Compass,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building2,
  Users
} from 'lucide-react';

interface RegisterPageProps {
  onNavigateLogin?: () => void;
  onSuccess?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigateLogin, onSuccess }) => {
  const { register, error, clearError } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('USER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role
      });
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setFormError(err.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 180px)',
      padding: '2.5rem 1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        border: '1px solid var(--color-border-subtle, #E2E8F0)',
        boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(15, 23, 42, 0.08))',
        padding: '2.5rem 2rem'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)',
            marginBottom: '1rem'
          }}>
            <Compass size={28} color="#5EEAD4" />
          </div>
          <h2 style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--color-text-main, #0F172A)',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em'
          }}>
            Create Your Account
          </h2>
          <p style={{
            color: 'var(--color-text-muted, #64748B)',
            fontSize: '0.9rem',
            margin: 0,
            lineHeight: 1.45
          }}>
            Join MoveMate to connect with communities, accommodation, and city essentials.
          </p>
        </div>

        {/* Error Feedback Banner */}
        {(formError || error) && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FCA5A5',
            borderRadius: 'var(--radius-lg, 0.75rem)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#991B1B',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>{formError || error}</div>
            <button
              type="button"
              onClick={() => { setFormError(null); clearError(); }}
              style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer', fontSize: '1.1rem', lineHeight: 1 }}
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary, #334155)',
              marginBottom: '0.35rem'
            }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Johnson"
                required
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
              <User
                size={16}
                color="var(--color-text-light, #94A3B8)"
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary, #334155)',
              marginBottom: '0.35rem'
            }}>
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                size={16}
                color="var(--color-text-light, #94A3B8)"
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary, #334155)',
              marginBottom: '0.35rem'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock
                size={16}
                color="var(--color-text-light, #94A3B8)"
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted, #64748B)', marginTop: '0.25rem', display: 'block' }}>
              Must contain minimum 6 characters
            </span>
          </div>

          {/* Account Role */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-text-secondary, #334155)',
              marginBottom: '0.35rem'
            }}>
              I am joining as a
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="form-control"
              style={{ fontWeight: 500 }}
            >
              <option value="USER">Relocator / New Resident (Looking for Community & Housing)</option>
              <option value="COMMUNITY_ADMIN">Community Organizer / Group Leader</option>
              <option value="ADMIN">Platform Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-accent btn-lg"
            style={{ width: '100%', gap: '0.5rem' }}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" color="#FFFFFF" label="Creating account..." />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Existing account link */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--color-border-subtle, #E2E8F0)',
          fontSize: '0.875rem',
          color: 'var(--color-text-muted, #64748B)'
        }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-brand-accent, #0D9488)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
