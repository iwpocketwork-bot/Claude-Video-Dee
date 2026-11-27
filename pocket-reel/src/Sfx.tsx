import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

type Cue = [frame: number, name: string, vol: number];

// Cue sheet (30fps, frame global). Laraskan `vol` untuk kuat/perlahan setiap bunyi.
export const CUES: Cue[] = [
  // S1 Hook (0)
  [0, 'whoosh', 0.7],
  [4, 'glitch', 0.45],
  [18, 'pop', 0.8],
  [26, 'swipe', 0.4], // selection box drawn
  [38, 'pop', 0.5], // sub pill
  [48, 'click', 0.9],
  [68, 'whoosh', 0.55], // zoom exit
  // S2 Cubes (75)
  [76, 'whoosh_down', 0.5],
  [78, 'pop', 0.4],
  [83, 'pop', 0.4],
  [88, 'impact', 0.9], // CONTENT
  [97, 'pop', 0.45],
  [153, 'shimmer', 0.6], // white flash
  [155, 'whoosh', 0.6],
  // S3 Picker (168)
  [170, 'pop', 0.6],
  [180, 'tick', 0.8],
  [194, 'tick', 0.8],
  [208, 'tick', 0.8],
  [222, 'tick', 0.8],
  [236, 'tick', 0.8],
  [250, 'tick', 0.8],
  // S4 Bars (264)
  [264, 'swipe', 0.7],
  [288, 'whoosh_down', 0.6],
  // S5 Phone (282)
  [286, 'whoosh', 0.6],
  [312, 'pop', 0.5],
  [320, 'swipe', 0.5], // yellow highlight
  [337, 'pop', 0.9], // heart like
  [342, 'pop', 0.5],
  [352, 'pop', 0.5],
  [362, 'pop', 0.5],
  [396, 'whoosh_down', 0.45],
  // S5b Training (404)
  [404, 'bloop', 0.6], // circle wipe
  [405, 'whoosh', 0.5],
  [412, 'pop', 0.6],
  [416, 'pop', 0.45],
  [422, 'impact', 0.7], // sendiri?
  [424, 'whoosh', 0.45], // carousel spins in
  [454, 'pop', 0.55],
  [459, 'pop', 0.55],
  [464, 'pop', 0.55],
  [470, 'swipe', 0.4],
  [516, 'whoosh', 0.55], // exit zoom
  // S6 Process (525)
  [525, 'pop', 0.7],
  [535, 'swipe', 0.5], // toolbar expands
  [553, 'click', 0.9],
  [565, 'click', 0.9],
  [577, 'click', 0.9],
  [589, 'click', 0.9],
  // S7 Logo reveal (608)
  [610, 'scribble', 0.6],
  [648, 'shimmer', 0.6],
  [660, 'swipe', 0.5],
  [666, 'pop', 0.9], // Hubungi Kami
  // S8 CTA (680)
  [680, 'bloop', 0.8],
  [690, 'click', 0.8],
  [714, 'whoosh', 0.7], // bokeh
  // S9 End (720)
  [734, 'pop', 0.4],
  [742, 'pop', 0.5], // BERKEMBANG
  [756, 'pop', 0.4],
  [770, 'pop', 0.8], // WhatsApp button
  [780, 'ding', 0.75], // number
  [818, 'whoosh', 0.6], // text out
  [828, 'impact', 1.0], // final 3D logo
  [830, 'shimmer', 0.55],
];

export const Sfx: React.FC = () => (
  <>
    {CUES.map(([fr, name, vol], i) => (
      <Sequence key={i} from={fr} durationInFrames={60} layout="none">
        <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
      </Sequence>
    ))}
  </>
);
