/**
 * POPCIX Gamification Engine
 * 
 * Dynamic calculation of XP, Level progression, Streak tracking,
 * Quests, Badges, and Reward points.
 * All values are configurable rules (never hard-coded across components).
 */

import { LevelThreshold, Achievement, Challenge, RewardItem, StreakInfo } from '../../types/gamification';

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  {
    level: 1,
    title: 'Novice Caretaker',
    minXp: 0,
    maxXp: 200,
    perkDescription: 'Standard booking priority & base reward points',
    badgeIcon: 'Shield',
    accentColor: '#10B981',
  },
  {
    level: 2,
    title: 'Home Apprentice',
    minXp: 201,
    maxXp: 500,
    perkDescription: '5% bonus points on recurring bookings',
    badgeIcon: 'Sparkles',
    accentColor: '#0284C7',
  },
  {
    level: 3,
    title: 'Pro Caretaker',
    minXp: 501,
    maxXp: 800,
    perkDescription: 'Free priority slot dispatch on instant bookings',
    badgeIcon: 'Zap',
    accentColor: '#FFAA00',
  },
  {
    level: 4,
    title: 'Home Hero',
    minXp: 801,
    maxXp: 1200,
    perkDescription: '10% discount on all service add-ons & bundles',
    badgeIcon: 'Crown',
    accentColor: '#7C3AED',
  },
  {
    level: 5,
    title: 'Master Guardian',
    minXp: 1201,
    maxXp: 1800,
    perkDescription: 'Dedicated VIP Support & zero cancellation fees',
    badgeIcon: 'Award',
    accentColor: '#EC4899',
  },
  {
    level: 6,
    title: 'Grand Home Master',
    minXp: 1801,
    maxXp: 2800,
    perkDescription: 'Exclusive access to Master Guild Pros & complimentary inspections',
    badgeIcon: 'Flame',
    accentColor: '#FF5757',
  },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    slug: 'first-spark',
    title: 'First Spark',
    description: 'Book your very first service on POPCIX',
    badgeIcon: 'Zap',
    category: 'BOOKING',
    xpReward: 150,
    pointsReward: 100,
    targetCount: 1,
    progressCount: 1,
    isUnlocked: true,
    unlockedAt: '2026-08-15T10:00:00Z',
  },
  {
    id: 'ach-2',
    slug: 'streak-master-7',
    title: 'Care Streak',
    description: 'Maintain a 7-day home care streak',
    badgeIcon: 'Flame',
    category: 'STREAK',
    xpReward: 300,
    pointsReward: 200,
    targetCount: 7,
    progressCount: 7,
    isUnlocked: true,
    unlockedAt: '2026-09-10T12:00:00Z',
  },
  {
    id: 'ach-3',
    slug: 'home-hero-10',
    title: 'Home Hero',
    description: 'Complete 10 total home service bookings',
    badgeIcon: 'Crown',
    category: 'LOYALTY',
    xpReward: 500,
    pointsReward: 400,
    targetCount: 10,
    progressCount: 8,
    isUnlocked: false,
  },
  {
    id: 'ach-4',
    slug: 'service-explorer-3',
    title: 'Service Explorer',
    description: 'Try services from 3 different categories',
    badgeIcon: 'Compass',
    category: 'GENERAL',
    xpReward: 250,
    pointsReward: 150,
    targetCount: 3,
    progressCount: 2,
    isUnlocked: false,
  },
  {
    id: 'ach-5',
    slug: 'critic-star',
    title: 'Top Reviewer',
    description: 'Leave 5 detailed reviews for completed jobs',
    badgeIcon: 'Star',
    category: 'REVIEW',
    xpReward: 200,
    pointsReward: 100,
    targetCount: 5,
    progressCount: 4,
    isUnlocked: false,
  },
  {
    id: 'ach-6',
    slug: 'stack-master',
    title: 'Bundle Master',
    description: 'Stack 2 or more services in a single visit',
    badgeIcon: 'Layers',
    category: 'BOOKING',
    xpReward: 200,
    pointsReward: 120,
    targetCount: 1,
    progressCount: 1,
    isUnlocked: true,
    unlockedAt: '2026-09-02T14:30:00Z',
  }
];

export const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    title: 'Spring Clean Routine',
    description: 'Book any cleaning or pest control service this week',
    category: 'Weekly Quest',
    targetCount: 1,
    currentCount: 0,
    xpReward: 120,
    pointsReward: 80,
    expiresInHours: 48,
    isCompleted: false,
  },
  {
    id: 'ch-2',
    title: 'Daily Home Check',
    description: 'Inspect your home filters & check in with POPCIX Sparky',
    category: 'Daily Quest',
    targetCount: 1,
    currentCount: 1,
    xpReward: 40,
    pointsReward: 25,
    expiresInHours: 14,
    isCompleted: true,
  },
  {
    id: 'ch-3',
    title: 'Pro Feedback Champion',
    description: 'Rate your last technician on quality & timeliness',
    category: 'Community Quest',
    targetCount: 1,
    currentCount: 1,
    xpReward: 60,
    pointsReward: 40,
    expiresInHours: 72,
    isCompleted: true,
  }
];

export const INITIAL_REWARDS: RewardItem[] = [
  {
    id: 'rew-1',
    title: '₹200 Off Any Cleaning Service',
    description: 'Instant discount applied on Full House or Deep Cleaning',
    pointsCost: 500,
    rewardType: 'SERVICE_VOUCHER',
    rewardValue: 200,
    expiryDays: 30,
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300&auto=format&fit=crop&q=80',
    isRedeemed: false,
  },
  {
    id: 'rew-2',
    title: 'Free AC Anti-Bacterial Spray',
    description: '100% free sanitization spray add-on for your next AC booking',
    pointsCost: 350,
    rewardType: 'FREE_ADDON',
    rewardValue: 199,
    expiryDays: 45,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&auto=format&fit=crop&q=80',
    isRedeemed: false,
  },
  {
    id: 'rew-3',
    title: '25% Off POPCIX HomeCare',
    description: 'Save big on your first month of VIP HomeCare subscription',
    pointsCost: 700,
    rewardType: 'DISCOUNT_PERCENT',
    rewardValue: 25,
    expiryDays: 60,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&auto=format&fit=crop&q=80',
    isRedeemed: false,
  },
  {
    id: 'rew-4',
    title: '₹500 Mega Home Voucher',
    description: 'Valid across any service over ₹1,499',
    pointsCost: 1200,
    rewardType: 'SERVICE_VOUCHER',
    rewardValue: 500,
    expiryDays: 90,
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&auto=format&fit=crop&q=80',
    isRedeemed: false,
  }
];

export class GamificationEngine {
  /**
   * Calculates current level and progress info from total XP
   */
  public static getLevelInfo(xp: number): {
    currentLevel: LevelThreshold;
    nextLevel?: LevelThreshold;
    progressPercentage: number;
    currentXpInLevel: number;
    xpNeededForNext: number;
  } {
    let currentLevel = LEVEL_THRESHOLDS[0];
    let nextLevel: LevelThreshold | undefined = LEVEL_THRESHOLDS[1];

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      const lvl = LEVEL_THRESHOLDS[i];
      if (xp >= lvl.minXp && (xp <= lvl.maxXp || i === LEVEL_THRESHOLDS.length - 1)) {
        currentLevel = lvl;
        nextLevel = LEVEL_THRESHOLDS[i + 1];
        break;
      }
    }

    if (!nextLevel) {
      return {
        currentLevel,
        nextLevel: undefined,
        progressPercentage: 100,
        currentXpInLevel: xp - currentLevel.minXp,
        xpNeededForNext: 0,
      };
    }

    const range = nextLevel.minXp - currentLevel.minXp;
    const progress = Math.max(0, Math.min(range, xp - currentLevel.minXp));
    const progressPercentage = Math.round((progress / range) * 100);
    const xpNeededForNext = nextLevel.minXp - xp;

    return {
      currentLevel,
      nextLevel,
      progressPercentage,
      currentXpInLevel: progress,
      xpNeededForNext: Math.max(0, xpNeededForNext),
    };
  }

  /**
   * Calculates points and XP earned from a completed booking
   */
  public static calculateBookingRewards(orderTotal: number, isBundle: boolean = false): { xpEarned: number; pointsEarned: number } {
    const baseXP = 120;
    const bundleBonusXP = isBundle ? 50 : 0;
    const xpEarned = baseXP + bundleBonusXP;

    // 5% of order value in points + 50 base points + bundle bonus
    const basePoints = 50;
    const orderPoints = Math.round(orderTotal * 0.05);
    const bundleBonusPoints = isBundle ? 30 : 0;
    const pointsEarned = basePoints + orderPoints + bundleBonusPoints;

    return { xpEarned, pointsEarned };
  }
}
