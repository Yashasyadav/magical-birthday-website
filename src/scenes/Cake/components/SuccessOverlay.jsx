import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

/**
 * SuccessOverlay
 * Shown after cake is cut. Celebration particles, success message, and Continue button.
 */
function SuccessOverlay({ wish, onContinue }) {
  const containerRef = useRef(null);
  const messageRef = useRef(null);
  const btnRef = useRef(null);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    // Generate confetti particles
    setConfetti(Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: ['#f43f5e','#8b5cf6','#fbbf24','#2dd4bf','#fda4af','#fde68a'][Math.floor(Math.random() * 6)],
      size: 4 + Math.random() * 8,
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
    })));

    const ctx = gsap.context(() => {
      // Overlay fade in
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.inOut' }
      );
      // Message reveal
      gsap.fromTo(messageRef.current,
        { opacity: 0, scale: 0.7, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, delay: 0.5, ease: 'back.out(1.7)' }
      );
      // Button appear
      gsap.fromTo(btnRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.8, ease: 'back.out(1.5)' }
      );
      // Button pulse
      gsap.to(btnRef.current, {
        boxShadow: '0 0 40px rgba(251,191,36,0.8)',
        duration: 1.2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 2.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full z-50 flex flex-col items-center justify-center opacity-0"
      style={{ background: 'radial-gradient(ellipse at center, rgba(4,2,15,0.92) 0%, rgba(4,2,15,0.97) 100%)' }}
    >
      {/* Confetti rain */}
      {confetti.map(p => (
        <div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.x}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.5}px`,
            backgroundColor: p.color,
            animation: `fairyDust ${p.duration}s ${p.delay}s linear infinite`,
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.9,
          }}
        />
      ))}

      {/* Golden glow orb behind message */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #fbbf24, transparent 70%)', filter: 'blur(40px)' }}
      />

      {/* Success message card */}
      <div
        ref={messageRef}
        className="relative z-10 text-center px-10 py-12 rounded-3xl border border-gold-400/20 opacity-0"
        style={{
          background: 'rgba(13,10,30,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 0 80px rgba(251,191,36,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        <div className="text-5xl mb-4">🎂</div>
        <h2 className="font-display text-4xl text-transparent bg-clip-text bg-gradient-to-b from-gold-200 to-gold-400 mb-4">
          Wish Made!
        </h2>
        <p className="font-script text-2xl text-gold-300/90 italic mb-2">
          &ldquo;{wish || 'Enjoy Your Special Day Bhavani!'}&rdquo;
        </p>
        <p className="font-body text-white/50 text-sm mt-4 tracking-widest uppercase">
          May all your dreams come true ✨
        </p>
      </div>

      {/* Continue button */}
      <button
        ref={btnRef}
        onClick={onContinue}
        className="relative mt-10 px-14 py-4 rounded-full font-body font-bold text-lg tracking-widest text-night-950 overflow-hidden hover:scale-105 active:scale-95 transition-transform duration-200 opacity-0 z-10"
        style={{
          background: 'linear-gradient(135deg, #d97706, #fbbf24, #f59e0b)',
          boxShadow: '0 0 25px rgba(251,191,36,0.4)',
        }}
      >
        Continue the Magic →
      </button>
    </div>
  );
}

export default SuccessOverlay;
