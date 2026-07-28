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
import { User, Shield, Lock, Eye, LogOut, Save, Scale, Sparkles } from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, signOut } = useAuth();

  const [username, setUsername] = useState(profile?.username || 'Alex_LiftMaster');
  const [bodyweight, setBodyweight] = useState(profile?.bodyweight_kg?.toString() || '78.5');
  const [isPublicLogs, setIsPublicLogs] = useState(profile?.is_public_logs || false);
  const [isOnlineStatus, setIsOnlineStatus] = useState(profile?.is_online ?? true);

  const handleSaveProfile = async () => {
    const bwNum = parseFloat(bodyweight);
    if (isNaN(bwNum)) {
      Alert.alert('Invalid Weight', 'Please enter a valid numeric bodyweight in kg.');
      return;
    }
    await updateProfile({
      username,
      bodyweight_kg: bwNum,
      is_public_logs: isPublicLogs,
      is_online: isOnlineStatus,
    });
    Alert.alert('Profile Saved', 'Your privacy and bodyweight settings have been updated.');
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Profile Hero */}
      <View style={styles.heroSection}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
            style={styles.avatar}
          />
          {/* Live Online Green Dot Indicator */}
          {isOnlineStatus && <View style={styles.onlineDot} />}
        </View>

        <Text style={styles.heroName}>{username}</Text>
        <View style={styles.rankPill}>
          <Sparkles color="#F59E0B" size={14} />
          <Text style={styles.rankPillText}>{profile?.overall_rank || 'Gold Tier Athlete'}</Text>
        </View>
      </View>

      {/* Profile Settings Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>Profile & Bodyweight Stats</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <View style={styles.inputWrapper}>
            <User color="#94A3B8" size={18} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#64748B"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Bodyweight (KG) - Used for Strength Percentile</Text>
          <View style={styles.inputWrapper}>
            <Scale color="#94A3B8" size={18} />
            <TextInput
              style={styles.input}
              value={bodyweight}
              onChangeText={setBodyweight}
              keyboardType="numeric"
              placeholderTextColor="#64748B"
            />
          </View>
        </View>
      </View>

      {/* Privacy Control Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>Privacy & Workout Security</Text>

        {/* Workout Log Default Privacy */}
        <View style={styles.switchRow}>
          <View style={styles.switchLeft}>
            {isPublicLogs ? <Eye color="#10B981" size={20} /> : <Lock color="#F97316" size={20} />}
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Allow Others to See Workout Logs</Text>
              <Text style={styles.switchSub}>
                {isPublicLogs
                  ? 'Your workout logs are visible on your public profile'
                  : 'Workout logs are strictly secret and hidden'}
              </Text>
            </View>
          </View>
          <Switch
            value={isPublicLogs}
            onValueChange={setIsPublicLogs}
            trackColor={{ false: '#334155', true: '#10B981' }}
            thumbColor="#F8FAFC"
          />
        </View>

        {/* Live Online Green Dot Status Toggle */}
        <View style={[styles.switchRow, { marginTop: 12 }]}>
          <View style={styles.switchLeft}>
            <View style={[styles.dotPreview, { backgroundColor: isOnlineStatus ? '#10B981' : '#64748B' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Online Status Indicator</Text>
              <Text style={styles.switchSub}>
                Show green dot next to PFP on global leaderboard
              </Text>
            </View>
          </View>
          <Switch
            value={isOnlineStatus}
            onValueChange={setIsOnlineStatus}
            trackColor={{ false: '#334155', true: '#10B981' }}
            thumbColor="#F8FAFC"
          />
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
        <Save color="#0B0F17" size={20} />
        <Text style={styles.saveBtnText}>Save Profile Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleSignOut}>
        <LogOut color="#EF4444" size={20} />
        <Text style={styles.logoutBtnText}>Sign Out Account</Text>
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
    gap: 20,
  },
  heroSection: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: '#334155',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#0B0F17',
  },
  heroName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  rankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  rankPillText: {
    color: '#F59E0B',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 14,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B0F17',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  input: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
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
    width: 14,
    height: 14,
    borderRadius: 7,
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
    backgroundColor: '#10B981',
    height: 52,
    borderRadius: 16,
  },
  saveBtnText: {
    color: '#0B0F17',
    fontSize: 16,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
