# GymPulse 🏋️‍♂️🔥

**GymPulse** is a modern, feature-rich **Workout & Gym Tracking** mobile application built with **React Native (Expo Router + TypeScript)** backed by **Supabase** (PostgreSQL, Auth with Secure Token Storage, Row Level Security).

---

## 🌟 Key Features

### 1. 🧬 5-Stage Muscle Fatigue Visual Heatmap (`(tabs)/fatigue.tsx`)
- **Interactive Anatomical Physique SVG**: Front (Anterior) and Back (Posterior) vector muscle map displaying live recovery heatmaps per muscle head.
- **5-Stage Color Gradient**:
  - 🔴 **Stage 1 (0–20%)**: `#e51f1f` — Exhausted (Heavy breakdown)
  - 🟠 **Stage 2 (21–40%)**: `#f2a134` — Heavy Fatigue (Active repair)
  - 🟡 **Stage 3 (41–60%)**: `#f7e379` — Moderate Recovery (Midway recovered)
  - 🟢 **Stage 4 (61–80%)**: `#bbdb44` — Mostly Recovered (Yellow-Green)
  - ❇️ **Stage 5 (81–100%)**: `#44ce1b` — Fully Recovered (Bright Lime Green)
- **Scientific Recovery Engine**: Rest windows based on muscle group size (48–72h for legs/back, 36–48h for chest/shoulders, 24–36h for arms/abs).

### 2. 🏆 Gaming Strength Ranks & Global Leaderboard (`(tabs)/ranks.tsx`)
- **World Percentile Calculation**: Epley 1-Rep Max formula ($\text{1RM} = \text{weight} \times (1 + \frac{\text{reps}}{30})$) relative to bodyweight.
- **Tier Ranks**: 🥉 Bronze $\rightarrow$ 🥈 Silver $\rightarrow$ 🥇 Gold $\rightarrow$ 💎 Platinum $\rightarrow$ 🔮 Diamond $\rightarrow$ 🏆 Master $\rightarrow$ 👑 Grandmaster.
- **Live Online Status**: Green dot indicator next to profile pictures.
- **Unified Global Leaderboard**: Worldwide athlete strength rankings.

### 3. 📝 Workout Logger (`(tabs)/workout.tsx`)
- **Granular Exercise Catalog**: Categorized by main muscle groups (Chest, Back, Shoulders, Arms, Legs, Core) and specific muscle heads (Upper/Middle/Lower Chest, Front/Side/Rear Delts, Biceps Long/Short Head, Brachialis, etc.).
- **Set & Rep Tracking**: Log weight (kg) and per-set rep counts.
- **Secret Workout Logs**: Private by default (`is_public = false`); users can toggle to share logs on their profile.

### 4. 👤 Profile & Privacy Controls (`(tabs)/profile.tsx`)
- Avatar with live green-dot online status toggle.
- Bodyweight manager (kg) for relative strength score calculation.
- Public vs. Secret workout logs privacy switch.

---

## 📁 Project Folder Structure

```
Gym/
├── src/
│   ├── app/                    # Expo Router file-based route screens
│   │   ├── _layout.tsx         # Root Layout with Auth Provider
│   │   ├── (auth)/             # Auth Screens (login.tsx, signup.tsx)
│   │   └── (tabs)/             # Tab Screens (index, workout, fatigue, ranks, profile)
│   ├── components/             # Reusable Components (MuscleMapSvg.tsx)
│   ├── constants/              # Muscle definitions & 5-stage color scale (muscles.ts)
│   ├── context/                # AuthContext.tsx (Supabase Auth & Mock Mode fallback)
│   ├── lib/                    # Supabase Client config (supabase.ts)
│   ├── types/                  # TypeScript Data Models (database.ts)
│   └── __tests__/              # Unit Test Suite (muscles.test.ts, ranks.test.ts)
├── supabase_schema.sql         # SQL Script for Supabase PostgreSQL tables & RLS
├── jest.config.js              # Jest configuration
└── AGENTS.md                   # Workspace rules & Git workflow guidelines
```

---

## ⚡ Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run local Development Server

```bash
npx expo start
```

You can open the app in:
- **Expo Go** on iOS/Android
- **iOS Simulator** / **Android Emulator**
- **Web Browser** (`npm run web`)

---

## 🗄️ Supabase Backend Setup

To connect live Supabase cloud data:

1. Copy the SQL script from [`supabase_schema.sql`](file:///workspaces/Gym/supabase_schema.sql) and execute it in your Supabase SQL Editor.
2. Add your Supabase credentials to `.env`:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

*Note: If no Supabase credentials are configured, GymPulse automatically activates **Demo Preview Mode** with pre-loaded mock data so all features work out-of-the-box!*

---

## 🧪 Verification & Development Commands

Run the unified verification pipeline before submitting code:

| Command | Action |
| :--- | :--- |
| `npm run check` | **Recommended**: Runs typecheck, unit tests, and build export in optimal order. |
| `npm run typecheck` | Checks TypeScript compilation (`tsc --noEmit`). |
| `npm test` | Runs Jest unit test suite. |
| `npm run build:check` | Exports Expo production bundle (`expo export`). |

---

## 🛠️ Feature Development & Git Workflow

All code contributions MUST adhere to the workspace guidelines in [`AGENTS.md`](file:///workspaces/Gym/AGENTS.md):

1. **Branching**: Create a topic branch before writing code (`git checkout -b feat/feature-name`).
2. **Conventional Commits**: Format commit messages (`feat: ...`, `refactor: ...`, `fix: ...`, `test: ...`).
3. **Verification Pipeline**: Pass `npm run check` clean with zero errors before merging.
4. **Integration**: Merge clean into `main` without conflicts and push changes.
