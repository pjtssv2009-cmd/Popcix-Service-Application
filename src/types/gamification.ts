/**
 * POPCIX Gamification Domain Types
 */

export interface LevelThreshold {
  level: number;
  title: string;
  minXp: number;
  maxXp: number;
  perkDescription: string;
  badgeIcon: string;
  accentColor: string;
}

export interface Achievement {
  id: string;
  slug: string;
  title: string;
  description: string;
  badgeIcon: string;
  category: 'GENERAL' | 'STREAK' | 'BOOKING' | 'LOYALTY' | 'REVIEW';
  xpReward: number;
  pointsReward: number;
  targetCount: number;
  progressCount: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  pointsReward: number;
  expiresInHours: number;
  isCompleted: boolean;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  rewardType: 'SERVICE_VOUCHER' | 'DISCOUNT_PERCENT' | 'FREE_ADDON' | 'MERCH';
  rewardValue: number;
  expiryDays: number;
  imageUrl?: string;
  isRedeemed?: boolean;
}

export interface RewardTransaction {
  id: string;
  transactionType: 'EARNED_BOOKING' | 'EARNED_STREAK' | 'EARNED_ACHIEVEMENT' | 'REDEEMED' | 'BONUS';
  pointsDelta: number;
  xpDelta: number;
  description: string;
  createdAt: string;
}

export interface StreakInfo {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string;
  streakFreezeAvailable: boolean;
  weeklyHistory: { day: string; active: boolean }[];
}
