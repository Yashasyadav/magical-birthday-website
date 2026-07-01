/**
 * AssetContext.jsx
 * Tracks asset preloading state across the React tree.
 * Components that need preloaded assets can check isLoaded() before rendering.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import assetManager from '@engine/AssetManager';
import { EVENTS }   from '@constants/events';

const AssetContext = createContext(null);

export function AssetProvider({ children }) {
  const [progress,    setProgress]    = useState(0);   // 0.0 – 1.0
  const [isLoading,   setIsLoading]   = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount,  setTotalCount]  = useState(0);
  const [errors,      setErrors]      = useState([]);

  useEffect(() => {
    const unsubStart    = assetManager.on(EVENTS.ASSET_LOAD_START, ({ total }) => {
      setIsLoading(true);
      setTotalCount(total);
      setProgress(0);
    });

    const unsubProgress = assetManager.on(EVENTS.ASSET_LOAD_PROGRESS, ({ loaded, progress }) => {
      setLoadedCount(loaded);
      setProgress(progress);
    });

    const unsubComplete = assetManager.on(EVENTS.ASSET_LOAD_COMPLETE, () => {
      setIsLoading(false);
      setProgress(1);
    });

    const unsubError = assetManager.on(EVENTS.ASSET_LOAD_ERROR, ({ key }) => {
      setErrors(prev => [...prev, key]);
    });

    return () => { unsubStart(); unsubProgress(); unsubComplete(); unsubError(); };
  }, []);

  const preload = useCallback((keys) => assetManager.preload(keys), []);
  const getAsset = useCallback((key) => assetManager.get(key), []);
  const hasAsset = useCallback((key) => assetManager.has(key), []);

  const value = {
    progress,
    isLoading,
    loadedCount,
    totalCount,
    errors,
    preload,
    getAsset,
    hasAsset,
  };

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  );
}

export function useAssetContext() {
  const ctx = useContext(AssetContext);
  if (!ctx) throw new Error('useAssetContext must be used within <AssetProvider>');
  return ctx;
}

export default AssetContext;
