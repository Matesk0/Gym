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
  const [isPublic, setIsPublic] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MainMuscleCategory>('Chest');

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

  const handleFinishWorkout = () => {
    if (loggedExercises.length === 0) {
      Alert.alert('Empty Workout', 'Please add at least one exercise set.');
      return;
    }
    Alert.alert(
      'Workout Logged! 🔥',
      `Saved ${loggedExercises.length} exercises. Your muscle fatigue map has been updated. Privacy: ${
        isPublic ? 'Public Profile Viewable' : 'Private (Members Only)'
      }`,
      [{ text: 'Great', onPress: () => router.push('/(tabs)/fatigue') }]
    );
  };

  const categories: MainMuscleCategory[] = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'];
  const filteredMuscles = MUSCLE_DEFINITIONS.filter((m) => m.mainCategory === selectedCategory);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workout Logger</Text>
        <TextInput
          style={styles.titleInput}
          value={workoutTitle}
          onChangeText={setWorkoutTitle}
          placeholder="Workout Title"
          placeholderTextColor="#8E8E93"
        />

        <View style={styles.privacyCard}>
          <View style={styles.privacyLeft}>
            {isPublic ? <Eye color="#30D158" size={20} /> : <Lock color="#FF9F0C" size={20} />}
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
            trackColor={{ false: '#2C2C2E', true: '#30D158' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <Text style={styles.sectionLabel}>Select Target Muscle Group</Text>
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

      <View style={styles.pickerGrid}>
        {filteredMuscles.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.pickerItem}
            onPress={() => handleAddExercise(m.name, m.subHead)}
          >
            <Plus color="#30D158" size={18} />
            <View>
              <Text style={styles.pickerName}>{m.name}</Text>
              <Text style={styles.pickerSub}>{m.subHead}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Logged Session Exercises</Text>

      {loggedExercises.map((ex, exIndex) => (
        <View key={ex.exerciseId} style={styles.exerciseCard}>
          <View style={styles.exCardHeader}>
            <View>
              <Text style={styles.exCardTitle}>{ex.name}</Text>
              <Text style={styles.exCardSub}>{ex.subCategory}</Text>
            </View>
            <Dumbbell color="#30D158" size={20} />
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
                <Trash2 color="#FF453A" size={16} />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addSetBtn} onPress={() => handleAddSet(exIndex)}>
            <Plus color="#30D158" size={16} />
            <Text style={styles.addSetBtnText}>Add Set</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.finishBtn} onPress={handleFinishWorkout}>
        <CheckCircle2 color="#000000" size={22} />
        <Text style={styles.finishBtnText}>Finish & Record Workout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  titleInput: {
    fontSize: 17,
    fontWeight: '700',
    color: '#30D158',
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1C1C1E',
    padding: 14,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
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
    color: '#FFFFFF',
  },
  privacySubtitle: {
    fontSize: 12,
    color: '#8E8E93',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8E8E93',
    marginBottom: 10,
  },
  catScroll: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  catChip: {
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  catChipActive: {
    backgroundColor: '#30D158',
    borderColor: '#30D158',
  },
  catChipText: {
    color: '#8E8E93',
    fontWeight: '600',
    fontSize: 13,
  },
  catChipTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  pickerGrid: {
    gap: 8,
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1C1C1E',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  pickerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pickerSub: {
    fontSize: 12,
    color: '#8E8E93',
  },
  exerciseCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
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
    color: '#30D158',
  },
  setTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8E8E93',
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
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 32,
  },
  setValInput: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    color: '#30D158',
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
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
    borderRadius: 12,
    marginTop: 8,
  },
  addSetBtnText: {
    color: '#30D158',
    fontSize: 13,
    fontWeight: '700',
  },
  finishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#30D158',
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 10,
  },
  finishBtnText: {
    color: '#000000',
    fontSize: 17,
    fontWeight: '800',
  },
});
