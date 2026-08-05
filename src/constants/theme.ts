import { Platform } from 'react-native';

export const Colors = {
  dark: {
    // Prestige iOS OLED Dark Theme from AGENTS.md
    background: '#000000',         // OLED Pure Black background
    card: '#1C1C1E',               // Secondary Charcoal Card surface
    cardGlass: 'rgba(28, 28, 30, 0.85)', // Glassmorphism surface
    cardSecondary: '#2C2C2E',      // Tertiary Slate Card & Input field
    cardBorder: 'rgba(255, 255, 255, 0.10)', // Subtle white edge
    cardBorderSolid: '#2C2C2E',    // Solid border fallback
    textPrimary: '#FFFFFF',        // Pure White heading & text
    textSecondary: '#8E8E93',      // System Gray subtitle & description

    // Prestige Brand & Accent Colors
    primaryAccent: '#38BDF8',      // Light Cyan accent
    secondaryAccent: '#0A84FF',    // Electric Blue accent
    gradientStart: '#38BDF8',      // Light Cyan
    gradientEnd: '#0A84FF',        // Electric Blue

    // Utility Accents
    accentLime: '#30D158',         // Vivid Green
    accentCyan: '#38BDF8',         // Light Cyan
    accentPurple: '#BF5AF2',       // System Purple
    accentGold: '#FF9F0C',         // Amber Gold
    accentRed: '#FF453A',          // Coral Red

    // Tab Bar Styling
    tabBarBg: '#000000',
    tabBarBorder: '#1C1C1E',
    tabBarInactive: '#8E8E93',
    tabBarActive: '#38BDF8',       // Light Cyan accent
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'Inter',
    rounded: 'Outfit',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'Inter, system-ui, sans-serif',
    rounded: 'Outfit, sans-serif',
    mono: 'monospace',
  },
});

export const Spacing = {
  half: 4,
  one: 8,
  two: 16,
  three: 24,
  four: 32,
  five: 48,
  six: 64,
} as const;

export const BorderRadius = {
  small: 6,
  medium: 12,
  large: 24,
} as const;

export const Layout = {
  containerMaxWidth: 1200,
  bottomTabInset: Platform.select({ ios: 50, android: 80 }) ?? 0,
} as const;

export const BottomTabInset = Layout.bottomTabInset;
export const MaxContentWidth = Layout.containerMaxWidth;

