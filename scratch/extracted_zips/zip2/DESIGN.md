---
name: Tactile Toybox Arcade
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464554'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#795900'
  on-secondary: '#ffffff'
  secondary-container: '#ffc329'
  on-secondary-container: '#6f5100'
  tertiary: '#006b2d'
  on-tertiary: '#ffffff'
  tertiary-container: '#00873b'
  on-tertiary-container: '#f7fff3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#ffdf9f'
  secondary-fixed-dim: '#f9bd22'
  on-secondary-fixed: '#261a00'
  on-secondary-fixed-variant: '#5c4300'
  tertiary-fixed: '#6bff8f'
  tertiary-fixed-dim: '#4ae176'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005321'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-hero:
    fontFamily: Rubik
    fontSize: 56px
    fontWeight: '900'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Rubik
    fontSize: 38px
    fontWeight: '900'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Rubik
    fontSize: 36px
    fontWeight: '900'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Rubik
    fontSize: 28px
    fontWeight: '900'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Rubik
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Rubik
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 28px
  headline-sm:
    fontFamily: Rubik
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Rubik
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Rubik
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-sm:
    fontFamily: Rubik
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-caps:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  score-timer-num:
    fontFamily: Rubik
    fontSize: 32px
    fontWeight: '900'
    lineHeight: 36px
    letterSpacing: -0.01em
  score-timer-lg:
    fontFamily: Rubik
    fontSize: 48px
    fontWeight: '900'
    lineHeight: 52px
    letterSpacing: -0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system blends **Tactile Neo-Brutalism** and **Toybox Physics**. It is built for a vibrant, gamified mathematics arcade tailored for K-6 learners, educators, and indie game enthusiasts. Taking cues from Duolingo's visceral reward loops, the crisp geometric snappiness of the Nintendo Switch OS, the high-energy communal tension of Kahoot, and the squishy, handcrafted charm of Toca Boca, the system treats every interactive element as a physical, spring-loaded toy.

### Aesthetic Principles
- **Mechanical Tactility:** Buttons, cards, and modules exist in pseudo-3D space. They do not use blurred drop-shadows; they rely on hard, solid bottom bevel extrusions that physically compress upon click or tap.
- **Unapologetic High Contrast:** Thick 2px ink borders, dense typography, and saturated candy pigments create an instant visual hierarchy that eliminates cognitive fatigue for young learners.
- **Micro-Dopamine & Kinetic Response:** UI elements bounce, depress, stamp, and snap with immediate spring-back motion curves, giving mathematical solutions physical weight and tactile satisfaction.
- **Modular Gamification:** Layouts are organized into chunky cards, floating island hubs, and rhythmic progression tracks.

## Colors

The color system is organized around two operational sets: **Global Engine Accents** and the **Grade-Level World Palette**. Every saturated color is paired with a strictly calculated darker shade used exclusively for hard 3D extrusion bevels (`border-bottom` or `box-shadow: 0 4px 0 0 [bevel]`).

### Global Engine Tokens
- **Canvas Base:** `#F8FAFC` (Toybox Sky-White) — Soft, low-strain neutral canvas.
- **Surface Elevation:** `#FFFFFF` — Crisp pure-white card surface.
- **Ink Primary:** `#0F172A` (Deep Slate Ink) — Used for borders, headlines, and structural lines.
- **Ink Muted:** `#475569` — Subtext, hints, and deactivated controls.
- **Surface Muted / Inactive:** `#E2E8F0` with Bevel `#CBD5E1` — Locked progression nodes.
- **Primary Spark Indigo:** `#6366F1` | Bevel: `#4338CA`
- **Spark Gold (Coins, Streaks, XP):** `#FBBF24` | Bevel: `#D97706`

### Grade & World Palette
Each mathematical domain owns an energetic color pairing:
- **Grade 1 (Addition & Subtraction):** Sky Blue `#0EA5E9` | Bevel: `#0284C7`
- **Grade 2 (Multiplication Arrays):** Sonic Lime `#22C55E` | Bevel: `#15803D`
- **Grade 3 (Speed Blitz & Mental Math):** Radiant Tangerine `#F97316` | Bevel: `#C2410C`
- **Grade 4 (Factors & Multiples):** Vivid Berry Purple `#A855F7` | Bevel: `#7E22CE`
- **Grade 5 (Decimals & Fractions):** Coral Rose `#F43F5E` | Bevel: `#BE123C`
- **Grade 6 (Pre-Algebra & Variables):** Cyber Mint Teal `#14B8A6` | Bevel: `#0F766E`

### Functional Feedback
- **Correct Hit:** `#22C55E` / Bevel `#15803D`
- **Incorrect/Error:** `#F43F5E` / Bevel `#BE123C`
- **Combo Flash:** `#FBBF24` / Bevel `#D97706`

## Typography

The type system prioritizes chunky legibility and geometric playfulness. **Rubik** serves as the primary display and body typeface due to its rounded corners, heavy weights (800 and 900), and open letterforms. **Space Grotesk** serves as the utilitarian label typeface, introducing technical arcade balance for metadata, category flags, and subheaders.

### Rules for Math & Counters
- All timer digits, point accumulations, equations, and leaderboard statistics **must** enable `font-variant-numeric: tabular-nums` or `font-feature-settings: "tnum"`. This prevents horizontal layout jitter during countdowns and rapid point multipliers.
- Mathematical operations (`+`, `−`, `×`, `÷`, `=`) should be styled with 800/900 weights and vertically centered to match the cap-height of numbers.

## Layout & Spacing

Layouts follow a modular, chunky card grid that adapts between classroom dashboard views and full-screen mobile arcade play.

### Screen Adaptations & Grid
- **Desktop (1024px+):** 12-column fluid grid, `2rem` outer canvas margins, `1.5rem` gutters. Content maxes out at `1200px` for arena hubs and `840px` for active game play sessions to keep eye travel compact.
- **Tablet (768px - 1023px):** 8-column layout. Split split-screen math duel panels reflow into dynamic top/bottom split viewports.
- **Mobile (< 768px):** 4-column layout, `1rem` outer canvas margin, `0.75rem` gutters. Action sheets, numpads, and interactive math tiles dock to the bottom 45% of the viewport (thumb zone), leaving the upper 55% for animated problem visualization.

## Elevation & Depth

This design system completely rejects soft, blurred drop-shadows and ambient glow layers. Depth is constructed using **Tactile Hard Extrusion**.

### Extrusion Elevation Scale
1. **Flat / Inset (Elevation 0):**
   - Border: `2px solid #0F172A`
   - Depth: `0px`
   - Use case: Input wells, disabled empty slots, arena track backgrounds.
2. **Interactive Low (Elevation 1):**
   - Border: `2px solid #0F172A`
   - Bevel: Solid bottom extrusion via `box-shadow: 0 3px 0 0 #0F172A` (or domain-bevel tone).
   - Use case: Small chips, answer badges, compact utility controls.
3. **Interactive Medium (Elevation 2 - Standard Button):**
   - Border: `2px solid #0F172A`
   - Bevel: `box-shadow: 0 5px 0 0 #0F172A` (or thematic bevel).
   - Active Press: On `:active`, element transforms `translateY(3px)` and extrusion decreases to `box-shadow: 0 2px 0 0 #0F172A`.
4. **Hero Component / Card (Elevation 3):**
   - Border: `3px solid #0F172A`
   - Bevel: `box-shadow: 0 8px 0 0 #0F172A`
   - Use case: Game mode cards, daily challenge banners, modal dialogs.

## Shapes

The interface balances sharp, crisp outlines with friendly, pillowy corners. 

### Geometric Rules
- **Chunky Rounded Radius (`rounded-lg`, 1rem / 16px):** The default radius for modal dialogs, game prompt cards, answer blocks, and numeric keypads.
- **Full Pill Radius (`rounded-full`, 9999px):** Applied to primary arcade action buttons, status badges, grade pills, score bars, and live timers.
- **Border Enclosure:** All interactive elements must carry an ink border of at least `2px solid #0F172A`. Hero dialogs scale to `3px solid #0F172A`.

## Components

### 1. Tactile 3D Buttons
- **Structure:** Pill-shaped or `16px` rounded container, uppercase label, bold icon.
- **Base State:** `2px solid #0F172A` border with a 5px bottom extrusion bevel (`box-shadow: 0 5px 0 0 [Darker Bevel Tone]`).
- **Hover State:** Translate up `-1px` with bevel expanding to `6px`.
- **Active State:** Translate down `3px` with bevel collapsing to `2px`. Provides an instant physical tactile "click".
- **Sound & Haptics Hook:** Dispatches an immediate high-frequency pop audio trigger on release.

### 2. Math Answer Tiles
- **Structure:** Rectangular cards (`rounded-lg`), minimum touch target `64x64px`, large bold numbers (`typography.headline-lg`).
- **Normal:** White surface, `2px solid #0F172A` border, `0 4px 0 0 #0F172A` bevel.
- **Selected/Active:** Indigo surface (`#6366F1`), white text, `0 2px 0 0 #4338CA` bevel.
- **Success Reaction:** Pops to Green (`#22C55E`), bottom bevel `#15803D`, accompanied by a scale burst animation (`1.05x`).
- **Error Reaction:** Shakes horizontally (4 cycles of `±6px`), turns Coral Rose (`#F43F5E`), bottom bevel `#BE123C`.

### 3. Pill Badges & Chips
- **Structure:** Fully rounded (`9999px`), `2px solid #0F172A`, height `32px`, font `label-caps`.
- **Styling:** Themed by Grade or Streak status. Background takes the vibrant world color; text is deep slate or crisp white with high-contrast backing.
- **Coin/Streak Variant:** Includes an illustrated gold bolt or coin icon slightly overflowing the badge boundary by `-4px`.

### 4. Progress Tracks & XP Meters
- **Container:** Full pill shape, height `20px`, surface `#E2E8F0`, inner border `2px solid #0F172A`.
- **Fill Bar:** Saturated Spark Gold (`#FBBF24`) or Domain color with an active gloss highlight line running across the top half (`rgba(255, 255, 255, 0.4)`). Striped diagonal lines (`45deg`) for bonus periods.

### 5. Input Fields (Number Scratchpad & Equations)
- **Structure:** White background, `2px solid #0F172A`, `rounded-md`, recessed appearance using an inner inset border or `box-shadow: inset 0 3px 0 0 rgba(15, 23, 42, 0.1)`.
- **Focus:** Border widens to `3px solid #6366F1`, outline none.

### 6. Game Arena Cards
- **Structure:** Pure white card surface, `3px solid #0F172A`, `rounded-xl`, `box-shadow: 0 8px 0 0 #0F172A`.
- **Header:** Features an edge-to-edge color banner locked to the specific Grade Color, separated from the content by a `2px solid #0F172A` internal divider line.