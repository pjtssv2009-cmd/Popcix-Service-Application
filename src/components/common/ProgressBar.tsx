/**
 * POPCIX Design System - Smooth XP & Level Progress Bar
 */

import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: 'sm' | 'md' | 'lg';
  color?: 'violet' | 'amber' | 'emerald' | 'coral' | 'black';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 'md',
  color = 'violet',
  showLabel = false,
  label,
  className = '',
}) => {
  const clamped = Math.max(0, Math.min(100, progress));

  const heightStyles = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5',
  };

  const colorStyles = {
    violet: 'bg-gradient-to-r from-[#7C3AED] to-[#A855F7]',
    amber: 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]',
    emerald: 'bg-gradient-to-r from-[#10B981] to-[#34D399]',
    coral: 'bg-gradient-to-r from-[#EF4444] to-[#F87171]',
    black: 'bg-black',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-bold text-[#6B6B6B] mb-1.5">
          <span>{label || 'Progress'}</span>
          <span>{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-[#EAEAE4] rounded-full overflow-hidden p-0.5 ${heightStyles[height]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out shadow-inner ${colorStyles[color]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
