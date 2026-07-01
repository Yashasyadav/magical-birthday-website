/**
 * CheeringCrowd.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Stylized silhouettes of cheering spectators lining both sides of the pathway.
 * They wave, cheer, bounce, and hold glowing flags.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useMemo } from 'react';

const CheererVariants = [
  // 1. Waving hands cheerer
  function Cheerer1({ size, color }) {
    return (
      <svg viewBox="0 0 24 32" style={{ fill: color, width: '100%', height: '100%' }}>
        <circle cx="12" cy="8" r="4.2" />
        <path d="M12 14c-3.3 0-6 2.7-6 6v12h12V20c0-3.3-2.7-6-6-6z" />
        <path d="M6 16c-1.5-2-3-4.5-4-5-.5-.3-.9 0-1 .5s0 .9.5 1.2c1.2.8,2.8 3.5,4.5 5.3v-2z" />
        <path d="M18 16c1.5-2 3-4.5 4-5 .5-.3.9 0 1 .5s0 .9-.5 1.2c-1.2.8-2.8 3.5-4.5 5.3v-2z" />
      </svg>
    );
  },
  // 2. Waving flag cheerer
  function Cheerer2({ size, color }) {
    return (
      <svg viewBox="0 0 24 32" style={{ fill: color, width: '100%', height: '100%' }}>
        <circle cx="12" cy="8" r="4.2" />
        <path d="M12 14c-3.3 0-6 2.7-6 6v12h12V20c0-3.3-2.7-6-6-6z" />
        <path d="M18 16c1-1.5, 2-3.5, 2.5-5.5.2-.8.8-1 1-.5.3.5.2 1.2-.2 2.2C21 13 20.5 15, 20 17v-1z" />
        <path d="M21.5 5l2.2 1.8-2.2 1.8-2.2-1.8z" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }} />
        <line x1="20" y1="11" x2="21.5" y2="4" stroke={color} strokeWidth="1.2" />
      </svg>
    );
  },
  // 3. Hands high cheering
  function Cheerer3({ size, color }) {
    return (
      <svg viewBox="0 0 24 32" style={{ fill: color, width: '100%', height: '100%' }}>
        <circle cx="12" cy="8" r="4.2" />
        <path d="M12 14c-3.3 0-6 2.7-6 6v12h12V20c0-3.3-2.7-6-6-6z" />
        <path d="M4 18c0-3, 2-5, 3-6 .5-.5.9 0 .7.5C7 14, 6 16, 6 18h-2z" />
        <path d="M20 18c0-3-2-5-3-6-.5-.5-.9 0-.7.5.7 1.5,1.7 3.5,1.7 5.5h2z" />
      </svg>
    );
  }
];

function SingleSpectator({ index, scale, style }) {
  const Cheerer = CheererVariants[index % CheererVariants.length];
  const size = scale;

  // Alternating purple-blue backlights for spectator highlights
  const glowColor = index % 2 === 0 ? 'rgba(167,139,250,0.45)' : 'rgba(244,114,182,0.45)';
  const animationType = index % 3 === 0 ? 'cheerBounce' : index % 3 === 1 ? 'cheerWave' : 'cheerBounceFast';

  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none"
      style={{
        ...style,
        width: 90 * size,
        height: 120 * size,
        transformOrigin: 'bottom center',
        color: '#080514', // very dark deep navy for silhouette
        animation: `${animationType} ${1.8 + (index % 4) * 0.4}s ease-in-out ${(index % 3) * 0.2}s infinite`,
        filter: `drop-shadow(0 0 ${12 * size}px ${glowColor})`,
        zIndex: 5,
      }}
    >
      <Cheerer size={size} color="currentColor" />
    </div>
  );
}

export default function CheeringCrowd() {
  const count = 5;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }}>
      {/* ── Left Side Spectators ───────────────────────────────────────── */}
      {Array.from({ length: count }).map((_, i) => {
        const progress = i / (count - 1);
        const scale = 1.25 - progress * 0.6; // scale with perspective (larger base scale)
        const bottom = `${6 + progress * 20}vh`;
        const left = `${11 + progress * 17}%`; // stands slightly outside pathway lamps

        return (
          <SingleSpectator
            key={`left-spectator-${i}`}
            index={i}
            scale={scale}
            style={{
              bottom,
              left,
              transform: `scale(${scale})`,
            }}
          />
        );
      })}

      {/* ── Right Side Spectators ──────────────────────────────────────── */}
      {Array.from({ length: count }).map((_, i) => {
        const progress = i / (count - 1);
        const scale = 1.25 - progress * 0.6;
        const bottom = `${6 + progress * 20}vh`;
        const right = `${11 + progress * 17}%`;

        return (
          <SingleSpectator
            key={`right-spectator-${i}`}
            index={i + count}
            scale={scale}
            style={{
              bottom,
              right,
              transform: `scale(${scale}) scaleX(-1)`, // mirror on right
            }}
          />
        );
      })}

      {/* CSS Animation injection */}
      <style>{`
        @keyframes cheerBounce {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-5px) scaleY(1.04); }
        }
        @keyframes cheerBounceFast {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-8px) scaleY(1.06); }
        }
        @keyframes cheerWave {
          0%, 100% { transform: rotate(-4deg); }
          50% { transform: rotate(4deg); }
        }
      `}</style>
    </div>
  );
}
