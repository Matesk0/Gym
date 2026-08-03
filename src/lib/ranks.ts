import { RankTier } from '../types/database';

export function calculateEstimated1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return Math.round(weightKg);
  // Epley Formula: 1RM = weight * (1 + reps / 30)
  return Math.round(weightKg * (1 + reps / 30));
}

export function calculateStrengthRank(ratioToBodyweight: number): RankTier {
  if (ratioToBodyweight >= 2.5) return 'Grandmaster';
  if (ratioToBodyweight >= 2.0) return 'Master';
  if (ratioToBodyweight >= 1.75) return 'Diamond';
  if (ratioToBodyweight >= 1.5) return 'Platinum';
  if (ratioToBodyweight >= 1.25) return 'Gold';
  if (ratioToBodyweight >= 1.0) return 'Silver';
  return 'Bronze';
}

export interface RankProgress {
  currentRank: RankTier;
  nextRank: RankTier | null;
  progressPercent: number;
  currentRatio: number;
  targetRatio: number | null;
}

export const TIER_RATIO_BOUNDS: Record<RankTier, { minRatio: number; nextTier: RankTier | null; nextMinRatio: number | null }> = {
  Bronze: { minRatio: 0.0, nextTier: 'Silver', nextMinRatio: 1.0 },
  Silver: { minRatio: 1.0, nextTier: 'Gold', nextMinRatio: 1.25 },
  Gold: { minRatio: 1.25, nextTier: 'Platinum', nextMinRatio: 1.5 },
  Platinum: { minRatio: 1.5, nextTier: 'Diamond', nextMinRatio: 1.75 },
  Diamond: { minRatio: 1.75, nextTier: 'Master', nextMinRatio: 2.0 },
  Master: { minRatio: 2.0, nextTier: 'Grandmaster', nextMinRatio: 2.5 },
  Grandmaster: { minRatio: 2.5, nextTier: null, nextMinRatio: null },
};

export function calculateRankProgress(ratioToBodyweight: number): RankProgress {
  const currentRank = calculateStrengthRank(ratioToBodyweight);
  const bounds = TIER_RATIO_BOUNDS[currentRank];

  if (!bounds.nextTier || bounds.nextMinRatio === null) {
    return {
      currentRank,
      nextRank: null,
      progressPercent: 100,
      currentRatio: ratioToBodyweight,
      targetRatio: null,
    };
  }

  const range = bounds.nextMinRatio - bounds.minRatio;
  const progressInTier = ratioToBodyweight - bounds.minRatio;
  const rawPercentage = Math.round((progressInTier / range) * 100);
  const progressPercent = Math.min(100, Math.max(0, rawPercentage));

  return {
    currentRank,
    nextRank: bounds.nextTier,
    progressPercent,
    currentRatio: Math.round(ratioToBodyweight * 100) / 100,
    targetRatio: bounds.nextMinRatio,
  };
}
