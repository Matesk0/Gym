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
    expect(Colors.dark.background).toBe('#000000');
    expect(Colors.dark.card).toBe('#1C1C1E');
    expect(Colors.dark.cardGlass).toBe('rgba(28, 28, 30, 0.85)');
    expect(Colors.dark.textPrimary).toBe('#FFFFFF');
    expect(Colors.dark.textSecondary).toBe('#8E8E93');
    expect(Colors.dark.primaryAccent).toBe('#30D158');
    expect(Colors.dark.secondaryAccent).toBe('#0A84FF');
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
