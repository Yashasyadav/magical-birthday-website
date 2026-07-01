import React from 'react';

/**
 * FloatingPhotos
 * Renders the structural lines, golden threads, and handmade decorations
 * (tape, wax seals, dried flowers, handwritten notes) that establish the wall.
 */
export function FloatingPhotos({ lineRef }) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-5 overflow-hidden">
      {/* 1. HANGING THREADS / CLOTHESLINES */}
      <svg 
        ref={lineRef}
        className="absolute top-0 left-0 w-full h-[65%] opacity-25"
        preserveAspectRatio="none"
        viewBox="0 0 1000 100"
      >
        {/* Top Wire Thread */}
        <path d="M 0 35 Q 500 140 1000 35" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="5,6" />
        {/* Bottom Wire Thread */}
        <path d="M 0 65 Q 500 180 1000 65" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,4" />
      </svg>

      {/* 2. HANDCRAFTED CORNER DECORATIONS */}
      {/* Scrap paper tapes */}
      <div 
        className="absolute top-[8%] left-[10%] w-14 h-4 bg-yellow-200/40 rounded-xs border border-yellow-300/10 rotate-[22deg] backdrop-blur-xs opacity-60"
        style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
      />
      <div 
        className="absolute top-[12%] right-[8%] w-16 h-4 bg-yellow-200/40 rounded-xs border border-yellow-300/10 rotate-[-15deg] backdrop-blur-xs opacity-60"
      />

      {/* Wax Seal */}
      <div className="absolute top-[4%] left-[48%] w-9 h-9 rounded-full bg-gradient-to-br from-red-700 to-red-900 border border-red-600/30 flex items-center justify-center shadow-md rotate-[-8deg]">
        <div className="w-5 h-5 rounded-full border border-dashed border-red-200/20 flex items-center justify-center text-[10px] text-red-100 font-bold select-none">
          M
        </div>
      </div>

      {/* Small handwritten labels */}
      <div 
        className="absolute bottom-[20%] left-[6%] bg-amber-50/90 border border-amber-900/10 px-3 py-1.5 rounded-sm shadow-sm rotate-[-6deg]"
        style={{ fontFamily: '"Dancing Script", cursive' }}
      >
        <span className="text-xs text-amber-950/70 font-semibold select-none">
          I kept these safely...
        </span>
      </div>

      {/* Dried flower emoji details */}
      <div className="absolute top-[16%] left-[30%] text-sm opacity-50 select-none">💐</div>
      <div className="absolute bottom-[18%] right-[12%] text-sm opacity-50 select-none">🌹</div>
    </div>
  );
}

export default FloatingPhotos;
