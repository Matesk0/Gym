import { Platform } from 'react-native';

export const Colors = {
  dark: {
    // Base Colors from design-system.md
    background: '#0F172A',         // Slate 900 - Deep rich background
    card: '#1E293B',               // Slate 800 - Glass card surface
    cardGlass: 'rgba(30, 41, 59, 0.7)', // Slate 800 with opacity for glassmorphism
    cardSecondary: '#334155',      // Slate 700 - Inputs, inner chips & sub-cards
    cardBorder: 'rgba(255, 255, 255, 0.08)', // Subtle white border edge
    cardBorderSolid: '#334155',    // Solid border fallback
    textPrimary: '#F8FAFC',        // Slate 50 - Heading & primary text
    textSecondary: '#94A3B8',      // Slate 400 - Subtitle & description text

    // Brand & Accent Colors from design-system.md
    primaryAccent: '#6366F1',      // Indigo 500 - Primary buttons, active states, links
    secondaryAccent: '#EC4899',    // Pink 500 - Highlights, badges, gradient secondary
    gradientStart: '#6366F1',      // Indigo 500
    gradientEnd: '#EC4899',        // Pink 500

    // Utility Accents
    accentCyan: '#38BDF8',         // Sky 400
    accentPurple: '#A855F7',       // Purple 500
    accentLime: '#10B981',         // Emerald 500
    accentGold: '#FBBF24',         // Amber 400
    accentRed: '#F87171',          // Red 400

    // Tab Bar Styling
    tabBarBg: '#0F172A',
    tabBarBorder: '#1E293B',
    tabBarInactive: '#94A3B8',
    tabBarActive: '#6366F1',       // Primary Indigo accent
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

