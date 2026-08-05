import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import {
  Bell,
  Search,
  SlidersHorizontal,
  Star,
  Play,
  Flame,
  ChevronRight,
  Clock,
  Lock,
  Eye,
  History,
} from 'lucide-react-native';

interface PopularWorkout {
  id: string;
  title: string;
  trainer: string;
  rating: number;
  isPremium: boolean;
  image: string;
  duration: string;
  calories: number;
  category: string;
}

const POPULAR_WORKOUTS: PopularWorkout[] = [
  {
    id: 'pw1',
    title: 'HIIT Cardio for beginners',
    trainer: 'Tadeas Izo',
    rating: 4.9,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600',
    duration: '30 min',
    calories: 300,
    category: 'Cardio',
  },
  {
    id: 'pw2',
    title: '10-minute morning yoga',
    trainer: 'Nama Ste',
    rating: 4.7,
    isPremium: false,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
    duration: '10 min',
    calories: 110,
    category: 'Flexibility',
  },
  {
    id: 'pw3',
    title: 'Dancing therapy',
    trainer: 'Daria Pike',
    rating: 4.9,
    isPremium: true,
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600',
    duration: '25 min',
    calories: 240,
    category: 'Aerobic',
  },
];

interface HistorySession {
  id: string;
  title: string;
  date: string;
  exerciseCount: number;
  totalVolumeKg: number;
  isPublic: boolean;
}

const RECENT_WORKOUT_HISTORY: HistorySession[] = [
  {
    id: 'w1',
    title: 'Upper Body Power Session',
    date: 'Today, 08:30 AM',
    exerciseCount: 4,
    totalVolumeKg: 4280,
    isPublic: false,
  },
  {
    id: 'w2',
    title: 'Leg Day Hypertrophy & Quads',
    date: 'Yesterday, 06:15 PM',
    exerciseCount: 5,
    totalVolumeKg: 6850,
    isPublic: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<'Discover' | 'Trainers' | 'My plan'>('Discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [historyLogs, setHistoryLogs] = useState<HistorySession[]>(RECENT_WORKOUT_HISTORY);

  useEffect(() => {
    if (!isSupabaseConfigured || !user?.id) return;

    let isMounted = true;
    const fetchUserStats = async () => {
      try {
        const { data: logs, error } = await supabase
          .from('workout_logs')
          .select('id, title, created_at, is_public, set_logs(weight_kg, reps)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (logs && !error && isMounted) {
          const mappedHistory: HistorySession[] = logs.map((log: any) => {
            let logVol = 0;
            let count = 0;
            if (Array.isArray(log.set_logs)) {
              count = log.set_logs.length;
              log.set_logs.forEach((st: any) => {
                logVol += (st.weight_kg || 0) * (st.reps || 0);
              });
            }
            return {
              id: log.id,
              title: log.title || 'Workout Session',
              date: new Date(log.created_at).toLocaleDateString(),
              exerciseCount: count,
              totalVolumeKg: logVol,
              isPublic: log.is_public ?? false,
            };
          });

          if (mappedHistory.length > 0) setHistoryLogs(mappedHistory);
        }
      } catch (e) {
        console.warn('Supabase stats fetch notice:', e);
      }
    };

    fetchUserStats();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const filteredWorkouts = POPULAR_WORKOUTS.filter((w) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return w.title.toLowerCase().includes(q) || w.trainer.toLowerCase().includes(q);
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header matching Screenshot 1 Screen 1 (Avatar + Good morning + Bell icon) */}
      <View style={styles.headerRow}>
        <View style={styles.userMeta}>
          <Image
            source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.greetingText}>Good morning,</Text>
            <Text style={styles.usernameText}>{profile?.username || 'Polly Strong'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.bellBtn}>
          <Bell color="#FFFFFF" size={18} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      {/* Weekly Goal Progress Card matching Screenshot 1 Screen 1 */}
      <View style={styles.goalCard}>
        <Text style={styles.goalTitle}>You've done 3 workouts this week!</Text>
        <Text style={styles.goalSubtitle}>75% of your weekly goal is completed.</Text>
        <View style={styles.goalTrack}>
          <View style={[styles.goalFill, { width: '75%' }]} />
        </View>
      </View>

      {/* Sub-Tab Navigation (Discover | Trainers | My plan) */}
      <View style={styles.subTabRow}>
        {(['Discover', 'Trainers', 'My plan'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.subTabBtn}
            onPress={() => setActiveSubTab(tab)}
          >
            <Text style={[styles.subTabText, activeSubTab === tab && styles.subTabTextActive]}>
              {tab}
            </Text>
            {activeSubTab === tab && <View style={styles.subTabLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Input Bar with Filter Button */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search color="#9E9A97" size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#9E9A97"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <SlidersHorizontal color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>

      {/* Most Popular Workouts Horizontal Carousel */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Most popular workouts</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/fatigue')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carouselScroll}>
        {filteredWorkouts.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.workoutCard}
            onPress={() => router.push('/(tabs)/workout')}
          >
            <View style={styles.cardImageContainer}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />

              {item.isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumText}>Premium</Text>
                </View>
              )}

              <View style={styles.ratingBadge}>
                <Star color="#FBBF24" size={12} fill="#FBBF24" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>

            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.cardAuthor}>{item.trainer}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Quick Start Workout Action Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Workouts</Text>
      </View>

      <TouchableOpacity style={styles.quickStartCard} onPress={() => router.push('/(tabs)/workout')}>
        <View style={styles.quickStartTextCol}>
          <Text style={styles.quickStartTitle}>Active Workout Session</Text>
          <Text style={styles.quickStartSubtitle}>Log sets, reps, weight & start rest timer</Text>
        </View>
        <View style={styles.quickStartPlayBtn}>
          <Play color="#FFFFFF" size={20} fill="#FFFFFF" />
        </View>
      </TouchableOpacity>

      {/* Muscle Recovery Glance Card */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Muscle Recovery Glance</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/fatigue')}>
          <Text style={styles.seeAllText}>Open Heatmap</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.fatigueCard} onPress={() => router.push('/(tabs)/fatigue')}>
        <View style={styles.fatigueCardHeader}>
          <View style={styles.fatigueIconBadge}>
            <Flame color="#F87171" size={20} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fatigueCardTitle}>Active Muscle Repair</Text>
            <Text style={styles.fatigueCardSubtitle}>Quads & Upper Chest in deep recovery</Text>
          </View>
          <ChevronRight color="#9E9A97" size={20} />
        </View>

        <View style={styles.fatiguePillRow}>
          <View style={[styles.fatiguePill, { borderColor: '#F87171', backgroundColor: 'rgba(248, 113, 113, 0.12)' }]}>
            <View style={[styles.pillDot, { backgroundColor: '#F87171' }]} />
            <Text style={[styles.pillText, { color: '#F87171' }]}>Quads (15% Exhausted)</Text>
          </View>
          <View style={[styles.fatiguePill, { borderColor: '#A3E635', backgroundColor: 'rgba(163, 230, 53, 0.12)' }]}>
            <View style={[styles.pillDot, { backgroundColor: '#A3E635' }]} />
            <Text style={[styles.pillText, { color: '#A3E635' }]}>Lats (95% Prime)</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Recent Workout History */}
      <View style={[styles.sectionHeader, { marginTop: 20 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <History color="#38BDF8" size={18} />
          <Text style={styles.sectionTitle}>Recent Workout History</Text>
        </View>
      </View>

      <View style={styles.historyList}>
        {historyLogs.map((log) => (
          <View key={log.id} style={styles.historyCard}>
            <View style={styles.historyCardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{log.title}</Text>
                <View style={styles.historyDateRow}>
                  <Clock color="#9E9A97" size={12} />
                  <Text style={styles.historyDateText}>{log.date}</Text>
                </View>
              </View>

              <View style={[styles.privacyBadge, log.isPublic ? styles.privacyBadgePublic : styles.privacyBadgePrivate]}>
                {log.isPublic ? <Eye color="#38BDF8" size={12} /> : <Lock color="#FBBF24" size={12} />}
                <Text style={[styles.privacyBadgeText, { color: log.isPublic ? '#38BDF8' : '#FBBF24' }]}>
                  {log.isPublic ? 'Public' : 'Private'}
                </Text>
              </View>
            </View>

            <View style={styles.historyCardBottom}>
              <Text style={styles.historyMetaText}>
                {log.exerciseCount} Sets • {log.totalVolumeKg.toLocaleString()} kg Volume
              </Text>
            </View>
          </View>
        ))}
      </View>
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
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  greetingText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
  },
  goalCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  goalSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    marginBottom: 14,
  },
  goalTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalFill: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 4,
  },
  subTabRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 4,
  },
  subTabBtn: {
    position: 'relative',
    paddingVertical: 6,
  },
  subTabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94A3B8',
  },
  subTabTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  subTabLine: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#38BDF8',
    borderRadius: 1.5,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '500',
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  seeAllText: {
    fontSize: 13,
    color: '#38BDF8',
    fontWeight: '600',
  },
  carouselScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  workoutCard: {
    width: 220,
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 24,
    marginRight: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardImageContainer: {
    height: 130,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  premiumText: {
    color: '#EC4899',
    fontSize: 10,
    fontWeight: '700',
  },
  ratingBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  cardInfo: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  cardAuthor: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 3,
  },
  quickStartCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  quickStartTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  quickStartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  quickStartSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  quickStartPlayBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#38BDF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fatigueCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  fatigueCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  fatigueIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fatigueCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  fatigueCardSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  fatiguePillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fatiguePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  pillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyList: {
    gap: 10,
    marginTop: 10,
  },
  historyCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 10,
  },
  historyCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  historyDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  historyDateText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  privacyBadgePublic: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  privacyBadgePrivate: {
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  privacyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  historyCardBottom: {
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    paddingTop: 8,
  },
  historyMetaText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
  },
});
