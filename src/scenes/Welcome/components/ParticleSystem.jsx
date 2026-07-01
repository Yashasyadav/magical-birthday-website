/**
 * ParticleSystem.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Canvas-based particle effects container. High-performance, pooled allocations.
 * Supports: Petals, Confetti, Fairy Dust, Heart Particles, Swirling Vortexes,
 * and falling Glitter Rain.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

class GameParticle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.size = 0;
    this.color = '#fff';
    this.alpha = 1;
    this.decay = 0.01;
    this.rotation = 0;
    this.rotationSpeed = 0;
    this.type = 'dust'; // dust, petal, confetti, heart, rain
    this.gravity = 0;
    this.friction = 0.98;
    this.life = 1.0;
    this.wobble = 0;
    this.wobbleSpeed = 0;
    this.shapeIndex = 0;
    this.vortexAngle = 0;
    this.vortexRadius = 0;
  }

  update(dt = 1) {
    if (this.type === 'rain') {
      this.vy += this.gravity * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.alpha -= this.decay * dt;
    } else if (this.type === 'vortex') {
      this.vortexAngle += this.wobbleSpeed * dt;
      this.vortexRadius -= this.vx * dt; // radius shrinks
      this.x = this.startX + Math.cos(this.vortexAngle) * this.vortexRadius;
      this.y = this.startY + Math.sin(this.vortexAngle) * this.vortexRadius;
      this.alpha -= this.decay * dt;
    } else {
      // Standard particle updates
      this.vx *= Math.pow(this.friction, dt);
      this.vy *= Math.pow(this.friction, dt);
      this.vy += this.gravity * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      this.rotation += this.rotationSpeed * dt;
      this.wobble += this.wobbleSpeed * dt;
      
      if (this.type === 'confetti' || this.type === 'petal') {
        this.x += Math.sin(this.wobble) * 0.5 * dt;
      }

      this.alpha -= this.decay * dt;
    }
  }

  draw(ctx) {
    if (this.alpha <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === 'petal') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      // Draw organic petal leaf shape
      ctx.ellipse(0, 0, this.size, this.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'confetti') {
      ctx.fillStyle = this.color;
      // Draw rectangular confetti piece
      ctx.fillRect(-this.size, -this.size / 2, this.size * 2, this.size);
    } else if (this.type === 'heart') {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      const s = this.size;
      // Precise heart path
      ctx.moveTo(0, -s / 2);
      ctx.bezierCurveTo(s / 2, -s, s, -s / 3, 0, s);
      ctx.bezierCurveTo(-s, -s / 3, -s / 2, -s, 0, -s / 2);
      ctx.fill();
    } else if (this.type === 'rain') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.vx * -0.5, this.vy * -0.5); // trail matching direction
      ctx.stroke();
    } else {
      // Dust / Sparkles
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 4;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Simple Object Pool
class ParticlePool {
  constructor() {
    this.pool = [];
  }

  acquire() {
    if (this.pool.length > 0) {
      const p = this.pool.pop();
      p.reset();
      return p;
    }
    return new GameParticle();
  }

  release(p) {
    if (this.pool.length < 500) {
      this.pool.push(p);
    }
  }
}

const particlePool = new ParticlePool();

const PETAL_COLORS = ['#fda4af', '#f472b6', '#fce7f3', '#fbbf24', '#fde68a'];
const CONFETTI_COLORS = ['#fbbf24', '#f472b6', '#c4b5fd', '#60a5fa', '#34d399', '#ffffff'];

export const ParticleSystem = forwardRef(function ParticleSystem({ className = '' }, ref) {
  const canvasRef = useRef(null);
  const activeParticles = useRef([]);
  const animFrame = useRef(null);
  
  // Emitter switches
  const petalFallRef = useRef(false);
  const glitterRainRef = useRef(false);

  useImperativeHandle(ref, () => ({
    emitConfetti(x, y, count = 40) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const px = canvas.width * x;
      const py = canvas.height * y;

      for (let i = 0; i < count; i++) {
        const p = particlePool.acquire();
        p.x = px;
        p.y = py;
        p.type = 'confetti';
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 6;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed - 1.5; // push slightly up
        p.size = 3 + Math.random() * 4;
        p.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        p.rotation = Math.random() * Math.PI;
        p.rotationSpeed = (Math.random() - 0.5) * 0.15;
        p.wobble = Math.random() * 10;
        p.wobbleSpeed = 0.05 + Math.random() * 0.1;
        p.gravity = 0.06;
        p.decay = 0.008 + Math.random() * 0.008;
        activeParticles.current.push(p);
      }
    },

    emitPetals(x, y, count = 25) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const px = canvas.width * x;
      const py = canvas.height * y;

      for (let i = 0; i < count; i++) {
        const p = particlePool.acquire();
        p.x = px;
        p.y = py;
        p.type = 'petal';
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed - 1.0;
        p.size = 4 + Math.random() * 6;
        p.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
        p.rotation = Math.random() * Math.PI;
        p.rotationSpeed = (Math.random() - 0.5) * 0.08;
        p.wobble = Math.random() * 10;
        p.wobbleSpeed = 0.02 + Math.random() * 0.05;
        p.gravity = 0.03;
        p.decay = 0.005 + Math.random() * 0.006;
        activeParticles.current.push(p);
      }
    },

    emitFairyDust(x, y, count = 10) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const px = canvas.width * x;
      const py = canvas.height * y;

      for (let i = 0; i < count; i++) {
        const p = particlePool.acquire();
        p.x = px;
        p.y = py;
        p.type = 'dust';
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;
        p.size = 1.0 + Math.random() * 1.5;
        p.color = Math.random() < 0.35 ? '#fde68a' : '#fff';
        p.decay = 0.015 + Math.random() * 0.02;
        p.gravity = 0.01;
        p.friction = 0.97;
        activeParticles.current.push(p);
      }
    },

    emitVortex(x, y, count = 15) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const px = canvas.width * x;
      const py = canvas.height * y;

      for (let i = 0; i < count; i++) {
        const p = particlePool.acquire();
        p.startX = px;
        p.startY = py;
        p.type = 'vortex';
        p.vortexAngle = Math.random() * Math.PI * 2;
        p.vortexRadius = 60 + Math.random() * 80;
        p.wobbleSpeed = 0.08 + Math.random() * 0.06; // angular speed
        p.vx = 1.5 + Math.random() * 2.0;            // radial speed (shrinks radius)
        p.size = 1.0 + Math.random() * 2.0;
        p.color = i % 2 === 0 ? '#fbbf24' : '#f472b6';
        p.decay = 0.008 + Math.random() * 0.008;
        activeParticles.current.push(p);
      }
    },

    startGlitterRain() {
      glitterRainRef.current = true;
    },

    stopGlitterRain() {
      glitterRainRef.current = false;
    },

    startPetalFall() {
      petalFallRef.current = true;
    },

    stopPetalFall() {
      petalFallRef.current = false;
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

    const updateLoop = (now) => {
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;

      // Clear frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Continuous emission logic
      if (glitterRainRef.current && Math.random() < 0.6) {
        // Spawn glitter rain from top of screen
        const p = particlePool.acquire();
        p.x = Math.random() * canvas.width;
        p.y = -10;
        p.type = 'rain';
        p.vx = (Math.random() - 0.5) * 1.5;
        p.vy = 4 + Math.random() * 3;
        p.size = 1;
        p.color = Math.random() < 0.5 ? '#fde68a' : '#fda4af';
        p.gravity = 0.04;
        p.decay = 0.006 + Math.random() * 0.006;
        activeParticles.current.push(p);
      }

      if (petalFallRef.current && Math.random() < 0.25) {
        const p = particlePool.acquire();
        p.x = Math.random() * canvas.width;
        p.y = -20;
        p.type = 'petal';
        p.vx = (Math.random() - 0.5) * 1.0;
        p.vy = 1 + Math.random() * 1.5;
        p.size = 4 + Math.random() * 5;
        p.color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
        p.rotation = Math.random() * Math.PI;
        p.rotationSpeed = (Math.random() - 0.5) * 0.05;
        p.wobble = Math.random() * 10;
        p.wobbleSpeed = 0.02 + Math.random() * 0.03;
        p.gravity = 0.015;
        p.decay = 0.004 + Math.random() * 0.004;
        activeParticles.current.push(p);
      }

      // Draw and update active particles
      const particles = activeParticles.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update(dt);
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
          particlePool.release(p);
        }
      }

      animFrame.current = requestAnimationFrame(updateLoop);
    };

    animFrame.current = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(animFrame.current);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 13 }}
    />
  );
});

export default ParticleSystem;
