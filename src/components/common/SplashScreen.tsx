/**
 * POPCIX PRO In-App Splash Screen
 * Professional launcher sequence with official brand monogram, high-speed progress, and pro tagline.
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import logoDarkSquare from '../../assets/branding/logo-dark-square.png';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'enter' | 'pulse' | 'exit'>('enter');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 60);

    const pulseTimer = setTimeout(() => {
      setPhase('pulse');
    }, 200);

    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 850);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 1100);

    return () => {
      clearInterval(interval);
      clearTimeout(pulseTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  const handleDismiss = () => {
    setPhase('exit');
    setTimeout(() => {
      onFinish();
    }, 150);
  };

  return (
    <div
      onClick={handleDismiss}
      onTouchStart={handleDismiss}
      className={`fixed inset-0 z-[99999] bg-[#000000] flex flex-col items-center justify-between py-12 px-6 select-none cursor-pointer transition-opacity duration-300 ${
        phase === 'exit' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Top ambient badge */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white text-xs font-bold tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-[#FFAA00] animate-spin" style={{ animationDuration: '3s' }} />
        <span>POPCIX PRO PARTNER</span>
      </div>

      {/* Center Branding Monogram */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          {/* Ambient Glow */}
          <div className="absolute -inset-10 bg-white/10 rounded-full blur-3xl animate-pulse" />

          {/* Official POPCIX Logo */}
          <div className="relative w-36 h-36 rounded-3xl flex items-center justify-center">
            <img
              src={logoDarkSquare}
              alt="POPCIX PRO"
              className="w-full h-full object-contain rounded-3xl shadow-2xl"
            />
          </div>
        </div>

        <h1 className="text-xl font-black text-white tracking-wider uppercase mb-1">
          POPCIX <span className="text-[#FFAA00]">PRO</span>
        </h1>

        {/* Tagline */}
        <p className="text-xs font-bold tracking-[0.25em] text-[#A1A1AA] uppercase mt-1">
          Work. Earn. Grow.
        </p>
      </div>

      {/* Bottom Loading Progress & Assurance */}
      <div className="w-full max-w-xs flex flex-col items-center gap-4">
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FFAA00] transition-all duration-100 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Trust pill */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-white/50 tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>VERIFIED PROFESSIONALS • INSTANT SETTLEMENT</span>
        </div>
      </div>
    </div>
  );
};
