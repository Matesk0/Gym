import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import {
  User,
  Lock,
  Eye,
  LogOut,
  Save,
  Check,
  BarChart2,
  Flame,
  Coins,
  Settings,
  Target,
  Award,
  Timer,
  Ruler,
  Sparkles,
} from 'lucide-react-native';
import { FitnessGoal, ExperienceLevel, PreferredUnit } from '../../types/database';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, signOut } = useAuth();

  const [username, setUsername] = useState(profile?.username || 'Polly Strong');
  const [bodyweight, setBodyweight] = useState(profile?.bodyweight_kg?.toString() || '58');
  const [heightCm, setHeightCm] = useState(profile?.height_cm?.toString() || '159');
  const [isPublicLogs, setIsPublicLogs] = useState(profile?.is_public_logs || false);
  const [isOnlineStatus, setIsOnlineStatus] = useState(profile?.is_online ?? true);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(profile?.fitness_goal || 'Hypertrophy');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profile?.experience_level || 'Intermediate');
  const [preferredUnit, setPreferredUnit] = useState<PreferredUnit>(profile?.preferred_unit || 'kg');
  const [defaultRestSeconds, setDefaultRestSeconds] = useState<number>(profile?.default_rest_seconds || 90);
  const [gender, setGender] = useState<'male' | 'female'>(profile?.gender || 'female');

  const [trackWorkoutTime, setTrackWorkoutTime] = useState<boolean>(profile?.track_workout_time ?? true);
  const [perSetTimerEnabled, setPerSetTimerEnabled] = useState<boolean>(profile?.per_set_timer_enabled ?? true);
  const [autoHypertrophyEnabled, setAutoHypertrophyEnabled] = useState<boolean>(profile?.auto_hypertrophy_enabled ?? true);

  const fitnessGoals: FitnessGoal[] = ['Hypertrophy', 'Strength', 'Fat Loss', 'Endurance', 'General Fitness'];
  const experienceLevels: ExperienceLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
  const restTimerOptions = [60, 90, 120, 180];

  const handleSaveProfile = async () => {
    const bwNum = parseFloat(bodyweight);
    if (isNaN(bwNum)) {
      Alert.alert('Invalid Weight', 'Please enter a valid numeric bodyweight.');
      return;
    }
    const htNum = parseFloat(heightCm);

    await updateProfile({
      username,
      bodyweight_kg: bwNum,
      height_cm: isNaN(htNum) ? 159 : htNum,
      is_public_logs: isPublicLogs,
      is_online: isOnlineStatus,
      fitness_goal: fitnessGoal,
      experience_level: experienceLevel,
      preferred_unit: preferredUnit,
      default_rest_seconds: defaultRestSeconds,
      gender,
      track_workout_time: trackWorkoutTime,
      per_set_timer_enabled: perSetTimerEnabled,
      auto_hypertrophy_enabled: autoHypertrophyEnabled,
    });
    Alert.alert('Settings Saved', 'Your fitness preferences and biometrics have been updated.');
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Top Bar with Settings */}
      <View style={styles.topNavRow}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Settings color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>

      {/* User Avatar & Header */}
      <View style={styles.heroSection}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
            style={styles.avatar}
          />
          {isOnlineStatus && <View style={styles.onlineDot} />}
        </View>

        <Text style={styles.heroName}>{username}</Text>
        <Text style={styles.heroHandle}>@{username.toLowerCase().replace(/\s+/g, '_')}</Text>

        {/* Goal Badge */}
        <View style={styles.goalTag}>
          <Target color="#818CF8" size={14} />
          <Text style={styles.goalTagText}>{fitnessGoal} • {experienceLevel}</Text>
        </View>

        <View style={styles.socialFollowRow}>
          <Text style={styles.followText}><Text style={styles.followNum}>15</Text> Followers</Text>
          <Text style={styles.followDivider}>|</Text>
          <Text style={styles.followText}><Text style={styles.followNum}>24</Text> Following</Text>
        </View>
      </View>

      {/* "My statistics" 3 Columns Section */}
      <Text style={styles.sectionHeaderTitle}>My statistics</Text>
      <View style={styles.statsThreeGrid}>
        <View style={styles.statColumnCard}>
          <BarChart2 color="#C084FC" size={22} />
          <Text style={styles.statColValue}>149</Text>
          <Text style={styles.statColLabel}>Workouts total</Text>
        </View>

        <View style={styles.statColumnCard}>
          <Flame color="#38BDF8" size={22} />
          <Text style={styles.statColValue}>18 900</Text>
          <Text style={styles.statColLabel}>Calories burnt</Text>
        </View>

        <View style={styles.statColumnCard}>
          <Coins color="#A3E635" size={22} />
          <Text style={styles.statColValue}>53</Text>
          <Text style={styles.statColLabel}>Rewards collected</Text>
        </View>
      </View>

      {/* Height & Weight Manager Section */}
      <View style={styles.biometricsCard}>
        <Text style={styles.bioTitle}>Height & Weight Biometrics</Text>
        <Text style={styles.bioSub}>Used to calculate relative strength scores and rank percentiles</Text>

        <View style={styles.bioValuesRow}>
          <View style={styles.bioItem}>
            <Text style={styles.bioItemLabel}>Height (cm)</Text>
            <View style={styles.bioInputWrapper}>
              <Ruler color="#94A3B8" size={16} />
              <TextInput
                style={styles.bioInputText}
                value={heightCm}
                onChangeText={setHeightCm}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.bioItem}>
            <Text style={styles.bioItemLabel}>Weight ({preferredUnit})</Text>
            <View style={styles.bioInputWrapper}>
              <TextInput
                style={styles.bioInputText}
                value={bodyweight}
                onChangeText={setBodyweight}
                keyboardType="numeric"
              />
              <Text style={styles.bioUnitText}>{preferredUnit}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Fitness Preferences Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>Fitness Preferences & Goals</Text>

        {/* Goal Selector */}
        <View style={styles.prefGroup}>
          <Text style={styles.inputLabel}>Primary Goal</Text>
          <View style={styles.chipRow}>
            {fitnessGoals.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.chip, fitnessGoal === g && styles.chipActive]}
                onPress={() => setFitnessGoal(g)}
              >
                <Text style={[styles.chipText, fitnessGoal === g && styles.chipTextActive]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Experience Level Selector */}
        <View style={styles.prefGroup}>
          <Text style={styles.inputLabel}>Experience Level</Text>
          <View style={styles.chipRow}>
            {experienceLevels.map((lvl) => (
              <TouchableOpacity
                key={lvl}
                style={[styles.chip, experienceLevel === lvl && styles.chipActive]}
                onPress={() => setExperienceLevel(lvl)}
              >
                <Text style={[styles.chipText, experienceLevel === lvl && styles.chipTextActive]}>{lvl}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Units System Selector */}
        <View style={styles.prefGroup}>
          <Text style={styles.inputLabel}>Weight Unit System</Text>
          <View style={styles.unitToggleRow}>
            <TouchableOpacity
              style={[styles.unitBtn, preferredUnit === 'kg' && styles.unitBtnActive]}
              onPress={() => setPreferredUnit('kg')}
            >
              <Text style={[styles.unitBtnText, preferredUnit === 'kg' && styles.unitBtnTextActive]}>Kilograms (kg)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitBtn, preferredUnit === 'lbs' && styles.unitBtnActive]}
              onPress={() => setPreferredUnit('lbs')}
            >
              <Text style={[styles.unitBtnText, preferredUnit === 'lbs' && styles.unitBtnTextActive]}>Pounds (lbs)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Rest Timer Preference */}
        <View style={styles.prefGroup}>
          <Text style={styles.inputLabel}>Default Rest Timer</Text>
          <View style={styles.chipRow}>
            {restTimerOptions.map((secs) => (
              <TouchableOpacity
                key={secs}
                style={[styles.chip, defaultRestSeconds === secs && styles.chipActive]}
                onPress={() => setDefaultRestSeconds(secs)}
              >
                <Text style={[styles.chipText, defaultRestSeconds === secs && styles.chipTextActive]}>{secs}s</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Benchmark Gender Standard */}
        <View style={styles.prefGroup}>
          <Text style={styles.inputLabel}>Strength Standard Benchmark</Text>
          <View style={styles.unitToggleRow}>
            <TouchableOpacity
              style={[styles.unitBtn, gender === 'male' && styles.unitBtnActive]}
              onPress={() => setGender('male')}
            >
              <Text style={[styles.unitBtnText, gender === 'male' && styles.unitBtnTextActive]}>Male Benchmark</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitBtn, gender === 'female' && styles.unitBtnActive]}
              onPress={() => setGender('female')}
            >
              <Text style={[styles.unitBtnText, gender === 'female' && styles.unitBtnTextActive]}>Female Benchmark</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Workout Tracking & Automation Preferences */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>Workout Tracking & Automation</Text>

        <View style={styles.switchRow}>
          <View style={styles.switchLeft}>
            <Timer color="#38BDF8" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Session Stopwatch & Timestamps</Text>
              <Text style={styles.switchSub}>Track total elapsed workout duration & set timing</Text>
            </View>
          </View>
          <Switch
            value={trackWorkoutTime}
            onValueChange={setTrackWorkoutTime}
            trackColor={{ false: '#33302F', true: '#38BDF8' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.switchRow, { marginTop: 10 }]}>
          <View style={styles.switchLeft}>
            <Timer color="#C084FC" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Automatic Per-Set Rest Timer</Text>
              <Text style={styles.switchSub}>Trigger rest countdown automatically after each set</Text>
            </View>
          </View>
          <Switch
            value={perSetTimerEnabled}
            onValueChange={setPerSetTimerEnabled}
            trackColor={{ false: '#33302F', true: '#38BDF8' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.switchRow, { marginTop: 10 }]}>
          <View style={styles.switchLeft}>
            <Sparkles color="#A3E635" size={20} />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Automatic Hypertrophy Overload</Text>
              <Text style={styles.switchSub}>Calculate +2.5kg progressive overload when hitting reps ceiling</Text>
            </View>
          </View>
          <Switch
            value={autoHypertrophyEnabled}
            onValueChange={setAutoHypertrophyEnabled}
            trackColor={{ false: '#33302F', true: '#38BDF8' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Account Privacy & Settings */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>Profile & Privacy Controls</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <View style={styles.inputWrapper}>
            <User color="#9E9A97" size={18} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#9E9A97"
            />
          </View>
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchLeft}>
            {isPublicLogs ? <Eye color="#38BDF8" size={20} /> : <Lock color="#FBBF24" size={20} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Allow Public Workout Logs</Text>
              <Text style={styles.switchSub}>
                {isPublicLogs ? 'Visible on your public profile' : 'Logs are secret & private'}
              </Text>
            </View>
          </View>
          <Switch
            value={isPublicLogs}
            onValueChange={setIsPublicLogs}
            trackColor={{ false: '#33302F', true: '#38BDF8' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.switchRow, { marginTop: 10 }]}>
          <View style={styles.switchLeft}>
            <View style={[styles.dotPreview, { backgroundColor: isOnlineStatus ? '#A3E635' : '#9E9A97' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Online Status Badge</Text>
              <Text style={styles.switchSub}>Display green dot on global leaderboard</Text>
            </View>
          </View>
          <Switch
            value={isOnlineStatus}
            onValueChange={setIsOnlineStatus}
            trackColor={{ false: '#33302F', true: '#38BDF8' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
        <Save color="#FFFFFF" size={18} />
        <Text style={styles.saveBtnText}>Save Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
        <LogOut color="#F87171" size={18} />
        <Text style={styles.logoutBtnText}>Sign Out Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
    gap: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSection: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#6366F1',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  heroName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  heroHandle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  goalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  goalTagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#818CF8',
  },
  socialFollowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  followText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  followNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  followDivider: {
    color: '#334155',
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  statsThreeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statColumnCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  statColValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  statColLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
  },
  biometricsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  bioSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 12,
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
    color: '#94A3B8',
    fontWeight: '600',
  },
  bioInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  bioInputText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  bioUnitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  sectionCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 14,
  },
  prefGroup: {
    gap: 6,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#334155',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  chipActive: {
    backgroundColor: '#6366F1',
  },
  chipText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  unitToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#334155',
    borderRadius: 10,
    padding: 3,
    height: 44,
  },
  unitBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  unitBtnActive: {
    backgroundColor: '#6366F1',
  },
  unitBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  unitBtnTextActive: {
    color: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  dotPreview: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  switchSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366F1',
    height: 50,
    borderRadius: 12,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  logoutBtnText: {
    color: '#F87171',
    fontSize: 15,
    fontWeight: '600',
  },
});
