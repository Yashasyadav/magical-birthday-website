/**
 * scenes/Loading/index.jsx
 * Loading scene — Cinematic Disney Loading Experience.
 * Architecture slot: DO NOT rename, move, or remove this file.
 */

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import SceneWrapper from '@components/layout/SceneWrapper';
import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';

// Loading Context & Engine
import { LoadingProvider, useLoadingContext } from './context/LoadingContext';

// Visual Components
import CinematicBackground from '@components/effects/background/CinematicBackground';
import CinematicNebula     from '@components/effects/background/CinematicNebula';
import CinematicStars      from '@components/effects/background/CinematicStars';
import CinematicParticles  from '@components/effects/background/CinematicParticles';
import LoadingLogo       from './components/LoadingLogo';
import LoadingMessages   from './components/LoadingMessages';
import LoadingProgress   from './components/LoadingProgress';

function LoadingContent() {
  const { isComplete } = useLoadingContext();
  const containerRef = useRef(null);
  const cameraDriftRef = useRef(null);

  // Initial fade-in and completion fade-out
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade-in
      gsap.fromTo(containerRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 2.5, ease: 'power2.inOut' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!isComplete) return;
    
    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1.5, 
        ease: 'power2.inOut',
        delay: 0.1,
        onComplete: () => {
          // Hand control to Authentication Scene automatically
          sceneManager.navigateTo(SCENES.AUTHENTICATION, { skipTransition: true });
        }
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, [isComplete]);

  // Subtle camera drift and ambient glow breathing
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Very subtle floating camera effect
      gsap.to(cameraDriftRef.current, {
        x: '1%',
        y: '1%',
        rotation: 0.5,
        scale: 1.02,
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    }, cameraDriftRef);
    
    return () => ctx.revert();
  }, []);

  // Performance optimization: Pause heavy animations when tab is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        gsap.globalTimeline.pause();
      } else {
        gsap.globalTimeline.play();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-night-950">
      
      {/* Camera Drift Container - Moves entire scene slightly */}
      <div ref={cameraDriftRef} className="absolute inset-0 w-[105%] h-[105%] -left-[2.5%] -top-[2.5%]">
        {/* Background Layers (Z-Index 0-3) */}
        <CinematicBackground />
        <CinematicNebula />
        <CinematicStars />
        <CinematicParticles />
      </div>

      {/* Foreground Content (Z-Index 10+) */}
      <div className="relative z-10 flex flex-col items-center w-full px-6 max-w-lg text-center">
        <LoadingLogo />
        <LoadingMessages />
        <LoadingProgress />
      </div>
    </div>
  );
}

function LoadingScene() {
  return (
    <SceneWrapper sceneName="loading">
      <LoadingProvider>
        <LoadingContent />
      </LoadingProvider>
    </SceneWrapper>
  );
}

export default LoadingScene;
