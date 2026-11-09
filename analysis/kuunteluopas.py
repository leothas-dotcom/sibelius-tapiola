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
    PAKDIR[0] = d
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


PAKDIR = [None]


def linjat_line(a, b):
    """Minuutin linjat (analysis/linjat.py): bassolinja, suunta, uusia säveliä/s kerroksittain, tremolo."""
    d = PAKDIR[0]
    if d is None:
        return ""
    jp = d / f"linjat_{int(a):04d}-{int(b):04d}.json"
    if not jp.exists():
        return ""
    j = read_json(jp)
    rows = j["rivit"]
    if not rows:
        return ""
    path, last, run = [], None, 0
    for r in rows:
        bn = r["basso"]
        if bn is not None and bn[-1] not in "123":
            bn = None  # matalin vahva sävel ei ole bassorekisterissä: basso vaikenee
        if bn == last:
            run += 1
        else:
            if last is not None and run >= 2:
                path.append(last)
            elif last is None and run >= 3 and path and path[-1] != "–":
                path.append("–")
            last, run = bn, 1
    if last is not None and run >= 2:
        path.append(last)
    comp = []
    for x in path:
        if not comp or comp[-1] != x:
            comp.append(x)
    ons = [sum(r["uusia"][k] for r in rows) / max(1, len(rows)) for k in range(3)]
    tt = [r["t"] for r in rows]
    mid = [r["painopiste"][1] for r in rows]
    top = [r["painopiste"][2] for r in rows]
    moves = []
    for lab, ser in (("keskikerros", mid), ("yläkerros", top)):
        i = 0
        while i + 8 <= len(ser):
            seg = [(tt[k], ser[k]) for k in range(i, i + 8) if ser[k] is not None]
            if len(seg) >= 6:
                x = np.array([q[0] for q in seg]); y = np.array([q[1] for q in seg])
                sl = float(np.polyfit(x, y, 1)[0] * 10)
                if abs(sl) >= 7:
                    moves.append(f"{lab} {'nousee' if sl > 0 else 'laskee'} {mm(tt[i])}–{mm(tt[i] + 8)} ({sl:+.0f} psa/10 s)")
                    i += 8
                    continue
            i += 4
    longs = j.get("pitkat", [])
    trem = sum(1 for r in longs if "tremolo" in r["varina"])
    swell = sum(1 for r in longs if "< >" in r["muoto"])
    parts = []
    if comp:
        parts.append("bassolinja " + " → ".join(comp[:12]))
    parts.append(f"uusia säveliä/s matala {ons[0]:.1f}, keski {ons[1]:.1f}, korkea {ons[2]:.1f}")
    if moves:
        parts.append("; ".join(moves[:3]))
    if longs:
        parts.append(f"pitkiä ääniä {len(longs)}, joista paisuu ja hiipuu {swell}, tremolo {trem}")
    return "Linjat: " + "; ".join(parts) + "."


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
                         "partituuri": partituuri(p["alku"]), "ea": ajat[p["alku"]["id"]], "eb": ajat[p["loppu"]["id"]],
                         "pa": p["alku"], "pb": p["loppu"]})
    secs.sort(key=lambda s: s["a"])
    hits = [a for a in ank if ajat[a["id"]]["t"] is not None and a.get("tyyppi") == "hetki"]
    out = []
    for minute in range(0, int(math.ceil(end / 60))):
        a, b = 60.0 * minute, 60.0 * (minute + 1)
        out.append(f"##### {minute}:00–{minute + 1}:00\n")
        ml = minute_line(a, b, taso, liike, rows)
        if ml:
            out.append(ml + "\n")
        ll = linjat_line(a, min(b, end))
        if not ll:
            ll = linjat_line(a, b)
        if ll:
            out.append(ll + "\n")
        act = [s for s in secs if s["a"] < b and s["b"] > a]
        if act:
            out.append("Jaksot: " + "; ".join(f"**{s['nimi']}** {mm(s['a'])}–{mm(s['b'])} ({s['soi']})" for s in act) + "\n")
        here = [x for x in hits if a <= ajat[x["id"]]["t"] < b]
        starts = [s for s in secs if a <= s["a"] < b]
        ends = [s for s in secs if a <= s["b"] < b]
        evs = [(ajat[x["id"]]["t"], x, ajat[x["id"]], "") for x in here]
        evs += [(s["a"], None, dict(s["ea"], _ankkuri=s["pa"]), f"{s['nimi']}: alkaa") for s in starts]
        evs += [(s["b"], None, dict(s["eb"], _ankkuri=s["pb"]), f"{s['nimi']}: päättyy") for s in ends]
        evs.sort(key=lambda z: z[0])
        if not evs:
            out.append("*(ei ankkureita: edellinen jatkuu)*\n")
            continue
        out.append("| Aika | Mitä | Mitä kuuluu | Partituurin merkinnät (1926 painos) | Etuala / tausta | Tunnelma | Tarina (Lähteet / Käyttäjä / Ohjaaja) | Varmuus |\n|---|---|---|---|---|---|---|---|")
        for t, an, e, label in evs:
            if an is None:
                an = e.get("_ankkuri", {})
            nimi = an.get("nimi", label) if label == "" else label
            out.append(f"| **{mm(t)}** | {nimi} | {an.get('soi', '')} ({partituuri(an)}) | {an.get('esitysmerkinta', '')} | {an.get('etuala', '')} | {an.get('tunnelma', '')} | {an.get('tarina', '')} | {varmuus_teksti(e, an)} |")
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



# ---------------------------------------------------------------------------------------------
# Kuulijan opas (käyttäjä 9.11.2026): "kuunteluopas ei ole tekninen kuvaus desibeleistä ja keskiarvoista: sinne
# pitää tulla kuvaus kuulijalle mitä tapahtuu. Tekninen data menee json-fileen."
# Opas (md) = kuulijan kieli. Tekninen (peruste, varmuus, mitatut luvut) = annotations/tekninen_<levytys>.json.

EV_ALLOW = {"nousu", "lasku", "kerros katoaa", "kerros tulee", "urkupiste", "basso liikkuu", "basso vaikenee", "vuorottelu",
            "tremolo", "hengittävä sointu", "hiljaisuus", "äkillinen voimistuminen", "äkillinen hiljeneminen", "isku",
            "artikulaatio", "liike", "purske"}


def kuulijalle(e):
    """Tunnistimen tapahtuma kuulijan kielellä (ei desibelejä)."""
    typ, k, dur = e["tyyppi"], e["kuvaus"], e["loppu"] - e["alku"]
    perhe = f" ({e['perhe']})" if e.get("perhe") else ""
    if typ == "nousu":
        who = k.split(" nousee")[0]
        return f"Musiikki nousee: {who} kohoaa ylöspäin noin {dur:.0f} sekunnin ajan{perhe}."
    if typ == "lasku":
        who = k.split(" laskee")[0]
        return f"Musiikki laskeutuu: {who} painuu alaspäin noin {dur:.0f} sekunnin ajan{perhe}."
    if typ == "kerros katoaa":
        if k.startswith("pohja"):
            return f"Pohja katoaa: matalat soittimet vaikenevat ja ylempi kerros jää soimaan yksin ({dur:.0f} s). Ääni muuttuu kevyeksi ja pohjattomaksi."
        if k.startswith("ylä"):
            return f"Ylärekisteri sammuu ({dur:.0f} s): jäljelle jää tumma, matala sointi."
        return f"Keskirekisteri vaikenee ({dur:.0f} s): ääni ohenee."
    if typ == "kerros tulee":
        if k.startswith("pohja"):
            return "Matalat soittimet palaavat: ääni saa pohjan."
        if k.startswith("ylä"):
            return f"Ylärekisteri syttyy{perhe}."
        return f"Keskirekisteri tulee mukaan{perhe}."
    if typ == "urkupiste":
        sav = k.split("sävelellä ")[1].split(" ")[0]
        return f"Basso jää paikalleen yhdelle sävelelle ({sav}) noin {dur:.0f} sekunniksi: kaikki muu liikkuu sen päällä."
    if typ == "basso liikkuu":
        return "Basso lähtee liikkeelle pitkän paikallaan olon jälkeen."
    if typ == "basso vaikenee":
        return "Basso vaikenee."
    if typ == "vuorottelu":
        return "Kaksi ryhmää vuorottelee: nopea kuvio välähtää ylhäällä ja väistyy, yhä uudestaan" + (" (" + k.split(":")[0].replace("purskeet toistuvat ", "") + ")." if "välein" in k else ".")
    if typ == "purske":
        return f"Ylhäällä välähtää nopea kuvio{perhe}."
    if typ == "tremolo":
        return "Pitkät korkeat äänet alkavat väristä (tremolo)."
    if typ == "hengittävä sointu":
        return "Soinnut hengittävät: paisuvat ja hiipuvat vuorotellen."
    if typ == "hiljaisuus":
        return f"Lähes hiljaista noin {dur:.0f} sekuntia."
    if typ == "äkillinen voimistuminen":
        return f"Äkkiä voimakkaampaa{perhe}."
    if typ == "äkillinen hiljeneminen":
        return "Äkkiä hiljaisempaa."
    if typ == "isku":
        return "Isku."
    if typ == "artikulaatio":
        lay = k.split(":")[0]
        return f"{lay.capitalize()} soittaa lyhyitä, irrallisia ääniä (staccato)." if "staccato" in k else f"{lay.capitalize()} soittaa pitkiä, sidottuja ääniä (legato)."
    if typ == "liike":
        to = k.split("→ ")[1].split(" ")[0]
        return {"hidas": "Liike hidastuu: ääniä tulee harvakseltaan.", "kohtalainen": "Liike tasaantuu.", "nopea": "Liike kiihtyy: ääniä tulee tiheään."}.get(to, "")
    return ""


def gen_kuulijalle(m, td, rec):
    """Minuutti minuutilta kuulijan kielellä: ankkurit (kuratoitu) + tunnistimen tapahtumat (kone)."""
    ajat, ank = td["ajat"], m["ankkurit"]
    items = []
    for a in ank:
        e = ajat.get(a["id"], {})
        if e.get("t") is None:
            continue
        items.append((e["t"], "ankkuri", a, e))
    evs = []
    pak = rec.get("paketti")
    if pak and (ROOT / pak / "tapahtumat.json").exists():
        evs = read_json(ROOT / pak / "tapahtumat.json")["tapahtumat"]
    at = sorted(x[0] for x in items)
    strong = lambda e: not ((e["tyyppi"] == "isku" and e["voima"] < 12) or (e["tyyppi"] in ("äkillinen voimistuminen", "äkillinen hiljeneminen") and e["voima"] < 13)
                            or (e["tyyppi"] in ("nousu", "lasku") and e["loppu"] - e["alku"] < 6) or (e["tyyppi"] == "urkupiste" and e["loppu"] - e["alku"] < 12))
    last_txt = {}
    for e in evs:
        if e["tyyppi"] not in EV_ALLOW or not strong(e):
            continue
        if any(abs(e["alku"] - t) <= 4.0 for t in at):
            continue  # nimetty kohta kertoo saman tarkemmin
        txt = kuulijalle(e)
        if not txt:
            continue
        if last_txt.get(txt) is not None and e["alku"] - last_txt[txt] < 20:
            continue
        last_txt[txt] = e["alku"]
        items.append((e["alku"], "kone", txt, e))
    items.sort(key=lambda z: z[0])
    end = max([z[0] for z in items] + [60.0])
    out = ["*Lihavoidut kohdat ovat ohjaajan ja käyttäjän nimeämiä; muut rivit on kone kuullut äänestä itse (nousut, laskut, kerroksen "
           "katoaminen, urkupisteet, tremolo, staccato ja legato, vuorottelu). Soitinryhmä suluissa on koneen arvaus. Ajat ovat "
           "Rattlen äänitteen aikaa; mitään ei ole vielä tarkistettu korvalla, ellei rivillä lue niin.*\n"]
    for minute in range(0, int(math.ceil(end / 60))):
        a0, b0 = 60.0 * minute, 60.0 * (minute + 1)
        here = [z for z in items if a0 <= z[0] < b0]
        out.append(f"##### {minute}:00–{minute + 1}:00\n")
        if not here:
            out.append("*(edellinen jatkuu)*\n")
            continue
        for t, kind, x, e in here:
            ts = mm(t).split(".")[0]
            if kind == "ankkuri":
                kuultu = " *(kuultu)*" if e.get("varmuus") == "vahvistettu" else ""
                soi = x.get("soi", "").strip()
                soi = soi[0].upper() + soi[1:] if soi else ""
                out.append(f"- **{ts} {x['nimi']}.**{kuultu} {soi}.")
                if x.get("etuala"):
                    out.append(f"  - *Edessä ja takana:* {x['etuala']}. *Tunnelma:* {x.get('tunnelma', '')}.")
                if x.get("esitysmerkinta"):
                    out.append(f"  - *Partituurissa:* {x['esitysmerkinta']}")
                if x.get("tarina"):
                    out.append(f"  - {x['tarina']}")
            else:
                out.append(f"- {ts} {x}")
        out.append("")
    return "\n".join(out)


def write_tekninen(m, td, rec):
    """Tekninen data JSONiin: ankkurien mitattu peruste ja varmuus, minuuttien mitatut luvut, tarkistuslista."""
    ajat, ank = td["ajat"], m["ankkurit"]
    taso, liike, rows = load_background(rec)
    mins = []
    ts = [e["t"] for e in ajat.values() if e["t"] is not None]
    end = max(ts + [60.0])
    for minute in range(0, int(math.ceil(end / 60))):
        a0, b0 = 60.0 * minute, 60.0 * (minute + 1)
        mins.append({"minuutti": minute, "mitattu": minute_line(a0, b0, taso, liike, rows), "linjat": linjat_line(a0, b0) or linjat_line(a0, min(b0, end))})
    out = {"levytys": rec["id"], "ankkurit": [{"id": a["id"], "nimi": a["nimi"], "partituuri": partituuri(a), **ajat.get(a["id"], {})} for a in ank],
           "minuutit": mins, "tarkistuslista": gen_check(m, td)}
    pth = ROOT / "annotations" / f"tekninen_{rec['id']}.json"
    pth.write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8", newline="\n")
    return pth


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
    # Opas on kuulijan kieltä: käsin kirjoitettu alku säilyy, tekniset osat (ankkuritaulukko, tarkistuslista) pois.
    cut = min([i for i in (text.find("## Ankkurit aikakoodein"), text.find("## Minuutti minuutilta")) if i >= 0] or [len(text)])
    head = text[:cut].rstrip() + "\n\n"
    body = "## Minuutti minuutilta: mitä kuulet\n\n<!-- GEN:minuutit -->\n" + gen_kuulijalle(m, td, rec).rstrip("\n") + "\n<!-- /GEN:minuutit -->\n"
    tp = write_tekninen(m, td, rec)
    foot = (f"\n## Tekninen data\n\nMitatut perusteet, varmuudet ja luvut eivät ole tässä oppaassa. Ne ovat tiedostoissa "
            f"`annotations/{tp.name}`, `annotations/ajat_{rec['id']}.json`, `annotations/cues.json` ja paketin `tapahtumat.json`.\n")
    text = head + body + foot
    GUIDE.write_bytes(text.replace("\r\n", "\n").encode("utf-8"))
    n_t = sum(1 for e in td["ajat"].values() if e["t"] is not None)
    print(f"{GUIDE.relative_to(ROOT)}: levytys {rec['id']}, {len(m['ankkurit'])} ankkuria ({n_t} ajalla)")


if __name__ == "__main__":
    main()
