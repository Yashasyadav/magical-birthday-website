/**
 * useAnimation.js
 * Hook for creating GSAP timelines scoped to a React component.
 * Handles registration and cleanup automatically.
 *
 * @example
 *   const { createTimeline, gsap } = useAnimation('castle-entrance');
 *   useLayoutEffect(() => {
 *     const tl = createTimeline({ defaults: { ease: 'power4.out' } });
 *     tl.from(ref.current, { opacity: 0, y: 80 });
 *     return () => tl.kill();
 *   }, []);
 */

import { useCallback } from 'react';
import animationManager from '@engine/AnimationManager';

/**
 * @param {string} id - Unique animation group id (use scene + component name)
 */
export function useAnimation(id) {
  const createTimeline = useCallback((vars) => {
    return animationManager.createTimeline(id, vars);
  }, [id]);

  const killTimelines = useCallback(() => {
    animationManager.killTimelines(id);
  }, [id]);

  const createContext = useCallback((fn, scope) => {
    return animationManager.createContext(fn, scope);
  }, []);

  return {
    createTimeline,
    killTimelines,
    createContext,
    gsap:          animationManager.gsap,
    ScrollTrigger: animationManager.ScrollTrigger,
  };
}
