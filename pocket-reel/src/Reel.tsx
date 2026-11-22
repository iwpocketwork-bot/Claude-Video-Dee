import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, interpolate, Sequence, staticFile} from 'remotion';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';
import {Sfx} from './Sfx';
import {S1Hook} from './scenes/S1Hook';
import {S2Cubes} from './scenes/S2Cubes';
import {S3Picker} from './scenes/S3Picker';
import {S4Bars} from './scenes/S4Bars';
import {S5Phone} from './scenes/S5Phone';
import {S5bTraining} from './scenes/S5bTraining';
import {S6Process} from './scenes/S6Process';
import {S7Handwrite} from './scenes/S7Handwrite';
import {S8Cta} from './scenes/S8Cta';
import {S9End} from './scenes/S9End';

export const Reel: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      ['400 40px Poppins', '600 40px Poppins', '800 40px Poppins', '900 40px Poppins'].map((f) =>
        document.fonts.load(f),
      ),
    ).then(() => continueRender(h));
  }, [h]);

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Audio src={staticFile('music.mp3')} volume={(fr) => interpolate(fr, [0, 8, 855, 900], [0, 0.6, 0.6, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      <Sfx />
      <Sequence from={0} durationInFrames={78}><S1Hook /></Sequence>
      <Sequence from={75} durationInFrames={95}><S2Cubes /></Sequence>
      <Sequence from={168} durationInFrames={112}><S3Picker /></Sequence>
      <Sequence from={282} durationInFrames={128}><S5Phone /></Sequence>
      <Sequence from={264} durationInFrames={38}><S4Bars /></Sequence>
      <Sequence from={404} durationInFrames={126}><S5bTraining /></Sequence>
      <Sequence from={525} durationInFrames={85}><S6Process /></Sequence>
      <Sequence from={608} durationInFrames={77}><S7Handwrite /></Sequence>
      <Sequence from={680} durationInFrames={50}><S8Cta /></Sequence>
      <Sequence from={720} durationInFrames={180}><S9End /></Sequence>
    </AbsoluteFill>
  );
};
