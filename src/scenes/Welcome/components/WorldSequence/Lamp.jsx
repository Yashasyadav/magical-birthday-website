import React, { forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * A magical pathway lamp.
 * Receives scale and position to simulate 3D perspective.
 */
const Lamp = forwardRef(({ left, bottom, scale }, ref) => {
  const lightRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    getLight: () => lightRef.current
  }));

  return (
    <div 
      className="absolute flex flex-col items-center"
      style={{
        left: `${left}%`,
        bottom: `${bottom}%`,
        transform: `scale(${scale})`,
        zIndex: 25
      }}
    >
      {/* Light Core (Fades in via GSAP) */}
      <div 
        ref={lightRef}
        className="w-4 h-4 rounded-full opacity-0"
        style={{
          background: 'radial-gradient(circle, #ffffff 0%, #fde68a 60%, transparent 100%)',
          boxShadow: '0 0 20px 5px rgba(251,191,36,0.6), 0 0 40px 10px rgba(251,191,36,0.3)',
          filter: 'blur(2px)'
        }}
      />
      
      {/* Post */}
      <div className="w-[2px] h-12 bg-gradient-to-b from-gold-600 to-night-900 mt-1 shadow-md" />
    </div>
  );
});

export default Lamp;
