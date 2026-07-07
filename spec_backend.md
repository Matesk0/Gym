# Backend Points Economy Specification

This document details the rules, balances, earnings, expenditures, and server-side validation rules for the shared points economy.

---

## 💰 1. Points System Overview
* **Starting Balance**: Every new user starts with **120 points**.
* **Global Sync**: Points are tracked centrally on the shared backend database and shared in real-time across all mobile apps (Hobbies, Games, Notes, Gym).

---

## 📈 2. Earning Points (Adding to Balance)

Users can earn points through the following mobile activities:

| Activity / Action | Points Earned | Frequency / Rules |
| :--- | :--- | :--- |
| **Daily Login Visit** | **+40 points** | Limited to **once per 24 hours**. Backend must check the `last_daily_claim` timestamp to prevent multiple claims. |
| **Tic-Tac-Toe Win** | **+25 points** | Awarded when the player defeats the Minimax AI. Wins are validated by sending the game board state to the server to prevent spoofing. |
| **Gym Workout Logging** | **+15 points** | Awarded when a user logs an exercise set. The backend registers the log and updates the active workout streak. |

---

## 📉 3. Spending Points (Deducting from Balance)

Users spend points on casino games and cosmetic upgrades:

| Action / Purchase | Points Deducted | Outcome / Rules |
| :--- | :--- | :--- |
| **Casino Slots Spin** | **-10 points** | **Cost per spin**. Backend must verify the user has a balance of $\ge 10$ points before initiating the spin. |
| **Gold Legend Frame** | **-150 points** | One-time shop purchase. Unlocks the Gold avatar frame. |
| **Cyber Neon Frame** | **-250 points** | One-time shop purchase. Unlocks the Neon animated frame. |
| **Digital Matrix Frame** | **-300 points** | One-time shop purchase. Unlocks the Matrix-styled frame. |

---

## 🎰 4. Casino Payout Calculations (Server-side)

When a user spins the Slots, the backend deduces the 10-point bet, rolls the reels, and rewards points back based on the symbols matched:

* **Match 3 Diamonds (💎)**: Jack Pot. Payout **+150 points** (x15 multiplier).
* **Match 3 Stars (⭐)**: Payout **+100 points** (x10 multiplier).
* **Match 3 other symbols (🍒, 🍋, 🔔)**: Payout **+50 points** (x5 multiplier).
* **Match 2 symbols (any)**: Payout **+15 points** (consists of returning the 10-point bet + 5 points profit).
* **No Match**: Payout **0 points** (the 10-point bet is lost).

---

## 🛡️ 5. Server-Side Validation Rules

1. **Transaction Ledger**:
   - Every points change must create an audit row in the `points_ledger` database table showing the `user_id`, the `amount` change (positive/negative), and the `reason`.
2. **Double Claim Check**:
   - The backend daily login endpoint must reject claims if the current time is less than 24 hours since the user's `last_daily_claim` timestamp.
3. **Sufficient Balance Check**:
   - For all spending actions (Slots spin, cosmetics shop unlock), the backend must run a transaction that checks if `profiles.points` is greater than or equal to the cost *before* updating the database.
