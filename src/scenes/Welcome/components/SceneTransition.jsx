/**
 * SceneTransition.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Coordinates transition overlays (e.g. fading from previous scene's bloom
 * to pitch black to set the anticipation mood).
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';

export const SceneTransition = forwardRef(function SceneTransition(
  { onTransitionOutComplete, className = '' },
  ref
) {
  const overlayRef = useRef(null);

  useImperativeHandle(ref, () => ({
    /** Fade to solid black */
    fadeToBlack(duration = 1.0) {
      return gsap.to(overlayRef.current, {
        opacity: 1,
        backgroundColor: '#000000',
        duration,
        ease: 'power2.inOut',
      });
    },

    /** Fade out transition overlay to reveal scene backdrop */
    revealScene(duration = 2.0) {
      return gsap.to(overlayRef.current, {
        opacity: 0,
        duration,
        ease: 'power2.inOut',
        onComplete: () => {
          if (onTransitionOutComplete) onTransitionOutComplete();
        }
      });
    }
  }));

  return (
    <div
      ref={overlayRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        zIndex: 99,
        // Start as solid white (to catch the authentication succes bloom transition seamlessly)
        backgroundColor: '#ffffff',
        opacity: 1,
      }}
    />
  );
});

export default SceneTransition;
