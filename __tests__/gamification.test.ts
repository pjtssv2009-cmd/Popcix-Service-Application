import { describe, it, expect } from 'vitest';
import { GamificationEngine, LEVEL_THRESHOLDS } from '../src/services/gamification/gamificationEngine';

describe('POPCIX Gamification Engine Tests', () => {
  it('correctly maps XP to Level 4 Home Hero', () => {
    const levelInfo = GamificationEngine.getLevelInfo(820);
    expect(levelInfo.currentLevel.level).toBe(4);
    expect(levelInfo.currentLevel.title).toBe('Home Hero');
    expect(levelInfo.currentLevel.minXp).toBe(801);
    expect(levelInfo.currentLevel.maxXp).toBe(1200);
    expect(levelInfo.nextLevel?.level).toBe(5);
    expect(levelInfo.xpNeededForNext).toBe(381); // 1201 - 820
  });

  it('correctly calculates Level 1 for new user with 150 XP', () => {
    const levelInfo = GamificationEngine.getLevelInfo(150);
    expect(levelInfo.currentLevel.level).toBe(1);
    expect(levelInfo.currentLevel.title).toBe('Novice Caretaker');
    expect(levelInfo.progressPercentage).toBe(75); // 150 / 200
  });

  it('handles maximum level gracefully', () => {
    const levelInfo = GamificationEngine.getLevelInfo(3000);
    expect(levelInfo.currentLevel.level).toBe(6);
    expect(levelInfo.currentLevel.title).toBe('Grand Home Master');
    expect(levelInfo.progressPercentage).toBe(100);
    expect(levelInfo.nextLevel).toBeUndefined();
  });
});
