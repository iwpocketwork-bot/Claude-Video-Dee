import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Bg, Card, k, Mono, T, useSpr} from '../tips/kit';
import {PhoneScene} from './Phone3D';
import {PHRASES, SC, TOTAL, W, WE} from './timing';
import {WORDS} from './words';

const CW = 860;
const CX = (1080 - CW) / 2;
const io = Easing.bezier(0.65, 0, 0.35, 1);

/** spoken words appear exactly when said (global frame g = local f + offset) */
export const VoWords: React.FC<{from: number; to: number; offset: number; size: number; color: string; accent?: Record<number, string>; out?: number; style?: React.CSSProperties; breaks?: number[]}> = ({
  from,
  to,
  offset,
  size,
  color,
  accent = {},
  out = 0,
  style,
  breaks = [],
}) => {
  const g = useCurrentFrame() + offset;
  const items: React.ReactNode[] = [];
  for (let i = from; i <= to; i++) {
    const txt = WORDS[i][0];
    if (txt === '—') continue;
    const v = k(g, W(i) - 2, W(i) + 7);
    items.push(
      <span
        key={i}
        style={{
          display: 'inline-block',
          marginRight: '0.24em',
          color: accent[i] ?? color,
          opacity: v * (1 - out),
          filter: `blur(${(1 - v) * 12 + out * 12}px)`,
          transform: `translateY(${(1 - v) * 16}px) scale(${0.96 + v * 0.04})`,
        }}
      >
        {txt}
      </span>,
    );
    if (breaks.includes(i)) items.push(<br key={`b${i}`} />);
  }
  return <div style={{fontFamily: T.font, fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: -size * 0.025, color, ...style}}>{items}</div>;
};

/** karaoke caption pill — current spoken word is bold, the rest grey */
export const KaraokePill: React.FC = () => {
  const g = useCurrentFrame();
  const ph = PHRASES.find(([a, b]) => g >= W(a) - 3 && g <= WE(b) + 8);
  if (!ph) return null;
  const [a, b] = ph;
  const v = k(g, W(a) - 3, W(a) + 5);
  const o = 1 - k(g, WE(b) + 2, WE(b) + 8);
  const words = [];
  for (let i = a; i <= b; i++) {
    if (WORDS[i][0] === '—') continue;
    const said = g >= W(i);
    words.push(
      <span key={i} style={{color: said ? T.ink : '#a3a3ad', fontWeight: said ? 700 : 500, marginRight: '0.25em'}}>
        {WORDS[i][0]}
      </span>,
    );
  }
  return (
    <div style={{position: 'absolute', top: 1600, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          background: '#fff',
          fontFamily: T.font,
          fontSize: 34,
          padding: '14px 30px',
          borderRadius: 40,
          boxShadow: '0 12px 30px rgba(0,0,0,.18)',
          opacity: v * o,
          transform: `translateY(${(1 - v) * 14}px) scale(${0.94 + v * 0.06})`,
          filter: `blur(${(1 - v) * 6}px)`,
          whiteSpace: 'nowrap',
          maxWidth: 1000,
        }}
      >
        {words}
      </div>
    </div>
  );
};

// ======================================================= hook (light) — "Nak video nampak pro?"
export const H1Hook: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, W(9) - 16, W(9) - 4);
  return (
    <AbsoluteFill>
      <Bg mode="light" />
      <div style={{position: 'absolute', left: 70, top: 140}}>
        <VoWords from={0} to={3} offset={0} size={80} color={T.ink} out={out} style={{whiteSpace: 'nowrap'}} />
      </div>
    </AbsoluteFill>
  );
};

/** realistic phone layer spanning hook + demo */
export const H2Phone: React.FC<{offset: number}> = ({offset}) => {
  const {width, height} = useVideoConfig();
  const f = useCurrentFrame();
  const g = f + offset;
  const out = k(g, SC.dulu - 4, SC.dulu + 8);
  return (
    <AbsoluteFill style={{opacity: 1 - out, filter: `blur(${out * 16}px)`}}>
      {/* soft contact shadow */}
      <div style={{position: 'absolute', left: 240, top: 1560, width: 600, height: 120, borderRadius: '50%', background: 'rgba(30,30,60,.22)', filter: 'blur(40px)', opacity: k(g, W(4), W(4) + 20)}} />
      <ThreeCanvas width={width} height={height} camera={{fov: 30, position: [0, 0, 7]}} gl={{antialias: true}}>
        <PhoneScene />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};

// ======================================================= "Dulu?" (dark)
export const H3Dulu: React.FC = () => {
  const f = useCurrentFrame();
  const o = SC.dulu;
  const g = f + o;
  const clear = k(g, W(33) - 6, W(33) + 4); // "Sebenarnya…" clears the list
  const six = useSpr(W(35) - o, 9, 170);
  const out = k(g, SC.cards - 2, SC.cards + 10);
  return (
    <Wipe>
      <Bg mode="dark" />
      <div style={{position: 'absolute', left: 70, top: 470, opacity: 1 - out}}>
        <VoWords from={22} to={22} offset={o} size={100} color="#fff" out={clear} />
        <div style={{marginTop: 10}}>
          <VoWords from={23} to={32} offset={o} size={78} color="#fff" out={clear} breaks={[26, 28, 30]} accent={{28: T.red, 30: T.red, 32: T.red}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 70, top: 640, opacity: 1 - out}}>
        <VoWords from={33} to={33} offset={o} size={56} color="rgba(255,255,255,.6)" style={{fontWeight: 500}} />
        <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 14}}>
          <VoWords from={34} to={37} offset={o} size={104} color="#fff" accent={{35: T.lime, 36: T.lime}} breaks={[34]} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 380,
            top: 84,
            width: 140,
            height: 140,
            borderRadius: 40,
            background: T.lime,
            color: T.ink,
            fontFamily: T.font,
            fontWeight: 800,
            fontSize: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${six}) rotate(${(1 - six) * -30 + 8}deg)`,
            boxShadow: `0 0 60px ${T.lime}66`,
          }}
        >
          6
        </div>
      </div>
    </Wipe>
  );
};

/** circle wipe identical to kit.Wipe but exported here for the header mask maths */
export const WIPE_DUR = 16;
const Wipe: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const r = k(f, 0, WIPE_DUR, io) * 2300;
  return <AbsoluteFill style={{clipPath: `circle(${r}px at 540px 900px)`}}>{children}</AbsoluteFill>;
};

// ======================================================= rule of thirds + window light (light)
export const H4Cards: React.FC = () => {
  const f = useCurrentFrame();
  const o = SC.cards;
  const g = f + o;
  const grid = k(g, W(41), W(41) + 14);
  const aim = k(g, W(42), W(44) + 4, io);
  const harshOn = useSpr(W(45) - o, 13, 150);
  const softOk = k(g, W(49), W(49) + 6);
  const free = useSpr(W(50) - o, 9, 190);
  const out = k(g, SC.stabil - 2, SC.stabil + 10);
  const rx = interpolate(aim, [0, 1], [50, 66.6]);
  const ry = interpolate(aim, [0, 1], [50, 38]);
  return (
    <Wipe>
      <Bg mode="light" />
      <div style={{opacity: 1 - out}}>
        <Card delay={6} x={CX} y={560} w={CW} h={484} tilt={[7, -5]}>
          <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
            <Img src={staticFile('tips2/photo.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.08 - aim * 0.05})`}} />
          </div>
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: `${(i * 100) / 3}%`, top: 0, height: `${grid * 100}%`, width: 2.5, background: 'rgba(255,255,255,.75)'}} />
              <div style={{position: 'absolute', top: `${(i * 100) / 3}%`, left: 0, width: `${grid * 100}%`, height: 2.5, background: 'rgba(255,255,255,.75)'}} />
            </React.Fragment>
          ))}
          {/* focus reticle travels to the third */}
          <div
            style={{
              position: 'absolute',
              left: `calc(${rx}% - 60px)`,
              top: `calc(${ry}% - 60px)`,
              width: 120,
              height: 120,
              border: `4px solid ${T.lime}`,
              borderRadius: 14,
              opacity: grid,
              boxShadow: `0 0 30px ${T.lime}88`,
            }}
          />
          <div style={{position: 'absolute', right: 20, top: 20, background: T.lime, color: T.ink, fontFamily: T.mono, fontWeight: 700, fontSize: 24, padding: '6px 14px', borderRadius: 8, opacity: k(g, W(44), W(44) + 6)}}>1/3 ✓</div>
        </Card>
        {/* window light comparison */}
        <div style={{position: 'absolute', left: CX, top: 1100, width: CW, display: 'flex', gap: 20, opacity: harshOn, transform: `translateY(${(1 - harshOn) * 60}px)`}}>
          {[
            {lbl: 'Lampu siling', ok: false, filter: 'contrast(1.55) brightness(.72) saturate(.8) sepia(.25)'},
            {lbl: 'Cahaya tingkap', ok: true, filter: 'none'},
          ].map((sw, i) => (
            <div key={i} style={{flex: 1, height: 300, borderRadius: 26, overflow: 'hidden', position: 'relative', boxShadow: '0 30px 60px rgba(10,12,40,.25)', opacity: i === 1 ? 0.35 + softOk * 0.65 : 1}}>
              <Img src={staticFile('tips2/photo-portrait.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 18%', filter: sw.filter}} />
              {!sw.ok && <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% -10%, rgba(255,240,200,.35), rgba(0,0,0,.55) 70%)'}} />}
              <div style={{position: 'absolute', left: 18, bottom: 16, fontFamily: T.font, fontWeight: 700, fontSize: 30, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,.6)'}}>{sw.lbl}</div>
              <div style={{position: 'absolute', right: 16, top: 16, background: sw.ok ? T.lime : T.red, color: sw.ok ? T.ink : '#fff', fontFamily: T.mono, fontWeight: 700, fontSize: 22, padding: '5px 12px', borderRadius: 8, opacity: sw.ok ? softOk : 1}}>
                {sw.ok ? '✓ LEMBUT' : '✗ KERAS'}
              </div>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 1440, display: 'flex', justifyContent: 'center'}}>
          <div style={{background: T.ink, color: T.lime, fontFamily: T.mono, fontWeight: 700, fontSize: 30, padding: '12px 28px', borderRadius: 14, transform: `scale(${free}) rotate(${(1 - free) * 10 - 2}deg)`}}>RM0 · CAHAYA PERCUMA</div>
        </div>
      </div>
    </Wipe>
  );
};

// ======================================================= stability (dark) — ball on a track like the ref
export const H5Stabil: React.FC = () => {
  const f = useCurrentFrame();
  const o = SC.stabil;
  const g = f + o;
  const smooth = k(g, W(55), W(56) + 6, io); // "gerak perlahan"
  const done = k(g, W(57), W(59));
  const out = k(g, SC.audio - 2, SC.audio + 10);
  const TW = 820;
  const N = 90;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const x = (i / (N - 1)) * TW;
    const shake = (Math.sin(i * 1.9) * 34 + Math.sin(i * 0.7) * 16) * (0.5 + random(`j${i}`) * 0.5);
    const calm = Math.sin(i / 14) * 18;
    pts.push([x, 120 + interpolate(smooth, [0, 1], [shake, calm])]);
  }
  const draw = k(g, W(51), W(54) + 10);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const bi = Math.min(N - 1, Math.floor(draw * (N - 1)));
  const [bx, by] = pts[bi];
  const pct = Math.round(interpolate(smooth, [0, 1], [38, 4]));
  return (
    <Wipe>
      <Bg mode="dark" />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: 70, top: 470}}>
          <VoWords from={57} to={59} offset={o} size={96} color="#fff" accent={{59: T.lime}} />
        </div>
        <Mono style={{position: 'absolute', left: 130, top: 760, opacity: k(g, W(51), W(51) + 8)}}>gegaran kamera · {pct}%</Mono>
        <svg width={TW + 40} height={260} style={{position: 'absolute', left: 110, top: 820, overflow: 'visible'}}>
          <line x1={0} y1={120} x2={TW} y2={120} stroke="rgba(255,255,255,.15)" strokeWidth={2} />
          <path d={d} fill="none" stroke={smooth < 0.5 ? T.red : T.lime} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={5000} strokeDashoffset={5000 * (1 - draw)} opacity={0.9} />
          <circle cx={bx} cy={by} r={30} fill={T.lime} style={{filter: `drop-shadow(0 0 18px ${T.lime})`}} />
        </svg>
        {/* mini graph card like the ref's overshoot card */}
        <Card delay={W(55) - o} x={620} y={1130} w={360} h={220} tilt={[6, -8]} bg="rgba(255,255,255,.06)">
          <Mono style={{position: 'absolute', left: 22, top: 18, fontSize: 18}}>siku rapat · jalan perlahan</Mono>
          <svg width={320} height={140} style={{position: 'absolute', left: 20, top: 56}}>
            <path d="M0,120 C80,120 90,20 160,22 S260,30 320,26" fill="none" stroke={T.lime} strokeWidth={5} strokeDasharray={600} strokeDashoffset={600 * (1 - k(g, W(55) + 6, W(56) + 10))} />
          </svg>
        </Card>
        <div style={{position: 'absolute', left: 130, top: 1180, background: T.lime, color: T.ink, fontFamily: T.mono, fontWeight: 700, fontSize: 26, padding: '8px 16px', borderRadius: 8, opacity: done, transform: `scale(${0.8 + done * 0.2})`}}>SMOOTH ✓</div>
      </div>
    </Wipe>
  );
};

// ======================================================= audio + frame rate (light)
export const H6Audio: React.FC = () => {
  const f = useCurrentFrame();
  const o = SC.audio;
  const g = f + o;
  const fix = k(g, W(65), WE(67), io); // "dekat dengan mulut"
  const db = Math.round(interpolate(fix, [0, 1], [-38, -12]));
  const c24 = useSpr(W(68) - o, 13, 160);
  const c60 = useSpr(W(73) - o, 13, 160);
  const dbS = useSpr(W(65) - o, 13, 160);
  const out = k(g, SC.why - 2, SC.why + 10);
  const bars = 56;
  return (
    <Wipe>
      <Bg mode="light" />
      <div style={{opacity: 1 - out}}>
        <Card delay={4} x={CX} y={560} w={CW} h={250} tilt={[6, -4]}>
          <Mono style={{position: 'absolute', left: 28, top: 22}}>{g < W(63) ? 'audio · mic telefon · 1.5 m' : 'audio · mic klip · 20 cm'}</Mono>
          <div style={{position: 'absolute', left: 28, right: 28, top: 70, bottom: 26, display: 'flex', alignItems: 'center', gap: 5}}>
            {new Array(bars).fill(0).map((_, i) => {
              const noisy = 0.12 + random(`n${i}${Math.floor(g / 3)}`) * 0.5;
              const clean = 0.3 + Math.abs(Math.sin(i * 0.5 + g / 5)) * 0.65;
              const h = interpolate(fix, [0, 1], [noisy, clean]);
              const col = fix < 0.5 ? T.red : T.lime;
              return <div key={i} style={{flex: 1, height: `${h * 100}%`, background: col, borderRadius: 3, opacity: k(g, W(60) + i * 0.3, W(60) + 6 + i * 0.3)}} />;
            })}
          </div>
        </Card>
        <div style={{position: 'absolute', left: CX, top: 850, display: 'flex', gap: 20}}>
          <div style={{width: 270, height: 170, borderRadius: 26, background: '#fff', boxShadow: '0 20px 40px rgba(10,12,40,.12)', padding: '22px 26px', boxSizing: 'border-box', opacity: dbS, transform: `translateY(${(1 - dbS) * 40}px)`}}>
            <div style={{fontFamily: T.font, fontSize: 64, fontWeight: 700, color: T.ink}}>{db}</div>
            <Mono style={{color: '#888', fontSize: 18}}>dB · suara</Mono>
          </div>
          <div style={{width: 270, height: 170, borderRadius: 26, background: '#fff', boxShadow: '0 20px 40px rgba(10,12,40,.12)', padding: '22px 26px', boxSizing: 'border-box', opacity: c24, transform: `translateY(${(1 - c24) * 40}px)`}}>
            <div style={{fontFamily: T.font, fontSize: 64, fontWeight: 700, color: T.ink}}>24<span style={{fontSize: 28}}> fps</span></div>
            <Mono style={{color: '#888', fontSize: 18}}>lebih cinematic</Mono>
          </div>
          <div style={{width: 270, height: 170, borderRadius: 26, background: T.ink, boxShadow: '0 20px 40px rgba(10,12,40,.2)', padding: '22px 26px', boxSizing: 'border-box', opacity: c60, transform: `translateY(${(1 - c60) * 40}px)`}}>
            <div style={{fontFamily: T.font, fontSize: 64, fontWeight: 700, color: T.lime}}>60<span style={{fontSize: 28}}> fps</span></div>
            <Mono style={{fontSize: 18}}>slow-mo</Mono>
          </div>
        </div>
      </div>
    </Wipe>
  );
};

// ======================================================= "Kenapa penting?" (dark)
export const H7Why: React.FC = () => {
  const f = useCurrentFrame();
  const o = SC.why;
  const g = f + o;
  const out = k(g, SC.end - 6, SC.end + 4);
  const rows: [number, number, Record<number, string>][] = [
    [78, 82, {78: T.lime}],
    [83, 85, {85: T.lime}],
    [86, 89, {89: T.lime}],
  ];
  return (
    <Wipe>
      <Bg mode="dark" />
      <div style={{position: 'absolute', left: 70, top: 470, opacity: 1 - out, filter: `blur(${out * 12}px)`}}>
        <VoWords from={76} to={77} offset={o} size={100} color="#fff" />
        <div style={{marginTop: 46}}>
          {rows.map(([a, b, acc], i) => (
            <div key={i} style={{marginBottom: 30}}>
              <div style={{fontFamily: T.mono, fontSize: 24, color: T.lime, opacity: k(g, W(a) - 4, W(a) + 2)}}>0{i + 1}</div>
              <VoWords from={a} to={b} offset={o} size={54} color="#fff" accent={acc} />
            </div>
          ))}
        </div>
      </div>
    </Wipe>
  );
};

// ======================================================= end (dark)
export const H8End: React.FC = () => {
  const f = useCurrentFrame();
  const o = SC.end;
  const g = f + o;
  const bar = k(g, W(93) - 2, W(93) + 10, io); // blue bar grows on "Join"
  const txt = k(g, W(94) - 2, W(94) + 6);
  const brand = useSpr(W(98) - o, 12, 150);
  const fadeAll = k(g, TOTAL - 32, TOTAL - 2);
  return (
    <AbsoluteFill>
      <Bg mode="dark" />
      <AbsoluteFill style={{opacity: 1 - fadeAll, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 640, fontFamily: T.font, color: '#fff', textAlign: 'center'}}>
        <VoWords from={90} to={92} offset={o} size={84} color="#fff" accent={{92: T.lime}} />
        <div style={{marginTop: 50, height: 120, display: 'flex', justifyContent: 'center'}}>
          <div style={{width: 120 + bar * 820, height: 120, borderRadius: 60, background: T.blue, boxShadow: `0 0 70px ${T.blue}aa`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', transform: `scale(${0.6 + Math.min(1, bar * 2) * 0.4})`}}>
            <span style={{fontSize: 46, fontWeight: 700, whiteSpace: 'nowrap', opacity: txt, filter: `blur(${(1 - txt) * 8}px)`}}>Training Smartphone Videomaking</span>
          </div>
        </div>
        <div style={{marginTop: 46, display: 'flex', alignItems: 'center', gap: 18, opacity: brand, transform: `translateY(${(1 - brand) * 30}px)`}}>
          <Img src={staticFile('icon-white.png')} style={{height: 64}} />
          <Img src={staticFile('wordmark-white.png')} style={{height: 92}} />
        </div>
        <div style={{fontFamily: T.mono, fontSize: 26, letterSpacing: 3, color: 'rgba(255,255,255,.6)', marginTop: 40, opacity: k(g, WE(99), WE(99) + 10)}}>WHATSAPP DEE · 011-1620 0864</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ======================================================= persistent header — grows out of the hook answer
export const Header: React.FC<{mode: 'light' | 'dark'}> = ({mode}) => {
  const g = useCurrentFrame();
  const light = mode === 'light';
  const shrink = k(g, W(9) - 14, W(9) + 2, io); // big → small as the demo starts
  const size = interpolate(shrink, [0, 1], [104, 62]);
  const top = interpolate(shrink, [0, 1], [280, 150]);
  const fade = 1 - k(g, TOTAL - 32, TOTAL - 2);
  const word = (i: number) => k(g, W(i) - 2, W(i) + 7);
  const sp = (i: number, child: React.ReactNode) => (
    <span style={{display: 'inline-block', opacity: word(i), filter: `blur(${(1 - word(i)) * 10}px)`, transform: `translateY(${(1 - word(i)) * 14}px)`, marginRight: '0.24em'}}>{child}</span>
  );
  return (
    <div style={{position: 'absolute', left: 70, top, fontFamily: T.font, fontWeight: 700, fontSize: size, lineHeight: 1.08, letterSpacing: -size * 0.025, color: light ? T.ink : '#fff', opacity: fade}}>
      {sp(4, 'Kami')}
      {sp(5, 'rakam')}
      {sp(6, 'guna')}
      <br />
      {sp(
        7,
        <span style={{background: light ? T.lime : 'transparent', color: light ? T.ink : T.lime, padding: light ? '0 0.16em' : 0, borderRadius: 8}}>smartphone je.</span>,
      )}
    </div>
  );
};
