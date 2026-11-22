import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

// ===== Style 02: Minimal Elegan — design tokens =====
export const M = {
  black: '#0b0b0c',
  cream: '#f3f1ea',
  ink: '#111111',
  grey: '#8a8780',
  greyD: '#6d6d6d',
  line: 'rgba(17,17,17,.18)',
  lineD: 'rgba(255,255,255,.22)',
  lime: '#f7fd92',
};
export const F = "'Poppins', sans-serif";

export const soft = Easing.bezier(0.22, 1, 0.36, 1); // slow out
export const glide = Easing.bezier(0.76, 0, 0.24, 1); // panel in-out
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const v = (f: number, a: number, b: number, e = soft) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});

/** Text that rises out of an invisible mask. */
export const Mask: React.FC<{delay: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  delay,
  dur = 26,
  style,
  children,
}) => {
  const f = useCurrentFrame();
  const k = v(f, delay, delay + dur);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.08em', ...style}}>
      <div style={{transform: `translateY(${(1 - k) * 110}%)`}}>{children}</div>
    </div>
  );
};

export const Fade: React.FC<{delay: number; dur?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({
  delay,
  dur = 24,
  y = 20,
  style,
  children,
}) => {
  const f = useCurrentFrame();
  const k = v(f, delay, delay + dur);
  return <div style={{...style, opacity: k, transform: `translateY(${(1 - k) * y}px)`}}>{children}</div>;
};

/** Thin line drawn left→right. */
export const Rule: React.FC<{delay: number; dur?: number; width: number; color: string; style?: React.CSSProperties}> = ({
  delay,
  dur = 30,
  width,
  color,
  style,
}) => {
  const f = useCurrentFrame();
  return <div style={{height: 2, background: color, width: width * v(f, delay, delay + dur), ...style}} />;
};

/** Background panel that slides up over the previous scene. */
export const Panel: React.FC<{bg: string; children: React.ReactNode; dur?: number}> = ({bg, children, dur = 20}) => {
  const f = useCurrentFrame();
  const k = v(f, 0, dur, glide);
  return (
    <AbsoluteFill style={{clipPath: `inset(${(1 - k) * 100}% 0 0 0)`, background: bg}}>
      <AbsoluteFill style={{transform: `translateY(${(1 - k) * 120}px)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Grain: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity: 0.07, mixBlendMode: 'overlay'}}>
    <svg width="1080" height="1920">
      <filter id="g">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
      </filter>
      <rect width="1080" height="1920" filter="url(#g)" />
    </svg>
  </AbsoluteFill>
);

export const Label: React.FC<{children: React.ReactNode; color: string; style?: React.CSSProperties}> = ({children, color, style}) => (
  <div style={{fontFamily: F, fontWeight: 500, fontSize: 24, letterSpacing: 7, textTransform: 'uppercase', color, ...style}}>{children}</div>
);
