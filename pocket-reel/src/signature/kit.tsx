import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';

// ===== Style 06 "Pocket Signature" — brand kit tokens =====
export const B = {
  bg: '#0d0e13',
  dark: '#1A1D21',
  lime: '#f7fd92',
  limeDeep: '#e6ef6a',
  orange: '#ff6b3d',
  cyan: '#38e1f5',
  white: '#ffffff',
  ink: '#111214',
  font: "'Poppins', sans-serif",
  mono: "'JetBrains Mono', monospace",
};
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const io = Easing.bezier(0.65, 0, 0.35, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const k = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});
export const useSpr = (frame: number, damping = 13, stiffness = 160) => {
  const {fps} = useVideoConfig();
  return spring({frame, fps, config: {damping, stiffness}});
};

/** Style 01 dark background with moving diagonal streaks */
export const DarkBg: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: B.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          inset: -400,
          background: `repeating-linear-gradient(115deg, transparent 0 140px, rgba(247,253,146,.10) 140px 220px, transparent 220px 380px, rgba(70,100,190,.22) 380px 430px, transparent 430px 560px)`,
          backgroundPosition: `${f * 2.5}px 0`,
          filter: 'blur(40px)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.65) 100%)'}} />
    </AbsoluteFill>
  );
};

/** lime brand page with faint grid (Style 01 training scene) */
export const LimeBg: React.FC = () => (
  <AbsoluteFill
    style={{
      background: B.lime,
      backgroundImage: 'linear-gradient(rgba(0,0,0,.055) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.055) 1px, transparent 1px)',
      backgroundSize: '44px 44px',
    }}
  />
);

/** circle wipe (Style 04), driven by a global start frame */
export const Wipe: React.FC<{start: number; children: React.ReactNode; cx?: number; cy?: number; dur?: number}> = ({start, children, cx = 540, cy = 960, dur = 16}) => {
  const f = useCurrentFrame();
  const r = k(f, start, start + dur, io) * 2300;
  return <AbsoluteFill style={{clipPath: `circle(${r}px at ${cx}px ${cy}px)`}}>{children}</AbsoluteFill>;
};

/** words that rise out of blur one by one (Style 04) */
export type Wd = string | [string, React.CSSProperties];
export const Words: React.FC<{w: Wd[]; at: number; size: number; color: string; step?: number; weight?: number; style?: React.CSSProperties; out?: number}> = ({
  w,
  at,
  size,
  color,
  step = 4,
  weight = 800,
  style,
  out = 0,
}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: B.font, fontWeight: weight, fontSize: size, lineHeight: 1.08, letterSpacing: -size * 0.02, color, ...style}}>
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

/** Style 02 mask reveal */
export const Mask: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const f = useCurrentFrame();
  const v = k(f, at, at + 22);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.08em', ...style}}>
      <div style={{transform: `translateY(${(1 - v) * 110}%)`}}>{children}</div>
    </div>
  );
};

/** Style 01 cursor with name tag */
export const Cursor: React.FC<{x: number; y: number; label?: string; color?: string; press?: number}> = ({x, y, label = 'Pocket', color = B.orange, press = 0}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.15})`, transformOrigin: '0 0', zIndex: 20}}>
    <svg width="50" height="56" viewBox="0 0 24 26">
      <path d="M2 2 L2 21 L7.5 16 L11 24 L14.5 22.5 L11 15 L18 15 Z" fill={color} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
    <div style={{position: 'absolute', left: 36, top: 42, background: color, color: '#fff', fontFamily: B.font, fontWeight: 600, fontSize: 24, padding: '4px 14px', borderRadius: 9, whiteSpace: 'nowrap'}}>{label}</div>
  </div>
);

/** Style 03 frosted glass card */
export const Glass: React.FC<{style?: React.CSSProperties; children: React.ReactNode; light?: boolean}> = ({style, children, light}) => (
  <div
    style={{
      background: light ? 'rgba(17,18,20,.92)' : 'linear-gradient(135deg, rgba(255,255,255,.10), rgba(255,255,255,.04))',
      backdropFilter: 'blur(22px)',
      WebkitBackdropFilter: 'blur(22px)',
      border: '1.5px solid rgba(255,255,255,.16)',
      borderRadius: 36,
      boxShadow: '0 40px 90px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.18)',
      color: '#fff',
      fontFamily: B.font,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Style 05 marker strike (full width) */
export const Strike: React.FC<{at: number; color?: string; thick?: number; tilt?: number}> = ({at, color = B.orange, thick = 12, tilt = -3}) => {
  const f = useCurrentFrame();
  const p = k(f, at, at + 8, io);
  return (
    <div style={{position: 'absolute', left: '-4%', width: '108%', top: '52%', height: thick, marginTop: -thick / 2, transform: `rotate(${tilt}deg)`}}>
      <div style={{width: `${p * 100}%`, height: '100%', background: color, borderRadius: thick}} />
    </div>
  );
};

/** Style 05 rubber stamp */
export const Stamp: React.FC<{at: number; text: string; color?: string; size?: number; rot?: number; style?: React.CSSProperties}> = ({at, text, color = B.orange, size = 44, rot = -8, style}) => {
  const f = useCurrentFrame();
  const s = useSpr(f - at, 11, 260);
  if (f < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        fontFamily: B.font,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: size * 0.06,
        color,
        border: `${size * 0.1}px solid ${color}`,
        borderRadius: size * 0.2,
        padding: `${size * 0.12}px ${size * 0.35}px`,
        transform: `rotate(${rot}deg) scale(${2.2 - s * 1.2})`,
        opacity: Math.min(1, s * 1.5),
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** Style 04 caption pill at the bottom */
export const Pill: React.FC<{lines: [number, number, string][]}> = ({lines}) => {
  const f = useCurrentFrame();
  const cur = lines.find(([a, b]) => f >= a && f < b);
  if (!cur) return null;
  const [a, b, t] = cur;
  const v = k(f, a, a + 8) * (1 - k(f, b - 6, b));
  return (
    <div style={{position: 'absolute', top: 1640, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          background: '#fff',
          color: B.ink,
          fontFamily: B.font,
          fontWeight: 600,
          fontSize: 36,
          padding: '14px 34px',
          borderRadius: 40,
          boxShadow: '0 12px 30px rgba(0,0,0,.25)',
          opacity: v,
          transform: `translateY(${(1 - v) * 14}px) scale(${0.94 + v * 0.06})`,
          filter: `blur(${(1 - v) * 6}px)`,
          whiteSpace: 'nowrap',
        }}
      >
        {t}
      </div>
    </div>
  );
};

/** Style 01 kinetic letters: each letter flies in with a different treatment */
const LV = ['white', 'outline', 'lime', 'box', 'orange', 'white', 'outline', 'lime'] as const;
export const KineticLine: React.FC<{text: string; at: number; size: number; out?: number}> = ({text, at, size, out = 0}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{fontFamily: B.font, fontWeight: 900, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap', opacity: 1 - out, filter: `blur(${out * 14}px)`}}>
      {text.split('').map((ch, i) => {
        if (ch === ' ') return <span key={i} style={{display: 'inline-block', width: size * 0.28}} />;
        const s = spring({frame: f - at - i * 1.6, fps, config: {damping: 13, stiffness: 170}});
        const v = LV[i % LV.length];
        const st: React.CSSProperties = {display: 'inline-block', position: 'relative', color: '#fff'};
        if (v === 'outline') {
          st.color = 'transparent';
          st.WebkitTextStroke = `${size * 0.03}px #fff`;
        }
        if (v === 'lime') st.color = B.lime;
        if (v === 'orange') st.color = B.orange;
        if (v === 'box') {
          st.outline = `4px solid ${B.cyan}`;
          st.outlineOffset = 4;
        }
        const x0 = (random(`kx${i}${text}`) - 0.5) * 700;
        const y0 = (random(`ky${i}${text}`) - 0.5) * 500;
        return (
          <span
            key={i}
            style={{
              ...st,
              opacity: Math.min(1, s * 2),
              transform: `translate(${x0 * (1 - s)}px, ${y0 * (1 - s)}px) rotate(${(1 - s) * 40}deg) scale(${1 + (1 - s) * 1.2})`,
              filter: `blur(${(1 - s) * 16}px)`,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
