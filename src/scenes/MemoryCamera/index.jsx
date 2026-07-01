import React, { useState, useEffect, useRef } from 'react';
import SceneWrapper from '@components/layout/SceneWrapper';
import { MEMORIES } from '@config/memories';
import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';
import soundManager from '@engine/SoundManager';

// Reused Atmospheric Background Components
import CinematicBackground from '@components/effects/background/CinematicBackground';
import CinematicStars      from '@components/effects/background/CinematicStars';
import CinematicNebula     from '@components/effects/background/CinematicNebula';
import CinematicParticles  from '@components/effects/background/CinematicParticles';

function MemoryCameraContent() {
  const [started, setStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showCombinedControls, setShowCombinedControls] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasFlippedCurrent, setHasFlippedCurrent] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [showFullWall, setShowFullWall] = useState(false);
  const [revealedPhotosCount, setRevealedPhotosCount] = useState(0);
  const [cameraGlow, setCameraGlow] = useState(false);
  const [hoverActive, setHoverActive] = useState(false);

  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const photoCardRef = useRef(null);

  const currentPhoto = MEMORIES[currentIdx];

  // Random lens breathing glow effect
  useEffect(() => {
    if (started) return;
    const interval = setInterval(() => {
      setCameraGlow(true);
      setTimeout(() => setCameraGlow(false), 1200);
    }, 4000);
    return () => clearInterval(interval);
  }, [started]);

  // Set page-visited track for navigation unlocking
  useEffect(() => {
    setIsFlipped(false);
    setHasFlippedCurrent(false);
  }, [currentIdx]);

  // Trigger flip behavior
  const handlePhotoClick = () => {
    if (showFullWall) return;
    soundManager.playSfx('pageFlip');
    setIsFlipped(prev => {
      const next = !prev;
      if (next) setHasFlippedCurrent(true);
      return next;
    });
  };

  // Click handler for opening memories
  const handleOpenMemories = () => {
    soundManager.playSfx('buttonClick'); // Camera shutter click sound
    setFlashActive(true);
    
    // Quick camera flash animation
    setTimeout(() => {
      setFlashActive(false);
      setStarted(true);
      soundManager.playSfx('sparkle');
    }, 150);
  };

  const handleNext = () => {
    if (currentIdx < MEMORIES.length - 1) {
      soundManager.playSfx('pageFlip');
      setCurrentIdx(prev => prev + 1);
    } else {
      // Trigger Gallery Wall seamless transition ending sequence
      triggerEndingSequence();
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      soundManager.playSfx('pageFlip');
      setCurrentIdx(prev => prev - 1);
    }
  };

  const handleResetView = () => {
    soundManager.playSfx('buttonClick');
    setStarted(false);
    setCurrentIdx(0);
    setIsFlipped(false);
    setHasFlippedCurrent(false);
    setShowFullWall(false);
    setRevealedPhotosCount(0);
    setShowCombinedControls(false);
  };

  const handleContinueToGallery = () => {
    soundManager.playSfx('buttonClick');
    sessionStorage.setItem('skip_gallery_entrance', 'true');
    sceneManager.navigateTo(SCENES.GALLERY, { skipTransition: true });
  };

  const triggerEndingSequence = async () => {
    // 1. Force flip back to front if flipped
    setIsFlipped(false);
    await new Promise((r) => setTimeout(r, 600));

    // 2. Play shutter sound for wall rebuild
    soundManager.playSfx('buttonClick');
    setFlashActive(true);
    setTimeout(() => setFlashActive(false), 150);

    // 3. Mount all layout elements
    setShowFullWall(true);
    soundManager.playSfx('sparkle');

    // 4. Staggered reveal of remaining 9 photos
    for (let i = 0; i < MEMORIES.length - 1; i++) {
      await new Promise((r) => setTimeout(r, 200));
      setRevealedPhotosCount(prev => prev + 1);
      soundManager.playSfx('success');
    }

    // 5. Show View Again and Continue action controls
    setShowCombinedControls(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between py-10 overflow-hidden select-none bg-[#04020f]"
    >
      {/* Dynamic starfields and cosmos */}
      <CinematicBackground />
      <CinematicStars />
      <CinematicNebula />
      <CinematicParticles />

      {/* 🌕 Glowing Moon Background Decor */}
      <div 
        className="absolute top-10 right-14 w-28 h-28 rounded-full bg-gradient-to-br from-amber-100 via-amber-200 to-yellow-100 shadow-[0_0_50px_rgba(251,191,36,0.35)] opacity-80 pointer-events-none select-none z-1"
        style={{
          boxShadow: '0 0 50px rgba(251, 191, 36, 0.45), inset -12px -12px 30px rgba(0,0,0,0.18)',
          border: '1.5px solid rgba(251, 191, 36, 0.2)',
        }}
      >
        {/* Soft Moon Crater details */}
        <div className="absolute top-6 left-6 w-5 h-5 rounded-full bg-black/5 blur-xs" />
        <div className="absolute top-12 left-10 w-7 h-7 rounded-full bg-black/5 blur-xs" />
        <div className="absolute top-16 left-5 w-4 h-4 rounded-full bg-black/5 blur-xs" />
      </div>

      {/* 💡 Hanging Fairy Lights Decor */}
      <div className="absolute top-0 inset-x-0 h-28 pointer-events-none select-none z-2 overflow-hidden opacity-75">
        <svg className="w-full h-full" viewBox="0 0 1200 100" preserveAspectRatio="none">
          {/* Wire */}
          <path d="M -10 15 Q 300 75 600 25 Q 900 75 1210 15" fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="1.5" />
          {/* Bulbs */}
          {[50, 150, 250, 350, 450, 550, 650, 750, 850, 950, 1050, 1150].map((cx, i) => {
            const cy = cx < 600
              ? 15 + (cx / 600) * (cx / 600) * 12
              : 15 + ((1200 - cx) / 600) * ((1200 - cx) / 600) * 12;
            const delay = (i % 3) * 0.8;
            return (
              <g key={i}>
                <rect x={cx - 1} y={cy} width="2" height="4" fill="#0f172a" />
                <circle
                  cx={cx}
                  cy={cy + 5}
                  r="3.5"
                  className="animate-pulse-glow"
                  style={{
                    fill: i % 2 === 0 ? '#fbbf24' : '#f472b6',
                    animation: `fairyGlow 2.5s ${delay}s infinite ease-in-out`,
                    filter: 'drop-shadow(0 0 4px currentColor)',
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Screen flash layer */}
      {flashActive && (
        <div className="fixed inset-0 bg-white z-[99999] pointer-events-none" />
      )}

      {/* Injected 3D Flip & Fairy Lights Styles */}
      <style>{`
        .perspective-1200 {
          perspective: 1200px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        @keyframes floatCamera {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
        .animate-float-camera {
          animation: floatCamera 4s ease-in-out infinite;
        }
        @keyframes breatheCamera {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-breathe-camera {
          animation: breatheCamera 6s ease-in-out infinite;
        }
        @keyframes ripple {
          0% { transform: scale(0.95); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        .animate-ripple::before {
          content: '';
          position: absolute;
          inset: -4px;
          border: 1px solid rgba(251, 191, 36, 0.4);
          border-radius: 9999px;
          animation: ripple 2s cubic-bezier(0.24, 0, 0.38, 1) infinite;
        }
        @keyframes fairyGlow {
          0%, 100% { opacity: 0.35; filter: drop-shadow(0 0 2px rgba(251,191,36,0.25)); }
          50% { opacity: 1; filter: drop-shadow(0 0 10px rgba(251,191,36,0.95)); }
        }
      `}</style>

      {/* Landing Camera State */}
      {!started && (
        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-4 max-w-3xl">
          {/* Header Narrative */}
          <h1 className="font-display text-gold-200 text-5xl md:text-6xl tracking-wider mb-4 drop-shadow-[0_2px_15px_rgba(251,191,36,0.35)]">
            Before we continue...
          </h1>
          <p className="font-sans text-white/80 text-lg md:text-xl tracking-wide mb-12">
            I wanted to show you something I quietly kept safe.
          </p>

          {/* Breathing Camera Button */}
          <div
            ref={cameraRef}
            onClick={handleOpenMemories}
            onMouseEnter={() => setHoverActive(true)}
            onMouseLeave={() => setHoverActive(false)}
            className="group relative cursor-pointer flex flex-col items-center justify-center bg-black/25 hover:bg-black/40 border-2 border-gold-400/30 px-10 py-8 sm:px-20 sm:py-16 rounded-[40px] sm:rounded-[60px] backdrop-blur-md shadow-[0_0_60px_rgba(251,191,36,0.25)] transition-all duration-500 hover:scale-[1.05] hover:border-gold-400/50 hover:shadow-[0_0_80px_rgba(251,191,36,0.45)] animate-float-camera w-[90vw] max-w-[400px] sm:w-auto"
          >
            {/* Sparkles around camera */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <span className="absolute text-gold-300 text-2xl top-4 left-5 opacity-40 animate-pulse">✨</span>
              <span className="absolute text-gold-300 text-2xl bottom-5 right-6 opacity-40 animate-pulse">✨</span>
            </div>

            {/* Polaroid Camera SVG Icon */}
            <div className="relative w-44 h-44 mb-10 transition-transform duration-300 group-hover:scale-108">
              <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                {/* Main Ivory Body */}
                <rect x="15" y="25" width="70" height="58" rx="8" fill="#fcfbf4" stroke="#d5c8a5" strokeWidth="2.5" />
                {/* Golden Accents Border */}
                <rect x="15" y="25" width="70" height="8" fill="#fbbf24" />
                {/* Vintage Color Bar Strip */}
                <rect x="25" y="33" width="8" height="50" fill="#f43f5e" />
                <rect x="33" y="33" width="8" height="50" fill="#2dd4bf" />
                {/* Camera Flash Element */}
                <rect x="22" y="10" width="18" height="15" rx="3" fill="#fcfbf4" stroke="#d5c8a5" strokeWidth="1.5" />
                <circle cx="31" cy="17.5" r="5" fill="#fef08a" />
                {/* Camera Lens Outer Ring */}
                <circle cx="50" cy="55" r="22" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" />
                {/* Lens Glass Inner */}
                <circle cx="50" cy="55" r="16" fill="#1e293b" />
                {/* Lens reflection/glow */}
                <circle
                  cx="50"
                  cy="55"
                  r="10"
                  fill="#0284c7"
                  className={`transition-opacity duration-1000 ${
                    cameraGlow || hoverActive ? 'opacity-85' : 'opacity-40'
                  }`}
                  style={{
                    filter: cameraGlow ? 'drop-shadow(0 0 8px #38bdf8)' : 'none'
                  }}
                />
                <circle cx="46" cy="51" r="3" fill="#ffffff" opacity="0.6" />
                {/* Shutter Button */}
                <circle cx="76" cy="18" r="4" fill="#ef4444" />
              </svg>
            </div>

            {/* Subtitle / CTA */}
            <span className="font-display text-gold-200 text-xl sm:text-3xl uppercase tracking-[0.15em] sm:tracking-[0.24em] mb-3 font-bold drop-shadow-[0_2px_10px_rgba(251,191,36,0.25)]">
              Open Your Memories
            </span>
            <span className="font-sans text-xs sm:text-sm text-white/50 tracking-wider">
              Click to release the magic
            </span>
          </div>

          <p className="font-sans text-sm md:text-base text-white/50 tracking-wider mt-20 max-w-lg leading-relaxed">
            These are only a few memories...<br />But every one of them means something beautiful.
          </p>
        </div>
      )}

      {/* Interactive Photo Stack / Wall Rebuild View */}
      {started && (
        <div className="flex-1 w-full flex flex-col justify-between items-center z-10 px-4">
          
          {/* Top Header Section */}
          <div className="w-full max-w-5xl flex items-center justify-between text-gold-300/80 mb-4 select-none">
            {/* Title / Back to Camera */}
            {!showFullWall ? (
              <button
                onClick={() => setStarted(false)}
                className="text-sm uppercase tracking-widest hover:text-gold-200 border border-gold-400/20 hover:border-gold-400/40 px-4 py-2 rounded-full bg-black/20 backdrop-blur-xs transition-colors flex items-center gap-1.5 font-semibold"
              >
                <span>◀</span> Back to Camera
              </button>
            ) : (
              <h2 className="font-display text-gold-200 text-xl tracking-widest uppercase">
                Secret Memory Collection
              </h2>
            )}

            {/* Top Right Progress */}
            <span className="text-sm uppercase tracking-widest font-semibold">
              {!showFullWall 
                ? `Memory ${currentIdx + 1} of ${MEMORIES.length}` 
                : '10 of 10 Memories'
              }
            </span>
          </div>

          {/* Photo Container Frame / Clotheslines */}
          <div className="flex-1 w-full flex items-center justify-center relative">
            
            {/* Gallery Wall View (Only active on last transition) */}
            {showFullWall ? (
              <div 
                className="relative w-full h-[65vh] max-w-[960px] mx-auto transition-transform duration-[2000ms] ease-in-out"
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1200px',
                }}
              >
                {/* Structural clotheslines */}
                <svg className="absolute top-0 left-0 w-full h-[65%] opacity-25" viewBox="0 0 1000 100" preserveAspectRatio="none">
                  <path d="M 0 35 Q 500 140 1000 35" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="5,6" />
                  <path d="M 0 65 Q 500 180 1000 65" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3,4" />
                </svg>

                {/* Staggered render of photos */}
                {MEMORIES.map((m, idx) => {
                  const isLast = idx === MEMORIES.length - 1;
                  const isVisible = isLast || idx < revealedPhotosCount;

                  return (
                    <div
                      key={m.id}
                      className={`absolute transition-all duration-[2000ms] ease-in-out ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                      }`}
                      style={{
                        left: `${m.position.x}%`,
                        top: `${m.position.y}%`,
                        width: 'clamp(115px, 16vw, 190px)',
                        height: 'clamp(144px, 20vw, 238px)',
                        transform: `translate(-50%, -50%) rotate(${m.rotation}deg)`,
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      {/* Golden Clip */}
                      <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 w-7 h-5 bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-600 rounded-xs shadow-md border border-yellow-300/40 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-950" />
                      </div>

                      {/* Polaroid frame body */}
                      <div className="w-full h-full bg-white p-3 rounded-sm shadow-md flex flex-col justify-between">
                        <div className="w-full h-[75%] bg-night-950 overflow-hidden relative border border-black/5 rounded-xs">
                          {m.image ? (
                            <img src={m.image} alt={m.title} className="w-full h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">{m.emoji}</div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center text-center mt-1">
                          <span className="text-xs md:text-sm font-semibold text-amber-950/70 truncate w-full">{m.title}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Single Photo Viewer Container */
              <div 
                ref={photoCardRef}
                onClick={handlePhotoClick}
                className="perspective-1200 preserve-3d w-[90vw] max-w-[420px] aspect-[4/5] cursor-pointer"
              >
                <div 
                  className="w-full h-full relative transition-transform duration-[0.8s] ease-in-out preserve-3d rounded-lg"
                  style={{
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
                  }}
                >
                  
                  {/* FRONT SIDE (Polaroid image card) */}
                  <div className="absolute inset-0 w-full h-full bg-white p-4 pb-6 rounded-lg border border-gold-400/10 backface-hidden flex flex-col justify-between">
                    {/* Small tape decoration on top */}
                    <div className="absolute top-[-12px] left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-100/40 rotate-[3deg] shadow-xs backdrop-blur-xs border border-yellow-200/10 opacity-70" />

                    {/* Polaroid Image Window */}
                    <div className="w-full h-[85%] bg-night-950 border border-slate-200/5 overflow-hidden relative rounded-xs">
                      <img 
                        src={currentPhoto.image} 
                        alt={currentPhoto.title} 
                        className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                      />
                    </div>

                    {/* Handwritten metadata labels */}
                    <div className="flex-1 flex flex-col justify-center items-center text-center pt-2">
                      <span className="font-display text-amber-950/95 text-lg md:text-xl tracking-wide font-bold leading-none">{currentPhoto.title}</span>
                    </div>
                  </div>

                  {/* BACK SIDE (Handwritten Note with aged paper texture) */}
                  <div 
                    className="absolute inset-0 w-full h-full rounded-lg backface-hidden"
                    style={{
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div 
                      className="w-full h-full flex flex-col justify-between p-6 md:p-8 rounded-lg border border-amber-900/10 relative"
                      style={{
                        background: 'linear-gradient(135deg, #fdfbfa 0%, #f7f2ea 100%)',
                      }}
                    >
                      {/* Subtle Paper fibers overlay */}
                      <div 
                        className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{
                          backgroundImage: 'radial-gradient(black 1px, transparent 0), radial-gradient(black 1px, transparent 0)',
                          backgroundSize: '4px 4px',
                          backgroundPosition: '0 0, 2px 2px',
                        }}
                      />

                      {/* Golden decorative floral corners */}
                      <div className="absolute top-4 left-4 text-gold-400/45 text-sm">❀</div>
                      <div className="absolute top-4 right-4 text-gold-400/45 text-sm">❀</div>
                      <div className="absolute bottom-4 left-4 text-gold-400/45 text-sm">❀</div>
                      <div className="absolute bottom-4 right-4 text-gold-400/45 text-sm">❀</div>

                      {/* Stamp Detail */}
                      <div className="absolute top-6 right-6 text-amber-950/20 text-2xl font-serif">⚜️</div>

                      {/* Header Memory Counter */}
                      <div className="text-xs md:text-sm font-sans text-amber-900/50 uppercase tracking-widest border-b border-amber-900/15 pb-2 w-1/2 font-bold">
                        Memory #{String(currentIdx + 1).padStart(2, '0')}
                      </div>

                      {/* Handwritten Message */}
                      <div className="my-auto py-2">
                        <p className="font-script text-xl md:text-2xl text-amber-950/95 leading-relaxed text-center italic font-bold px-2">
                          "{currentPhoto.placeholderMessage}"
                        </p>
                      </div>

                      {/* Cute heart divider & footer */}
                      <div className="flex flex-col items-center gap-1.5 border-t border-amber-900/10 pt-3">
                        <span className="text-gold-400/60 text-sm">♥</span>
                        <span className="text-xs md:text-sm text-amber-900/50 font-sans tracking-wider uppercase font-bold">
                          Click again to continue
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* Bottom Navigation Section */}
          <div className="w-full max-w-lg flex flex-col items-center gap-2 mb-4">
            
            {/* Photo Flip / Click anywhere helper label */}
            {!showFullWall && (
              <span className="text-xs text-gold-300/40 tracking-widest uppercase animate-pulse font-semibold">
                Click photo to flip
              </span>
            )}

            {/* Ending Title Narrative (Revealed on wall exit) with Action Buttons */}
            {showFullWall && (
              <div className="text-center z-10 mt-2 flex flex-col items-center gap-4">
                <p className="text-sm text-white/70 tracking-wider font-sans italic max-w-md">
                  "I didn't forget these moments. I kept them safely, just for you."
                </p>
                
                {showCombinedControls && (
                  <div className="flex items-center gap-4 mt-2 animate-fadeIn">
                    <button
                      onClick={handleResetView}
                      className="px-6 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-wider text-white border border-white/20 hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    >
                      🔄 View Again
                    </button>
                    
                    <button
                      onClick={handleContinueToGallery}
                      className="px-8 py-2 rounded-full font-sans font-bold text-xs uppercase tracking-wider text-teal-950 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                        boxShadow: '0 0 15px rgba(251,191,36,0.4)',
                      }}
                    >
                      Continue ➔
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            {!showFullWall && (
              <div className="flex items-center gap-8 bg-black/25 px-8 py-3 rounded-full border border-gold-400/10 backdrop-blur-md">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentIdx === 0}
                  className="text-base uppercase tracking-widest font-semibold hover:text-gold-200 transition-colors disabled:opacity-30 disabled:hover:text-gold-300/80"
                >
                  ◀ Previous
                </button>

                {/* Counter */}
                <span className="font-display text-gold-200 text-lg tracking-widest">
                  {String(currentIdx + 1).padStart(2, '0')} / {String(MEMORIES.length).padStart(2, '0')}
                </span>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={!hasFlippedCurrent}
                  className="text-base uppercase tracking-widest font-semibold hover:text-gold-200 transition-colors disabled:opacity-30 disabled:hover:text-gold-300/80"
                  title={!hasFlippedCurrent ? "Flip the photo to read the message first" : ""}
                >
                  {currentIdx === MEMORIES.length - 1 ? 'Reveal All ◀' : 'Next ▶'}
                </button>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}

function MemoryCameraScene() {
  return (
    <SceneWrapper sceneName="memory-camera" className="bg-[#04020f] overflow-hidden">
      <MemoryCameraContent />
    </SceneWrapper>
  );
}

// Ensure lazy loader reads export default
export default MemoryCameraScene;
