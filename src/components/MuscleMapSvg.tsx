import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Rect, Circle, G } from 'react-native-svg';
import { FATIGUE_STAGES, MuscleDefinition } from '../constants/muscles';
import { FatigueState } from '../types/database';

interface MuscleMapSvgProps {
  viewMode: 'front' | 'back';
  fatigueData: Record<string, FatigueState>;
  onSelectMuscle: (muscle: FatigueState) => void;
  selectedMuscleId?: string;
}

export const MuscleMapSvg: React.FC<MuscleMapSvgProps> = ({
  viewMode,
  fatigueData,
  onSelectMuscle,
  selectedMuscleId,
}) => {

  const getColor = (id: string): string => {
    const data = fatigueData[id];
    return data ? data.color : FATIGUE_STAGES[5].color; // Default fully recovered green
  };

  const handlePress = (id: string) => {
    if (fatigueData[id]) {
      onSelectMuscle(fatigueData[id]);
    }
  };

  return (
    <View style={styles.container}>
      <Svg width={260} height={380} viewBox="0 0 260 380">
        {/* Background Body Shadow Outline */}
        <G id="body_base" opacity={0.2}>
          {/* Head & Neck */}
          <Circle cx="130" cy="35" r="20" fill="#3B82F6" />
          <Rect x="122" y="55" width="16" height="15" rx="4" fill="#3B82F6" />
          {/* Main Torso Outer Silhouette */}
          <Path d="M90 70 L170 70 L185 140 L165 210 L155 350 L140 350 L135 230 L125 230 L120 350 L105 350 L95 210 L75 140 Z" fill="#1E293B" stroke="#334155" strokeWidth="2" />
        </G>

        {viewMode === 'front' ? (
          /* FRONT PHYSIQUE HEATMAP */
          <G id="front_muscles">
            {/* Upper Chest (Clavicular Head) */}
            <Path
              d="M102 75 Q130 82 158 75 L155 90 Q130 96 105 90 Z"
              fill={getColor('upper_chest')}
              stroke={selectedMuscleId === 'upper_chest' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={selectedMuscleId === 'upper_chest' ? 2 : 1}
              onPress={() => handlePress('upper_chest')}
            />
            {/* Middle Chest (Sternal Head) */}
            <Path
              d="M105 92 Q130 97 155 92 L152 110 Q130 115 108 110 Z"
              fill={getColor('middle_chest')}
              stroke={selectedMuscleId === 'middle_chest' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={selectedMuscleId === 'middle_chest' ? 2 : 1}
              onPress={() => handlePress('middle_chest')}
            />
            {/* Lower Chest (Costal Head) */}
            <Path
              d="M108 112 Q130 117 152 112 L148 125 Q130 128 112 125 Z"
              fill={getColor('lower_chest')}
              stroke={selectedMuscleId === 'lower_chest' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={selectedMuscleId === 'lower_chest' ? 2 : 1}
              onPress={() => handlePress('lower_chest')}
            />

            {/* Front Shoulders (Anterior Deltoid) */}
            <Path
              d="M82 72 Q94 70 100 78 L95 105 Q82 95 78 82 Z"
              fill={getColor('anterior_delt')}
              stroke={selectedMuscleId === 'anterior_delt' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('anterior_delt')}
            />
            <Path
              d="M178 72 Q166 70 160 78 L165 105 Q178 95 182 82 Z"
              fill={getColor('anterior_delt')}
              stroke={selectedMuscleId === 'anterior_delt' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('anterior_delt')}
            />

            {/* Side Shoulders (Lateral Deltoid) */}
            <Path
              d="M75 75 Q82 72 84 82 L78 108 Q72 95 75 75 Z"
              fill={getColor('lateral_delt')}
              stroke={selectedMuscleId === 'lateral_delt' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('lateral_delt')}
            />
            <Path
              d="M185 75 Q178 72 176 82 L182 108 Q188 95 185 75 Z"
              fill={getColor('lateral_delt')}
              stroke={selectedMuscleId === 'lateral_delt' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('lateral_delt')}
            />

            {/* Biceps - Outer Head (Long) */}
            <Path
              d="M74 110 Q82 108 84 140 L76 142 Z"
              fill={getColor('biceps_long')}
              stroke={selectedMuscleId === 'biceps_long' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('biceps_long')}
            />
            <Path
              d="M186 110 Q178 108 176 140 L184 142 Z"
              fill={getColor('biceps_long')}
              stroke={selectedMuscleId === 'biceps_long' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('biceps_long')}
            />

            {/* Biceps - Inner Head (Short) */}
            <Path
              d="M85 110 Q92 110 90 138 L84 140 Z"
              fill={getColor('biceps_short')}
              stroke={selectedMuscleId === 'biceps_short' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('biceps_short')}
            />
            <Path
              d="M175 110 Q168 110 170 138 L176 140 Z"
              fill={getColor('biceps_short')}
              stroke={selectedMuscleId === 'biceps_short' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('biceps_short')}
            />

            {/* Forearms */}
            <Path
              d="M72 148 L86 148 L82 195 L74 190 Z"
              fill={getColor('forearms')}
              stroke={selectedMuscleId === 'forearms' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('forearms')}
            />
            <Path
              d="M188 148 L174 148 L178 195 L186 190 Z"
              fill={getColor('forearms')}
              stroke={selectedMuscleId === 'forearms' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('forearms')}
            />

            {/* Upper Abs */}
            <Rect
              x="114"
              y="132"
              width="15"
              height="18"
              rx="3"
              fill={getColor('upper_abs')}
              stroke={selectedMuscleId === 'upper_abs' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('upper_abs')}
            />
            <Rect
              x="131"
              y="132"
              width="15"
              height="18"
              rx="3"
              fill={getColor('upper_abs')}
              stroke={selectedMuscleId === 'upper_abs' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('upper_abs')}
            />

            {/* Lower Abs */}
            <Rect
              x="114"
              y="153"
              width="15"
              height="22"
              rx="3"
              fill={getColor('lower_abs')}
              stroke={selectedMuscleId === 'lower_abs' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('lower_abs')}
            />
            <Rect
              x="131"
              y="153"
              width="15"
              height="22"
              rx="3"
              fill={getColor('lower_abs')}
              stroke={selectedMuscleId === 'lower_abs' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('lower_abs')}
            />

            {/* Obliques */}
            <Path
              d="M98 132 L112 132 L112 175 L102 165 Z"
              fill={getColor('obliques')}
              stroke={selectedMuscleId === 'obliques' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('obliques')}
            />
            <Path
              d="M162 132 L148 132 L148 175 L158 165 Z"
              fill={getColor('obliques')}
              stroke={selectedMuscleId === 'obliques' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('obliques')}
            />

            {/* Quads */}
            <Path
              d="M102 210 L126 210 L124 285 L106 280 Z"
              fill={getColor('quads')}
              stroke={selectedMuscleId === 'quads' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('quads')}
            />
            <Path
              d="M158 210 L134 210 L136 285 L154 280 Z"
              fill={getColor('quads')}
              stroke={selectedMuscleId === 'quads' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('quads')}
            />

            {/* Calves (Front View) */}
            <Path
              d="M106 300 L122 300 L120 355 L110 355 Z"
              fill={getColor('calves')}
              stroke={selectedMuscleId === 'calves' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('calves')}
            />
            <Path
              d="M154 300 L138 300 L140 355 L150 355 Z"
              fill={getColor('calves')}
              stroke={selectedMuscleId === 'calves' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('calves')}
            />
          </G>
        ) : (
          /* BACK PHYSIQUE HEATMAP */
          <G id="back_muscles">
            {/* Trapezius (Upper Back) */}
            <Path
              d="M115 56 L145 56 L158 85 L130 108 L102 85 Z"
              fill={getColor('traps')}
              stroke={selectedMuscleId === 'traps' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('traps')}
            />

            {/* Rear Shoulders (Posterior Deltoid) */}
            <Path
              d="M82 72 Q95 72 100 85 L84 100 Q78 88 82 72 Z"
              fill={getColor('posterior_delt')}
              stroke={selectedMuscleId === 'posterior_delt' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('posterior_delt')}
            />
            <Path
              d="M178 72 Q165 72 160 85 L176 100 Q182 88 178 72 Z"
              fill={getColor('posterior_delt')}
              stroke={selectedMuscleId === 'posterior_delt' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('posterior_delt')}
            />

            {/* Lats (Latissimus Dorsi) */}
            <Path
              d="M102 90 L130 110 L158 90 L168 145 L130 155 L92 145 Z"
              fill={getColor('lats')}
              stroke={selectedMuscleId === 'lats' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('lats')}
            />

            {/* Lower Back (Erector Spinae) */}
            <Path
              d="M112 155 L148 155 L145 185 L115 185 Z"
              fill={getColor('lower_back')}
              stroke={selectedMuscleId === 'lower_back' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('lower_back')}
            />

            {/* Triceps - Long Head */}
            <Path
              d="M74 104 L84 102 L86 138 L76 138 Z"
              fill={getColor('triceps_long')}
              stroke={selectedMuscleId === 'triceps_long' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('triceps_long')}
            />
            <Path
              d="M186 104 L176 102 L174 138 L184 138 Z"
              fill={getColor('triceps_long')}
              stroke={selectedMuscleId === 'triceps_long' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('triceps_long')}
            />

            {/* Triceps - Lateral Head */}
            <Path
              d="M68 106 L74 104 L76 135 L70 135 Z"
              fill={getColor('triceps_lateral')}
              stroke={selectedMuscleId === 'triceps_lateral' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('triceps_lateral')}
            />
            <Path
              d="M192 106 L186 104 L184 135 L190 135 Z"
              fill={getColor('triceps_lateral')}
              stroke={selectedMuscleId === 'triceps_lateral' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1}
              onPress={() => handlePress('triceps_lateral')}
            />

            {/* Glutes */}
            <Path
              d="M100 188 L130 188 L128 230 L98 225 Z"
              fill={getColor('glutes')}
              stroke={selectedMuscleId === 'glutes' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('glutes')}
            />
            <Path
              d="M160 188 L130 188 L132 230 L162 225 Z"
              fill={getColor('glutes')}
              stroke={selectedMuscleId === 'glutes' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('glutes')}
            />

            {/* Hamstrings */}
            <Path
              d="M98 230 L126 230 L124 285 L102 282 Z"
              fill={getColor('hamstrings')}
              stroke={selectedMuscleId === 'hamstrings' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('hamstrings')}
            />
            <Path
              d="M162 230 L134 230 L136 285 L158 282 Z"
              fill={getColor('hamstrings')}
              stroke={selectedMuscleId === 'hamstrings' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('hamstrings')}
            />

            {/* Calves (Back View) */}
            <Path
              d="M102 295 L124 295 L120 355 L108 355 Z"
              fill={getColor('calves')}
              stroke={selectedMuscleId === 'calves' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('calves')}
            />
            <Path
              d="M158 295 L136 295 L140 355 L152 355 Z"
              fill={getColor('calves')}
              stroke={selectedMuscleId === 'calves' ? '#FFFFFF' : '#0F172A'}
              strokeWidth={1.5}
              onPress={() => handlePress('calves')}
            />
          </G>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
