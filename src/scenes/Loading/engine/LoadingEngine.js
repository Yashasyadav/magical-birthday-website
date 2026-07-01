import { ASSET_MANIFEST } from '@config/assets';
import assetManager       from '@engine/AssetManager';
import sceneManager       from '@engine/SceneManager';
import { EVENTS }         from '@constants/events';

export const LOADING_MESSAGES = [
  '✨ Awakening the enchanted kingdom...',
  '✨ Gathering fairy dust...',
  '✨ Lighting the royal castle...',
  '✨ Preparing magical memories...',
  '✨ Decorating the royal celebration...',
  '✨ One final surprise...'
];

class LoadingEngine {
  constructor() {
    this._listeners = new Set();
    this._state = {
      progress: 0,
      assetsLoaded: 0,
      assetsTotal: 0,
      currentMessageIndex: 0,
      isComplete: false,
    };
    
    // Bind methods
    this.handleProgress = this.handleProgress.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
    
    this._allKeys = this._gatherAllAssetKeys();
  }

  _gatherAllAssetKeys() {
    const keys = [];
    Object.keys(ASSET_MANIFEST).forEach(category => {
      Object.keys(ASSET_MANIFEST[category]).forEach(name => {
        keys.push(`${category}.${name}`);
      });
    });
    return keys;
  }

  start() {
    // Reset state
    this._state = {
      progress: 0,
      assetsLoaded: 0,
      assetsTotal: this._allKeys.length,
      currentMessageIndex: 0,
      isComplete: false,
    };
    this._notify();

    // Listen to AssetManager
    this._unsubProgress = assetManager.on(EVENTS.ASSET_LOAD_PROGRESS, this.handleProgress);
    this._unsubComplete = assetManager.on(EVENTS.ASSET_LOAD_COMPLETE, this.handleComplete);

    // If there are no assets, or they're already cached, just complete
    if (this._allKeys.length === 0) {
      this._finalizeLoading();
      return;
    }

    // Start preloading EVERYTHING
    assetManager.preload(this._allKeys);
  }

  handleProgress(data) {
    // Determine overall progress across the specifically requested keys
    // AssetManager reports loaded and total for the current batch.
    // If the batch includes all keys, we can just use data.loaded and data.total.
    this._state.assetsLoaded = data.loaded;
    this._state.assetsTotal = data.total;
    this._state.progress = data.progress;
    
    // Update message based on progress thresholds
    const msgCount = LOADING_MESSAGES.length;
    // Map progress (0-1) to an index, but don't reach the last one until very close to end
    const index = Math.min(
      msgCount - 1,
      Math.floor(data.progress * (msgCount - 0.1))
    );
    this._state.currentMessageIndex = index;
    
    this._notify();
  }

  handleComplete() {
    this._state.progress = 1;
    this._state.assetsLoaded = this._state.assetsTotal;
    this._state.currentMessageIndex = LOADING_MESSAGES.length - 1; // "Almost ready..."
    this._notify();

    // Clean up listeners
    if (this._unsubProgress) this._unsubProgress();
    if (this._unsubComplete) this._unsubComplete();

    // Fake a 1 second pause to let the user see 100% and the final message
    setTimeout(() => {
      this._finalizeLoading();
    }, 1000);
  }

  _finalizeLoading() {
    this._state.isComplete = true;
    this._notify();
    // Do NOT navigate. Just notify the SceneManager as requested.
    sceneManager._emit(EVENTS.SCENE_LOAD_COMPLETE, { scene: 'loading' });
  }

  subscribe(listener) {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  _notify() {
    const stateSnapshot = { ...this._state, currentMessage: LOADING_MESSAGES[this._state.currentMessageIndex] };
    this._listeners.forEach(listener => listener(stateSnapshot));
  }

  getState() {
    return { ...this._state, currentMessage: LOADING_MESSAGES[this._state.currentMessageIndex] };
  }
}

// Singleton for the loading scene
export const loadingEngine = new LoadingEngine();
