import React from 'react';
import {P} from './kit';

/** vintage saloon car, engraved line-art style */
export const Car: React.FC<{w: number; color?: string; draw?: number}> = ({w, color = P.ink, draw = 1}) => {
  const dash = 2600;
  const sp = {fill: 'none', stroke: color, strokeWidth: 5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeDasharray: dash, strokeDashoffset: dash * (1 - draw)};
  return (
    <svg width={w} height={w * 0.42} viewBox="0 0 600 250">
      {/* body */}
      <path {...sp} d="M40 175 L40 140 Q42 118 70 112 L150 100 Q185 62 230 52 L370 50 Q420 52 452 96 L530 108 Q565 114 566 140 L566 175" />
      <path {...sp} d="M40 175 L95 175 M175 175 L430 175 M510 175 L566 175" />
      {/* windows */}
      <path {...sp} d="M178 100 Q205 70 238 64 L298 64 L298 100 Z" />
      <path {...sp} d="M314 64 L368 64 Q400 66 424 100 L314 100 Z" />
      {/* trim + grille + lamp */}
      <path {...sp} strokeWidth={3} d="M60 140 L548 140 M548 122 L548 160 M540 122 L540 160 M60 128 Q70 120 84 122" />
      {/* wheels */}
      {[135, 470].map((x) => (
        <g key={x}>
          <circle {...sp} cx={x} cy={175} r={40} />
          <circle {...sp} strokeWidth={3} cx={x} cy={175} r={18} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} {...sp} strokeWidth={2} x1={x} y1={175} x2={x + Math.cos((i * Math.PI) / 3) * 18} y2={175 + Math.sin((i * Math.PI) / 3) * 18} />
          ))}
        </g>
      ))}
      {/* engraving hatch on the body */}
      {draw > 0.9 &&
        new Array(14).fill(0).map((_, i) => <line key={i} x1={190 + i * 22} y1={150} x2={205 + i * 22} y2={168} stroke={color} strokeWidth={1.4} opacity={0.5} />)}
      <line x1={0} y1={218} x2={600} y2={218} stroke={color} strokeWidth={2} strokeDasharray="10 8" opacity={0.6} />
    </svg>
  );
};

/** analog wall clock with a ticking second hand (one tick per second) */
export const Clock: React.FC<{size: number; f: number; color?: string; face?: string}> = ({size, f, color = P.ink, face = P.paper}) => {
  const sec = Math.floor(f / 30);
  const tick = Math.min(1, (f % 30) / 4); // quick snap
  const sa = (sec + tick) * 6;
  return (
    <svg width={size} height={size} viewBox="-100 -100 200 200">
      <circle r={94} fill={face} stroke={color} strokeWidth={6} />
      <circle r={86} fill="none" stroke={color} strokeWidth={1.5} />
      {new Array(60).fill(0).map((_, i) => {
        const a = (i * Math.PI) / 30;
        const L = i % 5 === 0 ? 12 : 5;
        return <line key={i} x1={Math.sin(a) * 80} y1={-Math.cos(a) * 80} x2={Math.sin(a) * (80 - L)} y2={-Math.cos(a) * (80 - L)} stroke={color} strokeWidth={i % 5 === 0 ? 3.5 : 1.5} />;
      })}
      {[12, 3, 6, 9].map((n) => {
        const a = ((n % 12) * Math.PI) / 6;
        return (
          <text key={n} x={Math.sin(a) * 56} y={-Math.cos(a) * 56 + 8} textAnchor="middle" fontFamily="Playfair Display" fontWeight={700} fontSize={22} fill={color}>
            {n}
          </text>
        );
      })}
      <line x1={0} y1={0} x2={Math.sin(Math.PI * 1.7) * 42} y2={-Math.cos(Math.PI * 1.7) * 42} stroke={color} strokeWidth={6} strokeLinecap="round" />
      <line x1={0} y1={0} x2={Math.sin(Math.PI * 0.35) * 64} y2={-Math.cos(Math.PI * 0.35) * 64} stroke={color} strokeWidth={4} strokeLinecap="round" />
      <line x1={-Math.sin((sa * Math.PI) / 180) * 16} y1={Math.cos((sa * Math.PI) / 180) * 16} x2={Math.sin((sa * Math.PI) / 180) * 74} y2={-Math.cos((sa * Math.PI) / 180) * 74} stroke={P.red} strokeWidth={2.5} strokeLinecap="round" />
      <circle r={6} fill={P.red} />
    </svg>
  );
};

/** speedometer gauge, needle in mph */
export const Speedo: React.FC<{size: number; mph: number; color?: string}> = ({size, mph, color = P.ink}) => {
  const a = (-120 + (mph / 100) * 240) * (Math.PI / 180);
  return (
    <svg width={size} height={size * 0.72} viewBox="-100 -100 200 144">
      <path d="M -86 50 A 100 100 0 1 1 86 50" fill="none" stroke={color} strokeWidth={4} transform="scale(.9)" />
      {new Array(11).fill(0).map((_, i) => {
        const t = (-120 + i * 24) * (Math.PI / 180);
        return (
          <g key={i}>
            <line x1={Math.sin(t) * 82} y1={-Math.cos(t) * 82} x2={Math.sin(t) * 70} y2={-Math.cos(t) * 70} stroke={color} strokeWidth={3} />
            {i % 2 === 0 && (
              <text x={Math.sin(t) * 56} y={-Math.cos(t) * 56 + 6} textAnchor="middle" fontFamily="Space Grotesk" fontWeight={700} fontSize={14} fill={color}>
                {i * 10}
              </text>
            )}
          </g>
        );
      })}
      <line x1={0} y1={0} x2={Math.sin(a) * 74} y2={-Math.cos(a) * 74} stroke={P.red} strokeWidth={4} strokeLinecap="round" />
      <circle r={7} fill={color} />
      <text x={0} y={34} textAnchor="middle" fontFamily="Space Grotesk" fontSize={13} letterSpacing={2} fill={color}>
        MPH
      </text>
    </svg>
  );
};

/** cheesy "sale sticker" starburst used for the empty buzzwords */
export const Burst: React.FC<{size: number; fill: string; children: React.ReactNode; rot?: number}> = ({size, fill, children, rot = 0}) => {
  const pts = new Array(32)
    .fill(0)
    .map((_, i) => {
      const r = i % 2 ? 0.82 : 1;
      const a = (i / 32) * Math.PI * 2;
      return `${50 + Math.cos(a) * 50 * r},${50 + Math.sin(a) * 50 * r}`;
    })
    .join(' ');
  return (
    <div style={{position: 'relative', width: size, height: size, transform: `rotate(${rot}deg)`}}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0, filter: 'drop-shadow(0 10px 16px rgba(60,40,10,.25))'}}>
        <polygon points={pts} fill={fill} stroke={P.ink} strokeWidth={1.6} />
      </svg>
      <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: size * 0.14, fontFamily: P.serif, fontWeight: 900, fontStyle: 'italic', fontSize: size * 0.15, lineHeight: 1, color: P.ink}}>
        {children}
      </div>
    </div>
  );
};
