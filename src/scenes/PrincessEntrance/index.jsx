/**
 * scenes/PrincessEntrance/index.jsx  [UPGRADED — Phase 4 v3]
 * ─────────────────────────────────────────────────────────────────────────────
 * PHASE 4 — The Princess Arrives (Cinematic Disney Experience)
 *
 * Full storyboard sequence:
 *
 *   0s    Scene fades in — night sky, aurora, moon, trees, castle
 *   0.5s  Castle doors open. Golden light leaks. Fireworks BEGIN.
 *   1.5s  Background fireworks start (periodic 2.2s interval)
 *   4s    Princess SILHOUETTE in doorway. Heart + ring + star fireworks.
 *   9.5s  Silhouette → FULL COLOR reveal. God rays + moon rim bloom.
 *  10s    Reveal fireworks: 2 bursts + gold cascade
 *  13s    First step — bob
 *  13.8s  Walk forward 26vh + scale 1.32× over 14s. Petals fall.
 *  14.5s  Pathway lamps illuminate castle → camera (1.3s stagger)
 *         Each lamp triggers a ring firework at its position
 *  27s    Princess reaches CENTER. Celebrate() — 12 rockets.
 *  27s    Camera 360° orbit simulation.
 *  30s    Second celebrate() wave.
 *  28s    "✨ Happy Birthday ✨" title fades in.
 *  31s    "BHAVANI" appears massive golden.
 *  33.5s  3 heart fireworks.
 *  34s    Subtitle "You are the Princess of our hearts!"
 *  43s    Titles fade slowly.
 *
 * One GSAP master timeline. All refs owned by this component.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import SceneWrapper  from '@components/layout/SceneWrapper';
import { useApp }    from '@context/AppContext';
import { BIRTHDAY_GIRL_NAME } from '@config/authentication';
import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';

// ── Reused background systems ──────────────────────────────────────────────────
import CinematicStars    from '@components/effects/background/CinematicStars';
import CinematicParticles from '@components/effects/background/CinematicParticles';
import CinematicNebula   from '@components/effects/background/CinematicNebula';

// ── Scene components ───────────────────────────────────────────────────────────
import CastleBackground   from './components/CastleBackground';
import RoyalPathway       from './components/RoyalPathway';
import PathwayLamps       from './components/PathwayLamps';
import GodRays, { MoonRimLight } from './components/GodRays';
import SceneFireflies     from './components/SceneFireflies';
import PrincessCharacter  from './components/PrincessCharacter';
import BirthdayTitle      from './components/BirthdayTitle';
import FireworkCanvas     from './components/FireworkCanvas';
import PetalSystem        from './components/PetalSystem';
import SideTrees          from './components/SideTrees';
import RoyalChariot       from './components/RoyalChariot';
import CheeringCrowd      from './components/CheeringCrowd';

// ─────────────────────────────────────────────────────────────────────────────

function PrincessEntranceContent() {
  const { user } = useApp();
  const birthdayName = user?.name || user?.displayName || BIRTHDAY_GIRL_NAME;

  // ── All DOM refs ──────────────────────────────────────────────────────────
  const sceneRef       = useRef(null);
  const cameraRef      = useRef(null);
  const doorLeftRef    = useRef(null);
  const doorRightRef   = useRef(null);
  const lightLeakRef   = useRef(null);
  const fogLeftRef     = useRef(null);
  const fogRightRef    = useRef(null);
  const magicParticlesRef = useRef(null);
  const silhouetteRef  = useRef(null);
  const princessRef    = useRef(null);
  const princessBodyRef = useRef(null);
  const lampsRef       = useRef(null);
  const godRaysRef     = useRef(null);
  const moonRimRef     = useRef(null);
  const titleRef       = useRef(null);
  const nameRef        = useRef(null);
  const subtitleRef    = useRef(null);
  const petalRef       = useRef(null);
  const fireworkRef    = useRef(null);   // ← imperative firework API
  const masterRef      = useRef(null);

  // ── Build the master GSAP timeline ───────────────────────────────────────
  const buildTimeline = useCallback(() => {
    if (masterRef.current) masterRef.current.kill();

    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set([princessRef.current, titleRef.current, nameRef.current, subtitleRef.current,
                godRaysRef.current, moonRimRef.current, lightLeakRef.current], { opacity: 1 });
      return;
    }

    const master = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    masterRef.current = master;

    // ─ A. Scene reveal ─────────────────────────────────────────────────────
    master.fromTo(
      cameraRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2.5, ease: 'power2.inOut' },
      0
    );

    // ─ B. Royal Chariot arrives and door opens ─────────────────────────────
    master
      .fromTo(
        doorRightRef.current,
        { xPercent: -500, opacity: 0 },
        { xPercent: -50, opacity: 1, duration: 2.2, ease: 'power2.out' },
        0.5
      )
      .to(doorLeftRef.current, { rotateY: -110, duration: 1.5, ease: 'power1.inOut' }, 2.0)
      .fromTo(
        lightLeakRef.current,
        { opacity: 0, scale: 0.3 },
        { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' },
        2.0
      )
      .fromTo(
        fogLeftRef.current,
        { opacity: 0, x: 0, scaleX: 0.4 },
        { opacity: 0.6, x: -100, scaleX: 2.5, duration: 4, ease: 'power1.out' },
        1.0
      )
      .fromTo(
        fogRightRef.current,
        { opacity: 0, x: 0, scaleX: 0.4 },
        { opacity: 0.6, x: 100, scaleX: 2.5, duration: 4, ease: 'power1.out' },
        1.0
      );

    // Magic particles from doorway
    if (magicParticlesRef.current) {
      const pts = magicParticlesRef.current.querySelectorAll('.magic-particle');
      master.fromTo(
        pts,
        { opacity: 0, y: 0, scale: 0 },
        {
          opacity: 0.9, scale: 1,
          y: () => gsap.utils.random(-55, -15),
          x: () => gsap.utils.random(-40, 40),
          duration: 1.5,
          stagger: { each: 0.05, from: 'random' },
          ease: 'back.out(1.7)',
        },
        1.2
      );
    }

    // ─ C. Background fireworks begin when doors open ────────────────────────
    master.call(() => {
      fireworkRef.current?.startBackground();
      // Initial burst behind castle
      fireworkRef.current?.launch(0.25, 0.18, 'burst', 'gold');
      fireworkRef.current?.launch(0.75, 0.12, 'burst', 'purple');
    }, null, 1.0);

    // ─ D. Silhouette appears ────────────────────────────────────────────────
    master.fromTo(
      silhouetteRef.current,
      { opacity: 0, y: 24, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power2.out' },
      2.0
    );

    // More fireworks as silhouette appears
    master.call(() => {
      fireworkRef.current?.launch(0.2, 0.2, 'heart', 'rose');
      fireworkRef.current?.launch(0.8, 0.15, 'ring', 'pink');
      fireworkRef.current?.launch(0.5, 0.1, 'star', 'gold');
    }, null, 2.5);

    // ─ E. Camera gently zooms toward silhouette ─────────────────────────────
    master.to(cameraRef.current, { scale: 1.06, duration: 3.5, ease: 'power1.inOut' }, 2.5);

    // ─ F. Reveal — silhouette → full color ─────────────────────────────────
    master
      .to(silhouetteRef.current, { opacity: 0, duration: 1, ease: 'power2.inOut' }, 5.5)
      .fromTo(
        princessRef.current,
        { opacity: 0, scale: 0.96, filter: 'brightness(2.5) blur(10px)' },
        { opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)', duration: 2, ease: 'power2.out' },
        5.8
      )
      .fromTo(godRaysRef.current,  { opacity: 0 }, { opacity: 1, duration: 2, ease: 'power2.out' }, 5.6)
      .fromTo(moonRimRef.current,  { opacity: 0 }, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 6.0);

    // Fireworks react to reveal
    master.call(() => {
      fireworkRef.current?.launch(0.3, 0.15, 'burst', 'royal');
      fireworkRef.current?.launch(0.7, 0.18, 'burst', 'pink');
      fireworkRef.current?.launch(0.5, 0.08, 'cascade', 'gold');
    }, null, 6.0);

    // ─ G. First step ───────────────────────────────────────────────────────
    master
      .to(princessRef.current, { y: '-=12', duration: 0.5, ease: 'power2.out' }, 8.0)
      .to(princessRef.current, { y: '+=7',  duration: 0.3, ease: 'bounce.out' }, 8.5);

    // ─ H. Walk forward — princess moves from door toward camera ────────────
    master.to(
      princessRef.current,
      { y: '+=26vh', scale: 1.32, duration: 7, ease: 'none' },
      8.5
    );

    // Walk bob
    const walkBob = gsap.timeline({ repeat: -1, yoyo: true });
    walkBob.to(princessBodyRef.current, { y: -8, duration: 0.5, ease: 'sine.inOut' });
    master.add(walkBob, 8.5);

    // Walk natural sway
    const walkSway = gsap.timeline({ repeat: -1, yoyo: true });
    walkSway.to(princessBodyRef.current, { rotation: 0.9, duration: 0.9, ease: 'sine.inOut' });
    master.add(walkSway, 8.5);

    // Petals begin falling as she walks
    master.to(petalRef.current, { opacity: 1, duration: 2, ease: 'power1.out' }, 9.0);

    // ─ I. Pathway lamp sequence — castle → camera ──────────────────────────
    if (lampsRef.current) {
      const lamps = Array.from(lampsRef.current.querySelectorAll('.pathway-lamp')).reverse();
      const glows = Array.from(lampsRef.current.querySelectorAll('.lamp-glow')).reverse();

      const tlLamps = gsap.timeline();
      lamps.forEach((lamp, i) => {
        tlLamps.to(lamp, { opacity: 1, duration: 0.6, ease: 'power2.out' }, i * 0.5);
        if (glows[i]) {
          tlLamps
            .fromTo(glows[i], { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1.2, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, i * 0.5)
            .to(glows[i], { scale: 1, opacity: 0.8, duration: 0.6 }, i * 0.5 + 0.5)
            .to(glows[i], { opacity: 0.7, scale: 0.95, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' }, i * 0.5 + 1.1);
          // Sparkle effect when lamp lights & ground fountain firework from the flower pot
          master.call(() => {
            // General center ring explosion
            fireworkRef.current?.explode(0.5, 0.85 - i * 0.06, 'ring', ['#fbbf24','#fde68a','#ffffff']);

            // Launch custom flower pot fountain fireworks
            const indexAttr = lamp.getAttribute('data-index');
            const side = lamp.getAttribute('data-side');
            if (indexAttr !== null && side !== null) {
              const lampIndex = parseInt(indexAttr, 10);
              const progress = lampIndex / 4; // 0=near camera, 1=near castle
              const xOffset = 0.18 + progress * 0.17 + 0.015;
              const x = side === 'left' ? xOffset : 1 - xOffset;
              const y = 1 - (0.06 + progress * 0.20 + 0.02);
              
              // Tangled themes use gold/purple/pink color scheme
              const colors = side === 'left' ? 'gold' : 'pink';
              fireworkRef.current?.explode(x, y, 'fountain', colors);
            }
          }, null, 9.0 + i * 0.5);
        }
      });
      master.add(tlLamps, 9.0);
    }

    // ─ Z. Camera slow dolly + micro float + subtle orbit ──────────────────
    master.to(cameraRef.current, { scale: 1.16, duration: 12, ease: 'power1.inOut' }, 6.0);

    // Camera float
    const camFloat = gsap.timeline({ repeat: -1, yoyo: true });
    camFloat.to(cameraRef.current, { y: '-0.7%', duration: 4, ease: 'sine.inOut' });
    master.add(camFloat, 3.0);

    // Camera subtle orbit
    const camOrbit = gsap.timeline({ repeat: -1, yoyo: true });
    camOrbit.to(cameraRef.current, { x: '0.6%', duration: 6, ease: 'sine.inOut' });
    master.add(camOrbit, 4.0);

    // ─ K. Princess reaches center — MAJOR CELEBRATION ──────────────────────
    master.call(() => {
      // Stop background, launch grand celebration
      fireworkRef.current?.stopBackground();
      fireworkRef.current?.celebrate();
    }, null, 15.0);

    // 360° orbit simulation — slow rotation of entire scene
    master.to(cameraRef.current, {
      rotationY: 6,
      rotationX: 1,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
    }, 15.0);

    // Additional celebration fireworks waves
    master.call(() => fireworkRef.current?.celebrate(), null, 18.0);
    master.call(() => {
      fireworkRef.current?.launch(0.5, 0.1, 'heart', 'rose');
      fireworkRef.current?.launch(0.3, 0.08, 'heart', 'pink');
      fireworkRef.current?.launch(0.7, 0.08, 'heart', 'pink');
    }, null, 20.5);

    // ─ L. Title cards ──────────────────────────────────────────────────────
    // "✨ Happy Birthday ✨"
    master.fromTo(
      titleRef.current,
      { opacity: 0, y: 28, scale: 0.88, filter: 'blur(12px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' },
      16.0
    );

    // Name — massive golden
    master.fromTo(
      nameRef.current,
      { opacity: 0, y: 20, scale: 0.92, filter: 'blur(10px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' },
      18.0
    );

    // Subtitle
    master.fromTo(
      subtitleRef.current,
      { opacity: 0, y: 14, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out' },
      20.0
    );

    // Titles remain for ~3s then fade quickly
    master.to(
      [titleRef.current, nameRef.current, subtitleRef.current],
      { opacity: 0, y: -14, filter: 'blur(8px)', duration: 1.5, ease: 'power2.inOut', stagger: 0.2 },
      24.0
    );

    // ─ M. Navigate to Cake scene 2s after titles fade ─────────
    master.call(() => {
      sceneManager.complete({
        nextRoute: '/cake',
        message: '🌸\nEvery princess deserves a story.\n\nYours is only beginning.',
        transitionDelay: 3000,
      });
    }, null, 27.0);

    return master;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    // Set initial door 3D states
    gsap.set(doorLeftRef.current,  { rotateY: 0, transformOrigin: '0% 50%' });
    gsap.set(doorRightRef.current, { rotateY: 0, transformOrigin: '100% 50%' });

    const tl = buildTimeline();
    tl?.play();

    const handleVisibility = () => {
      if (document.hidden) {
        masterRef.current?.pause();
        fireworkRef.current?.stopBackground();
      } else {
        masterRef.current?.play();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      masterRef.current?.kill();
      fireworkRef.current?.stopBackground();
    };
  }, [buildTimeline]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={sceneRef}
      className="relative w-full h-full overflow-hidden bg-night-950"
      aria-label="Princess cinematic entrance"
    >
      {/*
       * Camera Wrapper — ALL scene content lives here.
       * GSAP animates scale/position for dolly + orbit effect.
       */}
      <div
        ref={cameraRef}
        className="absolute inset-0 w-[105%] h-[105%] -left-[2.5%] -top-[2.5%]"
        style={{ opacity: 0, willChange: 'transform, opacity', transformStyle: 'preserve-3d' }}
      >
        {/* ─ Z0: Cosmic Background ─────────────────────────────────────────── */}
        <CinematicNebula />
        <CinematicStars />
        <CinematicParticles />

        {/* ─ Z1: Castle (with moon, aurora, torches, banners) ──────────────── */}
        <CastleBackground />

        {/* ─ Z2: Royal Pathway (stone + red carpet + gold borders) ─────────── */}
        <RoyalPathway />

        {/* ─ Z2.5: Side trees flanking the pathway ─────────────────────────── */}
        <SideTrees />


        {/* ─ Z3: Moonlight Rim (cool backlight behind princess) ────────────── */}
        <MoonRimLight ref={moonRimRef} />

        {/* ─ Z4: God Rays (warm castle light shafts) ───────────────────────── */}
        <GodRays ref={godRaysRef} />

        {/* ─ Z5: Royal Horse Chariot ────────────────────────────────────────── */}
        <RoyalChariot
          ref={doorRightRef}
          doorLeftRef={doorLeftRef}
          lightLeakRef={lightLeakRef}
        />

        {/* Ambient fog at the carriage base */}
        <div ref={fogLeftRef} className="absolute pointer-events-none" style={{
          opacity: 0, width: '40%', height: '15%', top: '25%', left: '15%',
          background: 'radial-gradient(ellipse at center, rgba(255,220,190,0.45) 0%, transparent 70%)',
          filter: 'blur(20px)', zIndex: 6,
        }}/>
        <div ref={fogRightRef} className="absolute pointer-events-none" style={{
          opacity: 0, width: '40%', height: '15%', top: '25%', right: '15%',
          background: 'radial-gradient(ellipse at center, rgba(255,220,190,0.45) 0%, transparent 70%)',
          filter: 'blur(20px)', zIndex: 6,
        }}/>

        {/* Magic carriage particles */}
        <div ref={magicParticlesRef} className="absolute pointer-events-none" style={{
          top: '12%', left: '50%', transform: 'translateX(-50%)',
          width: 'clamp(320px, 45vw, 600px)', height: 'clamp(180px, 28vh, 380px)',
          zIndex: 7
        }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="magic-particle absolute rounded-full opacity-0" style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              backgroundColor: ['#fde68a','#fff176','#fbbf24','#ffffff','#ffc2d4','#f472b6'][Math.floor(Math.random()*6)],
              left: `${35 + Math.random() * 30}%`,
              top: `${25 + Math.random() * 50}%`,
              boxShadow: '0 0 8px currentColor',
            }}/>
          ))}
        </div>

        {/* ─ Z6: Pathway Lamps ─────────────────────────────────────────────── */}
        <PathwayLamps ref={lampsRef} />

        {/* ─ Z6.5: Cheering Crowd Silhouettes ───────────────────────────────── */}
        <CheeringCrowd />

        {/* ─ Z8: Fireflies ─────────────────────────────────────────────────── */}
        <SceneFireflies />

        {/* ─ Z9: Princess (silhouette + colour) ────────────────────────────── */}
        <PrincessCharacter
          ref={princessRef}
          silhouetteRef={silhouetteRef}
          bodyRef={princessBodyRef}
        />

        {/* ─ Z11: Petals ───────────────────────────────────────────────────── */}
        <PetalSystem ref={petalRef} />

        {/* ─ Z12: Fireworks Canvas ─────────────────────────────────────────── */}
        <FireworkCanvas ref={fireworkRef} />

        {/* ─ Z15: Birthday Title ───────────────────────────────────────────── */}
        <BirthdayTitle
          titleRef={titleRef}
          nameRef={nameRef}
          subtitleRef={subtitleRef}
          name={birthdayName}
        />
      </div>

      {/* ── Cinematic letterbox bars ──────────────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
        height: '7vh',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        zIndex: 20,
      }}/>
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: '7vh',
        background: 'linear-gradient(0deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
        zIndex: 20,
      }}/>
    </div>
  );
}

// ── Scene root ─────────────────────────────────────────────────────────────────

function PrincessEntranceScene() {
  return (
    <SceneWrapper sceneName="princess" className="bg-night-950">
      <PrincessEntranceContent />
    </SceneWrapper>
  );
}

export default PrincessEntranceScene;
