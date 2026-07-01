import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Enhanced realistic moon with detailed craters, ambient glow halo,
 * and a slow breathing animation.
 */
const Moon = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const moonBodyRef = useRef(null);
  const cloudRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current
  }));

  useEffect(() => {
    // Very slow breathing glow (halo pulse)
    gsap.to(glowRef.current, {
      opacity: 0.6,
      scale: 1.15,
      duration: 8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Subtle floating motion for the moon body
    gsap.to(moonBodyRef.current, {
      y: '-=5',
      x: '+=3',
      duration: 12,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    // Occasional passing cloud in front of the moon
    gsap.fromTo(cloudRef.current,
      { x: '-150%', opacity: 0 },
      {
        x: '250%',
        opacity: 0.25,
        duration: 35,
        ease: 'none',
        repeat: -1,
        repeatDelay: 10
      }
    );
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-[8%] right-[12%] w-72 h-72 pointer-events-none opacity-0"
      style={{ zIndex: 5 }}
    >
      {/* Cinematic Ambient Glow Halo */}
      <div 
        ref={glowRef}
        className="absolute inset-0 rounded-full mix-blend-screen opacity-35"
        style={{
          background: 'radial-gradient(circle, rgba(255,24beb,0.9) 0%, rgba(253,230,138,0.4) 40%, rgba(251,191,36,0.1) 60%, transparent 80%)',
          filter: 'blur(35px)'
        }}
      />
      
      {/* Outer Golden Corona */}
      <div className="absolute inset-4 rounded-full border border-gold-200/20 filter blur-[2px] animate-pulse" />

      {/* Moon Body container to float independently */}
      <div ref={moonBodyRef} className="absolute inset-0 w-full h-full">
        {/* Core Moon Sphere */}
        <div 
          className="absolute inset-10 rounded-full shadow-[0_0_80px_rgba(255,251,235,0.7),inset_-15px_-15px_40px_rgba(217,119,6,0.2),inset_10px_10px_20px_rgba(255,255,255,0.9)]"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #fffbeb 45%, #fde68a 85%, #fbbf24 100%)',
          }}
        >
          {/* Detailed Craters */}
          <svg className="absolute inset-0 w-full h-full opacity-20 mix-blend-multiply" viewBox="0 0 100 100">
            {/* Crater 1 */}
            <circle cx="35" cy="45" r="8" fill="#d97706" opacity="0.4" />
            <circle cx="33" cy="43" r="7" fill="#f59e0b" opacity="0.3" />
            
            {/* Crater 2 */}
            <circle cx="65" cy="35" r="11" fill="#d97706" opacity="0.45" />
            <circle cx="63" cy="33" r="9" fill="#f59e0b" opacity="0.3" />
            
            {/* Crater 3 */}
            <circle cx="50" cy="70" r="6" fill="#d97706" opacity="0.35" />
            
            {/* Crater 4 */}
            <circle cx="25" cy="65" r="5" fill="#d97706" opacity="0.3" />

            {/* Rays extending from Crater 2 */}
            <path d="M 65 35 L 50 45 M 65 35 L 75 50 M 65 35 L 55 20 M 65 35 L 80 25" stroke="#fde68a" strokeWidth="1.5" opacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Local Passing Cloud (rendered in front of moon body but inside container) */}
      <svg 
        ref={cloudRef}
        className="absolute top-[40%] w-[120px] h-[60px] fill-white pointer-events-none mix-blend-color-dodge"
        viewBox="0 0 120 60"
        style={{ zIndex: 10 }}
      >
        <path d="M10,40 C10,30 20,20 35,20 C40,10 60,10 70,18 C80,10 100,12 105,25 C115,25 120,32 115,42 C110,50 90,50 80,48 C70,52 40,52 25,48 C15,48 5,45 10,40 Z" />
      </svg>
    </div>
  );
});

export default Moon;
