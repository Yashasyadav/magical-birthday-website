import gsap from 'gsap';
import soundManager from '@engine/SoundManager';
import sceneManager from '@engine/SceneManager';
import { SCENES } from '@constants/scenes';

class MemoryEngine {
  constructor() {
    this.timeline = null;
    this.exitTimeline = null;
  }

  /**
   * Stagger-animates all photo frames flying in from various sky directions.
   */
  animateWallEntrance(photoElements, clipElements, lineElement, onComplete) {
    this.timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Fade in the hanging clotheslines
    gsap.set(lineElement, { opacity: 0, scaleX: 0.8 });
    this.timeline.to(lineElement, {
      opacity: 0.25,
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.out'
    });

    // 2. Animate each photo flying in from different directions
    photoElements.forEach((el, idx) => {
      const clip = clipElements[idx];
      
      // Determine offscreen starting points based on index
      const startPositions = [
        { x: -500, y: -400, rot: -35 }, // Upper left
        { x: 200, y: -600, rot: 45 },   // Top center
        { x: 600, y: -300, rot: 25 },   // Upper right
        { x: -600, y: 300, rot: -45 },  // Left middle
        { x: -100, y: 600, rot: 15 },   // Bottom center
        { x: 500, y: 500, rot: -25 }    // Bottom right
      ];

      const start = startPositions[idx % startPositions.length];

      // Set initial values
      gsap.set(el, {
        x: start.x,
        y: start.y,
        rotation: start.rot,
        scale: 0.5,
        opacity: 0
      });
      gsap.set(clip, {
        scale: 0,
        opacity: 0
      });

      // Staggered flight timeline
      const delay = 0.5 + idx * 0.4;
      
      this.timeline.to(el, {
        x: 0,
        y: 0,
        rotation: (idx % 2 === 0 ? -4 : 4) + (idx * 0.5), // Ends in design rotation
        scale: 1,
        opacity: 1,
        duration: 1.8,
        ease: 'back.out(1.2)',
        onStart: () => {
          soundManager.playSfx('sparkle');
        }
      }, delay);

      // Clip snaps in place when photo finishes landing
      this.timeline.to(clip, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'elastic.out(1.2, 0.4)',
        onStart: () => {
          soundManager.playSfx('success');
        }
      }, delay + 1.2);
    });

    return this.timeline;
  }

  /**
   * Triggers the beautiful emotional exit sequence:
   * Photos glow, lift from strings, dissolve into stars, and final photo turns into paper airplane.
   */
  animateWallExit(photoElements, clipElements, airplaneElement, lineElement, onComplete) {
    this.exitTimeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    // 1. Softly fade out hanging lines and clips
    this.exitTimeline.to(lineElement, { opacity: 0, duration: 1.0 });
    this.exitTimeline.to(clipElements, { scale: 0, opacity: 0, duration: 0.8 }, '-=0.8');

    // 2. Photos lift, glow, transform and fly upward one-by-one
    photoElements.forEach((el, idx) => {
      const isLast = idx === photoElements.length - 1;
      const delay = idx * 0.45;

      if (!isLast) {
        // Floating photo lifts, glows and flies into sky stars
        this.exitTimeline.to(el, {
          y: -20,
          boxShadow: '0 0 40px rgba(251, 191, 36, 0.9)',
          duration: 0.8,
          ease: 'power2.out',
          onStart: () => {
            soundManager.playSfx('magicWand');
          }
        }, delay);

        this.exitTimeline.to(el, {
          scale: 0.2,
          y: -600,
          x: `+=${(Math.random() * 200 - 100)}`,
          opacity: 0,
          rotation: Math.random() * 90 - 45,
          duration: 1.6,
          ease: 'power2.in'
        }, delay + 0.6);
      } else {
        // The last photo transforms into a glowing paper airplane
        this.exitTimeline.to(el, {
          y: -10,
          scale: 1.1,
          boxShadow: '0 0 60px rgba(251, 191, 36, 1)',
          duration: 1.0,
          ease: 'power3.out'
        }, delay);

        // Fade photo out while folding paper airplane in
        this.exitTimeline.to(el, {
          scale: 0,
          opacity: 0,
          rotation: 180,
          duration: 1.0,
          ease: 'power3.in'
        }, delay + 0.8);

        gsap.set(airplaneElement, { scale: 0.1, opacity: 0, x: 0, y: 0, rotation: -30 });
        this.exitTimeline.to(airplaneElement, {
          scale: 1.2,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.5)',
          onStart: () => {
            soundManager.playSfx('success');
          }
        }, delay + 1.2);

        // Airplane flies off screen
        this.exitTimeline.to(airplaneElement, {
          x: 700,
          y: -500,
          scale: 0.3,
          rotation: 0,
          opacity: 0,
          duration: 2.0,
          ease: 'power2.in'
        }, delay + 2.0);
      }
    });

    return this.exitTimeline;
  }
}

export const memoryEngine = new MemoryEngine();
export default memoryEngine;
