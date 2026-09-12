/**
 * POPCIX ADMIN - Access Denied & Feature Gate Guard
 * Rendered when the active role tries to access a restricted module.
 */

import React from 'react';
import { ShieldAlert, Lock, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { AdminRole, AdminTab } from '../types/admin';
import { useAdminAuth, ROLE_METADATA } from '../context/AdminAuthContext';

interface POPCIXAccessDeniedCardProps {
  attemptedTab: AdminTab;
  onNavigateHome: () => void;
}

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard: 'Executive Dashboard',
  'live-ops': 'Live Operations & GPS Radar',
  bookings: 'Bookings Management',
  customers: 'Customer Directory & History',
  professionals: 'Partner Technicians Directory',
  kyc: 'KYC Document Verification Queue',
  services: 'Service Catalogue & Pricing',
  zones: 'Service Zones & Geo-fencing',
  payments: 'Payments Ledger',
  payouts: 'Friday Weekly Payouts',
  refunds: 'Refund Approvals Desk',
  support: 'Support Ticket Desk',
  disputes: 'Dispute Resolution Center',
  reviews: 'Reviews & Ratings Moderation',
  gamification: 'Gamification & XP Rules',
  notifications: 'Broadcast Push Notifications',
  analytics: 'Analytics & Reporting Studio',
  'audit-logs': 'Immutable Audit Logs',
  'feature-flags': 'System Feature Flags',
  settings: 'System & Platform Settings'
};

export function POPCIXAccessDeniedCard({
  attemptedTab,
  onNavigateHome
}: POPCIXAccessDeniedCardProps) {
  const { currentRole, currentRoleMetadata, setRole } = useAdminAuth();

  // Find which roles are allowed to access this tab
  const authorizedRoles = (Object.keys(ROLE_METADATA) as AdminRole[]).filter(r =>
    ROLE_METADATA[r].allowedTabs.includes(attemptedTab)
  );

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-[80vh] flex flex-col items-center justify-center text-center select-none animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#DC2626] mb-6 shadow-xs">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3F4F6] text-[#374151] text-xs font-bold mb-3 border border-[#E5E7EB]">
        <Lock className="w-3.5 h-3.5 text-[#6B7280]" />
        <span>ROLE-BASED ACCESS CONTROL (RBAC) GATE</span>
      </div>

      <h2 className="text-2xl font-black text-[#111111] mb-2 tracking-tight">
        Access Restricted: {TAB_TITLES[attemptedTab] || attemptedTab}
      </h2>

      <p className="text-sm text-[#6B6B6B] max-w-xl mb-8 leading-relaxed">
        Your active role <span className="font-bold text-[#111111]">"{currentRoleMetadata.label}"</span> ({currentRole}) is restricted to <span className="font-semibold text-[#111111]">{currentRoleMetadata.primaryDomain}</span> and does not have the operational permissions required to view or execute actions in this module.
      </p>

      {/* Role Feature Scope Card */}
      <div className="w-full bg-white border border-[#E5E5E0] rounded-2xl p-6 mb-8 text-left shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0F0EB] mb-4">
          <div>
            <div className="text-xs font-bold text-[#888888] uppercase tracking-wider">Current Scope</div>
            <div className="text-base font-black text-[#111111]">{currentRoleMetadata.label}</div>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${currentRoleMetadata.badgeColor}`}>
            {currentRoleMetadata.badge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="font-bold text-[#111111] mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Assigned Features for this Role ({currentRoleMetadata.allowedTabs.length}):</span>
            </div>
            <ul className="space-y-1 text-[#555555]">
              {currentRoleMetadata.allowedTabs.slice(0, 5).map(tab => (
                <li key={tab} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>{TAB_TITLES[tab] || tab}</span>
                </li>
              ))}
              {currentRoleMetadata.allowedTabs.length > 5 && (
                <li className="text-[#888888] italic">+ {currentRoleMetadata.allowedTabs.length - 5} more features</li>
              )}
            </ul>
          </div>

          <div>
            <div className="font-bold text-[#DC2626] mb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-[#DC2626]" />
              <span>Authorized Roles for this Feature:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {authorizedRoles.map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#F8F8F5] hover:bg-black hover:text-white border border-[#E5E5E0] text-[11px] font-bold text-[#333333] transition-all flex items-center gap-1.5"
                  title={`Switch to ${ROLE_METADATA[r].label}`}
                >
                  <span>{ROLE_METADATA[r].label}</span>
                  <ArrowRight className="w-3 h-3 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateHome}
          className="px-5 py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-[#222222] transition-colors shadow-xs"
        >
          Return to Allowed Dashboard
        </button>

        <button
          onClick={() => setRole('SUPER_ADMIN')}
          className="px-5 py-2.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-emerald-800 text-xs font-bold hover:bg-[#DCFCE7] transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Switch to Super Admin (Dev Mode)</span>
        </button>
      </div>
    </div>
  );
}
