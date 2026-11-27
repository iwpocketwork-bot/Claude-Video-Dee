import React from 'react';
import {Composition} from 'remotion';
import {Reel} from './Reel';
import {ReelMinimal} from './minimal/ReelMinimal';
import {ReelWorld} from './world/ReelWorld';
import {ReelTips, TIPS_DURATION} from './tips/ReelTips';
import {ReelTips2} from './tips2/ReelTips2';
import {TOTAL as TIPS2_TOTAL} from './tips2/timing';
import {ReelPremium, PREMIUM_TOTAL} from './premium/ReelPremium';
import {ReelPremiumEN, PREMIUM_EN_TOTAL} from './premium_en/ReelPremiumEN';
import {ReelSignature, SIG_TOTAL} from './signature/ReelSignature';
import {ReelSignaturePrint, SIGP_TOTAL} from './signature/ReelSignaturePrint';
import {ReelSignatureClean, SIGC_TOTAL} from './signature/ReelSignatureClean';

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
    {/* Style 04 — Kinetic Explainer: Tips rakam video guna telefon */}
    <Composition id="PocketTips" component={ReelTips} durationInFrames={TIPS_DURATION} fps={30} width={1080} height={1920} />
    {/* Style 04b — Kinetic Explainer v2: ikut rujukan, VO lelaki, telefon 3D realistik */}
    <Composition id="PocketTipsVO" component={ReelTips2} durationInFrames={TIPS2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{music: 'music.mp3'}} />
    <Composition id="PocketTipsVOSubClair" component={ReelTips2} durationInFrames={TIPS2_TOTAL} fps={30} width={1080} height={1920} defaultProps={{music: 'music_subclair.mp3'}} />
    <Composition id="PocketTipsVOSubClairWide" component={ReelTips2} durationInFrames={TIPS2_TOTAL} fps={30} width={1920} height={1080} defaultProps={{music: 'music_subclair.mp3'}} />
    {/* Style 05 — Iklan Cetak Klasik: Berhenti panggil produk anda premium */}
    <Composition id="PocketPremium" component={ReelPremium} durationInFrames={PREMIUM_TOTAL} fps={30} width={1080} height={1920} />
    {/* Style 05b — original video + print-ad overlay graphics (English) */}
    <Composition id="PocketPremiumEN" component={ReelPremiumEN} durationInFrames={PREMIUM_EN_TOTAL} fps={30} width={1080} height={1920} />
    {/* Style 06 — Pocket Signature (mix of Styles 01–05, REF-04 content) */}
    <Composition id="PocketSignature" component={ReelSignature} durationInFrames={SIG_TOTAL} fps={30} width={1080} height={1920} />
    {/* Style 06b — Pocket Signature content in the print-ad (Style 05) look */}
    <Composition id="PocketSignaturePrint" component={ReelSignaturePrint} durationInFrames={SIGP_TOTAL} fps={30} width={1080} height={1920} />
    {/* Style 06c — Pocket Clean: REF-04 look with Pocket brand kit */}
    <Composition id="PocketSignatureClean" component={ReelSignatureClean} durationInFrames={SIGC_TOTAL} fps={30} width={1080} height={1920} />
  </>
);
