import React from 'react';
import { Compass, Heart, Shield, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigateCommunities?: () => void;
  onNavigateAccommodation?: () => void;
  onNavigateServices?: () => void;
  onNavigateEvents?: () => void;
  onNavigateRelocation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateCommunities,
  onNavigateAccommodation,
  onNavigateServices,
  onNavigateEvents,
  onNavigateRelocation
}) => {
  return (
    <footer style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid var(--color-border-subtle, #E2E8F0)',
      color: 'var(--color-text-secondary, #334155)',
      padding: '3rem 0 2rem 0',
      marginTop: 'auto'
    }}>
      <div className="container-wide">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem'
        }}>
          {/* Brand Info */}
          <div style={{ maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #0F172A 0%, #0D9488 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Compass size={18} color="#5EEAD4" />
              </div>
              <span style={{
                fontFamily: 'var(--font-family-heading, Outfit)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'var(--color-brand-primary, #0F172A)'
              }}>
                Move<span style={{ color: 'var(--color-brand-accent, #0D9488)' }}>Mate</span>
              </span>
            </div>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--color-text-muted, #64748B)',
              lineHeight: 1.6,
              margin: 0
            }}>
              Your complete companion for relocating to a new city. Find welcoming communities, verified rooms, essential services, and local friends.
            </p>
          </div>

          {/* Platform Columns */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main, #0F172A)', marginBottom: '0.875rem' }}>
              Explore
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <a
                href="#communities"
                onClick={(e) => { e.preventDefault(); onNavigateCommunities && onNavigateCommunities(); }}
                style={{ color: 'var(--color-text-muted, #64748B)', textDecoration: 'none' }}
              >
                Local Communities
              </a>
              <a
                href="#housing"
                onClick={(e) => { e.preventDefault(); onNavigateAccommodation && onNavigateAccommodation(); }}
                style={{ color: 'var(--color-text-muted, #64748B)', textDecoration: 'none' }}
              >
                Rooms & Flatmates
              </a>
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); onNavigateServices && onNavigateServices(); }}
                style={{ color: 'var(--color-text-muted, #64748B)', textDecoration: 'none' }}
              >
                Nearby Services
              </a>
              <a
                href="#events"
                onClick={(e) => { e.preventDefault(); onNavigateEvents && onNavigateEvents(); }}
                style={{ color: 'var(--color-text-muted, #64748B)', textDecoration: 'none' }}
              >
                Events & Meetups
              </a>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main, #0F172A)', marginBottom: '0.875rem' }}>
              Relocators
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem' }}>
              <a
                href="#relocation"
                onClick={(e) => { e.preventDefault(); onNavigateRelocation && onNavigateRelocation(); }}
                style={{ color: 'var(--color-text-muted, #64748B)', textDecoration: 'none' }}
              >
                Declare Relocation Intent
              </a>
              <span style={{ color: 'var(--color-text-muted, #64748B)' }}>City Guides</span>
              <span style={{ color: 'var(--color-text-muted, #64748B)' }}>Newcomer Checklist</span>
              <span style={{ color: 'var(--color-text-muted, #64748B)' }}>Flatmate Compatibility</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-main, #0F172A)', marginBottom: '0.875rem' }}>
              Trust & Community
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-text-muted, #64748B)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Shield size={14} color="#0D9488" /> Verified Members
              </span>
              <span>Community Guidelines</span>
              <span>Privacy & Safety</span>
              <span>Help & Support</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--color-border-subtle, #E2E8F0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: 'var(--color-text-light, #94A3B8)'
        }}>
          <div>
            © {new Date().getFullYear()} MoveMate. All rights reserved. Connecting relocators worldwide.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span>Built with care for people starting fresh in new cities</span>
            <Heart size={14} color="#E11D48" fill="#E11D48" />
          </div>
        </div>
      </div>
    </footer>
  );
};
