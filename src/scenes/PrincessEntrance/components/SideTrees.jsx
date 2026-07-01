/**
 * SideTrees.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Dark silhouette pine/fir trees framing both sides of the royal pathway.
 *
 * Creates a natural canopy framing effect with:
 *   • Layered triangular pine silhouettes (CSS clip-path)
 *   • Atmospheric purple/pink glow at tree bases from lamplight
 *   • Varying tree heights for natural look
 *   • Perspective: trees near camera are taller and wider
 *   • Subtle firefly glow behind trees
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useMemo } from 'react';

// ── Single highly realistic pine tree with layered branch shading ──────────────────
function PineTree({ height, baseWidth, colorDark = '#04020a', glowColor = '#7c3aed', glowOpacity = 0.3 }) {
  return (
    <div
      className="relative flex flex-col items-center pointer-events-none"
      style={{
        width: baseWidth,
        height,
        flexShrink: 0,
        filter: `drop-shadow(0 0 ${10}px ${glowColor}${Math.floor(glowOpacity * 150).toString(16).padStart(2,'0')})`,
      }}
    >
      <svg
        viewBox="0 0 100 150"
        className="w-full h-full"
      >
        <defs>
          {/* Detailed gradients for trunk and foliage layers */}
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e0f05" />
            <stop offset="50%" stopColor="#3d1b02" />
            <stop offset="100%" stopColor="#120701" />
          </linearGradient>
          
          <linearGradient id="foliageGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3318" />
            <stop offset="100%" stopColor="#081005" />
          </linearGradient>

          <linearGradient id="foliageGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13230f" />
            <stop offset="100%" stopColor="#040b03" />
          </linearGradient>

          <linearGradient id="foliageGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0b1708" />
            <stop offset="100%" stopColor="#010301" />
          </linearGradient>
        </defs>

        {/* Tree Trunk */}
        <path d="M47,100 L53,100 L55,145 L45,145 Z" fill="url(#trunkGrad)" />

        {/* Layer 5 (Bottom branches, widest) */}
        <path 
          d="M20,110 Q28,95 38,98 Q32,96 24,93 Q34,80 50,85 Q66,80 76,93 Q68,96 62,98 Q72,95 80,110 Q50,115 20,110 Z" 
          fill="url(#foliageGrad3)" 
        />
        
        {/* Layer 4 */}
        <path 
          d="M24,90 Q32,77 42,80 Q36,78 28,75 Q38,62 50,68 Q62,62 72,75 Q64,78 58,80 Q68,77 76,90 Q50,95 24,90 Z" 
          fill="url(#foliageGrad2)" 
        />

        {/* Layer 3 */}
        <path 
          d="M28,70 Q36,58 45,61 Q40,59 32,56 Q41,45 50,50 Q59,45 68,56 Q60,59 55,61 Q64,58 72,70 Q50,75 28,70 Z" 
          fill="url(#foliageGrad1)" 
        />

        {/* Layer 2 */}
        <path 
          d="M33,50 Q40,40 47,43 Q43,41 36,38 Q43,28 50,32 Q57,28 64,38 Q57,41 53,43 Q60,40 67,50 Q50,54 33,50 Z" 
          fill="url(#foliageGrad2)" 
        />

        {/* Layer 1 (Top cap) */}
        <path 
          d="M38,30 Q44,20 48,22 Q45,21 40,18 Q45,8 50,10 Q55,8 60,18 Q55,21 52,22 Q56,20 62,30 Q50,34 38,30 Z" 
          fill="url(#foliageGrad1)" 
        />

        {/* Organic branch tip details / needles overlay */}
        <path 
          d="M48,10 L52,10 L50,6 Z 
             M38,18 L42,18 L40,14 Z 
             M58,18 L62,18 L60,14 Z
             M28,38 L32,38 L30,34 Z
             M68,38 L72,38 L70,34 Z" 
          fill="#1e3318" 
        />
      </svg>

      {/* Ground glow pool */}
      <div
        style={{
          position: 'absolute',
          bottom:   '-8px',
          left:     '50%',
          transform: 'translateX(-50%)',
          width:    baseWidth * 1.8,
          height:   20,
          background: `radial-gradient(ellipse at center, ${glowColor}${Math.floor(glowOpacity * 200).toString(16).padStart(2,'0')} 0%, transparent 70%)`,
          filter:   'blur(8px)',
          zIndex:   -1,
        }}
      />
    </div>
  );
}

// ── Tree row configuration (perspective-correct) ──────────────────────────────
// Near camera = tall & wide, near castle = small & narrow
const makeTreeRow = (side) => {
  // 8 trees per side
  return Array.from({ length: 8 }).map((_, i) => {
    const progress    = i / 7;  // 0 = near camera, 1 = near castle
    const heightBase  = side === 'near' ? 280 : 200;
    const height      = Math.round(heightBase * (1 - progress * 0.55));
    const baseWidth   = Math.round((side === 'near' ? 90 : 70) * (1 - progress * 0.5));
    const glowOpacity = 0.35 - progress * 0.2;
    // Glow color alternates purple/pink based on nearest lamp palette
    const glowColor   = i % 2 === 0 ? '#7c3aed' : '#be185d';

    return { height, baseWidth, glowColor, glowOpacity };
  });
};

// ── Full side trees component ──────────────────────────────────────────────────
function SideTrees({ className = '' }) {
  const leftTrees  = useMemo(() => makeTreeRow('near'), []);
  const rightTrees = useMemo(() => makeTreeRow('near'), []);

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 3 }}
    >
      {/* ── LEFT TREE ROW ─────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 flex items-end"
        style={{
          left:            '-2%',
          width:           '22%',
          height:          '70%',
          // Trees arranged in perspective: far trees higher in frame, near lower
          flexDirection:   'row-reverse', // castle-side first (farther)
          alignItems:      'flex-end',
          gap:             0,
          overflow:        'visible',
        }}
      >
        {leftTrees.map((t, i) => (
          <div
            key={i}
            style={{
              // Trees near castle (far = higher on screen, smaller)
              // We translate up based on perspective
              marginBottom: `${(leftTrees.length - 1 - i) * 4}%`,
              flexShrink: 0,
            }}
          >
            <PineTree {...t} />
          </div>
        ))}
      </div>

      {/* Left atmospheric haze between trees and path */}
      <div
        style={{
          position:   'absolute',
          left:       '0',
          bottom:     '0',
          width:      '18%',
          height:     '60%',
          background: 'linear-gradient(90deg, rgba(10,5,20,0.85) 0%, rgba(30,10,50,0.3) 70%, transparent 100%)',
          zIndex:     4,
        }}
      />

      {/* ── RIGHT TREE ROW ────────────────────────────────────────────── */}
      <div
        className="absolute bottom-0 flex items-end"
        style={{
          right:           '-2%',
          width:           '22%',
          height:          '70%',
          flexDirection:   'row',
          alignItems:      'flex-end',
          gap:             0,
          overflow:        'visible',
        }}
      >
        {rightTrees.map((t, i) => (
          <div
            key={i}
            style={{
              marginBottom: `${i * 4}%`,
              flexShrink: 0,
            }}
          >
            <PineTree {...t} />
          </div>
        ))}
      </div>

      {/* Right atmospheric haze */}
      <div
        style={{
          position:   'absolute',
          right:      '0',
          bottom:     '0',
          width:      '18%',
          height:     '60%',
          background: 'linear-gradient(270deg, rgba(10,5,20,0.85) 0%, rgba(30,10,50,0.3) 70%, transparent 100%)',
          zIndex:     4,
        }}
      />

      {/* ── Atmospheric top canopy glow ───────────────────────────────── */}
      {/* Left canopy */}
      <div style={{
        position: 'absolute', top: '15%', left: '-2%', width: '20%', height: '30%',
        background: 'radial-gradient(ellipse at right top, rgba(120,60,200,0.1) 0%, transparent 70%)',
        filter: 'blur(20px)',
        zIndex: 2,
      }}/>
      {/* Right canopy */}
      <div style={{
        position: 'absolute', top: '15%', right: '-2%', width: '20%', height: '30%',
        background: 'radial-gradient(ellipse at left top, rgba(120,60,200,0.1) 0%, transparent 70%)',
        filter: 'blur(20px)',
        zIndex: 2,
      }}/>
    </div>
  );
}

export default SideTrees;
