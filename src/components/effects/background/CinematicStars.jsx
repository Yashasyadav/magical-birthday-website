import React, { useMemo, useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Cinematic star field with varying depths, twinkle speeds, and slow drift.
 * Includes an occasional shooting star.
 * Refactored to use standard useEffect with GSAP context to ensure 100% HMR stability.
 */
function CinematicStars() {
  const containerRef = useRef(null);
  const shootingStarRef = useRef(null);

  const stars = useMemo(() => {
    // Generate 120 random stars
    return Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
      // Different depth logic: smaller stars drift slower
      z: Math.random() * -100
    }));
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Very slow drift for the entire star field
      gsap.to(containerRef.current, {
        x: '-2%',
        y: '1%',
        duration: 40,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });

      // Shooting star logic
      const shootStar = () => {
        // Reset position
        gsap.set(shootingStarRef.current, {
          x: '110vw',
          y: '-10vh',
          opacity: 0,
          scale: 0.5
        });
        
        // Animate across screen
        gsap.to(shootingStarRef.current, {
          x: '-20vw',
          y: '50vh',
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(shootingStarRef.current, { opacity: 0 });
            // Schedule next shooting star (12 - 18s)
            gsap.delayedCall(Math.random() * 6 + 12, shootStar);
          }
        });
      };

      // Initial shoot delay
      gsap.delayedCall(5, shootStar);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 2 }}>
      {/* Drifting star field */}
      <div ref={containerRef} className="absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              left: star.left,
              top: star.top,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
              transform: `translateZ(${star.z}px)`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`
            }}
          />
        ))}
      </div>

      {/* Occasional shooting star */}
      <div 
        ref={shootingStarRef}
        className="absolute w-24 h-[1px] opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), #fff)',
          boxShadow: '0 0 10px rgba(255,255,255,0.5)',
          transformOrigin: 'right center',
          rotate: '150deg'
        }}
      />
    </div>
  );
}

export default CinematicStars;
