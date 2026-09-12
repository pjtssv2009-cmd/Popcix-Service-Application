/**
 * POPCIX Main App Navigator & Modal Coordinator
 */

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { Header } from '../components/common/Header';
import { BottomTabs } from './BottomTabs';

// Screens
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { HomeScreen } from '../screens/home/HomeScreen';
import { ExploreScreen } from '../screens/explore/ExploreScreen';
import { BookingsListScreen } from '../screens/bookings/BookingsListScreen';
import { RewardsScreen } from '../screens/rewards/RewardsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

// Modals
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { ServiceDetailScreen } from '../screens/service/ServiceDetailScreen';
import { BookingFlowModal } from '../screens/booking/BookingFlowModal';
import { InstantBookingRadar } from '../screens/booking/InstantBookingRadar';
import { LiveTrackingScreen } from '../screens/tracking/LiveTrackingScreen';
import { ServiceCompletionModal } from '../screens/tracking/ServiceCompletionModal';
import { SubscriptionsScreen } from '../screens/subscriptions/SubscriptionsScreen';
import { AIAssistantModal } from '../screens/ai/AIAssistantModal';
import { AddressManagerModal } from '../screens/profile/AddressManagerModal';
import { NotificationsModal } from '../screens/profile/NotificationsModal';
import { SupportTicketModal } from '../screens/profile/SupportTicketModal';
import { Mascot } from '../components/common/Mascot';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

import { registerBackButtonHandler } from '../services/nativeMobile';

export const AppNavigator: React.FC = () => {
  const { user, profile } = useAuth();
  const { activeTab, setActiveTab, activeModal, openModal, closeModal } = useMarketplace();
  const { celebration, closeCelebration } = useGamification();

  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);

  // Android Hardware Back Button handler
  React.useEffect(() => {
    const unregister = registerBackButtonHandler(() => {
      if (celebration.isOpen) {
        closeCelebration();
        return true;
      }
      if (activeModal) {
        closeModal();
        return true;
      }
      if (activeTab !== 'home') {
        setActiveTab('home');
        return true;
      }
      return false; // Exit app
    });

    return unregister;
  }, [celebration.isOpen, activeModal, activeTab, closeModal, closeCelebration, setActiveTab]);

  // If user is not yet through onboarding
  if (!hasCompletedOnboarding) {
    return (
      <OnboardingScreen
        onComplete={() => setHasCompletedOnboarding(true)}
        onOpenSignIn={() => {
          setHasCompletedOnboarding(true);
          openModal('auth-signin');
        }}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col relative min-h-full">
      {/* Sticky Header */}
      <Header />

      {/* Main Tab Screen Content */}
      <main className="flex-1 flex flex-col">
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'explore' && <ExploreScreen />}
        {activeTab === 'bookings' && <BookingsListScreen />}
        {activeTab === 'rewards' && <RewardsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </main>

      {/* Bottom 5-Tab Navigation Bar */}
      <BottomTabs />

      {/* MODAL OVERLAYS */}
      {activeModal === 'auth-signin' && (
        <SignInScreen
          onClose={closeModal}
          onOpenSignUp={() => openModal('auth-signup')}
          onOpenForgotPassword={() => openModal('auth-forgot')}
        />
      )}

      {activeModal === 'auth-signup' && (
        <SignUpScreen
          onClose={closeModal}
          onOpenSignIn={() => openModal('auth-signin')}
        />
      )}

      {activeModal === 'auth-forgot' && (
        <ForgotPasswordScreen
          onClose={closeModal}
          onOpenSignIn={() => openModal('auth-signin')}
        />
      )}

      {activeModal === 'service-detail' && <ServiceDetailScreen />}
      {activeModal === 'booking-flow' && <BookingFlowModal />}
      {activeModal === 'instant-radar' && <InstantBookingRadar />}
      {activeModal === 'live-tracking' && <LiveTrackingScreen />}
      {activeModal === 'completion-celebration' && <ServiceCompletionModal />}
      {activeModal === 'subscriptions' && <SubscriptionsScreen />}
      {activeModal === 'ai-assistant' && <AIAssistantModal />}
      {activeModal === 'address-manager' && <AddressManagerModal />}
      {activeModal === 'notifications-center' && <NotificationsModal />}
      {activeModal === 'support-ticket' && <SupportTicketModal />}

      {/* LEVEL UP / SPECIAL CELEBRATION MODAL */}
      {celebration.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-pop-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center border-4 border-[#FFAA00] shadow-2xl space-y-4">
            <Mascot mood="celebrating" size={130} />
            <Badge variant="amber" size="lg">
              {celebration.title}
            </Badge>
            <p className="text-xs text-[#444444] font-medium leading-relaxed">
              {celebration.subtitle}
            </p>
            <div className="p-3 bg-[#F8F8F5] rounded-2xl flex justify-around text-xs font-black">
              <span className="text-[#7C3AED]">+{celebration.xpEarned} XP</span>
              <span className="text-[#FFAA00]">+{celebration.pointsEarned} Points</span>
            </div>
            <Button variant="primary" size="lg" fullWidth onClick={closeCelebration}>
              Awesome! Keep Going 🚀
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
