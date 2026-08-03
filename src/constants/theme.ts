import { Platform } from 'react-native';

export const Colors = {
  dark: {
    background: '#161618',
    card: '#242427',
    cardBorder: '#323236',
    cardHover: '#2C2C30',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    accentCyan: '#38BDF8',
    accentCyanGlow: 'rgba(56, 189, 248, 0.2)',
    accentLime: '#A3E635',
    accentPurple: '#C084FC',
    accentGold: '#FBBF24',
    accentRed: '#F87171',
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
