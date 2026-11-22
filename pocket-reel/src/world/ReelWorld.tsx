import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, Sequence, staticFile} from 'remotion';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/800.css';
import {W1Desk, W2Problems, W3Portal, W4Services, W5Training, W6Export, W7End} from './Scenes';

// Style 03 — "3D World": global start frame per shot
export const T = {w1: 0, w2: 105, w3: 195, w4: 295, w5: 418, w6: 552, w7: 745};

type Cue = [number, string, number];
const CUES: Cue[] = [
  [T.w1 + 2, 'min_whoosh', 0.5],
  [T.w1 + 10, 'min_thump', 0.5], // laptop wakes
  [T.w1 + 44, 'pop', 0.6],
  [T.w2, 'min_swish', 0.5],
  [T.w2 + 10, 'pop', 0.5],
  [T.w2 + 16, 'pop', 0.7],
  [T.w2 + 25, 'pop', 0.7],
  [T.w2 + 34, 'pop', 0.7],
  [T.w2 + 52, 'shimmer', 0.5],
  [T.w3, 'whoosh', 0.7], // portal
  [T.w3 + 10, 'swipe', 0.5],
  [T.w3 + 40, 'impact', 0.6], // icon lands
  [T.w3 + 50, 'pop', 0.5],
  [T.w4, 'min_whoosh', 0.5],
  ...[0, 1, 2, 3, 4, 5, 6].map((i) => [T.w4 + 30 + i * 9, 'tick', 0.6] as Cue),
  [T.w4 + 116, 'whoosh', 0.8], // whip pan
  [T.w5 + 18, 'pop', 0.5],
  ...[0, 1, 2, 3].map((i) => [T.w5 + 40 + i * 10, 'click', 0.6] as Cue),
  ...[0, 1, 2].map((i) => [T.w5 + 80 + i * 6, 'pop', 0.45] as Cue),
  [T.w6 + 2, 'min_whoosh', 0.6], // push in
  [T.w6 + 40, 'glitch', 0.4], // dot matrix
  [T.w6 + 92, 'click', 0.9],
  [T.w6 + 96, 'min_swish', 0.4],
  [T.w6 + 152, 'ding', 0.6],
  [T.w7, 'min_whoosh', 0.6],
  [T.w7 + 8, 'min_thump', 0.8],
  [T.w7 + 18, 'shimmer', 0.5],
  [T.w7 + 70, 'pop', 0.6],
  [T.w7 + 78, 'min_chime', 0.6],
];

export const ReelWorld: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['300 40px Poppins', '400 40px Poppins', '500 40px Poppins', '600 40px Poppins', '800 40px Poppins'].map((f) => document.fonts.load(f))).then(() =>
      continueRender(h),
    );
  }, [h]);
  return (
    <AbsoluteFill style={{background: '#05070d'}}>
      <Audio
        src={staticFile('music.mp3')}
        volume={(fr) => interpolate(fr, [0, 15, 850, 900], [0, 0.55, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Sequence from={T.w1} durationInFrames={114}><W1Desk /></Sequence>
      <Sequence from={T.w2} durationInFrames={100}><W2Problems /></Sequence>
      <Sequence from={T.w3} durationInFrames={106}><W3Portal /></Sequence>
      <Sequence from={T.w4} durationInFrames={131}><W4Services /></Sequence>
      <Sequence from={T.w5 + 0} durationInFrames={141}><W5Training /></Sequence>
      <Sequence from={T.w6} durationInFrames={200}><W6Export /></Sequence>
      <Sequence from={T.w7} durationInFrames={155}><W7End /></Sequence>
    </AbsoluteFill>
  );
};
