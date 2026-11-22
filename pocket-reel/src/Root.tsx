import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Style 01 — Kinetic UI: 9:16 Reels */}
    <Composition id="PocketReel" component={Reel} durationInFrames={900} fps={30} width={1080} height={1920} />
    {/* Style 01 — Kinetic UI: 16:9 website */}
    <Composition id="PocketReelWide" component={Reel} durationInFrames={900} fps={30} width={1920} height={1080} />
  </>
);
