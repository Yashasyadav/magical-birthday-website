import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * A highly polished CSS/SVG original fantasy castle.
 * Features:
 * - Architectural stone texture patterns
 * - Beveled edges using overlapping shading gradients
 * - God rays and soft bloom behind the towers
 * - GSAP-driven warm window flickering to simulate candles
 * - Animated flags
 */
const Castle = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const silhouetteRef = useRef(null);
  const lightsRef = useRef(null);
  const flagsRef = useRef(null);
  const godRaysRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
    getSilhouette: () => silhouetteRef.current,
    getLights: () => lightsRef.current,
    getFlags: () => flagsRef.current,
    getGodRays: () => godRaysRef.current,
  }));

  useEffect(() => {
    // Warm window candle flicker using GSAP
    const windows = lightsRef.current?.querySelectorAll('rect, path');
    if (windows && windows.length > 0) {
      windows.forEach((win) => {
        gsap.to(win, {
          opacity: () => 0.5 + Math.random() * 0.5,
          duration: () => 0.2 + Math.random() * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'rough({ strength: 1, points: 10 })',
          delay: () => Math.random() * 2
        });
      });
    }

    // Slowly rotate god rays behind the castle
    gsap.to(godRaysRef.current, {
      rotation: 360,
      duration: 120,
      repeat: -1,
      ease: 'none',
      transformOrigin: '400px 300px'
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[650px] pointer-events-none opacity-0"
      style={{ zIndex: 15 }}
    >
      <svg viewBox="0 0 800 650" className="w-full h-full drop-shadow-[0_15px_40px_rgba(0,0,0,0.75)]">
        <defs>
          {/* Stone texture pattern */}
          <pattern id="stoneTexture" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 0 10 L 20 10 M 10 0 L 10 10 M 20 10 L 20 20 M 0 20 L 20 20 M 15 10 L 15 20 M 5 0 L 5 10" 
                  fill="none" stroke="#251e52" strokeWidth="0.5" opacity="0.4" />
          </pattern>

          {/* Gradients for 3D bevels and lighting highlights */}
          <linearGradient id="towerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#080516" />
            <stop offset="50%" stopColor="#14102e" />
            <stop offset="100%" stopColor="#04020f" />
          </linearGradient>

          <linearGradient id="roofGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="50%" stopColor="#3730a3" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Golden highlight gradient */}
          <linearGradient id="goldHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>

          {/* Warm window glow */}
          <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="60%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Soft bloom filter */}
          <filter id="bloom">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* === GOD RAYS & SOFT BLOOM (Behind Castle Towers) === */}
        {/* Initially hidden/low-opacity, scaled and rotated */}
        <g ref={godRaysRef} opacity="0.35" className="origin-center" style={{ transformOrigin: '400px 350px' }}>
          <circle cx="400" cy="350" r="300" fill="url(#windowGlow)" filter="url(#bloom)" opacity="0.4" />
          {/* Individual God Rays beams */}
          <polygon points="400,350 200,0 260,0" fill="url(#windowGlow)" opacity="0.3" />
          <polygon points="400,350 540,0 600,0" fill="url(#windowGlow)" opacity="0.3" />
          <polygon points="400,350 700,100 750,150" fill="url(#windowGlow)" opacity="0.25" />
          <polygon points="400,350 50,100 100,150" fill="url(#windowGlow)" opacity="0.25" />
          <polygon points="400,350 400,0 450,0" fill="url(#windowGlow)" opacity="0.4" />
        </g>

        {/* === CASTLE ARCHITECTURE (With depth, textures, bevels) === */}
        <g ref={silhouetteRef}>
          {/* Main Keep */}
          <rect x="330" y="200" width="140" height="400" fill="url(#towerGrad)" stroke="#1c1640" strokeWidth="1.5" />
          <rect x="330" y="200" width="140" height="400" fill="url(#stoneTexture)" />
          {/* Center Spire (3D Cone look) */}
          <polygon points="400,50 330,200 470,200" fill="url(#roofGrad)" />
          <polygon points="400,50 400,200 470,200" fill="black" opacity="0.15" /> {/* shadow side */}
          
          {/* Inner Towers */}
          <rect x="250" y="280" width="80" height="320" fill="url(#towerGrad)" stroke="#1c1640" strokeWidth="1.5" />
          <rect x="250" y="280" width="80" height="320" fill="url(#stoneTexture)" />
          <polygon points="290,180 250,280 330,280" fill="url(#roofGrad)" />
          <polygon points="290,180 290,280 330,280" fill="black" opacity="0.15" />
          
          <rect x="470" y="280" width="80" height="320" fill="url(#towerGrad)" stroke="#1c1640" strokeWidth="1.5" />
          <rect x="470" y="280" width="80" height="320" fill="url(#stoneTexture)" />
          <polygon points="510,180 470,280 550,280" fill="url(#roofGrad)" />
          <polygon points="510,180 510,280 550,280" fill="black" opacity="0.15" />

          {/* Outer Walls & Battlements */}
          <rect x="180" y="420" width="440" height="180" fill="url(#towerGrad)" stroke="#1c1640" strokeWidth="1.5" />
          <rect x="180" y="420" width="440" height="180" fill="url(#stoneTexture)" />
          {/* Battlement cutouts */}
          <rect x="200" y="405" width="25" height="15" fill="#0d0a1e" />
          <rect x="250" y="405" width="25" height="15" fill="#0d0a1e" />
          <rect x="300" y="405" width="25" height="15" fill="#0d0a1e" />
          <rect x="475" y="405" width="25" height="15" fill="#0d0a1e" />
          <rect x="525" y="405" width="25" height="15" fill="#0d0a1e" />
          <rect x="575" y="405" width="25" height="15" fill="#0d0a1e" />

          {/* Outer Towers */}
          <rect x="100" y="350" width="60" height="250" fill="url(#towerGrad)" stroke="#1c1640" strokeWidth="1.5" />
          <rect x="100" y="350" width="60" height="250" fill="url(#stoneTexture)" />
          <polygon points="130,250 100,350 160,350" fill="url(#roofGrad)" />
          <polygon points="130,250 130,350 160,350" fill="black" opacity="0.15" />

          <rect x="640" y="350" width="60" height="250" fill="url(#towerGrad)" stroke="#1c1640" strokeWidth="1.5" />
          <rect x="640" y="350" width="60" height="250" fill="url(#stoneTexture)" />
          <polygon points="670,250 640,350 700,350" fill="url(#roofGrad)" />
          <polygon points="670,250 670,350 700,350" fill="black" opacity="0.15" />

          {/* Main Gate Arched Doorway */}
          <path d="M 360 600 L 360 520 A 40 40 0 0 1 440 520 L 440 600 Z" fill="#04020f" stroke="#1c1640" strokeWidth="2" />
        </g>

        {/* === LIGHTING LAYER (Warm glowing windows & trim highlights) === */}
        <g ref={lightsRef} className="opacity-0" filter="url(#bloom)">
          {/* Main Gate Glow */}
          <path d="M 370 600 L 370 530 A 30 30 0 0 1 430 530 L 430 600 Z" fill="url(#windowGlow)" opacity="0.85" />

          {/* Glowing Windows */}
          <g fill="#fde68a">
            {/* Center Spire Windows */}
            <rect x="385" y="240" width="30" height="60" rx="15" />
            <rect x="385" y="330" width="30" height="60" rx="15" />
            
            {/* Inner Tower Windows */}
            <rect x="275" y="330" width="30" height="50" rx="15" />
            <rect x="275" y="410" width="30" height="50" rx="15" />
            
            <rect x="495" y="330" width="30" height="50" rx="15" />
            <rect x="495" y="410" width="30" height="50" rx="15" />

            {/* Outer Tower Windows */}
            <rect x="115" y="400" width="30" height="45" rx="15" />
            <rect x="655" y="400" width="30" height="45" rx="15" />
          </g>

          {/* Gold highlights along edges to add depth */}
          <path d="M 330 200 L 470 200 M 250 280 L 330 280 M 470 280 L 550 280 M 100 350 L 160 350 M 640 350 L 700 350" 
                stroke="url(#goldHighlight)" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
        </g>

        {/* === ANIMATED FLAGS (Swaying in wind) === */}
        <g ref={flagsRef} fill="#f43f5e" className="origin-bottom">
          {/* Main Spire Flag */}
          <path d="M 400 50 L 440 40 L 400 60 Z" />
          {/* Inner Tower Flags */}
          <path d="M 290 180 L 320 170 L 290 190 Z" />
          <path d="M 510 180 L 540 170 L 510 190 Z" />
          {/* Outer Tower Flags */}
          <path d="M 130 250 L 150 242 L 130 256 Z" />
          <path d="M 670 250 L 690 242 L 670 256 Z" />
        </g>
      </svg>
    </div>
  );
});

export default Castle;
