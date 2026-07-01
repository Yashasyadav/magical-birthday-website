/**
 * useParticles.js
 * Hook for tsparticles integration with preset support.
 */

import { useState, useCallback } from 'react';
import { loadSlim } from '@tsparticles/slim';

/** tsparticles engine is initialized once globally */
let engineInitialized = false;
let engineInitPromise = null;

async function ensureEngineReady(initFn) {
  if (engineInitialized) return;
  if (engineInitPromise) return engineInitPromise;

  engineInitPromise = initFn(async (engine) => {
    await loadSlim(engine);
    engineInitialized = true;
  });

  return engineInitPromise;
}

/**
 * @param {object} options - tsparticles config object (from config/particles.js)
 */
export function useParticles(options) {
  const [particlesId] = useState(() => `particles-${Math.random().toString(36).slice(2)}`);
  const [isLoaded,     setIsLoaded] = useState(false);

  const onInit = useCallback(async (engine) => {
    await loadSlim(engine);
    engineInitialized = true;
  }, []);

  const onLoaded = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return {
    particlesId,
    particlesOptions: options,
    isLoaded,
    onInit,
    onLoaded,
  };
}
