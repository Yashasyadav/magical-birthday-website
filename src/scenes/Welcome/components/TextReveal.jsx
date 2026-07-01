/**
 * TextReveal.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders the celebratory text using SVG paths drawn stroke-by-stroke.
 * Emits sparkles at the drawing head coordinates in real-time by querying
 * getPointAtLength() on each active path.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';

// Beautiful stylized crown path
const CROWN_PATH = "M 500 130 L 485 155 L 450 145 L 470 175 L 530 175 L 550 145 L 515 155 Z";

// Stylized calligraphic flourishes
const FLOURISH_LEFT = "M 320 300 C 270 290, 230 320, 260 350 C 280 360, 310 330, 290 310 C 270 300, 250 310, 240 330";
const FLOURISH_RIGHT = "M 680 300 C 730 290, 770 320, 740 350 C 720 360, 690 330, 710 310 C 730 300, 750 310, 760 330";

// SVG path approximations for calligraphic script text
const HAPPY_BIRTHDAY_PATHS = [
  // H
  "M 370 210 L 370 260 M 370 235 L 395 235 M 395 210 L 395 260",
  // a
  "M 410 248 C 410 238, 422 238, 422 248 C 422 258, 410 258, 410 248 M 422 240 L 422 260",
  // p
  "M 432 240 L 432 270 M 432 240 C 442 238, 444 250, 432 252",
  // p
  "M 454 240 L 454 270 M 454 240 C 464 238, 466 250, 454 252",
  // y
  "M 476 240 C 476 254, 482 254, 486 240 M 486 240 L 480 270",
  
  // B
  "M 515 210 L 515 260 C 530 260, 532 245, 515 238 C 530 238, 532 210, 515 210",
  // i
  "M 545 240 L 545 260 M 545 230 A 1 1 0 1 1 545 231",
  // r
  "M 558 240 L 558 260 M 558 245 C 564 238, 568 240, 570 244",
  // t
  "M 582 220 L 582 260 M 576 235 L 588 235",
  // h
  "M 598 210 L 598 260 M 598 248 C 598 238, 610 238, 610 260",
  // d
  "M 628 248 C 628 238, 618 238, 618 248 C 618 258, 628 258, 628 248 M 628 210 L 628 260",
  // a
  "M 646 248 C 646 238, 658 238, 658 248 C 658 258, 646 258, 646 248 M 658 240 L 658 260",
  // y
  "M 670 240 C 670 254, 676 254, 680 240 M 680 240 L 674 270"
];

const BHAVANI_PATHS = [
  // B
  "M 320 330 L 320 440 C 365 440, 370 395, 320 385 C 365 385, 370 330, 320 330",
  // h
  "M 390 330 L 390 440 M 390 400 C 390 370, 425 370, 425 440",
  // a
  "M 445 405 C 445 375, 475 375, 475 405 C 475 435, 445 435, 445 405 M 475 390 L 475 440",
  // v
  "M 495 390 L 515 440 L 535 390",
  // a
  "M 555 405 C 555 375, 585 375, 585 405 C 585 435, 555 435, 555 405 M 585 390 L 585 440",
  // n
  "M 605 390 L 605 440 M 605 400 C 605 370, 640 370, 640 440",
  // i
  "M 660 390 L 660 440 M 660 365 A 2 2 0 1 1 660 367"
];

export const TextReveal = forwardRef(function TextReveal(
  { particleSystemRef, className = '' },
  ref
) {
  const containerRef = useRef(null);
  
  const crownPathRef = useRef(null);
  const flourishLeftRef = useRef(null);
  const flourishRightRef = useRef(null);
  const happyPathsRef = useRef([]);
  const bhavaniPathsRef = useRef([]);

  useImperativeHandle(ref, () => ({
    /** Animate and reveal crown + text stroke by stroke */
    animateReveal(onComplete) {
      const tl = gsap.timeline({
        onComplete: () => {
          if (onComplete) onComplete();
        }
      });

      // 1. Crown reveal
      const crown = crownPathRef.current;
      if (crown) {
        const len = crown.getTotalLength();
        gsap.set(crown, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.95 });
        tl.to(crown, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'power1.inOut',
          onUpdate: () => {
            this.emitSparklesAlongPath(crown, len);
          }
        }, 0);
      }

      // 2. Happy Birthday letters sequential draw
      happyPathsRef.current.forEach((path, i) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.95 });
        tl.to(path, {
          strokeDashoffset: 0,
          duration: 0.6,
          ease: 'sine.inOut',
          onUpdate: () => {
            this.emitSparklesAlongPath(path, len, '#fbbf24');
          }
        }, 0.8 + i * 0.12);
      });

      // 3. Flourishes draw
      [flourishLeftRef.current, flourishRightRef.current].forEach((flourish, i) => {
        if (!flourish) return;
        const len = flourish.getTotalLength();
        gsap.set(flourish, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.8 });
        tl.to(flourish, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            this.emitSparklesAlongPath(flourish, len, i === 0 ? '#fbbf24' : '#f472b6');
          }
        }, 2.5);
      });

      // 4. Bhavani text sequential draw (starts during Happy Birthday finish)
      bhavaniPathsRef.current.forEach((path, i) => {
        if (!path) return;
        const len = path.getTotalLength();
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0.95 });
        tl.to(path, {
          strokeDashoffset: 0,
          duration: 0.9,
          ease: 'sine.inOut',
          onUpdate: () => {
            this.emitSparklesAlongPath(path, len, '#f472b6');
          }
        }, 2.8 + i * 0.2);
      });

      // 5. Global text soft breath/pulse loop after drawing is done
      tl.to(containerRef.current, {
        scale: 1.025,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }, '+=0.5');
    },

    /** Find the draw-head coordinate of the path and spawn sparkles */
    emitSparklesAlongPath(path, totalLength, color = '#fbbf24') {
      const offset = parseFloat(gsap.getProperty(path, 'strokeDashoffset'));
      const progress = 1 - (offset / totalLength);
      if (progress <= 0 || progress >= 1.0) return;

      try {
        const point = path.getPointAtLength(progress * totalLength);
        const svgWidth = 1000;
        const svgHeight = 600;

        // Map SVG coordinates to percentage coordinates
        const pctX = point.x / svgWidth;
        const pctY = point.y / svgHeight;

        // Emit drawing trace sparks
        particleSystemRef.current?.emitFairyDust(pctX, pctY, 3);
        if (Math.random() < 0.2) {
          particleSystemRef.current?.emitPetals(pctX, pctY, 1);
        }
      } catch (err) {
        // Fallback for browsers that don't support getPointAtLength in this context
      }
    },

    /** Fade out text */
    fadeOut(duration = 2.0) {
      return gsap.to(containerRef.current, {
        opacity: 0,
        y: -15,
        filter: 'blur(10px)',
        duration,
        ease: 'power2.inOut',
      });
    }
  }));

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
      style={{ zIndex: 15 }}
    >
      <svg 
        viewBox="0 0 1000 600" 
        className="w-[92vw] h-[92vh] max-w-[1200px] max-h-[720px]"
        style={{
          filter: 'drop-shadow(0 0 15px rgba(251,191,36,0.35)) drop-shadow(0 0 35px rgba(244,114,182,0.2))',
        }}
      >
        {/* Define glow filters */}
        <defs>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pink-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Crown Icon ── */}
        <path
          ref={crownPathRef}
          d={CROWN_PATH}
          fill="none"
          stroke="url(#crownGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#gold-glow)"
          style={{ opacity: 0 }}
        />
        <linearGradient id="crownGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        {/* ── Left & Right Flourishes ── */}
        <path
          ref={flourishLeftRef}
          d={FLOURISH_LEFT}
          fill="none"
          stroke="#fbbf24"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#gold-glow)"
          style={{ opacity: 0 }}
        />
        <path
          ref={flourishRightRef}
          d={FLOURISH_RIGHT}
          fill="none"
          stroke="#f472b6"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#pink-glow)"
          style={{ opacity: 0 }}
        />

        {/* ── Happy Birthday Text ── */}
        <g filter="url(#gold-glow)">
          {HAPPY_BIRTHDAY_PATHS.map((d, i) => (
            <path
              key={`happy-${i}`}
              ref={el => happyPathsRef.current[i] = el}
              d={d}
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />
          ))}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </g>

        {/* ── Bhavani Text ── */}
        <g filter="url(#pink-glow)">
          {BHAVANI_PATHS.map((d, i) => (
            <path
              key={`bhavani-${i}`}
              ref={el => bhavaniPathsRef.current[i] = el}
              d={d}
              fill="none"
              stroke="url(#pinkGradient)"
              strokeWidth="7.0"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />
          ))}
          <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fda4af" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </g>
      </svg>
    </div>
  );
});

export default TextReveal;
