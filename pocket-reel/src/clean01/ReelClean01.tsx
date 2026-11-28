import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';

// Pocket Clean (Style 06c) applied to Pocket's own talking-head video:
// background removed (RVM matting) on talking-head shots, footage upscaled 720p → 1080p,
// other shots shown as tilted cards on a clean minimalist background. 16:9, 1920×1080.
const C = {
  light: '#f4f4ef',
  card: '#141519',
  lime: '#f7fd92',
  orange: '#ff6b3d',
  ink: '#111214',
  font: "'Poppins', sans-serif",
  mono: "'JetBrains Mono', monospace",
};
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const cl = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const k = (f: number, a: number, b: number, e = ease) => interpolate(f, [a, b], [0, 1], {...cl, easing: e});
const useSpr = (frame: number, damping = 15, stiffness = 140) => {
  const {fps} = useVideoConfig();
  return spring({frame, fps, config: {damping, stiffness}});
};
const s2f = (s: number) => Math.round(s * 30);

// shot boundaries (frames) from scene detection
const SH = {a: 0, th1: 87, c: 178, th2: 298, th3: 411, mont: 539, end: 612};
const VIDEO_END = 612; // source fades to black at 20.5 s
export const CLEAN01_TOTAL = VIDEO_END + 90;
const LX = 120; // left column x
const SHIFT = 430; // talking head moved right

const Show: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  return f >= from && f < to ? <>{children}</> : null;
};
const Mono: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{fontFamily: C.mono, fontSize: 20, letterSpacing: 2, textTransform: 'uppercase', color: '#7b7b84', ...style}}>{children}</div>
);

const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const d = Math.sin(f / 60) * 30;
  return (
    <AbsoluteFill style={{background: C.light}}>
      <div style={{position: 'absolute', right: -200 + d, top: -260, width: 1000, height: 1000, borderRadius: '50%', background: 'rgba(247,253,146,.7)', filter: 'blur(160px)'}} />
      <div style={{position: 'absolute', left: -300, bottom: -360 - d, width: 900, height: 900, borderRadius: '50%', background: 'rgba(210,214,200,.55)', filter: 'blur(170px)'}} />
    </AbsoluteFill>
  );
};

/** words rising out of blur at given frames */
type Wd = [string, number, React.CSSProperties?];
const Words: React.FC<{w: Wd[]; size: number; color?: string; weight?: number; out?: number; style?: React.CSSProperties}> = ({w, size, color = C.ink, weight = 700, out = 0, style}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: C.font, fontWeight: weight, fontSize: size, lineHeight: 1.1, letterSpacing: -size * 0.025, color, ...style}}>
      {w.map(([t, at, st], i) => {
        if (t === '\n') return <br key={i} />;
        const v = k(f, at, at + 10);
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.24em', opacity: v * (1 - out), filter: `blur(${(1 - v) * 12 + out * 12}px)`, transform: `translateY(${(1 - v) * 16}px)`, ...st}}>
            {t}
          </span>
        );
      })}
    </div>
  );
};
const chip: React.CSSProperties = {background: C.lime, padding: '0 .14em', borderRadius: 10};

/** tilted UI card with spring entrance (Pocket Clean) */
const Card: React.FC<{at: number; x: number; y: number; w: number; h?: number; children: React.ReactNode; out?: number; tilt?: [number, number]; bg?: string; pad?: number}> = ({at, x, y, w, h, children, out = 0, tilt = [6, -10], bg = C.card, pad = 0}) => {
  const f = useCurrentFrame();
  const s = useSpr(f - at, 15, 130);
  const fl = Math.sin((f - at) / 30) * 1.2;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, perspective: 1800, opacity: Math.min(1, s * 1.4) * (1 - out)}}>
      <div
        style={{
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          padding: pad,
          background: bg,
          borderRadius: 30,
          border: '1.5px solid rgba(255,255,255,.08)',
          boxShadow: '0 50px 90px rgba(10,12,20,.26), 0 8px 20px rgba(0,0,0,.14)',
          transform: `rotateX(${tilt[0] + fl + (1 - s) * 25}deg) rotateY(${tilt[1] + (1 - s) * -15}deg) scale(${0.84 + s * 0.16}) translateY(${(1 - s) * 70}px)`,
          filter: `blur(${(1 - s) * 10 + out * 14}px)`,
          color: '#fff',
          fontFamily: C.font,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
};

/** footage from the upscaled source inside a card (w×h), synced to the global timeline; crops letterbox via cropTop/cropH */
const Footage: React.FC<{from: number; w: number; h: number; zoom?: number; cropTop?: number; cropH?: number}> = ({from, w, h, zoom = 1, cropTop = 0, cropH = 1080}) => {
  const sc = Math.max(w / 1920, h / cropH) * zoom; // cover the card with the visible content
  const vw = 1920 * sc;
  const vh = 1080 * sc;
  const left = (w - vw) / 2;
  const top = h / 2 - (cropTop + cropH / 2) * sc;
  return (
    <Sequence from={from} layout="none">
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
        <OffthreadVideo src={staticFile('ref/clean01_hires.mp4')} startFrom={from} muted style={{position: 'absolute', left, top, width: vw, height: vh}} />
      </div>
    </Sequence>
  );
};

/** cut-out talking head (transparent VP9) with a lime disc behind */
const Person: React.FC<{from: number; dur: number; file: string; dx?: number}> = ({from, dur, file, dx = SHIFT}) => {
  const f = useCurrentFrame();
  const s = useSpr(f - from, 16, 150);
  const disc = useSpr(f - from - 4, 14, 120);
  return (
    <Sequence from={from} durationInFrames={dur} layout="none">
      <div style={{position: 'absolute', left: 960 + dx - 330, top: 170, width: 660, height: 660, borderRadius: '50%', background: C.lime, transform: `scale(${disc})`, opacity: 0.9}} />
      <div style={{position: 'absolute', inset: 0, transform: `translateX(${dx}px) scale(${0.97 + s * 0.03})`, transformOrigin: '50% 100%', opacity: Math.min(1, s * 1.6), filter: `blur(${(1 - s) * 6}px) drop-shadow(0 24px 40px rgba(20,20,10,.18))`}}>
        <OffthreadVideo src={staticFile(`ref/${file}`)} transparent muted style={{width: 1920, height: 1080}} />
      </div>
    </Sequence>
  );
};

// ------------------------------------------------------------------ captions
const CAPS: [number, number, string][] = [
  [0, 0.95, 'Semua teknologi,'],
  [1.0, 2.7, 'semua alat-alatan yang ada'],
  [2.74, 3.55, 'pada anda sekarang'],
  [3.56, 5.3, 'dah cukup untuk memenuhi kriteria'],
  [5.32, 7.0, 'untuk menghasilkan video HD yang baik.'],
  [7.2, 8.7, 'Jadi video ni sebenarnya,'],
  [8.72, 10.95, 'dia menjadi salah satu'],
  [11.1, 11.86, 'ejen marketing'],
  [11.88, 13.3, 'yang paling power sekarang.'],
  [13.66, 15.45, 'Tapi yang penting,'],
  [15.52, 16.5, 'record lah,'],
  [16.58, 18.0, 'mulakan record dan sharing.'],
];
const Capsule: React.FC = () => {
  const f = useCurrentFrame();
  const cur = CAPS.find(([a, b]) => f >= s2f(a) && f < s2f(b) + 4);
  if (!cur) return null;
  const a = s2f(cur[0]);
  const b = s2f(cur[1]) + 4;
  const v = k(f, a, a + 6) * (1 - k(f, b - 5, b));
  return (
    <div style={{position: 'absolute', top: 950, left: LX}}>
      <div style={{background: '#fff', color: C.ink, fontFamily: C.font, fontWeight: 500, fontSize: 32, padding: '12px 30px', borderRadius: 40, boxShadow: '0 12px 30px rgba(0,0,0,.14)', opacity: v, transform: `translateY(${(1 - v) * 10}px) scale(${0.95 + v * 0.05})`, transformOrigin: '0 50%', filter: `blur(${(1 - v) * 6}px)`, whiteSpace: 'nowrap'}}>{cur[2]}</div>
    </div>
  );
};

// ------------------------------------------------------------------ scenes
const ShotA: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, SH.th1 - 6, SH.th1 + 2);
  return (
    <>
      <div style={{position: 'absolute', left: LX, top: 300}}>
        <Words w={[['Semua', s2f(0)], ['\n', 0], ['teknologi', s2f(0.3), chip]]} size={104} out={out} />
        <Words w={[['yang', s2f(2.46)], ['ada', s2f(2.56)], ['pada', s2f(2.92)], ['anda', s2f(3.06)], ['sekarang.', s2f(3.28)]]} size={44} weight={500} color="#55565c" out={out} style={{marginTop: 30}} />
      </div>
      <Card at={2} x={880} y={170} w={920} h={518} out={out} tilt={[6, -12]}>
        <Footage from={SH.a} w={920} h={518} zoom={1.04} />
      </Card>
      <Mono style={{position: 'absolute', left: 900, top: 730, opacity: k(f, 14, 24) * (1 - out)}}>shot · smartphone je</Mono>
    </>
  );
};

const CHECK: [string, number][] = [
  ['Kamera telefon', s2f(3.6)],
  ['Mic klip', s2f(4.1)],
  ['App edit', s2f(4.5)],
];
const Th1: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, SH.c - 6, SH.c + 2);
  return (
    <>
      <div style={{position: 'absolute', left: LX, top: 150}}>
        <Words w={[['Dah', s2f(3.56)], ['cukup.', s2f(3.72), chip]]} size={96} out={out} />
      </div>
      <Card at={s2f(3.5)} x={LX} y={330} w={600} h={300} bg="#ffffff" tilt={[6, 8]} out={out} pad={30}>
        <Mono>Yang anda dah ada</Mono>
        {CHECK.map(([t, at]) => {
          const v = k(f, at, at + 8);
          return (
            <div key={t} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18, color: C.ink, fontSize: 36, fontWeight: 600, opacity: v, transform: `translateX(${(1 - v) * 24}px)`}}>
              <span>{t}</span>
              <span style={{width: 46, height: 46, borderRadius: 23, background: C.lime, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, transform: `scale(${v})`}}>✓</span>
            </div>
          );
        })}
      </Card>
    </>
  );
};

const ShotC: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, SH.th2 - 6, SH.th2 + 2);
  const hd = useSpr(f - s2f(6.0), 11, 190);
  const hdOut = k(f, s2f(7.0), s2f(7.2));
  return (
    <>
      <div style={{position: 'absolute', left: LX, top: 360, display: 'flex', flexDirection: 'column', gap: 20, opacity: Math.min(1, hd * 1.5) * (1 - hdOut), filter: `blur(${hdOut * 10}px)`, transform: `scale(${0.6 + hd * 0.4})`, transformOrigin: '0 50%'}}>
        <div style={{background: C.ink, color: C.lime, fontFamily: C.font, fontWeight: 800, fontSize: 120, padding: '4px 44px', borderRadius: 30, letterSpacing: 4, alignSelf: 'flex-start'}}>HD</div>
        <div style={{fontFamily: C.font, fontWeight: 600, fontSize: 48, color: C.ink}}>video yang baik.</div>
      </div>
      <div style={{position: 'absolute', left: LX, top: 300}}>
        <Words w={[['Jadi', s2f(7.2)], ['video', s2f(7.56), chip], ['ni', s2f(7.98)], ['\n', 0], ['sebenarnya…', s2f(8.16)]]} size={84} out={out} />
      </div>
      <Card at={SH.c + 2} x={880} y={170} w={920} h={518} out={out} tilt={[6, -12]}>
        <Footage from={SH.c} w={920} h={518} zoom={1.04} />
      </Card>
    </>
  );
};

const BARS = [0.28, 0.4, 0.36, 0.58, 0.74, 1];
const Th2: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, SH.th3 - 6, SH.th3 + 2);
  const grow = k(f, s2f(12.0), s2f(12.7));
  return (
    <>
      <div style={{position: 'absolute', left: LX, top: 150}}>
        <Words w={[['Salah', s2f(9.98)], ['satu', s2f(10.16)]]} size={50} weight={500} color="#55565c" out={out} />
        <Words w={[['ejen', s2f(11.12)], ['marketing', s2f(11.64), chip]]} size={92} out={out} style={{marginTop: 6}} />
      </div>
      <Card at={s2f(11.4)} x={LX} y={420} w={620} h={380} out={out} tilt={[6, 8]} pad={30}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <Mono style={{color: 'rgba(255,255,255,.55)'}}>Reach · video</Mono>
          <div style={{fontFamily: C.font, fontWeight: 800, fontSize: 30, color: C.lime, opacity: grow}}>paling power ↑</div>
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 18, height: 240, marginTop: 30}}>
          {BARS.map((b, i) => {
            const g = k(f, s2f(12.0) + i * 3, s2f(12.0) + i * 3 + 14);
            return <div key={i} style={{flex: 1, height: `${Math.max(0.04, b * g) * 100}%`, borderRadius: 10, background: i === BARS.length - 1 ? C.lime : 'rgba(255,255,255,.22)'}} />;
          })}
        </div>
      </Card>
    </>
  );
};

const Th3: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, SH.mont - 6, SH.mont + 2);
  const rec = useSpr(f - s2f(15.4), 12, 180);
  const t = Math.max(0, f - s2f(15.5));
  const share = (i: number) => useSpr(f - s2f(17.45) - i * 4, 11, 200);
  const sh = [share(0), share(1), share(2)];
  return (
    <>
      <div style={{position: 'absolute', left: LX, top: 150}}>
        <Words w={[['Tapi', s2f(13.66)], ['yang', s2f(14.18)], ['penting…', s2f(14.68)]]} size={60} weight={600} color="#55565c" out={out} />
        <Words w={[['Mulakan', s2f(16.58)], ['\n', 0], ['record.', s2f(16.84), chip]]} size={100} out={out} style={{marginTop: 14}} />
      </div>
      <div style={{position: 'absolute', left: LX, top: 560, opacity: Math.min(1, rec * 1.4) * (1 - out), transform: `scale(${0.7 + rec * 0.3})`, transformOrigin: '0 50%'}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 18, background: C.ink, borderRadius: 50, padding: '16px 34px 16px 24px', boxShadow: '0 20px 40px rgba(0,0,0,.2)'}}>
          <div style={{width: 34, height: 34, borderRadius: 17, background: C.orange, opacity: 0.55 + 0.45 * Math.abs(Math.sin(t / 8)), boxShadow: `0 0 22px ${C.orange}`}} />
          <span style={{fontFamily: C.mono, fontWeight: 700, fontSize: 38, color: '#fff'}}>REC</span>
          <span style={{fontFamily: C.mono, fontSize: 36, color: C.lime}}>00:{('0' + Math.floor(t / 30)).slice(-2)}:{('0' + (t % 30)).slice(-2)}</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: LX, top: 720, display: 'flex', alignItems: 'center', gap: 20, opacity: 1 - out}}>
        {['↗', '♥', '💬'].map((ic, i) => (
          <div key={ic} style={{width: 92, height: 92, borderRadius: 46, background: i === 0 ? C.lime : '#fff', color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, fontWeight: 700, boxShadow: '0 14px 30px rgba(0,0,0,.12)', transform: `scale(${sh[i]})`}}>
            {ic}
          </div>
        ))}
        <div style={{fontFamily: C.font, fontWeight: 600, fontSize: 40, color: C.ink, opacity: sh[2]}}>& sharing</div>
      </div>
    </>
  );
};

const Montage: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, VIDEO_END - 8, VIDEO_END + 4);
  const lab = k(f, SH.mont + 10, SH.mont + 22);
  return (
    <>
      <div style={{position: 'absolute', left: 260, top: 92, display: 'flex', alignItems: 'center', gap: 16, opacity: lab * (1 - out)}}>
        <div style={{background: C.ink, color: C.lime, fontFamily: C.font, fontWeight: 700, fontSize: 30, padding: '8px 24px', borderRadius: 30}}>Training</div>
        <div style={{fontFamily: C.font, fontWeight: 700, fontSize: 40, color: C.ink, letterSpacing: -1}}>Smartphone Videomaking</div>
      </div>
      <Card at={SH.mont} x={260} y={180} w={1400} h={650} out={out} tilt={[5, -4]}>
        <Footage from={SH.mont} w={1400} h={650} cropTop={94} cropH={892} />
      </Card>
      <Mono style={{position: 'absolute', left: 260, top: 870, opacity: lab * (1 - out)}}>kelas hands-on · individu · syarikat · agensi</Mono>
    </>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const logo = useSpr(f - VIDEO_END - 30, 14, 140);
  const fade = k(f, CLEAN01_TOTAL - 20, CLEAN01_TOTAL - 1);
  return (
    <AbsoluteFill style={{opacity: 1 - fade}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Words w={[['Mulakan', VIDEO_END + 2], ['record', VIDEO_END + 6, chip], ['hari', VIDEO_END + 10], ['ni.', VIDEO_END + 14]]} size={88} />
        <Img src={staticFile('logo-dark.png')} style={{height: 70, marginTop: 70, opacity: logo, transform: `scale(${0.88 + logo * 0.12})`}} />
      </div>
    </AbsoluteFill>
  );
};

type Cue = [number, string, number];
const CUES: Cue[] = [
  [2, 'min_swish', 0.25],
  [SH.th1, 'min_whoosh', 0.3],
  ...CHECK.map(([, at]) => [at, 'min_tick', 0.3] as Cue),
  [s2f(6.0), 'pop', 0.3],
  [SH.c, 'min_whoosh', 0.3],
  [SH.th2, 'min_whoosh', 0.3],
  [s2f(11.4), 'min_swish', 0.25],
  [s2f(12.0), 'min_tick', 0.25],
  [SH.th3, 'min_whoosh', 0.3],
  [s2f(15.4), 'click', 0.45],
  [s2f(17.45), 'pop', 0.3],
  [SH.mont, 'min_whoosh', 0.3],
  [VIDEO_END + 30, 'min_chime', 0.45],
];

export const ReelClean01: React.FC = () => {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(['400 40px Poppins', '500 40px Poppins', '600 40px Poppins', '700 40px Poppins', '800 40px Poppins', '400 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'].map((x) => document.fonts.load(x))).then(() => continueRender(h));
  }, [h]);
  return (
    <AbsoluteFill style={{background: C.light}}>
      <Bg />
      {/* original soundtrack (voice + music), from the upscaled master */}
      <Audio src={staticFile('ref/clean01_hires.mp4')} volume={(fr) => interpolate(fr, [VIDEO_END - 10, VIDEO_END + 20], [1, 0], cl)} />
      {/* soft music bed: ducked under the voice, lifts for the training montage and outro */}
      <Audio src={staticFile('music_subclair.mp3')} volume={(fr) => interpolate(fr, [0, 12, 525, 545, CLEAN01_TOTAL - 25, CLEAN01_TOTAL - 1], [0, 0.1, 0.1, 0.42, 0.42, 0], cl)} />
      {CUES.map(([fr, name, vol], i) => (
        <Sequence key={i} from={fr} durationInFrames={75} layout="none">
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
      <Person from={SH.th1} dur={SH.c - SH.th1} file="clean01_th1.webm" />
      <Person from={SH.th2} dur={SH.th3 - SH.th2} file="clean01_th2.webm" />
      <Person from={SH.th3} dur={SH.mont - SH.th3} file="clean01_th3.webm" />
      <Show from={0} to={SH.th1 + 4}><ShotA /></Show>
      <Show from={SH.th1} to={SH.c + 4}><Th1 /></Show>
      <Show from={SH.c} to={SH.th2 + 4}><ShotC /></Show>
      <Show from={SH.th2} to={SH.th3 + 4}><Th2 /></Show>
      <Show from={SH.th3} to={SH.mont + 4}><Th3 /></Show>
      <Show from={SH.mont} to={VIDEO_END + 6}><Montage /></Show>
      <Show from={VIDEO_END - 2} to={CLEAN01_TOTAL}><Outro /></Show>
      <Capsule />
    </AbsoluteFill>
  );
};
