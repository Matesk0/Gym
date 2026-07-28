import { FatigueStage, MainMuscleCategory } from '../types/database';

export interface MuscleDefinition {
  id: string;
  name: string;
  subHead: string;
  mainCategory: MainMuscleCategory;
  view: 'front' | 'back' | 'both';
  baseRecoveryHours: number; // Recovery time needed (hours)
}

export const FATIGUE_STAGES: Record<FatigueStage, { label: string; range: string; color: string; bg: string }> = {
  1: { label: 'Exhausted', range: '0 - 20%', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.15)' },
  2: { label: 'Heavy Fatigue', range: '21 - 40%', color: '#F97316', bg: 'rgba(249, 115, 22, 0.15)' },
  3: { label: 'Moderate Recovery', range: '41 - 60%', color: '#EAB308', bg: 'rgba(234, 179, 8, 0.15)' },
  4: { label: 'Mostly Recovered', range: '61 - 80%', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.15)' },
  5: { label: 'Fully Recovered', range: '81 - 100%', color: '#10B981', bg: 'rgba(16, 185, 129, 0.15)' },
};

export const MUSCLE_DEFINITIONS: MuscleDefinition[] = [
  // CHEST
  { id: 'upper_chest', name: 'Upper Chest', subHead: 'Clavicular Head', mainCategory: 'Chest', view: 'front', baseRecoveryHours: 48 },
  { id: 'middle_chest', name: 'Middle Chest', subHead: 'Sternal Head', mainCategory: 'Chest', view: 'front', baseRecoveryHours: 48 },
  { id: 'lower_chest', name: 'Lower Chest', subHead: 'Costal Head', mainCategory: 'Chest', view: 'front', baseRecoveryHours: 44 },

  // SHOULDERS
  { id: 'anterior_delt', name: 'Front Shoulders', subHead: 'Anterior Deltoid', mainCategory: 'Shoulders', view: 'front', baseRecoveryHours: 40 },
  { id: 'lateral_delt', name: 'Side Shoulders', subHead: 'Lateral Deltoid', mainCategory: 'Shoulders', view: 'both', baseRecoveryHours: 36 },
  { id: 'posterior_delt', name: 'Rear Shoulders', subHead: 'Posterior Deltoid', mainCategory: 'Shoulders', view: 'back', baseRecoveryHours: 36 },

  // BACK
  { id: 'traps', name: 'Upper Back', subHead: 'Trapezius', mainCategory: 'Back', view: 'back', baseRecoveryHours: 48 },
  { id: 'lats', name: 'Lats', subHead: 'Latissimus Dorsi', mainCategory: 'Back', view: 'back', baseRecoveryHours: 60 },
  { id: 'rhomboids', name: 'Mid Back', subHead: 'Rhomboids', mainCategory: 'Back', view: 'back', baseRecoveryHours: 48 },
  { id: 'lower_back', name: 'Lower Back', subHead: 'Erector Spinae', mainCategory: 'Back', view: 'back', baseRecoveryHours: 72 },

  // ARMS
  { id: 'biceps_long', name: 'Outer Bicep', subHead: 'Biceps Long Head', mainCategory: 'Arms', view: 'front', baseRecoveryHours: 36 },
  { id: 'biceps_short', name: 'Inner Bicep', subHead: 'Biceps Short Head', mainCategory: 'Arms', view: 'front', baseRecoveryHours: 36 },
  { id: 'brachialis', name: 'Brachialis', subHead: 'Brachialis', mainCategory: 'Arms', view: 'front', baseRecoveryHours: 32 },
  { id: 'triceps_long', name: 'Long Tricep', subHead: 'Triceps Long Head', mainCategory: 'Arms', view: 'back', baseRecoveryHours: 40 },
  { id: 'triceps_lateral', name: 'Outer Tricep', subHead: 'Triceps Lateral Head', mainCategory: 'Arms', view: 'back', baseRecoveryHours: 36 },
  { id: 'triceps_medial', name: 'Inner Tricep', subHead: 'Triceps Medial Head', mainCategory: 'Arms', view: 'back', baseRecoveryHours: 36 },
  { id: 'forearms', name: 'Forearms', subHead: 'Flexors & Extensors', mainCategory: 'Arms', view: 'both', baseRecoveryHours: 24 },

  // LEGS
  { id: 'quads', name: 'Quads', subHead: 'Rectus Femoris & Vastus', mainCategory: 'Legs', view: 'front', baseRecoveryHours: 64 },
  { id: 'hamstrings', name: 'Hamstrings', subHead: 'Biceps Femoris', mainCategory: 'Legs', view: 'back', baseRecoveryHours: 64 },
  { id: 'glutes', name: 'Glutes', subHead: 'Gluteus Maximus', mainCategory: 'Legs', view: 'back', baseRecoveryHours: 56 },
  { id: 'calves', name: 'Calves', subHead: 'Gastrocnemius & Soleus', mainCategory: 'Legs', view: 'both', baseRecoveryHours: 30 },

  // CORE
  { id: 'upper_abs', name: 'Upper Abs', subHead: 'Rectus Abdominis (Upper)', mainCategory: 'Core', view: 'front', baseRecoveryHours: 24 },
  { id: 'lower_abs', name: 'Lower Abs', subHead: 'Rectus Abdominis (Lower)', mainCategory: 'Core', view: 'front', baseRecoveryHours: 24 },
  { id: 'obliques', name: 'Obliques', subHead: 'External & Internal Obliques', mainCategory: 'Core', view: 'front', baseRecoveryHours: 28 },
  { id: 'serratus', name: 'Serratus', subHead: 'Serratus Anterior', mainCategory: 'Core', view: 'front', baseRecoveryHours: 24 },
];

export function calculateFatigueStage(percentage: number): FatigueStage {
  if (percentage <= 20) return 1;
  if (percentage <= 40) return 2;
  if (percentage <= 60) return 3;
  if (percentage <= 80) return 4;
  return 5;
}
