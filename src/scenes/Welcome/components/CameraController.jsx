/**
 * CameraController.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Cinematic camera wrapper. Uses nested layers to apply:
 *   • Continuous subtle breathing (float/drift) via a perpetual GSAP loop
 *   • Controlled zoom-ins, zoom-outs, and tilts via master timeline refs
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';

export const CameraController = forwardRef(function CameraController(
  { children, className = '' },
  ref
) {
  const floatRigRef = useRef(null);
  const zoomRigRef = useRef(null);

  useImperativeHandle(ref, () => ({
    /** Trigger cinematic push forward and upward tilt */
    pushAndTilt(duration = 10, ease = 'power1.inOut') {
      return gsap.timeline()
        .to(zoomRigRef.current, {
          scale: 1.08,
          y: '-2vh',
          duration,
          ease
        }, 0);
    },

    /** Center and ease camera framing on text reveal */
    focusOnText(duration = 5, ease = 'power2.out') {
      return gsap.to(zoomRigRef.current, {
        scale: 1.04,
        y: '-1vh',
        duration,
        ease
      });
    },

    /** Slowly settle camera */
    settle(duration = 8) {
      return gsap.to(zoomRigRef.current, {
        scale: 1.02,
        y: '0vh',
        duration,
        ease: 'sine.inOut'
      });
    }
  }));

  useEffect(() => {
    // 1. Separate loop for continuous cinematic breathing / floating
    const floatCtx = gsap.context(() => {
      gsap.to(floatRigRef.current, {
        x: '+=6px',
        y: '+=4px',
        rotation: 0.15,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, floatRigRef);

    return () => {
      floatCtx.revert();
    };
  }, []);

  return (
    <div 
      ref={floatRigRef} 
      className={`absolute inset-0 w-[104%] h-[104%] -left-[2%] -top-[2%] transform-gpu ${className}`}
    >
      <div 
        ref={zoomRigRef} 
        className="absolute inset-0 w-full h-full transform-gpu origin-center"
      >
        {children}
      </div>
    </div>
  );
});

export default CameraController;
