/**
 * ThreeCanvas.jsx
 * Singleton React Three Fiber Canvas wrapper.
 * All 3D scenes share this one Canvas — switching scenes swaps the content
 * inside it, not the Canvas itself (avoids WebGL context loss).
 */

import { Canvas }       from '@react-three/fiber';
import { Suspense }     from 'react';
import { Preload }      from '@react-three/drei';
import CameraManager   from './CameraManager';
import LightingManager from './LightingManager';

/**
 * @param {{
 *   children:    React.ReactNode,
 *   shadows?:   boolean,
 *   className?: string,
 * }} props
 */
function ThreeCanvas({ children, shadows = true, className = '' }) {
  return (
    <Canvas
      className={`absolute-fill ${className}`}
      shadows={shadows}
      gl={{
        antialias:              true,
        alpha:                  true,
        powerPreference:        'high-performance',
        preserveDrawingBuffer:  false,
      }}
      dpr={[1, 2]} // Pixel ratio capped at 2 for performance
      camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 0, 10] }}
    >
      {/* Engine managers mounted inside Canvas for R3F access */}
      <CameraManager />
      <LightingManager />

      {/* Preload all Drei assets */}
      <Preload all />

      {/* Scene 3D content */}
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
}

export default ThreeCanvas;
