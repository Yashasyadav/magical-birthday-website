import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * MakeAWishInput
 * Shows "Make a Wish" text with magical typing animations,
 * and an input that the user must type "Make a Wish" into.
 */
function MakeAWishInput({ value, onChange, onSubmit, isValid, hint }) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }
      );
      // Input reveal with slight delay
      gsap.fromTo(inputRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: 'power3.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Shake animation on wrong input
  const handleSubmit = () => {
    if (!isValid) {
      gsap.fromTo(inputRef.current,
        { x: -8 },
        { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)', clearProps: 'x' }
      );
    }
    onSubmit();
  };

  // Sparkle glow on valid input
  useEffect(() => {
    if (isValid && inputRef.current) {
      gsap.to(inputRef.current, { boxShadow: '0 0 30px rgba(251,191,36,0.8)', duration: 0.4 });
    } else if (inputRef.current) {
      gsap.to(inputRef.current, { boxShadow: '0 0 0px transparent', duration: 0.4 });
    }
  }, [isValid]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full flex flex-col items-center justify-end pb-[8vh] z-20"
    >
      {/* "Make a Wish" title prompt */}
      <div ref={titleRef} className="text-center mb-10 opacity-0">
        <h2
          className="font-script text-6xl text-transparent bg-clip-text bg-gradient-to-b from-gold-200 via-gold-400 to-gold-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.7)]"
          style={{ letterSpacing: '2px' }}
        >
          ✨ Make a Wish ✨
        </h2>
        <p className="mt-3.5 font-body text-gold-200/80 text-base tracking-widest uppercase">
          Type your wish below to light the magic
        </p>
      </div>

      {/* Input area */}
      <div ref={inputRef} className="flex flex-col items-center gap-5 w-full max-w-lg px-6 opacity-0">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="Type: Make a Wish"
          className="w-full px-8 py-5 rounded-2xl font-body text-xl text-gold-50 placeholder-gold-400/40 outline-none transition-all duration-300"
          style={{
            background: 'rgba(13, 10, 30, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(251,191,36,0.4)',
            fontStyle: 'italic',
          }}
        />

        {/* Hint message */}
        {hint && (
          <p className="text-rose-400/90 text-base font-body animate-pulse">
            💫 Hint: Please type &ldquo;Make a Wish&rdquo;
          </p>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="group relative px-12 py-4.5 rounded-full font-body font-semibold text-lg tracking-widest text-gold-50 overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, #b45309, #f59e0b, #d97706)',
            boxShadow: '0 0 20px rgba(251,191,36,0.4), inset 0 1px 4px rgba(255,255,255,0.3)',
            border: '1px solid rgba(251,191,36,0.3)',
          }}
        >
          <span className="relative z-10">Cast Wish ✨</span>
          {/* Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:animate-[shimmer_0.8s_ease-in-out]" />
        </button>
      </div>
    </div>
  );
}

export default MakeAWishInput;
