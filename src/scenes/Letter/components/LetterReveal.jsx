import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import LetterPaper from './LetterPaper';

export const LetterReveal = forwardRef(({ phase, onUnfoldComplete, onInteractInvite, children }, ref) => {
  const containerRef = useRef(null);
  const topFoldRef = useRef(null);
  const bottomFoldRef = useRef(null);
  const leftFlapRef = useRef(null);
  const rightFlapRef = useRef(null);
  const mainPaperRef = useRef(null);

  const [hasInteracted, setHasInteracted] = useState(false);

  useImperativeHandle(ref, () => ({
    container: containerRef.current,
    topFold: topFoldRef.current,
    bottomFold: bottomFoldRef.current,
    leftFlap: leftFlapRef.current,
    rightFlap: rightFlapRef.current,
    mainPaper: mainPaperRef.current,
  }));

  const handlePaperClick = () => {
    if (phase !== 'letter-reveal-wait' || hasInteracted) return;
    setHasInteracted(true);
    if (onInteractInvite) onInteractInvite();
  };

  const isVisible = [
    'letter-rise', 
    'letter-reveal-wait', 
    'letter-unfold-stage1', 
    'letter-unfold-stage2', 
    'letter-unfold-stage3', 
    'letter-unfolding',
    'paper-settle', 
    'pen-arrives', 
    'writing', 
    'finished'
  ].includes(phase);

  return (
    <div 
      ref={containerRef}
      onClick={handlePaperClick}
      className={`absolute z-35 w-[90vw] max-w-[550px] h-[76vh] max-h-[700px] transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${phase === 'letter-reveal-wait' ? 'cursor-pointer hover:scale-[1.025] hover:drop-shadow-[0_45px_70px_rgba(251,191,36,0.22)]' : ''}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '2000px',
        left: 'calc(50% - min(45vw, 275px))',
        top: 'calc(50% - min(38vh, 350px))',
        // Starts low (emerging from envelope coordinates via GSAP)
        transform: 'translateY(100vh) rotateX(4deg)',
      }}
    >
      {/* 1. Underlying flat luxury stationery sheet (Shown during writing/completed phases) */}
      <div 
        ref={mainPaperRef}
        className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-[900ms] shadow-[0_35px_80px_rgba(0,0,0,0.6)] ${['pen-arrives', 'writing', 'finished'].includes(phase) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <LetterPaper>
          {children}
        </LetterPaper>
      </div>

      {/* 2. Coordinated 3D Folding layers used during opening/unfolding phases */}
      <div 
        className={`absolute inset-0 w-full h-full transition-opacity duration-[800ms] ${!['pen-arrives', 'writing', 'finished'].includes(phase) ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Shared SVG fibers definitions for segment background */}
        <svg className="absolute w-0 h-0 pointer-events-none">
          <defs>
            <pattern id="letterFibersPattern" width="150" height="150" patternUnits="userSpaceOnUse">
              <rect width="150" height="150" fill="#fffaf0" />
              <path d="M10,20 Q15,25 12,35" stroke="#78350f" strokeWidth="0.35" fill="none" opacity="0.08" strokeLinecap="round" />
              <path d="M50,85 Q55,75 58,95" stroke="#8b4513" strokeWidth="0.3" fill="none" opacity="0.06" strokeLinecap="round" />
              <path d="M110,40 Q105,55 115,65" stroke="#78350f" strokeWidth="0.4" fill="none" opacity="0.1" strokeLinecap="round" />
            </pattern>
          </defs>
        </svg>

        {/* Main Base Card (Middle panel) */}
        <div 
          className="absolute inset-[33.3%_0%_33.3%_0%] bg-[#faf7f0] border-y border-[#eae5d9]/60 shadow-[inset_0_0_20px_rgba(120,53,4,0.02)]"
          style={{
            transformStyle: 'preserve-3d',
            backgroundImage: 'url(#letterFibersPattern)',
            backgroundSize: '150px 150px'
          }}
        >
          {/* Internal gold frame line matching final letter styling */}
          <div className="absolute inset-x-5 inset-y-1.5 border-x border-amber-600/25 pointer-events-none" />

          {/* Top Fold Panel */}
          <div 
            ref={topFoldRef}
            className="absolute bottom-full left-0 w-full h-full bg-[#faf7f0] origin-bottom border-b border-[#eae5d9]/60 shadow-inner"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transform: 'rotateX(178deg)',
              backgroundImage: 'url(#letterFibersPattern)',
              backgroundSize: '150px 150px'
            }}
          >
            <div className="absolute inset-x-5 inset-y-5 border border-b-0 border-amber-600/25 pointer-events-none" />
          </div>

          {/* Bottom Fold Panel */}
          <div 
            ref={bottomFoldRef}
            className="absolute top-full left-0 w-full h-full bg-[#f6f3eb] origin-top border-t border-[#eae5d9]/60 shadow-md"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transform: 'rotateX(-178deg)',
              backgroundImage: 'url(#letterFibersPattern)',
              backgroundSize: '150px 150px'
            }}
          >
            <div className="absolute inset-x-5 inset-y-5 border border-t-0 border-amber-600/25 pointer-events-none" />
          </div>

          {/* Left Wing Flap overlay */}
          <div 
            ref={leftFlapRef}
            className="absolute inset-y-0 left-0 w-[30%] bg-[#faf7f0] origin-left border-r border-[#eae5d9]/40"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(175deg)',
              backgroundImage: 'url(#letterFibersPattern)',
              backgroundSize: '150px 150px'
            }}
          />

          {/* Right Wing Flap overlay */}
          <div 
            ref={rightFlapRef}
            className="absolute inset-y-0 right-0 w-[30%] bg-[#faf7f0] origin-right border-l border-[#eae5d9]/40"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(-175deg)',
              backgroundImage: 'url(#letterFibersPattern)',
              backgroundSize: '150px 150px'
            }}
          />
        </div>
      </div>
      
      {/* Click interaction overlay indicator */}
      {phase === 'letter-reveal-wait' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <button 
            className="px-8 py-3.5 rounded-full font-display uppercase tracking-widest text-[#5c2e0b] bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 hover:scale-105 active:scale-95 transition-all duration-300 animate-bounce shadow-[0_15px_40px_rgba(251,191,36,0.45)] pointer-events-auto border border-amber-400/35"
            style={{ cursor: 'pointer' }}
          >
            Open Letter ✨
          </button>
        </div>
      )}
    </div>
  );
});

LetterReveal.displayName = 'LetterReveal';

export default LetterReveal;
