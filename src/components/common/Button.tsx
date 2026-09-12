/**
 * POPCIX Design System - Tactile Rounded Button
 */

import React, { ButtonHTMLAttributes } from 'react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  haptic?: 'light' | 'medium' | 'heavy' | 'success';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  haptic = 'light',
  className = '',
  disabled,
  onClick,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    triggerHaptic(haptic);
    playSoundEffect('pop');
    if (onClick) onClick(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-full select-none transition-all duration-150 active:scale-[0.97] focus:outline-none disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
    xl: 'px-7 py-4 text-lg font-bold gap-3',
  };

  const variantStyles = {
    primary:
      'bg-[#000000] text-white hover:bg-[#1A1A1A] active:bg-[#2D2D2D] shadow-sm',
    secondary:
      'bg-[#F1F1ED] text-[#111111] hover:bg-[#EAEAE4] active:bg-[#DFDFD6]',
    outline:
      'border-2 border-[#111111] text-[#111111] bg-transparent hover:bg-black/5 active:bg-black/10',
    accent:
      'bg-[#7C3AED] text-white hover:bg-[#6D28D9] active:bg-[#5B21B6] shadow-sm',
    ghost:
      'bg-transparent text-[#111111] hover:bg-black/5 active:bg-black/10',
    danger:
      'bg-[#FF5757] text-white hover:bg-[#EE4444] active:bg-[#DD3333]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
