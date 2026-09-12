/**
 * POPCIX ADMIN - Settings & Feature Flags Control Screen
 * Global platform configurations, feature switches, commission thresholds, security controls,
 * and Interactive Role & Feature Permissions Matrix Manager.
 */

import React, { useState } from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth, ROLE_METADATA } from '../context/AdminAuthContext';
import { AdminRole, AdminTab } from '../types/admin';
import { Sliders, Layers, ShieldCheck, Key, Shield, CheckCircle2, Lock, ArrowRight, Check, X } from 'lucide-react';

export function AdminSettingsScreen() {
  const { featureFlags, toggleFeatureFlag } = useAdminData();
  const { hasPermission, currentRole, setRole } = useAdminAuth();

  const [activeSettingsTab, setActiveSettingsTab] = useState<'flags' | 'rbac-matrix' | 'security'>('rbac-matrix');
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<AdminRole>(currentRole);

  const allRoles = Object.keys(ROLE_METADATA) as AdminRole[];
  const selectedMeta = ROLE_METADATA[selectedRoleForDetail];

  const allFeatures: { key: AdminTab; label: string; group: string }[] = [
    { key: 'dashboard', label: 'Executive Dashboard', group: 'Operations' },
    { key: 'live-ops', label: 'Live Operations & GPS Radar', group: 'Operations' },
    { key: 'bookings', label: 'Bookings Dispatch Lifecycle', group: 'Operations' },
    { key: 'kyc', label: 'KYC Document Verification', group: 'Compliance' },
    { key: 'professionals', label: 'Professionals Directory', group: 'Partners' },
    { key: 'customers', label: 'Customer Directory & CRM', group: 'Customers' },
    { key: 'services', label: 'Services Catalogue & Pricing', group: 'Catalogue' },
    { key: 'zones', label: 'Service Zones & Geo-fencing', group: 'Catalogue' },
    { key: 'payments', label: 'Payments Ledger', group: 'Finance' },
    { key: 'payouts', label: 'Friday Partner Payouts', group: 'Finance' },
    { key: 'refunds', label: 'Refund Processing', group: 'Finance' },
    { key: 'support', label: 'Support Desk & Tickets', group: 'Support' },
    { key: 'disputes', label: 'Dispute Resolution Center', group: 'Support' },
    { key: 'reviews', label: 'Reviews Moderation', group: 'Support' },
    { key: 'gamification', label: 'Gamification & XP Rules', group: 'Engagement' },
    { key: 'notifications', label: 'Broadcast Push Notifications', group: 'Engagement' },
    { key: 'analytics', label: 'Analytics Studio', group: 'Analytics' },
    { key: 'audit-logs', label: 'Immutable Audit Logs', group: 'Security' },
    { key: 'feature-flags', label: 'System Feature Flags', group: 'Security' },
    { key: 'settings', label: 'Platform Settings & RBAC', group: 'Security' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Platform Settings & Role Entitlements</h2>
        <p className="text-xs text-[#6B6B6B]">Role-based feature assignments, deployment flags, and security controls</p>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5E5E0] pb-2">
        <button
          onClick={() => setActiveSettingsTab('rbac-matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSettingsTab === 'rbac-matrix' ? 'bg-black text-white shadow-xs' : 'bg-white border text-[#6B6B6B] hover:text-black'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Role & Feature Matrix</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('flags')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSettingsTab === 'flags' ? 'bg-black text-white shadow-xs' : 'bg-white border text-[#6B6B6B] hover:text-black'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Feature Flags ({featureFlags.length})</span>
        </button>

        <button
          onClick={() => setActiveSettingsTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSettingsTab === 'security' ? 'bg-black text-white shadow-xs' : 'bg-white border text-[#6B6B6B] hover:text-black'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security & Infrastructure</span>
        </button>
      </div>

      {/* RBAC Role & Feature Matrix View */}
      {activeSettingsTab === 'rbac-matrix' && (
        <div className="space-y-6">
          {/* Role Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {allRoles.map(roleKey => {
              const meta = ROLE_METADATA[roleKey];
              const isCurrent = currentRole === roleKey;
              const isSelectedForInspection = selectedRoleForDetail === roleKey;

              return (
                <div
                  key={roleKey}
                  onClick={() => setSelectedRoleForDetail(roleKey)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelectedForInspection
                      ? 'bg-white border-black shadow-md ring-2 ring-black'
                      : 'bg-white border-[#E5E5E0] hover:border-[#CCCCCC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${meta.badgeColor}`}>
                      {meta.badge}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="font-black text-xs text-[#111111] truncate">{meta.label}</div>
                  <div className="text-[10px] text-[#6B6B6B] truncate mt-0.5">{meta.primaryDomain}</div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F0F0EB] text-[10px]">
                    <span className="font-bold text-[#555555]">{meta.allowedTabs.length} Features</span>
                    {currentRole !== roleKey && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRole(roleKey);
                        }}
                        className="font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
                      >
                        <span>Activate</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Feature Breakdown for Selected Role */}
          {selectedMeta && (
            <div className="bg-white rounded-3xl p-6 border border-[#E5E5E0] shadow-2xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F0F0EB]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-[#111111]">{selectedMeta.label}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${selectedMeta.badgeColor}`}>
                      {selectedMeta.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">{selectedMeta.department} • {selectedMeta.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  {currentRole !== selectedRoleForDetail ? (
                    <button
                      onClick={() => setRole(selectedRoleForDetail)}
                      className="px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Switch to this Role</span>
                    </button>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Currently Active in Dashboard</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Feature Grid: Assigned vs Restricted */}
              <div>
                <h4 className="text-xs font-bold text-[#888888] uppercase tracking-wider mb-3">
                  All 20 Platform Features Status for {selectedMeta.label}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {allFeatures.map(feat => {
                    const isAllowed = selectedMeta.allowedTabs.includes(feat.key);

                    return (
                      <div
                        key={feat.key}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                          isAllowed
                            ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#14532D]'
                            : 'bg-[#FDF2F2] border-[#FECACA] text-[#7F1D1D] opacity-75'
                        }`}
                      >
                        <div className="truncate">
                          <div className="font-bold truncate">{feat.label}</div>
                          <div className="text-[10px] opacity-75">{feat.group}</div>
                        </div>

                        {isAllowed ? (
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0" title="Assigned Feature">
                            <Check className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0" title="Restricted Feature">
                            <Lock className="w-3 h-3 text-[#DC2626]" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Capabilities vs Prohibited Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0] space-y-2">
                  <div className="text-xs font-bold text-[#166534] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Key Capabilities Permitted ({selectedMeta.keyCapabilities.length})</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#14532D]">
                    {selectedMeta.keyCapabilities.map((cap, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] space-y-2">
                  <div className="text-xs font-bold text-[#991B1B] flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-[#DC2626]" />
                    <span>Restricted Operational Scope ({selectedMeta.restrictedCapabilities.length})</span>
                  </div>
                  {selectedMeta.restrictedCapabilities.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-[#7F1D1D]">
                      {selectedMeta.restrictedCapabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#7F1D1D] italic">
                      Super Administrator: Full unrestricted ecosystem control.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feature Flags Section */}
      {activeSettingsTab === 'flags' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E5E5E0] shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F0F0EB]">
            <Layers className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-black text-sm text-[#111111]">Active Feature Flags & Rollouts</h3>
              <p className="text-[11px] text-[#6B6B6B]">Dynamic feature switching without application redeployment</p>
            </div>
          </div>

          <div className="space-y-3">
            {featureFlags.map(flag => (
              <div
                key={flag.key}
                className="p-4 bg-[#F8F8F5] rounded-2xl border border-[#EBEBE6] flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#111111]">{flag.title}</span>
                    <span className="font-mono text-[10px] text-[#888888]">({flag.key})</span>
                  </div>
                  <p className="text-[11px] text-[#6B6B6B]">{flag.description}</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white border text-[#555555]">
                    Target: {flag.targetAudience}
                  </span>
                </div>

                <button
                  disabled={!hasPermission('TOGGLE_FEATURE_FLAGS')}
                  onClick={() => toggleFeatureFlag(flag.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                    flag.enabled
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {flag.enabled ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security & Infrastructure Info */}
      {activeSettingsTab === 'security' && (
        <div className="bg-white rounded-3xl p-6 border border-[#E5E5E0] shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-[#F0F0EB]">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-black text-sm text-[#111111]">Database & Authentication Security</h3>
              <p className="text-[11px] text-[#6B6B6B]">Row-Level Security (RLS) & Upstash Redis Rate Limiting Active</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#F8F8F5] rounded-2xl border border-[#EBEBE6] space-y-1.5">
              <div className="font-bold text-[#111111]">Supabase PostgreSQL Engine</div>
              <p className="text-[11px] text-[#6B6B6B]">18 Tables protected by strict RLS policies ensuring isolated professional document & booking access.</p>
              <span className="text-[10px] font-bold text-emerald-700">✓ RLS Active</span>
            </div>

            <div className="p-4 bg-[#F8F8F5] rounded-2xl border border-[#EBEBE6] space-y-1.5">
              <div className="font-bold text-[#111111]">Upstash Redis Rate Limiting</div>
              <p className="text-[11px] text-[#6B6B6B]">Per-IP rate limits enforced on OTP endpoints, password resets, and refund operations.</p>
              <span className="text-[10px] font-bold text-emerald-700">✓ Rate Limiter Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
