import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/dm-sans/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import {H1Hook, H2Phone, H3Dulu, H4Cards, H5Stabil, H6Audio, H7Why, H8End, Header, KaraokePill, WIPE_DUR} from './Scenes';
import {SC, TOTAL, W} from './timing';
import {WORDS} from './words';

// Style 04b — "Kinetic Explainer" ikut struktur video rujukan, disegerak frame-by-frame dengan VO lelaki.
// Muzik: tukar fail di MUSIC_FILE. Muzik di-'duck' (direndahkan) bila VO bercakap.
export const MUSIC_FILE = 'music.mp3';
const MUSIC_UP = 0.32; // jeda / intro / outro
const MUSIC_DUCK = 0.12; // bawah suara

/** 0..1 — how much the VO is speaking around frame fr (smoothed ±6 frames) */
const speaking = (fr: number) => {
  const t = fr / 30;
  let v = 0;
  for (const [, a, b] of WORDS) {
    if (t >= a - 0.2 && t <= b + 0.35) return 1;
    const d = Math.min(Math.abs(t - (a - 0.2)), Math.abs(t - (b + 0.35)));
    if (d < 0.25) v = Math.max(v, 1 - d / 0.25);
  }
  return v;
};
const musicVolume = (fr: number) => {
  const env = interpolate(fr, [0, 12, TOTAL - 45, TOTAL - 2], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return env * (MUSIC_UP - (MUSIC_UP - MUSIC_DUCK) * speaking(fr));
};

const MODES: [number, 'light' | 'dark'][] = [
  [0, 'light'],
  [SC.dulu, 'dark'],
  [SC.cards, 'light'],
  [SC.stabil, 'dark'],
  [SC.audio, 'light'],
  [SC.why, 'dark'],
];

const HeaderTrack: React.FC = () => {
  const f = useCurrentFrame();
  let i = 0;
  MODES.forEach(([st], j) => {
    if (f >= st) i = j;
  });
  const [st, mode] = MODES[i];
  const prev = i > 0 ? MODES[i - 1][1] : mode;
  const r = interpolate(f, [st, st + WIPE_DUR], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.65, 0, 0.35, 1)}) * 2300;
  const wiping = i > 0 && f < st + WIPE_DUR;
  return (
    <>
      {wiping && (
        <AbsoluteFill style={{WebkitMaskImage: `radial-gradient(circle at 540px 900px, transparent ${r}px, #000 ${r + 1}px)`}}>
          <Header mode={prev} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={wiping ? {clipPath: `circle(${r}px at 540px 900px)`} : undefined}>
        <Header mode={mode} />
      </AbsoluteFill>
    </>
  );
};

type Cue = [number, string, number];
const CUES: Cue[] = [
  [W(4) - 4, 'min_swish', 0.35], // phone rises
  [W(11), 'click', 0.55], // tap
  [W(18), 'pop', 0.5], // AE/AF LOCK
  [SC.dulu, 'min_whoosh', 0.45],
  [W(28), 'min_tick', 0.35],
  [W(30), 'min_tick', 0.35],
  [W(32), 'min_tick', 0.35],
  [W(35), 'pop', 0.55], // 6
  [SC.cards, 'min_whoosh', 0.45],
  [W(41), 'min_swish', 0.3], // grid
  [W(44), 'pop', 0.45], // 1/3
  [W(45), 'pop', 0.4],
  [W(50), 'pop', 0.5], // RM0
  [SC.stabil, 'min_whoosh', 0.45],
  [W(57), 'shimmer', 0.35], // smooth
  [SC.audio, 'min_whoosh', 0.45],
  [W(65), 'min_swish', 0.35],
  [W(68), 'pop', 0.45],
  [W(73), 'pop', 0.45],
  [SC.why, 'min_whoosh', 0.45],
  [W(78), 'min_tick', 0.35],
  [W(83), 'min_tick', 0.35],
  [W(86), 'min_tick', 0.35],
  [W(93), 'min_swish', 0.4], // blue pill
  [W(98), 'min_chime', 0.45], // brand
];

export const ReelTips2: React.FC<{music?: string}> = ({music = MUSIC_FILE}) => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['400 40px "DM Sans"', '500 40px "DM Sans"', '700 40px "DM Sans"', '800 40px "DM Sans"', '400 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'].map((x) => document.fonts.load(x))).then(() =>
      continueRender(h),
    );
  }, [h]);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile(music)} volume={musicVolume} />
      <Audio src={staticFile('vo/vo3_takeB.mp3')} volume={1} />
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={SC.dulu + WIPE_DUR}><H1Hook /></Sequence>
      <Sequence from={0} durationInFrames={SC.dulu + 12}><H2Phone offset={0} /></Sequence>
      <Sequence from={SC.dulu} durationInFrames={SC.cards - SC.dulu + WIPE_DUR}><H3Dulu /></Sequence>
      <Sequence from={SC.cards} durationInFrames={SC.stabil - SC.cards + WIPE_DUR}><H4Cards /></Sequence>
      <Sequence from={SC.stabil} durationInFrames={SC.audio - SC.stabil + WIPE_DUR}><H5Stabil /></Sequence>
      <Sequence from={SC.audio} durationInFrames={SC.why - SC.audio + WIPE_DUR}><H6Audio /></Sequence>
      <Sequence from={SC.why} durationInFrames={SC.end - SC.why + 6}><H7Why /></Sequence>
      <Sequence from={SC.end} durationInFrames={TOTAL - SC.end}><H8End /></Sequence>
      <HeaderTrack />
      <KaraokePill />
    </AbsoluteFill>
  );
};
