/**
 * POPCIX PRO - Header Component
 * Displays greeting, verification badge, online/offline availability switch, streak, and XP pill.
 */

import React from 'react';
import { useProAuth } from '../../context/ProAuthContext';
import { useProGamification } from '../../context/ProGamificationContext';
import brandMonogram from '../../assets/branding/logo-dark-square.png';

interface ProHeaderProps {
  onOpenNotifications?: () => void;
  onOpenSafety?: () => void;
  onOpenAI?: () => void;
  onSwitchMode?: () => void;
}

export function ProHeader({ onOpenNotifications, onOpenSafety, onOpenAI, onSwitchMode }: ProHeaderProps) {
  const { proProfile, isOnline, toggleAvailability } = useProAuth();
  const { streakDays, xp } = useProGamification();

  return (
    <header className="bg-white border-b border-[#E5E5E0] px-4 pt-3 pb-3 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        {/* Brand & Greeting */}
        <div className="flex items-center gap-2.5">
          <img
            src={brandMonogram}
            alt="POPCIX PRO"
            className="w-8 h-8 rounded-lg object-contain border border-[#E5E5E0] shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6B6B6B]">POPCIX PRO</span>
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#10B981]/10 text-[#10B981]">
                ✓ VERIFIED
              </span>
            </div>
            <h1 className="text-base font-bold text-[#111111] leading-tight">
              Good morning, {proProfile.name.split(' ')[0]} 👋
            </h1>
          </div>
        </div>

        {/* Action icons (AI Assistant, Safety SOS, Switch Mode) */}
        <div className="flex items-center gap-1.5">
          {/* AI Diagnostic Button */}
          {onOpenAI && (
            <button
              onClick={onOpenAI}
              className="p-1.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 transition-colors flex items-center justify-center text-xs font-bold"
              title="Sparky AI Assistant"
            >
              ✨ AI
            </button>
          )}

          {/* Safety SOS Button */}
          {onOpenSafety && (
            <button
              onClick={onOpenSafety}
              className="p-1.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 transition-colors flex items-center justify-center text-xs font-bold"
              title="Safety SOS"
            >
              🛡️ SOS
            </button>
          )}

          {/* Mode Switcher */}
          {onSwitchMode && (
            <button
              onClick={onSwitchMode}
              className="text-[11px] font-bold px-2 py-1 rounded-md bg-[#F0F0EB] text-[#333333] hover:bg-[#E5E5E0] transition-colors"
              title="Switch to Customer App"
            >
              Cust App
            </button>
          )}
        </div>
      </div>

      {/* Second Row: Availability Switch & Quick Stats */}
      <div className="flex items-center justify-between pt-1">
        {/* Availability Toggle */}
        <button
          onClick={() => toggleAvailability()}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
            isOnline
              ? 'bg-[#10B981]/15 text-[#047857] border-[#10B981]/30 shadow-2xs'
              : 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-[#10B981] animate-pulse' : 'bg-[#9CA3AF]'}`} />
          <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          <span className="text-[10px] font-normal opacity-80">
            {isOnline ? '(Receiving jobs)' : '(Tap to work)'}
          </span>
        </button>

        {/* Gamification Pills: Streak & XP */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFAA00]/15 text-[#B45309] text-xs font-bold border border-[#FFAA00]/30">
            <span>🔥</span>
            <span>{streakDays}d</span>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7C3AED]/15 text-[#6D28D9] text-xs font-bold border border-[#7C3AED]/30">
            <span>⚡</span>
            <span>{xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>
    </header>
  );
}
