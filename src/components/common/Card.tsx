/**
 * POPCIX Design System - Soft Rounded Card
 */

import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'muted' | 'outline' | 'accent-violet' | 'accent-amber' | 'accent-coral' | 'accent-emerald';
  rounded?: 'lg' | 'xl' | '2xl' | '3xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  isInteractive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  rounded = '2xl',
  padding = 'lg',
  isInteractive = false,
  className = '',
  ...props
}) => {
  const roundedStyles = {
    lg: 'rounded-2xl',
    xl: 'rounded-[20px]',
    '2xl': 'rounded-[26px]',
    '3xl': 'rounded-[32px]',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  };

  const variantStyles = {
    surface: 'bg-white border border-[#EAEAE4] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.04)]',
    muted: 'bg-[#F1F1ED] border border-[#EAEAE4]',
    outline: 'bg-transparent border-2 border-[#DFDFD6]',
    'accent-violet': 'bg-[#F5F3FF] border border-[#DDD6FE]',
    'accent-amber': 'bg-[#FFFBEB] border border-[#FDE68A]',
    'accent-coral': 'bg-[#FEF2F2] border border-[#FECACA]',
    'accent-emerald': 'bg-[#ECFDF5] border border-[#A7F3D0]',
  };

  const interactiveStyles = isInteractive
    ? 'transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.08)] active:scale-[0.98] cursor-pointer'
    : '';

  return (
    <div
      className={`${roundedStyles[rounded]} ${paddingStyles[padding]} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
