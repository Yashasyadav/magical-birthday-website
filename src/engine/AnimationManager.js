/**
 * AnimationManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Master GSAP timeline controller.
 * Manages named timelines so scenes can register, pause, resume, and
 * destroy animations without conflicts.
 *
 * Design:
 *   - Each scene registers its own named timeline group
 *   - AnimationManager pauses all timelines during transitions
 *   - Destroyed timelines are removed from the registry (no memory leaks)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins once at the engine level
gsap.registerPlugin(ScrollTrigger);

class AnimationManager {
  constructor() {
    /** @type {Map<string, gsap.core.Timeline[]>} */
    this._timelines = new Map();
    this._paused    = false;
  }

  // ─── Timeline Registry ────────────────────────────────────────────────────

  /**
   * Create and register a named GSAP timeline.
   * @param {string} id - Unique identifier (e.g., 'castle-entrance')
   * @param {gsap.TimelineVars} [vars] - GSAP timeline options
   * @returns {gsap.core.Timeline}
   */
  createTimeline(id, vars = {}) {
    const tl = gsap.timeline({ paused: this._paused, ...vars });

    if (!this._timelines.has(id)) {
      this._timelines.set(id, []);
    }
    this._timelines.get(id).push(tl);

    return tl;
  }

  /**
   * Kill all timelines registered under an id.
   * Call this in a scene's cleanup / useEffect return.
   * @param {string} id
   */
  killTimelines(id) {
    const group = this._timelines.get(id);
    if (group) {
      group.forEach(tl => tl.kill());
      this._timelines.delete(id);
    }
  }

  /**
   * Kill every registered timeline.
   * Called by SceneManager during scene transitions.
   */
  killAll() {
    this._timelines.forEach(group => group.forEach(tl => tl.kill()));
    this._timelines.clear();
  }

  // ─── Global Controls ──────────────────────────────────────────────────────

  /** Pause all active timelines (e.g., when app loses focus) */
  pauseAll() {
    this._paused = true;
    this._timelines.forEach(group => group.forEach(tl => tl.pause()));
  }

  /** Resume all paused timelines */
  resumeAll() {
    this._paused = false;
    this._timelines.forEach(group => group.forEach(tl => tl.resume()));
  }

  // ─── GSAP Context Helpers ─────────────────────────────────────────────────

  /**
   * Create a scoped GSAP context for a React component.
   * Always use this inside useLayoutEffect for proper cleanup.
   * @param {Function} fn - GSAP animation function
   * @param {React.RefObject} scope - Component root ref
   * @returns {gsap.Context}
   */
  createContext(fn, scope) {
    return gsap.context(fn, scope);
  }

  /** Direct access to the gsap instance for advanced use */
  get gsap() { return gsap; }

  /** Direct access to ScrollTrigger */
  get ScrollTrigger() { return ScrollTrigger; }
}

const animationManager = new AnimationManager();
export default animationManager;
