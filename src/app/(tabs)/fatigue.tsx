import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MuscleMapSvg } from '../../components/MuscleMapSvg';
import { FATIGUE_STAGES } from '../../constants/muscles';
import { FatigueState, FatigueStage } from '../../types/database';
import { Flame, RefreshCw, Dumbbell, ShieldAlert, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react-native';

// MuscleWiki-style targeted exercises index
const MUSCLEWIKI_EXERCISES: Record<string, string[]> = {
  upper_chest: ['Incline Dumbbell Press', 'Incline Cable Fly', 'Low-to-High Cable Crossover'],
  middle_chest: ['Barbell Bench Press', 'Flat Dumbbell Fly', 'Chest Press Machine'],
  lower_chest: ['Decline Dumbbell Press', 'Weighted Chest Dips', 'High-to-Low Cable Fly'],
  anterior_delt: ['Overhead Military Press', 'Dumbbell Shoulder Press', 'Front Cable Raise'],
  lateral_delt: ['Dumbbell Lateral Raise', 'Cable Lateral Raise', 'Egyptian Lateral Raise'],
  posterior_delt: ['Rear Delt Cable Fly', 'Reverse Pec Deck', 'Face Pulls'],
  traps: ['Barbell Shrugs', 'Dumbbell Shrugs', 'Cable Upright Row'],
  lats: ['Lat Pulldown', 'Wide-Grip Pull-ups', 'Single-Arm Dumbbell Row'],
  rhomboids: ['Seated Cable Row', 'T-Bar Row', 'Bent-Over Barbell Row'],
  lower_back: ['Conventional Deadlift', 'Hyperextensions', 'Good Mornings'],
  biceps_long: ['Incline Dumbbell Curl', 'Drag Curls', 'Bayesian Cable Curl'],
  biceps_short: ['Preacher Barbell Curl', 'Concentration Curl', 'Spider Curl'],
  brachialis: ['Dumbbell Hammer Curl', 'Reverse Barbell Curl', 'Rope Cable Curl'],
  triceps_long: ['Overhead Tricep Extension', 'Skullcrushers', 'French Press'],
  triceps_lateral: ['Rope Cable Pushdown', 'V-Bar Pushdown', 'Dumbbell Kickbacks'],
  triceps_medial: ['Close-Grip Bench Press', 'Reverse Grip Pushdown', 'Parallel Bar Dips'],
  forearms: ['Wrist Curls', 'Reverse Wrist Curls', 'Farmers Walk'],
  quads: ['Barbell Back Squat', 'Leg Press', 'Bulgarian Split Squat', 'Leg Extension'],
  hamstrings: ['Romanian Deadlift', 'Lying Leg Curl', 'Seated Leg Curl'],
  glutes: ['Barbell Hip Thrust', 'Cable Kickbacks', 'Sumo Deadlift'],
  calves: ['Standing Calf Raise', 'Seated Calf Raise', 'Donkey Calf Raise'],
  upper_abs: ['Cable Ab Crunch', 'Decline Crunch', 'Machine Crunch'],
  lower_abs: ['Hanging Leg Raise', 'Reverse Crunch', 'Captains Chair Leg Raise'],
  obliques: ['Russian Twists', 'Cable Woodchopper', 'Side Plank'],
};

export default function FatigueScreen() {
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');

  const [fatigueData, setFatigueData] = useState<Record<string, FatigueState>>({
    upper_chest: {
      muscle_id: 'upper_chest',
      name: 'Upper Chest',
      sub_head: 'Clavicular Head (Pectoralis Major)',
      main_category: 'Chest',
      last_trained_hours_ago: 14,
      fatigue_percentage: 35,
      stage: 2,
      color: FATIGUE_STAGES[2].color,
      recovery_hours_needed: 31,
    },
    middle_chest: {
      muscle_id: 'middle_chest',
      name: 'Middle Chest',
      sub_head: 'Sternal Head',
      main_category: 'Chest',
      last_trained_hours_ago: 14,
      fatigue_percentage: 45,
      stage: 3,
      color: FATIGUE_STAGES[3].color,
      recovery_hours_needed: 26,
    },
    lower_chest: {
      muscle_id: 'lower_chest',
      name: 'Lower Chest',
      sub_head: 'Costal Head',
      main_category: 'Chest',
      last_trained_hours_ago: 14,
      fatigue_percentage: 55,
      stage: 3,
      color: FATIGUE_STAGES[3].color,
      recovery_hours_needed: 20,
    },
    anterior_delt: {
      muscle_id: 'anterior_delt',
      name: 'Front Shoulders',
      sub_head: 'Anterior Deltoid',
      main_category: 'Shoulders',
      last_trained_hours_ago: 14,
      fatigue_percentage: 40,
      stage: 2,
      color: FATIGUE_STAGES[2].color,
      recovery_hours_needed: 24,
    },
    lateral_delt: {
      muscle_id: 'lateral_delt',
      name: 'Side Shoulders',
      sub_head: 'Lateral Deltoid',
      main_category: 'Shoulders',
      last_trained_hours_ago: 72,
      fatigue_percentage: 95,
      stage: 5,
      color: FATIGUE_STAGES[5].color,
      recovery_hours_needed: 0,
    },
    quads: {
      muscle_id: 'quads',
      name: 'Quads',
      sub_head: 'Rectus Femoris & Vastus Lateralis',
      main_category: 'Legs',
      last_trained_hours_ago: 6,
      fatigue_percentage: 15,
      stage: 1,
      color: FATIGUE_STAGES[1].color,
      recovery_hours_needed: 58,
    },
    lats: {
      muscle_id: 'lats',
      name: 'Lats',
      sub_head: 'Latissimus Dorsi',
      main_category: 'Back',
      last_trained_hours_ago: 48,
      fatigue_percentage: 75,
      stage: 4,
      color: FATIGUE_STAGES[4].color,
      recovery_hours_needed: 12,
    },
    lower_back: {
      muscle_id: 'lower_back',
      name: 'Lower Back',
      sub_head: 'Erector Spinae',
      main_category: 'Back',
      last_trained_hours_ago: 48,
      fatigue_percentage: 65,
      stage: 4,
      color: FATIGUE_STAGES[4].color,
      recovery_hours_needed: 25,
    },
    traps: {
      muscle_id: 'traps',
      name: 'Upper Back',
      sub_head: 'Trapezius',
      main_category: 'Back',
      last_trained_hours_ago: 48,
      fatigue_percentage: 85,
      stage: 5,
      color: FATIGUE_STAGES[5].color,
      recovery_hours_needed: 0,
    },
  });

  const [selectedMuscle, setSelectedMuscle] = useState<FatigueState>(fatigueData.upper_chest);

  const muscleWikiExercises = selectedMuscle
    ? MUSCLEWIKI_EXERCISES[selectedMuscle.muscle_id] || ['Barbell Compound Movement', 'Dumbbell Isolation']
    : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* iOS Prestige Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Muscle Fatigue Map</Text>
        <Text style={styles.subtitle}>
          MuscleWiki-style interactive physique breakdown & rest windows
        </Text>
      </View>

      {/* Segmented iOS View Switcher (Anterior vs Posterior) */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[styles.segmentBtn, viewMode === 'front' && styles.segmentBtnActive]}
          onPress={() => setViewMode('front')}
        >
          <Text style={[styles.segmentText, viewMode === 'front' && styles.segmentTextActive]}>
            Anterior (Front)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.segmentBtn, viewMode === 'back' && styles.segmentBtnActive]}
          onPress={() => setViewMode('back')}
        >
          <Text style={[styles.segmentText, viewMode === 'back' && styles.segmentTextActive]}>
            Posterior (Back)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hex Color Scale Legend Card */}
      <View style={styles.legendCard}>
        <View style={styles.legendHeader}>
          <Sparkles color="#30D158" size={16} />
          <Text style={styles.legendTitle}>Muscle Recovery Scale</Text>
        </View>

        <View style={styles.legendBar}>
          {([1, 2, 3, 4, 5] as FatigueStage[]).map((stg) => {
            const info = FATIGUE_STAGES[stg];
            return (
              <View key={stg} style={[styles.legendSegment, { backgroundColor: info.color }]}>
                <Text style={styles.legendStageNum}>S{stg}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.legendLabels}>
          <Text style={[styles.labelLegendText, { color: '#e51f1f' }]}>#e51f1f (0% Exhausted)</Text>
          <Text style={[styles.labelLegendText, { color: '#44ce1b' }]}>#44ce1b (100% Prime)</Text>
        </View>
      </View>

      {/* MuscleWiki Interactive Body Map Container */}
      <View style={styles.mapCard}>
        <MuscleMapSvg
          viewMode={viewMode}
          fatigueData={fatigueData}
          onSelectMuscle={(m) => setSelectedMuscle(m)}
          selectedMuscleId={selectedMuscle?.muscle_id}
        />
        <Text style={styles.mapHintText}>Tap any muscle head to inspect MuscleWiki exercises</Text>
      </View>

      {/* MuscleWiki Muscle Inspector Card */}
      {selectedMuscle && (
        <View style={styles.inspectorCard}>
          <View style={styles.inspectorHeader}>
            <View>
              <Text style={styles.inspectorTitle}>{selectedMuscle.name}</Text>
              <Text style={styles.inspectorSub}>{selectedMuscle.sub_head}</Text>
            </View>

            <View style={[styles.badgePill, { backgroundColor: FATIGUE_STAGES[selectedMuscle.stage].bg, borderColor: selectedMuscle.color }]}>
              <Text style={[styles.badgePillText, { color: selectedMuscle.color }]}>
                {FATIGUE_STAGES[selectedMuscle.stage].label} ({selectedMuscle.fatigue_percentage}%)
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${selectedMuscle.fatigue_percentage}%`, backgroundColor: selectedMuscle.color },
              ]}
            />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <RefreshCw color="#0A84FF" size={16} />
              <Text style={styles.statVal}>{selectedMuscle.last_trained_hours_ago}h ago</Text>
              <Text style={styles.statLbl}>Last Trained</Text>
            </View>

            <View style={styles.statBox}>
              <Flame color={selectedMuscle.color} size={16} />
              <Text style={styles.statVal}>
                {selectedMuscle.recovery_hours_needed > 0
                  ? `${selectedMuscle.recovery_hours_needed}h left`
                  : '100% Prime'}
              </Text>
              <Text style={styles.statLbl}>Est. Rest Window</Text>
            </View>
          </View>

          {/* MuscleWiki Recommended Targeted Exercises */}
          <View style={styles.exerciseSection}>
            <View style={styles.exSectionTitleRow}>
              <Dumbbell color="#30D158" size={16} />
              <Text style={styles.exSectionTitle}>MuscleWiki Target Exercises</Text>
            </View>

            {muscleWikiExercises.map((exName, idx) => (
              <View key={idx} style={styles.exerciseItem}>
                <View style={styles.exDot} />
                <Text style={styles.exerciseNameText}>{exName}</Text>
                <ChevronRight color="#8E8E93" size={16} />
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // iOS Pitch Black OLED
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  segmentBtnActive: {
    backgroundColor: '#2C2C2E',
  },
  segmentText: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  legendCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    gap: 8,
  },
  legendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
  },
  legendBar: {
    flexDirection: 'row',
    height: 14,
    borderRadius: 7,
    overflow: 'hidden',
  },
  legendSegment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendStageNum: {
    fontSize: 9,
    fontWeight: '900',
    color: '#000000',
  },
  legendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelLegendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  mapCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  mapHintText: {
    color: '#8E8E93',
    fontSize: 12,
    marginTop: 2,
  },
  inspectorCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    gap: 14,
  },
  inspectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inspectorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  inspectorSub: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  badgePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLbl: {
    fontSize: 11,
    color: '#8E8E93',
  },
  exerciseSection: {
    gap: 8,
    marginTop: 4,
  },
  exSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  exSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2C2C2E',
    padding: 12,
    borderRadius: 14,
  },
  exDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#30D158',
  },
  exerciseNameText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
});
