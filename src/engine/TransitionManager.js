/**
 * TransitionManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Orchestrates all scene transition animations.
 * Reads the transition type from SceneManager events and delegates to
 * the correct animation strategy.
 *
 * Each transition has two phases:
 *   1. OUT — covers the screen (hides old scene)
 *   2. IN  — reveals the screen (shows new scene)
 *
 * TransitionManager does NOT render anything — it drives the
 * SceneTransition.jsx component via the transition context.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { TRANSITIONS, TRANSITION_DURATION } from '@constants/transitions';
import { EVENTS }                           from '@constants/events';
import sceneManager                         from './SceneManager';

class TransitionManager {
  constructor() {
    this._activeTransition = null;
    this._listeners        = new Map();
    this._overlayRef       = null; // Set by SceneTransition.jsx on mount

    // Wire into SceneManager's event bus
    sceneManager.on(EVENTS.SCENE_CHANGE, this._onSceneChange.bind(this));
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Register the DOM overlay ref from SceneTransition.jsx.
   * Required before any transition can execute.
   * @param {React.RefObject} ref
   */
  registerOverlay(ref) {
    this._overlayRef = ref;
  }

  /**
   * Manually trigger a transition type without a scene change.
   * Useful for in-scene dramatic effects.
   * @param {string} type - One of TRANSITIONS constants
   * @param {'out'|'in'} direction
   * @returns {Promise<void>} Resolves when animation completes
   */
  playTransition(type, direction) {
    return new Promise(resolve => {
      const duration = TRANSITION_DURATION[type] ?? TRANSITION_DURATION[TRANSITIONS.FADE];

      this._activeTransition = { type, direction };
      this._emit(EVENTS.TRANSITION_START, { type, direction });

      // Midpoint fires at 50% of duration
      setTimeout(() => {
        this._emit(EVENTS.TRANSITION_MIDPOINT, { type, direction });
      }, duration * 0.5);

      // Completion
      setTimeout(() => {
        this._activeTransition = null;
        this._emit(EVENTS.TRANSITION_COMPLETE, { type, direction });
        resolve();
      }, duration);
    });
  }

  get activeTransition() { return this._activeTransition; }

  // ─── Internal ─────────────────────────────────────────────────────────────

  async _onSceneChange({ from, to, transition }) {
    if (transition === TRANSITIONS.NONE) {
      // Skip animation, notify SceneManager immediately
      sceneManager.onPreloadComplete();
      sceneManager.onExitComplete();
      sceneManager.onEnterComplete();
      return;
    }

    // Phase 1: Preload signal (in a real app, AssetManager resolves this)
    sceneManager.onPreloadComplete();

    // Phase 2: Transition OUT (covers screen)
    await this.playTransition(transition, 'out');
    sceneManager.onExitComplete();

    // Phase 3: Transition IN (reveals new scene)
    await this.playTransition(transition, 'in');
    sceneManager.onEnterComplete();
  }

  // ─── Event Bus ────────────────────────────────────────────────────────────

  on(event, handler) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this._listeners.get(event)?.delete(handler);
  }

  _emit(event, data = {}) {
    this._listeners.get(event)?.forEach(fn => fn(data));
  }
}

const transitionManager = new TransitionManager();
export default transitionManager;
