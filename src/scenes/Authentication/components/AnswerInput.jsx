import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Luxury glassmorphism input field for answering the royal question.
 * Supports GSAP shake error animations and keystroke magic particles.
 */
const AnswerInput = forwardRef(({ disabled, onSubmit }, ref) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const focusGlowRef = useRef(null);
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
    
    // Play error shake animation
    playErrorShake: () => {
      gsap.fromTo(containerRef.current, 
        { x: -10 },
        { x: 10, duration: 0.1, yoyo: true, repeat: 5, ease: 'sine.inOut' }
      );
      // Red glow briefly
      gsap.to(containerRef.current, {
        boxShadow: '0 0 30px rgba(239,68,68,0.8), inset 0 0 15px rgba(239,68,68,0.5)',
        borderColor: 'rgba(239,68,68,0.9)',
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(containerRef.current, {
            boxShadow: '0 0 20px rgba(251,191,36,0.3)',
            borderColor: 'rgba(251,191,36,0.5)',
            duration: 0.5
          });
        }
      });
    },

    focus: () => {
      inputRef.current?.focus();
    },
    
    getValue: () => value
  }));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && value.trim() && !disabled) {
      onSubmit(value);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
    spawnKeystrokeMagic();
  };

  const spawnKeystrokeMagic = () => {
    if (!containerRef.current) return;
    const spark = document.createElement('div');
    spark.className = 'absolute w-1.5 h-1.5 bg-white rounded-full mix-blend-screen pointer-events-none z-50';
    spark.style.boxShadow = '0 0 8px #fde68a, 0 0 15px #f59e0b';
    spark.style.top = '10%';
    spark.style.left = '50%';
    containerRef.current.appendChild(spark);

    // Float towards the lock (which is far above and behind)
    gsap.to(spark, {
      y: -200 - Math.random() * 100, // Travel way up
      x: (Math.random() - 0.5) * 80, // Slight horizontal drift
      scale: 0.2, // Shrink into distance
      opacity: 0,
      duration: 1.5 + Math.random(),
      ease: 'power2.out',
      onComplete: () => {
        if (containerRef.current?.contains(spark)) {
          containerRef.current.removeChild(spark);
        }
      }
    });
  };

  const handleFocus = () => {
    gsap.to(focusGlowRef.current, { opacity: 1, duration: 0.5 });
    gsap.to(containerRef.current, { borderColor: 'rgba(251,191,36,0.8)', duration: 0.5 });
  };

  const handleBlur = () => {
    gsap.to(focusGlowRef.current, { opacity: 0, duration: 0.5 });
    gsap.to(containerRef.current, { borderColor: 'rgba(251,191,36,0.5)', duration: 0.5 });
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-sm mx-auto rounded-full bg-night-950/60 backdrop-blur-xl border-[1.5px] border-gold-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-colors opacity-0 scale-95"
      style={{ zIndex: 20 }}
    >
      {/* Inner Focus Glow */}
      <div 
        ref={focusGlowRef}
        className="absolute inset-0 rounded-full opacity-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 20px rgba(251,191,36,0.4)' }}
      />

      <input
        ref={inputRef}
        type="text"
        disabled={disabled}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Your name, Princess..."
        className="w-full px-8 py-5 bg-transparent border-none outline-none text-center font-display italic tracking-wider text-2xl text-gold-100 placeholder:text-gold-500/40 disabled:opacity-50"
      />
    </div>
  );
});

export default AnswerInput;
