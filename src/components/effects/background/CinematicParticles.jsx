import React, { useMemo, useRef } from 'react';
import { useAnimation } from '@hooks/useAnimation';
import gsap from 'gsap';

/**
 * Magical fairy dust using custom GSAP animations.
 * Golden, white, very light pink particles floating upward.
 * Replaces ParticleManager for more cinematic, specific control.
 */
function LoadingParticles() {
  const containerRef = useRef(null);

  const particles = useMemo(() => {
    const colors = ['#fde68a', '#ffffff', '#ffc2d4', '#f59e0b'];
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100 + 10}%`,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * -10, // Negative delay to pre-populate screen
      duration: Math.random() * 10 + 15, // Slow float
      drift: Math.random() * 20 - 10 // Horizontal drift
    }));
  }, []);

  useAnimation(() => {
    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray('.dust-particle');
      
      elements.forEach((el, i) => {
        const p = particles[i];
        
        // Float up and drift
        gsap.to(el, {
          y: '-120vh',
          x: `+=${p.drift}vw`,
          rotation: Math.random() * 360,
          duration: p.duration,
          delay: p.delay,
          repeat: -1,
          ease: 'none',
        });

        // Twinkle / Pulse opacity
        gsap.to(el, {
          opacity: Math.random() * 0.5 + 0.5,
          scale: Math.random() * 0.5 + 1,
          duration: Math.random() * 2 + 1,
          repeat: -1,
          yoyo: true,
          delay: Math.random() * 2,
          ease: 'sine.inOut'
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [particles]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="dust-particle absolute rounded-full opacity-0"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
          }}
        />
      ))}
    </div>
  );
}

export default LoadingParticles;
