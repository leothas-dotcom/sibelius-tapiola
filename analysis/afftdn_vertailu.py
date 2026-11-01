r"""afftdn-vertailu: tekeekö prepare.py:n kohinanpoisto (afftdn) mitään haitallista puhtaalle lähteelle?

Vertaa paketin orig_mono.wav (ei suodatusta) ja clean_mono.wav (naksahdukset ja kohina pois) valituissa ikkunoissa:
RMS-ero (dB), spektrin ero kaistoittain (Welch, dB) ja korrelaatio. Ikkunat ovat kuuntelukopion aikaa.
Ikkunat annetaan muodossa ALKU:KESTO:NIMI; oletuksena hiljainen huoneen kohina ennen musiikkia ja
paketin hiljaisin musiikillinen kohta (haetaan: matalin 6 s RMS musiikin aikana).

    .venv\Scripts\python.exe -I analysis/afftdn_vertailu.py build/rattle_koko [ALKU:KESTO:NIMI ...]
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy import signal

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

BANDS = [(20, 100), (100, 300), (300, 1000), (1000, 3000), (3000, 6000), (6000, 10000)]


def band_db(f, p, lo, hi):
    m = (f >= lo) & (f < hi)
    return 10 * np.log10(p[m].sum() + 1e-30)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("dir", type=Path)
    ap.add_argument("windows", nargs="*")
    a = ap.parse_args()
    d = a.dir if a.dir.is_absolute() else lahde.ROOT / a.dir
    o, sr = sf.read(d / "orig_mono.wav", dtype="float64")
    c, sr2 = sf.read(d / "clean_mono.wav", dtype="float64")
    assert sr == sr2
    meta = json.loads((d / "prepare.json").read_text(encoding="utf-8"))
    off = meta["start"]
    wins = []
    for w in a.windows:
        t0, dur, name = w.split(":")
        wins.append((float(t0), float(dur), name))
    if not wins:
        am = json.loads((d / "analysis.json").read_text(encoding="utf-8"))
        wins.append((6.0, 1.4, "huoneen kohina ennen musiikkia"))
        hop = int(sr)
        w = int(6 * sr)
        t_music = int((am["music_start"] - off + 2) * sr)
        rms = [np.sqrt(np.mean(o[i:i + w] ** 2)) for i in range(t_music, len(o) - w - int(60 * sr), hop)]
        i = int(np.argmin(rms))
        wins.append((off + (t_music + i * hop) / sr, 6.0, "hiljaisin musiikillinen 6 s"))
    print(f"orig_mono vs clean_mono, {sr} Hz, afftdn nf={meta['afftdn_nf']} (kohinaikkuna {meta['noise_window']['start']:.2f} s)")
    for t0, dur, name in wins:
        i0, i1 = int((t0 - off) * sr), int((t0 + dur - off) * sr)
        x, y = o[i0:i1], c[i0:i1]
        rx, ry = 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12), 20 * np.log10(np.sqrt(np.mean(y ** 2)) + 1e-12)
        corr = float(np.corrcoef(x, y)[0, 1])
        f, px = signal.welch(x, sr, nperseg=4096)
        _, py = signal.welch(y, sr, nperseg=4096)
        print(f"\n{name}: {t0:.2f}–{t0 + dur:.2f} s; RMS orig {rx:.1f} dBFS, clean {ry:.1f} dBFS (ero {ry - rx:+.2f} dB); korrelaatio {corr:.4f}")
        print("  kaista Hz      orig dB   clean dB   ero dB")
        for lo, hi in BANDS:
            bx, by = band_db(f, px, lo, hi), band_db(f, py, lo, hi)
            print(f"  {lo:5d}–{hi:<6d} {bx:9.1f} {by:10.1f} {by - bx:+9.2f}")


if __name__ == "__main__":
    main()
