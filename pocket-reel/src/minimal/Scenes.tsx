import React, {useEffect, useState} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, continueRender, delayRender, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {RoundedBox} from '@react-three/drei';
import {F, Fade, glide, Label, M, Mask, Panel, Rule, v} from './kit';

const useTex = (src: string) => {
  const [h] = useState(() => delayRender(src));
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    new THREE.TextureLoader().load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setTex(t);
      continueRender(h);
    });
  }, [src, h]);
  return tex;
};

const Corner: React.FC<{n: string; dark?: boolean}> = ({n, dark}) => (
  <>
    <Fade delay={14} style={{position: 'absolute', left: 90, top: 140}}>
      <Label color={dark ? M.grey : M.greyD}>{n}</Label>
    </Fade>
    <Fade delay={14} style={{position: 'absolute', right: 90, top: 140}}>
      <Label color={dark ? M.grey : M.greyD}>Pocket Production</Label>
    </Fade>
  </>
);

// ---------------------------------------------------------------- 1. Intro
export const M1Intro: React.FC = () => {
  const f = useCurrentFrame();
  const out = v(f, 100, 122);
  const lineW = 640 * v(f, 6, 40);
  const icon = v(f, 22, 52);
  const wm = v(f, 38, 70);
  return (
    <AbsoluteFill style={{background: M.black, opacity: 1 - out * 0.4, transform: `scale(${1 + f * 0.0004})`}}>
      <Img
        src={staticFile('icon-white.png')}
        style={{position: 'absolute', left: 540 - 52, top: 960 - 60 - 160, height: 160, opacity: icon, transform: `translateY(${(1 - icon) * 30}px)`}}
      />
      <div style={{position: 'absolute', top: 959, left: 540 - lineW / 2, width: lineW, height: 2, background: 'rgba(255,255,255,.55)'}} />
      <div style={{position: 'absolute', left: 540 - 300, top: 990, width: 600, height: 182, overflow: 'hidden'}}>
        <Img src={staticFile('wordmark-white.png')} style={{width: 600, transform: `translateY(${(1 - wm) * -105}%)`}} />
      </div>
      <Fade delay={64} style={{position: 'absolute', top: 1240, width: '100%', textAlign: 'center'}}>
        <Label color={M.grey}>Production · Training · Mobilegraphy</Label>
      </Fade>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2. Statement (+ 3D sphere)
const Orb: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[-4, 6, 5]} intensity={2.2} />
      <directionalLight position={[5, -2, 3]} intensity={0.4} />
      <group position={[0.55, 1.75, 0]} scale={0.85} rotation={[0.5, f * 0.006, 0.2]}>
        <mesh>
          <sphereGeometry args={[1.25, 96, 96]} />
          <meshStandardMaterial color="#e9e6dd" roughness={0.55} metalness={0} />
        </mesh>
        <mesh rotation={[Math.PI / 2.3, 0, f * 0.01]}>
          <torusGeometry args={[1.85, 0.012, 16, 200]} />
          <meshBasicMaterial color={M.ink} />
        </mesh>
        <mesh position={[Math.cos(f * 0.03) * 1.85, Math.sin(f * 0.03) * 0.5, Math.sin(f * 0.03) * 1.75]}>
          <sphereGeometry args={[0.08, 24, 24]} />
          <meshBasicMaterial color={M.ink} />
        </mesh>
      </group>
    </>
  );
};

export const M2Statement: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const out = v(f, 140, 160);
  return (
    <Panel bg={M.cream}>
      <AbsoluteFill style={{opacity: v(f, 10, 40)}}>
        <ThreeCanvas width={width} height={height} camera={{fov: 40, position: [0, 0, 12]}}>
          <Orb />
        </ThreeCanvas>
      </AbsoluteFill>
      <Corner n="01" />
      <div style={{position: 'absolute', left: 90, top: 980, fontFamily: F, color: M.ink, opacity: 1 - out, transform: `translateY(${out * -40}px)`}}>
        <Mask delay={20} style={{fontSize: 96, fontWeight: 300, letterSpacing: -2, lineHeight: 1.12}}>
          Content yang baik
        </Mask>
        <Mask delay={28} style={{fontSize: 96, fontWeight: 600, letterSpacing: -2, lineHeight: 1.12}}>
          bukan kebetulan.
        </Mask>
        <Rule delay={50} width={120} color={M.ink} style={{marginTop: 44}} />
        <Fade delay={58} style={{marginTop: 40, fontSize: 36, fontWeight: 300, color: M.greyD, lineHeight: 1.5}}>
          Ia dirancang, dirakam dan disunting
          <br />
          dengan teliti.
        </Fade>
      </div>
    </Panel>
  );
};

// ---------------------------------------------------------------- 3. Services
const SERVICES = ['Video Production', 'Mobilegraphy', 'Photography', 'Graphic Design', 'Advertising', 'Event Coverage', 'Training Programs'];

export const M3Services: React.FC = () => {
  const f = useCurrentFrame();
  const ROW = 128;
  const TOP = 660;
  const hl = interpolate(f, [40, 160], [0, SERVICES.length - 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: glide});
  const out = v(f, 170, 188);
  return (
    <AbsoluteFill style={{background: M.cream}}>
      <Corner n="02" />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: 90, top: 320, fontFamily: F, color: M.ink}}>
          <Mask delay={4} style={{fontSize: 30, fontWeight: 500, letterSpacing: 7, color: M.greyD}}>
            SERVIS KAMI
          </Mask>
          <Mask delay={10} style={{fontSize: 76, fontWeight: 300, letterSpacing: -2, marginTop: 10, lineHeight: 1.12}}>
            Satu pasukan.
          </Mask>
          <Mask delay={15} style={{fontSize: 76, fontWeight: 600, letterSpacing: -2, lineHeight: 1.12}}>
            Semua keperluan.
          </Mask>
        </div>
        {/* highlight bar */}
        <div
          style={{
            position: 'absolute',
            left: 90,
            top: TOP + hl * ROW + 18,
            width: 900,
            height: ROW - 36,
            background: M.lime,
            opacity: v(f, 34, 50),
            borderRadius: 4,
          }}
        />
        {SERVICES.map((s, i) => {
          const d = 16 + i * 5;
          const active = Math.max(0, 1 - Math.abs(hl - i));
          return (
            <div key={s} style={{position: 'absolute', left: 90, top: TOP + i * ROW, width: 900, height: ROW, fontFamily: F, color: M.ink}}>
              <Rule delay={d} width={900} color={M.line} style={{position: 'absolute', top: 0}} />
              <Fade delay={d + 4} y={0} style={{position: 'absolute', left: 26, top: 46, fontSize: 26, fontWeight: 500, color: M.greyD, letterSpacing: 2}}>
                {String(i + 1).padStart(2, '0')}
              </Fade>
              <Mask delay={d + 2} style={{position: 'absolute', left: 120, top: 30, fontSize: 52, fontWeight: 300 + Math.round(active * 3) * 100, letterSpacing: -0.5}}>
                {s}
              </Mask>
              <Fade delay={d + 8} y={0} style={{position: 'absolute', right: 26, top: 40, fontSize: 40, fontWeight: 300, opacity: active}}>
                →
              </Fade>
            </div>
          );
        })}
        <Rule delay={56} width={900} color={M.line} style={{position: 'absolute', left: 90, top: TOP + SERVICES.length * ROW}} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4. Training (+ 3D phone)
const MODULES = ['Mobile Filmmaking', 'Smartphone Photography', 'Social Media Reels', 'Content Strategy', 'Creative AI', 'Digital Marketing'];

const Phone: React.FC = () => {
  const f = useCurrentFrame();
  const icon = useTex(staticFile('icon-white.png'));
  const k = v(f, 4, 60);
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[-5, 5, 6]} intensity={2.4} />
      <directionalLight position={[6, -1, 2]} intensity={0.9} color="#f7fd92" />
      <group scale={0.78} position={[0, 1.85 - (1 - k) * 1.2, 0]} rotation={[0.12, -0.55 + k * 0.4 + f * 0.0035, 0.06]}>
        <RoundedBox args={[1.95, 4.0, 0.2]} radius={0.22} smoothness={8}>
          <meshStandardMaterial color="#d9d6cf" metalness={0.75} roughness={0.28} />
        </RoundedBox>
        <mesh position={[0, 0, 0.102]}>
          <planeGeometry args={[1.8, 3.85]} />
          <meshStandardMaterial color="#050505" metalness={0.2} roughness={0.15} />
        </mesh>
        {icon && (
          <mesh position={[0, 0.1, 0.106]}>
            <planeGeometry args={[0.62, 0.95]} />
            <meshBasicMaterial map={icon} transparent opacity={v(f, 30, 60)} toneMapped={false} />
          </mesh>
        )}
      </group>
    </>
  );
};

export const M4Training: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const per = 20;
  const idx = Math.min(MODULES.length - 1, Math.max(0, Math.floor((f - 70) / per)));
  const local = f - 70 - idx * per;
  const inK = v(local, 0, 10);
  const outK = idx < MODULES.length - 1 ? v(local, per - 6, per) : 0;
  const out = v(f, 150, 168);
  return (
    <Panel bg={M.black}>
      <AbsoluteFill style={{opacity: 1 - out}}>
        <ThreeCanvas width={width} height={height} camera={{fov: 40, position: [0, 0, 12]}}>
          <Phone />
        </ThreeCanvas>
        <Corner n="03" dark />
        <div style={{position: 'absolute', left: 90, top: 1110, fontFamily: F, color: '#fff'}}>
          <Mask delay={22}>
            <Label color={M.lime}>Training Programs</Label>
          </Mask>
          <Mask delay={28} style={{fontSize: 86, fontWeight: 300, letterSpacing: -2, marginTop: 18, lineHeight: 1.1}}>
            Belajar buat
          </Mask>
          <Mask delay={34} style={{fontSize: 86, fontWeight: 600, letterSpacing: -2, lineHeight: 1.1}}>
            content sendiri.
          </Mask>
          <Rule delay={50} width={900} color={M.lineD} style={{marginTop: 50}} />
          <div style={{width: 900, marginTop: 30}}>
            <Fade delay={56} y={0} style={{fontSize: 24, letterSpacing: 6, color: M.grey}}>
              MODUL {String(idx + 1).padStart(2, '0')} / {String(MODULES.length).padStart(2, '0')}
            </Fade>
            <div style={{overflow: 'hidden', height: 66, marginTop: 8}}>
              <div style={{fontSize: 50, fontWeight: 500, opacity: f < 70 ? 0 : 1, transform: `translateY(${(1 - inK) * 100 - outK * 100}%)`}}>{MODULES[idx]}</div>
            </div>
          </div>
          <Fade delay={64} style={{marginTop: 54, fontSize: 32, fontWeight: 300, color: M.grey}}>
            Praktikal &amp; hands-on — untuk individu, syarikat dan agensi.
          </Fade>
        </div>
      </AbsoluteFill>
    </Panel>
  );
};

// ---------------------------------------------------------------- 5. Process timeline
const STEPS: [string, string][] = [
  ['Konsultasi', 'Memahami matlamat & audiens anda'],
  ['Perancangan', 'Pelan yang disesuaikan untuk bisnes anda'],
  ['Pelaksanaan', 'Produksi atau latihan oleh pasukan kami'],
  ['Penghantaran', 'Hasil siap, berserta sokongan berterusan'],
];

export const M5Process: React.FC = () => {
  const f = useCurrentFrame();
  const TOP = 760;
  const GAP = 230;
  const prog = v(f, 20, 100, glide);
  const lineH = (STEPS.length - 1) * GAP * prog;
  const out = v(f, 112, 128);
  return (
    <Panel bg={M.cream}>
      <Corner n="04" />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: 90, top: 420, fontFamily: F, color: M.ink}}>
          <Mask delay={10} style={{fontSize: 30, fontWeight: 500, letterSpacing: 7, color: M.greyD}}>
            PROSES KAMI
          </Mask>
          <Mask delay={16} style={{fontSize: 80, fontWeight: 300, letterSpacing: -2, marginTop: 10}}>
            Dari idea ke <b style={{fontWeight: 600}}>hasil.</b>
          </Mask>
        </div>
        <div style={{position: 'absolute', left: 119, top: TOP, width: 2, height: (STEPS.length - 1) * GAP, background: M.line}} />
        <div style={{position: 'absolute', left: 119, top: TOP, width: 2, height: lineH, background: M.ink}} />
        {STEPS.map(([t, d], i) => {
          const reach = (i * GAP) / ((STEPS.length - 1) * GAP);
          const on = prog >= reach - 0.001 ? 1 : 0;
          const k = v(f, 20 + reach * 80 - 4, 20 + reach * 80 + 14);
          return (
            <div key={t} style={{position: 'absolute', left: 90, top: TOP + i * GAP - 30, fontFamily: F, color: M.ink}}>
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 15,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  border: `2px solid ${M.ink}`,
                  background: on ? M.ink : M.cream,
                  transform: `scale(${0.6 + k * 0.4})`,
                }}
              />
              <div style={{position: 'absolute', left: 110, top: 0, width: 800, opacity: 0.25 + k * 0.75, transform: `translateX(${(1 - k) * 20}px)`}}>
                <div style={{fontSize: 24, letterSpacing: 6, color: M.greyD}}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{fontSize: 56, fontWeight: 500, letterSpacing: -1, marginTop: 4}}>{t}</div>
                <div style={{fontSize: 30, fontWeight: 300, color: M.greyD, marginTop: 6}}>{d}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

// ---------------------------------------------------------------- 6. End card (+ 3D logo)
const LW = 2.95; // ≈ 600px menghadap kamera (fov 50, z 10)
const LH = LW * (403 / 1538);
const LAYERS = 22;

const Logo3D: React.FC = () => {
  const f = useCurrentFrame();
  const tex = useTex(staticFile('logo-white.png'));
  const k = v(f, 6, 60);
  return (
    <>
      <group position={[0, 1.75, 0]} rotation={[0.08 + Math.sin(f / 45) * 0.03, (1 - k) * -0.9 + Math.sin(f / 40) * 0.16, 0]}>
        {tex &&
          new Array(LAYERS).fill(0).map((_, i) => {
            const t = i / (LAYERS - 1);
            const col = i === 0 ? new THREE.Color('#ffffff') : new THREE.Color('#9a9890').lerp(new THREE.Color('#2a2a2a'), t);
            return (
              <mesh key={i} position={[0, 0, -i * 0.01]}>
                <planeGeometry args={[LW, LH]} />
                <meshBasicMaterial map={tex} color={col} alphaTest={0.5} side={THREE.DoubleSide} toneMapped={false} transparent opacity={k} />
              </mesh>
            );
          })}
      </group>
    </>
  );
};

export const M6End: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const fill = v(f, 70, 92, glide);
  return (
    <Panel bg={M.black}>
      <ThreeCanvas width={width} height={height} camera={{fov: 50, position: [0, 0, 10]}}>
        <Logo3D />
      </ThreeCanvas>
      <div style={{position: 'absolute', top: 880, width: '100%', fontFamily: F, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Rule delay={30} width={600} color={M.lineD} />
        <Mask delay={36} style={{fontSize: 58, fontWeight: 300, marginTop: 56, letterSpacing: -1}}>
          Hubungi kami untuk bantu
        </Mask>
        <Mask delay={42} style={{fontSize: 58, fontWeight: 300, letterSpacing: -1}}>
          bisnes anda <b style={{fontWeight: 600}}>berkembang.</b>
        </Mask>
        <Fade delay={58} style={{marginTop: 70}}>
          <div
            style={{
              width: 600,
              height: 120,
              border: '2px solid #fff',
              borderRadius: 60,
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{position: 'absolute', inset: 0, background: M.lime, transform: `translateX(${(fill - 1) * 100}%)`}} />
            <div style={{position: 'relative', fontSize: 40, fontWeight: 500, letterSpacing: 1, color: fill > 0.5 ? M.ink : '#fff'}}>WhatsApp Dee →</div>
          </div>
        </Fade>
        <Mask delay={84} style={{fontSize: 74, fontWeight: 300, letterSpacing: 6, marginTop: 50}}>
          011-1620 0864
        </Mask>
        <Fade delay={100} style={{marginTop: 70}}>
          <Label color={M.grey}>@pocket_production · pocketproduction.my</Label>
        </Fade>
      </div>
    </Panel>
  );
};
