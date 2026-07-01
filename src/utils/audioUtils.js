/**
 * audioUtils.js
 * Howler.js helper functions for audio processing.
 */

/**
 * Calculate a linear volume ramp value for a given playback position.
 * @param {number} currentTime  - Seconds elapsed
 * @param {number} totalTime    - Total duration in seconds
 * @param {number} fadeIn       - Fade-in duration in seconds
 * @param {number} fadeOut      - Fade-out duration in seconds
 * @param {number} [maxVolume]  - Peak volume (0.0 – 1.0)
 * @returns {number}
 */
export function calculateFadeVolume(currentTime, totalTime, fadeIn, fadeOut, maxVolume = 1) {
  if (currentTime < fadeIn) {
    return (currentTime / fadeIn) * maxVolume;
  }
  if (currentTime > totalTime - fadeOut) {
    return ((totalTime - currentTime) / fadeOut) * maxVolume;
  }
  return maxVolume;
}

/**
 * Convert milliseconds to seconds (Howler uses seconds for seek).
 * @param {number} ms
 * @returns {number}
 */
export const msToSeconds = (ms) => ms / 1000;

/**
 * Format seconds as MM:SS for display.
 * @param {number} seconds
 * @returns {string}
 */
export function formatAudioTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Check if the browser supports autoplay.
 * Used to decide whether to show a "tap to start" prompt.
 * @returns {Promise<boolean>}
 */
export async function canAutoplay() {
  try {
    const audio = new Audio();
    audio.volume = 0;
    await audio.play();
    audio.pause();
    return true;
  } catch {
    return false;
  }
}
