-- ========================================================
-- GYMPULSE - SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Paste this script directly into Supabase SQL Editor
-- ========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  is_online BOOLEAN DEFAULT true,
  is_public_logs BOOLEAN DEFAULT false,
  gender TEXT DEFAULT 'male',
  bodyweight_kg NUMERIC(5,2) DEFAULT 75.0,
  overall_rank TEXT DEFAULT 'Bronze',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);


-- 2. EXERCISES CATALOG
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  main_category TEXT NOT NULL, -- Chest, Back, Shoulders, Arms, Legs, Core
  sub_category TEXT NOT NULL,  -- e.g. Upper Chest, Lats, Lateral Deltoid
  target_muscles TEXT[] NOT NULL,
  equipment TEXT DEFAULT 'Dumbbell',
  is_compound BOOLEAN DEFAULT false
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Exercises are viewable by everyone" 
  ON public.exercises FOR SELECT USING (true);


-- 3. WORKOUT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Owner can do everything
CREATE POLICY "Users can manage own workout logs" 
  ON public.workout_logs FOR ALL USING (auth.uid() = user_id);

-- Other users can view only public logs
CREATE POLICY "Public workout logs are viewable by anyone" 
  ON public.workout_logs FOR SELECT USING (
    is_public = true OR auth.uid() = user_id
  );


-- 4. SET LOGS TABLE
CREATE TABLE IF NOT EXISTS public.set_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workout_log_id UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  set_number INT NOT NULL,
  weight_kg NUMERIC(6,2) NOT NULL DEFAULT 0,
  reps INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage set logs of their own workouts" 
  ON public.set_logs FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.workout_logs 
      WHERE public.workout_logs.id = set_logs.workout_log_id 
      AND public.workout_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "View set logs for public workouts" 
  ON public.set_logs FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_logs 
      WHERE public.workout_logs.id = set_logs.workout_log_id 
      AND (public.workout_logs.is_public = true OR public.workout_logs.user_id = auth.uid())
    )
  );


-- 5. TRIGGER FOR NEW USER PROFILE CREATION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url, is_online, is_public_logs, bodyweight_kg, overall_rank)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
    true,
    false,
    75.0,
    'Bronze'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- PRE-LOAD GRANULAR EXERCISE CATALOG DATA
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
('Russian Twists', 'Core', 'Obliques', ARRAY['Obliques'], 'Bodyweight', false);
