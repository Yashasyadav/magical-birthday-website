/**
 * CakeEngine.js
 * State machine for the full Cake Cutting Experience.
 * Controls: Make a Wish → Blow Candles → Cut the Cake → Success
 */
import { EVENTS } from '@constants/events';
import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';

export const CAKE_STATE = {
  IDLE:          'idle',          // Cake appears, camera zooms in
  WISH_PROMPT:   'wish_prompt',   // "Make a Wish" text + input appears
  WISH_TYPED:    'wish_typed',    // Wish validated, candles glow brighter
  BLOW_READY:    'blow_ready',    // Blow button visible
  BLOWING:       'blowing',       // Candles extinguishing
  ALL_OUT:       'all_out',       // All candles out, success glow
  CUT_READY:     'cut_ready',     // Knife appears, prompt to cut
  CUTTING:       'cutting',       // Knife dragging / cutting animation
  CUT_DONE:      'cut_done',      // Cake separated, confetti
  SUCCESS:       'success',       // Success overlay, continue button visible
};

class CakeEngine {
  constructor() {
    this._listeners = new Set();
    this._state = {
      status: CAKE_STATE.IDLE,
      wish: '',
      candlesOut: 0,
      totalCandles: 5,
      cutProgress: 0,     // 0-1
      wishValid: false,
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
  }

  // --- Wish Phase ---
  typeWish(text) {
    this._state.wish = text;
    // Validate: exactly "Make a Wish" (case-insensitive, trimmed)
    const normalized = text.trim().toLowerCase().replace(/\s+/g, ' ');
    this._state.wishValid = normalized === 'make a wish';
    this._notify();
  }

  submitWish() {
    if (!this._state.wishValid) return false;
    this.setStatus(CAKE_STATE.WISH_TYPED);
    // After a short animation delay, show blow button
    setTimeout(() => this.setStatus(CAKE_STATE.BLOW_READY), 1500);
    return true;
  }

  // --- Blow Phase ---
  startBlowing() {
    this.setStatus(CAKE_STATE.BLOWING);
  }

  blowCandle() {
    if (this._state.status !== CAKE_STATE.BLOWING) return;
    this._state.candlesOut = Math.min(this._state.candlesOut + 1, this._state.totalCandles);
    this._notify();

    if (this._state.candlesOut >= this._state.totalCandles) {
      setTimeout(() => this.setStatus(CAKE_STATE.ALL_OUT), 800);
      setTimeout(() => this.setStatus(CAKE_STATE.CUT_READY), 3000);
    }
  }

  // --- Cut Phase ---
  startCutting() {
    this.setStatus(CAKE_STATE.CUTTING);
  }

  updateCutProgress(progress) {
    this._state.cutProgress = Math.min(progress, 1);
    this._notify();
    if (progress >= 1) {
      this.setStatus(CAKE_STATE.CUT_DONE);
      setTimeout(() => this.setStatus(CAKE_STATE.SUCCESS), 1500);
    }
  }

  // --- Complete Scene ---
  completeScene() {
    sceneManager.navigateTo(SCENES.LETTER);
  }
}

export const cakeEngine = new CakeEngine();
