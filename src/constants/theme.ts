import { Platform } from 'react-native';

export const Colors = {
  dark: {
    background: '#1D1B1B',       // Warm dark matte charcoal (matching screenshots)
    card: '#292726',             // Warm dark card container
    cardSecondary: '#33302F',    // Inputs, inner chips & sub-cards
    cardBorder: '#3D3A38',       // Subtle warm border
    textPrimary: '#FFFFFF',      // Clean primary white text
    textSecondary: '#9E9A97',    // Soft warm grey secondary text
    accentCyan: '#38BDF8',       // Sleek progress bar line & cyan highlight
    accentPurple: '#C084FC',     // Workouts stats purple
    accentLime: '#A3E635',       // Rewards stats lime green
    accentGold: '#FBBF24',       // Rating star amber gold
    accentRed: '#F87171',        // Fatigue red
    tabBarBg: '#1D1B1B',
    tabBarInactive: '#8C8885',
    tabBarActive: '#FFFFFF',     // Clean white active tab icon matching screenshots
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
