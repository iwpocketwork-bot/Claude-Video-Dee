import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/700-italic.css';
import '@fontsource/playfair-display/800.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/playfair-display/900-italic.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/special-elite/400.css';
import {Masthead, PrintCaption, Show, W, WE} from './kit';
import {S1Hook, S2Buzz, S3Compare, S4Silence, S5Secret, S6Proof, S7Moral, S8Cta, SC, TOTAL} from './Scenes';
import {WORDS} from './words';

// Style 05 "Iklan Cetak Klasik" — "Berhenti panggil produk anda premium" (BM remake, VO Shahrul)
export const PREMIUM_TOTAL = TOTAL;
const DARK: [number, number][] = [
  [SC.silence + 7, SC.secret + 7],
  [SC.moral + 7, SC.cta + 7],
];
const PHRASES: [number, number][] = [
  [12, 18], [19, 22], [23, 30],
  [33, 39], [40, 42],
  [64, 67], [68, 73],
];

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

const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  const dark = DARK.some(([a, b]) => f >= a && f < b);
  const vis = interpolate(f, [0, 10, TOTAL - 26, TOTAL - 2], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: vis}}>
      <Masthead dark={dark} />
      <PrintCaption phrases={PHRASES} dark={dark} top={1700} />
    </AbsoluteFill>
  );
};

type Cue = [number, string, number];
const CUES: Cue[] = [
  [W(5), 'min_swish', 0.45], // strike premium
  [W(8), 'min_thump', 0.6], // stamp
  [W(12), 'pop', 0.45],
  [W(13), 'pop', 0.45],
  [W(14), 'pop', 0.45],
  [W(16), 'pop', 0.45],
  [W(19), 'min_swish', 0.3],
  [W(20), 'min_swish', 0.3],
  [W(21), 'min_swish', 0.3],
  [W(22), 'min_swish', 0.3],
  [W(25), 'whoosh', 0.35],
  [SC.compare, 'min_whoosh', 0.4],
  [W(39) + 6, 'min_thump', 0.45], // BOSAN stamp
  [W(54), 'tick', 0.7], // clock
  [W(54) + 30, 'tick', 0.55],
  [SC.silence, 'min_whoosh', 0.4],
  [W(73), 'tick', 0.5],
  [W(73) + 30, 'tick', 0.45],
  [W(73) + 60, 'tick', 0.4],
  [SC.secret, 'min_whoosh', 0.4],
  [W(79), 'min_swish', 0.3],
  [W(83) - 4, 'min_thump', 0.45],
  [W(87), 'min_swish', 0.3],
  [W(90) - 4, 'min_thump', 0.45],
  [W(95), 'min_swish', 0.3],
  [W(100) - 4, 'min_thump', 0.45],
  [W(106), 'min_swish', 0.35],
  [SC.moral, 'min_whoosh', 0.4],
  [W(113), 'whoosh', 0.3],
  [W(115), 'min_thump', 0.6],
  [SC.cta, 'min_whoosh', 0.4],
  [W(124), 'min_chime', 0.5],
];

export const ReelPremium: React.FC<{music?: string}> = ({music = 'music_subclair.mp3'}) => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      ['900 40px "Playfair Display"', 'italic 900 40px "Playfair Display"', '800 40px "Playfair Display"', 'italic 400 40px "Playfair Display"', '700 40px "Playfair Display"', '500 20px "Space Grotesk"', '700 20px "Space Grotesk"', '400 20px "Special Elite"'].map((x) =>
        document.fonts.load(x),
      ),
    ).then(() => continueRender(h));
  }, [h]);
  const mv = (fr: number) => interpolate(fr, [0, 12, TOTAL - 45, TOTAL - 2], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (0.3 - 0.19 * speaking(fr));
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile(music)} volume={mv} />
      <Audio src={staticFile('vo/premium_takeA.mp3')} volume={1} />
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Show from={SC.hook} to={SC.hook + SC.buzz - SC.hook + 8}><S1Hook /></Show>
      <Show from={SC.buzz} to={SC.buzz + SC.compare - SC.buzz + 14}><S2Buzz /></Show>
      <Show from={SC.compare} to={SC.compare + SC.silence - SC.compare + 14}><S3Compare /></Show>
      <Show from={SC.silence} to={SC.silence + SC.secret - SC.silence + 14}><S4Silence /></Show>
      <Show from={SC.secret} to={SC.secret + SC.proof - SC.secret + 14}><S5Secret /></Show>
      <Show from={SC.proof} to={SC.proof + SC.moral - SC.proof + 14}><S6Proof /></Show>
      <Show from={SC.moral} to={SC.moral + SC.cta - SC.moral + 14}><S7Moral /></Show>
      <Show from={SC.cta} to={SC.cta + TOTAL - SC.cta}><S8Cta /></Show>
      <Chrome />
    </AbsoluteFill>
  );
};
