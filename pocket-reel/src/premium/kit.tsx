import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {WORDS} from './words';

// ===== Style 05 "Iklan Cetak Klasik" — tokens =====
export const P = {
  paper: '#efe8d8',
  paperDark: '#e4dcc8',
  ink: '#151412',
  inkSoft: '#4a463e',
  red: '#c42a1f',
  serif: "'Playfair Display', serif",
  sans: "'Space Grotesk', sans-serif",
  type: "'Special Elite', monospace",
};

export const FPS = 30;
export const W = (i: number) => Math.round(WORDS[i][1] * FPS);
export const WE = (i: number) => Math.round(WORDS[i][2] * FPS);

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const io = Easing.bezier(0.65, 0, 0.35, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const k = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});
export const useSpr = (frame: number, damping = 13, stiffness = 160) => {
  const {fps} = useVideoConfig();
  return spring({frame, fps, config: {damping, stiffness}});
};

/** cream newsprint with grain, fibres and vignette */
export const Paper: React.FC<{dark?: boolean}> = ({dark}) => (
  <AbsoluteFill style={{background: dark ? P.ink : P.paper}}>
    <AbsoluteFill style={{opacity: dark ? 0.18 : 0.38, mixBlendMode: dark ? 'screen' : 'multiply'}}>
      <svg width="100%" height="100%">
        <filter id={dark ? 'gd' : 'gl'}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix values={dark ? '0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .35 0' : '0 0 0 0 .35  0 0 0 0 .3  0 0 0 0 .22  0 0 0 .5 0'} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${dark ? 'gd' : 'gl'})`} />
      </svg>
    </AbsoluteFill>
    <AbsoluteFill style={{background: dark ? 'radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,.6) 100%)' : 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(120,95,50,.22) 100%)'}} />
  </AbsoluteFill>
);

/** spoken words appear exactly when said */
export const Said: React.FC<{from: number; to: number; size: number; color?: string; font?: string; weight?: number; italic?: boolean; accent?: Record<number, React.CSSProperties>; out?: number; style?: React.CSSProperties; breaks?: number[]; step?: 'blur' | 'type'}> = ({
  from,
  to,
  size,
  color = P.ink,
  font = P.serif,
  weight = 800,
  italic,
  accent = {},
  out = 0,
  style,
  breaks = [],
  step = 'blur',
}) => {
  const g = useCurrentFrame();
  const items: React.ReactNode[] = [];
  for (let i = from; i <= to; i++) {
    const v = step === 'type' ? (g >= W(i) ? 1 : 0) : k(g, W(i) - 2, W(i) + 7);
    items.push(
      <span
        key={i}
        style={{
          display: 'inline-block',
          marginRight: '0.24em',
          opacity: v * (1 - out),
          filter: step === 'blur' ? `blur(${(1 - v) * 10 + out * 10}px)` : undefined,
          transform: step === 'blur' ? `translateY(${(1 - v) * 14}px)` : undefined,
          ...accent[i],
        }}
      >
        {WORDS[i][0]}
      </span>,
    );
    if (breaks.includes(i)) items.push(<br key={`b${i}`} />);
  }
  return (
    <div style={{fontFamily: font, fontWeight: weight, fontStyle: italic ? 'italic' : 'normal', fontSize: size, lineHeight: 1.08, letterSpacing: font === P.serif ? -size * 0.01 : 0, color, ...style}}>
      {items}
    </div>
  );
};

/** hand-drawn red marker strike that draws across its parent */
export const Strike: React.FC<{at: number; color?: string; thick?: number; tilt?: number}> = ({at, color = P.red, thick = 12, tilt = -4}) => {
  const g = useCurrentFrame();
  const p = k(g, at, at + 8, io);
  return (
    <svg style={{position: 'absolute', left: '-4%', top: '42%', width: '108%', height: 40, overflow: 'visible', transform: `rotate(${tilt}deg)`}} viewBox="0 0 100 10" preserveAspectRatio="none">
      <path d="M0,6 C20,3 45,8 70,4 S95,5 100,4" fill="none" stroke={color} strokeWidth={thick / 4} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - p)} vectorEffect="non-scaling-stroke" style={{strokeWidth: thick}} />
    </svg>
  );
};

/** rubber stamp that slams in with ink texture */
export const Stamp: React.FC<{at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties}> = ({at, text, color = P.red, size = 54, rot = -10, style}) => {
  const g = useCurrentFrame();
  const s = useSpr(g - at, 11, 260);
  if (g < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        fontFamily: P.sans,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: size * 0.08,
        color,
        border: `${size * 0.1}px solid ${color}`,
        borderRadius: size * 0.18,
        padding: `${size * 0.12}px ${size * 0.35}px`,
        transform: `rotate(${rot}deg) scale(${2.2 - s * 1.2})`,
        opacity: Math.min(1, s * 1.5) * 0.92,
        WebkitMaskImage: 'radial-gradient(circle at 30% 40%, #000 55%, rgba(0,0,0,.75) 70%, #000 85%)',
        mixBlendMode: 'multiply',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** newspaper masthead that stays on top */
export const Masthead: React.FC<{dark?: boolean; wide?: boolean}> = ({dark, wide}) => {
  const c = dark ? '#d8d0bd' : P.ink;
  return (
    <div style={{position: 'absolute', left: wide ? 100 : 60, right: wide ? 100 : 60, top: wide ? 40 : 70, color: c, fontFamily: P.sans}}>
      <div style={{height: 3, background: c}} />
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', fontSize: 22, letterSpacing: 4, fontWeight: 500}}>
        <span>NOTA COPYWRITING</span>
        <span style={{fontFamily: P.serif, fontWeight: 900, fontStyle: 'italic', fontSize: 30, letterSpacing: 0}}>Pocket Production</span>
        <span>NO. 01</span>
      </div>
      <div style={{height: 1, background: c}} />
    </div>
  );
};

/** printed-caption subtitle: phrase on a paper strip, current word in ink */
export const PrintCaption: React.FC<{phrases: [number, number][]; dark?: boolean; top: number}> = ({phrases, dark, top}) => {
  const g = useCurrentFrame();
  const ph = phrases.find(([a, b]) => g >= W(a) - 3 && g <= WE(b) + 8);
  if (!ph) return null;
  const [a, b] = ph;
  const v = k(g, W(a) - 3, W(a) + 5);
  const o = 1 - k(g, WE(b) + 2, WE(b) + 8);
  const words = [];
  for (let i = a; i <= b; i++) {
    const said = g >= W(i);
    words.push(
      <span key={i} style={{color: said ? (dark ? '#f2ecdf' : P.ink) : dark ? '#7d776b' : '#a59d8a', marginRight: '0.3em'}}>
        {WORDS[i][0]}
      </span>,
    );
  }
  return (
    <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: v * o}}>
      <div style={{fontFamily: P.type, fontSize: 34, padding: '10px 24px', borderTop: `2px solid ${dark ? '#7d776b' : P.ink}`, borderBottom: `2px solid ${dark ? '#7d776b' : P.ink}`, whiteSpace: 'nowrap', transform: `translateY(${(1 - v) * 10}px)`}}>{words}</div>
    </div>
  );
};

/** ink circle wipe between paper / ink pages */
export const InkWipe: React.FC<{children: React.ReactNode; cx: number; cy: number; start: number; dur?: number}> = ({children, cx, cy, start, dur = 14}) => {
  const f = useCurrentFrame();
  const r = k(f, start, start + dur, io) * 2400;
  return <AbsoluteFill style={{clipPath: `circle(${r}px at ${cx}px ${cy}px)`}}>{children}</AbsoluteFill>;
};

/** render children only within [from, to) of the GLOBAL frame (scenes use global VO timings) */
export const Show: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};
