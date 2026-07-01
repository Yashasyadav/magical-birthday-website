import React, { useRef } from 'react';
import { useAnimation } from '@hooks/useAnimation';
import gsap from 'gsap';

/**
 * Deep midnight blue fading into black background with subtle animated light rays
 * and a slow breathing purple glow.
 */
function LoadingBackground() {
  const glowRef = useRef(null);
  const raysRef = useRef(null);

  useAnimation(() => {
    // Very subtle breathing for the purple radial glow
    gsap.to(glowRef.current, {
      opacity: 0.6,
      scale: 1.1,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Extremely slow rotation for the subtle light rays
    gsap.to(raysRef.current, {
      rotation: 360,
      duration: 120,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%'
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Layer 1: Deep midnight blue to black */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, #1c1640 0%, #0d0a1e 60%, #04020f 100%)',
        }}
      />
      
      {/* Layer 2: Large radial purple glow */}
      <div 
        ref={glowRef}
        className="absolute w-[150vw] h-[150vw] max-w-[2500px] max-h-[2500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 60%)',
          filter: 'blur(80px)'
        }}
      />

      {/* Layer 6: Extremely subtle moving light rays */}
      <div 
        ref={raysRef}
        className="absolute w-[200vw] h-[200vw] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 mix-blend-screen"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.03) 30deg, transparent 60deg, rgba(255,255,255,0.05) 120deg, transparent 180deg, rgba(255,255,255,0.02) 240deg, transparent 300deg)',
          filter: 'blur(10px)'
        }}
      />
    </div>
  );
}

export default LoadingBackground;
