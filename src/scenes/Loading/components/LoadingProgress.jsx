import React, { useRef, useEffect } from 'react';
import { useLoading } from '../hooks/useLoading';
import gsap from 'gsap';

/**
 * Luxury gold gradient progress bar showing real asset loading progress.
 * Smooth interpolation, no abrupt jumps, animated shine, and a tiny spark.
 */
function LoadingProgress() {
  const { progress } = useLoading();
  const fillRef = useRef(null);
  const sparkRef = useRef(null);
  const shineRef = useRef(null);
  const textRef = useRef(null);
  
  // Format percentage
  const percentage = Math.min(100, Math.floor(progress * 100));

  useEffect(() => {
    // Smooth interpolation for the width to prevent abrupt jumps
    gsap.to(fillRef.current, {
      width: `${percentage}%`,
      duration: 0.8,
      ease: 'power3.out'
    });
    
    // Spark follows the edge
    gsap.to(sparkRef.current, {
      left: `${percentage}%`,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Animate the text percentage
    gsap.to(textRef.current, {
      innerHTML: `${percentage}%`,
      duration: 0.8,
      snap: { innerHTML: 1 },
      ease: 'power3.out'
    });

  }, [percentage]);

  useEffect(() => {
    // Animated shine sweeping across the bar
    gsap.to(shineRef.current, {
      x: '300%',
      duration: 2.5,
      repeat: -1,
      ease: 'sine.inOut',
      delay: 1
    });
  }, []);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
      {/* Percentage Text with elegant font */}
      <div 
        ref={textRef}
        className="mb-3 text-gold-400 font-display font-semibold text-2xl tracking-[0.2em] drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
      >
        0%
      </div>
      
      {/* Bar Container - Soft glow, rounded corners */}
      <div className="relative w-full h-2 bg-night-800/80 backdrop-blur-md rounded-full overflow-hidden border border-gold-500/20 shadow-[0_0_15px_rgba(0,0,0,0.5),inset_0_1px_3px_rgba(0,0,0,0.8)]">
        
        {/* Animated Fill */}
        <div 
          ref={fillRef}
          className="absolute top-0 left-0 h-full rounded-full w-0 overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, #b45309 0%, #f59e0b 50%, #fde68a 100%)',
            boxShadow: '0 0 12px rgba(251,191,36,0.8)'
          }}
        >
          {/* Shine Effect */}
          <div 
            ref={shineRef}
            className="absolute top-0 bottom-0 left-[-100%] w-[50%] skew-x-[-20deg]"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
            }}
          />
        </div>
        
        {/* Spark traveling along the edge */}
        <div
          ref={sparkRef}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full mix-blend-screen opacity-90"
          style={{
            left: '0%',
            background: 'radial-gradient(circle, #ffffff 0%, rgba(253,230,138,0.8) 40%, transparent 70%)',
            filter: 'blur(1px)',
            boxShadow: '0 0 10px #ffffff, 0 0 20px #fbbf24'
          }}
        />
      </div>
    </div>
  );
}

export default LoadingProgress;
