import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {RoundedBox} from '@react-three/drei';
import {C, clamp, DarkBg, FONT, p, PAL} from '../common';

const Cubes: React.FC = () => {
  const f = useCurrentFrame();
  const cubes = useMemo(
    () =>
      new Array(22).fill(0).map((_, i) => ({
        x: (random(`cx${i}`) - 0.5) * 9,
        y: (random(`cy${i}`) - 0.5) * 15,
        z: -random(`cz${i}`) * 10 - 1,
        r: random(`r${i}`) * 6,
        sp: 0.5 + random(`s${i}`),
        color: PAL[i % PAL.length],
        size: 0.55 + random(`sz${i}`) * 0.8,
        orb: random(`o${i}`) > 0.78,
      })),
    [],
  );
  const intro = p(f, 0, 25);
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 6]} intensity={2.4} />
      <pointLight position={[-6, -4, 4]} intensity={60} color={C.cyan} />
      <pointLight position={[6, -2, 3]} intensity={50} color={C.pink} />
      {cubes.map((c, i) => {
        const pos: [number, number, number] = [
          c.x * (0.4 + intro * 0.6),
          c.y * (0.4 + intro * 0.6) + Math.sin(f / 18 + i) * 0.25,
          c.z + f * 0.045 * c.sp,
        ];
        const rot: [number, number, number] = [c.r + f * 0.03 * c.sp, c.r * 1.3 + f * 0.035, c.r * 0.5];
        return c.orb ? (
          <mesh key={i} position={pos}>
            <sphereGeometry args={[c.size * 0.25, 24, 24]} />
            <meshBasicMaterial color="#fff" />
          </mesh>
        ) : (
          <RoundedBox key={i} args={[c.size, c.size, c.size]} radius={0.14} smoothness={4} position={pos} rotation={rot}>
            <meshStandardMaterial color={c.color} roughness={0.3} metalness={0.15} />
          </RoundedBox>
        );
      })}
    </>
  );
};

const Word: React.FC<{text: string; delay: number; style: React.CSSProperties}> = ({text, delay, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 14, stiffness: 160}});
  const split = interpolate(f - delay, [0, 18], [14, 3], clamp);
  return (
    <div
      style={{
        ...style,
        transform: `translateY(${(1 - s) * 120}px) scale(${0.7 + s * 0.3})`,
        opacity: s,
        filter: `blur(${(1 - s) * 12}px)`,
        textShadow: `-${split}px 0 rgba(255,40,90,.85), ${split}px 0 rgba(40,220,255,.85)`,
      }}
    >
      {text}
    </div>
  );
};

export const S2Cubes: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const flash = p(f, 80, 92);
  const inn = p(f, 0, 5);
  return (
    <AbsoluteFill>
      <DarkBg />
      <AbsoluteFill
        style={{
          filter: `drop-shadow(7px 0 0 rgba(255,40,90,.45)) drop-shadow(-7px 0 0 rgba(40,220,255,.45)) blur(${flash * 10}px)`,
          opacity: inn,
        }}
      >
        <ThreeCanvas width={width} height={height} camera={{fov: 55, position: [0, 0, 8]}}>
          <Cubes />
        </ThreeCanvas>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', color: '#fff', fontFamily: FONT}}>
        <div style={{background: 'radial-gradient(ellipse, rgba(13,14,19,.75) 0%, transparent 70%)', padding: '80px 40px'}}>
          <Word text="Bisnes anda" delay={3} style={{fontSize: 86, fontWeight: 600}} />
          <Word text="perlukan" delay={8} style={{fontSize: 86, fontWeight: 600}} />
          <Word text="CONTENT" delay={13} style={{fontSize: 178, fontWeight: 900, lineHeight: 1.05, letterSpacing: -4}} />
          <Word text="yang menjual." delay={22} style={{fontSize: 96, fontWeight: 800, color: C.lime}} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: '#fff', opacity: flash}} />
    </AbsoluteFill>
  );
};
