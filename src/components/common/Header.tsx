/**
 * POPCIX App Header Component
 * Personalized greeting, address selector, streak indicator, points balance, and notifications.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { MapPin, Bell, Sparkles, Flame, ChevronDown } from 'lucide-react';
import { triggerHaptic } from '../../theme/haptics';

export const Header: React.FC = () => {
  const { profile } = useAuth();
  const { streak, points } = useGamification();
  const { openModal, unreadNotificationsCount, addresses } = useMarketplace();

  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="sticky top-0 z-30 bg-[#F8F8F5]/90 backdrop-blur-md border-b border-[#EAEAE4] px-4 pt-3 pb-3">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Left: Location & Greeting */}
        <div className="flex flex-col min-w-0">
          <button
            onClick={() => {
              triggerHaptic('light');
              openModal('address-manager');
            }}
            className="flex items-center gap-1.5 text-left group"
          >
            <div className="w-5 h-5 rounded-full bg-black/5 flex items-center justify-center shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#111111]" />
            </div>
            <span className="text-xs font-bold text-[#111111] truncate max-w-[140px]">
              {defaultAddr?.streetAddress || 'Bengaluru, India'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B6B6B] shrink-0 group-hover:translate-y-0.5 transition-transform" />
          </button>
          <h1 className="text-sm font-extrabold text-[#111111] tracking-tight truncate mt-0.5">
            {getGreeting()}, {profile?.name?.split(' ')[0] || 'Friend'} 👋
          </h1>
        </div>

        {/* Right: Gamification Badges & Sparky AI & Bell */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Streak pill */}
          <div className="flex items-center gap-1 bg-[#FFFBEB] border border-[#FDE68A] px-2.5 py-1 rounded-full text-xs font-extrabold text-[#B45309] shadow-2xs">
            <Flame className="w-3.5 h-3.5 text-[#FFAA00] fill-[#FFAA00] animate-pulse" />
            <span>{streak.currentStreak}d</span>
          </div>

          {/* Points Pill */}
          <div className="flex items-center gap-1 bg-black text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs">
            <span className="text-[#FFAA00] text-[10px]">🪙</span>
            <span>{points.toLocaleString()}</span>
          </div>

          {/* AI Home Assistant "Sparky" Trigger */}
          <button
            onClick={() => {
              triggerHaptic('medium');
              openModal('ai-assistant');
            }}
            className="relative w-9 h-9 rounded-full bg-[#7C3AED] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-sm"
            aria-label="Ask POPCIX AI"
            title="Ask POPCIX Sparky AI"
          >
            <Sparkles className="w-4 h-4 text-[#FDE047]" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FDE047] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FDE047]"></span>
            </span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={() => {
              triggerHaptic('light');
              openModal('notifications-center');
            }}
            className="relative w-9 h-9 rounded-full bg-white border border-[#EAEAE4] text-[#111111] flex items-center justify-center hover:bg-[#F1F1ED] active:scale-95 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF5757] rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
