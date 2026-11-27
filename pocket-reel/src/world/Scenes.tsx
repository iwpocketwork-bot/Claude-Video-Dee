import React, {useEffect, useState} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, continueRender, delayRender, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {RoundedBox} from '@react-three/drei';
import {CameraRig, drawCity, drawEditor, Room, Shot} from './Room';
import {Float3D, Glass, io, k, LiveCanvas, mix, mix3, Pill, Ring, Toggle, useSpring, W} from './ui';

const View: React.FC<{shot: Shot; blur?: number; exportP?: number; lidOpen?: number; children?: React.ReactNode}> = ({
  shot,
  blur = 0,
  exportP,
  lidOpen,
  children,
}) => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{filter: blur > 0.05 ? `blur(${blur}px)` : undefined}}>
      <ThreeCanvas width={width} height={height} gl={{antialias: true}}>
        <CameraRig {...shot} />
        <Room exportP={exportP} lidOpen={lidOpen} />
        {children}
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

/** true when rendering the 16:9 website version */
const useWide = () => {
  const {width, height} = useVideoConfig();
  return width > height;
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.55) 100%)', pointerEvents: 'none'}} />
);

// ===================================================== W1 · Establishing desk
export const W1Desk: React.FC = () => {
  const f = useCurrentFrame();
  const t = k(f, 0, 110, io);
  const shot: Shot = {pos: mix3([0, 1.6, 4.9], [0, 1.15, 2.9], t), target: mix3([0, 1.25, -0.6], [0, 0.85, -0.3], t), fov: 52};
  const lid = k(f, 6, 40, io);
  const prog = interpolate(f, [50, 105], [0.3, 0.65], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const out = k(f, 100, 112);
  const wide = useWide();
  return (
    <AbsoluteFill>
      <View shot={shot} lidOpen={lid} blur={out * 10} />
      <Vignette />
      <Float3D delay={44} x={wide ? 1050 : 110} y={wide ? 120 : 330} w={wide ? 800 : 860} tilt={wide ? [8, -14] : [8, -6]} out={out}>
        <Glass style={{padding: '34px 40px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <div style={{width: 84, height: 84, borderRadius: 22, background: W.lime, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Img src={staticFile('icon-dark.png')} style={{height: 58}} />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 40, fontWeight: 600}}>Pocket Production</div>
              <div style={{fontSize: 30, color: W.lime, fontWeight: 500}}>Mengedit: Video Brand anda</div>
            </div>
            <div style={{fontSize: 44, fontWeight: 600}}>{Math.round(prog * 100)}%</div>
          </div>
          <div style={{height: 12, borderRadius: 6, background: 'rgba(255,255,255,.2)', marginTop: 28}}>
            <div style={{height: 12, borderRadius: 6, width: `${prog * 100}%`, background: '#fff'}} />
          </div>
          <div style={{fontSize: 24, opacity: 0.7, marginTop: 14}}>Klip {Math.round(prog * 22)} daripada 22</div>
        </Glass>
      </Float3D>
    </AbsoluteFill>
  );
};

// ===================================================== W2 · Problems at the bookshelf
const QMark: React.FC<{x: number; y: number; size: number; delay: number}> = ({x, y, size, delay}) => {
  const f = useCurrentFrame();
  const s = useSpring(delay, 9, 160);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + Math.sin((f + delay * 7) / 14) * 12,
        fontFamily: W.font,
        fontWeight: 800,
        fontSize: size,
        color: '#ffb15c',
        transform: `scale(${s}) rotate(${Math.sin((f + delay) / 20) * 12}deg)`,
        textShadow: `0 ${size * 0.06}px 0 #c8651e, 0 ${size * 0.12}px 0 #9a4a12, 0 30px 40px rgba(0,0,0,.5)`,
      }}
    >
      ?
    </div>
  );
};

export const W2Problems: React.FC = () => {
  const f = useCurrentFrame();
  const t = k(f, 0, 95, io);
  const shot: Shot = {pos: mix3([-0.6, 1.8, 1.9], [-1.25, 1.65, 1.35], t), target: [-2.55, 1.6, -1.25], fov: 48};
  const focus = interpolate(f, [0, 16], [0, 6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const inn = k(f, 0, 10);
  const wide = useWide();
  return (
    <AbsoluteFill style={{opacity: inn}}>
      <View shot={shot} blur={focus} />
      <Vignette />
      <QMark x={wide ? 820 : 110} y={wide ? 120 : 470} size={wide ? 190 : 230} delay={10} />
      <QMark x={wide ? 1660 : 820} y={wide ? 300 : 640} size={wide ? 120 : 130} delay={16} />
      <QMark x={wide ? 880 : 160} y={wide ? 720 : 1180} size={110} delay={22} />
      <div style={{position: 'absolute', left: wide ? 860 : 0, right: 0, top: wide ? 220 : 560, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 46}}>
        {['Tiada masa?', 'Content tak konsisten?', 'Engagement rendah?'].map((s, i) => (
          <Float3D key={s} delay={16 + i * 9} x={0} y={0} w={wide ? 1060 : 1080} tilt={[0, 0]} relative>
            <div style={{textAlign: 'center', transform: `translateX(${(i - 1) * 70}px) rotate(${(i - 1) * -3}deg)`}}>
              <Pill text={s} color="linear-gradient(180deg,#ffa25a,#f0742a)" size={48} />
            </div>
          </Float3D>
        ))}
      </div>
      <Float3D delay={52} x={wide ? 1030 : 140} y={wide ? 700 : 1110} w={wide ? 720 : 800} tilt={[6, 6]}>
        <Glass style={{padding: '34px 44px', textAlign: 'center', fontSize: 50, fontWeight: 600}} radius={60}>
          Biar <span style={{color: W.lime}}>kami</span> uruskan.
        </Glass>
      </Float3D>
    </AbsoluteFill>
  );
};

// ===================================================== W3 · Portal into the city + 3D brand icon with ribbons
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

const BrandIcon: React.FC = () => {
  const f = useCurrentFrame();
  const icon = useTex(staticFile('icon-dark.png'));
  const fly = k(f, 8, 46);
  const pos = mix3([1.6, -1.2, -1.8], [0, 2.2, -0.75], fly);
  const arc = Math.PI * 2 * k(f, 6, 40);
  return (
    <group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[-2, 4, 3]} intensity={2.2} />
      <group position={pos} rotation={[0.15 * (1 - fly) + Math.sin(f / 30) * 0.06, (1 - fly) * -2.6 + Math.sin(f / 26) * 0.25, (1 - fly) * 0.8]}>
        <RoundedBox args={[0.62, 0.62, 0.14]} radius={0.13} smoothness={6}>
          <meshStandardMaterial color={W.lime} roughness={0.35} metalness={0.05} toneMapped={false} />
        </RoundedBox>
        {icon && (
          <mesh position={[0, 0, 0.072]}>
            <planeGeometry args={[0.3, 0.46]} />
            <meshBasicMaterial map={icon} transparent toneMapped={false} />
          </mesh>
        )}
      </group>
      {/* swirling ribbons */}
      {[
        {c: '#3d6dff', r: 0.82, rot: [1.35, 0.15, f * 0.05] as [number, number, number]},
        {c: '#2a4fd0', r: 0.96, rot: [1.45, -0.25, -f * 0.04 + 1] as [number, number, number]},
        {c: W.lime, r: 0.88, rot: [1.25, 0.35, f * 0.06 + 2] as [number, number, number]},
      ].map((rb, i) => (
        <mesh key={i} position={[pos[0], pos[1], pos[2] - 0.05]} rotation={rb.rot} scale={[1, 1, 0.12]}>
          <torusGeometry args={[rb.r, 0.03, 12, 140, arc * (0.7 + i * 0.1)]} />
          <meshStandardMaterial color={rb.c} roughness={0.3} metalness={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
};

export const W3Portal: React.FC = () => {
  const f = useCurrentFrame();
  const t = k(f, 0, 105, io);
  const wideW3 = useWide();
  const shot: Shot = {pos: mix3([0, 2.05, 1.9], [0, 2.05, 1.15], t), target: [0, 2.05, -1.6], fov: wideW3 ? 82 : 50};
  const portal = k(f, 0, 20, io);
  const r = portal * 1300;
  const out = k(f, 92, 104);
  const wide = useWide();
  const cx = wide ? 960 : 540;
  const cy = wide ? 520 : 900;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: `circle(${r}px at ${cx}px ${cy}px)`}}>
        <View shot={shot} blur={out * 12}>
          <BrandIcon />
        </View>
        <Vignette />
        <Float3D delay={50} x={wide ? 610 : 190} y={wide ? 850 : 1240} w={700} tilt={[6, 0]} out={out}>
          <Glass style={{padding: '30px 40px', textAlign: 'center'}}>
            <div style={{fontSize: 46, fontWeight: 600}}>Pocket Production</div>
            <div style={{fontSize: 26, letterSpacing: 4, opacity: 0.8, marginTop: 6}}>PRODUCTION · TRAINING · MOBILEGRAPHY</div>
          </Glass>
        </Float3D>
      </AbsoluteFill>
      {/* lens ring */}
      {portal < 1 && (
        <div
          style={{
            position: 'absolute',
            left: cx - r,
            top: cy - r,
            width: r * 2,
            height: r * 2,
            borderRadius: '50%',
            border: '10px solid rgba(160,200,255,.7)',
            boxShadow: '0 0 60px 20px rgba(120,170,255,.45), inset 0 0 60px 20px rgba(120,170,255,.45)',
            filter: 'blur(3px)',
            opacity: 1 - portal * 0.6,
          }}
        />
      )}
    </AbsoluteFill>
  );
};

// ===================================================== W4 · Services control panel
const SERVICES = ['Video Production', 'Mobilegraphy', 'Photography', 'Graphic Design', 'Advertising', 'Event Coverage', 'Training Programs'];

export const W4Services: React.FC = () => {
  const f = useCurrentFrame();
  const t = k(f, 0, 130, io);
  const shot: Shot = {pos: mix3([1.0, 1.7, 2.6], [0.5, 1.75, 2.2], t), target: [0, 1.9, -1.6], fov: 50};
  const whip = k(f, 116, 130, io);
  const inn = k(f, 0, 10);
  const wide = useWide();
  return (
    <AbsoluteFill style={{opacity: inn, transform: `translateX(${whip * (wide ? -1200 : -700)}px)`, filter: `blur(${whip * 30}px)`}}>
      <View shot={shot} blur={9} />
      <Vignette />
      <Float3D delay={4} x={wide ? 1060 : 140} y={wide ? 70 : 330} w={800} tilt={wide ? [4, -18] : [4, -12]}>
        <Glass style={{padding: '40px 44px', zoom: wide ? 0.82 : 1}}>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Ring p={k(f, 14, 60)} label="Video" />
            <Ring p={k(f, 20, 66)} label="Foto" />
            <Ring p={k(f, 26, 72)} label="Latihan" />
          </div>
          <div style={{fontSize: 30, fontWeight: 500, opacity: 0.75, margin: '34px 0 10px', display: 'flex', justifyContent: 'space-between'}}>
            <span>Servis kami</span>
            <span>›</span>
          </div>
          {SERVICES.map((s, i) => {
            const on = k(f, 26 + i * 9, 32 + i * 9);
            return (
              <div key={s} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,.15)'}}>
                <span style={{fontSize: 38, fontWeight: on > 0.5 ? 600 : 400, opacity: 0.6 + on * 0.4}}>{s}</span>
                <Toggle on={on} />
              </div>
            );
          })}
          <div style={{borderTop: '1px solid rgba(255,255,255,.15)', paddingTop: 22, fontSize: 28, opacity: 0.75}}>26 tahun pengalaman</div>
        </Glass>
      </Float3D>
    </AbsoluteFill>
  );
};

// ===================================================== W5 · Training at the phone rig
const MODS = ['Mobile Filmmaking', 'Smartphone Photography', 'Social Media Reels', 'Content Strategy'];

export const W5Training: React.FC = () => {
  const f = useCurrentFrame();
  const t = k(f, 0, 140, io);
  const wide = useWide();
  const tx = wide ? 0.35 : 0.95;
  const shot: Shot = {pos: mix3(wide ? [0.0, 0.95, 2.4] : [0.1, 0.85, 1.95], wide ? [0.25, 0.8, 1.9] : [0.4, 0.72, 1.45], t), target: mix3([tx, 0.5, 0.45], [tx, 0.46, 0.45], t), fov: wide ? 60 : 46};
  const whip = 1 - k(f, 0, 12, io);
  const out = k(f, 126, 140);
  return (
    <AbsoluteFill style={{transform: `translateX(${whip * (wide ? 1200 : 700)}px)`, filter: `blur(${whip * 30 + out * 12}px)`}}>
      <View shot={shot} />
      <Vignette />
      <Float3D delay={18} x={wide ? 140 : 70} y={wide ? 140 : 1060} w={720} tilt={[6, 10]} out={out}>
        <Glass style={{padding: '36px 40px', zoom: wide ? 0.92 : 1}}>
          <div style={{fontSize: 24, letterSpacing: 6, color: W.lime, fontWeight: 600}}>TRAINING PROGRAMS</div>
          <div style={{fontSize: 52, fontWeight: 600, lineHeight: 1.15, margin: '12px 0 18px'}}>Belajar buat content sendiri</div>
          {MODS.map((m, i) => {
            const c = k(f, 36 + i * 10, 44 + i * 10);
            return (
              <div key={m} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '10px 0'}}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 23,
                    border: '3px solid rgba(255,255,255,.5)',
                    background: c > 0.5 ? W.lime : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: W.dark,
                    fontWeight: 800,
                    fontSize: 28,
                    transform: `scale(${1 + Math.sin(c * Math.PI) * 0.25})`,
                  }}
                >
                  {c > 0.5 ? '✓' : ''}
                </div>
                <span style={{fontSize: 36}}>{m}</span>
              </div>
            );
          })}
        </Glass>
      </Float3D>
      <div style={{position: 'absolute', top: wide ? 860 : 1720, left: wide ? 140 : 0, width: wide ? 720 : '100%', display: 'flex', justifyContent: 'center', gap: 18, opacity: 1 - out}}>
        {['Individu', 'Syarikat', 'Agensi'].map((a, i) => {
          const s = useSpring(80 + i * 6, 11, 170);
          return (
            <div key={a} style={{transform: `scale(${s})`}}>
              <Glass style={{padding: '16px 34px', fontSize: 36, fontWeight: 600}} radius={40}>
                {a}
              </Glass>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===================================================== W6 · Push into laptop → dot-matrix → fullscreen editor + export
const SCREEN: [number, number, number] = [0, 0.457, -0.268];

export const W6Export: React.FC = () => {
  const f = useCurrentFrame();
  const push = k(f, 0, 50, io);
  const shot: Shot = {pos: mix3([0, 0.9, 2.3], [0, 0.6, 0.55], push), target: SCREEN, fov: 46};
  // dot matrix: dot radius grows over the 3D view, then shrinks revealing 2D editor
  const d1 = k(f, 40, 52, io);
  const d2 = k(f, 52, 64, io);
  const exportP = interpolate(f, [96, 150], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const click = useSpring(92, 10, 200);
  const done = useSpring(152, 13, 140);
  const out = k(f, 186, 200);
  const wide = useWide();
  const dots = (rad: number) => ({
    WebkitMaskImage: `radial-gradient(circle, #000 ${rad}px, transparent ${rad + 0.8}px)`,
    WebkitMaskSize: '26px 26px',
  });
  return (
    <AbsoluteFill style={{background: '#06080e'}}>
      {f < 54 && (
        <AbsoluteFill style={d1 > 0 ? dots(13 * (1 - d1) + 0.5 + 18 * (1 - d1)) : undefined}>
          <View shot={shot} />
        </AbsoluteFill>
      )}
      {f >= 50 && (
        <AbsoluteFill style={{...(d2 < 1 ? dots(d2 * 19) : {}), opacity: 1 - out, filter: `blur(${out * 14}px)`}}>
          <AbsoluteFill style={{background: '#101216'}} />
          <div style={{position: 'absolute', top: wide ? 30 : 560, left: wide ? 300 : 0, width: wide ? 1320 : 1080, height: wide ? 825 : 675, transform: `scale(${(wide ? 1.12 : 1.25) - k(f, 52, 120) * 0.2})`, transformOrigin: '50% 50%'}}>
            <LiveCanvas w={wide ? 1320 : 1080} h={wide ? 825 : 675} draw={(c, Wd, Hd) => drawEditor(c, Wd, Hd, f, exportP)} />
          </div>
          {/* export button + cursor */}
          <div style={{position: 'absolute', top: wide ? 900 : 1360, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
            <div style={{transform: `scale(${1 - Math.sin(Math.min(click, 1) * Math.PI) * 0.08})`}}>
              <Pill text="Export 9:16 ↗" color={W.lime} textColor={W.dark} size={46} />
            </div>
          </div>
          <svg width="54" height="60" viewBox="0 0 24 26" style={{position: 'absolute', left: interpolate(f, [66, 90], wide ? [1500, 1020] : [900, 560], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), top: interpolate(f, [66, 90], wide ? [1060, 940] : [1700, 1400], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
            <path d="M2 2 L2 21 L7.5 16 L11 24 L14.5 22.5 L11 15 L18 15 Z" fill="#fff" stroke="#000" strokeWidth="1.2" />
          </svg>
          <div style={{position: 'absolute', top: wide ? 80 : 280, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: done, transform: `translateY(${(1 - done) * -80}px) scale(${0.8 + done * 0.2})`}}>
            <Glass style={{padding: '28px 44px', display: 'flex', alignItems: 'center', gap: 22}}>
              <div style={{width: 64, height: 64, borderRadius: 32, background: W.lime, color: W.dark, fontWeight: 800, fontSize: 38, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✓</div>
              <div>
                <div style={{fontSize: 40, fontWeight: 600}}>Video siap!</div>
                <div style={{fontSize: 28, opacity: 0.8}}>Sedia untuk dimuat naik</div>
              </div>
            </Glass>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// ===================================================== W7 · End card on bokeh
const SL = 6;
export const W7End: React.FC = () => {
  const f = useCurrentFrame();
  const inn = k(f, 0, 14);
  const {width: VW, height: VH} = useVideoConfig();
  const wide = VW > VH;
  const CX = VW / 2;
  const wmW = wide ? 500 : 560;
  const wmH = Math.round(wmW * (389 / 1288));
  const btn = useSpring(70, 13, 140);
  const bokeh = new Array(26).fill(0).map((_, i) => ({
    x: random(`bx${i}`) * VW,
    y: random(`by${i}`) * VH,
    r: 30 + random(`br${i}`) * 110,
    c: random(`bc${i}`) > 0.6 ? '255,190,110' : random(`bc${i}`) > 0.3 ? '140,170,255' : '255,240,220',
  }));
  return (
    <AbsoluteFill style={{opacity: inn, background: '#05070d'}}>
      <AbsoluteFill style={{filter: 'blur(16px) brightness(.75)', transform: `scale(${1.15 + f * 0.0008})`}}>
        <LiveCanvas w={VW / 2} h={VH / 2} draw={(c, Wd, Hd) => drawCity(c, Wd, Hd)} style={{width: VW, height: VH}} />
      </AbsoluteFill>
      {bokeh.map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: b.x - b.r + Math.sin(f / 40 + i) * 20,
            top: b.y - b.r,
            width: b.r * 2,
            height: b.r * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${b.c},.35) 0%, rgba(${b.c},.18) 60%, transparent 72%)`,
          }}
        />
      ))}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,20,50,.35), rgba(5,7,13,.7))'}} />
      {/* icon tile */}
      {(() => {
        const s = useSpring(6, 12, 120);
        return (
          <div style={{position: 'absolute', left: CX - 90, top: wide ? 90 : 560, width: 180, height: 180, borderRadius: 44, background: W.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s}) rotateY(${(1 - s) * 180}deg)`, boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
            <Img src={staticFile('icon-dark.png')} style={{height: 124}} />
          </div>
        );
      })()}
      {/* wordmark slices spin in */}
      <div style={{position: 'absolute', left: CX - wmW / 2, top: wide ? 300 : 800, width: wmW, height: wmH, perspective: 900}}>
        {new Array(SL).fill(0).map((_, i) => {
          const s = useSpring(18 + i * 3, 13, 130);
          const sw = wmW / SL;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: i * sw,
                top: 0,
                width: sw + 1,
                height: wmH,
                backgroundImage: `url(${staticFile('wordmark-white.png')})`,
                backgroundSize: `${wmW}px ${wmH}px`,
                backgroundPosition: `${-i * sw}px 0`,
                opacity: s,
                transform: `rotateY(${(1 - s) * 90}deg) translateY(${(1 - s) * 40}px)`,
                filter: `blur(${(1 - s) * 8}px)`,
              }}
            />
          );
        })}
      </div>
      <div style={{position: 'absolute', top: wide ? 480 : 1000, width: '100%', textAlign: 'center', fontFamily: W.font, color: '#fff', opacity: k(f, 40, 60)}}>
        <div style={{fontSize: 26, letterSpacing: 6, opacity: 0.8}}>PRODUCTION · TRAINING · MOBILEGRAPHY</div>
        <div style={{fontSize: wide ? 42 : 48, fontWeight: 300, marginTop: wide ? 24 : 40, lineHeight: 1.35}}>
          Hubungi kami untuk bantu
          <br />
          bisnes anda <b style={{fontWeight: 600}}>berkembang.</b>
        </div>
      </div>
      <div style={{position: 'absolute', top: wide ? 730 : 1290, left: CX - wmW / 2, width: wmW, opacity: btn, transform: `translateY(${(1 - btn) * 60}px)`}}>
        <Glass style={{padding: wide ? '22px 0' : '30px 0', textAlign: 'center'}} radius={70}>
          <div style={{fontSize: 30, opacity: 0.85}}>WhatsApp Dee</div>
          <div style={{fontSize: 56, fontWeight: 600, letterSpacing: 2, color: W.lime}}>011-1620 0864</div>
        </Glass>
      </div>
      <div style={{position: 'absolute', top: wide ? 940 : 1530, width: '100%', textAlign: 'center', fontFamily: W.font, color: '#cfd6e6', fontSize: 30, opacity: k(f, 90, 110)}}>
        @pocket_production · pocketproduction.my
      </div>
    </AbsoluteFill>
  );
};
