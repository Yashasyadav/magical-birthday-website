# Project Rules — Permanent Development Guidelines

> These rules apply to every phase, every developer, and every future AI assistant working on this project. They are non-negotiable. Breaking these rules will cause architectural drift, bugs, and wasted effort.

---

## Rule 1 — Never Overwrite Existing Code

When implementing a new feature, you must **add to** existing code — never replace it.

- ✅ Add a new function to an existing utility file
- ✅ Add a new scene below existing scenes in `AppRouter.jsx`
- ✅ Add a new constant to `constants/scenes.js`
- ❌ Replace an existing utility function with a "better" version without migrating all callers
- ❌ Rewrite a component from scratch when a bug fix would suffice
- ❌ Delete and recreate files

---

## Rule 2 — Never Duplicate Utilities

Before writing a new utility function, search the codebase:

```
src/utils/
src/helpers/
src/engine/
```

If a similar function exists, extend or import it. Duplicate utilities lead to inconsistent behavior and maintenance nightmares.

- ✅ `import { lerp } from '@utils/mathUtils'`
- ❌ Writing `const lerp = (a, b, t) => ...` directly in a component

---

## Rule 3 — Always Extend the Architecture

New features must plug into the existing engine layer:

- New 3D scenes use `ThreeCanvas` — never create a new Canvas
- New music uses `SoundManager` — never instantiate Howl directly
- New assets register in `config/assets.js` — never hardcode asset paths
- New animations use `AnimationManager` — never import GSAP directly in scenes
- New scenes add to `SCENE_SEQUENCE` — never hardcode scene order elsewhere

---

## Rule 4 — Never Rename Folders

Folder names are part of the architecture contract. Renaming a folder breaks:

- Vite path aliases (`@scenes/`, `@engine/`, etc.)
- All import statements that reference that folder
- The mental model established across all documentation

If a folder name seems wrong, document the concern in an issue — do not rename.

---

## Rule 5 — Keep Components Reusable

A component is reusable if it can be used in any scene without modification.

**Questions to ask before creating a component:**

1. Does this component depend on a specific scene? → Put it in the scene folder
2. Could another scene use this component? → Put it in `components/common/` or `components/ui/`
3. Does this component import from a specific scene? → It is not reusable — refactor

---

## Rule 6 — Prefer Composition Over Duplication

When two scenes need similar behavior:

- ✅ Extract the shared logic into a hook or utility
- ✅ Create a shared base component and extend it
- ❌ Copy-paste the code into both scenes

Example: Two scenes need a floating particle effect → Create a `FloatingParticles` component in `components/effects/` and use it in both.

---

## Rule 7 — Lazy Load Heavy Assets

Never import large assets (images, 3D models, audio) at the module level.

- ✅ Register in `config/assets.js` → use `AssetManager.preload()` → retrieve via `AssetManager.get()`
- ✅ Use `usePreloader()` hook in scenes that need asset gates
- ❌ `import castleModel from './castle.glb'` inside a component

---

## Rule 8 — Optimize for Performance

Every component and scene must consider:

- **60fps target** on desktop, **30fps minimum** on mobile
- CSS `transform` and `opacity` only for animations (GPU-accelerated properties)
- `will-change: transform` only where necessary (not globally)
- Particle counts capped per scene (see SCENE_FLOW.md for limits)
- Three.js geometries disposed on component unmount
- Textures disposed when no longer needed

---

## Rule 9 — Maintain Mobile Compatibility

The experience must work on:

- iOS Safari (14+)
- Chrome for Android (90+)
- Desktop Chrome, Firefox, Safari, Edge

Mobile-specific considerations:
- Touch events instead of mouse events for interactions
- No hover-only functionality
- Reduce particle count to 40% on screens < 768px
- Test Three.js scenes on mid-range Android (not just flagship phones)

---

## Rule 10 — Keep Animations Smooth

GSAP and Framer Motion rules:

- Use `useLayoutEffect` (not `useEffect`) for GSAP animations that read DOM dimensions
- Always use `gsap.context()` for cleanup (via `useAnimation()` hook)
- Never use `setInterval` for animation — use `gsap.ticker` or `requestAnimationFrame`
- Never animate `width`, `height`, `top`, `left` — use `transform` equivalents
- Test animations with Chrome DevTools at 4x CPU throttle before marking complete

---

## Rule 11 — Never Break Previous Scenes

Before submitting any change, verify that:

- The Loading scene still renders without errors
- The router still resolves all 14 route paths
- All contexts initialize without errors
- The build (`npm run build`) completes with zero errors

If a change breaks a previous scene, the change must be reverted before introducing anything new.

---

## Rule 12 — Always Document New Components

Every new component, hook, or engine modification must include:

- **JSDoc comment** at the top explaining purpose
- **`@param` and `@returns`** JSDoc for all exported functions
- **Comment** on any non-obvious logic (algorithms, workarounds, browser quirks)
- **Update ARCHITECTURE.md** if the structural architecture changes

Inline comments should explain *why*, not *what*. The code explains what — comments explain decisions.

---

## Rule 13 — Use Constants, Never Strings

Raw strings for scene names, audio keys, event names, and transition types are forbidden.

- ✅ `sceneManager.navigateTo(SCENES.CAKE)`
- ❌ `sceneManager.navigateTo('cake')`

- ✅ `soundManager.playSfx(SFX.BALLOON_POP)`
- ❌ `soundManager.playSfx('balloonPop')`

---

## Rule 14 — Respect the Context Hierarchy

Contexts must be consumed through their designated hooks:

- ✅ `useScene()` to access scene state
- ✅ `useAudio()` to play SFX
- ❌ `useContext(SceneContext)` directly in a component
- ❌ Importing `sceneManager` directly into a React component (use hooks instead)

---

## Rule 15 — Environment Variables for Secrets

Never hardcode:
- Google Sheets Web App URL
- API keys
- Secret question answers (in plaintext)

Use `.env` files:
```
VITE_SHEETS_URL=https://script.google.com/...
VITE_SECRET_ANSWER=your_hashed_answer
```

Add `.env` to `.gitignore`. Provide `.env.example` with placeholder values.

---

## Rule 16 — Every Phase Follows These Rules

These rules do not expire. Phase 5 must follow them as strictly as Phase 1. If a future phase seems to require breaking a rule, the correct response is to update the documentation and architecture — not to skip the rule.

---

## Quick Reference Checklist

Before creating a pull request or completing a phase, verify:

- [ ] No existing files were overwritten
- [ ] No new folders were renamed
- [ ] No utilities were duplicated
- [ ] All new assets are in `config/assets.js`
- [ ] All new scene names are in `constants/scenes.js`
- [ ] All new routes are in `config/routes.js`
- [ ] All new exports are backward-compatible
- [ ] `npm run build` passes with zero errors
- [ ] Tested on mobile viewport (375px width)
- [ ] All animations use `transform`/`opacity` only
- [ ] JSDoc added to all new exported functions
- [ ] No raw strings for scene/audio/event names
- [ ] No secrets committed to repository
