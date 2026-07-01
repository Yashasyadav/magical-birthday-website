/**
 * useTheme.js
 * Hook for accessing design tokens in JS-driven components (GSAP, Three.js).
 */

import theme, { colors, fonts, easing, duration, threeColors } from '@config/theme';

/** Returns the full theme object and common token groups */
export function useTheme() {
  return { theme, colors, fonts, easing, duration, threeColors };
}
