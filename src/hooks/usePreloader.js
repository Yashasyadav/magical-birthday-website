/**
 * usePreloader.js
 * Hook for preloading a list of scene assets and tracking progress.
 *
 * @example
 *   const { progress, isComplete } = usePreloader(['music.castle', 'models.cake']);
 */

import { useState, useEffect } from 'react';
import { useAssetContext }     from '@context/AssetContext';

/**
 * @param {string[]} assetKeys - Dot-notation asset keys to preload
 * @returns {{ progress: number, isComplete: boolean, hasErrors: boolean }}
 */
export function usePreloader(assetKeys = []) {
  const { preload, progress, isLoading, errors, hasAsset } = useAssetContext();
  const [isComplete, setIsComplete] = useState(() => assetKeys.every(k => hasAsset(k)));

  useEffect(() => {
    if (isComplete || assetKeys.length === 0) return;

    preload(assetKeys).then(() => setIsComplete(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    progress,
    isComplete,
    isLoading,
    hasErrors: errors.length > 0,
    errors,
  };
}
