# Design System — Disney Princess Birthday Experience

## Design Philosophy

Every visual decision in this project is guided by one question: *Does this feel like a premium Disney experience?*

The design language combines:
- **Cinematic darkness** — deep night backgrounds that make glowing elements pop
- **Magical glow** — gold, purple, and pink light effects that feel enchanted
- **Elegant typography** — serif display fonts paired with handwritten script
- **Fluid motion** — smooth, Disney-quality easing curves on every animation
- **Luxury surface** — glassmorphism cards, shimmer effects, and subtle gradients

---

## Color Palette

### Primary Colors

These are the dominant colors of the experience — used for backgrounds, text, and primary UI.

| Token | Hex | Usage |
|---|---|---|
| `night-950` | `#04020f` | Deepest background, transitions |
| `night-900` | `#0d0a1e` | Primary background |
| `night-800` | `#14102e` | Elevated surfaces |
| `night-700` | `#1c1640` | Card backgrounds |
| `night-600` | `#251e52` | Highlighted surfaces |
| `star-pure` | `#ffffff` | Primary text on dark |
| `star-dust` | `#e8e0ff` | Secondary text on dark |

### Secondary Colors — Gold / Fairy Dust

The gold palette represents magic, achievement, and celebration.

| Token | Hex | Usage |
|---|---|---|
| `gold-400` | `#fbbf24` | Primary gold, buttons, highlights |
| `gold-500` | `#f59e0b` | Deeper gold, borders |
| `gold-glow` | `#ffe066` | Glow effects, shimmer |
| `gold-spark` | `#fff176` | Particle sparkles |

### Accent Colors — Royal Purple

The royal palette represents Disney princess elegance and magic.

| Token | Hex | Usage |
|---|---|---|
| `royal-300` | `#c4b5fd` | Light accents, secondary text |
| `royal-400` | `#a78bfa` | Hover states, highlights |
| `royal-500` | `#8b5cf6` | Primary interactive elements |
| `royal-600` | `#7c3aed` | Button backgrounds, links |
| `royal-900` | `#4c1d95` | Deep purple surfaces |
| `royal-deep` | `#2d1b69` | Darkest purple background |

### Accent Colors — Rose / Princess Pink

The rose palette represents romance, celebration, and princess energy.

| Token | Hex | Usage |
|---|---|---|
| `rose-300` | `#fda4af` | Soft pink accents |
| `rose-400` | `#fb7185` | Interactive rose elements |
| `rose-500` | `#f43f5e` | Strong pink, fireworks |
| `rose-blush` | `#ffc2d4` | Backgrounds, soft tints |
| `rose-petal` | `#ffb3c6` | Particle colors |

### Accent Colors — Fairy Teal

The fairy palette represents magic, enchantment, and nature.

| Token | Hex | Usage |
|---|---|---|
| `fairy-300` | `#5eead4` | Light teal accents |
| `fairy-400` | `#2dd4bf` | Interactive teal elements |
| `fairy-glow` | `#67e8f9` | Glow effects, fireflies |

---

## Disney-Inspired Gradients

| Name | Definition | Usage |
|---|---|---|
| Night Sky | `radial-gradient(ellipse at top, #251e52 0%, #0d0a1e 70%)` | Main background |
| Magical | `linear-gradient(135deg, #0d0a1e 0%, #1c1640 50%, #251e52 100%)` | Elevated surfaces |
| Gold Shimmer | `linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fde68a 100%)` | Gold elements |
| Royal Gradient | `linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #a78bfa 100%)` | Purple elements |
| Rose Gradient | `linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fda4af 100%)` | Pink elements |
| Shimmer Overlay | `linear-gradient(90deg, transparent 0%, #ffe066 50%, transparent 100%)` | Animated shimmer |

---

## Typography Hierarchy

### Font Stack

| Role | Font Family | Weight | Use Case |
|---|---|---|---|
| Display | Playfair Display | 400, 700, 900 | Scene titles, hero text |
| Display Italic | Playfair Display Italic | 400, 700 | Emotional headings |
| Script | Dancing Script | 400, 600, 700 | Names, captions, letter text |
| Body | Outfit | 300, 400, 500, 600 | UI text, descriptions, buttons |

### Size Scale

| Name | Size | Line Height | Usage |
|---|---|---|---|
| Hero | `clamp(3rem, 8vw, 7rem)` | 1.1 | Scene main title |
| Title | `clamp(2rem, 5vw, 4rem)` | 1.2 | Section headings |
| Section | `clamp(1.5rem, 3vw, 2.5rem)` | 1.3 | Sub-headings |
| Large | `1.5rem` | 1.4 | Lead text |
| Body | `1rem` | 1.6 | Standard text |
| Small | `0.875rem` | 1.5 | Captions, labels |
| Tiny | `0.75rem` | 1.4 | Meta, timestamps |

---

## Button Styles

### Primary Button (Gold)

```
Background:  linear-gradient(135deg, #f59e0b, #fbbf24)
Text:        #0d0a1e (dark, high contrast)
Border:      none
Radius:      2rem (full pill)
Padding:     0.75rem 2.5rem
Shadow:      glow-gold on hover
Hover:       scale(1.05), brightness(1.1)
Active:      scale(0.97)
Transition:  200ms ease-out
```

### Secondary Button (Royal)

```
Background:  transparent
Border:      1px solid #7c3aed
Text:        #a78bfa
Radius:      2rem
Padding:     0.75rem 2.5rem
Hover:       background rgba(124,58,237,0.15), glow-purple shadow
```

### Ghost Button (White)

```
Background:  rgba(255,255,255,0.05)
Backdrop:    blur(12px)
Border:      1px solid rgba(255,255,255,0.15)
Text:        #ffffff
Radius:      2rem
Hover:       rgba(255,255,255,0.1)
```

### Icon Button

```
Background:  transparent
Border:      none
Padding:     0.5rem
Radius:      50%
Hover:       rgba(255,255,255,0.1) background
Active:      scale(0.9)
```

---

## Card Styles

### Glass Card

```
Background:  rgba(255, 255, 255, 0.05)
Backdrop:    blur(12px)
Border:      1px solid rgba(255, 255, 255, 0.10)
Radius:      1.5rem
Shadow:      0 25px 80px rgba(0,0,0,0.4)
```

### Dark Glass Card

```
Background:  rgba(13, 10, 30, 0.70)
Backdrop:    blur(16px)
Border:      1px solid rgba(139, 92, 246, 0.20)
Radius:      1.5rem
Shadow:      inner glow rgba(139,92,246,0.05)
```

### Gold-Bordered Card

```
Background:  rgba(13, 10, 30, 0.80)
Border:      1px solid rgba(251, 191, 36, 0.50)
Radius:      2rem
Shadow:      glow-gold (0 0 20px rgba(251,191,36,0.30))
```

---

## Glassmorphism Rules

Glassmorphism is used for overlay cards, modals, HUD elements, and the authentication form.

**Required properties for glass:**
- `background: rgba(r, g, b, 0.05–0.15)` — very translucent
- `backdrop-filter: blur(12px–24px)` — the blur is the effect
- `-webkit-backdrop-filter:` — always include for Safari
- `border: 1px solid rgba(255,255,255,0.08–0.15)` — subtle edge
- `border-radius: 1.5rem+` — always rounded

**Do not use glassmorphism on:**
- Full-screen backgrounds
- Text elements
- Interactive elements with complex state

---

## Glow Effects

### Text Glow

```css
text-shadow: 0 0 20px rgba(251,191,36,0.6), 0 0 40px rgba(251,191,36,0.3);
```

### Element Glow (Box Shadow)

| Name | Value |
|---|---|
| Gold | `0 0 30px rgba(251,191,36,0.6), 0 0 60px rgba(251,191,36,0.3)` |
| Royal | `0 0 30px rgba(139,92,246,0.6), 0 0 60px rgba(139,92,246,0.3)` |
| Rose | `0 0 30px rgba(244,63,94,0.5), 0 0 60px rgba(244,63,94,0.2)` |
| Fairy | `0 0 30px rgba(20,184,166,0.5), 0 0 60px rgba(20,184,166,0.2)` |

---

## Border Radius

| Name | Value | Usage |
|---|---|---|
| `sm` | `0.5rem` | Chips, tags |
| `md` | `1rem` | Small cards |
| `lg` | `1.5rem` | Standard cards |
| `magical` | `2rem` | Featured cards, buttons |
| `royal` | `3rem` | Hero cards |
| `full` | `9999px` | Pills, circular elements |

---

## Spacing System

Based on a 4px baseline grid:

| Token | Value | Usage |
|---|---|---|
| `xs` | `0.25rem (4px)` | Tight spacing |
| `sm` | `0.5rem (8px)` | Inner padding |
| `md` | `1rem (16px)` | Component padding |
| `lg` | `1.5rem (24px)` | Section spacing |
| `xl` | `2rem (32px)` | Large gaps |
| `2xl` | `3rem (48px)` | Section breaks |
| `3xl` | `4rem (64px)` | Scene padding |
| `scene` | `100vh` | Full-scene height |

---

## Animation Timing

### Disney Easing Curves

| Name | CSS Cubic Bezier | GSAP Equivalent | Usage |
|---|---|---|---|
| Disney | `cubic-bezier(0.34, 1.56, 0.64, 1)` | `back.out(1.7)` | Bouncy entrances |
| Cinematic | `cubic-bezier(0.76, 0, 0.24, 1)` | `power4.inOut` | Scene transitions |
| Magic | `cubic-bezier(0.22, 1, 0.36, 1)` | `expo.out` | Smooth exits |
| Dramatic | `cubic-bezier(0.86, 0, 0.07, 1)` | `power4.in` | Heavy impacts |
| Smooth | `cubic-bezier(0.4, 0, 0.2, 1)` | `power2.inOut` | Standard UI |

### Duration Scale

| Name | Duration | Usage |
|---|---|---|
| Instant | 100ms | Hover states |
| Fast | 250ms | UI interactions |
| Normal | 500ms | Element transitions |
| Slow | 800ms | Scene element reveals |
| Cinematic | 1200ms | Scene transitions |
| Epic | 2000ms | Major dramatic moments |

---

## Shadow System

| Name | Value | Usage |
|---|---|---|
| Glow Gold | `0 0 30px rgba(251,191,36,0.6), 0 0 60px rgba(251,191,36,0.3)` | Gold elements |
| Glow Purple | `0 0 30px rgba(139,92,246,0.6), 0 0 60px rgba(139,92,246,0.3)` | Royal elements |
| Glow Pink | `0 0 30px rgba(244,63,94,0.5), 0 0 60px rgba(244,63,94,0.2)` | Rose elements |
| Inner Glow | `inset 0 0 60px rgba(139,92,246,0.15)` | Deep cards |
| Cinematic | `0 25px 80px rgba(0,0,0,0.8)` | Scene depth |
| Soft | `0 8px 32px rgba(0,0,0,0.4)` | Cards, buttons |

---

## Particle Colors

| System | Colors |
|---|---|
| Fairy Dust | `#ffe066`, `#fff176`, `#fbbf24`, `#c4b5fd`, `#ffffff` |
| Night Stars | `#ffffff` (varying opacity) |
| Confetti | `#fbbf24`, `#f43f5e`, `#8b5cf6`, `#2dd4bf`, `#ffffff`, `#fb7185` |
| Fireflies | `#ffe066`, `#fff176`, `#a5f3fc` |
| Fireworks | `#fbbf24`, `#8b5cf6`, `#f43f5e`, `#2dd4bf`, `#ffffff` |
| Rose Petals | `#fda4af`, `#ffb3c6`, `#ffc2d4`, `#f43f5e` |

---

## Responsive Breakpoints

| Name | Width | Target Device |
|---|---|---|
| `sm` | 640px | Large phones, landscape |
| `md` | 768px | Tablets, portrait |
| `lg` | 1024px | Tablets landscape, small laptops |
| `xl` | 1280px | Standard desktops |
| `2xl` | 1536px | Large monitors |

### Mobile-First Rules

- All layout is mobile-first (base styles for mobile, `md:` for tablet+)
- Touch targets minimum 44×44px (Apple HIG guideline)
- Font sizes use `clamp()` for fluid scaling
- Three.js scene is available on all screen sizes, but with reduced particle count and model detail on mobile

---

## Dark Theme Rules

The experience is exclusively dark-themed. There is no light mode. All design decisions assume a dark background:

- White text on dark: always AA+ contrast compliant
- Avoid pure white on dark backgrounds — use `star-dust (#e8e0ff)` for body text
- Use `star-pure (#ffffff)` only for emphasis, numbers, and key headings
- All interactive elements must have visible focus states (gold outline)
- Disabled elements: 40% opacity, no pointer events

---

## Accessibility Rules

| Rule | Implementation |
|---|---|
| Color contrast | Minimum 4.5:1 for body text, 3:1 for large text |
| Focus visible | Gold `outline: 2px solid #ffe066` on all interactive elements |
| Motion reduction | Respect `prefers-reduced-motion` — reduce animation intensity |
| Screen reader | All interactive elements have `aria-label` |
| Keyboard navigation | All interactions reachable without a mouse |
| Audio | Mute button always visible, no audio-only information |
| Font size | Minimum 14px (0.875rem) for any readable text |
| Touch targets | Minimum 44×44px for all buttons and interactive elements |
