/**
 * POPCIX ADMIN - Gamification Engine & Rules Configuration Screen
 * Configurable XP points, Level milestones, 6-day streak multipliers, and achievement badges.
 */

import React from 'react';
import { Trophy, Flame, Award, Zap } from 'lucide-react';

interface XPRule {
  id: string;
  triggerEvent: string;
  xpAwarded: number;
  cashBonus?: number;
  description: string;
  isActive: boolean;
}

const XP_RULES: XPRule[] = [
  { id: 'xp_1', triggerEvent: 'First Completed Marketplace Service', xpAwarded: 100, cashBonus: 200, description: 'Awarded when newly verified technician completes 1st job with valid start & completion OTP.', isActive: true },
  { id: 'xp_2', triggerEvent: '10 Completed Services Milestone', xpAwarded: 500, cashBonus: 500, description: 'Cumulative completion milestone for rising technicians.', isActive: true },
  { id: 'xp_3', triggerEvent: '5-Star Customer Rating Milestone', xpAwarded: 100, description: 'Direct quality reward when homeowner submits a 5.0 satisfaction review.', isActive: true },
  { id: 'xp_4', triggerEvent: 'Weekly 30-Job Sprint Goal', xpAwarded: 500, cashBonus: 1000, description: 'Weekly performance incentive for top-tier full-time specialists.', isActive: true },
  { id: 'xp_5', triggerEvent: '7-Day Activity Streak Extended', xpAwarded: 350, description: 'Daily streak bonus for maintaining consistent online availability.', isActive: true }
];

export function AdminGamificationScreen() {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      <div>
        <h2 className="text-xl font-black text-[#111111] tracking-tight">Gamification Rules & Level Milestones</h2>
        <p className="text-xs text-[#6B6B6B]">Configure XP rewards, AC HERO tier thresholds, streaks, and partner badges</p>
      </div>

      {/* Hero Levels Configuration Banner */}
      <div className="bg-[#000000] text-white p-5 rounded-3xl space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFAA00]" />
            <h3 className="font-black text-sm">Active Progression Tiers</h3>
          </div>
          <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded text-white">Dynamic Scale</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {[
            { level: 'Starter', minXp: '0 XP', badge: '🌱' },
            { level: 'Rising Pro', minXp: '2,000 XP', badge: '⭐' },
            { level: 'Skilled Pro', minXp: '4,000 XP', badge: '⚡' },
            { level: 'Expert Pro', minXp: '6,000 XP', badge: '👑' },
            { level: 'AC HERO (Elite)', minXp: '8,000+ XP', badge: '🏆' }
          ].map((tier, idx) => (
            <div key={idx} className="bg-white/10 p-3 rounded-2xl border border-white/10 text-center">
              <div className="text-xl mb-1">{tier.badge}</div>
              <div className="font-bold text-xs">{tier.level}</div>
              <div className="text-[10px] text-[#FFAA00] font-bold mt-0.5">{tier.minXp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Configurable XP Rules List */}
      <div className="bg-white rounded-3xl p-5 border border-[#E5E5E0] shadow-2xs space-y-4">
        <h3 className="text-sm font-black text-[#111111]">Marketplace XP Earning Rules</h3>

        <div className="space-y-3">
          {XP_RULES.map(rule => (
            <div
              key={rule.id}
              className="p-4 rounded-2xl bg-[#F8F8F5] border border-[#EBEBE6] flex flex-wrap items-center justify-between gap-3"
            >
              <div className="space-y-1 flex-1 min-w-[200px]">
                <div className="font-bold text-xs text-[#111111] flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{rule.triggerEvent}</span>
                </div>
                <p className="text-[11px] text-[#6B6B6B]">{rule.description}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="font-black text-sm text-[#7C3AED]">+{rule.xpAwarded} XP</span>
                {rule.cashBonus && (
                  <span className="text-xs font-black text-[#10B981] block">+₹{rule.cashBonus} Cash</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
