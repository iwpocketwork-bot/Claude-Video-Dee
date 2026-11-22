import React, {useEffect, useMemo, useState} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, continueRender, delayRender, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {C, DarkBg, FONT, p, useWide} from '../common';

// Logo sebenar diekstrud jadi 3D: banyak lapisan tekstur logo disusun ke belakang.
const LAYERS = 26;
const DEPTH = 0.012;
const LW = 3.4; // ~700px bila menghadap kamera
const LH = LW * (403 / 1538);

const useTexture = (src: string) => {
  const [handle] = useState(() => delayRender('logo texture'));
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    new THREE.TextureLoader().load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
      continueRender(handle);
    });
  }, [src, handle]);
  return tex;
};

const Logo3D: React.FC = () => {
  const f = useCurrentFrame();
  const wideL = useWide();
  const {fps} = useVideoConfig();
  const tex = useTexture(staticFile('logo-white.png'));
  const s = spring({frame: f - 4, fps, config: {damping: 13, stiffness: 90}});
  const ry = (1 - s) * Math.PI * 1.5 + Math.sin(f / 26) * 0.28;
  const rx = 0.12 + Math.sin(f / 33) * 0.06;
  const conf = useMemo(
    () =>
      new Array(26).fill(0).map((_, i) => ({
        x: (random(`ex${i}`) - 0.5) * 8,
        y: (random(`ey${i}`) - 0.5) * 12,
        z: (random(`ez${i}`) - 0.5) * 4 - 2,
        c: [C.lime, C.orange, C.cyan, '#ffffff', C.pink][i % 5],
        k: i % 3,
        s: 0.1 + random(`es${i}`) * 0.16,
      })),
    [],
  );
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 6]} intensity={2.6} />
      <pointLight position={[-4, 2, 3]} intensity={50} color={C.lime} />
      <group position={wideL ? [-1.85, 0.2, 0] : [0, 2.55, 0]} rotation={[rx, ry, 0]} scale={(0.4 + s * 0.6) * (wideL ? 1.3 : 1)}>
        {tex &&
          new Array(LAYERS).fill(0).map((_, i) => {
            const t = i / (LAYERS - 1);
            const col = i === 0 ? new THREE.Color('#ffffff') : new THREE.Color(C.lime).lerp(new THREE.Color('#2a2d22'), t);
            return (
              <mesh key={i} position={[0, 0, -i * DEPTH]}>
                <planeGeometry args={[LW, LH]} />
                <meshBasicMaterial map={tex} color={col} alphaTest={0.5} side={THREE.DoubleSide} toneMapped={false} />
              </mesh>
            );
          })}
      </group>
      {conf.map((o, i) => {
        const a = spring({frame: f - 6 - i, fps, config: {damping: 13}});
        return (
          <mesh key={i} position={[o.x * a, o.y * a + Math.sin(f / 14 + i) * 0.15, o.z]} rotation={[f * 0.04 + i, f * 0.05, i]} scale={o.s * a}>
            {o.k === 0 ? <tetrahedronGeometry args={[1, 0]} /> : o.k === 1 ? <octahedronGeometry args={[1, 0]} /> : <boxGeometry args={[1.2, 1.2, 0.2]} />}
            <meshStandardMaterial color={o.c} flatShading roughness={0.4} />
          </mesh>
        );
      })}
    </>
  );
};

const Pop: React.FC<{delay: number; children: React.ReactNode; style?: React.CSSProperties}> = ({delay, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 13, stiffness: 150}});
  return <div style={{...style, opacity: s, transform: `translateY(${(1 - s) * 70}px)`, filter: `blur(${(1 - s) * 10}px)`}}>{children}</div>;
};

const WaIcon: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
    <path d="M3.5 20.5 L5 16 A8.5 8.5 0 1 1 8.2 19.2 Z" />
    <path d="M9 8.5 c0 3.5 3 6.5 6.5 6.5 l1-1.6 -2.2-1.1 -1 1 c-1.2-.5-2.1-1.4-2.6-2.6 l1-1 -1.1-2.2 Z" fill={color} strokeWidth="1" />
  </svg>
);

export const S9End: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const cover = 1 - p(f, 0, 12);
  const pulse = 1 + Math.sin(Math.max(0, f - 70) / 5) * 0.035;
  const btn = spring({frame: f - 50, fps, config: {damping: 10}});
  const num = spring({frame: f - 60, fps, config: {damping: 12}});
  const shine = ((f - 70) % 60) / 60;
  const wide = useWide();
  return (
    <AbsoluteFill>
      <DarkBg speed={2} />
      <ThreeCanvas width={width} height={height} camera={{fov: 50, position: [0, 0, 10]}}>
        <Logo3D />
      </ThreeCanvas>
      <div style={{position: 'absolute', top: wide ? 110 : 760, left: wide ? 930 : 0, width: wide ? 940 : '100%', textAlign: 'center', fontFamily: FONT, color: '#fff'}}>
        <Pop delay={14} style={{fontSize: 58, fontWeight: 600}}>
          Hubungi kami untuk bantu
        </Pop>
        <Pop delay={18} style={{fontSize: 58, fontWeight: 600}}>
          bisnes anda
        </Pop>
        <div style={{fontSize: 120, fontWeight: 900, lineHeight: 1.15}}>
          <Pop delay={22} style={{color: '#fff'}}>
            BERKEMBANG
          </Pop>
        </div>
        <Pop delay={36} style={{fontWeight: 600, fontSize: 44, color: C.lime, marginTop: 8}}>
          Production & Latihan Creative Content
        </Pop>

        {/* WhatsApp CTA */}
        <div
          style={{
            margin: wide ? '36px auto 0' : '64px auto 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 700,
            boxSizing: 'border-box',
            gap: 22,
            background: C.lime,
            color: C.dark,
            fontWeight: 800,
            fontSize: 52,
            padding: '30px 0',
            borderRadius: 80,
            transform: `scale(${btn * pulse})`,
            boxShadow: `0 0 90px ${C.lime}66`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <WaIcon size={60} color={C.dark} />
          WhatsApp Dee
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: 120,
              left: `${-30 + shine * 160}%`,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent)',
              transform: 'skewX(-20deg)',
              opacity: f > 70 ? 1 : 0,
            }}
          />
        </div>
        <div
          style={{
            marginTop: wide ? 18 : 34,
            fontSize: 92,
            fontWeight: 900,
            letterSpacing: 2,
            opacity: num,
            transform: `scale(${0.6 + num * 0.4})`,
          }}
        >
          011-1620 0864
        </div>
        <Pop delay={72} style={{fontSize: wide ? 34 : 40, fontWeight: 600, marginTop: wide ? 18 : 36, color: '#cfcfcf'}}>
          @pocket_production · pocketproduction.my
        </Pop>
      </div>
      <AbsoluteFill style={{background: C.orange, opacity: cover, filter: 'blur(20px)'}} />
    </AbsoluteFill>
  );
};
