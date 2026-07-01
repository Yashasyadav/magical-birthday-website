/**
 * mathUtils.js
 * Pure math helpers — easing, interpolation, clamping, mapping.
 */

/** Clamp a value between min and max */
export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Linear interpolation */
export const lerp = (start, end, t) => start + (end - start) * t;

/** Map a value from one range to another */
export const mapRange = (value, inMin, inMax, outMin, outMax) => {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
};

/** Convert degrees to radians */
export const degToRad = (deg) => deg * (Math.PI / 180);

/** Convert radians to degrees */
export const radToDeg = (rad) => rad * (180 / Math.PI);

/** Easing: ease out cubic */
export const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

/** Easing: ease in out cubic */
export const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Easing: Disney overshoot (ease out back) */
export const easeOutBack = (t, c1 = 1.70158) => {
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/** Easing: elastic out */
export const easeOutElastic = (t) => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

/** Returns a random float between min and max */
export const randomBetween = (min, max) => min + Math.random() * (max - min);

/** Returns a random integer between min (inclusive) and max (inclusive) */
export const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Round to N decimal places */
export const roundTo = (value, decimals = 2) => Math.round(value * 10 ** decimals) / 10 ** decimals;
