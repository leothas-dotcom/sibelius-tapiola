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


PAKDIR = [None]


# ---------------------------------------------------------------------------------------------
# Kuulijan opas (käyttäjä 9.11.2026): "kuunteluopas ei ole tekninen kuvaus desibeleistä ja keskiarvoista: sinne
# pitää tulla kuvaus kuulijalle mitä tapahtuu. Tekninen data menee json-fileen."
# Opas (md) = kuulijan kieli. Tekninen data (peruste, varmuus, mitatut luvut) on ajat_<levytys>.json:ssa ja cues.json:ssa.

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
    cj = ROOT / "annotations" / "cues.json"
    if cj.exists():
        evs = read_json(cj).get("tapahtumat", [])
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
    foot = (f"\n## Mistä tämä opas syntyy\n\nSisältö: `annotations/teemat.json`. Ajat ja mitatut perusteet: "
            f"`annotations/ajat_{rec['id']}.json`. Kuvaa ohjaa `annotations/cues.json`, johon nämä ja koneen kuulemat tapahtumat kootaan.\n")
    text = head + body + foot
    GUIDE.write_bytes(text.replace("\r\n", "\n").encode("utf-8"))
    n_t = sum(1 for e in td["ajat"].values() if e["t"] is not None)
    print(f"{GUIDE.relative_to(ROOT)}: levytys {rec['id']}, {len(m['ankkurit'])} ankkuria ({n_t} ajalla)")


if __name__ == "__main__":
    main()
