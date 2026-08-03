import { describe, test, expect } from '@jest/globals';
import { calculateEstimated1RM, calculateStrengthRank, calculateRankProgress } from '../lib/ranks';

describe('Gamified Strength Rank & 1RM Calculations', () => {
  test('calculateEstimated1RM computes accurate 1-Rep Max using Epley formula', () => {
    expect(calculateEstimated1RM(100, 1)).toBe(100);
    expect(calculateEstimated1RM(100, 10)).toBe(133);
    expect(calculateEstimated1RM(80, 5)).toBe(93);
    expect(calculateEstimated1RM(0, 5)).toBe(0);
  });

  test('calculateStrengthRank assigns appropriate gaming tier based on bodyweight ratio', () => {
    expect(calculateStrengthRank(0.8)).toBe('Bronze');
    expect(calculateStrengthRank(1.1)).toBe('Silver');
    expect(calculateStrengthRank(1.35)).toBe('Gold');
    expect(calculateStrengthRank(1.6)).toBe('Platinum');
    expect(calculateStrengthRank(1.8)).toBe('Diamond');
    expect(calculateStrengthRank(2.1)).toBe('Master');
    expect(calculateStrengthRank(2.7)).toBe('Grandmaster');
  });

  test('calculateRankProgress returns correct percentage and target for next tier', () => {
    const goldProgress = calculateRankProgress(1.375); // midpoint of Gold (1.25 -> 1.5)
    expect(goldProgress.currentRank).toBe('Gold');
    expect(goldProgress.nextRank).toBe('Platinum');
    expect(goldProgress.progressPercent).toBe(50);
    expect(goldProgress.targetRatio).toBe(1.5);

    const gmProgress = calculateRankProgress(2.8);
    expect(gmProgress.currentRank).toBe('Grandmaster');
    expect(gmProgress.nextRank).toBeNull();
    expect(gmProgress.progressPercent).toBe(100);
  });
});

