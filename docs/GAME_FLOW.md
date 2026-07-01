# Game Flow — Mini Games Documentation

## Overview

The Disney Princess Birthday Experience contains exactly **two mini-games** hosted within the `/games` route. Games appear sequentially after the Friendship Letter scene. Both games are designed to be:

- **Accessible** — playable on mobile touch and desktop mouse/keyboard
- **Brief** — completable in under 3 minutes each
- **Celebratory** — themed with the Disney Princess aesthetic
- **Non-blocking** — always offer a "skip" option

> **Status:** This document defines the game design only. Implementation occurs in a future phase. Do not build these games now.

---

## Game 1 — Balloon Pop

### Concept

A joyful, fast-paced clicking game where the user pops as many colorful balloons as possible before time runs out. Simple, satisfying, and thematically connected to the Balloon Celebration scene.

---

### Goal

Pop as many balloons as possible within **60 seconds**.

The final score is presented with a celebratory animation and message tailored to the score (e.g., "Balloon Maestro!", "Sparkle Champion!").

---

### Controls

| Input | Action |
|---|---|
| Mouse click | Pop balloon under cursor |
| Touch tap | Pop balloon at touch point |
| Spacebar | Pop the lowest balloon (accessibility fallback) |

---

### Gameplay Mechanics

| Mechanic | Detail |
|---|---|
| Balloon speed | Slow at start, gradually increases every 10 seconds |
| Balloon count | 5–8 balloons visible at any time |
| Balloon size | Varies (larger = easier, smaller = more points) |
| Balloon colors | Brand palette: gold, royal, rose, fairy, white |
| Spawn rate | Every 1.5s initially → 0.8s at 45s mark |
| Miss penalty | None — misses do not deduct points |
| Combo system | Pop 3+ in 2 seconds: x2 multiplier for next 5 pops |

### Scoring

| Action | Points |
|---|---|
| Large balloon pop | 10 points |
| Medium balloon pop | 20 points |
| Small balloon pop | 50 points |
| Combo (x2 active) | Double points |

### Score Tiers

| Score | Message | Trophy |
|---|---|---|
| 0–100 | "Great start, birthday star!" | ⭐ |
| 101–250 | "Balloon Buster!" | ⭐⭐ |
| 251–500 | "Princess of Pops!" | ⭐⭐⭐ |
| 501+ | "Legendary Balloon Queen!" | 👑 |

---

### Visual Design

- **Background**: Deep night sky gradient (consistent with Night Sky scene)
- **Balloons**: SVG or PNG sprites from `src/assets/images/balloons/`
- **Ribbon**: Each balloon has an animated dangling ribbon (CSS animation)
- **Pop effect**: Particle burst in balloon's color (30 particles, 300ms)
- **Timer**: Circular countdown ring in gold, top-right corner
- **Score**: Large, glowing number in gold, top-left corner
- **Combo indicator**: Appears center-screen with a scale-in bounce when activated

---

### Winning Animation

When time runs out:

1. All remaining balloons float off-screen upward (800ms)
2. Score counter animates to final value with a counting-up effect
3. Trophy icon drops in with a Disney-bounce (back.out easing)
4. Score message appears with typewriter effect
5. Confetti burst using `CONFETTI_CONFIG` particle preset
6. "Continue →" button fades in after 2 seconds

---

### Sound Effects

| Event | SFX |
|---|---|
| Balloon pop | `SFX.BALLOON_POP` (play 1 of 3 variants randomly) |
| Combo activated | `SFX.SUCCESS` |
| Timer running out (last 10s) | Ticking sound (future) |
| Game complete | `SFX.SUCCESS` + `achievement-fanfare.mp3` |

---

### Mobile Considerations

- Touch targets minimum 60×80px (balloon minimum size on mobile)
- No right-click dependency
- Ensure balloons are large enough to tap comfortably with a thumb
- Reduce simultaneous balloon count to 4 on screens < 768px

---

### Performance Considerations

- Balloons animated with CSS `transform` only (GPU-accelerated)
- Pop particle bursts: max 30 particles each, auto-destroy after 500ms
- Cap simultaneous particle systems: max 3 active burst systems
- Use `requestAnimationFrame` for game loop — never `setInterval`
- Score updates: debounce DOM updates to every 100ms

---

### Possible Future Upgrades

- **Boss balloon**: Every 30s, a giant balloon worth 100 points appears for 3 seconds
- **Power-ups**: "Freeze" (slows all balloons for 3s), "Double" (2x all points for 5s)
- **Two-player mode**: Split-screen on desktop
- **Leaderboard**: Google Sheets integration to save top scores
- **Custom balloon colors** matching birthday theme

---

---

## Game 2 — Memory Match

### Concept

A classic card-matching memory game with a Disney Princess twist. Cards feature icons, symbols, or mini illustrations from the experience (cake, crown, castle, balloon, star, rose, etc.). Find all matching pairs to win.

---

### Goal

Find all matching card pairs by flipping two cards at a time. Complete the board to win.

---

### Controls

| Input | Action |
|---|---|
| Mouse click | Flip the clicked card |
| Touch tap | Flip the tapped card |
| Tab + Enter | Navigate cards with keyboard (accessibility) |

---

### Difficulty

| Difficulty | Grid | Pairs | Time Limit |
|---|---|---|---|
| **Easy** (default) | 4×3 | 6 pairs | None |
| Medium | 4×4 | 8 pairs | None |
| Hard | 4×5 | 10 pairs | 3 minutes |

> For Phase N, start with Easy (4×3) for the birthday experience. Difficulty selection can be added later.

---

### Gameplay Mechanics

| Mechanic | Detail |
|---|---|
| Initial reveal | All cards briefly face-up for 2 seconds at start |
| Flip limit | No limit — flip as many times as needed |
| Flip duration | 600ms card-flip CSS animation |
| Match feedback | Matched cards glow gold and stay face-up |
| Mismatch feedback | Cards briefly shake, then flip back (1000ms delay) |
| Win condition | All pairs found |

### Card Symbols

Use Disney-themed symbols consistent with the experience:

| Symbol | Represents |
|---|---|
| 🎂 Cake | Birthday cake |
| 👑 Crown | Princess |
| 🏰 Castle | Castle scene |
| 🎈 Balloon | Balloon scene |
| ⭐ Star | Magic stars |
| 🌹 Rose | Princess roses |
| 🎆 Firework | Fireworks scene |
| 🦋 Butterfly | Transformation |
| 💎 Diamond | Luxury |
| 🌙 Moon | Night sky |

---

### Scoring

| Action | Points |
|---|---|
| Match found | 100 points |
| Match on first attempt (both cards) | 200 points (bonus) |
| Each move (flip pair) | -5 points (encourages efficiency) |

### Score Tiers

| Score | Message |
|---|---|
| < 300 | "Every princess learns, keep going!" |
| 300–500 | "Memory Maven!" |
| 500–700 | "Princess of Puzzles!" |
| 700+ | "Magical Memory Mastermind!" |

---

### Visual Design

- **Card back**: Gold-bordered card with a sparkle pattern, royal purple background
- **Card face**: Symbol on a dark night-gradient background with soft glow
- **Card flip**: CSS 3D `rotateY` transform — 300ms per half-flip
- **Matched cards**: Persistent gold glow, slight scale-up (1.05x), non-interactive
- **Mismatch cards**: Red tint flash → shake animation → flip back
- **Board**: Centered on screen with subtle grid lines in dark purple

---

### Card Flip Animation

```
State:        FACE-DOWN → [flip] → FACE-UP
Transform:    rotateY(0°)  →  rotateY(180°)
Duration:     300ms per half (600ms total)
Easing:       ease-in-out
Perspective:  1000px (on card container)
```

The card back is visible from `0°` to `89°`, the card face from `91°` to `180°` (backface-visibility: hidden on both sides).

---

### Winning Condition & Animation

When all pairs are found:

1. All cards pulse with a golden glow simultaneously (800ms)
2. Stars and sparkles burst from every card
3. Score final tally with counting animation
4. Winner message drops in with Disney-bounce
5. Confetti burst (CONFETTI_CONFIG)
6. "Collect Your Certificate →" button appears (leads to Certificate scene)

---

### Move Counter & Timer

- **Moves counter**: Displayed top-left — tracks how many pairs the user has flipped
- **Timer**: Only shown in Hard mode — circular countdown top-right
- **Best time**: Not stored across sessions (single-session experience)

---

### Accessibility

- All cards have `aria-label` describing their state ("Card 1, face down", "Card 1, Princess crown, matched")
- Keyboard navigation via Tab key cycles through unmatched cards
- Matches are announced via `aria-live` region
- Color is not the only indicator — matched cards also have a distinct icon overlay

---

### Performance Considerations

- All card animations use CSS `transform` only
- No JavaScript-driven animation loops — CSS transitions handle all card flips
- Board re-renders only on state changes (memoized card components)
- Maximum 20 cards on screen (4×5 Hard mode) — well within DOM performance limits

---

### Possible Future Upgrades

- **Custom card faces**: Replace symbols with personal photos from the gallery
- **Timed mode**: Race against the clock
- **Animation themes**: Different card designs for different Disney princess themes
- **Progress saving**: Store game state in `sessionStorage` for page refresh
- **Multiplayer**: Two players take turns on the same device
