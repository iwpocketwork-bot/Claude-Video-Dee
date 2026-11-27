import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import {Header, SEnd, SIntro, SRecap, STip1, STip2, STip3, STip4, STip5, STip6} from './Scenes';

// Style 04 "Kinetic Explainer" — Tips rakam video guna telefon (ref: references/REF-04-kinetic-explainer)
export const TIPS_DURATION = 1455;
const W = 16; // wipe overlap
const S = {intro: 0, t1: 150, t2: 330, t3: 510, t4: 690, t5: 870, t6: 1050, recap: 1200, end: 1305};

// header colour follows each circle wipe exactly (wipe = 16f, centre 540,900, max r 2300 — same as kit.Wipe)
const MODES: [number, 'light' | 'dark'][] = [
  [0, 'light'],
  [S.t2, 'dark'],
  [S.t3, 'light'],
  [S.t4, 'dark'],
  [S.t5, 'light'],
  [S.t6, 'dark'],
];

type Cue = [number, string, number];
const tip = (s: number, extra: Cue[]): Cue[] => [[s, 'min_whoosh', 0.55], [s + 14, 'min_tick', 0.4], [s + 20, 'pop', 0.45], ...extra.map(([f, n, v]) => [s + f, n, v] as Cue)];
const CUES: Cue[] = [
  [4, 'min_swish', 0.4],
  [58, 'pop', 0.5],
  [70, 'min_tick', 0.3],
  [108, 'min_tick', 0.3],
  [S.t1 + 4, 'min_swish', 0.4],
  [S.t1 + 18, 'pop', 0.45],
  [S.t1 + 48, 'click', 0.8],
  [S.t1 + 60, 'pop', 0.7],
  [S.t1 + 80, 'min_swish', 0.3],
  ...tip(S.t2, [[26, 'swipe', 0.4], [60, 'min_swish', 0.4], [92, 'shimmer', 0.45]]),
  ...tip(S.t3, [[34, 'pop', 0.6], [70, 'pop', 0.6], [74, 'shimmer', 0.4]]),
  ...tip(S.t4, [[30, 'glitch', 0.25], [70, 'min_swish', 0.5], [100, 'ding', 0.5]]),
  ...tip(S.t5, [[42, 'tick', 0.6], [78, 'tick', 0.6], [114, 'tick', 0.6]]),
  ...tip(S.t6, [[26, 'swipe', 0.4], [66, 'min_swish', 0.45], [100, 'shimmer', 0.45]]),
  [S.recap, 'min_whoosh', 0.45],
  [S.recap + 30, 'pop', 0.45],
  [S.recap + 46, 'pop', 0.45],
  [S.recap + 62, 'pop', 0.45],
  [S.end, 'min_whoosh', 0.5],
  [S.end + 8, 'min_thump', 0.7],
  [S.end + 24, 'min_chime', 0.55],
];

const HeaderTrack: React.FC = () => {
  const f = useCurrentFrame();
  let i = 0;
  MODES.forEach(([st], j) => {
    if (f >= st) i = j;
  });
  const [st, mode] = MODES[i];
  const prev = i > 0 ? MODES[i - 1][1] : mode;
  const r = interpolate(f, [st, st + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1)}) * 2300;
  const vis = interpolate(f, [52, 66, TIPS_DURATION - 22, TIPS_DURATION - 4], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const wiping = i > 0 && f < st + 16;
  return (
    <>
      {wiping && (
        <AbsoluteFill style={{WebkitMaskImage: `radial-gradient(circle at 540px 900px, transparent ${r}px, #000 ${r + 1}px)`}}>
          <Header mode={prev} visible={vis} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={wiping ? {clipPath: `circle(${r}px at 540px 900px)`} : undefined}>
        <Header mode={mode} visible={vis} />
      </AbsoluteFill>
    </>
  );
};

export const ReelTips: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['400 40px "DM Sans"', '500 40px "DM Sans"', '700 40px "DM Sans"', '400 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'].map((x) => document.fonts.load(x))).then(() =>
      continueRender(h),
    );
  }, [h]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio
        src={staticFile('music.mp3')}
        volume={(fr) => interpolate(fr, [0, 20, TIPS_DURATION - 50, TIPS_DURATION], [0, 0.4, 0.4, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Sequence from={S.intro} durationInFrames={S.t1 - S.intro + W}><SIntro /></Sequence>
      <Sequence from={S.t1} durationInFrames={S.t2 - S.t1 + W}><STip1 /></Sequence>
      <Sequence from={S.t2} durationInFrames={S.t3 - S.t2 + W}><STip2 /></Sequence>
      <Sequence from={S.t3} durationInFrames={S.t4 - S.t3 + W}><STip3 /></Sequence>
      <Sequence from={S.t4} durationInFrames={S.t5 - S.t4 + W}><STip4 /></Sequence>
      <Sequence from={S.t5} durationInFrames={S.t6 - S.t5 + W}><STip5 /></Sequence>
      <Sequence from={S.t6} durationInFrames={S.recap - S.t6 + 10}><STip6 /></Sequence>
      <Sequence from={S.recap} durationInFrames={S.end - S.recap + 10}><SRecap /></Sequence>
      <Sequence from={S.end} durationInFrames={TIPS_DURATION - S.end}><SEnd /></Sequence>
      <HeaderTrack />
    </AbsoluteFill>
  );
};
