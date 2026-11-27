---
name: pocket-3d-world
description: Make a Pocket Production video in locked Style 03 "3D World" — a full Three.js night-time creator desk set with camera moves, glassmorphism UI cards and lime accents. Use when the user asks for "style 03", "3D World", or a cinematic 3D-set promo.
---

# Style 03 — 3D World (LOCKED)

Full spec: `pocket-reel/STYLE-03-3D-WORLD.md`. Brand rules: see skill `pocketstyle`.
Code: `pocket-reel/src/world/` — `Room.tsx` (3D set, procedural canvas textures, camera rig), `ui.tsx` (Glass, Float3D, Toggle, Ring, Pill), `Scenes.tsx` (W1–W7, portrait + landscape), `ReelWorld.tsx` (timeline, SFX).
Compositions: `PocketReelWorld` (1080×1920) and `PocketReelWorldWide` (1920×1080), 900 frames.
Finals: `out/PocketProduction_Reel_3DWorld_9x16.mp4`, `out/PocketProduction_3DWorld_16x9.mp4`.

## Look
Night-blue `#06080e` 3D room: desk, laptop showing a live editing timeline, phone on tripod with ring light and REC screen, bookshelves, window with city view, floating dust. Frosted blue glass UI cards (`backdrop-filter`) floating with 3D tilt. Lime `#f7fd92` accent, orange pills for problems. Poppins 300–800.

## Scene order
Dolly to desk + editing progress card → rack focus to shelves (problem pills, 3D question marks, "Biar kami uruskan.") → 3D lime flame-icon tile with spinning ribbons over the city → services panel (3 gauges + 7 toggles) → phone rig + Training card (4 modules ✓) → camera flies into the laptop screen, full editor, Export 9:16, "Video siap!" → bokeh end card: text first, then logo, WhatsApp Dee.
Transitions: blur, lens portal, whip-pan, LED dot-matrix.

## Rules learned
- "26 tahun pengalaman". End card: not too much text — text first, logo last.
- Audio: music at 0.55 + mixed Style 01/02 SFX; limiter after render (peak ≈ -1.5 dB).
