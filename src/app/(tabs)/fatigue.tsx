import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MuscleMapSvg } from '../../components/MuscleMapSvg';
import { FATIGUE_STAGES, MUSCLE_DEFINITIONS } from '../../constants/muscles';
import { FatigueState, FatigueStage } from '../../types/database';
import { Flame, RefreshCw, Info, ShieldAlert, CheckCircle2 } from 'lucide-react-native';

export default function FatigueScreen() {
  const [viewMode, setViewMode] = useState<'front' | 'back'>('front');

  // Dynamic state for each granular muscle head with sample logged recovery percentages
  const [fatigueData, setFatigueData] = useState<Record<string, FatigueState>>({
    upper_chest: {
      muscle_id: 'upper_chest',
      name: 'Upper Chest',
      sub_head: 'Clavicular Head',
      main_category: 'Chest',
      last_trained_hours_ago: 14,
      fatigue_percentage: 35,
      stage: 2,
      color: FATIGUE_STAGES[2].color,
      recovery_hours_needed: 31,
    },
    middle_chest: {
      muscle_id: 'middle_chest',
      name: 'Middle Chest',
      sub_head: 'Sternal Head',
      main_category: 'Chest',
      last_trained_hours_ago: 14,
      fatigue_percentage: 45,
      stage: 3,
      color: FATIGUE_STAGES[3].color,
      recovery_hours_needed: 26,
    },
    lower_chest: {
      muscle_id: 'lower_chest',
      name: 'Lower Chest',
      sub_head: 'Costal Head',
      main_category: 'Chest',
      last_trained_hours_ago: 14,
      fatigue_percentage: 55,
      stage: 3,
      color: FATIGUE_STAGES[3].color,
      recovery_hours_needed: 20,
    },
    anterior_delt: {
      muscle_id: 'anterior_delt',
      name: 'Front Shoulders',
      sub_head: 'Anterior Deltoid',
      main_category: 'Shoulders',
      last_trained_hours_ago: 14,
      fatigue_percentage: 40,
      stage: 2,
      color: FATIGUE_STAGES[2].color,
      recovery_hours_needed: 24,
    },
    lateral_delt: {
      muscle_id: 'lateral_delt',
      name: 'Side Shoulders',
      sub_head: 'Lateral Deltoid',
      main_category: 'Shoulders',
      last_trained_hours_ago: 72,
      fatigue_percentage: 95,
      stage: 5,
      color: FATIGUE_STAGES[5].color,
      recovery_hours_needed: 0,
    },
    quads: {
      muscle_id: 'quads',
      name: 'Quads',
      sub_head: 'Rectus Femoris & Vastus',
      main_category: 'Legs',
      last_trained_hours_ago: 6,
      fatigue_percentage: 15,
      stage: 1,
      color: FATIGUE_STAGES[1].color,
      recovery_hours_needed: 58,
    },
    lats: {
      muscle_id: 'lats',
      name: 'Lats',
      sub_head: 'Latissimus Dorsi',
      main_category: 'Back',
      last_trained_hours_ago: 48,
      fatigue_percentage: 75,
      stage: 4,
      color: FATIGUE_STAGES[4].color,
      recovery_hours_needed: 12,
    },
    lower_back: {
      muscle_id: 'lower_back',
      name: 'Lower Back',
      sub_head: 'Erector Spinae',
      main_category: 'Back',
      last_trained_hours_ago: 48,
      fatigue_percentage: 65,
      stage: 4,
      color: FATIGUE_STAGES[4].color,
      recovery_hours_needed: 25,
    },
    traps: {
      muscle_id: 'traps',
      name: 'Upper Back',
      sub_head: 'Trapezius',
      main_category: 'Back',
      last_trained_hours_ago: 48,
      fatigue_percentage: 85,
      stage: 5,
      color: FATIGUE_STAGES[5].color,
      recovery_hours_needed: 0,
    },
  });

  const [selectedMuscle, setSelectedMuscle] = useState<FatigueState>(fatigueData.upper_chest);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Muscle Fatigue Heatmap</Text>
        <Text style={styles.subtitle}>
          Scientific rest windows based on workout frequency & volume
        </Text>
      </View>

      {/* Front / Back Toggle */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'front' && styles.toggleBtnActive]}
          onPress={() => setViewMode('front')}
        >
          <Text style={[styles.toggleText, viewMode === 'front' && styles.toggleTextActive]}>
            Anterior (Front)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, viewMode === 'back' && styles.toggleBtnActive]}
          onPress={() => setViewMode('back')}
        >
          <Text style={[styles.toggleText, viewMode === 'back' && styles.toggleTextActive]}>
            Posterior (Back)
          </Text>
        </TouchableOpacity>
      </View>

      {/* 5-Stage Color Gradient Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>5-Stage Color Recovery Scale</Text>
        <View style={styles.legendBar}>
          {([1, 2, 3, 4, 5] as FatigueStage[]).map((stg) => {
            const info = FATIGUE_STAGES[stg];
            return (
              <View key={stg} style={[styles.legendItem, { backgroundColor: info.color }]}>
                <Text style={styles.legendStageText}>S{stg}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.legendLabels}>
          <Text style={[styles.labelMinMax, { color: '#EF4444' }]}>0% Exhausted</Text>
          <Text style={[styles.labelMinMax, { color: '#10B981' }]}>100% Prime</Text>
        </View>
      </View>

      {/* Interactive Muscle SVG Physique */}
      <View style={styles.svgContainer}>
        <MuscleMapSvg
          viewMode={viewMode}
          fatigueData={fatigueData}
          onSelectMuscle={(m) => setSelectedMuscle(m)}
          selectedMuscleId={selectedMuscle?.muscle_id}
        />
        <Text style={styles.tapTipText}>Tap any muscle head to inspect rest breakdown</Text>
      </View>

      {/* Selected Muscle Recovery Details Card */}
      {selectedMuscle && (
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View>
              <Text style={styles.detailName}>{selectedMuscle.name}</Text>
              <Text style={styles.detailSub}>{selectedMuscle.sub_head}</Text>
            </View>
            <View style={[styles.stageBadge, { backgroundColor: FATIGUE_STAGES[selectedMuscle.stage].bg, borderColor: selectedMuscle.color }]}>
              <Text style={[styles.stageBadgeText, { color: selectedMuscle.color }]}>
                {FATIGUE_STAGES[selectedMuscle.stage].label} ({selectedMuscle.fatigue_percentage}%)
              </Text>
            </View>
          </View>

          {/* Recovery Meter Bar */}
          <View style={styles.meterTrack}>
            <View
              style={[
                styles.meterFill,
                { width: `${selectedMuscle.fatigue_percentage}%`, backgroundColor: selectedMuscle.color },
              ]}
            />
          </View>

          <View style={styles.metricGrid}>
            <View style={styles.metricBox}>
              <RefreshCw color="#3B82F6" size={18} />
              <Text style={styles.metricVal}>{selectedMuscle.last_trained_hours_ago} hrs ago</Text>
              <Text style={styles.metricLbl}>Last Trained</Text>
            </View>

            <View style={styles.metricBox}>
              <Flame color={selectedMuscle.color} size={18} />
              <Text style={styles.metricVal}>
                {selectedMuscle.recovery_hours_needed > 0
                  ? `${selectedMuscle.recovery_hours_needed} hrs`
                  : 'Ready!'}
              </Text>
              <Text style={styles.metricLbl}>Est. Rest Remaining</Text>
            </View>
          </View>

          {/* Scientific Advice */}
          <View style={styles.adviceRow}>
            {selectedMuscle.stage <= 2 ? (
              <ShieldAlert color="#EF4444" size={20} />
            ) : (
              <CheckCircle2 color="#10B981" size={20} />
            )}
            <Text style={styles.adviceText}>
              {selectedMuscle.stage <= 2
                ? 'High muscle breakdown detected. Avoid heavy compound strain on this head today.'
                : 'Muscle fibers have synthesized. Prime condition for progressive overload!'}
            </Text>
          </View>
        </View>
      )}
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: '#10B981',
  },
  toggleText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#0B0F17',
  },
  legendContainer: {
    backgroundColor: '#161F2E',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  legendTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 8,
  },
  legendBar: {
    flexDirection: 'row',
    height: 18,
    borderRadius: 9,
    overflow: 'hidden',
  },
  legendItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendStageText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#0B0F17',
  },
  legendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  labelMinMax: {
    fontSize: 11,
    fontWeight: '700',
  },
  svgContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  tapTipText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 4,
  },
  detailCard: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 14,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  detailSub: {
    fontSize: 13,
    color: '#94A3B8',
  },
  stageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  stageBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  meterTrack: {
    height: 10,
    backgroundColor: '#0B0F17',
    borderRadius: 5,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 5,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#0B0F17',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  metricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  metricLbl: {
    fontSize: 11,
    color: '#94A3B8',
  },
  adviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0B0F17',
    padding: 12,
    borderRadius: 12,
  },
  adviceText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
  },
});
