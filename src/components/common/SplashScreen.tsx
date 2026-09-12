/**
 * POPCIX In-App Splash Screen
 * Delivers an authentic, high-polish brand launch sequence with smooth fade transitions.
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'enter' | 'pulse' | 'exit'>('enter');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 120);

    const pulseTimer = setTimeout(() => {
      setPhase('pulse');
    }, 400);

    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 1800);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(pulseTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-between py-12 px-6 select-none transition-opacity duration-500 ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top ambient badge */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-semibold tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-[#FFE600] animate-spin" style={{ animationDuration: '3s' }} />
        <span>GAMIFIED HOME SERVICES</span>
      </div>

      {/* Center Branding Monogram */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-8">
          {/* Ambient Glow */}
          <div className="absolute -inset-8 bg-gradient-to-tr from-[#FFE600]/20 to-[#FF9900]/20 rounded-full blur-2xl animate-pulse" />

          {/* Luxury POPCIX Monogram Icon */}
          <div className="relative w-28 h-28 bg-[#111111] rounded-3xl border-2 border-white/15 flex items-center justify-center shadow-2xl shadow-black/80">
            {/* Crest SVG */}
            <svg width="68" height="68" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 15 L80 38 H20 Z" fill="url(#splashGrad)" />
              <path d="M30 42 H70 V75 C70 82 60 88 50 90 C40 88 30 82 30 75 Z" fill="#FFFFFF" opacity="0.08" />
              <path d="M38 38 H58 C64 38 68 42 68 48 C68 54 64 58 58 58 H46 V78 H38 V38 Z" fill="#FFFFFF" />
              <path d="M46 44 H56 C59 44 61 46 61 48 C61 50 59 52 56 52 H46 V44 Z" fill="#000000" />
              <polygon points="50,47 52,51 57,51 53,54 54,58 50,56 46,58 47,54 43,51 48,51" fill="url(#splashGrad)" />
              <defs>
                <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE600" />
                  <stop offset="100%" stopColor="#FF9900" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-black tracking-[0.25em] text-white mb-2 pl-2">
          POPCIX
        </h1>

        {/* Tagline */}
        <p className="text-xs font-bold tracking-[0.2em] text-[#A1A1AA] uppercase">
          Everything Your Home Needs
        </p>
      </div>

      {/* Bottom Loading Progress & Assurance */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFE600] to-[#FF9900] transition-all duration-150 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Trust pill */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50 tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>VERIFIED PROFESSIONALS • 100% SECURE</span>
        </div>
      </div>
    </div>
  );
};
