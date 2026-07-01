import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Aurora effect using highly blurred, slowly moving CSS gradients.
 * Colors: Blue, Purple, Pink. Soft movement. Almost invisible. Large scale.
 */
const Aurora = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current
  }));

  useEffect(() => {
    // Slow drifting animation for aurora waves
    gsap.to(wave1Ref.current, {
      x: '10vw',
      y: '5vh',
      rotation: 5,
      duration: 15,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });

    gsap.to(wave2Ref.current, {
      x: '-10vw',
      y: '-5vh',
      rotation: -5,
      duration: 20,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-0 mix-blend-screen overflow-hidden"
      style={{ zIndex: 2 }}
    >
      <div 
        ref={wave1Ref}
        className="absolute top-[-20%] left-[-20%] w-[140%] h-[80%] rounded-[100%]"
        style={{
          background: 'linear-gradient(90deg, rgba(20,184,166,0) 0%, rgba(139,92,246,0.15) 30%, rgba(244,63,94,0.1) 70%, rgba(139,92,246,0) 100%)',
          filter: 'blur(80px)',
          transform: 'rotate(-10deg)'
        }}
      />
      
      <div 
        ref={wave2Ref}
        className="absolute top-[10%] left-[-10%] w-[120%] h-[70%] rounded-[100%]"
        style={{
          background: 'linear-gradient(90deg, rgba(139,92,246,0) 0%, rgba(45,212,191,0.1) 40%, rgba(139,92,246,0.15) 60%, rgba(139,92,246,0) 100%)',
          filter: 'blur(100px)',
          transform: 'rotate(5deg)'
        }}
      />
    </div>
  );
});

export default Aurora;
