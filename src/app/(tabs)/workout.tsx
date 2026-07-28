import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MUSCLE_DEFINITIONS } from '../../constants/muscles';
import { MainMuscleCategory } from '../../types/database';
import { Dumbbell, Plus, Trash2, CheckCircle2, Lock, Eye } from 'lucide-react-native';

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
  const [workoutTitle, setWorkoutTitle] = useState('Upper Body Power Session');
  const [isPublic, setIsPublic] = useState(false); // Default private log per specification
  const [selectedCategory, setSelectedCategory] = useState<MainMuscleCategory>('Chest');

  // Active exercises being logged in this session
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

  // Handle adding a new exercise to session
  const handleAddExercise = (name: string, subCategory: string) => {
    const newEx: LocalExerciseLog = {
      exerciseId: Date.now().toString(),
      name,
      subCategory,
      sets: [{ id: Date.now().toString() + '_1', setNumber: 1, weightKg: '20', reps: '10' }],
    };
    setLoggedExercises([...loggedExercises, newEx]);
  };

  // Add set to specific exercise
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
  };

  // Update set details (weight or reps)
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

  // Remove set
  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...loggedExercises];
    updated[exerciseIndex].sets.splice(setIndex, 1);
    if (updated[exerciseIndex].sets.length === 0) {
      updated.splice(exerciseIndex, 1);
    } else {
      // re-number sets
      updated[exerciseIndex].sets.forEach((s, idx) => (s.setNumber = idx + 1));
    }
    setLoggedExercises(updated);
  };

  // Save Workout Session
  const handleFinishWorkout = () => {
    if (loggedExercises.length === 0) {
      Alert.alert('Empty Workout', 'Please add at least one exercise set.');
      return;
    }
    Alert.alert(
      'Workout Saved! 🔥',
      `Logged ${loggedExercises.length} exercises. Your muscle fatigue heatmap has been updated. Privacy: ${
        isPublic ? 'Public Profile Viewable' : 'Private (Members Only)'
      }`,
      [{ text: 'Awesome', onPress: () => router.push('/(tabs)/fatigue') }]
    );
  };

  const categories: MainMuscleCategory[] = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  const filteredMuscles = MUSCLE_DEFINITIONS.filter((m) => m.mainCategory === selectedCategory);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Title & Privacy Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Logger</Text>
        <TextInput
          style={styles.titleInput}
          value={workoutTitle}
          onChangeText={setWorkoutTitle}
          placeholder="Workout Title"
          placeholderTextColor="#64748B"
        />

        {/* Privacy Switch Card */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyLeft}>
            {isPublic ? <Eye color="#10B981" size={20} /> : <Lock color="#F97316" size={20} />}
            <View>
              <Text style={styles.privacyTitle}>
                {isPublic ? 'Public Workout Log' : 'Private Workout Log (Default)'}
              </Text>
              <Text style={styles.privacySubtitle}>
                {isPublic ? 'Visible to athletes on your profile' : 'Hidden & secret to your account'}
              </Text>
            </View>
          </View>
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            trackColor={{ false: '#334155', true: '#10B981' }}
            thumbColor="#F8FAFC"
          />
        </View>
      </View>

      {/* Category Selector */}
      <Text style={styles.sectionLabel}>Select Muscle Group to Add Exercise</Text>
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

      {/* Exercise Picker Buttons */}
      <View style={styles.pickerGrid}>
        {filteredMuscles.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.pickerItem}
            onPress={() => handleAddExercise(m.name, m.subHead)}
          >
            <Plus color="#10B981" size={16} />
            <View>
              <Text style={styles.pickerName}>{m.name}</Text>
              <Text style={styles.pickerSub}>{m.subHead}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logged Exercises & Sets */}
      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Active Session Exercises</Text>

      {loggedExercises.map((ex, exIndex) => (
        <View key={ex.exerciseId} style={styles.exerciseCard}>
          <View style={styles.exCardHeader}>
            <View>
              <Text style={styles.exCardTitle}>{ex.name}</Text>
              <Text style={styles.exCardSub}>{ex.subCategory}</Text>
            </View>
            <Dumbbell color="#10B981" size={20} />
          </View>

          {/* Set Rows Header */}
          <View style={styles.setTableHeader}>
            <Text style={[styles.thText, { width: 50 }]}>SET</Text>
            <Text style={[styles.thText, { flex: 1 }]}>WEIGHT (KG)</Text>
            <Text style={[styles.thText, { flex: 1 }]}>REPS</Text>
            <Text style={[styles.thText, { width: 40 }]}>DEL</Text>
          </View>

          {/* Set Rows */}
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
                <Trash2 color="#EF4444" size={16} />
              </TouchableOpacity>
            </View>
          ))}

          {/* Add Set Button */}
          <TouchableOpacity style={styles.addSetBtn} onPress={() => handleAddSet(exIndex)}>
            <Plus color="#10B981" size={16} />
            <Text style={styles.addSetBtnText}>Add Set</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Save Workout Complete Button */}
      <TouchableOpacity style={styles.finishBtn} onPress={handleFinishWorkout}>
        <CheckCircle2 color="#0B0F17" size={22} />
        <Text style={styles.finishBtnText}>Finish & Record Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F17',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  privacySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 10,
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  catChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catChipActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  catChipText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 13,
  },
  catChipTextActive: {
    color: '#0B0F17',
    fontWeight: '800',
  },
  pickerGrid: {
    gap: 8,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#161F2E',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  pickerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  pickerSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
  exerciseCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
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
    color: '#F8FAFC',
  },
  exCardSub: {
    fontSize: 13,
    color: '#10B981',
  },
  setTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
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
    backgroundColor: '#0B0F17',
    color: '#F8FAFC',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  setValInput: {
    flex: 1,
    backgroundColor: '#0B0F17',
    borderRadius: 8,
    color: '#10B981',
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 12,
    height: 38,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#334155',
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 10,
    marginTop: 8,
  },
  addSetBtnText: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
  },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  finishBtnText: {
    color: '#0B0F17',
    fontSize: 17,
    fontWeight: '800',
  },
});
