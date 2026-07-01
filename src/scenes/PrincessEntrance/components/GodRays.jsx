/**
 * GodRays.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Warm castle light god rays emanating from the doorway.
 * Uses layered CSS conic gradients blurred into soft shafts.
 * Also renders the moonlight rim + soft bloom overlay.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { forwardRef } from 'react';

const GodRays = forwardRef(function GodRays({ className = '' }, ref) {
  return (
    <div
      ref={ref}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 4, opacity: 0 }} // GSAP controls
    >
      {/* ── Primary God Rays from doorway ────────────────────────────────── */}
      <div
        className="absolute"
        style={{
          width: '100%',
          height: '100%',
          top: 0, left: 0,
          background: `
            conic-gradient(
              from 85deg at 50% 55%,
              transparent 0deg,
              rgba(255,200,80,0.08) 3deg,
              transparent 6deg,
              rgba(255,180,60,0.06) 10deg,
              transparent 14deg,
              rgba(255,200,100,0.09) 19deg,
              transparent 24deg,
              rgba(255,160,40,0.05) 28deg,
              transparent 32deg,
              rgba(255,200,80,0.07) 38deg,
              transparent 42deg,
              transparent 180deg
            )
          `,
          filter: 'blur(18px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Secondary wide bloom ─────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{
          width: '120%',
          height: '80%',
          bottom: 0,
          left: '-10%',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,180,60,0.25) 0%, rgba(255,140,30,0.1) 40%, transparent 70%)',
          filter: 'blur(30px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* ── Atmospheric dust particles in the light shaft ─────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(255,220,120,0.04) 0%, transparent 50%)',
          filter: 'blur(2px)',
        }}
      />

      {/* ── Soft golden bloom halo around door ──────────────────────────── */}
      <div
        className="absolute"
        style={{
          width: '50%',
          height: '60%',
          top: '20%',
          left: '25%',
          background: 'radial-gradient(ellipse at center, rgba(255,200,100,0.12) 0%, transparent 65%)',
          filter: 'blur(25px)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
});

/**
 * MoonRimLight — soft bluish-white moonlight from above/behind
 */
export const MoonRimLight = forwardRef(function MoonRimLight(_, ref) {
  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 3, opacity: 0 }} // GSAP controls
    >
      {/* Moonlight from above — cold blue-white */}
      <div
        className="absolute"
        style={{
          width: '80%',
          height: '70%',
          top: '-10%',
          left: '10%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(180,210,255,0.12) 0%, rgba(140,180,255,0.05) 50%, transparent 80%)',
          filter: 'blur(20px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Princess rim light — the backlit halo highlight on her silhouette */}
      <div
        className="absolute"
        style={{
          width: '30%',
          height: '70%',
          top: '5%',
          left: '35%',
          background: 'radial-gradient(ellipse at 50% 50%, rgba(200,220,255,0.1) 0%, transparent 70%)',
          filter: 'blur(12px)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
});

export default GodRays;
