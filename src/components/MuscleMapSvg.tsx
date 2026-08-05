import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { FATIGUE_STAGES } from '../constants/muscles';
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
    return data ? data.color : FATIGUE_STAGES[5].color; // Default fully recovered green (#44ce1b)
  };

  const handlePress = (id: string) => {
    if (fatigueData[id]) {
      onSelectMuscle(fatigueData[id]);
    }
  };

  const isSelected = (id: string) => selectedMuscleId === id;

  return (
    <View style={styles.container}>
      <Svg width={280} height={400} viewBox="0 0 280 400">
        <Defs>
          <LinearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#38BDF8" stopOpacity="0.3" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0" />
          </LinearGradient>
        </Defs>

        {/* Outer Shadow Physique Silhouette - MuscleWiki Style */}
        <G id="silhouetted_physique" opacity={0.35}>
          {/* Head */}
          <Circle cx="140" cy="38" r="22" fill="#1C1C1E" stroke="#3A3A3C" strokeWidth="2" />
          {/* Traps/Neck outline */}
          <Path d="M125 58 L155 58 L170 72 L110 72 Z" fill="#2C2C2E" />
          {/* Torso background frame */}
          <Path
            d="M95 74 L185 74 L200 145 L180 220 L168 370 L152 370 L146 240 L134 240 L128 370 L112 370 L100 220 L80 145 Z"
            fill="#1C1C1E"
            stroke="#2C2C2E"
            strokeWidth="2"
          />
        </G>

        {viewMode === 'front' ? (
          /* ANTERIOR (FRONT) MUSCLEWIKI MAP */
          <G id="anterior_muscles">
            {/* Upper Chest (Clavicular Head) */}
            <Path
              d="M108 78 Q140 85 172 78 L168 95 Q140 102 112 95 Z"
              fill={getColor('upper_chest')}
              stroke={isSelected('upper_chest') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('upper_chest') ? 3.5 : 1.5}
              onPress={() => handlePress('upper_chest')}
            />

            {/* Middle Chest (Sternal Head) */}
            <Path
              d="M112 97 Q140 103 168 97 L164 116 Q140 122 116 116 Z"
              fill={getColor('middle_chest')}
              stroke={isSelected('middle_chest') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('middle_chest') ? 3.5 : 1.5}
              onPress={() => handlePress('middle_chest')}
            />

            {/* Lower Chest (Costal Head) */}
            <Path
              d="M116 118 Q140 124 164 118 L160 132 Q140 136 120 132 Z"
              fill={getColor('lower_chest')}
              stroke={isSelected('lower_chest') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('lower_chest') ? 3.5 : 1.5}
              onPress={() => handlePress('lower_chest')}
            />

            {/* Front Shoulders (Anterior Deltoid) */}
            <Path
              d="M86 76 Q98 74 104 84 L98 112 Q85 102 81 88 Z"
              fill={getColor('anterior_delt')}
              stroke={isSelected('anterior_delt') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('anterior_delt') ? 3.5 : 1.5}
              onPress={() => handlePress('anterior_delt')}
            />
            <Path
              d="M194 76 Q182 74 176 84 L182 112 Q195 102 199 88 Z"
              fill={getColor('anterior_delt')}
              stroke={isSelected('anterior_delt') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('anterior_delt') ? 3.5 : 1.5}
              onPress={() => handlePress('anterior_delt')}
            />

            {/* Side Shoulders (Lateral Deltoid) */}
            <Path
              d="M78 80 Q85 76 87 88 L80 115 Q74 102 78 80 Z"
              fill={getColor('lateral_delt')}
              stroke={isSelected('lateral_delt') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('lateral_delt') ? 3.5 : 1.5}
              onPress={() => handlePress('lateral_delt')}
            />
            <Path
              d="M202 80 Q195 76 193 88 L200 115 Q206 102 202 80 Z"
              fill={getColor('lateral_delt')}
              stroke={isSelected('lateral_delt') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('lateral_delt') ? 3.5 : 1.5}
              onPress={() => handlePress('lateral_delt')}
            />

            {/* Outer Bicep (Long Head) */}
            <Path
              d="M78 118 Q86 116 88 148 L80 150 Z"
              fill={getColor('biceps_long')}
              stroke={isSelected('biceps_long') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('biceps_long') ? 3.5 : 1.5}
              onPress={() => handlePress('biceps_long')}
            />
            <Path
              d="M202 118 Q194 116 192 148 L200 150 Z"
              fill={getColor('biceps_long')}
              stroke={isSelected('biceps_long') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('biceps_long') ? 3.5 : 1.5}
              onPress={() => handlePress('biceps_long')}
            />

            {/* Inner Bicep (Short Head) */}
            <Path
              d="M90 118 Q98 118 95 146 L89 148 Z"
              fill={getColor('biceps_short')}
              stroke={isSelected('biceps_short') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('biceps_short') ? 3.5 : 1.5}
              onPress={() => handlePress('biceps_short')}
            />
            <Path
              d="M190 118 Q182 118 185 146 L191 148 Z"
              fill={getColor('biceps_short')}
              stroke={isSelected('biceps_short') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('biceps_short') ? 3.5 : 1.5}
              onPress={() => handlePress('biceps_short')}
            />

            {/* Forearms */}
            <Path
              d="M76 156 L90 156 L86 205 L78 200 Z"
              fill={getColor('forearms')}
              stroke={isSelected('forearms') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('forearms') ? 3.5 : 1.5}
              onPress={() => handlePress('forearms')}
            />
            <Path
              d="M204 156 L190 156 L194 205 L202 200 Z"
              fill={getColor('forearms')}
              stroke={isSelected('forearms') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('forearms') ? 3.5 : 1.5}
              onPress={() => handlePress('forearms')}
            />

            {/* Upper Abs */}
            <Path
              d="M122 138 L138 138 L138 158 L122 158 Z"
              fill={getColor('upper_abs')}
              stroke={isSelected('upper_abs') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('upper_abs') ? 3.5 : 1.5}
              onPress={() => handlePress('upper_abs')}
            />
            <Path
              d="M142 138 L158 138 L158 158 L142 158 Z"
              fill={getColor('upper_abs')}
              stroke={isSelected('upper_abs') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('upper_abs') ? 3.5 : 1.5}
              onPress={() => handlePress('upper_abs')}
            />

            {/* Lower Abs */}
            <Path
              d="M122 162 L138 162 L138 186 L122 186 Z"
              fill={getColor('lower_abs')}
              stroke={isSelected('lower_abs') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('lower_abs') ? 3.5 : 1.5}
              onPress={() => handlePress('lower_abs')}
            />
            <Path
              d="M142 162 L158 162 L158 186 L142 186 Z"
              fill={getColor('lower_abs')}
              stroke={isSelected('lower_abs') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('lower_abs') ? 3.5 : 1.5}
              onPress={() => handlePress('lower_abs')}
            />

            {/* Obliques */}
            <Path
              d="M104 138 L120 138 L120 186 L110 176 Z"
              fill={getColor('obliques')}
              stroke={isSelected('obliques') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('obliques') ? 3.5 : 1.5}
              onPress={() => handlePress('obliques')}
            />
            <Path
              d="M176 138 L160 138 L160 186 L170 176 Z"
              fill={getColor('obliques')}
              stroke={isSelected('obliques') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('obliques') ? 3.5 : 1.5}
              onPress={() => handlePress('obliques')}
            />

            {/* Quads */}
            <Path
              d="M110 222 L136 222 L134 300 L114 295 Z"
              fill={getColor('quads')}
              stroke={isSelected('quads') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('quads') ? 3.5 : 1.5}
              onPress={() => handlePress('quads')}
            />
            <Path
              d="M170 222 L144 222 L146 300 L166 295 Z"
              fill={getColor('quads')}
              stroke={isSelected('quads') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('quads') ? 3.5 : 1.5}
              onPress={() => handlePress('quads')}
            />

            {/* Calves (Front) */}
            <Path
              d="M114 316 L131 316 L128 375 L118 375 Z"
              fill={getColor('calves')}
              stroke={isSelected('calves') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('calves') ? 3.5 : 1.5}
              onPress={() => handlePress('calves')}
            />
            <Path
              d="M166 316 L149 316 L152 375 L162 375 Z"
              fill={getColor('calves')}
              stroke={isSelected('calves') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('calves') ? 3.5 : 1.5}
              onPress={() => handlePress('calves')}
            />
          </G>
        ) : (
          /* POSTERIOR (BACK) MUSCLEWIKI MAP */
          <G id="posterior_muscles">
            {/* Trapezius (Upper Back) */}
            <Path
              d="M124 60 L156 60 L170 90 L140 114 L110 90 Z"
              fill={getColor('traps')}
              stroke={isSelected('traps') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('traps') ? 3.5 : 1.5}
              onPress={() => handlePress('traps')}
            />

            {/* Rear Shoulders (Posterior Deltoid) */}
            <Path
              d="M86 76 Q100 76 106 90 L90 106 Q82 94 86 76 Z"
              fill={getColor('posterior_delt')}
              stroke={isSelected('posterior_delt') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('posterior_delt') ? 3.5 : 1.5}
              onPress={() => handlePress('posterior_delt')}
            />
            <Path
              d="M194 76 Q180 76 174 90 L190 106 Q198 94 194 76 Z"
              fill={getColor('posterior_delt')}
              stroke={isSelected('posterior_delt') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('posterior_delt') ? 3.5 : 1.5}
              onPress={() => handlePress('posterior_delt')}
            />

            {/* Lats (Latissimus Dorsi) */}
            <Path
              d="M110 96 L140 118 L170 96 L180 154 L140 164 L100 154 Z"
              fill={getColor('lats')}
              stroke={isSelected('lats') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('lats') ? 3.5 : 1.5}
              onPress={() => handlePress('lats')}
            />

            {/* Lower Back (Erector Spinae) */}
            <Path
              d="M120 164 L160 164 L156 195 L124 195 Z"
              fill={getColor('lower_back')}
              stroke={isSelected('lower_back') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('lower_back') ? 3.5 : 1.5}
              onPress={() => handlePress('lower_back')}
            />

            {/* Long Tricep */}
            <Path
              d="M78 112 L88 110 L90 146 L80 146 Z"
              fill={getColor('triceps_long')}
              stroke={isSelected('triceps_long') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('triceps_long') ? 3.5 : 1.5}
              onPress={() => handlePress('triceps_long')}
            />
            <Path
              d="M202 112 L192 110 L190 146 L200 146 Z"
              fill={getColor('triceps_long')}
              stroke={isSelected('triceps_long') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('triceps_long') ? 3.5 : 1.5}
              onPress={() => handlePress('triceps_long')}
            />

            {/* Outer Tricep */}
            <Path
              d="M72 114 L78 112 L80 144 L74 144 Z"
              fill={getColor('triceps_lateral')}
              stroke={isSelected('triceps_lateral') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('triceps_lateral') ? 3.5 : 1.5}
              onPress={() => handlePress('triceps_lateral')}
            />
            <Path
              d="M208 114 L202 112 L200 144 L206 144 Z"
              fill={getColor('triceps_lateral')}
              stroke={isSelected('triceps_lateral') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('triceps_lateral') ? 3.5 : 1.5}
              onPress={() => handlePress('triceps_lateral')}
            />

            {/* Glutes */}
            <Path
              d="M108 198 L140 198 L138 244 L106 238 Z"
              fill={getColor('glutes')}
              stroke={isSelected('glutes') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('glutes') ? 3.5 : 1.5}
              onPress={() => handlePress('glutes')}
            />
            <Path
              d="M172 198 L140 198 L142 244 L174 238 Z"
              fill={getColor('glutes')}
              stroke={isSelected('glutes') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('glutes') ? 3.5 : 1.5}
              onPress={() => handlePress('glutes')}
            />

            {/* Hamstrings */}
            <Path
              d="M106 244 L136 244 L134 300 L110 296 Z"
              fill={getColor('hamstrings')}
              stroke={isSelected('hamstrings') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('hamstrings') ? 3.5 : 1.5}
              onPress={() => handlePress('hamstrings')}
            />
            <Path
              d="M174 244 L144 244 L146 300 L170 296 Z"
              fill={getColor('hamstrings')}
              stroke={isSelected('hamstrings') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('hamstrings') ? 3.5 : 1.5}
              onPress={() => handlePress('hamstrings')}
            />

            {/* Calves (Back) */}
            <Path
              d="M110 310 L134 310 L128 375 L116 375 Z"
              fill={getColor('calves')}
              stroke={isSelected('calves') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('calves') ? 3.5 : 1.5}
              onPress={() => handlePress('calves')}
            />
            <Path
              d="M170 310 L146 310 L152 375 L164 375 Z"
              fill={getColor('calves')}
              stroke={isSelected('calves') ? '#FFFFFF' : '#1C1C1E'}
              strokeWidth={isSelected('calves') ? 3.5 : 1.5}
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
    paddingVertical: 12,
  },
});
