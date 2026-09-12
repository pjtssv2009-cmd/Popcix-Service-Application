/**
 * POPCIX ADMIN - Main Navigation & Layout Orchestrator
 * Desktop responsive container connecting sidebar, header, global command search, and operational screens.
 */

import React, { useState } from 'react';
import { POPCIXAdminSidebar, AdminTab } from '../components/POPCIXAdminSidebar';
import { POPCIXAdminHeader } from '../components/POPCIXAdminHeader';
import { POPCIXGlobalSearchModal } from '../components/POPCIXGlobalSearchModal';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { AdminLiveOpsScreen } from '../screens/AdminLiveOpsScreen';
import { AdminBookingsScreen } from '../screens/AdminBookingsScreen';
import { AdminKYCScreen } from '../screens/AdminKYCScreen';
import { AdminProfessionalsScreen } from '../screens/AdminProfessionalsScreen';
import { AdminCustomersScreen } from '../screens/AdminCustomersScreen';
import { AdminServicesScreen } from '../screens/AdminServicesScreen';
import { AdminZonesScreen } from '../screens/AdminZonesScreen';
import { AdminFinanceScreen } from '../screens/AdminFinanceScreen';
import { AdminSupportScreen } from '../screens/AdminSupportScreen';
import { AdminReviewsScreen } from '../screens/AdminReviewsScreen';
import { AdminGamificationScreen } from '../screens/AdminGamificationScreen';
import { AdminNotificationsScreen } from '../screens/AdminNotificationsScreen';
import { AdminAnalyticsScreen } from '../screens/AdminAnalyticsScreen';
import { AdminAuditLogsScreen } from '../screens/AdminAuditLogsScreen';
import { AdminSettingsScreen } from '../screens/AdminSettingsScreen';

interface AdminNavigatorProps {
  onSwitchToProMobile?: () => void;
}

export function AdminNavigator({ onSwitchToProMobile }: AdminNavigatorProps) {
  const [currentTab, setCurrentTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-[#F7F7F4] text-[#111111] overflow-hidden font-sans select-none">
      {/* Desktop Navigation Sidebar */}
      <POPCIXAdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Global Admin Header */}
        <POPCIXAdminHeader
          onOpenGlobalSearch={() => setIsSearchModalOpen(true)}
          onSwitchToProMobile={onSwitchToProMobile}
        />

        {/* Dynamic Screen View */}
        <main className="flex-1 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <AdminDashboardScreen onNavigate={(tab) => setCurrentTab(tab)} />
          )}

          {currentTab === 'live-ops' && (
            <AdminLiveOpsScreen />
          )}

          {currentTab === 'bookings' && (
            <AdminBookingsScreen />
          )}

          {currentTab === 'kyc' && (
            <AdminKYCScreen />
          )}

          {currentTab === 'professionals' && (
            <AdminProfessionalsScreen />
          )}

          {currentTab === 'customers' && (
            <AdminCustomersScreen />
          )}

          {currentTab === 'services' && (
            <AdminServicesScreen />
          )}

          {currentTab === 'zones' && (
            <AdminZonesScreen />
          )}

          {(currentTab === 'payments' || currentTab === 'payouts' || currentTab === 'refunds') && (
            <AdminFinanceScreen />
          )}

          {(currentTab === 'support' || currentTab === 'disputes') && (
            <AdminSupportScreen />
          )}

          {currentTab === 'reviews' && (
            <AdminReviewsScreen />
          )}

          {currentTab === 'gamification' && (
            <AdminGamificationScreen />
          )}

          {currentTab === 'notifications' && (
            <AdminNotificationsScreen />
          )}

          {currentTab === 'analytics' && (
            <AdminAnalyticsScreen />
          )}

          {currentTab === 'audit-logs' && (
            <AdminAuditLogsScreen />
          )}

          {(currentTab === 'feature-flags' || currentTab === 'settings') && (
            <AdminSettingsScreen />
          )}
        </main>
      </div>

      {/* Global Command Palette Search Modal (Cmd+K) */}
      <POPCIXGlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onNavigate={(tab) => setCurrentTab(tab)}
      />
    </div>
  );
}
