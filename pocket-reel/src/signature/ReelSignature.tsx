import React, {useEffect, useMemo, useState} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Audio, continueRender, delayRender, Img, interpolate, random, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {RoundedBox} from '@react-three/drei';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/900.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/playfair-display/900-italic.css';
import {B, Cursor, DarkBg, Glass, io, k, KineticLine, LimeBg, Mask, Pill, Stamp, Strike, useSpr, Wipe, Words} from './kit';

// Style 06 "Pocket Signature" — same content/structure as REF-04, Pocket brand kit, mixes Styles 01–05.
export const T = {hook: 0, chat: 90, dulu: 240, lock: 390, kit: 480, board: 630, motion: 765, audio: 945, why: 1125, end: 1275};
export const SIG_TOTAL = 1410;
const CMD = '/pocketstyle edit macam biasa';

// light (lime) scenes — the persistent header flips colours on these
const LIME: [number, number][] = [
  [T.dulu, T.lock],
  [T.kit, T.board],
  [T.audio, T.why],
];
const isLime = (f: number) => LIME.some(([a, b]) => f >= a + 6 && f < b + 6);

const Show: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};
const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: B.mono, fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', ...style}}>{children}</div>
);

// =============================================================== persistent header (grows out of the hook)
const Header: React.FC = () => {
  const f = useCurrentFrame();
  const lime = isLime(f);
  const shrink = k(f, 64, 86, io);
  const size = interpolate(shrink, [0, 1], [96, 60]);
  const top = interpolate(shrink, [0, 1], [720, 150]);
  const vis = k(f, 30, 44) * (1 - k(f, T.end - 6, T.end + 6));
  const w = (i: number) => k(f, 30 + i * 5, 40 + i * 5);
  const sp = (i: number, c: React.ReactNode) => (
    <span style={{display: 'inline-block', marginRight: '0.24em', opacity: w(i), filter: `blur(${(1 - w(i)) * 10}px)`, transform: `translateY(${(1 - w(i)) * 14}px)`}}>{c}</span>
  );
  return (
    <div style={{position: 'absolute', left: 70, top, opacity: vis, fontFamily: B.font, fontWeight: 800, fontSize: size, lineHeight: 1.1, letterSpacing: -size * 0.02, color: lime ? B.ink : '#fff'}}>
      {sp(0, 'Kami')}
      {sp(1, 'taip')}
      {sp(2, <span style={{background: lime ? B.ink : B.lime, color: lime ? B.lime : B.ink, padding: '0 .16em', borderRadius: 10}}>ni je</span>)}
      <br />
      {sp(3, 'dekat')}
      {sp(4, 'Claude.')}
    </div>
  );
};

// =============================================================== 1. hook
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <DarkBg />
      <div style={{position: 'absolute', left: 70, top: 330}}>
        <KineticLine text="Nak edit" at={2} size={150} out={k(f, 62, 80)} />
        <KineticLine text="video?" at={14} size={150} out={k(f, 62, 80)} />
      </div>
    </AbsoluteFill>
  );
};

// =============================================================== 2. chat with Claude
const STYLES = ['Kinetic UI', 'Minimal', '3D World', 'Cetak Klasik'];
const Chat: React.FC = () => {
  const f = useCurrentFrame();
  const card = useSpr(f - T.chat - 2, 15, 120);
  const typed = Math.floor(interpolate(f, [T.chat + 14, T.chat + 62], [0, CMD.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const reply = useSpr(f - T.chat - 76, 14, 150);
  const pick = f >= T.chat + 108;
  const board = useSpr(f - T.chat - 118, 14, 140);
  // cursor path: send button → first style chip
  const cx = interpolate(f, [T.chat + 50, T.chat + 66, T.chat + 92, T.chat + 104], [980, 850, 850, 230], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  const cy = interpolate(f, [T.chat + 50, T.chat + 66, T.chat + 92, T.chat + 104], [1500, 812, 812, 1000], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  const press = Math.max(0, 1 - Math.abs(f - (T.chat + 68)) / 4) + Math.max(0, 1 - Math.abs(f - (T.chat + 107)) / 4);
  const out = k(f, T.dulu - 2, T.dulu + 10);
  return (
    <AbsoluteFill>
      <DarkBg />
      <div style={{opacity: 1 - out, filter: `blur(${out * 10}px)`}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 560, opacity: card, transform: `translateY(${(1 - card) * 80}px) perspective(1600px) rotateX(${(1 - card) * 20}deg)`}}>
          <Glass style={{padding: 30}}>
            <div style={{display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(247,253,146,.14)', color: B.lime, borderRadius: 12, padding: '8px 16px', fontFamily: B.mono, fontSize: 24}}>▶ reel_pocket.mov · 0:58</div>
            <div style={{marginTop: 22, display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{flex: 1, fontFamily: B.mono, fontSize: 36, color: '#fff', minHeight: 50}}>
                <span style={{color: B.lime}}>{CMD.slice(0, Math.min(typed, 12))}</span>
                {CMD.slice(12, typed)}
                <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0}}>|</span>
              </div>
              <div style={{width: 64, height: 64, borderRadius: 32, background: typed >= CMD.length ? B.lime : 'rgba(255,255,255,.15)', color: B.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 800}}>↑</div>
            </div>
          </Glass>
        </div>
        <div style={{position: 'absolute', left: 60, right: 60, top: 820, opacity: reply, transform: `translateY(${(1 - reply) * 60}px)`}}>
          <Glass style={{padding: 30}}>
            <div style={{fontSize: 36, fontWeight: 600}}>Style nak yang mana?</div>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 20}}>
              {STYLES.map((s, i) => (
                <div key={s} style={{padding: '12px 22px', borderRadius: 40, fontSize: 28, fontWeight: 600, background: pick && i === 0 ? B.lime : 'rgba(255,255,255,.1)', color: pick && i === 0 ? B.ink : '#fff', border: '1.5px solid rgba(255,255,255,.18)'}}>
                  {s}
                </div>
              ))}
            </div>
            <div style={{marginTop: 26, opacity: board, transform: `translateY(${(1 - board) * 30}px)`}}>
              <Mono style={{color: B.lime}}>Storyboard v1 ✓</Mono>
              <div style={{display: 'flex', gap: 12, marginTop: 14}}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Img key={n} src={staticFile(`style06/t${n}.jpg`)} style={{width: 168, height: 298, objectFit: 'cover', borderRadius: 14, border: '1.5px solid rgba(255,255,255,.2)'}} />
                ))}
              </div>
            </div>
          </Glass>
        </div>
        {f > T.chat + 48 && f < T.chat + 125 && <Cursor x={cx} y={cy} press={Math.min(1, press)} />}
      </div>
    </AbsoluteFill>
  );
};

// =============================================================== 3. "Dulu?" (lime page)
const Dulu: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, T.lock - 2, T.lock + 10);
  return (
    <Wipe start={T.dulu} cx={540} cy={1100}>
      <LimeBg />
      <div style={{position: 'absolute', left: 70, right: 70, top: 470, opacity: 1 - out}}>
        <Words w={['Dulu?']} at={T.dulu + 10} size={130} color={B.ink} weight={900} />
        <div style={{marginTop: 20}}>
          <Words w={['Nak', 'edit', 'video,', '\n', 'kena', 'brief', 'dari', ['awal.', {color: B.orange}]]} at={T.dulu + 24} size={84} color={B.ink} step={3} />
        </div>
        <div style={{marginTop: 50, display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '0 22px', fontSize: 76, color: B.ink}}>
          {[
            {t: 'Font', st: {fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 900}},
            {t: 'lain,', st: {fontFamily: B.mono, fontWeight: 700}},
            {t: 'colour', st: {fontFamily: B.font, fontWeight: 900, color: B.orange}},
            {t: 'lain.', st: {fontFamily: B.font, fontWeight: 900, color: 'transparent', WebkitTextStroke: `3px ${B.ink}`}},
          ].map((x, i) => {
            const v = useSpr(f - (T.dulu + 66 + i * 6), 11, 190);
            return (
              <span key={i} style={{display: 'inline-block', transform: `scale(${v}) rotate(${(1 - v) * (i % 2 ? 20 : -20)}deg)`, ...(x.st as React.CSSProperties)}}>
                {x.t}
              </span>
            );
          })}
        </div>
        <div style={{position: 'relative', height: 150}}>
          <Stamp at={T.dulu + 100} text="TAKDE CONSISTENCY" size={48} rot={-6} style={{left: 0, top: 40}} />
        </div>
      </div>
    </Wipe>
  );
};

// =============================================================== 4. lock it in one skill (dark)
const Lock: React.FC = () => {
  const f = useCurrentFrame();
  const shut = k(f, T.lock + 30, T.lock + 40, io);
  const pop = useSpr(f - T.lock - 18, 10, 200);
  const split = Math.max(0, 1 - Math.abs(f - (T.lock + 40)) / 8) * 10;
  const out = k(f, T.kit - 2, T.kit + 10);
  return (
    <Wipe start={T.lock} cx={540} cy={900}>
      <DarkBg />
      <div style={{position: 'absolute', left: 70, right: 70, top: 640, opacity: 1 - out}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
          <Words w={['So', 'kami', ['lock', {color: B.lime, textShadow: `-${split}px 0 rgba(255,60,90,.8), ${split}px 0 rgba(60,220,255,.8)`}]]} at={T.lock + 6} size={120} color="#fff" weight={900} />
          <svg width={130} height={150} viewBox="0 0 26 30" style={{transform: `scale(${pop})`}}>
            <path d={`M7 ${13 - shut * 0} V9 a6 6 0 0 1 12 0 V${13 - (1 - shut) * 5}`} fill="none" stroke={B.lime} strokeWidth={3} strokeLinecap="round" transform={`translate(0 ${-(1 - shut) * 4})`} />
            <rect x={3} y={13} width={20} height={15} rx={4} fill={B.lime} />
            <circle cx={13} cy={20} r={2.4} fill={B.ink} />
          </svg>
        </div>
        <Words w={['semua', 'dalam', '\n', 'satu', ['skill.', {color: B.lime}]]} at={T.lock + 26} size={110} color="#fff" weight={900} style={{marginTop: 8}} />
      </div>
    </Wipe>
  );
};

// =============================================================== 5. brand kit card (lime page)
const SW: [string, string, string][] = [
  ['#0D0E13', 'Latar', '#fff'],
  ['#F7FD92', 'Aksen', B.ink],
  ['#FF6B3D', 'Api', '#fff'],
  ['#FFFFFF', 'Teks', B.ink],
];
const Kit: React.FC = () => {
  const f = useCurrentFrame();
  const card = useSpr(f - T.kit - 8, 15, 120);
  const logo = useSpr(f - T.kit - 92, 13, 150);
  const out = k(f, T.board - 2, T.board + 10);
  return (
    <Wipe start={T.kit} cx={540} cy={1200}>
      <LimeBg />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 470, opacity: card, transform: `translateY(${(1 - card) * 80}px) perspective(1600px) rotateX(${(1 - card) * 18}deg)`}}>
          <Glass light style={{padding: 36}}>
            <Mono style={{color: B.lime}}>Pocket brand kit · locked</Mono>
            <div style={{display: 'flex', gap: 30, marginTop: 24, alignItems: 'stretch'}}>
              <div style={{flex: 1, background: '#fff', color: B.ink, borderRadius: 26, padding: 26}}>
                <div style={{fontSize: 150, fontWeight: 900, lineHeight: 1}}>Aa</div>
                <div style={{fontSize: 26, fontWeight: 600, marginTop: 14}}>Poppins je.</div>
                <div style={{fontSize: 22, color: '#666'}}>900 · 800 · 600</div>
              </div>
              <div style={{width: 300, display: 'flex', flexDirection: 'column', gap: 12}}>
                {SW.map(([hex, name, fg], i) => {
                  const s = useSpr(f - (T.kit + 30 + i * 10), 12, 180);
                  return (
                    <div key={hex} style={{flex: 1, borderRadius: 18, background: hex, color: fg, padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 24, border: '1.5px solid rgba(255,255,255,.2)', opacity: s, transform: `translateX(${(1 - s) * 80}px)`}}>
                      <span>{name}</span>
                      <span style={{fontFamily: B.mono, fontSize: 18, opacity: 0.8}}>{hex}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{marginTop: 26, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: logo, transform: `translateY(${(1 - logo) * 20}px)`}}>
              <Img src={staticFile('logo-white.png')} style={{height: 80}} />
              <div style={{background: B.lime, color: B.ink, fontFamily: B.mono, fontWeight: 700, fontSize: 22, padding: '8px 16px', borderRadius: 10}}>🔒 LOCKED</div>
            </div>
          </Glass>
        </div>
      </div>
    </Wipe>
  );
};

// =============================================================== 6. storyboard → "go" (dark)
const BOARD: [number, string][] = [
  [1, '01 · Hook'],
  [3, '02 · Insight'],
  [4, '03 · Showcase'],
];
const Board: React.FC = () => {
  const f = useCurrentFrame();
  const go = useSpr(f - T.board - 92, 9, 200);
  const out = k(f, T.motion - 2, T.motion + 10);
  return (
    <Wipe start={T.board} cx={540} cy={900}>
      <DarkBg />
      <div style={{opacity: 1 - out}}>
        <Mono style={{position: 'absolute', left: 70, top: 470, color: B.lime, opacity: k(f, T.board + 8, T.board + 18)}}>Storyboard video ni · v1 → v5</Mono>
        {BOARD.map(([n, lbl], i) => {
          const s = useSpr(f - (T.board + 14 + i * 10), 14, 130);
          const rot = (i - 1) * 7;
          return (
            <div key={n} style={{position: 'absolute', left: 140 + i * 270, top: 600 + Math.abs(i - 1) * 40, width: 260, opacity: s, transform: `translateY(${(1 - s) * 120}px) rotate(${rot * s}deg)`, transformOrigin: '50% 120%'}}>
              <div style={{background: '#fff', borderRadius: 22, padding: 10, boxShadow: '0 30px 60px rgba(0,0,0,.5)'}}>
                <Img src={staticFile(`style06/t${n}.jpg`)} style={{width: 240, height: 426, objectFit: 'cover', borderRadius: 14, display: 'block'}} />
                <div style={{fontFamily: B.mono, fontSize: 20, fontWeight: 700, color: B.ink, padding: '10px 4px 2px'}}>{lbl}</div>
              </div>
            </div>
          );
        })}
        <div style={{position: 'absolute', left: 0, right: 0, top: 1200, display: 'flex', justifyContent: 'center'}}>
          <div style={{background: B.lime, color: B.ink, fontFamily: B.font, fontWeight: 900, fontSize: 52, padding: '14px 44px', borderRadius: 50, transform: `scale(${go})`, boxShadow: `0 0 60px ${B.lime}88`}}>"go" ✓</div>
        </div>
      </div>
    </Wipe>
  );
};

// =============================================================== 7. motion — 3D lime tile with squash & stretch (dark)
const useTex = (src: string) => {
  const [h] = useState(() => delayRender(src));
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    new THREE.TextureLoader().load(src, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      setTex(t);
      continueRender(h);
    });
  }, [src, h]);
  return tex;
};
const bounce = (f: number) => {
  // 3 hops across the stage; returns x, y (height), squash factor
  const t = Math.max(0, f - T.motion - 10) / 150;
  const x = interpolate(t, [0, 1], [-1.45, 1.45], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const ph = (t * 3) % 1;
  const y = Math.abs(Math.sin(ph * Math.PI)) * 1.8 * (1 - t * 0.35);
  const squash = ph < 0.08 || ph > 0.92 ? 1 - Math.min(ph, 1 - ph) / 0.08 : 0;
  return {x, y, squash, vy: Math.cos(ph * Math.PI)};
};
const Tile: React.FC = () => {
  const f = useCurrentFrame();
  const icon = useTex(staticFile('icon-dark.png'));
  const ghosts = [0, 3, 6, 9];
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[-3, 5, 5]} intensity={2.2} />
      {ghosts.map((d, gi) => {
        const b = bounce(f - d);
        const st = 1 + Math.abs(b.vy) * 0.18 * (1 - b.squash); // stretch along motion
        const sq = b.squash * 0.28; // squash on contact
        return (
          <group key={gi} position={[b.x, -2.0 + b.y + 0.45 * (1 - sq), 0]} scale={[(1 + sq) / st, (1 - sq) * st, 1]} rotation={[0, 0.3, -b.vy * 0.25]}>
            <RoundedBox args={[0.9, 0.9, 0.3]} radius={0.18} smoothness={6}>
              <meshStandardMaterial color={B.lime} roughness={0.35} toneMapped={false} transparent opacity={gi === 0 ? 1 : 0.18 - gi * 0.03} />
            </RoundedBox>
            {gi === 0 && icon && (
              <mesh position={[0, 0, 0.152]}>
                <planeGeometry args={[0.44, 0.67]} />
                <meshBasicMaterial map={icon} transparent toneMapped={false} />
              </mesh>
            )}
          </group>
        );
      })}
      <mesh position={[0, -2.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 0.02]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
    </>
  );
};
const Motion: React.FC = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const b = bounce(f);
  const out = k(f, T.audio - 2, T.audio + 10);
  const g = useSpr(f - T.motion - 90, 14, 140);
  return (
    <Wipe start={T.motion} cx={540} cy={1100}>
      <DarkBg />
      <div style={{opacity: 1 - out}}>
        <AbsoluteFill style={{top: 120}}>
          <ThreeCanvas width={width} height={height} camera={{fov: 40, position: [0, 0, 10]}}>
            <Tile />
          </ThreeCanvas>
        </AbsoluteFill>
        <Mono style={{position: 'absolute', left: 70, top: 640, opacity: k(f, T.motion + 20, T.motion + 30)}}>stretch ikut arah gerak</Mono>
        <Mono style={{position: 'absolute', left: 70, top: 690, color: B.lime, opacity: k(f, T.motion + 50, T.motion + 60)}}>squash 14% · bila mendarat</Mono>
        <div style={{position: 'absolute', right: 60, top: 470, width: 380, opacity: g, transform: `translateY(${(1 - g) * 40}px)`}}>
          <Glass style={{padding: 22}}>
            <Mono style={{fontSize: 18}}>overshoot 7%</Mono>
            <svg width={330} height={130} style={{marginTop: 8}}>
              <path d="M0,118 C70,118 80,10 150,6 S240,26 330,22" fill="none" stroke={B.lime} strokeWidth={5} strokeDasharray={500} strokeDashoffset={500 * (1 - k(f, T.motion + 96, T.motion + 120))} />
            </svg>
          </Glass>
        </div>
      </div>
    </Wipe>
  );
};

// =============================================================== 8. audio balance + compress (lime page)
const Audio8: React.FC = () => {
  const f = useCurrentFrame();
  const fix = k(f, T.audio + 60, T.audio + 96, io);
  const lufs = Math.round(interpolate(fix, [0, 1], [-27, -14]));
  const file = useSpr(f - T.audio - 110, 13, 150);
  const out = k(f, T.why - 2, T.why + 10);
  return (
    <Wipe start={T.audio} cx={540} cy={1100}>
      <LimeBg />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: 60, right: 60, top: 520}}>
          <Glass light style={{padding: 28, height: 300, boxSizing: 'border-box'}}>
            <Mono style={{color: fix < 0.5 ? B.orange : B.lime}}>{fix < 0.5 ? 'suara · sebelum' : 'selepas · master'}</Mono>
            <div style={{display: 'flex', alignItems: 'center', gap: 5, height: 200, marginTop: 10}}>
              {new Array(60).fill(0).map((_, i) => {
                const noisy = 0.1 + random(`w${i}${Math.floor(f / 3)}`) * 0.85;
                const clean = 0.45 + Math.abs(Math.sin(i * 0.5 + f / 6)) * 0.4;
                const h = interpolate(fix, [0, 1], [noisy, clean]);
                return <div key={i} style={{flex: 1, height: `${h * 100}%`, borderRadius: 3, background: fix < 0.5 ? B.orange : B.lime, opacity: k(f, T.audio + 10 + i * 0.3, T.audio + 16 + i * 0.3)}} />;
              })}
            </div>
          </Glass>
        </div>
        <div style={{position: 'absolute', left: 60, top: 860, display: 'flex', gap: 20}}>
          <div style={{width: 470, height: 190, borderRadius: 28, background: B.ink, color: '#fff', padding: '24px 30px', boxSizing: 'border-box', opacity: k(f, T.audio + 50, T.audio + 60)}}>
            <div style={{fontFamily: B.font, fontWeight: 900, fontSize: 80, color: fix > 0.5 ? B.lime : '#fff'}}>{lufs}</div>
            <Mono>LUFS · master</Mono>
          </div>
          <div style={{width: 470, height: 190, borderRadius: 28, background: '#fff', color: B.ink, padding: '24px 30px', boxSizing: 'border-box', opacity: file, transform: `translateY(${(1 - file) * 40}px)`}}>
            <div style={{fontFamily: B.font, fontWeight: 900, fontSize: 80}}>
              28.8<span style={{fontSize: 34}}>MB</span>
            </div>
            <Mono style={{color: '#777'}}>final_9x16.mp4</Mono>
          </div>
        </div>
      </div>
    </Wipe>
  );
};

// =============================================================== 9. why it fits (dark, Style 02 masks)
const WHY: [number, React.ReactNode][] = [
  [T.why + 40, <>Takyah explain <b style={{color: B.lime}}>panjang.</b></>],
  [T.why + 66, <>Semua video, stay <b style={{color: B.lime}}>consistent.</b></>],
  [T.why + 92, <>Kami brief <b style={{color: B.lime}}>idea</b> je.</>],
];
const Why: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, T.end - 4, T.end + 8);
  return (
    <Wipe start={T.why} cx={540} cy={900}>
      <DarkBg />
      <div style={{position: 'absolute', left: 70, right: 70, top: 520, opacity: 1 - out, color: '#fff', fontFamily: B.font}}>
        <Mask at={T.why + 10} style={{fontSize: 96, fontWeight: 900, lineHeight: 1.08}}>
          Kenapa sesuai
        </Mask>
        <Mask at={T.why + 16} style={{fontSize: 96, fontWeight: 900, lineHeight: 1.08}}>
          untuk kami?
        </Mask>
        <div style={{height: 2, background: 'rgba(255,255,255,.25)', marginTop: 40, width: `${k(f, T.why + 30, T.why + 56) * 100}%`}} />
        {WHY.map(([at, t], i) => (
          <div key={i} style={{display: 'flex', gap: 24, alignItems: 'baseline', marginTop: 34}}>
            <Mono style={{color: B.lime, opacity: k(f, at - 4, at + 4)}}>0{i + 1}</Mono>
            <Mask at={at} style={{fontSize: 56, fontWeight: 600}}>
              {t}
            </Mask>
          </div>
        ))}
      </div>
    </Wipe>
  );
};

// =============================================================== 10. end
const End: React.FC = () => {
  const f = useCurrentFrame();
  const bar = k(f, T.end + 8, T.end + 26, io);
  const txt = k(f, T.end + 18, T.end + 28);
  const logo = useSpr(f - T.end - 70, 13, 140);
  const fade = k(f, SIG_TOTAL - 26, SIG_TOTAL - 2);
  return (
    <AbsoluteFill style={{opacity: 1 - fade}}>
      <DarkBg />
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', color: '#fff', fontFamily: B.font}}>
        <div style={{width: 120 + bar * 560, height: 120, borderRadius: 60, background: B.lime, boxShadow: `0 0 80px ${B.lime}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
          <span style={{fontFamily: B.mono, fontWeight: 700, fontSize: 54, color: B.ink, whiteSpace: 'nowrap', opacity: txt, filter: `blur(${(1 - txt) * 8}px)`}}>/pocketstyle</span>
        </div>
        <Words w={['Video', 'yang', 'anda', 'tengok', 'ni', '\n', 'pun', 'dibuat', 'guna', ['ni', {color: B.lime}], ['je.', {color: B.lime}]]} at={T.end + 34} size={50} color="#fff" weight={600} step={2} style={{marginTop: 46, lineHeight: 1.3}} />
        <Mono style={{marginTop: 34, opacity: k(f, T.end + 60, T.end + 70)}}>Next video? Satu command je.</Mono>
        <Img src={staticFile('logo-white.png')} style={{width: 360, marginTop: 70, opacity: logo, transform: `scale(${0.85 + logo * 0.15})`}} />
      </div>
    </AbsoluteFill>
  );
};

type Cue = [number, string, number];
const CUES: Cue[] = [
  [2, 'glitch', 0.35],
  [14, 'whoosh', 0.4],
  [T.chat + 4, 'min_swish', 0.4],
  ...new Array(10).fill(0).map((_, i) => [T.chat + 14 + i * 5, 'min_tick', 0.22] as Cue),
  [T.chat + 68, 'click', 0.8],
  [T.chat + 76, 'pop', 0.5],
  [T.chat + 107, 'click', 0.8],
  [T.chat + 118, 'min_swish', 0.4],
  [T.dulu, 'min_whoosh', 0.5],
  ...[0, 1, 2, 3].map((i) => [T.dulu + 66 + i * 6, 'pop', 0.45] as Cue),
  [T.dulu + 100, 'min_thump', 0.7],
  [T.lock, 'min_whoosh', 0.5],
  [T.lock + 38, 'click', 0.9],
  [T.lock + 40, 'glitch', 0.3],
  [T.kit, 'min_whoosh', 0.5],
  ...[0, 1, 2, 3].map((i) => [T.kit + 30 + i * 10, 'tick', 0.45] as Cue),
  [T.kit + 92, 'shimmer', 0.4],
  [T.board, 'min_whoosh', 0.5],
  ...[0, 1, 2].map((i) => [T.board + 14 + i * 10, 'min_swish', 0.35] as Cue),
  [T.board + 92, 'pop', 0.7],
  [T.motion, 'min_whoosh', 0.5],
  ...[0, 1, 2].map((i) => [T.motion + 10 + Math.round(((i + 1) * 150) / 3) - 2, 'min_thump', 0.45] as Cue),
  [T.audio, 'min_whoosh', 0.5],
  [T.audio + 60, 'min_swish', 0.45],
  [T.audio + 110, 'pop', 0.5],
  [T.why, 'min_whoosh', 0.5],
  ...WHY.map(([at]) => [at, 'min_tick', 0.4] as Cue),
  [T.end, 'min_whoosh', 0.5],
  [T.end + 70, 'min_chime', 0.6],
];

export const ReelSignature: React.FC<{music?: string}> = ({music = 'music_subclair.mp3'}) => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['400 40px Poppins', '600 40px Poppins', '800 40px Poppins', '900 40px Poppins', '400 20px "JetBrains Mono"', '700 20px "JetBrains Mono"', 'italic 900 40px "Playfair Display"'].map((x) => document.fonts.load(x))).then(() =>
      continueRender(h),
    );
  }, [h]);
  const pills = useMemo<[number, number, string][]>(
    () => [
      [T.chat + 76, T.chat + 106, 'dia tanya dulu,'],
      [T.chat + 106, T.chat + 148, 'tak terus buat video.'],
      [T.kit + 24, T.kit + 84, 'font, warna, logo,'],
      [T.kit + 84, T.kit + 146, 'semua dah lock.'],
      [T.board + 10, T.board + 44, 'video ni guna'],
      [T.board + 44, T.board + 76, 'method sama,'],
      [T.board + 76, T.board + 132, 'buat storyboard dulu.'],
      [T.motion + 14, T.motion + 84, 'motion fluid,'],
      [T.motion + 84, T.motion + 176, 'tak keras, tak flat.'],
      [T.audio + 14, T.audio + 100, 'suara balance,'],
      [T.audio + 100, T.audio + 176, 'siap compress.'],
    ],
    [],
  );
  return (
    <AbsoluteFill style={{background: B.bg}}>
      <Audio src={staticFile(music)} volume={(fr) => interpolate(fr, [0, 15, SIG_TOTAL - 45, SIG_TOTAL - 2], [0, 0.55, 0.55, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Show from={0} to={T.chat + 12}><Hook /></Show>
      <Show from={T.chat} to={T.dulu + 16}><Chat /></Show>
      <Show from={T.dulu} to={T.lock + 16}><Dulu /></Show>
      <Show from={T.lock} to={T.kit + 16}><Lock /></Show>
      <Show from={T.kit} to={T.board + 16}><Kit /></Show>
      <Show from={T.board} to={T.motion + 16}><Board /></Show>
      <Show from={T.motion} to={T.audio + 16}><Motion /></Show>
      <Show from={T.audio} to={T.why + 16}><Audio8 /></Show>
      <Show from={T.why} to={T.end + 12}><Why /></Show>
      <Show from={T.end} to={SIG_TOTAL}><End /></Show>
      <Header />
      <Pill lines={pills} />
    </AbsoluteFill>
  );
};
