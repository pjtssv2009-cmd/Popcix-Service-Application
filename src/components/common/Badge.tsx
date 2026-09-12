/**
 * POPCIX Design System - Energetic Rounded Badge
 */

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'black' | 'violet' | 'amber' | 'emerald' | 'coral' | 'sky' | 'muted';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'black',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] font-bold gap-1',
    md: 'px-2.5 py-1 text-xs font-bold gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm font-extrabold gap-2',
  };

  const variantStyles = {
    black: 'bg-black text-white',
    violet: 'bg-[#7C3AED] text-white',
    amber: 'bg-[#FFAA00] text-black',
    emerald: 'bg-[#10B981] text-white',
    coral: 'bg-[#FF5757] text-white',
    sky: 'bg-[#0284C7] text-white',
    muted: 'bg-[#EAEAE4] text-[#444444]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full tracking-wide select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
