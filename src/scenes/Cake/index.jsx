import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import SceneWrapper from '@components/layout/SceneWrapper';
import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';
import soundManager from '@engine/SoundManager';
import { MEMORIES } from '@config/memories';

// 3D R3F components
import CakeModel from './components/CakeModel';
import CakeLighting from './components/CakeLighting';
import CakeEnvironment from './components/CakeEnvironment';
import CakeCamera from './components/CakeCamera';
import CakeParticles from './components/CakeParticles';

// ─── Phase constants ────────────────────────────────────────────────────────
const PHASE = {
  INTRO:         'intro',         // Camera dolly in
  WISH:          'wish',          // Write wish input
  FAIRY_ENTER:   'fairy_enter',   // Fairy flies in, circles cake, catches star
  FAIRY_TRANSFER:'fairy_transfer',// Fairy transfers magic to candles sequence
  BLOW:          'blow',          // Spacebar or button blow prompt
  BLOWING:       'blowing',       // Blowing out candles
  ALL_OUT:       'all_out',       // Candles extinguished
  SUMMON_KNIFE:  'summon_knife',  // Fairy summons golden knife portal
  CUT_READY:     'cut_ready',     // Knife lands, ready to drag
  CUTTING:       'cutting',       // Knife dragging cut progress
  CELEBRATE:     'celebrate',     // Fairy claps, draws text in sky
  SUCCESS:       'success',       // Final celebrations, fireworks, exit
};

const TOTAL_CANDLES = 5;

// ─── Arc Arrangement of 5 Hanging Photo Frames & Lights ───────────────────────
// ─── Arc Arrangement of 6 Hanging Photo Frames with Birthday Wishes ───────────
function BackgroundDecorations() {
  const frames = [
    { id: 1, wish: "Wishing you a day filled with love and laughter! 💖", label: "Wish #1", left: '6%', top: '30px', rotate: '-8deg' },
    { id: 2, wish: "May this year bring you endless happiness! ✨", label: "Wish #2", left: '22%', top: '48px', rotate: '-4deg' },
    { id: 3, wish: "To beautiful moments and magical memories! 🌸", label: "Wish #3", left: '38%', top: '60px', rotate: '2deg' },
    { id: 4, wish: "Happy Birthday to someone truly special! 🎂", label: "Wish #4", left: '54%', top: '60px', rotate: '-2deg' },
    { id: 5, wish: "May all your dreams take flight today! 🎈", label: "Wish #5", left: '70%', top: '48px', rotate: '4deg' },
    { id: 6, wish: "Keep shining bright, birthday girl! 🌟", label: "Wish #6", left: '86%', top: '30px', rotate: '8deg' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      <style>{`
        @keyframes floatUpCake {
          0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.75; }
          90% { opacity: 0.75; }
          100% { transform: translateY(-20vh) rotate(10deg); opacity: 0; }
        }
        @keyframes sparkleTwinkleCake {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 0.95; transform: scale(1.2); }
        }
      `}</style>

      {/* Hanging Wire */}
      <svg className="absolute top-0 left-0 w-full h-32 opacity-35" preserveAspectRatio="none" viewBox="0 0 1000 100">
        <path d="M 0 10 Q 500 110 1000 10" fill="none" stroke="rgba(251,191,36,0.35)" strokeWidth="1.5" strokeDasharray="6,4" />
        {/* Wire Lights */}
        {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={10 + (100 - Math.abs(500 - cx) * 0.18)} r="4" fill="#fef08a" className="animate-pulse" />
            <circle cx={cx} cy={10 + (100 - Math.abs(500 - cx) * 0.18)} r="10" fill="rgba(253,224,71,0.2)" filter="blur(1px)" />
          </g>
        ))}
      </svg>

      {/* Hanging wire photo frames with childhood memories */}
      {frames.map((f) => (
        <div
          key={f.id}
          className="absolute flex flex-col items-center p-3 pb-5 bg-white border border-slate-200 shadow-[0_12px_24px_rgba(0,0,0,0.35)] rounded-xs transition-transform duration-300 hover:scale-105"
          style={{
            width: '130px', // larger card size
            top: f.top,
            left: f.left,
            transform: `translate(-50%, 0) rotate(${f.rotate})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Hanging string */}
          <div className="absolute top-[-35px] left-1/2 -translate-x-1/2 w-[1px] h-[35px] bg-slate-500/35" />
          {/* Gold pin/clip */}
          <div className="absolute top-[-5px] left-1/2 -translate-x-1/2 w-4 h-3 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 rounded-sm shadow-xs border border-yellow-400/25" />
          
          {/* Quote box inside Polaroid frame */}
          <div className="w-full aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-100/70 rounded-xs flex items-center justify-center p-2.5 border border-amber-900/10 shadow-inner">
            <p className="font-script text-[11px] text-amber-950/90 font-bold leading-normal text-center italic">
              "{f.wish}"
            </p>
          </div>
          <span className="mt-2.5 font-display text-[10px] text-amber-800 font-semibold tracking-wider select-none uppercase">{f.label}</span>
        </div>
      ))}

      {/* Background Floating Balloons in Cake Scene */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-85 z-0">
        {[
          { left: '4%', color: '#fbbf24', dur: 12, delay: 0 },
          { left: '12%', color: '#f472b6', dur: 15, delay: 3 },
          { left: '22%', color: '#a78bfa', dur: 14, delay: 1 },
          { left: '30%', color: '#2dd4bf', dur: 16, delay: 5 },
          { left: '40%', color: '#f43f5e', dur: 13, delay: 8 },
          { left: '50%', color: '#60a5fa', dur: 17, delay: 2 },
          { left: '60%', color: '#fbbf24', dur: 14, delay: 6 },
          { left: '70%', color: '#f472b6', dur: 15, delay: 0 },
          { left: '78%', color: '#a78bfa', dur: 13, delay: 4 },
          { left: '86%', color: '#2dd4bf', dur: 16, delay: 7 },
          { left: '92%', color: '#f43f5e', dur: 15, delay: 2 },
          { left: '96%', color: '#60a5fa', dur: 14, delay: 5 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute flex flex-col items-center"
            style={{
              left: b.left,
              bottom: '-150px',
              animation: `floatUpCake ${b.dur}s ${b.delay}s linear infinite`,
            }}
          >
            <div 
              className="w-10 h-12 rounded-full relative"
              style={{
                background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${b.color} 70%)`,
                boxShadow: 'inset -2px -2px 6px rgba(0,0,0,0.2)',
              }}
            >
              <div className="absolute top-1.5 left-1.5 w-2 h-3 bg-white/40 rounded-full rotate-[-30deg]" />
            </div>
            <div className="w-1.5 h-1.5 border-t-3 border-x-3 border-transparent border-t-amber-500/80 -mt-[1px]" />
            <div className="w-[0.5px] h-14 bg-white/10" />
          </div>
        ))}
      </div>

      {/* Background Sparkles in Cake Scene */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 z-0">
        {[
          { top: '20%', left: '10%', delay: 0, scale: 0.8 },
          { top: '35%', left: '90%', delay: 0.5, scale: 1.1 },
          { top: '70%', left: '5%', delay: 1.2, scale: 0.9 },
          { top: '60%', left: '85%', delay: 1.8, scale: 1.0 },
        ].map((s, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            className="absolute w-5 h-5 text-gold-300"
            style={{
              top: s.top,
              left: s.left,
              transform: `scale(${s.scale})`,
              animation: `sparkleTwinkleCake 4s ${s.delay}s ease-in-out infinite`,
            }}
          >
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" fill="currentColor" />
          </svg>
        ))}
      </div>
    </div>
  );
}

// Helper to obtain UUID Session ID securely
const getSessionId = () => {
  let sid = sessionStorage.getItem('birthday_session_id');
  if (!sid) {
    if (typeof crypto.randomUUID === 'function') {
      sid = crypto.randomUUID();
    } else {
      sid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    sessionStorage.setItem('birthday_session_id', sid);
  }
  return sid;
};

// ─── MAIN CAKE SCENE ASSEMBLY ────────────────────────────────────────────────
function CakeScene() {
  const [phase, setPhase] = useState(PHASE.INTRO);
  const [wishText, setWishText] = useState('');
  const [wishValid, setWishValid] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // 3D & Animation states
  const [candlesOut, setCandlesOut] = useState(0);
  const [cutProgress, setCutProgress] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const [isBlowingSmoke, setIsBlowingSmoke] = useState(false);
  const [flyState, setFlyState] = useState('idle');
  const [starGlow, setStarGlow] = useState(false);
  const [starWandAttached, setStarWandAttached] = useState(false);
  
  const [candleGlowState, setCandleGlowState] = useState([false, false, false, false, false]);
  const [knifeSummoned, setKnifeSummoned] = useState(false);
  const [knifePosition, setKnifePosition] = useState([0, 5, -1]); // Floats down from portal
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sceneRef = useRef(null);
  const uiRef = useRef(null);
  const wishInputCardRef = useRef(null);
  const windOverlayRef = useRef(null);
  const dragStartY = useRef(null);
  const isDragging = useRef(false);
  const fairyPosRef = useRef(new THREE.Vector3(0, 0, 0));

  // ── Entrance & Music on Load ─────────────────────────────────────────
  useEffect(() => {
    soundManager.preloadMusic('cake');
    soundManager.playMusic('cake', 2000);

    gsap.fromTo(sceneRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power2.inOut' });

    // Approach cake wide intro
    const t = setTimeout(() => {
      setPhase(PHASE.WISH);
    }, 1800);

    return () => clearTimeout(t);
  }, []);

  // ── Spacebar Blow Support ───────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && phase === PHASE.BLOW) {
        e.preventDefault();
        handleBlow();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, candlesOut]);

  // ── UI dynamic transitions ──────────────────────────────────────────
  useEffect(() => {
    if (!uiRef.current) return;
    gsap.fromTo(uiRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });

    if (phase === PHASE.WISH && wishInputCardRef.current) {
      soundManager.playSfx('magicWand');
      gsap.fromTo(wishInputCardRef.current,
        { y: 55, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, [phase]);

  // ── Wish validation ──────────────────────────────────────────────────
  const handleWishChange = useCallback((val) => {
    setWishText(val);
    setWishValid(val.trim().length >= 3);
    setShowHint(false);
  }, []);

  const handleWishSubmit = useCallback(() => {
    if (!wishValid) {
      gsap.fromTo(wishInputCardRef.current, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      setShowHint(true);
      return;
    }

    soundManager.playSfx('success');

    // Submit wish to Google Sheets backend (via feedback endpoint)
    const payload = {
      feedback: `[Cake Wish] ${wishText}`,
      name: 'Anonymous',
      sessionId: getSessionId(),
      resolution: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language || 'en-US',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      utcTimestamp: new Date().toISOString(),
      localTimestamp: new Date().toLocaleString(),
      pageUrl: window.location.href,
      referrer: document.referrer || ''
    };

    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(err => console.error('[CakeScene] Failed to save wish:', err));
    
    // Fade out input card, start Fairy flight sequence
    gsap.to(wishInputCardRef.current, { opacity: 0, y: -20, duration: 0.5, onComplete: () => {
      setPhase(PHASE.FAIRY_ENTER);
      setFlyState('enter');
    }});
  }, [wishValid, wishText]);

  // ── Fairy catches the Star 19 ───────────────────────────────────────
  const handleFairyTouchStar = useCallback(() => {
    soundManager.playSfx('magicWand');
    setStarGlow(true);
    setStarWandAttached(true);

    // Wand glows brighter, transfer magic to candles
    setTimeout(() => {
      setPhase(PHASE.FAIRY_TRANSFER);
      setFlyState('transfer_candles');
    }, 1200);
  }, []);

  // ── seq glow candles one-by-one ─────────────────────────────────────
  const handleCandleGlow = useCallback((idx) => {
    soundManager.playSfx('sparkle');
    setCandleGlowState(prev => {
      const next = [...prev];
      next[idx] = true;
      
      // All candles finished glowing
      if (idx === TOTAL_CANDLES - 1) {
        setTimeout(() => {
          setPhase(PHASE.BLOW);
        }, 1200);
      }
      return next;
    });
  }, []);

  // ── Blow Candle Action ──────────────────────────────────────────────
  const handleBlow = useCallback(() => {
    if (candlesOut >= TOTAL_CANDLES) return;
    setPhase(PHASE.BLOWING);
    setIsBlowingSmoke(true);
    soundManager.playSfx('candleBlow');

    // Wind overlay
    gsap.fromTo(windOverlayRef.current,
      { opacity: 0, scaleY: 0.2, y: 50 },
      { opacity: 0.7, scaleY: 1, y: -180, duration: 0.6, ease: 'power2.out',
        onComplete: () => {
          gsap.to(windOverlayRef.current, { opacity: 0, duration: 0.2 });
        }
      }
    );

    setTimeout(() => {
      setCandlesOut(prev => {
        const next = prev + 1;
        setIsBlowingSmoke(false);
        if (next >= TOTAL_CANDLES) {
          soundManager.playSfx('success');
          setPhase(PHASE.ALL_OUT);
          
          // Summon Golden Knife Portal sequence
          setTimeout(() => {
            setPhase(PHASE.SUMMON_KNIFE);
            setFlyState('summon_knife');
          }, 1500);
        } else {
          setPhase(PHASE.BLOW);
        }
        return next;
      });
    }, 550);
  }, [candlesOut]);

  // ── Portal opens & Golden Knife floats down ──────────────────────────
  const handlePortalOpened = useCallback(() => {
    soundManager.playSfx('magicWand');
    setKnifeSummoned(true);
    
    // Glide knife down to table beside cake
    setKnifePosition([1.2, 0.25, 0.5]);

    setTimeout(() => {
      setPhase(PHASE.CUT_READY);
    }, 1800);
  }, []);

  // ── Drag Cutting Interaction ─────────────────────────────────────────
  const [knifePos, setKnifePos] = useState({ x: 200, y: 200 });

  const handleMouseMove = useCallback((e) => {
    if (phase !== PHASE.CUT_READY && phase !== PHASE.CUTTING) return;
    const rect = sceneRef.current?.getBoundingClientRect();
    if (!rect) return;
    setKnifePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });

    if (isDragging.current && dragStartY.current !== null) {
      const dist = Math.max(0, e.clientY - dragStartY.current);
      const prog = Math.min(1, dist / 140);
      setCutProgress(prog);
      if (prog >= 1) finishCut();
    }
  }, [phase]);

  const handleMouseDown = useCallback((e) => {
    if (phase !== PHASE.CUT_READY && phase !== PHASE.CUTTING) return;
    setPhase(PHASE.CUTTING);
    isDragging.current = true;
    dragStartY.current = e.clientY || e.touches?.[0]?.clientY;
    soundManager.playSfx('cakeCut');
  }, [phase]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    dragStartY.current = null;
    if (cutProgress >= 0.85) finishCut();
  }, [cutProgress]);

  const finishCut = useCallback(() => {
    if (phase === PHASE.CELEBRATE || phase === PHASE.SUCCESS) return;
    setCutProgress(1);
    setPhase(PHASE.CELEBRATE);
    setFlyState('celebrate');

    // Switch music to grand celebration
    soundManager.stopMusic(500);
    soundManager.preloadMusic('welcome');
    soundManager.playMusic('welcome', 1200);

    // Fairy draws message in sky, then transition to full success
    setTimeout(() => {
      setPhase(PHASE.SUCCESS);
      setFlyState('exit');
      
      // Confetti
      setConfetti(Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        x: 15 + Math.random() * 70,
        color: ['#f43f5e','#8b5cf6','#fbbf24','#2dd4bf','#fda4af','#fde68a','#a78bfa'][i % 7],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 1.5,
        duration: 2.2 + Math.random() * 2,
        rotation: Math.random() * 360,
      })));
    }, 3500);
  }, [phase]);

  const handleContinue = useCallback(() => {
    sceneManager.complete({
      nextRoute: '/memory-camera',
      message: '🎂\nEvery celebration leaves behind a beautiful memory.\n\nLet\'s collect yours.',
      transitionDelay: 2000,
    });
  }, []);

  const handleMobileCut = useCallback(() => {
    if (phase === PHASE.CELEBRATE || phase === PHASE.SUCCESS || phase === PHASE.CUTTING) return;
    soundManager.playSfx('cakeCut');
    setPhase(PHASE.CUTTING);
    
    const rect = sceneRef.current?.getBoundingClientRect();
    const x = rect ? rect.width / 2 : window.innerWidth / 2;
    const yStart = rect ? rect.height * 0.35 : window.innerHeight * 0.35;
    setKnifePos({ x, y: yStart });
    
    const cutObj = { val: 0 };
    gsap.to(cutObj, {
      val: 1,
      duration: 1.8,
      ease: 'power1.inOut',
      onUpdate: () => {
        setCutProgress(cutObj.val);
        setKnifePos({ x, y: yStart + cutObj.val * 140 });
      },
      onComplete: () => {
        finishCut();
      }
    });
  }, [phase, finishCut]);

  const remaining = TOTAL_CANDLES - candlesOut;
  const isWedgeCut = cutProgress >= 1;

  return (
    <SceneWrapper sceneName="cake" className="bg-[#04020f]">
      <div
        ref={sceneRef}
        className="absolute inset-0 w-full h-full overflow-hidden bg-[#04020f]"
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onMouseDown={!isMobile ? handleMouseDown : undefined}
        onMouseUp={!isMobile ? handleMouseUp : undefined}
        onTouchMove={!isMobile ? handleMouseMove : undefined}
        onTouchStart={!isMobile ? handleMouseDown : undefined}
        onTouchEnd={!isMobile ? handleMouseUp : undefined}
        style={{ cursor: (phase === PHASE.CUT_READY || phase === PHASE.CUTTING) ? 'none' : 'default' }}
      >
        {/* ── 3D CANVAS LAYER ────────────────────────────────────────── */}
        <div className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
          <Canvas
            shadows
            camera={{ fov: 45, near: 0.1, far: 100, position: [0, 3.5, 7.5] }}
            gl={{ 
              antialias: true, 
              alpha: true,
              toneMapping: THREE.ACESFilmicToneMapping, 
              toneMappingExposure: 1.0,
              failIfMajorPerformanceCaveat: false,
              powerPreference: "high-performance"
            }}
          >
            {/* Cinematic Camera */}
            <CakeCamera phase={phase} />
            
            {/* Premium Studio Lights */}
            <CakeLighting />
            
            {/* 3D Cake Orchestrator */}
            <CakeModel 
              candlesOut={candlesOut} 
              cutProgress={cutProgress} 
              isWedgeCut={isWedgeCut} 
              starGlow={starGlow}
              flyState={flyState}
              onTouchStar={handleFairyTouchStar}
              onCandleGlow={handleCandleGlow}
              onPortalOpened={handlePortalOpened}
              fairyPosRef={fairyPosRef}
              starWandAttached={starWandAttached}
              knifeSummoned={knifeSummoned}
              knifePosition={knifePosition}
              candleGlowState={candleGlowState}
            />

            {/* White Marble Table */}
            <CakeEnvironment />

            {/* Ambient particles */}
            <CakeParticles />
          </Canvas>
        </div>

        {/* ── BACKGROUND ORNAMENTATIONS ──────────────────────────────── */}
        <BackgroundDecorations />

        {/* ── WIND BLOWING EFFECT WAVE ───────────────────────────────── */}
        <svg 
          ref={windOverlayRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-[15%] w-80 h-40 pointer-events-none opacity-0"
          style={{ zIndex: 25 }}
          viewBox="0 0 300 150"
        >
          <path d="M 50 140 Q 150 10 250 140" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="4" strokeLinecap="round" strokeDasharray="10,20" />
          <path d="M 80 140 Q 150 30 220 140" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,15" />
        </svg>

        {/* ── CONFETTI CELEBRATION FALL ──────────────────────────────── */}
        {phase === PHASE.SUCCESS && confetti.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: '-10px',
              width: p.size,
              height: p.size * 0.45,
              backgroundColor: p.color,
              borderRadius: 2,
              animation: `confettiFall ${p.duration}s ${p.delay}s linear forwards`,
              transform: `rotate(${p.rotation}deg)`,
              zIndex: 35
            }}
          />
        ))}

        {/* ══ INTERACTIVE SCREEN OVERLAYS ═══════════════════════════════ */}

        {/* ── WISH: Write Wish layout ────────────────────────────────── */}
        {phase === PHASE.WISH && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div 
              ref={wishInputCardRef}
              className="relative w-full max-w-sm mx-6 px-7 py-8 text-center rounded-2xl border border-amber-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
              style={{
                background: 'rgba(15, 12, 35, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <h2 className="text-amber-300 font-bold text-xl mb-1 tracking-wide font-display">Make a Wish ✨</h2>
              <p className="text-white/60 text-sm tracking-wider mb-5">Write your heart&apos;s deepest wish...</p>
              
              <div className="relative w-full mb-5">
                <textarea
                  value={wishText}
                  maxLength={120}
                  onChange={e => handleWishChange(e.target.value)}
                  placeholder="Write your wish here..."
                  className="w-full h-24 p-3.5 rounded-xl border border-white/10 outline-none text-white text-sm font-sans resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
                <div className="absolute bottom-2 right-3 text-[10px] text-white/40 font-mono">
                  {wishText.length}/120
                </div>
              </div>

              {showHint && (
                <p className="text-rose-400 text-sm mb-3">💫 Please type a meaningful wish.</p>
              )}

              <button
                onClick={handleWishSubmit}
                className="w-full py-3 rounded-full font-sans font-bold text-sm tracking-widest text-teal-950 transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  boxShadow: '0 4px 15px rgba(251,191,36,0.3)',
                }}
              >
                Cast Wish ✨
              </button>
              
              <p className="text-amber-500/90 text-xs mt-4 font-sans tracking-wider leading-relaxed italic animate-pulse">
                ⚠️ Make a wish to proceed to the next step
              </p>
            </div>
          </div>
        )}

        {/* ── FAIRY INTROS: Narrative helper tags ─────────────────────── */}
        {phase === PHASE.FAIRY_ENTER && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-[10vh] z-20 pointer-events-none">
            <p className="text-gold-200/90 text-sm font-script italic tracking-wider text-center animate-pulse">
              The stars have heard your wish...
            </p>
          </div>
        )}
        
        {phase === PHASE.FAIRY_TRANSFER && (
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-[10vh] z-20 pointer-events-none">
            <p className="text-gold-200/90 text-sm font-script italic tracking-wider text-center animate-pulse">
              The magic is awakening...
            </p>
          </div>
        )}

        {/* ── BLOW: Candle Blowing ──────────────────────────────────── */}
        {(phase === PHASE.BLOW || phase === PHASE.BLOWING) && (
          <div ref={uiRef} className="absolute inset-0 flex flex-col items-center justify-end pb-[8vh] z-20" style={{ opacity: 0 }}>
            <p className="mb-3.5 text-gold-200/95 text-base font-script italic tracking-wider text-center animate-pulse">
              ✨ Blow Out The Candles ✨
            </p>
            
            {remaining > 0 && (
              <button
                onClick={handleBlow}
                disabled={phase === PHASE.BLOWING}
                className="px-12 py-4 rounded-full font-sans font-extrabold text-sm text-teal-950 tracking-widest transition-transform duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
                  boxShadow: '0 0 25px rgba(45,212,191,0.5)',
                }}
              >
                Blow the Candles 💨
              </button>
            )}
            <span className="mt-2.5 font-sans text-white/40 text-xs tracking-wider">
              (or press and hold Spacebar)
            </span>
          </div>
        )}

        {/* ── ALL OUT: Transition hold state ────────────────────────── */}
        {phase === PHASE.ALL_OUT && (
          <div ref={uiRef} className="absolute inset-0 flex flex-col items-center justify-end pb-[10vh] z-20" style={{ opacity: 0 }}>
            <p className="text-gold-200 text-base font-script italic animate-pulse">
              The birthday magic has awakened.
            </p>
          </div>
        )}

        {/* ── SUMMON_KNIFE: Golden portal summons knife ──────────────── */}
        {phase === PHASE.SUMMON_KNIFE && (
          <div ref={uiRef} className="absolute inset-0 flex flex-col items-center justify-end pb-[10vh] z-20" style={{ opacity: 0 }}>
            <p className="text-gold-200 text-base font-script italic animate-pulse">
              Summoning the magic knife...
            </p>
          </div>
        )}

        {/* ── CUT READY / CUTTING: Golden knife drag or Mobile button ────────────────── */}
        {(phase === PHASE.CUT_READY || phase === PHASE.CUTTING) && (
          <div ref={uiRef} className="absolute bottom-[6vh] left-1/2 -translate-x-1/2 z-20 text-center flex flex-col items-center gap-4" style={{ opacity: 0 }}>
            {isMobile ? (
              <button
                onClick={handleMobileCut}
                disabled={phase === PHASE.CUTTING}
                className="px-10 py-3.5 rounded-full font-sans font-bold text-xs uppercase tracking-widest text-teal-950 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.4)]"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  boxShadow: '0 0 25px rgba(251,191,36,0.5)',
                }}
              >
                {phase === PHASE.CUTTING ? '🎂 Cutting Cake... 🔪' : '🎂 Cut the Cake 🔪'}
              </button>
            ) : (
              <>
                <p className="text-gold-200 font-sans text-xs tracking-widest uppercase mb-2.5">
                  The magic knife is ready. Drag the knife across the cake.
                </p>
                <div className="w-40 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-yellow-400 transition-all duration-100" 
                    style={{ width: `${cutProgress * 100}%`, boxShadow: '0 0 8px #fbbf24' }} 
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* ── FAIRY CELEBRATION WRITE IN SKY ──────────────────────────── */}
        {phase === PHASE.CELEBRATE && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-25 pointer-events-none">
            <h2 
              className="text-3xl md:text-4xl text-center text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 to-amber-400 italic tracking-widest drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              ✨ Happy Birthday Bhavani ✨
            </h2>
          </div>
        )}

        {/* ── SUCCESS CELEBRATION CARD ────────────────────────────────── */}
        {phase === PHASE.SUCCESS && (
          <div 
            className="absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden"
            style={{ background: 'rgba(4,2,15,0.92)', backdropFilter: 'blur(12px)', animation: 'fadeIn 1s ease' }}
          >
            {/* CSS Animation Inject */}
            <style>{`
              @keyframes floatUp {
                0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
                10% { opacity: 0.75; }
                90% { opacity: 0.75; }
                100% { transform: translateY(-20vh) rotate(15deg); opacity: 0; }
              }
              .animate-balloon-bg {
                animation: floatUp var(--dur) linear infinite;
                animation-delay: var(--delay);
              }
              @keyframes sparkleTwinkle {
                0%, 100% { opacity: 0.2; transform: scale(0.8); }
                50% { opacity: 0.95; transform: scale(1.2); }
              }
              .animate-sparkle-bg {
                animation: sparkleTwinkle var(--dur) ease-in-out infinite;
                animation-delay: var(--delay);
              }
            `}</style>

            {/* Background glowing aura */}
            <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #fbbf24, transparent 70%)', filter: 'blur(60px)' }} />

            {/* Floating Background Balloons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-40">
              {[
                { left: '8%', color: '#fbbf24', dur: 12, delay: 0 },
                { left: '20%', color: '#f472b6', dur: 15, delay: 3 },
                { left: '78%', color: '#a78bfa', dur: 14, delay: 1 },
                { left: '90%', color: '#2dd4bf', dur: 16, delay: 5 },
                { left: '15%', color: '#f43f5e', dur: 13, delay: 7 },
                { left: '84%', color: '#60a5fa', dur: 15, delay: 2 },
              ].map((b, i) => (
                <div
                  key={i}
                  className="absolute animate-balloon-bg flex flex-col items-center"
                  style={{
                    left: b.left,
                    bottom: '-150px',
                    '--dur': `${b.dur}s`,
                    '--delay': `${b.delay}s`,
                  }}
                >
                  <div 
                    className="w-14 h-16 rounded-full relative"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, #ffffff 0%, ${b.color} 70%)`,
                      boxShadow: `0 4px 10px rgba(0,0,0,0.15), inset -4px -4px 12px rgba(0,0,0,0.2)`,
                    }}
                  >
                    <div className="absolute top-2.5 left-2.5 w-3 h-4 bg-white/40 rounded-full rotate-[-30deg]" />
                  </div>
                  <div className="w-1.5 h-1.5 border-t-4 border-x-4 border-transparent border-t-amber-500/80 -mt-[1px]" />
                  <div className="w-[1px] h-20 bg-white/20" />
                </div>
              ))}
            </div>

            {/* Ambient Background Sparkles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-45">
              {[
                { top: '15%', left: '12%', delay: 0, scale: 0.8 },
                { top: '25%', left: '85%', delay: 0.5, scale: 1.1 },
                { top: '75%', left: '10%', delay: 1.2, scale: 0.9 },
                { top: '65%', left: '88%', delay: 1.8, scale: 1.0 },
                { top: '45%', left: '5%', delay: 0.8, scale: 0.7 },
                { top: '80%', left: '75%', delay: 2.2, scale: 1.2 },
              ].map((s, i) => (
                <svg
                  key={i}
                  viewBox="0 0 24 24"
                  className="absolute w-6 h-6 text-gold-300 animate-sparkle-bg"
                  style={{
                    top: s.top,
                    left: s.left,
                    transform: `scale(${s.scale})`,
                    '--delay': `${s.delay}s`,
                    '--dur': '3s',
                  }}
                >
                  <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" fill="currentColor" />
                </svg>
              ))}
            </div>

            {/* Success Card content */}
            <div className="relative z-10 text-center px-6 w-full max-w-3xl flex flex-col items-center">
              <div className="text-6xl mb-6 animate-bounce">🎉🎂🎉</div>
              <h1 className="font-display text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-gold-200 to-gold-400 mb-6 drop-shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                Happy Birthday Bhavani!
              </h1>
              <p className="font-script text-2xl text-gold-300/80 italic mb-4">
                &ldquo;{wishText}&rdquo;
              </p>

              {/* Inspirational Quote Instead of Previewing Memories */}
              <p className="font-serif italic text-lg md:text-xl text-amber-200/90 max-w-lg leading-relaxed text-center my-8 drop-shadow-md" style={{ fontFamily: 'Georgia, serif' }}>
                “Every celebration leaves behind a beautiful memory. Let's collect yours.”
              </p>
              
              <button
                onClick={handleContinue}
                className="px-14 py-4 rounded-full font-sans font-bold text-base tracking-widest text-teal-950 transition-transform duration-200 hover:scale-105 active:scale-95 mt-4 animate-ripple"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  boxShadow: '0 0 35px rgba(251,191,36,0.6)',
                }}
              >
                Continue the Magic →
              </button>
            </div>
          </div>
        )}

        {/* ── ROYAL DAGGER CURSOR IN OVERLAY ──────────────────────────── */}
        {((!isMobile && (phase === PHASE.CUT_READY || phase === PHASE.CUTTING)) || (isMobile && phase === PHASE.CUTTING)) && (
          <div
            className="absolute pointer-events-none transition-all duration-[0.04s] linear"
            style={{
              left: knifePos.x, top: knifePos.y,
              transform: 'translate(-50%, -90%) rotate(-10deg)',
              zIndex: 50
            }}
          >
            <svg width="45" height="135" viewBox="0 0 50 150"
              style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.8))' }}>
              <defs>
                <linearGradient id="knifeGold" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#b45309"/>
                  <stop offset="50%" stopColor="#fbbf24"/>
                  <stop offset="100%" stopColor="#d97706"/>
                </linearGradient>
                <linearGradient id="knifeSilver" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#cbd5e1"/>
                  <stop offset="50%" stopColor="#f8fafc"/>
                  <stop offset="100%" stopColor="#64748b"/>
                </linearGradient>
              </defs>
              <rect x="18" y="0" width="14" height="55" rx="6" fill="url(#knifeGold)"/>
              <circle cx="25" cy="12" r="4" fill="#ef4444" />
              <path d="M 8 50 L 42 50 L 38 58 L 12 58 Z" fill="url(#knifeSilver)"/>
              <path d="M 22 58 L 28 58 L 34 150 L 16 150 Z" fill="url(#knifeSilver)"/>
              <line x1="25" y1="62" x2="25" y2="142" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5"/>
            </svg>
          </div>
        )}

        {/* Bottom edge shadow vignette */}
        <div className="absolute bottom-0 inset-x-0 h-[15%] bg-gradient-to-t from-night-950 to-transparent pointer-events-none z-6" />
      </div>
    </SceneWrapper>
  );
}

export default CakeScene;
