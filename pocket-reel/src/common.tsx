import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// ===== Brand palette (tukar di sini jika warna jenama berbeza) =====
export const C = {
  bg: '#0d0e13',
  light: '#f3f3f1',
  orange: '#ff6b3d',
  yellow: '#ffc531',
  cyan: '#38e1f5',
  purple: '#8b5cf6',
  pink: '#ff4d8d',
  green: '#3be38f',
  white: '#ffffff',
  ink: '#16171c',
  lime: '#f7fd92',
  dark: '#1A1D21',
};
export const PAL = [C.orange, C.cyan, C.purple, C.yellow, C.pink, C.green];

export const FONT = "'Poppins', sans-serif";
export const SCRIPT = "'Dancing Script', cursive";

export const expo = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.bezier(0.65, 0, 0.35, 1);

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** progress 0→1 between frames a and b */
export const p = (f: number, a: number, b: number, e = expo) =>
  interpolate(f, [a, b], [0, 1], {...clamp, easing: e});

/** true for the 16:9 website version */
export const useWide = () => {
  const {width, height} = useVideoConfig();
  return width > height;
};

/** Places a 1080x1920 portrait layout in the centre of a landscape frame (no-op in portrait). */
export const Stage: React.FC<{dy?: number; children: React.ReactNode}> = ({dy = 0, children}) => {
  const {width, height} = useVideoConfig();
  if (width <= height) return <>{children}</>;
  return <div style={{position: 'absolute', left: (width - 1080) / 2, top: (height - 1920) / 2 + dy, width: 1080, height: 1920}}>{children}</div>;
};

export const DarkBg: React.FC<{speed?: number}> = ({speed = 3}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          inset: -400,
          background: `repeating-linear-gradient(115deg,
            transparent 0 140px,
            rgba(70,140,90,.32) 140px 230px,
            transparent 230px 380px,
            rgba(70,100,190,.30) 380px 430px,
            transparent 430px 560px)`,
          backgroundPosition: `${f * speed}px 0`,
          filter: 'blur(40px)',
        }}
      />
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.65) 100%)'}}
      />
    </AbsoluteFill>
  );
};

export const GridBg: React.FC<{dark?: boolean}> = ({dark = true}) => (
  <AbsoluteFill
    style={{
      background: dark ? '#1b1c20' : C.light,
      backgroundImage: `linear-gradient(${dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'} 1px, transparent 1px),
        linear-gradient(90deg, ${dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'} 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
    }}
  />
);

export const Cursor: React.FC<{x: number; y: number; label?: string; color?: string; scale?: number}> = ({
  x,
  y,
  label,
  color = C.orange,
  scale = 1,
}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `scale(${scale})`, transformOrigin: '0 0'}}>
    <svg width="54" height="60" viewBox="0 0 24 26">
      <path d="M2 2 L2 21 L7.5 16 L11 24 L14.5 22.5 L11 15 L18 15 Z" fill={color} stroke="#fff" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
    {label && (
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: 46,
          background: color,
          color: '#fff',
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 26,
          padding: '6px 16px',
          borderRadius: 10,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </div>
    )}
  </div>
);

export const PlayIcon: React.FC<{size?: number; color?: string}> = ({size = 40, color = '#fff'}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M7 4.5 L19.5 12 L7 19.5 Z" fill={color} strokeLinejoin="round" stroke={color} strokeWidth="2" />
  </svg>
);
