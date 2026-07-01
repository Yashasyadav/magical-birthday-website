# Photo Guide — Personal Photography Specifications

## Overview

The Disney Princess Birthday Experience will contain **10 to 20 personal photographs** displayed in the Memory Gallery scene (`/gallery`). This guide defines every requirement for preparing, naming, optimizing, and presenting those photographs so they integrate seamlessly into the cinematic experience.

---

## Recommended Specifications

### Resolution

| Orientation | Display Size | Source Resolution | Export Resolution |
|---|---|---|---|
| Landscape | Full width (1920px) | Minimum 2400×1600px | 1920×1280px |
| Portrait | Half width (960px) | Minimum 1200×1600px | 960×1280px |
| Square (Instagram) | 1080×1080px | Minimum 1200×1200px | 1080×1080px |

> **Rule:** Source photos should always be larger than the export size so downscaling sharpens rather than pixelates.

---

## Aspect Ratio

The gallery supports three aspect ratios. Choose one per photo:

| Ratio | Use Case | CSS Class |
|---|---|---|
| `16:9` | Landscape scenes, group photos | `.photo-landscape` |
| `3:4` | Portrait shots, formal photos | `.photo-portrait` |
| `1:1` | Social-style, close-ups | `.photo-square` |

> **Recommendation:** Standardize on **3:4 portrait** for all gallery photos for visual consistency. Mixed ratios require more complex layout logic.

---

## Naming Convention

All gallery photos must follow this exact naming pattern:

```
photo-[sequence-number]-[short-description].webp
```

**Examples:**
```
photo-001-birthday-smile.webp
photo-002-with-friends.webp
photo-003-graduation.webp
photo-004-beach-trip.webp
```

### Rules:
- Zero-padded sequence number: `001`, `002`, ... `020`
- Description: lowercase, hyphens only, no spaces, max 3 words
- Extension: always `.webp` (with `.jpg` fallback if needed)
- No special characters, no capital letters

---

## Thumbnail Specifications

Each photo requires a **thumbnail variant** for the gallery index and lazy loading placeholder:

```
photo-001-birthday-smile-thumb.webp
```

| Property | Value |
|---|---|
| Dimensions | 400×300px (landscape) or 300×400px (portrait) |
| Quality | 60–70% WebP quality |
| File size target | Under 30KB |
| Blur | Apply 2px blur (reduces perceived quality loss) |

Thumbnails are loaded immediately. Full-resolution images load only when the photo enters the viewport.

---

## File Format & Compression

### Primary Format: WebP

```bash
# Using cwebp (Google's WebP encoder)
cwebp -q 82 input.jpg -o photo-001-birthday-smile.webp

# Using Sharp (Node.js)
sharp('input.jpg').webp({ quality: 82 }).toFile('photo-001.webp')

# Using Squoosh (browser-based GUI)
# Settings: WebP, Quality 82, Smart Subsample: On
```

### Fallback Format: JPEG

For browsers that do not support WebP (rare but possible):
```bash
convert input.jpg -quality 85 photo-001-birthday-smile.jpg
```

### Quality Targets

| Photo Type | WebP Quality | Max File Size |
|---|---|---|
| Hero / featured photo | 90 | 300KB |
| Standard gallery photo | 82 | 200KB |
| Thumbnail | 70 | 30KB |

---

## Cropping Guidelines

### Portrait Photos (3:4)
- Subject should fill 60–80% of the frame
- Face/head in the upper third of the image
- Avoid cropping at joints (wrists, elbows, knees)
- Leave breathing room (10% margin) around the subject

### Landscape Photos (16:9)
- Main subject should be in the left or center third (rule of thirds)
- Avoid heavy cropping — landscape photos should feel open and spacious
- Ensure horizon is level

### Square Photos (1:1)
- Subject centered, or intentionally off-center for artistic effect
- Crop tight on faces for close-up portraits

---

## Portrait Orientation

Portrait photos (3:4 ratio) in the gallery:

- Display with a **soft vignette** around the edges
- Animate in with a **vertical slide up** from below
- Background: dark gradient or blurred version of the photo itself (CSS `backdrop-filter`)
- Optional film grain overlay for vintage warmth

---

## Landscape Orientation

Landscape photos (16:9 ratio) in the gallery:

- Display full-width with a **horizontal wipe** reveal
- Optional **Ken Burns effect**: slow zoom from 100% to 105% scale over 8 seconds
- Dark gradient overlay at the bottom for caption legibility

---

## Lazy Loading Strategy

Gallery photos should **never** all load simultaneously. The loading sequence:

```
Phase 1: Thumbnails of photos 1–5 (on scene mount)
Phase 2: Full photo 1 (immediately)
Phase 3: Full photos 2–3 (while photo 1 is displayed)
Phase 4: Full photos 4–5 (while photos 2–3 are displayed)
... and so on
```

Implementation approach:
- Use `AssetManager.preload()` to load the next 2–3 photos ahead of the current one
- `usePreloader()` hook inside the Gallery scene manages this queue
- `IntersectionObserver` as a fallback for scroll-triggered loading

---

## Photo Reveal Sequence

The gallery reveals photos in a **cinematic sequence**, not a grid:

1. **Thumbnail fade-in** (all visible thumbnails, 200ms stagger)
2. **Selection**: User clicks/swipes to choose a photo
3. **Full-screen reveal**: Selected photo scales from thumbnail to full-screen (300ms, ease-out-back)
4. **Caption reveal**: Text fades in from below (200ms delay)
5. **Ambient particles**: Soft sparkles drift around the active photo
6. **Advance**: Swipe left/right or arrow key to next photo (cross-fade 400ms)
7. **Exit**: Photo scales back to thumbnail, next enlarges

---

## Animation Strategy

Each photo in the gallery uses these Framer Motion variants:

| State | Animation |
|---|---|
| Entering (thumbnail) | `opacity: 0 → 1`, `scale: 0.9 → 1` (200ms) |
| Active (full-screen) | `scale: 1 → 1.02` continuous breathe |
| Ken Burns | `scale: 1 → 1.08` over 8s linear |
| Exiting | `opacity: 1 → 0`, `scale: 1 → 0.95` (150ms) |

---

## Caption System

Each photo should have an optional caption. Captions are stored in a configuration array:

```js
// src/config/gallery.js (Phase N — do not create now)
export const GALLERY_CAPTIONS = [
  { id: 'photo-001', caption: 'The day everything changed ✨', year: '2020' },
  { id: 'photo-002', caption: 'Adventures together', year: '2021' },
  // ...
];
```

Caption typography: **Dancing Script** (script font), centered, white with text shadow.

---

## How to Replace Photos Later

When the birthday person's photos are ready, follow these steps:

1. **Prepare photos** according to the resolution and naming convention above
2. **Export WebP** using the compression settings above
3. **Generate thumbnails** using the thumbnail spec above
4. **Place files** in `src/assets/images/gallery/`
5. **Update manifest** in `src/config/assets.js` under the `images.gallery` key
6. **Update captions** in `src/config/gallery.js` (Phase N)
7. **No component code changes required** — the gallery component reads from config

---

## Privacy Considerations

- Personal photos should never be committed to a public GitHub repository
- Add `src/assets/images/gallery/` to `.gitignore` for public repos
- For production deployment, photos should be uploaded separately or via environment-specific storage
- Consider watermarking or disabling right-click on displayed photos

---

## Photo Count Recommendations

| Count | Experience Quality | Notes |
|---|---|---|
| 5–8 photos | Minimal | Works but feels brief |
| 10–12 photos | **Recommended** | Sweet spot for engagement |
| 15–20 photos | Rich | Full gallery feel, longer session |
| 20+ photos | Excessive | Users lose interest after ~15 |
