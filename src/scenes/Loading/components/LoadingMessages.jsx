import React, { useState, useEffect, useRef } from 'react';
import { useLoading } from '../hooks/useLoading';
import gsap from 'gsap';

/**
 * Rotating cinematic messages with a fade-type-pause-fade effect.
 * Uses luxurious Disney-inspired typography.
 */
function LoadingMessages() {
  const { currentMessage } = useLoading();
  const [displayedText, setDisplayedText] = useState('');
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    let index = 0;
    let typeInterval = null;
    
    // Create a gsap context so we can revert it easily
    const ctx = gsap.context(() => {
      // First, fade out existing message (if any)
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.inOut',
        onComplete: () => {
          setDisplayedText('');
          
          // Fade container back in to start typing
          gsap.to(containerRef.current, { opacity: 1, duration: 0.4 });
          
          typeInterval = setInterval(() => {
            setDisplayedText((prev) => {
              if (index < currentMessage.length) {
                const nextText = prev + currentMessage[index];
                index++;
                return nextText;
              }
              clearInterval(typeInterval);
              return prev;
            });
          }, 35); // Fast luxury typing
        }
      });
    }, containerRef);

    return () => {
      ctx.revert(); // Kills all animations attached to this context
      if (typeInterval) clearInterval(typeInterval);
    };
  }, [currentMessage]);

  return (
    <div 
      ref={containerRef}
      className="h-10 mb-6 flex items-center justify-center font-display italic text-xl md:text-2xl text-star-pure tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]"
      style={{ opacity: 0 }}
    >
      <p ref={textRef}>
        {displayedText}
        <span className="inline-block animate-pulse ml-1 opacity-70">✨</span>
      </p>
    </div>
  );
}

export default LoadingMessages;
