import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Bg, Caption, Card, k, Mono, T, TipTitle, useSpr, Wd, Words, Wipe} from './kit';

const CW = 860;
const CX = (1080 - CW) / 2;

// ===================================================================== intro (light)
export const SIntro: React.FC = () => {
  const f = useCurrentFrame();
  const q = k(f, 50, 64); // "Nak video nampak pro?" fades as header settles
  return (
    <AbsoluteFill>
      <Bg mode="light" />
      <div style={{position: 'absolute', left: 70, top: 150, opacity: 1 - q, filter: `blur(${q * 10}px)`}}>
        <Words w={['Nak', 'video', 'nampak', ['pro?', T.ink]]} delay={4} size={112} color={T.ink} />
      </div>
      {/* camera app mock */}
      <Card delay={58} x={CX} y={700} w={CW} h={720}>
        <div style={{position: 'absolute', inset: 22, bottom: 150, borderRadius: 22, overflow: 'hidden', background: 'linear-gradient(160deg,#3b4a7a,#c98a5c 70%,#2b2230)'}}>
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: `${(i * 100) / 3}%`, top: 0, bottom: 0, width: 1.5, background: 'rgba(255,255,255,.35)'}} />
              <div style={{position: 'absolute', top: `${(i * 100) / 3}%`, left: 0, right: 0, height: 1.5, background: 'rgba(255,255,255,.35)'}} />
            </React.Fragment>
          ))}
          <div style={{position: 'absolute', left: 24, top: 20, display: 'flex', gap: 10, alignItems: 'center', fontFamily: T.mono, fontSize: 22}}>
            <span style={{width: 14, height: 14, borderRadius: 7, background: Math.floor(f / 12) % 2 ? T.red : 'transparent'}} />
            REC 00:{String(Math.max(0, Math.floor((f - 70) / 30))).padStart(2, '0')}
          </div>
          <Mono style={{position: 'absolute', right: 24, top: 22, color: '#fff'}}>4K · 30</Mono>
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 96, display: 'flex', justifyContent: 'center', gap: 34, fontFamily: T.mono, fontSize: 22, letterSpacing: 2}}>
          {['FOTO', 'VIDEO', 'SLO-MO'].map((m) => (
            <span key={m} style={{color: m === 'VIDEO' ? T.lime : 'rgba(255,255,255,.5)'}}>{m}</span>
          ))}
        </div>
        <div style={{position: 'absolute', left: '50%', bottom: 18, width: 66, height: 66, marginLeft: -33, borderRadius: 33, border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 46, height: 46, borderRadius: 23, background: T.red}} />
        </div>
      </Card>
      <Caption lines={[[70, 'tak perlu kamera mahal,'], [108, 'cukup 6 trick ni.']]} end={146} />
    </AbsoluteFill>
  );
};

// ===================================================================== tip 1: AE/AF lock (light)
export const STip1: React.FC = () => {
  const f = useCurrentFrame();
  const tap = useSpr(48, 9, 200);
  const ev = interpolate(f, [80, 120], [0, -0.7], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const lockOn = f >= 60;
  const lockS = useSpr(60, 10, 200);
  return (
    <AbsoluteFill>
      <Bg mode="light" />
      <TipTitle n="01" title={['Lock', ['fokus', T.ink], '&', '\n', 'exposure.']} delay={4} mode="light" />
      <Card delay={18} x={CX} y={760} w={CW} h={640}>
        <div style={{position: 'absolute', inset: 22, borderRadius: 22, overflow: 'hidden', background: `linear-gradient(170deg, hsl(220,30%,${38 + ev * 14}%), hsl(25,55%,${58 + ev * 18}%))`}}>
          {/* subject silhouette */}
          <div style={{position: 'absolute', left: 330, top: 150, width: 160, height: 160, borderRadius: 80, background: `rgba(20,20,30,${0.55 - ev * 0.2})`}} />
          <div style={{position: 'absolute', left: 270, top: 300, width: 280, height: 300, borderRadius: '140px 140px 0 0', background: `rgba(20,20,30,${0.55 - ev * 0.2})`}} />
          {/* focus square */}
          <div
            style={{
              position: 'absolute',
              left: 300,
              top: 120,
              width: 220,
              height: 220,
              border: `4px solid ${T.lime}`,
              transform: `scale(${1.4 - tap * 0.4})`,
              opacity: tap,
            }}
          >
            {/* exposure sun slider */}
            <div style={{position: 'absolute', right: -50, top: 10, bottom: 10, width: 3, background: T.lime}}>
              <div style={{position: 'absolute', left: -14, top: `${50 - ev * 40}%`, width: 30, height: 30, borderRadius: 15, background: T.lime, opacity: f > 76 ? 1 : 0}} />
            </div>
          </div>
          {lockOn && (
            <div style={{position: 'absolute', left: '50%', top: 34, transform: `translateX(-50%) scale(${lockS})`, background: T.lime, color: T.ink, fontFamily: T.mono, fontWeight: 700, fontSize: 26, padding: '8px 18px', borderRadius: 8}}>
              AE/AF LOCK
            </div>
          )}
          <Mono style={{position: 'absolute', left: 24, bottom: 20, color: '#fff'}}>EV {ev.toFixed(1)}</Mono>
          {/* finger tap ripple */}
          {f > 44 && f < 70 && (
            <div style={{position: 'absolute', left: 410 - 40, top: 230 - 40, width: 80, height: 80, borderRadius: 40, border: '4px solid rgba(255,255,255,.8)', transform: `scale(${1 + (f - 44) / 10})`, opacity: 1 - (f - 44) / 26}} />
          )}
        </div>
      </Card>
      <Caption lines={[[30, 'tekan lama dekat subjek,'], [66, 'fokus & cahaya tak lari-lari.'], [104, 'gelapkan sikit, warna lagi kaya.']]} end={176} />
    </AbsoluteFill>
  );
};

// ===================================================================== tip 2: rule of thirds (dark)
export const STip2: React.FC = () => {
  const f = useCurrentFrame();
  const grid = k(f, 26, 50);
  const mv = k(f, 60, 92);
  const sx = interpolate(mv, [0, 1], [50, 66.6]);
  const sy = interpolate(mv, [0, 1], [50, 33.3]);
  return (
    <Wipe>
      <Bg mode="dark" />
      <TipTitle n="02" title={['Rule', 'of', ['thirds.', T.lime]]} delay={10} mode="dark" />
      <Card delay={20} x={CX} y={760} w={CW} h={560} tilt={[6, 6]}>
        <div style={{position: 'absolute', inset: 22, borderRadius: 22, background: 'linear-gradient(180deg,#1b2340,#3a2c3a)'}}>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%', background: 'rgba(0,0,0,.35)'}} />
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <div style={{position: 'absolute', left: `${(i * 100) / 3}%`, top: 0, height: `${grid * 100}%`, width: 2, background: 'rgba(255,255,255,.5)'}} />
              <div style={{position: 'absolute', top: `${(i * 100) / 3}%`, left: 0, width: `${grid * 100}%`, height: 2, background: 'rgba(255,255,255,.5)'}} />
            </React.Fragment>
          ))}
          {[[1, 1], [2, 1], [1, 2], [2, 2]].map(([a, b], i) => (
            <div key={i} style={{position: 'absolute', left: `calc(${(a * 100) / 3}% - 9px)`, top: `calc(${(b * 100) / 3}% - 9px)`, width: 18, height: 18, borderRadius: 9, border: '2px solid rgba(255,255,255,.7)', opacity: grid}} />
          ))}
          <div
            style={{
              position: 'absolute',
              left: `calc(${sx}% - 48px)`,
              top: `calc(${sy}% - 48px)`,
              width: 96,
              height: 96,
              borderRadius: 48,
              background: T.lime,
              boxShadow: `0 0 ${20 + mv * 40}px ${T.lime}`,
            }}
          />
          <Mono style={{position: 'absolute', left: 24, bottom: 20}}>subjek → titik 1/3</Mono>
        </div>
      </Card>
      <Caption lines={[[30, 'jangan letak subjek tengah-tengah,'], [70, 'letak dekat garisan 1/3,'], [110, 'frame terus nampak sinematik.']]} end={176} />
    </Wipe>
  );
};

// ===================================================================== tip 3: window light (light)
const LightSwatch: React.FC<{delay: number; y: number; label: string; ok: boolean; soft: boolean}> = ({delay, y, label, ok, soft}) => {
  const s = useSpr(delay, 13, 150);
  return (
    <div style={{position: 'absolute', left: 30, right: 30, top: y, height: 250, borderRadius: 24, overflow: 'hidden', opacity: s, transform: `translateY(${(1 - s) * 60}px) scale(${0.9 + s * 0.1})`, background: soft ? 'linear-gradient(90deg,#f1d9c6,#7a5a4a)' : 'radial-gradient(circle at 50% 0%, #fff3d6 0%, #6a4a3a 45%, #1c1414 80%)'}}>
      <div style={{position: 'absolute', left: 300, top: 40, width: 170, height: 170, borderRadius: 85, background: soft ? 'linear-gradient(90deg,#f7e2d0,#8a6250)' : 'radial-gradient(circle at 50% 10%, #fff 0%, #b07a5c 40%, #2a1a14 85%)'}} />
      <div style={{position: 'absolute', left: 24, bottom: 20, fontFamily: T.font, fontWeight: 700, fontSize: 34, color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,.5)'}}>{label}</div>
      <div style={{position: 'absolute', right: 24, top: 20, background: ok ? T.lime : T.red, color: ok ? T.ink : '#fff', fontFamily: T.mono, fontWeight: 700, fontSize: 26, padding: '6px 14px', borderRadius: 8}}>{ok ? '✓ LEMBUT' : '✗ KERAS'}</div>
    </div>
  );
};

export const STip3: React.FC = () => (
  <Wipe>
    <Bg mode="light" />
    <TipTitle n="03" title={['Guna', 'cahaya', '\n', ['tingkap.', T.ink]]} delay={10} mode="light" />
    <Card delay={18} x={CX} y={760} w={CW} h={600}>
      <LightSwatch delay={34} y={30} label="Lampu siling" ok={false} soft={false} />
      <LightSwatch delay={70} y={310} label="Cahaya tingkap sisi" ok soft />
    </Card>
    <Caption lines={[[30, 'lampu atas = bayang bawah mata,'], [74, 'hadap tingkap,'], [108, 'percuma & nampak natural.']]} end={176} />
  </Wipe>
);

// ===================================================================== tip 4: audio (dark)
export const STip4: React.FC = () => {
  const f = useCurrentFrame();
  const fix = k(f, 70, 100);
  const db = Math.round(interpolate(fix, [0, 1], [-38, -12]));
  const bars = 54;
  return (
    <Wipe>
      <Bg mode="dark" />
      <TipTitle n="04" title={['Audio', 'lagi', 'penting', '\n', 'dari', ['video.', T.red]]} delay={10} mode="dark" />
      <Card delay={20} x={CX} y={800} w={CW} h={300} tilt={[6, 4]}>
        <Mono style={{position: 'absolute', left: 30, top: 24}}>{fix < 0.5 ? 'audio · mic phone, jauh' : 'audio · mic klip (lavalier)'}</Mono>
        <div style={{position: 'absolute', left: 30, right: 30, top: 80, bottom: 30, display: 'flex', alignItems: 'center', gap: 5}}>
          {new Array(bars).fill(0).map((_, i) => {
            const n = random(`a${i}`);
            const noisy = 0.15 + n * 0.85;
            const clean = 0.35 + Math.abs(Math.sin(i * 0.55 + f / 6)) * 0.55;
            const h = interpolate(fix, [0, 1], [noisy * 0.5, clean]) * (0.7 + 0.3 * Math.sin(f / 4 + i));
            const col = fix < 0.5 ? T.red : T.lime;
            return <div key={i} style={{flex: 1, height: `${h * 100}%`, background: col, borderRadius: 3, opacity: k(f, 30 + i * 0.4, 36 + i * 0.4)}} />;
          })}
        </div>
      </Card>
      {(() => {
        const s = useSpr(60, 13, 150);
        return (
          <div style={{position: 'absolute', left: CX, top: 1140, display: 'flex', gap: 24, opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
            <div style={{width: 300, height: 170, borderRadius: 26, background: '#fff', padding: '24px 30px', boxSizing: 'border-box', fontFamily: T.font}}>
              <div style={{fontSize: 64, fontWeight: 700, color: T.ink}}>{db}</div>
              <Mono style={{color: '#888', fontSize: 18}}>dB · suara</Mono>
            </div>
            <div style={{width: 300, height: 170, borderRadius: 26, background: '#fff', padding: '24px 30px', boxSizing: 'border-box', fontFamily: T.font, opacity: k(f, 96, 106)}}>
              <div style={{fontSize: 52, fontWeight: 700, color: T.ink}}>~20 cm</div>
              <Mono style={{color: '#888', fontSize: 18}}>mic ke mulut</Mono>
            </div>
          </div>
        );
      })()}
      <Caption lines={[[30, 'gambar cantik, bunyi bising = skip.'], [74, 'guna mic klip,'], [104, 'dekat dengan mulut.']]} end={176} />
    </Wipe>
  );
};

// ===================================================================== tip 5: frame rate (light)
const FPS: [string, string, number][] = [
  ['24 fps', 'sinematik · shortfilem', 34],
  ['30 fps', 'vlog · content harian', 70],
  ['60 fps', 'slow-mo · aksi', 106],
];
export const STip5: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Wipe>
      <Bg mode="light" />
      <TipTitle n="05" title={['Pilih', ['frame', T.ink], ['rate', T.ink], '\n', 'yang', 'betul.']} delay={10} mode="light" />
      <Card delay={18} x={CX} y={780} w={CW} h={560}>
        <Mono style={{position: 'absolute', left: 36, top: 30}}>kamera · format video</Mono>
        {FPS.map(([a, b, d], i) => {
          const on = f >= d + 8 && (i === FPS.length - 1 || f < FPS[i + 1][2] + 8);
          const s = useSpr(d - 10, 14, 160);
          return (
            <div
              key={a}
              style={{
                position: 'absolute',
                left: 36,
                right: 36,
                top: 90 + i * 150,
                height: 124,
                borderRadius: 22,
                background: on ? T.lime : 'rgba(255,255,255,.07)',
                color: on ? T.ink : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 34px',
                opacity: s,
                transform: `translateX(${(1 - s) * 60}px) scale(${on ? 1.02 : 1})`,
              }}
            >
              <span style={{fontSize: 52, fontWeight: 700}}>{a}</span>
              <span style={{fontSize: 30, fontWeight: 500, opacity: 0.8}}>{b}</span>
            </div>
          );
        })}
      </Card>
      <Caption lines={[[30, '24 untuk rasa filem,'], [70, '30 untuk content harian,'], [108, '60 kalau nak slow-mo.']]} end={176} />
    </Wipe>
  );
};

// ===================================================================== tip 6: stability (dark)
export const STip6: React.FC = () => {
  const f = useCurrentFrame();
  const fix = k(f, 66, 100);
  const W = 780;
  const pts = new Array(80).fill(0).map((_, i) => {
    const x = (i / 79) * W;
    const shaky = Math.sin(i * 1.7) * 38 * random(`s${i}`) + Math.sin(i * 0.9) * 22;
    const smooth = Math.sin(i / 12) * 26;
    return [x, 150 + interpolate(fix, [0, 1], [shaky, smooth])];
  });
  const draw = k(f, 26, 60);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  return (
    <Wipe>
      <Bg mode="dark" />
      <TipTitle n="06" title={['Stabil', '=', '\n', ['nampak', T.lime], ['pro.', T.lime]]} delay={10} mode="dark" />
      <Card delay={20} x={CX} y={800} w={CW} h={420} tilt={[6, -4]}>
        <Mono style={{position: 'absolute', left: 36, top: 28}}>gegaran kamera</Mono>
        <svg width={W} height={300} style={{position: 'absolute', left: 40, top: 80}}>
          <path d={d} fill="none" stroke={fix < 0.5 ? T.red : T.lime} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={4000} strokeDashoffset={4000 * (1 - draw)} />
        </svg>
        <div style={{position: 'absolute', right: 30, bottom: 26, background: fix < 0.5 ? T.red : T.lime, color: fix < 0.5 ? '#fff' : T.ink, fontFamily: T.mono, fontWeight: 700, fontSize: 24, padding: '6px 14px', borderRadius: 8}}>
          {fix < 0.5 ? 'GOYANG' : 'SMOOTH ✓'}
        </div>
      </Card>
      <Caption lines={[[30, 'siku rapat dengan badan,'], [70, 'jalan perlahan, lutut lembut,'], [108, 'atau guna gimbal.']]} end={150} />
    </Wipe>
  );
};

// ===================================================================== recap (dark)
const WHY: [Wd[], number][] = [
  [[['Nampak', T.lime], 'pro', 'tanpa', 'kamera', 'mahal.'], 30],
  [['Content', 'lebih', ['konsisten.', T.lime]], 46],
  [['Penonton', 'tengok', 'sampai', ['habis.', T.lime]], 62],
];
export const SRecap: React.FC = () => {
  const f = useCurrentFrame();
  const out = k(f, 92, 104);
  return (
    <AbsoluteFill>
      <Bg mode="dark" />
      <div style={{position: 'absolute', left: 70, top: 520}}>
        <Words w={['Kenapa', 'penting?']} delay={4} size={96} color="#fff" out={out} />
        <div style={{marginTop: 50}}>
          {WHY.map(([w, d], i) => (
            <div key={i} style={{marginBottom: 34, opacity: 1 - out}}>
              <div style={{fontFamily: T.mono, fontSize: 24, color: T.lime, opacity: k(f, d - 4, d + 4)}}>0{i + 1}</div>
              <Words w={w} delay={d} size={50} color="#fff" step={2} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================================================================== end (dark)
export const SEnd: React.FC = () => {
  const f = useCurrentFrame();
  const pill = useSpr(8, 12, 150);
  const fadeAll = k(f, 128, 150);
  return (
    <AbsoluteFill>
      <Bg mode="dark" />
      <AbsoluteFill style={{opacity: 1 - fadeAll}}>
        <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', fontFamily: T.font, color: '#fff'}}>
          <div
            style={{
              background: T.blue,
              borderRadius: 60,
              padding: '22px 50px',
              fontSize: 54,
              fontWeight: 700,
              boxShadow: `0 0 60px ${T.blue}aa`,
              transform: `scale(${pill})`,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
            }}
          >
            <Img src={staticFile('icon-white.png')} style={{height: 64}} />
            Pocket Production
          </div>
          <div style={{marginTop: 46}}>
            <Words w={['Nak', 'belajar', ['hands-on?', T.lime], '\n', 'Join', 'training', 'Mobile', 'Filmmaking', 'kami.']} delay={24} size={46} color="#fff" step={2} style={{fontWeight: 500, lineHeight: 1.3}} />
          </div>
          <div style={{fontFamily: T.mono, fontSize: 26, letterSpacing: 3, color: 'rgba(255,255,255,.6)', marginTop: 40, opacity: k(f, 60, 72)}}>WHATSAPP DEE · 011-1620 0864</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ===================================================================== persistent header
export const Header: React.FC<{mode: 'light' | 'dark'; visible: number}> = ({mode, visible}) => {
  const light = mode === 'light';
  return (
    <div style={{position: 'absolute', left: 70, top: 150, opacity: visible, fontFamily: T.font, fontWeight: 700, fontSize: 62, lineHeight: 1.08, letterSpacing: -1.5, color: light ? T.ink : '#fff'}}>
      Tips rakam video
      <br />
      guna{' '}
      <span style={{background: light ? T.lime : 'transparent', color: light ? T.ink : T.lime, padding: light ? '0 12px' : 0, borderRadius: 8}}>telefon je.</span>
    </div>
  );
};
