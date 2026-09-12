/**
 * POPCIX Confetti Celebration
 * Plays celebratory particle bursts for booking completions, level-ups, and quests.
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSoundEffect } from '../../theme/haptics';

export interface ConfettiCelebrationProps {
  trigger?: boolean;
  durationMs?: number;
}

export const firePopcixConfetti = () => {
  playSoundEffect('success');

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#000000', '#7C3AED', '#FFAA00', '#10B981', '#FF5757', '#0284C7', '#FBBF24'],
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({ trigger = true }) => {
  useEffect(() => {
    if (trigger) {
      firePopcixConfetti();
    }
  }, [trigger]);

  return null;
};
