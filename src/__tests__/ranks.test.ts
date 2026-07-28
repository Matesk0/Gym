import { describe, test, expect } from '@jest/globals';
import { RankTier } from '../types/database';

function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30));
}

function calculateStrengthRank(ratioToBodyweight: number): RankTier {
  if (ratioToBodyweight >= 2.5) return 'Grandmaster';
  if (ratioToBodyweight >= 2.0) return 'Master';
  if (ratioToBodyweight >= 1.75) return 'Diamond';
  if (ratioToBodyweight >= 1.5) return 'Platinum';
  if (ratioToBodyweight >= 1.25) return 'Gold';
  if (ratioToBodyweight >= 1.0) return 'Silver';
  return 'Bronze';
}

describe('Gamified Strength Rank & 1RM Calculations', () => {
  test('calculateEstimated1RM computes accurate 1-Rep Max using Epley formula', () => {
    expect(calculateEstimated1RM(100, 1)).toBe(100);
    expect(calculateEstimated1RM(100, 10)).toBe(133);
    expect(calculateEstimated1RM(80, 5)).toBe(93);
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
});
