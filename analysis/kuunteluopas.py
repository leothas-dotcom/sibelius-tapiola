r"""Kuunteluoppaan aikakoodatut osat teemakartasta ja levytyksen ajoista.

Lähteet: annotations/teemat.json (ankkurit, ei aikoja), annotations/ajat_<levytys>.json (ajat), annotations/levytykset.json,
sekä levytyksen analyysipaketti (kanavat.json/.f32: taso; aikajana.json: soittimet) minuuttitaulukon taustaksi.

Kirjoittaa annotations/kuunteluopas.md:n merkittyjen kohtien väliin:
  <!-- GEN:ankkurit -->  kaikki ankkurit aikakoodein (aikajärjestyksessä) ja ilman aikaa jääneet
  <!-- GEN:minuutit --> minuutti minuutilta: jaksot, taso ja soittimet (mitattu) sekä ankkurit
  <!-- GEN:tarkista --> tarkistuslista: mitä korvan pitää ratkaista
Käsin kirjoitettu osa (tarina, soittimet ja merkitykset, henkilöt) jää ennalleen, eikä siinä ole aikoja: kaikki ajat tulevat
ajat-tiedostosta, joten opas ja cues.json eivät voi olla ristiriidassa. Jos opasta ei ole, tyhjä runko luodaan (tarinaotsikot tyhjinä).

    .venv\Scripts\python.exe -I analysis/kuunteluopas.py --levytys rattle2022      (aja make_cues.py samalla)
"""
import argparse
import json
import math
import re
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

ROOT = lahde.ROOT
MAP = ROOT / "annotations" / "teemat.json"
GUIDE = ROOT / "annotations" / "kuunteluopas.md"
RECORDINGS = ROOT / "annotations" / "levytykset.json"

RUNKO = """# Tapiola: kuunteluopas

*Tämän oppaan tarinaosat kirjoittaa käyttäjä haastattelussa; ne ovat tässä tyhjiä otsikoita. Generoidut osat (GEN-merkkien välissä)
täytetään komennolla `.venv\\Scripts\\python.exe -I analysis/kuunteluopas.py --levytys rattle2022` teemakartasta
(`annotations/teemat.json`) ja levytyksen ajoista (`annotations/ajat_<levytys>.json`): älä muokkaa niitä käsin.*

## Teos lyhyesti

## Tarina

## Soittimet ja mitä ne merkitsevät

## Ankkurit aikakoodein

<!-- GEN:ankkurit -->
<!-- /GEN:ankkurit -->

## Minuutti minuutilta

<!-- GEN:minuutit -->
<!-- /GEN:minuutit -->

## Tarkistuslista

<!-- GEN:tarkista -->
<!-- /GEN:tarkista -->
"""


def mm(t):
    m = int(t // 60)
    return f"{m}:{t - 60 * m:04.1f}"


def read_json(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def lyhyt(text, n=230):
    """Perusteen alku lauseeseen asti (enintään n merkkiä)."""
    text = text.strip()
    if len(text) <= n:
        return text
    cut = text[:n]
    k = max(cut.rfind(". "), cut.rfind("; "))
    return (cut[:k + 1] if k > 60 else cut.rstrip() + "…").replace("|", "/")


def partituuri(a):
    p = []
    if a.get("kirjain"):
        p.append(f"kirjain {a['kirjain']}")
    if a.get("tahti"):
        p.append(f"t. {a['tahti']}" + (f"–{a['tahti_loppu']}" if a.get("tahti_loppu") else ""))
    if a.get("tahti_suhde"):
        p.append(a["tahti_suhde"])
    return ", ".join(p) if p else "ei tiedossa [tarkista]"


def varmuus_teksti(e, a):
    v = {"vahvistettu": "**vahvistettu**", "analyysi": "analyysi (ei kuultu)", "arvio": "arvio, ei aikaa"}[e["varmuus"]]
    if e.get("luottamus") and e["varmuus"] != "arvio":
        v += f", luottamus {e['luottamus']}"
    return v


def gen_anchors(m, td, rec):
    ajat = td["ajat"]
    ank = m["ankkurit"]
    head = (f"Levytys: **{rec.get('nimi', rec['id'])}**, kuuntelukopio `{rec.get('kuuntelukopio')}`. Ajat ovat kuuntelukopion aikaa tiedoston alusta. "
            "**Mikään aika ei ole kuultu**: kaikki ovat analyysin ehdotuksia (varmuus *analyysi*), kunnes käyttäjä vahvistaa ne korvalla. "
            "Luottamus kertoo, kuinka hyvin mitattu piirre vastaa kuvausta (hyvä / kohtalainen / heikko).\n")
    rows = ["| Aika | Ankkuri | Partituuri | Mitä kuuluu | Mistä tunnistaa (mitattu) | Varmuus |", "|---|---|---|---|---|---|"]
    timed = sorted([a for a in ank if ajat[a["id"]]["t"] is not None], key=lambda a: ajat[a["id"]]["t"])
    for a in timed:
        e = ajat[a["id"]]
        t = mm(e["t"]) + (f"–{mm(e['t_loppu'])}" if e.get("t_loppu") and a["tyyppi"] == "hetki" and e["t_loppu"] - e["t"] > 1.0 else "")
        rows.append(f"| **{t}** | {a['nimi']} (`{a['id']}`) | {partituuri(a)} | {a.get('soi', '')} | {lyhyt(e['peruste'])} | {varmuus_teksti(e, a)} |")
    out = [head, "\n".join(rows)]
    nulls = [a for a in ank if ajat[a["id"]]["t"] is None]
    if nulls:
        out.append("\n**Ilman aikaa** (mittaus ei riitä; ehdokkaat vain korvan tarkistettavaksi):\n")
        for a in nulls:
            e = ajat[a["id"]]
            cand = "; ".join(f"{mm(c['t'])} ({c['huom']})" for c in e.get("ehdokkaat", [])) or "ei ehdokkaita"
            out.append(f"- **{a['nimi']}** (`{a['id']}`, {partituuri(a)}): {a.get('soi', '')}. Ehdokkaat: {cand}.")
    return "\n".join(out)


def load_background(rec):
    """Minuuttitaulukon tausta: taso (kanavat) ja soittimet (aikajana). Palauttaa (taso, liike, aikajana) tai (None, None, [])."""
    pak = rec.get("paketti")
    if not pak:
        return None, None, []
    d = ROOT / pak
    taso = liike = None
    kj = d / "kanavat.json"
    if kj.exists() and (d / "kanavat.f32").exists():
        meta = read_json(kj)
        x = np.fromfile(d / "kanavat.f32", dtype=np.float32).reshape(meta["frames"], len(meta["channels"]))
        taso = x[:, meta["channels"].index("taso_dbfs")]
        liike = x[:, meta["channels"].index("liiketiheys")]
    rows = []
    if (d / "aikajana.json").exists():
        rows = read_json(d / "aikajana.json")
    return taso, liike, rows


def minute_line(a, b, taso, liike, rows):
    parts = []
    if taso is not None:
        s = taso[int(a * 30):int(b * 30)]
        if len(s) and s.max() > -90:
            v = s[s > -90]
            parts.append(f"taso {v.min():.0f}…{v.max():.0f} dBFS (keskiarvo {v.mean():.0f})")
            if liike is not None:
                parts.append(f"liike {liike[int(a * 30):int(b * 30)].mean():.1f} alkua/s")
    fam = {}
    for r in rows:
        ov = min(b, r["loppu"]) - max(a, r["alku"])
        if ov > 0:
            for s_ in r.get("soittimet", []):
                fam[s_] = fam.get(s_, 0.0) + ov
    if fam:
        top = [k for k, v in sorted(fam.items(), key=lambda kv: -kv[1]) if v >= 8.0][:5]
        if top:
            parts.append("soittimia aikajanassa (PANNs, vähintään 8 s): " + ", ".join(top))
    return "Mitattu: " + "; ".join(parts) + "." if parts else ""


def gen_minutes(m, td, rec):
    ajat, ank = td["ajat"], m["ankkurit"]
    taso, liike, rows = load_background(rec)
    ts = [e["t"] for e in ajat.values() if e["t"] is not None]
    end = max(ts + [e.get("t_loppu") or 0 for e in ajat.values()] + [60.0])
    # jaksot
    sect = {}
    for a in ank:
        if a.get("tyyppi") == "jakso":
            sect.setdefault(a["jakso"], {})[a["reuna"]] = a
    secs = []
    for sid, p in sect.items():
        ta, tb = ajat[p["alku"]["id"]]["t"], ajat[p["loppu"]["id"]]["t"]
        if ta is not None and tb is not None:
            secs.append({"id": sid, "nimi": m.get("jaksot", {}).get(sid, {}).get("nimi", sid), "a": ta, "b": tb, "soi": p["alku"].get("soi", ""),
                         "partituuri": partituuri(p["alku"]), "ea": ajat[p["alku"]["id"]], "eb": ajat[p["loppu"]["id"]]})
    secs.sort(key=lambda s: s["a"])
    hits = [a for a in ank if ajat[a["id"]]["t"] is not None and a.get("tyyppi") == "hetki"]
    out = []
    for minute in range(0, int(math.ceil(end / 60))):
        a, b = 60.0 * minute, 60.0 * (minute + 1)
        out.append(f"##### {minute}:00–{minute + 1}:00\n")
        ml = minute_line(a, b, taso, liike, rows)
        if ml:
            out.append(ml + "\n")
        act = [s for s in secs if s["a"] < b and s["b"] > a]
        if act:
            out.append("Jaksot: " + "; ".join(f"**{s['nimi']}** {mm(s['a'])}–{mm(s['b'])} ({s['soi']})" for s in act) + "\n")
        here = [x for x in hits if a <= ajat[x["id"]]["t"] < b]
        starts = [s for s in secs if a <= s["a"] < b]
        ends = [s for s in secs if a <= s["b"] < b]
        evs = [(ajat[x["id"]]["t"], x, ajat[x["id"]], "") for x in here]
        evs += [(s["a"], None, s["ea"], f"{s['nimi']}: alkaa") for s in starts]
        evs += [(s["b"], None, s["eb"], f"{s['nimi']}: päättyy") for s in ends]
        evs.sort(key=lambda z: z[0])
        if not evs:
            out.append("*(ei ankkureita: edellinen jatkuu)*\n")
            continue
        out.append("| Aika | Mitä | Mitä kuuluu | Merkitys (käyttäjä) | Varmuus |\n|---|---|---|---|---|")
        for t, an, e, label in evs:
            if an is not None:
                out.append(f"| **{mm(t)}** | {an['nimi']} | {an.get('soi', '')} ({partituuri(an)}) |  | {varmuus_teksti(e, an)} |")
            else:
                out.append(f"| {mm(t)} | {label} | | | {varmuus_teksti(e, {})} |")
        out.append("")
    return "\n".join(out)


def gen_check(m, td):
    ajat, ank = td["ajat"], m["ankkurit"]
    L = ["**Kaikki ajat ovat analyysia, ei kuultu.** Kuuntele kohta kuuntelukopiosta ja kirjaa tulos `annotations/ajat_<levytys>.json`:iin "
         "(varmuus `vahvistettu` ja korjattu aika); sen jälkeen aja `make_cues.py` ja `kuunteluopas.py` uudelleen.\n"]
    nulls = [a for a in ank if ajat[a["id"]]["t"] is None]
    if nulls:
        L.append("**1. Ei aikaa (mittaus ei riitä): etsi korvalla**")
        for a in nulls:
            e = ajat[a["id"]]
            cand = "; ".join(f"{mm(c['t'])} ({c['huom']})" for c in e.get("ehdokkaat", []))
            L.append(f"- `{a['id']}` ({partituuri(a)}): {a.get('soi', '')}. Ehdokkaat: {cand or 'ei'}.")
        L.append("")
    weak = sorted([a for a in ank if ajat[a["id"]]["t"] is not None and ajat[a["id"]].get("luottamus") == "heikko"], key=lambda a: ajat[a["id"]]["t"])
    if weak:
        L.append("**2. Heikko luottamus: kuuntele ensin** (mitattu piirre vastaa kuvausta huonosti tai ehdokkaita on useita)")
        for a in weak:
            e = ajat[a["id"]]
            alt = "; ".join(f"{mm(c['t'])} ({c['huom']})" for c in e.get("vaihtoehdot", []))
            L.append(f"- **{mm(e['t'])}** `{a['id']}` ({partituuri(a)})" + (f". Vaihtoehdot: {alt}" if alt else ""))
        L.append("")
    noscore = [a for a in ank if a.get("tarkista") and ajat[a["id"]]["t"] is not None]
    if noscore:
        L.append("**3. Partituuripaikka puuttuu tai on kirjallisuudesta [tarkista]**: käyttäjä täydentää kirjaimen ja tahdin partituurista "
                 "(tahtinumeroita ei lasketa äänestä)")
        for a in sorted(noscore, key=lambda a: ajat[a["id"]]["t"]):
            L.append(f"- **{mm(ajat[a['id']]['t'])}** `{a['id']}`: {a['nimi']} ({partituuri(a)})")
    return "\n".join(L)


def replace(text, name, body):
    pat = re.compile(rf"(<!-- GEN:{name} -->\n).*?(<!-- /GEN:{name} -->)", re.S)
    if not pat.search(text):
        raise SystemExit(f"merkintä GEN:{name} puuttuu kuunteluoppaasta")
    return pat.sub(lambda mt: mt.group(1) + body.rstrip("\n") + "\n" + mt.group(2), text)


def main():
    ap = argparse.ArgumentParser(description="kuunteluoppaan GEN-osat teemakartasta ja levytyksen ajoista")
    ap.add_argument("--levytys", help="levytyksen id (annotations/levytykset.json); oletus: ensimmäinen työlevytys")
    a = ap.parse_args()
    recs = read_json(RECORDINGS)["levytykset"]
    rec = next((r for r in recs if (r["id"] == a.levytys if a.levytys else r.get("rooli") == "työ")), None)
    if rec is None:
        raise SystemExit(f"levytystä '{a.levytys}' ei löydy")
    if not MAP.exists():
        raise SystemExit(f"{MAP.relative_to(ROOT)} puuttuu")
    tpath = ROOT / "annotations" / f"ajat_{rec['id']}.json"
    if not tpath.exists():
        raise SystemExit(f"{tpath.relative_to(ROOT)} puuttuu")
    m, td = read_json(MAP), read_json(tpath)
    missing = [x["id"] for x in m["ankkurit"] if x["id"] not in td["ajat"]]
    if missing:
        raise SystemExit(f"ajat-tiedostosta puuttuu: {missing}")
    if not GUIDE.exists():
        GUIDE.write_bytes(RUNKO.replace("\r\n", "\n").encode("utf-8"))
        print(f"{GUIDE.relative_to(ROOT)}: runko luotu (tarinaotsikot tyhjinä)")
    text = GUIDE.read_text(encoding="utf-8")
    text = replace(text, "ankkurit", gen_anchors(m, td, rec))
    text = replace(text, "minuutit", gen_minutes(m, td, rec))
    text = replace(text, "tarkista", gen_check(m, td))
    GUIDE.write_bytes(text.replace("\r\n", "\n").encode("utf-8"))
    n_t = sum(1 for e in td["ajat"].values() if e["t"] is not None)
    print(f"{GUIDE.relative_to(ROOT)}: levytys {rec['id']}, {len(m['ankkurit'])} ankkuria ({n_t} ajalla)")


if __name__ == "__main__":
    main()
