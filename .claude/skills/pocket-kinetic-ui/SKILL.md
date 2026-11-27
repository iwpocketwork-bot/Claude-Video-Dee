---
name: pocket-kinetic-ui
description: Make a Pocket Production video in locked Style 01 "Kinetic UI" — dark, energetic promo with design-tool UI motifs, glitch logo, Three.js cubes/phone/3D logo and confetti. Use when the user asks for "style 01", "Kinetic UI", or an energetic promo/services reel in this look.
---

# Style 01 — Kinetic UI (LOCKED)

Full spec: `pocket-reel/STYLE-01-KINETIC-UI.md`. Brand rules: see skill `pocketstyle`.
Code: `pocket-reel/src/Reel.tsx`, `src/scenes/S1Hook … S9End.tsx`, `src/common.tsx` (tokens, `DarkBg`, `useWide`), `src/Sfx.tsx` (65 SFX cues).
Compositions: `PocketReel` (1080×1920) and `PocketReelWide` (1920×1080), 900 frames (30 s).
Finals: `out/PocketProduction_Reel_9x16_v7.mp4`, `out/PocketProduction_KineticUI_16x9.mp4`.

## Look
- Dark `#0d0e13` with blurred diagonal lime/blue streaks moving; lime `#f7fd92` accent; Poppins 400–900 only.
- Supporting colours only on 3D objects/confetti: orange `#ff6b3d`, cyan `#38e1f5`, purple `#8b5cf6`, pink `#ff4d8d`.
- Motifs: design-tool UI (cyan selection boxes, pixel sizes, cursor tagged "Pocket"), motion blur, RGB split, kinetic letters (each letter flies in with its own treatment: white, outline, lime, box, orange).
- Fast transitions: zoom-blur, white flash, colour-bar wipes, liquid blob, bokeh.

## Scene order
Glitch logo hook → 3D cube flies at camera ("Bisnes anda perlukan CONTENT yang menjual.") → 3D iOS wheel picker of the 7 services → colour bars → 3D phone "BERHENTI SCROLL." → Training (lime circle wipe, 3D carousel of modules, chips Individu/Syarikat/Agensi) → process toolbar with cursor clicks → glowing-pen logo reveal → liquid CTA pill → end card: CTA text first ("Hubungi kami untuk bantu bisnes anda…", WhatsApp Dee 011-1620 0864), then **logo only** to finish (3D extruded logo, confetti).

## Rules learned
- Logo small (reduced 20–30% twice); logo and "Hubungi Kami" button the same width; no overlap of wordmark with graphics.
- "26 tahun pengalaman". Landscape uses `useWide()` from `common.tsx` per scene.
- Audio: `music.mp3` at 0.6 with fades + SFX; master with `alimiter=limit=0.85:attack=2:release=60:level=false`.
