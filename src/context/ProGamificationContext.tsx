/**
 * POPCIX PRO - Gamification Context
 * Manages XP progression, AC HERO Level 8, 6-day streak, badges, weekly goals and leaderboard.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProBadge, ProChallenge, ProLevel } from '../types/pro';
import { PRO_BADGES, PRO_CHALLENGES, XP_LEADERBOARD_LIST } from '../data/proMockData';
import { triggerHaptic } from '../services/nativeMobile';

interface GamificationCelebration {
  type: 'XP_GAIN' | 'LEVEL_UP' | 'BADGE_UNLOCKED' | 'STREAK_EXTENDED' | 'WEEKLY_GOAL';
  title: string;
  subtitle: string;
  points?: number;
}

interface ProGamificationContextType {
  xp: number;
  level: ProLevel;
  levelProgressPercent: number;
  streakDays: number;
  isStreakActiveToday: boolean;
  weeklyTargetJobs: number;
  weeklyCompletedJobs: number;
  badges: ProBadge[];
  challenges: ProChallenge[];
  leaderboard: typeof XP_LEADERBOARD_LIST;
  isLeaderboardOptedIn: boolean;
  activeCelebration: GamificationCelebration | null;
  addXp: (amount: number, reason: string) => void;
  unlockBadge: (badgeId: string) => void;
  toggleLeaderboardOptIn: () => void;
  clearCelebration: () => void;
}

const GAMIFICATION_KEY = 'popcix_pro_gamification_v1';

const ProGamificationContext = createContext<ProGamificationContextType | undefined>(undefined);

export function ProGamificationProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState<number>(8420);
  const [streakDays, setStreakDays] = useState<number>(6);
  const [isStreakActiveToday, setIsStreakActiveToday] = useState<boolean>(true);
  const [weeklyCompletedJobs, setWeeklyCompletedJobs] = useState<number>(23);
  const [weeklyTargetJobs] = useState<number>(30);
  const [badges, setBadges] = useState<ProBadge[]>(PRO_BADGES);
  const [challenges, setChallenges] = useState<ProChallenge[]>(PRO_CHALLENGES);
  const [isLeaderboardOptedIn, setIsLeaderboardOptedIn] = useState<boolean>(true);
  const [activeCelebration, setActiveCelebration] = useState<GamificationCelebration | null>(null);

  // Derive level and progress
  const level: ProLevel = xp >= 8000 ? 'AC HERO' : xp >= 6000 ? 'Elite Pro' : xp >= 4000 ? 'Expert Pro' : xp >= 2000 ? 'Skilled Pro' : 'Starter';
  const levelProgressPercent = Math.min(100, Math.round(((xp % 2000) / 2000) * 100));

  const addXp = (amount: number, reason: string) => {
    triggerHaptic('medium');
    setXp(prev => {
      const nextXp = prev + amount;
      setActiveCelebration({
        type: 'XP_GAIN',
        title: `+${amount} XP Earned!`,
        subtitle: reason,
        points: amount
      });
      return nextXp;
    });
  };

  const unlockBadge = (badgeId: string) => {
    triggerHaptic('heavy');
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId && !b.isUnlocked) {
        setActiveCelebration({
          type: 'BADGE_UNLOCKED',
          title: `🏆 Badge Unlocked: ${b.title}`,
          subtitle: b.description
        });
        return { ...b, isUnlocked: true, progressPercent: 100, unlockedAt: new Date().toISOString() };
      }
      return b;
    }));
  };

  const toggleLeaderboardOptIn = () => {
    setIsLeaderboardOptedIn(prev => !prev);
  };

  const clearCelebration = () => {
    setActiveCelebration(null);
  };

  return (
    <ProGamificationContext.Provider
      value={{
        xp,
        level,
        levelProgressPercent,
        streakDays,
        isStreakActiveToday,
        weeklyTargetJobs,
        weeklyCompletedJobs,
        badges,
        challenges,
        leaderboard: XP_LEADERBOARD_LIST,
        isLeaderboardOptedIn,
        activeCelebration,
        addXp,
        unlockBadge,
        toggleLeaderboardOptIn,
        clearCelebration
      }}
    >
      {children}
    </ProGamificationContext.Provider>
  );
}

export function useProGamification() {
  const ctx = useContext(ProGamificationContext);
  if (!ctx) {
    throw new Error('useProGamification must be used within a ProGamificationProvider');
  }
  return ctx;
}
