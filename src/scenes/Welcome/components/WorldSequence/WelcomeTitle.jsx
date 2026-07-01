import React, { forwardRef, useImperativeHandle, useRef } from 'react';

/**
 * Elegant Welcome Title.
 * "Welcome to the Enchanted Kingdom"
 * "Tonight is a very special celebration."
 */
const WelcomeTitle = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
    getTitle: () => titleRef.current,
    getSubtitle: () => subtitleRef.current
  }));

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center pointer-events-none opacity-0"
      style={{ zIndex: 10 }}
    >
      <h1 
        ref={titleRef}
        className="font-display text-4xl md:text-5xl lg:text-6xl text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-100 to-gold-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)] opacity-0 transform translate-y-4"
        style={{ letterSpacing: '0.05em' }}
      >
        ✨ Welcome to the Enchanted Kingdom ✨
      </h1>
      
      <p 
        ref={subtitleRef}
        className="mt-6 font-display italic text-xl md:text-2xl text-gold-200 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)] opacity-0 transform translate-y-4"
      >
        Tonight is a very special celebration.
      </p>
    </div>
  );
});

export default WelcomeTitle;
