# Scene Flow — Complete Experience Map

## Overview

The Disney Princess Birthday Experience is a **linear cinematic journey** of 20 scenes. The user progresses from scene to scene automatically or via deliberate interaction. There is no free navigation — the experience is curated and controlled, like watching an animated film.

Total estimated experience duration: **12–18 minutes** (varies with interaction speed)

---

## Flow Diagram

```
┌─────────────────────────────────────────────────┐
│  1. Loading Screen                              │
│     ↓ FADE                                      │
│  2. Secret Question (Authentication)            │
│     ↓ SPARKLE_DISSOLVE                          │
│  3. Welcome Animation                           │
│     ↓ CURTAIN                                   │
│  4. Night Sky                                   │
│     ↓ IRIS                                      │
│  5. Fireworks                  [within NightSky]│
│     ↓ DOOR_OPEN                                 │
│  6. Castle Reveal                               │
│     ↓ ZOOM_OUT                                  │
│  7. Princess Entrance                           │
│     ↓ SPARKLE_DISSOLVE                          │
│  8. Balloon Celebration                         │
│     ↓ IRIS                                      │
│  9. Photo Gallery (Memory Reveal)               │
│     ↓ CURTAIN                                   │
│ 10. 3D Birthday Cake                            │
│     ↓  (user interaction: blow candle)          │
│ 11. Blow Candle Interaction    [within Cake]    │
│     ↓  (user interaction: cut cake)             │
│ 12. Cake Cutting               [within Cake]    │
│     ↓ WIPE                                      │
│ 13. Friendship Letter                           │
│     ↓ FADE                                      │
│ 14. Mini Game 1 — Balloon Pop                   │
│     ↓ FADE                                      │
│ 15. Mini Game 2 — Memory Match                  │
│     ↓ SPARKLE_DISSOLVE                          │
│ 16. Birthday Certificate                        │
│     ↓ FADE                                      │
│ 17. Feedback Form                               │
│     ↓ FADE                                      │
│ 18. Grand Finale                                │
└─────────────────────────────────────────────────┘
```

> **Note:** Scenes 11 and 12 (Blow Candle, Cake Cutting) are sub-interactions within Scene 10 (Cake). They share the same route but are distinct experience phases controlled by in-scene state.

---

## Scene 1 — Loading Screen

| Property | Value |
|---|---|
| **Route** | `/` |
| **Duration** | 3–6 seconds |
| **Transition Out** | FADE |
| **Music** | Soft orchestral intro — quiet, building anticipation |
| **User Interaction** | None (passive) |

**Purpose:**
First impression. Establishes the cinematic Disney aesthetic. Preloads all assets for Scene 2 (Authentication). The user should feel they are entering a fairy tale.

**Main Animation:**
Logo or sparkle particle reveal. Animated loading progress bar styled as a magical wand trail. Disney-quality text animation for the birthday person's name.

**Required Assets:**
- Loading background (gradient or subtle texture)
- Sparkle particle config (fairy-dust preset)
- Loading music track
- Application logo or title typography

**Dependencies:**
- `AssetManager` — preloads auth scene assets
- `SoundManager` — begins loading music
- `AnimationManager` — title reveal timeline

**Performance Considerations:**
This scene runs before any assets are available. Use CSS animations only here. Avoid Three.js until at least Scene 3.

**Future Extensions:**
- Animated Disney-style opening logo
- Animated starfield background using CSS only
- Personalized message: "Loading your magical birthday..."

---

## Scene 2 — Secret Question (Authentication)

| Property | Value |
|---|---|
| **Route** | `/auth` |
| **Duration** | Variable (user-dependent) |
| **Transition In** | SPARKLE_DISSOLVE |
| **Transition Out** | SPARKLE_DISSOLVE |
| **Music** | Soft mystery underscore |
| **User Interaction** | Text input + submit |

**Purpose:**
Only the birthday person (or someone who knows the answer) can proceed. Creates a sense of personalization and exclusivity. The question should be something only the recipient knows.

**Main Animation:**
Question text appears letter by letter (typewriter effect). Input box glows on focus. Incorrect answer triggers a gentle shake. Correct answer triggers a sparkle burst and transition.

**Required Assets:**
- Question text (configurable in constants)
- Correct answer hash (configurable)
- Sparkle SFX on success
- Error SFX on incorrect attempt

**Dependencies:**
- `helpers/validators.js` — `validateSecretAnswer()`
- `context/AppContext` — stores authenticated user state
- `SoundManager` — success/error SFX

**User Interaction:**
Type answer → press Enter or click Submit → validation → sparkle transition if correct, shake if incorrect.

**Performance Considerations:**
Lightweight scene. No Three.js. CSS animations only.

**Future Extensions:**
- Maximum attempt limit with gentle lock-out
- Hint system after 2 failed attempts
- Animated lock/key metaphor

---

## Scene 3 — Welcome Animation

| Property | Value |
|---|---|
| **Route** | `/welcome` |
| **Duration** | 4–6 seconds |
| **Transition In** | SPARKLE_DISSOLVE |
| **Transition Out** | CURTAIN |
| **Music** | Warm, welcoming fanfare |
| **User Interaction** | None or tap to continue |

**Purpose:**
First moment of joy. The birthday person sees their name, age, and a personal greeting in a magical reveal sequence.

**Main Animation:**
Stars fall from the top. Name appears with a Disney bounce-in. Age appears as a glowing number. Subtitle text fades in. Fairy dust particles float upward. Scene culminates in a warm golden glow.

**Required Assets:**
- Welcome background (night gradient)
- Birthday person's name (config constant)
- Fairy dust particle config
- Welcome fanfare audio

**Dependencies:**
- `context/AppContext` — user.name
- `helpers/formatters.js` — `buildBirthdayGreeting()`
- `components/animations/ParticleManager` — fairy-dust preset
- `AnimationManager` — staggered reveal timeline

**Performance Considerations:**
Particle system starts here. Monitor FPS on mobile — limit particle count to 60 on mobile devices.

**Future Extensions:**
- Personalized voice message audio
- Photo of the birthday person fades in behind text

---

## Scene 4 — Night Sky

| Property | Value |
|---|---|
| **Route** | `/night-sky` |
| **Duration** | 5–8 seconds |
| **Transition In** | CURTAIN |
| **Transition Out** | DOOR_OPEN |
| **Music** | Ambient night orchestral with subtle wonder |
| **User Interaction** | Cursor/touch creates small sparkles |

**Purpose:**
Establishes the magical world. Sets the visual palette for the entire experience. Deep navy sky, stars, moon, and a sense of infinite magic.

**Main Animation:**
Stars twinkle into existence one by one. Moon rises with a soft glow. Shooting stars cross the sky. Camera slowly pans upward (CameraManager NIGHT_SKY preset). Firefly particles appear near the horizon.

**Required Assets:**
- Night sky HDR or gradient background
- Star particle config (NIGHT_STARS preset)
- Firefly particle config (FIREFLIES preset)
- Moon texture or SVG
- Night sky ambient music

**Dependencies:**
- `ThreeCanvas` — star field geometry (`threeUtils.buildStarPositions()`)
- `LightingManager` — NIGHT_SKY preset
- `CameraManager` — NIGHT_SKY preset
- `ParticleManager` — NIGHT_STARS, FIREFLIES

**Performance Considerations:**
First scene with Three.js. Limit star count to 2000 on mobile. Use `BufferGeometry` with `Points` for stars — never instanced meshes for this count.

**Future Extensions:**
- Mouse-parallax starfield
- Animated constellation drawings
- Zodiac sign for the birthday person

---

## Scene 5 — Fireworks

| Property | Value |
|---|---|
| **Route** | Contained within `/night-sky` |
| **Duration** | 8–12 seconds |
| **Transition** | Internal (no route change) |
| **Music** | Builds from ambient to celebration |
| **User Interaction** | Tap/click to trigger additional fireworks |

**Purpose:**
Pure spectacle. The sky erupts with fireworks before the castle reveals. The emotional peak of the night sky sequence.

**Main Animation:**
Firework rockets launch upward (Three.js point sprites). Burst animations using particle systems. Multiple simultaneous fireworks in gold, royal purple, and rose. Flash effects via `LightingManager.flash()`. Camera shakes subtly on each burst via `CameraManager.shake()`.

**Required Assets:**
- Firework burst particle configs
- Firework SFX (multiple variants to prevent repetition)
- Flash light config
- Celebration music swell

**Dependencies:**
- `engine/LightingManager` — `flash()` method
- `engine/CameraManager` — `shake()` method
- `engine/SoundManager` — firework SFX, music swell
- `constants/audio.js` — `SFX.FIREWORK`

**Performance Considerations:**
Cap simultaneous firework particles at 500 total. Use object pooling if firing rate is high. On mobile, reduce burst particle count by 60%.

**Future Extensions:**
- Fireworks spell out a message
- User draws the firework path with their finger

---

## Scene 6 — Castle Reveal

| Property | Value |
|---|---|
| **Route** | `/castle` |
| **Duration** | 5–8 seconds |
| **Transition In** | DOOR_OPEN |
| **Transition Out** | ZOOM_OUT |
| **Music** | Majestic castle theme |
| **User Interaction** | None (cinematic) |

**Purpose:**
Awe and grandeur. The Disney castle appears through the doors. This is the iconic moment of the experience.

**Main Animation:**
Two doors open (curtain transition completes the reveal). Castle model or illustration animates in with a camera pull-back. Golden light sweeps across the towers. Castle windows light up one by one. Stars surround the towers.

**Required Assets:**
- Castle 3D model (`models/castle.glb`) or illustrated PNG
- Castle stone texture
- Castle HDR environment
- Castle theme music
- Window light glow texture

**Dependencies:**
- `ThreeCanvas` — castle model rendering
- `LightingManager` — CASTLE preset
- `CameraManager` — CASTLE_WIDE → CASTLE_CLOSE sequence
- `SoundManager` — castle theme music

**Performance Considerations:**
3D model should be under 2MB. LOD (Level of Detail) if possible. Compress GLTF with `draco` compression.

**Future Extensions:**
- Interactive castle — click towers to see memory flashes
- Day/night cycle animation
- Castle reflected in a lake below

---

## Scene 7 — Princess Entrance

| Property | Value |
|---|---|
| **Route** | `/princess` |
| **Duration** | 6–10 seconds |
| **Transition In** | ZOOM_OUT |
| **Transition Out** | SPARKLE_DISSOLVE |
| **Music** | Princess entrance fanfare → warm theme |
| **User Interaction** | None (cinematic) |

**Purpose:**
The emotional heart of the experience. The birthday person is celebrated as a princess. Personal, warm, and magical.

**Main Animation:**
Sparkles coalesce into a silhouette. Princess illustration or photo fades in with a golden halo. Roses/petals fall. Crown descends with a twinkle. Text reveals "Happy Birthday, [Name]" in script font. Camera on PRINCESS_LOW preset looking up.

**Required Assets:**
- Princess illustration or birthday person photo (masked/framed)
- Crown 3D model (`models/crown.glb`)
- Rose petal particle config
- Princess entrance music
- Name display with script font

**Dependencies:**
- `LightingManager` — PRINCESS preset
- `CameraManager` — PRINCESS_LOW preset
- `helpers/formatters.js` — name formatting
- `context/AppContext` — user data

**Performance Considerations:**
If using a real photo, preload and cache in `AssetManager`. Use `loading="eager"` for hero image.

**Future Extensions:**
- Animated dress with cloth simulation
- Photo morphs into illustration style
- Voice narration: "Once upon a time..."

---

## Scene 8 — Balloon Celebration

| Property | Value |
|---|---|
| **Route** | `/balloons` |
| **Duration** | 4–6 seconds |
| **Transition In** | SPARKLE_DISSOLVE |
| **Transition Out** | IRIS |
| **Music** | Upbeat celebration jingle |
| **User Interaction** | Pop balloons by clicking/tapping |

**Purpose:**
Playful, joyful energy release after the emotional princess moment. Light and fun.

**Main Animation:**
Colorful balloons float up from the bottom of the screen. Each balloon has a ribbon. Confetti rains down. Popping a balloon creates a particle burst. Counter shows how many popped.

**Required Assets:**
- Balloon SVG or PNG assets (multiple colors)
- Balloon pop SFX
- Confetti particle config
- Celebration music

**Dependencies:**
- `components/animations/ParticleManager` — CONFETTI preset
- `constants/audio.js` — `SFX.BALLOON_POP`
- `SoundManager` — `playSfx()`

**Performance Considerations:**
Animate balloons with CSS transforms (GPU accelerated). Limit to 20 simultaneous balloons. Particle burst on pop: max 30 particles.

**Future Extensions:**
- Balloons reveal photos when popped
- Balloon spelling out a word (B-I-R-T-H-D-A-Y)

---

## Scene 9 — Photo Gallery

| Property | Value |
|---|---|
| **Route** | `/gallery` |
| **Duration** | 30–90 seconds (user-paced) |
| **Transition In** | IRIS |
| **Transition Out** | CURTAIN |
| **Music** | Waltz / nostalgic piano |
| **User Interaction** | Swipe or click to advance photos |

**Purpose:**
The memory section. Personal photographs create an emotional narrative of the birthday person's journey.

**Main Animation:**
Photos reveal with a cinematic wipe or flip. Each photo appears with a soft vignette and floating sparkles. Captions fade in below each photo. A film-strip or polaroid aesthetic.

**Required Assets:**
- 10–20 personal photographs (see PHOTO_GUIDE.md)
- Gallery waltz music
- Photo frame overlay
- Caption text per photo (configurable)

**Dependencies:**
- `src/assets/images/gallery/` — all photos
- `AssetManager` — preloaded before scene mounts
- `components/animations/ScrollManager` — if scroll-driven
- `helpers/formatters.js` — caption formatting

**Performance Considerations:**
Lazy load photos as user advances. Never load all 20 photos at once. Use thumbnail previews for non-active photos.

**Future Extensions:**
- Photo zooms in on hover with metadata
- Polaroid shake animation
- Video clip support

---

## Scene 10 — 3D Birthday Cake

| Property | Value |
|---|---|
| **Route** | `/cake` |
| **Duration** | Variable (contains sub-interactions) |
| **Transition In** | CURTAIN |
| **Transition Out** | WIPE |
| **Music** | Happy Birthday orchestral arrangement |
| **User Interaction** | Blow candle, then cut cake |

**Purpose:**
The climactic interactive moment. The birthday person blows out candles and cuts their virtual cake.

**Main Animation:**
3D cake model appears center-screen. Candle flames flicker (animated shaders or particles). Camera on CAKE_CLOSEUP preset. Warm candlelight from `LightingManager` CAKE preset.

**Required Assets:**
- Birthday cake 3D model (`models/birthday-cake.glb`)
- Cake frosting texture
- Candle flame particle effect or shader
- Birthday song audio
- Cake cutting SFX

**Dependencies:**
- `ThreeCanvas` — cake model
- `LightingManager` — CAKE preset (candlelight)
- `CameraManager` — CAKE_CLOSEUP preset
- `engine/SoundManager` — birthday song

---

## Scene 11 — Blow Candle Interaction

| Property | Value |
|---|---|
| **Route** | Within `/cake` |
| **Duration** | Variable |
| **Transition** | None (in-scene state change) |
| **Music** | Birthday song continues |
| **User Interaction** | Microphone input OR click/hold button |

**Purpose:**
The most personal and memorable moment. The user "blows" out the candles.

**Main Animation:**
Candle flames extinguish one by one (responding to microphone volume or button hold). Smoke wisps rise from each extinguished candle. Stars and sparkles burst from each candle. A wish prompt appears.

**Required Assets:**
- Candle blow SFX
- Smoke particle config
- Sparkle burst SFX

**Dependencies:**
- Web Audio API or `MediaDevices.getUserMedia()` for microphone input
- `LightingManager` — gradually reduce candlelight intensity
- `constants/events.js` — `EVENTS.CANDLE_BLOWN`

**Performance Considerations:**
Microphone access requires HTTPS. Provide click/hold fallback for microphone permission denials.

---

## Scene 12 — Cake Cutting

| Property | Value |
|---|---|
| **Route** | Within `/cake` |
| **Duration** | 3–5 seconds |
| **Transition** | In-scene → then WIPE to Letter |
| **Music** | Celebration sting then letter music fades in |
| **User Interaction** | Click/swipe to cut the cake |

**Purpose:**
Satisfying tactile interaction. The cake is "cut" with a swipe gesture.

**Main Animation:**
Knife appears and follows cursor. On swipe, cake splits open revealing cream layers. Confetti burst. Camera pulls back slightly to show the full cut cake.

**Required Assets:**
- Cake cut SFX
- Cake interior texture (cross-section)
- Confetti particle burst config

**Dependencies:**
- `constants/events.js` — `EVENTS.CAKE_CUT`
- `components/animations/ParticleManager` — CONFETTI

---

## Scene 13 — Friendship Letter

| Property | Value |
|---|---|
| **Route** | `/letter` |
| **Duration** | 60–120 seconds (reading-paced) |
| **Transition In** | WIPE |
| **Transition Out** | FADE |
| **Music** | Gentle piano |
| **User Interaction** | Scroll to read |

**Purpose:**
The emotional core of the experience. A personal heartfelt letter from the creator to the birthday person.

**Main Animation:**
Paper texture background. Handwritten-style font. Text appears letter-by-letter (typewriter) or line-by-line as user scrolls. Page-flip to next paragraph. Subtle floating sparkles.

**Required Assets:**
- Letter text content (configurable constant)
- Certificate/parchment texture
- Piano music
- Page flip SFX

**Dependencies:**
- `components/animations/ScrollManager` — scroll-driven reveal
- `helpers/formatters.js` — text formatting
- `constants/audio.js` — `SFX.PAGE_FLIP`

**Future Extensions:**
- Letter can be downloaded as PDF
- Photo of sender appears at the bottom with signature

---

## Scene 14 — Mini Game 1: Balloon Pop

| Property | Value |
|---|---|
| **Route** | `/games` |
| **Duration** | 60–90 seconds |
| **Transition In** | FADE |
| **Transition Out** | FADE |
| **Music** | Playful game theme |
| **User Interaction** | Click/tap to pop balloons |

> See **GAME_FLOW.md** for complete game documentation.

---

## Scene 15 — Mini Game 2: Memory Match

| Property | Value |
|---|---|
| **Route** | `/games` (in-scene state) |
| **Duration** | 120–180 seconds |
| **Transition** | In-scene state change after Game 1 |
| **Music** | Puzzle game theme |
| **User Interaction** | Card flip matching |

> See **GAME_FLOW.md** for complete game documentation.

---

## Scene 16 — Birthday Certificate

| Property | Value |
|---|---|
| **Route** | `/certificate` |
| **Duration** | 10–15 seconds |
| **Transition In** | SPARKLE_DISSOLVE |
| **Transition Out** | FADE |
| **Music** | Achievement fanfare |
| **User Interaction** | View and optionally download |

**Purpose:**
Reward and recognition. The birthday person receives a personalized certificate celebrating the occasion.

**Main Animation:**
Certificate unfolds with a wax seal break animation. Gold border shimmers. Name appears with typewriter effect. Star burst behind the seal. Ribbon banners fall.

**Required Assets:**
- Certificate paper texture
- Wax seal graphic
- Ribbon/banner assets
- Achievement fanfare audio
- Downloadable PDF template (Phase N)

**Dependencies:**
- `helpers/formatters.js` — name, age, date formatting
- `context/AppContext` — user data
- `SoundManager` — fanfare

---

## Scene 17 — Feedback Form

| Property | Value |
|---|---|
| **Route** | `/feedback` |
| **Duration** | 2–5 minutes |
| **Transition In** | FADE |
| **Transition Out** | FADE |
| **Music** | Soft, gentle underscore |
| **User Interaction** | Star rating + text input + submit |

**Purpose:**
Captures the recipient's reaction and message. Data submitted to Google Sheets via `sheetsService.js`.

**Main Animation:**
Stars for rating animate on hover. Submit button has a sparkle send effect. Success state shows a floating envelope animation.

**Required Assets:**
- Star icon assets
- Send envelope animation
- Success chime SFX

**Dependencies:**
- `services/sheetsService.js` — `submitFeedback()`
- `helpers/validators.js` — `validateFeedback()`, `validateRating()`
- `constants/events.js` — `EVENTS.FEEDBACK_SUBMITTED`

---

## Scene 18 — Grand Finale

| Property | Value |
|---|---|
| **Route** | `/finale` |
| **Duration** | 15–20 seconds |
| **Transition In** | FADE |
| **Transition Out** | NONE (end of experience) |
| **Music** | Grand orchestral finale — full volume |
| **User Interaction** | None (cinematic) |

**Purpose:**
The perfect ending. Everything comes together. Full-screen celebration with all visual elements: fireworks, confetti, castle silhouette, princess, balloons, sparkles — all at once.

**Main Animation:**
Fireworks launch from both sides. Confetti fills the screen. Castle silhouette glows in the background. "Happy Birthday!" title pulses with golden glow. All particle systems active simultaneously. LightingManager transitions to FINALE preset. Camera on FINALE_PULLBACK preset pulling dramatically backward.

**Required Assets:**
- All previously loaded assets (reused)
- Grand finale orchestral audio
- Full firework burst configs

**Dependencies:**
- All engine managers at full capability
- `LightingManager` — FINALE preset
- `CameraManager` — FINALE_PULLBACK preset
- `SoundManager` — grand finale music

**Performance Considerations:**
This is the most GPU-intensive scene. Limit total simultaneous particles to 1000. Reduce firework burst rate on mobile. Monitor FPS and throttle effects if below 30fps.
