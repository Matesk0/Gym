# Project Configuration (AGENTS.md) - Shared Backend

This file guides development inside the **`backend-shared`** repository.

---

## 🏗️ Repository Overview
* **Name**: `backend-shared`
* **Role**: Shared Postgres Schema & RPC logics
* **Tech Stack**: Supabase (PostgreSQL, row-level security, realtime channels, storage)
* **Client Consumers**: Vite Web Portfolio & four separate React Native apps.

---

## 📜 Development & Database Rules
1. **Security Defined (RLS)**: Row-Level Security policies must be enforced. Authenticated users can only read and write their own rows.
2. **Server-Side Points Triggers**: Avoid letting client-side profiles directly update points balance. Secure point claims (e.g. daily claim +40 pts, workout logs +15 pts, games win +25 pts) must call Database RPC functions (PL/pgSQL) to check validation timestamps and insert audit rows to `points_ledger`.
3. **Database Migrations**: Track all tables, indexes, and RPC updates in Supabase migration scripts.

---

## 📂 Database Schema Overview
- **`profiles`**: User profiles with username, points, avatar frame cosmetic preferences, and daily claim date.
- **`points_ledger`**: Logs reasons ('daily_claim', 'slots_spin', 'workout_log', 'games_win') and points amounts for transactions.
- **`reviews`**: Hobbies movie/anime logs.
- **`dnd_characters`**: Hobbies character sheets stats JSON.
- **`workout_logs`**: Gym sets, reps, and weights logs.
- **`notes`**: devlog wiki markdown pages.
