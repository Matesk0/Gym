import { describe, test, expect } from '@jest/globals';
import { calculateFatigueStage, FATIGUE_STAGES, MUSCLE_DEFINITIONS } from '../constants/muscles';

describe('Muscle Fatigue & Recovery Calculations', () => {
  test('calculateFatigueStage classifies percentages into 5 distinct color stages correctly', () => {
    expect(calculateFatigueStage(10)).toBe(1); // 0-20% Exhausted
    expect(calculateFatigueStage(20)).toBe(1);
    expect(calculateFatigueStage(35)).toBe(2); // 21-40% Heavy Fatigue
    expect(calculateFatigueStage(50)).toBe(3); // 41-60% Moderate Recovery
    expect(calculateFatigueStage(75)).toBe(4); // 61-80% Mostly Recovered
    expect(calculateFatigueStage(95)).toBe(5); // 81-100% Fully Recovered
    expect(calculateFatigueStage(100)).toBe(5);
  });

  test('FATIGUE_STAGES mapping contains valid colors and descriptions for all 5 stages', () => {
    ([1, 2, 3, 4, 5] as const).forEach((stage) => {
      const info = FATIGUE_STAGES[stage];
      expect(info).toBeDefined();
      expect(info.color).toMatch(/^#[0-9A-FA-f]{6}$/);
      expect(info.label.length).toBeGreaterThan(0);
    });
  });

  test('MUSCLE_DEFINITIONS covers all major muscle groups with valid base recovery hours', () => {
    expect(MUSCLE_DEFINITIONS.length).toBeGreaterThan(15);
    MUSCLE_DEFINITIONS.forEach((muscle) => {
      expect(muscle.id).toBeDefined();
      expect(muscle.name).toBeDefined();
      expect(muscle.subHead).toBeDefined();
      expect(muscle.baseRecoveryHours).toBeGreaterThan(0);
      expect(['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core']).toContain(muscle.mainCategory);
    });
  });
});
