/**
 * WelcomeScene / FireworksScene
 * ─────────────────────────────────────────────────────────────────────────────
 * PHASE 4 — Epic Fireworks & Celebration Reveal.
 *
 * Implements the full cinematic sequence:
 *   1. Auth success transition (bloom → black fade)
 *   2. Moment of silence
 *   3. Orchestra rise / launch cue
 *   4. Wide sky camera tilt + fireworks spectacular
 *   5. Vortex particles swirl in center
 *   6. Golden "Happy Birthday" drawn stroke-by-stroke with live sparkling trails
 *   7. Pink-gold "Bhavani" drawn stroke-by-stroke
 *   8. Falling confetti, rose petals, and glitter rain
 *   9. Slow cinematic camera orbit tilt
 *  10. Background fireworks celebration
 *  11. Fade out to soft glow hold state
 *  12. Notify scene manager
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect } from 'react';
import SceneWrapper from '@components/layout/SceneWrapper';
import { useApp } from '@context/AppContext';
import { BIRTHDAY_GIRL_NAME } from '@config/authentication';
import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';
import soundManager from '@engine/SoundManager';
import gsap from 'gsap';

// Reused Background Effects
import CinematicStars from '@components/effects/background/CinematicStars';
import CinematicNebula from '@components/effects/background/CinematicNebula';
import CinematicParticles from '@components/effects/background/CinematicParticles';

// Local Custom Components
import SkyEnvironment from './components/SkyEnvironment';
import CameraController from './components/CameraController';
import FireworksManager from './components/FireworksManager';
import ParticleSystem from './components/ParticleSystem';
import TextReveal from './components/TextReveal';
import AudioManager from './components/AudioManager';
import SceneTransition from './components/SceneTransition';
import { fireworksEngine, FIREWORKS_STATE } from './engine/FireworksEngine';

function FireworksSceneContent() {
  const { user } = useApp();
  const birthdayName = user?.name || user?.displayName || BIRTHDAY_GIRL_NAME;

  // Refs
  const transitionRef = useRef(null);
  const cameraRef = useRef(null);
  const skyColorFlashRef = useRef(null);
  const fireworksRef = useRef(null);
  const particlesRef = useRef(null);
  const textRevealRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // ── Master Orchestration Timeline ───────────────────────────────────────
    const masterTimeline = gsap.timeline();

    // STEP 1: Fade out Auth SUCCESS bloom to pitch black
    masterTimeline.add(
      gsap.delayedCall(0, () => {
        fireworksEngine.setStatus(FIREWORKS_STATE.FADE_IN);
        audioRef.current?.playTrack('Silence / Anticipation');
        transitionRef.current?.fadeToBlack(1.0);
        // Fade out previous auth tracks
        soundManager.stopMusic(1000);
      })
    );

    // STEP 2: Anticiption build in black screen
    masterTimeline.to({}, { duration: 0.5 });

    // STEP 3: Reveal deep starry sky, music swell starts
    masterTimeline.add(
      gsap.delayedCall(1.0, () => {
        fireworksEngine.setStatus(FIREWORKS_STATE.MUSIC_SWELL);
        audioRef.current?.playTrack('Deep Cinematic Orchestra Swell');
        transitionRef.current?.revealScene(1.5);
        
        // Play real background celebration music
        soundManager.preloadMusic('welcome');
        soundManager.playMusic('welcome', 2000);
      })
    );

    // STEP 4: First rocket launches from left and right
    masterTimeline.add(
      gsap.delayedCall(2.5, () => {
        fireworksEngine.setStatus(FIREWORKS_STATE.LAUNCH_FIRST);
        audioRef.current?.playSFX('Rocket Launch Whoosh (Distant)');
        
        // Launch initial side fireworks (clean scale)
        fireworksRef.current?.launch(0.18, 0.35, 'gold', 'peony', 1.0);
        fireworksRef.current?.launch(0.82, 0.32, 'purple', 'peony', 1.0);
        fireworksRef.current?.launch(0.5, 0.28, 'white', 'willow', 0.9);
      })
    );

    // STEP 5: Main firework show starts, camera tilt/dolly begins, start automated sky filling loop
    masterTimeline.add(
      gsap.delayedCall(3.5, () => {
        fireworksEngine.setStatus(FIREWORKS_STATE.SKY_EXPLOSION);
        audioRef.current?.playTrack('Epic Orchestral Theme / Choirs');
        cameraRef.current?.pushAndTilt(10); // faster push & tilt
        
        // Start background auto-burst loop at optimized rate for balanced magic
        fireworksRef.current?.startBackground(1100);

        // Parallel launches (with ~20% more fireworks)
        const intervals = [
          [0.35, 0.22, 'pink', 'butterfly', 1.0], // Left butterfly
          [0.65, 0.25, 'teal', 'butterfly', 1.0], // Right butterfly
          [0.5, 0.18, 'white', 'star', 1.1],
          [0.2, 0.3, 'gold', 'crackling', 0.9],
          [0.8, 0.28, 'purple', 'peony', 1.0],
        ];

        intervals.forEach(([x, y, col, type, scale], i) => {
          setTimeout(() => {
            audioRef.current?.playSFX('Firework Burst & Crackle');
            fireworksRef.current?.launch(x, y, col, type, scale);
          }, i * 450);
        });
      })
    );

    // STEP 6: Particles gather in the center (Vortex swirl)
    masterTimeline.add(
      gsap.delayedCall(6.5, () => {
        fireworksEngine.setStatus(FIREWORKS_STATE.GATHER_PARTICLES);
        audioRef.current?.playSFX('Magical Vortex Swirl');
        
        // Emit vortex particles from the center
        particlesRef.current?.emitVortex(0.5, 0.4, 40);
        soundManager.playSfx('sparkle');
      })
    );

    // STEP 7: Text Reveal (Happy Birthday Bhavani drawn stroke-by-stroke)
    masterTimeline.add(
      gsap.delayedCall(7.5, () => {
        fireworksEngine.setStatus(FIREWORKS_STATE.TEXT_HAPPY_BIRTHDAY);
        audioRef.current?.playTrack('Emotional & Uplifting Celebration Theme');
        audioRef.current?.playSFX('Sparkling Chime Sound');
        
        // Start continuous rain & petal fall
        particlesRef.current?.startGlitterRain();
        particlesRef.current?.startPetalFall();
        
        // Play real text chime SFX
        soundManager.playSfx('magicWand');

        textRevealRef.current?.animateReveal(() => {
          // Reveal done callback
          fireworksEngine.setStatus(FIREWORKS_STATE.HOLD);
        });
      })
    );

    // STEP 8: Celebration bursts behind text for depth (no heart shapes)
    masterTimeline.add(
      gsap.delayedCall(10.0, () => {
        fireworksEngine.setStatus(FIREWORKS_STATE.ADDITIONAL_BURSTS);
        
        // Climax celebration bursts (restored/refined with ~20% more bursts)
        const finalWaves = [
          [0.25, 0.18, 'pink', 'butterfly', 1.0], // Side butterfly
          [0.75, 0.18, 'purple', 'butterfly', 1.0], // Side butterfly
          [0.5, 0.08, 'gold', 'butterfly', 1.2], // Huge gold butterfly in center!
          [0.15, 0.25, 'teal', 'crackling', 0.9],
          [0.85, 0.25, 'purple', 'willow', 1.0],
        ];

        finalWaves.forEach(([x, y, col, type, scale], i) => {
          setTimeout(() => {
            audioRef.current?.playSFX('Celebration Firework Burst');
            fireworksRef.current?.launch(x, y, col, type, scale);
          }, i * 450);
        });
      })
    );

    // STEP 9: Transition out to soft glow hold state
    masterTimeline.add(
      gsap.delayedCall(13.5, () => {
        audioRef.current?.playTrack('Sustained Soft Choir & Chimes');
        particlesRef.current?.stopGlitterRain();
        particlesRef.current?.stopPetalFall();
        
        // Stop background automated sky filling loop
        fireworksRef.current?.stopBackground();

        // Slow zoom settle
        cameraRef.current?.settle(4);

        // Fade text and show
        textRevealRef.current?.fadeOut(1.5);
        
        // Gracefully fade out background celebration fanfare
        soundManager.stopMusic(1500);
      })
    );

    // STEP 10: Scene Complete and trigger Navigation
    masterTimeline.add(
      gsap.delayedCall(15.0, () => {
        fireworksEngine.completeScene();
      })
    );

    return () => {
      masterTimeline.kill();
    };
  }, [birthdayName]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      
      {/* Cinematic Transition Overlay */}
      <SceneTransition ref={transitionRef} />

      {/* Cinematic Camera rig */}
      <CameraController ref={cameraRef}>
        
        {/* Layered Sky, Terrian & Water reflection backdrop */}
        <SkyEnvironment skyColorFlashRef={skyColorFlashRef}>
          <CinematicStars />
          <CinematicNebula />
          <CinematicParticles type="fairy-dust" count={30} />
        </SkyEnvironment>

        {/* Canvas Physics Emitter Layer */}
        <FireworksManager ref={fireworksRef} skyColorFlashRef={skyColorFlashRef} />

        {/* Canvas Particle Overlay (Confetti, Rain, Vortex, Petals) */}
        <ParticleSystem ref={particlesRef} />

        {/* Calligraphic Script text layer drawn stroke-by-stroke */}
        <TextReveal ref={textRevealRef} particleSystemRef={particlesRef} />

      </CameraController>

      {/* Audio Mixer Indicator & Logger */}
      <AudioManager ref={audioRef} />

    </div>
  );
}

function WelcomeScene() {
  return (
    <SceneWrapper sceneName="welcome" className="bg-[#04020a] overflow-hidden">
      <FireworksSceneContent />
    </SceneWrapper>
  );
}

export default WelcomeScene;
