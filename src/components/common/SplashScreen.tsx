/**
 * POPCIX In-App Splash Screen
 * Uses the official POPCIX brand logo and delivers an authentic, high-polish launch sequence.
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
        <div className="relative mb-6">
          {/* Ambient Glow */}
          <div className="absolute -inset-10 bg-white/10 rounded-full blur-3xl animate-pulse" />

          {/* Official POPCIX Logo */}
          <div className="relative w-48 h-48 rounded-3xl flex items-center justify-center">
            <img
              src="/assets/branding/logo-dark-square.png"
              alt="POPCIX"
              className="w-full h-full object-contain rounded-3xl shadow-2xl"
            />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-xs font-bold tracking-[0.25em] text-[#A1A1AA] uppercase mt-2">
          Your Home. Your Services. Your POPCIX.
        </p>
      </div>

      {/* Bottom Loading Progress & Assurance */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-150 rounded-full"
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
