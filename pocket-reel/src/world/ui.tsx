import React, {useLayoutEffect, useRef} from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export const W = {
  lime: '#f7fd92',
  dark: '#1A1D21',
  orange: '#ff8a3d',
  blue: '#4d7cff',
  font: "'Poppins', sans-serif",
};
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const io = Easing.bezier(0.65, 0, 0.35, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const k = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix3 = (a: number[], b: number[], t: number) => a.map((x, i) => mix(x, b[i], t)) as [number, number, number];

export const useSpring = (delay: number, damping = 14, stiffness = 140) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, stiffness}});
};

/** frosted glass card (blue-tinted like visionOS) */
export const Glass: React.FC<{style?: React.CSSProperties; children: React.ReactNode; radius?: number}> = ({style, children, radius = 40}) => (
  <div
    style={{
      background: 'linear-gradient(135deg, rgba(120,150,220,.42), rgba(70,95,160,.30))',
      backdropFilter: 'blur(22px) saturate(1.5)',
      WebkitBackdropFilter: 'blur(22px) saturate(1.5)',
      border: '1.5px solid rgba(255,255,255,.28)',
      borderRadius: radius,
      boxShadow: '0 30px 80px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.35)',
      color: '#fff',
      fontFamily: W.font,
      ...style,
    }}
  >
    {children}
  </div>
);

/** card that pops into 3D space (spring scale + tilt + float) */
export const Float3D: React.FC<{delay: number; x: number; y: number; w: number; tilt?: [number, number]; children: React.ReactNode; out?: number; relative?: boolean}> = ({
  delay,
  x,
  y,
  w,
  tilt = [6, -10],
  children,
  out = 0,
  relative = false,
}) => {
  const f = useCurrentFrame();
  const s = useSpring(delay, 15, 120);
  const fl = Math.sin((f - delay) / 22) * 8;
  return (
    <div style={{position: relative ? 'relative' : 'absolute', left: relative ? undefined : x, top: relative ? undefined : y, width: w, perspective: 1400, opacity: s * (1 - out)}}>
      <div
        style={{
          transform: `translateY(${(1 - s) * 140 + fl}px) translateZ(${(1 - s) * -400}px) rotateX(${tilt[0] + (1 - s) * 30}deg) rotateY(${tilt[1] + (1 - s) * -25}deg) scale(${0.85 + s * 0.15})`,
          filter: `blur(${(1 - s) * 14 + out * 16}px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Toggle: React.FC<{on: number}> = ({on}) => (
  <div style={{width: 84, height: 48, borderRadius: 24, background: on > 0.5 ? W.lime : 'rgba(255,255,255,.25)', position: 'relative', transition: 'none'}}>
    <div style={{position: 'absolute', top: 5, left: 5 + on * 36, width: 38, height: 38, borderRadius: 19, background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.3)'}} />
  </div>
);

export const Ring: React.FC<{p: number; label: string; size?: number}> = ({p, label, size = 130}) => {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.2)" strokeWidth={9} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={W.lime}
          strokeWidth={9}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="54%" textAnchor="middle" fill="#fff" fontFamily="Poppins" fontWeight={600} fontSize={size * 0.22}>
          {Math.round(p * 100)}%
        </text>
      </svg>
      <div style={{fontSize: 28, fontWeight: 500, opacity: 0.85}}>{label}</div>
    </div>
  );
};

/** DOM canvas redrawn every frame */
export const LiveCanvas: React.FC<{w: number; h: number; draw: (c: CanvasRenderingContext2D, W: number, H: number) => void; style?: React.CSSProperties}> = ({
  w,
  h,
  draw,
  style,
}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useLayoutEffect(() => {
    const c = ref.current?.getContext('2d');
    if (c) draw(c, w, h);
  });
  return <canvas ref={ref} width={w} height={h} style={style} />;
};

export const Pill: React.FC<{text: string; color: string; textColor?: string; size?: number}> = ({text, color, textColor = '#fff', size = 44}) => (
  <div
    style={{
      display: 'inline-block',
      background: color,
      color: textColor,
      fontFamily: W.font,
      fontWeight: 600,
      fontSize: size,
      padding: `${size * 0.4}px ${size * 0.8}px`,
      borderRadius: 999,
      boxShadow: '0 20px 50px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,255,255,.35)',
      whiteSpace: 'nowrap',
    }}
  >
    {text}
  </div>
);
