r"""Tarkka kuuntelu minuutti kerrallaan koko teokselle ja tiivis yhteenveto jokaisesta.

Ajaa analysis/tarkka.py jokaiselle minuutille (JSON + PNG pakettiin) ja tulostaa minuutista: pitkät äänet,
matalat alut (askeleet, urkupisteet), lyhyiden nuottien tiheys rekistereittäin 10 s jaksoissa ja tason kulku.
Tämä on kuunteluoppaan minuuttien raaka-aine; tulkinta ja lähteet kirjoitetaan teemakartan ankkureihin.

    .venv\Scripts\python.exe -I analysis\minuutit.py build\rattle_koko [--from-min 1 --to-min 17] [--skip-run]
"""
import argparse
import json
import subprocess
import sys
from collections import Counter
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent


def mm(t):
    return f"{int(t) // 60}:{t % 60:04.1f}"


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("dir", type=Path)
    ap.add_argument("--from-min", type=int, default=0)
    ap.add_argument("--to-min", type=int, default=17)
    ap.add_argument("--skip-run", action="store_true")
    a = ap.parse_args()
    d = a.dir
    km = json.loads((d / "kanavat.json").read_text(encoding="utf-8"))
    K = np.fromfile(d / "kanavat.f32", dtype=np.float32).reshape(km["frames"], len(km["channels"]))
    taso = K[:, km["channels"].index("taso_dbfs")]
    dur = km["frames"] / 30.0
    for m in range(a.from_min, a.to_min + 1):
        A, B = 60.0 * m, min(60.0 * (m + 1), dur - 0.5)
        if B - A < 5:
            continue
        jp = d / f"tarkka_{int(A):04d}-{int(B):04d}.json"
        if not a.skip_run or not jp.exists():
            subprocess.run([sys.executable, "-I", str(ROOT / "analysis" / "tarkka.py"), str(d), "--from", str(A), "--to", str(B)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=False)
        if not jp.exists():
            print(f"### {m}:00–{m + 1}:00  (tarkka.py epäonnistui)")
            continue
        j = json.loads(jp.read_text(encoding="utf-8"))
        print(f"\n### {m}:00–{m + 1}:00")
        lv = [float(taso[int(s * 30):int((s + 10) * 30)].mean()) for s in np.arange(A, B, 10)]
        print("taso dBFS / 10 s: " + " ".join(f"{x:.0f}" for x in lv))
        pa = j["pitka_aani"]
        print(f"pitkä ääni {pa['savel']}: " + (", ".join(f"{mm(x)}–{mm(z)}" for x, z in pa["jaksot"]) or "ei jaksoja"))
        notes = j["kuviot"]
        longs = sorted([k for k in notes if k["loppu"] - k["alku"] >= 2.5], key=lambda k: k["alku"])
        print("pitkät sävelet (>=2,5 s): " + ("; ".join(f"{mm(k['alku'])}–{mm(k['loppu'])} {k['savel']}" for k in longs[:14]) or "ei"))
        low = j["matalat_alut"]
        if low:
            ts = np.array([x["t"] for x in low])
            c = Counter(x["savel"] for x in low).most_common(3)
            cl, s0 = [], ts[0]
            for i in range(1, len(ts)):
                if ts[i] - ts[i - 1] > 2.0:
                    cl.append((s0, ts[i - 1], int(((ts >= s0) & (ts <= ts[i - 1])).sum())))
                    s0 = ts[i]
            cl.append((s0, ts[-1], int(((ts >= s0) & (ts <= ts[-1])).sum())))
            gaps = np.diff(ts)
            g = f", väli mediaani {np.median(gaps):.2f} s" if len(gaps) else ""
            print(f"matalat alut: {len(low)} kpl ({', '.join(f'{k} x{v}' for k, v in c)}){g}; ryhmät: " +
                  "; ".join(f"{mm(x)}–{mm(z)} ({n_})" for x, z, n_ in cl[:10]))
        else:
            print("matalat alut: ei")
        short = [k for k in notes if k["loppu"] - k["alku"] < 0.6]
        mid = [sum(1 for k in short if s <= k["alku"] < s + 10 and k["savel"][-1] in "34") for s in np.arange(A, B, 10)]
        hi = [sum(1 for k in short if s <= k["alku"] < s + 10 and k["savel"][-1] in "567") for s in np.arange(A, B, 10)]
        print("lyhyet nuotit / 10 s  keski(3–4): " + " ".join(map(str, mid)) + "   korkea(5–7): " + " ".join(map(str, hi)))
        hs = [k for k in notes if k["savel"][-1] in "67" and k["loppu"] - k["alku"] >= 0.4]
        if hs:
            print("korkeat (okt. 6–7, >=0,4 s): " + "; ".join(f"{mm(k['alku'])} {k['savel']}" for k in hs[:12]))


if __name__ == "__main__":
    main()
