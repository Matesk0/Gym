import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, User, Mail, Lock, ChevronDown, ChevronUp, Target, Award, Scale, Timer, Shield } from 'lucide-react-native';
import { FitnessGoal, ExperienceLevel, PreferredUnit } from '../../types/database';

export default function SignupScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Optional Setup State
  const [showOptional, setShowOptional] = useState(false);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>('Hypertrophy');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Intermediate');
  const [preferredUnit, setPreferredUnit] = useState<PreferredUnit>('kg');
  const [bodyweight, setBodyweight] = useState('75');
  const [heightCm, setHeightCm] = useState('175');
  const [defaultRestSeconds, setDefaultRestSeconds] = useState(90);
  const [isPublicLogs, setIsPublicLogs] = useState(false);
  const [trackWorkoutTime, setTrackWorkoutTime] = useState(true);
  const [perSetTimerEnabled, setPerSetTimerEnabled] = useState(true);
  const [autoHypertrophyEnabled, setAutoHypertrophyEnabled] = useState(true);

  const handleSignup = async () => {
    if (!username || !email || !password) {
      Alert.alert('Missing Fields', 'Please fill out all required fields (Username, Email, Password).');
      return;
    }
    setLoading(true);

    const parsedBw = parseFloat(bodyweight);
    const parsedHt = parseFloat(heightCm);

    const { error } = await signUp(email, password, username, {
      fitness_goal: fitnessGoal,
      experience_level: experienceLevel,
      preferred_unit: preferredUnit,
      bodyweight_kg: isNaN(parsedBw) ? 75 : parsedBw,
      height_cm: isNaN(parsedHt) ? 175 : parsedHt,
      default_rest_seconds: defaultRestSeconds,
      is_public_logs: isPublicLogs,
      track_workout_time: trackWorkoutTime,
      per_set_timer_enabled: perSetTimerEnabled,
      auto_hypertrophy_enabled: autoHypertrophyEnabled,
    });
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Failed', error);
    } else {
      Alert.alert('Account Created', 'Welcome to GymPulse!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    }
  };

  const fitnessGoals: FitnessGoal[] = ['Hypertrophy', 'Strength', 'Fat Loss', 'Endurance', 'General Fitness'];
  const experienceLevels: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
  const restTimerOptions = [60, 90, 120, 180];

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.cardWrapper}>
        <View style={styles.headerContainer}>
          <View style={styles.logoBadge}>
            <Dumbbell color="#30D158" size={36} />
          </View>
          <Text style={styles.appTitle}>Create Account</Text>
          <Text style={styles.appSubtitle}>Join GymPulse & track your strength percentile</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <User color="#8E8E93" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username (e.g. IronLifter99)"
              placeholderTextColor="#8E8E93"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Mail color="#8E8E93" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#8E8E93"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock color="#8E8E93" size={20} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 chars)"
              placeholderTextColor="#8E8E93"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Optional Profile Setup Accordion */}
          <TouchableOpacity
            style={styles.optionalHeader}
            onPress={() => setShowOptional(!showOptional)}
            activeOpacity={0.8}
          >
            <View style={styles.optionalHeaderLeft}>
              <Target color="#38BDF8" size={18} />
              <Text style={styles.optionalHeaderText}>Optional Fitness Setup & Preferences</Text>
            </View>
            {showOptional ? <ChevronUp color="#8E8E93" size={18} /> : <ChevronDown color="#8E8E93" size={18} />}
          </TouchableOpacity>

          {showOptional && (
            <View style={styles.optionalContainer}>
              {/* Fitness Goal */}
              <Text style={styles.optLabel}>Primary Fitness Goal</Text>
              <View style={styles.chipRow}>
                {fitnessGoals.map((goal) => (
                  <TouchableOpacity
                    key={goal}
                    style={[styles.chip, fitnessGoal === goal && styles.chipActive]}
                    onPress={() => setFitnessGoal(goal)}
                  >
                    <Text style={[styles.chipText, fitnessGoal === goal && styles.chipTextActive]}>
                      {goal}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Experience Level */}
              <Text style={styles.optLabel}>Experience Level</Text>
              <View style={styles.chipRow}>
                {experienceLevels.map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[styles.chip, experienceLevel === lvl && styles.chipActive]}
                    onPress={() => setExperienceLevel(lvl)}
                  >
                    <Text style={[styles.chipText, experienceLevel === lvl && styles.chipTextActive]}>
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Preferred Units & Biometrics */}
              <View style={styles.optRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.optLabel}>Weight Unit</Text>
                  <View style={styles.unitToggleRow}>
                    <TouchableOpacity
                      style={[styles.unitBtn, preferredUnit === 'kg' && styles.unitBtnActive]}
                      onPress={() => setPreferredUnit('kg')}
                    >
                      <Text style={[styles.unitBtnText, preferredUnit === 'kg' && styles.unitBtnTextActive]}>
                        kg
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.unitBtn, preferredUnit === 'lbs' && styles.unitBtnActive]}
                      onPress={() => setPreferredUnit('lbs')}
                    >
                      <Text style={[styles.unitBtnText, preferredUnit === 'lbs' && styles.unitBtnTextActive]}>
                        lbs
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.optLabel}>Bodyweight ({preferredUnit})</Text>
                  <View style={styles.optInputWrapper}>
                    <Scale color="#8E8E93" size={16} />
                    <TextInput
                      style={styles.optInput}
                      value={bodyweight}
                      onChangeText={setBodyweight}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Rest Timer Preference */}
              <Text style={styles.optLabel}>Default Rest Timer</Text>
              <View style={styles.chipRow}>
                {restTimerOptions.map((secs) => (
                  <TouchableOpacity
                    key={secs}
                    style={[styles.chip, defaultRestSeconds === secs && styles.chipActive]}
                    onPress={() => setDefaultRestSeconds(secs)}
                  >
                    <Text style={[styles.chipText, defaultRestSeconds === secs && styles.chipTextActive]}>
                      {secs}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Workout Duration & Tracking Features */}
              <View style={styles.switchOptRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchOptTitle}>Track Workout & Set Duration</Text>
                  <Text style={styles.switchOptSub}>Live stopwatch and set timestamp logging</Text>
                </View>
                <Switch
                  value={trackWorkoutTime}
                  onValueChange={setTrackWorkoutTime}
                  trackColor={{ false: '#2C2C2E', true: '#30D158' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.switchOptRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchOptTitle}>Automatic Per-Set Rest Timer</Text>
                  <Text style={styles.switchOptSub}>Countdown timer after completing each set</Text>
                </View>
                <Switch
                  value={perSetTimerEnabled}
                  onValueChange={setPerSetTimerEnabled}
                  trackColor={{ false: '#2C2C2E', true: '#30D158' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              <View style={styles.switchOptRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchOptTitle}>Automatic Hypertrophy Progression</Text>
                  <Text style={styles.switchOptSub}>Calculates +2.5kg overload when hitting rep target</Text>
                </View>
                <Switch
                  value={autoHypertrophyEnabled}
                  onValueChange={setAutoHypertrophyEnabled}
                  trackColor={{ false: '#2C2C2E', true: '#30D158' }}
                  thumbColor="#FFFFFF"
                />
              </View>

              {/* Public Logs Switch */}
              <View style={styles.switchOptRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.switchOptTitle}>Public Workout Logs</Text>
                  <Text style={styles.switchOptSub}>Allow community members to view your workouts</Text>
                </View>
                <Switch
                  value={isPublicLogs}
                  onValueChange={setIsPublicLogs}
                  trackColor={{ false: '#2C2C2E', true: '#30D158' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.signupBtn} onPress={handleSignup} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signupBtnText}>Register Now</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  appSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
    textAlign: 'center',
  },
  formContainer: {
    gap: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    height: 52,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  optionalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(48, 209, 88, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(48, 209, 88, 0.25)',
    marginTop: 4,
  },
  optionalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionalHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#38BDF8',
  },
  optionalContainer: {
    gap: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  optLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#3A3A3C',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  chipActive: {
    backgroundColor: '#30D158',
  },
  chipText: {
    fontSize: 12,
    color: '#E5E5EA',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  optRow: {
    flexDirection: 'row',
    gap: 12,
  },
  unitToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#3A3A3C',
    borderRadius: 10,
    padding: 3,
    height: 42,
  },
  unitBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  unitBtnActive: {
    backgroundColor: '#30D158',
  },
  unitBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  unitBtnTextActive: {
    color: '#FFFFFF',
  },
  optInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3C',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
    gap: 8,
  },
  optInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  switchOptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  switchOptTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  switchOptSub: {
    fontSize: 11,
    color: '#8E8E93',
  },
  signupBtn: {
    backgroundColor: '#30D158',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  signupBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  linkText: {
    color: '#30D158',
    fontSize: 14,
    fontWeight: '700',
  },
});

