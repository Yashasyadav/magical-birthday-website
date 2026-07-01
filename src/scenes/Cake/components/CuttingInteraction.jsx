import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';

/**
 * CuttingInteraction
 * Renders a royal knife that follows the pointer/touch.
 * User drags from top to bottom of the cake to cut it.
 * Reports progress 0→1 via onProgress callback.
 */
function CuttingInteraction({ onProgress, cutProgress }) {
  const containerRef = useRef(null);
  const knifeRef = useRef(null);
  const promptRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [knifePos, setKnifePos] = useState({ x: 0, y: -80 });
  const startY = useRef(null);

  // Entrance animation for knife
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(knifeRef.current,
        { opacity: 0, x: 80, rotation: -15 },
        { opacity: 1, x: 0, rotation: 0, duration: 1.2, ease: 'power3.out', delay: 0.5 }
      );
      gsap.fromTo(promptRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.5, ease: 'power2.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const getRelativeY = useCallback((clientY) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return (clientY - rect.top) / rect.height;
  }, []);

  const handlePointerMove = useCallback((e) => {
    const clientX = e.touches?.[0]?.clientX ?? e.clientX;
    const clientY = e.touches?.[0]?.clientY ?? e.clientY;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setKnifePos({ x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height * 0.35 });

    if (isDragging && startY.current !== null) {
      const progress = Math.max(0, Math.min(1, (clientY - startY.current) / 200));
      onProgress(progress);
    }
  }, [isDragging, onProgress]);

  const handlePointerDown = useCallback((e) => {
    setIsDragging(true);
    startY.current = e.touches?.[0]?.clientY ?? e.clientY;
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    startY.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-30 cursor-none select-none"
      onMouseMove={handlePointerMove}
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
    >
      {/* Prompt text */}
      <div ref={promptRef} className="absolute bottom-[8vh] left-1/2 -translate-x-1/2 text-center opacity-0">
        <p className="font-body text-gold-200 text-sm tracking-widest uppercase">
          🔪 Click &amp; drag downward to cut the cake
        </p>
        {/* Cut progress bar */}
        <div className="mt-3 w-48 h-1.5 rounded-full bg-white/10 overflow-hidden mx-auto">
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ width: `${cutProgress * 100}%`, background: 'linear-gradient(90deg, #fbbf24, #f59e0b)' }}
          />
        </div>
      </div>

      {/* Knife — follows cursor */}
      <div
        ref={knifeRef}
        className="absolute pointer-events-none opacity-0 transition-[left,top] duration-75"
        style={{
          left: `calc(50% + ${knifePos.x}px)`,
          top: `calc(35% + ${knifePos.y}px)`,
          transform: 'translate(-50%, -100%)',
          zIndex: 40,
        }}
      >
        {/* Knife SVG: handle + blade */}
        <svg width="60" height="160" viewBox="0 0 60 160" className="drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
          {/* Handle */}
          <rect x="20" y="0" width="20" height="60" rx="8" fill="url(#handleGrad)" />
          <defs>
            <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#e5e7eb" />
              <stop offset="40%" stopColor="#f9fafb" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>
          </defs>
          {/* Guard */}
          <rect x="12" y="56" width="36" height="8" rx="3" fill="#d97706" />
          {/* Blade */}
          <path d="M 28 64 L 32 64 L 38 160 L 22 160 Z" fill="url(#bladeGrad)" />
          {/* Blade highlight */}
          <line x1="30" y1="68" x2="32" y2="155" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}

export default CuttingInteraction;
