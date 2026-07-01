/**
 * particleUtils.js
 * Helpers for building and customizing tsparticles configs at runtime.
 */

import { FAIRY_DUST_CONFIG, NIGHT_STARS_CONFIG, CONFETTI_CONFIG, FIREFLIES_CONFIG } from '@config/particles';

/** Available particle preset names */
export const PARTICLE_PRESETS = {
  FAIRY_DUST:   'fairy-dust',
  NIGHT_STARS:  'night-stars',
  CONFETTI:     'confetti',
  FIREFLIES:    'fireflies',
};

/**
 * Retrieve a particle config by preset name.
 * @param {string} preset - PARTICLE_PRESETS constant
 * @returns {object} tsparticles options
 */
export function getParticleConfig(preset) {
  const configs = {
    [PARTICLE_PRESETS.FAIRY_DUST]:  FAIRY_DUST_CONFIG,
    [PARTICLE_PRESETS.NIGHT_STARS]: NIGHT_STARS_CONFIG,
    [PARTICLE_PRESETS.CONFETTI]:    CONFETTI_CONFIG,
    [PARTICLE_PRESETS.FIREFLIES]:   FIREFLIES_CONFIG,
  };
  return configs[preset] ?? FAIRY_DUST_CONFIG;
}

/**
 * Merge custom overrides into a preset config.
 * @param {string} preset
 * @param {object} overrides - Deep partial tsparticles options
 * @returns {object}
 */
export function customizeParticleConfig(preset, overrides = {}) {
  const base = getParticleConfig(preset);
  return deepMerge(base, overrides);
}

/** Simple deep merge — does not handle arrays (tsparticles arrays replace) */
function deepMerge(target, source) {
  const result = { ...target };
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] ?? {}, source[key]);
    } else {
      result[key] = source[key];
    }
  });
  return result;
}
