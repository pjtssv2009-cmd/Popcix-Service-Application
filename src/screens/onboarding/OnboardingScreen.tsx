/**
 * POPCIX Onboarding Experience
 * 5-Screen Interactive Flow with Original Illustrations, Animations, and CTAs.
 */

import React, { useState } from 'react';
import { Mascot, MascotMood } from '../../components/common/Mascot';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';
import { Sparkles, ShieldCheck, Zap, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: () => void;
  onOpenSignIn: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete, onOpenSignIn }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const slides: {
    title: string;
    subtitle: string;
    tag: string;
    mood: MascotMood;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      title: 'Welcome to POPCIX',
      subtitle: 'Your home deserves better care. Everything your home needs, in one delightful app.',
      tag: 'ORIGINAL HOME CARE',
      mood: 'waving',
      icon: <Sparkles className="w-5 h-5 text-[#FFAA00]" />,
      color: '#000000',
    },
    {
      title: 'Book in Seconds',
      subtitle: 'Instant dispatch in 30 minutes, or schedule recurring routines with zero hassle.',
      tag: 'INSTANT & SCHEDULED',
      mood: 'superhero',
      icon: <Zap className="w-5 h-5 text-[#FFAA00]" />,
      color: '#7C3AED',
    },
    {
      title: 'Verified Professionals',
      subtitle: '100% background-checked, certified master technicians backed by our 30-Day Guarantee.',
      tag: 'TOP 1% TECHNICIANS',
      mood: 'happy',
      icon: <ShieldCheck className="w-5 h-5 text-[#10B981]" />,
      color: '#10B981',
    },
    {
      title: 'Earn Rewards as You Care',
      subtitle: 'Build care streaks, level up to Home Hero, and unlock exclusive discounts & free add-ons.',
      tag: 'GAMIFIED REWARDS',
      mood: 'celebrating',
      icon: <Flame className="w-5 h-5 text-[#FF5757]" />,
      color: '#FFAA00',
    },
    {
      title: "Let's Get Your Home Sorted",
      subtitle: 'Join over 100,000+ happy homes and experience effortless home care today.',
      tag: 'READY TO POP',
      mood: 'celebrating',
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
      color: '#000000',
    },
  ];

  const handleNext = () => {
    if (currentStep < slides.length - 1) {
      triggerHaptic('medium');
      playSoundEffect('pop');
      setCurrentStep((prev) => prev + 1);
    } else {
      triggerHaptic('success');
      playSoundEffect('success');
      onComplete();
    }
  };

  const handleSkip = () => {
    triggerHaptic('light');
    onComplete();
  };

  const slide = slides[currentStep];

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#F8F8F5] min-h-screen select-none">
      {/* Top Bar with Skip */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
            P
          </div>
          <span className="font-extrabold text-lg text-black tracking-wider">POPCIX</span>
        </div>
        {currentStep < slides.length - 1 && (
          <button
            onClick={handleSkip}
            className="text-xs font-bold text-[#6B6B6B] hover:text-black px-3 py-1.5 rounded-full hover:bg-black/5"
          >
            Skip
          </button>
        )}
      </div>

      {/* Center Illustrated Hero */}
      <div className="flex-1 flex flex-col items-center justify-center my-6 text-center">
        {/* Animated Badge Tag */}
        <Badge
          variant="black"
          size="sm"
          icon={slide.icon}
          className="mb-6 shadow-sm animate-bounce-subtle"
        >
          {slide.tag}
        </Badge>

        {/* Mascot Character with Mood Animation */}
        <div className="relative mb-8 transform transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFAA00]/10 to-transparent rounded-full blur-2xl -z-10" />
          <Mascot mood={slide.mood} size={170} />
        </div>

        {/* Title & Subtitle */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mb-3 px-2">
          {slide.title}
        </h2>
        <p className="text-sm sm:text-base font-medium text-[#6B6B6B] leading-relaxed max-w-xs px-2">
          {slide.subtitle}
        </p>
      </div>

      {/* Bottom Controls */}
      <div className="space-y-4 pb-4">
        {/* Step Indicator Dots */}
        <div className="flex items-center justify-center gap-2 py-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerHaptic('light');
                setCurrentStep(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-black' : 'w-2.5 bg-[#DFDFD6]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Primary Action Button */}
        <Button
          variant="primary"
          size="xl"
          fullWidth
          rightIcon={currentStep === slides.length - 1 ? undefined : <ArrowRight className="w-5 h-5" />}
          onClick={handleNext}
        >
          {currentStep === slides.length - 1 ? 'Get Started' : 'Continue'}
        </Button>

        {/* Existing User Sign In Link */}
        <div className="text-center">
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenSignIn();
            }}
            className="text-xs font-bold text-[#6B6B6B] hover:text-black py-1"
          >
            Already have an account? <span className="text-black underline underline-offset-4">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  );
};
