# ⚡ Supabase Database Creation Prompt & Guide

This prompt and guide contains the complete, up-to-date Database Creation Prompt to paste into **Supabase AI Assistant** or execute directly inside the **Supabase SQL Editor**.

---

## 📋 Copyable Supabase AI Assistant Prompt

```text
Please create a complete PostgreSQL database schema and seed script for GymPulse (a scientific fitness & workout tracking app). 

Requirements:
1. Enable `uuid-ossp` and `pgcrypto` extensions.

2. Create table `public.profiles`:
   - `id`: UUID Primary Key referencing `auth.users(id)` ON DELETE CASCADE
   - `username`: TEXT UNIQUE NOT NULL
   - `avatar_url`: TEXT
   - `is_online`: BOOLEAN DEFAULT true
   - `is_public_logs`: BOOLEAN DEFAULT false
   - `gender`: TEXT DEFAULT 'male'
   - `bodyweight_kg`: NUMERIC(5,2) DEFAULT 75.0
   - `height_cm`: NUMERIC(5,2) DEFAULT 175.0
   - `fitness_goal`: TEXT DEFAULT 'Hypertrophy'
   - `experience_level`: TEXT DEFAULT 'Intermediate'
   - `preferred_unit`: TEXT DEFAULT 'kg'
   - `default_rest_seconds`: INT DEFAULT 90
   - `track_workout_time`: BOOLEAN DEFAULT true
   - `per_set_timer_enabled`: BOOLEAN DEFAULT true
   - `auto_hypertrophy_enabled`: BOOLEAN DEFAULT true
   - `target_rep_range`: TEXT DEFAULT 'Hypertrophy (8-12)'
   - `overall_rank`: TEXT DEFAULT 'Bronze'
   - `created_at`: TIMESTAMPTZ DEFAULT NOW()
   - `updated_at`: TIMESTAMPTZ DEFAULT NOW()

3. Create table `public.exercises`:
   - `id`: UUID Primary Key DEFAULT uuid_generate_v4()
   - `name`: TEXT NOT NULL
   - `main_category`: TEXT NOT NULL (Chest, Back, Shoulders, Arms, Legs, Core)
   - `sub_category`: TEXT NOT NULL
   - `target_muscles`: TEXT[] NOT NULL
   - `equipment`: TEXT DEFAULT 'Dumbbell'
   - `is_compound`: BOOLEAN DEFAULT false

4. Create table `public.workout_logs`:
   - `id`: UUID Primary Key DEFAULT uuid_generate_v4()
   - `user_id`: UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL
   - `title`: TEXT NOT NULL
   - `is_public`: BOOLEAN DEFAULT false
   - `created_at`: TIMESTAMPTZ DEFAULT NOW()

5. Create table `public.set_logs`:
   - `id`: UUID Primary Key DEFAULT uuid_generate_v4()
   - `workout_log_id`: UUID REFERENCES public.workout_logs(id) ON DELETE CASCADE NOT NULL
   - `exercise_id`: UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL
   - `set_number`: INT NOT NULL
   - `weight_kg`: NUMERIC(6,2) DEFAULT 0 NOT NULL
   - `reps`: INT DEFAULT 0 NOT NULL
   - `duration_seconds`: INT DEFAULT 0
   - `created_at`: TIMESTAMPTZ DEFAULT NOW()

6. Row-Level Security (RLS) Policies:
   - Enable RLS on all 4 tables (`profiles`, `exercises`, `workout_logs`, `set_logs`).
   - `profiles`: Select is public (`true`), Insert/Update allowed only if `auth.uid() = id`.
   - `exercises`: Select is public (`true`).
   - `workout_logs`: Owners can perform all operations (`auth.uid() = user_id`). Anyone can select if `is_public = true` or `auth.uid() = user_id`.
   - `set_logs`: Owners can manage sets if they own the parent workout log. Anyone can view sets if the parent workout log is public or owned by `auth.uid()`.

7. Automatic User Registration Trigger:
   - Create function `public.handle_new_user()` and trigger `on_auth_user_created` on `auth.users` AFTER INSERT to automatically insert a corresponding `public.profiles` row extracting metadata (`username`, `avatar_url`, `is_public_logs`, `bodyweight_kg`, `fitness_goal`, etc.).

8. Pre-load Exercise Catalog & Seed Athletes:
   - Insert default exercises across Chest, Back, Shoulders, Arms, Legs, and Core.
   - Provision demo athletes in `auth.users` and `public.profiles` (Titan_Marcus, Elena_Valkyrie, Alex_LiftMaster, Dmitri_Steel, Sarah_Pulse, Maya_Strong) with 1RM lifts, ranks, and sample workout logs.
```

---

## ⚡ Quick Direct Execution Method

To apply the complete schema and seed data in 1 click:
1. Open your **Supabase Dashboard** $\rightarrow$ **SQL Editor**.
2. Click **New Query**.
3. Copy and paste the complete SQL script from [`supabase_setup.sql`](file:///workspaces/Gym/supabase_setup.sql).
4. Click **Run**.
