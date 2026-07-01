/**
 * SceneFireflies.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Floating fireflies that orbit around the princess and trail along the pathway.
 * Each firefly is a tiny golden dot with a soft bloom and random orbit path.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useMemo } from 'react';
import gsap from 'gsap';

function SceneFireflies({ className = '' }) {
  const containerRef = useRef(null);

  const fireflies = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      // Cluster around center-right to follow princess position
      startX: `${30 + Math.random() * 40}%`,
      startY: `${20 + Math.random() * 60}%`,
      size: Math.random() * 4 + 2,
      color: ['#fde68a', '#fff176', '#fbbf24', '#ffc2d4', '#ffffff'][Math.floor(Math.random() * 5)],
      orbitRadius: Math.random() * 60 + 20,
      orbitSpeed: Math.random() * 4 + 3,
      orbitDelay: Math.random() * -5,
      twinkleSpeed: Math.random() * 2 + 1,
    })),
  []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = containerRef.current?.querySelectorAll('.scene-firefly');
      if (!els) return;

      els.forEach((el, i) => {
        const ff = fireflies[i];
        if (!ff) return;

        // Organic floating movement — figure-eight pattern
        gsap.to(el, {
          x: () => gsap.utils.random(-ff.orbitRadius, ff.orbitRadius),
          y: () => gsap.utils.random(-ff.orbitRadius * 0.6, ff.orbitRadius * 0.6),
          duration: ff.orbitSpeed,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: ff.orbitDelay,
        });

        // Twinkle pulse
        gsap.to(el, {
          opacity: Math.random() * 0.5 + 0.5,
          scale: Math.random() * 0.6 + 0.8,
          duration: ff.twinkleSpeed,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 2,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [fireflies]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 8 }}
    >
      {fireflies.map(ff => (
        <div
          key={ff.id}
          className="scene-firefly absolute rounded-full"
          style={{
            width: ff.size,
            height: ff.size,
            backgroundColor: ff.color,
            left: ff.startX,
            top: ff.startY,
            boxShadow: `0 0 ${ff.size * 3}px ${ff.color}, 0 0 ${ff.size * 6}px ${ff.color}80`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

export default SceneFireflies;
