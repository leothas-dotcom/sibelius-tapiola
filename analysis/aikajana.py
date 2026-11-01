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

Tulosteet: --out-kansioon (oletus build/koko) aikajana.md ja aikajana.json (ajat kuuntelukopion aikaa); Rattle: --out build/rattle_koko
    .venvScriptspython.exe -I analysis/aikajana.py build/testi60 [build/muu ...] [--out build/koko]
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402
from themes import FPS, channels, key_of, load_chunk, mmss, stitch  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
LEVELS = ["pp", "p", "mp", "mf", "f", "ff"]
FAM_FI = {"horns": "käyrätorvet", "tpt": "trumpetit ja pasuunat", "violin": "viulut", "strings": "jouset",
          "cello": "sellot", "bass": "kontrabassot", "winds": "puupuhaltimet", "timp": "patarummut"}


def level(x):
    return LEVELS[int(np.digitize(x, [0.12, 0.25, 0.4, 0.55, 0.72]))]


def package_novelty(dirs):
    """Jaksorajojen vahvuus (segments.py: uutuuskäyrän arvo rajalla), kuuntelukopion ajassa: [(alku_s, uutuus)]."""
    out = []
    for d in dirs:
        f = Path(d) / "segments.json"
        if f.exists():
            out += [(s["alku"], s.get("alku_uutuus")) for s in json.loads(f.read_text(encoding="utf-8"))]
    return sorted(out)


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


def boundary_basis(S, C, rows, novelty, win=3.0, top=10):
    """10 vahvinta jaksorajaa (uutuuskäyrän arvo) ja mitattu peruste: 3 s ennen vs. 3 s jälkeen rajan."""
    n = len(C["loud"])
    F = C["F"]
    nov = np.array([v for _, v in novelty if v is not None])
    cand = []
    for r in rows[1:]:
        t = r["alku"]
        m = [v for a, v in novelty if abs(a - t) < 0.05 and v is not None]
        if not m:
            continue
        ia = max(0, int((t - win) * FPS))
        ib = int(t * FPS)
        ic = min(n, int((t + win) * FPS))
        if ib - ia < FPS or ic - ib < FPS:
            continue
        b = lambda x: float(np.mean(x[ia:ib]))
        a_ = lambda x: float(np.mean(x[ib:ic]))
        facts = []
        dl = a_(C["loud"]) - b(C["loud"])
        if abs(dl) >= 0.1:
            facts.append(f"voimakkuus {b(C['loud']):.2f} -> {a_(C['loud']):.2f} ({'nousee' if dl > 0 else 'laskee'})")
        dr = a_(C["reg"]) - b(C["reg"])
        if abs(dr) >= 0.15:
            facts.append(f"rekisteri {'nousee' if dr > 0 else 'laskee'} ({b(C['reg']):.2f} -> {a_(C['reg']):.2f})")
        for f in FAM_FI:
            v0, v1 = b(F[f]), a_(F[f])
            if abs(v1 - v0) >= 0.3:
                facts.append(f"{FAM_FI[f]} {'tulevat' if v1 > v0 else 'poistuvat'} ({v0:.2f} -> {v1:.2f})")
        k0, r0 = key_of(C["chroma"][ia:ib].mean(axis=0))
        k1, r1 = key_of(C["chroma"][ib:ic].mean(axis=0))
        if k0 != k1 and r0 > 0.5 and r1 > 0.5:
            facts.append(f"sävellaji-ehdotus {k0} -> {k1}")
        cand.append({"t": t, "uutuus": max(m), "peruste": facts})
    cand.sort(key=lambda c: -c["uutuus"])
    return cand[:top], float(np.median(nov)) if len(nov) else 0.0


def quiet_runs(dirs, end_t, thr=-60.0, min_s=1.5):
    """Hiljaiset kohdat: taso (kanavat.f32 taso_dbfs, 0,5 s tasoitus) alle thr dBFS vähintään min_s ennen end_t:tä
    ja ensimmäisen äänen jälkeen (yksi paketti). [(alku_s, loppu_s, keskitaso_dbfs)]"""
    if len(dirs) != 1 or not (Path(dirs[0]) / "kanavat.json").exists():
        return []
    d = Path(dirs[0])
    m = json.loads((d / "kanavat.json").read_text(encoding="utf-8"))
    x = np.fromfile(d / "kanavat.f32", dtype=np.float32).reshape(m["frames"], -1)
    lv = x[:, m["channels"].index("taso_dbfs")]
    from scipy.ndimage import uniform_filter1d
    mask = uniform_filter1d(lv, FPS // 2) < thr
    mask[: int(m["music_start"] * FPS)] = False
    mask[int(end_t * FPS):] = False
    out, i = [], 0
    while i < len(mask):
        if mask[i]:
            j = i
            while j < len(mask) and mask[j]:
                j += 1
            if (j - i) / FPS >= min_s:
                out.append((round(i / FPS, 1), round(j / FPS, 1), round(float(lv[i:j].mean()), 1)))
            i = j
        else:
            i += 1
    return out


def write(rows, out, strongest=None, nov_median=None, quiet=None):
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
    if quiet:
        lines += ["", "## Hiljaiset kohdat (taso alle -60 dBFS vähintään 1,5 s; huoneen kohina noin -66 dBFS)", "", "| Alku | Loppu | Kesto | Keskitaso dBFS |", "|---|---|---|---|"]
        lines += [f"| {mmss(a)} ({a} s) | {mmss(b)} ({b} s) | {b - a:.1f} s | {q} |" for a, b, q in quiet]
    if strongest:
        lines += ["", f"## 10 vahvinta jaksorajaa (uutuuskäyrän arvo rajalla; kaikkien rajojen mediaani {nov_median:.3f})", "",
                  "Peruste = mitattu muutos 3 s ennen vs. 3 s jälkeen rajan (voimakkuus, rekisteri ja PANNs-perheet normalisoituina koko äänitteen yli; sävellaji vain ehdotus).", "",
                  "| # | Aika | Uutuus | Peruste |", "|---|---|---|---|"]
        for k, c in enumerate(strongest, 1):
            lines.append(f"| {k} | {mmss(c['t'])} ({c['t']:.1f} s) | {c['uutuus']:.3f} | {'; '.join(c['peruste']) or 'ei yli kynnysten (muutos jakautuu usealle piirteelle)'} |")
        (out / "aikajana_vahvimmat.json").write_text(json.dumps(strongest, ensure_ascii=False, indent=1), encoding="utf-8")
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
    # aikajana päättyy viimeiseen ei-digitaaliseen näytteeseen (config.json: kohinaikkuna.huone), ei digitaaliseen hiljaisuuteen
    last_nd = (lahde.config().get("kohinaikkuna", {}).get("huone", {}) or {}).get("viimeinen_ei_digitaalinen_s")
    if last_nd and len(dirs) == 1:
        end_t = float(last_nd)
        bounds = [b for b in bounds if b < end_t - 0.5]  # rajat digitaalisen hiljaisuuden sisällä pois
        events = [e for e in events if e["t"] < end_t]
    rows = describe(S, C, bounds, events, end_t)
    strongest, med = boundary_basis(S, C, rows, package_novelty(dirs))
    quiet = quiet_runs(dirs, end_t)
    write(rows, a.out, strongest, med, quiet)
    print(f"{len(rows)} jaksoa, {len(events)} tapahtumaa -> {a.out / 'aikajana.md'}")


if __name__ == "__main__":
    main()
