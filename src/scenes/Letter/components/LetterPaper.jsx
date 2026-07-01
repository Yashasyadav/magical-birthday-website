import React from 'react';

export function LetterPaper({ children }) {
  return (
    <div 
      className="relative w-full h-full overflow-hidden rounded-[28px] border border-[#d5c39c] shadow-[0_45px_95px_rgba(0,0,0,0.65),inset_0_0_40px_rgba(255,255,255,0.45)] animate-letter-breath" 
      style={{ 
        transform: 'rotateX(0.4deg) rotateZ(-0.08deg)',
        backgroundImage: `
          linear-gradient(135deg, #fffcf6 0%, #f7eccf 50%, #efe1b6 100%),
          url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")
        `
      }}
    >
      {/* Repeating organic paper fibers overlay */}
      <div 
        className="absolute inset-0 opacity-[0.14] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12,22 Q18,27 15,38 M48,78 Q55,73 60,88 M95,45 Q88,60 98,70 M115,108 Q125,118 120,128 M35,115 Q25,122 30,130' stroke='%237c5f3b' stroke-width='0.45' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px'
        }}
      />

      {/* Volumetric paper curvature shadow (light on left, soft shadow on right/bottom) */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_15px_15px_30px_rgba(255,255,255,0.7),inset_-15px_-15px_35px_rgba(110,65,5,0.04)]" />

      {/* Dynamic light reflection glow overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.45),rgba(255,255,255,0)_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(245,158,11,0.05),rgba(0,0,0,0)_50%)] pointer-events-none" />

      {/* Shared Gold foil gradient definitions inside local SVG */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <linearGradient id="paperGoldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9a74a" />
            <stop offset="50%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#b45309" />
          </linearGradient>
        </defs>
      </svg>

      {/* Gold Foil Frame */}
      <div className="absolute inset-5 rounded-[22px] border border-amber-600/35 pointer-events-none">
        <div className="absolute inset-[2px] border border-amber-500/10 rounded-[20px]" />
      </div>
      <div className="absolute inset-7 rounded-[18px] border border-[#caa153]/15 pointer-events-none" />

      {/* Luxury Cursive Corner Ornaments */}
      <div className="absolute top-5 left-5 w-12 h-12 pointer-events-none text-amber-700/60">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path d="M 3 3 L 24 3 M 3 3 L 3 24" fill="none" stroke="url(#paperGoldFoil)" strokeWidth="1.6" />
          <path d="M 7 7 Q 18 7 7 18 C 11 12, 12 11, 18 18" fill="none" stroke="url(#paperGoldFoil)" strokeWidth="0.8" />
          <circle cx="28" cy="3" r="1.5" fill="url(#paperGoldFoil)" />
          <circle cx="3" cy="28" r="1.5" fill="url(#paperGoldFoil)" />
        </svg>
      </div>

      <div className="absolute top-5 right-5 w-12 h-12 pointer-events-none text-amber-700/60 transform rotate-90">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path d="M 3 3 L 24 3 M 3 3 L 3 24" fill="none" stroke="url(#paperGoldFoil)" strokeWidth="1.6" />
          <path d="M 7 7 Q 18 7 7 18 C 11 12, 12 11, 18 18" fill="none" stroke="url(#paperGoldFoil)" strokeWidth="0.8" />
          <circle cx="28" cy="3" r="1.5" fill="url(#paperGoldFoil)" />
          <circle cx="3" cy="28" r="1.5" fill="url(#paperGoldFoil)" />
        </svg>
      </div>

      <div className="absolute bottom-5 left-5 w-12 h-12 pointer-events-none text-amber-700/60 transform -rotate-90">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path d="M 3 3 L 24 3 M 3 3 L 3 24" fill="none" stroke="url(#paperGoldFoil)" strokeWidth="1.6" />
          <path d="M 7 7 Q 18 7 7 18 C 11 12, 12 11, 18 18" fill="none" stroke="url(#paperGoldFoil)" strokeWidth="0.8" />
          <circle cx="28" cy="3" r="1.5" fill="url(#paperGoldFoil)" />
          <circle cx="3" cy="28" r="1.5" fill="url(#paperGoldFoil)" />
        </svg>
      </div>

      <div className="absolute bottom-5 right-5 w-12 h-12 pointer-events-none text-amber-700/60 transform rotate-180">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path d="M 3 3 L 24 3 M 3 3 L 3 24" fill="none" stroke="url(#paperGoldFoil)" strokeWidth="1.6" />
          <path d="M 7 7 Q 18 7 7 18 C 11 12, 12 11, 18 18" fill="none" stroke="url(#paperGoldFoil)" strokeWidth="0.8" />
          <circle cx="28" cy="3" r="1.5" fill="url(#paperGoldFoil)" />
          <circle cx="3" cy="28" r="1.5" fill="url(#paperGoldFoil)" />
        </svg>
      </div>

      {/* Embossed dividers */}
      <div className="absolute inset-x-12 top-[13%] h-px bg-gradient-to-r from-transparent via-amber-600/30 to-transparent" />
      <div className="absolute inset-x-12 bottom-[13%] h-px bg-gradient-to-r from-transparent via-amber-600/20 to-transparent" />

      {/* Main Content Area */}
      <div className="relative z-10 w-full h-full p-8 md:p-12 select-none flex flex-col justify-between">
        {children}
      </div>

      <style>{`
        @keyframes letterBreath {
          0% { transform: scale(1) rotateX(0.4deg) rotateZ(-0.08deg); }
          50% { transform: scale(1.004) rotateX(0.2deg) rotateZ(-0.04deg); }
          100% { transform: scale(1) rotateX(0.4deg) rotateZ(-0.08deg); }
        }
        .animate-letter-breath {
          animation: letterBreath 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LetterPaper;
