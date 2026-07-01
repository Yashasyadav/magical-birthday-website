/**
 * animationUtils.js
 * GSAP helper functions used across multiple scenes.
 */

import gsap from 'gsap';

/**
 * Animate an element from invisible to visible with an upward drift.
 * @param {Element|Element[]} targets
 * @param {object} [options]
 */
export function revealUp(targets, options = {}) {
  return gsap.from(targets, {
    opacity:  0,
    y:        60,
    duration: options.duration ?? 0.8,
    ease:     options.ease     ?? 'expo.out',
    stagger:  options.stagger  ?? 0.1,
    delay:    options.delay    ?? 0,
    ...options,
  });
}

/**
 * Animate multiple elements in sequence with a stagger.
 * @param {Element[]} targets
 * @param {object} fromVars   - GSAP from vars
 * @param {object} toVars     - GSAP to vars
 * @param {number} [stagger]
 */
export function staggerReveal(targets, fromVars = {}, toVars = {}, stagger = 0.15) {
  return gsap.fromTo(targets, fromVars, { ...toVars, stagger });
}

/**
 * Create a looping breathe / pulse effect.
 * @param {Element} target
 * @param {number} [scale=1.05]
 * @param {number} [duration=2]
 * @returns {gsap.core.Tween}
 */
export function breatheLoop(target, scale = 1.05, duration = 2) {
  return gsap.to(target, {
    scale,
    duration,
    ease:   'sine.inOut',
    yoyo:   true,
    repeat: -1,
  });
}

/**
 * Create a looping float effect.
 * @param {Element} target
 * @param {number} [distance=14] - Pixels to float up
 * @param {number} [duration=3]
 */
export function floatLoop(target, distance = 14, duration = 3) {
  return gsap.to(target, {
    y:        -distance,
    duration,
    ease:     'sine.inOut',
    yoyo:     true,
    repeat:   -1,
  });
}

/**
 * Shimmer text gradient animation.
 * @param {Element} target
 * @param {number} [duration=3]
 */
export function shimmerText(target, duration = 3) {
  return gsap.to(target, {
    backgroundPosition: '200% center',
    duration,
    ease:   'none',
    repeat: -1,
  });
}

/**
 * Dramatic entrance with overshoot bounce (Disney-style).
 * @param {Element|Element[]} targets
 * @param {object} [options]
 */
export function disneyEntrance(targets, options = {}) {
  return gsap.from(targets, {
    scale:    0,
    opacity:  0,
    duration: options.duration ?? 0.8,
    ease:     'back.out(1.7)',
    stagger:  options.stagger  ?? 0.08,
    delay:    options.delay    ?? 0,
  });
}

/**
 * Screen fade to black overlay.
 * @param {Element} overlay  - The full-screen overlay element
 * @param {'in'|'out'} direction
 * @param {number} [duration=0.8]
 * @returns {Promise<void>}
 */
export function screenFade(overlay, direction, duration = 0.8) {
  return gsap.to(overlay, {
    opacity:  direction === 'in' ? 1 : 0,
    duration,
    ease:     'power2.inOut',
  }).then();
}
