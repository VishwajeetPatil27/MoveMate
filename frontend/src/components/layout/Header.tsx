import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { NotificationBell } from '../notification/NotificationBell';
import {
  Compass,
  MapPin,
  Search,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Bookmark,
  Calendar,
  Building2,
  Users,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentView?: string;
  onNavigateHome?: () => void;
  onNavigateLogin?: () => void;
  onNavigateRegister?: () => void;
  onNavigateProfile?: () => void;
  onNavigateRelocation?: () => void;
  onNavigateCommunities?: () => void;
  onNavigateMyCommunities?: () => void;
  onNavigateMessages?: () => void;
  onNavigateAccommodation?: () => void;
  onNavigateServices?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateEvents?: () => void;
  onNavigateAdmin?: () => void;
  onNavigateSaved?: () => void;
  selectedCityName?: string;
  onOpenCitySelector?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = 'home',
  onNavigateHome,
  onNavigateLogin,
  onNavigateRegister,
  onNavigateProfile,
  onNavigateRelocation,
  onNavigateCommunities,
  onNavigateMyCommunities,
  onNavigateMessages,
  onNavigateAccommodation,
  onNavigateServices,
  onNavigateNotifications,
  onNavigateEvents,
  onNavigateAdmin,
  onNavigateSaved,
  selectedCityName = 'Pune',
  onOpenCitySelector
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header style={{
      backgroundColor: '#FFFFFF',
      color: 'var(--color-text-main, #0F172A)',
      borderBottom: '1px solid var(--color-border-subtle, #E2E8F0)',
      boxShadow: 'var(--shadow-xs, 0 1px 2px 0 rgba(0,0,0,0.04))',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container-wide" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        gap: '1rem'
      }}>
        {/* Brand Logo & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div
            onClick={onNavigateHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.25)'
            }}>
              <Compass size={22} color="#5EEAD4" />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-family-heading, Outfit)',
                fontSize: '1.35rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: 'var(--color-brand-primary, #0F172A)',
                lineHeight: 1.1
              }}>
                Move<span style={{ color: 'var(--color-brand-accent, #0D9488)' }}>Mate</span>
              </div>
              <div style={{
                fontSize: '0.6875rem',
                color: 'var(--color-text-muted, #64748B)',
                fontWeight: 500,
                letterSpacing: '0.02em'
              }}>
                Community Relocation Platform
              </div>
            </div>
          </div>

          {/* Location Selector Pill */}
          <button
            onClick={onOpenCitySelector}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius-full, 9999px)',
              backgroundColor: 'var(--color-surface-subtle, #F1F5F9)',
              border: '1px solid var(--color-border-subtle, #E2E8F0)',
              color: 'var(--color-text-secondary, #334155)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Change active location"
          >
            <MapPin size={14} color="#0D9488" />
            <span>{selectedCityName}</span>
          </button>
        </div>

        {/* Desktop Quick Search Trigger */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          maxWidth: '380px',
          margin: '0 1rem'
        }} className="desktop-search-bar">
          <div
            onClick={onNavigateCommunities}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.85rem',
              backgroundColor: 'var(--color-surface-subtle, #F1F5F9)',
              border: '1px solid var(--color-border-subtle, #E2E8F0)',
              borderRadius: 'var(--radius-lg, 0.75rem)',
              color: 'var(--color-text-light, #94A3B8)',
              fontSize: '0.8125rem',
              cursor: 'pointer'
            }}
          >
            <Search size={15} />
            <span>Search communities, rooms, services in {selectedCityName}...</span>
          </div>
        </div>

        {/* Right Navigation & User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated && user ? (
            <>
              {/* Notification Bell */}
              <NotificationBell
                onNavigateNotifications={onNavigateNotifications || (() => {})}
              />

              {/* User Profile Pill & Dropdown Trigger */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.35rem 0.75rem 0.35rem 0.35rem',
                    borderRadius: 'var(--radius-full, 9999px)',
                    border: '1px solid var(--color-border-subtle, #E2E8F0)',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-xs)'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-brand-primary, #0F172A)',
                    color: '#5EEAD4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-main, #0F172A)', lineHeight: 1.1 }}>
                      {user.fullName.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted, #64748B)' }}>
                      {user.role === 'ADMIN' ? 'Admin' : 'Member'}
                    </span>
                  </div>
                </button>

                {/* Profile Popover Menu */}
                {isProfileMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '220px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 'var(--radius-xl, 1rem)',
                      border: '1px solid var(--color-border-subtle, #E2E8F0)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '0.5rem',
                      zIndex: 100
                    }}
                    onMouseLeave={() => setIsProfileMenuOpen(false)}
                  >
                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--color-border-subtle, #E2E8F0)', marginBottom: '0.35rem' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main, #0F172A)' }}>
                        {user.fullName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #64748B)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.email}
                      </div>
                    </div>

                    <button
                      onClick={() => { setIsProfileMenuOpen(false); onNavigateProfile && onNavigateProfile(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-md, 0.5rem)',
                        border: 'none',
                        background: 'none',
                        color: 'var(--color-text-secondary, #334155)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-subtle, #F1F5F9)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <UserIcon size={16} />
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => { setIsProfileMenuOpen(false); onNavigateRelocation && onNavigateRelocation(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-md, 0.5rem)',
                        border: 'none',
                        background: 'none',
                        color: 'var(--color-text-secondary, #334155)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-subtle, #F1F5F9)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <Compass size={16} />
                      <span>Relocation Plans</span>
                    </button>

                    <button
                      onClick={() => { setIsProfileMenuOpen(false); onNavigateSaved && onNavigateSaved(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-md, 0.5rem)',
                        border: 'none',
                        background: 'none',
                        color: 'var(--color-text-secondary, #334155)',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-subtle, #F1F5F9)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <Bookmark size={16} />
                      <span>Saved Items</span>
                    </button>

                    {user.role === 'ADMIN' && (
                      <button
                        onClick={() => { setIsProfileMenuOpen(false); onNavigateAdmin && onNavigateAdmin(); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.625rem',
                          width: '100%',
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-md, 0.5rem)',
                          border: 'none',
                          background: 'none',
                          color: '#DC2626',
                          fontSize: '0.8125rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Shield size={16} />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div style={{ borderTop: '1px solid var(--color-border-subtle, #E2E8F0)', margin: '0.35rem 0' }} />

                    <button
                      onClick={() => { setIsProfileMenuOpen(false); logout(); }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-md, 0.5rem)',
                        border: 'none',
                        background: 'none',
                        color: '#EF4444',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={onNavigateLogin}
                className="btn btn-secondary btn-sm"
              >
                Sign In
              </button>
              <button
                onClick={onNavigateRegister}
                className="btn btn-accent btn-sm"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'none',
              padding: '0.4rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-main, #0F172A)'
            }}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--color-border-subtle, #E2E8F0)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => { setIsMobileMenuOpen(false); onNavigateHome && onNavigateHome(); }}
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start' }}
          >
            Home
          </button>
          <button
            onClick={() => { setIsMobileMenuOpen(false); onNavigateCommunities && onNavigateCommunities(); }}
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start' }}
          >
            Explore Communities
          </button>
          <button
            onClick={() => { setIsMobileMenuOpen(false); onNavigateAccommodation && onNavigateAccommodation(); }}
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start' }}
          >
            Accommodation
          </button>
          <button
            onClick={() => { setIsMobileMenuOpen(false); onNavigateServices && onNavigateServices(); }}
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start' }}
          >
            Local Services
          </button>
          <button
            onClick={() => { setIsMobileMenuOpen(false); onNavigateEvents && onNavigateEvents(); }}
            className="btn btn-ghost"
            style={{ justifyContent: 'flex-start' }}
          >
            Events & Meetups
          </button>
          {isAuthenticated && (
            <>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigateMessages && onNavigateMessages(); }}
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start' }}
              >
                Messages
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigateSaved && onNavigateSaved(); }}
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start' }}
              >
                Saved Items
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigateProfile && onNavigateProfile(); }}
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start' }}
              >
                My Profile
              </button>
              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => { setIsMobileMenuOpen(false); onNavigateAdmin && onNavigateAdmin(); }}
                  className="btn btn-ghost"
                  style={{ justifyContent: 'flex-start', color: '#DC2626', fontWeight: 600 }}
                >
                  Admin Center
                </button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};
