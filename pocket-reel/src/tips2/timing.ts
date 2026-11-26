import {WORDS} from './words';

export const FPS = 30;
/** start frame of word i in the voiceover */
export const W = (i: number) => Math.round(WORDS[i][1] * FPS);
/** end frame of word i */
export const WE = (i: number) => Math.round(WORDS[i][2] * FPS);

// Word index map (VO take A):
// 0 Nak 1 video 2 nampak 3 pro? 4 Kami 5 rakam 6 guna 7 telefon 8 je.
// 9 Mula-mula 10 tekan 11 lama 12 dekat 13 subjek 14 Fokus 15 dan 16 cahaya 17 terus 18 lock 19 — 20 tak 21 lari-lari
// 22 Dulu? 23 Ramai 24 ingat 25 kena 26 beli 27 kamera 28 mahal, 29 lampu 30 mahal, 31 mic 32 mahal.
// 33 Sebenarnya… 34 cukup 35 enam 36 trick 37 ni.
// 38 Letak 39 subjek 40 dekat 41 garisan 42 satu 43 per 44 tiga. 45 Hadap 46 tingkap 47 — 48 cahaya 49 lembut, 50 percuma.
// 51 Siku 52 rapat 53 dengan 54 badan, 55 gerak 56 perlahan. 57 Video 58 terus 59 stabil.
// 60 Audio 61 pula, 62 guna 63 mic 64 klip, 65 dekat 66 dengan 67 mulut. 68 24 69 fps 70 untuk 71 rasa 72 filem, 73 60 74 untuk 75 slow-mo.
// 76 Kenapa 77 penting? 78 Nampak 79 pro 80 tanpa 81 kamera 82 mahal. 83 Content 84 lebih 85 konsisten. 86 Penonton 87 tengok 88 sampai 89 habis.
// 90 Nak 91 belajar 92 hands-on? 93 Join 94 training 95 Mobile 96 Filmmaking 97 dengan 98 Pocket 99 Production.

export const TOTAL = 1440; // 48s (VO ends ~46.2s, hold on logo)

// scene starts (global frames), derived from the VO so visuals stay locked to the voice
export const SC = {
  hook: 0,
  phone: W(9) - 4, // "Mula-mula"
  dulu: W(22) - 6, // "Dulu?"
  cards: W(38) - 8, // "Letak subjek…"
  stabil: W(51) - 8, // "Siku rapat…"
  audio: W(60) - 8, // "Audio pula…"
  why: W(76) - 6, // "Kenapa penting?"
  end: W(90) - 4, // "Nak belajar hands-on?"
};

// caption phrases (word index ranges) — shown as a karaoke pill
export const PHRASES: [number, number][] = [
  [0, 3], [4, 8], [9, 13], [14, 21],
  [38, 44], [45, 50],
  [51, 54], [55, 56], [57, 59],
  [60, 64], [65, 67], [68, 72], [73, 75],
];
