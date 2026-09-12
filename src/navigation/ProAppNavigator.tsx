/**
 * POPCIX PRO - Main App Navigator
 * Coordinates the 5 primary tabs and operational modal workflows.
 */

import React, { useState } from 'react';
import { ProHeader } from '../components/pro/ProHeader';
import { ProBottomTabs, ProTabKey } from '../components/pro/ProBottomTabs';
import { ProHomeScreen } from '../screens/pro/home/ProHomeScreen';
import { ProJobsScreen } from '../screens/pro/jobs/ProJobsScreen';
import { ProEarningsScreen } from '../screens/pro/earnings/ProEarningsScreen';
import { ProRewardsScreen } from '../screens/pro/rewards/ProRewardsScreen';
import { ProProfileScreen } from '../screens/pro/profile/ProProfileScreen';
import { ActiveJobModal } from '../screens/pro/jobs/ActiveJobModal';
import { ProKYCModal } from '../screens/pro/onboarding/ProKYCModal';
import { LearningHubModal } from '../screens/pro/learning/LearningHubModal';
import { SafetyEmergencyModal } from '../screens/pro/safety/SafetyEmergencyModal';
import { ProAIAssistantModal } from '../screens/pro/ai/ProAIAssistantModal';
import { ProCelebrationModal } from '../components/pro/ProCelebrationModal';
import { ProJob } from '../types/pro';
import { useProMarketplace } from '../context/ProMarketplaceContext';

interface ProAppNavigatorProps {
  onSwitchToCustomerApp?: () => void;
}

export function ProAppNavigator({ onSwitchToCustomerApp }: ProAppNavigatorProps) {
  const [currentTab, setCurrentTab] = useState<ProTabKey>('home');
  const [activeJobModalData, setActiveJobModalData] = useState<ProJob | null>(null);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [showLearningModal, setShowLearningModal] = useState(false);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);

  const { activeJob } = useProMarketplace();

  const handleOpenJobModal = (job: ProJob) => {
    setActiveJobModalData(job);
  };

  const handleCloseJobModal = () => {
    setActiveJobModalData(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F8F5] relative overflow-hidden font-sans select-none">
      {/* Pro Global Header */}
      <ProHeader
        onOpenSafety={() => setShowSafetyModal(true)}
        onOpenAI={() => setShowAIModal(true)}
        onSwitchMode={onSwitchToCustomerApp}
      />

      {/* Screen Container */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {currentTab === 'home' && (
          <ProHomeScreen
            onOpenActiveJobModal={handleOpenJobModal}
            onNavigateToTab={(tab) => setCurrentTab(tab as ProTabKey)}
            onOpenKYCModal={() => setShowKYCModal(true)}
            onOpenLearningModal={() => setShowLearningModal(true)}
            onOpenSafetyModal={() => setShowSafetyModal(true)}
            onOpenAIModal={() => setShowAIModal(true)}
          />
        )}

        {currentTab === 'jobs' && (
          <ProJobsScreen onOpenJobModal={handleOpenJobModal} />
        )}

        {currentTab === 'earnings' && (
          <ProEarningsScreen />
        )}

        {currentTab === 'rewards' && (
          <ProRewardsScreen />
        )}

        {currentTab === 'profile' && (
          <ProProfileScreen
            onOpenKYCModal={() => setShowKYCModal(true)}
            onOpenLearningModal={() => setShowLearningModal(true)}
            onOpenSafetyModal={() => setShowSafetyModal(true)}
            onSwitchMode={onSwitchToCustomerApp}
          />
        )}
      </main>

      {/* Bottom Tabs */}
      <ProBottomTabs
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Active Job Workflow Modal */}
      {activeJobModalData && (
        <ActiveJobModal
          job={activeJobModalData}
          onClose={handleCloseJobModal}
          onOpenSafety={() => setShowSafetyModal(true)}
        />
      )}

      {/* 10-Step KYC Wizard Modal */}
      {showKYCModal && (
        <ProKYCModal onClose={() => setShowKYCModal(false)} />
      )}

      {/* Learning Hub Modal */}
      {showLearningModal && (
        <LearningHubModal onClose={() => setShowLearningModal(false)} />
      )}

      {/* Safety & SOS Modal */}
      {showSafetyModal && (
        <SafetyEmergencyModal onClose={() => setShowSafetyModal(false)} />
      )}

      {/* Sparky Pro AI Assistant Modal */}
      {showAIModal && (
        <ProAIAssistantModal onClose={() => setShowAIModal(false)} />
      )}

      {/* Global Gamification Celebration Popup */}
      <ProCelebrationModal />
    </div>
  );
}
