/**
 * POPCIX PRO - Celebration Modal Component
 * Micro-animations and celebratory dialogues when XP is earned, badges unlocked, or level increased.
 */

import React from 'react';
import { useProGamification } from '../../context/ProGamificationContext';

export function ProCelebrationModal() {
  const { activeCelebration, clearCelebration } = useProGamification();

  if (!activeCelebration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl p-6 max-w-xs w-full text-center border border-[#E5E5E0] shadow-2xl relative animate-scale-up">
        {/* Glow / Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FFAA00] to-[#FFD700] mx-auto flex items-center justify-center text-3xl shadow-lg mb-4 animate-bounce">
          {activeCelebration.type === 'XP_GAIN' ? '⚡' : activeCelebration.type === 'BADGE_UNLOCKED' ? '🏆' : '🔥'}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-[#111111] mb-1">
          {activeCelebration.title}
        </h3>

        {/* Subtitle */}
        <p className="text-xs text-[#6B6B6B] mb-5 leading-relaxed">
          {activeCelebration.subtitle}
        </p>

        {/* Action Button */}
        <button
          onClick={clearCelebration}
          className="w-full py-3 rounded-xl bg-[#000000] text-white text-xs font-bold hover:bg-[#222222] transition-colors shadow-md"
        >
          AWESOME, KEEP GOING!
        </button>
      </div>
    </div>
  );
}
