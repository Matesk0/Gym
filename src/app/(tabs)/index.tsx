import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { Dumbbell, Flame, Trophy, ChevronRight, Zap, Award, Calendar, Sparkles, Clock, Lock, Eye, History } from 'lucide-react-native';

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
  {
    id: 'w3',
    title: 'Pull & Lats Destroyer',
    date: '3 days ago',
    exerciseCount: 4,
    totalVolumeKg: 5120,
    isPublic: true,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const [totalVolume, setTotalVolume] = useState<number>(12450);
  const [sessionCount, setSessionCount] = useState<number>(4);
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
          setSessionCount(logs.length);
          let sumVolume = 0;
          const mappedHistory: HistorySession[] = logs.map((log: any) => {
            let logVol = 0;
            let count = 0;
            if (Array.isArray(log.set_logs)) {
              count = log.set_logs.length;
              log.set_logs.forEach((st: any) => {
                const setVol = (st.weight_kg || 0) * (st.reps || 0);
                logVol += setVol;
                sumVolume += setVol;
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

          if (sumVolume > 0) setTotalVolume(sumVolume);
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Profile Section */}
      <View style={styles.headerRow}>
        <View style={styles.userMeta}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
              style={styles.avatar}
            />
            {/* iOS Green Dot Online Indicator */}
            {profile?.is_online && <View style={styles.onlineDot} />}
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.usernameText}>{profile?.username || 'Athlete'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.rankBadge} onPress={() => router.push('/(tabs)/ranks')}>
          <Trophy color="#FF9F0C" size={15} />
          <Text style={styles.rankText}>{profile?.overall_rank || 'Gold'}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Start Action Card - iOS Accent */}
      <TouchableOpacity style={styles.startCard} onPress={() => router.push('/(tabs)/workout')}>
        <View style={styles.startCardTextCol}>
          <Text style={styles.startCardTitle}>Log Today's Workout</Text>
          <Text style={styles.startCardSubtitle}>Track sets, weight, reps & update muscle recovery</Text>
        </View>
        <View style={styles.startCardIcon}>
          <Dumbbell color="#000000" size={26} />
        </View>
      </TouchableOpacity>

      {/* Muscle Fatigue Status Glance */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Muscle Recovery Overview</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/fatigue')}>
          <Text style={styles.seeAllText}>Open MuscleWiki Map</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.fatigueCard} onPress={() => router.push('/(tabs)/fatigue')}>
        <View style={styles.fatigueCardHeader}>
          <View style={styles.fatigueIconBadge}>
            <Flame color="#e51f1f" size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fatigueCardTitle}>Active Muscle Breakdown</Text>
            <Text style={styles.fatigueCardSubtitle}>2 muscle heads in deep repair</Text>
          </View>
          <ChevronRight color="#8E8E93" size={20} />
        </View>

        <View style={styles.fatiguePillRow}>
          <View style={[styles.fatiguePill, { borderColor: '#e51f1f', backgroundColor: 'rgba(229,31,31,0.1)' }]}>
            <View style={[styles.pillDot, { backgroundColor: '#e51f1f' }]} />
            <Text style={[styles.pillText, { color: '#e51f1f' }]}>Quads (15% - Exhausted)</Text>
          </View>

          <View style={[styles.fatiguePill, { borderColor: '#f2a134', backgroundColor: 'rgba(242,161,52,0.1)' }]}>
            <View style={[styles.pillDot, { backgroundColor: '#f2a134' }]} />
            <Text style={[styles.pillText, { color: '#f2a134' }]}>Upper Chest (35% - Heavy Fatigue)</Text>
          </View>

          <View style={[styles.fatiguePill, { borderColor: '#bbdb44', backgroundColor: 'rgba(187,219,68,0.1)' }]}>
            <View style={[styles.pillDot, { backgroundColor: '#bbdb44' }]} />
            <Text style={[styles.pillText, { color: '#bbdb44' }]}>Lower Back (75% - Mostly Recovered)</Text>
          </View>

          <View style={[styles.fatiguePill, { borderColor: '#44ce1b', backgroundColor: 'rgba(68,206,27,0.1)' }]}>
            <View style={[styles.pillDot, { backgroundColor: '#44ce1b' }]} />
            <Text style={[styles.pillText, { color: '#44ce1b' }]}>Lats (95% - Prime State)</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Weekly Stats Grid */}
      <Text style={[styles.sectionTitle, { marginTop: 24 }]}>This Week's Pulse</Text>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Zap color="#30D158" size={20} />
          <Text style={styles.statVal}>{totalVolume.toLocaleString()} kg</Text>
          <Text style={styles.statLbl}>Total Volume</Text>
        </View>

        <View style={styles.statCard}>
          <Calendar color="#0A84FF" size={20} />
          <Text style={styles.statVal}>{sessionCount} Sessions</Text>
          <Text style={styles.statLbl}>Workouts Logged</Text>
        </View>

        <View style={styles.statCard}>
          <Award color="#FF9F0C" size={20} />
          <Text style={styles.statVal}>
            {profile?.overall_rank === 'Grandmaster'
              ? 'Top 0.1%'
              : profile?.overall_rank === 'Master'
              ? 'Top 0.8%'
              : 'Top 18%'}
          </Text>
          <Text style={styles.statLbl}>World Strength Rank</Text>
        </View>
      </View>

      {/* Workout History Feed */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <History color="#30D158" size={18} />
          <Text style={styles.sectionTitle}>Recent Workout History</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/workout')}>
          <Text style={styles.seeAllText}>Log New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.historyList}>
        {historyLogs.map((log) => (
          <View key={log.id} style={styles.historyCard}>
            <View style={styles.historyCardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyTitle}>{log.title}</Text>
                <View style={styles.historyDateRow}>
                  <Clock color="#8E8E93" size={12} />
                  <Text style={styles.historyDateText}>{log.date}</Text>
                </View>
              </View>

              <View style={[styles.privacyBadge, log.isPublic ? styles.privacyBadgePublic : styles.privacyBadgePrivate]}>
                {log.isPublic ? <Eye color="#30D158" size={12} /> : <Lock color="#FF9F0C" size={12} />}
                <Text style={[styles.privacyBadgeText, { color: log.isPublic ? '#30D158' : '#FF9F0C' }]}>
                  {log.isPublic ? 'Public' : 'Private'}
                </Text>
              </View>
            </View>

            <View style={styles.historyCardBottom}>
              <Text style={styles.historyMetaText}>
                {log.exerciseCount} Sets Logged • {log.totalVolumeKg.toLocaleString()} kg Total Volume
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
    backgroundColor: '#000000', // iOS OLED True Dark
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#30D158',
    borderWidth: 2,
    borderColor: '#000000',
  },
  welcomeText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 159, 12, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 159, 12, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rankText: {
    color: '#FF9F0C',
    fontWeight: '700',
    fontSize: 13,
  },
  startCard: {
    backgroundColor: '#30D158', // Vivid iOS Green
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  startCardTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  startCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  startCardSubtitle: {
    fontSize: 13,
    color: '#042F2E',
    marginTop: 4,
  },
  startCardIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
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
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  seeAllText: {
    fontSize: 13,
    color: '#30D158',
    fontWeight: '600',
  },
  fatigueCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  fatigueCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  fatigueIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(229, 31, 31, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fatigueCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  fatigueCardSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  fatiguePillRow: {
    gap: 8,
  },
  fatiguePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pillDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    gap: 6,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statLbl: {
    fontSize: 12,
    color: '#8E8E93',
  },
  historyList: {
    gap: 10,
    marginTop: 12,
  },
  historyCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    gap: 8,
  },
  historyCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  historyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  historyDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  historyDateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  privacyBadgePublic: {
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
    borderColor: 'rgba(48, 209, 88, 0.3)',
  },
  privacyBadgePrivate: {
    backgroundColor: 'rgba(255, 159, 12, 0.12)',
    borderColor: 'rgba(255, 159, 12, 0.3)',
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
    color: '#30D158',
    fontWeight: '600',
  },
});
