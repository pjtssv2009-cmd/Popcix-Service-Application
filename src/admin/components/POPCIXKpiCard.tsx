/**
 * POPCIX ADMIN - KPI Metric Card Component
 * Highlights high-level business indicators with period comparisons and visual trends.
 */

import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface POPCIXKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  changePercent?: number;
  changeLabel?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  accentColor?: string;
  onClick?: () => void;
}

export function POPCIXKpiCard({
  title,
  value,
  subtitle,
  changePercent,
  changeLabel = 'vs last week',
  isPositive = true,
  icon,
  onClick
}: POPCIXKpiCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl p-5 border border-[#E5E5E0] shadow-2xs hover:shadow-md transition-all ${
        onClick ? 'cursor-pointer hover:border-black' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-xl bg-[#F8F8F5] border border-[#EBEBE6] flex items-center justify-center text-[#444444]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
          {value}
        </div>

        {changePercent !== undefined && (
          <div
            className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
            <span>{Math.abs(changePercent)}%</span>
          </div>
        )}
      </div>

      <div className="text-[11px] text-[#888888] mt-1.5 flex items-center justify-between">
        <span>{subtitle || changeLabel}</span>
      </div>
    </div>
  );
}
