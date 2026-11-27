---
name: pocket-clean
description: Make a Pocket Production video in the locked "Pocket Clean" style (Style 06c) — modern, trendy, minimalist kinetic explainer with Pocket brand kit, light/dark scenes, tilted dark UI cards, blur-in words and a white caption capsule. Use when the user asks for a Pocket video "gaya Pocket Clean", "style 06c", or a new explainer/promo in this look (9:16 Reels and/or 16:9 website).
---

# Pocket Clean (Style 06c) — LOCKED

Reference implementation: `pocket-reel/src/signature/ReelSignatureClean.tsx`
Compositions: `PocketSignatureClean` (1080×1920) and `PocketSignatureCleanWide` (1920×1080), 30 fps, 1410 frames (47 s).
Finals: `out/PocketProduction_PocketClean_1080p.mp4`, `out/PocketProduction_PocketClean_16x9.mp4`.
Visual origin: `references/REF-04-kinetic-explainer/` (layout and motion language only; colours/fonts are Pocket).

For a new video: copy `ReelSignatureClean.tsx` to a new folder, keep the primitives as they are, and replace
the content, the scene list, `T` timings, `CAPS` and `CUES`. Register both a portrait and a `…Wide` composition in `src/Root.tsx`.

## Brand rules (never break)
- Colours: light `#f4f4ef`, dark `#0d0e13`, card `#141519`, lime `#f7fd92` (main accent), orange `#ff6b3d` (problem/"before" only), ink `#111214`. No other accent colours.
- Fonts: **Poppins** (400–800) for all text, **JetBrains Mono** for small uppercase labels only. No cursive, no extra fonts.
- Logo: `logo-dark.png` on light, `logo-white.png` on dark. Keep it small (height ≈ 90 in a scene, width ≈ 300 at the end). Logo comes **last** on the end card; text first.
- Copy: Bahasa Melayu santai Pocket ("Kami taip ni je", "takyah", "je", "dah lock"), English words mixed in naturally. Facts: 26 tahun pengalaman; WhatsApp Dee 011-1620 0864; @pocket_production; pocketproduction.my; training = "Smartphone Videomaking".
- **No overlap**: text, cards, header and capsule must never collide. Check every scene in both 9:16 and 16:9 before the final render.

## Look and primitives
| Primitive | What it does |
|---|---|
| `Bg` | Light: `#f4f4ef` + big blurred lime glow top-right. Dark: `#0d0e13` + lime glow top-right, faint cyan glow bottom-left. Glows drift slowly (sin). |
| `Wipe start` | Circle clip-path wipe (16 frames, io ease) from screen centre — used to enter every dark scene and most scene changes. |
| `Words` | Word-by-word reveal: blur 12→0, rise 16 px, opacity, step 3–5 frames. Highlight a word with `[word, {color: lime}]`. `out` blurs it away. |
| `Card` | Dark (or white) rounded 34 px UI card, soft 3D tilt (rotateX/Y), spring entrance from below + blur, slow float, deep soft shadow. |
| `Mono` | 21 px uppercase JetBrains Mono label, grey (or lime) — for metadata like "STORYBOARD · V1 → V5". |
| `Header` | Persistent kicker after the hook: big at first, then shrinks to the top-left; on light uses a lime chip highlight, on dark the word turns lime. |
| `Capsule` | White pill caption (Poppins 500, 34 px) with blur-in. Top = **1430** (portrait) / **940** (landscape) — raised, not at the very bottom. |
| `Show from to` | Mount scenes by **global frame** (no `<Sequence>` offset), so timings stay absolute. |

Motion: ease `bezier(0.22,1,0.36,1)` for entrances, `bezier(0.65,0,0.35,1)` for wipes/shrinks; springs damping 15 / stiffness 130–140 (snappier 10–11 / 200 for pops). Alternate light → dark → light scenes.

## Scene pattern (the locked video)
Hook question (light) → chat/command card with typed text + choice chips + thumbnails → "Dulu?" problem in white + orange (dark) → "So kami lock 🔒 …" → brand kit: "Aa" white card + swatch stack card + small logo (light) → 3 storyboard cards + `"go" ✓` pill (light) → motion demo: flat lime ball squash/stretch on a track + overshoot graph card (dark) → audio: waveform card orange→lime, LUFS card, file-size card (light) → "Kenapa sesuai untuk kami?" + 3 numbered lime points (dark) → end: lime pill expands with `/pocketstyle`, one line, then logo (dark), fade out.

## Landscape (16:9) rules
Use `useWide()` (width > height) inside each component; **call hooks before any early `return null`** (the capsule crashed once because of this).
Text/heading/logo on the left (x = 100), cards on the right (x ≈ 720–1800), header top 70 after shrink, wipe centre (960, 540), capsule top 940, `Why` becomes a two-column flex row.

## Audio
- Music `music_subclair.mp3` at 0.5 with a fade in and fade out; SFX from `public/sfx` (`min_swish`, `min_whoosh`, `min_tick`, `click`, `pop`, `tick`, `min_thump`, `min_chime`) at 0.2–0.7, cued on every wipe, pop and typed character.
- After render, master with:
  `ffmpeg -i raw.mp4 -c:v copy -af "aresample=48000,loudnorm=I=-15:TP=-3:LRA=11,aresample=48000,alimiter=limit=0.6:attack=1:release=50:level=false" -c:a aac -b:a 192k final.mp4`
  Target ≈ -14 LUFS, peak ≈ -2 dBFS (check with `ebur128=peak=true`).

## Workflow
1. Write the script/captions in Pocket language; plan the scenes and `T` timings.
2. Check stills of both orientations (`npx remotion still … --frame=N --scale=0.4`, tile into a contact sheet) for overlap.
3. Preview at `--scale=0.5` (540p) → user approves → final 1080p:
   `npx remotion render src/index.ts <Id> out/raw.mp4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell --gl=angle --concurrency=4 --crf=18`
4. Apply the audio master, verify size/loudness/frames, send both 9:16 and 16:9, commit and push.
