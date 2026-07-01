import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';

/**
 * Premium golden gradient royal button with GSAP interactions, shimmer, and loading states.
 */
const RoyalButton = forwardRef(({ disabled, onClick, isLoading }, ref) => {
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const shimmerRef = useRef(null);
  const sparklesRef = useRef([]);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current
  }));

  const handleMouseEnter = () => {
    if (disabled || isLoading) return;
    gsap.to(buttonRef.current, { scale: 1.05, duration: 0.4, ease: 'back.out(1.7)' });
    
    // Shimmer sweep
    gsap.fromTo(shimmerRef.current, 
      { x: '-100%', opacity: 0 },
      { x: '100%', opacity: 0.5, duration: 0.8, ease: 'power2.inOut' }
    );
    
    // Sparkles
    sparklesRef.current.forEach((sparkle, i) => {
      gsap.to(sparkle, { 
        rotation: 180 + (Math.random() * 90), 
        scale: 1 + Math.random(), 
        opacity: 0.8, 
        duration: 0.5 + (i * 0.1),
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    });
  };

  const handleMouseLeave = () => {
    if (disabled || isLoading) return;
    gsap.to(buttonRef.current, { scale: 1, duration: 0.4, ease: 'power2.out' });
    gsap.killTweensOf(sparklesRef.current);
    gsap.to(sparklesRef.current, { rotation: 0, scale: 0, opacity: 0, duration: 0.4 });
  };

  const handleMouseDown = () => {
    if (disabled || isLoading) return;
    gsap.to(buttonRef.current, { scale: 0.95, duration: 0.1 });
  };

  const handleMouseUp = () => {
    if (disabled || isLoading) return;
    gsap.to(buttonRef.current, { scale: 1.05, duration: 0.3, ease: 'back.out(2)' });
  };

  return (
    <div 
      ref={containerRef} 
      className="mt-8 flex justify-center opacity-0 scale-95"
      style={{ zIndex: 20 }}
    >
      <button
        ref={buttonRef}
        onClick={onClick}
        disabled={disabled || isLoading}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        className="relative group px-14 py-4 rounded-full border-[1.5px] border-[#fde68a]/60 bg-gradient-to-b from-[#b45309] via-[#f59e0b] to-[#92400e] shadow-[0_0_20px_rgba(251,191,36,0.4),inset_0_2px_5px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:grayscale-[60%] transition-opacity overflow-hidden"
      >
        <span className="relative z-10 font-display font-bold text-xl text-[#fffbeb] tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          {isLoading ? 'SEEKING...' : 'ENTER'}
        </span>
        
        {/* Shimmer Effect */}
        <div 
          ref={shimmerRef}
          className="absolute top-0 left-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transform -skew-x-12 z-0 pointer-events-none"
        />
        
        {/* Sparkles */}
        {[...Array(3)].map((_, i) => (
          <div 
            key={i}
            ref={el => sparklesRef.current[i] = el}
            className="absolute w-3 h-3 opacity-0 pointer-events-none z-20"
            style={{
              top: i === 0 ? '-4px' : i === 1 ? 'auto' : '50%',
              bottom: i === 1 ? '-4px' : 'auto',
              left: i === 0 ? '10%' : i === 1 ? '80%' : '90%',
            }}
          >
            <div className="absolute inset-0 bg-white rotate-45 transform origin-center clip-star shadow-[0_0_10px_#fff]" />
          </div>
        ))}
        
        {/* Loading Ring */}
        {isLoading && (
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin opacity-80 z-20" />
        )}
      </button>
    </div>
  );
});

export default RoyalButton;
