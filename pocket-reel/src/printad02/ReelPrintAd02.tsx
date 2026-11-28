import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/700-italic.css';
import '@fontsource/playfair-display/800.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/playfair-display/900-italic.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/special-elite/400.css';
import {io, k, Masthead, P, Paper, PrintCaption, Said, Stamp, Strike, useSpr, W, WE} from './kit';

// Style 05b — Print Ad overlay, episode 02: "People buy safe decisions" (original English video kept)
const VIDEO_END = Math.round(29.23 * 30);
const OUTRO = 255; // 8.5s end card
export const PRINTAD02_TOTAL = VIDEO_END + OUTRO;
// Source credit — confirm the creator's handle with the user before publishing
export const CREDIT_VIDEO = 'Prime Brains | The Business Minds';
const L = 70;

// video frame geometry (source 720x1280; picture y 340–940, burned-in captions start ~y845 → crop at 835)
const FW = 980;
const SCALE = FW / 720;
const SRC_TOP = 340;
const SRC_H = 495;
const FH = Math.round(SRC_H * SCALE);
const FX = (1080 - FW) / 2;
const FY = 600;
const Z = FY + FH + 84; // top of bottom zone (caption sits at 1790)

const SEC = {
  a: 0,
  b: W(16) - 6, // Think about it
  c: W(28) - 6, // Why did you choose this vendor?
  d: W(41) - 6, // they will not choose you
  d2: W(52) - 4, // That is why trust sells
  e: W(59) - 6, // A buyer is not only thinking
  f: W(79) - 6, // Your marketing should answer
  g: W(91) - 6, // Because people…
};
const PHRASES: [number, number][] = [
  [0, 7], [8, 15], [16, 18], [19, 22], [23, 27], [28, 33], [34, 40], [41, 45], [46, 51], [52, 56], [57, 58],
  [59, 64], [65, 67], [68, 71], [72, 74], [75, 78], [79, 82], [83, 85], [86, 90], [91, 97], [98, 101],
];

const Label: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: P.sans, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: P.ink, ...style}}>{children}</div>
);
const Type: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: P.type, fontSize: 32, color: P.ink, lineHeight: 1.35, ...style}}>{children}</div>
);
/** printed card with a hard offset shadow */
const Sheet: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: 'relative', background: '#f6f1e5', border: `3px solid ${P.ink}`, boxShadow: '8px 10px 0 rgba(40,30,10,.18)', padding: 22, boxSizing: 'border-box', ...style}}>{children}</div>
);

/** cross-fades a block in/out over a global frame window */
const Block: React.FC<{from: number; to: number; children: React.ReactNode; style?: React.CSSProperties}> = ({from, to, children, style}) => {
  const g = useCurrentFrame();
  if (g < from - 2 || g > to + 10) return null;
  const v = k(g, from, from + 8) * (1 - k(g, to, to + 8));
  return <div style={{position: 'absolute', opacity: v, filter: `blur(${(1 - v) * 8}px)`, ...style}}>{children}</div>;
};

/** text typed letter by letter between two frames */
const Typed: React.FC<{text: string; a: number; b: number}> = ({text, a, b}) => {
  const g = useCurrentFrame();
  const n = Math.round(interpolate(g, [a, b], [0, text.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  return <>{text.slice(0, n)}</>;
};

// ------------------------------------------------------------------ headline zone (top)
const Headlines: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <>
      <Block from={SEC.a} to={SEC.b} style={{left: L, right: L, top: 200}}>
        <Said from={0} to={3} size={66} />
        <div style={{display: 'flex', alignItems: 'baseline'}}>
          <Said from={4} to={5} size={66} />
          <div style={{position: 'relative'}}>
            <Said from={6} to={6} size={66} italic weight={900} />
            {g >= W(8) && <Strike at={W(8)} thick={10} />}
          </div>
          <Said from={7} to={7} size={66} />
        </div>
        <Said from={8} to={15} size={44} italic weight={700} color={P.inkSoft} breaks={[11]} accent={{14: {color: P.red}, 15: {color: P.red}}} style={{marginTop: 18}} />
      </Block>
      <Block from={SEC.b} to={SEC.c} style={{left: L, right: L, top: 210}}>
        <Label style={{opacity: k(g, W(16), W(16) + 8)}}>THINK ABOUT IT</Label>
        <Said from={19} to={27} size={72} breaks={[22]} accent={{26: {color: P.red, fontStyle: 'italic'}, 27: {color: P.red, fontStyle: 'italic'}}} style={{marginTop: 16}} />
      </Block>
      <Block from={SEC.c} to={SEC.d} style={{left: L, right: L, top: 200}}>
        <Label>THE QUESTION THEY WILL BE ASKED</Label>
        <Said from={28} to={33} size={90} italic weight={900} breaks={[31]} accent={{33: {color: P.red}}} style={{marginTop: 14}} />
      </Block>
      <Block from={SEC.d} to={SEC.d2} style={{left: L, right: L, top: 210}}>
        <Said from={41} to={45} size={70} accent={{43: {color: P.red}}} />
        <Said from={46} to={51} size={46} italic weight={700} color={P.inkSoft} style={{marginTop: 14}} />
      </Block>
      <Block from={SEC.d2} to={SEC.e} style={{left: L, right: L, top: 210}}>
        <Said from={52} to={58} size={78} breaks={[54]} accent={{55: {color: P.red, fontStyle: 'italic'}, 56: {color: P.red, fontStyle: 'italic'}, 57: {color: P.inkSoft}, 58: {color: P.inkSoft}}} />
      </Block>
      <Block from={SEC.e} to={SEC.f} style={{left: L, right: L, top: 210}}>
        <Label>INSIDE THE BUYER'S HEAD</Label>
        <Said from={59} to={64} size={68} breaks={[61]} style={{marginTop: 16}} />
      </Block>
      <Block from={SEC.f} to={SEC.g} style={{left: L, right: L, top: 200}}>
        <Said from={79} to={85} size={62} breaks={[82]} accent={{84: {color: P.red, fontStyle: 'italic'}, 85: {color: P.red, fontStyle: 'italic'}}} />
        <Said from={86} to={90} size={46} italic weight={700} color={P.inkSoft} style={{marginTop: 12}} />
      </Block>
      <Block from={SEC.g} to={VIDEO_END} style={{left: L, right: L, top: 200}}>
        <Said from={91} to={97} size={54} color={P.inkSoft} breaks={[94]} />
        <Said from={98} to={101} size={92} italic weight={900} breaks={[99]} accent={{100: {color: P.red}, 101: {color: P.red}}} style={{marginTop: 6}} />
      </Block>
    </>
  );
};

// ------------------------------------------------------------------ bottom zone graphics
const Bottom: React.FC = () => {
  const g = useCurrentFrame();
  // A: two products
  const pa = useSpr(g - W(6), 14, 150);
  const pb = useSpr(g - W(11), 14, 150);
  const loser = k(g, W(15), W(15) + 10);
  // B: incident report
  const wrong = useSpr(g - W(20), 12, 170);
  const safe = useSpr(g - W(26), 12, 170);
  // D: features
  const feats = ['More features', 'Lower price', 'Faster delivery'];
  // E/F: two questions
  const q1 = useSpr(g - W(65), 14, 150);
  const q2 = useSpr(g - W(72), 14, 150);
  const second = k(g, W(84), W(84) + 8);
  const first = k(g, W(89), W(89) + 10);
  return (
    <>
      {/* A — best product vs the one they can explain */}
      <Block from={W(6) - 4} to={SEC.b} style={{left: 40, right: 40, top: Z, display: 'flex', gap: 26}}>
        {[0, 1].map((i) => {
          const s = i === 0 ? pa : pb;
          return (
            <div key={i} style={{flex: 1, opacity: s * (i === 0 ? 1 - loser * 0.5 : 1), transform: `translateY(${(1 - s) * 60}px) rotate(${i === 0 ? -1.5 : 1.5}deg)`}}>
              <Sheet style={{height: 320}}>
                <Label style={{fontSize: 20}}>{i === 0 ? 'PRODUCT A' : 'PRODUCT B'}</Label>
                <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 64, marginTop: 10, letterSpacing: 4}}>{i === 0 ? '★★★★★' : '★★★★☆'}</div>
                <Type style={{marginTop: 14}}>{i === 0 ? 'Best specs.' : 'Easy to explain.'}</Type>
                <Type style={{color: P.inkSoft, fontSize: 26}}>{i === 0 ? 'Hard to justify.' : 'Safe to defend.'}</Type>
                {i === 1 && <Stamp at={W(15)} text="BOUGHT ✓" size={34} rot={-8} style={{right: 20, bottom: 18}} />}
              </Sheet>
            </div>
          );
        })}
      </Block>

      {/* B — something goes wrong → safe answer */}
      <Block from={SEC.b + 6} to={SEC.c} style={{left: 90, right: 90, top: Z}}>
        <Sheet style={{height: 360}}>
          <div style={{display: 'flex', justifyContent: 'space-between', borderBottom: `2px solid ${P.ink}`, paddingBottom: 8}}>
            <Label style={{fontSize: 20}}>INCIDENT REPORT</Label>
            <Label style={{fontSize: 20, color: P.inkSoft}}>FORM 7-B</Label>
          </div>
          <Type style={{marginTop: 18, opacity: wrong}}>
            Status: <span style={{color: P.red}}>something went wrong.</span>
          </Type>
          <Type style={{marginTop: 10, opacity: k(g, W(23), W(23) + 6)}}>Who approved it? You.</Type>
          <div style={{marginTop: 22, border: `3px solid ${P.ink}`, padding: '12px 18px', background: safe > 0.5 ? '#fffdf6' : 'transparent'}}>
            <Label style={{fontSize: 18}}>YOUR SAFE ANSWER</Label>
            <div style={{fontFamily: P.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 40, marginTop: 6, opacity: safe, transform: `translateX(${(1 - safe) * 30}px)`}}>"Everyone trusts them."</div>
          </div>
        </Sheet>
      </Block>

      {/* C — the boss memo: why this vendor? */}
      <Block from={SEC.c + 6} to={SEC.d} style={{left: 90, right: 90, top: Z}}>
        <Sheet style={{height: 360}}>
          <Label style={{fontSize: 20, borderBottom: `2px solid ${P.ink}`, paddingBottom: 8}}>MEMO · FROM: THE BOSS</Label>
          <Type style={{marginTop: 16}}>
            RE: <Typed text="Why did you choose this vendor?" a={W(28)} b={WE(33)} />
          </Type>
          <Type style={{marginTop: 28, color: P.inkSoft}}>Your answer:</Type>
          <Type style={{marginTop: 6, fontSize: 44}}>
            <Typed text="uh… well…" a={W(37)} b={W(39) + 8} />
          </Type>
          <Stamp at={W(40)} text="NO CLEAR ANSWER" size={30} rot={-7} style={{right: 26, bottom: 30}} />
        </Sheet>
      </Block>

      {/* D — great vendor, not chosen */}
      <Block from={SEC.d + 4} to={SEC.d2} style={{left: 140, right: 140, top: Z}}>
        <Sheet style={{height: 380, textAlign: 'center'}}>
          <Label style={{fontSize: 20}}>YOUR COMPANY</Label>
          <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 70, letterSpacing: 6, marginTop: 14}}>★★★★★</div>
          <Type style={{marginTop: 14}}>Great product. Fair price.</Type>
          <Type style={{color: P.inkSoft, fontSize: 26, opacity: k(g, W(48), W(48) + 8)}}>(no matter how good)</Type>
          <Stamp at={W(43)} text="NOT CHOSEN" size={44} rot={-6} style={{left: 230, top: 262}} />
        </Sheet>
      </Block>

      {/* D2 — features crossed out, trust stamped */}
      <Block from={SEC.d2 + 4} to={SEC.e} style={{left: L, right: L, top: Z + 10}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
          <div style={{flex: 1}}>
            <Label style={{borderBottom: `3px solid ${P.ink}`, paddingBottom: 8}}>FEATURES</Label>
            {feats.map((t, i) => (
              <div key={t} style={{display: 'flex', alignItems: 'center', height: 92, borderBottom: `2px solid ${P.ink}`, opacity: k(g, SEC.d2 + 8 + i * 5, SEC.d2 + 16 + i * 5)}}>
                <span style={{position: 'relative', display: 'inline-block', fontFamily: P.serif, fontWeight: 800, fontSize: 44, color: P.inkSoft}}>
                  ✓ {t}
                  {g >= W(57) + i * 4 && <Strike at={W(57) + i * 4} thick={8} />}
                </span>
              </div>
            ))}
          </div>
          <div style={{width: 330, height: 300, position: 'relative'}}>
            <Stamp at={W(55)} text="TRUST" size={88} rot={-10} style={{left: 0, top: 90}} />
          </div>
        </div>
      </Block>

      {/* E/F — the two questions in the buyer's head */}
      <Block from={W(65) - 4} to={SEC.g} style={{left: L, right: L, top: Z}}>
        {[
          {n: 'Q1', s: q1, text: 'Will this work?', note: 'everyone answers this'},
          {n: 'Q2', s: q2, text: 'If this fails, will I look stupid?', note: ''},
        ].map((q, i) => (
          <div
            key={q.n}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              height: 170,
              borderBottom: `2px solid ${P.ink}`,
              borderTop: i === 0 ? `3px solid ${P.ink}` : undefined,
              opacity: q.s * (i === 0 ? 1 - first * 0.55 : 1),
              transform: `translateX(${(1 - q.s) * 50}px)`,
            }}
          >
            <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 84, width: 120, color: i === 1 && second > 0.5 ? P.red : P.ink}}>{q.n}</div>
            <div style={{flex: 1, position: 'relative'}}>
              <div style={{fontFamily: P.serif, fontStyle: 'italic', fontWeight: 700, fontSize: i === 0 ? 50 : 44, lineHeight: 1.15}}>
                {i === 1 ? (
                  <>
                    If this fails, will I look <span style={{color: g >= W(78) ? P.red : P.ink}}>stupid?</span>
                  </>
                ) : (
                  q.text
                )}
              </div>
              {i === 0 && <Type style={{fontSize: 24, color: P.inkSoft, opacity: first}}>{q.note}</Type>}
              {i === 1 && (
                <div style={{position: 'absolute', left: -14, right: -14, top: -16, bottom: -16, border: `4px solid ${P.red}`, borderRadius: 60, opacity: second, transform: `scale(${1.15 - second * 0.15}) rotate(-1deg)`}} />
              )}
            </div>
          </div>
        ))}
        <Stamp at={W(84) + 6} text="ANSWER THIS" size={28} rot={-6} style={{right: 0, top: 348}} />
      </Block>

      {/* G — products → safe decisions */}
      <Block from={SEC.g + 4} to={VIDEO_END} style={{left: L, right: L, top: Z + 10, height: 380}}>
        <div style={{textAlign: 'center'}}>
          <span style={{position: 'relative', display: 'inline-block', fontFamily: P.serif, fontWeight: 900, fontSize: 120, color: P.inkSoft, opacity: k(g, W(97) - 4, W(97) + 6)}}>
            products
            {g >= W(98) && <Strike at={W(98)} thick={12} />}
          </span>
        </div>
        <Stamp at={W(100)} text="SAFE DECISIONS ✓" size={56} rot={-6} style={{left: 140, top: 190}} />
      </Block>
    </>
  );
};

// ------------------------------------------------------------------ framed original video
const Framed: React.FC = () => {
  const g = useCurrentFrame();
  const inn = useSpr(g, 16, 120);
  const out = k(g, VIDEO_END - 14, VIDEO_END);
  const tense = k(g, W(75), W(78)) * (1 - k(g, WE(78) + 6, WE(78) + 16)); // "will I look stupid?" — push in
  return (
    <div
      style={{
        position: 'absolute',
        left: FX - 14,
        top: FY - 14,
        width: FW + 28,
        background: '#fbf8f0',
        padding: 14,
        boxShadow: '0 30px 60px rgba(60,40,10,.25), 0 2px 0 rgba(0,0,0,.08)',
        transform: `translateY(${(1 - inn) * 80}px) rotate(${(1 - inn) * -2}deg) scale(${1 - out * 0.06})`,
        opacity: Math.min(1, inn * 1.5) * (1 - out),
      }}
    >
      <div style={{position: 'relative', width: FW, height: FH, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + tense * 0.08})`, transformOrigin: '50% 35%'}}>
          <OffthreadVideo src={staticFile('ref/printad02_orig.mp4')} style={{position: 'absolute', left: 0, top: -SRC_TOP * SCALE, width: FW, height: 1280 * SCALE}} />
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: P.sans, fontSize: 18, letterSpacing: 3, color: P.inkSoft, paddingTop: 10}}>
        <span>FIG. 2 — ON BUYING</span>
        <span>VIDEO: {CREDIT_VIDEO.toUpperCase()}</span>
      </div>
    </div>
  );
};

const EndCard: React.FC = () => {
  const g = useCurrentFrame();
  const s = useSpr(g - VIDEO_END - 4, 13, 140);
  const logo = useSpr(g - VIDEO_END - 50, 12, 140);
  const fade = k(g, PRINTAD02_TOTAL - 22, PRINTAD02_TOTAL - 2);
  if (g < VIDEO_END - 6) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - fade}}>
      <div style={{position: 'absolute', left: L, right: L, top: 600, textAlign: 'center', opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
        <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 84, lineHeight: 1.1}}>
          Make buyers feel
          <br />
          <span style={{color: P.red, fontStyle: 'italic'}}>safe</span> choosing you.
        </div>
        <div style={{fontFamily: P.type, fontSize: 32, color: P.inkSoft, marginTop: 26, opacity: k(g, VIDEO_END + 26, VIDEO_END + 40)}}>Content that earns trust, not just attention.</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1040, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: logo, transform: `scale(${0.85 + logo * 0.15})`}}>
        <Img src={staticFile('logo-dark.png')} style={{width: 300}} />
      </div>
      <div style={{position: 'absolute', left: L, right: L, top: 1680, textAlign: 'center', fontFamily: P.sans, fontSize: 22, letterSpacing: 2, color: P.inkSoft, lineHeight: 1.6, opacity: k(g, VIDEO_END + 70, VIDEO_END + 90)}}>
        <div style={{height: 1, background: P.inkSoft, opacity: 0.5, marginBottom: 14}} />
        Video source: {CREDIT_VIDEO}
        <br />
        Graphics by Pocket Production
      </div>
    </AbsoluteFill>
  );
};

type Cue = [number, string, number];
const CUES: Cue[] = [
  [W(6), 'pop', 0.3],
  [W(8), 'min_swish', 0.35],
  [W(11), 'pop', 0.3],
  [W(15), 'min_thump', 0.5],
  [SEC.b, 'min_whoosh', 0.3],
  [W(20), 'min_tick', 0.4],
  [W(26), 'pop', 0.35],
  [SEC.c, 'min_whoosh', 0.3],
  ...[28, 29, 30, 31, 32, 33].map((i) => [W(i), 'min_tick', 0.25] as Cue),
  [W(37), 'min_tick', 0.25],
  [W(40), 'min_thump', 0.5],
  [SEC.d, 'min_whoosh', 0.3],
  [W(43), 'min_thump', 0.55],
  [SEC.d2, 'min_swish', 0.3],
  [W(55), 'min_thump', 0.6],
  ...[0, 1, 2].map((i) => [W(57) + i * 4, 'min_swish', 0.25] as Cue),
  [SEC.e, 'min_whoosh', 0.3],
  [W(65), 'pop', 0.3],
  [W(72), 'pop', 0.3],
  [W(84), 'min_swish', 0.35],
  [W(84) + 6, 'min_thump', 0.45],
  [SEC.g, 'min_whoosh', 0.3],
  [W(98), 'min_swish', 0.35],
  [W(100), 'min_thump', 0.6],
  [VIDEO_END, 'min_whoosh', 0.4],
  [VIDEO_END + 50, 'min_chime', 0.5],
];

export const ReelPrintAd02: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      ['900 40px "Playfair Display"', 'italic 900 40px "Playfair Display"', '800 40px "Playfair Display"', 'italic 700 40px "Playfair Display"', '700 40px "Playfair Display"', '500 20px "Space Grotesk"', '700 20px "Space Grotesk"', '400 20px "Special Elite"'].map((x) =>
        document.fonts.load(x),
      ),
    ).then(() => continueRender(h));
  }, [h]);
  const g = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Paper />
      <Sequence from={VIDEO_END - 10} layout="none">
        <Audio src={staticFile('music_subclair.mp3')} volume={(fr) => interpolate(fr, [0, 20, OUTRO - 20, OUTRO + 8], [0, 0.35, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      </Sequence>
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Framed />
      <Headlines />
      <Bottom />
      <EndCard />
      <AbsoluteFill style={{opacity: 1 - k(g, PRINTAD02_TOTAL - 22, PRINTAD02_TOTAL - 2)}}>
        <Masthead no="02" />
        <PrintCaption phrases={PHRASES} top={1790} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
