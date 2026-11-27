import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import {random, useCurrentFrame} from 'remotion';

// ============ procedural canvas textures ============
const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  draw(cv.getContext('2d')!);
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace;
  return {t, cv};
};

export const drawCity = (c: CanvasRenderingContext2D, W: number, H: number) => {
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#070b16');
  g.addColorStop(0.55, '#16203a');
  g.addColorStop(1, '#2a2230');
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  // 3 layers of skyline, far → near
  for (let layer = 0; layer < 3; layer++) {
    let x = 0;
    let k = 0;
    while (x < W) {
      const bw = 18 + random(`bw${layer}${k}`) * (30 + layer * 30);
      const bh = H * (0.18 + random(`bh${layer}${k}`) * (0.25 + layer * 0.12));
      const y = H - bh;
      c.fillStyle = ['#0f1524', '#0b101c', '#070a12'][layer];
      c.fillRect(x, y, bw, bh);
      // lit windows
      for (let wy = y + 4; wy < H - 3; wy += 5 + layer) {
        for (let wx = x + 3; wx < x + bw - 3; wx += 4 + layer) {
          const r = random(`w${layer}${k}${wx}${wy}`);
          if (r > 0.62) {
            c.fillStyle = r > 0.95 ? '#cfe3ff' : r > 0.8 ? '#ffd27a' : '#e89a46';
            c.globalAlpha = 0.45 + layer * 0.2;
            c.fillRect(wx, wy, 1.6 + layer * 0.6, 2 + layer * 0.6);
            c.globalAlpha = 1;
          }
        }
      }
      x += bw + 1;
      k++;
    }
  }
};

export const useCityTexture = () =>
  useMemo(() => {
    const {t} = canvasTex(1024, 640, (c) => drawCity(c, 1024, 640));
    t.minFilter = THREE.LinearFilter;
    return t;
  }, []);

/** live video-editor UI shown on the laptop */
export const drawEditor = (c: CanvasRenderingContext2D, W: number, H: number, f: number, exportP = 0) => {
  c.fillStyle = '#16181d';
  c.fillRect(0, 0, W, H);
  c.fillStyle = '#20232a';
  c.fillRect(0, 0, W, H * 0.06);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((col, i) => {
    c.fillStyle = col;
    c.beginPath();
    c.arc(W * 0.02 + i * W * 0.022, H * 0.03, H * 0.011, 0, 7);
    c.fill();
  });
  c.fillStyle = '#9aa0aa';
  c.font = `600 ${H * 0.028}px Poppins`;
  c.fillText('Pocket Production — Brand_Reel_9x16', W * 0.1, H * 0.04);
  // media bin
  for (let i = 0; i < 8; i++) {
    const x = W * 0.02 + (i % 2) * W * 0.11;
    const y = H * 0.09 + Math.floor(i / 2) * H * 0.12;
    const g = c.createLinearGradient(x, y, x + W * 0.1, y + H * 0.1);
    g.addColorStop(0, ['#e8955a', '#5a8ae8', '#e85a8a', '#5ae8b0'][i % 4]);
    g.addColorStop(1, '#2a2d35');
    c.fillStyle = g;
    c.fillRect(x, y, W * 0.1, H * 0.1);
  }
  // preview (9:16)
  const pw = H * 0.5 * (9 / 16);
  const px = W * 0.5 - pw / 2;
  const py = H * 0.08;
  const pg = c.createLinearGradient(px, py, px + pw, py + H * 0.5);
  const hue = (f * 2) % 360;
  pg.addColorStop(0, `hsl(${20 + Math.sin(f / 15) * 15},80%,58%)`);
  pg.addColorStop(1, `hsl(${260 + hue * 0.05},60%,40%)`);
  c.fillStyle = pg;
  c.fillRect(px, py, pw, H * 0.5);
  c.fillStyle = '#fff';
  c.font = `800 ${H * 0.04}px Poppins`;
  c.textAlign = 'center';
  c.fillText('STOP', W * 0.5, py + H * 0.24);
  c.fillText('SCROLL', W * 0.5, py + H * 0.29);
  c.textAlign = 'left';
  // inspector
  c.fillStyle = '#1d2026';
  c.fillRect(W * 0.76, H * 0.08, W * 0.22, H * 0.5);
  for (let i = 0; i < 6; i++) {
    c.fillStyle = '#2c3038';
    c.fillRect(W * 0.78, H * 0.11 + i * H * 0.07, W * 0.18, H * 0.02);
    c.fillStyle = '#f7fd92';
    c.fillRect(W * 0.78, H * 0.11 + i * H * 0.07, W * 0.18 * (0.3 + 0.6 * random(`in${i}`)), H * 0.02);
  }
  // timeline
  const ty = H * 0.62;
  c.fillStyle = '#121418';
  c.fillRect(0, ty, W, H - ty);
  const cols = ['#f7fd92', '#ff8a4c', '#58c4f5', '#a37cf5', '#5ce0a0'];
  for (let tr = 0; tr < 4; tr++) {
    let x = W * 0.04;
    let k = 0;
    while (x < W * 0.96) {
      const w = W * (0.06 + random(`cl${tr}${k}`) * 0.12);
      c.fillStyle = cols[(tr + k) % cols.length];
      c.globalAlpha = 0.85;
      c.fillRect(x, ty + H * 0.04 + tr * H * 0.085, Math.min(w, W * 0.96 - x), H * 0.065);
      c.globalAlpha = 1;
      x += w + W * 0.006;
      k++;
    }
  }
  const ph = W * 0.04 + ((f * 4) % (W * 0.92));
  c.fillStyle = '#ff3b3b';
  c.fillRect(ph, ty + H * 0.02, 3, H * 0.36);
  if (exportP > 0) {
    c.fillStyle = 'rgba(0,0,0,.55)';
    c.fillRect(0, 0, W, H);
    c.fillStyle = '#2a2d35';
    c.fillRect(W * 0.25, H * 0.42, W * 0.5, H * 0.16);
    c.fillStyle = '#fff';
    c.font = `600 ${H * 0.035}px Poppins`;
    c.fillText(exportP >= 1 ? 'Export siap ✓' : `Exporting 9:16… ${Math.round(exportP * 100)}%`, W * 0.28, H * 0.48);
    c.fillStyle = '#3a3e48';
    c.fillRect(W * 0.28, H * 0.52, W * 0.44, H * 0.02);
    c.fillStyle = '#f7fd92';
    c.fillRect(W * 0.28, H * 0.52, W * 0.44 * exportP, H * 0.02);
  }
};

const drawPhoneRec = (c: CanvasRenderingContext2D, W: number, H: number, f: number) => {
  const g = c.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, '#2b3550');
  g.addColorStop(0.6, '#a2654a');
  g.addColorStop(1, '#3a2a24');
  c.fillStyle = g;
  c.fillRect(0, 0, W, H);
  c.strokeStyle = 'rgba(255,255,255,.35)';
  c.lineWidth = 1;
  for (let i = 1; i < 3; i++) {
    c.beginPath();
    c.moveTo((W / 3) * i, 0);
    c.lineTo((W / 3) * i, H);
    c.moveTo(0, (H / 3) * i);
    c.lineTo(W, (H / 3) * i);
    c.stroke();
  }
  if (Math.floor(f / 15) % 2 === 0) {
    c.fillStyle = '#ff3030';
    c.beginPath();
    c.arc(W * 0.12, H * 0.05, W * 0.035, 0, 7);
    c.fill();
  }
  c.fillStyle = '#fff';
  c.font = `600 ${W * 0.07}px Poppins`;
  const s = Math.floor(f / 30);
  c.fillText(`REC 00:${String(s).padStart(2, '0')}`, W * 0.2, H * 0.06);
  c.beginPath();
  c.arc(W / 2, H * 0.92, W * 0.09, 0, 7);
  c.lineWidth = 4;
  c.strokeStyle = '#fff';
  c.stroke();
  c.fillStyle = '#ff3030';
  c.beginPath();
  c.arc(W / 2, H * 0.92, W * 0.06, 0, 7);
  c.fill();
};

const useLiveTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D, W: number, H: number) => void) => {
  const {t, cv} = useMemo(() => canvasTex(w, h, () => {}), [w, h]);
  draw(cv.getContext('2d')!, w, h);
  t.needsUpdate = true;
  return t;
};

// ============ camera rig ============
export type Shot = {pos: [number, number, number]; target: [number, number, number]; fov?: number};
export const CameraRig: React.FC<Shot> = ({pos, target, fov = 45}) => {
  const {camera, size} = useThree();
  camera.position.set(...pos);
  (camera as THREE.PerspectiveCamera).fov = size.width > size.height ? fov * 0.62 : fov;
  camera.lookAt(...target);
  camera.updateProjectionMatrix();
  return null;
};

// ============ the room ============
const SHELF_COLS = ['#5b1f24', '#2f4a3a', '#1f2f52', '#c9bfa8', '#7a3b22', '#3b3f4a', '#8a7a52', '#4a2a4a'];

const Shelf: React.FC<{x: number; seed: string}> = ({x, seed}) => {
  const books = useMemo(() => {
    const out: {x: number; y: number; w: number; h: number; c: string; tilt: number}[] = [];
    [0.95, 1.65, 2.35, 3.05].forEach((sy, row) => {
      let bx = -0.7;
      let k = 0;
      while (bx < 0.65) {
        const w = 0.05 + random(`${seed}w${row}${k}`) * 0.07;
        const h = 0.32 + random(`${seed}h${row}${k}`) * 0.18;
        if (random(`${seed}gap${row}${k}`) > 0.9) {
          bx += 0.15;
        } else {
          out.push({x: bx + w / 2, y: sy + h / 2, w, h, c: SHELF_COLS[Math.floor(random(`${seed}c${row}${k}`) * SHELF_COLS.length)], tilt: 0});
          bx += w + 0.006;
        }
        k++;
      }
    });
    return out;
  }, [seed]);
  return (
    <group position={[x, 0, -1.25]}>
      <mesh position={[0, 2.0, -0.2]}>
        <boxGeometry args={[1.6, 4.2, 0.05]} />
        <meshStandardMaterial color="#141519" roughness={0.9} />
      </mesh>
      {[0.95, 1.65, 2.35, 3.05].map((y) => (
        <mesh key={y} position={[0, y - 0.02, 0]}>
          <boxGeometry args={[1.6, 0.04, 0.42]} />
          <meshStandardMaterial color="#1e1f25" roughness={0.7} />
        </mesh>
      ))}
      {books.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, 0]}>
          <boxGeometry args={[b.w, b.h, 0.3]} />
          <meshStandardMaterial color={b.c} roughness={0.75} />
        </mesh>
      ))}
    </group>
  );
};

export const Room: React.FC<{exportP?: number; lidOpen?: number}> = ({exportP = 0, lidOpen = 1}) => {
  const f = useCurrentFrame();
  const city = useCityTexture();
  const editor = useLiveTex(1024, 640, (c, W, H) => drawEditor(c, W, H, f, exportP));
  const rec = useLiveTex(256, 512, (c, W, H) => drawPhoneRec(c, W, H, f));
  const motes = useMemo(
    () => new Array(40).fill(0).map((_, i) => ({x: (random(`mx${i}`) - 0.5) * 5, y: random(`my${i}`) * 3.4, z: (random(`mz${i}`) - 0.3) * 3, s: 0.006 + random(`ms${i}`) * 0.012})),
    [],
  );
  const lid = -0.32 + (1 - lidOpen) * 1.89;
  return (
    <>
      <color attach="background" args={['#06080e']} />
      <fog attach="fog" args={['#06080e', 6, 14]} />
      <ambientLight intensity={0.25} color="#8aa0ff" />
      <pointLight position={[-1.6, 1.6, 1.2]} intensity={14} color="#ffb070" distance={7} />
      <pointLight position={[0, 2.2, -0.8]} intensity={10} color="#6f8cff" distance={6} />
      <directionalLight position={[0, 3, 4]} intensity={0.5} color="#c8d4ff" />

      {/* wall + city window */}
      <mesh position={[0, 2, -1.6]}>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#0d111c" roughness={1} />
      </mesh>
      <mesh position={[0, 2.05, -1.58]}>
        <planeGeometry args={[3.2, 2.6]} />
        <meshBasicMaterial map={city} toneMapped={false} />
      </mesh>
      {[[-1.62, 2.05, 0.06, 2.7], [1.62, 2.05, 0.06, 2.7], [0, 3.37, 3.3, 0.06], [0, 0.73, 3.3, 0.06], [0, 2.05, 0.04, 2.6]].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, -1.55]}>
          <boxGeometry args={[w, h, 0.06]} />
          <meshStandardMaterial color="#0a0c12" />
        </mesh>
      ))}
      <Shelf x={-2.55} seed="L" />
      <Shelf x={2.55} seed="R" />

      {/* desk */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[6, 0.1, 2.4]} />
        <meshStandardMaterial color="#2d2119" roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.002, 0.25]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.4, 1.1]} />
        <meshStandardMaterial color="#202228" roughness={0.95} />
      </mesh>

      {/* laptop */}
      <group position={[0, 0.02, 0.3]}>
        <RoundedBox args={[1.3, 0.035, 0.88]} radius={0.015} smoothness={3}>
          <meshStandardMaterial color="#8d939c" metalness={0.7} roughness={0.35} />
        </RoundedBox>
        <mesh position={[0, 0.019, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.12, 0.42]} />
          <meshStandardMaterial color="#1b1d22" roughness={0.8} />
        </mesh>
        <group position={[0, 0.02, -0.43]} rotation={[lid, 0, 0]}>
          <group position={[0, 0.44, 0]}>
            <RoundedBox args={[1.3, 0.86, 0.02]} radius={0.012} smoothness={3}>
              <meshStandardMaterial color="#8d939c" metalness={0.7} roughness={0.35} />
            </RoundedBox>
            <mesh position={[0, 0, 0.0115]}>
              <planeGeometry args={[1.22, 0.78]} />
              <meshBasicMaterial map={editor} toneMapped={false} />
            </mesh>
          </group>
        </group>
      </group>
      {/* screen glow */}
      <pointLight position={[0, 0.5, 0.6]} intensity={2.5 * lidOpen} color="#8ab0ff" distance={2} />

      {/* phone on tripod + ring light */}
      <group position={[0.95, 0, 0.45]} rotation={[0, -0.4, 0]}>
        {[0, 2.1, 4.2].map((a) => (
          <mesh key={a} position={[Math.cos(a) * 0.08, 0.13, Math.sin(a) * 0.08]} rotation={[Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35]}>
            <cylinderGeometry args={[0.008, 0.008, 0.28]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ))}
        <mesh position={[0, 0.34, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <group position={[0, 0.6, 0]}>
          <RoundedBox args={[0.2, 0.4, 0.022]} radius={0.025} smoothness={4}>
            <meshStandardMaterial color="#15161a" metalness={0.5} roughness={0.3} />
          </RoundedBox>
          <mesh position={[0, 0, 0.0125]}>
            <planeGeometry args={[0.18, 0.37]} />
            <meshBasicMaterial map={rec} toneMapped={false} />
          </mesh>
          <mesh position={[0, 0, -0.06]}>
            <torusGeometry args={[0.24, 0.018, 16, 96]} />
            <meshBasicMaterial color="#f3e6d2" toneMapped={false} />
          </mesh>
        </group>
        <pointLight position={[0, 0.6, 0.3]} intensity={3} color="#fff1da" distance={2.5} />
      </group>

      {/* mug + notebook */}
      <mesh position={[-0.85, 0.1, 0.5]}>
        <cylinderGeometry args={[0.07, 0.065, 0.2, 32]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.4} />
      </mesh>
      <mesh position={[-0.9, 0.012, 0.05]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.36, 0.02, 0.5]} />
        <meshStandardMaterial color="#2a4b8d" roughness={0.6} />
      </mesh>

      {/* floating dust motes */}
      {motes.map((m, i) => (
        <mesh key={i} position={[m.x + Math.sin(f / 50 + i) * 0.05, m.y + ((f * 0.002 + i * 0.1) % 0.4), m.z]}>
          <sphereGeometry args={[m.s, 8, 8]} />
          <meshBasicMaterial color="#ffe3b8" transparent opacity={0.5} />
        </mesh>
      ))}
    </>
  );
};
