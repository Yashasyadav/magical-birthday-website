import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import soundManager from '@engine/SoundManager';

export function FriendshipMedallion({ onClick, phase, onHoverChange }) {
  const containerRef = useRef(null);
  const leftHalfRef = useRef(null);
  const rightHalfRef = useRef(null);
  const glowRef = useRef(null);
  const starsContainerRef = useRef(null);
  const shockwaveRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);

  // 1. Magnetic hover tilt and reflection updates
  useEffect(() => {
    const container = containerRef.current;
    if (!container || ['seal-separate', 'flap-open-top', 'finished'].includes(phase)) return;

    let ctx = gsap.context(() => {
      // Soft ambient heartbeat pulse while waiting
      gsap.to(container, {
        scale: 1.05,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }, container);

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      // Rotate towards cursor (3D tilt magnetism)
      gsap.to(container, {
        rotateY: relX * 0.35,
        rotateX: -relY * 0.35,
        x: relX * 0.2,
        y: relY * 0.2,
        duration: 0.3,
        ease: 'power2.out',
      });

      // Specs glare sweep follows mouse angle
      gsap.to('.reflection-sweep', {
        x: `${(relX / rect.width) * 160}%`,
        y: `${(relY / rect.height) * 160}%`,
        duration: 0.45,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      // Reset position with bouncy elasticity
      gsap.to(container, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.45)',
      });

      // Slide reflection back to baseline
      gsap.to('.reflection-sweep', {
        x: '-10%',
        y: '-10%',
        duration: 0.6,
        ease: 'power2.out'
      });

      setIsHovered(false);
      if (onHoverChange) onHoverChange(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      if (onHoverChange) onHoverChange(true);
      soundManager.playSfx('sparkle');
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      ctx.revert();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [phase, onHoverChange]);

  // 2. Separation/click sequence
  useEffect(() => {
    if (phase === 'seal-separate') {
      const tl = gsap.timeline();

      // Click sound chime
      soundManager.playSfx('buttonClick');

      // Vibrate coin before splitting
      tl.to(containerRef.current, {
        x: '+=2.5',
        y: '-=1.5',
        duration: 0.04,
        repeat: 7,
        yoyo: true,
        ease: 'sine.inOut'
      }, 0);

      // Gold shockwave expanding ring
      tl.to(shockwaveRef.current, {
        scale: 6.5,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out'
      }, 0.28);

      // Explode sparks
      tl.add(() => spawnSparks(), 0.28);

      // Fade out medallion glow
      tl.to(glowRef.current, {
        scale: 2.5,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out'
      }, 0.28);

      // Split coin halves outwards and slide sideways
      tl.to(leftHalfRef.current, {
        x: -110,
        rotationY: -65,
        rotationZ: -15,
        opacity: 0,
        duration: 1.8,
        ease: 'power3.inOut'
      }, 0.35);

      tl.to(rightHalfRef.current, {
        x: 110,
        rotationY: 65,
        rotationZ: 15,
        opacity: 0,
        duration: 1.8,
        ease: 'power3.inOut'
      }, 0.35);
    }
  }, [phase]);

  // Spawn 24 dynamic sparkles blasting outwards
  const spawnSparks = () => {
    const wrapper = document.getElementById('medallion-sparks-wrapper');
    if (!wrapper) return;

    for (let i = 0; i < 28; i++) {
      const spark = document.createElement('div');
      spark.className = 'absolute w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-yellow-200 via-amber-300 to-amber-500 pointer-events-none mix-blend-screen';
      spark.style.left = '50%';
      spark.style.top = '50%';
      spark.style.transform = 'translate(-50%, -50%)';
      spark.style.boxShadow = '0 0 6px #fbbf24, 0 0 12px #ffffff';
      wrapper.appendChild(spark);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 110 + 40;
      const targetX = Math.cos(angle) * velocity;
      const targetY = Math.sin(angle) * velocity;

      gsap.to(spark, {
        x: targetX,
        y: targetY,
        scale: 0.05,
        opacity: 0,
        duration: 0.9 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => spark.remove()
      });
    }
  };

  const handleClick = () => {
    if (phase !== 'idle-envelope') return;
    if (onClick) onClick();
  };

  const isInteractive = ['idle-envelope', 'seal-hover'].includes(phase);

  return (
    <div 
      ref={containerRef}
      onClick={handleClick}
      className={`absolute z-50 w-28 h-28 select-none ${isInteractive ? 'cursor-pointer pointer-events-auto' : 'pointer-events-none'}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        left: 'calc(50% - 3.5rem)',
        top: 'calc(50% - 3.5rem)',
        transform: 'translateZ(10px)'
      }}
    >
      {/* Sparks emitter container */}
      <div id="medallion-sparks-wrapper" className="absolute inset-0 pointer-events-none" />

      {/* Medallion Glowing Aura */}
      <div 
        ref={glowRef}
        className={`absolute inset-[-20%] rounded-full bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 blur-xl opacity-0 transition-opacity duration-700 pointer-events-none mix-blend-screen ${isHovered ? 'opacity-85 scale-110' : 'opacity-25'}`}
      />

      {/* Shockwave expanding ring */}
      <div 
        ref={shockwaveRef}
        className="absolute inset-[-10%] border-4 border-yellow-300 rounded-full scale-50 opacity-0 pointer-events-none mix-blend-screen"
        style={{ filter: 'blur(1px)' }}
      />

      {/* Orbiting Stars Container */}
      <div 
        ref={starsContainerRef}
        className={`absolute inset-[-45%] pointer-events-none transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-200 rounded-full blur-[1px] animate-spin" style={{ transformOrigin: 'bottom center', animationDuration: '2.5s' }} />
        <div className="absolute bottom-0 left-1/2 w-2.5 h-2.5 bg-amber-300 rounded-full blur-[1px] animate-spin" style={{ transformOrigin: 'top center', animationDuration: '3.5s', animationDirection: 'reverse' }} />
      </div>

      {/* Left Medallion Half */}
      <div 
        ref={leftHalfRef}
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-gradient-to-r from-[#8a5f1a] via-[#e5c158] to-[#fde08a] border-[3px] border-r-0 border-amber-600/40 rounded-l-full shadow-[inset_1px_1px_3px_rgba(255,255,255,0.75),-4px_4px_12px_rgba(0,0,0,0.5)]"
        style={{
          transformOrigin: 'right center',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="absolute inset-0 w-[200%] h-full flex justify-center items-center">
          <MedallionArt />
        </div>
        {/* Specular reflection sweep bar */}
        <div className="reflection-sweep absolute top-[-50%] left-[-150%] w-[40%] h-[200%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 opacity-80" />
      </div>

      {/* Right Medallion Half */}
      <div 
        ref={rightHalfRef}
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-gradient-to-l from-[#8a5f1a] via-[#e5c158] to-[#fde08a] border-[3px] border-l-0 border-amber-600/40 rounded-r-full shadow-[inset_-1px_1px_3px_rgba(255,255,255,0.75),4px_4px_12px_rgba(0,0,0,0.5)]"
        style={{
          transformOrigin: 'left center',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="absolute inset-0 w-[200%] left-[-100%] h-full flex justify-center items-center">
          <MedallionArt />
        </div>
        {/* Specular reflection sweep bar */}
        <div className="reflection-sweep absolute top-[-50%] left-[-150%] w-[40%] h-[200%] bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 opacity-80" />
      </div>
    </div>
  );
}

// Boy/girl high-five gold emblem illustration (embossed with micro highlights)
function MedallionArt() {
  return (
    <svg viewBox="0 0 100 100" className="w-20 h-20 overflow-visible">
      {/* Micro-scratches texture layer */}
      <g stroke="#ffffff" strokeWidth="0.35" opacity="0.18">
        <line x1="20" y1="30" x2="25" y2="28" />
        <line x1="75" y1="60" x2="80" y2="58" />
        <line x1="30" y1="80" x2="35" y2="78" />
        <line x1="60" y1="20" x2="65" y2="18" />
      </g>
      <g stroke="#451a03" strokeWidth="0.35" opacity="0.25">
        <line x1="21" y1="31" x2="26" y2="29" />
        <line x1="76" y1="61" x2="81" y2="59" />
        <line x1="31" y1="81" x2="36" y2="79" />
      </g>

      {/* Embossed raised rim circles */}
      <circle cx="50" cy="50" r="45" fill="none" stroke="#6f420e" strokeWidth="2.0" opacity="0.8" />
      <circle cx="50" cy="50" r="42" fill="none" stroke="#fffbeb" strokeWidth="0.75" opacity="0.4" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="#78350f" strokeWidth="1.2" strokeDasharray="3, 3" opacity="0.65" />

      {/* Tiny stars engraved around the rim */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const cx = 50 + 35 * Math.cos(rad);
        const cy = 50 + 35 * Math.sin(rad);
        return (
          <polygon
            key={i}
            points="50,15 53,23 61,23 55,28 57,36 50,31 43,36 45,28 39,23 47,23"
            fill="#543005"
            transform={`translate(${cx - 50}, ${cy - 50}) scale(0.22)`}
            opacity="0.85"
          />
        );
      })}

      {/* Friendship illustration silhouette: Boy & Girl High-Five */}
      <g stroke="#543005" strokeWidth="2.8" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.95">
        {/* Embossed Highlight Offset lines */}
        <g stroke="#ffffff" strokeWidth="2.8" opacity="0.3" transform="translate(0.5, 0.5)">
          <path d="M 32 65 C 32 55, 38 52, 42 52" />
          <path d="M 32 65 L 32 75" />
          <path d="M 42 52 L 48 38" />
          <path d="M 68 65 C 68 55, 62 52, 58 52" />
          <path d="M 68 65 L 68 75" />
          <path d="M 58 52 L 52 38" />
        </g>

        {/* Left silhouette: Boy */}
        <path d="M 32 65 C 32 55, 38 52, 42 52" />
        <circle cx="30" cy="42" r="5.5" fill="#543005" stroke="none" />
        <path d="M 32 65 L 32 75" />
        <path d="M 42 52 L 48 38" />

        {/* Right silhouette: Girl */}
        <path d="M 68 65 C 68 55, 62 52, 58 52" />
        <circle cx="70" cy="42" r="5.5" fill="#543005" stroke="none" />
        <path d="M 68 65 L 68 75" />
        <path d="M 58 52 L 52 38" />

        {/* High Five meeting point */}
        <path d="M 48 38 C 50 35, 50 35, 52 38" strokeWidth="3.2" />
        
        {/* Star sparkle at contact */}
        <polygon 
          points="50,26 52,32 58,32 53,36 55,42 50,38 45,42 47,36 42,32 48,32" 
          fill="#d97706" 
          stroke="none" 
        />
      </g>
    </svg>
  );
}

export default FriendshipMedallion;
