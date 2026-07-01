import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Massive, cinematic mahogany royal doors with gold engravings and magical seal.
 * Exposes methods via ref for the master timeline to animate unlocking and opening.
 */
const RoyalDoors = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const leftDoorRef = useRef(null);
  const rightDoorRef = useRef(null);
  const lockRef = useRef(null);
  const sealSpinRef = useRef(null);
  const glowRef = useRef(null);
  const handlesRef = useRef([]);

  // Continuous magical seal rotation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(sealSpinRef.current, {
        rotation: 360,
        duration: 20,
        repeat: -1,
        ease: 'none'
      });
    }, lockRef);
    return () => ctx.revert();
  }, []);

  // Expose animation hooks to the master timeline in index.jsx
  useImperativeHandle(ref, () => ({
    getLeftDoor: () => leftDoorRef.current,
    getRightDoor: () => rightDoorRef.current,
    getLock: () => lockRef.current,
    getHandles: () => handlesRef.current,
    getGlow: () => glowRef.current,
    getContainer: () => containerRef.current,
    
    // Play wrong answer flash
    playErrorFlash: () => {
      gsap.fromTo(glowRef.current, 
        { opacity: 0, background: 'radial-gradient(circle, rgba(239,68,68,0.7) 0%, transparent 70%)' },
        { opacity: 1, duration: 0.1, yoyo: true, repeat: 3 }
      );
      // Briefly flash the lock red
      gsap.fromTo(lockRef.current,
        { boxShadow: '0 0 20px rgba(251,191,36,0.4)' },
        { boxShadow: '0 0 40px rgba(239,68,68,0.8)', duration: 0.2, yoyo: true, repeat: 1 }
      );
    }
  }));

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none opacity-0 scale-90 translate-y-10"
      style={{ perspective: '1500px', zIndex: 10 }}
    >
      {/* Background glow behind doors (lights up when opening or error) */}
      <div 
        ref={glowRef}
        className="absolute w-[100vw] h-[100vh] bottom-0 opacity-0 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle at bottom center, rgba(251,191,36,0.8) 0%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0
        }}
      />

      <div className="relative flex w-[120vw] max-w-[1000px] h-[95vh] shadow-[0_-20px_100px_rgba(0,0,0,0.9)] rounded-t-[40%] overflow-visible border-[12px] border-[#291408] border-b-0">
        
        {/* Left Door */}
        <div 
          ref={leftDoorRef}
          className="relative w-1/2 h-full bg-[#1a0c05] rounded-tl-[40%] border-r-2 border-[#0a0401] transform-gpu origin-left overflow-hidden"
          style={{ 
            boxShadow: 'inset -15px 0 30px rgba(0,0,0,0.8), inset 5px 5px 15px rgba(255,255,255,0.05)',
            backgroundImage: `
              linear-gradient(90deg, rgba(255,255,255,0.02) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.5) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)
            `
          }}
        >
          {/* Engravings with Bevels */}
          <div className="absolute inset-8 rounded-tl-[35%] border-2 border-[#b48600]/40 shadow-[inset_0_0_10px_rgba(0,0,0,0.8),0_0_5px_rgba(251,191,36,0.2)]" />
          <div className="absolute inset-16 rounded-tl-[30%] border border-[#f59e0b]/20 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]" />
          
          {/* Metallic Gold Trim Panel */}
          <div className="absolute bottom-20 left-10 right-10 h-1/3 border-2 border-[#b48600]/50 rounded-md bg-gradient-to-br from-[#2a1306]/50 to-[#140802]/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-[#f59e0b]/30 opacity-50" />
          </div>
          
          {/* Handle */}
          <div 
            ref={el => handlesRef.current[0] = el}
            className="absolute right-6 top-[55%] w-6 h-24 bg-gradient-to-b from-[#fde68a] via-[#f59e0b] to-[#b45309] rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3),inset_2px_0_5px_rgba(255,255,255,0.5)] z-20"
          />
        </div>

        {/* Right Door */}
        <div 
          ref={rightDoorRef}
          className="relative w-1/2 h-full bg-[#1a0c05] rounded-tr-[40%] border-l-2 border-[#2a1306] transform-gpu origin-right overflow-hidden"
          style={{ 
            boxShadow: 'inset 15px 0 30px rgba(0,0,0,0.8), inset -5px 5px 15px rgba(255,255,255,0.05)',
            backgroundImage: `
              linear-gradient(-90deg, rgba(255,255,255,0.02) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.5) 100%),
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)
            `
          }}
        >
          {/* Engravings with Bevels */}
          <div className="absolute inset-8 rounded-tr-[35%] border-2 border-[#b48600]/40 shadow-[inset_0_0_10px_rgba(0,0,0,0.8),0_0_5px_rgba(251,191,36,0.2)]" />
          <div className="absolute inset-16 rounded-tr-[30%] border border-[#f59e0b]/20 shadow-[inset_0_0_5px_rgba(0,0,0,0.5)]" />
          
          {/* Metallic Gold Trim Panel */}
          <div className="absolute bottom-20 left-10 right-10 h-1/3 border-2 border-[#b48600]/50 rounded-md bg-gradient-to-br from-[#2a1306]/50 to-[#140802]/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border border-[#f59e0b]/30 opacity-50" />
          </div>
          
          {/* Handle */}
          <div 
            ref={el => handlesRef.current[1] = el}
            className="absolute left-6 top-[55%] w-6 h-24 bg-gradient-to-b from-[#fde68a] via-[#f59e0b] to-[#b45309] rounded-full shadow-[0_0_15px_rgba(251,191,36,0.3),inset_-2px_0_5px_rgba(255,255,255,0.5)] z-20"
          />
        </div>

        {/* Magical Royal Seal (Center) */}
        <div 
          ref={lockRef}
          className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 flex items-center justify-center z-30"
        >
          {/* Outer glowing ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#fde68a] to-[#d97706] shadow-[0_0_30px_rgba(251,191,36,0.6),inset_0_0_15px_rgba(255,255,255,0.8)] border-4 border-[#fffbeb]" />
          
          {/* Rotating magical runes ring */}
          <div 
            ref={sealSpinRef}
            className="absolute inset-2 rounded-full border-[3px] border-dashed border-[#fffbeb] opacity-70 mix-blend-overlay"
          />

          {/* Inner dark core */}
          <div className="absolute inset-6 rounded-full bg-[#1a0a03] shadow-[inset_0_0_20px_rgba(0,0,0,1)] flex items-center justify-center">
            {/* Magical crest (Crown silhouette) */}
            <svg className="w-8 h-8 text-[#fde68a] opacity-90 drop-shadow-[0_0_8px_#fde68a]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
});

export default RoyalDoors;
