import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';

/**
 * Orchestrates magical particle effects based on authentication state.
 */
const ValidationMagic = forwardRef((props, ref) => {
  const containerRef = useRef(null);

  useImperativeHandle(ref, () => ({
    // Burst of red particles when wrong
    playError: () => {
      spawnParticles(30, '#ef4444', 150);
    },
    
    // Explosion of golden magic when successful
    playSuccess: () => {
      spawnParticles(100, '#fbbf24', 300, 3);
    }
  }));

  const spawnParticles = (count, color, radius, durationMult = 1) => {
    if (!containerRef.current) return;
    
    const particles = [];
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'absolute w-2 h-2 rounded-full mix-blend-screen pointer-events-none';
      p.style.backgroundColor = color;
      p.style.boxShadow = `0 0 10px ${color}`;
      p.style.top = '50%';
      p.style.left = '50%';
      containerRef.current.appendChild(p);
      particles.push(p);
    }

    particles.forEach(p => {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * radius;
      gsap.to(p, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: Math.random() * 2,
        duration: (Math.random() * 0.5 + 0.5) * durationMult,
        ease: 'power3.out',
        onComplete: () => {
          if (containerRef.current?.contains(p)) {
            containerRef.current.removeChild(p);
          }
        }
      });
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none" 
      style={{ zIndex: 30 }} 
    />
  );
});

export default ValidationMagic;
