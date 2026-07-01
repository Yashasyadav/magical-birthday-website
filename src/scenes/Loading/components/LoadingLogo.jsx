import React, { useRef, useMemo } from 'react';
import { useAnimation } from '@hooks/useAnimation';
import gsap from 'gsap';

/**
 * Glowing golden crown logo for the loading screen.
 * Floats slowly, rotates ±2 deg, pulses, sparkles, and reacts to cursor.
 */
function LoadingLogo() {
  const containerRef = useRef(null);
  const crownRef = useRef(null);
  const glowRef = useRef(null);
  const sparklesRef = useRef(null);

  // Tiny sparkles around the crown
  const sparkles = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 + 10,
      y: Math.random() * 60 + 10,
      scale: Math.random() * 1.5 + 0.5,
      delay: Math.random() * 2
    }));
  }, []);

  useAnimation(() => {
    // Float animation
    gsap.to(crownRef.current, {
      y: -12,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Subtle rotation ±2 degrees
    gsap.to(crownRef.current, {
      rotation: 2,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Pulse the crown scale slightly every few seconds
    gsap.to(crownRef.current, {
      scale: 1.03,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Breathe animation for the outer glow
    gsap.to(glowRef.current, {
      opacity: 0.8,
      scale: 1.15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Animate tiny sparkles
    if (sparklesRef.current) {
      const spks = gsap.utils.toArray('.crown-sparkle', sparklesRef.current);
      spks.forEach((spk, i) => {
        gsap.to(spk, {
          opacity: 1,
          scale: sparkles[i].scale * 1.2,
          rotation: 180,
          duration: 1.5,
          delay: sparkles[i].delay,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      });
    }

    // Cursor parallax reaction
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const xPos = (e.clientX / innerWidth - 0.5) * 10; // Max 5px movement
      const yPos = (e.clientY / innerHeight - 0.5) * 10;
      
      gsap.to(containerRef.current, {
        x: xPos,
        y: yPos,
        rotationY: xPos,
        rotationX: -yPos,
        duration: 1,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [sparkles]);

  return (
    <div 
      ref={containerRef} 
      className="relative flex items-center justify-center mb-12"
      style={{ perspective: '500px' }}
    >
      {/* Outer glow */}
      <div 
        ref={glowRef}
        className="absolute w-40 h-40 rounded-full opacity-40 mix-blend-screen pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(251,191,36,0.6) 0%, transparent 70%)',
          filter: 'blur(15px)'
        }}
      />
      
      {/* Crown SVG Wrapper */}
      <div ref={crownRef} className="relative z-10">
        <svg 
          width="120" 
          height="80" 
          viewBox="0 0 120 80" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
        >
          <path 
            d="M10 60 L20 20 L40 40 L60 10 L80 40 L100 20 L110 60 Z" 
            fill="url(#goldGradient)"
            stroke="#fde68a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path 
            d="M10 65 L110 65 L105 75 L15 75 Z" 
            fill="url(#goldGradient)"
          />
          <circle cx="20" cy="15" r="4" fill="#fff176" />
          <circle cx="60" cy="5" r="5" fill="#fff176" />
          <circle cx="100" cy="15" r="4" fill="#fff176" />
          <defs>
            <linearGradient id="goldGradient" x1="0" y1="0" x2="120" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f59e0b" />
              <stop offset="0.5" stopColor="#fbbf24" />
              <stop offset="1" stopColor="#fde68a" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tiny Sparkles */}
        <div ref={sparklesRef} className="absolute inset-0 pointer-events-none">
          {sparkles.map((spk) => (
            <div
              key={spk.id}
              className="crown-sparkle absolute w-1 h-1 bg-white rounded-full opacity-0"
              style={{
                left: spk.x,
                top: spk.y,
                boxShadow: '0 0 4px #fff, 0 0 8px #fde68a',
                transform: `scale(${spk.scale})`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingLogo;
