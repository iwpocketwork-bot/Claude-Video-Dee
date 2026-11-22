# Style 03: "3D World" (LOCKED)

Pocket Production · Reels 9:16 · 1080×1920 · 30fps · 30s
Composition: `PocketReelWorld` · Video: `out/PocketProduction_Reel_3DWorld_9x16.mp4`
Landscape (website): `PocketReelWorldWide` · 1920×1080 · `out/PocketProduction_3DWorld_16x9.mp4`

## Identiti
- **Set 3D (Three.js):** meja content creator pada waktu malam, dengan:
  - laptop yang memaparkan timeline editing secara langsung
  - telefon atas tripod dengan ring light dan skrin REC
  - rak buku di kiri dan kanan
  - tingkap dengan pemandangan bandar (tekstur canvas prosedural)
  - habuk terapung
- **Kad UI kaca biru** (glassmorphism, `backdrop-filter`) terapung dengan tilt 3D.
- **Warna:** malam biru gelap `#06080e`; aksen hijau-limau `#f7fd92`; pil masalah oren.
- **Font:** Poppins (300–800).

## Babak dan transition (frame global)
| Frame | Babak | Transition |
|---|---|---|
| 0–114 | Dolly ke meja, laptop terbuka, kad progress editing | Blur |
| 105–205 | Rack focus ke rak buku: pil masalah + tanda soal 3D, "Biar kami uruskan." | Portal lensa |
| 195–301 | Ikon api 3D (jubin hijau-limau) dengan 3 reben berpusing di depan pemandangan bandar | Blur |
| 295–426 | Panel servis: 3 gauge + 7 suis toggle | Whip-pan |
| 418–559 | Rig telefon + kad Training (4 modul ✓) + chip | — |
| 552–752 | Kamera masuk ke skrin laptop, editor penuh skrin, Export 9:16, "Video siap!" | Dot-matrix LED |
| 745–900 | End card bokeh: ikon, wordmark berpusing, WhatsApp Dee | — |

## Audio
- Muzik pada 0.55, dengan campuran SFX Style 01 dan Style 02.
- Limiter selepas render (puncak ≈ -1.5 dB).

## Fail
- `src/world/Room.tsx`: set 3D, tekstur canvas, rig kamera
- `src/world/ui.tsx`: komponen Glass, Float3D, Toggle, Ring dan Pill
- `src/world/Scenes.tsx`: W1–W7 (menyesuaikan diri untuk portrait dan landscape)
- `src/world/ReelWorld.tsx`: timeline dan cue SFX
