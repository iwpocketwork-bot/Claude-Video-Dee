import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, OffthreadVideo, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/700-italic.css';
import '@fontsource/playfair-display/800.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/playfair-display/900-italic.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/special-elite/400.css';
import {Burst, Car, Clock, Speedo} from './Art';
import {io, k, Masthead, P, Paper, PrintCaption, Said, Stamp, Strike, useSpr, W, WE} from './kit';

// Style 05b — original talking-head video kept, print-ad graphics layered around it (English, synced to his words)
const VIDEO_END = Math.round(52.33 * 30);
export const PREMIUM_EN_TOTAL = VIDEO_END + 150; // + 5s end card
const L = 70;

// video frame geometry (source 720x1280; picture area y 328–952, crop above burned-in captions at ~y850)
const FW = 980;
const SCALE = FW / 720;
const SRC_TOP = 328;
const SRC_H = 512;
const FH = Math.round(SRC_H * SCALE);
const FX = (1080 - FW) / 2;
const FY = 600;

const SEC = {
  a: 0,
  b: W(10) - 8, // Premium, luxury…
  c: W(32) - 6, // Look at the difference
  d: W(63) - 6, // That's the difference / one line
  e: W(85) - 6, // That's the game
  f: W(119) - 6, // People don't believe bigger words
  g: W(128) - 6, // Big words get ignored
};
const PHRASES: [number, number][] = [
  [0, 4], [5, 9], [10, 16], [17, 20], [21, 31], [32, 35], [36, 44], [45, 48], [49, 56], [57, 62], [63, 65],
  [66, 71], [72, 77], [78, 84], [85, 87], [88, 92], [93, 98], [99, 103], [104, 108], [109, 113], [114, 118],
  [119, 123], [124, 127], [128, 131], [132, 134],
];

const Label: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: P.sans, fontWeight: 700, fontSize: 22, letterSpacing: 6, color: P.ink, ...style}}>{children}</div>
);

/** cross-fades a block in/out over a global frame window */
const Block: React.FC<{from: number; to: number; children: React.ReactNode; style?: React.CSSProperties}> = ({from, to, children, style}) => {
  const g = useCurrentFrame();
  if (g < from - 2 || g > to + 10) return null;
  const v = k(g, from, from + 8) * (1 - k(g, to, to + 8));
  return <div style={{position: 'absolute', opacity: v, filter: `blur(${(1 - v) * 8}px)`, ...style}}>{children}</div>;
};

// ------------------------------------------------------------------ headline zone (top)
const Headlines: React.FC = () => {
  const g = useCurrentFrame();
  return (
    <>
      <Block from={SEC.a} to={SEC.b} style={{left: L, right: L, top: 200}}>
        <Said from={0} to={3} size={74} breaks={[1]} />
        <div style={{position: 'relative', display: 'inline-block'}}>
          <Said from={4} to={4} size={120} italic weight={900} />
          {g >= W(5) && <Strike at={W(5)} thick={14} />}
        </div>
        <Stamp at={W(7)} text="NOBODY BELIEVES IT" size={30} rot={-8} style={{left: 560, top: 40}} />
      </Block>
      <Block from={SEC.b} to={SEC.c} style={{left: L, right: L, top: 210}}>
        <Label>EMPTY WORDS</Label>
        <div style={{marginTop: 14}}>
          <Said from={17} to={31} size={56} breaks={[20]} accent={{19: {color: P.red}, 20: {color: P.red}, 30: {color: P.red}, 31: {color: P.red}}} />
        </div>
      </Block>
      <Block from={SEC.c} to={SEC.d} style={{left: L, right: L, top: 220}}>
        <Said from={32} to={35} size={96} italic />
      </Block>
      <Block from={SEC.d} to={SEC.e} style={{left: L, right: L, top: 200}}>
        <Said from={66} to={77} size={56} breaks={[71]} accent={{73: {color: P.red}, 74: {color: P.red}, 75: {color: P.red}}} />
      </Block>
      <Block from={SEC.e} to={SEC.f} style={{left: L, right: L, top: 220}}>
        <Said from={85} to={87} size={104} italic />
      </Block>
      <Block from={SEC.f} to={SEC.g} style={{left: L, right: L, top: 200}}>
        <Said from={119} to={127} size={60} breaks={[123]} accent={{126: {color: P.red}, 127: {color: P.red}}} />
      </Block>
      <Block from={SEC.g} to={VIDEO_END} style={{left: L, right: L, top: 200}}>
        <Said from={128} to={131} size={70} color={P.inkSoft} />
        <Said from={132} to={134} size={84} italic accent={{132: {color: P.red}}} />
      </Block>
    </>
  );
};

// ------------------------------------------------------------------ bottom zone graphics
const BUZZ = [
  {i: 10, txt: 'PREMIUM', fill: '#f4c430', rot: -10},
  {i: 11, txt: 'LUXURY', fill: '#f08a5d', rot: 8},
  {i: 12, txt: 'HIGH QUALITY', fill: '#9ad0c2', rot: -6},
  {i: 14, txt: 'BEST IN CLASS', fill: '#f4c430', rot: 10},
];

const Bottom: React.FC = () => {
  const g = useCurrentFrame();
  const Z = FY + FH + 40; // top of bottom zone
  // A: trust meter
  const trust = interpolate(g, [W(5), W(9) + 10], [0.94, 0.03], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  // B: stickers hide the proof
  const hide = k(g, W(23), W(23) + 14, io);
  const reveal = k(g, W(29), W(31) + 6, io);
  // C: ads
  const mph = interpolate(g, [W(50) - 6, W(53)], [0, 60], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  const clk = useSpr(g - W(62), 10, 180);
  // D: counter
  const adj = Math.round(interpolate(g, [W(73), W(75) + 10], [0, 1000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io}));
  // F: rack focus
  const focus = k(g, W(125), W(127), io);
  return (
    <>
      <Block from={SEC.a + 50} to={SEC.b} style={{left: L, right: L, top: Z + 40}}>
        <Label>READER TRUST</Label>
        <div style={{marginTop: 12, height: 26, border: `3px solid ${P.ink}`, position: 'relative'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${trust * 100}%`, background: trust < 0.3 ? P.red : P.ink}} />
        </div>
        <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 64, marginTop: 6}}>{Math.round(trust * 100)}%</div>
      </Block>

      <Block from={SEC.b} to={SEC.c} style={{left: 0, right: 0, top: Z, height: 470}}>
        <div style={{position: 'absolute', left: 290, top: 262, width: 500, height: 150, border: `4px dashed ${P.ink}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: k(g, W(23), W(23) + 8)}}>
          <Label>REAL PROOF</Label>
          <div style={{fontFamily: P.type, fontSize: 44, color: P.inkSoft, marginTop: 6}}>(none)</div>
        </div>
        {BUZZ.map((b, n) => {
          const s = useSpr(g - W(b.i), 9, 170);
          const x0 = 30 + n * 258;
          const tx = 0;
          const ty = hide * 0;
          const struck = W(19) + n * 4;
          return (
            <div key={n} style={{position: 'absolute', left: x0, top: 10, opacity: 1 - reveal * 0.55, transform: `translate(${tx}px, ${ty}px) scale(${s}) rotate(${(1 - s) * 40}deg)`}}>
              <Burst size={240} fill={b.fill} rot={b.rot}>
                {b.txt}
              </Burst>
              {g >= struck && (
                <div style={{position: 'absolute', left: '12%', right: '12%', top: '40%', height: '20%'}}>
                  <Strike at={struck} thick={11} tilt={b.rot - 6} />
                </div>
              )}
            </div>
          );
        })}
      </Block>

      <Block from={SEC.c} to={SEC.d} style={{left: 40, right: 40, top: Z - 10, display: 'flex', gap: 24}}>
        {[0, 1].map((side) => {
          const s = useSpr(g - (side === 0 ? W(36) : W(45)) + 4, 15, 130);
          return (
            <div key={side} style={{flex: 1, opacity: s, transform: `translateY(${(1 - s) * 60}px)`}}>
              <Label style={{marginBottom: 10, fontSize: 20}}>{side === 0 ? 'NORMAL AD' : 'GREAT AD'}</Label>
              <div style={{position: 'relative', background: '#f6f1e5', border: `3px solid ${P.ink}`, boxShadow: '8px 10px 0 rgba(40,30,10,.18)', padding: 20, height: 400, boxSizing: 'border-box'}}>
                {side === 0 ? (
                  <>
                    <Car w={430} draw={k(g, W(41), W(44))} color={P.inkSoft} />
                    <div style={{fontFamily: P.sans, fontWeight: 500, fontSize: 40, color: P.inkSoft, marginTop: 30}}>
                      {g >= W(41) ? '"This car ' : ''}
                      {g >= W(43) ? 'is silent."' : ''}
                    </div>
                    <Stamp at={W(44) + 8} text="FORGETTABLE" size={26} rot={10} style={{right: 14, bottom: 20}} />
                  </>
                ) : (
                  <>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                      <Speedo size={200} mph={mph} />
                      <div style={{transform: `scale(${clk})`}}>
                        <Clock size={150} f={g} />
                      </div>
                    </div>
                    <div style={{marginTop: 14}}>
                      <Said from={49} to={62} size={30} font={P.type} weight={400} step="type" style={{lineHeight: 1.3}} accent={{50: {color: P.red}, 62: {color: P.red, textDecoration: 'underline'}}} />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </Block>

      <Block from={SEC.d} to={SEC.e} style={{left: L, right: L, top: Z + 10, display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 170, lineHeight: 1}}>1</div>
          <Label>LINE</Label>
        </div>
        <div style={{fontFamily: P.serif, fontStyle: 'italic', fontSize: 60, color: P.inkSoft}}>vs</div>
        <div style={{textAlign: 'center', color: P.inkSoft}}>
          <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 170, lineHeight: 1, opacity: k(g, W(73), W(73) + 6)}}>{adj.toLocaleString('en-US')}</div>
          <Label style={{color: P.inkSoft}}>ADJECTIVES</Label>
        </div>
        {g >= W(82) && (
          <div style={{position: 'absolute', left: 0, right: 0, top: 10, height: 330, background: P.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, opacity: k(g, W(82), W(82) + 10)}}>
            <Clock size={260} f={g} />
            <div>
              <Said from={82} to={84} size={84} italic accent={{84: {color: P.red}}} />
              <div style={{fontFamily: P.type, fontSize: 32, color: P.inkSoft}}>tick… tick… tick…</div>
            </div>
          </div>
        )}
      </Block>

      <Block from={SEC.e} to={SEC.f} style={{left: L, right: L, top: Z + 12}}>
        <div style={{display: 'flex', fontFamily: P.sans, fontWeight: 700, letterSpacing: 5, fontSize: 22, borderBottom: `3px solid ${P.ink}`, paddingBottom: 8}}>
          <div style={{flex: 1}}>DON'T TELL THEM</div>
          <div style={{flex: 1.3}}>TELL / SHOW THEM</div>
        </div>
        {[
          {c: 92, p: 93, pe: 98, claim: 'Fast', proof: 'Saves two hours'},
          {c: 103, p: 104, pe: 108, claim: 'Trusted', proof: 'Who trusted it'},
          {c: 113, p: 114, pe: 118, claim: 'Durable', proof: 'What it survived'},
        ].map((r, i) => {
          const cs = useSpr(g - W(r.c), 12, 180);
          const ps = useSpr(g - W(r.p), 13, 160);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', height: 122, borderBottom: `2px solid ${P.ink}`}}>
              <div style={{flex: 1, opacity: cs}}>
                <span style={{position: 'relative', display: 'inline-block', fontFamily: P.serif, fontWeight: 800, fontSize: 56, color: P.inkSoft}}>
                  {r.claim}
                  {g >= W(r.p) && <Strike at={W(r.p)} thick={9} />}
                </span>
              </div>
              <div style={{flex: 1.3, position: 'relative', opacity: ps, transform: `translateX(${(1 - ps) * 40}px)`}}>
                <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 48, lineHeight: 1.1}}>{r.proof}</div>
                <Stamp at={WE(r.pe) - 6} text="✓ PROOF" size={20} rot={-6} style={{right: -6, top: 10}} />
              </div>
            </div>
          );
        })}
      </Block>

      <Block from={SEC.f} to={SEC.g} style={{left: -40, right: -40, top: Z + 40, height: 400}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', fontFamily: P.serif, fontWeight: 900, fontSize: 150, lineHeight: 0.92, letterSpacing: -4, opacity: k(g, W(122), W(122) + 8) * (1 - focus * 0.85), filter: `blur(${focus * 16}px)`}}>
          PREMIUM
          <br />
          LUXURY
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 100, display: 'flex', justifyContent: 'center', opacity: focus, filter: `blur(${(1 - focus) * 12}px)`}}>
          <div style={{border: `5px solid ${P.red}`, padding: '14px 40px', fontFamily: P.sans, fontWeight: 700, letterSpacing: 12, fontSize: 76, color: P.red, background: P.paper}}>PROOF</div>
        </div>
      </Block>

      <Block from={SEC.g} to={VIDEO_END} style={{left: L, right: L, top: Z + 40, height: 300}}>
        <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 80, color: P.inkSoft}}>
          {'Big words'.split('').map((ch, i) => {
            const d = random(`bw${i}`);
            const fall = Math.max(0, k(g, W(131), W(131) + 24) * 1.6 - d * 0.6);
            return (
              <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${fall * 300}px) rotate(${fall * (d - 0.5) * 120}deg)`, opacity: 1 - Math.min(1, fall)}}>
                {ch}
              </span>
            );
          })}
        </div>
        <Stamp at={W(134)} text="REMEMBERED" size={44} rot={-8} style={{left: 380, top: 120}} />
      </Block>
    </>
  );
};

// ------------------------------------------------------------------ framed original video
const Framed: React.FC = () => {
  const g = useCurrentFrame();
  const inn = useSpr(g, 16, 120);
  const out = k(g, VIDEO_END - 14, VIDEO_END);
  const hush = k(g, W(82), W(82) + 12) * (1 - k(g, SEC.e - 4, SEC.e + 6)); // "feel the silence" — desaturate
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
      <div style={{position: 'relative', width: FW, height: FH, overflow: 'hidden', filter: `saturate(${1 - hush * 0.8}) contrast(${1 + hush * 0.1})`}}>
        <OffthreadVideo src={staticFile('ref/premium_orig.mp4')} style={{position: 'absolute', left: 0, top: -SRC_TOP * SCALE, width: FW, height: 1280 * SCALE}} />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: P.sans, fontSize: 18, letterSpacing: 3, color: P.inkSoft, paddingTop: 10}}>
        <span>FIG. 1 — ON ADVERTISING</span>
        <span>POCKET PRODUCTION</span>
      </div>
    </div>
  );
};

const EndCard: React.FC = () => {
  const g = useCurrentFrame();
  const s = useSpr(g - VIDEO_END - 4, 13, 140);
  const logo = useSpr(g - VIDEO_END - 40, 12, 140);
  const fade = k(g, PREMIUM_EN_TOTAL - 22, PREMIUM_EN_TOTAL - 2);
  if (g < VIDEO_END - 6) return null;
  return (
    <AbsoluteFill style={{opacity: 1 - fade}}>
      <div style={{position: 'absolute', left: L, right: L, top: 620, textAlign: 'center', opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
        <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 86, lineHeight: 1.08}}>
          Need content with <span style={{color: P.red}}>proof</span>,
          <br />
          not <span style={{textDecoration: g > VIDEO_END + 24 ? 'line-through' : 'none', textDecorationColor: P.red, textDecorationThickness: 8, color: P.inkSoft}}>promises</span>?
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: logo, transform: `scale(${0.85 + logo * 0.15})`}}>
        <div style={{fontFamily: P.sans, fontWeight: 500, letterSpacing: 8, fontSize: 36}}>TALK TO</div>
        <Img src={staticFile('logo-dark.png')} style={{width: 640, marginTop: 24}} />
        <div style={{fontFamily: P.type, fontSize: 36, marginTop: 40}}>WhatsApp Dee · 011-1620 0864</div>
      </div>
    </AbsoluteFill>
  );
};

type Cue = [number, string, number];
const CUES: Cue[] = [
  [W(5), 'min_swish', 0.35],
  [W(7), 'min_thump', 0.5],
  ...[10, 11, 12, 14].map((i) => [W(i), 'pop', 0.35] as Cue),
  [W(23), 'whoosh', 0.25],
  [SEC.c, 'min_whoosh', 0.3],
  [W(44) + 8, 'min_thump', 0.4],
  [W(62), 'tick', 0.55],
  [W(82), 'tick', 0.45],
  [W(82) + 30, 'tick', 0.4],
  [SEC.e, 'min_whoosh', 0.3],
  [WE(98) - 6, 'min_thump', 0.4],
  [WE(108) - 6, 'min_thump', 0.4],
  [WE(118) - 6, 'min_thump', 0.4],
  [W(134), 'min_thump', 0.5],
  [VIDEO_END, 'min_whoosh', 0.4],
  [VIDEO_END + 40, 'min_chime', 0.5],
];

export const ReelPremiumEN: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      ['900 40px "Playfair Display"', 'italic 900 40px "Playfair Display"', '800 40px "Playfair Display"', 'italic 400 40px "Playfair Display"', '700 40px "Playfair Display"', '500 20px "Space Grotesk"', '700 20px "Space Grotesk"', '400 20px "Special Elite"'].map((x) =>
        document.fonts.load(x),
      ),
    ).then(() => continueRender(h));
  }, [h]);
  return (
    <AbsoluteFill>
      <Paper />
      {/* end-card music bed: soft swell after the original audio finishes */}
      <Sequence from={VIDEO_END - 10} layout="none">
        <Audio src={staticFile('music_subclair.mp3')} volume={(fr) => interpolate(fr, [0, 20, 130, 158], [0, 0.35, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
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
      <AbsoluteFill style={{opacity: 1 - k(useCurrentFrame(), PREMIUM_EN_TOTAL - 22, PREMIUM_EN_TOTAL - 2)}}>
        <Masthead />
        <PrintCaption phrases={PHRASES} top={1790} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
