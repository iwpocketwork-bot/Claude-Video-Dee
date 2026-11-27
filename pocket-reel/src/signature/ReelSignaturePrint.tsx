import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, random, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource/playfair-display/400-italic.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/playfair-display/800.css';
import '@fontsource/playfair-display/900.css';
import '@fontsource/playfair-display/900-italic.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/special-elite/400.css';
import '@fontsource/poppins/900.css';
import {InkWipe, io, k, P, Paper, Stamp, Strike, useSpr} from '../premium/kit';
import {T, SIG_TOTAL} from './ReelSignature';

// Style 06b — "Pocket Signature" content in the Style 05 print-ad look (+ Pocket lime highlighter)
export const SIGP_TOTAL = SIG_TOTAL;
const LIME = '#f7fd92';
const CMD = '/pocketstyle edit macam biasa';
const INK: [number, number][] = [
  [T.lock, T.kit],
  [T.why, T.end],
];
const isInk = (f: number) => INK.some(([a, b]) => f >= a + 6 && f < b + 6);

const Show: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};
const Label: React.FC<{children: React.ReactNode; style?: React.CSSProperties; color?: string}> = ({children, style, color = P.ink}) => (
  <div style={{fontFamily: P.sans, fontWeight: 700, fontSize: 22, letterSpacing: 6, color, ...style}}>{children}</div>
);
/** lime highlighter swipe behind a word (Pocket brand accent) */
const Hi: React.FC<{at: number; children: React.ReactNode; color?: string}> = ({at, children, color = LIME}) => {
  const f = useCurrentFrame();
  const p = k(f, at, at + 9, io);
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span style={{position: 'absolute', left: '-4%', top: '18%', height: '72%', width: `${p * 108}%`, background: color, transform: 'skewX(-8deg) rotate(-1.5deg)', borderRadius: 4, zIndex: 0}} />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};
/** words appear one by one (blur → sharp) at fixed frame steps */
const Wds: React.FC<{w: (string | [string, React.CSSProperties])[]; at: number; size: number; color?: string; step?: number; font?: string; weight?: number; italic?: boolean; style?: React.CSSProperties; out?: number}> = ({
  w,
  at,
  size,
  color = P.ink,
  step = 4,
  font = P.serif,
  weight = 800,
  italic,
  style,
  out = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: font, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', fontSize: size, lineHeight: 1.08, color, ...style}}>
      {w.map((x, i) => {
        const [t, st] = typeof x === 'string' ? [x, undefined] : x;
        if (t === '\n') return <br key={i} />;
        const v = k(f, at + i * step, at + i * step + 9);
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.24em', opacity: v * (1 - out), filter: `blur(${(1 - v) * 10 + out * 10}px)`, transform: `translateY(${(1 - v) * 14}px)`, ...st}}>
            {t}
          </span>
        );
      })}
    </div>
  );
};

// -------------------------------------------------------------- chrome: masthead, header, printed caption
const Masthead: React.FC = () => {
  const f = useCurrentFrame();
  const ink = isInk(f);
  const c = ink ? '#d8d0bd' : P.ink;
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 60, color: c, fontFamily: P.sans, opacity: 1 - k(f, SIGP_TOTAL - 26, SIGP_TOTAL - 2)}}>
      <div style={{height: 3, background: c}} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', fontSize: 22, letterSpacing: 4, fontWeight: 500}}>
        <span>NOTA STUDIO</span>
        <Img src={staticFile(ink ? 'logo-white.png' : 'logo-dark.png')} style={{height: 50}} />
        <span>NO. 02</span>
      </div>
      <div style={{height: 1, background: c}} />
    </div>
  );
};

const Header: React.FC = () => {
  const f = useCurrentFrame();
  const ink = isInk(f);
  const shrink = k(f, 64, 86, io);
  const size = interpolate(shrink, [0, 1], [92, 58]);
  const top = interpolate(shrink, [0, 1], [740, 180]);
  const vis = k(f, 30, 44) * (1 - k(f, T.end - 6, T.end + 6));
  const w = (i: number) => k(f, 30 + i * 5, 40 + i * 5);
  const sp = (i: number, c: React.ReactNode) => (
    <span style={{display: 'inline-block', marginRight: '0.24em', opacity: w(i), filter: `blur(${(1 - w(i)) * 10}px)`, transform: `translateY(${(1 - w(i)) * 14}px)`}}>{c}</span>
  );
  return (
    <div style={{position: 'absolute', left: 70, top, opacity: vis, fontFamily: P.serif, fontWeight: 800, fontSize: size, lineHeight: 1.1, color: ink ? '#f2ecdf' : P.ink}}>
      {sp(0, 'Kami')}
      {sp(1, 'taip')}
      {sp(
        2,
        <Hi at={46} color={ink ? 'rgba(247,253,146,.9)' : LIME}>
          <i style={{color: P.ink}}>ni je</i>
        </Hi>,
      )}
      <br />
      {sp(3, 'dekat')}
      {sp(4, 'Claude.')}
    </div>
  );
};

const CAP: [number, number, string][] = [
  [T.chat + 76, T.chat + 106, 'dia tanya dulu,'],
  [T.chat + 106, T.chat + 148, 'tak terus buat video.'],
  [T.kit + 24, T.kit + 84, 'font, warna, logo,'],
  [T.kit + 84, T.kit + 146, 'semua dah lock.'],
  [T.board + 10, T.board + 44, 'video ni guna'],
  [T.board + 44, T.board + 76, 'method sama,'],
  [T.board + 76, T.board + 132, 'buat storyboard dulu.'],
  [T.motion + 14, T.motion + 84, 'motion fluid,'],
  [T.motion + 84, T.motion + 176, 'tak keras, tak flat.'],
  [T.audio + 14, T.audio + 100, 'suara balance,'],
  [T.audio + 100, T.audio + 176, 'siap compress.'],
];
const Caption: React.FC = () => {
  const f = useCurrentFrame();
  const cur = CAP.find(([a, b]) => f >= a && f < b);
  if (!cur) return null;
  const [a, b, t] = cur;
  const v = k(f, a, a + 8) * (1 - k(f, b - 6, b));
  const ink = isInk(f);
  return (
    <div style={{position: 'absolute', top: 1720, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: v}}>
      <div style={{fontFamily: P.type, fontSize: 38, padding: '10px 26px', color: ink ? '#f2ecdf' : P.ink, borderTop: `2px solid ${ink ? '#8d8572' : P.ink}`, borderBottom: `2px solid ${ink ? '#8d8572' : P.ink}`, transform: `translateY(${(1 - v) * 10}px)`}}>{t}</div>
    </div>
  );
};

// -------------------------------------------------------------- 1. hook
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', left: 70, right: 70, top: 290}}>
        <Wds w={['Nak', 'edit']} at={2} size={170} weight={900} step={6} out={k(f, 62, 80)} />
        <Wds w={[['video?', {fontStyle: 'italic', color: P.red}]]} at={14} size={190} weight={900} out={k(f, 62, 80)} />
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------- 2. typed memo to Claude + reply with ticks + polaroids
const STY = ['Kinetic UI', 'Minimal', '3D World', 'Cetak Klasik'];
const Chat: React.FC = () => {
  const f = useCurrentFrame();
  const memo = useSpr(f - T.chat - 2, 15, 130);
  const typed = Math.floor(interpolate(f, [T.chat + 14, T.chat + 62], [0, CMD.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const reply = useSpr(f - T.chat - 76, 14, 150);
  const tick = k(f, T.chat + 104, T.chat + 112, io);
  const out = k(f, T.dulu - 2, T.dulu + 10);
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: 70, right: 70, top: 420, background: '#f8f4ea', border: `3px solid ${P.ink}`, boxShadow: '10px 12px 0 rgba(40,30,10,.16)', padding: '26px 30px', opacity: memo, transform: `translateY(${(1 - memo) * 70}px) rotate(${(1 - memo) * -3 - 0.6}deg)`}}>
          <Label>MEMO · KEPADA: CLAUDE</Label>
          <div style={{fontFamily: P.type, fontSize: 26, color: P.inkSoft, marginTop: 10}}>Lampiran: reel_pocket.mov (0:58)</div>
          <div style={{height: 2, background: P.ink, margin: '14px 0'}} />
          <div style={{fontFamily: P.type, fontSize: 44, minHeight: 60}}>
            <span style={{color: P.red}}>{CMD.slice(0, Math.min(typed, 12))}</span>
            {CMD.slice(12, typed)}
            <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0}}>▌</span>
          </div>
          <Stamp at={T.chat + 66} text="DIHANTAR" size={26} rot={-8} style={{right: 20, top: 18}} />
        </div>
        <div style={{position: 'absolute', left: 70, right: 70, top: 790, opacity: reply, transform: `translateY(${(1 - reply) * 60}px) rotate(0.5deg)`}}>
          <Label>BALASAN</Label>
          <div style={{fontFamily: P.serif, fontWeight: 900, fontStyle: 'italic', fontSize: 64, marginTop: 6}}>Style nak yang mana?</div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 30px', marginTop: 16}}>
            {STY.map((s, i) => (
              <div key={s} style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: P.type, fontSize: 36}}>
                <span style={{position: 'relative', width: 36, height: 36, border: `3px solid ${P.ink}`, display: 'inline-block'}}>
                  {i === 0 && (
                    <svg width={50} height={50} viewBox="0 0 50 50" style={{position: 'absolute', left: -4, top: -12}}>
                      <path d="M6 26 L20 40 L46 6" fill="none" stroke={P.red} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={70} strokeDashoffset={70 * (1 - tick)} />
                    </svg>
                  )}
                </span>
                {s}
              </div>
            ))}
          </div>
        </div>
        {/* pinned polaroids = storyboard v1 */}
        {[1, 2, 3, 4, 5].map((n, i) => {
          const s = useSpr(f - (T.chat + 118 + i * 4), 13, 160);
          return (
            <div key={n} style={{position: 'absolute', left: 50 + i * 196, top: 1200 + (i % 2) * 30, width: 186, background: '#fbf8f0', padding: '9px 9px 26px', boxShadow: '0 12px 24px rgba(60,40,10,.25)', opacity: s, transform: `translateY(${(1 - s) * 60}px) rotate(${(i - 2) * 4 + (1 - s) * 20}deg)`}}>
              <Img src={staticFile(`style06/t${n}.jpg`)} style={{width: 168, height: 300, objectFit: 'cover', display: 'block'}} />
              <div style={{position: 'absolute', left: '35%', top: -12, width: 60, height: 22, background: 'rgba(247,253,146,.75)', transform: 'rotate(-6deg)'}} />
            </div>
          );
        })}
        <Label style={{position: 'absolute', left: 70, top: 1160, opacity: k(f, T.chat + 118, T.chat + 126)}}>STORYBOARD V1 ✓</Label>
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------- 3. "Dulu?"
const Dulu: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, T.lock - 2, T.lock + 10);
  return (
    <InkWipe start={T.dulu} cx={540} cy={1100}>
      <Paper />
      <div style={{position: 'absolute', left: 70, right: 70, top: 470, opacity: 1 - out}}>
        <Wds w={[['Dulu?', {fontStyle: 'italic'}]]} at={T.dulu + 10} size={140} weight={900} />
        <div style={{marginTop: 16}}>
          <Wds w={['Nak', 'edit', 'video,', '\n', 'kena', 'brief', 'dari', ['awal.', {color: P.red}]]} at={T.dulu + 24} size={80} step={3} />
        </div>
        <div style={{marginTop: 50, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0 22px', fontSize: 78, color: P.ink}}>
          {[
            {t: 'Font', st: {fontFamily: P.serif, fontStyle: 'italic', fontWeight: 900}},
            {t: 'lain,', st: {fontFamily: P.type}},
            {t: 'colour', st: {fontFamily: "'Poppins', sans-serif", fontWeight: 900, color: P.red}},
            {t: 'lain.', st: {fontFamily: P.sans, fontWeight: 700, color: 'transparent', WebkitTextStroke: `3px ${P.ink}`}},
          ].map((x, i) => {
            const v = useSpr(f - (T.dulu + 66 + i * 6), 11, 190);
            return (
              <span key={i} style={{display: 'inline-block', transform: `scale(${v}) rotate(${(1 - v) * (i % 2 ? 20 : -20)}deg)`, ...(x.st as React.CSSProperties)}}>
                {x.t}
              </span>
            );
          })}
        </div>
        <div style={{position: 'relative', height: 160}}>
          <Stamp at={T.dulu + 100} text="TAKDE CONSISTENCY" size={50} rot={-6} style={{left: 0, top: 46}} />
        </div>
      </div>
    </InkWipe>
  );
};

// -------------------------------------------------------------- 4. lock (ink page)
const Lock: React.FC = () => {
  const f = useCurrentFrame();
  const shut = k(f, T.lock + 30, T.lock + 40, io);
  const out = k(f, T.kit - 2, T.kit + 10);
  return (
    <InkWipe start={T.lock} cx={540} cy={900}>
      <Paper dark />
      <div style={{position: 'absolute', left: 70, right: 70, top: 640, opacity: 1 - out}}>
        <Wds w={['So', 'kami', [<Hi key="h" at={T.lock + 20} color="rgba(247,253,146,.95)"><i style={{color: P.ink}}>lock</i></Hi> as unknown as string, {}]]} at={T.lock + 6} size={124} color="#f2ecdf" weight={900} />
        <Wds w={['semua', 'dalam', '\n', 'satu', ['skill.', {fontStyle: 'italic'}]]} at={T.lock + 26} size={112} color="#f2ecdf" weight={900} style={{marginTop: 8}} />
        <svg width={170} height={200} viewBox="0 0 26 30" style={{position: 'absolute', right: 0, top: -30}}>
          <path d="M7 13 V9 a6 6 0 0 1 12 0 V13" fill="none" stroke="#f2ecdf" strokeWidth={2.4} strokeLinecap="round" transform={`translate(0 ${-(1 - shut) * 4})`} />
          <rect x={3} y={13} width={20} height={15} rx={2} fill="none" stroke="#f2ecdf" strokeWidth={2.4} />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={5 + i * 4} y1={15} x2={3 + i * 4} y2={27} stroke="#f2ecdf" strokeWidth={0.6} opacity={0.6} />
          ))}
        </svg>
        <div style={{position: 'relative', height: 120}}>
          <Stamp at={T.lock + 42} text="LOCKED" color={P.red} size={52} rot={-8} style={{right: 20, top: 30}} />
        </div>
      </div>
    </InkWipe>
  );
};

// -------------------------------------------------------------- 5. brand kit as a printer's specimen sheet
const SWATCH: [string, string, string][] = [
  ['#0D0E13', 'LATAR', '#fff'],
  ['#F7FD92', 'AKSEN', P.ink],
  ['#FF6B3D', 'API', '#fff'],
  ['#FFFFFF', 'TEKS', P.ink],
];
const Kit: React.FC = () => {
  const f = useCurrentFrame();
  const sheet = useSpr(f - T.kit - 8, 15, 120);
  const out = k(f, T.board - 2, T.board + 10);
  return (
    <InkWipe start={T.kit} cx={540} cy={1100}>
      <Paper />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: 70, right: 70, top: 440, background: '#f8f4ea', border: `3px solid ${P.ink}`, boxShadow: '10px 12px 0 rgba(40,30,10,.16)', padding: 30, opacity: sheet, transform: `translateY(${(1 - sheet) * 70}px) rotate(${(1 - sheet) * 2 + 0.4}deg)`}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Label>SPESIMEN JENAMA</Label>
            <Label style={{color: P.inkSoft}}>POCKET PRODUCTION</Label>
          </div>
          <div style={{height: 2, background: P.ink, margin: '14px 0 20px'}} />
          <div style={{display: 'flex', gap: 30}}>
            <div style={{flex: 1}}>
              <div style={{fontFamily: "'Poppins', sans-serif", fontWeight: 900, fontSize: 170, lineHeight: 0.9}}>Aa</div>
              <div style={{fontFamily: P.type, fontSize: 30, marginTop: 14}}>Poppins — 900 / 800 / 600</div>
              <div style={{fontFamily: P.type, fontSize: 24, color: P.inkSoft, marginTop: 6}}>Kemas. Satu font je.</div>
            </div>
            <div style={{width: 360, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
              {SWATCH.map(([hex, name, fg], i) => {
                const s = useSpr(f - (T.kit + 30 + i * 10), 12, 180);
                return (
                  <div key={hex} style={{background: '#fff', border: `2px solid ${P.ink}`, padding: 6, opacity: s, transform: `translateY(${(1 - s) * 40}px) rotate(${(1 - s) * 10}deg)`}}>
                    <div style={{height: 90, background: hex, border: hex === '#FFFFFF' ? `1px solid ${P.inkSoft}` : 'none', color: fg, fontFamily: P.sans, fontWeight: 700, fontSize: 16, padding: 6, letterSpacing: 2}}>{name}</div>
                    <div style={{fontFamily: P.type, fontSize: 20, paddingTop: 6}}>{hex}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{height: 2, background: P.ink, margin: '24px 0 16px'}} />
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: k(f, T.kit + 90, T.kit + 100)}}>
            <Img src={staticFile('logo-dark.png')} style={{height: 84}} />
          </div>
          <Stamp at={T.kit + 104} text="DILULUSKAN" size={40} rot={-8} style={{right: 30, bottom: 26}} />
        </div>
      </div>
    </InkWipe>
  );
};

// -------------------------------------------------------------- 6. storyboard polaroids + "go"
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, T.motion - 2, T.motion + 10);
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Paper />
      <Label style={{position: 'absolute', left: 70, top: 440, opacity: k(f, T.board + 8, T.board + 18)}}>STORYBOARD VIDEO NI · V1 → V5</Label>
      {[
        [1, '01 · Hook'],
        [3, '02 · Insight'],
        [4, '03 · Showcase'],
      ].map(([n, lbl], i) => {
        const s = useSpr(f - (T.board + 14 + i * 10), 14, 130);
        return (
          <div key={i} style={{position: 'absolute', left: 90 + i * 300, top: 530 + Math.abs(i - 1) * 40, width: 290, background: '#fbf8f0', padding: '12px 12px 50px', boxShadow: '0 20px 40px rgba(60,40,10,.25)', opacity: s, transform: `translateY(${(1 - s) * 120}px) rotate(${(i - 1) * 6}deg)`}}>
            <Img src={staticFile(`style06/t${n}.jpg`)} style={{width: 266, height: 472, objectFit: 'cover', display: 'block'}} />
            <div style={{fontFamily: P.type, fontSize: 28, position: 'absolute', left: 18, bottom: 10}}>{lbl}</div>
            <div style={{position: 'absolute', left: '36%', top: -14, width: 80, height: 26, background: 'rgba(247,253,146,.8)', transform: 'rotate(-5deg)'}} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 1230, height: 200}}>
        <Stamp at={T.board + 92} text={'"GO" ✓'} size={84} rot={-7} style={{left: 330, top: 20}} />
      </div>
    </AbsoluteFill>
  );
};

// -------------------------------------------------------------- 7. motion — engraved trajectory diagram on graph paper
const Motion: React.FC = () => {
  const f = useCurrentFrame();
  const draw = k(f, T.motion + 10, T.motion + 120);
  const out = k(f, T.audio - 2, T.audio + 10);
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= 3; i++) pts.push([90 + i * 290, 1200, i]);
  const arc = (x0: number, x1: number) => `M${x0},1200 Q${(x0 + x1) / 2},${780 + (x0 / 900) * 140} ${x1},1200`;
  const ballT = draw * 3;
  const seg = Math.min(2, Math.floor(ballT));
  const tt = ballT - seg;
  const x0 = pts[seg][0];
  const x1 = pts[seg + 1][0];
  const cyTop = 780 + (x0 / 900) * 140;
  const bx = (1 - tt) * (1 - tt) * x0 + 2 * (1 - tt) * tt * ((x0 + x1) / 2) + tt * tt * x1;
  const by = (1 - tt) * (1 - tt) * 1200 + 2 * (1 - tt) * tt * cyTop + tt * tt * 1200;
  const contact = tt < 0.1 || tt > 0.9 ? 1 - Math.min(tt, 1 - tt) / 0.1 : 0;
  const graph = useSpr(f - T.motion - 90, 14, 140);
  return (
    <InkWipe start={T.motion} cx={540} cy={1100}>
      <Paper />
      <AbsoluteFill
        style={{
          top: 420,
          bottom: 300,
          left: 60,
          right: 60,
          opacity: (1 - out) * 0.5,
          backgroundImage: `linear-gradient(rgba(40,60,120,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(40,60,120,.18) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div style={{opacity: 1 - out}}>
        <Label style={{position: 'absolute', left: 70, top: 440}}>FIG. 2 — STRETCH IKUT ARAH GERAK</Label>
        <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={arc(pts[i][0], pts[i + 1][0])} fill="none" stroke={P.ink} strokeWidth={2.5} strokeDasharray="8 10" opacity={draw * 3 > i ? 0.7 : 0} />
          ))}
          <line x1={60} y1={1236} x2={1020} y2={1236} stroke={P.ink} strokeWidth={3} />
          {new Array(24).fill(0).map((_, i) => (
            <line key={i} x1={70 + i * 40} y1={1238} x2={56 + i * 40} y2={1256} stroke={P.ink} strokeWidth={1.5} />
          ))}
          <ellipse cx={bx} cy={by - 36 * (1 - contact * 0.3)} rx={36 * (1 + contact * 0.3)} ry={36 * (1 - contact * 0.3)} fill={LIME} stroke={P.ink} strokeWidth={4} />
          {contact > 0.2 && <text x={bx > 760 ? bx - 50 : bx + 50} textAnchor={bx > 760 ? 'end' : 'start'} y={1190} fontFamily="Special Elite" fontSize={30} fill={P.red}>squash 14%</text>}
        </svg>
        <div style={{position: 'absolute', right: 70, top: 1330, width: 420, background: '#f8f4ea', border: `3px solid ${P.ink}`, padding: 18, opacity: graph, transform: `translateY(${(1 - graph) * 40}px) rotate(1deg)`}}>
          <Label style={{fontSize: 18}}>OVERSHOOT 7%</Label>
          <svg width={380} height={120} style={{marginTop: 8}}>
            <path d="M0,110 C80,110 90,8 170,6 S280,24 380,20" fill="none" stroke={P.red} strokeWidth={4} strokeDasharray={520} strokeDashoffset={520 * (1 - k(f, T.motion + 96, T.motion + 122))} />
          </svg>
        </div>
      </div>
    </InkWipe>
  );
};

// -------------------------------------------------------------- 8. audio as a seismograph + receipt
const AudioScene: React.FC = () => {
  const f = useCurrentFrame();
  const fix = k(f, T.audio + 60, T.audio + 96, io);
  const lufs = Math.round(interpolate(fix, [0, 1], [-27, -14]));
  const rc = useSpr(f - T.audio - 110, 13, 150);
  const out = k(f, T.why - 2, T.why + 10);
  const N = 130;
  let d = '';
  for (let i = 0; i < N; i++) {
    const x = 20 + (i / (N - 1)) * 900;
    const noisy = (random(`s${i}${Math.floor(f / 2)}`) - 0.5) * 220;
    const clean = Math.sin(i * 0.55 + f / 4) * 70;
    d += `${i ? 'L' : 'M'}${x.toFixed(1)},${(130 + interpolate(fix, [0, 1], [noisy, clean])).toFixed(1)} `;
  }
  return (
    <InkWipe start={T.audio} cx={540} cy={1100}>
      <Paper />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 440, background: '#f8f4ea', border: `3px solid ${P.ink}`, padding: 20, backgroundImage: 'linear-gradient(rgba(196,42,31,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(196,42,31,.12) 1px, transparent 1px)', backgroundSize: '30px 30px'}}>
          <Label>{fix < 0.5 ? 'SUARA · SEBELUM' : 'SELEPAS · MASTER'}</Label>
          <svg width={940} height={260}>
            <path d={d} fill="none" stroke={fix < 0.5 ? P.red : P.ink} strokeWidth={2.4} />
          </svg>
        </div>
        <div style={{position: 'absolute', left: 70, top: 830, display: 'flex', alignItems: 'baseline', gap: 20}}>
          <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 170, color: fix > 0.5 ? P.ink : P.red}}>{lufs}</div>
          <div style={{fontFamily: P.type, fontSize: 40}}>LUFS · master</div>
        </div>
        {/* receipt */}
        <div style={{position: 'absolute', right: 80, top: 1110, width: 430, background: '#fbf8f0', padding: '22px 26px 30px', boxShadow: '0 14px 28px rgba(60,40,10,.2)', fontFamily: P.type, fontSize: 28, opacity: rc, transform: `translateY(${(1 - rc) * 60}px) rotate(-2deg)`, WebkitMaskImage: 'linear-gradient(#000 94%, transparent 94%), radial-gradient(circle at 10px 100%, transparent 8px, #000 9px)'}}>
          <div style={{textAlign: 'center', fontFamily: P.sans, fontWeight: 700, letterSpacing: 4, fontSize: 20}}>RESIT EKSPORT</div>
          <div style={{borderTop: `2px dashed ${P.ink}`, margin: '12px 0'}} />
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <span>final_9x16.mp4</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8}}>
            <span>Saiz</span>
            <b>28.8MB</b>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8}}>
            <span>Audio</span>
            <b>-14 LUFS</b>
          </div>
        </div>
      </div>
    </InkWipe>
  );
};

// -------------------------------------------------------------- 9. why (ink page)
const Why: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, T.end - 4, T.end + 8);
  const rows: [number, React.ReactNode][] = [
    [T.why + 40, <>Takyah explain <i>panjang.</i></>],
    [T.why + 66, <>Semua video, stay <i>consistent.</i></>],
    [T.why + 92, <>Kami brief <Hi at={T.why + 100} color="rgba(247,253,146,.95)"><i style={{color: P.ink}}>idea</i></Hi> je.</>],
  ];
  return (
    <InkWipe start={T.why} cx={540} cy={900}>
      <Paper dark />
      <div style={{position: 'absolute', left: 70, right: 70, top: 500, opacity: 1 - out, color: '#f2ecdf'}}>
        <Wds w={['Kenapa', 'sesuai', '\n', 'untuk', ['kami?', {fontStyle: 'italic'}]]} at={T.why + 8} size={104} color="#f2ecdf" weight={900} />
        <div style={{height: 2, background: '#8d8572', marginTop: 36, width: `${k(f, T.why + 30, T.why + 56) * 100}%`}} />
        {rows.map(([at, t], i) => {
          const v = k(f, at, at + 12);
          return (
            <div key={i} style={{display: 'flex', gap: 26, alignItems: 'baseline', marginTop: 34, opacity: v, transform: `translateX(${(1 - v) * 30}px)`}}>
              <div style={{fontFamily: P.type, fontSize: 30, color: '#8d8572'}}>0{i + 1}</div>
              <div style={{fontFamily: P.serif, fontWeight: 800, fontSize: 58}}>{t}</div>
            </div>
          );
        })}
      </div>
    </InkWipe>
  );
};

// -------------------------------------------------------------- 10. end
const End: React.FC = () => {
  const f = useCurrentFrame();
  const fade = k(f, SIGP_TOTAL - 26, SIGP_TOTAL - 2);
  const logo = useSpr(f - T.end - 70, 13, 140);
  return (
    <InkWipe start={T.end} cx={540} cy={900}>
      <Paper />
      <AbsoluteFill style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 640, height: 200}}>
          <Stamp at={T.end + 10} text="/pocketstyle" color={P.red} size={76} rot={-4} style={{left: 200, top: 0, fontFamily: P.type, letterSpacing: 2}} />
        </div>
        <div style={{position: 'absolute', left: 70, right: 70, top: 880, textAlign: 'center'}}>
          <Wds w={['Video', 'yang', 'anda', 'tengok', 'ni', '\n', 'pun', 'dibuat', 'guna', ['ni', {fontStyle: 'italic', color: P.red}], ['je.', {fontStyle: 'italic', color: P.red}]]} at={T.end + 30} size={60} step={2} />
          <div style={{fontFamily: P.type, fontSize: 36, marginTop: 30, opacity: k(f, T.end + 60, T.end + 70)}}>Next video? Satu command je.</div>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1240, display: 'flex', justifyContent: 'center', opacity: logo, transform: `scale(${0.85 + logo * 0.15})`}}>
          <Img src={staticFile('logo-dark.png')} style={{width: 380}} />
        </div>
      </AbsoluteFill>
    </InkWipe>
  );
};

type Cue = [number, string, number];
const CUES: Cue[] = [
  [2, 'min_thump', 0.5],
  [14, 'min_swish', 0.4],
  [T.chat + 4, 'min_swish', 0.4],
  ...new Array(12).fill(0).map((_, i) => [T.chat + 14 + i * 4, 'min_tick', 0.25] as Cue),
  [T.chat + 66, 'min_thump', 0.5],
  [T.chat + 76, 'min_swish', 0.35],
  [T.chat + 104, 'min_swish', 0.4],
  ...[0, 1, 2, 3, 4].map((i) => [T.chat + 118 + i * 4, 'pop', 0.3] as Cue),
  [T.dulu, 'min_whoosh', 0.45],
  ...[0, 1, 2, 3].map((i) => [T.dulu + 66 + i * 6, 'pop', 0.4] as Cue),
  [T.dulu + 100, 'min_thump', 0.7],
  [T.lock, 'min_whoosh', 0.45],
  [T.lock + 38, 'click', 0.8],
  [T.lock + 42, 'min_thump', 0.6],
  [T.kit, 'min_whoosh', 0.45],
  ...[0, 1, 2, 3].map((i) => [T.kit + 30 + i * 10, 'tick', 0.4] as Cue),
  [T.kit + 104, 'min_thump', 0.6],
  [T.board, 'min_swish', 0.4],
  ...[0, 1, 2].map((i) => [T.board + 14 + i * 10, 'pop', 0.35] as Cue),
  [T.board + 92, 'min_thump', 0.7],
  [T.motion, 'min_whoosh', 0.45],
  [T.audio, 'min_whoosh', 0.45],
  [T.audio + 60, 'min_swish', 0.45],
  [T.audio + 110, 'tick', 0.5],
  [T.why, 'min_whoosh', 0.45],
  [T.why + 40, 'min_tick', 0.4],
  [T.why + 66, 'min_tick', 0.4],
  [T.why + 92, 'min_tick', 0.4],
  [T.end, 'min_whoosh', 0.45],
  [T.end + 10, 'min_thump', 0.7],
  [T.end + 70, 'min_chime', 0.55],
];

export const ReelSignaturePrint: React.FC<{music?: string}> = ({music = 'music_subclair.mp3'}) => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['900 40px "Playfair Display"', 'italic 900 40px "Playfair Display"', '800 40px "Playfair Display"', 'italic 400 40px "Playfair Display"', '500 20px "Space Grotesk"', '700 20px "Space Grotesk"', '400 20px "Special Elite"', '900 40px Poppins'].map((x) => document.fonts.load(x))).then(() =>
      continueRender(h),
    );
  }, [h]);
  return (
    <AbsoluteFill style={{background: P.paper}}>
      <Audio src={staticFile(music)} volume={(fr) => interpolate(fr, [0, 15, SIGP_TOTAL - 45, SIGP_TOTAL - 2], [0, 0.5, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Show from={0} to={T.chat + 12}><Hook /></Show>
      <Show from={T.chat} to={T.dulu + 16}><Chat /></Show>
      <Show from={T.dulu} to={T.lock + 16}><Dulu /></Show>
      <Show from={T.lock} to={T.kit + 16}><Lock /></Show>
      <Show from={T.kit} to={T.board + 16}><Kit /></Show>
      <Show from={T.board} to={T.motion + 16}><Board /></Show>
      <Show from={T.motion} to={T.audio + 16}><Motion /></Show>
      <Show from={T.audio} to={T.why + 16}><AudioScene /></Show>
      <Show from={T.why} to={T.end + 16}><Why /></Show>
      <Show from={T.end} to={SIGP_TOTAL}><End /></Show>
      <Masthead />
      <Header />
      <Caption />
    </AbsoluteFill>
  );
};
