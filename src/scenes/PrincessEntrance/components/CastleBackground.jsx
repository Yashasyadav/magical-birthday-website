/**
 * CastleBackground.jsx  [UPGRADED — Phase 4 v2]
 * ─────────────────────────────────────────────────────────────────────────────
 * Rich purple/gold night sky with:
 *   • Large golden moon with halo rings
 *   • Aurora-like color bands across the sky
 *   • Dramatic castle with fully-lit windows, torches, royal banners
 *   • Soft ground mist
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

function Moon() {
  const moonRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Moon slow breathe
      gsap.to(moonRef.current, {
        filter: 'drop-shadow(0 0 60px rgba(255,240,180,0.9)) drop-shadow(0 0 120px rgba(255,220,100,0.5))',
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, moonRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={moonRef}
      className="absolute"
      style={{
        top: '8%',
        right: '12%',
        width: 'clamp(80px, 12vw, 160px)',
        height: 'clamp(80px, 12vw, 160px)',
        zIndex: 2,
        filter: 'drop-shadow(0 0 40px rgba(255,230,150,0.7)) drop-shadow(0 0 80px rgba(255,200,80,0.4))',
      }}
    >
      {/* Outer glow rings */}
      <div className="absolute inset-0 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(255,240,180,0.08) 0%, transparent 70%)',
        transform: 'scale(2.5)',
      }}/>
      <div className="absolute inset-0 rounded-full" style={{
        background: 'radial-gradient(circle, rgba(255,220,120,0.12) 0%, transparent 70%)',
        transform: 'scale(1.8)',
      }}/>
      {/* Moon disk */}
      <div className="absolute inset-0 rounded-full" style={{
        background: 'radial-gradient(circle at 35% 35%, #fffef0 0%, #fef3c7 30%, #fde68a 60%, #f59e0b 100%)',
        boxShadow: '0 0 30px rgba(255,220,100,0.9), 0 0 60px rgba(255,180,50,0.5)',
      }}/>
      {/* Moon craters (subtle) */}
      <div className="absolute rounded-full opacity-20" style={{
        width: '25%', height: '25%', top: '20%', left: '55%',
        background: 'rgba(180,140,30,0.5)',
      }}/>
      <div className="absolute rounded-full opacity-15" style={{
        width: '15%', height: '15%', top: '55%', left: '25%',
        background: 'rgba(160,120,20,0.5)',
      }}/>
    </div>
  );
}

function AuroraLayer() {
  const aRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(aRef.current?.children[0], {
        x: '8%', opacity: 0.7, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      gsap.to(aRef.current?.children[1], {
        x: '-6%', opacity: 0.5, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2,
      });
      gsap.to(aRef.current?.children[2], {
        x: '4%', opacity: 0.4, duration: 14, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 4,
      });
    }, aRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={aRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {/* Aurora band 1 — magenta/purple */}
      <div style={{
        position: 'absolute', top: '5%', left: '-10%', width: '120%', height: '35%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(180,60,220,0.12) 30%, rgba(140,30,200,0.08) 70%, transparent 100%)',
        filter: 'blur(40px)',
        mixBlendMode: 'screen',
        opacity: 0.6,
      }}/>
      {/* Aurora band 2 — pink/rose */}
      <div style={{
        position: 'absolute', top: '10%', left: '-5%', width: '110%', height: '28%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(220,80,160,0.1) 40%, rgba(200,50,140,0.06) 70%, transparent 100%)',
        filter: 'blur(50px)',
        mixBlendMode: 'screen',
        opacity: 0.5,
      }}/>
      {/* Aurora band 3 — teal streak */}
      <div style={{
        position: 'absolute', top: '18%', left: '-15%', width: '130%', height: '20%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(30,200,180,0.07) 50%, transparent 100%)',
        filter: 'blur(60px)',
        mixBlendMode: 'screen',
        opacity: 0.4,
      }}/>
    </div>
  );
}

function CastleTorch({ x, y, scale = 1 }) {
  return (
    <div className="absolute" style={{
      left: x, top: y,
      transform: `scale(${scale})`,
      transformOrigin: 'bottom center',
    }}>
      {/* Torch bracket */}
      <div style={{ width: 5, height: 12, background: '#78350f', borderRadius: 2 }}/>
      {/* Flame */}
      <div className="absolute -top-4 -left-1" style={{
        width: 7, height: 12,
        background: 'radial-gradient(ellipse at 50% 90%, #fbbf24 0%, #f97316 50%, #dc2626 100%)',
        borderRadius: '50% 50% 30% 30%',
        boxShadow: '0 0 12px rgba(251,191,36,0.9), 0 0 24px rgba(251,100,0,0.5)',
        animation: 'torchFlicker 0.6s ease-in-out infinite alternate',
      }}/>
    </div>
  );
}

function Window({ x, y, width = 16, height = 22, glowing = true, arched = true }) {
  return (
    <div className="absolute" style={{ left: x, top: y, width, height, overflow: 'hidden' }}>
      <div style={{
        width: '100%', height: '100%',
        background: glowing
          ? 'radial-gradient(ellipse at center, rgba(255,200,80,0.9) 0%, rgba(255,150,30,0.6) 60%, rgba(200,80,0,0.2) 100%)'
          : 'rgba(30,20,10,0.8)',
        borderRadius: arched ? '50% 50% 0 0' : '2px',
        border: '1px solid rgba(180,120,30,0.6)',
        boxShadow: glowing ? '0 0 10px rgba(255,180,40,0.6)' : 'none',
      }}/>
    </div>
  );
}

function RoyalBanner({ x, y, color = '#7c3aed', scale = 1 }) {
  return (
    <div className="absolute" style={{
      left: x, top: y,
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
    }}>
      {/* Banner */}
      <div style={{
        width: 18, height: 32,
        background: `linear-gradient(180deg, ${color} 0%, ${color}cc 80%, transparent 100%)`,
        border: '1px solid rgba(251,191,36,0.5)',
        borderRadius: '0 0 50% 50%',
        boxShadow: `0 0 8px ${color}60`,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Golden emblem on banner */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 8, height: 8,
          background: 'radial-gradient(circle, #fbbf24, #d97706)',
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
        }}/>
      </div>
    </div>
  );
}

function CastleBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none flex items-end justify-center"
      style={{ zIndex: 1 }}
    >
      {/* ── Deep Night Sky ───────────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, #2d1b69 0%, #1a0a3d 25%, #0d0a1e 55%, #04020f 100%)',
      }}/>

      {/* ── Aurora Bands ─────────────────────────────────────────────────── */}
      <AuroraLayer />

      {/* ── Moon ─────────────────────────────────────────────────────────── */}
      <Moon />

      {/* ── Cloud wisps around moon ───────────────────────────────────────── */}
      <div className="absolute" style={{
        top: '6%', right: '5%', width: '30%', height: '20%',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(220,180,255,0.06) 0%, transparent 70%)',
        filter: 'blur(30px)',
        zIndex: 2,
      }}/>

      {/* ── Castle Structure ──────────────────────────────────────────────── */}
      <div className="relative" style={{
        width: 'clamp(320px, 62vw, 800px)',
        height: 'clamp(220px, 50vh, 560px)',
        marginBottom: '20vh',
        zIndex: 3,
      }}>
        {/* ── Main castle wall body ────────────────────────────────────── */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: '52%', height: '65%',
          background: 'linear-gradient(180deg, #1c1408 0%, #130e05 60%, #0a0804 100%)',
          boxShadow: '0 0 80px rgba(0,0,0,0.9), -30px 0 60px rgba(0,0,0,0.6), 30px 0 60px rgba(0,0,0,0.6)',
        }}>
          {/* Wall windows */}
          <Window x="10%" y="25%" width={14} height={20}/>
          <Window x="35%" y="20%" width={18} height={26}/>
          <Window x="62%" y="25%" width={14} height={20}/>
          {/* Torch on wall */}
          <CastleTorch x="25%" y="60%"/>
          <CastleTorch x="68%" y="60%"/>
        </div>

        {/* ── Left flanking tower ──────────────────────────────────────── */}
        <div className="absolute bottom-0" style={{ left: '3%', width: '22%', height: '85%' }}>
          <div className="w-full h-full" style={{
            background: 'linear-gradient(180deg, #1c1408 0%, #130e05 100%)',
            boxShadow: '-20px 0 40px rgba(0,0,0,0.7)',
          }}>
            {/* Battlements */}
            {[0,1,2,3,4].map(i => (
              <div key={i} className="absolute top-0" style={{
                width: '16%', height: '10%',
                left: `${i * 22}%`,
                background: '#221508',
              }}/>
            ))}
            <Window x="28%" y="28%" width={12} height={18}/>
            <Window x="28%" y="55%" width={12} height={16} glowing={false}/>
            <CastleTorch x="55%" y="72%"/>
            {/* Royal banner on tower */}
            <RoyalBanner x="5%" y="5%" color="#7c3aed"/>
            <RoyalBanner x="65%" y="5%" color="#9d174d"/>
          </div>
          {/* Spire */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{
            top: '-18%',
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '50px solid #1c1408',
          }}/>
          {/* Flag */}
          <div className="absolute" style={{
            top: '-30%', left: '58%',
            width: 14, height: 10,
            background: 'linear-gradient(90deg, #fbbf24, #d97706)',
            clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
          }}/>
        </div>

        {/* ── Right flanking tower ─────────────────────────────────────── */}
        <div className="absolute bottom-0" style={{ right: '3%', width: '22%', height: '85%' }}>
          <div className="w-full h-full" style={{
            background: 'linear-gradient(180deg, #1c1408 0%, #130e05 100%)',
            boxShadow: '20px 0 40px rgba(0,0,0,0.7)',
          }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} className="absolute top-0" style={{
                width: '16%', height: '10%',
                left: `${i * 22}%`,
                background: '#221508',
              }}/>
            ))}
            <Window x="28%" y="28%" width={12} height={18}/>
            <Window x="28%" y="55%" width={12} height={16}/>
            <CastleTorch x="12%" y="72%"/>
            <RoyalBanner x="5%" y="5%" color="#9d174d"/>
            <RoyalBanner x="65%" y="5%" color="#7c3aed"/>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2" style={{
            top: '-18%',
            borderLeft: '12px solid transparent',
            borderRight: '12px solid transparent',
            borderBottom: '50px solid #1c1408',
          }}/>
          <div className="absolute" style={{
            top: '-30%', left: '58%',
            width: 14, height: 10,
            background: 'linear-gradient(90deg, #ec4899, #be185d)',
            clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
          }}/>
        </div>

        {/* ── Center tallest tower ─────────────────────────────────────── */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: '17%', height: '115%',
          background: 'linear-gradient(180deg, #221a0a 0%, #1c1408 100%)',
        }}>
          {/* Spire */}
          <div className="absolute left-1/2 -translate-x-1/2" style={{
            top: '-20%',
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderBottom: '55px solid #221a0a',
          }}/>
          {/* Golden crescent on spire */}
          <div className="absolute" style={{
            top: '-24%', left: '52%',
            width: 16, height: 12,
            background: 'radial-gradient(circle, #fbbf24, #f59e0b)',
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            boxShadow: '0 0 10px rgba(251,191,36,1)',
          }}/>
          {/* Center arch window — glowing beautifully */}
          <Window x="20%" y="20%" width={22} height={32} glowing={true}/>
          {/* Secondary window */}
          <Window x="22%" y="58%" width={18} height={24} glowing={true}/>
          {/* Torch on tower */}
          <CastleTorch x="10%" y="50%"/>
          <CastleTorch x="72%" y="50%"/>
          {/* Royal banner */}
          <RoyalBanner x="15%" y="78%" color="#7c3aed" scale={1.2}/>
        </div>

        {/* ── Two smaller side towers ───────────────────────────────────── */}
        {/* Left mini tower */}
        <div className="absolute bottom-0" style={{ left: '23%', width: '12%', height: '60%',
          background: 'linear-gradient(180deg, #1c1408, #0f0b07)' }}>
          <Window x="22%" y="30%" width={10} height={14}/>
          <div className="absolute left-1/2 -translate-x-1/2" style={{
            top: '-15%',
            borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
            borderBottom: '30px solid #1c1408',
          }}/>
        </div>
        {/* Right mini tower */}
        <div className="absolute bottom-0" style={{ right: '23%', width: '12%', height: '60%',
          background: 'linear-gradient(180deg, #1c1408, #0f0b07)' }}>
          <Window x="22%" y="30%" width={10} height={14}/>
          <div className="absolute left-1/2 -translate-x-1/2" style={{
            top: '-15%',
            borderLeft: '7px solid transparent', borderRight: '7px solid transparent',
            borderBottom: '30px solid #1c1408',
          }}/>
        </div>

        {/* ── Castle warm inner glow from doorway ──────────────────────── */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{
          width: '35%', height: '50%',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(255,180,60,0.35) 0%, rgba(255,120,20,0.12) 60%, transparent 85%)',
          filter: 'blur(12px)',
          zIndex: 4,
        }}/>

        {/* ── Castle reflect glow on ground ────────────────────────────── */}
        <div className="absolute -bottom-4 left-0 right-0" style={{
          height: '20%',
          background: 'radial-gradient(ellipse at 50% 0%, rgba(255,160,40,0.15) 0%, transparent 70%)',
          filter: 'blur(15px)',
        }}/>
      </div>

      {/* ── Ground mist ──────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: '20%',
        background: 'linear-gradient(0deg, rgba(200,180,255,0.08) 0%, rgba(180,160,255,0.04) 60%, transparent 100%)',
        filter: 'blur(20px)',
        zIndex: 4,
      }}/>

      {/* ── Inject torch flicker keyframe ─────────────────────────────────── */}
      <style>{`
        @keyframes torchFlicker {
          0%   { transform: scaleX(1) scaleY(1); opacity: 0.9; }
          50%  { transform: scaleX(0.9) scaleY(1.08); opacity: 1; }
          100% { transform: scaleX(1.05) scaleY(0.95); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}

export default CastleBackground;
