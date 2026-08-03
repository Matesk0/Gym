import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { MuscleMapSvg } from '../../components/MuscleMapSvg';
import {
  FATIGUE_STAGES,
  MUSCLE_DEFINITIONS,
  calculateFatigueStage,
  calculateFatiguePercentage,
  calculateRemainingRecoveryHours,
} from '../../constants/muscles';
import { FatigueState, FatigueStage } from '../../types/database';
import {
  Flame,
  RefreshCw,
  Dumbbell,
  Sparkles,
  PlusCircle,
  Heart,
  Star,
} from 'lucide-react-native';

interface CatalogWorkoutCard {
  id: string;
  title: string;
  trainer: string;
  rating: number;
  isPremium: boolean;
  image: string;
  duration: string;
  calories: number;
  level: string;
  category: string;
}

const FAVORITE_WORKOUTS: CatalogWorkoutCard[] = [
  {
    id: 'fav1',
    title: '10-minute morning yoga',
    trainer: 'Nama Ste',
    rating: 4.7,
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    duration: '10 min',
    calories: 110,
    level: '1 Level',
    category: 'Flexibility',
  },
  {
    id: 'fav2',
    title: 'Dancing therapy',
    trainer: 'Daria Pike',
    rating: 4.9,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600',
    duration: '25 min',
    calories: 240,
    level: '2 Level',
    category: 'Arms',
  },
  {
    id: 'fav3',
    title: 'HIIT Cardio for beginners',
    trainer: 'Tadeas Izo',
    rating: 4.9,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
    duration: '30 min',
    calories: 300,
    level: '1 Level',
    category: 'Legs',
  },
];

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

const DEMO_TRAINED_HOURS: Record<string, number> = {
  upper_chest: 14,
  middle_chest: 14,
  lower_chest: 14,
  anterior_delt: 14,
  lateral_delt: 72,
  quads: 6,
  lats: 48,
  lower_back: 48,
  traps: 48,
  hamstrings: 18,
  biceps_long: 30,
  triceps_long: 28,
};

function buildInitialFatigueData(): Record<string, FatigueState> {
  const map: Record<string, FatigueState> = {};
  MUSCLE_DEFINITIONS.forEach((def) => {
    const hoursAgo = DEMO_TRAINED_HOURS[def.id] ?? 80;
    const fatiguePct = calculateFatiguePercentage(hoursAgo, def.baseRecoveryHours);
    const stage = calculateFatigueStage(fatiguePct);
    const remainingHours = calculateRemainingRecoveryHours(hoursAgo, def.baseRecoveryHours);

    map[def.id] = {
      muscle_id: def.id,
      name: def.name,
      sub_head: def.subHead,
      main_category: def.mainCategory,
      last_trained_hours_ago: hoursAgo,
      fatigue_percentage: fatiguePct,
      stage,
      color: FATIGUE_STAGES[stage].color,
      recovery_hours_needed: remainingHours,
    };
  });
  return map;
}

export default function FatigueScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('All');
  const [fatigueData] = useState<Record<string, FatigueState>>(buildInitialFatigueData);
  const [selectedMuscle, setSelectedMuscle] = useState<FatigueState>(fatigueData.upper_chest || Object.values(fatigueData)[0]);

  const muscleWikiExercises = selectedMuscle
    ? MUSCLEWIKI_EXERCISES[selectedMuscle.muscle_id] || ['Barbell Compound Movement', 'Dumbbell Isolation']
    : [];

  const categories = ['All', 'Legs', 'Arms', 'Abs', 'Flexibility', 'Chest', 'Back'];

  const filteredCatalog = FAVORITE_WORKOUTS.filter((w) => {
    if (selectedCatFilter === 'All') return true;
    return w.category === selectedCatFilter;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header matching Screenshot 2 Top-Left ("Favorites") */}
      <View style={styles.header}>
        <Text style={styles.title}>Favorites & Catalog</Text>
        <Text style={styles.subtitle}>
          MuscleWiki interactive physique recovery & curated workout library
        </Text>
      </View>

      {/* Category Tag Pills matching Screenshot 2 Top-Left (All | Legs | Arms | Abs | Flexibility) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catPillScroll}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catPillBtn, selectedCatFilter === cat && styles.catPillBtnActive]}
            onPress={() => setSelectedCatFilter(cat)}
          >
            <Text style={[styles.catPillText, selectedCatFilter === cat && styles.catPillTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Segmented View Switcher (Anterior vs Posterior) */}
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
          <Sparkles color="#38BDF8" size={16} />
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
              <RefreshCw color="#38BDF8" size={16} />
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
              <Text style={styles.statLbl}>Rest Window</Text>
            </View>
          </View>

          {/* MuscleWiki Target Exercises */}
          <View style={styles.exerciseSection}>
            <View style={styles.exSectionTitleRow}>
              <Dumbbell color="#38BDF8" size={16} />
              <Text style={styles.exSectionTitle}>MuscleWiki Target Exercises</Text>
            </View>

            {muscleWikiExercises.map((exName, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.exerciseItem}
                onPress={() => router.push(`/(tabs)/workout?category=${selectedMuscle.main_category}`)}
              >
                <View style={styles.exDot} />
                <Text style={styles.exerciseNameText}>{exName}</Text>
                <PlusCircle color="#38BDF8" size={18} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Catalog Cards Section matching Screenshot 2 Top-Left */}
      <Text style={styles.sectionTitle}>Curated Catalog Exercises</Text>
      <View style={styles.catalogGrid}>
        {filteredCatalog.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.favCard}
            onPress={() => router.push('/(tabs)/workout')}
          >
            <View style={styles.favImageContainer}>
              <Image source={{ uri: item.image }} style={styles.favImage} />
              <TouchableOpacity style={styles.heartBtn}>
                <Heart color="#C084FC" size={14} fill="#C084FC" />
              </TouchableOpacity>

              <View style={styles.ratingTag}>
                <Star color="#FBBF24" size={12} fill="#FBBF24" />
                <Text style={styles.ratingTagText}>{item.rating}</Text>
              </View>

              {item.isPremium && (
                <View style={styles.favPremiumBadge}>
                  <Text style={styles.favPremiumText}>Premium</Text>
                </View>
              )}
            </View>

            <View style={styles.favCardBody}>
              <Text style={styles.favCardTitle}>{item.title}</Text>
              <Text style={styles.favCardTrainer}>{item.trainer}</Text>

              {/* Quick stats row matching Screenshot 2 top-right */}
              <View style={styles.quickStatsRow}>
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatVal}>{item.duration}</Text>
                  <Text style={styles.quickStatLbl}>Minutes</Text>
                </View>
                <View style={styles.quickStatDivider} />
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatVal}>{item.calories}</Text>
                  <Text style={styles.quickStatLbl}>Calories</Text>
                </View>
                <View style={styles.quickStatDivider} />
                <View style={styles.quickStatItem}>
                  <Text style={styles.quickStatVal}>{item.level}</Text>
                  <Text style={styles.quickStatLbl}>Level</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1B1B',
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
    color: '#9E9A97',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  catPillScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  catPillBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#292726',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#3D3A38',
  },
  catPillBtnActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  catPillText: {
    color: '#9E9A97',
    fontSize: 13,
    fontWeight: '600',
  },
  catPillTextActive: {
    color: '#1D1B1B',
    fontWeight: '800',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#292726',
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    borderColor: '#3D3A38',
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  segmentBtnActive: {
    backgroundColor: '#33302F',
  },
  segmentText: {
    color: '#9E9A97',
    fontSize: 13,
    fontWeight: '700',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  legendCard: {
    backgroundColor: '#292726',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#3D3A38',
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
    color: '#9E9A97',
  },
  legendBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  legendSegment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendStageNum: {
    fontSize: 8,
    fontWeight: '900',
    color: '#000000',
  },
  mapCard: {
    backgroundColor: '#292726',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3D3A38',
  },
  mapHintText: {
    color: '#9E9A97',
    fontSize: 12,
    marginTop: 2,
  },
  inspectorCard: {
    backgroundColor: '#292726',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: '#3D3A38',
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
    color: '#9E9A97',
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
    backgroundColor: '#33302F',
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
    backgroundColor: '#33302F',
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
    color: '#9E9A97',
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
    backgroundColor: '#33302F',
    padding: 12,
    borderRadius: 14,
  },
  exDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  exerciseNameText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
  },
  catalogGrid: {
    gap: 16,
  },
  favCard: {
    backgroundColor: '#292726',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#3D3A38',
  },
  favImageContainer: {
    height: 160,
    position: 'relative',
  },
  favImage: {
    width: '100%',
    height: '100%',
  },
  heartBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingTag: {
    position: 'absolute',
    top: 12,
    right: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingTagText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  favPremiumBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  favPremiumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  favCardBody: {
    padding: 14,
  },
  favCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  favCardTrainer: {
    fontSize: 12,
    color: '#9E9A97',
    marginTop: 2,
    marginBottom: 12,
  },
  quickStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#1D1B1B',
    borderRadius: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#3D3A38',
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  quickStatLbl: {
    fontSize: 10,
    color: '#9E9A97',
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#3D3A38',
  },
});
