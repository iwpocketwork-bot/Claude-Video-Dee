import React, {useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {RoundedBox} from '@react-three/drei';
import {C, clamp, DarkBg, FONT, p} from '../common';

const W = 600;
const H = 1280;

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.35);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.65, x, y + s * 0.8, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.65, x + s * 0.5, y + s * 0.35);
  ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.35);
  ctx.fill();
}

function drawScreen(ctx: CanvasRenderingContext2D, f: number) {
  ctx.clearRect(0, 0, W, H);
  ctx.save();
  rr(ctx, 0, 0, W, H, 70);
  ctx.clip();
  // animated gradient "video"
  const g = ctx.createLinearGradient(0, 0, W, H);
  const hue = (f * 1.6) % 360;
  g.addColorStop(0, `hsl(${15 + Math.sin(f / 20) * 10}, 95%, 58%)`);
  g.addColorStop(0.55, `hsl(${280 + Math.sin(f / 25) * 20}, 75%, 55%)`);
  g.addColorStop(1, `hsl(${190 + hue * 0.05}, 85%, 50%)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // blobs
  for (let i = 0; i < 5; i++) {
    const x = W / 2 + Math.sin(f / 22 + i * 1.7) * 200;
    const y = H / 2 + Math.cos(f / 27 + i * 2.1) * 360;
    const rg = ctx.createRadialGradient(x, y, 0, x, y, 220);
    rg.addColorStop(0, 'rgba(255,255,255,.35)');
    rg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);
  }
  // top label
  ctx.fillStyle = '#fff';
  ctx.font = '800 44px Poppins';
  ctx.fillText('Reels', 40, 110);
  // big centre text
  ctx.textAlign = 'center';
  ctx.font = '900 92px Poppins';
  const pop = Math.min(1, Math.max(0, (f - 20) / 10));
  ctx.globalAlpha = pop;
  ctx.fillText('STOP', W / 2, H / 2 - 40);
  ctx.fillText('SCROLL!', W / 2, H / 2 + 60);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';
  // right rail icons
  const likeP = Math.min(1, Math.max(0, (f - 55) / 8));
  const hs = 64 * (1 + Math.sin(likeP * Math.PI) * 0.5);
  ctx.fillStyle = likeP > 0 ? '#ff3b6b' : '#fff';
  heart(ctx, W - 70, 700 - hs / 2, hs);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(W - 70, 860, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(W - 100, 960);
  ctx.lineTo(W - 40, 990);
  ctx.lineTo(W - 100, 1020);
  ctx.closePath();
  ctx.fill();
  // caption
  ctx.font = '800 36px Poppins';
  ctx.fillText('@pocket_production', 40, H - 150);
  ctx.font = '400 28px Poppins';
  ctx.fillText('#mobilegraphy #contentcreation', 40, H - 105);
  // progress
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.fillRect(0, H - 12, W, 12);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, H - 12, W * ((f % 120) / 120), 12);
  ctx.restore();
}

const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {ctx, tex} = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return {ctx: c.getContext('2d')!, tex: t};
  }, []);
  drawScreen(ctx, f);
  tex.needsUpdate = true;

  const s = spring({frame: f - 4, fps, config: {damping: 15, stiffness: 90}});
  const ry = interpolate(s, [0, 1], [-2.4, -0.28]) + Math.sin(f / 30) * 0.12;
  const y = interpolate(s, [0, 1], [-7, -0.9]);

  const floaters = useMemo(
    () =>
      new Array(9).fill(0).map((_, i) => ({
        kind: i % 3,
        x: (i % 2 ? 1 : -1) * (1.9 + random(`fx${i}`) * 1.2),
        y: -3.5 + random(`fy${i}`) * 5.5,
        z: -1 + random(`fz${i}`) * 2,
        color: [C.orange, C.cyan, C.yellow, C.purple, C.pink][i % 5],
        sc: 0.25 + random(`fs${i}`) * 0.25,
      })),
    [],
  );
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 6]} intensity={2.6} />
      <pointLight position={[-4, 0, 3]} intensity={50} color={C.cyan} />
      <pointLight position={[4, -3, 3]} intensity={50} color={C.orange} />
      <group position={[0, y, 0]} rotation={[0.08, ry, 0.04]}>
        <RoundedBox args={[2.1, 4.35, 0.24]} radius={0.22} smoothness={6}>
          <meshStandardMaterial color="#1b1c22" metalness={0.6} roughness={0.25} />
        </RoundedBox>
        <mesh position={[0, 0, 0.125]}>
          <planeGeometry args={[1.96, 4.18]} />
          <meshBasicMaterial map={tex} transparent toneMapped={false} />
        </mesh>
      </group>
      {floaters.map((o, i) => {
        const sp = spring({frame: f - 14 - i * 3, fps, config: {damping: 12}});
        const pos: [number, number, number] = [o.x, o.y - 0.9 + Math.sin(f / 15 + i) * 0.18, o.z];
        const rot: [number, number, number] = [f * 0.03 + i, f * 0.04 + i, 0];
        return (
          <mesh key={i} position={pos} rotation={rot} scale={o.sc * sp}>
            {o.kind === 0 ? <torusGeometry args={[0.8, 0.32, 24, 48]} /> : o.kind === 1 ? <icosahedronGeometry args={[1, 0]} /> : <octahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial color={o.color} roughness={0.3} metalness={0.2} flatShading={o.kind !== 0} />
          </mesh>
        );
      })}
    </>
  );
};

const Chip: React.FC<{text: string; delay: number; x: number; y: number; color: string}> = ({text, delay, x, y, color}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - delay, fps, config: {damping: 11, stiffness: 160}});
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + Math.sin(f / 12 + delay) * 8,
        transform: `scale(${s})`,
        background: 'rgba(255,255,255,.95)',
        color: C.ink,
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 36,
        padding: '16px 28px',
        borderRadius: 50,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 20px 40px rgba(0,0,0,.35)',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{width: 22, height: 22, borderRadius: 11, background: color}} />
      {text}
    </div>
  );
};

export const S5Phone: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t1 = spring({frame: f - 22, fps, config: {damping: 14}});
  const t2 = spring({frame: f - 30, fps, config: {damping: 14}});
  const hl = p(f, 38, 50);
  const ex = p(f, 114, 127);
  return (
    <AbsoluteFill style={{opacity: 1 - ex, transform: `scale(${1 - ex * 0.15})`}}>
      <DarkBg speed={2} />
      <ThreeCanvas width={width} height={height} camera={{fov: 50, position: [0, 0, 9]}}>
        <Phone />
      </ThreeCanvas>
      <div style={{position: 'absolute', top: 170, width: '100%', textAlign: 'center', fontFamily: FONT, color: '#fff'}}>
        <div style={{fontSize: 70, fontWeight: 600, opacity: t1, transform: `translateY(${(1 - t1) * 60}px)`}}>Content yang buat orang</div>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 10, opacity: t2, transform: `translateY(${(1 - t2) * 60}px)`}}>
          <div style={{position: 'absolute', inset: '6px -18px', background: C.lime, transformOrigin: 'left', transform: `scaleX(${hl}) skewX(-8deg)`, borderRadius: 10}} />
          <span style={{position: 'relative', fontSize: 104, fontWeight: 900, color: hl > 0.5 ? C.ink : '#fff', letterSpacing: -2}}>BERHENTI SCROLL.</span>
        </div>
      </div>
      <Chip text="Lebih engagement" delay={60} x={60} y={1560} color={C.pink} />
      <Chip text="Lebih capaian" delay={70} x={560} y={1680} color={C.cyan} />
      <Chip text="Lebih jualan" delay={80} x={140} y={1790} color={C.green} />
    </AbsoluteFill>
  );
};
