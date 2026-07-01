/**
 * BirthdayTitle.jsx  [UPGRADED — Phase 4 v2]
 * ─────────────────────────────────────────────────────────────────────────────
 * Grand cinematic birthday text inspired by the reference design.
 *
 * Layout:
 *   ✨ Happy Birthday ✨          ← shimmer gold, Playfair Display
 *   [NAME]                        ← massive Dancing Script, golden glow
 *   "You are the Princess         ← italic script subtitle
 *    of our hearts!"
 *
 * All elements start at opacity 0 — GSAP master timeline controls them.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { forwardRef } from 'react';

const BirthdayTitle = forwardRef(function BirthdayTitle(
  { titleRef, nameRef, subtitleRef, name = 'Bhavani' },
  _ref
) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ zIndex: 15 }}
    >
      {/* ── Frosted glass backdrop ────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 55vw, 700px)',
          height: 'clamp(200px, 40vh, 440px)',
          background: 'radial-gradient(ellipse at center, rgba(60,20,80,0.55) 0%, rgba(30,10,60,0.45) 60%, transparent 90%)',
          filter: 'blur(2px)',
          borderRadius: '50%',
          zIndex: -1,
        }}
      />

      {/* ── ✨ Happy Birthday ✨ ─────────────────────────────────────── */}
      <div
        ref={titleRef}
        style={{ opacity: 0, textAlign: 'center' }}
      >
        {/* Decorative stars row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 4 }}>
          {['✦', '✧', '✦', '✧', '✦'].map((s, i) => (
            <span key={i} style={{
              color: '#fbbf24',
              fontSize: 'clamp(10px, 1.4vw, 20px)',
              filter: 'drop-shadow(0 0 6px rgba(251,191,36,0.9))',
              animation: `tiaraSparkle ${2 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
            }}>{s}</span>
          ))}
        </div>

        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize:   'clamp(1.4rem, 4.5vw, 3.2rem)',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            // Shimmer gold gradient
            background: 'linear-gradient(135deg, #fde68a 0%, #ffffff 20%, #fbbf24 40%, #fff176 60%, #f59e0b 80%, #fde68a 100%)',
            backgroundSize: '300% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite',
            filter: 'drop-shadow(0 0 16px rgba(255,200,80,0.8))',
          }}
        >
          ✨ Happy Birthday ✨
        </h1>

        {/* Decorative golden divider */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8, marginTop: 6,
        }}>
          <div style={{ flex: 1, height: 1, maxWidth: 80,
            background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.8))',
          }}/>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#fbbf24',
            boxShadow: '0 0 10px rgba(251,191,36,1), 0 0 20px rgba(251,191,36,0.6)',
          }}/>
          <div style={{
            width: 4, height: 4, borderRadius: '50%',
            background: '#fde68a',
            boxShadow: '0 0 6px rgba(253,230,138,1)',
          }}/>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: '#fbbf24',
            boxShadow: '0 0 10px rgba(251,191,36,1), 0 0 20px rgba(251,191,36,0.6)',
          }}/>
          <div style={{ flex: 1, height: 1, maxWidth: 80,
            background: 'linear-gradient(90deg, rgba(251,191,36,0.8), transparent)',
          }}/>
        </div>
      </div>

      {/* ── BHAVANI — The Name (giant, glittering) ────────────────────── */}
      <div
        ref={nameRef}
        style={{ opacity: 0, textAlign: 'center', marginTop: 8 }}
      >
        <div
          style={{
            fontFamily: 'var(--font-script)',
            fontSize:   'clamp(3.5rem, 12vw, 9rem)',
            lineHeight: 1,
            fontWeight: 700,
            // Rose-gold metallic gradient
            background: 'linear-gradient(135deg, #ffc2d4 0%, #ffffff 15%, #fbbf24 30%, #f472b6 45%, #ffffff 60%, #fbbf24 75%, #ffc2d4 100%)',
            backgroundSize: '250% auto',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 4s linear infinite',
            filter: 'drop-shadow(0 0 30px rgba(255,180,200,0.9)) drop-shadow(0 0 60px rgba(251,191,36,0.5))',
            textShadow: 'none',
          }}
        >
          {name}
        </div>

        {/* Sparkles around the name */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 'clamp(8px, 2vw, 20px)',
          marginTop: 4,
        }}>
          {['✦','✦','✦','✦','✦','✦','✦'].map((s, i) => (
            <span key={i} style={{
              color: i % 2 === 0 ? '#fbbf24' : '#f472b6',
              fontSize: 'clamp(8px, 1.2vw, 16px)',
              filter: `drop-shadow(0 0 6px ${i % 2 === 0 ? 'rgba(251,191,36,0.9)' : 'rgba(244,114,182,0.9)'})`,
              animation: `tiaraSparkle ${1.8 + i * 0.3}s ease-in-out ${i * 0.25}s infinite`,
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── "You are the Princess of our hearts!" ────────────────────── */}
      <div
        ref={subtitleRef}
        style={{ opacity: 0, textAlign: 'center', marginTop: 10 }}
      >
        <p
          style={{
            fontFamily: 'var(--font-script)',
            fontSize:   'clamp(1rem, 3vw, 2rem)',
            fontStyle:  'italic',
            // Soft pink-white gradient
            background: 'linear-gradient(135deg, rgba(255,180,200,0.95) 0%, rgba(255,255,255,0.9) 40%, rgba(253,230,138,0.9) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 12px rgba(255,160,190,0.7))',
            lineHeight: 1.4,
          }}
        >
          May all your dreams come true<br />on this magical day! ✨
        </p>
      </div>
    </div>
  );
});

export default BirthdayTitle;
