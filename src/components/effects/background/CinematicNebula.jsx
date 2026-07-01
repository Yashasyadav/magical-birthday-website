import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Soft moving blue nebula with slow rotation and drifting motion.
 * Refactored to use standard useEffect with GSAP context to ensure 100% HMR stability.
 */
function CinematicNebula() {
  const containerRef = useRef(null);
  const nebula1Ref = useRef(null);
  const nebula2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entire nebula container slowly drifts
      gsap.to(containerRef.current, {
        x: '5%',
        y: '-5%',
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Nebula 1 (Deep Blue/Purple) rotates and breathes
      gsap.to(nebula1Ref.current, {
        rotation: 360,
        duration: 180,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      });
      gsap.to(nebula1Ref.current, {
        opacity: 0.8,
        scale: 1.1,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Nebula 2 (Teal/Fairy) counter-rotates
      gsap.to(nebula2Ref.current, {
        rotation: -360,
        duration: 220,
        repeat: -1,
        ease: 'none',
        transformOrigin: '50% 50%'
      });
      gsap.to(nebula2Ref.current, {
        opacity: 0.6,
        scale: 1.15,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none flex items-center justify-center" style={{ zIndex: 1 }}>
      {/* Nebula 1 */}
      <div 
        ref={nebula1Ref}
        className="absolute w-[180vw] h-[180vw] max-w-[2000px] max-h-[2000px] opacity-60 rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(76,29,149,0.15) 0%, rgba(37,30,82,0.1) 40%, transparent 70%)',
          filter: 'blur(80px)'
        }}
      />
      {/* Nebula 2 */}
      <div 
        ref={nebula2Ref}
        className="absolute w-[160vw] h-[160vw] max-w-[1800px] max-h-[1800px] opacity-40 rounded-full mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at 60% 60%, rgba(45,212,191,0.12) 0%, rgba(94,234,212,0.05) 35%, transparent 60%)',
          filter: 'blur(60px)'
        }}
      />
    </div>
  );
}

export default CinematicNebula;
