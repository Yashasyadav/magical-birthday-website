/**
 * SoundManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Howler.js audio orchestration layer.
 * Manages all background music and sound effects with automatic
 * crossfading between scene tracks.
 *
 * Two audio layers:
 *   - Music: One track playing at a time, crossfaded between scenes
 *   - SFX:   Short clips, multiple can play simultaneously
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Howl, Howler } from 'howler';
import { ASSET_MANIFEST }    from '@config/assets';
import { CROSSFADE_DURATION, VOLUME } from '@constants/audio';
import { EVENTS }            from '@constants/events';

class SoundManager {
  constructor() {
    /** @type {Map<string, Howl>} Loaded music Howl instances */
    this._music = new Map();
    /** @type {Map<string, Howl>} Loaded SFX Howl instances */
    this._sfx   = new Map();

    this._currentTrack   = null; // Key of currently playing music
    this._musicVolume    = VOLUME.MUSIC_DEFAULT;
    this._sfxVolume      = VOLUME.SFX_DEFAULT;
    this._muted          = false;
    this._initialized    = false;
    this._listeners      = new Map();
  }

  // ─── Initialization ───────────────────────────────────────────────────────

  /**
   * Initialize Howler global settings.
   * Must be called from a user gesture (click/tap) for autoplay policies.
   */
  initialize() {
    if (this._initialized) return;
    Howler.volume(1.0);
    this._initialized = true;
  }

  // ─── Music ────────────────────────────────────────────────────────────────

  /**
   * Preload a music track without playing it.
   * @param {string} key - Key from ASSET_MANIFEST.music
   */
  preloadMusic(key) {
    if (this._music.has(key)) return;
    const src = ASSET_MANIFEST.music[key];
    if (!src) { console.warn(`[SoundManager] No music asset for key: "${key}"`); return; }

    this._music.set(key, new Howl({
      src:    [src],
      loop:   true,
      volume: 0,        // Start silent — fade in when played
      preload: true,
    }));
  }

  /**
   * Play a music track with optional crossfade from current track.
   * @param {string} key            - Music key
   * @param {number} [fadeDuration] - Override crossfade duration (ms)
   */
  playMusic(key, fadeDuration = CROSSFADE_DURATION) {
    if (!this._initialized) this.initialize();

    const incoming = this._getOrLoadMusic(key);
    const outgoing = this._currentTrack ? this._music.get(this._currentTrack) : null;

    // Fade out current track
    if (outgoing && outgoing.playing()) {
      outgoing.fade(this._muted ? 0 : this._musicVolume, 0, fadeDuration);
      setTimeout(() => outgoing.stop(), fadeDuration);
    }

    // Fade in new track
    incoming.volume(0);
    incoming.play();
    incoming.fade(0, this._muted ? 0 : this._musicVolume, fadeDuration);
    this._currentTrack = key;

    this._emit(EVENTS.AUDIO_PLAY, { key, type: 'music' });
  }

  /** Pause current music track */
  pauseMusic() {
    if (this._currentTrack) {
      this._music.get(this._currentTrack)?.pause();
      this._emit(EVENTS.AUDIO_PAUSE, { key: this._currentTrack, type: 'music' });
    }
  }

  /** Stop and reset current music */
  stopMusic(fadeDuration = 500) {
    if (!this._currentTrack) return;
    const track = this._music.get(this._currentTrack);
    if (track?.playing()) {
      track.fade(this._musicVolume, 0, fadeDuration);
      setTimeout(() => track.stop(), fadeDuration);
    }
    this._currentTrack = null;
  }

  // ─── SFX ─────────────────────────────────────────────────────────────────

  /**
   * Play a sound effect. Multiple SFX can overlap simultaneously.
   * @param {string} key - Key from ASSET_MANIFEST.sfx
   */
  playSfx(key) {
    if (!this._initialized) this.initialize();

    const sfx = this._getOrLoadSfx(key);
    sfx.volume(this._muted ? 0 : this._sfxVolume);
    sfx.play();
    this._emit(EVENTS.AUDIO_PLAY, { key, type: 'sfx' });
  }

  // ─── Volume & Mute ────────────────────────────────────────────────────────

  setMusicVolume(vol) {
    this._musicVolume = Math.max(0, Math.min(1, vol));
    if (this._currentTrack && !this._muted) {
      this._music.get(this._currentTrack)?.volume(this._musicVolume);
    }
    this._emit(EVENTS.AUDIO_VOLUME_CHANGE, { type: 'music', volume: this._musicVolume });
  }

  setSfxVolume(vol) {
    this._sfxVolume = Math.max(0, Math.min(1, vol));
    this._emit(EVENTS.AUDIO_VOLUME_CHANGE, { type: 'sfx', volume: this._sfxVolume });
  }

  mute() {
    this._muted = true;
    Howler.mute(true);
    this._emit(EVENTS.AUDIO_MUTE, {});
  }

  unmute() {
    this._muted = false;
    Howler.mute(false);
    this._emit(EVENTS.AUDIO_UNMUTE, {});
  }

  toggleMute() {
    this._muted ? this.unmute() : this.mute();
  }

  get isMuted()       { return this._muted; }
  get currentTrack()  { return this._currentTrack; }
  get musicVolume()   { return this._musicVolume; }

  // ─── Internal Loaders ─────────────────────────────────────────────────────

  _getOrLoadMusic(key) {
    if (!this._music.has(key)) this.preloadMusic(key);
    return this._music.get(key);
  }

  _getOrLoadSfx(key) {
    if (!this._sfx.has(key)) {
      const src = ASSET_MANIFEST.sfx[key];
      if (!src) { console.warn(`[SoundManager] No SFX asset for key: "${key}"`); return; }
      this._sfx.set(key, new Howl({ src: [src], volume: this._sfxVolume }));
    }
    return this._sfx.get(key);
  }

  // ─── Event Bus ────────────────────────────────────────────────────────────

  on(event, handler) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) { this._listeners.get(event)?.delete(handler); }
  _emit(event, data = {}) { this._listeners.get(event)?.forEach(fn => fn(data)); }
}

const soundManager = new SoundManager();
export default soundManager;
