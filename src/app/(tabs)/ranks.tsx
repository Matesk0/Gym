import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { RankTier } from '../../types/database';
import { Trophy, Globe } from 'lucide-react-native';

interface LeaderboardUser {
  id: string;
  username: string;
  avatar_url: string;
  is_online: boolean;
  rank: RankTier;
  total_score: number;
  bench_1rm: number;
  squat_1rm: number;
  deadlift_1rm: number;
  percentile: string;
}

const GLOBAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'u1',
    username: 'Titan_Marcus',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_online: true,
    rank: 'Grandmaster',
    total_score: 985,
    bench_1rm: 180,
    squat_1rm: 240,
    deadlift_1rm: 290,
    percentile: 'Top 0.1%',
  },
  {
    id: 'u2',
    username: 'Elena_Valkyrie',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    is_online: true,
    rank: 'Master',
    total_score: 920,
    bench_1rm: 130,
    squat_1rm: 195,
    deadlift_1rm: 220,
    percentile: 'Top 0.8%',
  },
  {
    id: 'u3',
    username: 'Alex_LiftMaster',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_online: true,
    rank: 'Gold',
    total_score: 740,
    bench_1rm: 115,
    squat_1rm: 150,
    deadlift_1rm: 185,
    percentile: 'Top 18%',
  },
  {
    id: 'u4',
    username: 'Dmitri_Steel',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_online: false,
    rank: 'Platinum',
    total_score: 810,
    bench_1rm: 140,
    squat_1rm: 180,
    deadlift_1rm: 210,
    percentile: 'Top 8%',
  },
  {
    id: 'u5',
    username: 'Sarah_Pulse',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    is_online: true,
    rank: 'Silver',
    total_score: 580,
    bench_1rm: 85,
    squat_1rm: 110,
    deadlift_1rm: 140,
    percentile: 'Top 45%',
  },
];

export default function RanksScreen() {
  const { profile } = useAuth();

  const getRankBadgeColor = (rank: RankTier) => {
    switch (rank) {
      case 'Grandmaster': return '#FF375F';
      case 'Master': return '#BF5AF2';
      case 'Diamond': return '#0A84FF';
      case 'Platinum': return '#64D2FF';
      case 'Gold': return '#FFD60A';
      case 'Silver': return '#8E8E93';
      default: return '#FF9F0C';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Global Strength Ranks</Text>
        <Text style={styles.subtitle}>
          Gaming rank system based on world strength percentiles
        </Text>
      </View>

      <View style={styles.myRankCard}>
        <View style={styles.myRankHeader}>
          <View style={styles.pfpWrapper}>
            <Image
              source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }}
              style={styles.pfp}
            />
            {profile?.is_online && <View style={styles.onlineDot} />}
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.myUsername}>{profile?.username || 'Alex_LiftMaster'}</Text>
            <Text style={styles.myPercentile}>World Strength Percentile: Top 18%</Text>
          </View>

          <View style={[styles.tierBadge, { backgroundColor: getRankBadgeColor(profile?.overall_rank || 'Gold') }]}>
            <Trophy color="#000000" size={14} />
            <Text style={styles.tierText}>{profile?.overall_rank || 'Gold'}</Text>
          </View>
        </View>

        <View style={styles.liftGrid}>
          <View style={styles.liftBox}>
            <Text style={styles.liftName}>BENCH 1RM</Text>
            <Text style={styles.liftVal}>115 kg</Text>
            <Text style={styles.liftSub}>1.47x Bodyweight</Text>
          </View>

          <View style={styles.liftBox}>
            <Text style={styles.liftName}>SQUAT 1RM</Text>
            <Text style={styles.liftVal}>150 kg</Text>
            <Text style={styles.liftSub}>1.91x Bodyweight</Text>
          </View>

          <View style={styles.liftBox}>
            <Text style={styles.liftName}>DEADLIFT 1RM</Text>
            <Text style={styles.liftVal}>185 kg</Text>
            <Text style={styles.liftSub}>2.35x Bodyweight</Text>
          </View>
        </View>
      </View>

      <View style={styles.tableHeaderRow}>
        <Globe color="#30D158" size={18} />
        <Text style={styles.tableHeaderTitle}>World Athletes (Global Rank)</Text>
      </View>

      <View style={styles.leaderboardList}>
        {GLOBAL_LEADERBOARD.map((item, index) => {
          const isMe = item.id === 'u3';
          const badgeColor = getRankBadgeColor(item.rank);

          return (
            <View key={item.id} style={[styles.playerRow, isMe && styles.playerRowMe]}>
              <Text style={[styles.rankNumber, index < 3 && styles.rankTopThree]}>
                #{index + 1}
              </Text>

              <View style={styles.pfpWrapperSmall}>
                <Image source={{ uri: item.avatar_url }} style={styles.pfpSmall} />
                {item.is_online && <View style={styles.onlineDotSmall} />}
              </View>

              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={[styles.playerUsername, isMe && { color: '#30D158' }]}>
                    {item.username}
                  </Text>

                  <View style={[styles.tierTag, { borderColor: badgeColor }]}>
                    <Text style={[styles.tierTagText, { color: badgeColor }]}>{item.rank}</Text>
                  </View>
                </View>

                <Text style={styles.playerMetaText}>
                  B: {item.bench_1rm}kg • S: {item.squat_1rm}kg • D: {item.deadlift_1rm}kg
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.scoreVal}>{item.total_score} pts</Text>
                <Text style={styles.percentileTag}>{item.percentile}</Text>
              </View>
            </View>
          );
        })}
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
  },
  header: {
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 4,
  },
  myRankCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    marginBottom: 24,
  },
  myRankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  pfpWrapper: {
    position: 'relative',
  },
  pfp: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: '#30D158',
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  myUsername: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  myPercentile: {
    fontSize: 13,
    color: '#30D158',
    fontWeight: '600',
    marginTop: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tierText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 13,
  },
  liftGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  liftBox: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
  },
  liftName: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E93',
  },
  liftVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  liftSub: {
    fontSize: 10,
    color: '#30D158',
    marginTop: 2,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tableHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  leaderboardList: {
    gap: 10,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  playerRowMe: {
    borderColor: '#30D158',
    backgroundColor: 'rgba(48, 209, 88, 0.08)',
  },
  rankNumber: {
    width: 28,
    fontSize: 15,
    fontWeight: '800',
    color: '#8E8E93',
    textAlign: 'center',
  },
  rankTopThree: {
    color: '#FF9F0C',
  },
  pfpWrapperSmall: {
    position: 'relative',
  },
  pfpSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineDotSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#30D158',
    borderWidth: 1.5,
    borderColor: '#1C1C1E',
  },
  playerUsername: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tierTag: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  tierTagText: {
    fontSize: 10,
    fontWeight: '800',
  },
  playerMetaText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  scoreVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  percentileTag: {
    fontSize: 11,
    color: '#30D158',
    fontWeight: '700',
    marginTop: 2,
  },
});
