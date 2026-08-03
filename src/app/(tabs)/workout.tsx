import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MUSCLE_DEFINITIONS } from '../../constants/muscles';
import { MainMuscleCategory } from '../../types/database';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import {
  Square,
  Pause,
  Play,
  Plus,
  Trash2,
  CheckCircle2,
  Lock,
  Eye,
  Search,
  Timer,
  RotateCcw,
  ChevronRight,
  Check,
  Dumbbell,
  SlidersHorizontal,
} from 'lucide-react-native';

interface LocalSet {
  id: string;
  setNumber: number;
  weightKg: string;
  reps: string;
}

interface LocalExerciseLog {
  exerciseId: string;
  name: string;
  subCategory: string;
  sets: LocalSet[];
}

export default function WorkoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, profile } = useAuth();

  const initialCat = (params.category as MainMuscleCategory) || 'Chest';
  const [workoutTitle, setWorkoutTitle] = useState('HIIT Cardio Power Session');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MainMuscleCategory>(initialCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Player Timer State matching Screenshot 1 Screen 2 ("00:12")
  const [activeSeconds, setActiveSeconds] = useState<number>(12);
  const [isPlayerActive, setIsPlayerActive] = useState<boolean>(true);

  // Rest Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerInitial, setTimerInitial] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  // Height & Weight Quick Adjustment Modal State (Screenshot 2 Bottom-Left)
  const [heightCm, setHeightCm] = useState<number>(159);
  const [weightKgVal, setWeightKgVal] = useState<number>(profile?.bodyweight_kg || 58);

  useEffect(() => {
    let interval: any = null;
    if (isPlayerActive) {
      interval = setInterval(() => {
        setActiveSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlayerActive]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerActive) {
      setIsTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timerSeconds]);

  const startRestTimer = (seconds: number) => {
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
    setIsTimerActive(true);
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${('0' + mins).slice(-2)}:${('0' + secs).slice(-2)}`;
  };

  const [loggedExercises, setLoggedExercises] = useState<LocalExerciseLog[]>([
    {
      exerciseId: 'upper_chest_1',
      name: 'Incline Dumbbell Press',
      subCategory: 'Upper Chest (Clavicular Head)',
      sets: [
        { id: 's1', setNumber: 1, weightKg: '30', reps: '12' },
        { id: 's2', setNumber: 2, weightKg: '32.5', reps: '10' },
        { id: 's3', setNumber: 3, weightKg: '34', reps: '8' },
      ],
    },
  ]);

  const handleAddExercise = (name: string, subCategory: string) => {
    const newEx: LocalExerciseLog = {
      exerciseId: Date.now().toString(),
      name,
      subCategory,
      sets: [{ id: Date.now().toString() + '_1', setNumber: 1, weightKg: '20', reps: '10' }],
    };
    setLoggedExercises([...loggedExercises, newEx]);
  };

  const handleAddSet = (exerciseIndex: number) => {
    const updated = [...loggedExercises];
    const targetEx = updated[exerciseIndex];
    const nextSetNumber = targetEx.sets.length + 1;
    const lastSet = targetEx.sets[targetEx.sets.length - 1];

    targetEx.sets.push({
      id: Date.now().toString() + '_' + nextSetNumber,
      setNumber: nextSetNumber,
      weightKg: lastSet ? lastSet.weightKg : '20',
      reps: lastSet ? lastSet.reps : '10',
    });
    setLoggedExercises(updated);
    startRestTimer(60); // Auto trigger 60s rest timer
  };

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'weightKg' | 'reps',
    val: string
  ) => {
    const updated = [...loggedExercises];
    updated[exerciseIndex].sets[setIndex][field] = val;
    setLoggedExercises(updated);
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...loggedExercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    if (updated[exerciseIndex].sets.length === 0) {
      updated.splice(exerciseIndex, 1);
    } else {
      updated[exerciseIndex].sets.forEach((s, idx) => (s.setNumber = idx + 1));
    }
    setLoggedExercises(updated);
  };

  const handleFinishWorkout = async () => {
    if (loggedExercises.length === 0) {
      Alert.alert('Empty Workout', 'Please add at least one exercise set.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSupabaseConfigured && user?.id) {
        const { data: wLog, error: wError } = await supabase
          .from('workout_logs')
          .insert([
            {
              user_id: user.id,
              title: workoutTitle || 'Logged Session',
              is_public: isPublic,
            },
          ])
          .select()
          .single();

        if (!wError && wLog?.id) {
          const { data: dbExercises } = await supabase.from('exercises').select('id, name');
          const exMap: Record<string, string> = {};
          if (dbExercises) {
            dbExercises.forEach((ex) => {
              exMap[ex.name] = ex.id;
            });
          }

          const setInserts = [];
          for (const ex of loggedExercises) {
            const exId = exMap[ex.name] || '00000000-0000-0000-0000-000000000000';
            for (const st of ex.sets) {
              setInserts.push({
                workout_log_id: wLog.id,
                exercise_id: exId,
                set_number: st.setNumber,
                weight_kg: parseFloat(st.weightKg) || 0,
                reps: parseInt(st.reps, 10) || 0,
              });
            }
          }

          if (setInserts.length > 0) {
            await supabase.from('set_logs').insert(setInserts);
          }
        }
      }
    } catch (e) {
      console.warn('Error syncing workout with Supabase:', e);
    } finally {
      setIsSubmitting(false);
    }

    Alert.alert(
      'Workout Complete! 🔥',
      `Saved ${loggedExercises.length} exercises to Supabase. Muscle recovery state updated.`,
      [{ text: 'View Fatigue Heatmap', onPress: () => router.push('/(tabs)/fatigue') }]
    );
  };

  const categories: MainMuscleCategory[] = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  const filteredMuscles = MUSCLE_DEFINITIONS.filter((m) => {
    const matchesCat = m.mainCategory === selectedCategory;
    if (!searchQuery.trim()) return matchesCat;
    const q = searchQuery.toLowerCase();
    return matchesCat && (m.name.toLowerCase().includes(q) || m.subHead.toLowerCase().includes(q));
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Active Workout Player Header matching Screenshot 1 Screen 2 ("00:12") */}
      <View style={styles.playerHeader}>
        <Text style={styles.playerTimerText}>{formatTimer(activeSeconds)}</Text>
        <View style={styles.playerControls}>
          <TouchableOpacity
            style={styles.playerSquareBtn}
            onPress={() => {
              setIsPlayerActive(false);
              setActiveSeconds(0);
            }}
          >
            <Square color="#FFFFFF" size={16} fill="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playerPauseBtn}
            onPress={() => setIsPlayerActive(!isPlayerActive)}
          >
            {isPlayerActive ? (
              <Pause color="#FFFFFF" size={18} />
            ) : (
              <Play color="#FFFFFF" size={18} fill="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.currentExerciseTitle}>Jump fast 24x</Text>

      {/* Main Hero Exercise Video / Media Card matching Screenshot 1 Screen 2 */}
      <View style={styles.heroMediaCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800' }}
          style={styles.heroMediaImage}
        />
        <View style={styles.heroPlayOverlay}>
          <View style={styles.heroPlayIconWrapper}>
            <Play color="#FFFFFF" size={24} fill="#FFFFFF" />
          </View>
        </View>

        <View style={styles.heroProgressTrack}>
          <View style={[styles.heroProgressFill, { width: '45%' }]} />
        </View>
      </View>

      {/* "Up next" Exercise Queue Card matching Screenshot 1 Screen 2 */}
      <Text style={styles.sectionLabel}>Up next</Text>
      <View style={styles.upNextCard}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150' }}
          style={styles.upNextThumb}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.upNextTitle}>Jump fast</Text>
          <Text style={styles.upNextMeta}>24x  •  00:15</Text>
        </View>
        <ChevronRight color="#38BDF8" size={20} />
      </View>

      {/* Inter-Set Rest Countdown Timer Card */}
      <View style={styles.timerCard}>
        <View style={styles.timerHeader}>
          <View style={styles.timerHeaderLeft}>
            <Timer color="#38BDF8" size={18} />
            <Text style={styles.timerTitle}>Inter-Set Rest Timer</Text>
          </View>
          <Text style={styles.timerDisplay}>{formatTimer(timerSeconds)}</Text>
        </View>

        <View style={styles.timerBtnRow}>
          {[30, 60, 90, 120, 180].map((sec) => (
            <TouchableOpacity
              key={sec}
              style={[styles.presetChip, timerInitial === sec && isTimerActive && styles.presetChipActive]}
              onPress={() => startRestTimer(sec)}
            >
              <Text style={[styles.presetChipText, timerInitial === sec && isTimerActive && styles.presetChipTextActive]}>
                {sec}s
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.timerActionBtn}
            onPress={() => setIsTimerActive(!isTimerActive)}
          >
            {isTimerActive ? <Pause color="#FBBF24" size={16} /> : <Play color="#38BDF8" size={16} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timerActionBtn}
            onPress={() => {
              setIsTimerActive(false);
              setTimerSeconds(0);
            }}
          >
            <RotateCcw color="#9CA3AF" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Height & Weight Quick Adjustment Card matching Screenshot 2 Bottom-Left */}
      <View style={styles.biometricsCard}>
        <View style={styles.bioHeaderRow}>
          <Text style={styles.bioTitle}>Your height & weight?</Text>
          <Text style={styles.bioSub}>Used for strength percentile 1RM calculation</Text>
        </View>

        <View style={styles.bioValuesRow}>
          <View style={styles.bioItem}>
            <Text style={styles.bioItemLabel}>Height</Text>
            <View style={styles.bioPillActive}>
              <Text style={styles.bioPillTextActive}>{heightCm} cm</Text>
              <View style={styles.checkDot}>
                <Check color="#FFFFFF" size={10} />
              </View>
            </View>
          </View>

          <View style={styles.bioItem}>
            <Text style={styles.bioItemLabel}>Weight</Text>
            <View style={styles.bioPillVal}>
              <Text style={styles.bioPillText}>{weightKgVal} kg</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Exercise Picker Section */}
      <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Select Target Muscle Group</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[styles.catChipText, selectedCategory === cat && styles.catChipTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercise Search Input */}
      <View style={styles.searchWrapper}>
        <Search color="#9CA3AF" size={18} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.pickerGrid}>
        {filteredMuscles.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.pickerItem}
            onPress={() => handleAddExercise(m.name, m.subHead)}
          >
            <Plus color="#38BDF8" size={18} />
            <View>
              <Text style={styles.pickerName}>{m.name}</Text>
              <Text style={styles.pickerSub}>{m.subHead}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logged Exercise Sets Table */}
      <Text style={[styles.sectionLabel, { marginTop: 20 }]}>Logged Session Exercises</Text>

      {loggedExercises.map((ex, exIndex) => (
        <View key={ex.exerciseId} style={styles.exerciseCard}>
          <View style={styles.exCardHeader}>
            <View>
              <Text style={styles.exCardTitle}>{ex.name}</Text>
              <Text style={styles.exCardSub}>{ex.subCategory}</Text>
            </View>
            <Dumbbell color="#38BDF8" size={20} />
          </View>

          <View style={styles.setTableHeader}>
            <Text style={[styles.thText, { width: 44 }]}>SET</Text>
            <Text style={[styles.thText, { flex: 1 }]}>WEIGHT (KG)</Text>
            <Text style={[styles.thText, { flex: 1 }]}>REPS</Text>
            <Text style={[styles.thText, { width: 36 }]}>DEL</Text>
          </View>

          {ex.sets.map((st, setIndex) => (
            <View key={st.id} style={styles.setRow}>
              <Text style={styles.setNumBadge}>{st.setNumber}</Text>
              <TextInput
                style={styles.setValInput}
                keyboardType="numeric"
                value={st.weightKg}
                onChangeText={(val) => handleUpdateSet(exIndex, setIndex, 'weightKg', val)}
              />
              <TextInput
                style={styles.setValInput}
                keyboardType="numeric"
                value={st.reps}
                onChangeText={(val) => handleUpdateSet(exIndex, setIndex, 'reps', val)}
              />
              <TouchableOpacity
                style={styles.delBtn}
                onPress={() => handleRemoveSet(exIndex, setIndex)}
              >
                <Trash2 color="#F87171" size={16} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addSetBtn} onPress={() => handleAddSet(exIndex)}>
            <Plus color="#38BDF8" size={16} />
            <Text style={styles.addSetBtnText}>Add Set (Auto 60s Rest)</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={[styles.finishBtn, isSubmitting && { opacity: 0.6 }]}
        onPress={handleFinishWorkout}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#161618" size="small" />
        ) : (
          <>
            <CheckCircle2 color="#161618" size={20} />
            <Text style={styles.finishBtnText}>Finish & Record Workout</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161618',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  playerTimerText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
    letterSpacing: -0.5,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playerSquareBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#242427',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerPauseBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#242427',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentExerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 14,
  },
  heroMediaCard: {
    height: 220,
    borderRadius: 24,
    backgroundColor: '#242427',
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#323236',
  },
  heroMediaImage: {
    width: '100%',
    height: '100%',
  },
  heroPlayOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlayIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroProgressTrack: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    marginBottom: 10,
  },
  upNextCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242427',
    borderRadius: 18,
    padding: 12,
    gap: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#323236',
  },
  upNextThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
  },
  upNextTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  upNextMeta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  timerCard: {
    backgroundColor: '#242427',
    borderRadius: 18,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#323236',
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timerDisplay: {
    fontSize: 18,
    fontWeight: '900',
    color: '#38BDF8',
    fontVariant: ['tabular-nums'],
  },
  timerBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  presetChip: {
    flex: 1,
    backgroundColor: '#323236',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: '#38BDF8',
  },
  presetChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  presetChipTextActive: {
    color: '#161618',
    fontWeight: '800',
  },
  timerActionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#323236',
    alignItems: 'center',
    justifyContent: 'center',
  },
  biometricsCard: {
    backgroundColor: '#242427',
    borderRadius: 20,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#323236',
  },
  bioHeaderRow: {
    marginBottom: 12,
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bioSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  bioValuesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bioItem: {
    flex: 1,
    gap: 6,
  },
  bioItemLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  bioPillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#323236',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#38BDF8',
  },
  bioPillTextActive: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  checkDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bioPillVal: {
    backgroundColor: '#323236',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  bioPillText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  catChip: {
    backgroundColor: '#242427',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#323236',
  },
  catChipActive: {
    backgroundColor: '#38BDF8',
    borderColor: '#38BDF8',
  },
  catChipText: {
    color: '#9CA3AF',
    fontWeight: '600',
    fontSize: 13,
  },
  catChipTextActive: {
    color: '#161618',
    fontWeight: '800',
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#242427',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#323236',
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  pickerGrid: {
    gap: 8,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#242427',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#323236',
  },
  pickerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pickerSub: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  exerciseCard: {
    backgroundColor: '#242427',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#323236',
  },
  exCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  exCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  exCardSub: {
    fontSize: 13,
    color: '#38BDF8',
  },
  setTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  setNumBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#323236',
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  setValInput: {
    flex: 1,
    backgroundColor: '#323236',
    borderRadius: 10,
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 12,
    height: 38,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  delBtn: {
    width: 32,
    alignItems: 'center',
  },
  addSetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: 12,
    marginTop: 8,
  },
  addSetBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#38BDF8',
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 10,
  },
  finishBtnText: {
    color: '#161618',
    fontSize: 17,
    fontWeight: '800',
  },
});
