import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

/**
 * BlowController
 * After wish is validated, this component appears.
 * User taps "Blow" to extinguish candles one by one.
 * Each tap triggers realistic blowing animation + sound cue.
 */
function BlowController({ candlesOut, totalCandles, onBlow, onAllOut }) {
  const containerRef = useRef(null);
  const btnRef = useRef(null);
  const [isBlowing, setIsBlowing] = useState(false);

  useEffect(() => {
    // Entrance animation
    gsap.fromTo(containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }
    );
    // Pulsing idle glow on button
    gsap.to(btnRef.current, {
      boxShadow: '0 0 40px rgba(45,212,191,0.8)',
      duration: 1.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });
  }, []);

  const handleBlow = () => {
    if (candlesOut >= totalCandles) return;
    setIsBlowing(true);

    // Visual feedback: quick scale pump
    gsap.fromTo(btnRef.current,
      { scale: 0.9 },
      { scale: 1, duration: 0.4, ease: 'back.out(2)' }
    );

    // Wind particle burst (CSS keyframe via class toggle)
    setTimeout(() => setIsBlowing(false), 400);
    onBlow();
  };

  const remaining = totalCandles - candlesOut;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col items-center justify-end pb-[10vh] z-20 opacity-0"
    >
      {/* Progress indicator */}
      <div className="flex gap-3 mb-8">
        {Array.from({ length: totalCandles }).map((_, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full transition-all duration-500"
            style={{
              background: i < candlesOut
                ? 'radial-gradient(circle, #9ca3af, #6b7280)'
                : 'radial-gradient(circle, #fde68a, #f59e0b)',
              boxShadow: i < candlesOut ? 'none' : '0 0 10px rgba(251,191,36,0.6)',
            }}
          />
        ))}
      </div>

      {/* Status text */}
      <p className="mb-6 font-body text-gold-200/80 text-sm tracking-widest uppercase">
        {remaining > 0 ? `${remaining} candle${remaining > 1 ? 's' : ''} remaining` : '🎉 All candles out!'}
      </p>

      {/* Blow button */}
      {remaining > 0 && (
        <button
          ref={btnRef}
          onClick={handleBlow}
          className="relative px-14 py-5 rounded-full font-body font-bold text-xl text-night-950 tracking-widest overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #14b8a6, #2dd4bf, #0d9488)',
            boxShadow: '0 0 30px rgba(45,212,191,0.5)',
          }}
        >
          💨 Blow!
          {/* Wind particle lines */}
          {isBlowing && (
            <span className="absolute inset-0 flex items-center justify-start pl-2 pointer-events-none overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-[1px] bg-white/60 animate-[shimmer_0.4s_linear]"
                  style={{ width: `${20 + i * 10}px`, top: `${30 + i * 8}%`, right: 0 }}
                />
              ))}
            </span>
          )}
        </button>
      )}
    </div>
  );
}

export default BlowController;
