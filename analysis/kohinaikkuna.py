r"""Kohinaikkuna ja hiljaisuudet: hiljaisin 1 s ikkuna kuuntelukopiosta, alku- ja loppuhiljaisuus.

Lähteessä ei ole loppuuraa eikä sisäänajouraa, jonka voisi olettaa, joten pintakohinan vertailukohta
mitataan tiedostosta: hiljaisin 1 s ikkuna (RMS dBFS, mono = 0,5 L + 0,5 R) a) tiedoston alusta,
b) lopusta ja c) koko tiedostosta. Valittu ikkuna kirjoitetaan config.json:iin ("kohinaikkuna");
prepare.py lukee sen sieltä.

Kirjaa myös, kuinka pitkä hiljaisuus tai pelkkä rahina on ennen ensimmäistä patarumpuääntä ja
tiedoston lopussa. Raja: 100 ms RMS-verhokäyrä ylittää kohinaikkunan tason + 6 dB tai + 10 dB.

    .venv\Scripts\python.exe -I analysis/kohinaikkuna.py [--choose all|start|end] [--no-write]
"""
import argparse
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

WIN = 1.0      # ikkunan pituus (s)
HOP = 0.05     # ikkunan askel (s)
EDGE = 30.0    # "alku" ja "loppu" = ensimmäiset ja viimeiset 30 s
ENV = 0.1      # verhokäyrän ikkuna (s)


def db(x):
    return float(20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-12))


def window_levels(y, sr):
    """Liukuvan 1 s ikkunan RMS (dBFS) kumulatiivisesta neliösummasta."""
    w, h = int(WIN * sr), int(HOP * sr)
    c = np.concatenate([[0.0], np.cumsum(y.astype(np.float64) ** 2)])
    starts = np.arange(0, len(y) - w + 1, h)
    rms = np.sqrt((c[starts + w] - c[starts]) / w)
    return starts / sr, 20 * np.log10(rms + 1e-12)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--choose", choices=("all", "start", "end"), default="all",
                    help="mistä config.json:iin kirjattava ikkuna valitaan (oletus koko tiedosto)")
    ap.add_argument("--no-write", action="store_true")
    a = ap.parse_args()
    cfg = lahde.config()
    path = lahde.listening_copy(cfg)
    y, sr = sf.read(str(path), dtype="float32", always_2d=True)
    y = y.mean(axis=1)
    dur = len(y) / sr
    t, lv = window_levels(y, sr)
    sel = {"start": t < EDGE, "end": t > dur - EDGE - WIN, "all": np.ones(len(t), bool)}
    found = {}
    for name, m in sel.items():
        i = np.where(m)[0][np.argmin(lv[m])]
        found[name] = {"alku_s": round(float(t[i]), 3), "kesto_s": WIN, "taso_dbfs": round(float(lv[i]), 2)}
        print(f"hiljaisin {WIN:.0f} s ikkuna, {name:<5}: {t[i]:9.3f}–{t[i] + WIN:9.3f} s, {lv[i]:7.2f} dBFS")
    chosen = dict(found[a.choose], valittu=a.choose)

    # 100 ms RMS-verhokäyrä ja ensimmäinen / viimeinen kohta, jossa se ylittää kohinatason
    n = int(ENV * sr)
    m = len(y) // n
    env = 20 * np.log10(np.sqrt((y[: m * n].reshape(m, n).astype(np.float64) ** 2).mean(axis=1)) + 1e-12)
    te = np.arange(m) * ENV
    floor = chosen["taso_dbfs"]
    gaps = {}
    for margin in (6, 10):
        above = np.where(env > floor + margin)[0]
        first = float(te[above[0]]) if len(above) else None
        last = float(te[above[-1]] + ENV) if len(above) else None
        gaps[f"+{margin} dB"] = {"alku_hiljaisuus_s": first, "loppu_hiljaisuus_s": None if last is None else round(dur - last, 2)}
        print(f"100 ms verhokäyrä > kohinataso + {margin} dB: ensimmäinen {first} s, viimeinen päättyy {last} s "
              f"(alussa {first} s ja lopussa {None if last is None else round(dur - last, 2)} s kohinatasoa)")
    print("alun verhokäyrä (dBFS, 0,5 s askel, ensimmäiset 8 s): " +
          " ".join(f"{float(env[int(s / ENV):int(s / ENV) + 5].mean()):.1f}" for s in np.arange(0, 8, 0.5)))
    print("lopun verhokäyrä (dBFS, 0,5 s askel, viimeiset 8 s): " +
          " ".join(f"{float(env[int(s / ENV):int(s / ENV) + 5].mean()):.1f}" for s in np.arange(dur - 8, dur - 0.5, 0.5)))
    print(f"tiedoston kokonaiskesto {dur:.3f} s; koko tiedoston RMS {db(y):.2f} dBFS")

    if not a.no_write:
        cfg["kohinaikkuna"] = {**chosen, "menetelma": "hiljaisin 1 s ikkuna, RMS dBFS, mono 0,5L+0,5R, askel 50 ms, kuuntelukopiosta",
                               "ehdokkaat": found, "hiljaisuudet": gaps, "kesto_s_tiedosto": round(dur, 3)}
        lahde.save_config(cfg)
        print(f"kirjattu: {lahde.CONFIG.relative_to(lahde.ROOT)} -> kohinaikkuna ({a.choose})")


if __name__ == "__main__":
    main()
