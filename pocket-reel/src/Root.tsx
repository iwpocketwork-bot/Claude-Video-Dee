import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';

export const RemotionRoot: React.FC = () => (
  <Composition id="PocketReel" component={Reel} durationInFrames={900} fps={30} width={1080} height={1920} />
);
