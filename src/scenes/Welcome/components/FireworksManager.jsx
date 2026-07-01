/**
 * FireworksManager.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Manages active fireworks instances and renders them onto an HTML5 canvas.
 * Integrates dynamic illumination by flashing a sky background layer
 * matching the color of each firework explosion.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { FireworkInstance } from './Firework';
import soundManager from '@engine/SoundManager';

const PALETTES = {
  gold:    '#fbbf24',
  pink:    '#f472b6',
  purple:  '#a78bfa',
  blue:    '#60a5fa',
  teal:    '#2dd4bf',
  red:     '#f43f5e',
  white:   '#ffffff',
};

const TYPES = ['peony', 'chrysanthemum', 'willow', 'star', 'butterfly', 'crackling'];

export const FireworksManager = forwardRef(function FireworksManager(
  { skyColorFlashRef, className = '' },
  ref
) {
  const canvasRef = useRef(null);
  const fireworksRef = useRef([]);
  const animationFrameRef = useRef(null);

  useImperativeHandle(ref, () => ({
    /**
     * Launch a firework rocket
     * @param {number} xFraction - horizontal position fraction (0 to 1)
     * @param {number} yFraction - vertical target height fraction (0 to 1)
     * @param {string} colorKey - palette color key
     * @param {string} type - type of firework
     * @param {number} scale - scale of explosion
     */
    launch(xFraction = 0.5, yFraction = 0.3, colorKey = 'gold', type = 'peony', scale = 1.0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const startX = canvas.width * (0.2 + Math.random() * 0.6);
      const startY = canvas.height;
      const targetX = canvas.width * xFraction;
      const targetY = canvas.height * yFraction;
      const color = PALETTES[colorKey] || colorKey;

      const fw = new FireworkInstance(startX, startY, targetX, targetY, color, type, scale);
      
      // Hook the explosion to flash the sky color and play real sound effect
      const originalExplode = fw.explode.bind(fw);
      fw.explode = () => {
        originalExplode();
        this.flashSky(color);
        soundManager.playSfx('firework');
      };

      fireworksRef.current.push(fw);
    },

    /** Trigger a sky flash when a firework explodes */
    flashSky(color) {
      const flashEl = skyColorFlashRef?.current;
      if (!flashEl) return;

      // Temporary ambient flash color matching the firework
      flashEl.style.backgroundColor = `${color}18`;
      setTimeout(() => {
        if (flashEl) flashEl.style.backgroundColor = 'transparent';
      }, 250);
    },

    /** Launch a random firework */
    launchRandom() {
      const x = 0.1 + Math.random() * 0.8;
      const y = 0.1 + Math.random() * 0.4;
      const keys = Object.keys(PALETTES);
      const randomColor = keys[Math.floor(Math.random() * keys.length)];
      const randomType = TYPES[Math.floor(Math.random() * TYPES.length)];
      // Large scale fireworks
      this.launch(x, y, randomColor, randomType, 1.2 + Math.random() * 0.8);
    },

    /** Start automated back-to-back background launches for a full sky */
    startBackground(intervalMs = 800) {
      if (this.bgInterval) clearInterval(this.bgInterval);
      this.bgInterval = setInterval(() => {
        // Double launches sometimes for abundance!
        this.launchRandom();
        if (Math.random() < 0.45) {
          setTimeout(() => this.launchRandom(), 250);
        }
      }, intervalMs);
    },

    /** Stop automated background launches */
    stopBackground() {
      if (this.bgInterval) {
        clearInterval(this.bgInterval);
        this.bgInterval = null;
      }
    },

    /** Clear all particles */
    clear() {
      fireworksRef.current = [];
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = canvas.offsetWidth || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    handleResize();

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);

    let lastTime = performance.now();

    const renderLoop = (now) => {
      const dt = Math.min((now - lastTime) / 16.67, 3); // cap dt at 3 frames
      lastTime = now;

      // Clean with transparent color to preserve trailing traces cleanly
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const activeFireworks = fireworksRef.current;
      for (let i = activeFireworks.length - 1; i >= 0; i--) {
        const fw = activeFireworks[i];
        fw.update(dt);
        fw.draw(ctx);
        if (fw.done) {
          activeFireworks.splice(i, 1);
        }
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      // Ensure the background interval is cleared on unmount
      if (ref.current) {
        ref.current.stopBackground();
      }
    };
  }, [skyColorFlashRef, ref]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 12 }}
    />
  );
});

export default FireworksManager;
