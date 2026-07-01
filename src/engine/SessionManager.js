/**
 * SessionManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight state persister using localStorage.
 * Allows users to refresh the page without losing their place in the cinematic experience.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { EVENTS } from '@constants/events';
import sceneManager from './SceneManager';

const STORAGE_KEY = 'disney_birthday_session';

class SessionManager {
  constructor() {
    this._state = this._loadState();
    this._bindEvents();
  }

  _loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('[SessionManager] Failed to read from localStorage:', e);
    }
    
    // Default state
    return {
      currentScene: 'loading',
      authComplete: false,
      visitedScenes: [],
      photoIndex: 0,
      gameScores: {},
      feedbackSubmitted: false,
      certificateGenerated: false,
    };
  }

  _saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._state));
    } catch (e) {
      console.warn('[SessionManager] Failed to write to localStorage:', e);
    }
  }

  _bindEvents() {
    // Listen to SceneManager to save current scene
    sceneManager.on(EVENTS.SCENE_ENTER_COMPLETE, ({ scene }) => {
      // Don't save loading scene as a resumption point
      if (scene !== 'loading') {
        this._state.currentScene = scene;
        if (!this._state.visitedScenes.includes(scene)) {
          this._state.visitedScenes.push(scene);
        }
        this._saveState();
      }
    });
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  get state() {
    return { ...this._state };
  }

  markAuthComplete() {
    this._state.authComplete = true;
    this._saveState();
  }

  setPhotoIndex(index) {
    this._state.photoIndex = index;
    this._saveState();
  }

  setGameScore(gameId, score) {
    this._state.gameScores[gameId] = score;
    this._saveState();
  }

  markFeedbackSubmitted() {
    this._state.feedbackSubmitted = true;
    this._saveState();
  }

  markCertificateGenerated() {
    this._state.certificateGenerated = true;
    this._saveState();
  }

  clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    this._state = this._loadState();
  }
}

const sessionManager = new SessionManager();
export default sessionManager;
