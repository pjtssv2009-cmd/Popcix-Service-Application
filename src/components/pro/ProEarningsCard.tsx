/**
 * POPCIX PRO - Earnings Card Component
 * Highlights today's earnings, jobs count, weekly target progress, and next scheduled payout.
 */

import React from 'react';
import { useProMarketplace } from '../../context/ProMarketplaceContext';
import { useProGamification } from '../../context/ProGamificationContext';

interface ProEarningsCardProps {
  onViewDetails?: () => void;
}

export function ProEarningsCard({ onViewDetails }: ProEarningsCardProps) {
  const { earnings } = useProMarketplace();
  const { weeklyCompletedJobs, weeklyTargetJobs } = useProGamification();

  const remainingForGoal = Math.max(0, weeklyTargetJobs - weeklyCompletedJobs);
  const progressPercent = Math.min(100, Math.round((weeklyCompletedJobs / weeklyTargetJobs) * 100));

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">💰</span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">TODAY'S EARNINGS</span>
        </div>
        <button
          onClick={onViewDetails}
          className="text-xs font-bold text-[#000000] hover:underline flex items-center gap-0.5"
        >
          <span>Ledger</span>
          <span>→</span>
        </button>
      </div>

      {/* Big Earnings Amount */}
      <div className="flex items-baseline justify-between mb-3">
        <div>
          <div className="text-3xl font-black text-[#111111] tracking-tight">
            ₹{earnings.todayEarnings.toLocaleString()}
          </div>
          <div className="text-xs text-[#6B6B6B] mt-0.5">
            {earnings.todayJobsCount} jobs completed today
          </div>
        </div>

        <div className="text-right bg-[#10B981]/10 px-3 py-1.5 rounded-xl border border-[#10B981]/20">
          <span className="text-[10px] font-bold text-[#047857] block">NEXT PAYOUT</span>
          <span className="text-xs font-black text-[#047857]">₹{earnings.nextPayoutAmount.toLocaleString()}</span>
          <span className="text-[9px] text-[#047857]/80 block">{earnings.nextPayoutDate}</span>
        </div>
      </div>

      {/* Progress Bar towards weekly goal */}
      <div className="bg-[#F8F8F5] rounded-xl p-3 border border-[#EBEBE6]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-bold text-[#222222]">Weekly Target: {weeklyCompletedJobs}/{weeklyTargetJobs} Jobs</span>
          <span className="font-black text-[#7C3AED]">{progressPercent}%</span>
        </div>
        
        {/* Progress Fill */}
        <div className="w-full bg-[#E5E5E0] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#000000] via-[#7C3AED] to-[#10B981] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#6B6B6B] mt-1.5">
          <span>{remainingForGoal > 0 ? `${remainingForGoal} jobs remaining for +₹1,000 bonus` : '🎉 Goal Achieved!'}</span>
          <span className="font-semibold text-[#111111]">Week: ₹{earnings.thisWeekEarnings.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
