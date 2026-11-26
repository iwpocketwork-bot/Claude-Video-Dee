import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// ===== Style 04 "Kinetic Explainer" tokens (ref: references/REF-04-kinetic-explainer) =====
export const T = {
  light: '#f2f2f6',
  dark: '#0a0c1c',
  ink: '#0e0f14',
  lime: '#e4f75a', // lebih tepu sedikit dari #f7fd92 supaya nampak di latar cerah
  limeSoft: '#f7fd92',
  red: '#ff3b4a',
  blue: '#1f3bff',
  card: '#15161c',
  font: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const k = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});

export const useSpr = (delay: number, damping = 14, stiffness = 150) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness}});
};

export const Bg: React.FC<{mode: 'light' | 'dark'}> = ({mode}) => {
  const f = useCurrentFrame();
  const d = Math.sin(f / 60) * 30;
  return mode === 'light' ? (
    <AbsoluteFill style={{background: T.light}}>
      <div style={{position: 'absolute', right: -260 + d, top: -200, width: 900, height: 900, borderRadius: '50%', background: 'rgba(160,150,255,.28)', filter: 'blur(140px)'}} />
      <div style={{position: 'absolute', left: -300, bottom: -300 - d, width: 800, height: 800, borderRadius: '50%', background: 'rgba(200,215,255,.35)', filter: 'blur(160px)'}} />
    </AbsoluteFill>
  ) : (
    <AbsoluteFill style={{background: T.dark}}>
      <div style={{position: 'absolute', right: -250 + d, top: -150, width: 950, height: 950, borderRadius: '50%', background: 'rgba(35,60,255,.5)', filter: 'blur(160px)'}} />
      <div style={{position: 'absolute', left: -300, bottom: -260 - d, width: 850, height: 850, borderRadius: '50%', background: 'rgba(40,150,140,.28)', filter: 'blur(170px)'}} />
    </AbsoluteFill>
  );
};

/** words rise out of blur one-by-one. w = list of [word, color?] */
export type Wd = string | [string, string];
export const Words: React.FC<{w: Wd[]; delay: number; size: number; color: string; step?: number; style?: React.CSSProperties; out?: number}> = ({
  w,
  delay,
  size,
  color,
  step = 3,
  style,
  out = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: T.font, fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: -size * 0.025, color, ...style}}>
      {w.map((x, i) => {
        const [t, c] = typeof x === 'string' ? [x, undefined] : x;
        if (t === '\n') return <br key={i} />;
        const v = k(f, delay + i * step, delay + i * step + 10);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: '0.25em',
              color: c ?? color,
              opacity: v * (1 - out),
              filter: `blur(${(1 - v) * 12 + out * 12}px)`,
              transform: `translateY(${(1 - v) * 14}px)`,
            }}
          >
            {t}
          </span>
        );
      })}
    </div>
  );
};

/** white subtitle-like pill at the bottom; lines = [[startFrame, text], ...] */
export const Caption: React.FC<{lines: [number, string][]; end: number}> = ({lines, end}) => {
  const f = useCurrentFrame();
  let idx = -1;
  lines.forEach(([s], i) => {
    if (f >= s) idx = i;
  });
  if (idx < 0 || f > end) return null;
  const [s, text] = lines[idx];
  const v = k(f, s, s + 8);
  const o = 1 - k(f, end - 6, end);
  return (
    <div style={{position: 'absolute', top: 1560, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          background: '#fff',
          color: T.ink,
          fontFamily: T.font,
          fontWeight: 500,
          fontSize: 34,
          padding: '14px 32px',
          borderRadius: 40,
          boxShadow: '0 10px 30px rgba(0,0,0,.18)',
          opacity: v * o,
          transform: `translateY(${(1 - v) * 12}px) scale(${0.94 + v * 0.06})`,
          filter: `blur(${(1 - v) * 6}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** dark UI card with soft 3D tilt and spring entrance */
export const Card: React.FC<{delay: number; x: number; y: number; w: number; h: number; tilt?: [number, number]; children?: React.ReactNode; out?: number; bg?: string}> = ({
  delay,
  x,
  y,
  w,
  h,
  tilt = [8, -6],
  children,
  out = 0,
  bg = T.card,
}) => {
  const f = useCurrentFrame();
  const s = useSpr(delay, 15, 130);
  const fl = Math.sin((f - delay) / 30) * 1.5;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 1600, opacity: Math.min(1, s * 1.4) * (1 - out)}}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: bg,
          borderRadius: 36,
          border: '1.5px solid rgba(255,255,255,.08)',
          boxShadow: '0 50px 90px rgba(10,12,40,.28), 0 8px 20px rgba(0,0,0,.15)',
          transform: `rotateX(${tilt[0] + fl + (1 - s) * 25}deg) rotateY(${tilt[1] + (1 - s) * -15}deg) scale(${0.8 + s * 0.2}) translateY(${(1 - s) * 80}px)`,
          filter: `blur(${(1 - s) * 10 + out * 14}px)`,
          overflow: 'hidden',
          position: 'relative',
          color: '#fff',
          fontFamily: T.font,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: T.mono, fontSize: 22, letterSpacing: 1, color: 'rgba(255,255,255,.55)', textTransform: 'uppercase', ...style}}>{children}</div>
);

/** expanding circle reveal for light ↔ dark switches */
export const Wipe: React.FC<{children: React.ReactNode; dur?: number; cx?: number; cy?: number}> = ({children, dur = 16, cx = 540, cy = 900}) => {
  const f = useCurrentFrame();
  const r = k(f, 0, dur, Easing.bezier(0.65, 0, 0.35, 1)) * 2300;
  return <AbsoluteFill style={{clipPath: `circle(${r}px at ${cx}px ${cy}px)`}}>{children}</AbsoluteFill>;
};

/** small tip label + title under the persistent header */
export const TipTitle: React.FC<{n: string; title: Wd[]; delay: number; mode: 'light' | 'dark'; out?: number}> = ({n, title, delay, mode, out = 0}) => {
  const f = useCurrentFrame();
  const v = k(f, delay, delay + 10);
  return (
    <div style={{position: 'absolute', left: 70, top: 410}}>
      <div style={{fontFamily: T.mono, fontSize: 26, letterSpacing: 4, color: mode === 'light' ? '#7a7a88' : 'rgba(255,255,255,.55)', opacity: v * (1 - out), marginBottom: 14}}>TIP {n}</div>
      <Words w={title} delay={delay + 4} size={78} color={mode === 'light' ? T.ink : '#fff'} out={out} />
    </div>
  );
};
