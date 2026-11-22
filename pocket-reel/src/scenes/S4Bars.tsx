import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, clamp, inOut} from '../common';

const TOPS = [C.orange, '#38b6f5', C.purple, C.yellow, C.pink];
const BOTS = [C.green, C.purple, C.cyan, C.orange, C.purple];

export const S4Bars: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      {TOPS.map((top, i) => {
        const d = i * 2;
        const inY = interpolate(f - d, [0, 10], [-100, 0], {...clamp, easing: inOut});
        const outY = interpolate(f - d, [24, 34], [0, 100], {...clamp, easing: inOut});
        const split = interpolate(f - d, [4, 22], [20, 100], clamp);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: `${i * 20}%`,
              width: '20.2%',
              height: '100%',
              transform: `translateY(${inY + outY}%)`,
              background: `linear-gradient(180deg, ${top} 0%, ${top} ${split - 6}%, ${BOTS[i]} ${split + 6}%, ${BOTS[i]} 100%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
