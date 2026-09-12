/**
 * POPCIX ADMIN - Universal Status Badge Component
 * Accessible status indicators for Bookings, KYC Applications, Payments, and Service States.
 */

import React from 'react';

interface POPCIXStatusBadgeProps {
  status: string;
  type?: 'BOOKING' | 'KYC' | 'PAYMENT' | 'GENERIC';
}

export function POPCIXStatusBadge({ status, type = 'GENERIC' }: POPCIXStatusBadgeProps) {
  let bg = 'bg-zinc-100 text-zinc-800 border-zinc-200';
  let dotColor = 'bg-zinc-500';

  const normalized = status.toUpperCase();

  // Booking Statuses
  if (['COMPLETED', 'APPROVED', 'SUCCESS', 'PAID'].includes(normalized)) {
    bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    dotColor = 'bg-emerald-500';
  } else if (['IN_PROGRESS', 'ON_THE_WAY', 'ARRIVED', 'ACCEPTED', 'UNDER_REVIEW', 'PROCESSING'].includes(normalized)) {
    bg = 'bg-indigo-50 text-indigo-800 border-indigo-200';
    dotColor = 'bg-indigo-500';
  } else if (['SEARCHING', 'PENDING', 'REQUESTED', 'WAITING'].includes(normalized)) {
    bg = 'bg-amber-50 text-amber-800 border-amber-200';
    dotColor = 'bg-amber-500';
  } else if (['CANCELLED', 'REJECTED', 'FAILED', 'DISPUTED'].includes(normalized)) {
    bg = 'bg-rose-50 text-rose-800 border-rose-200';
    dotColor = 'bg-rose-500';
  } else if (['REFUNDED', 'NEEDS_ACTION'].includes(normalized)) {
    bg = 'bg-purple-50 text-purple-800 border-purple-200';
    dotColor = 'bg-purple-500';
  }

  const formattedText = status.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{formattedText}</span>
    </span>
  );
}
