"""Synthesize simple motion-graphics sound effects (numpy only) -> 16-bit WAV."""
import sys, wave
import numpy as np

SR = 44100
OUT = sys.argv[1]
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def save(name, x, peak=0.9):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    fade = min(len(x), int(SR * 0.004))
    x[:fade] *= np.linspace(0, 1, fade)
    x[-fade:] *= np.linspace(1, 0, fade)
    st = np.stack([x, x], axis=1)
    with wave.open(f"{OUT}/{name}.wav", "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def bandpass(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.exp(-0.5 * ((np.log(f + 1) - np.log((lo + hi) / 2)) / (np.log(hi / lo) / 2 + 1e-9)) ** 2)
    return np.fft.irfft(X * m, len(x))


def sweep_noise(d, f0, f1, width=1.2, chunk=0.02):
    """noise through a band-pass whose centre glides f0 -> f1 (overlap-add)."""
    n = int(SR * d)
    hop = int(SR * chunk)
    win = np.hanning(hop * 2)
    out = np.zeros(n + hop * 2)
    noise = rng.standard_normal(n + hop * 2)
    for i, s in enumerate(range(0, n, hop)):
        fc = f0 * (f1 / f0) ** (s / n)
        seg = noise[s : s + hop * 2] * win
        out[s : s + hop * 2] += bandpass(seg, fc / (1 + width), fc * (1 + width))
    return out[:n]


def env_bell(n, peak=0.5, sharp=2.0):
    x = np.linspace(0, 1, n)
    return np.where(x < peak, (x / peak) ** sharp, ((1 - x) / (1 - peak)) ** sharp)


# whoosh (rising) & swipe
d = 0.6
w = sweep_noise(d, 250, 3500) * env_bell(int(SR * d), 0.6, 1.6)
save("whoosh", w)
d = 0.55
w = sweep_noise(d, 3000, 300) * env_bell(int(SR * d), 0.25, 1.6)
save("whoosh_down", w)
d = 0.28
w = sweep_noise(d, 800, 5000, 0.8) * env_bell(int(SR * d), 0.45, 1.3)
save("swipe", w)

# pop (pitch drop blip)
d = 0.12
tt = t(d)
f = 950 * np.exp(-tt * 28) + 280
ph = 2 * np.pi * np.cumsum(f) / SR
save("pop", np.sin(ph) * np.exp(-tt * 38) + 0.15 * rng.standard_normal(len(tt)) * np.exp(-tt * 400))

# click (UI mouse click)
d = 0.05
tt = t(d)
save("click", 0.7 * np.sin(2 * np.pi * 2400 * tt) * np.exp(-tt * 160) + rng.standard_normal(len(tt)) * np.exp(-tt * 900), 0.8)

# tick (picker detent)
d = 0.04
tt = t(d)
save("tick", np.sin(2 * np.pi * 1700 * tt) * np.exp(-tt * 180) + 0.4 * np.sin(2 * np.pi * 3400 * tt) * np.exp(-tt * 260), 0.7)

# glitch (digital stutter)
d = 0.4
n = int(SR * d)
g = np.zeros(n)
pos = 0
while pos < n:
    L = int(SR * rng.uniform(0.012, 0.045))
    tt = np.arange(L) / SR
    fr = rng.choice([180, 360, 720, 1440, 2900])
    seg = np.sign(np.sin(2 * np.pi * fr * tt)) * (rng.random() > 0.25)
    seg = np.round(seg * 4) / 4 + 0.3 * rng.standard_normal(L) * (rng.random() > 0.5)
    g[pos : pos + L] = seg[: max(0, min(L, n - pos))]
    pos += L
save("glitch", g * np.linspace(1, 0.3, n), 0.55)

# impact (sub boom + transient)
d = 1.2
tt = t(d)
f = 95 * np.exp(-tt * 6) + 42
boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 3.2)
trans = bandpass(rng.standard_normal(len(tt)), 80, 1200) * np.exp(-tt * 30)
save("impact", np.tanh(1.6 * boom) + 0.6 * trans / (np.max(np.abs(trans)) + 1e-9))

# shimmer (sparkly)
d = 0.9
tt = t(d)
sh = np.zeros_like(tt)
for k in range(14):
    fr = rng.uniform(2500, 7500)
    st = rng.uniform(0, 0.35)
    e = np.where(tt > st, np.exp(-(tt - st) * rng.uniform(6, 12)), 0)
    sh += np.sin(2 * np.pi * fr * tt) * e * rng.uniform(0.3, 1)
save("shimmer", sh, 0.6)

# ding (bell for CTA)
d = 1.4
tt = t(d)
bell = sum(a * np.sin(2 * np.pi * fr * tt) * np.exp(-tt * dec) for fr, a, dec in [(1320, 1, 3.5), (2640, 0.45, 5), (3960, 0.25, 7), (1760, 0.3, 4)])
save("ding", bell, 0.7)

# scribble (pen on paper)
d = 1.4
tt = t(d)
sc = bandpass(rng.standard_normal(len(tt)), 1800, 6000)
am = np.abs(np.sin(2 * np.pi * 7 * tt + 2 * np.sin(2 * np.pi * 1.3 * tt))) ** 1.5
save("scribble", sc * am * env_bell(len(tt), 0.1, 0.6), 0.5)

# bloop (liquid)
d = 0.35
tt = t(d)
f = 180 + 650 * (tt / d) ** 0.6 + 60 * np.sin(2 * np.pi * 18 * tt)
save("bloop", np.sin(2 * np.pi * np.cumsum(f) / SR) * env_bell(len(tt), 0.2, 1.2))

print("ok")
