import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Animated magical dialogue from the castle.
 * Types out the dialogue sequence line by line using GSAP.
 */
const QuestionCard = forwardRef(({ dialogueSequence, onComplete }, ref) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [currentText, setCurrentText] = useState('');

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
    
    // Animate the entire dialogue sequence
    playDialogue: () => {
      const tl = gsap.timeline();
      
      dialogueSequence.forEach((line, index) => {
        // Fade out previous line
        if (index > 0) {
          tl.to(textRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => setCurrentText('')
          });
        }
        
        // Prepare new line
        tl.call(() => {
          setCurrentText(line);
          gsap.set(textRef.current, { opacity: 1 });
        });

        // "Type" effect using GSAP TextPlugin if we had it, but we can fake it by animating a clip-path 
        // or just a custom tween. Since we don't have TextPlugin imported, we can do a simple custom tween.
        const obj = { length: 0 };
        tl.to(obj, {
          length: line.length,
          duration: line.length * 0.05, // Speed
          ease: 'none',
          onUpdate: () => {
            setCurrentText(line.substring(0, Math.floor(obj.length)));
          }
        });

        // Pause to read
        tl.to({}, { duration: 1.5 });
      });

      // When all lines finish
      tl.call(() => {
        if (onComplete) onComplete();
      });

      return tl;
    }
  }));

  return (
    <div 
      ref={containerRef}
      className="opacity-0 w-full flex items-center justify-center mb-8 h-12"
      style={{ zIndex: 20 }}
    >
      <p 
        ref={textRef}
        className="font-display italic text-2xl md:text-3xl text-gold-200 tracking-wider text-center drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
      >
        {currentText}
        {currentText.length > 0 && <span className="animate-pulse ml-1">✨</span>}
      </p>
    </div>
  );
});

export default QuestionCard;
