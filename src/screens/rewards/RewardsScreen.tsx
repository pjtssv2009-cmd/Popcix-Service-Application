/**
 * POPCIX Rewards & Gamification Hub Screen
 * Level Progression, Daily Streak Check-in, Active Quests, Badges Showcase, and Points Store.
 */

import React, { useState } from 'react';
import { useGamification } from '../../context/GamificationContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Mascot } from '../../components/common/Mascot';
import {
  Crown,
  Flame,
  Sparkles,
  Zap,
  Gift,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  Star,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { triggerHaptic, playSoundEffect } from '../../theme/haptics';

export const RewardsScreen: React.FC = () => {
  const {
    xp,
    points,
    streak,
    levelInfo,
    achievements,
    challenges,
    rewards,
    claimDailyStreak,
    redeemReward,
  } = useGamification();

  const [redeemFeedback, setRedeemFeedback] = useState<string | null>(null);

  const getBadgeIcon = (iconName: string) => {
    const map: Record<string, React.ReactNode> = {
      Zap: <Zap className="w-5 h-5 text-[#FFAA00]" />,
      Flame: <Flame className="w-5 h-5 text-[#FF5757]" />,
      Crown: <Crown className="w-5 h-5 text-[#7C3AED]" />,
      Compass: <Compass className="w-5 h-5 text-[#0284C7]" />,
      Star: <Star className="w-5 h-5 text-[#FBBF24]" />,
      Layers: <Layers className="w-5 h-5 text-[#10B981]" />,
    };
    return map[iconName] || <Award className="w-5 h-5 text-black" />;
  };

  const handleRedeem = (rewardId: string) => {
    const res = redeemReward(rewardId);
    setRedeemFeedback(res.message);
    setTimeout(() => setRedeemFeedback(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-8 space-y-5">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-black text-[#111111] tracking-tight">
          Your POPCIX Rewards
        </h2>
        <p className="text-xs font-medium text-[#6B6B6B]">
          Earn points and level up as you take care of your home
        </p>
      </div>

      {/* Redemption Toast */}
      {redeemFeedback && (
        <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl text-xs font-extrabold text-[#065F46] animate-bounce-subtle">
          🎉 {redeemFeedback}
        </div>
      )}

      {/* LEVEL PROGRESSION HERO CARD */}
      <div className="p-5 rounded-[28px] bg-gradient-to-br from-[#000000] via-[#1A1A1A] to-[#111111] text-white shadow-card">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#7C3AED] text-xs font-black text-white mb-2 shadow-2xs">
              <Crown className="w-3.5 h-3.5 text-[#FFAA00]" />
              <span>Level {levelInfo.currentLevel.level} — {levelInfo.currentLevel.title}</span>
            </div>
            <div className="text-2xl font-black text-white">
              {xp} Total XP
            </div>
            <p className="text-xs text-[#D1D1D1] mt-0.5">
              {levelInfo.currentLevel.perkDescription}
            </p>
          </div>

          <Mascot mood="superhero" size={70} />
        </div>

        {/* Level XP Bar */}
        <div className="space-y-1.5 mt-2">
          <div className="flex justify-between text-xs font-bold text-[#EAEAE4]">
            <span>Level {levelInfo.currentLevel.level} Progress</span>
            <span>
              {levelInfo.nextLevel ? `${levelInfo.xpNeededForNext} XP to Level ${levelInfo.nextLevel.level}` : 'Max Level'}
            </span>
          </div>
          <ProgressBar progress={levelInfo.progressPercentage} color="violet" height="md" />
        </div>
      </div>

      {/* 7-DAY CARE STREAK CARD */}
      <Card variant="surface" padding="md" className="border border-[#EAEAE4]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#FFAA00] fill-[#FFAA00] animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#111111]">
                {streak.currentStreak}-Day Care Streak 🔥
              </h3>
              <p className="text-[11px] text-[#6B6B6B]">Check in daily to build your streak multiplier</p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={claimDailyStreak}
          >
            Check In (+30 XP)
          </Button>
        </div>

        {/* Weekly Day Circles */}
        <div className="grid grid-cols-7 gap-1.5 pt-2 border-t border-[#F1F1ED]">
          {streak.weeklyHistory.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center py-2 rounded-xl text-center select-none ${
                item.active ? 'bg-[#FFFBEB] text-[#B45309] font-black' : 'bg-[#F8F8F5] text-[#8E8E8E] font-medium'
              }`}
            >
              <span className="text-[10px]">{item.day}</span>
              <span className="text-xs mt-0.5">{item.active ? '🔥' : '○'}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ACTIVE DAILY & WEEKLY QUESTS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
            Active Challenges & Quests 🎯
          </h3>
          <span className="text-xs font-bold text-[#7C3AED]">Earn Bonus XP</span>
        </div>

        <div className="space-y-2.5">
          {challenges.map((ch) => (
            <Card
              key={ch.id}
              variant={ch.isCompleted ? 'accent-emerald' : 'surface'}
              padding="md"
              className="border-[#EAEAE4]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold text-[#7C3AED] uppercase">
                      {ch.category}
                    </span>
                    <span className="text-[10px] text-[#6B6B6B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {ch.expiresInHours}h left
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#111111]">{ch.title}</h4>
                  <p className="text-[11px] text-[#6B6B6B]">{ch.description}</p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="flex items-center gap-1 text-xs font-black text-black mb-1">
                    <span className="text-[#7C3AED]">+{ch.xpReward} XP</span>
                    <span>•</span>
                    <span className="text-[#FFAA00]">+{ch.pointsReward} Pts</span>
                  </div>

                  {ch.isCompleted ? (
                    <Badge variant="emerald" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                      Done ✓
                    </Badge>
                  ) : (
                    <Badge variant="muted" size="sm">
                      {ch.currentCount}/{ch.targetCount}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS & BADGES SHOWCASE */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
            Badges Showcase 🏆
          </h3>
          <span className="text-xs font-bold text-[#6B6B6B]">
            {achievements.filter((a) => a.isUnlocked).length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {achievements.map((ach) => (
            <Card
              key={ach.id}
              variant={ach.isUnlocked ? 'surface' : 'muted'}
              padding="md"
              className={`border transition-all ${
                ach.isUnlocked ? 'border-[#DFDFD6]' : 'opacity-70'
              }`}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    ach.isUnlocked ? 'bg-[#FFFBEB] border border-[#FDE68A]' : 'bg-[#EAEAE4]'
                  }`}
                >
                  {getBadgeIcon(ach.badgeIcon)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111111]">{ach.title}</h4>
                  <span className="text-[10px] font-extrabold text-[#7C3AED]">
                    +{ach.xpReward} XP
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#6B6B6B] leading-tight line-clamp-2">
                {ach.description}
              </p>

              <div className="mt-2 pt-2 border-t border-[#F1F1ED] flex justify-between items-center text-[10px] font-bold">
                <span className={ach.isUnlocked ? 'text-[#10B981]' : 'text-[#8E8E8E]'}>
                  {ach.isUnlocked ? 'Unlocked ✓' : 'In Progress'}
                </span>
                <span>{ach.progressCount}/{ach.targetCount}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* POINTS REDEMPTION STORE */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base font-extrabold text-[#111111] tracking-tight">
              Redeem POPCIX Points 🎁
            </h3>
            <p className="text-xs font-medium text-[#6B6B6B]">
              Balance: <span className="font-extrabold text-black">{points.toLocaleString()} Points</span>
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {rewards.map((reward) => (
            <Card
              key={reward.id}
              variant={reward.isRedeemed ? 'accent-emerald' : 'surface'}
              padding="md"
              className="border-[#EAEAE4]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-extrabold text-[#FFAA00] bg-black text-white px-2 py-0.5 rounded-full">
                      🪙 {reward.pointsCost} PTS
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[#111111] mt-1">{reward.title}</h4>
                  <p className="text-[11px] text-[#6B6B6B]">{reward.description}</p>
                </div>

                <div className="shrink-0">
                  {reward.isRedeemed ? (
                    <Badge variant="emerald" size="md">
                      Redeemed ✓
                    </Badge>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleRedeem(reward.id)}
                      disabled={points < reward.pointsCost}
                    >
                      Redeem
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
