import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { Profile, RankTier } from '../../types/database';
import { calculateRankProgress } from '../../lib/ranks';
import {
  Settings,
  BarChart2,
  Flame,
  Coins,
  ChevronRight,
} from 'lucide-react-native';

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
    username: 'Sarah L.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    is_online: true,
    rank: 'Grandmaster',
    total_score: 211,
    bench_1rm: 180,
    squat_1rm: 240,
    deadlift_1rm: 290,
    percentile: 'Top 0.1%',
  },
  {
    id: 'u2',
    username: 'Joel G.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_online: true,
    rank: 'Master',
    total_score: 198,
    bench_1rm: 140,
    squat_1rm: 195,
    deadlift_1rm: 220,
    percentile: 'Top 0.8%',
  },
  {
    id: 'u3',
    username: 'Sally R.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    is_online: true,
    rank: 'Platinum',
    total_score: 167,
    bench_1rm: 125,
    squat_1rm: 170,
    deadlift_1rm: 200,
    percentile: 'Top 5%',
  },
  {
    id: 'u4',
    username: 'Polly Strong',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    is_online: true,
    rank: 'Gold',
    total_score: 148,
    bench_1rm: 115,
    squat_1rm: 150,
    deadlift_1rm: 185,
    percentile: 'Top 18%',
  },
  {
    id: 'u5',
    username: 'Dmitri_Steel',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    is_online: false,
    rank: 'Silver',
    total_score: 120,
    bench_1rm: 90,
    squat_1rm: 120,
    deadlift_1rm: 150,
    percentile: 'Top 45%',
  },
];

const RANK_SCORE_MAP: Record<RankTier, number> = {
  Grandmaster: 211,
  Master: 198,
  Diamond: 180,
  Platinum: 167,
  Gold: 148,
  Silver: 120,
  Bronze: 95,
};

const RANK_PERCENTILE_MAP: Record<RankTier, string> = {
  Grandmaster: 'Top 0.1%',
  Master: 'Top 0.8%',
  Diamond: 'Top 3%',
  Platinum: 'Top 8%',
  Gold: 'Top 18%',
  Silver: 'Top 45%',
  Bronze: 'Top 70%',
};

export default function RanksScreen() {
  const { profile, user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(GLOBAL_LEADERBOARD);
  const [activeTimeTab, setActiveTimeTab] = useState<'All time' | 'Today' | 'Week' | 'Month'>('All time');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    const loadProfiles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.from('profiles').select('*');
        if (data && data.length > 0 && !error && isMounted) {
          const mapped: LeaderboardUser[] = data.map((p: Profile, idx: number) => {
            const rank = p.overall_rank || 'Gold';
            const baseScore = RANK_SCORE_MAP[rank] || 148;
            const bw = p.bodyweight_kg || 75;
            return {
              id: p.id,
              username: p.username || `Athlete_${idx + 1}`,
              avatar_url: p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              is_online: p.is_online ?? true,
              rank,
              total_score: baseScore,
              bench_1rm: Math.round(bw * 1.47),
              squat_1rm: Math.round(bw * 1.91),
              deadlift_1rm: Math.round(bw * 2.35),
              percentile: RANK_PERCENTILE_MAP[rank] || 'Top 20%',
            };
          });

          mapped.sort((a, b) => b.total_score - a.total_score);
          setLeaderboard(mapped);
        }
      } catch (e) {
        console.warn('Supabase leaderboard fetch warning:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfiles();
    return () => {
      isMounted = false;
    };
  }, [profile]);

  const getRankBadgeColor = (rank: RankTier) => {
    switch (rank) {
      case 'Grandmaster': return '#F87171';
      case 'Master': return '#C084FC';
      case 'Diamond': return '#38BDF8';
      case 'Platinum': return '#60A5FA';
      case 'Gold': return '#FBBF24';
      case 'Silver': return '#9E9A97';
      default: return '#F59E0B';
    }
  };

  const userBw = profile?.bodyweight_kg || 58;
  const userBenchRatio = 115 / userBw;
  const rankProgress = calculateRankProgress(userBenchRatio);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Settings Gear Top Left matching Screenshot 1 Screen 3 */}
      <View style={styles.topNavRow}>
        <TouchableOpacity style={styles.settingsBtn}>
          <Settings color="#FFFFFF" size={18} />
        </TouchableOpacity>
      </View>

      {/* User Header Profile Section matching Screenshot 1 Screen 3 */}
      <View style={styles.profileHeroSection}>
        <View style={styles.pfpGlowWrapper}>
          <Image
            source={{ uri: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
            style={styles.heroPfp}
          />
          {profile?.is_online && <View style={styles.onlineDotHero} />}
        </View>

        <Text style={styles.heroUsername}>{profile?.username || 'Polly Strong'}</Text>
        <Text style={styles.heroHandle}>@fitness_girl97</Text>

        <View style={styles.socialFollowRow}>
          <Text style={styles.followText}><Text style={styles.followNum}>15</Text> Followers</Text>
          <Text style={styles.followDivider}>|</Text>
          <Text style={styles.followText}><Text style={styles.followNum}>24</Text> Following</Text>
        </View>
      </View>

      {/* "My statistics" Section matching Screenshot 1 Screen 3 */}
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

      {/* "Leaderboard" Header with Sub-Tabs matching Screenshot 1 Screen 3 */}
      <View style={styles.leaderboardTitleRow}>
        <Text style={styles.sectionHeaderTitle}>Leaderboard</Text>
        <ChevronRight color="#9E9A97" size={18} />
      </View>

      {/* Time Filter Tabs (All time | Today | Week | Month) */}
      <View style={styles.timeTabRow}>
        {(['All time', 'Today', 'Week', 'Month'] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={styles.timeTabBtn}
            onPress={() => setActiveTimeTab(tab)}
          >
            <Text style={[styles.timeTabText, activeTimeTab === tab && styles.timeTabTextActive]}>
              {tab}
            </Text>
            {activeTimeTab === tab && <View style={styles.timeTabLine} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Leaderboard Player List */}
      <View style={styles.leaderboardList}>
        {isLoading ? (
          <ActivityIndicator color="#30D158" size="large" style={{ marginVertical: 20 }} />
        ) : (
          leaderboard.map((item, index) => {
            const isMe = item.id === user?.id || item.username === (profile?.username || 'Polly Strong');
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

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.playerUsername, isMe && { color: '#30D158' }]}>
                      {item.username} {isMe && '(You)'}
                    </Text>
                    <View style={[styles.tierTag, { borderColor: badgeColor }]}>
                      <Text style={[styles.tierTagText, { color: badgeColor }]}>{item.rank}</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.scoreVal}>{item.total_score}</Text>
              </View>
            );
          })
        )}
      </View>

      {/* Tier Advancement Progress Card */}
      <View style={[styles.myRankCard, { marginTop: 24 }]}>
        <View style={styles.progressContainer}>
          <View style={styles.progressHeaderRow}>
            <Text style={styles.progressTitleText}>
              {rankProgress.nextRank
                ? `Tier Progress to ${rankProgress.nextRank}`
                : 'Pinnacle Tier Reached'}
            </Text>
            <Text style={styles.progressPctText}>{rankProgress.progressPercent}%</Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${rankProgress.progressPercent}%`,
                  backgroundColor: getRankBadgeColor(profile?.overall_rank || 'Gold'),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.liftGrid}>
          <View style={styles.liftBox}>
            <Text style={styles.liftName}>BENCH 1RM</Text>
            <Text style={styles.liftVal}>115 kg</Text>
            <Text style={styles.liftSub}>{(115 / userBw).toFixed(2)}x Bodyweight</Text>
          </View>

          <View style={styles.liftBox}>
            <Text style={styles.liftName}>SQUAT 1RM</Text>
            <Text style={styles.liftVal}>150 kg</Text>
            <Text style={styles.liftSub}>{(150 / userBw).toFixed(2)}x Bodyweight</Text>
          </View>

          <View style={styles.liftBox}>
            <Text style={styles.liftName}>DEADLIFT 1RM</Text>
            <Text style={styles.liftVal}>185 kg</Text>
            <Text style={styles.liftSub}>{(185 / userBw).toFixed(2)}x Bodyweight</Text>
          </View>
        </View>
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
  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
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
  profileHeroSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  pfpGlowWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  heroPfp: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#38BDF8',
  },
  onlineDotHero: {
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
  heroUsername: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  heroHandle: {
    fontSize: 13,
    color: '#94A3B8',
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
    marginBottom: 12,
  },
  statsThreeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
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
  leaderboardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  timeTabRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 4,
  },
  timeTabBtn: {
    position: 'relative',
    paddingVertical: 6,
  },
  timeTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  timeTabTextActive: {
    color: '#30D158',
    fontWeight: '700',
  },
  timeTabLine: {
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#30D158',
    borderRadius: 1.5,
  },
  leaderboardList: {
    gap: 10,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  playerRowMe: {
    borderColor: '#30D158',
    backgroundColor: 'rgba(48, 209, 88, 0.12)',
  },
  rankNumber: {
    width: 28,
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  rankTopThree: {
    color: '#FBBF24',
  },
  pfpWrapperSmall: {
    position: 'relative',
  },
  pfpSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  onlineDotSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#0F172A',
  },
  playerUsername: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  tierTag: {
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  tierTagText: {
    fontSize: 9,
    fontWeight: '700',
  },
  scoreVal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  myRankCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.7)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  progressContainer: {
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressTitleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  progressPctText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#30D158',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#30D158',
    borderRadius: 4,
  },
  liftGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  liftBox: {
    flex: 1,
    backgroundColor: '#334155',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  liftName: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  liftVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2,
  },
  liftSub: {
    fontSize: 10,
    color: '#38BDF8',
    marginTop: 2,
  },
});
