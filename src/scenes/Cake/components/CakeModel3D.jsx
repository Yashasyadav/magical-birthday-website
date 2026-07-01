import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * CakeModel3D
 * A multi-layered CSS/SVG cake rendered in 3D perspective.
 * Features:
 *   - Multi-layer tiers (sponge, cream, fondant)
 *   - Realistic decorations (pearls, flowers, ribbons)
 *   - "Happy Birthday, Bhavani!" text on the cake
 *   - Soft bokeh drop shadows for depth
 *   - Subtle continuous floating motion via GSAP
 */
function CakeModel3D({ candlesOut = 0, cutProgress = 0 }) {
  const containerRef = useRef(null);
  const cakeRef = useRef(null);

  const TOTAL_CANDLES = 5;

  // Gentle floating / breathing motion
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(cakeRef.current, {
        y: '-=8',
        duration: 3.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full pointer-events-none select-none"
      style={{ perspective: '1000px' }}
    >
      <div
        ref={cakeRef}
        className="relative"
        style={{ width: '340px', height: '400px' }}
      >
        {/*
          ── CAKE STRUCTURE ──────────────────────────────────────────────
          We use layered divs with box-shadow, gradients, and border-radius
          to create a convincing 3D-looking multi-tier birthday cake.
          Layers from bottom to top: base tier, mid tier, top tier, candles.
        */}

        {/* ── TIER 1: Base (widest) ──────────────────────────────── */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2" style={{ width: '300px' }}>
          {/* Top face */}
          <div
            className="w-full rounded-t-[4px]"
            style={{
              height: '28px',
              background: 'radial-gradient(ellipse at 40% 30%, #fde68a, #f59e0b 60%, #d97706)',
              boxShadow: '0 -4px 16px rgba(251,191,36,0.3)',
            }}
          />
          {/* Front face */}
          <div
            className="w-full"
            style={{
              height: '90px',
              background: 'linear-gradient(180deg, #f8e1b4 0%, #f3c77e 40%, #e9a94b 100%)',
              boxShadow: 'inset 0 6px 20px rgba(255,255,255,0.25), inset 0 -8px 20px rgba(0,0,0,0.15), 4px 8px 30px rgba(0,0,0,0.4)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Sponge layer lines */}
            <div className="absolute top-[35%] left-0 w-full h-[2px] opacity-30" style={{ background: 'linear-gradient(90deg, transparent, #c97f20, transparent)' }} />
            <div className="absolute top-[65%] left-0 w-full h-[2px] opacity-30" style={{ background: 'linear-gradient(90deg, transparent, #c97f20, transparent)' }} />
            {/* Cream filling lines */}
            <div className="absolute top-[32%] left-0 w-full h-[6px] opacity-60" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
            <div className="absolute top-[62%] left-0 w-full h-[6px] opacity-60" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)' }} />
            {/* Chocolate drip lines */}
            {[20, 60, 110, 160, 210, 260].map((x, i) => (
              <div
                key={i}
                className="absolute top-[-2px] rounded-b-full"
                style={{
                  left: `${x}px`,
                  width: '10px',
                  height: `${16 + Math.sin(i) * 8}px`,
                  background: 'linear-gradient(180deg, #7c2d12, #92400e)',
                  opacity: 0.85,
                }}
              />
            ))}
            {/* Ribbon band */}
            <div className="absolute bottom-0 left-0 w-full h-[12px]" style={{ background: 'linear-gradient(90deg, #ec4899, #f43f5e, #ec4899)', opacity: 0.7 }} />
            {/* Pearl decorations */}
            {[10, 45, 80, 115, 150, 185, 220, 255, 290].map((x, i) => (
              <div key={i} className="absolute bottom-[10px] w-3 h-3 rounded-full" style={{ left: `${x}px`, background: 'radial-gradient(circle at 35% 35%, #fff, #ddd 60%, #aaa)', boxShadow: '0 0 4px rgba(255,255,255,0.5)' }} />
            ))}
          </div>
          {/* Bottom shadow */}
          <div className="w-full h-[10px] rounded-b-full" style={{ background: 'rgba(0,0,0,0.4)', filter: 'blur(8px)' }} />
        </div>

        {/* ── TIER 2: Middle ─────────────────────────────────────── */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '120px', width: '220px' }}>
          {/* Top face */}
          <div
            className="w-full rounded-t-[4px]"
            style={{
              height: '22px',
              background: 'radial-gradient(ellipse at 40% 30%, #fce7f3, #fbcfe8 50%, #f9a8d4)',
              boxShadow: '0 -4px 10px rgba(244,63,94,0.2)',
            }}
          />
          {/* Front face */}
          <div
            className="w-full"
            style={{
              height: '80px',
              background: 'linear-gradient(180deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
              boxShadow: 'inset 0 4px 16px rgba(255,255,255,0.3), inset 0 -6px 16px rgba(0,0,0,0.12), 2px 6px 20px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Chocolate drip */}
            {[15, 50, 90, 130, 170].map((x, i) => (
              <div key={i} className="absolute top-[-2px] rounded-b-full" style={{ left: `${x}px`, width: '8px', height: `${12 + Math.cos(i) * 5}px`, background: 'linear-gradient(180deg, #7c2d12, #92400e)', opacity: 0.8 }} />
            ))}
            {/* Birthday text on middle tier */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-script text-sm text-rose-700 opacity-70 select-none whitespace-nowrap" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Happy Birthday, Bhavani!</span>
            </div>
            {/* Flower decorations */}
            {[20, 100, 180].map((x, i) => (
              <div key={i} className="absolute bottom-[10px] w-6 h-6" style={{ left: `${x}px` }}>
                <div className="absolute inset-0 flex items-center justify-center text-[18px]">🌸</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── TIER 3: Top (smallest) ──────────────────────────────── */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: '220px', width: '140px' }}>
          {/* Top face */}
          <div
            className="w-full rounded-t-[4px]"
            style={{
              height: '18px',
              background: 'radial-gradient(ellipse at 40% 30%, #e0e7ff, #c7d2fe 50%, #a5b4fc)',
            }}
          />
          {/* Front face */}
          <div
            className="w-full"
            style={{
              height: '65px',
              background: 'linear-gradient(180deg, #e0e7ff 0%, #c7d2fe 60%, #a5b4fc 100%)',
              boxShadow: 'inset 0 4px 12px rgba(255,255,255,0.4), inset 0 -4px 12px rgba(0,0,0,0.1), 2px 4px 16px rgba(0,0,0,0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Stars on top tier */}
            {[12, 55, 100].map((x, i) => (
              <div key={i} className="absolute top-[20px] text-gold-400" style={{ left: `${x}px`, fontSize: '16px' }}>⭐</div>
            ))}
          </div>
        </div>

        {/* ── CANDLES ─────────────────────────────────────────────── */}
        {Array.from({ length: TOTAL_CANDLES }).map((_, i) => {
          const isOut = i < candlesOut;
          const xPositions = [45, 75, 100, 125, 155]; // positions on top tier
          return (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${(340 - 140) / 2 + xPositions[i]}px`,
                bottom: '302px',
              }}
            >
              {/* Candle body */}
              <div
                className="w-3 rounded-sm mx-auto"
                style={{
                  height: '32px',
                  background: `linear-gradient(90deg, ${['#f43f5e','#8b5cf6','#f59e0b','#14b8a6','#f43f5e'][i]}, ${['#fb7185','#a78bfa','#fbbf24','#2dd4bf','#fb7185'][i]})`,
                  boxShadow: isOut ? 'none' : '0 0 8px rgba(251,191,36,0.4)',
                }}
              />
              {/* Flame / smoke */}
              {isOut ? (
                /* Smoke wisp */
                <div className="w-1 mx-auto animate-pulse" style={{ height: '20px', background: 'linear-gradient(to top, rgba(200,200,200,0.5), transparent)', filter: 'blur(2px)' }} />
              ) : (
                /* Realistic candle flame */
                <div className="relative mx-auto flex flex-col items-center" style={{ width: '14px', marginBottom: '-2px' }}>
                  {/* Inner flame glow */}
                  <div
                    className="absolute w-5 h-5 rounded-full opacity-60 animate-pulse"
                    style={{ background: 'radial-gradient(circle, #fde68a, transparent)', filter: 'blur(6px)', top: '-10px' }}
                  />
                  {/* Outer flame body */}
                  <div
                    className="w-3 animate-[float_0.8s_ease-in-out_infinite_alternate]"
                    style={{
                      height: '18px',
                      background: 'linear-gradient(to top, #f43f5e, #f97316 40%, #fbbf24 80%, #fff 100%)',
                      clipPath: 'polygon(50% 0%, 80% 60%, 65% 100%, 35% 100%, 20% 60%)',
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* ── CUT PROGRESS VISUAL ─────────────────────────────── */}
        {cutProgress > 0 && (
          <div
            className="absolute top-[25%] left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-white to-transparent"
            style={{ height: `${cutProgress * 200}px`, boxShadow: '0 0 8px 2px rgba(255,255,255,0.5)', opacity: 0.8 }}
          />
        )}

        {/* ── TABLE SURFACE & PLATE ───────────────────────────── */}
        <div
          className="absolute bottom-[-18px] left-1/2 -translate-x-1/2"
          style={{
            width: '360px',
            height: '36px',
            background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 70%)',
            filter: 'blur(10px)',
          }}
        />
      </div>
    </div>
  );
}

export default CakeModel3D;
