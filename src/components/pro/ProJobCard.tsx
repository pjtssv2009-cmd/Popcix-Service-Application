/**
 * POPCIX PRO - Job Card Component
 * High-contrast, interactive job card for job lists, radar dispatch, and status tracking.
 */

import React from 'react';
import { ProJob } from '../../types/pro';

interface ProJobCardProps {
  job: ProJob;
  onAccept?: (jobId: string) => void;
  onDecline?: (jobId: string) => void;
  onOpenDetails?: (job: ProJob) => void;
}

export function ProJobCard({ job, onAccept, onDecline, onOpenDetails }: ProJobCardProps) {
  const isRadar = job.status === 'BROADCAST_PENDING';
  const isActive = ['ACCEPTED', 'NAVIGATING', 'ARRIVED', 'IN_PROGRESS'].includes(job.status);
  const isCompleted = job.status === 'COMPLETED';

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(job)}
      className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer shadow-xs hover:shadow-md ${
        isRadar
          ? 'border-[#FFAA00] ring-2 ring-[#FFAA00]/20 bg-gradient-to-b from-[#FFFDF5] to-white'
          : isActive
          ? 'border-[#000000] ring-1 ring-black/10'
          : 'border-[#E5E5E0]'
      }`}
    >
      {/* Card Header: Category & Net Payout */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[#F0F0EB] text-[#333333]">
            {job.category}
          </span>
          <span className="text-[11px] font-medium text-[#6B6B6B]">
            #{job.bookingCode}
          </span>
        </div>

        <div className="text-right">
          <div className="text-lg font-black text-[#10B981] leading-none">
            ₹{job.netPayout}
          </div>
          <span className="text-[10px] font-semibold text-[#6B6B6B]">Net Payout</span>
        </div>
      </div>

      {/* Service Title */}
      <h3 className="text-sm font-bold text-[#111111] mb-1 line-clamp-2">
        {job.serviceName}
      </h3>

      {/* Customer Info & Rating */}
      <div className="flex items-center gap-2 text-xs text-[#333333] mb-2.5">
        <span className="font-semibold">{job.customerFirstName}</span>
        <span className="flex items-center text-[#FFAA00] font-bold">
          ⭐ {job.customerRating.toFixed(1)}
        </span>
        <span className="text-[#6B6B6B]">•</span>
        <span className="text-[#6B6B6B] truncate">{job.customerAddressApprox}</span>
      </div>

      {/* Service Meta Specs (Date, Time, Estimated duration) */}
      <div className="grid grid-cols-2 gap-2 bg-[#F8F8F5] rounded-xl p-2.5 text-xs text-[#444444] mb-3">
        <div className="flex items-center gap-1.5">
          <span>🕒</span>
          <span className="font-medium">{job.scheduledDate}, {job.scheduledTime}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>⏱️</span>
          <span className="font-medium">{job.estimatedDurationMin} mins</span>
        </div>
      </div>

      {/* Action Buttons */}
      {isRadar && (
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDecline && onDecline(job.id);
            }}
            className="flex-1 py-2.5 rounded-xl border border-[#E5E5E0] bg-white text-xs font-bold text-[#6B6B6B] hover:bg-[#F5F5F0] transition-colors"
          >
            DECLINE
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAccept && onAccept(job.id);
            }}
            className="flex-2 py-2.5 rounded-xl bg-[#000000] text-white text-xs font-bold hover:bg-[#222222] transition-colors shadow-xs flex items-center justify-center gap-1.5"
          >
            <span>⚡</span>
            <span>ACCEPT JOB (₹{job.netPayout})</span>
          </button>
        </div>
      )}

      {isActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails && onOpenDetails(job);
          }}
          className="w-full py-2.5 rounded-xl bg-[#000000] text-white text-xs font-bold hover:bg-[#222222] transition-colors flex items-center justify-center gap-2 shadow-xs"
        >
          <span>🚀</span>
          <span>
            {job.status === 'ACCEPTED'
              ? 'START NAVIGATION'
              : job.status === 'NAVIGATING'
              ? 'ARRIVED AT CUSTOMER'
              : job.status === 'ARRIVED'
              ? 'ENTER START OTP'
              : 'CONTINUE SERVICE & CHECKLIST'}
          </span>
        </button>
      )}

      {isCompleted && (
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="inline-flex items-center gap-1 text-[#10B981] font-bold">
            ✓ Completed & Paid
          </span>
          <span className="text-[#7C3AED] font-bold">
            +{job.xpEarned || 180} XP Earned
          </span>
        </div>
      )}
    </div>
  );
}
