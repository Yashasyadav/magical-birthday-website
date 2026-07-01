# Disney Princess Birthday Experience

![Disney Princess Birthday Experience Overview](https://via.placeholder.com/1200x400/0d0a1e/fbbf24?text=Disney+Princess+Birthday+Experience)

## Project Overview

Welcome to the **Disney Princess Birthday Experience** — a premium, interactive, cinematic web application designed to deliver an unforgettable, personalized birthday journey. This is not a standard birthday website; it is an orchestrated, scene-by-scene interactive fairy tale built with modern web technologies.

The experience leads the birthday person through magical night skies, a grand castle reveal, a personalized memory gallery, interactive 3D birthday cake cutting, heartfelt letters, and celebratory mini-games, culminating in a spectacular grand finale.

---

## Architecture at a Glance

The project utilizes a custom **Game Engine-inspired architecture** built on top of React. It strictly separates the core logic (Engine Layer) from the view (Component Layer).

- **Engine Layer:** Singleton managers (Scene, Audio, Asset, Camera, Animation, Lighting, Transition) controlling the core experience state.
- **Component/Context Layer:** React Providers and Hooks connecting the engine to the UI.
- **Scene Layer:** 14 lazy-loaded route-based scene slots ensuring smooth transitions and optimal code-splitting.

> 📖 **Read the Full Documentation:** For detailed insights, please read the [Architecture Guide](./ARCHITECTURE.md) and [Scene Flow Guide](./SCENE_FLOW.md).

---

## Technology Stack

- **Framework:** React 18+ & Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` configuration)
- **3D Graphics:** Three.js, React Three Fiber, @react-three/drei
- **Animations:** GSAP (Master timelines), Framer Motion (Declarative UI transitions)
- **Audio:** Howler.js (Music and SFX orchestration)
- **Particles:** @tsparticles/react & @tsparticles/slim

---

## Directory Structure

```text
project/
├── docs/                 # Master Blueprint Documentation
├── public/               # Runtime static assets (audio, fonts, 3D models)
├── src/
│   ├── assets/           # Source media, illustrations, textures, photos
│   ├── components/       # Reusable React components (UI, layouts, 3D, effects)
│   ├── config/           # Theme, routes, and asset manifests
│   ├── constants/        # Enums for scenes, transitions, and audio
│   ├── context/          # React Context providers linking to Engine layer
│   ├── engine/           # Singleton Managers (The Core Logic)
│   ├── helpers/          # Formatting and validation functions
│   ├── hooks/            # Custom React hooks bridging engine and components
│   ├── router/           # AppRouter and lazy-loaded route definitions
│   ├── scenes/           # The 14 individual interactive scenes
│   ├── services/         # External API integrations (e.g., Google Sheets)
│   ├── styles/           # Global CSS, Tailwind v4 @theme, keyframes
│   ├── utils/            # Pure JavaScript utility functions
│   ├── App.jsx           # Root provider assembly
│   └── main.jsx          # Application entry point
└── package.json
```

---

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file at the project root:
   ```env
   VITE_SHEETS_URL=your_google_sheets_macro_url
   VITE_SECRET_ANSWER=your_hashed_auth_answer
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## Build & Deployment

To create a production-optimized build:

```bash
npm run build
```

This will generate a `dist/` directory containing the heavily optimized, chunk-split application. You can preview the production build locally using:

```bash
npm run preview
```

**Deployment:** The `dist/` folder can be deployed to any static hosting provider (Vercel, Netlify, GitHub Pages, Firebase Hosting, AWS S3).

---

## Project Documentation Master List

Before contributing to this project, you **must** review the following documents located in the `docs/` folder:

1. [ARCHITECTURE.md](./ARCHITECTURE.md) — System design and folder responsibilities.
2. [SCENE_FLOW.md](./SCENE_FLOW.md) — Complete scene-by-scene experience map.
3. [ASSET_GUIDE.md](./ASSET_GUIDE.md) — How to format, compress, and register assets.
4. [PHOTO_GUIDE.md](./PHOTO_GUIDE.md) — Guidelines for personal photographs.
5. [MUSIC_GUIDE.md](./MUSIC_GUIDE.md) — Audio orchestration and crossfade strategies.
6. [GAME_FLOW.md](./GAME_FLOW.md) — Mini-game logic and scoring mechanics.
7. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — Colors, typography, timing, and UI rules.
8. [PROJECT_RULES.md](./PROJECT_RULES.md) — **CRITICAL:** Permanent rules for future phases.
9. [TIMELINE.md](./TIMELINE.md) — Phase-by-phase development roadmap.

---

## Contribution Guide

This project enforces strict rules to maintain its cinematic quality and stable architecture.

- **Never Overwrite Existing Code:** Always extend. If a utility exists, use it.
- **Maintain the Engine Layer:** Keep React components strictly in the UI layer. All complex state belongs in `src/engine/`.
- **Use Constants:** Never use string literals for scenes or audio tracks. Use `src/constants/`.
- **Optimize Assets:** Ensure all images are WebP, 3D models are Draco compressed, and audio is appropriately downsampled.
- **Test on Mobile:** The experience must remain magical on small screens. Ensure touch targets are large and particle counts are reduced for performance.

> ⚠️ **Read [PROJECT_RULES.md](./PROJECT_RULES.md) carefully before submitting a pull request.**

---

## Project Roadmap

- **Phase 0:** Architecture & Foundation *(Completed)*
- **Phase 0.5:** Master Blueprint Documentation *(Completed)*
- **Phase 1:** The First Impression (Loading & Authentication)
- **Phase 2:** The Magical Welcome (Welcome & Night Sky)
- **Phase 3:** The Grand Entrance (Castle & Princess)
- **Phase 4:** Celebration (Balloons & Gallery)
- **Phase 5:** The Climax (3D Cake & Candle Interaction)
- **Phase 6:** Emotion & Play (Letter & Mini Games)
- **Phase 7:** Conclusion (Certificate, Feedback, & Finale)

---

## License

[License Placeholder - Include intended licensing terms here, e.g., MIT, Proprietary, etc.]

## Acknowledgements

- Built with React, Vite, and Three.js
- Disney-inspired magical aesthetic
- Animations powered by GSAP and Framer Motion
- Particles by tsParticles
