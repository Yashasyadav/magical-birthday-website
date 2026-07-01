/**
 * scenes/Authentication/index.jsx
 * Phase 2 — Royal Gate Authentication Experience.
 * Orchestrates the master GSAP timeline and cinematic sequence.
 */

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import SceneWrapper from '@components/layout/SceneWrapper';

// Context & Engine
import { AuthenticationProvider, useAuthenticationContext } from './context/AuthenticationContext';
import { AUTH_STATE, authenticationEngine } from './engine/AuthenticationEngine';

// Components
import AuthenticationBackground from './components/AuthenticationBackground';
import RoyalDoors             from './components/RoyalDoors';
import QuestionCard           from './components/QuestionCard';
import AnswerInput            from './components/AnswerInput';
import RoyalButton            from './components/RoyalButton';
import ValidationMagic        from './components/ValidationMagic';

function AuthenticationContent() {
  const { state, submitAnswer } = useAuthenticationContext();
  const { status, config } = state;
  
  // Refs for orchestration
  const doorsRef = useRef(null);
  const questionRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const magicRef = useRef(null);
  const bloomRef = useRef(null);

  // Master sequence effect (runs once on mount to handle entrance)
  useEffect(() => {
    // We only run this if we are IDLE (initial load)
    if (status !== AUTH_STATE.IDLE) return;

    const masterTl = gsap.timeline();

    // 1. Loading fades away (handled by transition manager usually, but we ensure our elements fade in)
    // 2. Doors slowly materialize
    masterTl.to(doorsRef.current?.getContainer(), {
      opacity: 1,
      scale: 1,
      duration: 3,
      ease: 'power2.out',
      delay: 1
    });

    // 3. Move to dialogue state
    masterTl.call(() => {
      authenticationEngine.setStatus(AUTH_STATE.DIALOGUE);
    });
  }, [status]);

  // Watch for state changes to trigger sub-sequences
  useEffect(() => {
    if (status === AUTH_STATE.DIALOGUE) {
      // Play dialogue
      const qTl = questionRef.current?.playDialogue();
      if (qTl) {
        qTl.eventCallback('onComplete', () => {
          authenticationEngine.setStatus(AUTH_STATE.INPUT);
        });
      }
    } 
    else if (status === AUTH_STATE.INPUT) {
      // Reveal input and button
      gsap.to([inputRef.current?.getContainer(), buttonRef.current?.getContainer()], {
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'back.out(1.5)',
        onComplete: () => {
          inputRef.current?.focus();
        }
      });
    }
    else if (status === AUTH_STATE.ERROR) {
      // Wrong answer
      magicRef.current?.playError();
      inputRef.current?.playErrorShake();
      doorsRef.current?.playErrorFlash();
    }
    else if (status === AUTH_STATE.SUCCESS) {
      // Correct answer! The Grand Door Animation
      const unlockTl = gsap.timeline();
      
      // 1. Golden particles explode, inputs disappear
      unlockTl.call(() => magicRef.current?.playSuccess());
      unlockTl.to([inputRef.current?.getContainer(), buttonRef.current?.getContainer(), questionRef.current?.getContainer()], {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'power2.inOut'
      });

      // 2. Cinematic camera zoom begins (subtle)
      // We apply this to the 3D container holding the doors
      unlockTl.to('#door-3d-container', {
        scale: 1.15,
        duration: 12,
        ease: 'power1.inOut'
      }, 0);

      // 3. Magical seal glows, spins faster, then dissolves
      unlockTl.to(doorsRef.current?.getLock(), {
        scale: 1.3,
        rotation: 180,
        boxShadow: '0 0 60px rgba(251,191,36,1)',
        duration: 2,
        ease: 'power2.in'
      }, 0);
      
      // Energy flows to handles
      unlockTl.to(doorsRef.current?.getHandles(), {
        boxShadow: '0 0 30px rgba(251,191,36,1)',
        duration: 1.5,
        ease: 'sine.inOut'
      }, "<0.5");

      // Lock shatters/dissolves
      unlockTl.to(doorsRef.current?.getLock(), {
        opacity: 0,
        scale: 2,
        duration: 0.4,
        ease: 'power4.out'
      });

      // 4. Doors vibrate slightly before opening
      unlockTl.to(doorsRef.current?.getContainer(), {
        x: '+=2', y: '-=1',
        duration: 0.05,
        yoyo: true,
        repeat: 10,
        ease: 'rough({ strength: 1, points: 20 })' // rough ease simulation
      }, "-=0.2");

      // 5. Doors slowly separate (Physically believable heavy easing)
      unlockTl.to(doorsRef.current?.getGlow(), { opacity: 1, duration: 3 }, "<");
      
      unlockTl.to(doorsRef.current?.getLeftDoor(), {
        rotationY: -115,
        duration: 5,
        ease: 'power3.inOut' // Slow start, fast middle, very slow settle
      }, "+=0.2");
      
      unlockTl.to(doorsRef.current?.getRightDoor(), {
        rotationY: 115,
        duration: 5,
        ease: 'power3.inOut'
      }, "<");

      // 6. Cinematic Transition: Warm Golden Light -> Bloom -> God Rays -> White Fade
      // We animate a layered bloom container
      unlockTl.to(bloomRef.current, {
        opacity: 1,
        duration: 4,
        ease: 'power2.in',
      }, "-=2.5");

      // 7. Notify Scene Manager
      unlockTl.call(() => {
        authenticationEngine.completeScene();
      }, null, "+=1");
    }
  }, [status]);

  const handleSubmit = () => {
    const val = inputRef.current?.getValue();
    if (val) submitAnswer(val);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col items-center justify-center">
      <AuthenticationBackground />
      <ValidationMagic ref={magicRef} />
      
      {/* 3D Container for Doors */}
      <div id="door-3d-container" className="absolute inset-0 w-full h-full flex items-center justify-center transform-gpu" style={{ perspective: '1500px' }}>
        <RoyalDoors ref={doorsRef} />
      </div>

      {/* UI Overlay */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-xl px-6 pt-[10vh]">
        <QuestionCard ref={questionRef} dialogueSequence={config?.dialogueSequence || []} />
        <AnswerInput 
          ref={inputRef} 
          disabled={status === AUTH_STATE.VALIDATING || status === AUTH_STATE.SUCCESS} 
          onSubmit={submitAnswer} 
        />
        <RoyalButton 
          ref={buttonRef} 
          isLoading={status === AUTH_STATE.VALIDATING} 
          disabled={status === AUTH_STATE.SUCCESS} 
          onClick={handleSubmit} 
        />
      </div>

      {/* Cinematic Transition: Warm Golden Light -> God Rays -> White Fade */}
      <div 
        ref={bloomRef}
        className="absolute inset-0 w-full h-full opacity-0 pointer-events-none flex items-center justify-center"
        style={{ zIndex: 50 }}
      >
        {/* Warm Golden Core */}
        <div className="absolute inset-0 mix-blend-screen" style={{ background: 'radial-gradient(circle at center, #ffffff 0%, #fde68a 30%, transparent 80%)' }} />
        
        {/* God Rays (Animated via CSS rotation + GSAP opacity) */}
        <div className="absolute w-[200vw] h-[200vw] animate-spin [animation-duration:30s] mix-blend-overlay" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(251,191,36,0.8) 15deg, transparent 30deg, rgba(255,255,255,0.9) 45deg, transparent 60deg, rgba(251,191,36,0.8) 75deg, transparent 90deg, rgba(255,255,255,0.9) 105deg, transparent 120deg, rgba(251,191,36,0.8) 135deg, transparent 150deg, rgba(255,255,255,0.9) 165deg, transparent 180deg, rgba(251,191,36,0.8) 195deg, transparent 210deg, rgba(255,255,255,0.9) 225deg, transparent 240deg, rgba(251,191,36,0.8) 255deg, transparent 270deg, rgba(255,255,255,0.9) 285deg, transparent 300deg, rgba(251,191,36,0.8) 315deg, transparent 330deg, rgba(255,255,255,0.9) 345deg, transparent 360deg)' }} />

        {/* Pure White Fade Over Everything */}
        <div className="absolute inset-0 bg-white opacity-80 mix-blend-normal" />
      </div>
    </div>
  );
}

function AuthenticationScene() {
  return (
    <SceneWrapper sceneName="authentication" className="bg-night-950">
      <AuthenticationProvider>
        <AuthenticationContent />
      </AuthenticationProvider>
    </SceneWrapper>
  );
}

export default AuthenticationScene;
