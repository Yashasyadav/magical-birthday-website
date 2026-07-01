import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';
import { EVENTS } from '@constants/events';
import cinematicEngine from '@engine/CinematicEngine';

export const REVEAL_STATE = {
  IDLE: 'idle',
  NIGHT_SKY: 'night_sky',
  WELCOME_TITLE: 'welcome_title',
  CASTLE_REVEAL: 'castle_reveal',
  PATHWAY_LIGHTS: 'pathway_lights',
  COMPLETE: 'complete',
};

class WorldRevealEngine {
  constructor() {
    this._listeners = new Set();
    this._state = {
      status: REVEAL_STATE.IDLE,
    };
  }

  // --- State Management ---

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify() {
    this._listeners.forEach(fn => fn(this.getState()));
  }

  getState() {
    return { ...this._state };
  }

  setStatus(status) {
    this._state.status = status;
    this._notify();
    
    // Broadcast high-level milestones via Event Bus
    if (status === REVEAL_STATE.COMPLETE) {
      cinematicEngine._emit(EVENTS.WORLD_REVEAL);
    }
  }

  // --- Actions ---

  /**
   * Called when the final pathway light illuminates and the camera zoom finishes.
   * This commands the scene manager to skip the placeholder NightSky and Castle
   * scenes and jump directly to Princess Entrance.
   */
  completeScene() {
    this.setStatus(REVEAL_STATE.COMPLETE);
    // Since WorldReveal merges Welcome, NightSky, and Castle into one massive cinematic,
    // we bypass the original routing and head straight to Princess.
    sceneManager.navigateTo(SCENES.PRINCESS);
  }
}

export const worldRevealEngine = new WorldRevealEngine();
