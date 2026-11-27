import React from 'react';
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {Burst, Car, Clock, Speedo} from './Art';
import {InkWipe, io, k, P, Paper, Said, Stamp, Strike, useSpr, W, WE} from './kit';
import {WORDS} from './words';

const L = 80; // left margin
export const SC = {
  hook: 0,
  buzz: W(12) - 6, // "Premium. Mewah…"
  compare: W(31) - 8, // "Tengok bezanya"
  silence: W(55) - 6, // "Itulah bezanya"
  secret: W(74) - 6, // "Itu rahsianya"
  proof: W(101) - 6, // "Orang tak percaya…"
  moral: W(111) - 6, // "Perkataan besar, dilupakan"
  cta: W(116) - 6, // "Nak content…"
};
export const TOTAL = WE(125) + 40;

const Label: React.FC<{children: React.ReactNode; style?: React.CSSProperties; color?: string}> = ({children, style, color = P.ink}) => (
  <div style={{fontFamily: P.sans, fontWeight: 700, fontSize: 24, letterSpacing: 6, color, ...style}}>{children}</div>
);

// =========================================================== 1. hook — "Berhenti panggil produk anda 'premium'"
export const S1Hook: React.FC = () => {
  const g = useCurrentFrame();
  const trust = interpolate(g, [W(7), W(8) + 12], [0.94, 0.03], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  const out = k(g, SC.buzz - 6, SC.buzz + 6);
  return (
    <AbsoluteFill>
      <Paper />
      <div style={{position: 'absolute', left: L, right: L, top: 540, opacity: 1 - out, filter: `blur(${out * 8}px)`}}>
        <Said from={0} to={3} size={96} breaks={[1]} />
        <div style={{position: 'relative', display: 'inline-block', marginTop: 20}}>
          <Said from={4} to={4} size={190} italic weight={900} style={{letterSpacing: -4}} />
          {g >= W(5) && <Strike at={W(5)} thick={16} />}
          <Stamp at={W(8)} text="TAK DIPERCAYAI" size={40} rot={-9} style={{right: 10, top: -80}} />
        </div>
        {/* trust meter */}
        <div style={{marginTop: 110, opacity: k(g, W(5) - 4, W(5) + 6)}}>
          <Label style={{fontSize: 22}}>KEPERCAYAAN PEMBACA</Label>
          <div style={{marginTop: 14, height: 26, border: `3px solid ${P.ink}`, position: 'relative'}}>
            <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${trust * 100}%`, background: trust < 0.3 ? P.red : P.ink}} />
          </div>
          <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 64, marginTop: 8}}>{Math.round(trust * 100)}%</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// =========================================================== 2. buzzwords pile up, get crossed, hide the empty proof box
const BUZZ: {w: [number, number]; txt: string; x: number; y: number; rot: number; fill: string; size: number}[] = [
  {w: [12, 12], txt: 'PREMIUM!', x: 90, y: 560, rot: -12, fill: '#f4c430', size: 330},
  {w: [13, 13], txt: 'MEWAH', x: 620, y: 520, rot: 10, fill: '#f08a5d', size: 300},
  {w: [14, 15], txt: 'Berkualiti Tinggi', x: 160, y: 900, rot: 6, fill: '#9ad0c2', size: 340},
  {w: [16, 18], txt: 'Terbaik di Pasaran', x: 560, y: 880, rot: -8, fill: '#f4c430', size: 360},
];
export const S2Buzz: React.FC = () => {
  const g = useCurrentFrame();
  const hide = k(g, W(25), W(25) + 14, io); // "sembunyikan"
  const reveal = k(g, W(30) - 2, W(30) + 12, io); // "bukti"
  const out = k(g, SC.compare - 4, SC.compare + 8);
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Paper />
      <div style={{position: 'absolute', left: L, top: 330}}>
        <Label>KATA-KATA KOSONG</Label>
      </div>
      {/* the proof box the buzzwords hide */}
      <div style={{position: 'absolute', left: 240, top: 1260, width: 600, height: 260, border: `4px dashed ${P.ink}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: k(g, W(24), W(24) + 8)}}>
        <Label>BUKTI</Label>
        <div style={{fontFamily: P.type, fontSize: 56, color: P.inkSoft, marginTop: 14}}>(kosong)</div>
      </div>
      {BUZZ.map((b, i) => {
        const s = useSpr(g - W(b.w[0]), 9, 170);
        const struck = W(19 + Math.min(i, 3)) + i * 3; // "Perkataan ni tak menjual"
        const ty = interpolate(hide, [0, 1], [0, 1290 + (i % 2) * 60 - b.y - b.size / 2]) + reveal * 1400;
        const tx = interpolate(hide, [0, 1], [0, 300 - b.x + (i - 1.5) * 60]);
        return (
          <div key={i} style={{position: 'absolute', left: b.x, top: b.y, transform: `translate(${tx}px, ${ty}px) scale(${s * (1 - hide * 0.3)}) rotate(${(1 - s) * 40 + hide * (i - 1.5) * 12 + reveal * (i - 1.5) * 40}deg)`}}>
            <Burst size={b.size} fill={b.fill} rot={b.rot}>
              {b.txt}
            </Burst>
            {g >= struck && (
              <div style={{position: 'absolute', left: '10%', right: '10%', top: '40%', height: '20%'}}>
                <Strike at={struck} thick={14} tilt={b.rot - 8} />
              </div>
            )}
          </div>
        );
      })}
      <div style={{position: 'absolute', left: L, right: L, top: 1600, textAlign: 'center', opacity: k(g, W(30), W(30) + 8)}}>
        <Said from={26} to={30} size={64} italic accent={{30: {color: P.red}}} />
      </div>
    </AbsoluteFill>
  );
};

// =========================================================== 3. two ads compared
const AdFrame: React.FC<{label: string; at: number; top: number; children: React.ReactNode; grade?: React.ReactNode}> = ({label, at, top, children, grade}) => {
  const g = useCurrentFrame();
  const s = useSpr(g - at, 15, 130);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top, opacity: s, transform: `translateY(${(1 - s) * 80}px) rotate(${(1 - s) * -3}deg)`}}>
      <Label style={{marginBottom: 12}}>{label}</Label>
      <div style={{background: '#f6f1e5', border: `3px solid ${P.ink}`, boxShadow: '10px 12px 0 rgba(40,30,10,.18)', padding: 30, position: 'relative'}}>
        {children}
        {grade}
      </div>
    </div>
  );
};

export const S3Compare: React.FC = () => {
  const g = useCurrentFrame();
  const mph = interpolate(g, [W(44) - 6, W(46)], [0, 60], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  const clock = useSpr(g - W(54), 10, 180);
  const ring = k(g, W(54) + 4, W(54) + 18, io);
  const out = k(g, SC.silence - 4, SC.silence + 8);
  return (
    <InkWipe start={SC.compare} cx={540} cy={960}>
      <Paper />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: L, top: 220}}>
          <Said from={31} to={32} size={88} italic />
        </div>
        <AdFrame label="IKLAN BIASA" at={W(33) - 4} top={420} grade={<Stamp at={W(39) + 6} text="BOSAN" size={36} rot={12} style={{right: 20, top: 20, position: 'absolute'}} />}>
          <div style={{display: 'flex', alignItems: 'center', gap: 20, opacity: 0.85}}>
            <Car w={360} draw={k(g, W(36), W(39))} color={P.inkSoft} />
          </div>
          <div style={{fontFamily: P.sans, fontWeight: 500, fontSize: 52, marginTop: 10, color: P.inkSoft}}>
            {g >= W(37) ? '"Kereta ni ' : ''}
            {g >= W(39) ? 'senyap."' : ''}
          </div>
        </AdFrame>
        <AdFrame label="IKLAN HEBAT" at={W(40) - 4} top={900}>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
            <Speedo size={250} mph={mph} />
            <div style={{position: 'relative', transform: `scale(${clock})`, transformOrigin: 'center'}}>
              <Clock size={210} f={g} />
              <svg width={250} height={250} style={{position: 'absolute', left: -20, top: -20, overflow: 'visible'}}>
                <ellipse cx={125} cy={125} rx={122} ry={118} fill="none" stroke={P.red} strokeWidth={6} strokeDasharray={800} strokeDashoffset={800 * (1 - ring)} transform="rotate(-20 125 125)" />
              </svg>
            </div>
          </div>
          <div style={{marginTop: 22}}>
            <Said from={43} to={54} size={46} font={P.type} weight={400} step="type" accent={{44: {color: P.red}, 54: {color: P.red, textDecoration: 'underline'}}} style={{lineHeight: 1.3}} />
          </div>
        </AdFrame>
      </div>
    </InkWipe>
  );
};

// =========================================================== 4. one line vs a thousand adjectives → feel the silence (ink page)
const ADJ = ['premium', 'mewah', 'hebat', 'terbaik', 'eksklusif', 'canggih', 'unggul', 'berkualiti', 'elegan', 'nombor 1', 'revolusi', 'luar biasa', 'mantap', 'power', 'terulung'];
export const S4Silence: React.FC = () => {
  const g = useCurrentFrame();
  const swarm = k(g, W(64), W(67) + 6);
  const hush = k(g, W(72) - 4, W(73) + 6, io); // "RASA senyapnya"
  const out = k(g, SC.secret - 4, SC.secret + 8);
  return (
    <InkWipe start={SC.silence} cx={540} cy={1200}>
      <Paper dark />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: L, top: 230, opacity: 1 - hush * 0.85}}>
          <Said from={55} to={56} size={88} color="#f2ecdf" italic />
        </div>
        {/* a thousand adjectives */}
        {new Array(70).fill(0).map((_, i) => {
          const x = random(`ax${i}`) * 960 + 20;
          const y = 420 + random(`ay${i}`) * 1000;
          const d = random(`ad${i}`);
          const v = k(g, W(65) + d * 30, W(65) + d * 30 + 8) * (1 - hush);
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, fontFamily: P.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 22 + d * 26, color: `rgba(216,208,189,${0.18 + d * 0.3})`, opacity: v * swarm, transform: `translateY(${(1 - v) * 20}px)`}}>
              {ADJ[i % ADJ.length]}
            </div>
          );
        })}
        {/* the one line */}
        <div style={{position: 'absolute', left: L, right: L, top: 760, textAlign: 'center', opacity: 1 - hush}}>
          <div style={{fontFamily: P.sans, letterSpacing: 6, fontSize: 24, color: '#d8d0bd', opacity: k(g, W(57), W(57) + 8)}}>1 AYAT</div>
          <Said from={57} to={63} size={64} color="#f2ecdf" breaks={[59]} />
          <div style={{fontFamily: P.sans, letterSpacing: 6, fontSize: 24, color: '#8d8572', marginTop: 30, opacity: k(g, W(64), W(64) + 8)}}>VS</div>
          <Said from={64} to={67} size={64} color="#8d8572" />
        </div>
        {/* silence */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 700, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: hush}}>
          <Clock size={340} f={g} color="#f2ecdf" face={P.ink} />
          <div style={{marginTop: 50}}>
            <Said from={72} to={73} size={110} italic color="#f2ecdf" accent={{72: {color: P.red}}} />
          </div>
          <div style={{fontFamily: P.type, fontSize: 34, color: '#8d8572', marginTop: 20}}>tik… tik… tik…</div>
        </div>
      </div>
    </InkWipe>
  );
};

// =========================================================== 5. the secret — claim vs proof table
const ROWS: {claim: number; claimEnd: number; proofFrom: number; proofTo: number; proofText: string}[] = [
  {claim: 78, claimEnd: 78, proofFrom: 79, proofTo: 83, proofText: 'Jimat 2 jam'},
  {claim: 86, claimEnd: 86, proofFrom: 87, proofTo: 90, proofText: 'Siapa yang percaya'},
  {claim: 93, claimEnd: 94, proofFrom: 95, proofTo: 100, proofText: 'Apa yang ia lalui'},
];
export const S5Secret: React.FC = () => {
  const g = useCurrentFrame();
  const out = k(g, SC.proof - 4, SC.proof + 8);
  return (
    <InkWipe start={SC.secret} cx={540} cy={300}>
      <Paper />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: L, top: 230}}>
          <Said from={74} to={75} size={96} italic />
        </div>
        <div style={{position: 'absolute', left: L, right: L, top: 470, display: 'flex', fontFamily: P.sans, fontWeight: 700, letterSpacing: 6, fontSize: 24, opacity: k(g, W(76) - 6, W(76) + 4)}}>
          <div style={{flex: 1}}>JANGAN CAKAP</div>
          <div style={{flex: 1.3}}>TUNJUK BUKTI</div>
        </div>
        <div style={{position: 'absolute', left: L, right: L, top: 512, height: 3, background: P.ink, transformOrigin: 'left', transform: `scaleX(${k(g, W(76) - 4, W(76) + 10)})`}} />
        {ROWS.map((r, i) => {
          const c = useSpr(g - W(r.claim), 12, 180);
          const p = useSpr(g - W(r.proofFrom), 13, 160);
          const top = 560 + i * 300;
          const claimTxt = WORDS[r.claim][0] + (r.claimEnd > r.claim ? ' ' + WORDS[r.claimEnd][0] : '');
          return (
            <div key={i} style={{position: 'absolute', left: L, right: L, top, height: 260, display: 'flex', alignItems: 'center', borderBottom: `2px solid ${P.ink}`}}>
              <div style={{flex: 1, position: 'relative', opacity: c, transform: `translateX(${(1 - c) * -40}px)`}}>
                <span style={{position: 'relative', display: 'inline-block', fontFamily: P.serif, fontWeight: 800, fontSize: 64, color: P.inkSoft, textTransform: 'capitalize'}}>
                  {claimTxt.replace(/[.,]/g, '')}
                  {g >= W(r.proofFrom) && <Strike at={W(r.proofFrom)} thick={10} />}
                </span>
              </div>
              <div style={{flex: 1.3, position: 'relative', opacity: p, transform: `translateX(${(1 - p) * 40}px)`}}>
                <div style={{fontFamily: P.serif, fontWeight: 900, fontSize: 60, lineHeight: 1.05}}>{r.proofText}</div>
                <Stamp at={W(r.proofTo) - 4} text="✓ BUKTI" size={28} rot={-6} style={{right: 0, top: -50}} />
              </div>
            </div>
          );
        })}
      </div>
    </InkWipe>
  );
};

// =========================================================== 6. big words vs sharp proof (rack focus)
export const S6Proof: React.FC = () => {
  const g = useCurrentFrame();
  const focus = k(g, W(106), W(110), io);
  const out = k(g, SC.moral - 4, SC.moral + 8);
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Paper />
      <div style={{position: 'absolute', left: L, right: L, top: 230}}>
        <Said from={101} to={105} size={72} breaks={[103]} />
      </div>
      <div style={{position: 'absolute', left: -40, right: -40, top: 640, textAlign: 'center', fontFamily: P.serif, fontWeight: 900, fontSize: 250, lineHeight: 0.9, color: P.ink, opacity: k(g, W(104), W(104) + 8) * (1 - focus * 0.75), filter: `blur(${focus * 18}px)`, letterSpacing: -6}}>
        PREMIUM
        <br />
        MEWAH
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1210, display: 'flex', justifyContent: 'center', opacity: focus, filter: `blur(${(1 - focus) * 14}px)`}}>
        <div style={{border: `5px solid ${P.red}`, padding: '18px 44px', fontFamily: P.sans, fontWeight: 700, letterSpacing: 12, fontSize: 80, color: P.red}}>BUKTI</div>
      </div>
      <div style={{position: 'absolute', left: L, right: L, top: 1420, textAlign: 'center'}}>
        <Said from={106} to={110} size={64} italic accent={{110: {color: P.red}}} />
      </div>
    </AbsoluteFill>
  );
};

// =========================================================== 7. moral (ink page): big words forgotten, proof remembered
export const S7Moral: React.FC = () => {
  const g = useCurrentFrame();
  const forget = k(g, W(113), W(113) + 24, io);
  const out = k(g, SC.cta - 4, SC.cta + 8);
  const letters = 'Perkataan besar,'.split('');
  return (
    <InkWipe start={SC.moral} cx={540} cy={960}>
      <Paper dark />
      <div style={{opacity: 1 - out}}>
        <div style={{position: 'absolute', left: L, right: L, top: 560, fontFamily: P.serif, fontWeight: 900, fontSize: 110, color: '#f2ecdf', opacity: k(g, W(111) - 2, W(111) + 8)}}>
          {letters.map((ch, i) => {
            const d = random(`f${i}`);
            const fall = Math.max(0, forget * 1.6 - d * 0.6);
            return (
              <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${fall * 500}px) rotate(${fall * (d - 0.5) * 120}deg)`, opacity: 1 - Math.min(1, fall)}}>
                {ch}
              </span>
            );
          })}
          <div style={{fontStyle: 'italic', fontWeight: 400, fontSize: 70, color: '#8d8572'}}>
            <Said from={113} to={113} size={70} weight={400} italic color="#8d8572" />
          </div>
        </div>
        <div style={{position: 'absolute', left: L, right: L, top: 1060}}>
          <Said from={114} to={115} size={110} color="#f2ecdf" accent={{114: {color: P.red}}} breaks={[114]} />
        </div>
        <Stamp at={W(115)} text="DIINGAT" color={P.red} size={46} rot={-8} style={{left: 560, top: 1090}} />
      </div>
    </InkWipe>
  );
};

// =========================================================== 8. CTA
export const S8Cta: React.FC = () => {
  const g = useCurrentFrame();
  const logo = useSpr(g - W(124), 12, 140);
  const fade = k(g, TOTAL - 26, TOTAL - 2);
  return (
    <InkWipe start={SC.cta} cx={540} cy={960}>
      <Paper />
      <AbsoluteFill style={{opacity: 1 - fade}}>
        <div style={{position: 'absolute', left: L, right: L, top: 560, textAlign: 'center'}}>
          <Said from={116} to={122} size={84} breaks={[119]} accent={{120: {color: P.red}, 122: {color: P.inkSoft, textDecoration: g >= W(122) + 6 ? 'line-through' : 'none', textDecorationColor: P.red, textDecorationThickness: 8}}} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 980, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <Said from={123} to={123} size={44} font={P.sans} weight={500} style={{letterSpacing: 8}} />
          <div style={{marginTop: 30, opacity: logo, transform: `scale(${0.8 + logo * 0.2})`}}>
            <Img src={staticFile('logo-dark.png')} style={{width: 640}} />
          </div>
          <div style={{marginTop: 40, fontFamily: P.type, fontSize: 36, opacity: k(g, WE(125), WE(125) + 10)}}>WhatsApp Dee · 011-1620 0864</div>
        </div>
      </AbsoluteFill>
    </InkWipe>
  );
};
