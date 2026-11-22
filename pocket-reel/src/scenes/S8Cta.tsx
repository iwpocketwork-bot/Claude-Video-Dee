import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, clamp, FONT, p, Stage} from '../common';

const TEXT = 'Hubungi Kami';

export const S8Cta: React.FC = () => {
  const f = useCurrentFrame();
  const blob = p(f, 0, 16);
  const settle = p(f, 4, 22);
  const warp = 1 - settle;
  const r = interpolate(blob, [0, 1], [0, 2700]);
  const wob = (k: number) => 50 + Math.sin(f / 3 + k) * 12 * (1 - settle);
  const bokeh = p(f, 34, 48);
  const gx = (f * 4) % 200;

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: '#1b1c20'}} />
      <Stage>
      {/* expanding white liquid */}
      <div
        style={{
          position: 'absolute',
          left: 540 - r / 2,
          top: 960 - r / 2,
          width: r,
          height: r,
          background: C.light,
          borderRadius: `${wob(0)}% ${wob(1)}% ${wob(2)}% ${wob(3)}% / ${wob(4)}% ${wob(5)}% ${wob(6)}% ${wob(7)}%`,
          boxShadow: `0 0 120px 60px ${C.orange}66`,
        }}
      />
      {/* pill */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 960,
          transform: `translate(-50%,-50%) scale(${0.7 + settle * 0.3})`,
          width: 860,
          height: 200,
          borderRadius: 100,
          background: '#fff',
          boxShadow: '0 40px 60px rgba(0,0,0,.18)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -40 + warp * 300,
            top: -20,
            width: 300 + warp * 400,
            height: 240,
            borderRadius: 120,
            background: `linear-gradient(90deg, #6aa8ff ${gx / 4}%, ${C.purple}, ${C.orange})`,
            filter: 'blur(14px)',
            opacity: 0.85,
          }}
        />
        <div style={{position: 'relative', fontFamily: FONT, fontWeight: 800, fontSize: 84, color: C.ink, display: 'flex'}}>
          {TEXT.split('').map((ch, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                transform: `translateY(${Math.sin(i * 0.7 + f / 2) * 30 * warp}px) rotate(${Math.cos(i * 0.6) * 18 * warp}deg)`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
      <svg width="54" height="60" viewBox="0 0 24 26" style={{position: 'absolute', left: 600, top: interpolate(f, [8, 22], [1200, 990], clamp)}}>
        <path d="M2 2 L2 21 L7.5 16 L11 24 L14.5 22.5 L11 15 L18 15 Z" fill={C.ink} stroke="#fff" strokeWidth="1.4" />
      </svg>
      {/* bokeh exit */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 540 + (i - 1) * 140 - 1400 * bokeh,
            top: 960 + (i === 1 ? -120 : 60) - 1400 * bokeh,
            width: 2800 * bokeh,
            height: 2800 * bokeh,
            borderRadius: '50%',
            background: [C.orange, '#ff9a6b', '#e8553a'][i],
            opacity: 0.85,
            filter: 'blur(30px)',
          }}
        />
      ))}
      </Stage>
    </AbsoluteFill>
  );
};
