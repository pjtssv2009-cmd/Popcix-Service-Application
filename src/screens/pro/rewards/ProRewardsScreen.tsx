/**
 * POPCIX PRO - Rewards & Gamification Hub Screen
 * Level progression (AC HERO), Streak flame tracker, Badges, Active Challenges, Perks and XP Leaderboard.
 */

import React, { useState } from 'react';
import { useProGamification } from '../../../context/ProGamificationContext';

export function ProRewardsScreen() {
  const {
    xp,
    level,
    levelProgressPercent,
    streakDays,
    badges,
    challenges,
    leaderboard,
    isLeaderboardOptedIn,
    toggleLeaderboardOptIn,
    unlockBadge
  } = useProGamification();

  const [activeTab, setActiveTab] = useState<'challenges' | 'badges' | 'leaderboard' | 'perks'>('challenges');

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 space-y-4 max-w-md mx-auto">
      {/* Title */}
      <div>
        <h1 className="text-xl font-black text-[#111111]">Rewards & Growth</h1>
        <p className="text-xs text-[#6B6B6B]">Gamified Levels, Streaks & Special Perks</p>
      </div>

      {/* Gamification Level Hero */}
      <div className="bg-[#000000] text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FFAA00] block mb-0.5">
              CURRENT LEVEL
            </span>
            <h2 className="text-2xl font-black text-white">{level}</h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFAA00] to-[#FFD700] text-black font-black text-xl flex items-center justify-center shadow-lg">
            ⚡
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/80 mb-1.5 font-medium">
            <span>Progress to Next Tier</span>
            <span className="text-[#FFAA00] font-bold">{xp.toLocaleString()} / 10,000 XP</span>
          </div>
          <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#FFAA00] to-[#10B981] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (xp / 10000) * 100)}%` }}
            />
          </div>
        </div>

        {/* 6-Day Streak Track */}
        <div className="bg-white/10 rounded-2xl p-3 border border-white/10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>🔥</span>
              <span>{streakDays}-Day Activity Streak</span>
            </span>
            <span className="text-[11px] text-[#FFAA00] font-bold">+50 XP / day</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5 text-center text-[10px]">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
              const isFilled = i < streakDays;
              return (
                <div
                  key={i}
                  className={`py-1.5 rounded-lg font-bold ${
                    isFilled ? 'bg-[#FFAA00] text-black shadow-xs' : 'bg-white/15 text-white/50'
                  }`}
                >
                  {isFilled ? '🔥' : day}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#F0F0EB] p-1 rounded-2xl">
        {[
          { key: 'challenges', label: 'Challenges' },
          { key: 'badges', label: 'Badges' },
          { key: 'leaderboard', label: 'Rankings' },
          { key: 'perks', label: 'Perks' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.key ? 'bg-white text-black shadow-xs' : 'text-[#6B6B6B] hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CHALLENGES */}
      {activeTab === 'challenges' && (
        <div className="space-y-3">
          {challenges.map(ch => (
            <div
              key={ch.id}
              className={`p-4 rounded-2xl border transition-all ${
                ch.completed ? 'bg-[#F0FDF4] border-[#86EFAC]' : 'bg-white border-[#E5E5E0] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-xs font-bold text-[#111111]">{ch.title}</h4>
                <div className="text-right shrink-0">
                  <span className="text-xs font-black text-[#7C3AED]">+{ch.xpReward} XP</span>
                  {ch.cashBonus && (
                    <span className="text-[10px] font-bold text-[#10B981] block">+₹{ch.cashBonus}</span>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-[#6B6B6B] mb-2.5 leading-relaxed">
                {ch.description}
              </p>

              {/* Progress */}
              <div className="flex items-center justify-between text-[11px] text-[#444444] mb-1">
                <span>Progress</span>
                <span className="font-bold">
                  {ch.currentValue} / {ch.targetValue}
                </span>
              </div>
              <div className="w-full bg-[#E5E5E0] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    ch.completed ? 'bg-[#10B981]' : 'bg-[#000000]'
                  }`}
                  style={{ width: `${Math.min(100, (ch.currentValue / ch.targetValue) * 100)}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-[#6B6B6B] mt-2">
                <span>Deadline: {ch.deadline}</span>
                {ch.completed && (
                  <span className="text-[#047857] font-bold">✓ Completed</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: BADGES */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-2 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              onClick={() => !b.isUnlocked && unlockBadge(b.id)}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                b.isUnlocked
                  ? 'bg-white border-[#E5E5E0] shadow-xs hover:border-black'
                  : 'bg-[#F8F8F5] border-[#EBEBE6] opacity-60'
              }`}
            >
              <div className="text-3xl mb-1">{b.icon}</div>
              <h4 className="text-xs font-bold text-[#111111] mb-1">{b.title}</h4>
              <p className="text-[10px] text-[#6B6B6B] line-clamp-2 mb-2">{b.description}</p>
              {b.isUnlocked ? (
                <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-md">
                  ✓ Unlocked
                </span>
              ) : (
                <span className="text-[10px] font-semibold text-[#6B6B6B]">
                  {b.progressPercent}% complete
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <div className="bg-white rounded-2xl p-4 border border-[#E5E5E0] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B]">
              WEEKLY XP LEADERBOARD
            </h3>
            <button
              onClick={toggleLeaderboardOptIn}
              className="text-[11px] font-bold text-[#7C3AED] hover:underline"
            >
              {isLeaderboardOptedIn ? 'Opt-Out (Private)' : 'Opt-In (Public)'}
            </button>
          </div>

          <div className="space-y-2">
            {leaderboard.map(entry => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-3 rounded-xl border ${
                  entry.isCurrentUser
                    ? 'bg-[#FFFDF5] border-[#FFAA00] ring-1 ring-[#FFAA00]/30 font-bold'
                    : 'bg-[#F8F8F5] border-[#EBEBE6]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    entry.rank === 1 ? 'bg-[#FFAA00] text-black' : entry.rank === 2 ? 'bg-[#CCCCCC] text-black' : 'bg-[#E5E5E0] text-black'
                  }`}>
                    {entry.rank}
                  </span>
                  <div>
                    <div className="text-xs text-[#111111]">{entry.name}</div>
                    <div className="text-[10px] text-[#6B6B6B]">{entry.level} • {entry.jobs} jobs</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-[#7C3AED]">{entry.xp.toLocaleString()} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PERKS & DISCOUNTS */}
      {activeTab === 'perks' && (
        <div className="space-y-3">
          {[
            { title: '₹1,000 Weekly Milestone Bonus', desc: 'Achieve 30 jobs in a week. Cash deposited directly into next Friday payout.', icon: '🎁', unlocked: true },
            { title: '20% Discount on HVAC Toolkits', desc: 'Redeem at authorized POPCIX Pro Partner hardware stores across Chennai.', icon: '🔧', unlocked: true },
            { title: 'Free Medical & Accident Insurance', desc: 'Complimentary ₹5 Lakh accidental coverage maintained by POPCIX.', icon: '🏥', unlocked: true },
            { title: 'VIP Priority Dispatch', desc: 'Priority access to high-value inverter AC multi-unit maintenance jobs.', icon: '⚡', unlocked: false }
          ].map((perk, idx) => (
            <div key={idx} className="p-3.5 bg-white rounded-2xl border border-[#E5E5E0] shadow-xs flex items-start gap-3">
              <span className="text-2xl">{perk.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#111111]">{perk.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    perk.unlocked ? 'bg-[#10B981]/15 text-[#047857]' : 'bg-[#E5E5E0] text-[#666666]'
                  }`}>
                    {perk.unlocked ? 'ACTIVE' : 'LOCKED'}
                  </span>
                </div>
                <p className="text-[11px] text-[#6B6B6B] mt-1">{perk.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
