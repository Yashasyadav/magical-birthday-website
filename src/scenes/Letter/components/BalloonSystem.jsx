import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const BALLOON_STYLES = [
  { type: 'gold', color: 'gold' },
  { type: 'pearl', color: 'pearl' },
  { type: 'transparent', color: 'transparent' },
  { type: 'pastel-pink', color: '#ffc1d7' },
  { type: 'pastel-blue', color: '#bce4ff' },
  { type: 'pastel-lavender', color: '#e2d1f9' },
  { type: 'pastel-peach', color: '#ffe4c9' },
  { type: 'rose-gold', color: '#fca5a5' }
];

const BALLOON_SHAPES = ['round', 'heart', 'star'];

export function BalloonSystem({ phase }) {
  const containerRef = useRef(null);
  const [balloons, setBalloons] = useState([]);

  // Generate 48 unique balloons with staggered properties
  useEffect(() => {
    const list = Array.from({ length: 48 }).map((_, i) => {
      const style = BALLOON_STYLES[i % BALLOON_STYLES.length];
      const shape = BALLOON_SHAPES[i % BALLOON_SHAPES.length];
      const size = Math.random() * 35 + 40; // 40px to 75px
      const scale = Math.random() * 0.75 + 0.45; // Depth scale (0.45 to 1.2)
      
      // Select some balloons to pass extremely close to the camera (scale > 2.0)
      const finalScale = i % 11 === 0 ? Math.random() * 1.0 + 2.0 : scale; 
      
      // Calculate depth of field blur based on camera distance (scale)
      let blur = 0;
      if (finalScale > 1.8) {
        blur = Math.round((finalScale - 1.5) * 3); // Blur foreground
      } else if (finalScale < 0.55) {
        blur = 1.5; // Distant background blur
      }

      const startX = (Math.random() - 0.5) * 90; // Emerges from inside envelope center
      const delay = Math.random() * 3.5; // Staggered launch times (0 to 3.5 seconds delay)
      const opacity = finalScale > 1.8 ? 0.93 : Math.random() * 0.2 + 0.8;

      return {
        id: i,
        shape,
        style: style.type,
        color: style.color,
        size,
        scale: finalScale,
        blur,
        startX,
        delay,
        opacity,
      };
    });
    setBalloons(list);
  }, []);

  // Trigger floating animations
  useEffect(() => {
    if (phase === 'balloon-launch') {
      const container = containerRef.current;
      if (!container) return;

      const balloonNodes = container.querySelectorAll('.balloon-item');
      
      balloonNodes.forEach((node, index) => {
        const data = balloons[index];
        if (!data) return;

        // Reset positions (inside the envelope coordinates)
        gsap.set(node, { 
          y: 60, 
          x: data.startX, 
          opacity: 0, 
          rotation: (Math.random() - 0.5) * 15 
        });

        const tl = gsap.timeline({ delay: data.delay });

        // Fade in as it floats up out of envelope cavity
        tl.to(node, {
          opacity: data.opacity,
          duration: 0.6,
          ease: 'power1.out'
        }, 0);

        // Vertical float speed depends on depth/size
        const duration = Math.random() * 4.5 + 5.0; // 5 to 9.5 seconds to pass screen
        tl.to(node, {
          y: -window.innerHeight - 300,
          duration: duration,
          ease: 'power1.in',
        }, 0);

        // Sinusoidal wind drift sway and dynamic spinning rotations
        tl.to(node, {
          x: data.startX + (Math.random() - 0.5) * 180,
          rotation: (Math.random() - 0.5) * 45,
          duration: duration * 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'sine.inOut'
        }, 0);
      });
    }
  }, [phase, balloons]);

  if (['idle', 'scene-fade', 'golden-light'].includes(phase)) return null;

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-hidden"
    >
      {balloons.map((b) => {
        const filterVal = b.blur > 0 
          ? `drop-shadow(0 8px 15px rgba(0,0,0,0.18)) blur(${b.blur}px)` 
          : 'drop-shadow(0 8px 15px rgba(0,0,0,0.18))';

        return (
          <div
            key={b.id}
            className="balloon-item absolute left-1/2 top-1/2 w-12 h-16 opacity-0"
            style={{
              marginLeft: '-1.5rem',
              marginTop: '-2rem',
              transform: `scale(${b.scale})`,
              zIndex: b.scale > 1.8 ? 52 : 28, // Large foreground balloons float in front of letter paper
              filter: filterVal
            }}
          >
            <svg 
              width={b.size} 
              height={b.size * 1.35} 
              viewBox="0 0 100 135" 
              className="overflow-visible"
            >
              <defs>
                {/* Metallic Gold Gradient */}
                <radialGradient id={`goldGrad-${b.id}`} cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#fffbeb" />
                  <stop offset="35%" stopColor="#fbbf24" />
                  <stop offset="70%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#78350f" />
                </radialGradient>

                {/* Iridescent Pearl Gradient */}
                <radialGradient id={`pearlGrad-${b.id}`} cx="30%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#faeef5" />
                  <stop offset="65%" stopColor="#e0f2fe" />
                  <stop offset="90%" stopColor="#c7d2fe" />
                  <stop offset="100%" stopColor="#b8afd6" stopOpacity="0.8" />
                </radialGradient>

                {/* Transparent Glass Highlight */}
                <radialGradient id={`transGrad-${b.id}`} cx="35%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="30%" stopColor="#ffffff" stopOpacity="0.15" />
                  <stop offset="85%" stopColor="#ffffff" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#f3e8ff" stopOpacity="0.3" />
                </radialGradient>

                {/* Standard Pastel Highlight */}
                <radialGradient id={`pastelGrad-${b.id}`} cx="35%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                  <stop offset="45%" stopColor={b.color} />
                  <stop offset="100%" stopColor={getDarkTone(b.color)} />
                </radialGradient>
              </defs>

              {/* Balloon Shapes */}
              {b.shape === 'round' && (
                <ellipse 
                  cx="50" 
                  cy="50" 
                  rx="40" 
                  ry="48" 
                  fill={`url(#${b.style}Grad-${b.id})`} 
                  stroke={b.style === 'transparent' ? 'rgba(255,255,255,0.45)' : 'none'}
                  strokeWidth={b.style === 'transparent' ? 1.0 : 0}
                />
              )}
              {b.shape === 'heart' && (
                <path 
                  d="M 50 25 C 40 5, 10 5, 10 40 C 10 70, 50 100, 50 100 C 50 100, 90 70, 90 40 C 90 5, 60 5, 50 25 Z" 
                  fill={`url(#${b.style}Grad-${b.id})`}
                  stroke={b.style === 'transparent' ? 'rgba(255,255,255,0.45)' : 'none'}
                  strokeWidth={b.style === 'transparent' ? 1.0 : 0}
                />
              )}
              {b.shape === 'star' && (
                <polygon 
                  points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" 
                  fill={`url(#${b.style}Grad-${b.id})`}
                  stroke={b.style === 'transparent' ? 'rgba(255,255,255,0.45)' : 'none'}
                  strokeWidth={b.style === 'transparent' ? 1.0 : 0}
                />
              )}

              {/* Secondary Specular Hotspot reflection for transparent glass */}
              {b.style === 'transparent' && (
                <circle cx="35" cy="35" r="10" fill="#ffffff" opacity="0.45" filter="blur(1px)" />
              )}

              {/* Knot at bottom */}
              <polygon points="46,98 54,98 50,90" fill={getDarkTone(b.color)} />

              {/* Organic Wiggling String */}
              <path 
                d="M 50 98 Q 45 110 55 120 T 50 132" 
                fill="none" 
                stroke="rgba(255,255,255,0.3)" 
                strokeWidth="1.2" 
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
}

// Generates shading tones based on balloon styles
function getDarkTone(color) {
  if (color === 'gold') return '#78350f';
  if (color === 'pearl') return '#8e82b3';
  if (color === 'transparent') return 'rgba(255,255,255,0.1)';
  // Conversions for pastel Hex codes
  if (color === '#ffc1d7') return '#b86682'; // Deep Pink
  if (color === '#bce4ff') return '#4a82a8'; // Deep Sky Blue
  if (color === '#e2d1f9') return '#795ca1'; // Deep Lavender
  if (color === '#ffe4c9') return '#b38256'; // Deep Peach
  if (color === '#fca5a5') return '#991b1b'; // Deep Red Gold
  return '#120b30'; // fallback dark
}

export default BalloonSystem;
