import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';
import { EVENTS } from '@constants/events';
import cinematicEngine from '@engine/CinematicEngine';

export const FIREWORKS_STATE = {
  IDLE: 'idle',
  FADE_IN: 'fade_in',
  SILENCE: 'silence',
  MUSIC_SWELL: 'music_swell',
  LAUNCH_FIRST: 'launch_first',
  SKY_EXPLOSION: 'sky_explosion',
  GATHER_PARTICLES: 'gather_particles',
  TEXT_HAPPY_BIRTHDAY: 'text_happy_birthday',
  TEXT_BHAVANI: 'text_bhavani',
  SHINE_TWINKLE: 'shine_twinkle',
  ADDITIONAL_BURSTS: 'additional_bursts',
  FALLING_CONFETTI: 'falling_confetti',
  HOLD: 'hold',
  COMPLETE: 'complete',
};

class FireworksEngine {
  constructor() {
    this._listeners = new Set();
    this._state = {
      status: FIREWORKS_STATE.IDLE,
    };
  }

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
    
    // Emit event bus milestone
    if (status === FIREWORKS_STATE.COMPLETE) {
      cinematicEngine._emit(EVENTS.WORLD_REVEAL);
    }
  }

  completeScene() {
    this.setStatus(FIREWORKS_STATE.COMPLETE);
    sceneManager.complete({
      nextRoute: '/princess',
      message: '✨\nThe stars have whispered their wishes.\n\nShall we discover what they prepared next?',
      transitionDelay: 4000,
    });
  }
}

export const fireworksEngine = new FireworksEngine();
export default fireworksEngine;
