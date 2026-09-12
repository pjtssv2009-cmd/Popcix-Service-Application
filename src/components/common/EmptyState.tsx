/**
 * POPCIX Friendly Empty States
 */

import React from 'react';
import { Button } from './Button';
import { Mascot } from './Mascot';
import { Calendar, Heart, Gift, Bell, Repeat, Search } from 'lucide-react';

export type EmptyType =
  | 'NO_BOOKINGS'
  | 'NO_FAVORITES'
  | 'NO_REWARDS'
  | 'NO_NOTIFICATIONS'
  | 'NO_RECURRING'
  | 'NO_SEARCH_RESULTS';

export interface EmptyStateProps {
  type: EmptyType;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  const configs = {
    NO_BOOKINGS: {
      icon: <Calendar className="w-8 h-8 text-[#7C3AED]" />,
      defaultTitle: 'No Bookings Yet',
      defaultDesc: 'Your home is all clean and sorted! When you need a pro, book in seconds.',
      defaultAction: 'Explore Services',
    },
    NO_FAVORITES: {
      icon: <Heart className="w-8 h-8 text-[#FF5757]" />,
      defaultTitle: 'No Favorites Saved',
      defaultDesc: 'Tap the heart icon on any service to quickly rebook it anytime.',
      defaultAction: 'Find Services',
    },
    NO_REWARDS: {
      icon: <Gift className="w-8 h-8 text-[#FFAA00]" />,
      defaultTitle: 'No Unclaimed Rewards',
      defaultDesc: 'Complete bookings and maintain your daily streak to earn POPCIX points & unlock vouchers.',
      defaultAction: 'View Daily Quests',
    },
    NO_NOTIFICATIONS: {
      icon: <Bell className="w-8 h-8 text-[#0284C7]" />,
      defaultTitle: 'All Caught Up! 🔔',
      defaultDesc: 'No new updates or alerts right now. We will notify you when a pro is on the way.',
      defaultAction: 'Go to Home',
    },
    NO_RECURRING: {
      icon: <Repeat className="w-8 h-8 text-[#10B981]" />,
      defaultTitle: 'No Recurring Routines',
      defaultDesc: 'Put your home care on autopilot! Schedule regular weekly or monthly visits and save 15%.',
      defaultAction: 'Setup a Routine',
    },
    NO_SEARCH_RESULTS: {
      icon: <Search className="w-8 h-8 text-[#6B6B6B]" />,
      defaultTitle: 'No Matching Services Found',
      defaultDesc: 'Try checking for typos or ask POPCIX Sparky to diagnose what your home needs.',
      defaultAction: 'Ask AI Assistant',
    },
  };

  const current = configs[type];

  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center bg-white rounded-3xl border border-[#EAEAE4] shadow-sm max-w-md mx-auto my-6 ${className}`}>
      <Mascot mood="happy" size={100} className="mb-4" />
      <div className="p-3 bg-[#F8F8F5] rounded-full mb-3 border border-[#EAEAE4]">
        {current.icon}
      </div>
      <h3 className="text-xl font-extrabold text-[#111111] mb-2 tracking-tight">
        {title || current.defaultTitle}
      </h3>
      <p className="text-sm font-medium text-[#6B6B6B] leading-relaxed mb-6 max-w-xs">
        {description || current.defaultDesc}
      </p>
      {onAction && (
        <Button variant="primary" size="lg" onClick={onAction}>
          {actionText || current.defaultAction}
        </Button>
      )}
    </div>
  );
};
