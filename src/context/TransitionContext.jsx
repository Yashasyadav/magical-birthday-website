import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import sceneManager from '@engine/SceneManager';
import assetManager from '@engine/AssetManager';
import soundManager from '@engine/SoundManager';
import { ASSET_MANIFEST } from '@config/assets';
import { EVENTS } from '@constants/events';
import { SCENES } from '@constants/scenes';
import { ROUTES } from '@config/routes';

const TransitionContext = createContext(null);

const ROUTE_TO_SCENE = Object.keys(SCENES).reduce((acc, key) => {
  acc[ROUTES[key]] = SCENES[key];
  return acc;
}, {});

const PRELOAD_MAP = {
  '/welcome': () => import('@scenes/Welcome'),
  '/princess': () => import('@scenes/PrincessEntrance'),
  '/cake': () => import('@scenes/Cake'),
  '/memory-camera': () => import('@scenes/MemoryCamera'),
  '/gallery': () => import('@scenes/Gallery'),
  '/letter': () => import('@scenes/Letter'),
  '/feedback': () => import('@scenes/Feedback'),
  '/finale': () => import('@scenes/Finale'),
};

const ROUTE_ASSETS = {
  '/welcome': ['music.welcome', 'textures.starfield', 'sfx.firework', 'sfx.sparkle'],
  '/princess': ['music.princess', 'textures.starfield', 'sfx.firework', 'sfx.sparkle'],
  '/cake': ['music.cake', 'models.cake', 'textures.cakeFrosting', 'sfx.candleBlow', 'sfx.cakeCut'],
  '/memory-camera': ['music.gallery', 'textures.starfield', 'sfx.pageFlip', 'sfx.sparkle', 'sfx.buttonClick'],
  '/gallery': ['music.gallery', 'textures.starfield'],
  '/letter': ['music.letter', 'sfx.pageFlip', 'sfx.sparkle'],
  '/feedback': ['music.feedback', 'textures.starfield', 'sfx.buttonClick', 'sfx.success'],
  '/finale': ['music.finale', 'textures.starfield'],
};

export function TransitionProvider({ children }) {
  const [activeTransition, setActiveTransition] = useState(null);
  const [countdown, setCountdown] = useState(6);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [preparingMessage, setPreparingMessage] = useState(false);

  const countdownTimerRef = useRef(null);
  const delayTimerRef = useRef(null);
  const navigationInProgressRef = useRef(false);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    };
  }, []);

  const triggerCompletionFlow = useCallback((options) => {
    // Reset states
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    
    navigationInProgressRef.current = false;
    setIsNavigating(false);
    setIsTransitioning(false);
    setPreparingMessage(false);
    setShowOverlay(false);

    const {
      nextRoute,
      message,
      transitionDelay = 3000,
      countdownDuration = 6,
      buttonText = 'Continue →',
      icon = '✨',
    } = options;

    setActiveTransition({
      nextRoute,
      message,
      transitionDelay,
      countdownDuration,
      buttonText,
      icon,
    });

    setCountdown(countdownDuration);

    // Preload next route and assets immediately
    preloadAssetsAndRoute(nextRoute);

    // Phase 1: Wait transitionDelay before showing the card
    delayTimerRef.current = setTimeout(() => {
      setShowOverlay(true);
      // Phase 2: Start countdown
      let count = countdownDuration;
      countdownTimerRef.current = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(countdownTimerRef.current);
          triggerNavigation(nextRoute);
        }
      }, 1000);
    }, transitionDelay);
  }, []);

  // Listen to scene completion events
  useEffect(() => {
    const unsubComplete = sceneManager.on('sceneCompleted', (options) => {
      triggerCompletionFlow(options);
    });

    return () => {
      unsubComplete();
    };
  }, [triggerCompletionFlow]);

  const preloadAssetsAndRoute = async (nextRoute) => {
    try {
      // 1. Dynamic route preloading
      if (PRELOAD_MAP[nextRoute]) {
        PRELOAD_MAP[nextRoute]();
      }
      // 2. Asset preloading
      const assets = ROUTE_ASSETS[nextRoute] || [];
      if (assets.length > 0) {
        assetManager.preload(assets);
      }
    } catch (err) {
      console.warn('[TransitionProvider] Preload failed:', err);
    }
  };

  const triggerNavigation = async (targetRoute) => {
    // Prevent duplicate navigation calls
    if (navigationInProgressRef.current) return;
    navigationInProgressRef.current = true;
    setIsNavigating(true);

    // Clear timers
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);

    // Play "whoosh" & "sparkle" SFX on transition start
    soundManager.playSfx('transitionWhoosh');
    soundManager.playSfx('sparkle');
    soundManager.stopMusic(prefersReducedMotion ? 100 : 800);

    // Phase 1: Fade out current page and darken screen
    setIsTransitioning(true);

    // Wait for the fade out to complete (400ms or 100ms)
    await new Promise((r) => setTimeout(r, prefersReducedMotion ? 100 : 400));

    // Phase 2: Await assets load completion (Scene Ready Detection)
    let assetsLoaded = false;
    const safetyTimer = setTimeout(() => {
      if (!assetsLoaded) {
        setPreparingMessage(true);
      }
    }, 2000);

    // Resolve lazy dynamic route chunks and assets
    try {
      const promises = [];
      if (PRELOAD_MAP[targetRoute]) {
        promises.push(PRELOAD_MAP[targetRoute]());
      }
      const assets = ROUTE_ASSETS[targetRoute] || [];
      if (assets.length > 0) {
        promises.push(assetManager.preload(assets));
      }
      await Promise.allSettled(promises);
    } catch (err) {
      console.error('[TransitionProvider] Failed loading assets for target route:', err);
    }

    assetsLoaded = true;
    clearTimeout(safetyTimer);
    setPreparingMessage(false);

    // Navigate to new route in SceneManager
    const sceneKey = ROUTE_TO_SCENE[targetRoute];
    if (sceneKey) {
      sceneManager.navigateTo(sceneKey, { skipTransition: true });
    } else {
      console.warn(`[TransitionProvider] Unknown scene route: ${targetRoute}`);
    }

    // Wait brief moment for DOM mount
    await new Promise((r) => setTimeout(r, 100));

    // Phase 3: Fade in the next page
    // (Opacity fade-in is handled declaratively in BaseLayout by resetting isTransitioning)

    // Play next scene's music
    if (ASSET_MANIFEST.music[sceneKey]) {
      soundManager.preloadMusic(sceneKey);
      soundManager.playMusic(sceneKey, prefersReducedMotion ? 100 : 1500);
    }

    // Wait for fade-in animation to finish
    await new Promise((r) => setTimeout(r, prefersReducedMotion ? 100 : 400));

    // Reset transition states & unlock interaction
    setIsTransitioning(false);
    setShowOverlay(false);
    setActiveTransition(null);
    setIsNavigating(false);
    navigationInProgressRef.current = false;
  };

  const skipCountdown = () => {
    if (navigationInProgressRef.current || !activeTransition) return;
    triggerNavigation(activeTransition.nextRoute);
  };

  return (
    <TransitionContext.Provider
      value={{
        activeTransition,
        countdown,
        showOverlay,
        isTransitioning,
        isNavigating,
        preparingMessage,
        prefersReducedMotion,
        complete: triggerCompletionFlow,
        skipCountdown,
      }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionContext() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransitionContext must be used within <TransitionProvider>');
  return ctx;
}

export default TransitionContext;
