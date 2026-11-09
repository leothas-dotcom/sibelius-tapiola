r"""Tarkistaa analyysipaketin ja merkinnät: JSON kelpaa, binääridata vastaa metatietoja.

  .venv\Scripts\python.exe -I analysis/check_package.py build/testi60     paketti + annotations/cues.json (jos on)
  .venv\Scripts\python.exe -I analysis/check_package.py --cues-only       vain merkinnät (teemat.json, ajat_<levytys>.json, cues.json)
                                                                          ja kuvakäsikirjoitus (docs/kuvakasikirjoitus.md)
Tarkistaa myös kanavat.json/kanavat.f32 (analysis/kanavat.py): 30 fps, ruutumäärä sama kuin analysis ja
listen, ei NaN/inf-arvoja. Palauttaa virhekoodin 1, jos jokin tarkistus ei mene läpi.
"""
import argparse
import csv
import json
import re
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
errors = []


def check(ok, msg):
    print(("OK      " if ok else "VIRHE   ") + msg)
    if not ok:
        errors.append(msg)
    return ok


def load_json(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as e:
        check(False, f"{path.name}: {e}")
        return None


def check_frames(d, name):
    meta = load_json(d / f"{name}.json")
    if meta is None:
        return None
    f32 = d / f"{name}.f32"
    size = f32.stat().st_size if f32.exists() else -1
    expect = meta["frames"] * len(meta["channels"]) * 4
    if check(size == expect, f"{name}.f32: {meta['frames']} ruutua x {len(meta['channels'])} kanavaa ({size} tavua)"):
        x = np.fromfile(f32, dtype=np.float32)
        check(bool(np.isfinite(x).all()), f"{name}.f32: ei NaN/inf-arvoja")
    check(len(set(meta["channels"])) == len(meta["channels"]), f"{name}.json: kanavien nimet yksilöllisiä")
    check(meta.get("fps") == 30, f"{name}.json: 30 fps")
    return meta


def check_package(d):
    print(f"--- paketti {d.relative_to(ROOT)}")
    a = check_frames(d, "analysis")
    li = check_frames(d, "listen")
    ka = check_frames(d, "kanavat") if (d / "kanavat.json").exists() else None
    if not (d / "kanavat.json").exists():
        check(False, "kanavat.json + kanavat.f32 löytyvät (aja analysis/kanavat.py)")
    if a and li:
        check(a["frames"] == li["frames"], "analysis ja listen: sama ruutumäärä")
        check(abs(a["music_start"] - li["music_start"]) < 1e-6, "analysis ja listen: sama musiikin alku")
    if a and ka:
        check(a["frames"] == ka["frames"], "analysis ja kanavat: sama ruutumäärä")
        check(abs(a["start"] - ka["start"]) < 1e-6, "analysis ja kanavat: sama alku")
    if (d / "beats.json").exists():  # beat_this ajetaan vain lipulla listen.py --beats
        beats = load_json(d / "beats.json")
        b = np.array(beats["beats"])
        check(bool(np.all(np.diff(b) > 0)), f"beats.json: {len(b)} iskua kasvavassa järjestyksessä")
        bars = [x["bar"] for x in beats["bars"]]
        check(bars == list(range(1, len(bars) + 1)), f"beats.json: tahdit 1..{len(bars)} järjestyksessä")
        # ajat kuuntelukopion aikaa: paketin sisällä
        span = (a["start"] - 0.1, a["start"] + a["duration"] + 0.1) if a else None
        check(beats.get("aika", "").startswith("kuuntelukopion aika") and (span is None or len(b) == 0 or span[0] <= b[0] and b[-1] <= span[1]),
              "beats.json: ajat kuuntelukopion aikaa")
    else:
        print("OHITETTU beats.json (ei ajettu: listen.py --beats)")
    patina = load_json(d / "patina.json")
    if patina is not None:
        check(all(len(c) == 2 for c in patina["clicks"]), f"patina.json: {len(patina['clicks'])} naksahdusta")
    notes = d / "notes.csv"
    if check(notes.exists(), "notes.csv löytyy"):
        with open(notes, encoding="utf-8") as f:
            rows = list(csv.DictReader(f))
        check(all(float(r["loppu_s"]) > float(r["alku_s"]) for r in rows), f"notes.csv: {len(rows)} nuottia, loppu > alku")
        if a and rows:
            check(all(a["start"] - 0.1 <= float(r["alku_s"]) <= a["start"] + a["duration"] + 0.1 for r in rows),
                  "notes.csv: ajat kuuntelukopion aikaa")
    check((d / "LUE_MINUT.md").exists(), "LUE_MINUT.md löytyy")
    check((d / "korvat.json").exists(), "korvat.json löytyy (korvat.py)")


def check_cues():
    path = ROOT / "annotations" / "cues.json"
    print(f"--- {path.relative_to(ROOT)}")
    if not path.exists():
        print("OHITETTU cues.json (ei vielä: aja analysis/make_cues.py --levytys <id>)")
        return
    c = load_json(path)
    if c is None:
        return
    for key in ("recording", "themes", "sections", "cues", "iskut", "analyses"):
        check(key in c, f"avain '{key}'")
    if errors:
        return
    rec = c["recording"]
    kesto = rec.get("kesto_s") or 1e9
    ids = [x.get("id") for x in c["cues"] + c["sections"]]
    check(None not in ids and len(ids) == len(set(ids)), "tunnisteet (id) olemassa ja yksilöllisiä")
    bad = [x["id"] for x in c["cues"] if not (x.get("t") is None or (isinstance(x["t"], (int, float)) and 0 <= x["t"] <= kesto))]
    check(not bad, f"tapahtumien t kelvollisia (null tai 0–{kesto} s) {bad if bad else ''}")
    themes = set(c["themes"])
    unknown = sorted({x["theme"] for x in c["cues"] if x.get("theme") not in themes})
    check(not unknown, f"teemat (luokat) tunnettuja {unknown if unknown else ''}")
    inconsistent = [x["id"] for x in c["cues"] if (x["t"] is None) != (x["varmuus"] == "arvio") or x["varmuus"] not in ("vahvistettu", "analyysi", "arvio")]
    check(not inconsistent, f"varmuus ja t vastaavat toisiaan (arvio <=> t null) {inconsistent if inconsistent else ''}")
    secbad = [s["id"] for s in c["sections"] if not (0 <= s["start"] < s["end"] <= kesto)]
    check(not secbad, f"{len(c['sections'])} jaksoa: 0 <= alku < loppu {secbad if secbad else ''}")
    t = [b["t"] for b in c["iskut"]]
    check(t == sorted(t) and all(isinstance(x, (int, float)) for x in t), f"iskut: {len(t)} kpl järjestyksessä")
    # ristiintarkistus lähteisiin: cues.json ei saa olla vanhentunut
    tm_path = ROOT / "annotations" / "teemat.json"
    at_path = ROOT / "annotations" / f"ajat_{rec.get('levytys')}.json"
    if check(tm_path.exists() and at_path.exists(), f"teemat.json ja {at_path.name} löytyvät"):
        tm, at = load_json(tm_path), load_json(at_path)
        if tm is not None and at is not None:
            aid = [a["id"] for a in tm["ankkurit"]]
            check(len(aid) == len(set(aid)), f"teemat.json: {len(aid)} ankkuria, id:t yksilöllisiä")
            check(sorted(aid) == sorted(at["ajat"]), "ajat-tiedostossa täsmälleen teemakartan ankkurit")
            check(sorted(aid) == sorted(x["ankkuri"] for x in c["cues"]), "cues.json sisältää täsmälleen teemakartan ankkurit")
            stale = [x["id"] for x in c["cues"] if x["id"] in at["ajat"] and (x["t"] != at["ajat"][x["id"]]["t"] or x["varmuus"] != at["ajat"][x["id"]]["varmuus"])]
            check(not stale, f"cues.json vastaa ajat-tiedostoa (muuten aja make_cues.py) {stale if stale else ''}")
            nosec = [a["id"] for a in tm["ankkurit"] if a.get("tarina")]
            print(f"INFO    tarina täytetty {len(nosec)} ankkurilla (käyttäjän kirjoitettavaa)")
            jak = {}
            for a in tm["ankkurit"]:
                if a.get("tyyppi") == "jakso":
                    jak.setdefault(a["jakso"], set()).add(a["reuna"])
            check(all(v == {"alku", "loppu"} for v in jak.values()), f"{len(jak)} jaksoa: alku- ja loppuankkuri molemmat")
            n = len(aid)
            check(30 <= n <= 120, f"ankkureita {n} (tavoite 30–120)")
            nulls = [x["id"] for x in c["cues"] if x["t"] is None]
            print(f"INFO    ilman aikaa: {nulls if nulls else 'ei yhtään'}")


def check_storyboard():
    """Kuvakäsikirjoitus: jokainen tunniste on olemassa, jokainen ankkuri on käytetty, ajat vain generoituina."""
    path = ROOT / "docs" / "kuvakasikirjoitus.md"
    cpath = ROOT / "annotations" / "cues.json"
    print(f"--- {path.relative_to(ROOT)}")
    if not path.exists() or not cpath.exists():
        print("OHITETTU kuvakäsikirjoitus (ei vielä)")
        return
    c = load_json(cpath)
    if c is None:
        return
    text = path.read_text(encoding="utf-8")
    kesto = c["recording"].get("kesto_s")
    t = {x["id"]: x["t"] for x in c["cues"]}
    t.update({"tiedoston_alku": 0.0, "tiedoston_loppu": kesto})
    sallitut = set(t) | {s["id"] for s in c["sections"]} | set(c.get("ohjaus", {}).get("channels", []))
    sallitut |= {e["tyyppi"] for e in c.get("tapahtumat", [])}
    tunnisteet = [x for x in re.findall(r"`([^`\n]+)`", text) if "/" not in x and "." not in x]
    vieraat = sorted({x for x in tunnisteet if x not in sallitut})
    check(not vieraat, f"jokainen tunniste on ankkuri, jakso, kanava tai tapahtumatyyppi {vieraat if vieraat else ''}")
    kayttamatta = sorted(set(t) - set(tunnisteet))
    check(not kayttamatta, f"jokainen teemakartan ankkuri on käytetty ({len(set(t) & set(tunnisteet))}/{len(t)}) {kayttamatta if kayttamatta else ''}")
    otot = re.findall(r"^#### (\d+) [^\n]*?`([^`\n]+)` → `([^`\n]+)` · <!--aika-->([^\n]*?)<!--/aika-->", text, re.M)
    n_otsikot = len(re.findall(r"^#### ", text, re.M))
    check(otot and len(otot) == n_otsikot, f"{len(otot)} ottoa, jokaisella alku- ja loppuankkuri ({n_otsikot} otsikkoa)")
    nrot = [int(o[0]) for o in otot]
    check(nrot == list(range(1, len(nrot) + 1)), "ottojen numerot juoksevat 1..n")
    huonot = [o[0] for o in otot if t.get(o[1]) is None or t.get(o[2]) is None or not t[o[1]] < t[o[2]]]
    check(not huonot, f"jokaisen oton alku on ennen loppua {huonot if huonot else ''}")
    ketju = [f"{a[0]}→{b[0]}" for a, b in zip(otot, otot[1:]) if t.get(a[2]) is not None and t.get(b[1]) is not None and t[b[1]] - t[a[2]] > 2.0]
    check(not ketju, f"otot kattavat teoksen ilman yli 2 s aukkoja {ketju if ketju else ''}")
    check(bool(otot) and otot[0][1] == "tiedoston_alku" and otot[-1][2] == "tiedoston_loppu", "ensimmäinen otto alkaa tiedoston alusta ja viimeinen päättyy sen loppuun")

    def mmss(x):
        return f"{int(x // 60)}:{int(x % 60):02d}"

    vanhat = [o[0] for o in otot if t.get(o[1]) is not None and t.get(o[2]) is not None and o[3] != f"{mmss(t[o[1]])}–{mmss(t[o[2]])}"]
    check(not vanhat, f"ottojen ajat vastaavat ankkureita (muuten aja make_cues.py) {vanhat if vanhat else ''}")
    ilman = re.sub(r"<!--aika-->[^\n]*?<!--/aika-->", "", text)
    kasin = sorted(set(re.findall(r"(?<![\w/.])\d{1,2}:\d{2}(?![\w])", ilman)))
    check(not kasin, f"ei käsin kirjoitettuja aikoja {kasin if kasin else ''}")
    kulut = re.findall(r"^- Kulku (\d+): `([^`\n]+)` → `([^`\n]+)`", text, re.M)
    check(len(kulut) >= 7 and [int(x[0]) for x in kulut] == list(range(1, len(kulut) + 1)), f"kulkuja vähintään seitsemän, numerot juoksevat (löytyi {len(kulut)})")
    tunnetut = [(n, t[x], t[y]) for n, x, y in kulut if t.get(x) is not None and t.get(y) is not None]
    kestot = ", ".join(f"{n}: {y - x:.0f} s" for n, x, y in tunnetut)
    lyhyet = [n for n, x, y in tunnetut if y - x < 4.0]
    check(len(tunnetut) == len(kulut) and not lyhyet, f"jokainen kulku kestää vähintään 4 s ({kestot}) {lyhyet if lyhyet else ''}")
    pys = len(re.findall(r"Nimetty pysähdys", text))
    check(pys == 2, f"nimettyjä pysähdyksiä kaksi (C-duuri ja H-duuri), löytyi {pys}")


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("packages", nargs="*", type=Path)
    ap.add_argument("--cues-only", action="store_true")
    a = ap.parse_args()
    if not a.cues_only:
        for d in a.packages:
            check_package(d if d.is_absolute() else ROOT / d)
    check_cues()
    check_storyboard()
    print(f"{len(errors)} virhettä." if errors else "Kaikki tarkistukset kunnossa.")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
