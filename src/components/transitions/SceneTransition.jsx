import React, { useEffect, useRef, useState } from 'react';
import { useTransitionContext } from '@context/TransitionContext';
import soundManager from '@engine/SoundManager';

export function SceneTransition() {
  const {
    activeTransition,
    countdown,
    showOverlay,
    isTransitioning,
    isNavigating,
    preparingMessage,
    prefersReducedMotion,
    skipCountdown,
  } = useTransitionContext();

  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const sparklesRef = useRef([]);

  // Handle card click-anywhere to skip countdown
  const handleCardClick = (e) => {
    // Avoid double trigger if clicking button or during navigation
    if (isNavigating) return;
    soundManager.playSfx('buttonClick');
    skipCountdown();
  };

  // Keyboard shortcut listener (Enter/Spacebar)
  useEffect(() => {
    if (!showOverlay || isNavigating) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        soundManager.playSfx('buttonClick');
        skipCountdown();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showOverlay, isNavigating, skipCountdown]);

  // Fullscreen Sweep Canvas particles loop
  useEffect(() => {
    if (!isTransitioning || prefersReducedMotion) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    // Seed initial sweep particles from the left
    const particles = [];
    const colorPalette = ['#fde68a', '#fbbf24', '#fffbeb', '#fcd34d', '#ffffff'];

    class Particle {
      constructor() {
        // Start on the left 20% of screen with velocity to the right
        this.x = Math.random() * (width * 0.2);
        this.y = Math.random() * height;
        this.vx = 8 + Math.random() * 15;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = 1 + Math.random() * 3.5;
        this.color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        this.alpha = 0.5 + Math.random() * 0.5;
        this.decay = 0.005 + Math.random() * 0.015;
        this.glow = 5 + Math.random() * 12;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.shadowBlur = this.glow;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        // Draw star or circle
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }
    }

    // Generate wave of sweep particles
    for (let i = 0; i < 180; i++) {
      setTimeout(() => {
        if (isTransitioning) {
          particles.push(new Particle());
        }
      }, Math.random() * 600);
    }

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      // Render & update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.alpha <= 0 || p.x > width) {
          particles.splice(i, 1);
        }
      }

      // Add a few ambient continuous sparkles during transition holding
      if (particles.length < 80 && Math.random() < 0.4) {
        const p = new Particle();
        p.x = 0; // restart sweep wave
        particles.push(p);
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isTransitioning, prefersReducedMotion]);

  // Seed sparkles *around the glass card* on mount/show
  useEffect(() => {
    if (!showOverlay) {
      sparklesRef.current = [];
      return;
    }

    const count = prefersReducedMotion ? 0 : 8;
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        top: Math.random() * 80 + 10,
        left: Math.random() * 80 + 10,
        scale: 0.5 + Math.random() * 0.8,
        delay: Math.random() * -3,
        duration: 2.5 + Math.random() * 2,
      });
    }
    sparklesRef.current = list;
  }, [showOverlay, prefersReducedMotion]);

  if (!showOverlay && !isTransitioning) return null;

  const totalDuration = activeTransition?.countdownDuration || 6;
  const progressRatio = Math.max(0, Math.min(1, countdown / totalDuration));
  const circleRadius = 58;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeOffset = circumference * (1 - progressRatio);

  return (
    <>
      {/* ── Fullscreen Blocking Layer to Prevent Multiple Click Navigations ── */}
      {isNavigating && (
        <div 
          className="fixed inset-0 z-[999999] cursor-wait pointer-events-auto bg-transparent" 
          onClick={(e) => e.stopPropagation()} 
        />
      )}

      {/* ── Fullscreen Page Transition Layer ── */}
      {isTransitioning && (
        <div 
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center transition-all duration-[600ms] ease-out bg-[#04020f]/90"
          style={{
            backdropFilter: prefersReducedMotion ? 'none' : 'brightness(0.6)',
          }}
        >
          {/* Sweep Canvas */}
          {!prefersReducedMotion && (
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
          )}

          {/* Slow loading alert indicator */}
          {preparingMessage && (
            <div className="relative z-10 flex flex-col items-center gap-4 bg-black/60 px-8 py-5 rounded-2xl border border-gold-400/20 backdrop-blur-md animate-pulse">
              <span className="text-2xl animate-spin">✨</span>
              <p className="font-display text-gold-200 text-sm tracking-widest uppercase">
                Preparing your next surprise...
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Floating Glass Transition Card Overlay ── */}
      {showOverlay && activeTransition && (
        <div 
          className="fixed inset-x-0 bottom-12 z-[1000] flex justify-center pointer-events-none px-4 select-none"
        >
          {/* CSS Animation and Custom Styles Inject */}
          <style>{`
            @keyframes cardFloat {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
            .animate-card-float {
              animation: prefers-reduced-motion: reduce ? none : cardFloat 4s ease-in-out infinite;
            }
            @keyframes sparkleTwinkle {
              0%, 100% { opacity: 0.1; transform: scale(0.8); }
              50% { opacity: 0.9; transform: scale(1.2); }
            }
            .animate-sparkle {
              animation: sparkleTwinkle var(--dur) ease-in-out infinite;
              animation-delay: var(--delay);
            }
            .glow-btn::after {
              content: '';
              position: absolute;
              inset: 0;
              border-radius: 9999px;
              box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            .glow-btn:hover::after {
              opacity: 1;
            }
          `}</style>

          <div
            onClick={handleCardClick}
            className="animate-card-float pointer-events-auto flex flex-col items-center bg-black/30 backdrop-blur-xl border border-gold-400/25 px-8 py-7 rounded-[40px] shadow-[0_0_40px_rgba(251,191,36,0.14)] w-full max-w-[420px] text-center cursor-pointer transition-all duration-300 hover:border-gold-400/40 hover:shadow-[0_0_50px_rgba(251,191,36,0.22)]"
          >
            {/* Corner Decorative Sparkles */}
            {sparklesRef.current.map((sp) => (
              <svg
                key={sp.id}
                viewBox="0 0 24 24"
                className="absolute w-4 h-4 text-gold-300 animate-sparkle"
                style={{
                  top: `${sp.top}%`,
                  left: `${sp.left}%`,
                  '--delay': `${sp.delay}s`,
                  '--dur': `${sp.duration}s`,
                }}
              >
                <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" fill="currentColor" />
              </svg>
            ))}

            {/* Icon Banner */}
            <div className="text-3xl mb-4 filter drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]">
              {activeTransition.icon}
            </div>

            {/* Message lines */}
            <div className="space-y-1 mb-6">
              {activeTransition.message.split('\n').map((line, idx) => (
                <p 
                  key={idx} 
                  className="font-display text-white text-base leading-relaxed tracking-wide font-medium"
                >
                  {line}
                </p>
              ))}
            </div>

            {/* Circular Progress Ring wrapping Continue Button */}
            <div className="relative flex items-center justify-center w-[150px] h-[150px] my-1">
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 140 140">
                {/* Background Ring */}
                <circle 
                  cx="70" 
                  cy="70" 
                  r={circleRadius} 
                  className="stroke-white/5 fill-none" 
                  strokeWidth="2.5" 
                />
                {/* Progress Ring */}
                <circle 
                  cx="70" 
                  cy="70" 
                  r={circleRadius} 
                  className="stroke-gold-400 fill-none"
                  strokeWidth="2.5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                  strokeLinecap="round"
                  style={{
                    transition: prefersReducedMotion ? 'none' : 'stroke-dashoffset 1s linear',
                    filter: 'drop-shadow(0 0 5px rgba(251, 191, 36, 0.6))',
                  }}
                />
              </svg>

              <button
                onClick={(e) => {
                  e.stopPropagation(); // Avoid triggering card click
                  handleCardClick();
                }}
                disabled={isNavigating}
                className="glow-btn relative z-10 px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500 text-night-950 font-sans text-[10px] font-extrabold tracking-[0.2em] uppercase select-none transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_4px_15px_rgba(251,191,36,0.32)]"
              >
                {activeTransition.buttonText}
              </button>
            </div>

            {/* Countdown Text */}
            <div className="font-sans text-white/40 text-[9px] font-bold tracking-[0.25em] uppercase mt-2">
              Automatically continuing in {countdown}...
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SceneTransition;
