/**
 * POPCIX Customer Profile & Settings Screen
 * User Metadata, Saved Addresses, Preferred Pros, HomeCare Status, Notification Center, and Safe Sign Out.
 */

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGamification } from '../../context/GamificationContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  User,
  MapPin,
  CreditCard,
  Heart,
  Users,
  ShieldCheck,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Lock,
  FileText,
  Flame,
} from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';
import logoLightHoriz from '../../assets/branding/logo-light-horizontal.png';

export const ProfileScreen: React.FC = () => {
  const { profile, signOut, isDemoMode, toggleDemoMode } = useAuth();
  const { xp, points, streak, levelInfo } = useGamification();
  const {
    openModal,
    activeSubscriptionTier,
    unreadNotificationsCount,
    addresses,
    favorites,
    preferredPros,
  } = useMarketplace();

  const handleSignOut = async () => {
    triggerHaptic('medium');
    playSoundEffect('pop');
    await signOut();
    openModal('auth-signin');
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-8 space-y-5">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-[#111111] tracking-tight">
          Profile & Account
        </h2>
        <p className="text-xs font-medium text-[#6B6B6B]">
          Manage your addresses, memberships, and security
        </p>
      </div>

      {/* User Hero Card */}
      <Card variant="surface" padding="lg" className="border-[#EAEAE4]">
        <div className="flex items-center gap-3.5 mb-3.5">
          <img
            src={
              profile?.profile_photo_url ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
            }
            alt={profile?.name || 'User'}
            className="w-16 h-16 rounded-full object-cover border-2 border-black/10"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[#111111] truncate">
                {profile?.name || 'POPCIX Customer'}
              </h3>
              <Badge variant="black" size="sm">
                {activeSubscriptionTier}
              </Badge>
            </div>
            <p className="text-xs text-[#6B6B6B] truncate mt-0.5">
              {profile?.email || 'customer@popcix.app'}
            </p>
            <p className="text-xs font-semibold text-[#111111] mt-0.5">
              {profile?.phone || '+91 98765 43210'}
            </p>
          </div>
        </div>

        {/* Gamification Stats Strip */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#F1F1ED] text-center">
          <div className="p-2 bg-[#F8F8F5] rounded-xl">
            <span className="text-[10px] font-bold text-[#6B6B6B] uppercase">Level</span>
            <div className="text-xs font-black text-black mt-0.5">
              Lvl {levelInfo.currentLevel.level}
            </div>
          </div>
          <div className="p-2 bg-[#FFFBEB] rounded-xl text-[#B45309]">
            <span className="text-[10px] font-bold uppercase">Streak</span>
            <div className="text-xs font-black mt-0.5 flex items-center justify-center gap-0.5">
              <Flame className="w-3 h-3 fill-current text-[#FFAA00]" />
              <span>{streak.currentStreak}d</span>
            </div>
          </div>
          <div className="p-2 bg-[#F5F3FF] rounded-xl text-[#5B21B6]">
            <span className="text-[10px] font-bold uppercase">Points</span>
            <div className="text-xs font-black mt-0.5">
              🪙 {points.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Account Settings Menu */}
      <div className="space-y-2">
        <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider px-1">
          Home Care & Preferences
        </h4>

        {/* Saved Addresses */}
        <button
          onClick={() => {
            triggerHaptic('light');
            openModal('address-manager');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-[#EAEAE4] rounded-2xl hover:border-black transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F1F1ED] flex items-center justify-center text-black">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#111111] block">Saved Addresses</span>
              <span className="text-[11px] text-[#6B6B6B]">
                {addresses.length} locations configured
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8E8E8E] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Subscriptions */}
        <button
          onClick={() => {
            triggerHaptic('light');
            openModal('subscriptions');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-[#EAEAE4] rounded-2xl hover:border-black transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#111111] block">POPCIX HomeCare VIP</span>
              <span className="text-[11px] text-[#7C3AED] font-bold">
                Tier: {activeSubscriptionTier} Active
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8E8E8E] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Notifications Center */}
        <button
          onClick={() => {
            triggerHaptic('light');
            openModal('notifications-center');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-[#EAEAE4] rounded-2xl hover:border-black transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F1F1ED] text-black flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#111111] block">Notification Center</span>
              <span className="text-[11px] text-[#6B6B6B]">
                {unreadNotificationsCount > 0 ? `${unreadNotificationsCount} unread updates` : 'All caught up'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8E8E8E] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Support & Security */}
      <div className="space-y-2">
        <h4 className="text-xs font-extrabold text-[#111111] uppercase tracking-wider px-1">
          Support & Security
        </h4>

        {/* AI Home Assistant */}
        <button
          onClick={() => {
            triggerHaptic('medium');
            openModal('ai-assistant');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-[#F5F3FF] border border-[#DDD6FE] rounded-2xl hover:border-[#7C3AED] transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#5B21B6] block">POPCIX Sparky AI Assistant</span>
              <span className="text-[11px] text-[#7C3AED] font-semibold">
                Instant issue diagnosis & home recommendations
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#7C3AED] group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Support Ticket */}
        <button
          onClick={() => {
            triggerHaptic('light');
            openModal('support-ticket');
          }}
          className="w-full flex items-center justify-between p-3.5 bg-white border border-[#EAEAE4] rounded-2xl hover:border-black transition-all text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F1F1ED] text-black flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#111111] block">Help & Support Tickets</span>
              <span className="text-[11px] text-[#6B6B6B]">
                24/7 customer care & booking resolutions
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-[#8E8E8E] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Sign Out Button */}
      <div className="pt-2">
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleSignOut}
          leftIcon={<LogOut className="w-4 h-4 text-[#FF5757]" />}
          className="border border-[#DFDFD6] text-[#B91C1C] hover:bg-[#FEF2F2]"
        >
          Sign Out of POPCIX
        </Button>

        <div className="flex flex-col items-center mt-4 mb-2">
          <img
            src={logoLightHoriz}
            alt="POPCIX"
            className="h-6 object-contain opacity-70 mb-1"
          />
          <p className="text-[10px] text-center text-[#8E8E8E] font-medium">
            POPCIX Version 1.0.0 (Production Mobile) • Powered by Supabase
          </p>
        </div>
      </div>
    </div>
  );
};
