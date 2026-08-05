import { describe, it, expect } from '@jest/globals';
import { Profile, FitnessGoal, ExperienceLevel, PreferredUnit } from '../types/database';

describe('Optional Profile Preferences & Onboarding Tests', () => {
  it('should validate default profile preferences structure', () => {
    const mockProfile: Profile = {
      id: 'user-1',
      username: 'TestLifter',
      avatar_url: 'https://example.com/avatar.jpg',
      is_online: true,
      is_public_logs: false,
      gender: 'male',
      bodyweight_kg: 80,
      height_cm: 180,
      fitness_goal: 'Hypertrophy',
      experience_level: 'Intermediate',
      preferred_unit: 'kg',
      default_rest_seconds: 90,
      overall_rank: 'Gold',
    };

    expect(mockProfile.fitness_goal).toBe('Hypertrophy');
    expect(mockProfile.experience_level).toBe('Intermediate');
    expect(mockProfile.preferred_unit).toBe('kg');
    expect(mockProfile.default_rest_seconds).toBe(90);
    expect(mockProfile.height_cm).toBe(180);
  });

  it('should support updating optional profile attributes', () => {
    let profile: Profile = {
      id: 'user-2',
      username: 'PowerlifterJane',
      avatar_url: 'https://example.com/avatar.jpg',
      is_online: true,
      is_public_logs: false,
      gender: 'female',
      bodyweight_kg: 65,
      overall_rank: 'Platinum',
    };

    const updates: Partial<Profile> = {
      fitness_goal: 'Strength' as FitnessGoal,
      experience_level: 'Advanced' as ExperienceLevel,
      preferred_unit: 'lbs' as PreferredUnit,
      default_rest_seconds: 180,
      is_public_logs: true,
    };

    profile = { ...profile, ...updates };

    expect(profile.fitness_goal).toBe('Strength');
    expect(profile.experience_level).toBe('Advanced');
    expect(profile.preferred_unit).toBe('lbs');
    expect(profile.default_rest_seconds).toBe(180);
    expect(profile.is_public_logs).toBe(true);
  });

  it('should calculate automatic hypertrophy progressive overload (+2.5kg)', () => {
    const lastSet = { weightKg: 30, reps: 12 };
    const targetMaxReps = 12;
    const autoHypertrophyEnabled = true;

    let nextWeight = lastSet.weightKg;
    let overloadSuggested = false;

    if (autoHypertrophyEnabled && lastSet.reps >= targetMaxReps) {
      nextWeight += 2.5;
      overloadSuggested = true;
    }

    expect(nextWeight).toBe(32.5);
    expect(overloadSuggested).toBe(true);
  });
});
