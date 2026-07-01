import React, { forwardRef } from 'react';

export const GoldenPen = forwardRef((props, ref) => {
  return (
    <div 
      ref={ref}
      className="absolute w-28 h-28 pointer-events-none z-50 filter drop-shadow-[0_0_24px_rgba(251,191,36,0.7)]"
      style={{
        opacity: 0,
        transformOrigin: 'bottom left',
        // The writing tip is at bottom-left corner of the container
        marginLeft: '-3px',
        marginTop: '-109px',
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: 'rotate(-6deg)' }}>
        <defs>
          <linearGradient id="goldFeatherGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="30%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#eab308" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
          <linearGradient id="quillFeatherGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="50%" stopColor="#fef8e6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Quill Feather ornament - shiny golden details */}
        <path 
          d="M 12 88 Q 32 52 78 8 Q 58 42 12 88 Z" 
          fill="url(#quillFeatherGrad)" 
          stroke="url(#goldFeatherGrad)" 
          strokeWidth="0.8" 
        />
        <path d="M 22 75 Q 36 58 68 18" fill="none" stroke="url(#goldFeatherGrad)" strokeWidth="0.5" />

        {/* Golden Fountain Nib with details */}
        <path 
          d="M 10 90 L 16 80 L 11 76 L 19 68 L 25 73 L 20 80 L 10 90 Z" 
          fill="url(#goldFeatherGrad)" 
          stroke="#543005" 
          strokeWidth="0.5" 
          strokeLinejoin="round"
        />
        {/* Nib center cut & breathing hole */}
        <line x1="10" y1="90" x2="18" y2="76" stroke="#543005" strokeWidth="0.5" />
        <circle cx="18" cy="76" r="0.75" fill="#543005" />
      </svg>
      
      {/* Ink glow tip - warm golden magical pulse */}
      <div className="absolute bottom-2 left-2 w-4 h-4 bg-yellow-100 rounded-full blur-[2.5px] shadow-[0_0_15px_#fbbf24] mix-blend-screen" />
    </div>
  );
});

GoldenPen.displayName = 'GoldenPen';

export default GoldenPen;
