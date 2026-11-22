import React from 'react';
import {AbsoluteFill, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, Cursor, DarkBg, FONT, p} from '../common';

const SLICES = 8;
const WM_W = 700;
const WM_H = Math.round(WM_W * (389 / 1288));
const WM_X = 540 - WM_W / 2;
const WM_Y = 760;

export const S1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // orange block that flies in & collapses (like reference)
  const blockP = p(f, 0, 12);
  // scan lines
  const scan = p(f, 0, 14);
  // halftone ring
  const ring = p(f, 14, 36);
  // cursor
  const cur = p(f, 26, 46);
  const click = spring({frame: f - 48, fps, config: {damping: 10}});
  // sub pill
  const pill = spring({frame: f - 38, fps, config: {damping: 14}});
  // exit
  const ex = p(f, 68, 78);

  return (
    <AbsoluteFill>
      <DarkBg />
      <AbsoluteFill
        style={{
          transform: `scale(${1 + ex * 0.6})`,
          filter: `blur(${ex * 18}px)`,
          opacity: 1 - ex,
        }}
      >
        {/* scan lines */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 760 + (1 - scan) * -300, height: 3, background: C.cyan, opacity: 1 - p(f, 14, 22), boxShadow: `0 0 20px ${C.cyan}`}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 1160 + (1 - scan) * 300, height: 3, background: C.cyan, opacity: 1 - p(f, 14, 22), boxShadow: `0 0 20px ${C.cyan}`}} />

        {/* halftone ring */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 520,
            top: 960 - 520,
            width: 1040,
            height: 1040,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #b8e04a 3px, transparent 3.6px)',
            backgroundSize: '18px 18px',
            WebkitMaskImage: 'radial-gradient(circle, transparent 42%, #000 45%, #000 68%, transparent 71%)',
            transform: `scale(${0.3 + ring * 1.3})`,
            opacity: Math.sin(ring * Math.PI) * 0.8,
          }}
        />

        {/* flying orange block */}
        <div
          style={{
            position: 'absolute',
            left: 540 - 220,
            top: 700,
            width: 440,
            height: 300,
            background: C.orange,
            borderRadius: 18,
            transform: `translate(${(1 - blockP) * 500}px, ${blockP * 120}px) scale(${1 - blockP}) rotate(${blockP * -30}deg)`,
            filter: `blur(${(1 - blockP) * 14}px)`,
            opacity: 1 - p(f, 9, 13),
          }}
        />

        {/* real flame icon */}
        <Img
          src={staticFile('icon-white.png')}
          style={{
            position: 'absolute',
            left: 540 - 59,
            top: 560,
            height: 180,
            transform: `scale(${spring({frame: f - 18, fps, config: {damping: 9, stiffness: 160}})}) rotate(${(1 - spring({frame: f - 18, fps, config: {damping: 9}})) * -40}deg)`,
            filter: `drop-shadow(0 0 30px ${C.orange}aa)`,
          }}
        />
        {/* real wordmark, assembled from glitch slices */}
        {new Array(SLICES).fill(0).map((_, k) => {
          const order = k % 2 === 0 ? k / 2 : SLICES - 1 - (k - 1) / 2;
          const s = spring({frame: f - 4 - order * 2, fps, config: {damping: 15, stiffness: 190}});
          const dir = k % 2 === 0 ? -1 : 1;
          const sh = WM_H / SLICES;
          const split = (1 - s) * 16 + Math.max(0, 1 - Math.abs(f - 26) / 3) * 8;
          return (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: WM_X,
                top: WM_Y + k * sh,
                width: WM_W,
                height: sh + 1,
                backgroundImage: `url(${staticFile('wordmark-white.png')})`,
                backgroundSize: `${WM_W}px ${WM_H}px`,
                backgroundPosition: `0 ${-k * sh}px`,
                opacity: s > 0.01 ? 1 : 0,
                transform: `translateX(${dir * (1 - s) * 900}px) skewX(${dir * (1 - s) * -25}deg)`,
                filter: `blur(${(1 - s) * 10}px) drop-shadow(${split}px 0 0 rgba(255,40,90,.8)) drop-shadow(${-split}px 0 0 rgba(40,220,255,.8))`,
              }}
            />
          );
        })}
        {/* design-tool selection box around the logo */}
        {(() => {
          const b = p(f, 24, 34);
          const bx = WM_X - 24;
          const by = WM_Y - 24;
          const bw = WM_W + 48;
          const bh = WM_H + 48;
          return (
            <div style={{position: 'absolute', left: bx, top: by, width: bw, height: bh, opacity: b}}>
              <div style={{position: 'absolute', inset: 0, border: `3px solid ${C.cyan}`, clipPath: `inset(0 ${(1 - b) * 100}% 0 0)`, boxShadow: `0 0 24px ${C.cyan}66`}} />
              {[[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], i) => (
                <div key={i} style={{position: 'absolute', left: cx * bw - 10, top: cy * bh - 10, width: 20, height: 20, background: '#fff', border: `3px solid ${C.cyan}`}} />
              ))}
              <div style={{position: 'absolute', left: 0, top: -44, color: '#9aa', fontFamily: FONT, fontSize: 24, fontWeight: 600}}>Logo</div>
              <div style={{position: 'absolute', left: '50%', bottom: -50, transform: 'translateX(-50%)', background: '#2d8cff', color: '#fff', fontFamily: FONT, fontSize: 22, fontWeight: 600, padding: '3px 12px', borderRadius: 6}}>
                {WM_W} × {WM_H}
              </div>
            </div>
          );
        })()}

        {/* sub pill */}
        <div
          style={{
            position: 'absolute',
            top: 1080,
            left: '50%',
            transform: `translateX(-50%) scale(${pill})`,
            background: 'rgba(255,255,255,.08)',
            border: '2px solid rgba(255,255,255,.2)',
            borderRadius: 60,
            padding: '18px 40px',
            color: '#fff',
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 40,
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span style={{width: 18, height: 18, borderRadius: 9, background: C.green, boxShadow: `0 0 14px ${C.green}`}} />
          Production · Training · Mobilegraphy
        </div>

        <Cursor x={interpolate(cur, [0, 1], [1000, 620])} y={interpolate(cur, [0, 1], [1600, 900])} label="Pocket" scale={1 - Math.sin(click * Math.PI) * 0.15} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
