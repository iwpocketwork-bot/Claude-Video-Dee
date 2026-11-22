import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, FONT, p, useWide} from '../common';

// Topik latihan (dari website pocketproduction.my)
const COURSES = [
  {t: 'Mobile Filmmaking', c: C.orange},
  {t: 'Smartphone Photography', c: C.cyan},
  {t: 'Social Media Reels', c: C.pink},
  {t: 'Content Strategy', c: C.purple},
  {t: 'Creative AI', c: C.green},
  {t: 'Digital Marketing', c: C.yellow},
  {t: 'Brand Storytelling', c: C.orange},
  {t: 'Corporate Media Skills', c: C.cyan},
];
const AUD = ['Individu', 'Syarikat', 'Agensi'];
const R = 400;

export const S5bTraining: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const wipe = p(f, 0, 16);
  const ex = p(f, 112, 125);
  const tag = spring({frame: f - 8, fps, config: {damping: 12}});
  const h1 = spring({frame: f - 12, fps, config: {damping: 13}});
  const h2 = spring({frame: f - 18, fps, config: {damping: 11, stiffness: 140}});
  const wide = useWide();
  const spin = interpolate(f, [16, 125], [-120, 70]);

  return (
    <AbsoluteFill style={{opacity: 1 - ex, transform: `scale(${1 + ex * 0.25})`, filter: `blur(${ex * 12}px)`}}>
      <AbsoluteFill
        style={{
          background: C.lime,
          backgroundImage: 'linear-gradient(rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          clipPath: `circle(${wipe * 1500}px at ${wide ? 960 : 540}px ${wide ? 540 : 960}px)`,
        }}
      >
        {/* heading */}
        <div style={{position: 'absolute', top: wide ? 150 : 230, left: wide ? 110 : 0, width: wide ? 760 : '100%', textAlign: wide ? 'left' : 'center', fontFamily: FONT, color: C.dark}}>
          <div
            style={{
              display: 'inline-block',
              background: C.dark,
              color: C.lime,
              fontWeight: 800,
              fontSize: 36,
              letterSpacing: 6,
              padding: '12px 34px',
              borderRadius: 40,
              transform: `scale(${tag})`,
            }}
          >
            TRAINING PROGRAMS
          </div>
          <div style={{fontSize: 92, fontWeight: 900, marginTop: 30, letterSpacing: -2, opacity: h1, transform: `translateY(${(1 - h1) * 60}px)`}}>
            Nak belajar
          </div>
          <div style={{fontSize: 92, fontWeight: 900, letterSpacing: -2, lineHeight: 1, opacity: h1, transform: `translateY(${(1 - h1) * 60}px)`}}>
            buat content
          </div>
          <div style={{fontWeight: 900, fontSize: 92, letterSpacing: -2, lineHeight: 1.1, opacity: h2, transform: `scale(${0.5 + h2 * 0.5}) rotate(${(1 - h2) * -10}deg)`}}>
            sendiri?
          </div>
        </div>

        {/* 3D course carousel */}
        <AbsoluteFill style={{perspective: 1700, perspectiveOrigin: '50% 40%'}}>
          <div
            style={{
              position: 'absolute',
              left: wide ? 1330 : 540,
              top: wide ? 560 : 1060,
              transformStyle: 'preserve-3d',
              transform: `rotateX(-10deg) rotateY(${spin}deg)`,
            }}
          >
            {COURSES.map((c, i) => {
              const ang = (360 / COURSES.length) * i;
              const s = spring({frame: f - 20 - i * 3, fps, config: {damping: 13}});
              const world = (((ang + spin) % 360) + 360) % 360;
              const facing = Math.cos((world * Math.PI) / 180);
              return (
                <div
                  key={c.t}
                  style={{
                    position: 'absolute',
                    width: 340,
                    height: 200,
                    left: -170,
                    top: -100,
                    transform: `rotateY(${ang}deg) translateZ(${R * s}px) translateY(${(1 - s) * 500}px)`,
                    background: C.dark,
                    borderRadius: 28,
                    padding: 24,
                    boxSizing: 'border-box',
                    color: '#fff',
                    fontFamily: FONT,
                    boxShadow: '0 30px 50px rgba(0,0,0,.25)',
                    opacity: s * interpolate(facing, [-1, 0, 1], [0.25, 0.6, 1]),
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                    <div style={{width: 54, height: 54, borderRadius: 14, background: c.c, color: C.dark, fontWeight: 900, fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div style={{fontSize: 22, fontWeight: 600, color: '#999', letterSpacing: 2}}>MODUL</div>
                  </div>
                  <div style={{fontSize: 32, fontWeight: 800, lineHeight: 1.1}}>{c.t}</div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>

        {/* audience + promise */}
        <div style={{position: 'absolute', top: wide ? 700 : 1430, left: wide ? 110 : 0, width: wide ? 760 : '100%', display: 'flex', justifyContent: wide ? 'flex-start' : 'center', gap: 22}}>
          {AUD.map((a, i) => {
            const s = spring({frame: f - 50 - i * 5, fps, config: {damping: 10, stiffness: 170}});
            return (
              <div
                key={a}
                style={{
                  transform: `scale(${s})`,
                  background: '#fff',
                  color: C.dark,
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: 40,
                  padding: '16px 34px',
                  borderRadius: 50,
                  border: `3px solid ${C.dark}`,
                }}
              >
                {a}
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            top: wide ? 830 : 1580,
            left: wide ? 110 : 0,
            width: wide ? 900 : '100%',
            whiteSpace: 'nowrap',
            textAlign: wide ? 'left' : 'center',
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 44,
            color: C.dark,
            opacity: p(f, 66, 80),
            transform: `translateY(${(1 - p(f, 66, 80)) * 40}px)`,
          }}
        >
          Praktikal · Hands-on · Terus guna
        </div>
        <div
          style={{
            position: 'absolute',
            top: wide ? 910 : 1660,
            left: wide ? 110 : '50%',
            width: 560 * p(f, 74, 92),
            transform: wide ? 'none' : 'translateX(-50%)',
            height: 6,
            borderRadius: 3,
            background: C.dark,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
