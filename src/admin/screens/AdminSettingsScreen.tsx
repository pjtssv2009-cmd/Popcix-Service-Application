/**
 * POPCIX ADMIN - Settings & Feature Flags Control Screen
 * Global platform configurations, feature switches, commission thresholds, and security controls.
 */

import React from 'react';
import { useAdminData } from '../context/AdminDataContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { Sliders, Layers, ShieldCheck, Key } from 'lucide-react';

export function AdminSettingsScreen() {
  const { featureFlags, toggleFeatureFlag } = useAdminData();
  const { hasPermission } = useAdminAuth();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Platform Settings & Feature Flags</h2>
        <p className="text-xs text-[#6B6B6B]">Global toggles, deployment flags, and marketplace configuration</p>
      </div>

      {/* Feature Flags Section */}
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

      {/* Security & Infrastructure Info */}
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
    </div>
  );
}
