import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Rich, multi-depth layered fog at the base of the castle.
 * Creates an atmospheric volumetric depth effect.
 */
const FogLayer = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const fogFarRef = useRef(null);
  const fogMidRef = useRef(null);
  const fogCloseRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current
  }));

  useEffect(() => {
    // Drifting at different speeds for parallax/volumetric realism
    gsap.to(fogFarRef.current, {
      x: '15vw',
      duration: 35,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.to(fogMidRef.current, {
      x: '-20vw',
      duration: 45,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });

    gsap.to(fogCloseRef.current, {
      x: '25vw',
      duration: 25,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute bottom-0 left-0 w-full h-[45vh] pointer-events-none opacity-0 overflow-hidden"
      style={{ zIndex: 12 }} // Sits behind Castle (z=15) but in front of sky
    >
      {/* 1. Distant low-lying purple fog */}
      <div 
        ref={fogFarRef}
        className="absolute bottom-[-15%] left-[-20%] w-[140%] h-[120%]"
        style={{
          background: 'linear-gradient(to top, rgba(45,212,191,0.06) 0%, rgba(139,92,246,0.04) 50%, transparent 100%)',
          filter: 'blur(35px)'
        }}
      />
      
      {/* 2. Midground thicker misty fog */}
      <div 
        ref={fogMidRef}
        className="absolute bottom-[-5%] left-[-15%] w-[130%] h-[100%]"
        style={{
          background: 'linear-gradient(to top, rgba(139,92,246,0.08) 0%, rgba(200,200,255,0.02) 60%, transparent 100%)',
          filter: 'blur(45px)'
        }}
      />

      {/* 3. Close wispy golden fog to reflect castle window glow */}
      <div 
        ref={fogCloseRef}
        className="absolute bottom-[-10%] left-[-25%] w-[150%] h-[90%]"
        style={{
          background: 'linear-gradient(to top, rgba(251,191,36,0.05) 0%, rgba(253,230,138,0.01) 40%, transparent 100%)',
          filter: 'blur(30px)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
});

export default FogLayer;
