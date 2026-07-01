import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { CAKE_CONFIG } from '../../../config/cake';

/**
 * Fairy Component
 * A 3D magical helper with flapping wings and a glowing body.
 * Flies in, catches the star "19" in the sky, transfers magic to candles, and exit animations.
 */
function Fairy({ flyState, onTouchStar, onCandleGlow, onPortalOpened, fairyPosRef, starRef, knifeRef }) {
  const fairyRef = useRef(null);
  const leftWingRef = useRef(null);
  const rightWingRef = useRef(null);
  const wandRef = useRef(null);

  // Expose fairy position to parent ref for particle trails
  useFrame((state) => {
    if (fairyRef.current && fairyPosRef) {
      fairyPosRef.current.copy(fairyRef.current.position);
    }
  });

  // Wing flapping & floating up-and-down motion
  useFrame((state) => {
    if (leftWingRef.current && rightWingRef.current && fairyRef.current) {
      const elapsed = state.clock.getElapsedTime();
      // Rapid wing flapping
      const flap = Math.sin(elapsed * 45) * 0.6;
      leftWingRef.current.rotation.y = flap;
      rightWingRef.current.rotation.y = -flap;
      
      // Floating up-down drift
      fairyRef.current.position.y += Math.sin(elapsed * 4) * 0.002;
    }
  });

  useEffect(() => {
    if (!fairyRef.current) return;

    if (flyState === 'enter') {
      const tl = gsap.timeline();
      // Reset position offscreen upper left
      gsap.set(fairyRef.current.position, { x: -4, y: 3.5, z: 2 });
      
      // Flight 1: Fly around the cake in circle
      tl.to(fairyRef.current.position, { x: -1.5, y: 2.2, z: 1.5, duration: 1.5, ease: 'power2.out' });
      tl.to(fairyRef.current.position, { x: 1.5, y: 2.5, z: -1.5, duration: 2.0, ease: 'sine.inOut' });
      
      // Flight 2: Fly towards the floating sky star
      tl.to(fairyRef.current.position, {
        x: 0,
        y: 3.2,
        z: -1,
        duration: 1.8,
        ease: 'power2.out',
        onComplete: () => {
          if (onTouchStar) onTouchStar(); // Catches the star
        }
      });
    }

    if (flyState === 'transfer_candles') {
      const tl = gsap.timeline();
      // Position candles relative to cake center:
      const candlePositions = [
        { x: -0.4, y: 2.05, z: 0.15 },
        { x: -0.2, y: 2.05, z: 0.35 },
        { x: 0.0, y: 2.05, z: 0.42 },
        { x: 0.2, y: 2.05, z: 0.35 },
        { x: 0.4, y: 2.05, z: 0.15 },
      ];

      // Fly to each candle in sequence, waving wand
      candlePositions.forEach((pos, idx) => {
        tl.to(fairyRef.current.position, {
          x: pos.x,
          y: pos.y + 0.35,
          z: pos.z + 0.15,
          duration: 0.7,
          ease: 'power1.out',
          onComplete: () => {
            if (onCandleGlow) onCandleGlow(idx);
          }
        });
      });
    }

    if (flyState === 'summon_knife') {
      const tl = gsap.timeline();
      // Fly high to summon the magical portal
      tl.to(fairyRef.current.position, {
        x: 0,
        y: 4.2,
        z: -0.5,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => {
          if (onPortalOpened) onPortalOpened();
        }
      });
    }

    if (flyState === 'celebrate') {
      const tl = gsap.timeline();
      // Fly happily around the cake
      tl.to(fairyRef.current.position, { x: -1.8, y: 2.4, z: 1.0, duration: 1.5, ease: 'sine.inOut' });
      tl.to(fairyRef.current.position, { x: 1.8, y: 2.6, z: -1.0, duration: 1.5, ease: 'sine.inOut' });
      tl.to(fairyRef.current.position, { x: 0, y: 3.5, z: 1.5, duration: 1.5, ease: 'power2.out' });
    }

    if (flyState === 'exit') {
      const tl = gsap.timeline();
      // Fly upwards and disappear into the stars
      tl.to(fairyRef.current.position, {
        x: 0,
        y: 6.0,
        z: -3,
        duration: 2.0,
        ease: 'power2.in',
      });
    }
  }, [flyState, onTouchStar, onCandleGlow, onPortalOpened]);

  if (flyState === 'idle') return null;

  return (
    <group ref={fairyRef} position={[-4, 3.5, 2]}>
      {/* Fairy body */}
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshBasicMaterial color="#fef08a" />
      </mesh>
      
      {/* Golden wings */}
      <mesh ref={leftWingRef} position={[-0.07, 0, 0]} rotation={[0, 0, 0.3]}>
        <planeGeometry args={[0.16, 0.22]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={rightWingRef} position={[0.07, 0, 0]} rotation={[0, 0, -0.3]}>
        <planeGeometry args={[0.16, 0.22]} />
        <meshBasicMaterial color="#fbbf24" transparent opacity={0.8} side={THREE.DoubleSide} />
      </mesh>

      {/* Wand */}
      <group ref={wandRef} position={[0.05, -0.05, 0.05]}>
        <mesh rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.16, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
      
      <pointLight color="#fef08a" intensity={2.0} distance={1.8} />
    </group>
  );
}

/**
 * ProceduralCake
 * Procedural 3D cake meshes (PBR materials, shadows, reflections).
 */
export function ProceduralCake({
  candlesOut,
  cutProgress,
  isWedgeCut,
  starGlow,
  flyState,
  onTouchStar,
  onCandleGlow,
  onPortalOpened,
  fairyPosRef,
  starWandAttached,
  knifeSummoned,
  knifePosition,
  candleGlowState,
}) {
  const cakeGroup = useRef(null);
  const wedgeGroup = useRef(null);
  const plateGroup = useRef(null);
  const starRef = useRef(null);
  const knifeRef = useRef(null);

  // Generate lightweight "19" text texture on CPU canvas to avoid Troika loading lag/crashes
  const numberTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = '#451a03';
    ctx.font = 'bold 72px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('19', 64, 64);
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Position updates and layout curves
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (cakeGroup.current) {
      cakeGroup.current.position.y = Math.sin(elapsed * 1.5) * 0.04;
    }
    
    // Wedge slide out
    if (isWedgeCut && wedgeGroup.current) {
      wedgeGroup.current.position.x = THREE.MathUtils.lerp(wedgeGroup.current.position.x, 0.4, 0.05);
      wedgeGroup.current.position.z = THREE.MathUtils.lerp(wedgeGroup.current.position.z, 0.4, 0.05);
      wedgeGroup.current.rotation.y = THREE.MathUtils.lerp(wedgeGroup.current.rotation.y, 0.15, 0.05);
    }
    // Golden plate slide in
    if (isWedgeCut && plateGroup.current) {
      plateGroup.current.position.x = THREE.MathUtils.lerp(plateGroup.current.position.x, 0.4, 0.05);
      plateGroup.current.position.z = THREE.MathUtils.lerp(plateGroup.current.position.z, 0.4, 0.05);
    }

    // Star movement (floating or attached to fairy's wand)
    if (starRef.current) {
      if (starWandAttached && fairyPosRef && fairyPosRef.current) {
        // Move with the fairy's wand tip (offset slightly)
        starRef.current.position.copy(fairyPosRef.current).add(new THREE.Vector3(0.08, -0.05, 0.08));
      } else {
        // Floating sky idle star
        starRef.current.position.y = 3.2 + Math.sin(elapsed * 2.5) * 0.05;
      }
    }

    // Knife positioning
    if (knifeRef.current && knifeSummoned) {
      knifeRef.current.position.lerp(new THREE.Vector3(...knifePosition), 0.05);
      knifeRef.current.rotation.y = elapsed * 1.5;
    }
  });

  return (
    <group ref={cakeGroup} position={[0, 0.1, 0]}>
      {/* 3D Fairy magical helper */}
      <Fairy 
        flyState={flyState} 
        onTouchStar={onTouchStar} 
        onCandleGlow={onCandleGlow} 
        onPortalOpened={onPortalOpened}
        fairyPosRef={fairyPosRef}
        starRef={starRef}
        knifeRef={knifeRef}
      />

      {/* ══ TIER 1: Bottom (Chocolate / Gold Trim) ══════════════════════ */}
      <mesh castShadow receiveShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.8, 64]} />
        <meshPhysicalMaterial 
          color="#3b1f04" 
          roughness={0.2} 
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.1}
        />
      </mesh>
      {/* Gold trim */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.52, 1.52, 0.06, 64]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ══ TIER 2: Middle (Strawberry Pink) ═════════════════════════════ */}
      <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 0.7, 64]} />
        <meshPhysicalMaterial 
          color="#db2777" 
          roughness={0.25} 
          clearcoat={0.4} 
        />
      </mesh>

      {/* ══ TIER 3: Top (Vanilla/Lavender Group for Wedge Slide Out) ══════ */}
      <group ref={wedgeGroup} position={[0, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, 1.7, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.6, 64]} />
          <meshPhysicalMaterial 
            color="#a5b4fc" 
            roughness={0.3} 
            clearcoat={0.2} 
          />
        </mesh>

        {/* 5 Curved Candles */}
        {[
          { x: -0.4, z: 0.15, col: '#f43f5e', lightCol: '#fda4af' },
          { x: -0.2, z: 0.35, col: '#8b5cf6', lightCol: '#c084fc' },
          { x: 0.0, z: 0.42, col: '#f59e0b', lightCol: '#fde047' },
          { x: 0.2, z: 0.35, col: '#14b8a6', lightCol: '#2dd4bf' },
          { x: 0.4, z: 0.15, col: '#f43f5e', lightCol: '#fda4af' },
        ].map((c, i) => {
          const isOut = i < candlesOut;
          const isGlow = candleGlowState[i];
          return (
            <Candle 
              key={i} 
              position={[c.x, 2.05, c.z]} 
              color={c.col} 
              lightColor={c.lightCol} 
              isOut={isOut} 
              isGlow={isGlow}
            />
          );
        })}
      </group>

      {/* ══ MAGICAL STAR "19" (Initially floating in the sky) ══════════ */}
      {flyState !== 'idle' && (
        <group ref={starRef} position={[0, 3.2, -1]}>
          <mesh>
            <boxGeometry args={[0.24, 0.24, 0.04]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.05} />
          </mesh>
          {/* Star face showing "19" */}
          <mesh position={[0, 0, 0.021]}>
            <planeGeometry args={[0.22, 0.22]} />
            <meshBasicMaterial map={numberTexture} />
          </mesh>
          <pointLight color="#fde047" intensity={starGlow ? 3.5 : 1.0} distance={2.5} />
        </group>
      )}

      {/* ══ SUMMONED GOLDEN KNIFE (Floats in and lands beside cake) ══════ */}
      {knifeSummoned && (
        <group ref={knifeRef} position={[0, 5.0, -1]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.45, 0.015]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
          </mesh>
          <pointLight color="#fbbf24" intensity={1.5} distance={1.5} />
        </group>
      )}

      {/* ══ GOLDEN PLATE (Slides underneath the cut wedge) ══════════════ */}
      <group ref={plateGroup} position={[-2.5, 0.01, -2.5]}>
        <mesh receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.02, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </group>
  );
}

/**
 * Candle Component
 */
function Candle({ position, color, lightColor, isOut, isGlow }) {
  const flameRef = useRef(null);
  const lightRef = useRef(null);

  useFrame((state) => {
    if (!isOut && flameRef.current) {
      // Scale flame based on glow intensity state
      const scale = (isGlow ? 1.5 : 1.0) + Math.sin(state.clock.getElapsedTime() * 12) * 0.15;
      flameRef.current.scale.set(scale, scale * 1.2, scale);
      if (lightRef.current) {
        lightRef.current.intensity = (isGlow ? 3.5 : 1.5) + Math.sin(state.clock.getElapsedTime() * 18) * 0.2;
      }
    }
  });

  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.31, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.04, 8]} />
        <meshBasicMaterial color="#18181b" />
      </mesh>
      {!isOut && (
        <group position={[0, 0.35, 0]}>
          <mesh ref={flameRef}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshBasicMaterial color="#fde047" />
          </mesh>
          <pointLight 
            ref={lightRef}
            color={lightColor} 
            intensity={isGlow ? 3.5 : 1.5} 
            distance={2} 
            decay={2} 
          />
        </group>
      )}
    </group>
  );
}

function GltfCakeModel({ candlesOut, cutProgress, isWedgeCut }) {
  const { scene } = useGLTF(CAKE_CONFIG.modelPath);
  return <primitive object={scene} castShadow receiveShadow />;
}

/**
 * CakeModel orchestrator
 * Safe checker to only attempt loading GLTF if file actually exists.
 * Bypasses SPA fallback 404/html syntax error parse crashes.
 */
export function CakeModel(props) {
  const [modelExists, setModelExists] = useState(false);

  useEffect(() => {
    // Ping file path to check if GLTF assets are present (ignores SPA HTML fallbacks)
    fetch(CAKE_CONFIG.modelPath)
      .then(res => {
        const contentType = res.headers.get('content-type');
        if (res.ok && contentType && !contentType.includes('text/html')) {
          setModelExists(true);
        } else {
          setModelExists(false);
        }
      })
      .catch(() => {
        setModelExists(false);
      });
  }, []);

  if (modelExists) {
    return (
      <React.Suspense 
        fallback={
          <ProceduralCake 
            candlesOut={props.candlesOut} 
            cutProgress={props.cutProgress} 
            isWedgeCut={props.isWedgeCut} 
            starGlow={props.starGlow}
            flyState={props.flyState}
            onTouchStar={props.onTouchStar}
            onCandleGlow={props.onCandleGlow}
            onPortalOpened={props.onPortalOpened}
            fairyPosRef={props.fairyPosRef}
            starWandAttached={props.starWandAttached}
            knifeSummoned={props.knifeSummoned}
            knifePosition={props.knifePosition}
            candleGlowState={props.candleGlowState}
          />
        }
      >
        <GltfCakeModel {...props} />
      </React.Suspense>
    );
  }

  // Directly render gorgeous procedural cake fallback
  return (
    <ProceduralCake 
      candlesOut={props.candlesOut} 
      cutProgress={props.cutProgress} 
      isWedgeCut={props.isWedgeCut} 
      starGlow={props.starGlow}
      flyState={props.flyState}
      onTouchStar={props.onTouchStar}
      onCandleGlow={props.onCandleGlow}
      onPortalOpened={props.onPortalOpened}
      fairyPosRef={props.fairyPosRef}
      starWandAttached={props.starWandAttached}
      knifeSummoned={props.knifeSummoned}
      knifePosition={props.knifePosition}
      candleGlowState={props.candleGlowState}
    />
  );
}

export default CakeModel;
