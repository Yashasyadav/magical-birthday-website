/**
 * PrincessCharacter.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders the princess in 3D:
 *   1. Silhouette — pure dark shape with glowing backlight from castle doorway
 *   2. Full colour — the Rapunzel 3D model with custom cinematic lights,
 *      tiara sparkles, and magical dress particles.
 *
 * Both forms share the same position. GSAP fades between them.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { forwardRef, useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import gsap from 'gsap';

// ── 3D Model mesh loading ─────────────────────────────────────────────────────
function RapunzelMesh() {
  const { scene } = useGLTF('/models/disney_infinity1-_tangled_rapunzel.glb');

  // Traverse model to setup shadows and materials
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          // Adjust physical properties for rich, premium look under directionals
          child.material.roughness = 0.55;
          child.material.metalness = 0.1;
          child.material.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <primitive 
      object={scene} 
      scale={2.2} 
    />
  );
}

// Preload the model asset
useGLTF.preload('/models/disney_infinity1-_tangled_rapunzel.glb');

// ── 3D Canvas wrapper ─────────────────────────────────────────────────────────
function Rapunzel3DCanvas() {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5], fov: 38 }}
      style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      <ambientLight intensity={1.3} color="#ffffff" />
      
      {/* Strong directional front-key light matching pathway theme */}
      <directionalLight 
        position={[3, 5, 2]} 
        intensity={2.0} 
        color="#ffeaa7" 
        castShadow 
        shadow-mapSize={[1024, 1024]}
      />
      
      {/* Cool blue fill light matching moonlight/sky */}
      <directionalLight 
        position={[-3, 4, -2]} 
        intensity={1.2} 
        color="#a7c7fd" 
      />
      
      {/* Warm golden backlight matching the glowing castle door leak! */}
      <pointLight 
        position={[0, 1.5, -2.5]} 
        intensity={3.0} 
        color="#fbbf24" 
        distance={6}
      />
      
      <Suspense fallback={null}>
        <Center>
          <RapunzelMesh />
        </Center>
      </Suspense>
    </Canvas>
  );
}

// ── Tiara Sparkle — tiny star bursts above the tiara ──────────────────────────
function TiaraSparkles() {
  const sparkles = useMemo(() =>
    Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      x: `${40 + Math.random() * 20}%`,
      y: `${-8 + Math.random() * 12}%`,
      size: Math.random() * 6 + 3,
      delay: `${Math.random() * 4}s`,
      duration: `${Math.random() * 2 + 3}s`,
      color: ['#fde68a', '#fff176', '#ffffff', '#fbbf24'][Math.floor(Math.random() * 4)],
    })),
  []);

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {sparkles.map(s => (
        <div
          key={s.id}
          className="absolute"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          {/* 4-point star */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: s.color,
              clipPath: 'polygon(50% 0%, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0% 50%, 40% 40%)',
              animation: `tiaraSparkle ${s.duration} ease-in-out ${s.delay} infinite`,
              filter: `drop-shadow(0 0 4px ${s.color})`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ── Dress Particles — tiny golden motes that drift from the hem ────────────────
function DressParticles() {
  const containerRef = useRef(null);
  const motes = useMemo(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: `${Math.random() * 100}%`,
      y: `${70 + Math.random() * 30}%`,
      size: Math.random() * 3 + 1,
      color: ['#fde68a', '#ffffff', '#ffc2d4', '#fff176'][Math.floor(Math.random() * 4)],
    })),
  []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const dots = containerRef.current?.querySelectorAll('.dress-mote');
      if (!dots) return;
      dots.forEach(dot => {
        gsap.to(dot, {
          y: -gsap.utils.random(30, 80),
          x: gsap.utils.random(-20, 20),
          opacity: 0,
          scale: 0,
          duration: gsap.utils.random(2, 5),
          delay: gsap.utils.random(0, 4),
          repeat: -1,
          ease: 'power1.out',
          onRepeat() {
            gsap.set(dot, { y: 0, opacity: 0.8, scale: 1 });
          },
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, [motes]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      {motes.map(m => (
        <div
          key={m.id}
          className="dress-mote absolute rounded-full"
          style={{
            width: m.size,
            height: m.size,
            backgroundColor: m.color,
            left: m.x,
            top: m.y,
            boxShadow: `0 0 ${m.size * 3}px ${m.color}`,
            opacity: 0.8,
          }}
        />
      ))}
    </div>
  );
}

// ── Princess Character (main export) ──────────────────────────────────────────

/**
 * @param {{ silhouetteRef, bodyRef }} props
 */
const PrincessCharacter = forwardRef(function PrincessCharacter(
  { silhouetteRef, bodyRef },
  princessRef
) {
  return (
    <div
      className="absolute flex flex-col items-center pointer-events-none"
      style={{
        // Positioned above the pathway center — princess starts at door
        bottom: '18%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9,
        width: 'clamp(140px, 22vw, 320px)',
      }}
    >
      {/* ── 1. Silhouette Form ──────────────────────────────────────────── */}
      {/* This shows first — pure dark shape with glowing backlight */}
      <div
        ref={silhouetteRef}
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0,
          zIndex: 2,
          width: '100%',
          height: '100%',
        }}
      >
        <div style={{
          width: '100%',
          height: '100%',
          aspectRatio: '2/3',
          filter: 'brightness(0) drop-shadow(0 0 35px rgba(255,200,80,0.85)) drop-shadow(0 0 70px rgba(255,160,30,0.5))',
        }}>
          <Rapunzel3DCanvas />
        </div>
      </div>

      {/* ── 2. Full Colour Princess ─────────────────────────────────────── */}
      {/* This is the main princess — revealed after silhouette fades */}
      <div
        ref={princessRef}
        className="relative"
        style={{
          opacity: 0,
          zIndex: 3,
          width: '100%',
          height: '100%',
        }}
      >
        {/* Walk body bob — inner container that bobs while the outer walks forward */}
        <div ref={bodyRef} className="relative" style={{ width: '100%', height: '100%' }}>
          <div style={{
            width: '100%',
            height: '100%',
            aspectRatio: '2/3',
            filter: 'drop-shadow(0 0 25px rgba(255,200,80,0.4)) drop-shadow(0 0 50px rgba(200,220,255,0.2))',
          }}>
            <Rapunzel3DCanvas />
          </div>

          {/* ── Tiara sparkles ─────────────────────────────────────────── */}
          <TiaraSparkles />

          {/* ── Dress motes / fairy dust from hem ──────────────────────── */}
          <DressParticles />
        </div>
      </div>
    </div>
  );
});

export default PrincessCharacter;
