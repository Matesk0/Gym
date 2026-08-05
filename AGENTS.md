# GymPulse - Agent & Developer Instruction Guide

This document contains the complete context, architectural patterns, design standards, database schemas, testing mandates, and Git workflow rules required to continue developing **GymPulse** seamlessly.

---

## 🎯 App Vision & Core Stack

- **App Name**: GymPulse
- **Framework**: React Native with **Expo SDK 57** & **Expo Router v4**
- **Language**: TypeScript (Strict Mode)
- **Backend & Auth**: Supabase (`@supabase/supabase-js`, PostgreSQL, Auth with RLS)
- **Session Persistence**: `@react-native-async-storage/async-storage` wrapped in `ssrSafeStorage` (`src/lib/supabase.ts`) to prevent SSR `window is not defined` errors.
- **Design Language**: **Prestige iOS OLED Dark Theme** (`#000000` background, `#1C1C1E` card secondary, `#2C2C2E` tertiary card, `#38BDF8` light cyan primary accent, `#FF9F0C` amber gold, `#0A84FF` electric blue, `#FF453A` coral red).

---

## 🧬 Feature Specifications

### 1. Muscle Fatigue Visual Heatmap (`src/app/(tabs)/fatigue.tsx`)
- **MuscleWiki-style Body Map**: Interactive vector physique component (`src/components/MuscleMapSvg.tsx`) with Anterior (Front) and Posterior (Back) segmented views.
- **Strict 5-Stage Color Palette** (`src/constants/muscles.ts`):
  - 🔴 **Stage 1 (0–20%)**: `#e51f1f` — Exhausted (Heavy muscle breakdown)
  - 🟠 **Stage 2 (21–40%)**: `#f2a134` — Heavy Fatigue (Active repair)
  - 🟡 **Stage 3 (41–60%)**: `#f7e379` — Moderate Recovery (Midway recovered)
  - 🟢 **Stage 4 (61–80%)**: `#bbdb44` — Mostly Recovered (Yellow-Green)
  - ❇️ **Stage 5 (81–100%)**: `#44ce1b` — Fully Recovered (Bright Lime Green)
- **MuscleWiki Inspector**: Tapping any muscle head displays targeted exercise recommendations (e.g. *Incline Dumbbell Press* for Upper Chest, *Romanian Deadlift* for Hamstrings, *Barbell Back Squat* for Quads).

### 2. Global Strength Ranks & Leaderboard (`src/app/(tabs)/ranks.tsx`)
- **1-Rep Max Calculator**: Uses Epley formula ($\text{1RM} = \text{weight} \times (1 + \frac{\text{reps}}{30})$) to evaluate relative strength against bodyweight.
- **Gaming Rank Tiers**: 🥉 Bronze $\rightarrow$ 🥈 Silver $\rightarrow$ 🥇 Gold $\rightarrow$ 💎 Platinum $\rightarrow$ 🔮 Diamond $\rightarrow$ 🏆 Master $\rightarrow$ 👑 Grandmaster.
- **Live Online Status**: Green dot badge next to profile avatars.
- **Unified Global Leaderboard**: Single global world ranking table.

### 3. Workout Logger (`src/app/(tabs)/workout.tsx`)
- **Granular Exercise Catalog**: Main Category + Sub-category muscle head picker.
- **Set & Rep Tracking**: Log weight (kg) and per-set rep counts.
- **Secret Workout Logs**: Private by default (`is_public = false`); viewable on profile only if enabled by user.

### 4. User Profile & Settings (`src/app/(tabs)/profile.tsx`)
- Profile avatar with live online status toggle.
- Bodyweight manager (kg) for relative strength score calculation.
- Secret vs. Public workout log privacy switch.

---

## 🗄️ Database & Security Rules (`supabase_setup.sql`)

- **Row Level Security (RLS)** MUST be enabled on all tables (`profiles`, `exercises`, `workout_logs`, `set_logs`).
- **Workout Log Privacy**: Workout logs are secret by default (`is_public = false`). RLS policies allow other members to view logs ONLY if `is_public = true`.
- **Profile Security**: Users can update ONLY their own profile (`auth.uid() = id`).

---

## 📁 Directory Structure & File Layout

```
Gym/
├── src/
│   ├── app/                    # Expo Router file-based routes
│   │   ├── _layout.tsx         # Root layout with Auth Provider
│   │   ├── (auth)/             # Auth Screens (login.tsx, signup.tsx)
│   │   └── (tabs)/             # Tab Screens (index, workout, fatigue, ranks, profile)
│   ├── components/             # Reusable UI Components (MuscleMapSvg.tsx)
│   ├── constants/              # Muscles catalog & 5-stage hex colors (muscles.ts)
│   ├── context/                # AuthContext.tsx (Supabase Auth & Mock Fallback)
│   ├── lib/                    # Supabase Client with ssrSafeStorage (supabase.ts)
│   ├── types/                  # TypeScript Data Models (database.ts)
│   └── __tests__/              # Jest Test Suite (muscles, ranks, supabase_rls)
├── supabase_setup.sql          # Unified Master SQL Script for Supabase Database & Seed
├── SUPABASE_DATABASE_PROMPT.md # Complete Supabase AI creation prompt & guide
├── jest.config.js              # Jest configuration with babel-jest
├── README.md                   # Complete Project & Feature Documentation
└── package.json
```

---

## 🛠️ Mandatory Feature Development & Git Workflow Rules

Whenever implementing new features or making code changes:

1. **Branching**: Always create a new topic branch before writing code (`git checkout -b feat/feature-name` or `fix/...`). **Do NOT delete or rebase old topic branches.**
2. **Conventional Commits**: Format commit messages using standard Conventional Commits structure (`feat: ...`, `fix: ...`, `docs: ...`, `test: ...`, `refactor: ...`).
3. **Tests & Verification**: Write unit tests for new features/logic in `src/__tests__/`, and verify clean execution with `npm run check`.
4. **Integration**: Fix any broken tests or type errors, merge the feature branch into `main` clean without conflicts, and push to remote (`git push origin main` & `git push --all origin`).

---

## ⚙️ Verification Commands

- `npm run typecheck`: Runs TypeScript compiler check (`tsc --noEmit`).
- `npm test`: Runs unit test suite (`jest`).
- `npm run build:check`: Runs build compilation validation (`tsc --noEmit`).
- `npm run check`: **Primary Verification Command** — Runs `typecheck` $\rightarrow$ `test` $\rightarrow$ `build:check` in optimal sequence.
