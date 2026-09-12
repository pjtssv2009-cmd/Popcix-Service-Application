/**
 * POPCIX Haptics & Audio Micro-Interactions
 * Provides tactile feedback on native mobile and fallback web synthesis.
 */

export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') => {
  if (typeof window === 'undefined') return;

  // Web Vibration API (Android / PWA)
  if ('vibrate' in navigator) {
    try {
      switch (type) {
        case 'light':
          navigator.vibrate(8);
          break;
        case 'medium':
          navigator.vibrate(18);
          break;
        case 'heavy':
          navigator.vibrate(30);
          break;
        case 'success':
          navigator.vibrate([15, 40, 20]);
          break;
        case 'warning':
          navigator.vibrate([25, 50, 25]);
          break;
        case 'error':
          navigator.vibrate([40, 40, 40, 40]);
          break;
      }
    } catch {
      // Ignore vibration errors
    }
  }
};

/**
 * Playful synthesized micro-audio for gamification (XP chime, button click, level up)
 */
export const playSoundEffect = (type: 'pop' | 'coin' | 'xp' | 'success' | 'levelUp') => {
  if (typeof window === 'undefined') return;
  
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'pop') {
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'coin' || type === 'xp') {
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'success' || type === 'levelUp') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.09); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.18); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.27); // C6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch {
    // Audio context may be restricted by browser autoplay policy before user gesture
  }
};
