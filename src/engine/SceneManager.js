/**
 * SceneManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * The central state machine controlling the entire scene lifecycle.
 * Mirrors Unity's SceneManager pattern — scenes are loaded, mounted,
 * transitioned, and unloaded through this single controller.
 *
 * State Machine:
 *   IDLE → PRELOADING → TRANSITIONING_OUT → MOUNTING → TRANSITIONING_IN → ACTIVE
 *
 * Usage (in React):
 *   SceneManager.navigateTo(SCENES.CAKE);
 *   SceneManager.nextScene();
 *   SceneManager.on('change', handler);
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { SCENES, SCENE_SEQUENCE } from '@constants/scenes';
import { SCENE_TRANSITIONS }      from '@constants/transitions';
import { EVENTS }                 from '@constants/events';

/** Possible states of the scene state machine */
export const SCENE_STATE = {
  IDLE:              'idle',
  PRELOADING:        'preloading',
  TRANSITIONING_OUT: 'transitioning-out',
  MOUNTING:          'mounting',
  TRANSITIONING_IN:  'transitioning-in',
  ACTIVE:            'active',
};

class SceneManager {
  constructor() {
    this._currentScene    = SCENES.LOADING;
    this._nextScene       = null;
    this._state           = SCENE_STATE.IDLE;
    this._history         = [SCENES.LOADING];
    this._listeners       = new Map();
    this._locked          = false; // Prevent overlapping transitions
  }

  // ─── Public Getters ──────────────────────────────────────────────────────

  get currentScene()  { return this._currentScene; }
  get nextScene()     { return this._nextScene; }
  get state()         { return this._state; }
  get history()       { return [...this._history]; }
  get isTransitioning() {
    return (
      this._state === SCENE_STATE.TRANSITIONING_OUT ||
      this._state === SCENE_STATE.TRANSITIONING_IN  ||
      this._state === SCENE_STATE.MOUNTING
    );
  }

  // ─── Navigation ──────────────────────────────────────────────────────────

  /**
   * Navigate to a specific scene by name.
   * @param {string} sceneName - One of the SCENES constants
   * @param {object} [options]
   * @param {boolean} [options.skipTransition=false]
   */
  navigateTo(sceneName, options = {}) {
    if (this._locked) {
      console.warn('[SceneManager] Navigation locked — transition in progress.');
      return;
    }
    if (!Object.values(SCENES).includes(sceneName)) {
      console.error(`[SceneManager] Unknown scene: "${sceneName}"`);
      return;
    }

    this._locked    = true;
    this._nextScene = sceneName;
    this._setState(SCENE_STATE.PRELOADING);

    const transition = options.skipTransition
      ? 'none'
      : (SCENE_TRANSITIONS[this._currentScene] ?? 'fade');

    this._emit(EVENTS.SCENE_CHANGE, {
      from:       this._currentScene,
      to:         sceneName,
      transition,
    });
  }

  /** Navigate to the next scene in SCENE_SEQUENCE */
  goNext() {
    const idx = SCENE_SEQUENCE.indexOf(this._currentScene);
    if (idx < SCENE_SEQUENCE.length - 1) {
      this.navigateTo(SCENE_SEQUENCE[idx + 1]);
    }
  }

  /** Navigate to the previous scene in SCENE_SEQUENCE */
  goPrevious() {
    const idx = SCENE_SEQUENCE.indexOf(this._currentScene);
    if (idx > 0) {
      this.navigateTo(SCENE_SEQUENCE[idx - 1]);
    }
  }

  /** Emit sceneCompleted event to notify TransitionProvider */
  complete(options = {}) {
    this._emit('sceneCompleted', options);
  }

  // ─── State Transitions (called by TransitionManager) ─────────────────────

  /** Call when asset preloading for the next scene is complete */
  onPreloadComplete() {
    this._setState(SCENE_STATE.TRANSITIONING_OUT);
    this._emit(EVENTS.SCENE_EXIT_START, { scene: this._currentScene });
  }

  /** Call when the outgoing scene's exit animation is done */
  onExitComplete() {
    this._setState(SCENE_STATE.MOUNTING);
    this._emit(EVENTS.SCENE_EXIT_COMPLETE, { scene: this._currentScene });
    this._currentScene = this._nextScene;
    this._nextScene    = null;
    this._history.push(this._currentScene);
    this._emit(EVENTS.SCENE_ENTER_START, { scene: this._currentScene });
    this._setState(SCENE_STATE.TRANSITIONING_IN);
  }

  /** Call when the incoming scene's entrance animation is done */
  onEnterComplete() {
    this._setState(SCENE_STATE.ACTIVE);
    this._locked = false;
    this._emit(EVENTS.SCENE_ENTER_COMPLETE, { scene: this._currentScene });
  }

  // ─── Event Bus ────────────────────────────────────────────────────────────

  /**
   * Subscribe to a SceneManager event.
   * @param {string} event
   * @param {Function} handler
   * @returns {Function} Unsubscribe function
   */
  on(event, handler) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    this._listeners.get(event)?.delete(handler);
  }

  _emit(event, data = {}) {
    this._listeners.get(event)?.forEach(fn => fn(data));
  }

  _setState(newState) {
    this._state = newState;
    this._emit('stateChange', { state: newState });
  }
}

// Singleton — one SceneManager for the entire app lifetime
const sceneManager = new SceneManager();
export default sceneManager;
