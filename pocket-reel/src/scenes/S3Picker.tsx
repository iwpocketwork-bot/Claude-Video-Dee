import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, clamp, FONT, GridBg, p, PlayIcon} from '../common';

const ITEMS = ['Video Production', 'Mobilegraphy', 'Photography', 'Graphic Design', 'Advertising', 'Event Coverage', 'Training Programs'];
const STEPS = [12, 26, 40, 54, 68, 82];

export const S3Picker: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const active = STEPS.reduce((acc, s) => acc + spring({frame: f - s, fps, config: {damping: 16, stiffness: 140}}), 0);
  const pillIn = spring({frame: f - 2, fps, config: {damping: 12}});
  const blue = 1 - p(f, 10, 18);
  const inBlur = interpolate(f, [0, 10], [30, 0], clamp);
  const titleIn = spring({frame: f - 4, fps, config: {damping: 14}});

  return (
    <AbsoluteFill style={{filter: `blur(${inBlur}px)`}}>
      <GridBg dark={false} />
      <div
        style={{
          position: 'absolute',
          top: 300,
          width: '100%',
          textAlign: 'center',
          fontFamily: FONT,
          color: C.ink,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 60}px)`,
        }}
      >
        <div style={{fontSize: 44, fontWeight: 600, color: '#888'}}>Apa yang kami buat?</div>
        <div style={{fontSize: 72, fontWeight: 900, letterSpacing: -2}}>Semua di bawah satu bumbung.</div>
      </div>

      <AbsoluteFill style={{perspective: 1400, justifyContent: 'center', alignItems: 'center'}}>
        {/* selection pill */}
        <div
          style={{
            position: 'absolute',
            width: 880,
            height: 168,
            borderRadius: 84,
            background: `rgba(${Math.round(interpolate(blue, [0, 1], [255, 108]))},${Math.round(interpolate(blue, [0, 1], [255, 160]))},255,1)`,
            boxShadow: '0 30px 60px rgba(0,0,0,.14), 0 4px 12px rgba(0,0,0,.08)',
            transform: `scale(${pillIn})`,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 22,
              top: 22,
              width: 124,
              height: 124,
              borderRadius: 62,
              background: '#fff',
              border: `5px solid ${blue > 0.5 ? '#fff' : '#3d7bff'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{transform: `rotate(${active * 90}deg)`, display: 'flex'}}>
              <PlayIcon size={60} color={C.orange} />
            </div>
          </div>
        </div>
        {ITEMS.map((t, i) => {
          const d = i - active;
          const ad = Math.abs(d);
          return (
            <div
              key={t}
              style={{
                position: 'absolute',
                left: 290,
                fontFamily: FONT,
                fontSize: 64,
                fontWeight: ad < 0.5 ? 800 : 600,
                color: C.ink,
                whiteSpace: 'nowrap',
                transform: `translateY(${d * 175}px) rotateX(${-d * 32}deg) scale(${1 - Math.min(ad, 3) * 0.08})`,
                opacity: interpolate(ad, [0, 1, 2.6], [1, 0.32, 0], clamp) * pillIn,
                filter: `blur(${Math.min(ad, 2) * 1.6}px)`,
                transformOrigin: 'left center',
              }}
            >
              {t}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
