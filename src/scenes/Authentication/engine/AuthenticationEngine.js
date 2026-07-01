import { AUTH_CONFIG } from '@config/authentication';
import sceneManager from '@engine/SceneManager';
import { EVENTS } from '@constants/events';

export const AUTH_STATE = {
  IDLE: 'idle',
  DIALOGUE: 'dialogue',
  INPUT: 'input',
  VALIDATING: 'validating',
  SUCCESS: 'success',
  ERROR: 'error',
  LOCKED: 'locked',
};

class AuthenticationEngine {
  constructor() {
    this._listeners = new Set();
    this.config = AUTH_CONFIG.questions[AUTH_CONFIG.activeQuestion];
    
    this._state = {
      status: AUTH_STATE.IDLE,
      attempts: 0,
      lockedUntil: null,
    };
  }

  // --- State Management ---

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify() {
    this._listeners.forEach(fn => fn({ ...this._state, config: this.config }));
  }

  getState() {
    return { ...this._state, config: this.config };
  }

  setStatus(status) {
    this._state.status = status;
    this._notify();
  }

  // --- Validation Logic ---

  _normalizeString(input) {
    let str = input;
    const rules = this.config.validationRules;

    if (!rules.caseSensitive) {
      str = str.toLowerCase();
    }

    if (rules.ignoreExtraSpaces) {
      str = str.trim().replace(/\s+/g, ' ');
    }

    if (rules.normalizeAnd) {
      str = str.replace(/&/g, 'and');
    }

    return str;
  }

  validate(answer) {
    if (this._state.status === AUTH_STATE.LOCKED) return;

    this.setStatus(AUTH_STATE.VALIDATING);

    // Simulate slight magic delay for cinematic effect
    setTimeout(() => {
      const isCorrect = this._checkAnswer(answer);
      
      if (isCorrect) {
        this.setStatus(AUTH_STATE.SUCCESS);
      } else {
        this._state.attempts++;
        if (this._state.attempts >= this.config.security.maximumAttempts) {
          this._state.lockedUntil = Date.now() + this.config.security.lockDelayMs;
          this.setStatus(AUTH_STATE.LOCKED);
          
          setTimeout(() => {
            this._state.attempts = 0;
            this._state.lockedUntil = null;
            this.setStatus(AUTH_STATE.INPUT);
          }, this.config.security.lockDelayMs);
        } else {
          this.setStatus(AUTH_STATE.ERROR);
          // Return to input after error animation
          setTimeout(() => {
            if (this._state.status === AUTH_STATE.ERROR) {
              this.setStatus(AUTH_STATE.INPUT);
            }
          }, 1500);
        }
      }
    }, 1500); // Magic checking delay
  }

  _checkAnswer(answer) {
    const normalizedInput = this._normalizeString(answer);
    const rules = this.config.validationRules;
    
    // Normalize accepted answers
    const accepted = this.config.acceptedAnswers.map(a => this._normalizeString(a));

    if (rules.allowPartialMatch) {
      // Input must contain one of the accepted, or accepted must contain input
      // Actually, standard partial match: if input matches part of accepted, or accepted matches part of input.
      // E.g., accepted = "tom and jerry". Input = "tom". "tom and jerry".includes("tom") -> true.
      return accepted.some(a => a.includes(normalizedInput) || normalizedInput.includes(a));
    }

    return accepted.includes(normalizedInput);
  }

  // --- Actions ---

  completeScene() {
    sessionStorage.setItem('birthday_authenticated', 'true');
    sceneManager.complete({
      nextRoute: '/welcome',
      message: '✨ Welcome, Princess.\nYour magical birthday journey is ready.\n\nShall we begin?',
      buttonText: 'Shall we begin?',
      transitionDelay: 2000,
    });
  }
}

export const authenticationEngine = new AuthenticationEngine();
