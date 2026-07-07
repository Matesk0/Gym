# Project Configuration (AGENTS.md) - Mobile Gym

This file guides development inside the **`mobile-gym`** repository.

---

## 🏗️ Repository Overview
* **Name**: `mobile-gym`
* **Role**: Mobile Gym Tracker & Recovery Map
* **Tech Stack**: Expo SDK 57 + React Native 0.86 + TypeScript + `react-native-svg` + `lucide-react-native`
* **Backend Connection**: Shared Supabase DB (`workout_logs`, `profiles` tables).

---

## 📜 Development Rules
1. **Interactive Svg body map**: Use `react-native-svg` to render a human anatomical model. Color body regions (Chest, Back, Arms, Legs) sore (red), recovering (yellow), or rested (green) based on logged workout timing.
2. **Gym Logger**: Inputs for sets, reps, and weights.
3. **Streak System**: Increment streak daily on workout logging.
4. **Reward points**: Logging an exercise set awards +15 points. This transaction must be securely logged in the database.

---

## 📂 Backend Integration Details
- **Workout logs Table (`workout_logs`)**: Columns `id`, `user_id`, `muscle_group` (Chest/Back/Legs/Arms), `sets`, `reps`, `weight_kg`, `created_at`.
- **Endpoints**:
  - `GET /gym/logs` - Fetch training log history.
  - `POST /gym/logs` - Logs workout, increments streak, flags muscle sore, and logs +15 points.
  - `GET /gym/recovery` - Reads current recovery status metrics.
