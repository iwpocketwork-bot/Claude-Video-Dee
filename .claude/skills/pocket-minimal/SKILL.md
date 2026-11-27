---
name: pocket-minimal
description: Make a Pocket Production video in locked Style 02 "Minimal Elegan" — black and cream, thin Poppins, mask reveals, slow panel slides, a 3D camera-lens aperture and 3D extruded logo. Use when the user asks for "style 02", "minimal elegan", or a calm, premium, elegant promo.
---

# Style 02 — Minimal Elegan (LOCKED)

Brand rules: see skill `pocketstyle`.
Code: `pocket-reel/src/minimal/` — `kit.tsx` (tokens + primitives), `Scenes.tsx` (M1–M6), `ReelMinimal.tsx` (timeline, SFX cues).
Composition: `PocketReelMinimal` (1080×1920, 900 frames). Final: `out/PocketProduction_Reel_Minimal_9x16.mp4`.
No landscape yet — to add one, register a `…Wide` composition and add a `useWide()` layout per scene (see `pocket-clean`).

## Tokens
black `#0b0b0c`, cream `#f3f1ea`, ink `#111111`, grey `#8a8780`, lime `#f7fd92` (used sparingly, e.g. CTA fill). Poppins 300/400/500/600 — light weight for most text, 600 for one emphasised line.
Easing: `soft` bezier(0.22,1,0.36,1) for text; `glide` bezier(0.76,0,0.24,1) for panels.

## Primitives (`minimal/kit.tsx`)
`Mask` (text rises out of an invisible mask), `Fade` (fade + 20 px rise), `Rule` (thin line drawn left→right), `Panel` (new background slides up over the previous scene), `Grain` (film grain), `Label` (small spaced uppercase), `Corner` (scene number "01").

## Scene order (T = {m1:0, m2:105, m3:262, m4:435, m5:595, m6:720})
1. Intro: small icon, line draws, wordmark slides out of mask, label "Production · Training · Mobilegraphy" (logo kept small).
2. Statement on cream + 3D camera lens with breathing aperture: "Content yang baik / **bukan kebetulan.**"
3. Services list (7 services) with ticks synced to the motion.
4. Training + 3D phone, module list.
5. Process timeline (4 steps).
6. End on black: 3D extruded logo, "Hubungi kami untuk bantu bisnes anda **berkembang.**", outlined pill "WhatsApp Dee →" that fills lime, number 011-1620 0864, @pocket_production · pocketproduction.my.

## Rules learned
- No planets/orbs (replaced with the 3D lens). Logo small at the start. Few colours.
- Audio: `music.mp3` at 0.5 + `min_*` SFX (whoosh, thump, tick, swish, chime); ticks are computed from the eased motion crossings.
