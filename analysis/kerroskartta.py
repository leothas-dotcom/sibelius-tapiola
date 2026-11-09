r"""Kerroskartta: tiheä tapahtumaloki koko teoksesta (mikä rekisterikerros puhuu, millä liikkeellä, millä tasolla).

Miksi: kuunteluopas tarvitsee paljon lisää detaljia siitä, mitä soi millä hetkellä (käyttäjä 9.11.2026), ja
kuvakäsikirjoitus tarvitsee kerrokset (lähellä / kaukana, matala / korkea). Soitinluokitin ei erottele soittimia
hetken tarkkuudella, mutta rekisterikerrokset (kaaret.py) erottelevat. Tämä työkalu ei arvaa soitinta: se kertoo
kerroksen, liikkeen ja tason, ja liittää mukaan perhevihjeen (kanavat.py), iskut (aksentit.py) ja ankkurit.

Lukee paketista: kaaret.f32 (+ kaaret_kanavat.json), kanavat.f32 (+ kanavat.json), aksentit.json.
Kirjoittaa: <paketti>/kerroskartta.json ja annotations/kerroskartta_<levytys>.md (generoitu; ei muokata käsin).

    .venv\Scripts\python.exe -I analysis\kerroskartta.py build\rattle_koko --levytys rattle2022
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
STEP = 0.5  # s
BANDS = ["matala", "keski", "korkea", "kirkas"]


def mm(t):
    return f"{int(t) // 60}:{t % 60:04.1f}"


def load(d, stem, meta):
    m = json.loads((d / meta).read_text(encoding="utf-8"))
    x = np.fromfile(d / stem, dtype=np.float32).reshape(m["frames"], len(m["channels"]))
    return m, x


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="kerroskartta: tiheä tapahtumaloki")
    ap.add_argument("dir", type=Path)
    ap.add_argument("--levytys", required=True)
    ap.add_argument("--min-len", type=float, default=1.0, help="tilan vähimmäiskesto sekunteina")
    a = ap.parse_args()
    d = a.dir
    km, K = load(d, "kaaret.f32", "kaaret_kanavat.json")
    cm, C = load(d, "kanavat.f32", "kanavat.json")
    kc, cc = km["channels"], cm["channels"]
    t0 = float(km.get("start", 0.0))
    n = min(len(K), len(C))
    taso = C[:n, cc.index("taso_dbfs")]
    liiket = C[:n, cc.index("liiketiheys")]
    fam = {f: C[:n, cc.index(f)] for f in ("jouset", "puupuhaltimet", "vasket") if f in cc}
    share = {b: K[:n, kc.index(f"osuus_{b}")] for b in BANDS}
    alut = {b: K[:n, kc.index(f"alut_{b}")] for b in BANDS}
    acc = []
    ap_ = d / "aksentit.json"
    if ap_.exists():
        aj = json.loads(ap_.read_text(encoding="utf-8"))
        items = aj.get("aksentit", aj.get("iskut", aj if isinstance(aj, list) else []))
        for it in items:
            t = it.get("t", it.get("aika", it.get("alku")))
            if t is not None:
                acc.append((float(t), float(it.get("z", 0)), it.get("tyyppi", "aksentti")))
    ank = {}
    tp = ROOT / "annotations" / f"ajat_{a.levytys}.json"
    if tp.exists():
        for k, v in json.loads(tp.read_text(encoding="utf-8"))["ajat"].items():
            if v.get("t") is not None:
                ank[k] = float(v["t"])

    hop = int(STEP * FPS)
    states = []
    for i in range(0, n - hop, hop):
        sl = slice(i, i + hop)
        lv = float(taso[sl].mean())
        if lv < -58:
            st = ("hiljaisuus", "", "", "")
        else:
            sh = {b: float(share[b][sl].mean()) for b in BANDS}
            order = sorted(BANDS, key=lambda b: -sh[b])
            layers = [b for b in order if sh[b] >= 0.30][:2] or [order[0]]
            extra = [b for b in ("korkea", "kirkas") if b not in layers and sh[b] >= 0.08]
            mv = float(liiket[sl].mean())
            liike = "pitkä" if mv < 0.8 else ("liikkuva" if mv < 3.0 else "nopea")
            dyn = "hiljaa" if lv < -42 else ("keski" if lv < -28 else "kova")
            fh = max(fam, key=lambda f: float(fam[f][sl].mean())) if fam else ""
            fv = float(fam[fh][sl].mean()) if fam else 0.0
            perhe = fh if fv >= 0.35 else ""
            st = ("+".join(layers) + (" (yllä " + "+".join(extra) + ")" if extra else ""), liike, dyn, perhe)
        states.append((t0 + i / FPS, st, lv))

    # yhdistä peräkkäiset samat tilat, poista lyhyet
    rows = []
    for t, st, lv in states:
        if rows and rows[-1]["tila"] == st:
            rows[-1]["loppu"] = t + STEP
            rows[-1]["tasot"].append(lv)
        else:
            rows.append({"alku": t, "loppu": t + STEP, "tila": st, "tasot": [lv]})
    merged = []
    for r in rows:
        if merged and (r["loppu"] - r["alku"]) < a.min_len and r["tila"][0] != "hiljaisuus" and merged[-1]["tila"][0] != "hiljaisuus":
            merged[-1]["loppu"] = r["loppu"]
            merged[-1]["tasot"] += r["tasot"]
        elif merged and merged[-1]["tila"] == r["tila"]:
            merged[-1]["loppu"] = r["loppu"]
            merged[-1]["tasot"] += r["tasot"]
        else:
            merged.append(r)

    out = []
    for r in merged:
        kerros, liike, dyn, perhe = r["tila"]
        ins = [f"{mm(t)} z{z:.0f}" for t, z, _ in acc if r["alku"] <= t < r["loppu"] and z >= 6][:4]
        anks = [k for k, t in ank.items() if r["alku"] <= t < r["loppu"]]
        out.append({"alku": round(r["alku"], 1), "loppu": round(r["loppu"], 1), "kerros": kerros, "liike": liike, "taso": dyn,
                    "taso_dbfs": round(float(np.mean(r["tasot"])), 1), "perhevihje": perhe, "iskut": ins, "ankkurit": anks})
    (d / "kerroskartta.json").write_text(json.dumps({"levytys": a.levytys, "askel_s": STEP, "rivit": out}, ensure_ascii=False, indent=1), encoding="utf-8")

    L = [f"# Kerroskartta: {a.levytys}", "",
         "*Generoitu (`analysis/kerroskartta.py`), ei muokata käsin. Tiheä tapahtumaloki: mikä rekisterikerros puhuu, millä liikkeellä ja",
         "millä tasolla. **Soitinta ei arvata**: kerros on mitattu spektristä (matala C1–H2, keski C3–H4, korkea C5–H5, kirkas C6–),",
         "perhevihje on PANNs-pohjainen ja jäljessä 2–3 s. Ajat kuuntelukopion aikaa. Mitään ei ole kuultu, ellei ankkuri sano toisin.*", "",
         "| Alku | Kesto | Kerros (rekisteri) | Liike | Taso | dBFS | Perhevihje | Iskut | Ankkurit |", "|---|---|---|---|---|---|---|---|---|"]
    for r in out:
        L.append(f"| {mm(r['alku'])} | {r['loppu'] - r['alku']:.1f} | {r['kerros']} | {r['liike']} | {r['taso']} | {r['taso_dbfs']:.0f} | {r['perhevihje']} | {', '.join(r['iskut'])} | {', '.join(r['ankkurit'])} |")
    md = ROOT / "annotations" / f"kerroskartta_{a.levytys}.md"
    md.write_text("\n".join(L) + "\n", encoding="utf-8", newline="\n")
    print(f"{md.relative_to(ROOT)}: {len(out)} riviä ({out[0]['alku']:.0f}–{out[-1]['loppu']:.0f} s)")


if __name__ == "__main__":
    main()
