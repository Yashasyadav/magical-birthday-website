/**
 * useAudio.js
 * Sound effect hook — quick access to playSfx without needing full context.
 */

import { useCallback } from 'react';
import { useAudioContext } from '@context/AudioContext';

export function useAudio() {
  const { playSfx, isMuted, toggleMute, initialized, initAudio } = useAudioContext();

  const play = useCallback((sfxKey) => {
    if (!initialized) initAudio();
    playSfx(sfxKey);
  }, [playSfx, initialized, initAudio]);

  return { play, isMuted, toggleMute, initialized };
}
