import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, Cursor, FONT, GridBg, inOut, p, useWide} from '../common';

const STEPS = [
  {t: 'Konsultasi', icon: 'M4 5 h16 v11 h-9 l-5 4 v-4 h-2 Z'},
  {t: 'Perancangan', icon: 'M4 20 L4 16 L15 5 L19 9 L8 20 Z'},
  {t: 'Pelaksanaan', icon: 'M3 7 h12 v10 h-12 Z M15 10 L21 7 L21 17 L15 14 Z'},
  {t: 'Penghantaran', icon: 'M3 11 L21 3 L13 21 L11 13 Z'},
];

export const S6Process: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: f, fps, config: {damping: 12, stiffness: 170}});
  const expand = p(f, 10, 26, inOut);
  const barW = interpolate(expand, [0, 1], [190, 960]);
  const head = spring({frame: f - 16, fps, config: {damping: 14}});
  // cursor visits each step
  const visit = [28, 40, 52, 64];
  const idx = visit.filter((v) => f >= v).length - 1;
  const wide = useWide();
  const CXc = wide ? 960 : 540;
  const stepX = (i: number) => 60 + 120 + i * 230 - 480 + CXc; // absolute x of item centre
  const curT = interpolate(f, [24, ...visit], [0, 0, 1, 2, 3], clamp);
  const curX = interpolate(curT, [0, 1, 2, 3], [stepX(0), stepX(1), stepX(2), stepX(3)]) + 10;
  const tilt = p(f, 30, 84, inOut);
  const ex = p(f, 74, 85);

  return (
    <AbsoluteFill style={{opacity: 1 - ex}}>
      <GridBg />
      <div style={{position: 'absolute', top: wide ? 130 : 430, width: '100%', textAlign: 'center', fontFamily: FONT, color: '#fff', opacity: head, transform: `translateY(${(1 - head) * 50}px)`}}>
        <div style={{fontSize: 64, fontWeight: 600, color: '#bbb'}}>Dari idea ke hasil —</div>
        <div style={{fontSize: 100, fontWeight: 900, letterSpacing: -2}}>
          kami urus <span style={{color: C.lime}}>semua.</span>
        </div>
      </div>
      <AbsoluteFill style={{perspective: 1600}}>
        <AbsoluteFill
          style={{
            transform: `rotateX(${tilt * 18}deg) rotateY(${tilt * -16}deg) scale(${pop * (1 + tilt * 0.12)})`,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: barW,
              height: 190,
              background: '#fff',
              borderRadius: 44,
              boxShadow: '0 40px 80px rgba(0,0,0,.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: expand < 0.2 ? 'center' : 'space-around',
              overflow: 'hidden',
              padding: '0 20px',
              marginTop: 160,
            }}
          >
            {STEPS.map((s, i) => {
              const show = i === 0 ? 1 : p(f, 14 + i * 3, 24 + i * 3);
              const on = i === idx;
              const clk = spring({frame: f - visit[i], fps, config: {damping: 9}});
              return (
                <div
                  key={s.t}
                  style={{
                    display: show < 0.01 ? 'none' : 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    opacity: show,
                    transform: `scale(${0.6 + show * 0.4 - (f >= visit[i] ? Math.sin(clk * Math.PI) * 0.08 : 0)})`,
                  }}
                >
                  <div
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 28,
                      background: on || (i === 0 && f < 24) ? C.orange : '#f1f1f3',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <svg width="58" height="58" viewBox="0 0 24 24" fill="none" stroke={on || (i === 0 && f < 24) ? '#fff' : C.ink} strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round">
                      <path d={s.icon} />
                    </svg>
                  </div>
                  {expand > 0.6 && <div style={{fontFamily: FONT, fontWeight: 800, fontSize: 26, color: C.ink, opacity: p(f, 22, 30)}}>{s.t}</div>}
                </div>
              );
            })}
          </div>
          <div style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%'}}>
            {f > 24 && <Cursor x={curX} y={wide ? 630 : 1050} color={C.ink} />}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
