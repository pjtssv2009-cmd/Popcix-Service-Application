/**
 * POPCIX PRO - Home Dashboard Screen
 * Energetic, gamified hub for service professionals:
 * - Online / Offline toggle
 * - Today's earnings (₹2,450) & 6 jobs completed
 * - AC HERO Level 8 with XP Progress (8,420 / 10,000 XP)
 * - Weekly target (23 / 30 jobs) & 6-Day Streak 🔥
 * - Active radar job alert or active in-progress job banner
 * - Quick shortcuts to Learning Hub, Sparky AI, Safety SOS, and Repeat Customers
 */

import React from 'react';
import { useProAuth } from '../../../context/ProAuthContext';
import { useProMarketplace } from '../../../context/ProMarketplaceContext';
import { useProGamification } from '../../../context/ProGamificationContext';
import { ProEarningsCard } from '../../../components/pro/ProEarningsCard';
import { ProJobCard } from '../../../components/pro/ProJobCard';
import { ProJob } from '../../../types/pro';

interface ProHomeScreenProps {
  onOpenActiveJobModal: (job: ProJob) => void;
  onNavigateToTab: (tab: 'jobs' | 'earnings' | 'rewards' | 'profile') => void;
  onOpenKYCModal: () => void;
  onOpenLearningModal: () => void;
  onOpenSafetyModal: () => void;
  onOpenAIModal: () => void;
}

export function ProHomeScreen({
  onOpenActiveJobModal,
  onNavigateToTab,
  onOpenKYCModal,
  onOpenLearningModal,
  onOpenSafetyModal,
  onOpenAIModal
}: ProHomeScreenProps) {
  const { proProfile, isOnline, toggleAvailability } = useProAuth();
  const {
    jobs,
    incomingRadarJob,
    activeJob,
    acceptJob,
    declineJob,
    triggerSimulatedJobRadar
  } = useProMarketplace();
  const { xp, level, streakDays, weeklyCompletedJobs, weeklyTargetJobs } = useProGamification();

  const isKycApproved = proProfile.kycStatus === 'APPROVED';

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-4 max-w-md mx-auto">
      {/* KYC Alert if not verified */}
      {!isKycApproved && (
        <div className="bg-[#FFFDF5] border border-[#FFAA00] rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="text-xs font-bold text-[#111111]">KYC Verification Required</h4>
              <p className="text-[11px] text-[#6B6B6B]">Complete 10-step profile to unlock all jobs & payouts.</p>
            </div>
          </div>
          <button
            onClick={onOpenKYCModal}
            className="px-3 py-1.5 rounded-xl bg-[#000000] text-white text-[11px] font-bold shrink-0"
          >
            Finish KYC
          </button>
        </div>
      )}

      {/* Hero Gamification Card: "AC HERO" Level 8 */}
      <div className="bg-[#000000] text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
        {/* Background glow circle */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#7C3AED]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFAA00] text-[#000000]">
              {level}
            </span>
            <span className="text-xs font-bold text-white/80">Level 8</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-bold bg-white/15 px-2.5 py-1 rounded-full border border-white/10">
            <span>🔥</span>
            <span>{streakDays}-Day Streak</span>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-4 relative z-10">
          <div className="flex items-baseline justify-between text-xs mb-1.5">
            <span className="text-white/80 font-medium">XP Progression</span>
            <span className="font-bold text-[#FFAA00]">
              {xp.toLocaleString()} / 10,000 XP
            </span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FFAA00] to-[#10B981] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (xp / 10000) * 100)}%` }}
            />
          </div>
        </div>

        {/* Quick Goal & Status */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs text-white/90 relative z-10">
          <div className="flex items-center gap-1.5">
            <span>🎯</span>
            <span>Weekly Target: <strong>{weeklyCompletedJobs}/{weeklyTargetJobs}</strong> jobs</span>
          </div>
          <button
            onClick={() => onNavigateToTab('rewards')}
            className="text-[#FFAA00] font-bold text-[11px] hover:underline"
          >
            View Perks →
          </button>
        </div>
      </div>

      {/* Offline Alert if pro is offline */}
      {!isOnline && (
        <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">😴</div>
          <h3 className="text-sm font-bold text-[#92400E]">You're currently Offline</h3>
          <p className="text-xs text-[#B45309] mb-3">Go online to receive nearby service bookings in Sholinganallur & OMR.</p>
          <button
            onClick={() => toggleAvailability('ONLINE')}
            className="w-full py-2.5 rounded-xl bg-[#10B981] text-white text-xs font-bold hover:bg-[#059669] transition-colors shadow-xs"
          >
            ● GO ONLINE NOW
          </button>
        </div>
      )}

      {/* INCOMING RADAR BROADCAST (High priority alert) */}
      {isOnline && incomingRadarJob && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                ⚡ NEW JOB NEARBY
              </h2>
            </div>
            <span className="text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-md animate-pulse">
              Respond in 45s
            </span>
          </div>
          <ProJobCard
            job={incomingRadarJob}
            onAccept={acceptJob}
            onDecline={declineJob}
            onOpenDetails={onOpenActiveJobModal}
          />
        </div>
      )}

      {/* ACTIVE JOB IN PROGRESS BANNER */}
      {activeJob && (
        <div className="bg-gradient-to-r from-[#111111] to-[#222222] text-white rounded-2xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-[#10B981] text-white">
              {activeJob.status === 'ACCEPTED'
                ? 'JOB CONFIRMED'
                : activeJob.status === 'NAVIGATING'
                ? 'EN ROUTE'
                : activeJob.status === 'ARRIVED'
                ? 'AT DOORSTEP'
                : 'SERVICE IN PROGRESS'}
            </span>
            <span className="text-xs font-bold text-[#10B981]">₹{activeJob.netPayout} Net</span>
          </div>
          <h3 className="text-sm font-bold mb-1 text-white truncate">{activeJob.serviceName}</h3>
          <p className="text-xs text-white/70 mb-3 truncate">Customer: {activeJob.customerFirstName} • {activeJob.customerAddressApprox}</p>
          <button
            onClick={() => onOpenActiveJobModal(activeJob)}
            className="w-full py-2.5 rounded-xl bg-white text-[#000000] text-xs font-black hover:bg-[#F0F0EB] transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <span>🚀</span>
            <span>
              {activeJob.status === 'ACCEPTED'
                ? 'START NAVIGATION'
                : activeJob.status === 'NAVIGATING'
                ? 'ARRIVED AT CUSTOMER'
                : activeJob.status === 'ARRIVED'
                ? 'ENTER START OTP'
                : 'CONTINUE SERVICE & CHECKLIST'}
            </span>
          </button>
        </div>
      )}

      {/* Earnings Overview Card */}
      <ProEarningsCard onViewDetails={() => onNavigateToTab('earnings')} />

      {/* Performance Scorecard */}
      <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mb-3">
          PERFORMANCE METRICS
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="bg-[#F8F8F5] p-2.5 rounded-xl">
            <span className="text-xs">⭐</span>
            <div className="text-sm font-black text-[#111111] mt-0.5">{proProfile.rating}</div>
            <div className="text-[10px] text-[#6B6B6B]">Rating</div>
          </div>
          <div className="bg-[#F8F8F5] p-2.5 rounded-xl">
            <span className="text-xs">🎯</span>
            <div className="text-sm font-black text-[#10B981] mt-0.5">{proProfile.completionRate}%</div>
            <div className="text-[10px] text-[#6B6B6B]">Completed</div>
          </div>
          <div className="bg-[#F8F8F5] p-2.5 rounded-xl">
            <span className="text-xs">⏱️</span>
            <div className="text-sm font-black text-[#000000] mt-0.5">{proProfile.onTimeRate}%</div>
            <div className="text-[10px] text-[#6B6B6B]">On-Time</div>
          </div>
          <div className="bg-[#F8F8F5] p-2.5 rounded-xl">
            <span className="text-xs">💼</span>
            <div className="text-sm font-black text-[#7C3AED] mt-0.5">{proProfile.completedJobsCount}</div>
            <div className="text-[10px] text-[#6B6B6B]">Total Jobs</div>
          </div>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onOpenLearningModal}
          className="bg-white rounded-2xl p-3.5 border border-[#E5E5E0] text-left hover:border-black transition-colors shadow-xs"
        >
          <div className="text-2xl mb-1">🎓</div>
          <h4 className="text-xs font-bold text-[#111111]">Learning Hub</h4>
          <p className="text-[10px] text-[#6B6B6B]">Video lessons & badges</p>
        </button>

        <button
          onClick={onOpenAIModal}
          className="bg-white rounded-2xl p-3.5 border border-[#E5E5E0] text-left hover:border-[#7C3AED] transition-colors shadow-xs"
        >
          <div className="text-2xl mb-1">✨</div>
          <h4 className="text-xs font-bold text-[#7C3AED]">Sparky AI Assistant</h4>
          <p className="text-[10px] text-[#6B6B6B]">Troubleshoot & quotes</p>
        </button>

        <button
          onClick={() => onNavigateToTab('profile')}
          className="bg-white rounded-2xl p-3.5 border border-[#E5E5E0] text-left hover:border-black transition-colors shadow-xs"
        >
          <div className="text-2xl mb-1">❤️</div>
          <h4 className="text-xs font-bold text-[#111111]">Repeat Customers</h4>
          <p className="text-[10px] text-[#6B6B6B]">Manage your clients</p>
        </button>

        <button
          onClick={onOpenSafetyModal}
          className="bg-white rounded-2xl p-3.5 border border-[#E5E5E0] text-left hover:border-[#EF4444] transition-colors shadow-xs"
        >
          <div className="text-2xl mb-1">🛡️</div>
          <h4 className="text-xs font-bold text-[#EF4444]">Safety & Emergency</h4>
          <p className="text-[10px] text-[#6B6B6B]">1-Tap SOS dispatch</p>
        </button>
      </div>

      {/* Simulate Job Radar CTA for interactive prototyping */}
      <div className="pt-2">
        <button
          onClick={triggerSimulatedJobRadar}
          className="w-full py-2.5 rounded-xl bg-[#F0F0EB] text-[#444444] text-xs font-bold hover:bg-[#E5E5E0] transition-colors border border-dashed border-[#CCCCCC] flex items-center justify-center gap-1.5"
        >
          <span>📡</span>
          <span>Simulate Incoming Job Radar</span>
        </button>
      </div>
    </div>
  );
}
