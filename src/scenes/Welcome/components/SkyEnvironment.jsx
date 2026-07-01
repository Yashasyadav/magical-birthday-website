/**
 * SkyEnvironment.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Layered Disney-style sky and terrain environment:
 *   • Starry night sky & glowing nebula
 *   • Aurora color ribbons with soft floating animation
 *   • Full moon with soft bloom and radial halo
 *   • Silhouette of a majestic castle and distant mountains
 *   • Water/lake reflection plane with vertical ripple distortion
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export function SkyEnvironment({ children, skyColorFlashRef }) {
  const moonRef = useRef(null);
  const aurora1Ref = useRef(null);
  const aurora2Ref = useRef(null);
  const cloud1Ref = useRef(null);
  const cloud2Ref = useRef(null);
  const cloud3Ref = useRef(null);
  const cloud4Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Moon breathing glow - reduced
      gsap.to(moonRef.current, {
        filter: 'drop-shadow(0 0 15px rgba(255,244,200,0.3))',
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Aurora gentle wave movement
      gsap.to(aurora1Ref.current, {
        x: '+=6%',
        y: '-=2%',
        opacity: 0.7,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      gsap.to(aurora2Ref.current, {
        x: '-=5%',
        y: '+=3%',
        opacity: 0.5,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5,
      });

      // Floating clouds animation (Parallax speed variations)
      gsap.fromTo(cloud1Ref.current, 
        { x: '-150%', y: '0px' },
        { x: '120vw', duration: 75, repeat: -1, ease: 'none' }
      );
      gsap.fromTo(cloud2Ref.current, 
        { x: '120vw', y: '0px' },
        { x: '-150%', duration: 95, repeat: -1, ease: 'none' }
      );
      gsap.fromTo(cloud3Ref.current, 
        { x: '-150%', y: '0px' },
        { x: '120vw', duration: 110, repeat: -1, ease: 'none', delay: 20 }
      );
      gsap.fromTo(cloud4Ref.current, 
        { x: '120vw', y: '0px' },
        { x: '-150%', duration: 130, repeat: -1, ease: 'none', delay: 35 }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#04020a] overflow-hidden pointer-events-none">
      
      {/* ── Sky Backdrop ─────────────────────────────────────────────────── */}
      <div 
        ref={skyColorFlashRef}
        className="absolute inset-0 transition-colors duration-150"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, #1c0e3a 0%, #0c061d 40%, #04020a 100%)',
          willChange: 'background',
        }}
      />

      {/* ── Aurora Ribbons ───────────────────────────────────────────────── */}
      <div 
        ref={aurora1Ref}
        className="absolute top-0 left-[-10%] w-[120%] h-[50%] opacity-40 mix-blend-screen"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(147, 51, 234, 0.15) 35%, rgba(236, 72, 153, 0.08) 70%, transparent 100%)',
          filter: 'blur(35px)',
        }}
      />
      <div 
        ref={aurora2Ref}
        className="absolute top-[10%] left-[-5%] w-[110%] h-[40%] opacity-30 mix-blend-screen"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(59, 130, 246, 0.12) 40%, rgba(168, 85, 247, 0.05) 80%, transparent 100%)',
          filter: 'blur(45px)',
        }}
      />

      {/* ── Full Moon with Bloom ── */}
      <div
        ref={moonRef}
        className="absolute"
        style={{
          top: '12%',
          right: '15%',
          width: 'clamp(70px, 9vw, 130px)',
          height: 'clamp(70px, 9vw, 130px)',
          zIndex: 2,
          filter: 'drop-shadow(0 0 10px rgba(255,240,200,0.25))',
        }}
      >
        {/* Soft Moon Halo */}
        <div 
          className="absolute inset-0 rounded-full" 
          style={{
            background: 'radial-gradient(circle, rgba(255,248,220,0.03) 0%, transparent 60%)',
            transform: 'scale(1.4)',
          }}
        />
        {/* Moon Disk */}
        <div 
          className="absolute inset-0 rounded-full" 
          style={{
            background: 'radial-gradient(circle at 30% 30%, #fffff7 0%, #fffbeb 25%, #fef3c7 60%, #fbbf24 100%)',
            boxShadow: '0 0 10px rgba(255,240,180,0.4)',
          }}
        />
      </div>

      {/* ── Starfield & Nebula ───────────────────────────────────────────── */}
      <div className="absolute inset-0 opacity-80" style={{ zIndex: 1 }}>
        {children}
      </div>

      {/* ── Floating Clouds Layers ───────────────────────────────────────── */}
      <div className="absolute inset-0 w-full h-[55%] overflow-hidden pointer-events-none" style={{ zIndex: 3 }}>
        {/* Cloud 1 */}
        <div 
          ref={cloud1Ref}
          className="absolute top-[15%] left-0 w-[240px] h-[60px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(139,92,246,0.03) 70%, transparent 100%)',
            filter: 'blur(10px)',
          }}
        />
        {/* Cloud 2 */}
        <div 
          ref={cloud2Ref}
          className="absolute top-[28%] right-0 w-[300px] h-[75px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, rgba(236,72,153,0.02) 75%, transparent 100%)',
            filter: 'blur(12px)',
          }}
        />
        {/* Cloud 3 */}
        <div 
          ref={cloud3Ref}
          className="absolute top-[8%] left-[20%] w-[180px] h-[50px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 80%)',
            filter: 'blur(8px)',
          }}
        />
        {/* Cloud 4 */}
        <div 
          ref={cloud4Ref}
          className="absolute top-[38%] left-[30%] w-[350px] h-[80px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(139,92,246,0.03) 80%, transparent 100%)',
            filter: 'blur(14px)',
          }}
        />
      </div>

      {/* ── Distant Mountains & Castle Silhouette ────────────────────────── */}
      <div 
        className="absolute inset-x-0 bottom-[22%] flex items-end justify-center pointer-events-none"
        style={{ height: '35%', zIndex: 4 }}
      >
        {/* Mountains Silhouette */}
        <div 
          className="absolute inset-0 w-full"
          style={{
            background: 'linear-gradient(180deg, transparent 50%, #090514 100%)',
            clipPath: 'polygon(0% 70%, 15% 58%, 32% 66%, 45% 54%, 55% 58%, 70% 48%, 88% 62%, 100% 70%, 100% 100%, 0% 100%)',
            opacity: 0.75,
          }}
        />
        
        {/* Castle Structure (Low Opacity, Dark Silhouette) */}
        <div 
          className="relative transition-all duration-300"
          style={{
            width: 'clamp(260px, 48vw, 620px)',
            height: 'clamp(180px, 32vh, 420px)',
            opacity: 0.82,
            filter: 'drop-shadow(0 0 15px rgba(139,92,246,0.25))',
          }}
        >
          {/* Main Castle Keep */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[42%] h-[55%] bg-[#080410] border-t border-purple-900/30" />
          
          {/* Spires */}
          <div className="absolute bottom-[55%] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[50px] border-b-[#080410]" />
          <div className="absolute bottom-0 left-[20%] w-[15%] h-[80%] bg-[#06030c]" />
          <div className="absolute bottom-[80%] left-[20%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[40px] border-b-[#06030c]" />
          
          <div className="absolute bottom-0 right-[20%] w-[15%] h-[80%] bg-[#06030c]" />
          <div className="absolute bottom-[80%] right-[20%] w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[40px] border-b-[#06030c]" />
          
          {/* Windows (warm castle lights) */}
          <div className="absolute bottom-[20%] left-[48%] w-3 h-5 rounded-t-full bg-amber-400/90 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          <div className="absolute bottom-[40%] left-[24%] w-2 h-4 rounded-t-full bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
          <div className="absolute bottom-[40%] right-[24%] w-2 h-4 rounded-t-full bg-amber-500/80 shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
        </div>
      </div>

      {/* ── Water / Lake Reflection Plane ────────────────────────────────── */}
      <div 
        className="absolute inset-x-0 bottom-0 pointer-events-none border-t border-purple-950/20"
        style={{
          height: '22%',
          background: 'linear-gradient(180deg, #090514 0%, #05030a 100%)',
          zIndex: 5,
        }}
      >
        {/* Subtle Water Reflection overlay */}
        <div 
          className="absolute inset-0 w-full h-full opacity-40 mix-blend-color-dodge"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(139, 92, 246, 0.3) 0%, transparent 80%)',
          }}
        />
        
        {/* Horizontal Ripples overlay */}
        <div 
          className="absolute inset-0 w-full h-full opacity-35"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 2px,
              rgba(0, 0, 0, 0.8) 2px,
              rgba(0, 0, 0, 0.8) 4px
            )`,
          }}
        />
      </div>

    </div>
  );
}

export default SkyEnvironment;
