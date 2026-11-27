---
name: pocket-explainer-vo
description: Make a Pocket Production tips/explainer video in locked Style 04b "Kinetic Explainer + VO" — visuals synced word-by-word to a male Bahasa Melayu voiceover, karaoke caption pill, circle wipes between light and dark scenes, realistic 3D phone. Use when the user asks for "style 04", a tips video, an educational explainer with voiceover, or content that follows REF-04 with VO.
---

# Style 04b — Kinetic Explainer + VO (LOCKED, "Versi B")

Brand rules: see skill `pocketstyle`. Visual reference: `references/REF-04-kinetic-explainer/`.
Code: `pocket-reel/src/tips2/` — `words.ts` (VO word timings), `timing.ts` (`W(i)`/`WE(i)` word→frame, scene starts `SC` derived from the VO, caption `PHRASES`), `Scenes.tsx` (H1–H8, `VoWords`, `KaraokePill`, `Header`, `useWide`), `Phone3D.tsx` (realistic phone), `ReelTips2.tsx` (music ducking, SFX).
Tokens/primitives come from `src/tips/kit.tsx` (Style 04).
Compositions: `PocketTipsVOSubClair` (9:16) and `PocketTipsVOSubClairWide` (16:9), 1470 frames (49 s). `PocketTipsVO` = same with `music.mp3`.
Finals: `out/PocketProduction_TipsSmartphone_SubClair_1080p.mp4`, `out/PocketProduction_TipsSmartphone_SubClair_16x9.mp4`.

## Look
- Light `#f2f2f6` with soft violet/blue glows ↔ dark `#0a0c1c` with blue/teal glows; circle wipe (16 f, centre 540,900 / 960,540 wide).
- DM Sans for text, JetBrains Mono for labels; lime `#e4f75a`, red `#ff3b4a` for "wrong", dark UI cards `#15161c`.
- Words appear exactly when spoken (`VoWords`); karaoke pill caption: current word bold, others grey.
- Persistent header grows out of the hook answer and flips colour with each wipe.
- Phone: three.js RoundedBox, titanium `meshPhysicalMaterial`, RoomEnvironment reflections, camera-app screen driven by VO frames (must not look fake).

## Building a new one
1. Write the BM script in Pocket language (e.g. "Kami rakam guna smartphone je", "klik", training "Smartphone Videomaking").
2. Generate VO with ElevenLabs Shahrul (`1uDSnuWUOvbosqTWAzfW`, `eleven_v4`), transcribe for word timings → `words.ts`, update the word-index map comment in `timing.ts`.
3. Derive scene starts from word indices (`W(i) - 4…8`), set `PHRASES` for the pill.
4. Music ducks under the voice (0.32 up / 0.12 under). Master: `alimiter=limit=0.85…,loudnorm=I=-14:TP=-1.5:LRA=11`.

## Rules learned
- Hook text single line, nowrap, never touching the header. Check every scene in 9:16 and 16:9 for overlap.
