/**
 * RoyalPathway.jsx  [UPGRADED — Phase 4 v2]
 * ─────────────────────────────────────────────────────────────────────────────
 * Grand royal pathway with:
 *   • Red/pink carpet down the center
 *   • Gold border trim on carpet edges
 *   • Rose petal clusters at sides
 *   • Golden sparkle dust along the path
 *   • Atmospheric depth mist
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useMemo } from 'react';

/** Individual sparkle dot on the carpet */
function CarpetSparkle({ left, bottom, size, delay, color }) {
  return (
    <div
      className="absolute rounded-full"
      style={{
        left, bottom,
        width: size, height: size,
        backgroundColor: color,
        boxShadow: `0 0 ${size * 3}px ${color}`,
        animation: `twinkle ${1.5 + Math.random() * 2}s ease-in-out ${delay} infinite`,
        zIndex: 1,
      }}
    />
  );
}

function RoyalPathway() {
  const sparkles = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left:   `${20 + Math.random() * 60}%`,
      bottom: `${2 + Math.random() * 40}%`,
      size:   Math.random() * 3 + 1,
      delay:  `${Math.random() * 3}s`,
      color:  ['#fde68a', '#fbbf24', '#ffc2d4', '#ffffff'][Math.floor(Math.random() * 4)],
    })),
  []);

  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-end justify-center overflow-hidden"
      style={{ zIndex: 2 }}
    >
      {/* ── Stone base pathway ───────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '72%',
          clipPath: 'polygon(35% 0%, 65% 0%, 82% 100%, 18% 100%)',
          background: `
            repeating-linear-gradient(
              0deg,
              rgba(50, 38, 18, 0.6) 0px,
              rgba(50, 38, 18, 0.6) 1px,
              transparent 1px,
              transparent 26px
            ),
            linear-gradient(180deg, #1a1208 0%, #2a1f0e 35%, #3d2b12 100%)
          `,
        }}
      />

      {/* ── Royal Carpet (red/pink) ───────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '72%',
          // Carpet is narrower than path, with perspective
          clipPath: 'polygon(40% 0%, 60% 0%, 75% 100%, 25% 100%)',
          background: `
            linear-gradient(180deg, 
              rgba(180, 20, 80, 0.85) 0%, 
              rgba(200, 30, 90, 0.9) 30%, 
              rgba(220, 40, 100, 0.95) 70%, 
              rgba(180, 20, 70, 0.9) 100%
            )
          `,
          zIndex: 1,
        }}
      >
        {/* Carpet pattern — subtle diamond grid */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            repeating-conic-gradient(
              rgba(255,180,200,0.08) 0deg 25deg,
              transparent 25deg 50deg
            )
          `,
          backgroundSize: '30px 30px',
          opacity: 0.7,
        }}/>
      </div>

      {/* ── Gold carpet border — left edge ───────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '72%',
          clipPath: 'polygon(38% 0%, 42% 0%, 27% 100%, 23% 100%)',
          background: 'linear-gradient(180deg, rgba(251,191,36,0.9) 0%, rgba(217,119,6,0.95) 100%)',
          boxShadow: '2px 0 20px rgba(251,191,36,0.4)',
          zIndex: 2,
        }}
      />

      {/* ── Gold carpet border — right edge ──────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '72%',
          clipPath: 'polygon(58% 0%, 62% 0%, 77% 100%, 73% 100%)',
          background: 'linear-gradient(180deg, rgba(251,191,36,0.9) 0%, rgba(217,119,6,0.95) 100%)',
          zIndex: 2,
        }}
      />

      {/* ── Center carpet highlight (moonlight stripe) ────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '72%',
          clipPath: 'polygon(46% 0%, 54% 0%, 60% 100%, 40% 100%)',
          background: 'linear-gradient(180deg, rgba(255,220,255,0.06) 0%, rgba(255,200,220,0.12) 100%)',
          zIndex: 3,
        }}
      />

      {/* ── Side ground (grass/dark) ─────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '22%', height: '50%',
        background: 'linear-gradient(180deg, #0a0f04 0%, #0f1a08 100%)',
        opacity: 0.95,
      }}/>
      <div style={{
        position: 'absolute', bottom: 0, right: 0, width: '22%', height: '50%',
        background: 'linear-gradient(180deg, #0a0f04 0%, #0f1a08 100%)',
        opacity: 0.95,
      }}/>

      {/* ── Sparkle dust on carpet ────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{ zIndex: 4 }}>
        {sparkles.map(s => (
          <CarpetSparkle key={s.id} {...s} />
        ))}
      </div>

      {/* ── Flower petals scattered at carpet edges ───────────────────────── */}
      {[...Array(12)].map((_, i) => {
        const isLeft = i < 6;
        const xPos   = isLeft ? `${6 + i * 2.5}%` : `${75 - (i - 6) * 2.5}%`;
        const yPos   = `${20 + (i % 6) * 12}%`;
        return (
          <div
            key={`petal-cluster-${i}`}
            className="absolute"
            style={{
              left: xPos, bottom: yPos, zIndex: 3,
            }}
          >
            {[0,1,2].map(j => (
              <div key={j} style={{
                position: 'absolute',
                width: 8, height: 6,
                borderRadius: '60% 40% 60% 40% / 50% 60% 40% 50%',
                backgroundColor: ['rgba(255,160,190,0.7)','rgba(251,191,36,0.6)','rgba(255,200,220,0.8)'][j],
                transform: `rotate(${j * 60}deg) translate(${6 - j * 2}px, ${2 - j}px)`,
                boxShadow: '0 0 4px rgba(255,160,190,0.4)',
              }}/>
            ))}
          </div>
        );
      })}

      {/* ── Ground mist ──────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(200,180,255,0.07) 0%, rgba(180,160,255,0.03) 50%, transparent 80%)',
        filter: 'blur(14px)',
        zIndex: 5,
      }}/>

      {/* ── Depth fog (horizon) ──────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: '26%', left: 0, right: 0, height: '10%',
        background: 'linear-gradient(180deg, transparent, rgba(12,8,25,0.5), transparent)',
        filter: 'blur(18px)',
        zIndex: 2,
      }}/>
    </div>
  );
}

export default RoyalPathway;
