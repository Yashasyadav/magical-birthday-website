/**
 * PetalSystem.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Rose petal rain — pink, gold, and white petals drift down across the scene.
 * Uses pure CSS animations for GPU-accelerated performance.
 * GSAP fades the container in/out on cue.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { forwardRef, useMemo } from 'react';

const PETAL_COLORS = [
  'rgba(255, 180, 200, 0.85)', // soft pink
  'rgba(253, 164, 175, 0.8)',  // rose
  'rgba(251, 191, 36, 0.7)',   // gold
  'rgba(255, 255, 255, 0.75)', // white
  'rgba(244, 114, 182, 0.7)',  // hot pink
  'rgba(253, 230, 138, 0.8)',  // pale gold
];

function Petal({ style, color, size, rotateSpeed }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...style,
        width: size,
        height: size * 0.6,
        backgroundColor: color,
        borderRadius: '60% 40% 60% 40% / 50% 60% 40% 50%',
        boxShadow: `0 0 ${size * 0.5}px ${color}`,
        animation: style.animation,
        willChange: 'transform',
      }}
    />
  );
}

const PetalSystem = forwardRef(function PetalSystem({ className = '' }, ref) {
  const petals = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => {
      const size     = Math.random() * 14 + 7;    // 7–21px
      const left     = Math.random() * 110 - 5;   // -5% to 105%
      const duration = Math.random() * 8 + 10;    // 10–18s fall
      const delay    = Math.random() * -18;        // pre-populate
      const drift    = Math.random() * 120 - 60;  // horizontal drift px
      const color    = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      const rotation = Math.random() * 720 + 180; // spin amount
      const swayAmt  = Math.random() * 40 + 10;

      return {
        id: i,
        color,
        size,
        style: {
          left:    `${left}%`,
          top:     '-30px',
          opacity: 0,
          // CSS keyframe inline — we define it as a style string
          animation: `
            petalFall-${i % 6} ${duration}s ease-in-out ${delay}s infinite
          `.trim(),
        },
      };
    });
  }, []);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ zIndex: 11, opacity: 0 }} // GSAP controls opacity
    >
      {/* Inject per-petal CSS keyframes dynamically */}
      <style>{`
        @keyframes petalFall-0 {
          0%   { transform: translateY(-30px) translateX(0px) rotate(0deg);   opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.7; }
          100% { transform: translateY(110vh) translateX(60px) rotate(540deg); opacity: 0; }
        }
        @keyframes petalFall-1 {
          0%   { transform: translateY(-30px) translateX(0px) rotate(0deg);    opacity: 0; }
          5%   { opacity: 1; }
          90%  { opacity: 0.6; }
          100% { transform: translateY(110vh) translateX(-80px) rotate(-480deg); opacity: 0; }
        }
        @keyframes petalFall-2 {
          0%   { transform: translateY(-30px) translateX(0px) rotate(0deg);   opacity: 0; }
          5%   { opacity: 0.9; }
          50%  { transform: translateY(55vh) translateX(40px) rotate(300deg); }
          90%  { opacity: 0.5; }
          100% { transform: translateY(110vh) translateX(-20px) rotate(600deg); opacity: 0; }
        }
        @keyframes petalFall-3 {
          0%   { transform: translateY(-30px) translateX(0px) rotate(0deg);    opacity: 0; }
          5%   { opacity: 0.85; }
          40%  { transform: translateY(40vh) translateX(-50px) rotate(-200deg); }
          90%  { opacity: 0.4; }
          100% { transform: translateY(110vh) translateX(70px) rotate(-540deg); opacity: 0; }
        }
        @keyframes petalFall-4 {
          0%   { transform: translateY(-30px) translateX(0px) rotate(0deg);   opacity: 0; }
          5%   { opacity: 1; }
          60%  { transform: translateY(60vh) translateX(30px) rotate(360deg); }
          90%  { opacity: 0.6; }
          100% { transform: translateY(110vh) translateX(-40px) rotate(720deg); opacity: 0; }
        }
        @keyframes petalFall-5 {
          0%   { transform: translateY(-30px) translateX(0px) rotate(0deg);   opacity: 0; }
          5%   { opacity: 0.8; }
          70%  { transform: translateY(70vh) translateX(-60px) rotate(420deg); }
          90%  { opacity: 0.4; }
          100% { transform: translateY(110vh) translateX(30px) rotate(810deg); opacity: 0; }
        }
      `}</style>

      {petals.map(p => (
        <Petal
          key={p.id}
          color={p.color}
          size={p.size}
          style={p.style}
        />
      ))}
    </div>
  );
});

export default PetalSystem;
