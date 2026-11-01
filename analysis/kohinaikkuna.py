r"""Kohinaikkuna ja hiljaisuudet: hiljaisin 1 s ikkuna kuuntelukopiosta, alku- ja loppuhiljaisuus.

Lähteessä ei ole loppuuraa eikä sisäänajouraa, jonka voisi olettaa, joten pintakohinan vertailukohta
mitataan tiedostosta: hiljaisin 1 s ikkuna (RMS dBFS, mono = 0,5 L + 0,5 R) a) tiedoston alusta,
b) lopusta ja c) koko tiedostosta. Valittu ikkuna kirjoitetaan config.json:iin ("kohinaikkuna");
prepare.py lukee sen sieltä.

Digitaalinen hiljaisuus (kaikki näytteet täsmälleen 0 molemmissa kanavissa; tiedosto voi alkaa ja loppua
sellaisella) ei ole kohinaa: ikkunat, joissa on yli 0,1 % täsmälleen nollanäytteitä, jätetään kohinaikkunan
haussa pois ("hiljaisin ei-digitaalinen ikkuna"). Digitaaliset jaksot (yli 0,5 s) ja huoneen kohina ennen
ensimmäistä ääntä kirjataan erikseen.

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


def runs_end(runs, which, dur=None):
    """Alku-/loppuhaku siirtyy digitaalisen hiljaisuuden yli: palauttaa alun hiljaisuuden tai lopun hiljaisuuden pituuden."""
    if which == "start":
        return runs[0][1] if runs and runs[0][0] == 0.0 else 0.0
    return dur - runs[-1][0] if runs and abs(runs[-1][1] - dur) < 0.01 else 0.0


def digital_runs(y2, sr, min_s=0.5):
    """Täysin nolla (molemmat kanavat) -jaksot, jotka ovat vähintään min_s pitkiä: [(alku_s, loppu_s)]."""
    z = (np.abs(y2).max(axis=1) == 0).astype(np.int8)
    d = np.diff(np.concatenate([[0], z, [0]]))
    return [(float(a / sr), float(b / sr)) for a, b in zip(np.where(d == 1)[0], np.where(d == -1)[0]) if b - a >= min_s * sr]


def zero_fraction(y2, sr):
    """Täsmälleen nollanäytteiden osuus liukuvassa 1 s ikkunassa (askel HOP), samoilla ikkunoilla kuin window_levels."""
    w, h = int(WIN * sr), int(HOP * sr)
    z = np.concatenate([[0], np.cumsum((np.abs(y2).max(axis=1) == 0).astype(np.int64))])
    starts = np.arange(0, len(y2) - w + 1, h)
    return (z[starts + w] - z[starts]) / w


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--choose", choices=("all", "start", "end"), default="all",
                    help="mistä config.json:iin kirjattava ikkuna valitaan (oletus koko tiedosto)")
    ap.add_argument("--no-write", action="store_true")
    a = ap.parse_args()
    cfg = lahde.config()
    path = lahde.listening_copy(cfg)
    y2, sr = sf.read(str(path), dtype="float32", always_2d=True)
    y = y2.mean(axis=1)
    dur = len(y) / sr
    t, lv = window_levels(y, sr)
    zf = zero_fraction(y2, sr)
    dig = zf > 0.001
    runs = digital_runs(y2, sr)
    print("digitaalinen hiljaisuus (>0,5 s, kaikki näytteet 0): " + (", ".join(f"{a:.3f}–{b:.3f} s ({b - a:.3f} s)" for a, b in runs) or "ei"))
    print(f"digitaalisia (>0,1 % nollanäytteitä) 1 s ikkunoita {int(dig.sum())}/{len(dig)}: pois kohinaikkunan haussa")
    lv = np.where(dig, np.inf, lv)
    sel = {"start": (t < EDGE + runs_end(runs, "start")), "end": (t > dur - EDGE - WIN - runs_end(runs, "end", dur)), "all": np.ones(len(t), bool)}
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
    # Digitaalisen hiljaisuuden jälkeinen huoneen kohina ja musiikin alku/loppu (100 ms verhokäyrä)
    a0 = runs[0][1] if runs and runs[0][0] == 0.0 else 0.0
    b0 = runs[-1][0] if runs and abs(runs[-1][1] - dur) < 0.01 else dur
    room = {}
    if a0 > 0 or b0 < dur:
        i0 = int((a0 + 0.3) / ENV)
        i1 = int((a0 + 2.0) / ENV)
        room_db = float(np.median(env[i0:i1]))
        on = np.where((te > a0) & (env > room_db + 10))[0]
        off = np.where((te < b0) & (env > room_db + 10))[0]
        room = {"ensimmainen_ei_digitaalinen_s": round(a0, 4), "viimeinen_ei_digitaalinen_s": round(b0, 4),
                "huoneen_kohina_dbfs": round(room_db, 1), "kohina_menetelma": "100 ms RMS, mediaani 0,3–2,0 s ensimmäisen ei-nollanäytteen jälkeen",
                "ensimmainen_aani_s": round(float(te[on[0]]), 2) if len(on) else None,
                "musiikki_loppuu_s": round(float(te[off[-1]] + ENV), 2) if len(off) else None,
                "raja": "100 ms RMS > huoneen kohina + 10 dB"}
        print(f"ei-digitaalinen ääni alkaa {a0:.3f} s, päättyy {b0:.3f} s; huoneen kohina {room_db:.1f} dBFS; ensimmäinen ääni (kohina + 10 dB) "
              f"{room['ensimmainen_aani_s']} s; musiikki loppuu (viimeinen kohina + 10 dB) {room['musiikki_loppuu_s']} s")
    print("alun verhokäyrä (dBFS, 0,5 s askel, ensimmäiset 8 s): " +
          " ".join(f"{float(env[int(s / ENV):int(s / ENV) + 5].mean()):.1f}" for s in np.arange(0, 8, 0.5)))
    print("lopun verhokäyrä (dBFS, 0,5 s askel, viimeiset 8 s): " +
          " ".join(f"{float(env[int(s / ENV):int(s / ENV) + 5].mean()):.1f}" for s in np.arange(dur - 8, dur - 0.5, 0.5)))
    print(f"tiedoston kokonaiskesto {dur:.3f} s; koko tiedoston RMS {db(y):.2f} dBFS")

    if not a.no_write:
        cfg["kohinaikkuna"] = {**chosen, "menetelma": "hiljaisin 1 s ikkuna, RMS dBFS, mono 0,5L+0,5R, askel 50 ms, kuuntelukopiosta",
                               "ehdokkaat": found, "hiljaisuudet": gaps, "digitaaliset_jaksot_s": runs, "huone": room, "kesto_s_tiedosto": round(dur, 3)}
        lahde.save_config(cfg)
        print(f"kirjattu: {lahde.CONFIG.relative_to(lahde.ROOT)} -> kohinaikkuna ({a.choose})")


if __name__ == "__main__":
    main()
