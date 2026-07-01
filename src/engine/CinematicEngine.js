/**
 * CinematicEngine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * High-level orchestration engine for cinematic sequences.
 * Wraps GSAP, CameraManager, SoundManager, LightingManager, and ParticleManager
 * into a single unified API for future scenes to easily author complex sequences.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import gsap from 'gsap';
import { EVENTS } from '@constants/events';
import sceneManager from './SceneManager';
import cameraManager from './CameraManager';
import lightingManager from './LightingManager';

class CinematicEngine {
  constructor() {
    this._timelines = new Map();
    this._listeners = new Map();
  }

  // ─── Timeline Management ──────────────────────────────────────────────────

  /**
   * Create a named master timeline for a cinematic sequence.
   * @param {string} name 
   * @param {object} vars - GSAP timeline variables
   */
  createSequence(name, vars = {}) {
    const tl = gsap.timeline({
      ...vars,
      onStart: () => this._emit(EVENTS.SCENE_STARTED, { sequence: name }),
      onComplete: () => {
        this._emit(EVENTS.SCENE_FINISHED, { sequence: name });
        if (vars.onComplete) vars.onComplete();
      }
    });
    this._timelines.set(name, tl);
    return tl;
  }

  getSequence(name) {
    return this._timelines.get(name);
  }

  pauseSequence(name) {
    this._timelines.get(name)?.pause();
  }

  resumeSequence(name) {
    this._timelines.get(name)?.resume();
  }

  disposeSequence(name) {
    const tl = this._timelines.get(name);
    if (tl) {
      tl.kill();
      this._timelines.delete(name);
    }
  }

  // ─── Cinematic Primitives ─────────────────────────────────────────────────

  /**
   * Helper to fade an element in/out and return the GSAP tween.
   */
  fade(target, opacity, duration = 1, delay = 0) {
    return gsap.to(target, { opacity, duration, delay, ease: 'power2.inOut' });
  }

  /**
   * Crossfade two elements.
   */
  crossfade(fadeOutTarget, fadeInTarget, duration = 1.5) {
    const tl = gsap.timeline();
    tl.to(fadeOutTarget, { opacity: 0, duration, ease: 'power2.inOut' }, 0);
    tl.to(fadeInTarget, { opacity: 1, duration, ease: 'power2.inOut' }, 0);
    return tl;
  }

  /**
   * Move camera over time.
   */
  moveCamera(targetPreset, duration = 2) {
    // Bridges to the existing CameraManager, but wraps in GSAP syntax if needed.
    // Assuming CameraManager handles CSS vars or specific transforms:
    return cameraManager.animateToPreset(targetPreset, duration);
  }

  /**
   * Trigger a bloom flash (simulated via LightingManager or CSS overlay).
   */
  bloomTransition(overlayTarget, duration = 2) {
    const tl = gsap.timeline();
    tl.to(overlayTarget, { opacity: 1, duration: duration / 2, ease: 'power2.in' });
    tl.to(overlayTarget, { opacity: 0, duration: duration / 2, ease: 'power2.out' });
    return tl;
  }

  // ─── Event Bus ────────────────────────────────────────────────────────────

  on(event, handler) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(handler);
  }

  off(event, handler) {
    this._listeners.get(event)?.delete(handler);
  }

  _emit(event, data = {}) {
    this._listeners.get(event)?.forEach(fn => fn(data));
  }
}

const cinematicEngine = new CinematicEngine();
export default cinematicEngine;
