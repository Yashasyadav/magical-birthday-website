import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import SceneWrapper from '@components/layout/SceneWrapper';
import CinematicStars from '@components/effects/background/CinematicStars';
import CinematicParticles from '@components/effects/background/CinematicParticles';

/**
 * FinaleScene — Grand Finale placeholder.
 * Displays an animated celebration screen.
 * Full implementation (Phase 14) is pending.
 */
function FinaleScene() {
  const contentRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 2, ease: 'power2.inOut' }
      );
      gsap.fromTo(titleRef.current,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.8, delay: 1, ease: 'back.out(1.5)' }
      );
      // Pulsing golden glow
      gsap.to(titleRef.current, {
        textShadow: '0 0 60px rgba(251,191,36,1)',
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: 2.5,
      });
    }, contentRef);
    return () => ctx.revert();
  }, []);

  return (
    <SceneWrapper sceneName="finale" className="bg-night-950">
      <div
        ref={contentRef}
        className="absolute inset-0 w-full h-full flex flex-col items-center justify-center opacity-0"
        style={{ background: 'radial-gradient(ellipse at center, rgba(76,29,149,0.3) 0%, #04020f 70%)' }}
      >
        <CinematicStars />
        <CinematicParticles type="fairy-dust" count={40} />

        {/* Grand finale text */}
        <div ref={titleRef} className="relative z-10 text-center px-8 opacity-0">
          <div className="text-6xl mb-6">🎉🎂🎉</div>
          <h1
            className="font-display text-5xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-gold-200 via-gold-400 to-gold-300"
            style={{ letterSpacing: '4px' }}
          >
            Happy Birthday!
          </h1>
          <p className="mt-6 font-script text-3xl text-gold-300/80 italic">
            Bhavani ✨
          </p>
          <p className="mt-4 font-body text-white/45 text-xs tracking-widest uppercase">
            May your day be as magical as you are
          </p>
          <p className="mt-8 font-display text-gold-200 text-base md:text-lg max-w-md mx-auto leading-relaxed font-semibold filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.2)]">
            ✨ Thank you for being part of this magical day.<br/>Your smile was the greatest gift.
          </p>

          <div className="mt-12 flex flex-col items-center select-none pointer-events-none animate-fadeIn">
            <div className="w-20 h-[1px] bg-gold-400/20 mb-6" />
            <h2 className="font-serif italic text-xl md:text-2xl text-gold-300/50 tracking-wider mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              And they lived happily ever after...
            </h2>
            <span className="text-xs font-sans text-white/40 tracking-[0.4em] uppercase">
              The End
            </span>
          </div>
        </div>

        {/* Ambient golden glow */}
        <div
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>
    </SceneWrapper>
  );
}

export default FinaleScene;
