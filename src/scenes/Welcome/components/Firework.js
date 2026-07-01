/**
 * Firework.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Individual firework physics and particle logic.
 * Supports: Peony, Chrysanthemum, Willow, Palm, Star, Comet, Crackling.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export class FireworkParticle {
  constructor(x, y, vx, vy, color, type = 'peony') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.type = type;
    
    // Medium physics: balanced gravity and friction for clean trajectory arcs
    this.gravity = type === 'willow' ? 0.025 : 0.04;
    this.friction = type === 'willow' ? 0.988 : 0.972;
    this.alpha = 1;
    // Balanced decay - particles persist long enough but fade before visual overload
    this.decay = 0.007 + Math.random() * 0.007;
    this.trail = [];
    this.trailLength = type === 'willow' ? 10 : 5;
    this.sparkle = type === 'crackling' || Math.random() < 0.22;
  }

  update(dt = 1) {
    // Save previous positions for trailing effects
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }

    // Apply physics
    this.vx *= Math.pow(this.friction, dt);
    this.vy *= Math.pow(this.friction, dt);
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Decay lifespan
    this.alpha -= this.decay * dt;
  }

  draw(ctx) {
    if (this.alpha <= 0) return;

    // Draw particle trail (medium thickness)
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.type === 'willow' ? 2.0 : 1.4;
      ctx.globalAlpha = this.alpha * 0.4;
      ctx.stroke();
    }

    // Draw main particle point
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.sparkle ? (Math.random() * 2.8 + 0.8) : 1.8, 0, Math.PI * 2);
    ctx.fillStyle = this.sparkle && Math.random() < 0.45 ? '#ffffff' : this.color;
    ctx.globalAlpha = this.alpha;
    ctx.shadowBlur = this.sparkle ? 10 : 3;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export class FireworkInstance {
  constructor(startX, startY, targetX, targetY, color, type = 'peony', scale = 1.0) {
    this.x = startX;
    this.y = startY;
    this.targetX = targetX;
    this.targetY = targetY;
    this.color = color;
    this.type = type;
    this.scale = scale;

    this.isExploded = false;
    this.particles = [];
    this.rocketTrail = [];
    this.rocketTrailLength = 14;

    // Velocity to reach target
    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = 12 + Math.random() * 4;
    this.vx = (dx / distance) * speed;
    this.vy = (dy / distance) * speed;

    this.gravity = 0.02;
    this.done = false;
  }

  update(dt = 1) {
    if (!this.isExploded) {
      // Rocket rise physics
      this.rocketTrail.push({ x: this.x, y: this.y });
      if (this.rocketTrail.length > this.rocketTrailLength) {
        this.rocketTrail.shift();
      }

      this.vy += this.gravity * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;

      // Explode when rocket starts falling or gets close to target
      if (this.vy >= -1.0 || this.y <= this.targetY) {
        this.explode();
      }
    } else {
      // Update particles
      let activeCount = 0;
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.update(dt);
        if (p.alpha <= 0) {
          this.particles.splice(i, 1);
        } else {
          activeCount++;
        }
      }

      if (activeCount === 0) {
        this.done = true;
      }
    }
  }

  explode() {
    this.isExploded = true;
    // Balanced, medium particle counts
    const pCount = this.type === 'willow' ? 130 : 160;
    
    if (this.type === 'star') {
      this._explodeStar(pCount);
    } else if (this.type === 'butterfly') {
      this._explodeButterfly(pCount);
    } else {
      this._explodeRadial(pCount);
    }
  }

  _explodeRadial(count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.2;
      const speed = (2.4 + Math.random() * 5.5) * this.scale;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      this.particles.push(new FireworkParticle(this.x, this.y, vx, vy, this.color, this.type));
    }
  }

  _explodeStar(count) {
    const points = 5;
    for (let p = 0; p < points; p++) {
      const baseAngle = (p / points) * Math.PI * 2 - Math.PI / 2;
      const particlesPerPoint = Math.floor(count / points);
      for (let i = 0; i < particlesPerPoint; i++) {
        const angle = baseAngle + (i / particlesPerPoint - 0.5) * 0.4;
        const speed = (4.0 + Math.random() * 5.0) * this.scale;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        this.particles.push(new FireworkParticle(this.x, this.y, vx, vy, this.color, 'star'));
      }
    }
  }

  _explodeButterfly(count) {
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      // Fay's parametric butterfly curve formula
      const r = Math.exp(Math.cos(angle)) - 2 * Math.cos(4 * angle) + Math.pow(Math.sin(angle / 12), 5);
      const vx = Math.sin(angle) * r * 1.4 * this.scale;
      const vy = -Math.cos(angle) * r * 1.4 * this.scale; // invert y for coordinate system
      this.particles.push(new FireworkParticle(this.x, this.y, vx, vy, this.color, 'butterfly'));
    }
  }

  draw(ctx) {
    if (!this.isExploded) {
      // Draw rising rocket trail
      if (this.rocketTrail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(this.rocketTrail[0].x, this.rocketTrail[0].y);
        for (let i = 1; i < this.rocketTrail.length; i++) {
          ctx.lineTo(this.rocketTrail[i].x, this.rocketTrail[i].y);
        }
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2.0;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
      }

      // Draw rocket head
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 1.0;
      ctx.fill();
    } else {
      // Draw explosion particles
      for (let p of this.particles) {
        p.draw(ctx);
      }
    }
  }
}
