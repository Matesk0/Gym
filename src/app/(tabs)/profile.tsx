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
  Scale,
  Sparkles,
  Check,
  BarChart2,
  Flame,
  Coins,
  Settings,
} from 'lucide-react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, signOut } = useAuth();

  const [username, setUsername] = useState(profile?.username || 'Polly Strong');
  const [bodyweight, setBodyweight] = useState(profile?.bodyweight_kg?.toString() || '58');
  const [heightCm, setHeightCm] = useState<number>(159);
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
      {/* Top Bar with Settings */}
      <View style={styles.topNavRow}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Settings color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>

      {/* User Avatar & Followers Header matching Screenshot 1 Screen 3 */}
      <View style={styles.heroSection}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
            style={styles.avatar}
          />
          {isOnlineStatus && <View style={styles.onlineDot} />}
        </View>

        <Text style={styles.heroName}>{username}</Text>
        <Text style={styles.heroHandle}>@fitness_girl97</Text>

        <View style={styles.socialFollowRow}>
          <Text style={styles.followText}><Text style={styles.followNum}>15</Text> Followers</Text>
          <Text style={styles.followDivider}>|</Text>
          <Text style={styles.followText}><Text style={styles.followNum}>24</Text> Following</Text>
        </View>
      </View>

      {/* "My statistics" 3 Columns Section matching Screenshot 1 Screen 3 */}
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

      {/* Height & Weight Manager Section matching Screenshot 2 Bottom-Left */}
      <View style={styles.biometricsCard}>
        <Text style={styles.bioTitle}>Your height & weight?</Text>
        <Text style={styles.bioSub}>Let us know you better for relative strength score</Text>

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
            <View style={styles.bioInputWrapper}>
              <TextInput
                style={styles.bioInputText}
                value={bodyweight}
                onChangeText={setBodyweight}
                keyboardType="numeric"
              />
              <Text style={styles.bioUnitText}>kg</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Account Settings Form Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>Profile & Privacy Controls</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Username</Text>
          <View style={styles.inputWrapper}>
            <User color="#9CA3AF" size={18} />
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#9CA3AF"
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
            trackColor={{ false: '#323236', true: '#38BDF8' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.switchRow, { marginTop: 10 }]}>
          <View style={styles.switchLeft}>
            <View style={[styles.dotPreview, { backgroundColor: isOnlineStatus ? '#A3E635' : '#9CA3AF' }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Online Status Badge</Text>
              <Text style={styles.switchSub}>Display green dot on global leaderboard</Text>
            </View>
          </View>
          <Switch
            value={isOnlineStatus}
            onValueChange={setIsOnlineStatus}
            trackColor={{ false: '#323236', true: '#38BDF8' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
        <Save color="#161618" size={18} />
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
    backgroundColor: '#161618',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
    gap: 20,
  },
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  settingsBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#242427',
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
    borderColor: '#38BDF8',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#A3E635',
    borderWidth: 2,
    borderColor: '#161618',
  },
  heroName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroHandle: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
  socialFollowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  followText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  followNum: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  followDivider: {
    color: '#323236',
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statsThreeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statColumnCard: {
    flex: 1,
    backgroundColor: '#242427',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#323236',
  },
  statColValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  statColLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  biometricsCard: {
    backgroundColor: '#242427',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#323236',
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
  bioInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#323236',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 44,
  },
  bioInputText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bioUnitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  sectionCard: {
    backgroundColor: '#242427',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#323236',
    gap: 14,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#323236',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
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
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  switchSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#38BDF8',
    height: 50,
    borderRadius: 16,
  },
  saveBtnText: {
    color: '#161618',
    fontSize: 16,
    fontWeight: '800',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    height: 48,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  logoutBtnText: {
    color: '#F87171',
    fontSize: 15,
    fontWeight: '700',
  },
});
