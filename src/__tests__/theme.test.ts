import { describe, test, expect, jest } from '@jest/globals';

jest.mock('react-native', () => ({
  Platform: {
    select: (objs: any) => objs.ios ?? objs.default,
    OS: 'ios',
  },
}));

import { Colors, BorderRadius, Layout } from '../constants/theme';

describe('Design System Theme Tokens', () => {
  test('should match design-system.md color specifications', () => {
    expect(Colors.dark.background).toBe('#0F172A');
    expect(Colors.dark.card).toBe('#1E293B');
    expect(Colors.dark.cardGlass).toBe('rgba(30, 41, 59, 0.7)');
    expect(Colors.dark.textPrimary).toBe('#F8FAFC');
    expect(Colors.dark.textSecondary).toBe('#94A3B8');
    expect(Colors.dark.primaryAccent).toBe('#6366F1');
    expect(Colors.dark.secondaryAccent).toBe('#EC4899');
  });

  test('should define border radius scale according to design-system.md', () => {
    expect(BorderRadius.small).toBe(6);
    expect(BorderRadius.medium).toBe(12);
    expect(BorderRadius.large).toBe(24);
  });

  test('should define container max width as 1200px', () => {
    expect(Layout.containerMaxWidth).toBe(1200);
  });
});
