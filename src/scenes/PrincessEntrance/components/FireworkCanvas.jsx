/**
 * FireworkCanvas.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Canvas-based fireworks system with physics simulation.
 *
 * Types: burst, heart, star, ring, fountain, cascade
 * Colors: royal palette — gold, pink, purple, blue, white
 *
 * Imperative API (via ref):
 *   fireworkRef.current.launch(x, y, type, colors)
 *   fireworkRef.current.launchRandom(type)
 *   fireworkRef.current.celebrate()      — major celebration burst
 *   fireworkRef.current.startBackground()— periodic background fireworks
 *   fireworkRef.current.stopBackground()
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

// ── Color Palettes ─────────────────────────────────────────────────────────────
const PALETTES = {
  gold:    ['#fde68a', '#fbbf24', '#f59e0b', '#fff176', '#ffd700'],
  pink:    ['#fda4af', '#f472b6', '#ec4899', '#ffc2d4', '#ffb3c6'],
  purple:  ['#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#ddd6fe'],
  blue:    ['#93c5fd', '#60a5fa', '#3b82f6', '#bfdbfe', '#e0f2fe'],
  white:   ['#ffffff', '#f8fafc', '#e2e8f0', '#ffffffcc', '#fff9c4'],
  royal:   ['#fbbf24', '#f472b6', '#a78bfa', '#ffffff', '#fde68a'],
  rose:    ['#fda4af', '#fbbf24', '#ffffff', '#f472b6', '#fde68a'],
};

// ── Particle class ─────────────────────────────────────────────────────────────
class FWParticle {
  constructor(x, y, vx, vy, color, life = 1.2, size = 2.5, shape = 'circle') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.life = life;
    this.maxLife = life;
    this.size = size;
    this.shape = shape;
    this.alpha = 1;
    this.gravity = 0.06;
    this.friction = 0.975;
    this.trail = [];
    this.trailLen = 6;
    this.dead = false;
  }

  update(dt = 1) {
    if (this.dead) return;

    // Save trail
    if (this.trail.length >= this.trailLen) this.trail.shift();
    this.trail.push({ x: this.x, y: this.y });

    // Physics
    this.vy += this.gravity * dt;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Age
    this.life -= dt / 60;
    this.alpha = Math.max(0, (this.life / this.maxLife));
    if (this.life <= 0) this.dead = true;
  }

  draw(ctx) {
    if (this.dead || this.alpha <= 0.01) return;

    // Draw trail
    for (let i = 0; i < this.trail.length - 1; i++) {
      const trailAlpha = (i / this.trail.length) * this.alpha * 0.25;
      ctx.globalAlpha = trailAlpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.trail[i].x, this.trail[i].y, this.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw particle
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;

    if (this.shape === 'star') {
      this._drawStar(ctx, this.x, this.y, this.size * 1.5, 4);
    } else if (this.shape === 'diamond') {
      this._drawDiamond(ctx, this.x, this.y, this.size);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }

  _drawStar(ctx, x, y, r, points = 4) {
    const inner = r * 0.45;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? r : inner;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      if (i === 0) ctx.moveTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
      else ctx.lineTo(x + radius * Math.cos(angle), y + radius * Math.sin(angle));
    }
    ctx.closePath();
    ctx.fill();
  }

  _drawDiamond(ctx, x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r * 1.5);
    ctx.lineTo(x + r, y);
    ctx.lineTo(x, y + r * 1.5);
    ctx.lineTo(x - r, y);
    ctx.closePath();
    ctx.fill();
  }
}

// ── Firework class ─────────────────────────────────────────────────────────────
class Firework {
  constructor(x, y, type = 'burst', palette = 'royal') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.colors = typeof palette === 'string'
      ? PALETTES[palette] || PALETTES.royal
      : palette;
    this.particles = [];
    this.done = false;

    this._explode();
  }

  _color() {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  _explode() {
    const count = { burst: 90, heart: 72, star: 80, ring: 60, fountain: 50, cascade: 100 }[this.type] || 90;

    switch (this.type) {
      case 'burst':   this._burst(count);    break;
      case 'heart':   this._heart(count);    break;
      case 'star':    this._star(count);     break;
      case 'ring':    this._ring(count);     break;
      case 'fountain':this._fountain(count); break;
      case 'cascade': this._cascade(count);  break;
      default:        this._burst(count);
    }
  }

  _burst(count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = Math.random() * 4.5 + 1.5;
      const size  = Math.random() * 2.5 + 1;
      const life  = Math.random() * 0.7 + 0.9;
      const shape = Math.random() < 0.2 ? 'star' : 'circle';
      this.particles.push(new FWParticle(
        this.x, this.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        this._color(), life, size, shape
      ));
    }
    // Central bright flash
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const p = new FWParticle(this.x, this.y, Math.cos(angle) * 2, Math.sin(angle) * 2, '#ffffff', 0.4, 4);
      p.gravity = 0;
      p.friction = 0.92;
      this.particles.push(p);
    }
  }

  _heart(count) {
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2;
      // Heart parametric equation
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      const scale = 0.22;
      const p = new FWParticle(
        this.x, this.y,
        hx * scale * (0.9 + Math.random() * 0.2),
        hy * scale * (0.9 + Math.random() * 0.2),
        this._color(), 1.6, Math.random() * 2 + 1.5, 'circle'
      );
      p.gravity = 0.03;
      p.friction = 0.97;
      this.particles.push(p);
    }
  }

  _star(count) {
    const points = 5;
    const perPoint = Math.floor(count / points);
    for (let p = 0; p < points; p++) {
      const baseAngle = (p / points) * Math.PI * 2 - Math.PI / 2;
      for (let i = 0; i < perPoint; i++) {
        const spread = (i / perPoint - 0.5) * 0.5;
        const angle = baseAngle + spread;
        const speed = Math.random() * 3 + (p % 2 === 0 ? 4 : 2);
        this.particles.push(new FWParticle(
          this.x, this.y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          this._color(), 1.3, 2, 'star'
        ));
      }
    }
  }

  _ring(count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = 4.5 + Math.random() * 0.8;
      const p = new FWParticle(
        this.x, this.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        this._color(), 1.4, Math.random() * 2 + 1, 'circle'
      );
      p.friction = 0.96;
      this.particles.push(p);
    }
  }

  _fountain(count) {
    for (let i = 0; i < count; i++) {
      const spread = (Math.random() - 0.5) * 0.8;
      const angle = -Math.PI / 2 + spread;
      const speed = Math.random() * 6 + 2;
      const p = new FWParticle(
        this.x, this.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        this._color(), 1.6, Math.random() * 2.5 + 1, 'circle'
      );
      p.gravity = 0.1;
      this.particles.push(p);
    }
  }

  _cascade(count) {
    this._burst(Math.floor(count * 0.5));
    for (let i = 0; i < Math.floor(count * 0.5); i++) {
      const angle = (i / count) * Math.PI * 2;
      const speed = Math.random() * 2 + 1;
      const p = new FWParticle(
        this.x, this.y,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed,
        this._color(), 2.2, Math.random() * 1.5 + 0.5, 'diamond'
      );
      p.gravity = 0.04;
      p.trailLen = 10;
      this.particles.push(p);
    }
  }

  update(dt) {
    this.particles.forEach(p => p.update(dt));
    this.particles = this.particles.filter(p => !p.dead);
    this.done = this.particles.length === 0;
  }

  draw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }
}

// ── Rocket class (launch trail before explosion) ───────────────────────────────
class Rocket {
  constructor(x, targetX, targetY, canvasH, type, palette) {
    this.x = x;
    this.y = canvasH;
    this.targetX = targetX;
    this.targetY = targetY;
    this.type = type;
    this.palette = palette;
    this.trail = [];
    this.speed = 12 + Math.random() * 5;
    const dx = targetX - x;
    const dy = targetY - canvasH;
    const dist = Math.sqrt(dx * dx + dy * dy);
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
    this.done = false;
    this.exploded = false;
    this.firework = null;
    this.colors = typeof palette === 'string'
      ? PALETTES[palette] || PALETTES.royal
      : palette;
  }

  update(dt) {
    if (this.exploded) return;

    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 12) this.trail.shift();

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Check if reached target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    if (dx * dx + dy * dy < 100) {
      this.exploded = true;
      this.firework = new Firework(this.targetX, this.targetY, this.type, this.palette);
      this.done = false; // Not done until firework is done
    }
  }

  updateFirework(dt) {
    if (this.firework) {
      this.firework.update(dt);
      this.done = this.firework.done;
    }
  }

  draw(ctx) {
    if (this.exploded) {
      this.firework?.draw(ctx);
      return;
    }
    // Draw rocket trail
    const color = this.colors[0] || '#fbbf24';
    for (let i = 0; i < this.trail.length; i++) {
      const alpha = (i / this.trail.length) * 0.6;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.trail[i].x, this.trail[i].y, (i / this.trail.length) * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Rocket head
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
}

// ── FireworkCanvas React component ─────────────────────────────────────────────
const FireworkCanvas = forwardRef(function FireworkCanvas({ className = '' }, ref) {
  const canvasRef      = useRef(null);
  const rocketsRef     = useRef([]);
  const rafRef         = useRef(null);
  const bgIntervalRef  = useRef(null);
  const lastTimeRef    = useRef(null);
  const activeRef      = useRef(true);

  // Expose imperative API
  useImperativeHandle(ref, () => ({
    /** Launch from bottom with rocket trail */
    launch(xFraction = 0.5, yFraction = 0.25, type = 'burst', palette = 'royal') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const tx = xFraction * canvas.width;
      const ty = yFraction * canvas.height;
      const sx = canvas.width * (0.2 + Math.random() * 0.6); // Random bottom x
      rocketsRef.current.push(new Rocket(sx, tx, ty, canvas.height, type, palette));
    },
    /** Instant explosion (no rocket) */
    explode(xFraction = 0.5, yFraction = 0.25, type = 'burst', palette = 'royal') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const r = new Rocket(0, xFraction * canvas.width, yFraction * canvas.height, canvas.height, type, palette);
      r.exploded = true;
      r.firework = new Firework(xFraction * canvas.width, yFraction * canvas.height, type, palette);
      rocketsRef.current.push(r);
    },
    /** Start periodic background fireworks (far, subtle) */
    startBackground() {
      if (bgIntervalRef.current) return;
      const fire = () => {
        const types = ['burst', 'ring', 'burst', 'star'];
        const palettes = ['gold', 'pink', 'purple', 'royal'];
        this.launch(
          0.1 + Math.random() * 0.8,
          0.05 + Math.random() * 0.35,
          types[Math.floor(Math.random() * types.length)],
          palettes[Math.floor(Math.random() * palettes.length)]
        );
      };
      fire();
      bgIntervalRef.current = setInterval(fire, 2200 + Math.random() * 1200);
    },
    /** Stop periodic background fireworks */
    stopBackground() {
      clearInterval(bgIntervalRef.current);
      bgIntervalRef.current = null;
    },
    /** Major celebration — 10+ fireworks in sequence */
    celebrate() {
      const launches = [
        [0.25, 0.20, 'burst',    'gold'],
        [0.75, 0.15, 'burst',    'pink'],
        [0.50, 0.12, 'heart',    'rose'],
        [0.15, 0.30, 'ring',     'purple'],
        [0.85, 0.25, 'star',     'royal'],
        [0.40, 0.18, 'burst',    'gold'],
        [0.60, 0.18, 'burst',    'pink'],
        [0.30, 0.10, 'cascade',  'purple'],
        [0.70, 0.10, 'cascade',  'gold'],
        [0.50, 0.08, 'heart',    'rose'],
        [0.20, 0.22, 'fountain', 'royal'],
        [0.80, 0.22, 'fountain', 'pink'],
      ];
      launches.forEach(([x, y, type, pal], i) => {
        setTimeout(() => {
          this.launch(x, y, type, pal);
        }, i * 280);
      });
    },
    /** Clear all active fireworks */
    clear() {
      rocketsRef.current = [];
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || window.innerWidth;
      canvas.height = canvas.offsetHeight || window.innerHeight;
    };
    resize();

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const animate = (timestamp) => {
      if (!activeRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }
      // dt in frames (1 = 60fps)
      const dt = lastTimeRef.current ? Math.min((timestamp - lastTimeRef.current) / 16.67, 3) : 1;
      lastTimeRef.current = timestamp;

      // Clear canvas each frame (transparent, no trail smear)
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rockets = rocketsRef.current;
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update(dt);
        r.updateFirework(dt);
        r.draw(ctx);
        if (r.done) rockets.splice(i, 1);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // Pause when tab hidden
    const handleVisibility = () => {
      activeRef.current = !document.hidden;
      if (!document.hidden) lastTimeRef.current = null;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(bgIntervalRef.current);
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 12 }}
      aria-hidden="true"
    />
  );
});

export default FireworkCanvas;
