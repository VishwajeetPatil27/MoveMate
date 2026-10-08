import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import {
  Compass,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  ShieldCheck,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onNavigateRegister?: () => void;
  onSuccess?: () => void;
  onNavigateAdmin?: () => void;
}

type LoginCategory = 'USER' | 'SERVICE_PROVIDER' | 'ADMIN';

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigateRegister, onSuccess, onNavigateAdmin }) => {
  const { login, logout, error, clearError } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<LoginCategory>('USER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [forgotPasswordNotice, setForgotPasswordNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    if (!email.trim() || !password) {
      setFormError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const authUser = await login({ email: email.trim(), password });

      // Role mismatch validation
      if (selectedCategory === 'ADMIN' && authUser.role !== 'ADMIN') {
        logout();
        setFormError('These credentials do not have administrator privileges. Please select the correct login role.');
        setIsSubmitting(false);
        return;
      }

      if (selectedCategory === 'SERVICE_PROVIDER' && authUser.role === 'USER') {
        logout();
        setFormError('This account is registered as a general user. Please select the Member role.');
        setIsSubmitting(false);
        return;
      }

      if (authUser.role === 'ADMIN' && onNavigateAdmin) {
        onNavigateAdmin();
      } else if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setFormError(err.message || 'Authentication failed. Please check your email and password.');
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
        maxWidth: '460px',
        backgroundColor: '#FFFFFF',
        borderRadius: 'var(--radius-2xl, 1.25rem)',
        border: '1px solid var(--color-border-subtle, #E2E8F0)',
        boxShadow: 'var(--shadow-xl, 0 20px 25px -5px rgba(15, 23, 42, 0.08))',
        padding: '2.5rem 2rem'
      }}>
        {/* Header Branding */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            Welcome Back
          </h2>
          <p style={{
            color: 'var(--color-text-muted, #64748B)',
            fontSize: '0.9rem',
            margin: 0,
            lineHeight: 1.45
          }}>
            Sign in to explore your city community, accommodation listings, and local helpers.
          </p>
        </div>

        {/* Role Selector Segmented Controls */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'var(--color-text-secondary, #334155)',
            marginBottom: '0.5rem'
          }}>
            Sign In As
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            backgroundColor: 'var(--color-surface-subtle, #F1F5F9)',
            padding: '4px',
            borderRadius: 'var(--radius-lg, 0.75rem)'
          }}>
            <button
              type="button"
              onClick={() => { setSelectedCategory('USER'); setFormError(null); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '0.5rem 0.25rem',
                borderRadius: 'var(--radius-md, 0.5rem)',
                border: 'none',
                backgroundColor: selectedCategory === 'USER' ? '#FFFFFF' : 'transparent',
                color: selectedCategory === 'USER' ? 'var(--color-brand-accent, #0D9488)' : 'var(--color-text-muted, #64748B)',
                fontWeight: selectedCategory === 'USER' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: selectedCategory === 'USER' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={15} />
              <span>Member</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedCategory('SERVICE_PROVIDER'); setFormError(null); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '0.5rem 0.25rem',
                borderRadius: 'var(--radius-md, 0.5rem)',
                border: 'none',
                backgroundColor: selectedCategory === 'SERVICE_PROVIDER' ? '#FFFFFF' : 'transparent',
                color: selectedCategory === 'SERVICE_PROVIDER' ? 'var(--color-accent-blue, #0284C7)' : 'var(--color-text-muted, #64748B)',
                fontWeight: selectedCategory === 'SERVICE_PROVIDER' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: selectedCategory === 'SERVICE_PROVIDER' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Building2 size={15} />
              <span>Provider</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedCategory('ADMIN'); setFormError(null); }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '0.5rem 0.25rem',
                borderRadius: 'var(--radius-md, 0.5rem)',
                border: 'none',
                backgroundColor: selectedCategory === 'ADMIN' ? '#FFFFFF' : 'transparent',
                color: selectedCategory === 'ADMIN' ? '#DC2626' : 'var(--color-text-muted, #64748B)',
                fontWeight: selectedCategory === 'ADMIN' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: selectedCategory === 'ADMIN' ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <ShieldCheck size={15} />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Demo Accounts Quick-Fill Section */}
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.75rem',
          backgroundColor: '#F8FAFC',
          border: '1px dashed #CBD5E1',
          borderRadius: 'var(--radius-lg, 0.75rem)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.5rem'
          }}>
            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--color-text-muted, #64748B)'
            }}>
              Demo Quick-Fill
            </span>
            <span style={{
              fontSize: '0.7rem',
              color: '#0D9488',
              backgroundColor: '#CCFBF1',
              padding: '1px 6px',
              borderRadius: '9999px',
              fontWeight: 600
            }}>
              Evaluation Mode
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('USER');
                setEmail('user@movemate.com');
                setPassword('Password123!');
                setFormError(null);
              }}
              style={{
                padding: '0.4rem 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#0F172A',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s'
              }}
              title="Demo Member: user@movemate.com"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('SERVICE_PROVIDER');
                setEmail('provider.services@example.com');
                setPassword('Password123!');
                setFormError(null);
              }}
              style={{
                padding: '0.4rem 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#0369A1',
                backgroundColor: '#FFFFFF',
                border: '1px solid #BAE6FD',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s'
              }}
              title="Demo Provider: provider.services@example.com"
            >
              Demo Provider
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('ADMIN');
                setEmail('admin@movemate.com');
                setPassword('Password123!');
                setFormError(null);
              }}
              style={{
                padding: '0.4rem 0.25rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#B91C1C',
                backgroundColor: '#FFFFFF',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s'
              }}
              title="Demo Admin: admin@movemate.com"
            >
              Demo Admin
            </button>
          </div>
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

        {/* Forgot Password Helper Dialog */}
        {forgotPasswordNotice && (
          <div style={{
            backgroundColor: 'var(--color-brand-accent-light, #CCFBF1)',
            border: '1px solid #5EEAD4',
            borderRadius: 'var(--radius-lg, 0.75rem)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#0F766E',
            fontSize: '0.8125rem',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            <span>Please contact your community administrator or support at support@movemate.org to reset your credentials.</span>
            <button
              type="button"
              onClick={() => setForgotPasswordNotice(false)}
              style={{ background: 'none', border: 'none', color: '#0F766E', cursor: 'pointer', fontWeight: 700 }}
            >
              ×
            </button>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
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
                placeholder="name@example.com"
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

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-text-secondary, #334155)'
              }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotPasswordNotice(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-brand-accent, #0D9488)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="form-control"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <Lock
                size={16}
                color="var(--color-text-light, #94A3B8)"
                style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted, #64748B)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-accent btn-lg"
            style={{ width: '100%', gap: '0.5rem' }}
          >
            {isSubmitting ? (
              <LoadingSpinner size="sm" color="#FFFFFF" label="Signing in..." />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Create Account Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--color-border-subtle, #E2E8F0)',
          fontSize: '0.875rem',
          color: 'var(--color-text-muted, #64748B)'
        }}>
          New to MoveMate?{' '}
          <button
            type="button"
            onClick={onNavigateRegister}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-brand-accent, #0D9488)',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};
