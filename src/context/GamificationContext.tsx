/**
 * POPCIX Gamification Context
 * 
 * Manages player XP, Level progression, Daily Streaks, Badges,
 * Quests, Reward Points, and celebratory micro-interactions.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  GamificationEngine,
  INITIAL_ACHIEVEMENTS,
  INITIAL_CHALLENGES,
  INITIAL_REWARDS,
} from '../services/gamification/gamificationEngine';
import {
  Achievement,
  Challenge,
  RewardItem,
  StreakInfo,
  LevelThreshold,
} from '../types/gamification';
import { playSoundEffect, triggerHaptic } from '../theme/haptics';

export interface CelebrationState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  xpEarned: number;
  pointsEarned: number;
  unlockedBadge?: Achievement;
  isLevelUp?: boolean;
  newLevel?: LevelThreshold;
}

interface GamificationContextType {
  xp: number;
  points: number;
  streak: StreakInfo;
  levelInfo: ReturnType<typeof GamificationEngine.getLevelInfo>;
  achievements: Achievement[];
  challenges: Challenge[];
  rewards: RewardItem[];
  celebration: CelebrationState;
  addXpAndPoints: (xpDelta: number, pointsDelta: number, reason: string) => void;
  claimDailyStreak: () => void;
  redeemReward: (rewardId: string) => { success: boolean; message: string };
  triggerCelebration: (data: Omit<CelebrationState, 'isOpen'>) => void;
  closeCelebration: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [xp, setXp] = useState<number>(820); // Level 4 Home Hero (820 XP)
  const [points, setPoints] = useState<number>(1450);
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [rewards, setRewards] = useState<RewardItem[]>(INITIAL_REWARDS);

  const [streak, setStreak] = useState<StreakInfo>({
    currentStreak: 7,
    bestStreak: 14,
    lastActiveDate: new Date().toISOString().split('T')[0],
    streakFreezeAvailable: true,
    weeklyHistory: [
      { day: 'Mon', active: true },
      { day: 'Tue', active: true },
      { day: 'Wed', active: true },
      { day: 'Thu', active: true },
      { day: 'Fri', active: true },
      { day: 'Sat', active: true },
      { day: 'Sun', active: true },
    ],
  });

  const [celebration, setCelebration] = useState<CelebrationState>({
    isOpen: false,
    title: '',
    subtitle: '',
    xpEarned: 0,
    pointsEarned: 0,
  });

  const levelInfo = GamificationEngine.getLevelInfo(xp);

  const addXpAndPoints = (xpDelta: number, pointsDelta: number, reason: string) => {
    const oldLevel = levelInfo.currentLevel.level;
    const newTotalXp = xp + xpDelta;
    const newLevelInfo = GamificationEngine.getLevelInfo(newTotalXp);
    const isLevelUp = newLevelInfo.currentLevel.level > oldLevel;

    setXp(newTotalXp);
    setPoints((prev) => prev + pointsDelta);

    if (isLevelUp) {
      playSoundEffect('levelUp');
      triggerHaptic('success');
      triggerCelebration({
        title: `LEVEL UP! Level ${newLevelInfo.currentLevel.level} 🏆`,
        subtitle: `You achieved "${newLevelInfo.currentLevel.title}" status!`,
        xpEarned: xpDelta,
        pointsEarned: pointsDelta,
        isLevelUp: true,
        newLevel: newLevelInfo.currentLevel,
      });
    } else {
      playSoundEffect('xp');
      triggerHaptic('medium');
    }
  };

  const claimDailyStreak = () => {
    const newStreakVal = streak.currentStreak + 1;
    setStreak((prev) => ({
      ...prev,
      currentStreak: newStreakVal,
      bestStreak: Math.max(prev.bestStreak, newStreakVal),
    }));

    addXpAndPoints(30, 20, 'Daily Care Streak Check-in');
    playSoundEffect('coin');
  };

  const redeemReward = (rewardId: string): { success: boolean; message: string } => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found' };

    if (points < reward.pointsCost) {
      triggerHaptic('error');
      return { success: false, message: `Need ${reward.pointsCost - points} more POPCIX points!` };
    }

    setPoints((prev) => prev - reward.pointsCost);
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, isRedeemed: true } : r))
    );

    triggerHaptic('success');
    playSoundEffect('success');
    return { success: true, message: `Voucher redeemed! Applied to your wallet.` };
  };

  const triggerCelebration = (data: Omit<CelebrationState, 'isOpen'>) => {
    setCelebration({
      isOpen: true,
      ...data,
    });
  };

  const closeCelebration = () => {
    setCelebration((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        points,
        streak,
        levelInfo,
        achievements,
        challenges,
        rewards,
        celebration,
        addXpAndPoints,
        claimDailyStreak,
        redeemReward,
        triggerCelebration,
        closeCelebration,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
