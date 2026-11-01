r"""Kellotarkistus: soivatko johdetut äänitiedostot samaa aikaa kuin vertailutiedosto (kuuntelukopio).

Kaikki ajat (teemakartta, kuunteluopas, cues.json, video) ovat kuuntelukopion aikaa (0 = tiedoston alku).
Analyysi tehdään kuitenkin johdetuista tiedostoista (prepare.py: monoksi muunnettu, naksahdukset ja
kohina poistettu, näytetaajuus muutettu; Demucs-stemmit; kuuntelunäytteet). Tämä työkalu mittaa
jokaisesta tiedostosta ristikorrelaatiolla useassa kohdassa, kuinka paljon sama ääni on myöhässä (+)
tai etuajassa (-) vertailuun nähden, ja laskee ajautumisen (soiko tiedosto eri vauhtia, ppm).

Vertailu luetaan suoraan soundfilellä (ei ffmpegiä), joten se on riippumaton prepare.py:n leikkauksesta.
Vertailu on oletuksena kuuntelukopio (config.json); --ref voi olla myös lähde (mp3), jos soundfile lukee
sen. Molemmat muunnetaan 8 kHz:iin; erottelu noin 0,1 ms.

    .venvScriptspython.exe -I analysis/kellot.py build/testi60
    .venvScriptspython.exe -I analysis/kellot.py --file build/kuuntelu/otteet/0000-0060.wav --start 0
    .venvScriptspython.exe -I analysis/kellot.py --file video_aani.wav --start 211
      (--ref: vertailutiedosto, oletus kuuntelukopio; --start = tiedoston alku vertailun ajassa)
"""
import argparse
import json
import sys
from fractions import Fraction
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import correlate, resample_poly

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

ROOT = lahde.ROOT
FS = 8000
WIN, MARGIN = 6.0, 0.5  # vertailuikkuna ja haettava siirtymä (s)
SILENT_DB = -45.0       # hiljaisia ikkunoita (esim. yleistauko) ei mitata (--silent-db)


def read(path, t0, t1):
    """Mono 8 kHz:llä; path voi olla myös lista (stemmit summataan takaisin miksaukseksi)."""
    paths = path if isinstance(path, list) else [path]
    info = sf.info(str(paths[0]))
    a, b = max(0, int(round(t0 * info.samplerate))), int(round(t1 * info.samplerate))
    y = sum(sf.read(str(q), start=a, stop=min(b, info.frames), dtype="float32", always_2d=True)[0].mean(axis=1)
            for q in paths)
    sr = info.samplerate
    fr = Fraction(FS, sr).limit_denominator(1000)
    return resample_poly(y, fr.numerator, fr.denominator).astype(np.float64), a / info.samplerate


def offset_at(orig, start, path, tc):
    """Ero (ms) = tiedoston aika - vertailun aika samalle äänelle, ikkunassa tc..tc+WIN (tiedoston aikaa)."""
    d, _ = read(path, tc, tc + WIN)
    if len(d) < WIN * FS * 0.9 or 20 * np.log10(np.sqrt(np.mean(d ** 2)) + 1e-12) < SILENT_DB:
        return None, None
    o, o0 = read(orig, start + tc - MARGIN, start + tc + WIN + MARGIN)
    d = d - d.mean()
    o = o - o.mean()
    c = correlate(o, d, mode="valid")
    # normitus: liukuva energia alkuperäisestä
    e = np.sqrt(np.convolve(o ** 2, np.ones(len(d)), mode="valid") * np.sum(d ** 2)) + 1e-12
    r = c / e
    k = int(np.argmax(r))
    frac = 0.0
    if 0 < k < len(r) - 1:
        y0, y1, y2 = r[k - 1], r[k], r[k + 1]
        den = y0 - 2 * y1 + y2
        frac = 0.5 * (y0 - y2) / den if den else 0.0
    orig_start_pkg = o0 - start  # ikkunan alku tiedoston ajassa (leikkaus alkuun)
    return 1000 * (tc - (orig_start_pkg + (k + frac) / FS)), float(r[k])


def check(path, start, times, label, ref=None):
    orig = ref or lahde.listening_copy()
    rows = []
    for tc in times:
        ms, r = offset_at(orig, start, path, tc)
        rows.append((tc, ms, r))
    ok = [(tc, ms) for tc, ms, r in rows if ms is not None and r > 0.5]
    drift = None
    if len(ok) >= 2:
        x, y = np.array(ok).T
        drift = np.polyfit(x, y, 1)[0] * 1000  # ms/s -> ppm
    cells = "  ".join(f"{tc:6.0f}s:{'   hiljaa' if ms is None else f'{ms:+7.2f} ms ({r:.2f})'}" for tc, ms, r in rows)
    worst = max((abs(ms) for _, ms in ok), default=float("nan"))
    print(f"{label:<34} suurin ero {worst:6.2f} ms, ajautuminen {'-' if drift is None else f'{drift:+.1f} ppm'}")
    print(f"    {cells}")
    return worst, drift


def times_for(dur):
    n = max(3, int(dur // 60) + 1)
    return [round(float(t), 1) for t in np.linspace(5, dur - WIN - 2, n)]


def main():
    global SILENT_DB
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("packages", nargs="*")
    ap.add_argument("--file")
    ap.add_argument("--start", type=float, default=0.0, help="--file: tiedoston alku vertailun ajassa")
    ap.add_argument("--ref", help="vertailutiedosto (oletus kuuntelukopio, config.json)")
    ap.add_argument("--tol", type=float, default=1.0, help="hyväksyntäraja (ms)")
    ap.add_argument("--silent-db", type=float, default=SILENT_DB, help="tätä hiljaisempia ikkunoita ei mitata")
    a = ap.parse_args()
    SILENT_DB = a.silent_db
    ref = a.ref or str(lahde.listening_copy())
    print(f"Ero = tiedoston aika - {Path(ref).name} aika samalle äänelle (+ = myöhässä). Suluissa korrelaatio. Raja {a.tol} ms.")
    bad = 0
    if a.file:
        dur = sf.info(a.file).duration
        w, _ = check(a.file, a.start, times_for(dur), Path(a.file).name, ref)
        bad += not (w <= a.tol)
    for p in a.packages:
        p = Path(p)
        meta = json.loads((p / "prepare.json").read_text(encoding="utf-8"))
        start, dur = meta["start"], meta["duration"]
        print(f"\n== {p}  (alkaa {start:.1f} s kuuntelukopiossa, kesto {dur:.0f} s)")
        stems = sorted((p / "stems").glob("*.wav"))
        for f in [p / f for f in meta["files"]] + stems:
            if not f.exists():
                print(f"{f.name:<34} puuttuu")
                continue
            info = sf.info(str(f))
            if abs(info.duration - dur) > 0.05:
                print(f"{f.name:<34} kesto {info.duration:.3f} s (odotettu {dur:.3f})")
                bad += 1
        # yksittäinen stemmi voi olla hiljaa tai erota miksauksesta; niiden summa on Demucsin syöte
        targets = [(p / f, f"{f} ({sf.info(str(p / f)).samplerate} Hz)") for f in meta["files"] if (p / f).exists()]
        if stems:
            targets.append((stems, f"stems: {'+'.join(f.stem for f in stems)}"))
        for f, label in targets:
            w, _ = check(f, start, times_for(dur), label, ref)
            bad += not (w <= a.tol)
    print(f"\n{f'KAIKKI SAMASSA AJASSA (ero enintään {a.tol} ms)' if not bad else f'{bad} tiedostoa poikkeaa yli {a.tol} ms (tai mittaus puuttuu)'}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
