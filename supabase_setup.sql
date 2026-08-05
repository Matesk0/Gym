-- ====================================================================
-- GYMPULSE - COMPLETE MASTER SUPABASE DATABASE SCHEMA & SEED DATA
-- Paste this script directly into the Supabase SQL Editor or Supabase AI.
-- This script enables extensions, creates all tables with full field schemas,
-- configures Row Level Security (RLS) policies, sets up automated auth triggers,
-- loads the exercise catalog, and seeds demo athletes with workout logs.
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. EXTENSIONS
-- --------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- --------------------------------------------------------------------
-- 2. PROFILES TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  is_online BOOLEAN DEFAULT true,
  is_public_logs BOOLEAN DEFAULT false,
  gender TEXT DEFAULT 'male',
  bodyweight_kg NUMERIC(5,2) DEFAULT 75.0,
  height_cm NUMERIC(5,2) DEFAULT 175.0,
  fitness_goal TEXT DEFAULT 'Hypertrophy',
  experience_level TEXT DEFAULT 'Intermediate',
  preferred_unit TEXT DEFAULT 'kg',
  default_rest_seconds INT DEFAULT 90,
  track_workout_time BOOLEAN DEFAULT true,
  per_set_timer_enabled BOOLEAN DEFAULT true,
  auto_hypertrophy_enabled BOOLEAN DEFAULT true,
  target_rep_range TEXT DEFAULT 'Hypertrophy (8-12)',
  overall_rank TEXT DEFAULT 'Bronze',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);


-- --------------------------------------------------------------------
-- 3. EXERCISES CATALOG TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  main_category TEXT NOT NULL, -- Chest, Back, Shoulders, Arms, Legs, Core
  sub_category TEXT NOT NULL,  -- e.g. Upper Chest, Lats, Lateral Deltoid
  target_muscles TEXT[] NOT NULL,
  equipment TEXT DEFAULT 'Dumbbell',
  is_compound BOOLEAN DEFAULT false
);

-- Enable RLS on Exercises
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Exercises are viewable by everyone" ON public.exercises;
CREATE POLICY "Exercises are viewable by everyone" 
  ON public.exercises FOR SELECT USING (true);


-- --------------------------------------------------------------------
-- 4. WORKOUT LOGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Workout Logs
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own workout logs" ON public.workout_logs;
CREATE POLICY "Users can manage own workout logs" 
  ON public.workout_logs FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Public workout logs are viewable by anyone" ON public.workout_logs;
CREATE POLICY "Public workout logs are viewable by anyone" 
  ON public.workout_logs FOR SELECT USING (
    is_public = true OR auth.uid() = user_id
  );


-- --------------------------------------------------------------------
-- 5. SET LOGS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.set_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_log_id UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INT NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL DEFAULT 0,
  reps INT NOT NULL DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Set Logs
ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage set logs of their own workouts" ON public.set_logs;
CREATE POLICY "Users can manage set logs of their own workouts" 
  ON public.set_logs FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workout_logs 
      WHERE public.workout_logs.id = set_logs.workout_log_id 
      AND public.workout_logs.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "View set logs for public workouts" ON public.set_logs;
CREATE POLICY "View set logs for public workouts" 
  ON public.set_logs FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_logs 
      WHERE public.workout_logs.id = set_logs.workout_log_id 
      AND (public.workout_logs.is_public = true OR public.workout_logs.user_id = auth.uid())
    )
  );


-- --------------------------------------------------------------------
-- 6. AUTOMATED USER REGISTRATION TRIGGER
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    avatar_url,
    is_online,
    is_public_logs,
    bodyweight_kg,
    height_cm,
    fitness_goal,
    experience_level,
    preferred_unit,
    default_rest_seconds,
    track_workout_time,
    per_set_timer_enabled,
    auto_hypertrophy_enabled,
    target_rep_range,
    overall_rank
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
    true,
    COALESCE((new.raw_user_meta_data->>'is_public_logs')::boolean, false),
    COALESCE((new.raw_user_meta_data->>'bodyweight_kg')::numeric, 75.0),
    COALESCE((new.raw_user_meta_data->>'height_cm')::numeric, 175.0),
    COALESCE(new.raw_user_meta_data->>'fitness_goal', 'Hypertrophy'),
    COALESCE(new.raw_user_meta_data->>'experience_level', 'Intermediate'),
    COALESCE(new.raw_user_meta_data->>'preferred_unit', 'kg'),
    COALESCE((new.raw_user_meta_data->>'default_rest_seconds')::int, 90),
    COALESCE((new.raw_user_meta_data->>'track_workout_time')::boolean, true),
    COALESCE((new.raw_user_meta_data->>'per_set_timer_enabled')::boolean, true),
    COALESCE((new.raw_user_meta_data->>'auto_hypertrophy_enabled')::boolean, true),
    COALESCE(new.raw_user_meta_data->>'target_rep_range', 'Hypertrophy (8-12)'),
    'Bronze'
  )
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- --------------------------------------------------------------------
-- 7. EXERCISE CATALOG PRE-LOAD DATA
-- --------------------------------------------------------------------
INSERT INTO public.exercises (name, main_category, sub_category, target_muscles, equipment, is_compound) VALUES
-- Chest
('Incline Dumbbell Press', 'Chest', 'Upper Chest', ARRAY['Upper Chest', 'Anterior Deltoid', 'Triceps Lateral Head'], 'Dumbbell', true),
('Barbell Bench Press', 'Chest', 'Middle Chest', ARRAY['Middle Chest', 'Anterior Deltoid', 'Triceps Medial Head'], 'Barbell', true),
('Cable Chest Fly', 'Chest', 'Middle Chest', ARRAY['Middle Chest', 'Upper Chest'], 'Cable', false),
('Decline Dumbbell Press', 'Chest', 'Lower Chest', ARRAY['Lower Chest', 'Triceps Lateral Head'], 'Dumbbell', true),

-- Back
('Lat Pulldown', 'Back', 'Lats', ARRAY['Lats', 'Biceps Short Head'], 'Cable', true),
('Seated Cable Row', 'Back', 'Rhomboids', ARRAY['Rhomboids', 'Lats', 'Biceps Long Head'], 'Cable', true),
('Barbell Shrugs', 'Back', 'Upper Back & Traps', ARRAY['Upper Back & Traps'], 'Barbell', false),
('Conventional Deadlift', 'Back', 'Lower Back', ARRAY['Lower Back', 'Hamstrings', 'Glutes'], 'Barbell', true),

-- Shoulders
('Overhead Military Press', 'Shoulders', 'Anterior Deltoid', ARRAY['Anterior Deltoid', 'Triceps Medial Head'], 'Barbell', true),
('Dumbbell Lateral Raise', 'Shoulders', 'Lateral Deltoid', ARRAY['Lateral Deltoid'], 'Dumbbell', false),
('Rear Delt Cable Fly', 'Shoulders', 'Posterior Deltoid', ARRAY['Posterior Deltoid', 'Rhomboids'], 'Cable', false),

-- Arms
('Incline Dumbbell Bicep Curl', 'Arms', 'Biceps - Long Head', ARRAY['Biceps - Long Head'], 'Dumbbell', false),
('Preacher Barbell Curl', 'Arms', 'Biceps - Short Head', ARRAY['Biceps - Short Head'], 'Barbell', false),
('Dumbbell Hammer Curl', 'Arms', 'Brachialis', ARRAY['Brachialis', 'Forearms'], 'Dumbbell', false),
('Overhead Tricep Extension', 'Arms', 'Triceps - Long Head', ARRAY['Triceps - Long Head'], 'Dumbbell', false),
('Tricep Rope Pushdown', 'Arms', 'Triceps - Lateral Head', ARRAY['Triceps - Lateral Head'], 'Cable', false),

-- Legs
('Barbell Back Squat', 'Legs', 'Quads', ARRAY['Quads - Rectus Femoris', 'Glutes'], 'Barbell', true),
('Romanian Deadlift', 'Legs', 'Hamstrings', ARRAY['Hamstrings', 'Glutes', 'Lower Back'], 'Barbell', true),
('Barbell Hip Thrust', 'Legs', 'Glutes', ARRAY['Glutes', 'Hamstrings'], 'Barbell', true),
('Standing Calf Raise', 'Legs', 'Calves', ARRAY['Calves'], 'Machine', false),

-- Core
('Cable Ab Crunch', 'Core', 'Upper Abs', ARRAY['Upper Abs'], 'Cable', false),
('Hanging Leg Raise', 'Core', 'Lower Abs', ARRAY['Lower Abs'], 'Bodyweight', false),
('Russian Twists', 'Core', 'Obliques', ARRAY['Obliques'], 'Bodyweight', false)
ON CONFLICT DO NOTHING;


-- --------------------------------------------------------------------
-- 8. SEED DEMO ATHLETES & WORKOUT LOGS
-- --------------------------------------------------------------------
DO $$
DECLARE
  user1_id UUID := 'a1111111-1111-4111-a111-111111111111';
  user2_id UUID := 'b2222222-2222-4222-b222-222222222222';
  user3_id UUID := 'c3333333-3333-4333-c333-333333333333';
  user4_id UUID := 'd4444444-4444-4444-d444-444444444444';
  user5_id UUID := 'e5555555-5555-4555-e555-555555555555';
  user6_id UUID := 'f6666666-6666-4666-f666-666666666666';

  w1_id UUID := '11111111-aaaa-4111-8111-111111111111';
  w2_id UUID := '22222222-bbbb-4222-8222-222222222222';
  w3_id UUID := '33333333-cccc-4333-8333-333333333333';
  w4_id UUID := '44444444-dddd-4444-8444-444444444444';

  bench_ex_id UUID;
  squat_ex_id UUID;
  deadlift_ex_id UUID;
BEGIN
  -- Insert Demo Auth Users (password: 'Password123!')
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
  ) VALUES
  (
    user1_id, '00000000-0000-0000-0000-000000000000', 'marcus@gympulse.app',
    crypt('Password123!', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"username":"Titan_Marcus","avatar_url":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"}',
    NOW() - INTERVAL '30 days', NOW(), 'authenticated', 'authenticated'
  ),
  (
    user2_id, '00000000-0000-0000-0000-000000000000', 'elena@gympulse.app',
    crypt('Password123!', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"username":"Elena_Valkyrie","avatar_url":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200"}',
    NOW() - INTERVAL '25 days', NOW(), 'authenticated', 'authenticated'
  ),
  (
    user3_id, '00000000-0000-0000-0000-000000000000', 'alex@gympulse.app',
    crypt('Password123!', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"username":"Alex_LiftMaster","avatar_url":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}',
    NOW() - INTERVAL '20 days', NOW(), 'authenticated', 'authenticated'
  ),
  (
    user4_id, '00000000-0000-0000-0000-000000000000', 'dmitri@gympulse.app',
    crypt('Password123!', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"username":"Dmitri_Steel","avatar_url":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200"}',
    NOW() - INTERVAL '15 days', NOW(), 'authenticated', 'authenticated'
  ),
  (
    user5_id, '00000000-0000-0000-0000-000000000000', 'sarah@gympulse.app',
    crypt('Password123!', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"username":"Sarah_Pulse","avatar_url":"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200"}',
    NOW() - INTERVAL '10 days', NOW(), 'authenticated', 'authenticated'
  ),
  (
    user6_id, '00000000-0000-0000-0000-000000000000', 'maya@gympulse.app',
    crypt('Password123!', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"username":"Maya_Strong","avatar_url":"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200"}',
    NOW() - INTERVAL '5 days', NOW(), 'authenticated', 'authenticated'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Upsert Public Profiles with Full Attributes
  INSERT INTO public.profiles (
    id, username, avatar_url, is_online, is_public_logs, gender, bodyweight_kg, height_cm,
    fitness_goal, experience_level, preferred_unit, default_rest_seconds, track_workout_time,
    per_set_timer_enabled, auto_hypertrophy_enabled, target_rep_range, overall_rank
  )
  VALUES
    (user1_id, 'Titan_Marcus', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', true, true, 'male', 92.0, 185.0, 'Strength', 'Elite', 'kg', 120, true, true, true, 'Strength (3-5)', 'Grandmaster'),
    (user2_id, 'Elena_Valkyrie', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', true, true, 'female', 65.0, 168.0, 'Hypertrophy', 'Advanced', 'kg', 90, true, true, true, 'Hypertrophy (8-12)', 'Master'),
    (user3_id, 'Alex_LiftMaster', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', true, true, 'male', 78.5, 178.0, 'Hypertrophy', 'Intermediate', 'kg', 90, true, true, true, 'Hypertrophy (8-12)', 'Gold'),
    (user4_id, 'Dmitri_Steel', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', false, false, 'male', 85.0, 180.0, 'Strength', 'Advanced', 'kg', 120, true, true, true, 'Strength (3-5)', 'Platinum'),
    (user5_id, 'Sarah_Pulse', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', true, true, 'female', 62.0, 165.0, 'Fat Loss', 'Intermediate', 'kg', 60, true, true, true, 'Endurance (15-20)', 'Silver'),
    (user6_id, 'Maya_Strong', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', true, false, 'female', 58.0, 162.0, 'General Fitness', 'Beginner', 'kg', 90, true, true, true, 'Hypertrophy (8-12)', 'Bronze')
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url,
    is_online = EXCLUDED.is_online,
    is_public_logs = EXCLUDED.is_public_logs,
    gender = EXCLUDED.gender,
    bodyweight_kg = EXCLUDED.bodyweight_kg,
    height_cm = EXCLUDED.height_cm,
    fitness_goal = EXCLUDED.fitness_goal,
    experience_level = EXCLUDED.experience_level,
    preferred_unit = EXCLUDED.preferred_unit,
    default_rest_seconds = EXCLUDED.default_rest_seconds,
    track_workout_time = EXCLUDED.track_workout_time,
    per_set_timer_enabled = EXCLUDED.per_set_timer_enabled,
    auto_hypertrophy_enabled = EXCLUDED.auto_hypertrophy_enabled,
    target_rep_range = EXCLUDED.target_rep_range,
    overall_rank = EXCLUDED.overall_rank;

  -- Insert Sample Workout Logs
  INSERT INTO public.workout_logs (id, user_id, title, is_public, created_at)
  VALUES
    (w1_id, user1_id, 'Grandmaster Heavy Push & Chest', true, NOW() - INTERVAL '1 day'),
    (w2_id, user2_id, 'Master Leg & Squat Destruction', true, NOW() - INTERVAL '2 days'),
    (w3_id, user3_id, 'Upper Body Power Session', true, NOW() - INTERVAL '3 hours'),
    (w4_id, user4_id, 'Secret Heavy Deadlift Night', false, NOW() - INTERVAL '4 days')
  ON CONFLICT (id) DO NOTHING;

  -- Fetch Exercise IDs
  SELECT id INTO bench_ex_id FROM public.exercises WHERE name = 'Barbell Bench Press' LIMIT 1;
  SELECT id INTO squat_ex_id FROM public.exercises WHERE name = 'Barbell Back Squat' LIMIT 1;
  SELECT id INTO deadlift_ex_id FROM public.exercises WHERE name = 'Conventional Deadlift' LIMIT 1;

  -- Insert Set Logs
  IF bench_ex_id IS NOT NULL THEN
    INSERT INTO public.set_logs (workout_log_id, exercise_id, set_number, weight_kg, reps, duration_seconds) VALUES
      (w1_id, bench_ex_id, 1, 140.0, 10, 45),
      (w1_id, bench_ex_id, 2, 160.0, 6, 40),
      (w1_id, bench_ex_id, 3, 180.0, 1, 20),
      (w3_id, bench_ex_id, 1, 90.0, 10, 50),
      (w3_id, bench_ex_id, 2, 100.0, 8, 45),
      (w3_id, bench_ex_id, 3, 115.0, 1, 15)
    ON CONFLICT DO NOTHING;
  END IF;

  IF squat_ex_id IS NOT NULL THEN
    INSERT INTO public.set_logs (workout_log_id, exercise_id, set_number, weight_kg, reps, duration_seconds) VALUES
      (w2_id, squat_ex_id, 1, 150.0, 10, 60),
      (w2_id, squat_ex_id, 2, 175.0, 6, 55),
      (w2_id, squat_ex_id, 3, 195.0, 2, 30)
    ON CONFLICT DO NOTHING;
  END IF;

  IF deadlift_ex_id IS NOT NULL THEN
    INSERT INTO public.set_logs (workout_log_id, exercise_id, set_number, weight_kg, reps, duration_seconds) VALUES
      (w4_id, deadlift_ex_id, 1, 170.0, 8, 50),
      (w4_id, deadlift_ex_id, 2, 190.0, 5, 45),
      (w4_id, deadlift_ex_id, 3, 210.0, 2, 25)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
