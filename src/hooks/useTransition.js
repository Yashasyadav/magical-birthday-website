/**
 * useTransition.js
 * Hook to trigger scene transitions and observe transition state.
 */

import { useState, useEffect, useCallback } from 'react';
import transitionManager from '@engine/TransitionManager';
import { EVENTS }        from '@constants/events';

export function useTransition() {
  const [activeTransition, setActiveTransition] = useState(null);
  const [isTransitioning,  setIsTransitioning]  = useState(false);

  useEffect(() => {
    const unsubStart    = transitionManager.on(EVENTS.TRANSITION_START, ({ type, direction }) => {
      setActiveTransition({ type, direction });
      setIsTransitioning(true);
    });

    const unsubComplete = transitionManager.on(EVENTS.TRANSITION_COMPLETE, () => {
      setIsTransitioning(false);
      setActiveTransition(null);
    });

    return () => { unsubStart(); unsubComplete(); };
  }, []);

  /**
   * Manually play a transition effect.
   * @param {string} type - TRANSITIONS constant
   * @param {'out'|'in'} direction
   */
  const playTransition = useCallback((type, direction) => {
    return transitionManager.playTransition(type, direction);
  }, []);

  return { activeTransition, isTransitioning, playTransition };
}
