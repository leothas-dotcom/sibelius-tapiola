r"""Vaihe 4c: koko äänitteen aikajana kuunteluoppaan pohjaksi.

Jaksorajat tulevat segments.py:stä (uutuuskäyrän huiput: terävät piirteet eli kaistat, kroma,
voimakkuus ja nuotinalut). Kuvaukset lasketaan koko äänitteen yli normalisoiduista kanavista
(themes.py:n yhdistys), joten "uusi soitin" ja "hiljainen" tarkoittavat samaa koko äänitteellä:

  * dynamiikka (pp-ff) ja suunta, rekisteri, nuotinalkutiheys, sävellaji ja sen selkeys
  * soitinperheet (PANNs, äänitteen 95. persentiiliin suhteutettuna)
  * uusi / poistuu: perhe vahvistuu tai heikkenee selvästi edelliseen jaksoon verrattuna
  * soolo?: hiljainen tai ohut tekstuuri, jossa yksi perhe hallitsee (esim. yksi puhallin tai soolosoitin)
  * tunnelman muutos: dynamiikka muuttuu vähintään kaksi astetta, nuotinalkutiheys kaksin-
    tai puolinkertaistuu, rekisteri siirtyy tai duuri/molli vaihtuu selvällä sävellajilla
  * tarkat tapahtumat jakson sisällä (interpret.py: soitin sisään/ulos, äkilliset muutokset)

PANNs kertoo, MIKÄ soi, mutta ei tarkkaa HETKEÄ (ikkuna useita sekunteja; vaskien raaka-arvot
jäävät tutissa lähelle nollaa). Hetki tulee jaksorajasta tai interpret.py:n tapahtumasta.

Tulosteet: build/koko/aikajana.md ja aikajana.json (ajat kuuntelukopion aikaa)
    .venvScriptspython.exe -I analysis/aikajana.py build/testi60 [build/muu ...] [--out build/koko]
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
from themes import FPS, channels, key_of, load_chunk, mmss, stitch  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
LEVELS = ["pp", "p", "mp", "mf", "f", "ff"]
FAM_FI = {"horns": "käyrätorvet", "tpt": "trumpetit ja pasuunat", "violin": "viulut", "strings": "jouset",
          "cello": "sellot", "bass": "kontrabassot", "winds": "puupuhaltimet", "timp": "patarummut"}


def level(x):
    return LEVELS[int(np.digitize(x, [0.12, 0.25, 0.4, 0.55, 0.72]))]


def package_segments(dirs):
    """Jaksorajat osista: kustakin osasta vain sen oma alue (vaihto limityksen puolivälissä)."""
    parts = []
    for d in dirs:
        d = Path(d)
        meta = json.loads((d / "analysis.json").read_text(encoding="utf-8"))
        segs = json.loads((d / "segments.json").read_text(encoding="utf-8")) if (d / "segments.json").exists() else []
        ev = json.loads((d / "events.json").read_text(encoding="utf-8"))["events"] if (d / "events.json").exists() else []
        parts.append((meta["start"], meta["start"] + meta["duration"], segs, ev))
    parts.sort(key=lambda p: p[0])
    bounds, events = [], []
    for k, (s0, s1, segs, ev) in enumerate(parts):
        lo = 0.0 if k == 0 else (s0 + parts[k - 1][1]) / 2
        hi = 1e9 if k == len(parts) - 1 else (parts[k + 1][0] + s1) / 2
        bounds += [s["alku"] for s in segs if lo <= s["alku"] < hi]
        events += [e for e in ev if lo <= e["t"] < hi]
    # osan reunassa (limitys) syntyy keinotekoinen raja: poista alle 2 s päässä toisesta
    bounds = sorted(bounds)
    out = []
    for b in bounds:
        if not out or b - out[-1] >= 2.0:
            out.append(b)
    return out, sorted(events, key=lambda e: e["t"])


def describe(S, C, bounds, events, end_t):
    n = len(C["loud"])
    on = S["onsets"]
    F = C["F"]
    fams = list(FAM_FI)
    rows, prev = [], None
    edges = bounds + [end_t]
    for i in range(len(bounds)):
        a, b = edges[i], edges[i + 1]
        ia, ib = int(a * FPS), min(n, int(b * FPS))
        if ib - ia < FPS // 2:
            continue
        L = C["loud"][ia:ib]
        q = float(L.mean())
        head, tail = float(L[: max(1, (ib - ia) // 4)].mean()), float(L[-max(1, (ib - ia) // 4):].mean())
        suunta = "crescendo" if tail > head + 0.12 else "diminuendo" if tail < head - 0.12 else "tasainen"
        dens = float(((on >= a) & (on < b)).sum() / max(0.5, b - a))
        reg = float(C["reg"][ia:ib].mean())
        k, r = key_of(C["chroma"][ia:ib].mean(axis=0))
        act = {f: float(F[f][ia:ib].mean()) for f in fams}
        tutti = float(np.clip(F["tutti"][ia:ib].mean(), 0, 1.5))
        top = sorted(((v, f) for f, v in act.items() if v > 0.3), reverse=True)[:4]
        uusi, poistuu = [], []
        if prev is not None:
            for f in fams:
                v0, v1 = prev["act"][f], act[f]
                if v1 > 0.4 and v1 > 2.0 * v0 + 0.1:
                    uusi.append(f)
                elif v0 > 0.4 and v1 < 0.45 * v0:
                    poistuu.append(f)
        huom = []
        tot = sum(v for v in act.values()) + 1e-6
        lead = max(act, key=act.get)
        if q < 0.35 and act[lead] > 0.5 and act[lead] / tot > 0.3 and tutti < 0.5:
            huom.append(f"soolo/ohut: {FAM_FI[lead]}")
        if q < 0.08:
            huom.append("lähes hiljaista")
        if prev is not None:
            dl = LEVELS.index(level(q)) - LEVELS.index(prev["dyn"])
            if abs(dl) >= 2:
                huom.append(f"tunnelma: dynamiikka {prev['dyn']} -> {level(q)}")
            if prev["dens"] > 0.3 and (dens > 2 * prev["dens"] or dens < 0.5 * prev["dens"]):
                huom.append(f"liike {'tihenee' if dens > prev['dens'] else 'harvenee'} ({prev['dens']:.1f} -> {dens:.1f}/s)")
            if abs(reg - prev["reg"]) > 0.3:
                huom.append(f"rekisteri {'nousee' if reg > prev['reg'] else 'laskee'}")
            if r > 0.6 and prev["r"] > 0.6 and k.split()[1] != prev["key"].split()[1]:
                huom.append(f"{prev['key'].split()[1]} -> {k.split()[1]}")
        ev = [e for e in events if a <= e["t"] < b and e["tyyppi"] in ("soitin_sisaan", "soitin_ulos", "voimistuu_akkia", "hiljenee_akkia")]
        row = {"alku": round(a, 2), "loppu": round(b, 2), "kesto": round(b - a, 1), "dyn": level(q), "voimakkuus": [round(head, 2), round(tail, 2)],
               "huippu": round(float(L.max()), 2), "suunta": suunta, "rekisteri": round(reg, 2), "liike": round(dens, 1),
               "savellaji": k, "selkeys": round(float(r), 2), "act": {f: round(v, 2) for f, v in act.items()}, "tutti": round(tutti, 2),
               "soittimet": [FAM_FI[f] for _, f in top], "uusi": [FAM_FI[f] for f in uusi], "poistuu": [FAM_FI[f] for f in poistuu],
               "huom": huom, "tapahtumat": [f"{mmss(e['t'])} {e['kuvaus']}" for e in ev], "key": k, "r": r, "dens": dens, "reg": reg}
        rows.append(row)
        prev = row
    for row in rows:
        for k2 in ("key", "r", "dens", "reg"):
            row.pop(k2)
    return rows


def write(rows, out):
    (out / "aikajana.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")
    lines = ["# Aikajana (kuuntelukopion aikaa)", "",
             "Jaksorajat: segments.py (uutuuskäyrä). Kuvaukset: koko äänitteen yli normalisoidut kanavat (aikajana.py).",
             "Soittimet = PANNs-perheet (mikä soi, ei tarkka hetki). Hetket: jaksoraja tai tapahtuma.", "",
             "| Alku | Kesto | Dyn | Rek | Liike/s | Soittimet | Uusi / poistuu | Huomiot | Sävellaji |",
             "|---|---|---|---|---|---|---|---|---|"]
    for r in rows:
        ch = (" ".join("+" + x for x in r["uusi"]) + " " + " ".join("−" + x for x in r["poistuu"])).strip() or "–"
        hu = "; ".join(r["huom"]) or "–"
        if r["tapahtumat"]:
            hu += " · " + "; ".join(r["tapahtumat"][:3])
        lines.append(f"| {mmss(r['alku'])} | {r['kesto']} | {r['dyn']} {r['suunta'][:5]} ({r['voimakkuus'][0]}→{r['voimakkuus'][1]}, max {r['huippu']}) "
                     f"| {r['rekisteri']} | {r['liike']} | {', '.join(r['soittimet']) or '–'} | {ch} | {hu} | {r['savellaji']} ({r['selkeys']}) |")
    (out / "aikajana.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("packages", nargs="+", type=Path, help="yksi tai useampi (limittäinen) paketti")
    ap.add_argument("--out", type=Path, default=ROOT / "build" / "koko")
    a = ap.parse_args()
    a.out.mkdir(parents=True, exist_ok=True)
    dirs = [d if d.is_absolute() else ROOT / d for d in a.packages]
    S = stitch([load_chunk(d) for d in dirs])
    C = channels(S)
    bounds, events = package_segments(dirs)
    music = np.where(C["music"])[0]
    end_t = (music[-1] + 1) / FPS if len(music) else len(C["loud"]) / FPS
    rows = describe(S, C, bounds, events, end_t)
    write(rows, a.out)
    print(f"{len(rows)} jaksoa, {len(events)} tapahtumaa -> {a.out / 'aikajana.md'}")


if __name__ == "__main__":
    main()
