---
name: pocket-print-ad
description: Make a Pocket Production video in locked Style 05b "Print Ad" — vintage newspaper / classic print-advertising graphics (paper grain, serif headlines, red strike-throughs, stamps, engraved line art) animated around an original talking-head video, synced to the speaker's words. Use when the user asks for "style 05", "iklan cetak klasik", "print ad", or to add animated graphics to an existing video.
---

# Style 05b — Print Ad overlay (LOCKED)

Brand rules: see skill `pocketstyle`.
Code: `pocket-reel/src/premium_en/` — `kit.tsx` (tokens, `Paper`, `Masthead`, `Strike`, `Stamp`, `Said`, `PrintCaption`), `Art.tsx` (Car, Clock, Speedo, Burst line art), `words.ts` (speaker word timings), `ReelPremiumEN.tsx` (layout, sections, credits).
Composition: `PocketPremiumEN` (1080×1920). Source video goes in `public/ref/` (gitignored — never commit other people's footage).
Earlier BM remake (`src/premium/`, `PocketPremium`) was rejected: keep the original language.

## Look
- Cream newsprint `#efe8d8` with turbulence grain, fibres and vignette; ink `#151412`; red `#c42a1f` for strikes/stamps.
- Fonts: Playfair Display (serif headlines, italics), Space Grotesk (labels), Special Elite (typewriter notes).
- The original video sits in a framed box (cropped above any burned-in captions); headline zone above, caption zone below.
- Graphics appear exactly on the speaker's words (`W(i)` from `words.ts`): buzzwords as cheesy starbursts that get struck through, claim-vs-proof tables, engraved car/clock/speedometer, rubber stamps.
- Strike-through is a full-width div bar (`width: p*100%`), not an SVG dash.

## Ending and credits
- Outro ≈ 8.5 s: text first, then a **small** Pocket logo.
- Always credit the source: `CREDIT_VIDEO` (e.g. "Prime Brains | The Business Minds") and `CREDIT_AD` (e.g. "Rolls-Royce headline by David Ogilvy (1958)"). Verify the attribution with the user.
- Pocket logo at the top replaces any other branding. No overlaps between headline, frame, ad cards and captions.
