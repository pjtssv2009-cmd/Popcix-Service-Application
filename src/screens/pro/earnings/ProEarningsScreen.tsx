/**
 * POPCIX PRO - Earnings & Payout Ledger Screen
 * Detailed transparent financial hub:
 * - Today (₹2,450), Week (₹13,800), Month (₹52,400), Lifetime (₹8,42,600)
 * - Transparent itemized breakdown (Base, Add-ons, Bonuses, Tips, Fees)
 * - Available, Pending, and Paid balances
 * - Scheduled Friday payout (₹8,420) & verified bank account
 * - Payout history with IMPS reference IDs and statement download simulation
 */

import React, { useState } from 'react';
import { useProMarketplace } from '../../../context/ProMarketplaceContext';
import { useProAuth } from '../../../context/ProAuthContext';

export function ProEarningsScreen() {
  const { earnings, payouts } = useProMarketplace();
  const { proProfile } = useProAuth();
  const [statementDownloaded, setStatementDownloaded] = useState(false);

  const handleDownloadStatement = () => {
    setStatementDownloaded(true);
    setTimeout(() => setStatementDownloaded(false), 3000);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-4 max-w-md mx-auto">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-[#111111]">Earnings & Payouts</h1>
          <p className="text-xs text-[#6B6B6B]">Transparent Ledger & Bank Settlement</p>
        </div>
        <button
          onClick={handleDownloadStatement}
          className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white border border-[#E5E5E0] text-[#111111] hover:bg-[#F8F8F5] transition-colors shadow-2xs"
        >
          {statementDownloaded ? '✓ Downloaded' : '📥 Statement'}
        </button>
      </div>

      {/* Hero Summary Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#000000] text-white p-4 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block mb-1">
            TODAY
          </span>
          <div className="text-2xl font-black tracking-tight text-[#10B981]">
            ₹{earnings.todayEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-white/60 mt-0.5 block">
            {earnings.todayJobsCount} completed jobs
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E0] shadow-xs">
          <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
            THIS WEEK
          </span>
          <div className="text-2xl font-black tracking-tight text-[#111111]">
            ₹{earnings.thisWeekEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#10B981] font-semibold mt-0.5 block">
            +18% vs last week
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E0] shadow-xs">
          <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
            THIS MONTH
          </span>
          <div className="text-xl font-black tracking-tight text-[#111111]">
            ₹{earnings.thisMonthEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#6B6B6B] mt-0.5 block">
            September 2026
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#E5E5E0] shadow-xs">
          <span className="text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block mb-1">
            LIFETIME EARNED
          </span>
          <div className="text-xl font-black tracking-tight text-[#7C3AED]">
            ₹{earnings.lifetimeEarnings.toLocaleString()}
          </div>
          <span className="text-[11px] text-[#6B6B6B] mt-0.5 block">
            1,284 total jobs
          </span>
        </div>
      </div>

      {/* Next Payout & Bank Account Card */}
      <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] border border-[#86EFAC] rounded-3xl p-4.5 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏦</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#065F46]">
              SCHEDULED PAYOUT
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#047857]">
            AUTO-TRANSFER
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-3">
          <div>
            <div className="text-3xl font-black text-[#065F46]">
              ₹{earnings.nextPayoutAmount.toLocaleString()}
            </div>
            <span className="text-xs text-[#047857] font-medium">
              Disbursing on {earnings.nextPayoutDate}
            </span>
          </div>
        </div>

        {/* Masked Bank Details */}
        <div className="bg-white/80 backdrop-blur-xs rounded-xl p-3 border border-[#86EFAC]/50 text-xs text-[#111111]">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold">{proProfile.bankDetails.bankName}</span>
            <span className="text-[10px] font-bold text-[#047857]">✓ Verified</span>
          </div>
          <div className="text-[#6B6B6B] flex items-center justify-between text-[11px]">
            <span>A/C: {proProfile.bankDetails.accountNumberMasked}</span>
            <span>IFSC: {proProfile.bankDetails.ifscCode}</span>
          </div>
          {proProfile.bankDetails.upiId && (
            <div className="text-[#6B6B6B] text-[11px] pt-1 mt-1 border-t border-black/5">
              UPI: {proProfile.bankDetails.upiId}
            </div>
          )}
        </div>
      </div>

      {/* Itemized Weekly Breakdown */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-3">
          WEEKLY REVENUE BREAKDOWN
        </h3>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-[#333333]">
            <span>Base Service Bookings</span>
            <span className="font-semibold">₹{earnings.breakdown.baseEarnings.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#333333]">
            <span>Customer-Approved Add-ons</span>
            <span className="font-semibold text-[#10B981]">+₹{earnings.breakdown.addons.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#333333]">
            <span>Weekly Target Bonuses</span>
            <span className="font-semibold text-[#7C3AED]">+₹{earnings.breakdown.bonuses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#333333]">
            <span>Customer Direct Tips (100% to Pro)</span>
            <span className="font-semibold text-[#FFAA00]">+₹{earnings.breakdown.tips.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#333333]">
            <span>Peak Hour & Streak Incentives</span>
            <span className="font-semibold text-[#10B981]">+₹{earnings.breakdown.incentives.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[#6B6B6B]">
            <span>POPCIX Tech & Insurance Platform Fee</span>
            <span className="font-semibold text-[#EF4444]">-₹{earnings.breakdown.platformFees.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-black text-sm text-[#111111] pt-2.5 border-t border-[#E5E5E0]">
            <span>Net Weekly Earnings</span>
            <span>₹{earnings.thisWeekEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Payout History Ledger */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-3">
          PAST BANK TRANSFERS
        </h3>
        <div className="space-y-3">
          {payouts.map(tx => (
            <div
              key={tx.id}
              className="p-3 rounded-xl bg-[#F8F8F5] border border-[#EBEBE6] flex items-center justify-between text-xs"
            >
              <div>
                <div className="font-bold text-[#111111]">{tx.payoutDate}</div>
                <div className="text-[10px] text-[#6B6B6B]">{tx.referenceId}</div>
                <div className="text-[10px] text-[#047857] font-semibold mt-0.5">
                  ✓ Transferred to {tx.bankAccountMasked}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black text-[#111111]">
                  ₹{tx.amount.toLocaleString()}
                </div>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-[#10B981]/15 text-[#047857]">
                  PAID
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
