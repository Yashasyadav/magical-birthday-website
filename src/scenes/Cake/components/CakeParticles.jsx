import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * CakeParticles
 * Renders ambient magical fairy dust and floating sparkles in 3D space around the cake.
 */
export function CakeParticles() {
  const pointsRef = useRef(null);
  const count = 120;

  // Generate random 3D coordinates for floating ambient dust
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;     // X
      arr[i * 3 + 1] = Math.random() * 5 - 1;      // Y
      arr[i * 3 + 2] = (Math.random() - 0.5) * 8;   // Z
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      // Slow ambient spin
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      // Gentle floating drift
      const positionsAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        let y = positionsAttr.getY(i);
        y += Math.sin(state.clock.getElapsedTime() + i) * 0.001;
        positionsAttr.setY(i, y);
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#fef08a"
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export default CakeParticles;
