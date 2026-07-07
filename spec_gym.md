# Spec: Gym Mobile App (`mobile-gym`)

This repository contains the standalone **Gym Tracker** React Native application. It logs sets, tracks streaks, and features the interactive Svg Body Recovery Map.

---

## 🛠️ Tech Stack & Dependencies
* **Framework**: Expo SDK 57 + React Native 0.86
* **Language**: TypeScript
* **Graphics**: `react-native-svg` (for rendering muscle coordinates)
* **Icons**: `lucide-react-native`
* **Network Client**: Axios or native `fetch` (communicating with gym logs endpoint)

---

## 📂 Folder Structure
```text
gym-app/
├── src/
│   ├── components/         
│   │   ├── SvgHumanBody.tsx   # Interactive Svg Human Model component
│   │   └── WorkoutLogger.tsx  # Set/Rep logging inputs
│   ├── screens/
│   │   └── GymScreen.tsx      # Combined screen showing Body Map, Streaks & Logger
│   ├── services/
│   │   └── api.ts             # Backend gym logging api connector
│   └── App.tsx                # App entrypoint
├── app.json
├── package.json
└── tsconfig.json
```

---

## ⚙️ App Requirements

### 1. Interactive Svg Body Map
* Uses `react-native-svg` to draw a humanoid figure with pressable shapes representing: Chest, Back, Arms, Legs.
* Sets colors dynamically based on recovery state: Rested (Green), Recovering (Yellow), Sore (Red).
* Pressing a muscle selects it in the logger.

### 2. Exercise Sets Logger
* Logs Sets, Reps, and Weight (kg) for selected muscles.
* **Backend update**: Logging a workout posts to the logs database, sets the muscle sore on the server, and adds +15 points to the points ledger.

### 3. Workout Streaks
* Displays daily workout streak count (e.g. "🔥 12 days") pulled from the backend.

---

## 🔌 Backend API Connections
This app integrates with the backend using the following endpoints:

* `GET /gym/logs` -> Fetches exercise log history.
* `POST /gym/logs` -> Logs sets (muscle, sets, reps, weight) and awards +15 points.
* `GET /gym/recovery` -> Fetches current recovery states (rested, sore, recovering) and streak count.
