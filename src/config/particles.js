/**
 * particles.js
 * tsparticles preset configurations.
 * Import the relevant preset and pass to <Particles options={...} />.
 */

/** Falling fairy dust — used in magical moments */
export const FAIRY_DUST_CONFIG = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color:  { value: ['#ffe066', '#fff176', '#fbbf24', '#c4b5fd', '#ffffff'] },
    move: {
      direction: 'bottom',
      enable: true,
      outModes: { default: 'out' },
      random: true,
      speed: { min: 1, max: 3 },
      warp: true,
    },
    number: { value: 80, density: { enable: true, area: 800 } },
    opacity: { value: { min: 0.3, max: 0.8 }, animation: { enable: true, speed: 1, minimumValue: 0 } },
    shape:   { type: ['circle', 'star'] },
    size:    { value: { min: 2, max: 5 } },
    rotate:  { value: { min: 0, max: 360 }, animation: { enable: true, speed: 10 } },
    tilt:    { enable: true, value: { min: 0, max: 360 }, animation: { enable: true, speed: 10 } },
  },
  detectRetina: true,
};

/** Floating magical stars — used in night sky */
export const NIGHT_STARS_CONFIG = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color:   { value: '#ffffff' },
    move:    { enable: true, speed: 0.2, random: true, outModes: { default: 'out' } },
    number:  { value: 150, density: { enable: true, area: 800 } },
    opacity: {
      value: { min: 0.2, max: 1 },
      animation: { enable: true, speed: 0.5, minimumValue: 0.1 },
    },
    shape: { type: 'circle' },
    size:  { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

/** Confetti burst — used in celebrations */
export const CONFETTI_CONFIG = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color: { value: ['#fbbf24', '#f43f5e', '#8b5cf6', '#2dd4bf', '#ffffff', '#fb7185'] },
    move: {
      direction: 'bottom',
      enable: true,
      gravity: { enable: true, acceleration: 6 },
      outModes: { default: 'destroy', top: 'none' },
      speed: { min: 10, max: 20 },
    },
    number:  { value: 0 },
    opacity: { value: { min: 0.7, max: 1 } },
    rotate:  { value: { min: 0, max: 360 }, animation: { enable: true, speed: 30 } },
    shape:   { type: ['square', 'circle'] },
    size:    { value: { min: 5, max: 10 } },
    tilt: {
      value: { min: 0, max: 360 },
      animation: { enable: true, speed: 30 },
    },
    wobble: { enable: true, distance: 20, speed: 15 },
    zIndex: { value: { min: 0, max: 100 } },
  },
  emitters: {
    direction: 'top',
    life:      { count: 0, duration: 0.1, delay: 0.4 },
    rate:      { delay: 0.1, quantity: 150 },
    size:      { width: 100, height: 0 },
    position:  { x: 50, y: 100 },
  },
  detectRetina: true,
};

/** Fireflies — used in enchanted forest / welcome scene */
export const FIREFLIES_CONFIG = {
  fullScreen: { enable: false },
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  particles: {
    color:   { value: ['#ffe066', '#fff176', '#a5f3fc'] },
    move: {
      enable: true,
      speed: 0.8,
      random: true,
      outModes: { default: 'bounce' },
      warp: false,
    },
    number:  { value: 40, density: { enable: true, area: 600 } },
    opacity: {
      value: { min: 0.2, max: 0.8 },
      animation: { enable: true, speed: 0.8, minimumValue: 0.1, sync: false },
    },
    shape: { type: 'circle' },
    size: {
      value: { min: 3, max: 6 },
      animation: { enable: true, speed: 2, minimumValue: 1, sync: false },
    },
    shadow: {
      blur: 10,
      color: { value: '#ffe066' },
      enable: true,
    },
  },
  detectRetina: true,
};
