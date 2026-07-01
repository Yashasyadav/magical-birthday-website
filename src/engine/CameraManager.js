/**
 * CameraManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Cinematic camera orchestration for Three.js / React Three Fiber scenes.
 * Stores named camera presets and animates between them using GSAP.
 *
 * React bridge: components/three/CameraManager.jsx reads from this singleton
 * and applies positions to the R3F camera each frame.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import gsap from 'gsap';
import { EVENTS } from '@constants/events';

/** Named camera preset definitions */
export const CAMERA_PRESETS = {
  // Default wide establishing shot
  DEFAULT: {
    position: { x: 0, y: 0, z: 10 },
    target:   { x: 0, y: 0, z: 0 },
    fov:      60,
  },
  // Night sky — looking up at stars
  NIGHT_SKY: {
    position: { x: 0, y: 2, z: 8 },
    target:   { x: 0, y: 5, z: 0 },
    fov:      75,
  },
  // Castle establishing wide shot
  CASTLE_WIDE: {
    position: { x: 0, y: 3, z: 15 },
    target:   { x: 0, y: 2, z: 0 },
    fov:      55,
  },
  // Castle close up
  CASTLE_CLOSE: {
    position: { x: 0, y: 1, z: 6 },
    target:   { x: 0, y: 1, z: 0 },
    fov:      45,
  },
  // Princess entrance — low angle looking up
  PRINCESS_LOW: {
    position: { x: 0, y: -1, z: 7 },
    target:   { x: 0, y: 1, z: 0 },
    fov:      50,
  },
  // Cake close-up
  CAKE_CLOSEUP: {
    position: { x: 0, y: 1.5, z: 4 },
    target:   { x: 0, y: 0.5, z: 0 },
    fov:      40,
  },
  // Grand finale — pull back dramatically
  FINALE_PULLBACK: {
    position: { x: 0, y: 5, z: 25 },
    target:   { x: 0, y: 0, z: 0 },
    fov:      65,
  },
};

class CameraManager {
  constructor() {
    this._current  = { ...CAMERA_PRESETS.DEFAULT };
    this._target   = { ...CAMERA_PRESETS.DEFAULT };
    this._listeners = new Map();
    this._cameraRef = null; // Set by CameraManager.jsx via registerCamera()
  }

  // ─── Registration ─────────────────────────────────────────────────────────

  /**
   * Register the R3F camera object.
   * Called inside CameraManager.jsx useFrame / useEffect.
   * @param {THREE.Camera} camera
   */
  registerCamera(camera) {
    this._cameraRef = camera;
  }

  // ─── Camera Control ───────────────────────────────────────────────────────

  /**
   * Animate camera to a named preset.
   * @param {string} presetName - Key of CAMERA_PRESETS
   * @param {object} [options]
   * @param {number} [options.duration=2]   - GSAP duration in seconds
   * @param {string} [options.ease='power4.inOut']
   */
  moveTo(presetName, options = {}) {
    const preset = CAMERA_PRESETS[presetName];
    if (!preset) {
      console.error(`[CameraManager] Unknown preset: "${presetName}"`);
      return;
    }

    const { duration = 2, ease = 'power4.inOut' } = options;

    this._emit(EVENTS.CAMERA_MOVE_START, { preset: presetName });

    if (this._cameraRef) {
      gsap.to(this._cameraRef.position, {
        ...preset.position,
        duration,
        ease,
        onComplete: () => {
          this._current = { ...preset };
          this._emit(EVENTS.CAMERA_MOVE_COMPLETE, { preset: presetName });
        },
      });

      if (preset.fov !== undefined) {
        gsap.to(this._cameraRef, {
          fov: preset.fov,
          duration,
          ease,
          onUpdate: () => this._cameraRef.updateProjectionMatrix(),
        });
      }
    }
  }

  /**
   * Define a custom camera position without a named preset.
   * @param {object} position - { x, y, z }
   * @param {object} options  - Same as moveTo options
   */
  moveToPosition(position, options = {}) {
    const { duration = 1.5, ease = 'power3.inOut' } = options;
    if (this._cameraRef) {
      gsap.to(this._cameraRef.position, { ...position, duration, ease });
    }
  }

  /** Shake the camera for impact effects */
  shake(intensity = 0.3, duration = 0.5) {
    if (!this._cameraRef) return;
    const origin = { ...this._cameraRef.position };
    gsap.to(this._cameraRef.position, {
      x: `+=${intensity}`,
      y: `+=${intensity * 0.5}`,
      duration: 0.05,
      repeat: Math.floor(duration / 0.05),
      yoyo: true,
      ease: 'none',
      onComplete: () => gsap.set(this._cameraRef.position, origin),
    });
  }

  get currentPreset() { return this._current; }

  // ─── Event Bus ────────────────────────────────────────────────────────────

  on(event, handler) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) { this._listeners.get(event)?.delete(handler); }
  _emit(event, data = {}) { this._listeners.get(event)?.forEach(fn => fn(data)); }
}

const cameraManager = new CameraManager();
export default cameraManager;
