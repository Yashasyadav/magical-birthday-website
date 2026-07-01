/**
 * AssetManager.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Preload queue and in-memory asset cache.
 * Supports images, audio files, GLTF models, textures, and HDR environments.
 *
 * Assets are fetched/decoded ahead of time so scenes mount instantly with
 * zero network lag or flickering.
 *
 * Usage:
 *   await AssetManager.preload(['music.loading', 'models.cake']);
 *   const src = AssetManager.get('textures.starfield');
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { ASSET_MANIFEST } from '@config/assets';
import { EVENTS }         from '@constants/events';

/** Supported asset type resolvers */
const LOADERS = {
  image:   loadImage,
  audio:   loadAudio,
  generic: loadGeneric,
};

class AssetManager {
  constructor() {
    /** @type {Map<string, any>} Resolved asset cache */
    this._cache     = new Map();
    /** @type {Set<string>} Keys currently loading */
    this._loading   = new Set();
    this._listeners = new Map();
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  /**
   * Preload a list of asset keys and report progress via events.
   * Keys use dot notation: 'music.loading', 'models.cake', 'textures.starfield'.
   *
   * @param {string[]} keys   - Asset keys to preload
   * @returns {Promise<void>} - Resolves when all assets are loaded
   */
  async preload(keys) {
    const toLoad = keys.filter(k => !this._cache.has(k) && !this._loading.has(k));
    if (toLoad.length === 0) return;

    this._emit(EVENTS.ASSET_LOAD_START, { total: toLoad.length });

    let loaded = 0;
    const promises = toLoad.map(async key => {
      this._loading.add(key);
      try {
        const asset = await this._resolveAndLoad(key);
        this._cache.set(key, asset);
        loaded++;
        this._emit(EVENTS.ASSET_LOAD_PROGRESS, {
          key,
          loaded,
          total: toLoad.length,
          progress: loaded / toLoad.length,
        });
      } catch (err) {
        console.error(`[AssetManager] Failed to load "${key}":`, err);
        this._emit(EVENTS.ASSET_LOAD_ERROR, { key, error: err });
      } finally {
        this._loading.delete(key);
      }
    });

    await Promise.allSettled(promises);
    this._emit(EVENTS.ASSET_LOAD_COMPLETE, { total: toLoad.length });
  }

  /**
   * Retrieve a cached asset.
   * @param {string} key - Dot-notation key (e.g., 'textures.starfield')
   * @returns {any|null}
   */
  get(key) {
    return this._cache.get(key) ?? null;
  }

  /**
   * Check if an asset is already loaded.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this._cache.has(key);
  }

  /** Clear the entire asset cache (call between major experience segments) */
  clearCache() {
    this._cache.clear();
  }

  /**
   * Release specific assets from cache.
   * @param {string[]} keys
   */
  release(keys) {
    keys.forEach(k => this._cache.delete(k));
  }

  get cacheSize() { return this._cache.size; }

  // ─── Internal Resolution ──────────────────────────────────────────────────

  /** Resolve a dot-notation key to its URL from ASSET_MANIFEST */
  _resolveUrl(key) {
    const [category, name] = key.split('.');
    return ASSET_MANIFEST[category]?.[name] ?? null;
  }

  /** Determine loader type from URL extension */
  _getLoaderType(url) {
    if (!url) return 'generic';
    const ext = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'webp', 'avif', 'svg'].includes(ext)) return 'image';
    if (['mp3', 'ogg', 'wav', 'flac'].includes(ext)) return 'audio';
    return 'generic';
  }

  async _resolveAndLoad(key) {
    const url = this._resolveUrl(key);
    if (!url) throw new Error(`No URL found in manifest for key "${key}"`);
    const loaderType = this._getLoaderType(url);
    return LOADERS[loaderType](url);
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

// ─── Loader Functions ─────────────────────────────────────────────────────────

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img  = new Image();
    img.src    = url;
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error(`Image failed: ${url}`));
  });
}

function loadAudio(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.src   = url;
    
    // Safety timeout: resolve audio anyway if it takes more than 2 seconds
    // to prevent autoplay/suspend policies from hanging the asset loading queue.
    const timeoutId = setTimeout(() => {
      cleanup();
      resolve(audio);
    }, 2000);

    const onCanPlay = () => {
      cleanup();
      resolve(audio);
    };

    const onError = () => {
      cleanup();
      reject(new Error(`Audio failed: ${url}`));
    };

    const cleanup = () => {
      clearTimeout(timeoutId);
      audio.oncanplaythrough = null;
      audio.onerror = null;
    };

    audio.oncanplaythrough = onCanPlay;
    audio.onerror          = onError;
    audio.load();
  });
}

function loadGeneric(url) {
  return fetch(url)
    .then(r => { if (!r.ok) throw new Error(`Fetch failed: ${url}`); return r; })
    .then(r => r.blob());
}

const assetManager = new AssetManager();
export default assetManager;
