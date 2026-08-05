export type RankTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master' | 'Grandmaster';

export type FitnessGoal = 'Hypertrophy' | 'Strength' | 'Fat Loss' | 'Endurance' | 'General Fitness';
export type ExperienceLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
export type PreferredUnit = 'kg' | 'lbs';

export type TargetRepRange = 'Hypertrophy (8-12)' | 'Strength (3-5)' | 'Endurance (15-20)';

export interface Profile {
  id: string;
  username: string;
  avatar_url: string;
  is_online: boolean;
  is_public_logs: boolean;
  gender: 'male' | 'female';
  bodyweight_kg: number;
  height_cm?: number;
  fitness_goal?: FitnessGoal;
  experience_level?: ExperienceLevel;
  preferred_unit?: PreferredUnit;
  default_rest_seconds?: number;
  track_workout_time?: boolean;
  per_set_timer_enabled?: boolean;
  auto_hypertrophy_enabled?: boolean;
  target_rep_range?: TargetRepRange;
  overall_rank: RankTier;
  created_at?: string;
}

export type MainMuscleCategory = 'Chest' | 'Back' | 'Shoulders' | 'Arms' | 'Legs' | 'Core';

export interface Exercise {
  id: string;
  name: string;
  main_category: MainMuscleCategory;
  sub_category: string;
  target_muscles: string[];
  equipment: string;
  is_compound: boolean;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  title: string;
  is_public: boolean;
  created_at: string;
  sets?: SetLog[];
}

export interface SetLog {
  id: string;
  workout_log_id: string;
  exercise_id: string;
  exercise_name?: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  duration_seconds?: number;
  created_at?: string;
}

export type FatigueStage = 1 | 2 | 3 | 4 | 5;

export interface FatigueState {
  muscle_id: string;
  name: string;
  sub_head: string;
  main_category: MainMuscleCategory;
  last_trained_hours_ago: number;
  fatigue_percentage: number; // 0 (exhausted) to 100 (fully recovered)
  stage: FatigueStage;
  color: string;
  recovery_hours_needed: number;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string;
  is_online: boolean;
  rank: RankTier;
  total_score: number;
  bench_1rm: number;
  squat_1rm: number;
  deadlift_1rm: number;
  bodyweight_kg: number;
  ratio: number; // strength-to-weight ratio
}
