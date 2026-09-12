/**
 * POPCIX ADMIN - Global Top Header Component
 * Displays greeting, global search (Cmd+K), operational alerts drawer, role switcher dropdown, and mode switch.
 */

import React, { useState } from 'react';
import { Search, Bell, Shield, ChevronDown, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useAdminData } from '../context/AdminDataContext';
import { AdminRole } from '../types/admin';

interface POPCIXAdminHeaderProps {
  onOpenGlobalSearch: () => void;
  onSwitchToProMobile?: () => void;
}

export function POPCIXAdminHeader({
  onOpenGlobalSearch,
  onSwitchToProMobile
}: POPCIXAdminHeaderProps) {
  const { adminUser, currentRole, setRole } = useAdminAuth();
  const { kycApplications, bookings, supportTickets } = useAdminData();

  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showAlertDrawer, setShowAlertDrawer] = useState(false);

  const availableRoles: { role: AdminRole; label: string; desc: string }[] = [
    { role: 'SUPER_ADMIN', label: 'Super Admin', desc: 'Unrestricted full platform access' },
    { role: 'OPERATIONS_ADMIN', label: 'Operations Admin', desc: 'Live dispatch, bookings & zones' },
    { role: 'KYC_ADMIN', label: 'KYC Admin', desc: 'Technician document verification' },
    { role: 'CUSTOMER_SUPPORT', label: 'Customer Support', desc: 'Tickets & customer dispute triage' },
    { role: 'FINANCE_ADMIN', label: 'Finance Admin', desc: 'Payments, payouts & refund approvals' },
    { role: 'SERVICE_MANAGER', label: 'Service Manager', desc: 'Catalogue, checklist & pricing engine' },
    { role: 'PROFESSIONAL_MANAGER', label: 'Pro Manager', desc: 'Partner growth, ratings & badges' },
    { role: 'ANALYST', label: 'Analyst', desc: 'Read-only analytics & reporting' }
  ];

  // Calculate critical alerts
  const searchingCount = bookings.filter(b => b.status === 'SEARCHING').length;
  const pendingKycCount = kycApplications.filter(k => k.status === 'PENDING').length;
  const criticalTickets = supportTickets.filter(t => t.priority === 'CRITICAL' && t.status !== 'RESOLVED').length;

  const totalAlerts = searchingCount + pendingKycCount + criticalTickets;

  return (
    <header className="h-16 bg-white border-b border-[#E5E5E0] px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Greeting & Search Bar */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-sm font-black text-[#111111] leading-tight">
            Good Morning, {adminUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-[11px] text-[#6B6B6B]">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} • Chennai Marketplace
          </p>
        </div>

        {/* Global Search Trigger (Cmd + K) */}
        <button
          onClick={onOpenGlobalSearch}
          className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#F8F8F5] border border-[#E5E5E0] text-xs text-[#6B6B6B] hover:bg-[#F0F0EB] hover:text-black transition-colors w-72 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search bookings, pros, tickets...</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#CCCCCC] text-[10px] font-mono text-[#555555]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Operational Controls & Role Switcher */}
      <div className="flex items-center gap-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#86EFAC] text-xs font-bold text-[#065F46] hover:bg-[#DCFCE7] transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-[#047857]" />
            <span>{availableRoles.find(r => r.role === currentRole)?.label}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 top-11 w-64 bg-white rounded-2xl border border-[#E5E5E0] shadow-2xl p-2 z-50 animate-fade-in space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-bold text-[#888888] uppercase tracking-wider">
                Switch Admin Role (Testing RBAC)
              </div>
              {availableRoles.map(r => (
                <button
                  key={r.role}
                  onClick={() => {
                    setRole(r.role);
                    setShowRoleDropdown(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors flex items-start justify-between ${
                    currentRole === r.role ? 'bg-black text-white font-bold' : 'hover:bg-[#F8F8F5] text-[#333333]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">{r.label}</div>
                    <div className={`text-[10px] ${currentRole === r.role ? 'text-white/70' : 'text-[#6B6B6B]'}`}>
                      {r.desc}
                    </div>
                  </div>
                  {currentRole === r.role && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Operational Alerts Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertDrawer(!showAlertDrawer)}
            className="w-9 h-9 rounded-xl bg-[#F8F8F5] border border-[#E5E5E0] flex items-center justify-center text-[#444444] hover:bg-[#F0F0EB] relative transition-colors"
            title="Operational Alerts"
          >
            <Bell className="w-4 h-4" />
            {totalAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs animate-bounce">
                {totalAlerts}
              </span>
            )}
          </button>

          {/* Alert Popover */}
          {showAlertDrawer && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl border border-[#E5E5E0] shadow-2xl p-3 z-50 animate-fade-in space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-[#F0F0EB]">
                <h4 className="text-xs font-black text-[#111111]">Real-Time Operational Alerts</h4>
                <span className="text-[10px] font-bold text-rose-500">{totalAlerts} Critical</span>
              </div>

              <div className="space-y-1.5 text-xs max-h-64 overflow-y-auto">
                {searchingCount > 0 && (
                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-bold">{searchingCount} Jobs Waiting for Assignment</span>
                      <p className="text-[10px] text-amber-700">Dispatch radar unconfirmed in OMR zone.</p>
                    </div>
                  </div>
                )}
                {pendingKycCount > 0 && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 flex items-start gap-2">
                    <Shield className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <span className="font-bold">{pendingKycCount} Technician KYC Submissions</span>
                      <p className="text-[10px] text-rose-700">Awaiting document inspection & approval.</p>
                    </div>
                  </div>
                )}
                {criticalTickets > 0 && (
                  <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-purple-600 mt-0.5" />
                    <div>
                      <span className="font-bold">{criticalTickets} Critical Safety Hazard Logged</span>
                      <p className="text-[10px] text-purple-700">Technician reported high voltage wiring.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Switch to POPCIX PRO App */}
        {onSwitchToProMobile && (
          <button
            onClick={onSwitchToProMobile}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs"
            title="Preview Mobile Partner Application"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">POPCIX PRO App</span>
          </button>
        )}

        {/* Admin Avatar */}
        <img
          src={adminUser.avatarUrl}
          alt={adminUser.name}
          className="w-8 h-8 rounded-xl object-cover border border-[#CCCCCC]"
        />
      </div>
    </header>
  );
}
