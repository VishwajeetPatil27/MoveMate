import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Sidebar } from './components/layout/Sidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { BottomNav } from './components/layout/BottomNav';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ProfileView } from './components/profile/ProfileView';
import { RelocationDashboard } from './components/relocation/RelocationDashboard';
import { CommunityDiscoveryPage } from './components/community/CommunityDiscoveryPage';
import { CommunityDetailPage } from './components/community/CommunityDetailPage';
import { MyCommunitiesPage } from './components/community/MyCommunitiesPage';
import { MessagesPage } from './components/chat/MessagesPage';
import { AccommodationDiscoveryPage } from './components/housing/AccommodationDiscoveryPage';
import { AccommodationDetailPage } from './components/housing/AccommodationDetailPage';
import { MyAccommodationsPage } from './components/housing/MyAccommodationsPage';
import { CreateAccommodationModal } from './components/housing/CreateAccommodationModal';
import { ServicesDiscoveryPage } from './components/services/ServicesDiscoveryPage';
import { ServiceDetailPage } from './components/services/ServiceDetailPage';
import { CreateServiceModal } from './components/services/CreateServiceModal';
import { SavedItemsPage } from './components/saved/SavedItemsPage';
import { NotificationsPage } from './components/notification/NotificationsPage';
import { EventsDiscoveryPage } from './components/events/EventsDiscoveryPage';
import { EventDetailPage } from './components/events/EventDetailPage';
import { CreateEventModal } from './components/events/CreateEventModal';
import { MyEventsPage } from './components/events/MyEventsPage';
import { AdminDashboardPage } from './components/admin/AdminDashboardPage';
import { UserManagementPage } from './components/admin/UserManagementPage';
import { ModerationQueuePage } from './components/admin/ModerationQueuePage';
import { AuditLogsPage } from './components/admin/AuditLogsPage';
import { HomeDashboard } from './components/home/HomeDashboard';
import { LocationModal } from './components/common/LocationModal';
import { chatService } from './services/chatService';
import { CommunityDto } from './types/community';
import { AccommodationDto } from './types/accommodation';
import { RecommendationDto } from './types/localService';

const MainContent: React.FC = () => {
  type ViewState =
    | 'home'
    | 'login'
    | 'register'
    | 'profile'
    | 'relocation'
    | 'communities'
    | 'community-detail'
    | 'my-communities'
    | 'messages'
    | 'accommodation'
    | 'accommodation-detail'
    | 'my-accommodations'
    | 'saved-accommodations'
    | 'services'
    | 'service-detail'
    | 'saved-services'
    | 'notifications'
    | 'events'
    | 'event-detail'
    | 'my-events'
    | 'admin'
    | 'admin-users'
    | 'admin-reports'
    | 'admin-audit-logs';

  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [selectedCity, setSelectedCity] = useState<string>('Pune');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | number | null>(null);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<number | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [isCreateAccommodationOpen, setIsCreateAccommodationOpen] = useState<boolean>(false);
  const [isCreateServiceOpen, setIsCreateServiceOpen] = useState<boolean>(false);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState<boolean>(false);
  const [createEventCommunityId, setCreateEventCommunityId] = useState<number | undefined>(undefined);
  const { user, isAuthenticated } = useAuth();

  const handleSelectCommunity = (community: CommunityDto) => {
    setSelectedCommunityId(community.id);
    setCurrentView('community-detail');
  };

  const handleSelectAccommodation = (accommodation: AccommodationDto) => {
    setSelectedAccommodationId(accommodation.id);
    setCurrentView('accommodation-detail');
  };

  const handleSelectService = (service: RecommendationDto) => {
    setSelectedServiceId(service.id);
    setCurrentView('service-detail');
  };

  const handleStartDirectChat = async (recipientId: number) => {
    if (!isAuthenticated) {
      alert('Please sign in to message other users or service providers.');
      return;
    }
    try {
      const res = await chatService.createOrGetConversation(recipientId);
      if (res.success && res.data) {
        setActiveConversationId(res.data.id);
        setCurrentView('messages');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start conversation.');
    }
  };

  const isAuthView = currentView === 'login' || currentView === 'register';
  const showRightSidebar = currentView === 'home' || currentView === 'communities';

  return (
    <div className="app-shell">
      <Header
        currentView={currentView}
        onNavigateHome={() => setCurrentView('home')}
        onNavigateLogin={() => setCurrentView('login')}
        onNavigateRegister={() => setCurrentView('register')}
        onNavigateProfile={() => setCurrentView('profile')}
        onNavigateRelocation={() => setCurrentView('relocation')}
        onNavigateCommunities={() => setCurrentView('communities')}
        onNavigateMyCommunities={() => setCurrentView('my-communities')}
        onNavigateMessages={() => setCurrentView('messages')}
        onNavigateAccommodation={() => setCurrentView('accommodation')}
        onNavigateServices={() => setCurrentView('services')}
        onNavigateNotifications={() => setCurrentView('notifications')}
        onNavigateEvents={() => setCurrentView('events')}
        onNavigateAdmin={() => setCurrentView('admin')}
        onNavigateSaved={() => setCurrentView('saved-accommodations')}
        selectedCityName={selectedCity}
        onOpenCitySelector={() => setIsLocationModalOpen(true)}
      />

      <div className="app-body-container">
        {/* Desktop Left Sidebar */}
        {!isAuthView && (
          <div className="app-left-sidebar">
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view as ViewState)}
            />
          </div>
        )}

        {/* Central Content Area */}
        <main className="app-main-content">
          {/* Admin Navigation Bar */}
          {(currentView === 'admin' ||
            currentView === 'admin-users' ||
            currentView === 'admin-reports' ||
            currentView === 'admin-audit-logs') && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '24px',
                backgroundColor: 'var(--color-brand-primary, #0F172A)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-xl, 1rem)',
                overflowX: 'auto',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <button
                onClick={() => setCurrentView('admin')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-lg, 0.75rem)',
                  border: 'none',
                  backgroundColor: currentView === 'admin' ? 'var(--color-brand-accent, #0D9488)' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: currentView === 'admin' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>📊</span>
                <span>Platform Analytics</span>
              </button>
              <button
                onClick={() => setCurrentView('admin-users')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-lg, 0.75rem)',
                  border: 'none',
                  backgroundColor: currentView === 'admin-users' ? 'var(--color-brand-accent, #0D9488)' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: currentView === 'admin-users' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>👥</span>
                <span>User Accounts</span>
              </button>
              <button
                onClick={() => setCurrentView('admin-reports')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-lg, 0.75rem)',
                  border: 'none',
                  backgroundColor: currentView === 'admin-reports' ? 'var(--color-brand-accent, #0D9488)' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: currentView === 'admin-reports' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>🚨</span>
                <span>Moderation Queue</span>
              </button>
              <button
                onClick={() => setCurrentView('admin-audit-logs')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-lg, 0.75rem)',
                  border: 'none',
                  backgroundColor: currentView === 'admin-audit-logs' ? 'var(--color-brand-accent, #0D9488)' : 'transparent',
                  color: '#FFFFFF',
                  fontWeight: currentView === 'admin-audit-logs' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>📋</span>
                <span>Security Audit Logs</span>
              </button>
            </div>
          )}

          {/* Admin Protected Views */}
          {currentView === 'admin' && (
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          )}

          {currentView === 'admin-users' && (
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          )}

          {currentView === 'admin-reports' && (
            <ProtectedRoute>
              <ModerationQueuePage />
            </ProtectedRoute>
          )}

          {currentView === 'admin-audit-logs' && (
            <ProtectedRoute>
              <AuditLogsPage />
            </ProtectedRoute>
          )}

          {/* Authentication Pages */}
          {currentView === 'login' && (
            <LoginPage
              onNavigateRegister={() => setCurrentView('register')}
              onSuccess={() => setCurrentView('home')}
              onNavigateAdmin={() => setCurrentView('admin')}
            />
          )}

          {currentView === 'register' && (
            <RegisterPage
              onNavigateLogin={() => setCurrentView('login')}
              onSuccess={() => setCurrentView('home')}
            />
          )}

          {/* Profile & Relocation Planning */}
          {currentView === 'profile' && (
            <ProtectedRoute onNavigateRegister={() => setCurrentView('register')}>
              <ProfileView onNavigateRelocation={() => setCurrentView('relocation')} />
            </ProtectedRoute>
          )}

          {currentView === 'relocation' && (
            <ProtectedRoute onNavigateRegister={() => setCurrentView('register')}>
              <RelocationDashboard onNavigateProfile={() => setCurrentView('profile')} />
            </ProtectedRoute>
          )}

          {/* Communities Discovery & Details */}
          {currentView === 'communities' && (
            <CommunityDiscoveryPage
              onSelectCommunity={handleSelectCommunity}
              onNavigateMyCommunities={() => setCurrentView('my-communities')}
            />
          )}

          {currentView === 'community-detail' && selectedCommunityId && (
            <CommunityDetailPage
              communityIdOrSlug={selectedCommunityId}
              onBack={() => setCurrentView('communities')}
              onOpenDirectChat={handleStartDirectChat}
              onNavigateEventDetails={(eventId) => {
                setSelectedEventId(eventId);
                setCurrentView('event-detail');
              }}
              onCreateEventForCommunity={(cid) => {
                setCreateEventCommunityId(cid);
                setIsCreateEventOpen(true);
              }}
            />
          )}

          {currentView === 'my-communities' && (
            <ProtectedRoute onNavigateRegister={() => setCurrentView('register')}>
              <MyCommunitiesPage
                onSelectCommunity={handleSelectCommunity}
                onNavigateDiscovery={() => setCurrentView('communities')}
              />
            </ProtectedRoute>
          )}

          {/* Direct Messaging */}
          {currentView === 'messages' && (
            <ProtectedRoute onNavigateRegister={() => setCurrentView('register')}>
              <MessagesPage initialConversationId={activeConversationId} />
            </ProtectedRoute>
          )}

          {/* Accommodation Discovery, Details & Listings */}
          {currentView === 'accommodation' && (
            <AccommodationDiscoveryPage
              onSelectAccommodation={handleSelectAccommodation}
              onNavigateMyListings={() => setCurrentView('my-accommodations')}
              onNavigateSavedListings={() => setCurrentView('saved-accommodations')}
              onCreateListing={() => setIsCreateAccommodationOpen(true)}
            />
          )}

          {currentView === 'accommodation-detail' && selectedAccommodationId && (
            <AccommodationDetailPage
              accommodationId={selectedAccommodationId}
              onBack={() => setCurrentView('accommodation')}
              onOpenDirectChat={handleStartDirectChat}
            />
          )}

          {currentView === 'my-accommodations' && (
            <ProtectedRoute onNavigateRegister={() => setCurrentView('register')}>
              <MyAccommodationsPage
                onSelectAccommodation={handleSelectAccommodation}
                onBackToDiscovery={() => setCurrentView('accommodation')}
                onCreateListing={() => setIsCreateAccommodationOpen(true)}
              />
            </ProtectedRoute>
          )}

          {/* Local Services & Essentials */}
          {currentView === 'services' && (
            <ServicesDiscoveryPage
              onSelectService={handleSelectService}
              onNavigateSavedPlaces={() => setCurrentView('saved-services')}
              onCreateService={() => setIsCreateServiceOpen(true)}
            />
          )}

          {currentView === 'service-detail' && selectedServiceId && (
            <ServiceDetailPage
              serviceId={selectedServiceId}
              onBack={() => setCurrentView('services')}
              onOpenDirectChat={handleStartDirectChat}
            />
          )}

          {/* Saved Items Unified Tabbed Page */}
          {(currentView === 'saved-accommodations' || currentView === 'saved-services') && (
            <ProtectedRoute onNavigateRegister={() => setCurrentView('register')}>
              <SavedItemsPage
                initialTab={currentView === 'saved-services' ? 'services' : 'accommodation'}
                onSelectAccommodation={handleSelectAccommodation}
                onSelectService={handleSelectService}
                onBackToDiscovery={() => setCurrentView('home')}
              />
            </ProtectedRoute>
          )}

          {/* Notification Center */}
          {currentView === 'notifications' && (
            <ProtectedRoute onNavigateRegister={() => setCurrentView('register')}>
              <NotificationsPage
                onNavigateTarget={(type, referenceId) => {
                  if (type === 'NEW_MESSAGE' && referenceId) {
                    setActiveConversationId(referenceId);
                    setCurrentView('messages');
                  } else if (
                    (type === 'EVENT_CREATED' || type === 'EVENT_UPDATED' || type === 'EVENT_CANCELLED') &&
                    referenceId
                  ) {
                    setSelectedEventId(referenceId);
                    setCurrentView('event-detail');
                  } else {
                    setCurrentView('notifications');
                  }
                }}
              />
            </ProtectedRoute>
          )}

          {/* Events & Social Gatherings */}
          {currentView === 'events' && (
            <EventsDiscoveryPage
              onViewEventDetails={(id) => {
                setSelectedEventId(id);
                setCurrentView('event-detail');
              }}
              onCreateEvent={() => {
                setCreateEventCommunityId(undefined);
                setIsCreateEventOpen(true);
              }}
              onViewMyEvents={() => setCurrentView('my-events')}
            />
          )}

          {currentView === 'event-detail' && selectedEventId && (
            <EventDetailPage
              eventId={selectedEventId}
              onBack={() => setCurrentView('events')}
              onNavigateCommunity={(communityId) => {
                setSelectedCommunityId(communityId);
                setCurrentView('community-detail');
              }}
              onContactOrganizer={handleStartDirectChat}
            />
          )}

          {currentView === 'my-events' && (
            <ProtectedRoute onNavigateRegister={() => setCurrentView('register')}>
              <MyEventsPage
                onViewEventDetails={(id) => {
                  setSelectedEventId(id);
                  setCurrentView('event-detail');
                }}
                onBackToDiscovery={() => setCurrentView('events')}
              />
            </ProtectedRoute>
          )}

          {/* Clean Production Home Dashboard */}
          {currentView === 'home' && (
            <HomeDashboard
              onNavigateCommunities={() => setCurrentView('communities')}
              onNavigateAccommodation={() => setCurrentView('accommodation')}
              onNavigateServices={() => setCurrentView('services')}
              onNavigateEvents={() => setCurrentView('events')}
              onNavigateRelocation={() => setCurrentView('relocation')}
              onSelectCommunity={handleSelectCommunity}
              onSelectAccommodation={handleSelectAccommodation}
              onSelectService={handleSelectService}
              onSelectEvent={(eventId) => {
                setSelectedEventId(eventId);
                setCurrentView('event-detail');
              }}
            />
          )}
        </main>

        {/* Desktop Contextual Right Sidebar */}
        {showRightSidebar && (
          <div className="app-right-sidebar">
            <RightSidebar
              onNavigateCommunities={() => setCurrentView('communities')}
              onNavigateEvents={() => setCurrentView('events')}
              onSelectCommunity={handleSelectCommunity}
              onSelectEvent={(eventId) => {
                setSelectedEventId(eventId);
                setCurrentView('event-detail');
              }}
              onNavigateRelocation={() => setCurrentView('relocation')}
            />
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation Bar */}
      {!isAuthView && (
        <BottomNav
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view as ViewState)}
        />
      )}

      {/* Global Location Selector Modal */}
      {isLocationModalOpen && (
        <LocationModal
          isOpen={isLocationModalOpen}
          onClose={() => setIsLocationModalOpen(false)}
          currentCityName={selectedCity}
          onSelectCity={(loc) => {
            setSelectedCity(loc.city);
          }}
        />
      )}

      {/* Create Accommodation Modal */}
      {isCreateAccommodationOpen && (
        <CreateAccommodationModal
          onClose={() => setIsCreateAccommodationOpen(false)}
          onSuccess={() => {
            if (currentView === 'accommodation' || currentView === 'my-accommodations') {
              window.location.reload();
            } else {
              setCurrentView('accommodation');
            }
          }}
        />
      )}

      {/* Create Service Modal */}
      {isCreateServiceOpen && (
        <CreateServiceModal
          onClose={() => setIsCreateServiceOpen(false)}
          onSuccess={() => {
            if (currentView === 'services') {
              window.location.reload();
            } else {
              setCurrentView('services');
            }
          }}
        />
      )}

      {/* Create Event Modal */}
      {isCreateEventOpen && (
        <CreateEventModal
          communityId={createEventCommunityId}
          onClose={() => setIsCreateEventOpen(false)}
          onSuccess={(newEventId) => {
            setIsCreateEventOpen(false);
            setSelectedEventId(newEventId);
            setCurrentView('event-detail');
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
};
