/**
 * theme.js
 * Centralized design tokens — single source of truth for JS-driven styling.
 * Mirrors tailwind.config.js so GSAP, Framer Motion, and Three.js all use
 * the same values as Tailwind classes.
 */

export const colors = {
  night: {
    950: '#04020f',
    900: '#0d0a1e',
    800: '#14102e',
    700: '#1c1640',
    600: '#251e52',
  },
  gold: {
    400:   '#fbbf24',
    500:   '#f59e0b',
    glow:  '#ffe066',
    spark: '#fff176',
  },
  royal: {
    300:  '#c4b5fd',
    400:  '#a78bfa',
    500:  '#8b5cf6',
    600:  '#7c3aed',
    900:  '#4c1d95',
    deep: '#2d1b69',
  },
  rose: {
    300:   '#fda4af',
    400:   '#fb7185',
    500:   '#f43f5e',
    blush: '#ffc2d4',
    petal: '#ffb3c6',
  },
  fairy: {
    300:  '#5eead4',
    400:  '#2dd4bf',
    500:  '#14b8a6',
    glow: '#67e8f9',
  },
  star: {
    100:  '#f8f7ff',
    200:  '#ece8ff',
    pure: '#ffffff',
    dust: '#e8e0ff',
  },
};

export const fonts = {
  display: '"Playfair Display", Georgia, serif',
  script:  '"Dancing Script", cursive',
  body:    'Outfit, system-ui, sans-serif',
};

/** Disney easing curves — use in GSAP `ease:` property */
export const easing = {
  disney:    'back.out(1.7)',        // Overshoot bounce
  cinematic: 'power4.inOut',        // Heavy deceleration
  magic:     'expo.out',            // Smooth spring-like exit
  dramatic:  'power4.in',           // Sharp acceleration in
  bounce:    'elastic.out(1, 0.5)', // Elastic bounce
  smooth:    'power2.inOut',        // Generic smooth
};

/** Duration scale in seconds (GSAP uses seconds) */
export const duration = {
  instant:   0.1,
  fast:      0.25,
  normal:    0.5,
  slow:      0.8,
  cinematic: 1.2,
  epic:      2.0,
};

/** Glow shadow presets for Three.js point lights */
export const lightIntensity = {
  ambient:    0.3,
  moonlight:  0.8,
  golden:     1.5,
  firework:   3.0,
  candle:     0.6,
};

/** Three.js color representations (hex numbers) */
export const threeColors = {
  moonlight:  0xb4d4ff,
  gold:       0xfbbf24,
  royal:      0x8b5cf6,
  rose:       0xf43f5e,
  fairy:      0x2dd4bf,
  white:      0xffffff,
  nightSky:   0x0d0a1e,
};

const theme = { colors, fonts, easing, duration, lightIntensity, threeColors };
export default theme;
