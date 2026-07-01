/**
 * LightingManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Three.js lighting preset orchestration.
 * Each scene has a named lighting rig. LightingManager animates between
 * presets using GSAP tweens applied to light objects registered by
 * the React Three Fiber LightingManager.jsx component.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import gsap from 'gsap';
import { threeColors, lightIntensity } from '@config/theme';

/**
 * Lighting rig presets.
 * Each preset defines ambient, directional, and optional point light configs.
 */
export const LIGHTING_PRESETS = {
  // Deep cinematic darkness — loading screen
  DARK: {
    ambient:     { color: threeColors.nightSky, intensity: 0.1 },
    directional: { color: threeColors.moonlight, intensity: 0.2, position: { x: 5, y: 10, z: 5 } },
    fog:         { color: threeColors.nightSky, near: 10, far: 40 },
  },
  // Moonlit night sky
  NIGHT_SKY: {
    ambient:     { color: threeColors.nightSky, intensity: lightIntensity.ambient },
    directional: { color: threeColors.moonlight, intensity: lightIntensity.moonlight, position: { x: -5, y: 15, z: 8 } },
    fog:         { color: 0x0a0820, near: 20, far: 60 },
  },
  // Castle — dramatic side lighting
  CASTLE: {
    ambient:     { color: 0x1a0f40, intensity: 0.4 },
    directional: { color: threeColors.moonlight, intensity: 1.0, position: { x: -8, y: 12, z: 5 } },
    point: [
      { color: threeColors.gold, intensity: 0.8, position: { x: -2, y: 3, z: 2 }, distance: 15 },
      { color: threeColors.royal, intensity: 0.5, position: { x: 3, y: 2, z: -2 }, distance: 10 },
    ],
    fog: { color: 0x0d0a20, near: 15, far: 50 },
  },
  // Princess entrance — warm golden glow
  PRINCESS: {
    ambient:     { color: 0xfff0d0, intensity: 0.6 },
    directional: { color: threeColors.gold, intensity: lightIntensity.golden, position: { x: 0, y: 8, z: 5 } },
    point: [
      { color: threeColors.gold, intensity: 2.0, position: { x: 0, y: 4, z: 3 }, distance: 12 },
      { color: threeColors.rose, intensity: 0.8, position: { x: -3, y: 2, z: 2 }, distance: 8 },
    ],
    fog: { color: 0x1a0f30, near: 12, far: 40 },
  },
  // Cake scene — warm intimate candlelight
  CAKE: {
    ambient:     { color: 0xfff8e7, intensity: 0.3 },
    directional: { color: 0xffeaa0, intensity: 0.5, position: { x: 2, y: 6, z: 4 } },
    point: [
      { color: 0xff9900, intensity: lightIntensity.candle, position: { x: 0, y: 1.5, z: 0 }, distance: 6 },
      { color: 0xff6600, intensity: 0.4, position: { x: 0.5, y: 1.5, z: 0.3 }, distance: 4 },
    ],
    fog: { color: 0x120a00, near: 8, far: 25 },
  },
  // Grand finale — fireworks, full brightness, colorful
  FINALE: {
    ambient:     { color: threeColors.white, intensity: 0.8 },
    directional: { color: threeColors.white, intensity: 1.5, position: { x: 0, y: 20, z: 10 } },
    point: [
      { color: threeColors.gold,  intensity: lightIntensity.firework, position: { x:  5, y: 8, z: 3 }, distance: 20 },
      { color: threeColors.royal, intensity: lightIntensity.firework, position: { x: -5, y: 8, z: 3 }, distance: 20 },
      { color: threeColors.rose,  intensity: lightIntensity.firework, position: { x:  0, y: 12, z: 0 }, distance: 25 },
    ],
    fog: null,
  },
};

class LightingManager {
  constructor() {
    this._currentPreset = 'DARK';
    /** @type {Map<string, THREE.Light>} Registered light refs from R3F */
    this._lights        = new Map();
  }

  // ─── Light Registration ───────────────────────────────────────────────────

  /**
   * Register a Three.js light object with a named slot.
   * Called inside LightingManager.jsx.
   * @param {string} name       - e.g., 'ambient', 'directional', 'point_0'
   * @param {THREE.Light} light
   */
  registerLight(name, light) {
    this._lights.set(name, light);
  }

  unregisterLight(name) {
    this._lights.delete(name);
  }

  // ─── Preset Transitions ───────────────────────────────────────────────────

  /**
   * Animate lighting rig to a named preset.
   * @param {string} presetName - Key of LIGHTING_PRESETS
   * @param {number} [duration=2] - Transition duration in seconds
   */
  transitionTo(presetName, duration = 2) {
    const preset = LIGHTING_PRESETS[presetName];
    if (!preset) {
      console.error(`[LightingManager] Unknown preset: "${presetName}"`);
      return;
    }

    this._currentPreset = presetName;

    // Animate ambient light
    const ambient = this._lights.get('ambient');
    if (ambient && preset.ambient) {
      gsap.to(ambient, { intensity: preset.ambient.intensity, duration });
      ambient.color.set(preset.ambient.color);
    }

    // Animate directional light
    const dir = this._lights.get('directional');
    if (dir && preset.directional) {
      gsap.to(dir, { intensity: preset.directional.intensity, duration });
      dir.color.set(preset.directional.color);
      if (preset.directional.position) {
        gsap.to(dir.position, { ...preset.directional.position, duration });
      }
    }

    // Animate point lights
    if (preset.point) {
      preset.point.forEach((cfg, i) => {
        const pt = this._lights.get(`point_${i}`);
        if (pt) {
          gsap.to(pt, { intensity: cfg.intensity, distance: cfg.distance, duration });
          pt.color.set(cfg.color);
          if (cfg.position) gsap.to(pt.position, { ...cfg.position, duration });
        }
      });
    }
  }

  /** Flash a point light for firework / candle pop effects */
  flash(lightName, peakIntensity = 5, duration = 0.3) {
    const light = this._lights.get(lightName);
    if (!light) return;
    const origin = light.intensity;
    gsap.to(light, {
      intensity: peakIntensity,
      duration:  duration * 0.3,
      yoyo:      true,
      repeat:    1,
      onComplete: () => gsap.set(light, { intensity: origin }),
    });
  }

  get currentPreset() { return this._currentPreset; }
}

const lightingManager = new LightingManager();
export default lightingManager;
