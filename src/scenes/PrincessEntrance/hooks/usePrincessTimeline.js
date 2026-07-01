/**
 * usePrincessTimeline.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Master GSAP timeline for Phase 4: Princess Entrance.
 *
 * Nested timeline structure:
 *   masterTL
 *     ├─ tlDoors       — Castle doors open, light leak, fog escape
 *     ├─ tlSilhouette  — Princess silhouette appears, pause, camera zoom
 *     ├─ tlReveal      — Silhouette lifts, princess fully revealed
 *     ├─ tlWalk        — Princess walks from door to center
 *     ├─ tlLamps       — Pathway lamps illuminate one by one
 *     ├─ tlCamera      — Cinematic dolly-forward + micro float
 *     └─ tlTitle       — Birthday title fade in/out
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useRef, useCallback } from 'react';
import { useAnimation } from '@hooks/useAnimation';
import gsap from 'gsap';

/**
 * @param {object} refs - Object of { doors, lightLeak, fog, particles, silhouette,
 *   princess, walk, lamps, camera, godRays, title, titleName, scene }
 * @param {object} options
 * @param {boolean} [options.reducedMotion=false]
 * @param {Function} [options.onComplete]
 */
export function usePrincessTimeline(refs, options = {}) {
  const { createTimeline, killTimelines } = useAnimation('princess-entrance');
  const masterRef = useRef(null);

  const buildTimeline = useCallback(() => {
    // Clean up any existing timeline
    killTimelines();
    if (masterRef.current) {
      masterRef.current.kill();
    }

    const {
      doorLeft, doorRight, lightLeak, fogLeft, fogRight,
      magicParticles, silhouette, princess, princessBody,
      lampsRef, cameraWrap, godRays, moonRim,
      title, titleName, dustParticles,
    } = refs;

    const prefersReducedMotion = options.reducedMotion ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Instant reveal for accessibility
      gsap.set([princess?.current, title?.current, titleName?.current], { opacity: 1 });
      return;
    }

    // ── Master timeline ──────────────────────────────────────────────────────
    const master = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: options.onComplete,
    });
    masterRef.current = master;

    // ── 1. Scene fade-in ─────────────────────────────────────────────────────
    master.fromTo(
      cameraWrap?.current,
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power2.inOut' },
      0
    );

    // ── 2. Castle Doors timeline ─────────────────────────────────────────────
    const tlDoors = gsap.timeline();

    // Doors slowly open: left door swings left, right door swings right
    tlDoors.fromTo(
      doorLeft?.current,
      { rotateY: 0, transformOrigin: 'left center' },
      { rotateY: -75, duration: 4, ease: 'power3.inOut', transformOrigin: 'left center' },
      0
    ).fromTo(
      doorRight?.current,
      { rotateY: 0, transformOrigin: 'right center' },
      { rotateY: 75, duration: 4, ease: 'power3.inOut', transformOrigin: 'right center' },
      0
    );

    // Light leak emerges as doors open
    tlDoors.fromTo(
      lightLeak?.current,
      { opacity: 0, scaleX: 0.2 },
      { opacity: 1, scaleX: 1, duration: 3, ease: 'power2.out' },
      0.5
    );

    // Fog drifts out slowly
    if (fogLeft?.current) {
      tlDoors.fromTo(
        fogLeft.current,
        { opacity: 0, x: 0, scaleX: 0.5 },
        { opacity: 0.6, x: -80, scaleX: 2, duration: 5, ease: 'power1.out' },
        1
      );
    }
    if (fogRight?.current) {
      tlDoors.fromTo(
        fogRight.current,
        { opacity: 0, x: 0, scaleX: 0.5 },
        { opacity: 0.6, x: 80, scaleX: 2, duration: 5, ease: 'power1.out' },
        1
      );
    }

    // Magic particles float outward from doorway
    if (magicParticles?.current) {
      const particles = magicParticles.current.querySelectorAll('.magic-particle');
      tlDoors.fromTo(
        particles,
        { opacity: 0, scale: 0, y: 0 },
        {
          opacity: 1, scale: 1,
          y: () => gsap.utils.random(-60, -20),
          x: () => gsap.utils.random(-40, 40),
          duration: 2,
          stagger: { each: 0.15, from: 'center' },
          ease: 'back.out(1.5)',
        },
        1.5
      );
    }

    master.add(tlDoors, 0.5);

    // ── 3. Silhouette Appearance ─────────────────────────────────────────────
    const tlSilhouette = gsap.timeline();

    // Princess appears as pure dark silhouette in the doorway glow
    tlSilhouette.fromTo(
      silhouette?.current,
      { opacity: 0, scale: 0.85, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 2.5, ease: 'power2.out' },
      0
    );

    // Pause — hold silhouette beat
    tlSilhouette.to({}, { duration: 2.5 });

    // Camera gently zooms in on silhouette
    tlSilhouette.to(
      cameraWrap?.current,
      { scale: 1.04, duration: 4, ease: 'power1.inOut' },
      0
    );

    master.add(tlSilhouette, 3.5);

    // ── 4. Reveal — silhouette becomes colour ────────────────────────────────
    const tlReveal = gsap.timeline();

    // Silhouette fades out as princess fades in
    tlReveal.to(
      silhouette?.current,
      { opacity: 0, duration: 2, ease: 'power2.inOut' },
      0
    ).fromTo(
      princess?.current,
      { opacity: 0, scale: 0.95, filter: 'brightness(2) blur(8px)' },
      { opacity: 1, scale: 1, filter: 'brightness(1) blur(0px)', duration: 3, ease: 'power2.out' },
      0.3
    );

    // God rays bloom in
    if (godRays?.current) {
      tlReveal.fromTo(
        godRays.current,
        { opacity: 0 },
        { opacity: 0.7, duration: 3, ease: 'power2.out' },
        0
      );
    }

    // Moonlight rim light
    if (moonRim?.current) {
      tlReveal.fromTo(
        moonRim.current,
        { opacity: 0 },
        { opacity: 1, duration: 2.5, ease: 'power2.out' },
        0.5
      );
    }

    master.add(tlReveal, 8.5);

    // ── 5. First Step ────────────────────────────────────────────────────────
    // Princess takes her first deliberate step forward
    const tlFirstStep = gsap.timeline();
    tlFirstStep.to(
      princess?.current,
      { y: '-=8', duration: 0.6, ease: 'power2.out' },
      0
    ).to(
      princess?.current,
      { y: '+=4', duration: 0.4, ease: 'bounce.out' },
      0.6
    );

    master.add(tlFirstStep, 12);

    // ── 6. Walk sequence — princess walks from door to center ────────────────
    const tlWalk = gsap.timeline();

    // Princess walks forward (toward camera) — scale up and move down
    tlWalk.to(
      princess?.current,
      {
        y: '+=22vh',    // Walks down the path toward camera
        scale: 1.22,    // Gets larger as she approaches
        duration: 12,
        ease: 'none',
      },
      0
    );

    // Gentle sway / floating while walking
    if (princessBody?.current) {
      const walkBob = gsap.timeline({ repeat: -1, yoyo: true });
      walkBob.to(princessBody.current, { y: -8, duration: 0.65, ease: 'sine.inOut' });
      tlWalk.add(walkBob, 0);
    }

    master.add(tlWalk, 12.5);

    // ── 7. Lamp sequence — lamps light up one by one as she passes ───────────
    const tlLamps = gsap.timeline();

    if (lampsRef?.current) {
      const lampElements = lampsRef.current.querySelectorAll('.pathway-lamp');
      const lampGlows    = lampsRef.current.querySelectorAll('.lamp-glow');

      lampElements.forEach((lamp, i) => {
        // Each lamp lights up sequentially starting from castle (last index) to camera (index 0)
        const delay = i * 1.4;
        tlLamps.fromTo(
          lamp,
          { '--lamp-opacity': 0 },
          { '--lamp-opacity': 1, duration: 0.8, ease: 'power2.out' },
          delay
        );
        if (lampGlows[i]) {
          tlLamps.fromTo(
            lampGlows[i],
            { opacity: 0, scale: 0.3 },
            {
              opacity: 1, scale: 1, duration: 1.2, ease: 'elastic.out(1, 0.4)',
              // Golden sparkles pulse after lighting
            },
            delay
          ).to(
            lampGlows[i],
            { opacity: 0.7, scale: 0.9, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 },
            delay + 1.2
          );
        }
      });
    }

    master.add(tlLamps, 13);

    // ── 8. Camera dolly ──────────────────────────────────────────────────────
    const tlCamera = gsap.timeline();

    // Very slow dolly forward (zoom in)
    tlCamera.to(
      cameraWrap?.current,
      { scale: 1.12, duration: 18, ease: 'power1.inOut' },
      0
    );

    // Micro floating motion on camera — very gentle vertical drift
    const cameraFloat = gsap.timeline({ repeat: -1, yoyo: true });
    cameraFloat.to(cameraWrap?.current, { y: '-0.5%', duration: 6, ease: 'sine.inOut' });
    tlCamera.add(cameraFloat, 0);

    // Very subtle horizontal drift (orbit feel)
    const cameraOrbit = gsap.timeline({ repeat: -1, yoyo: true });
    cameraOrbit.to(cameraWrap?.current, { x: '0.4%', duration: 9, ease: 'sine.inOut' });
    tlCamera.add(cameraOrbit, 3);

    master.add(tlCamera, 4);

    // ── 9. Title card ────────────────────────────────────────────────────────
    const tlTitle = gsap.timeline();

    if (title?.current) {
      // "Happiest Birthday" appears
      tlTitle.fromTo(
        title.current,
        { opacity: 0, y: 20, scale: 0.92, filter: 'blur(10px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 3, ease: 'power3.out' },
        0
      );
    }

    if (titleName?.current) {
      // Name appears after a pause
      tlTitle.fromTo(
        titleName.current,
        { opacity: 0, y: 14, filter: 'blur(8px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 2.5, ease: 'power3.out' },
        2
      );
    }

    // Titles remain, then fade
    tlTitle.to([title?.current, titleName?.current], {
      opacity: 0,
      y: -10,
      filter: 'blur(6px)',
      duration: 2.5,
      ease: 'power2.inOut',
      stagger: 0.3,
    }, 8);

    master.add(tlTitle, 24); // Fires when she reaches center

    return master;
  }, [refs, options.reducedMotion, options.onComplete, createTimeline, killTimelines]);

  const play = useCallback(() => {
    if (!masterRef.current) {
      buildTimeline();
    }
    masterRef.current?.play();
  }, [buildTimeline]);

  const pause = useCallback(() => {
    masterRef.current?.pause();
  }, []);

  const kill = useCallback(() => {
    masterRef.current?.kill();
    masterRef.current = null;
    killTimelines();
  }, [killTimelines]);

  return { buildTimeline, play, pause, kill, masterRef };
}
