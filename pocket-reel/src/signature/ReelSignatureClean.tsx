import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import {T, SIG_TOTAL} from './ReelSignature';

// Style 06c — "Pocket Clean": REF-04 look (light/dark, glow, dark UI cards, blur-in words, caption pill)
// rebuilt with the Pocket brand kit. Same Signature content and timing.
export const SIGC_TOTAL = SIG_TOTAL;
const C = {
  light: '#f4f4ef',
  dark: '#0d0e13',
  card: '#141519',
  lime: '#f7fd92',
  limeDeep: '#e8f06a',
  orange: '#ff6b3d',
  ink: '#111214',
  grey: '#8b8b92',
  font: "'Poppins', sans-serif",
  mono: "'JetBrains Mono', monospace",
};
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const io = Easing.bezier(0.65, 0, 0.35, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const k = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});
const useSpr = (frame: number, damping = 15, stiffness = 140) => {
  const {fps} = useVideoConfig();
  return spring({frame, fps, config: {damping, stiffness}});
};
const CMD = '/pocketstyle edit macam biasa';
const PILL_TOP = 1430; // raised caption capsule

// scene plan (mode per scene) — dark scenes enter with a circle wipe
const DARK: [number, number][] = [
  [T.dulu, T.kit],
  [T.motion, T.audio],
  [T.why, SIGC_TOTAL],
];
const isDark = (f: number) => DARK.some(([a, b]) => f >= a + 8 && f < b + 8);

const Show: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};
const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties; dark?: boolean}> = ({children, style, dark}) => (
  <div style={{fontFamily: C.mono, fontSize: 21, letterSpacing: 2, textTransform: 'uppercase', color: dark ? 'rgba(255,255,255,.5)' : '#7b7b84', ...style}}>{children}</div>
);

const Bg: React.FC<{dark?: boolean}> = ({dark}) => {
  const f = useCurrentFrame();
  const d = Math.sin(f / 60) * 30;
  return dark ? (
    <AbsoluteFill style={{background: C.dark}}>
      <div style={{position: 'absolute', right: -280 + d, top: -200, width: 950, height: 950, borderRadius: '50%', background: 'rgba(247,253,146,.16)', filter: 'blur(170px)'}} />
      <div style={{position: 'absolute', left: -320, bottom: -260 - d, width: 850, height: 850, borderRadius: '50%', background: 'rgba(56,225,245,.10)', filter: 'blur(170px)'}} />
    </AbsoluteFill>
  ) : (
    <AbsoluteFill style={{background: C.light}}>
      <div style={{position: 'absolute', right: -260 + d, top: -220, width: 900, height: 900, borderRadius: '50%', background: 'rgba(247,253,146,.75)', filter: 'blur(150px)'}} />
      <div style={{position: 'absolute', left: -300, bottom: -300 - d, width: 800, height: 800, borderRadius: '50%', background: 'rgba(210,214,200,.6)', filter: 'blur(160px)'}} />
    </AbsoluteFill>
  );
};

const Wipe: React.FC<{start: number; children: React.ReactNode}> = ({start, children}) => {
  const f = useCurrentFrame();
  const r = k(f, start, start + 16, io) * 2300;
  return <AbsoluteFill style={{clipPath: `circle(${r}px at 540px 900px)`}}>{children}</AbsoluteFill>;
};

type Wd = string | [string, React.CSSProperties];
const Words: React.FC<{w: Wd[]; at: number; size: number; color: string; step?: number; weight?: number; style?: React.CSSProperties; out?: number}> = ({w, at, size, color, step = 4, weight = 700, style, out = 0}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: C.font, fontWeight: weight, fontSize: size, lineHeight: 1.1, letterSpacing: -size * 0.025, color, ...style}}>
      {w.map((x, i) => {
        const [t, st] = typeof x === 'string' ? [x, undefined] : x;
        if (t === '\n') return <br key={i} />;
        const v = k(f, at + i * step, at + i * step + 10);
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.24em', opacity: v * (1 - out), filter: `blur(${(1 - v) * 12 + out * 12}px)`, transform: `translateY(${(1 - v) * 16}px)`, ...st}}>
            {t}
          </span>
        );
      })}
    </div>
  );
};

/** dark UI card with a soft 3D tilt and spring entrance (REF-04) */
const Card: React.FC<{at: number; x: number; y: number; w: number; h?: number; children: React.ReactNode; out?: number; tilt?: [number, number]; bg?: string}> = ({at, x, y, w, h, children, out = 0, tilt = [8, -6], bg = C.card}) => {
  const f = useCurrentFrame();
  const s = useSpr(f - at, 15, 130);
  const fl = Math.sin((f - at) / 30) * 1.5;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 1600, opacity: Math.min(1, s * 1.4) * (1 - out)}}>
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          background: bg,
          borderRadius: 34,
          border: '1.5px solid rgba(255,255,255,.08)',
          boxShadow: '0 50px 90px rgba(10,12,20,.28), 0 8px 20px rgba(0,0,0,.15)',
          transform: `rotateX(${tilt[0] + fl + (1 - s) * 25}deg) rotateY(${tilt[1] + (1 - s) * -15}deg) scale(${0.82 + s * 0.18}) translateY(${(1 - s) * 80}px)`,
          filter: `blur(${(1 - s) * 10 + out * 14}px)`,
          color: '#fff',
          fontFamily: C.font,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// ------------------------------------------------------------- persistent header + caption capsule
const Header: React.FC = () => {
  const f = useCurrentFrame();
  const dark = isDark(f);
  const shrink = k(f, 70, 90, io);
  const size = interpolate(shrink, [0, 1], [92, 58]);
  const top = interpolate(shrink, [0, 1], [380, 150]);
  const vis = k(f, 34, 46) * (1 - k(f, T.end - 6, T.end + 6));
  const w = (i: number) => k(f, 34 + i * 5, 44 + i * 5);
  const sp = (i: number, c: React.ReactNode) => (
    <span style={{display: 'inline-block', marginRight: '0.24em', opacity: w(i), filter: `blur(${(1 - w(i)) * 10}px)`, transform: `translateY(${(1 - w(i)) * 14}px)`}}>{c}</span>
  );
  return (
    <div style={{position: 'absolute', left: 70, top, opacity: vis, fontFamily: C.font, fontWeight: 700, fontSize: size, lineHeight: 1.1, letterSpacing: -size * 0.025, color: dark ? '#fff' : C.ink}}>
      {sp(0, 'Kami')}
      {sp(1, 'taip')}
      {sp(2, <span style={{background: dark ? 'transparent' : C.lime, color: dark ? C.lime : C.ink, padding: dark ? 0 : '0 .14em', borderRadius: 10}}>ni je</span>)}
      <br />
      {sp(3, 'dekat')}
      {sp(4, 'Claude.')}
    </div>
  );
};

const CAPS: [number, number, string][] = [
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
const Capsule: React.FC = () => {
  const f = useCurrentFrame();
  const cur = CAPS.find(([a, b]) => f >= a && f < b);
  if (!cur) return null;
  const [a, b, t] = cur;
  const v = k(f, a, a + 8) * (1 - k(f, b - 6, b));
  return (
    <div style={{position: 'absolute', top: PILL_TOP, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: '#fff', color: C.ink, fontFamily: C.font, fontWeight: 500, fontSize: 34, padding: '13px 32px', borderRadius: 40, boxShadow: '0 12px 30px rgba(0,0,0,.16)', opacity: v, transform: `translateY(${(1 - v) * 12}px) scale(${0.94 + v * 0.06})`, filter: `blur(${(1 - v) * 6}px)`, whiteSpace: 'nowrap'}}>{t}</div>
    </div>
  );
};

// ------------------------------------------------------------- 1+2. hook → chat card (light)
const STY = ['Kinetic UI', 'Minimal', '3D World', 'Cetak Klasik'];
const HookChat: React.FC = () => {
  const f = useCurrentFrame();
  const typed = Math.floor(interpolate(f, [T.chat + 12, T.chat + 60], [0, CMD.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const sent = f >= T.chat + 66;
  const reply = k(f, T.chat + 74, T.chat + 90);
  const pick = f >= T.chat + 104;
  const board = k(f, T.chat + 116, T.chat + 132);
  const out = k(f, T.dulu + 4, T.dulu + 14);
  const cardH = interpolate(reply, [0, 1], [180, 380]) + interpolate(board, [0, 1], [0, 300]);
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{position: 'absolute', left: 70, top: 150}}>
        <Words w={['Nak', 'edit', 'video?']} at={4} size={100} color={C.ink} step={5} out={k(f, 62, 78)} />
      </div>
      <Card at={58} x={60} y={600} w={960} h={cardH} out={out}>
        <div style={{padding: 30}}>
          <div style={{display: 'inline-flex', gap: 10, alignItems: 'center', background: 'rgba(247,253,146,.12)', color: C.lime, borderRadius: 10, padding: '6px 14px', fontFamily: C.mono, fontSize: 22}}>▶ reel_pocket.mov · 0:58</div>
          <div style={{display: 'flex', alignItems: 'center', marginTop: 20, gap: 16}}>
            <div style={{flex: 1, fontFamily: C.mono, fontSize: 32, minHeight: 46}}>
              <span style={{color: C.lime}}>{CMD.slice(0, Math.min(typed, 12))}</span>
              {CMD.slice(12, typed)}
              {!sent && <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0}}>|</span>}
            </div>
            <div style={{width: 56, height: 56, borderRadius: 28, background: sent ? C.lime : 'rgba(255,255,255,.14)', color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, transform: `scale(${1 - Math.max(0, 1 - Math.abs(f - (T.chat + 66)) / 4) * 0.15})`}}>↑</div>
          </div>
          <div style={{opacity: reply, marginTop: 26, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 22}}>
            <div style={{fontSize: 32, fontWeight: 600}}>Style nak yang mana?</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16}}>
              {STY.map((s, i) => (
                <div key={s} style={{padding: '10px 20px', borderRadius: 30, fontSize: 25, fontWeight: 500, background: pick && i === 0 ? C.lime : 'rgba(255,255,255,.08)', color: pick && i === 0 ? C.ink : '#fff'}}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div style={{opacity: board, marginTop: 24}}>
            <Mono dark style={{color: C.lime}}>Storyboard v1 ✓</Mono>
            <div style={{display: 'flex', gap: 12, marginTop: 12}}>
              {[1, 2, 3, 4, 5].map((n, i) => (
                <Img key={n} src={staticFile(`style06/t${n}.jpg`)} style={{width: 166, height: 220, objectFit: 'cover', objectPosition: '50% 30%', borderRadius: 12, opacity: k(f, T.chat + 118 + i * 3, T.chat + 126 + i * 3)}} />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------- 3+4. "Dulu?" → "So kami lock…" (dark)
const DuluLock: React.FC = () => {
  const f = useCurrentFrame();
  const clear = k(f, T.lock - 8, T.lock + 4);
  const lockIn = useSpr(f - T.lock - 30, 11, 200);
  const shut = k(f, T.lock + 34, T.lock + 42, io);
  const out = k(f, T.kit - 2, T.kit + 10);
  return (
    <Wipe start={T.dulu}>
      <Bg dark />
      <div style={{position: 'absolute', left: 70, right: 70, top: 470}}>
        <Words w={['Dulu?']} at={T.dulu + 10} size={88} color="#fff" out={clear} />
        <Words w={['Nak', 'edit', 'video,', '\n', 'kena', 'brief', 'dari', ['awal.', {color: C.orange}]]} at={T.dulu + 22} size={88} color="#fff" step={3} out={clear} />
        <Words w={['Font', 'lain,', 'colour', 'lain.']} at={T.dulu + 66} size={36} color="rgba(255,255,255,.7)" weight={500} step={3} out={clear} style={{marginTop: 26}} />
        <Words w={[['Takde', {color: C.orange}], ['consistency.', {color: C.orange}]]} at={T.dulu + 84} size={36} color={C.orange} weight={600} step={3} out={clear} />
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 600, opacity: 1 - out, filter: `blur(${out * 10}px)`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <Words w={['So', 'kami', ['lock', {color: C.lime}]]} at={T.lock + 6} size={104} color="#fff" />
          <svg width={86} height={100} viewBox="0 0 26 30" style={{transform: `scale(${lockIn})`}}>
            <path d="M7 13 V9 a6 6 0 0 1 12 0 V13" fill="none" stroke={C.lime} strokeWidth={3} strokeLinecap="round" transform={`translate(0 ${-(1 - shut) * 4})`} />
            <rect x={3} y={13} width={20} height={15} rx={4} fill={C.lime} />
          </svg>
        </div>
        <Words w={['semua', 'dalam', '\n', 'satu', 'skill.']} at={T.lock + 22} size={104} color="#fff" />
      </div>
    </Wipe>
  );
};

// ------------------------------------------------------------- 5. brand kit (light) — "Aa" card + swatch stack (REF-04 style)
const SW: [string, string, string][] = [
  [C.dark, 'Latar', '#fff'],
  [C.lime, 'Aksen', C.ink],
  [C.orange, 'Api', '#fff'],
  ['#ffffff', 'Teks', C.ink],
];
const Kit: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, T.board - 2, T.board + 10);
  return (
    <Wipe start={T.kit}>
      <Bg />
      <Card at={T.kit + 10} x={60} y={520} w={560} h={560} bg="#ffffff" out={out} tilt={[8, 8]}>
        <div style={{padding: 34, color: C.ink}}>
          <div style={{fontSize: 210, fontWeight: 800, lineHeight: 1, letterSpacing: -6}}>Aa</div>
          <div style={{display: 'flex', gap: 22, marginTop: 30}}>
            {['800', '600', '400'].map((w) => (
              <div key={w}>
                <div style={{fontSize: 42, fontWeight: Number(w)}}>{w}</div>
                <Mono style={{fontSize: 16}}>weight</Mono>
              </div>
            ))}
          </div>
          <div style={{fontSize: 24, color: '#666', marginTop: 26}}>Poppins je. Kemas, minimal.</div>
        </div>
      </Card>
      <Card at={T.kit + 22} x={650} y={560} w={370} h={480} out={out} tilt={[8, -10]}>
        <div style={{padding: 22, display: 'flex', flexDirection: 'column', gap: 12, height: '100%', boxSizing: 'border-box'}}>
          {SW.map(([hex, name, fg], i) => {
            const v = k(f, T.kit + 34 + i * 10, T.kit + 44 + i * 10);
            return (
              <div key={name} style={{flex: 1, borderRadius: 16, background: hex, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 18px', fontWeight: 600, fontSize: 24, border: hex === C.dark ? '1px solid rgba(255,255,255,.15)' : 'none', opacity: v, transform: `translateY(${(1 - v) * 30}px)`}}>
                <span>{name}</span>
                <span style={{fontFamily: C.mono, fontSize: 16, opacity: 0.75}}>{hex.toUpperCase()}</span>
              </div>
            );
          })}
        </div>
      </Card>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1170, display: 'flex', justifyContent: 'center', opacity: k(f, T.kit + 90, T.kit + 102) * (1 - out)}}>
        <Img src={staticFile('logo-dark.png')} style={{height: 90}} />
      </div>
    </Wipe>
  );
};

// ------------------------------------------------------------- 6. storyboard (light)
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const go = useSpr(f - T.board - 92, 10, 200);
  const out = k(f, T.motion - 2, T.motion + 10);
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{opacity: 1 - out}}>
        <Mono style={{position: 'absolute', left: 70, top: 470, opacity: k(f, T.board + 6, T.board + 16)}}>Storyboard video ni · v1 → v5</Mono>
        {[
          [1, '01 · Hook'],
          [3, '02 · Insight'],
          [4, '03 · Showcase'],
        ].map(([n, lbl], i) => (
          <Card key={i} at={T.board + 12 + i * 8} x={70 + i * 320} y={540 + Math.abs(i - 1) * 30} w={300} h={560} bg="#ffffff" tilt={[6, (1 - i) * 8]}>
            <div style={{padding: 12}}>
              <Img src={staticFile(`style06/t${n}.jpg`)} style={{width: 276, height: 480, objectFit: 'cover', borderRadius: 20, display: 'block'}} />
              <Mono style={{color: C.ink, padding: '12px 6px 0', fontWeight: 700}}>{lbl}</Mono>
            </div>
          </Card>
        ))}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1200, display: 'flex', justifyContent: 'center'}}>
          <div style={{background: C.ink, color: C.lime, fontFamily: C.font, fontWeight: 700, fontSize: 44, padding: '12px 38px', borderRadius: 40, transform: `scale(${go})`}}>"go" ✓</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------- 7. motion — flat lime ball on a track (dark, REF-04)
const Motion: React.FC = () => {
  const f = useCurrentFrame();
  const t = Math.max(0, f - T.motion - 12) / 150;
  const ph = (t * 3) % 1;
  const bx = interpolate(Math.min(1, t), [0, 1], [170, 910]);
  const by = 1160 - Math.abs(Math.sin(ph * Math.PI)) * 330 * (1 - Math.min(1, t) * 0.3);
  const contact = ph < 0.07 || ph > 0.93 ? 1 - Math.min(ph, 1 - ph) / 0.07 : 0;
  const vy = Math.cos(ph * Math.PI);
  const stretch = Math.abs(vy) * 0.22 * (1 - contact);
  const g = useSpr(f - T.motion - 90, 15, 140);
  const out = k(f, T.audio - 2, T.audio + 10);
  return (
    <Wipe start={T.motion}>
      <Bg dark />
      <div style={{opacity: 1 - out}}>
        <Mono dark style={{position: 'absolute', left: 70, top: 470, opacity: k(f, T.motion + 20, T.motion + 30)}}>stretch ikut arah gerak</Mono>
        <div style={{position: 'absolute', left: 120, right: 120, top: 1200, height: 2, background: 'rgba(255,255,255,.18)'}} />
        {[9, 6, 3].map((d, i) => {
          const tt = Math.max(0, f - d - T.motion - 12) / 150;
          const p2 = (tt * 3) % 1;
          const x2 = interpolate(Math.min(1, tt), [0, 1], [170, 910]);
          const y2 = 1160 - Math.abs(Math.sin(p2 * Math.PI)) * 330 * (1 - Math.min(1, tt) * 0.3);
          return <div key={i} style={{position: 'absolute', left: x2 - 36, top: y2 - 36, width: 72, height: 72, borderRadius: 36, background: C.lime, opacity: 0.08 + i * 0.06}} />;
        })}
        <div style={{position: 'absolute', left: bx - 40, top: by - 40 + contact * 12, width: 80, height: 80, borderRadius: 40, background: C.lime, boxShadow: `0 0 40px ${C.lime}66`, transform: `scale(${1 + contact * 0.3 - stretch * 0.4}, ${1 - contact * 0.28 + stretch})`}} />
        <Mono dark style={{position: 'absolute', left: 120, top: 1226, color: C.lime, opacity: k(f, T.motion + 40, T.motion + 50)}}>squash 14%</Mono>
        <div style={{position: 'absolute', right: 70, top: 560, width: 360, opacity: g, transform: `translateY(${(1 - g) * 40}px)`}}>
          <div style={{background: 'rgba(255,255,255,.05)', border: '1.5px solid rgba(255,255,255,.1)', borderRadius: 24, padding: 20}}>
            <Mono dark style={{fontSize: 17}}>overshoot 7%</Mono>
            <svg width={320} height={110} style={{marginTop: 8}}>
              <path d="M0,100 C70,100 80,8 150,6 S240,22 320,18" fill="none" stroke={C.lime} strokeWidth={4} strokeDasharray={480} strokeDashoffset={480 * (1 - k(f, T.motion + 96, T.motion + 120))} />
            </svg>
          </div>
        </div>
      </div>
    </Wipe>
  );
};

// ------------------------------------------------------------- 8. audio (light)
const AudioS: React.FC = () => {
  const f = useCurrentFrame();
  const fix = k(f, T.audio + 60, T.audio + 96, io);
  const lufs = Math.round(interpolate(fix, [0, 1], [-27, -14]));
  const out = k(f, T.why - 2, T.why + 10);
  return (
    <Wipe start={T.audio}>
      <Bg />
      <Card at={T.audio + 8} x={60} y={520} w={960} h={260} out={out}>
        <div style={{padding: 26}}>
          <Mono dark style={{color: fix < 0.5 ? C.orange : C.lime}}>{fix < 0.5 ? 'suara · sebelum' : 'selepas · master'}</Mono>
          <div style={{display: 'flex', alignItems: 'center', gap: 5, height: 160, marginTop: 10}}>
            {new Array(64).fill(0).map((_, i) => {
              const noisy = 0.1 + random(`w${i}${Math.floor(f / 3)}`) * 0.85;
              const clean = 0.45 + Math.abs(Math.sin(i * 0.5 + f / 6)) * 0.45;
              return <div key={i} style={{flex: 1, height: `${interpolate(fix, [0, 1], [noisy, clean]) * 100}%`, borderRadius: 3, background: fix < 0.5 ? C.orange : C.lime}} />;
            })}
          </div>
        </div>
      </Card>
      <Card at={T.audio + 50} x={60} y={830} w={460} h={190} bg="#ffffff" out={out} tilt={[6, 6]}>
        <div style={{padding: '22px 30px', color: C.ink}}>
          <div style={{fontSize: 76, fontWeight: 800}}>{lufs}</div>
          <Mono>LUFS · master</Mono>
        </div>
      </Card>
      <Card at={T.audio + 104} x={560} y={830} w={460} h={190} bg="#ffffff" out={out} tilt={[6, -6]}>
        <div style={{padding: '22px 30px', color: C.ink}}>
          <div style={{fontSize: 76, fontWeight: 800}}>
            28.8<span style={{fontSize: 32}}>MB</span>
          </div>
          <Mono>final_9x16.mp4</Mono>
        </div>
      </Card>
    </Wipe>
  );
};

// ------------------------------------------------------------- 9. why (dark)
const Why: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, T.end - 6, T.end + 4);
  const rows: [number, Wd[]][] = [
    [T.why + 40, ['Takyah', 'explain', ['panjang.', {color: C.lime}]]],
    [T.why + 64, ['Semua', 'video,', 'stay', ['consistent.', {color: C.lime}]]],
    [T.why + 88, ['Kami', 'brief', ['idea', {color: C.lime}], 'je.']],
  ];
  return (
    <Wipe start={T.why}>
      <Bg dark />
      <div style={{position: 'absolute', left: 70, right: 70, top: 520, opacity: 1 - out, filter: `blur(${out * 10}px)`}}>
        <Words w={['Kenapa', 'sesuai', '\n', 'untuk', 'kami?']} at={T.why + 8} size={92} color="#fff" />
        <div style={{marginTop: 40}}>
          {rows.map(([at, w], i) => (
            <div key={i} style={{marginBottom: 26}}>
              <Mono dark style={{color: C.lime, opacity: k(f, at - 4, at + 4)}}>0{i + 1}</Mono>
              <Words w={w} at={at} size={46} color="#fff" weight={500} step={3} />
            </div>
          ))}
        </div>
      </div>
    </Wipe>
  );
};

// ------------------------------------------------------------- 10. end (dark)
const End: React.FC = () => {
  const f = useCurrentFrame();
  const bar = k(f, T.end + 8, T.end + 24, io);
  const txt = k(f, T.end + 16, T.end + 26);
  const logo = useSpr(f - T.end - 70, 14, 140);
  const fade = k(f, SIGC_TOTAL - 26, SIGC_TOTAL - 2);
  return (
    <AbsoluteFill style={{opacity: 1 - fade}}>
      <Bg dark />
      <div style={{position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', fontFamily: C.font, color: '#fff'}}>
        <div style={{width: 110 + bar * 520, height: 104, borderRadius: 52, background: C.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: `0 0 70px ${C.lime}55`}}>
          <span style={{fontFamily: C.mono, fontWeight: 700, fontSize: 46, color: C.ink, opacity: txt, filter: `blur(${(1 - txt) * 8}px)`, whiteSpace: 'nowrap'}}>/pocketstyle</span>
        </div>
        <Words w={['Video', 'yang', 'anda', 'tengok', 'ni', '\n', 'pun', 'dibuat', 'guna', 'ni', 'je.']} at={T.end + 32} size={44} color="#fff" weight={500} step={2} style={{marginTop: 40, lineHeight: 1.35}} />
        <Mono dark style={{marginTop: 30, opacity: k(f, T.end + 58, T.end + 68)}}>Next video? Satu command je.</Mono>
        <Img src={staticFile('logo-white.png')} style={{width: 300, marginTop: 80, opacity: logo, transform: `scale(${0.88 + logo * 0.12})`}} />
      </div>
    </AbsoluteFill>
  );
};

type Cue = [number, string, number];
const CUES: Cue[] = [
  [4, 'min_swish', 0.35],
  [58, 'pop', 0.4],
  ...new Array(12).fill(0).map((_, i) => [T.chat + 12 + i * 4, 'min_tick', 0.2] as Cue),
  [T.chat + 66, 'click', 0.7],
  [T.chat + 74, 'min_swish', 0.35],
  [T.chat + 104, 'click', 0.6],
  [T.chat + 116, 'min_swish', 0.35],
  [T.dulu, 'min_whoosh', 0.45],
  [T.dulu + 84, 'min_tick', 0.4],
  [T.lock + 6, 'min_swish', 0.35],
  [T.lock + 36, 'click', 0.7],
  [T.kit, 'min_whoosh', 0.45],
  ...[0, 1, 2, 3].map((i) => [T.kit + 34 + i * 10, 'tick', 0.35] as Cue),
  [T.board + 12, 'min_swish', 0.35],
  [T.board + 92, 'pop', 0.55],
  [T.motion, 'min_whoosh', 0.45],
  ...[0, 1, 2].map((i) => [T.motion + 12 + (i + 1) * 50, 'min_thump', 0.35] as Cue),
  [T.audio, 'min_whoosh', 0.45],
  [T.audio + 60, 'min_swish', 0.4],
  [T.audio + 104, 'pop', 0.4],
  [T.why, 'min_whoosh', 0.45],
  [T.why + 40, 'min_tick', 0.35],
  [T.why + 64, 'min_tick', 0.35],
  [T.why + 88, 'min_tick', 0.35],
  [T.end + 8, 'min_swish', 0.45],
  [T.end + 70, 'min_chime', 0.5],
];

export const ReelSignatureClean: React.FC<{music?: string}> = ({music = 'music_subclair.mp3'}) => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['400 40px Poppins', '500 40px Poppins', '600 40px Poppins', '700 40px Poppins', '800 40px Poppins', '400 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'].map((x) => document.fonts.load(x))).then(() => continueRender(h));
  }, [h]);
  return (
    <AbsoluteFill style={{background: C.light}}>
      <Audio src={staticFile(music)} volume={(fr) => interpolate(fr, [0, 15, SIGC_TOTAL - 45, SIGC_TOTAL - 2], [0, 0.5, 0.5, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Show from={0} to={T.dulu + 16}><HookChat /></Show>
      <Show from={T.dulu} to={T.kit + 16}><DuluLock /></Show>
      <Show from={T.kit} to={T.board + 2}><Kit /></Show>
      <Show from={T.board} to={T.motion + 16}><Board /></Show>
      <Show from={T.motion} to={T.audio + 16}><Motion /></Show>
      <Show from={T.audio} to={T.why + 16}><AudioS /></Show>
      <Show from={T.why} to={T.end + 4}><Why /></Show>
      <Show from={T.end} to={SIGC_TOTAL}><End /></Show>
      <Header />
      <Capsule />
    </AbsoluteFill>
  );
};
