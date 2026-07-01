import React from 'react';

export function LetterGlow({ phase }) {
  const isVisible = ['memory-bloom', 'butterfly-forming', 'butterfly-flight', 'seal-pulse', 'seal-crack', 'letter-opening', 'writing', 'finished'].includes(phase);

  return (
    <div 
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] h-[92vh] max-w-[980px] pointer-events-none z-10 transition-all duration-1000 mix-blend-screen ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
      style={{
        background: 'radial-gradient(circle at center, rgba(251,191,36,0.18) 0%, rgba(244,114,182,0.08) 34%, rgba(0,0,0,0) 72%)',
        filter: 'blur(24px)'
      }}
    />
  );
}

export default LetterGlow;
