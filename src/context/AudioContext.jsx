/**
 * AudioContext.jsx
 * Bridges SoundManager engine state into React.
 * Provides mute toggle, volume sliders, and current track info.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import soundManager from '@engine/SoundManager';
import { EVENTS }   from '@constants/events';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isMuted,       setIsMuted]       = useState(soundManager.isMuted);
  const [musicVolume,   setMusicVolume]   = useState(soundManager.musicVolume);
  const [currentTrack,  setCurrentTrack]  = useState(soundManager.currentTrack);
  const [initialized,   setInitialized]   = useState(false);

  useEffect(() => {
    const unsubMute   = soundManager.on(EVENTS.AUDIO_MUTE,   () => setIsMuted(true));
    const unsubUnmute = soundManager.on(EVENTS.AUDIO_UNMUTE, () => setIsMuted(false));
    const unsubPlay   = soundManager.on(EVENTS.AUDIO_PLAY,   ({ key, type }) => {
      if (type === 'music') setCurrentTrack(key);
    });
    const unsubVol = soundManager.on(EVENTS.AUDIO_VOLUME_CHANGE, ({ type, volume }) => {
      if (type === 'music') setMusicVolume(volume);
    });

    return () => { unsubMute(); unsubUnmute(); unsubPlay(); unsubVol(); };
  }, []);

  /** Must be called from a user gesture to comply with autoplay policies */
  const initAudio = useCallback(() => {
    soundManager.initialize();
    setInitialized(true);
  }, []);

  const toggleMute = useCallback(() => soundManager.toggleMute(), []);

  const setVolume = useCallback((vol) => {
    soundManager.setMusicVolume(vol);
  }, []);

  const value = {
    isMuted,
    musicVolume,
    currentTrack,
    initialized,
    initAudio,
    toggleMute,
    setVolume,
    playMusic:  (...args) => soundManager.playMusic(...args),
    playSfx:    (...args) => soundManager.playSfx(...args),
    stopMusic:  (...args) => soundManager.stopMusic(...args),
    pauseMusic: ()        => soundManager.pauseMusic(),
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudioContext() {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudioContext must be used within <AudioProvider>');
  return ctx;
}

export default AudioContext;
