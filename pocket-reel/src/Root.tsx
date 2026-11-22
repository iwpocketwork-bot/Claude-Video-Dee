import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {ReelMinimal} from './minimal/ReelMinimal';
import {ReelWorld} from './world/ReelWorld';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Style 01 — Kinetic UI (locked) */}
    <Composition id="PocketReel" component={Reel} durationInFrames={900} fps={30} width={1080} height={1920} />
    {/* Style 02 — Minimal Elegan */}
    <Composition id="PocketReelMinimal" component={ReelMinimal} durationInFrames={900} fps={30} width={1080} height={1920} />
    {/* Style 03 — 3D World */}
    <Composition id="PocketReelWorld" component={ReelWorld} durationInFrames={900} fps={30} width={1080} height={1920} />
    {/* Style 03 — 3D World, landscape for website */}
    <Composition id="PocketReelWorldWide" component={ReelWorld} durationInFrames={900} fps={30} width={1920} height={1080} />
  </>
);
