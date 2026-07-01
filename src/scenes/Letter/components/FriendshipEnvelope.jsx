import React, { forwardRef, useImperativeHandle, useRef } from 'react';

export const FriendshipEnvelope = forwardRef(({ phase, children }, ref) => {
  const containerRef = useRef(null);

  // Expose the double-hinged flap refs for LetterEngine to animate in sequence
  const topFlapBaseRef = useRef(null);
  const topFlapTipRef = useRef(null);
  const leftFlapBaseRef = useRef(null);
  const leftFlapTipRef = useRef(null);
  const rightFlapBaseRef = useRef(null);
  const rightFlapTipRef = useRef(null);
  const bottomFlapBaseRef = useRef(null);
  const bottomFlapTipRef = useRef(null);

  useImperativeHandle(ref, () => ({
    container: containerRef.current,
    topFlapBase: topFlapBaseRef.current,
    topFlapTip: topFlapTipRef.current,
    leftFlapBase: leftFlapBaseRef.current,
    leftFlapTip: leftFlapTipRef.current,
    rightFlapBase: rightFlapBaseRef.current,
    rightFlapTip: rightFlapTipRef.current,
    bottomFlapBase: bottomFlapBaseRef.current,
    bottomFlapTip: bottomFlapTipRef.current,
  }));

  const isVisible = ![
    'idle', 
    'scene-fade', 
    'golden-light', 
    'finished'
  ].includes(phase);

  return (
    <div 
      ref={containerRef}
      className={`absolute z-30 w-[85vw] max-w-[520px] aspect-[4/3] transition-opacity duration-1000 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '2000px',
        opacity: 0,
        left: 'calc(50% - min(42.5vw, 260px))',
        top: 'calc(50% - min(31.875vw, 195px))',
      }}
    >
      {/* Shared SVG Definitions (Gradients and Seamless Paper Texture Pattern) */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          {/* Seamless Gold Foil Gradient */}
          <linearGradient id="envelopeGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9a74a" />
            <stop offset="30%" stopColor="#fef3c7" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="70%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Premium Seamless Paper Fibers Pattern */}
          <pattern id="paperFibersPattern" width="180" height="180" patternUnits="userSpaceOnUse">
            {/* Background base cream/ivory tone */}
            <rect width="180" height="180" fill="#fffdfa" />
            
            {/* Soft Paper Noise Overlay */}
            <filter id="paperNoise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.05 0" />
            </filter>
            <rect width="180" height="180" filter="url(#paperNoise)" />

            {/* Organic Paper Fibers */}
            <path d="M15,25 Q20,35 18,50" stroke="#7c603a" strokeWidth="0.4" fill="none" opacity="0.1" strokeLinecap="round" />
            <path d="M80,95 Q90,90 92,105" stroke="#9a7f56" strokeWidth="0.35" fill="none" opacity="0.08" strokeLinecap="round" />
            <path d="M130,45 Q125,65 140,75" stroke="#6b512c" strokeWidth="0.45" fill="none" opacity="0.12" strokeLinecap="round" />
            <path d="M45,135 Q35,125 50,115" stroke="#7c603a" strokeWidth="0.5" fill="none" opacity="0.09" strokeLinecap="round" />
            <path d="M165,155 Q155,145 160,135" stroke="#9a7f56" strokeWidth="0.3" fill="none" opacity="0.07" strokeLinecap="round" />
            <path d="M100,20 Q110,10 105,30" stroke="#6b512c" strokeWidth="0.4" fill="none" opacity="0.1" strokeLinecap="round" />
          </pattern>
        </defs>
      </svg>

      {/* 3D Envelope Base Sheet - Rich Royal Cream & Crimson Lining */}
      {/* Note: overflow-hidden is removed to let the opening flaps render outside container bounds */}
      <div 
        className="absolute inset-0 w-full h-full rounded-[28px] shadow-[0_45px_95px_rgba(0,0,0,0.65),inset_0_0_40px_rgba(255,255,255,0.4)] border border-[#eae2d0] flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          background: 'url(#paperFibersPattern)',
          backgroundColor: '#fffcf6'
        }}
      >
        {/* Envelope Inside Lining: Royal Crimson velvet pattern */}
        <div 
          className="absolute inset-[10px] rounded-[22px] border border-amber-600/10 flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(circle at center, #78091a 0%, #3a020a 100%)',
            boxShadow: 'inset 0 10px 40px rgba(0,0,0,0.85)'
          }}
        >
          {/* Gold foil decorative line art inside the lining */}
          <svg viewBox="0 0 100 100" className="w-32 h-32 opacity-25 text-amber-300">
            {/* Detailed crest outline */}
            <path d="M 50 10 C 35 25, 15 35, 15 55 C 15 75, 50 85, 50 85 C 50 85, 85 75, 85 55 C 85 35, 65 25, 50 10 Z" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <path d="M 50 25 C 42 35, 27 40, 27 55 C 27 68, 50 78, 50 78 C 50 78, 73 68, 73 55 C 73 40, 58 35, 50 25 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>

        {/* --- 3D DOUBLE-HINGED FLAPS COVERING THE CONTENT --- */}
        {/* We assign translateZ values to arrange their stacking order in 3D space: Left/Right (1px) -> Bottom (2px) -> Top (3px) */}

        {/* 1. Bottom Flap Base & Tip */}
        <div 
          ref={bottomFlapBaseRef}
          className="absolute bottom-0 left-0 w-full h-[130px] z-25 origin-bottom"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(2px)' }}
        >
          <svg className="absolute inset-0 w-full h-full filter drop-shadow-[0_-5px_10px_rgba(0,0,0,0.18)]" viewBox="0 0 520 130">
            {/* Bottom Flap base polygon */}
            <polygon points="0,130 520,130 433,0 87,0" fill="url(#paperFibersPattern)" />
            {/* Outer Gold border */}
            <polygon points="12,126 508,126 424,4 96,4" fill="none" stroke="url(#envelopeGoldFoil)" strokeWidth="1.5" />
            {/* Embossed inner ridge */}
            <polygon points="15,124 505,124 421,7 99,7" fill="none" stroke="#d5c8ab" strokeWidth="0.75" opacity="0.4" />
          </svg>

          {/* Bottom Flap Tip (Double hinge nested child) */}
          <div
            ref={bottomFlapTipRef}
            className="absolute top-[-75px] left-0 w-full h-[75px] origin-bottom"
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 75">
              {/* Rounded apex pointing up */}
              <path d="M 87 75 L 242 8 C 251 0, 269 0, 278 8 L 433 75 Z" fill="url(#paperFibersPattern)" />
              <path d="M 96 75 L 245 11 C 253 4, 267 4, 275 11 L 424 75" fill="none" stroke="url(#envelopeGoldFoil)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* 2. Left Flap Base & Tip */}
        <div 
          ref={leftFlapBaseRef}
          className="absolute top-0 left-0 w-[170px] h-full z-20 origin-left"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
        >
          <svg className="absolute inset-0 w-full h-full filter drop-shadow-[5px_0_8px_rgba(0,0,0,0.15)]" viewBox="0 0 170 390">
            <polygon points="0,0 0,390 170,292 170,98" fill="url(#paperFibersPattern)" />
            <polygon points="4,12 4,378 166,284 166,106" fill="none" stroke="url(#envelopeGoldFoil)" strokeWidth="1.5" />
          </svg>

          {/* Left Flap Tip */}
          <div
            ref={leftFlapTipRef}
            className="absolute top-0 left-[170px] w-[90px] h-full origin-left"
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 90 390">
              <path d="M 0 98 L 78 184 C 86 190, 86 200, 78 206 L 0 292 Z" fill="url(#paperFibersPattern)" />
              <path d="M 0 106 L 73 188 C 79 193, 79 197, 73 202 L 0 284" fill="none" stroke="url(#envelopeGoldFoil)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* 3. Right Flap Base & Tip */}
        <div 
          ref={rightFlapBaseRef}
          className="absolute top-0 right-0 w-[170px] h-full z-20 origin-right"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
        >
          <svg className="absolute inset-0 w-full h-full filter drop-shadow-[-5px_0_8px_rgba(0,0,0,0.15)]" viewBox="0 0 170 390">
            <polygon points="170,0 170,390 0,292 0,98" fill="url(#paperFibersPattern)" />
            <polygon points="166,12 166,378 4,284 4,106" fill="none" stroke="url(#envelopeGoldFoil)" strokeWidth="1.5" />
          </svg>

          {/* Right Flap Tip */}
          <div
            ref={rightFlapTipRef}
            className="absolute top-0 left-[-90px] w-[90px] h-full origin-right"
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 90 390">
              <path d="M 90 98 L 12 184 C 4 190, 4 200, 12 206 L 90 292 Z" fill="url(#paperFibersPattern)" />
              <path d="M 90 106 L 17 188 C 11 193, 11 197, 17 202 L 90 284" fill="none" stroke="url(#envelopeGoldFoil)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* 4. Top Flap Base & Tip - Luxury Gold Lace Header */}
        <div 
          ref={topFlapBaseRef}
          className="absolute top-0 left-0 w-full h-[120px] z-35 origin-top"
          style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', transform: 'translateZ(3px)' }}
        >
          <svg className="absolute inset-0 w-full h-full filter drop-shadow-[0_8px_15px_rgba(0,0,0,0.32)]" viewBox="0 0 520 120">
            <polygon points="0,0 520,0 433,120 87,120" fill="url(#paperFibersPattern)" />
            <polygon points="12,4 508,4 424,116 96,116" fill="none" stroke="url(#envelopeGoldFoil)" strokeWidth="1.5" />
          </svg>

          {/* Top Flap Tip */}
          <div
            ref={topFlapTipRef}
            className="absolute top-[120px] left-0 w-full h-[75px] origin-top"
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 520 75">
              <path d="M 87 0 L 242 67 C 251 75, 269 75, 278 67 L 433 0 Z" fill="url(#paperFibersPattern)" />
              <path d="M 96 0 L 245 64 C 253 71, 267 71, 275 64 L 424 0" fill="none" stroke="url(#envelopeGoldFoil)" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Premium ambient light reflections shifting diagonal glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent pointer-events-none rounded-[28px] z-40 mix-blend-overlay" />

        {/* Render nested children (e.g. the Friendship Medallion) so they sit in the same 3D workspace */}
        {children}
      </div>
    </div>
  );
});

FriendshipEnvelope.displayName = 'FriendshipEnvelope';

export default FriendshipEnvelope;
