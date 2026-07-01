# Music Guide — Audio Strategy & Implementation Reference

## Overview

The Disney Princess Birthday Experience uses a **dual-layer audio system** powered by Howler.js:

- **Music Layer**: One background track at a time, crossfaded between scenes
- **SFX Layer**: Multiple simultaneous short clips triggered by interactions

All audio is managed through the `SoundManager` engine singleton. React components access audio exclusively through `useAudio()` and `useMusic()` hooks — never import Howler.js directly in a component.

---

## Scene Music Map

| Scene | Track File | Loop | Mood |
|---|---|---|---|
| Loading | `loading-theme.mp3` | Yes | Magical anticipation, soft orchestral |
| Authentication | `auth-theme.mp3` | Yes | Mysterious, curious, gentle |
| Welcome | `welcome-fanfare.mp3` | No | Warm, celebratory, short fanfare |
| Night Sky | `night-sky-ambient.mp3` | Yes | Wonder, vastness, orchestral ambience |
| Castle Reveal | `castle-theme.mp3` | No | Majestic, grand, Disney-iconic |
| Princess Entrance | `princess-entrance.mp3` | No | Romantic, emotional, strings-led |
| Balloons | `celebration-jingle.mp3` | Yes | Playful, upbeat, light percussion |
| Cake | `happy-birthday-orchestral.mp3` | No | Full orchestral Happy Birthday |
| Gallery | `gallery-waltz.mp3` | Yes | Nostalgic, warm, piano waltz |
| Letter | `letter-piano.mp3` | Yes | Intimate, emotional, solo piano |
| Games | `game-theme.mp3` | Yes | Playful, energetic, bouncy |
| Certificate | `achievement-fanfare.mp3` | No | Triumphant, proud, short sting |
| Feedback | `feedback-gentle.mp3` | Yes | Soft, warm, comfortable |
| Finale | `grand-finale.mp3` | No | Full orchestral, epic, joyful |

---

## Volume Strategy

### Master Volume

The overall application volume is controlled by `Howler.volume()` (set once at initialization). This is the ceiling for all audio.

### Music Volume

Default: **0.5** (50%). Adjustable by user via mute toggle.

The `SoundManager` applies `_musicVolume` to all music tracks. Components should never set Howler volume directly.

### SFX Volume

Default: **0.8** (80%). SFX should feel punchy and present without overpowering music.

### Volume Hierarchy

```
Howler.volume(1.0)        ← Master ceiling (never change)
  └── Music: 0.5           ← SoundManager._musicVolume
      └── Crossfade: 0 → 0.5 on play
  └── SFX: 0.8             ← SoundManager._sfxVolume
```

---

## Fade Strategy

### Scene Fade-In

When `playMusic(key)` is called:
1. New track starts at volume `0`
2. GSAP or Howler's built-in `fade()` brings it to `_musicVolume` over `CROSSFADE_DURATION` (1500ms)

### Scene Fade-Out

The current track fades from `_musicVolume` to `0` over the same duration, then stops.

```
Old Track: ████████████████░░░░░░░░  (fade out 1500ms)
New Track: ░░░░░░░░████████████████  (fade in 1500ms)
```

Both fades overlap, creating a smooth crossfade.

---

## Crossfade Strategy

### Automatic Crossfade (Scene Changes)

The `useMusic(trackKey)` hook triggers crossfade automatically. Simply call it in a scene component and the previous track fades out as the new one fades in.

```js
// In any scene component:
useMusic(MUSIC.CASTLE);
// That's it — SoundManager handles the rest
```

### Manual Crossfade

For mid-scene music changes (e.g., fireworks escalation):

```js
const { playMusic } = useAudioContext();
// Override crossfade duration to 3000ms for a slower blend
playMusic(MUSIC.NIGHT_SKY, 3000);
```

### Transition Sync

During cinematic scene transitions, music crossfades can be synchronized with the visual transition:

- `TransitionManager` fires `EVENTS.TRANSITION_MIDPOINT` at 50% of transition duration
- `SoundManager` can listen to this event to start the new track at the exact midpoint
- This creates a perfectly synchronized audio-visual transition

---

## Loop Strategy

### Looping Tracks

All ambient tracks loop seamlessly. Requirements for a looping track:

- **No fade-out at the end** — the loop point must be silent or musically seamless
- **Loop point**: The track's end connects directly to its beginning without a click or gap
- Howler `loop: true` handles this automatically

### Non-Looping Tracks

Scene-specific cues (fanfares, stings) do not loop. After the track ends:
- Howler `onend` callback fires
- `SoundManager` can optionally fade to silence or start a looping ambient fallback

---

## Audio File Specifications

### Format

Always export in two formats and register both in the manifest:

```js
// Howler accepts an array — tries formats in order
new Howl({ src: ['track.ogg', 'track.mp3'] })
```

| Format | Bitrate | Use Case |
|---|---|---|
| MP3 | 192kbps | Primary — universal support |
| OGG Vorbis | 160kbps | Secondary — smaller file, better Firefox support |

### Encoding Settings

```bash
# MP3 (using ffmpeg)
ffmpeg -i input.wav -codec:a libmp3lame -b:a 192k -ar 44100 output.mp3

# OGG (using ffmpeg)
ffmpeg -i input.wav -codec:a libvorbis -b:a 160k -ar 44100 output.ogg

# Apply normalization to ensure consistent loudness
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11 normalized.wav
```

### Normalization Target

Normalize all tracks to **-16 LUFS** integrated loudness. This prevents jarring volume jumps between scenes.

---

## File Naming Convention

```
[scene-name]-[descriptor].mp3

Examples:
  loading-theme.mp3
  night-sky-ambient.mp3
  castle-theme.mp3
  princess-entrance.mp3
  happy-birthday-orchestral.mp3
```

SFX files:
```
[action-noun].mp3

Examples:
  balloon-pop.mp3
  cake-cut.mp3
  magic-wand.mp3
  transition-whoosh.mp3
```

---

## Compression & File Size

| Track Type | Target Size | Notes |
|---|---|---|
| Full scene music (2+ min loop) | Under 3MB | High quality preserved |
| Short sting / fanfare | Under 500KB | Very short, quality less critical |
| Ambient loop | Under 2MB | Loops seamlessly |
| Sound effect | Under 100KB | Punchy, short |

Total audio budget for the full experience: **Under 30MB**

---

## Performance Guidelines

### Preloading Strategy

Music tracks are **not preloaded by default**. They load lazily on first `playMusic()` call. To preload a track before its scene:

```js
// In the previous scene, preload the next scene's music:
soundManager.preloadMusic(MUSIC.CASTLE);
```

Add preload calls to the asset manifest's scene-specific keys so `AssetManager` handles them automatically.

### Mobile Considerations

- **Autoplay policy**: All browsers require a user gesture before audio can play
- `SoundManager.initialize()` must be called from a click/tap event (e.g., loading screen "Tap to Begin" button)
- `AudioContext.initAudio()` wraps this for React components
- After initialization, all subsequent music plays without user interaction

### Memory

- `SoundManager` keeps all loaded Howl instances in memory
- For the full experience (~14 tracks), total audio memory is approximately 20–30MB
- This is acceptable for a single-session experience
- `SoundManager` does not currently implement track unloading — all tracks stay loaded after first play

---

## How Future Phases Should Register Music

When a new scene's music is ready:

**Step 1:** Add the audio file to `public/audio/music/`

**Step 2:** Register in `src/config/assets.js`:
```js
music: {
  newScene: '/audio/music/new-scene-theme.mp3',
}
```

**Step 3:** Add a constant in `src/constants/audio.js`:
```js
export const MUSIC = {
  NEW_SCENE: 'newScene',
};
```

**Step 4:** Call in the scene component:
```js
useMusic(MUSIC.NEW_SCENE);
```

No other changes required. `SoundManager` handles loading, crossfading, and looping automatically.

---

## Mute & Accessibility

- A mute toggle button should always be visible during the experience
- Mute state persists across scene changes via `AudioContext`
- The `Howler.mute()` global mute silences all audio without stopping tracks
- On unmute, tracks resume from where they were (Howler handles this)
- All critical information must be visually presented — never conveyed through audio alone
