/**
 * threeUtils.js
 * Three.js / React Three Fiber helper functions.
 */

import * as THREE from 'three';
import { threeColors } from '@config/theme';

/**
 * Create a standard MeshStandardMaterial with Disney-style defaults.
 * @param {object} options - THREE.MeshStandardMaterialParameters
 * @returns {THREE.MeshStandardMaterial}
 */
export function createMagicalMaterial(options = {}) {
  return new THREE.MeshStandardMaterial({
    roughness:  0.3,
    metalness:  0.6,
    envMapIntensity: 1.0,
    ...options,
  });
}

/**
 * Create a glowing point light.
 * @param {number} color     - Hex color number
 * @param {number} intensity
 * @param {number} distance
 * @returns {THREE.PointLight}
 */
export function createGlowLight(color, intensity = 1, distance = 10) {
  const light = new THREE.PointLight(color, intensity, distance);
  light.castShadow = true;
  light.shadow.mapSize.width  = 512;
  light.shadow.mapSize.height = 512;
  return light;
}

/**
 * Convert a Tailwind CSS hex string to a THREE.Color.
 * @param {string} hex - e.g., '#8b5cf6'
 * @returns {THREE.Color}
 */
export function hexToThreeColor(hex) {
  return new THREE.Color(hex);
}

/**
 * Linear interpolation helper for smooth camera/object movement.
 * @param {THREE.Vector3} current
 * @param {THREE.Vector3} target
 * @param {number} alpha - 0.0 to 1.0 per frame factor
 */
export function lerpVector3(current, target, alpha) {
  current.lerp(target, alpha);
}

/**
 * Generate a random position within a sphere.
 * Useful for particle/star placement.
 * @param {number} radius
 * @returns {{ x: number, y: number, z: number }}
 */
export function randomSpherePoint(radius) {
  const theta = Math.random() * Math.PI * 2;
  const phi   = Math.acos(2 * Math.random() - 1);
  const r     = radius * Math.cbrt(Math.random());
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi),
  };
}

/**
 * Build a star field geometry — Float32Array of random star positions.
 * @param {number} count   - Number of stars
 * @param {number} spread  - Distribution radius
 * @returns {Float32Array}
 */
export function buildStarPositions(count, spread = 50) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  return positions;
}

/** Disney night sky color palette as THREE.Color array */
export const DISNEY_PALETTE = [
  new THREE.Color(threeColors.gold),
  new THREE.Color(threeColors.royal),
  new THREE.Color(threeColors.rose),
  new THREE.Color(threeColors.fairy),
  new THREE.Color(threeColors.white),
];
