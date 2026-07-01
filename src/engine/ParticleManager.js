/**
 * ParticleManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Centralized manager for procedural particle configurations and pooling.
 * Supports: Stars, Fairy Dust, Magic Glow, Fireflies, Fog, Petals, Fireworks, Golden Sparks.
 * React components (like CinematicParticles) will query this manager for configs.
 * ─────────────────────────────────────────────────────────────────────────────
 */

class ParticleManager {
  constructor() {
    // Defines standard particle behaviors
    this._presets = {
      'stars': { shape: 'circle', colors: ['#ffffff', '#fde68a'], driftY: 0, driftX: 0, twinkle: true },
      'fairy-dust': { shape: 'circle', colors: ['#fffbeb', '#fde68a'], driftY: 20, driftX: 10, glow: true },
      'magic-glow': { shape: 'blur', colors: ['#fbbf24', '#f59e0b'], glow: true },
      'fireflies': { shape: 'circle', colors: ['#a78bfa', '#fde68a'], driftY: -10, randomWander: true, twinkle: true },
      'petals': { shape: 'oval', colors: ['#fda4af', '#ffc2d4'], driftY: 50, driftX: 30, spin: true },
      'golden-sparks': { shape: 'star', colors: ['#fbbf24', '#ffffff'], gravity: true },
      'fireworks': { shape: 'circle', gravity: true, trail: true },
      'fog': { shape: 'cloud', opacity: 0.1, driftX: 5, driftY: 0, scale: 10 },
    };
    
    // In advanced setups, this could hold an Object Pool for canvas rendering.
    this._activeEmitters = new Map();
  }

  /**
   * Get the configuration for a specific particle type.
   */
  getPreset(type) {
    if (!this._presets[type]) {
      console.warn(`[ParticleManager] Unknown preset: ${type}`);
      return this._presets['fairy-dust'];
    }
    return this._presets[type];
  }

  /**
   * Register a live emitter (e.g., from a React component) to be managed/paused.
   */
  registerEmitter(id, controller) {
    this._activeEmitters.set(id, controller);
  }

  unregisterEmitter(id) {
    this._activeEmitters.delete(id);
  }

  pauseAll() {
    this._activeEmitters.forEach(emitter => emitter.pause && emitter.pause());
  }

  resumeAll() {
    this._activeEmitters.forEach(emitter => emitter.resume && emitter.resume());
  }
}

const particleManager = new ParticleManager();
export default particleManager;
