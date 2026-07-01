import React, { useRef, useEffect } from 'react';
import useMemory from '../hooks/useMemory';
import MemoryWall from './MemoryWall';
import MemoryParticles from './MemoryParticles';
import memoryEngine from '../engine/MemoryEngine';
import sceneManager from '@engine/SceneManager';

// Reuse existing night sky layers
import CinematicBackground from '../../../components/effects/background/CinematicBackground';
import CinematicStars from '../../../components/effects/background/CinematicStars';
import CinematicParticles from '../../../components/effects/background/CinematicParticles';
import CinematicNebula from '../../../components/effects/background/CinematicNebula';

export function MemorySceneContent() {
  const { 
    viewedAll, 
    visitedPhotos,
    totalPages,
    isClosing, 
    setIsClosing, 
    showAirplane, 
    setShowAirplane,
    memories 
  } = useMemory();

  const sceneRef = useRef(null);
  const lineRef = useRef(null);
  const photoRefs = useRef([]);
  const clipRefs = useRef([]);
  const airplaneRef = useRef(null);
  const particlesRef = useRef(null);

  // Monitor closing / exit sequence
  useEffect(() => {
    if (isClosing) {
      memoryEngine.animateWallExit(
        photoRefs.current,
        clipRefs.current,
        airplaneRef.current,
        lineRef.current,
        () => {
          sceneManager.complete({
            nextRoute: '/letter',
            message: '📸\nSome moments deserve to stay forever.\n\nLet\'s relive a few.',
            transitionDelay: 3000,
          });
        }
      );
    }
  }, [isClosing]);

  const handleFinish = () => {
    setIsClosing(true);
  };

  return (
    <div 
      ref={sceneRef}
      className="relative w-full h-full flex flex-col items-center justify-between py-12 overflow-hidden select-none bg-[#04020f]"
    >
      {/* 1. REUSE NIGHT SKY BACKGROUNDS */}
      <CinematicBackground />
      <CinematicStars />
      <CinematicNebula />
      <CinematicParticles />

      {/* 2. AMBIENT EFFECTS */}
      <MemoryParticles active={!isClosing} />

      {/* 3. HEADER NARRATIVE */}
      <div className="text-center z-10 mt-2 select-none pointer-events-none">
        <h2 
          className="text-gold-200 text-sm tracking-widest uppercase mb-1 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] font-display"
        >
          Secret Memory Collection
        </h2>
        <p className="text-xs text-white/50 tracking-wider font-sans mt-0.5 px-4">
          &ldquo;I didn&apos;t forget these moments. I kept them safely, just for you.&rdquo;
        </p>
        <div className="w-12 h-[1px] bg-gold-400/30 mx-auto mt-2" />
      </div>

      {/* 4. THE COLLECTION WALL CANVAS */}
      <MemoryWall 
        lineRef={lineRef}
        photoRefs={photoRefs}
        clipRefs={clipRefs}
        airplaneRef={airplaneRef}
        particlesRef={particlesRef}
      />

      {/* 5. GLOWING PAPER AIRPLANE (SUMMONED ON EXIT) */}
      <div 
        ref={airplaneRef} 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 z-40"
      >
        <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(251,191,36,0.85)]">
          <path 
            d="M 50 15 L 85 80 L 50 65 L 15 80 Z" 
            fill="none" 
            stroke="#fbbf24" 
            strokeWidth="3.5" 
            strokeLinejoin="round" 
          />
          <path 
            d="M 50 15 L 50 65" 
            stroke="#fbbf24" 
            strokeWidth="2" 
          />
        </svg>
      </div>

      {/* 6. INTERACTIVE ACTION HINT BUTTONS */}
      <div className="z-10 bottom-6 flex flex-col items-center gap-2 select-none">
        <button
          onClick={handleFinish}
          className={`px-10 py-3 rounded-full font-sans font-bold text-xs tracking-widest text-teal-950 transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
            viewedAll ? 'animate-pulse' : ''
          }`}
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            boxShadow: viewedAll ? '0 0 25px rgba(251,191,36,0.6)' : '0 0 15px rgba(251,191,36,0.3)',
          }}
        >
          {viewedAll ? "✨ Send Memories Flying ✨" : "Continue the Magic ➔"}
        </button>

        {!viewedAll && (
          <span className="text-xs font-sans text-white/60 tracking-widest uppercase mt-1">
            Explore all memories ({visitedPhotos.size}/{totalPages})
          </span>
        )}
      </div>
    </div>
  );
}

export function MemoryScene() {
  return (
    <div className="w-full h-full">
      <MemorySceneContent />
    </div>
  );
}

export default MemoryScene;
