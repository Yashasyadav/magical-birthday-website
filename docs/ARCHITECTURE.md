# Architecture Overview

## Project Vision

The **Disney Princess Birthday Experience** is a premium cinematic interactive web application built to feel like a Disney-quality interactive fairy tale. It is not a conventional birthday webpage — it is a fully orchestrated scene-based experience where every moment, transition, sound, and animation is deliberate and emotional.

The experience should:
- Feel like watching an interactive animated film
- Transition between scenes cinematically, not by page navigation
- Load assets before they are needed so the user never waits
- React to user interaction with magical feedback
- Work flawlessly on both desktop and mobile

---

## Overall Architecture

The project is organized around a **game-engine-inspired architecture**. Every major system is a singleton manager living in `src/engine/`. React components consume these managers through Context and Hooks — the engine layer is completely decoupled from the UI layer.

```
┌─────────────────────────────────────────────────────┐
│                  React UI Layer                     │
│  (Scenes → Components → Hooks → Context)            │
└───────────────────┬─────────────────────────────────┘
                    │ subscribe / call
┌───────────────────▼─────────────────────────────────┐
│               Engine Layer (Singletons)             │
│  SceneManager  TransitionManager  AnimationManager  │
│  CameraManager  SoundManager  AssetManager          │
│  LightingManager                                    │
└───────────────────┬─────────────────────────────────┘
                    │ reads from
┌───────────────────▼─────────────────────────────────┐
│             Configuration & Constants               │
│  config/  constants/  assets/  theme/               │
└─────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Technology | Version | Role |
|---|---|---|
| React | 18+ | UI component system |
| Vite | 5+ | Build tool and dev server |
| Tailwind CSS | 4 | Utility-first styling (CSS-first via `@theme`) |
| React Router DOM | 6+ | Scene routing (URL-based scene slots) |
| GSAP + @gsap/react | 3+ | Master timeline animations |
| Framer Motion | 11+ | React-native declarative animations |
| Three.js | r160+ | 3D rendering engine |
| React Three Fiber | 8+ | React renderer for Three.js |
| @react-three/drei | 9+ | Three.js helper abstractions |
| Howler.js | 2+ | Audio engine (music + SFX) |
| React Icons | 5+ | Icon library |
| @tsparticles/react | 3+ | Particle effects system |
| @tsparticles/slim | 3+ | Slim particle engine preset |

---

## Folder Structure & Responsibilities

### `src/engine/`
The core of the application. All managers are singletons — instantiated once, used everywhere. No React dependencies. Pure JavaScript classes with built-in event buses.

### `src/components/`
All React components. Organized by concern:
- `layout/` — Shell components (BaseLayout, SceneWrapper)
- `common/` — Shared utilities (LazyScene, ErrorBoundary)
- `animations/` — Animation orchestrators (Timeline, Scroll, Particle, Transition managers)
- `three/` — R3F components and engine bridges (ThreeCanvas, CameraManager, LightingManager)
- `transitions/` — SceneTransition (the most important component)
- `loading/` — AssetLoader progress overlay
- `ui/` — Reusable UI atoms (buttons, cards, inputs, modals)
- `effects/` — Scene-specific visual effects slots

### `src/scenes/`
Every scene of the birthday experience. Each scene is a folder with an `index.jsx` entry point. Scenes are lazy-loaded — each is a separate Vite chunk. Scenes only contain scene-specific code; shared logic lives in `components/` and `engine/`.

### `src/hooks/`
React hooks that bridge the engine layer to components. Every manager has at least one corresponding hook. Hooks are the only correct way for components to interact with the engine.

### `src/context/`
React Context providers that mirror engine state into the React tree. Four contexts: App, Scene, Audio, Asset. Each is independent and focused.

### `src/config/`
Static configuration objects: theme tokens, route paths, asset manifest, particle presets.

### `src/constants/`
Enum-like constant objects: scene names, audio keys, transition types, event names. Never use raw strings — always import from constants.

### `src/utils/`
Pure utility functions with zero React dependencies. Organized by domain: animation, three, particle, audio, math.

### `src/helpers/`
Higher-level helpers that combine utilities: formatters, validators.

### `src/services/`
External API integration stubs. Currently: Google Sheets feedback submission.

### `src/styles/`
Global CSS only. Three files: globals (Tailwind v4 @theme), fonts (@font-face declarations), animations (CSS keyframe library).

### `src/assets/`
Static assets organized by type and sub-type. Never import assets with relative paths — use the asset manifest.

### `src/router/`
A single `AppRouter.jsx` file. All 14 scene routes defined here with lazy imports.

---

## Engine Explanation

### SceneManager

The central state machine for the entire experience. Controls which scene is active, queuing scene changes, and firing lifecycle events. Implements a strict state machine:

```
IDLE → PRELOADING → TRANSITIONING_OUT → MOUNTING → TRANSITIONING_IN → ACTIVE
```

Scenes cannot be mounted while a transition is running (`_locked` flag). All navigation goes through `SceneManager.navigateTo()` or `SceneManager.goNext()`. The `SCENE_SEQUENCE` array in `constants/scenes.js` defines the linear flow of the experience.

### AnimationManager

Registers GSAP plugins once globally. Manages named timeline groups — each scene registers its timelines under a group ID. Provides `createContext()` for React component scoping, ensuring no memory leaks on unmount. All GSAP-driven animations in the project use this manager.

### CameraManager

Stores named camera presets for every major scene (night sky, castle, princess, cake, finale). Animates between presets using GSAP applied to the registered Three.js camera object. The React bridge (`components/three/CameraManager.jsx`) registers the live R3F camera on mount. Also provides a `shake()` method for impact moments (fireworks, candle blow).

### SoundManager

Two-layer audio system using Howler.js:
- **Music layer**: One track at a time, crossfaded between scene changes
- **SFX layer**: Multiple simultaneous short clips

Handles browser autoplay policy by requiring `initialize()` to be called from a user gesture. Exposes `playMusic()`, `playSfx()`, `stopMusic()`, `pauseMusic()`, `toggleMute()`.

### LightingManager

Six named lighting presets (DARK, NIGHT_SKY, CASTLE, PRINCESS, CAKE, FINALE), each defining ambient, directional, and point light configurations. Animates between presets using GSAP tweens on registered Three.js light objects. The React bridge (`components/three/LightingManager.jsx`) renders the actual lights and registers them.

### AssetManager

Preload queue and in-memory cache. Uses dot-notation keys (`music.castle`, `models.cake`) that resolve against `config/assets.js`. Supports images, audio, and generic (fetch) asset types. Fires progress events consumed by `AssetContext` and displayed by `AssetLoader.jsx`. Uses `Promise.allSettled()` so one failed asset doesn't block others.

### TransitionManager

Orchestrates scene transition animations. Listens to `SceneManager` events and coordinates the OUT → midpoint → IN phases. Exposes `playTransition(type, direction)` returning a Promise. The React layer (`SceneTransition.jsx`) listens to TransitionManager events and renders the visual effect using Framer Motion.

---

## Routing

React Router v6 with `BrowserRouter`. All 14 scenes are defined as routes in `AppRouter.jsx`. Each scene component is lazily imported via `React.lazy()`, creating 14 separate Vite chunks.

The router is a passive observer — scene navigation is driven by `SceneManager`, which updates the URL via `useNavigate`. The URL always reflects the current scene, enabling browser back/forward and deep linking.

**Route constants** live in `config/routes.js`. Never hardcode paths.

---

## Hooks

| Hook | Purpose |
|---|---|
| `useScene` | Navigate between scenes, get current scene state |
| `useTransition` | Observe active transition, trigger manual transitions |
| `useAudio` | Play SFX, check mute state |
| `useMusic` | Play scene background music with automatic crossfade |
| `useAnimation` | Create named GSAP timelines with automatic cleanup |
| `useParticles` | Initialize tsparticles with a preset config |
| `useCamera` | Move camera to presets, trigger shake |
| `usePreloader` | Preload assets and observe progress |
| `useTheme` | Access design tokens in JS (GSAP, Three.js) |

---

## Contexts

| Context | State Managed |
|---|---|
| `AppContext` | Authenticated user, global ready flag |
| `SceneContext` | Current scene, scene state machine, transition flag |
| `AudioContext` | Mute state, music volume, current track, audio controls |
| `AssetContext` | Loading progress, loaded count, error list, asset retrieval |

Provider hierarchy in `App.jsx`:
```
AppProvider → AssetProvider → AudioProvider → SceneProvider → BaseLayout → AppRouter
```

---

## Utilities

| Utility | Contents |
|---|---|
| `animationUtils.js` | revealUp, staggerReveal, breatheLoop, floatLoop, shimmerText, disneyEntrance, screenFade |
| `threeUtils.js` | createMagicalMaterial, createGlowLight, hexToThreeColor, lerpVector3, randomSpherePoint, buildStarPositions |
| `mathUtils.js` | clamp, lerp, mapRange, degToRad, easeOutBack, easeOutElastic, randomBetween |
| `particleUtils.js` | getParticleConfig, customizeParticleConfig |
| `audioUtils.js` | calculateFadeVolume, formatAudioTime, canAutoplay |

---

## Performance Strategy

- **Code splitting**: Every scene is a separate JS chunk via `React.lazy()`
- **Vendor splitting**: React, Three.js, GSAP, Framer Motion, Howler each in their own chunk
- **Asset preloading**: `AssetManager` preloads next-scene assets before transitions complete
- **Texture optimization**: All images converted to WebP; 3D textures power-of-2 dimensions
- **Three.js**: Single persistent Canvas (`ThreeCanvas.jsx`) — no WebGL context recreation between scenes
- **Particle systems**: `@tsparticles/slim` preset keeps particle bundle under 50KB
- **GSAP**: Contexts scoped to components prevent memory leaks
- **DPR cap**: Canvas `dpr={[1, 2]}` prevents 3x pixel ratio on high-density screens
- **Audio**: Howler loads audio lazily, only on first play or explicit preload call

---

## Coding Conventions

- **JavaScript only** — no TypeScript
- **Functional components only** — class components only for `ErrorBoundary`
- **Named exports** for utilities and hooks; default exports for components and pages
- **`@/` aliases** — never use relative `../../` imports
- **Constants over strings** — always import from `src/constants/`
- **No inline styles** except in `ErrorBoundary` (CSS independence) and `AssetLoader`
- **useLayoutEffect** for GSAP animations (synchronous DOM reads)
- **useEffect** for event subscriptions and side effects
- **JSDoc comments** on all exported functions

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `SceneWrapper.jsx` |
| Hooks | camelCase with `use` prefix | `useAnimation.js` |
| Engine managers | PascalCase | `SceneManager.js` |
| Constants | SCREAMING_SNAKE_CASE | `SCENE_STATE.ACTIVE` |
| CSS classes | kebab-case | `glow-gold` |
| Asset files | kebab-case | `castle-theme.mp3` |
| Scene folders | PascalCase | `scenes/NightSky/` |
| Event names | `namespace:action` | `scene:enter:complete` |

---

## Component Structure

Every component follows this structure:

```
ComponentName/
  index.jsx    — Main component (or single file for simple components)
  README.md    — (optional) for complex components
```

Component file order:
1. Imports (React first, then external libs, then internal `@/` imports)
2. Constants / local config
3. Sub-components (if any)
4. Main component function
5. Default export

---

## Reusable Component Rules

- A component is reusable if it can be placed in any scene without modification
- Reusable components live in `components/common/`, `components/ui/`, or `components/animations/`
- Scene-specific components live inside their scene folder
- Props should have sensible defaults — no required props without documentation
- Never couple a reusable component to a specific scene or engine manager
- Test reusable components in isolation before integrating

---

## Future Scalability

The architecture supports adding new scenes without modifying existing files:

1. Create `src/scenes/NewScene/index.jsx`
2. Add a constant to `src/constants/scenes.js` and `SCENE_SEQUENCE`
3. Add a route path to `src/config/routes.js`
4. Add a lazy import and `<Route>` to `src/router/AppRouter.jsx`
5. Add a transition entry to `src/constants/transitions.js`
6. Add assets to `src/config/assets.js`

Zero modification to any existing scene or engine file required.
