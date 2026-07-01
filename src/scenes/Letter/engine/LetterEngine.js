import gsap from 'gsap';
import soundManager from '@engine/SoundManager';

class LetterEngine {
  constructor() {
    this.timeline = null;
    this.writingTl = null;
    this.ambientSwayTl = null;
  }

  // 1. Envelope arrives from above the screen like a real object
  animateEnvelopeArrival(elements, callbacks = {}) {
    const { envelope, shadow, goldenSpotlight, starsWrapper } = elements;
    const { onComplete } = callbacks;

    if (this.timeline) this.timeline.kill();
    this.stopAmbientSway();

    this.timeline = gsap.timeline({ onComplete });

    // Initial setup: start off-screen high up, rotated, and scaled down
    gsap.set(envelope, { 
      y: -window.innerHeight - 200, 
      x: -50,
      rotationZ: -18, 
      rotationX: 25, 
      rotationY: 10,
      opacity: 0,
      scale: 0.75
    });

    if (shadow) {
      gsap.set(shadow, { scale: 0.15, opacity: 0, filter: 'blur(20px)', y: 80 });
    }

    // A. Warm Golden Light appears first (Spotlight flare)
    if (goldenSpotlight) {
      gsap.set(goldenSpotlight, { scale: 0, opacity: 0, y: -100 });
      this.timeline.to(goldenSpotlight, {
        scale: 1,
        opacity: 0.95,
        y: -50,
        duration: 2.2,
        ease: 'power2.out',
        onStart: () => {
          soundManager.playSfx('magicWand');
        }
      }, 0);
    }

    // B. Stars become slightly brighter & screen darkens (done in FriendshipLetterScene via class or direct timeline)
    if (starsWrapper) {
      this.timeline.to(starsWrapper, {
        filter: 'brightness(1.5) drop-shadow(0 0 3px rgba(255,255,255,0.5))',
        opacity: 1,
        duration: 2.2,
        ease: 'power2.out'
      }, 0);
    }

    // C. Wind whoosh sound as the descent starts
    this.timeline.add(() => {
      soundManager.playSfx('transitionWhoosh');
    }, 1.8);

    // D. Envelope slowly emerges from the light and sways downward
    this.timeline.to(envelope, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 4.2,
      ease: 'power2.out'
    }, 2.0);

    // Lateral sway/drift to simulate air resistance
    this.timeline.to(envelope, {
      x: 45,
      rotationZ: 8,
      rotationY: -5,
      duration: 1.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1
    }, 2.4);

    this.timeline.to(envelope, {
      x: -30,
      rotationZ: -6,
      rotationY: 4,
      duration: 1.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 0
    }, 4.0);

    // E. Landing Impact & Tiny Bounce (Paper compresses, shadow reacts)
    // Settle / Landing compression
    this.timeline.to(envelope, {
      y: 16,
      scaleY: 0.92,
      scaleX: 1.06,
      rotationX: -10,
      rotationZ: -1.5,
      duration: 0.28,
      ease: 'power1.in',
      onComplete: () => {
        soundManager.playSfx('success'); // Land soft chime
      }
    }, 6.2);

    // Rebound
    this.timeline.to(envelope, {
      y: -10,
      scaleY: 1.03,
      scaleX: 0.97,
      rotationX: 8,
      rotationZ: 1,
      duration: 0.32,
      ease: 'power1.out'
    }, 6.48);

    // Final settle
    this.timeline.to(envelope, {
      y: 0,
      scaleY: 1,
      scaleX: 1,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      x: 0,
      duration: 1.4,
      ease: 'elastic.out(1.1, 0.45)'
    }, 6.8);

    // F. Shadow synchronization (Reacts to descent, landing, and compression)
    if (shadow) {
      this.timeline.to(shadow, {
        scale: 0.95,
        opacity: 0.4,
        y: 40,
        filter: 'blur(10px)',
        duration: 4.2,
        ease: 'power2.out'
      }, 2.0);

      this.timeline.to(shadow, {
        scale: 1.12,
        opacity: 0.65,
        filter: 'blur(5px)',
        y: 10,
        duration: 0.28,
        ease: 'power1.in'
      }, 6.2);

      this.timeline.to(shadow, {
        scale: 0.88,
        opacity: 0.35,
        filter: 'blur(12px)',
        y: 45,
        duration: 0.32,
        ease: 'power1.out'
      }, 6.48);

      this.timeline.to(shadow, {
        scale: 1.0,
        opacity: 0.48,
        filter: 'blur(8px)',
        y: 35,
        duration: 1.4,
        ease: 'elastic.out(1.1, 0.45)'
      }, 6.8);
    }

    // Start slow handheld-like ambient sway once settled
    this.timeline.add(() => {
      this.startAmbientSway(envelope, shadow);
    });
  }

  startAmbientSway(envelope, shadow) {
    if (this.ambientSwayTl) this.ambientSwayTl.kill();
    
    this.ambientSwayTl = gsap.timeline({ repeat: -1, yoyo: true });
    
    this.ambientSwayTl.to(envelope, {
      y: '+=8',
      rotationZ: 0.7,
      rotationX: 0.5,
      duration: 4.0,
      ease: 'sine.inOut'
    }, 0);

    if (shadow) {
      this.ambientSwayTl.to(shadow, {
        scale: 0.96,
        opacity: 0.42,
        duration: 4.0,
        ease: 'sine.inOut'
      }, 0);
    }
  }

  stopAmbientSway() {
    if (this.ambientSwayTl) {
      this.ambientSwayTl.kill();
      this.ambientSwayTl = null;
    }
  }

  // 2. Sequential Flap Opening with double-hinge bending & moving shadows
  animateEnvelopeFlaps(elements, callbacks = {}) {
    const { 
      topFlapBase, topFlapTip, 
      leftFlapBase, leftFlapTip, 
      rightFlapBase, rightFlapTip, 
      bottomFlapBase, bottomFlapTip 
    } = elements;
    const { onComplete } = callbacks;

    this.stopAmbientSway();

    if (this.timeline) this.timeline.kill();
    this.timeline = gsap.timeline({ onComplete });

    // Step 1: Top flap opens slowly (with secondary bending tip)
    this.timeline.to(topFlapBase, {
      rotateX: -160,
      duration: 1.9,
      ease: 'power2.inOut',
      onStart: () => {
        soundManager.playSfx('pageFlip'); // Rustle
      }
    }, 0);
    
    this.timeline.to(topFlapTip, {
      rotateX: -20, // Bends backwards as it lifts
      duration: 1.0,
      ease: 'power2.in'
    }, 0.1);

    this.timeline.to(topFlapTip, {
      rotateX: 0, // Snaps straight as it settles open
      duration: 0.9,
      ease: 'back.out(1.5)'
    }, 1.1);

    // Step 2: Left flap unfolds
    this.timeline.to(leftFlapBase, {
      rotateY: -150,
      duration: 1.7,
      ease: 'power2.inOut',
      onStart: () => {
        soundManager.playSfx('pageFlip');
      }
    }, 1.6);

    this.timeline.to(leftFlapTip, {
      rotateY: -18,
      duration: 0.9,
      ease: 'power2.in'
    }, 1.7);

    this.timeline.to(leftFlapTip, {
      rotateY: 0,
      duration: 0.8,
      ease: 'back.out(1.4)'
    }, 2.6);

    // Step 3: Right flap unfolds
    this.timeline.to(rightFlapBase, {
      rotateY: 150,
      duration: 1.7,
      ease: 'power2.inOut',
      onStart: () => {
        soundManager.playSfx('pageFlip');
      }
    }, 2.8);

    this.timeline.to(rightFlapTip, {
      rotateY: 18,
      duration: 0.9,
      ease: 'power2.in'
    }, 2.9);

    this.timeline.to(rightFlapTip, {
      rotateY: 0,
      duration: 0.8,
      ease: 'back.out(1.4)'
    }, 3.8);

    // Step 4: Bottom flap relaxes
    this.timeline.to(bottomFlapBase, {
      rotateX: 145,
      duration: 1.8,
      ease: 'power2.inOut',
      onStart: () => {
        soundManager.playSfx('pageFlip');
      }
    }, 4.2);

    this.timeline.to(bottomFlapTip, {
      rotateX: 15,
      duration: 0.9,
      ease: 'power2.in'
    }, 4.3);

    this.timeline.to(bottomFlapTip, {
      rotateX: 0,
      duration: 0.9,
      ease: 'back.out(1.3)'
    }, 5.2);
  }

  // 3. Two-Stage Letter Rise: emerges halfway with glowing light, pauses, then completes
  animateLetterRise(elements, callbacks = {}) {
    const { letter, envelope, letterGlow } = elements;
    const { onComplete } = callbacks;

    if (this.timeline) this.timeline.kill();
    this.timeline = gsap.timeline({ onComplete });

    // Step A: Pull envelope down slightly
    this.timeline.to(envelope, {
      y: 110,
      scale: 0.88,
      rotationX: -8,
      duration: 2.8,
      ease: 'power2.inOut'
    }, 0);

    // Step B: Stage 1 - Letter rises halfway, warm gold light leaks out
    gsap.set(letter, { y: '80vh', opacity: 0, scale: 0.85, rotationZ: -3 });
    if (letterGlow) {
      gsap.set(letterGlow, { opacity: 0, scale: 0.4 });
    }

    this.timeline.to(letter, {
      y: '32vh',
      opacity: 0.9,
      scale: 0.92,
      rotationZ: -1.5,
      duration: 2.2,
      ease: 'power3.out',
      onStart: () => {
        soundManager.playSfx('transitionWhoosh');
      }
    }, 0.2);

    if (letterGlow) {
      this.timeline.to(letterGlow, {
        opacity: 0.8,
        scale: 0.8,
        duration: 2.0,
        ease: 'power2.out'
      }, 0.4);
    }

    // Step C: Hold / Pause halfway to build intense anticipation (1.8 seconds)
    this.timeline.to(letter, {
      y: '28vh', // Very slow drift upwards during pause
      duration: 1.8,
      ease: 'sine.inOut'
    }, 2.4);

    // Step D: Stage 2 - Letter rises completely and centers
    this.timeline.to(letter, {
      y: 0,
      opacity: 1,
      scale: 0.96,
      rotationZ: 0,
      duration: 1.8,
      ease: 'power2.inOut',
      onStart: () => {
        soundManager.playSfx('sparkle');
      }
    }, 4.2);

    if (letterGlow) {
      this.timeline.to(letterGlow, {
        opacity: 1,
        scale: 1.0,
        duration: 1.8,
        ease: 'power2.inOut'
      }, 4.2);
    }
  }

  // 4. Coordinated slow unfolding of the letter folds one at a time
  animateLetterUnfolding(elements, callbacks = {}) {
    const { topFold, bottomFold, leftFlap, rightFlap, container } = elements;
    const { onComplete } = callbacks;

    if (this.timeline) this.timeline.kill();
    this.timeline = gsap.timeline({ onComplete });

    // Step A: Top fold lifts slowly
    this.timeline.to(topFold, {
      rotateX: 0,
      duration: 1.9,
      ease: 'power2.inOut',
      onStart: () => {
        soundManager.playSfx('pageFlip');
      }
    }, 0.5);

    // Step B: Bottom fold drops down slowly
    this.timeline.to(bottomFold, {
      rotateX: 0,
      duration: 1.9,
      ease: 'power2.inOut',
      onStart: () => {
        soundManager.playSfx('pageFlip');
      }
    }, 2.6);

    // Step C: Side flaps flatten outwards (Simultaneously with nice easing)
    this.timeline.to(leftFlap, {
      rotateY: 0,
      duration: 1.6,
      ease: 'power2.inOut',
      onStart: () => {
        soundManager.playSfx('pageFlip');
      }
    }, 4.8);

    this.timeline.to(rightFlap, {
      rotateY: 0,
      duration: 1.6,
      ease: 'power2.inOut'
    }, 4.8);

    // Step D: Settle and relax paper (springy scale drop and centering)
    this.timeline.to(container, {
      y: -10,
      scale: 1.0,
      duration: 1.6,
      ease: 'elastic.out(1.05, 0.55)'
    }, 6.2);
  }

  // 5. Fountain Pen flies in, circles, dips, and writes with human speeds & coordinates
  animatePenWriting(elements, callbacks = {}) {
    const { pen, lines, container, onWordWritten, onEmitSparkle } = elements;
    const { onComplete } = callbacks;

    if (this.writingTl) this.writingTl.kill();
    this.writingTl = gsap.timeline({ onComplete });

    // A. Pen flies in from top right, circles gracefully
    this.writingTl.fromTo(pen, 
      { opacity: 0, x: window.innerWidth * 0.4, y: -250, scale: 1.4, rotation: 35 },
      { 
        opacity: 1, 
        x: 120, 
        y: 60, 
        scale: 1.0, 
        rotation: 12,
        duration: 2.2, 
        ease: 'power2.out',
        onStart: () => {
          soundManager.playSfx('magicWand');
        }
      }
    );

    // B. Circle once in the air, leaving trail
    this.writingTl.to(pen, {
      x: '+=90',
      y: '+=20',
      rotation: 25,
      duration: 1.1,
      ease: 'sine.inOut'
    });
    this.writingTl.to(pen, {
      x: '-=90',
      y: '-=20',
      rotation: 8,
      duration: 1.1,
      ease: 'sine.inOut'
    });

    // C. Ink Dip Wait (Dip sound & shake at ink pot location)
    this.writingTl.to(pen, {
      x: 40,
      y: 80,
      rotation: -15,
      duration: 1.0,
      ease: 'power2.inOut',
      onComplete: () => {
        soundManager.playSfx('sparkle');
      }
    });
    this.writingTl.to(pen, {
      y: '+=10',
      duration: 0.4,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut'
    });

    // D. Write sentence by sentence, word by word using coordinate tracking
    lines.forEach((lineNode) => {
      if (!lineNode) return;

      const words = lineNode.querySelectorAll('span');
      if (words.length === 0) return;

      // Reveal the line container block
      this.writingTl.to(lineNode, {
        opacity: 1,
        y: 0,
        duration: 0.5
      }, '+=0.3');

      words.forEach((wordNode) => {
        // Human writing speeds (longer words take more time)
        const wordLength = wordNode.textContent.trim().length;
        const duration = Math.max(0.35, wordLength * 0.08);

        this.writingTl.add(() => {
          // Compute bounding rects relative to letter container
          const rect = wordNode.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          
          // Target position: Bottom-left of word represents pen point offset
          const targetX = rect.left - containerRect.left;
          const targetY = rect.top - containerRect.top + rect.height;

          // Animate the pen to the word position
          gsap.to(pen, {
            x: targetX,
            y: targetY,
            rotation: 18,
            duration: duration,
            ease: 'power1.inOut',
            onUpdate: () => {
              // Emit writing sparkles at pen tip (bottom left of pen container)
              const px = parseFloat(gsap.getProperty(pen, 'x'));
              const py = parseFloat(gsap.getProperty(pen, 'y'));
              
              if (onEmitSparkle) {
                onEmitSparkle(px, py);
              }
            }
          });

          // Stagger reveal of the word as pen crosses
          gsap.delayedCall(duration * 0.25, () => {
            if (onWordWritten) {
              onWordWritten(wordNode);
            }
          });
        }, '+=0.08'); // Human pause between words

        // Hold timeline progress for the word duration
        this.writingTl.to({}, { duration: duration });
      });

      // Lift pen between lines (secondary curve motion)
      this.writingTl.to(pen, {
        y: '-=25',
        rotation: 2,
        duration: 0.45,
        ease: 'power1.out'
      });
    });

    // E. Flight Out / Fade Out
    this.writingTl.to(pen, {
      x: window.innerWidth * 0.4,
      y: -200,
      opacity: 0,
      scale: 1.3,
      duration: 1.8,
      ease: 'power2.in',
      delay: 0.6
    });
  }

  pauseAll(paused) {
    if (this.timeline) this.timeline.paused(paused);
    if (this.writingTl) this.writingTl.paused(paused);
    if (this.ambientSwayTl) this.ambientSwayTl.paused(paused);
  }

  cleanup() {
    this.stopAmbientSway();
    if (this.timeline) this.timeline.kill();
    if (this.writingTl) this.writingTl.kill();
    this.timeline = null;
    this.writingTl = null;
  }
}

export default new LetterEngine();