/**
 * POPCIX ADMIN - Desktop Sidebar Navigation
 * Collapsible, structured into clear functional groups with real-time operational badge counts.
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  CalendarCheck, 
  Users, 
  ShieldCheck, 
  Wrench, 
  MapPin, 
  CreditCard, 
  DollarSign, 
  RotateCcw, 
  Headphones, 
  AlertTriangle, 
  Star, 
  Trophy, 
  Bell, 
  BarChart3, 
  FileText, 
  Sliders, 
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import brandMonogram from '../../assets/branding/logo-dark-square.png';
import { useAdminData } from '../context/AdminDataContext';

export type AdminTab = 
  | 'dashboard'
  | 'live-ops'
  | 'bookings'
  | 'customers'
  | 'professionals'
  | 'kyc'
  | 'services'
  | 'zones'
  | 'payments'
  | 'payouts'
  | 'refunds'
  | 'support'
  | 'disputes'
  | 'reviews'
  | 'gamification'
  | 'notifications'
  | 'analytics'
  | 'audit-logs'
  | 'feature-flags'
  | 'settings';

interface POPCIXAdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function POPCIXAdminSidebar({
  currentTab,
  onSelectTab,
  collapsed,
  onToggleCollapse
}: POPCIXAdminSidebarProps) {
  const { kycApplications, bookings, supportTickets, disputes, refunds } = useAdminData();

  const pendingKycCount = kycApplications.filter(k => k.status === 'PENDING' || k.status === 'UNDER_REVIEW').length;
  const searchingBookingsCount = bookings.filter(b => b.status === 'SEARCHING' || b.status === 'PENDING').length;
  const openTicketsCount = supportTickets.filter(t => t.status === 'OPEN').length;
  const openDisputesCount = disputes.filter(d => d.status !== 'RESOLVED').length;
  const requestedRefundsCount = refunds.filter(r => r.status === 'REQUESTED').length;

  const navGroups: {
    title: string;
    items: { key: AdminTab; label: string; icon: React.ReactNode; badge?: number; badgeColor?: string }[];
  }[] = [
    {
      title: 'OPERATIONS',
      items: [
        { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { key: 'live-ops', label: 'Live Operations', icon: <Radio className="w-4 h-4 text-emerald-500 animate-pulse" /> },
        { key: 'bookings', label: 'Bookings', icon: <CalendarCheck className="w-4 h-4" />, badge: searchingBookingsCount > 0 ? searchingBookingsCount : undefined, badgeColor: 'bg-amber-500' },
        { key: 'kyc', label: 'KYC Verification', icon: <ShieldCheck className="w-4 h-4" />, badge: pendingKycCount > 0 ? pendingKycCount : undefined, badgeColor: 'bg-rose-500' },
        { key: 'professionals', label: 'Professionals', icon: <Users className="w-4 h-4" /> },
        { key: 'customers', label: 'Customers', icon: <Users className="w-4 h-4 text-zinc-400" /> }
      ]
    },
    {
      title: 'CATALOGUE & ZONES',
      items: [
        { key: 'services', label: 'Services & Pricing', icon: <Wrench className="w-4 h-4" /> },
        { key: 'zones', label: 'Service Zones', icon: <MapPin className="w-4 h-4" /> }
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { key: 'payments', label: 'Payments', icon: <CreditCard className="w-4 h-4" /> },
        { key: 'payouts', label: 'Friday Payouts', icon: <DollarSign className="w-4 h-4" /> },
        { key: 'refunds', label: 'Refund Requests', icon: <RotateCcw className="w-4 h-4" />, badge: requestedRefundsCount > 0 ? requestedRefundsCount : undefined, badgeColor: 'bg-amber-500' }
      ]
    },
    {
      title: 'SUPPORT & REWARDS',
      items: [
        { key: 'support', label: 'Support Desk', icon: <Headphones className="w-4 h-4" />, badge: openTicketsCount > 0 ? openTicketsCount : undefined, badgeColor: 'bg-indigo-500' },
        { key: 'disputes', label: 'Dispute Center', icon: <AlertTriangle className="w-4 h-4" />, badge: openDisputesCount > 0 ? openDisputesCount : undefined, badgeColor: 'bg-rose-500' },
        { key: 'reviews', label: 'Reviews & Ratings', icon: <Star className="w-4 h-4" /> },
        { key: 'gamification', label: 'Gamification Rules', icon: <Trophy className="w-4 h-4" /> }
      ]
    },
    {
      title: 'SYSTEM & ANALYTICS',
      items: [
        { key: 'notifications', label: 'Broadcasts', icon: <Bell className="w-4 h-4" /> },
        { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { key: 'audit-logs', label: 'Audit Logs', icon: <FileText className="w-4 h-4" /> },
        { key: 'feature-flags', label: 'Feature Flags', icon: <Layers className="w-4 h-4" /> },
        { key: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> }
      ]
    }
  ];

  return (
    <aside
      className={`bg-white border-r border-[#E5E5E0] flex flex-col transition-all duration-200 shrink-0 select-none ${
        collapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-[#E5E5E0] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={brandMonogram}
            alt="POPCIX"
            className="w-8 h-8 rounded-lg object-contain border border-[#E5E5E0] shrink-0"
          />
          {!collapsed && (
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-[#111111] tracking-tight">POPCIX</span>
                <span className="px-1.5 py-0.2 rounded-md bg-black text-white text-[10px] font-bold">ADMIN</span>
              </div>
              <span className="text-[10px] text-[#6B6B6B] block">Central Operations</span>
            </div>
          )}
        </div>

        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-lg bg-[#F8F8F5] text-[#555555] hover:bg-[#EBEBE6] flex items-center justify-center transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav Items List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx}>
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-1">
                {group.title}
              </h4>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = currentTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onSelectTab(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-black text-white shadow-xs'
                        : 'text-[#555555] hover:bg-[#F8F8F5] hover:text-black'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    {!collapsed && (
                      <span className="flex-1 text-left truncate">{item.label}</span>
                    )}
                    {item.badge !== undefined && (
                      <span
                        className={`${
                          item.badgeColor || 'bg-black'
                        } text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shrink-0 ${
                          collapsed ? 'absolute top-1 right-1' : ''
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Pro Partner Badge */}
      <div className="p-3 border-t border-[#E5E5E0] bg-[#F8F8F5]">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-[#6B6B6B]">Engine: v2.6.4</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Gateway
            </span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
