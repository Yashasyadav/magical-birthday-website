import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CAKE_CONFIG } from '../../../config/cake';

/**
 * CakeCamera
 * Controls the cinematic dolly zoom, camera breathing, and handheld camera drift.
 * Dynamically targets different focal distances and alignments based on the active scene phase.
 */
export function CakeCamera({ phase }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(...CAKE_CONFIG.camera.initialPos));
  const lookAtTarget = useRef(new THREE.Vector3(...CAKE_CONFIG.camera.lookAt));

  useEffect(() => {
    if (phase === 'wish') {
      targetPos.current.set(...CAKE_CONFIG.camera.focusPos);
      lookAtTarget.current.set(0, 1.5, 0);
    } else if (phase === 'blow' || phase === 'blowing' || phase === 'all_out') {
      targetPos.current.set(...CAKE_CONFIG.camera.closeUpPos);
      lookAtTarget.current.set(0, 1.9, 0.2);
    } else if (phase === 'cut_ready' || phase === 'cutting') {
      targetPos.current.set(0, 2.2, 2.8);
      lookAtTarget.current.set(0, 1.8, 0);
    } else if (phase === 'success') {
      targetPos.current.set(0, 2.8, 5.0);
      lookAtTarget.current.set(0.2, 1.3, 0);
    } else {
      targetPos.current.set(...CAKE_CONFIG.camera.initialPos);
      lookAtTarget.current.set(...CAKE_CONFIG.camera.lookAt);
    }
  }, [phase]);

  useFrame((state) => {
    // 1. Interpolate / Dolly camera position
    camera.position.lerp(targetPos.current, 0.05);

    // 2. Interpolate look-at target
    const currentLookAt = new THREE.Vector3(0, 0, 0);
    camera.getWorldDirection(currentLookAt);
    const targetDirection = new THREE.Vector3()
      .subVectors(lookAtTarget.current, camera.position)
      .normalize();
    
    // Smoothly rotate camera toward target direction
    const qStart = camera.quaternion.clone();
    camera.lookAt(lookAtTarget.current);
    const qEnd = camera.quaternion.clone();
    camera.quaternion.copy(qStart).slerp(qEnd, 0.05);

    // 3. Subtle handheld camera drift (breathing)
    const elapsed = state.clock.getElapsedTime();
    camera.position.x += Math.sin(elapsed * 0.7) * 0.0008;
    camera.position.y += Math.cos(elapsed * 0.5) * 0.0008;
  });

  return null;
}

export default CakeCamera;
