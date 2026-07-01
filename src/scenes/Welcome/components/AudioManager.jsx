/**
 * AudioManager.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Cinematic Soundtrack & Sound Effects Architecture (Visual Mock System).
 * Logs orchestrated sounds to the console in a stylized format and displays
 * a subtle, elegant on-screen indicator representing the current audio mixing state.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useImperativeHandle, forwardRef } from 'react';

export const AudioManager = forwardRef(function AudioManager(props, ref) {
  const [currentTrack, setCurrentTrack] = useState('Silence');
  const [activeEffects, setActiveEffects] = useState([]);

  useImperativeHandle(ref, () => ({
    /** Transition background soundtrack */
    playTrack(trackName) {
      setCurrentTrack(trackName);
      console.log(
        `%c🎵 [Soundtrack] Changing track to: ${trackName} 🎵`,
        "color: #a78bfa; font-weight: bold; font-size: 13px; background: #1c1033; padding: 4px 8px; border-radius: 4px;"
      );
    },

    /** Trigger a sound effect */
    playSFX(sfxName) {
      console.log(
        `%c💥 [SFX] Triggered: ${sfxName} 💥`,
        "color: #fbbf24; font-weight: bold; font-size: 11px; background: #2b1f06; padding: 2px 6px; border-radius: 3px;"
      );

      // Add to UI visual feedback stack
      setActiveEffects(prev => [...prev, sfxName]);
      setTimeout(() => {
        setActiveEffects(prev => prev.filter(name => name !== sfxName));
      }, 1500);
    }
  }));

  return (
    <div 
      className="absolute bottom-4 left-4 z-50 flex flex-col gap-2 p-3 rounded-lg border border-purple-950/40 bg-purple-950/20 backdrop-blur-md pointer-events-none transition-all duration-300"
      style={{ maxWidth: 260 }}
    >
      <div className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">
        Sound System Architecture
      </div>
      
      {/* Current Music Track Info */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
        </span>
        <div className="text-xs text-slate-200">
          <span className="text-purple-300 font-semibold">Track: </span>
          {currentTrack}
        </div>
      </div>

      {/* SFX Log Stack */}
      {activeEffects.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {activeEffects.map((eff, i) => (
            <span 
              key={i} 
              className="text-[9px] px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono animate-pulse"
            >
              🔊 {eff}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});

export default AudioManager;
