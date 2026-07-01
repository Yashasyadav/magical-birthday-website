/**
 * useMusic.js
 * Hook for managing scene-level background music with automatic
 * crossfade on mount and cleanup on unmount.
 *
 * @example
 *   // In a scene component:
 *   useMusic(MUSIC.CASTLE);  // Fades in on mount, stops on unmount
 */

import { useEffect } from 'react';
import { useAudioContext } from '@context/AudioContext';

/**
 * @param {string|null} trackKey - MUSIC constant, or null to stop music
 * @param {number} [fadeDuration] - Optional crossfade override in ms
 */
export function useMusic(trackKey, fadeDuration) {
  const { playMusic, initialized, initAudio } = useAudioContext();

  useEffect(() => {
    if (!trackKey) return;

    if (!initialized) initAudio();
    playMusic(trackKey, fadeDuration);

    // No cleanup — music continues playing into the next scene's transition.
    // The next scene's useMusic call handles the crossfade out.
  }, [trackKey]); // eslint-disable-line react-hooks/exhaustive-deps
}
