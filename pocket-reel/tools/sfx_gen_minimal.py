"""Soft, elegant SFX for Style 02 (numpy only). Usage: python3 sfx_gen_minimal.py OUT_DIR"""
import sys, wave
import numpy as np

SR = 44100
OUT = sys.argv[1]
rng = np.random.default_rng(11)


def t(d):
    return np.arange(int(SR * d)) / SR


def save(name, x, peak=0.8):
    x = np.asarray(x, dtype=np.float64)
    x = x / (np.max(np.abs(x)) + 1e-9) * peak
    fd = min(len(x) // 4, int(SR * 0.01))
    x[:fd] *= np.linspace(0, 1, fd)
    x[-fd:] *= np.linspace(1, 0, fd)
    st = np.stack([x, x], 1)
    with wave.open(f"{OUT}/{name}.wav", "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())


def lowpass(x, fc):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    return np.fft.irfft(X / np.sqrt(1 + (f / fc) ** 4), len(x))


def bell_env(n, peak=0.5, p=2.0):
    x = np.linspace(0, 1, n)
    return np.where(x < peak, (x / peak) ** p, ((1 - x) / (1 - peak)) ** p)


def air(d, fc0, fc1, peak):
    """breathy whoosh: low-passed noise with a gliding cutoff (overlap-add)."""
    n = int(SR * d); hop = 1024
    noise = rng.standard_normal(n + 2 * hop); out = np.zeros(n + 2 * hop); win = np.hanning(2 * hop)
    for s in range(0, n, hop):
        fc = fc0 * (fc1 / fc0) ** (s / n)
        out[s:s + 2 * hop] += lowpass(noise[s:s + 2 * hop] * win, fc)
    return out[:n] * bell_env(n, peak, 1.8)


save("min_whoosh", air(0.9, 300, 2200, 0.55), 0.6)
save("min_swish", air(0.45, 900, 3500, 0.4), 0.5)

# soft tick (wood-like)
tt = t(0.06)
save("min_tick", (np.sin(2 * np.pi * 1100 * tt) + 0.3 * np.sin(2 * np.pi * 2750 * tt)) * np.exp(-tt * 110), 0.55)

# low thump (felt piano-ish low hit)
tt = t(0.9)
th = np.sin(2 * np.pi * (70 * np.exp(-tt * 3) + 48) * tt) * np.exp(-tt * 5)
save("min_thump", np.tanh(th * 1.4) + 0.2 * lowpass(rng.standard_normal(len(tt)), 300) * np.exp(-tt * 25), 0.8)

# chime (soft glass, long tail)
tt = t(2.2)
ch = sum(a * np.sin(2 * np.pi * fr * tt + rng.uniform(0, 6)) * np.exp(-tt * dec)
         for fr, a, dec in [(880, 1, 1.6), (1318.5, 0.55, 2.0), (1760, 0.35, 2.6), (2637, 0.15, 3.5)])
save("min_chime", ch * (1 - np.exp(-tt * 300)), 0.6)
print("ok")
