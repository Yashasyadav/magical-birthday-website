import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import particleManager from '@engine/ParticleManager';

/**
 * DOM-based Fireflies using ParticleManager configuration.
 * Random movement, random brightness, random speed, tiny glow.
 */
const Fireflies = forwardRef(({ count = 30 }, ref) => {
  const containerRef = useRef(null);
  const [fireflies, setFireflies] = useState([]);
  const config = particleManager.getPreset('fireflies');

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current
  }));

  useEffect(() => {
    // Generate initial firefly objects
    const items = Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // vw
      y: Math.random() * 100, // vh
      scale: 0.5 + Math.random() * 0.8,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * -10,
      color: config.colors[Math.floor(Math.random() * config.colors.length)]
    }));
    setFireflies(items);
  }, [count, config]);

  useEffect(() => {
    if (fireflies.length === 0) return;

    const ctx = gsap.context(() => {
      fireflies.forEach((ff) => {
        const el = document.getElementById(`firefly-${ff.id}`);
        if (!el) return;

        // Random wander animation
        gsap.to(el, {
          x: () => `+=${(Math.random() - 0.5) * 100}`,
          y: () => `+=${(Math.random() - 0.5) * 100 + config.driftY}`,
          duration: ff.duration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });

        // Random twinkling
        gsap.to(el, {
          opacity: 0.1,
          duration: 1 + Math.random() * 2,
          delay: ff.delay,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [fireflies, config]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-0"
      style={{ zIndex: 6 }}
    >
      {fireflies.map((ff) => (
        <div
          key={ff.id}
          id={`firefly-${ff.id}`}
          className="absolute rounded-full mix-blend-screen"
          style={{
            left: `${ff.x}vw`,
            top: `${ff.y}vh`,
            width: '4px',
            height: '4px',
            backgroundColor: ff.color,
            boxShadow: `0 0 10px 2px ${ff.color}`,
            transform: `scale(${ff.scale})`,
            opacity: 0.8
          }}
        />
      ))}
    </div>
  );
});

export default Fireflies;
