import React from 'react';
import {AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, Cursor, FONT, GridBg, p} from '../common';

const TW = 680;
const X0 = 540 - TW / 2;
const LH = Math.round(TW * (403 / 1538));
const LY = 960 - LH / 2;

export const S7Handwrite: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inn = p(f, 0, 8);
  const draw = interpolate(f, [2, 42], [0, 1], clamp);
  const fill = p(f, 40, 54);
  const under = p(f, 44, 58);
  const btn = spring({frame: f - 58, fps, config: {damping: 10, stiffness: 180}});
  const penX = X0 + draw * TW;
  const penY = 960 + Math.sin(draw * 30) * 70;
  const hue = 320 + draw * 200;
  const sweep = p(f, 52, 66);

  return (
    <AbsoluteFill style={{opacity: inn}}>
      <GridBg />
      <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', fontFamily: FONT, color: '#aaa', fontSize: 46, fontWeight: 600, opacity: p(f, 6, 18)}}>
        6 tahun pengalaman
      </div>
      <svg width="1080" height="1920" style={{position: 'absolute'}}>
        <defs>
          <clipPath id="rev">
            <rect x={0} y={0} width={penX + 20} height={1920} />
          </clipPath>
          <filter id="glow">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* ghost of the real logo, then revealed by the glowing pen */}
        <g opacity={1 - btn}>
        <image href={staticFile('logo-white.png')} x={X0} y={LY} width={TW} height={LH} opacity={0.1} />
        <g clipPath="url(#rev)">
          <image href={staticFile('logo-white.png')} x={X0} y={LY} width={TW} height={LH} />
        </g>
        <image href={staticFile('logo-white.png')} x={X0} y={LY} width={TW} height={LH} opacity={Math.sin(fill * Math.PI) * 0.8} filter="url(#glow)" />
        </g>
        <path
          d="M 170 1090 Q 540 1150 910 1060"
          fill="none"
          stroke="#fff"
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={1100}
          strokeDashoffset={1100 * (1 - under)}
        />
        {draw < 1 && draw > 0 && <circle cx={penX} cy={penY} r={26} fill={`hsl(${hue},90%,65%)`} opacity={0.85} filter="url(#glow)" />}
      </svg>
      {/* orange glow sweep */}
      <div
        style={{
          position: 'absolute',
          left: interpolate(sweep, [0, 1], [-300, 1100]),
          top: 880,
          width: 40,
          height: 300,
          background: C.orange,
          filter: 'blur(18px)',
          opacity: Math.sin(sweep * Math.PI),
          boxShadow: `0 0 200px 120px ${C.orange}55`,
        }}
      />
      {draw < 1 ? (
        <Cursor x={penX + 10} y={penY + 10} label="Pocket" color={C.pink} scale={0.8} />
      ) : (
        <Cursor x={interpolate(f, [46, 60], [penX + 10, 600], clamp)} y={interpolate(f, [46, 60], [penY + 10, 1010], clamp)} label="Pocket" color={C.pink} scale={0.8} />
      )}
      {/* CTA button pops */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 960,
          transform: `translate(-50%,-50%) scale(${btn})`,
          width: TW,
          height: LH,
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: C.lime,
          color: C.dark,
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 76,
          borderRadius: 40,
          boxShadow: `0 0 120px 40px ${C.lime}66`,
          whiteSpace: 'nowrap',
        }}
      >
        Hubungi Kami
      </div>
    </AbsoluteFill>
  );
};
