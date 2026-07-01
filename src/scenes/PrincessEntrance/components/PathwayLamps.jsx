/**
 * PathwayLamps.jsx  [UPGRADED — Phase 4 v3]
 * ─────────────────────────────────────────────────────────────────────────────
 * Ornate royal lampposts with:
 *   • Detailed golden lamppost with decorative scrollwork arm
 *   • Crystal-clear lantern head with inner warm glow
 *   • Royal purple/pink banner flags hanging below lantern
 *   • Star emblem on each banner
 *   • Ground glow pool when lamp activates
 *   • Sparkle burst animation on lamp-light
 *
 * 5 lamps each side, perspective-scaled from near to far.
 * GSAP selects `.pathway-lamp` and `.lamp-glow` for stagger animation.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { forwardRef } from 'react';

const BANNER_COLORS = ['#7c3aed', '#9d174d', '#7c3aed', '#6d28d9', '#be185d'];

/** Single ornate lamppost */
function Lamppost({ index = 0, style = {}, scale = 1, side = 'left' }) {
  const bannerColor = BANNER_COLORS[index % BANNER_COLORS.length];
  const size = scale;

  return (
    <div
      className="pathway-lamp relative flex flex-col items-center pointer-events-none"
      data-index={index}
      data-side={side}
      style={{
        ...style,
        opacity: 0,       // GSAP controls
        willChange: 'opacity',
        transformOrigin: 'bottom center',
      }}
    >
      {/* ── Lantern Head ────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center">
        {/* Cap / Roof */}
        <div style={{
          width:  22 * size,
          height: 8  * size,
          background: `linear-gradient(180deg, #92400e, #78350f)`,
          clipPath: 'polygon(0% 100%, 5% 0%, 95% 0%, 100% 100%)',
          borderRadius: '1px',
          boxShadow: `0 ${-2*size}px ${6*size}px rgba(180,120,30,0.5)`,
        }}/>

        {/* Finial spike */}
        <div style={{
          width:  0,
          height: 0,
          borderLeft:   `${4*size}px solid transparent`,
          borderRight:  `${4*size}px solid transparent`,
          borderBottom: `${10*size}px solid #92400e`,
          marginTop:    -4 * size,
          position:     'absolute',
          top:          0,
          filter:       'drop-shadow(0 0 4px rgba(251,191,36,0.6))',
        }}/>

        {/* Lantern glass body */}
        <div
          style={{
            width:  20 * size,
            height: 28 * size,
            background: 'linear-gradient(135deg, rgba(180,140,60,0.9) 0%, rgba(120,90,30,0.95) 100%)',
            border: `${1*size}px solid rgba(251,191,36,0.6)`,
            borderRadius: `${2*size}px ${2*size}px ${5*size}px ${5*size}px`,
            boxShadow: `0 0 0 ${1*size}px rgba(180,140,60,0.3)`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Inner warm glow — lamp-glow class for GSAP */}
          <div
            className="lamp-glow absolute inset-0"
            style={{
              opacity: 0,  // GSAP controls
              background: 'radial-gradient(ellipse at center, rgba(255,230,100,1) 0%, rgba(255,170,30,0.8) 50%, rgba(255,100,0,0.2) 100%)',
              borderRadius: 'inherit',
              boxShadow: `0 0 ${20*size}px rgba(255,200,60,0.9), 0 0 ${40*size}px rgba(255,150,20,0.5)`,
              zIndex: 2,
            }}
          />
          {/* Cross bars */}
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', opacity:0.6, zIndex:3 }}>
            <div style={{ width:'100%', height: 1*size, background:'rgba(180,140,60,0.8)' }}/>
          </div>
          <div style={{ position:'absolute', inset:0, display:'flex', justifyContent:'center', opacity:0.6, zIndex:3 }}>
            <div style={{ width: 1*size, height:'100%', background:'rgba(180,140,60,0.8)' }}/>
          </div>
        </div>

        {/* Bracket arm curving from post to lantern */}
        <div style={{
          position:    'absolute',
          top:         22 * size,
          right:       '50%',
          width:       24 * size,
          height:      12 * size,
          border:      `${2*size}px solid rgba(146,64,14,0.8)`,
          borderTop:   'none',
          borderRight: 'none',
          borderRadius:`0 0 0 ${8*size}px`,
          marginRight: 10 * size,
        }}/>
      </div>

      {/* ── Royal Banner ────────────────────────────────────────────── */}
      <div style={{
        width:           16 * size,
        height:          28 * size,
        background:      `linear-gradient(180deg, ${bannerColor} 0%, ${bannerColor}dd 70%, transparent 100%)`,
        border:          `${1*size}px solid rgba(251,191,36,0.4)`,
        borderRadius:    `0 0 ${6*size}px ${6*size}px`,
        boxShadow:       `0 0 ${8*size}px ${bannerColor}60`,
        position:        'relative',
        marginTop:       2 * size,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
      }}>
        {/* Crown / Star emblem on banner */}
        <div style={{
          width:       10 * size,
          height:      10 * size,
          background:  'radial-gradient(circle, #fde68a, #d97706)',
          clipPath:    'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          filter:      `drop-shadow(0 0 ${3*size}px rgba(251,191,36,0.8))`,
        }}/>
      </div>

      {/* ── Post stem ───────────────────────────────────────────────── */}
      <div style={{
        width:        6 * size,
        height:       `${8 + 2/size}vh`,
        minHeight:    48 * size,
        background:   'linear-gradient(180deg, #92400e 0%, #78350f 40%, #451a03 100%)',
        borderRadius: `${3*size}px`,
        boxShadow:    `inset ${2*size}px 0 ${4*size}px rgba(255,200,80,0.2), ${-1*size}px 0 ${6*size}px rgba(0,0,0,0.6)`,
        marginTop:    2 * size,
      }}/>

      {/* ── Ornate base ─────────────────────────────────────────────── */}
      <div style={{
        width:        16 * size,
        height:       8  * size,
        background:   'linear-gradient(180deg, #78350f, #451a03)',
        borderRadius: `${2*size}px ${2*size}px ${4*size}px ${4*size}px`,
        boxShadow:    `0 ${2*size}px ${8*size}px rgba(0,0,0,0.8)`,
      }}/>

      {/* ── Flower Pot (Tangled themed flower pot) ────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 10 * size,
          width: 20 * size,
          height: 24 * size,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end',
          zIndex: 4,
        }}
      >
        {/* Flowers overflowing */}
        <div
          style={{
            position: 'absolute',
            bottom: 14 * size,
            width: 28 * size,
            height: 18 * size,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignContent: 'center',
            gap: 2 * size,
            zIndex: 2,
          }}
        >
          {[
            { color: '#ec4899', top: 0, left: 2 },
            { color: '#a78bfa', top: -4, left: 10 },
            { color: '#fbbf24', top: 2, left: 16 },
            { color: '#ec4899', top: 4, left: 6 },
            { color: '#c4b5fd', top: 6, left: 12 },
            { color: '#f472b6', top: -2, left: 4 },
          ].map((f, idx) => (
            <div
              key={idx}
              style={{
                width: 7 * size,
                height: 7 * size,
                backgroundColor: f.color,
                borderRadius: '50%',
                boxShadow: `0 0 6px ${f.color}`,
                position: 'relative',
                transform: `translate(${f.left * size * 0.4}px, ${f.top * size * 0.4}px)`,
                animation: `tiaraSparkle ${2.5 + idx * 0.3}s ease-in-out ${idx * 0.2}s infinite`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '30%',
                  backgroundColor: '#ffffff',
                  borderRadius: '50%',
                }}
              />
            </div>
          ))}
        </div>

        {/* The Golden Urn / Pot */}
        <div
          style={{
            width: 18 * size,
            height: 16 * size,
            background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 70%, #92400e 100%)',
            border: `${1 * size}px solid rgba(251, 191, 36, 0.8)`,
            borderRadius: `${2 * size}px ${2 * size}px ${8 * size}px ${8 * size}px`,
            boxShadow: `0 ${3 * size}px ${8 * size}px rgba(0,0,0,0.6), inset 0 ${1 * size}px ${3 * size}px rgba(255,255,255,0.4)`,
            zIndex: 1,
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: -1 * size,
              width: 20 * size,
              height: 3 * size,
              background: '#fbbf24',
              borderRadius: `${1 * size}px`,
              boxShadow: `0 ${1 * size}px ${3 * size}px rgba(0,0,0,0.3)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 6 * size,
              height: 6 * size,
              borderRadius: '50%',
              background: '#fff176',
              boxShadow: '0 0 4px #fbbf24',
            }}
          />
        </div>
      </div>

      {/* ── Ground glow pool (lamp-glow class) ──────────────────────── */}
      <div
        className="lamp-glow"
        style={{
          position:  'absolute',
          bottom:    -10 * size,
          left:      '50%',
          transform: 'translateX(-50%)',
          width:     80 * size,
          height:    30 * size,
          background:'radial-gradient(ellipse at center, rgba(255,200,60,0.5) 0%, transparent 70%)',
          filter:    `blur(${10*size}px)`,
          opacity:   0,  // GSAP controls
          zIndex:    -1,
        }}
      />
    </div>
  );
}

// ── PathwayLamps — 5 lamps each side ──────────────────────────────────────────
const PathwayLamps = forwardRef(function PathwayLamps({ className = '' }, ref) {
  const lampCount = 5;

  return (
    <div
      ref={ref}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 7 }}
    >
      {/* LEFT SIDE LAMPS */}
      {Array.from({ length: lampCount }).map((_, i) => {
        const progress = i / (lampCount - 1);     // 0=near camera, 1=near castle
        const scale    = 1 - progress * 0.52;     // 1.0 → 0.48
        const bottom   = `${6 + progress * 20}vh`;
        const left     = `${18 + progress * 17}%`;

        return (
          <Lamppost
            key={`left-${i}`}
            index={i}
            scale={scale}
            side="left"
            style={{
              position:        'absolute',
              bottom,
              left,
              transform:       `scale(${scale})`,
              transformOrigin: 'bottom center',
            }}
          />
        );
      })}

      {/* RIGHT SIDE LAMPS (mirror) */}
      {Array.from({ length: lampCount }).map((_, i) => {
        const progress = i / (lampCount - 1);
        const scale    = 1 - progress * 0.52;
        const bottom   = `${6 + progress * 20}vh`;
        const right    = `${18 + progress * 17}%`;

        return (
          <Lamppost
            key={`right-${i}`}
            index={i}
            scale={scale}
            side="right"
            style={{
              position:        'absolute',
              bottom,
              right,
              transform:       `scale(${scale}) scaleX(-1)`,
              transformOrigin: 'bottom center',
            }}
          />
        );
      })}
    </div>
  );
});

export default PathwayLamps;
