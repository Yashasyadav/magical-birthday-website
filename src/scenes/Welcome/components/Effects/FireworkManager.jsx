import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import particleManager from '@engine/ParticleManager';

/**
 * A highly optimized DOM-based Firework Manager.
 * For true cinematic fireworks, Canvas is usually better, but given the constraints,
 * we will simulate realistic fireworks using GSAP and layered DOM elements.
 * Fireworks launch from behind the castle.
 */
const FireworkManager = forwardRef((props, ref) => {
  const containerRef = useRef(null);
  const [bursts, setBursts] = useState([]);
  let burstIdCounter = useRef(0);

  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
    
    /**
     * Launch a single firework.
     * @param {Object} options { x (vw), targetY (vh), color, isHeart }
     */
    launch: (options) => {
      const id = burstIdCounter.current++;
      const fw = { id, ...options, phase: 'launching', particles: [] };
      setBursts(prev => [...prev, fw]);
    }
  }));

  // When a new firework is added, animate its launch
  useEffect(() => {
    bursts.forEach(fw => {
      if (fw.phase === 'launching') {
        const shellId = `fw-shell-${fw.id}`;
        const shellEl = document.getElementById(shellId);
        if (shellEl) {
          gsap.fromTo(shellEl,
            { y: '100vh', opacity: 1 },
            { 
              y: `${fw.targetY}vh`, 
              duration: 1.5, 
              ease: 'power2.out',
              onComplete: () => explode(fw.id) 
            }
          );
          fw.phase = 'flying';
        }
      }
    });
  }, [bursts]);

  const explode = (id) => {
    setBursts(prev => prev.map(fw => {
      if (fw.id === id) {
        // Generate particles based on shape
        const pCount = fw.isHeart ? 40 : 50;
        const particles = Array.from({ length: pCount }).map((_, i) => {
          let angle, velocity;
          if (fw.isHeart) {
            // Heart shape math
            const t = (i / pCount) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            angle = Math.atan2(hy, hx);
            velocity = Math.sqrt(hx*hx + hy*hy) * 3; // Scale velocity
          } else {
            angle = (i / pCount) * Math.PI * 2 + (Math.random() * 0.2);
            velocity = 40 + Math.random() * 60;
          }
          return { id: i, angle, velocity, life: 1.5 + Math.random() * 0.5 };
        });
        return { ...fw, phase: 'exploding', particles };
      }
      return fw;
    }));
  };

  // Animate particles when a burst explodes
  useEffect(() => {
    bursts.forEach(fw => {
      if (fw.phase === 'exploding') {
        const particlesGroup = document.getElementById(`fw-burst-${fw.id}`);
        if (particlesGroup && !fw.animated) {
          fw.animated = true; // prevent re-running
          
          const ctx = gsap.context(() => {
            fw.particles.forEach(p => {
              const el = document.getElementById(`fw-p-${fw.id}-${p.id}`);
              if (el) {
                const vx = Math.cos(p.angle) * p.velocity;
                const vy = Math.sin(p.angle) * p.velocity;
                
                // Explode outwards
                gsap.to(el, {
                  x: vx,
                  y: vy,
                  duration: p.life,
                  ease: 'power3.out'
                });
                
                // Gravity effect
                gsap.to(el, {
                  y: `+=${50}`, // Fall down
                  duration: p.life,
                  ease: 'power1.in',
                  delay: p.life * 0.3
                });

                // Fade out
                gsap.to(el, {
                  opacity: 0,
                  duration: p.life * 0.5,
                  delay: p.life * 0.5,
                  ease: 'none'
                });
              }
            });

            // Clean up burst after explosion
            setTimeout(() => {
              setBursts(current => current.filter(b => b.id !== fw.id));
            }, 3000);
          }, particlesGroup);
          
          // No revert here because elements get unmounted by React state anyway
        }
      }
    });
  }, [bursts]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 12 }} // Behind the castle (z=15), in front of sky
    >
      {bursts.map(fw => (
        <React.Fragment key={fw.id}>
          {/* Shell flying up */}
          {fw.phase === 'flying' && (
            <div 
              id={`fw-shell-${fw.id}`}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${fw.x}vw`,
                bottom: 0,
                backgroundColor: fw.color,
                boxShadow: `0 0 10px 2px ${fw.color}`,
                filter: 'blur(1px)'
              }}
            >
              {/* Trail */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-12 opacity-50" style={{ background: `linear-gradient(to bottom, ${fw.color}, transparent)` }} />
            </div>
          )}

          {/* Explosion */}
          {(fw.phase === 'exploding' || fw.animated) && (
            <div 
              id={`fw-burst-${fw.id}`}
              className="absolute"
              style={{
                left: `${fw.x}vw`,
                top: `${fw.targetY}vh`,
              }}
            >
              {fw.particles.map(p => (
                <div
                  key={p.id}
                  id={`fw-p-${fw.id}-${p.id}`}
                  className="absolute w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: fw.color,
                    boxShadow: `0 0 8px 1px ${fw.color}`,
                  }}
                />
              ))}
              
              {/* Central Flash */}
              <div 
                className="absolute w-20 h-20 -ml-10 -mt-10 rounded-full mix-blend-screen animate-ping"
                style={{
                  background: `radial-gradient(circle, ${fw.color} 0%, transparent 70%)`,
                  animationDuration: '0.5s',
                  animationFillMode: 'forwards'
                }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

export default FireworkManager;
