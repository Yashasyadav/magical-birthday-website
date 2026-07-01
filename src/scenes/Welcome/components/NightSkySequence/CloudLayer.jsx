import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * Procedural CSS clouds using box-shadow clusters.
 * Slow drifting clouds passing in front of the moon and stars.
 */
const CloudLayer = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const cloud1Ref = useRef(null);
  const cloud2Ref = useRef(null);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current
  }));

  useEffect(() => {
    // Very slow drift
    gsap.to(cloud1Ref.current, {
      x: '10vw',
      duration: 60,
      ease: 'none',
      repeat: -1,
      yoyo: true
    });

    gsap.to(cloud2Ref.current, {
      x: '-15vw',
      duration: 80,
      ease: 'none',
      repeat: -1,
      yoyo: true
    });
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none opacity-0 overflow-hidden"
      style={{ zIndex: 6 }}
    >
      <div 
        ref={cloud1Ref}
        className="absolute top-[5%] left-[20%] w-[40vw] h-[20vh] rounded-[50%]"
        style={{
          background: 'rgba(255,255,255,0.02)',
          filter: 'blur(40px)',
          boxShadow: '200px 50px 100px rgba(255,255,255,0.03), -150px -20px 80px rgba(255,255,255,0.02)'
        }}
      />
      <div 
        ref={cloud2Ref}
        className="absolute top-[15%] right-[10%] w-[50vw] h-[25vh] rounded-[50%]"
        style={{
          background: 'rgba(200,200,255,0.015)',
          filter: 'blur(50px)',
          boxShadow: '-200px 30px 100px rgba(200,200,255,0.02)'
        }}
      />
    </div>
  );
});

export default CloudLayer;
