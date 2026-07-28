-- ====================================================================
-- GYMPULSE - SUPABASE AI USER SEEDING SCRIPT
-- Paste this script into Supabase SQL Editor or feed to Supabase AI
-- to automatically provision demo athletes, profiles, and workout logs.
-- ====================================================================

-- Ensure pgcrypto is enabled for secure password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
DECLARE
  -- Fixed UUIDs for deterministic user seeding
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
  incline_ex_id UUID;
  lat_ex_id UUID;
BEGIN
  -- 1. PROVISION AUTH USERS (with encrypted password 'Password123!')
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

  -- 2. UPDATE/UPSERT PUBLIC PROFILES WITH ATHLETE RANKS & BODYWEIGHTS
  INSERT INTO public.profiles (id, username, avatar_url, is_online, is_public_logs, gender, bodyweight_kg, overall_rank)
  VALUES
    (user1_id, 'Titan_Marcus', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', true, true, 'male', 92.0, 'Grandmaster'),
    (user2_id, 'Elena_Valkyrie', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', true, true, 'female', 65.0, 'Master'),
    (user3_id, 'Alex_LiftMaster', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', true, true, 'male', 78.5, 'Gold'),
    (user4_id, 'Dmitri_Steel', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200', false, false, 'male', 85.0, 'Platinum'),
    (user5_id, 'Sarah_Pulse', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', true, true, 'female', 62.0, 'Silver'),
    (user6_id, 'Maya_Strong', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200', true, false, 'female', 58.0, 'Bronze')
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    avatar_url = EXCLUDED.avatar_url,
    is_online = EXCLUDED.is_online,
    is_public_logs = EXCLUDED.is_public_logs,
    gender = EXCLUDED.gender,
    bodyweight_kg = EXCLUDED.bodyweight_kg,
    overall_rank = EXCLUDED.overall_rank;

  -- 3. PROVISION SAMPLE WORKOUT LOGS
  INSERT INTO public.workout_logs (id, user_id, title, is_public, created_at)
  VALUES
    (w1_id, user1_id, 'Grandmaster Heavy Push & Chest', true, NOW() - INTERVAL '1 day'),
    (w2_id, user2_id, 'Master Leg & Squat Destruction', true, NOW() - INTERVAL '2 days'),
    (w3_id, user3_id, 'Upper Body Power Session', true, NOW() - INTERVAL '3 hours'),
    (w4_id, user4_id, 'Secret Heavy Deadlift Night', false, NOW() - INTERVAL '4 days')
  ON CONFLICT (id) DO NOTHING;

  -- 4. FETCH EXERCISE IDs FOR SET LOGGING
  SELECT id INTO bench_ex_id FROM public.exercises WHERE name = 'Barbell Bench Press' LIMIT 1;
  SELECT id INTO squat_ex_id FROM public.exercises WHERE name = 'Barbell Back Squat' LIMIT 1;
  SELECT id INTO deadlift_ex_id FROM public.exercises WHERE name = 'Conventional Deadlift' LIMIT 1;
  SELECT id INTO incline_ex_id FROM public.exercises WHERE name = 'Incline Dumbbell Press' LIMIT 1;
  SELECT id INTO lat_ex_id FROM public.exercises WHERE name = 'Lat Pulldown' LIMIT 1;

  -- 5. INSERT SET LOGS IF EXERCISES EXIST
  IF bench_ex_id IS NOT NULL THEN
    INSERT INTO public.set_logs (workout_log_id, exercise_id, set_number, weight_kg, reps) VALUES
      (w1_id, bench_ex_id, 1, 140.0, 10),
      (w1_id, bench_ex_id, 2, 160.0, 6),
      (w1_id, bench_ex_id, 3, 180.0, 1),
      (w3_id, bench_ex_id, 1, 90.0, 10),
      (w3_id, bench_ex_id, 2, 100.0, 8),
      (w3_id, bench_ex_id, 3, 115.0, 1)
    ON CONFLICT DO NOTHING;
  END IF;

  IF squat_ex_id IS NOT NULL THEN
    INSERT INTO public.set_logs (workout_log_id, exercise_id, set_number, weight_kg, reps) VALUES
      (w2_id, squat_ex_id, 1, 150.0, 10),
      (w2_id, squat_ex_id, 2, 175.0, 6),
      (w2_id, squat_ex_id, 3, 195.0, 2)
    ON CONFLICT DO NOTHING;
  END IF;

  IF deadlift_ex_id IS NOT NULL THEN
    INSERT INTO public.set_logs (workout_log_id, exercise_id, set_number, weight_kg, reps) VALUES
      (w4_id, deadlift_ex_id, 1, 170.0, 8),
      (w4_id, deadlift_ex_id, 2, 190.0, 5),
      (w4_id, deadlift_ex_id, 3, 210.0, 2)
    ON CONFLICT DO NOTHING;
  END IF;

END $$;
