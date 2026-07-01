/**
 * CastleDoors.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders the castle doorway with:
 *   - Two heavy oak/stone doors (left + right)
 *   - Warm golden light leak from within
 *   - Fog drifting outward
 *   - Magical particles floating from the opening
 *
 * Refs are forwarded to the parent for master timeline control.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { forwardRef, useMemo } from 'react';

const CastleDoors = forwardRef(function CastleDoors(
  { className = '' },
  ref
) {
  // Generate magic particles that float from the doorway
  const particles = useMemo(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      size: Math.random() * 5 + 2,
      color: ['#fde68a', '#fff176', '#fbbf24', '#ffffff', '#ffc2d4'][Math.floor(Math.random() * 5)],
      x: `${40 + Math.random() * 20}%`,
      y: `${20 + Math.random() * 60}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${Math.random() * 3 + 2}s`,
    })),
  []);

  return (
    <div
      ref={ref}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
      style={{ zIndex: 5 }}
    >
      {/* ── Castle Archway / Frame ─────────────────────────────────────────── */}
      <div className="relative flex items-end justify-center" style={{ width: '36vw', maxWidth: 520, minWidth: 260 }}>

        {/* Stone archway frame */}
        <div
          className="absolute inset-0 rounded-t-full"
          style={{
            background: 'linear-gradient(180deg, #2a1f0e 0%, #1a1208 60%, #0f0b07 100%)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.9)',
            border: '3px solid rgba(180,140,60,0.4)',
            height: '82%',
          }}
        />

        {/* Decorative arch stones */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-t-full"
          style={{
            width: '106%',
            height: '105%',
            background: 'transparent',
            border: '6px solid rgba(120,90,30,0.5)',
            borderBottom: 'none',
            top: '-3px',
          }}
        />

        {/* ── Warm Golden Light Leak (from within castle) ────────────────── */}
        {/* This ref is controlled by master timeline */}
        <div
          className="absolute inset-0 rounded-t-full"
          style={{
            background: 'radial-gradient(ellipse at 50% 100%, rgba(255,200,80,0.95) 0%, rgba(255,160,40,0.7) 30%, rgba(255,120,20,0.3) 60%, transparent 85%)',
            filter: 'blur(4px)',
            opacity: 0, // Starts hidden — GSAP controls
            zIndex: 3,
          }}
        />

        {/* ── Door Container (perspective) ──────────────────────────────── */}
        <div
          className="relative w-full overflow-hidden rounded-t-full"
          style={{
            height: '100%',
            perspective: '800px',
            perspectiveOrigin: '50% 100%',
          }}
        >
          {/* Left Door */}
          <div
            className="absolute top-0 left-0 w-1/2 h-full"
            style={{
              transformOrigin: 'left center',
              transformStyle: 'preserve-3d',
              zIndex: 4,
            }}
          >
            <div
              className="w-full h-full rounded-tl-full"
              style={{
                background: 'linear-gradient(135deg, #3d2b0e 0%, #2a1d09 40%, #1c1307 80%, #0f0b07 100%)',
                borderRight: '2px solid rgba(120,80,20,0.5)',
                boxShadow: 'inset -10px 0 30px rgba(0,0,0,0.6), inset 5px 0 15px rgba(180,120,40,0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Door panel details */}
              <div className="absolute inset-4 flex flex-col gap-3 opacity-40">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="rounded border border-yellow-900/30"
                    style={{ flex: 1, background: 'rgba(80,50,10,0.3)' }}
                  />
                ))}
              </div>
              {/* Door handle */}
              <div
                className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ background: 'radial-gradient(circle, #fde68a, #d97706)', boxShadow: '0 0 8px rgba(251,191,36,0.8)' }}
              />
            </div>
          </div>

          {/* Right Door */}
          <div
            className="absolute top-0 right-0 w-1/2 h-full"
            style={{
              transformOrigin: 'right center',
              transformStyle: 'preserve-3d',
              zIndex: 4,
            }}
          >
            <div
              className="w-full h-full rounded-tr-full"
              style={{
                background: 'linear-gradient(225deg, #3d2b0e 0%, #2a1d09 40%, #1c1307 80%, #0f0b07 100%)',
                borderLeft: '2px solid rgba(120,80,20,0.5)',
                boxShadow: 'inset 10px 0 30px rgba(0,0,0,0.6), inset -5px 0 15px rgba(180,120,40,0.2)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Door panels */}
              <div className="absolute inset-4 flex flex-col gap-3 opacity-40">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="rounded border border-yellow-900/30"
                    style={{ flex: 1, background: 'rgba(80,50,10,0.3)' }}
                  />
                ))}
              </div>
              {/* Handle */}
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ background: 'radial-gradient(circle, #fde68a, #d97706)', boxShadow: '0 0 8px rgba(251,191,36,0.8)' }}
              />
            </div>
          </div>
        </div>

        {/* ── Magic Particles from doorway ───────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 6 }}>
          {particles.map(p => (
            <div
              key={p.id}
              className="magic-particle absolute rounded-full opacity-0"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
                left: p.x,
                top: p.y,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        {/* ── Fog layers ────────────────────────────────────────────────── */}
        {/* Left fog */}
        <div
          className="absolute pointer-events-none opacity-0"
          style={{
            width: '60%',
            height: '40%',
            bottom: '5%',
            left: '0',
            background: 'radial-gradient(ellipse at right, rgba(255,220,180,0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: 7,
          }}
        />
        {/* Right fog */}
        <div
          className="absolute pointer-events-none opacity-0"
          style={{
            width: '60%',
            height: '40%',
            bottom: '5%',
            right: '0',
            background: 'radial-gradient(ellipse at left, rgba(255,220,180,0.4) 0%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: 7,
          }}
        />
      </div>
    </div>
  );
});

export default CastleDoors;
