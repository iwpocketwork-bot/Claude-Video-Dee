# REF-04: "Kinetic Explainer" (rujukan gaya)

**Sumber:** Threads, @fareez.hilmi (post DgJ0mNBk1sO). Dimuat turun dan diberi oleh pengguna.
**Format:** 9:16 · 720×1280 · 30fps · ~47s
**Contact sheet:** `contact-sheet-1.jpg` (0–15s), `-2` (15–30s), `-3` (30–45s), dengan 2 frame sesaat.

Digunakan untuk: **Style 04 Tips** (`src/tips/`, composition `PocketTips`).

## Ringkasan gaya
Video explainer atau tips yang dipacu teks, tanpa talking head. Mesej dibawa oleh teks kinetik,
kad UI yang dibina langkah demi langkah, dan pil kapsyen di bawah seperti sari kata.

## Unsur visual
| Unsur | Perincian |
|---|---|
| Latar cerah | `#f2f2f6` dengan cahaya lavender kabur di atas kanan |
| Latar gelap | Navy `#0a0c1c` dengan cahaya biru di atas kanan dan teal di bawah kiri |
| Tajuk tetap | Kiri atas, bold ~2 baris. Perkataan kunci dalam **chip lime** (mod cerah) atau teks lime (mod gelap). Kekal sepanjang video |
| Teks besar | Rata kiri, bold, muncul perkataan demi perkataan dari blur ke tajam. Perkataan penting berwarna lime atau merah |
| Kad UI | Kad gelap berbucu bulat dengan tilt 3D ringan, masuk dengan spring. Kandungan dibina berperingkat (menaip, pilih chip, tambah swatch, waveform merah→hijau, kaunter nombor) |
| Pil kapsyen | Pil putih kecil di bawah tengah, ayat pendek bergilir seperti sari kata |
| Label mono | Teks kecil monospace untuk label teknikal ("squash 14%", "LUFS master") |
| Font | Sans geometri bold (DM Sans) dan mono |

## Tempo dan transition
- Satu idea setiap ~4–6 saat, bersilih ganti antara cerah dan gelap.
- **Wipe bulatan** semasa bertukar mod (bulatan berkembang dari tengah).
- Perkataan masuk satu demi satu (~3 frame setiap perkataan) dengan blur 12px→0.
- Kad: spring scale dan sedikit rotateX/rotateY. Elemen dalam kad muncul berperingkat.
- Penutup: pil biru (command atau nama) dengan satu baris teks dan label mono kecil, kemudian fade.

## Struktur naratif
1. Hook soalan ("Nak edit video?") dengan jawapan ringkas (tajuk tetap)
2. Demo langkah demi langkah (kad UI dengan kapsyen)
3. Kontras "Dulu? …" (gelap, teks merah untuk masalah)
4. Solusi dan demo (cerah)
5. "Kenapa sesuai?" senarai 01/02/03 (gelap)
6. CTA pil dan penutup
