r"""Vire: äänitteen sävelkorkeus suhteessa tasavireiseen A = 440 Hz (senttiä lähimmästä puolisävelaskeleesta).

CREPE (listen.py) antaa sävelkorkeuden stemmeistä. Tässä valitaan pitkät tasaiset sävelet (jatkuva sama
korkeus vähintään --min-s sekuntia, varmuus >= --conf, korkeus pysyy +-0,5 puolisävelaskelen sisällä):
  melodia_muu / melodia_laulu   other- ja vocals-stemmi: pitkät jousisävelet (puhaltimet mukana, jos soivat)
  basso                         bass-stemmi
Jokaiselle sävelelle lasketaan mediaanikorkeus ja sen poikkeama lähimmästä A=440-tasavireen sävelestä
(-50..+50 senttiä). Raportoidaan mediaani ja hajonta (keskihajonta ja MAD) sävelten yli.

Poikkeama on määritelty vain modulo puolisävelaskel: onko levy 20 senttiä korkealla vai 80 matalalla, sen
sanoo vain partituurin sävel. Vire EI korjata täällä: käyttäjä päättää (resample muuttaisi kaikkia aikoja).

    .venv\Scripts\python.exe -I analysis/vire.py build/testi60 [--from 0 --to 60]
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

FPS = 30
SOURCES = ["melodia_muu", "melodia_laulu", "basso"]


def wrap(c):
    return (np.asarray(c) + 50.0) % 100.0 - 50.0


def circ_center(cents):
    """Sentit ovat jaksollisia (100 c): ympyräkeskiarvo."""
    ang = np.asarray(cents) / 100.0 * 2 * np.pi
    return float(np.angle(np.mean(np.exp(1j * ang))) / (2 * np.pi) * 100.0)


def runs_of(midi, conf, min_s, min_conf, tol=0.5, max_gap=3):
    n = len(midi)
    ok = (midi > 0) & (conf >= min_conf)
    out, i = [], 0
    while i < n:
        if not ok[i]:
            i += 1
            continue
        j, last, vals, gap = i + 1, i, [midi[i]], 0
        while j < n:
            if ok[j] and abs(midi[j] - np.median(vals)) <= tol:
                vals.append(midi[j])
                last, gap = j, 0
            elif ok[j]:
                break
            else:
                gap += 1
                if gap > max_gap:
                    break
            j += 1
        if (last - i + 1) / FPS >= min_s:
            out.append((i, last + 1, float(np.median(midi[i:last + 1][ok[i:last + 1]]))))
        i = last + 1
    return out


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("dir", type=Path)
    ap.add_argument("--from", dest="t0", type=float, default=0.0)
    ap.add_argument("--to", dest="t1", type=float, default=60.0)
    ap.add_argument("--min-s", type=float, default=1.0)
    ap.add_argument("--conf", type=float, default=0.7)
    a = ap.parse_args()
    d = a.dir if a.dir.is_absolute() else lahde.ROOT / a.dir
    lm = json.loads((d / "listen.json").read_text(encoding="utf-8"))
    L = np.fromfile(d / "listen.f32", dtype=np.float32).reshape(lm["frames"], -1)
    ch = {c: L[:, i] for i, c in enumerate(lm["channels"])}
    start = lm["start"]
    rows = []
    for src in SOURCES:
        midi, conf = ch[f"{src}_midi"].astype(np.float64), ch[f"{src}_varmuus"].astype(np.float64)
        for i0, i1, m in runs_of(midi, conf, a.min_s, a.conf):
            t0, t1 = start + i0 / FPS, start + i1 / FPS
            if t0 < a.t0 or t1 > a.t1:
                continue
            cents = float(wrap((m - np.round(m)) * 100.0))
            rows.append({"lahde": src, "alku": round(t0, 2), "loppu": round(t1, 2), "midi": round(m, 3), "sentit": round(cents, 1)})
    if not rows:
        raise SystemExit("ei pitkiä tasaisia säveliä valitulla välillä")

    def stats(rs):
        c = np.array([r["sentit"] for r in rs])
        center = circ_center(c)
        dev = wrap(c - center)
        return {"saveliä": len(rs), "mediaani_sentit": round(float(np.median(wrap(c))), 1) if len(rs) else None,
                "ymparikeskiarvo_sentit": round(center, 1), "keskihajonta_sentit": round(float(dev.std(ddof=1)) if len(rs) > 1 else 0.0, 1),
                "MAD_sentit": round(float(np.median(np.abs(dev - np.median(dev)))), 1)}

    result = {"valilla": [a.t0, a.t1], "min_kesto_s": a.min_s, "min_varmuus": a.conf,
              "kaikki": stats(rows), "lahteittain": {s: stats([r for r in rows if r["lahde"] == s]) for s in SOURCES if any(r["lahde"] == s for r in rows)},
              "saveliä": rows,
              "huom": "Sentit modulo puolisävelaskel (-50..+50) lähimmästä A=440-tasavireen sävelestä. Vireeseen ei ole koskettu."}
    (d / "vire.json").write_text(json.dumps(result, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"Pitkiä tasaisia säveliä {len(rows)} (väli {a.t0:g}-{a.t1:g} s, >= {a.min_s} s, varmuus >= {a.conf})")
    for r in rows:
        nm = lahde.PITCHES[int(round(r['midi'])) % 12] + str(int(round(r['midi'])) // 12 - 1)
        print(f"  {r['lahde']:<14} {r['alku']:7.2f}-{r['loppu']:7.2f} s  {nm:<4} midi {r['midi']:7.3f}  {r['sentit']:+6.1f} c")
    print(json.dumps({k: result[k] for k in ("kaikki", "lahteittain")}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
