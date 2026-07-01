import React, { useMemo } from 'react';

/**
 * MemoryParticles
 * Emits slow floating hearts, butterflies, sparkles, and dust streams.
 */
export function MemoryParticles({ active }) {
  const elements = useMemo(() => {
    const symbols = ['🦋', '✨', '💖', '⭐', '🌸'];
    const colors = ['#fde68a', '#fda4af', '#fcd34d', '#ccfbf1'];

    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      color: colors[i % colors.length],
      left: `${5 + Math.random() * 90}%`,
      bottom: `${-10 + Math.random() * 20}%`,
      size: 12 + Math.random() * 12,
      delay: Math.random() * -12,
      duration: 12 + Math.random() * 10,
      drift: Math.random() * 40 - 20,
    }));
  }, []);

  if (!active) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-2">
      {elements.map((p) => (
        <div
          key={p.id}
          className="absolute select-none animate-pulse"
          style={{
            left: p.left,
            bottom: p.bottom,
            fontSize: `${p.size}px`,
            color: p.color,
            animation: `floatUp ${p.duration}s ${p.delay}s infinite linear`,
            textShadow: `0 0 8px ${p.color}`,
            opacity: 0.65,
          }}
        >
          {p.symbol}
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.7);
            opacity: 0;
          }
          15% {
            opacity: 0.8;
          }
          85% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-90vh) rotate(360deg) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default MemoryParticles;
