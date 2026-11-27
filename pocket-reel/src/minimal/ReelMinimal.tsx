import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, Sequence, staticFile} from 'remotion';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import {glide, Grain, M} from './kit';
import {M1Intro, M2Statement, M3Services, M4Training, M5Process, M6End} from './Scenes';

// global start frame of each scene
const T = {m1: 0, m2: 105, m3: 262, m4: 435, m5: 595, m6: 720};

// frames where an eased value crosses each integer step (for ticks synced to motion)
const crossings = (start: number, a: number, b: number, from: number, to: number, steps: number[]) =>
  steps.map((s) => {
    for (let fr = a; fr <= b; fr++) {
      const val = interpolate(fr, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: glide});
      if (val >= s - 0.02) return start + fr;
    }
    return start + b;
  });

type Cue = [number, string, number];
const CUES: Cue[] = [
  [T.m1 + 4, 'min_whoosh', 0.45],
  [T.m1 + 38, 'min_thump', 0.8],
  [T.m1 + 64, 'min_tick', 0.35],
  [T.m2, 'min_whoosh', 0.6],
  [T.m2 + 20, 'min_tick', 0.35],
  [T.m2 + 28, 'min_tick', 0.35],
  [T.m3 + 4, 'min_swish', 0.4],
  ...crossings(T.m3, 40, 160, 0, 6, [0, 1, 2, 3, 4, 5, 6]).map((fr) => [fr, 'min_tick', 0.5] as Cue),
  [T.m4, 'min_whoosh', 0.6],
  [T.m4 + 28, 'min_tick', 0.35],
  ...[0, 1, 2, 3, 4, 5].map((k) => [T.m4 + 70 + k * 20, 'min_tick', 0.3] as Cue),
  [T.m5, 'min_whoosh', 0.6],
  ...crossings(T.m5, 20, 100, 0, 1, [0, 1 / 3, 2 / 3, 1]).map((fr) => [fr, 'min_tick', 0.5] as Cue),
  [T.m6, 'min_whoosh', 0.6],
  [T.m6 + 8, 'min_thump', 0.9],
  [T.m6 + 70, 'min_swish', 0.45],
  [T.m6 + 84, 'min_chime', 0.7],
];

export const ReelMinimal: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['300 40px Poppins', '400 40px Poppins', '500 40px Poppins', '600 40px Poppins'].map((f) => document.fonts.load(f))).then(() =>
      continueRender(h),
    );
  }, [h]);
  return (
    <AbsoluteFill style={{background: M.black}}>
      <Audio
        src={staticFile('music.mp3')}
        volume={(fr) => interpolate(fr, [0, 20, 850, 900], [0, 0.5, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Sequence from={T.m1} durationInFrames={125}><M1Intro /></Sequence>
      <Sequence from={T.m2} durationInFrames={165}><M2Statement /></Sequence>
      <Sequence from={T.m3} durationInFrames={190}><M3Services /></Sequence>
      <Sequence from={T.m4} durationInFrames={175}><M4Training /></Sequence>
      <Sequence from={T.m5} durationInFrames={135}><M5Process /></Sequence>
      <Sequence from={T.m6} durationInFrames={180}><M6End /></Sequence>
      <Grain />
    </AbsoluteFill>
  );
};
