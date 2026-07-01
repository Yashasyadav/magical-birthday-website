import React, { useEffect, useRef, useState } from 'react';
import SceneWrapper from '@components/layout/SceneWrapper';
import soundManager from '@engine/SoundManager';
import sceneManager from '@engine/SceneManager';

import CinematicBackground from '../../components/effects/background/CinematicBackground';
import CinematicStars from '../../components/effects/background/CinematicStars';
import CinematicNebula from '../../components/effects/background/CinematicNebula';

export function FeedbackScene() {
  const [text, setText] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // States: 'form' | 'submitting' | 'morphing-checkmark' | 'glowing-card' | 'success'
  const [stage, setStage] = useState('form');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [fireflies, setFireflies] = useState([]);
  const [successSparkles, setSuccessSparkles] = useState([]);

  const cardRef = useRef(null);

  // 1. Initial Load & Session Flag Check
  useEffect(() => {
    // Sync pre-load sound configuration
    soundManager.preloadMusic('feedback');
    soundManager.playMusic('feedback', 2000);
    soundManager.setMusicVolume(0.24);

    const hasSubmitted = sessionStorage.getItem('feedback_submitted');
    if (hasSubmitted === 'true') {
      setStage('success');
    }

    // Bind connection change listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Setup background ambient sparks
    const sparks = [];
    for (let i = 0; i < 15; i++) {
      sparks.push({
        id: i,
        top: 10 + Math.random() * 80,
        left: 10 + Math.random() * 80,
        size: 1.5 + Math.random() * 2.5,
        delay: Math.random() * -10,
        speed: 12 + Math.random() * 12,
        dx: (Math.random() - 0.5) * 40,
        dy: -30 - Math.random() * 40,
        maxOpacity: 0.15 + Math.random() * 0.25
      });
    }
    setParticles(sparks);

    // Setup slow drifting fireflies
    const flies = [];
    for (let i = 0; i < 8; i++) {
      flies.push({
        id: i,
        top: 15 + Math.random() * 70,
        left: 15 + Math.random() * 70,
        delay: Math.random() * -8,
        speed: 6 + Math.random() * 6,
        swayX: (Math.random() - 0.5) * 60,
        swayY: -30 - Math.random() * 40
      });
    }
    setFireflies(flies);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 2. Parallax mouse movements
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (['success', 'glowing-card'].includes(stage)) return; // Keep center card stable at success
      const { innerWidth, innerHeight } = window;
      const xVal = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const yVal = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setTilt({
        x: yVal * -2.2,
        y: xVal * 2.2
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [stage]);

  // 3. Helper to obtain UUID Session ID securely
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

  // 4. API Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || stage !== 'form' || !isOnline) return;

    setStage('submitting');
    setErrorMessage('');
    soundManager.playSfx('buttonClick');

    const payload = {
      feedback: text,
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

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Your message couldn't be saved right now. Please try again.");
      }

      // Success sequence
      soundManager.playSfx('success');
      setStage('morphing-checkmark');

      // Morphing Checkmark completes -> soft glow
      setTimeout(() => {
        setStage('glowing-card');
        soundManager.playSfx('sparkle');
        
        // Spawn floating success sparkles
        const list = [];
        for (let i = 0; i < 22; i++) {
          list.push({
            id: i,
            x: 20 + Math.random() * 60,
            y: 50 + Math.random() * 40,
            size: 3 + Math.random() * 4,
            speed: 1.5 + Math.random() * 1.5,
            delay: Math.random() * 0.4
          });
        }
        setSuccessSparkles(list);

        // Soft glow completes -> transition to final view
        setTimeout(() => {
          sessionStorage.setItem('feedback_submitted', 'true');
          setStage('success');
          setTilt({ x: 0, y: 0 }); // Lock card flat

          // Navigate to Finale automatically after 2.5 seconds
          setTimeout(() => {
            sceneManager.navigateTo('finale');
          }, 2500);
        }, 1200);

      }, 1000);

    } catch (err) {
      setErrorMessage(err.message || 'Connection timeout. Please try again.');
      setStage('form');
    }
  };

  const handleTextChange = (e) => {
    if (e.target.value.length <= 500) {
      setText(e.target.value);
    }
  };

  const isFormReadOnly = ['submitting', 'morphing-checkmark', 'glowing-card'].includes(stage);

  return (
    <SceneWrapper sceneName="feedback" className="bg-[#02010b]">
      {/* Custom Styles and Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        .font-serif { font-family: 'Playfair Display', serif; }
        .font-handwritten { font-family: 'Caveat', cursive; }

        @keyframes floatDust {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          15% { opacity: var(--max-op); }
          85% { opacity: var(--max-op); }
          100% { transform: translateY(var(--dy)) translateX(var(--dx)); opacity: 0; }
        }

        @keyframes fireflyPulse {
          0%, 100% { opacity: 0; transform: translate(0, 0) scale(0.7); }
          50% { opacity: 0.85; transform: translate(var(--sway-x), var(--sway-y)) scale(1.1); }
        }

        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }

        @keyframes softCardGlow {
          0% { box-shadow: inset 0 0 24px rgba(251,191,36,0.1), 0 10px 40px rgba(0,0,0,0.5); }
          50% { box-shadow: inset 0 0 45px rgba(251,191,36,0.4), 0 0 60px rgba(251,191,36,0.35); }
          100% { box-shadow: inset 0 0 24px rgba(251,191,36,0.1), 0 10px 40px rgba(0,0,0,0.5); }
        }

        @keyframes floatSparkle {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translateY(-160px) scale(0.1); opacity: 0; }
        }

        @keyframes swing {
          0% { transform: rotate(-4.5deg); }
          100% { transform: rotate(4.5deg); }
        }

        .animate-swing {
          animation: swing 3.8s ease-in-out infinite alternate;
        }

        .draw-path {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: drawCheck 0.6s ease-in-out forwards;
        }
      `}</style>

      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <CinematicBackground />
        
        {/* Twinkling star field */}
        <div className="absolute inset-0 z-2 opacity-70">
          <CinematicStars />
        </div>
        
        <CinematicNebula />

        {/* Slow screen vignette */}
        <div className="absolute inset-0 z-45 shadow-[inset_0_0_90px_rgba(0,0,0,0.85)]" />
        
        {/* Soft bottom clouds mist */}
        <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#02010b] via-amber-900/5 to-transparent blur-[10px] z-1" />

        {/* Floating background star dust */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-r from-yellow-100 via-amber-300 to-amber-500"
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              boxShadow: '0 0 8px rgba(251,191,36,0.85)',
              animation: `floatDust ${p.speed}s linear infinite`,
              animationDelay: `${p.delay}s`,
              '--max-op': p.maxOpacity,
              '--dx': `${p.dx}px`,
              '--dy': `${p.dy}px`
            }}
          />
        ))}

        {/* Floating fireflies */}
        {fireflies.map((ff) => (
          <div
            key={ff.id}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-yellow-100 to-amber-300 blur-[0.6px]"
            style={{
              top: `${ff.top}%`,
              left: `${ff.left}%`,
              boxShadow: '0 0 10px #fde68a, 0 0 20px #f59e0b',
              animation: `fireflyPulse ${ff.speed}s ease-in-out infinite alternate`,
              animationDelay: `${ff.delay}s`,
              '--sway-x': `${ff.swayX}px`,
              '--sway-y': `${ff.swayY}px`
            }}
          />
        ))}
      </div>

      {/* Fairy Lights strings swinging along the top */}
      <div className="absolute top-0 inset-x-0 h-16 pointer-events-none z-10 flex justify-between px-8">
        <svg className="absolute top-0 inset-x-0 w-full h-12" preserveAspectRatio="none" viewBox="0 0 1000 40">
          <path d="M 0 0 Q 125 28 250 8 Q 375 32 500 12 Q 625 32 750 12 Q 875 28 1000 0" fill="none" stroke="rgba(213, 195, 156, 0.35)" strokeWidth="1.2" />
        </svg>
        {[45, 145, 245, 345, 445, 545, 645, 745, 845, 945].map((x, idx) => (
          <div
            key={idx}
            className="absolute w-2.5 h-3.5 rounded-full bg-yellow-100/90 shadow-[0_0_15px_#fde68a,0_0_5px_#d97706] animate-swing"
            style={{
              left: `${x / 10}%`,
              top: `${20 + Math.sin(idx) * 6}px`,
              transformOrigin: 'top center',
              animationDelay: `${idx * 0.28}s`,
              animationDuration: `${3.2 + Math.sin(idx) * 1.2}s`
            }}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 z-20">
        
        {/* Soft shadow map background layer */}
        <div 
          className="absolute w-[92vw] max-w-[760px] h-[82vh] max-h-[640px] bg-black/60 rounded-[28px] blur-[30px] pointer-events-none z-10 transition-all duration-[3000ms] ease-out"
          style={{
            transform: `translate(${tilt.y * -4.2}px, ${tilt.x * 4.2 + 18}px) scale(${stage === 'success' ? 1.0 : 0.98})`,
            opacity: stage === 'success' ? 0.8 : 1.0
          }}
        />

        {/* Central Stationery Memory Card */}
        <div
          ref={cardRef}
          className="relative rounded-[28px] p-6 md:p-12 border border-[#d5c39c]/60 flex flex-col justify-between overflow-hidden select-none z-20 transition-all duration-[3000ms] ease-out"
          style={{
            width: '92vw',
            maxWidth: '760px',
            height: '82vh',
            maxHeight: '640px',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${stage === 'success' ? 1.0 : 0.985})`,
            backgroundImage: 'linear-gradient(135deg, #fffdf8 0%, #f9f1df 50%, #f1e5c2 100%)',
            boxShadow: 'inset 0 0 35px rgba(255,255,255,0.45), inset -8px -8px 24px rgba(120,53,4,0.03)',
            animation: stage === 'glowing-card' ? 'softCardGlow 1.2s ease-in-out infinite' : 'none'
          }}
        >
          {/* Handmade fibers texture */}
          <div 
            className="absolute inset-0 opacity-[0.09] pointer-events-none rounded-[28px]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 150 150' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12,22 Q18,27 15,38 M48,78 Q55,73 60,88 M95,45 Q88,60 98,70 M115,108 Q125,118 120,128' stroke='%237c5f3b' stroke-width='0.45' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundSize: '150px 150px'
            }}
          />

          {/* Gold Border Frame */}
          <div className="absolute inset-5 rounded-[24px] border border-amber-600/35 pointer-events-none">
            <div className="absolute inset-[2px] border border-amber-500/10 rounded-[22px]" />
          </div>

          {/* Success floating sparkles */}
          {stage === 'success' && successSparkles.map((sp) => (
            <div
              key={sp.id}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 pointer-events-none"
              style={{
                left: `${sp.x}%`,
                top: `${sp.y}%`,
                boxShadow: '0 0 10px #fbbf24, 0 0 18px #ffffff',
                animation: `floatSparkle ${sp.speed}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                animationDelay: `${sp.delay}s`
              }}
            />
          ))}

          {/* ─ PAGE FORM STAGE ────────────────────────────────────────────── */}
          {stage !== 'success' && (
            <div className="relative w-full h-full flex flex-col justify-between z-10 transition-opacity duration-700">
              
              {/* Header Title Section */}
              <div className="text-center mt-2">
                <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-wider text-amber-950/95 drop-shadow-sm select-none">
                  One Last Thing... 💛
                </h1>
                <p className="text-sm font-sans tracking-wide text-amber-800/85 mt-2 max-w-[480px] mx-auto leading-relaxed">
                  Thank you for taking this little journey. Every smile, every laugh, and every emotion was created especially for you. Before you leave... I'd love to keep one small memory from today.
                </p>
              </div>

              {/* Offline Alert Warning Banner */}
              {!isOnline && (
                <div className="mx-auto w-[92%] bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-center justify-center gap-2 select-none shadow-sm animate-pulse">
                  <span className="text-sm">⚠️</span>
                  <p className="text-xs md:text-sm font-sans font-semibold text-red-900">
                    Internet connection lost. Your message will remain here until you're back online.
                  </p>
                </div>
              )}

              {/* Error Message notification bar */}
              {errorMessage && (
                <div className="mx-auto w-[92%] bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center justify-center gap-2 select-none shadow-sm">
                  <span className="text-sm">❌</span>
                  <p className="text-xs md:text-sm font-sans font-semibold text-amber-900">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Feedback Textarea Wrapper */}
              <div className="flex flex-col gap-2 mt-4 px-2 md:px-8 max-w-[560px] mx-auto w-full">
                <label className="text-xs md:text-sm font-sans font-bold tracking-widest text-[#8c6b3e] uppercase text-center mb-1">
                  ✨ Your Words Will Become My Favorite Memory ✨
                </label>
                
                <div className="relative">
                  <textarea
                    value={text}
                    onChange={handleTextChange}
                    readOnly={isFormReadOnly}
                    placeholder="Write anything...&#10;Tell me how this made you feel...&#10;Which part made you smile?&#10;Or simply leave a small message for me..."
                    className="w-full h-32 md:h-36 p-4 rounded-xl border border-amber-600/35 focus:outline-none focus:border-amber-500 bg-white/45 placeholder-amber-900/40 text-amber-950 font-handwritten text-xl leading-relaxed resize-none transition-all duration-300"
                    style={{
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)'
                    }}
                  />
                  
                  {/* Live Character counter */}
                  <span className="absolute bottom-2.5 right-3 text-[10px] font-sans font-semibold tracking-wider text-amber-900/60 select-none">
                    {text.length} / 500
                  </span>
                </div>
              </div>

              {/* Action Button Section */}
              <div className="flex justify-center mb-1">
                {stage === 'form' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!text.trim() || !isOnline}
                    className="px-8 py-3 rounded-full border border-amber-600/40 text-amber-950 font-sans text-xs font-bold tracking-widest bg-gradient-to-b from-[#fef08a] to-[#d97706] hover:from-[#fef08a] hover:to-[#eab308] hover:shadow-[0_0_15px_rgba(217,119,6,0.32)] hover:scale-105 disabled:opacity-40 disabled:scale-100 disabled:pointer-events-none disabled:shadow-none transition-all duration-300 cursor-pointer select-none"
                  >
                    💛 Save My Memory
                  </button>
                ) : stage === 'submitting' ? (
                  // Spinning Gold morph loader
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-amber-600/30 border-t-amber-500 animate-spin bg-amber-950/5 shadow-sm" />
                ) : (
                  // Golden Checkmark Draw morph stage
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#fde68a] border border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.4)] animate-bounce">
                    <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2">
                      <path className="draw-path" d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ─ GREETINGS SUCCESS FAREWELL VIEW ────────────────────────────── */}
          {stage === 'success' && (
            <div className="relative w-full h-full flex flex-col justify-center items-center text-center px-4 md:px-8 z-10 select-none">
              
              {/* Gold heart anchor badge */}
              <div className="text-5xl md:text-6xl mb-5 animate-pulse drop-shadow-md select-none">💛</div>

              <div className="flex flex-col gap-4 max-w-[500px]">
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-950/95 drop-shadow-sm select-none">
                  Your message has been safely saved.
                </h2>
                
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent mx-auto my-1" />

                <p className="font-handwritten text-2xl md:text-3xl text-amber-950/90 leading-relaxed max-w-[460px]">
                  Thank you for taking the time to write something. It truly means a lot.
                </p>
                <p className="font-handwritten text-xl md:text-2xl text-amber-900/80 leading-relaxed max-w-[460px] italic">
                  This little website was made with care, and now your words have become a part of it forever.
                </p>

                <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent mx-auto my-1" />

                <h3 className="text-xl md:text-2xl font-serif font-semibold tracking-wide bg-gradient-to-r from-[#d9a74a] via-[#eab308] to-[#b45309] bg-clip-text text-transparent uppercase select-none drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.08)] mt-2 animate-pulse">
                  Happy Birthday once again. ✨
                </h3>
                <button
                  onClick={() => sceneManager.navigateTo('finale')}
                  className="px-10 py-3 rounded-full border border-amber-600/40 text-amber-950 font-sans text-xs font-bold tracking-widest bg-gradient-to-b from-[#fef08a] to-[#d97706] hover:from-[#fef08a] hover:to-[#eab308] hover:shadow-[0_0_15px_rgba(217,119,6,0.32)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer mt-4"
                >
                  Go to Final Scene ➔
                </button>
              </div>

            </div>
          )}

          {/* Delicate corner floral SVGs (identical layout aesthetics to Letter card) */}
          <div className="absolute top-5 left-5 w-8 h-8 pointer-events-none text-amber-700/40">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path d="M 3 3 L 15 3 M 3 3 L 3 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 6 6 L 10 10" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="18" cy="3" r="1.0" fill="currentColor" />
              <circle cx="3" cy="18" r="1.0" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-5 right-5 w-8 h-8 pointer-events-none text-amber-700/40 transform rotate-90">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path d="M 3 3 L 15 3 M 3 3 L 3 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 6 6 L 10 10" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="18" cy="3" r="1.0" fill="currentColor" />
              <circle cx="3" cy="18" r="1.0" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-5 left-5 w-8 h-8 pointer-events-none text-amber-700/40 transform -rotate-90">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path d="M 3 3 L 15 3 M 3 3 L 3 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 6 6 L 10 10" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="18" cy="3" r="1.0" fill="currentColor" />
              <circle cx="3" cy="18" r="1.0" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-5 right-5 w-8 h-8 pointer-events-none text-amber-700/40 transform rotate-180">
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <path d="M 3 3 L 15 3 M 3 3 L 3 15" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M 6 6 L 10 10" fill="none" stroke="currentColor" strokeWidth="0.8" />
              <circle cx="18" cy="3" r="1.0" fill="currentColor" />
              <circle cx="3" cy="18" r="1.0" fill="currentColor" />
            </svg>
          </div>

        </div>
      </div>

      {/* --- Final Footer at the bottom --- */}
      <div className="absolute bottom-[3.2vh] left-1/2 -translate-x-1/2 z-30 text-center select-none opacity-50 flex flex-col items-center">
        <p className="text-[10px] font-sans font-semibold tracking-[0.25em] text-[#d5c39c] uppercase flex items-center gap-1.5 justify-center">
          Made with <span className="text-red-500 scale-105 animate-pulse">❤️</span> Especially for You
        </p>
        <div className="text-[10px] text-amber-500 mt-1">✨</div>
      </div>
    </SceneWrapper>
  );
}

export default FeedbackScene;
