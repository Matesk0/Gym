import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, Flame, Trophy, ChevronRight, Zap, Award, Calendar } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useAuth();

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
            {/* Online Green Dot Indicator */}
            {profile?.is_online && <View style={styles.onlineDot} />}
          </View>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.usernameText}>{profile?.username || 'Athlete'}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.rankBadge} onPress={() => router.push('/(tabs)/ranks')}>
          <Trophy color="#F59E0B" size={16} />
          <Text style={styles.rankText}>{profile?.overall_rank || 'Gold'}</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Start Action Card */}
      <TouchableOpacity style={styles.startCard} onPress={() => router.push('/(tabs)/workout')}>
        <View style={styles.startCardTextCol}>
          <Text style={styles.startCardTitle}>Log Today's Workout</Text>
          <Text style={styles.startCardSubtitle}>Track sets, weight, reps & trigger fatigue recovery</Text>
        </View>
        <View style={styles.startCardIcon}>
          <Dumbbell color="#0B0F17" size={28} />
        </View>
      </TouchableOpacity>

      {/* Muscle Fatigue Status Glance */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Muscle Recovery Overview</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/fatigue')}>
          <Text style={styles.seeAllText}>Open Heatmap</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.fatigueCard} onPress={() => router.push('/(tabs)/fatigue')}>
        <View style={styles.fatigueCardHeader}>
          <View style={styles.fatigueIconBadge}>
            <Flame color="#EF4444" size={22} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.fatigueCardTitle}>Active Recovery State</Text>
            <Text style={styles.fatigueCardSubtitle}>2 muscle heads in deep repair</Text>
          </View>
          <ChevronRight color="#64748B" size={20} />
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
          <Zap color="#10B981" size={20} />
          <Text style={styles.statVal}>12,450 kg</Text>
          <Text style={styles.statLbl}>Total Volume</Text>
        </View>

        <View style={styles.statCard}>
          <Calendar color="#3B82F6" size={20} />
          <Text style={styles.statVal}>4 Sessions</Text>
          <Text style={styles.statLbl}>Workouts Logged</Text>
        </View>

        <View style={styles.statCard}>
          <Award color="#F59E0B" size={20} />
          <Text style={styles.statVal}>Top 18%</Text>
          <Text style={styles.statLbl}>World Strength Rank</Text>
        </View>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    borderColor: '#334155',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#0B0F17',
  },
  welcomeText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rankText: {
    color: '#F59E0B',
    fontWeight: '700',
    fontSize: 13,
  },
  startCard: {
    backgroundColor: '#10B981',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  startCardTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  startCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B0F17',
  },
  startCardSubtitle: {
    fontSize: 13,
    color: '#042F2E',
    marginTop: 4,
  },
  startCardIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(11, 15, 23, 0.15)',
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
    color: '#10B981',
    fontWeight: '600',
  },
  fatigueCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
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
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fatigueCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  fatigueCardSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
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
    borderRadius: 10,
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
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  statVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statLbl: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
