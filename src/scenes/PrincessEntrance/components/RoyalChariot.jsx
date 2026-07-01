/**
 * RoyalChariot.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a majestic royal horse-drawn chariot (pumpkin/circular carriage)
 * that is centered perfectly on the pathway:
 *   • The main carriage body is centered exactly at X = 0 (of the container)
 *   • Two majestic horse silhouettes are placed off-center to the left
 *   • A passenger door that can rotate open (connected to doorLeftRef)
 *   • Glowing interior coach window and golden carriage details
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { forwardRef } from 'react';

const RoyalChariot = forwardRef(function RoyalChariot(
  { doorLeftRef, lightLeakRef },
  chariotRef
) {
  return (
    <div
      ref={chariotRef}
      className="absolute pointer-events-none"
      style={{
        top: '12%',
        left: '50%',
        width: 'clamp(200px, 30vw, 420px)', // represents the carriage body itself!
        height: 'clamp(180px, 26vh, 360px)',
        zIndex: 5,
        willChange: 'transform, opacity',
      }}
    >
      {/* ── 1. Harness Horses (placed to the left of the carriage) ───────── */}
      <div
        className="absolute"
        style={{
          right: '92%', // extends to the left of the carriage body!
          bottom: '10%',
          width: '75%',
          height: '60%',
          opacity: 0.88,
          zIndex: 1,
        }}
      >
        <svg viewBox="0 0 120 80" className="w-full h-full" style={{ fill: '#060312' }}>
          {/* Horse 1 (Background shadow horse) */}
          <path
            d="M80,45 C75,40 68,38 60,40 C52,42 45,35 48,22 C50,15 45,8 38,5 C32,2 28,10 32,15 C36,20 38,26 32,32 C26,38 18,36 10,42 C2,48 5,55 12,58 C18,60 25,58 32,62 C38,66 42,75 48,78 C52,80 55,75 52,68 C50,60 58,58 68,58 C78,58 82,52 80,45 Z"
            style={{ opacity: 0.5, transform: 'translate(-5px, -3px)' }}
          />
          {/* Horse 2 (Main foreground horse silhouette) */}
          <path d="M80,45 C75,40 68,38 60,40 C52,42 45,35 48,22 C50,15 45,8 38,5 C32,2 28,10 32,15 C36,20 38,26 32,32 C26,38 18,36 10,42 C2,48 5,55 12,58 C18,60 25,58 32,62 C38,66 42,75 48,78 C52,80 55,75 52,68 C50,60 58,58 68,58 C78,58 82,52 80,45 Z" />
          {/* Harness / Reins line */}
          <path
            d="M38,15 L78,32 M78,32 L110,42"
            stroke="#d97706"
            strokeWidth="1.2"
            fill="none"
            strokeDasharray="2,2"
          />
        </svg>
      </div>

      {/* ── 2. Carriage Main Structure (Centered inside the container) ── */}
      <div
        className="absolute inset-0"
        style={{
          zIndex: 2,
        }}
      >
        {/* Carriage wheel - Back (large ornate) */}
        <div
          className="absolute"
          style={{
            bottom: '-4%',
            left: '8%',
            width: '36%',
            height: '36%',
            borderRadius: '50%',
            border: '3px solid #fbbf24',
            background: 'radial-gradient(circle, transparent 20%, #d97706 30%, transparent 40%)',
            boxShadow: '0 0 10px rgba(217,119,6,0.6)',
            zIndex: 1,
            animation: 'wheelSpin 8s linear infinite',
          }}
        >
          {/* Spokes */}
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <div
              key={deg}
              style={{
                position: 'absolute',
                top: '50%',
                left: '5%',
                right: '5%',
                height: '2px',
                backgroundColor: '#fbbf24',
                transform: `rotate(${deg}deg)`,
              }}
            />
          ))}
        </div>

        {/* Carriage wheel - Front (smaller ornate) */}
        <div
          className="absolute"
          style={{
            bottom: '-4%',
            right: '8%',
            width: '28%',
            height: '28%',
            borderRadius: '50%',
            border: '2px solid #fbbf24',
            background: 'radial-gradient(circle, transparent 20%, #d97706 30%, transparent 40%)',
            boxShadow: '0 0 8px rgba(217,119,6,0.6)',
            zIndex: 1,
            animation: 'wheelSpin 8s linear infinite',
          }}
        >
          {[0, 45, 90, 135].map((deg) => (
            <div
              key={deg}
              style={{
                position: 'absolute',
                top: '50%',
                left: '5%',
                right: '5%',
                height: '1.5px',
                backgroundColor: '#fbbf24',
                transform: `rotate(${deg}deg)`,
              }}
            />
          ))}
        </div>

        {/* Carriage Body (Centered Pumpkin/Crown Silhouette) */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            clipPath: 'ellipse(45% 42% at 50% 46%)',
            background: 'linear-gradient(135deg, #1f0f3d 0%, #0c051a 100%)',
            border: '3px solid #fbbf24',
            boxShadow: 'inset 0 0 25px rgba(251,191,36,0.3), 0 0 30px rgba(0,0,0,0.8)',
            zIndex: 2,
          }}
        >
          {/* Glowing Coach window */}
          <div
            style={{
              width: '32%',
              height: '32%',
              borderRadius: '25%',
              background: 'radial-gradient(circle at center, #fffbeb 20%, #fef08a 60%, #fbbf24 100%)',
              border: '2px solid #d97706',
              boxShadow: '0 0 20px rgba(251,191,36,0.9), inset 0 0 8px rgba(217,119,6,0.5)',
              position: 'relative',
              top: '-6%',
            }}
          >
            {/* Window cross bar */}
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1.5, backgroundColor: '#b45309', opacity: 0.7 }} />
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1.5, backgroundColor: '#b45309', opacity: 0.7 }} />
          </div>
        </div>

        {/* Golden Carriage Crown on top */}
        <div
          className="absolute"
          style={{
            top: '0%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '18%',
            height: '12%',
            background: 'radial-gradient(circle at center, #fbbf24, #d97706)',
            clipPath: 'polygon(0% 100%, 15% 0%, 50% 60%, 85% 0%, 100% 100%)',
            zIndex: 3,
            filter: 'drop-shadow(0 0 6px #fbbf24)',
          }}
        />

        {/* ── 3. Passenger Chariot Door (Centered on carriage body) ────── */}
        <div
          ref={doorLeftRef}
          className="absolute"
          style={{
            left: '36%',
            top: '20%',
            width: '28%',
            height: '52%',
            zIndex: 4,
            transformStyle: 'preserve-3d',
            transformOrigin: '0% 50%', // hinges on the left
          }}
        >
          <div
            className="w-full h-full rounded-md"
            style={{
              background: 'linear-gradient(135deg, #2d1854 0%, #15092b 100%)',
              border: '2px solid #fbbf24',
              boxShadow: 'inset 0 0 10px rgba(251,191,36,0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Door handle */}
            <div
              style={{
                position: 'absolute',
                right: '12%',
                top: '48%',
                width: '6px',
                height: '10px',
                borderRadius: '2px',
                background: 'linear-gradient(to bottom, #fff176, #fbbf24)',
                boxShadow: '0 0 4px #fbbf24',
              }}
            />
            {/* Crown stamp on door */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '25%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '8px',
                background: '#fbbf24',
                clipPath: 'polygon(0% 100%, 20% 20%, 50% 70%, 80% 20%, 100% 100%)',
                opacity: 0.7,
              }}
            />
          </div>
        </div>

        {/* ── 4. Golden Chariot Light Leak ─────────────────────────────── */}
        <div
          ref={lightLeakRef}
          className="absolute"
          style={{
            left: '30%',
            top: '18%',
            width: '40%',
            height: '60%',
            opacity: 0,
            background: 'radial-gradient(ellipse at center, rgba(255,225,120,0.95) 0%, rgba(251,191,36,0.6) 50%, transparent 80%)',
            filter: 'blur(8px)',
            zIndex: 1,
          }}
        />

        {/* Carriage Chassis / Steps */}
        <div
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '26%',
            width: '48%',
            height: '6%',
            background: 'linear-gradient(to right, #78350f, #d97706, #78350f)',
            border: '1px solid #fbbf24',
            borderRadius: '2px',
            zIndex: 1,
          }}
        />
      </div>

      {/* Wheel spin keyframes styling */}
      <style>{`
        @keyframes wheelSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

export default RoyalChariot;
