# Asset Guide — Complete Asset Reference

## Overview

This document defines every asset required for the Disney Princess Birthday Experience, where each asset belongs, what format to use, and how to optimize it. Follow this guide exactly when adding assets in future phases.

All runtime assets belong in `public/` (served by Vite as-is). Source/original files may be kept in `src/assets/` but are not directly imported — they are referenced via the asset manifest (`src/config/assets.js`).

---

## Directory Structure

```
public/
├── audio/
│   ├── music/
│   └── sfx/
├── fonts/
│   └── (self-hosted fonts only)
└── models/
    └── (GLTF/GLB 3D models)

src/assets/
├── images/
│   ├── princess/       ← Princess illustrations, portraits, crowns
│   ├── castle/         ← Castle illustrations, towers, silhouettes
│   ├── backgrounds/    ← Sky gradients, textures, night backgrounds
│   ├── gallery/        ← Personal photographs (10–20 photos)
│   ├── cake/           ← Cake illustrations, slice, candles
│   ├── balloons/       ← Balloon PNGs in multiple colors
│   └── certificates/   ← Certificate borders, seals, ribbons
├── audio/
│   ├── music/          ← Background music tracks (MP3)
│   └── sfx/            ← Short sound effects (MP3/OGG)
├── fonts/              ← Font files if self-hosting
├── models/             ← Original high-res GLB files (before compression)
├── textures/           ← PBR textures for 3D models
├── hdr/                ← HDR environment maps (.hdr / .exr)
└── shaders/            ← Custom GLSL shader files (.glsl / .vert / .frag)
```

---

## Images

### Format Recommendations

| Use Case | Recommended Format | Why |
|---|---|---|
| Photographs | WebP (primary), JPG (fallback) | Best compression for photos |
| Illustrations with transparency | WebP (primary), PNG (fallback) | Lossless alpha channel |
| Simple icons / logos | SVG | Infinitely scalable, tiny file size |
| Backgrounds (no transparency) | WebP | Superior compression |
| Textures (Three.js) | JPEG | No alpha needed, universal support |
| HDR environments | `.hdr` or `.exr` | Standard HDR format |

### Compression Targets

| Asset Type | Max File Size | Tool |
|---|---|---|
| Personal photo | 200KB per image | Squoosh, Sharp |
| Background texture | 150KB | Squoosh |
| Illustration | 100KB | SVGO (SVG), Squoosh (raster) |
| 3D texture | 512KB | Basis Universal, KTX2 |
| HDR environment | 2MB | HDRi converter |

---

### `images/princess/`

Assets for the Princess Entrance scene and any princess-themed overlays.

| File | Description |
|---|---|
| `princess-silhouette.webp` | Dark silhouette for entrance reveal |
| `princess-portrait.webp` | Full princess illustration or masked photo |
| `crown.webp` | Crown illustration (or use 3D model) |
| `crown-sparkle.webp` | Crown with sparkle overlay |
| `rose-petal.webp` | Single rose petal sprite for particle system |

**Dimensions:** Portrait images: 800×1200px. Overlay sprites: 200×200px.

---

### `images/castle/`

Assets for the Castle Reveal scene.

| File | Description |
|---|---|
| `castle-silhouette.webp` | Dark silhouette for door-open reveal |
| `castle-illustration.webp` | Full color castle illustration |
| `castle-window-glow.webp` | Glow overlay for animated windows |
| `castle-banner.svg` | Decorative banner flags |
| `moon.webp` | Moon asset for night sky (if not 3D) |

**Dimensions:** Castle full: 1920×1080px. Silhouette: same. Moon: 400×400px.

---

### `images/backgrounds/`

Full-screen background images and gradient textures.

| File | Description |
|---|---|
| `night-gradient.webp` | Deep night sky gradient (no stars — stars are particles) |
| `loading-bg.webp` | Subtle dark texture for loading screen |
| `welcome-bg.webp` | Soft magical gradient for welcome |
| `letter-paper.webp` | Aged parchment texture for letter scene |
| `certificate-paper.webp` | Formal paper texture for certificate |
| `stars-overlay.webp` | Optional subtle star texture (if not using particles) |

**Dimensions:** All backgrounds: 1920×1080px minimum. Export at 2x for retina.

---

### `images/gallery/`

Personal photographs for the memory gallery. See **PHOTO_GUIDE.md** for full specifications.

**Naming convention:** `photo-001.webp`, `photo-002.webp`, ... `photo-020.webp`

**Thumbnails:** `photo-001-thumb.webp` (200×200px cropped center)

---

### `images/cake/`

Assets for the Cake scene (if not using 3D model).

| File | Description |
|---|---|
| `cake-full.webp` | Birthday cake illustration (if 2D fallback) |
| `cake-slice.webp` | Cut cake cross-section |
| `candle-flame.webp` | Candle flame sprite sheet |
| `smoke-wisp.webp` | Smoke rising sprite |
| `knife.webp` | Cake knife illustration |

---

### `images/balloons/`

Individual balloon sprites in the brand color palette.

| File | Description |
|---|---|
| `balloon-gold.webp` | Gold balloon with ribbon |
| `balloon-royal.webp` | Royal purple balloon |
| `balloon-rose.webp` | Rose pink balloon |
| `balloon-fairy.webp` | Fairy teal balloon |
| `balloon-white.webp` | White/silver balloon |

**Dimensions:** 150×220px per balloon (portrait). Include ribbon in the image.

---

### `images/certificates/`

Decorative elements for the birthday certificate.

| File | Description |
|---|---|
| `certificate-border.webp` | Ornate gold border frame |
| `wax-seal.webp` | Red/gold wax seal |
| `ribbon-left.webp` | Left decorative ribbon |
| `ribbon-right.webp` | Right decorative ribbon |
| `certificate-star.svg` | Star ornament |

---

## Audio

### Format Recommendations

| Use Case | Format | Why |
|---|---|---|
| Background music | MP3 (192kbps) | Universal browser support, good quality |
| Sound effects | MP3 (128kbps) or OGG | Small file size |
| High-quality music | OGG Vorbis | Better quality at same bitrate |

> Always provide MP3 as the primary format. OGG as fallback for Firefox.
> Howler.js accepts array of sources: `src: ['track.ogg', 'track.mp3']`

### Compression Targets

| Asset Type | Max File Size |
|---|---|
| Music track (full scene) | 3MB per track |
| Music track (short jingle) | 500KB |
| Sound effect | 100KB |
| Ambient loop | 1MB |

---

### `audio/music/`

One track per scene. All tracks should loop seamlessly if marked as ambient.

| File | Scene | Loop | Duration |
|---|---|---|---|
| `loading-theme.mp3` | Loading | Yes | 60s+ |
| `auth-theme.mp3` | Authentication | Yes | 30s+ |
| `welcome-fanfare.mp3` | Welcome | No | 10–15s |
| `night-sky-ambient.mp3` | Night Sky | Yes | 60s+ |
| `castle-theme.mp3` | Castle Reveal | No | 20–30s |
| `princess-entrance.mp3` | Princess | No | 15–20s |
| `celebration-jingle.mp3` | Balloons | Yes | 30s+ |
| `happy-birthday-orchestral.mp3` | Cake | No | 45s |
| `gallery-waltz.mp3` | Gallery | Yes | 90s+ |
| `letter-piano.mp3` | Letter | Yes | 120s+ |
| `game-theme.mp3` | Games | Yes | 60s+ |
| `achievement-fanfare.mp3` | Certificate | No | 10s |
| `feedback-gentle.mp3` | Feedback | Yes | 60s+ |
| `grand-finale.mp3` | Finale | No | 30s |

---

### `audio/sfx/`

Short, punchy sound effects.

| File | Trigger | Duration |
|---|---|---|
| `magic-wand.mp3` | Scene transitions | 0.5–1s |
| `firework-burst.mp3` | Firework explosion | 0.5–1s |
| `firework-launch.mp3` | Firework launch | 0.3s |
| `candle-blow.mp3` | Candle extinguish | 0.8s |
| `cake-cut.mp3` | Cake cutting | 0.5s |
| `balloon-pop.mp3` | Balloon pop | 0.3s |
| `sparkle.mp3` | Sparkle particles | 0.4s |
| `page-flip.mp3` | Letter page turn | 0.3s |
| `button-click.mp3` | UI interactions | 0.1s |
| `success-chime.mp3` | Game win, auth success | 1s |
| `transition-whoosh.mp3` | Scene transitions | 0.6s |
| `card-flip.mp3` | Memory game cards | 0.3s |
| `match-found.mp3` | Memory match success | 0.8s |
| `envelope-send.mp3` | Feedback submitted | 0.6s |

---

## 3D Models

### Format Recommendations

| Format | When to Use |
|---|---|
| `.glb` | Primary format — binary GLTF, includes all textures |
| `.gltf` | When textures need to be separate files |

### Compression

All models must be compressed with **Draco** compression via `gltf-pipeline`:

```bash
gltf-pipeline -i model.glb -o model.draco.glb --draco.compressionLevel 7
```

### Size Targets

| Model | Max File Size | Polygon Count |
|---|---|---|
| Birthday Cake | 1.5MB | 10,000–20,000 |
| Castle | 2MB | 20,000–40,000 |
| Crown | 500KB | 5,000–10,000 |
| Princess character | 2MB | 15,000–30,000 |

---

### `models/`

| File | Scene | Notes |
|---|---|---|
| `birthday-cake.glb` | Cake | Multi-layer, candles included, cut-section variant |
| `castle.glb` | Castle | Include LOD variants for mobile |
| `crown.glb` | Princess | Small, decorative |
| `princess.glb` | Princess | Optional — may use illustration instead |

---

## Textures

All textures used by Three.js materials must be:
- **Power of 2** dimensions: 256, 512, 1024, 2048px
- **Compressed**: Use KTX2 / Basis Universal for runtime compression
- **Mip-mapped**: Vite/Three.js handles this automatically

| File | Used By | Format | Dimensions |
|---|---|---|---|
| `starfield.png` | Night Sky | PNG | 2048×2048 |
| `cake-frosting.jpg` | Cake model | JPEG | 1024×1024 |
| `castle-stone.jpg` | Castle model | JPEG | 2048×2048 |
| `certificate-paper.jpg` | Certificate | JPEG | 1024×1024 |

---

## HDR Environments

HDR environments provide realistic Image Based Lighting (IBL) for 3D scenes.

| File | Scene | Size |
|---|---|---|
| `night-sky.hdr` | Night Sky, Castle | < 5MB |
| `golden-interior.hdr` | Princess, Cake | < 3MB |

Use `@react-three/drei`'s `<Environment files="..." />` for easy HDR loading.

---

## Fonts

Google Fonts (loaded via `<link>` in `index.html`):
- **Playfair Display** — Display headings, titles
- **Dancing Script** — Handwritten script text
- **Outfit** — UI body text

Self-hosted fonts (in `public/fonts/`) — only add if Google Fonts reliability is a concern:
- Format: `.woff2` (primary), `.woff` (fallback)
- Declare in `src/styles/fonts.css`

---

## Shaders

Custom GLSL shaders for advanced visual effects.

| File | Effect | Scene |
|---|---|---|
| `candle-flame.vert` | Flame vertex wobble | Cake |
| `candle-flame.frag` | Flame color gradient | Cake |
| `sparkle.frag` | Sparkle dissolve effect | Transitions |
| `water-ripple.frag` | Castle moat reflection (future) | Castle |

Shaders are loaded as raw text via Vite's `?raw` import:

```js
import flameVert from '@assets/shaders/candle-flame.vert?raw';
```

---

## Asset Manifest Registration

Every asset added to `public/` must be registered in `src/config/assets.js`:

```js
export const ASSET_MANIFEST = {
  music: {
    castle: '/audio/music/castle-theme.mp3',
    // Add new tracks here
  },
  sfx: {
    balloonPop: '/audio/sfx/balloon-pop.mp3',
    // Add new SFX here
  },
  models: {
    cake: '/models/birthday-cake.glb',
    // Add new models here
  },
};
```

The `AssetManager` reads this manifest to preload and cache assets. Never reference asset paths directly in components — always use `AssetManager.get('music.castle')`.
