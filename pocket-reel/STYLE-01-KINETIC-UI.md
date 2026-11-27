# Style 01: "Kinetic UI" (LOCKED)

Pocket Production · Reels 9:16 · 1080×1920 · 30fps · 30s
Video akhir: `out/PocketProduction_Reel_9x16_v7.mp4` (9:16) · `out/PocketProduction_KineticUI_16x9.mp4` (16:9 website, composition `PocketReelWide`)
Git tag: `style-01-locked`

## Identiti
- **Font:** Poppins sahaja (400/600/800/900). Tiada cursive.
- **Warna:** latar gelap `#0d0e13` dengan jalur diagonal hijau/biru yang kabur; aksen jenama hijau-limau `#f7fd92`; teks gelap `#1A1D21`.
  Warna sokongan (untuk objek 3D/confetti sahaja): oren `#ff6b3d`, cyan `#38e1f5`, ungu `#8b5cf6`, pink `#ff4d8d`.
- **Logo:** `public/logo-white.png`, `wordmark-white.png`, `icon-white.png` (dipotong dari logo asal).
  Lebar logo ~700px; butang CTA sama lebar dengan logo.
- **Motif:** gaya UI design-tool (kotak pilihan cyan, saiz piksel, kursor bertag "Pocket"), motion blur, RGB split.

## Struktur babak
| Frame | Babak | Animasi utama | Transition keluar |
|---|---|---|---|
| 0–78 | Hook logo | Wordmark dari 8 jalur glitch, ikon api pop, kotak pilihan, pil "Production · Training · Mobilegraphy" | Zoom + blur |
| 75–170 | Kiub 3D | Three.js RoundedBox terbang ke kamera, RGB split; "Bisnes anda perlukan CONTENT yang menjual." | Flash putih |
| 168–280 | Menu servis | iOS wheel picker 3D, 7 servis dari website | Color bar wipe |
| 264–302 | Color bars | 5 jalur menegak berperingkat | Jalur jatuh |
| 282–410 | Telefon 3D | Phone RoundedBox + skrin CanvasTexture; "BERHENTI SCROLL."; chip | Fade + scale |
| 404–530 | Training | Wipe bulatan limau, carousel 3D 8 modul, chip Individu/Syarikat/Agensi | Zoom blur |
| 525–610 | Proses | Butang memanjang jadi toolbar 4 langkah, kursor klik, tilt 3D | Fade |
| 608–685 | Logo reveal | Pen bercahaya dedahkan logo, kemudian logo bertukar jadi butang "Hubungi Kami" | Liquid blob |
| 680–730 | CTA cecair | Pil berombak dengan gradien mengalir | Bokeh oren |
| 720–900 | End card | Logo 3D (lapisan tekstur diekstrud), confetti 3D, WhatsApp Dee 011-1620 0864 | Fade audio |

## Audio
- Muzik: `public/music.mp3` (The Mountain), volume 0.6, fade masuk dan keluar.
- 12 SFX buatan sendiri di `public/sfx/` (dijana oleh `tools/sfx_gen.py`), dengan 65 cue dalam `src/Sfx.tsx`.
- Selepas render: limiter `alimiter=limit=0.85` (puncak ≈ -1.2 dB).

## Render semula
```bash
npx remotion render src/index.ts PocketReel out/reel.mp4 --gl=angle --concurrency=4 --crf=18 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
ffmpeg -i out/reel.mp4 -c:v copy -af "alimiter=limit=0.85:attack=2:release=60:level=false" -c:a aac -b:a 192k out/reel_final.mp4
```
