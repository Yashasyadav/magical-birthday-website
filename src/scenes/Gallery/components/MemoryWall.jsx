import React, { useRef, useEffect } from 'react';
import useMemory from '../hooks/useMemory';
import FloatingPhotos from './FloatingPhotos';
import PhotoStack from './PhotoStack';
import PhotoZoom from './PhotoZoom';
import memoryEngine from '../engine/MemoryEngine';

/**
 * MemoryWall
 * Reconstructs the central memory collection canvas wall.
 * Holds and animates clotheslines, polaroid photos, and golden clips.
 */
export function MemoryWall({ lineRef, photoRefs, clipRefs, airplaneRef, particlesRef, onComplete }) {
  const { flyState, setFlyState } = useMemory();

  // Trigger entrance stagger sequence on mount
  useEffect(() => {
    if (flyState === 'idle') {
      setFlyState('enter');
      memoryEngine.animateWallEntrance(
        photoRefs.current,
        clipRefs.current,
        lineRef.current,
        () => {
          setFlyState('active');
        }
      );
    }
  }, [flyState, setFlyState, lineRef, photoRefs, clipRefs]);

  return (
    <div 
      className="relative w-full h-[65vh] max-w-[960px] mx-auto z-10 select-none pointer-events-none animate-breathing"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1200px',
      }}
    >
      {/* Structural threads & tapes */}
      <FloatingPhotos lineRef={lineRef} />

      {/* Floating interactive photograph stack */}
      <PhotoStack photoRefs={photoRefs} clipRefs={clipRefs} />

      {/* Centered Zoom overlay backdrop modal */}
      <PhotoZoom />

      <style>{`
        /* Slow cinematic breathing/drift motion for the wall elements */
        @keyframes driftWall {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-8px) rotate(0.4deg); }
        }
        .animate-breathing {
          animation: driftWall 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default MemoryWall;
