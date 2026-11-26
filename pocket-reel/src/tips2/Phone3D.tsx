import React, {useEffect, useMemo, useState} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {W} from './timing';

const SW = 900; // screen canvas px
const SH = 1950;

/** realistic studio reflections without any network asset */
const Env: React.FC = () => {
  const {gl, scene} = useThree();
  useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  }, [gl, scene]);
  return null;
};

const useImage = (src: string) => {
  const [h] = useState(() => delayRender(src));
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    const i = new Image();
    i.onload = () => {
      setImg(i);
      continueRender(h);
    };
    i.src = src;
  }, [src, h]);
  return img;
};

function rr(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

/** camera-app screen: photo viewfinder + realistic iOS-like camera UI, driven by VO frames */
function drawScreen(c: CanvasRenderingContext2D, img: HTMLImageElement | null, f: number, fps: number) {
  c.clearRect(0, 0, SW, SH);
  c.save();
  rr(c, 0, 0, SW, SH, 120);
  c.clip();
  c.fillStyle = '#000';
  c.fillRect(0, 0, SW, SH);
  // viewfinder area (4:3-ish tall), subtle handheld drift
  const vx = 0;
  const vy = 250;
  const vw = SW;
  const vh = 1250;
  const dx = Math.sin(f / 23) * 6 + Math.sin(f / 7) * 1.5;
  const dy = Math.cos(f / 29) * 5;
  const lock = f >= W(18);
  const tapF = W(11);
  const ev = interpolate(f, [W(20), W(21) + 10], [0, -0.35], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // focus pull: slightly soft before tap, sharp after
  const soft = interpolate(f, [tapF, tapF + 10], [3, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  c.save();
  c.beginPath();
  c.rect(vx, vy, vw, vh);
  c.clip();
  if (img) {
    c.filter = `blur(${soft}px) brightness(${1 + ev * 0.6}) contrast(${1 - ev * 0.15}) saturate(${1 - ev * 0.2})`;
    const s = Math.max(vw / img.width, vh / img.height) * 1.06;
    c.drawImage(img, vx + (vw - img.width * s) / 2 + dx, vy + (vh - img.height * s) / 2 + dy, img.width * s, img.height * s);
    c.filter = 'none';
  }
  // rule-of-thirds grid
  c.strokeStyle = 'rgba(255,255,255,.35)';
  c.lineWidth = 2;
  for (let i = 1; i < 3; i++) {
    c.beginPath();
    c.moveTo(vx + (vw / 3) * i, vy);
    c.lineTo(vx + (vw / 3) * i, vy + vh);
    c.moveTo(vx, vy + (vh / 3) * i);
    c.lineTo(vx + vw, vy + (vh / 3) * i);
    c.stroke();
  }
  // tap ripple + focus box on the face
  const fx = 280;
  const fy = vy + 330;
  if (f >= tapF) {
    const t = (f - tapF) / fps;
    if (t < 0.5) {
      c.strokeStyle = `rgba(255,255,255,${1 - t * 2})`;
      c.lineWidth = 5;
      c.beginPath();
      c.arc(fx, fy, 40 + t * 160, 0, Math.PI * 2);
      c.stroke();
    }
    const s = 1 + Math.max(0, 0.35 - t) * 1.2;
    const bw = 230 * s;
    c.strokeStyle = '#ffd60a';
    c.lineWidth = 4;
    c.strokeRect(fx - bw / 2, fy - bw / 2, bw, bw);
    // ticks on box sides
    c.beginPath();
    [[fx, fy - bw / 2, fx, fy - bw / 2 + 14], [fx, fy + bw / 2, fx, fy + bw / 2 - 14], [fx - bw / 2, fy, fx - bw / 2 + 14, fy], [fx + bw / 2, fy, fx + bw / 2 - 14, fy]].forEach(([a, b, cc, d]) => {
      c.moveTo(a, b);
      c.lineTo(cc, d);
    });
    c.stroke();
    // exposure sun slider
    const sx = fx + bw / 2 + 34;
    c.beginPath();
    c.moveTo(sx, fy - 120);
    c.lineTo(sx, fy + 120);
    c.stroke();
    const sy = fy - ev * 260;
    c.fillStyle = '#ffd60a';
    c.beginPath();
    c.arc(sx, sy, 15, 0, Math.PI * 2);
    c.fill();
    for (let r = 0; r < 8; r++) {
      const a = (r / 8) * Math.PI * 2;
      c.beginPath();
      c.moveTo(sx + Math.cos(a) * 21, sy + Math.sin(a) * 21);
      c.lineTo(sx + Math.cos(a) * 29, sy + Math.sin(a) * 29);
      c.stroke();
    }
  }
  c.restore();
  // AE/AF LOCK badge
  if (lock) {
    const p = Math.min(1, (f - W(18)) / 5);
    c.globalAlpha = p;
    c.fillStyle = '#ffd60a';
    rr(c, SW / 2 - 140, vy + 30, 280, 64, 12);
    c.fill();
    c.fillStyle = '#000';
    c.font = '700 36px "DM Sans"';
    c.textAlign = 'center';
    c.fillText('AE/AF LOCK', SW / 2, vy + 74);
    c.globalAlpha = 1;
  }
  // top bar
  c.textAlign = 'center';
  c.fillStyle = '#fff';
  c.font = '600 34px "DM Sans"';
  c.fillText('HD · 30', SW - 140, 190);
  c.beginPath();
  c.arc(90, 178, 26, 0, Math.PI * 2);
  c.strokeStyle = '#fff';
  c.lineWidth = 3;
  c.stroke();
  // recording timer
  const rec = Math.max(0, f - W(4));
  c.fillStyle = 'rgba(255,59,48,.95)';
  rr(c, SW / 2 - 110, 150, 220, 56, 12);
  c.fill();
  c.fillStyle = '#fff';
  c.font = '600 34px "JetBrains Mono"';
  const secs = Math.floor(rec / fps);
  c.fillText(`00:00:${String(secs).padStart(2, '0')}`, SW / 2, 190);
  // zoom pills
  c.font = '700 30px "DM Sans"';
  [['.5', -110], ['1×', 0], ['2', 110]].forEach(([t, ox]) => {
    const on = t === '1×';
    c.fillStyle = 'rgba(30,30,30,.75)';
    c.beginPath();
    c.arc(SW / 2 + (ox as number), vy + vh - 80, on ? 42 : 34, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = on ? '#ffd60a' : '#fff';
    c.fillText(t as string, SW / 2 + (ox as number), vy + vh - 70);
  });
  // modes
  c.font = '600 32px "DM Sans"';
  [['SLO-MO', -330], ['VIDEO', -110], ['FOTO', 110], ['POTRET', 330]].forEach(([t, ox]) => {
    c.fillStyle = t === 'VIDEO' ? '#ffd60a' : 'rgba(255,255,255,.75)';
    c.fillText(t as string, SW / 2 + (ox as number), vy + vh + 120);
  });
  // shutter (recording = red rounded square)
  c.beginPath();
  c.arc(SW / 2, SH - 250, 82, 0, Math.PI * 2);
  c.strokeStyle = '#fff';
  c.lineWidth = 8;
  c.stroke();
  c.fillStyle = '#ff3b30';
  rr(c, SW / 2 - 38, SH - 288, 76, 76, 16);
  c.fill();
  // thumbnail + flip
  if (img) c.drawImage(img, 120, SH - 300, 100, 100);
  c.beginPath();
  c.arc(SW - 170, SH - 250, 50, 0, Math.PI * 2);
  c.fillStyle = 'rgba(255,255,255,.18)';
  c.fill();
  // dynamic island
  c.fillStyle = '#000';
  rr(c, SW / 2 - 170, 40, 340, 100, 50);
  c.fill();
  // home indicator
  c.fillStyle = 'rgba(255,255,255,.9)';
  rr(c, SW / 2 - 150, SH - 40, 300, 12, 6);
  c.fill();
  c.restore();
}

const Device: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const wide = width > height;
  const img = useImage(staticFile('tips2/photo-portrait.jpg'));
  const {cv, tex} = useMemo(() => {
    const cvv = document.createElement('canvas');
    cvv.width = SW;
    cvv.height = SH;
    const t = new THREE.CanvasTexture(cvv);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return {cv: cvv, tex: t};
  }, []);
  drawScreen(cv.getContext('2d')!, img, f, fps);
  tex.needsUpdate = true;

  // choreography (frames from the VO)
  const rise = spring({frame: f - W(4), fps, config: {damping: 16, stiffness: 80}}); // "Kami rakam…"
  const push = spring({frame: f - (W(9) - 6), fps, config: {damping: 18, stiffness: 70}}); // "Mula-mula"
  const tap = spring({frame: f - W(11), fps, config: {damping: 9, stiffness: 220}});
  const y = interpolate(rise, [0, 1], [-5.2, -1.45]) + push * 1.25;
  const s = 0.82 + push * 0.42 - Math.sin(Math.min(1, tap) * Math.PI) * 0.015;
  const ry = interpolate(rise, [0, 1], [-0.9, -0.38]) + push * 0.3 + Math.sin(f / 50) * 0.04;
  const rx = interpolate(rise, [0, 1], [0.7, 0.32]) - push * 0.24 + Math.sin(f / 60) * 0.02;
  const rz = interpolate(rise, [0, 1], [0.25, 0.06]) - push * 0.05;

  const titanium = <meshPhysicalMaterial color="#bdb7ab" metalness={1} roughness={0.32} envMapIntensity={1.3} clearcoat={0.3} />;
  return (
    <group position={[wide ? 1.55 : 0, y, 0]} rotation={[rx, ry, rz]} scale={s}>
      {/* titanium frame */}
      <RoundedBox args={[1.0, 2.06, 0.1]} radius={0.12} smoothness={12}>
        {titanium}
      </RoundedBox>
      {/* front black glass */}
      <RoundedBox args={[0.985, 2.045, 0.006]} radius={0.11} smoothness={12} position={[0, 0, 0.049]}>
        <meshPhysicalMaterial color="#030303" metalness={0} roughness={0.04} clearcoat={1} clearcoatRoughness={0.02} envMapIntensity={1.2} />
      </RoundedBox>
      {/* display */}
      <mesh position={[0, 0, 0.0525]}>
        <planeGeometry args={[0.93, 0.93 * (SH / SW)]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
      {/* glass reflection layer */}
      <mesh position={[0, 0, 0.054]}>
        <planeGeometry args={[0.98, 2.04]} />
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.06} roughness={0} metalness={0} clearcoat={1} envMapIntensity={2.2} />
      </mesh>
      {/* side buttons */}
      {[
        [-0.505, 0.52, 0.1],
        [-0.505, 0.32, 0.16],
        [-0.505, 0.12, 0.16],
        [0.505, 0.3, 0.24],
      ].map(([x, yy, h], i) => (
        <RoundedBox key={i} args={[0.02, h, 0.045]} radius={0.008} smoothness={4} position={[x, yy, 0]}>
          {titanium}
        </RoundedBox>
      ))}
      {/* back camera bump (visible on tilt) */}
      <RoundedBox args={[0.42, 0.42, 0.03]} radius={0.08} smoothness={6} position={[-0.22, 0.72, -0.065]}>
        <meshPhysicalMaterial color="#cfc9bd" metalness={0.2} roughness={0.15} clearcoat={1} />
      </RoundedBox>
    </group>
  );
};

export const PhoneScene: React.FC = () => (
  <>
    <Env />
    <ambientLight intensity={0.25} />
    <directionalLight position={[-3, 4, 5]} intensity={1.6} />
    <directionalLight position={[4, -2, 3]} intensity={0.5} color="#c9d4ff" />
    <Device />
  </>
);
