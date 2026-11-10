r"""Merkinnät teemakartasta ja levytyksen ajoista: kirjoittaa annotations/cues.json.

Lähteet (docs/projekti.md, Data ja siirto omaan äänitykseen):
  annotations/teemat.json            ankkurit: partituurin paikka ja musiikillinen sisältö (levytysriippumaton, ei aikoja)
  annotations/ajat_<levytys>.json    ankkuri-id -> aika sekunteina ko. levytyksen kuuntelukopiossa, varmuus, peruste
  annotations/levytykset.json        levytysten luettelo (kuuntelukopio, kesto, rooli, analyysipaketti)
  <paketti>/aksentit.json            levytyksen iskut (aksentit.py), levytyskohtaiset

Tulos annotations/cues.json:
  recording  valittu levytys
  themes     ankkuriluokat (soitin / tunnelma / soolo / huippu / tauko / isku / jakso)
  sections   jaksot (ankkuriparit *_alku / *_loppu), vain jos molemmat ajat tunnetaan
  cues       yksi merkintä per ankkuri (t = null, jos aikaa ei ole voitu perustella: varmuus "arvio")
  iskut      levytyksen iskut (aksentit.json); isku-ankkureihin liitetään lähin isku (+-0,15 s), jos sellainen on
  analyses   mistä paketista iskut ovat
Lisäksi docs/kuvakasikirjoitus.md: ottojen otsikoiden ajat (<!--aika-->...<!--/aika-->) kirjoitetaan ankkureista.

Aikoja ei keksitä: ne luetaan vain ajat_<levytys>.json:sta. Tämä työkalu ei koskaan kirjoita ajat-tiedostoa, joten
siihen merkityt vahvistetut ajat (varmuus "vahvistettu") säilyvät. Tahtinumeroita ei lasketa äänestä; tahtiruudukkoa
(beats.json) ei viedä merkintöihin.
Ajat ovat kuuntelukopion aikaa (s).

  .venv\Scripts\python.exe -I analysis/make_cues.py --levytys rattle2022
  .venv\Scripts\python.exe -I analysis/make_cues.py --levytys rattle2022 --paketti build/rattle_koko
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

ROOT = lahde.ROOT
CUES = ROOT / "annotations" / "cues.json"
THEMES_MAP = ROOT / "annotations" / "teemat.json"
RECORDINGS = ROOT / "annotations" / "levytykset.json"
VARMUUDET = ("vahvistettu", "analyysi", "arvio")  # vahvimmasta heikoimpaan
LUOTTAMUS = ("hyvä", "kohtalainen", "heikko", "ei")  # parhaasta huonoimpaan
ISKU_RAJA_S = 0.15
STORYBOARD = ROOT / "docs" / "kuvakasikirjoitus.md"
OTTO_RE = re.compile(r"^(#### [^\n]*?`([^`\n]+)` → `([^`\n]+)` · )<!--aika-->[^\n]*?<!--/aika-->", re.M)


def read_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def pick_recording(levytys):
    """Levytyksen rivi levytykset.json:sta (oletuksena ensimmäinen, jonka rooli on 'työ')."""
    rec = read_json(RECORDINGS)["levytykset"]
    if levytys is None:
        for r in rec:
            if r.get("rooli") == "työ":
                return r
        raise SystemExit("ei työlevytystä: anna --levytys")
    for r in rec:
        if r["id"] == levytys:
            return r
    raise SystemExit(f"levytystä '{levytys}' ei ole {RECORDINGS.relative_to(ROOT)}:ssa ({', '.join(r['id'] for r in rec)})")


def worst(values, order):
    return max(values, key=order.index)


def load_times(levytys):
    path = ROOT / "annotations" / f"ajat_{levytys}.json"
    if not path.exists():
        raise SystemExit(f"{path.relative_to(ROOT)} puuttuu: levytyksen ajat kirjoitetaan analyysistä (docs/projekti.md, Data ja siirto omaan äänitykseen)")
    d = read_json(path)
    if d.get("levytys") != levytys:
        raise SystemExit(f"{path.name}: levytys '{d.get('levytys')}' ei vastaa '{levytys}'")
    return d


def check_times(anchors, times, kesto):
    """Pysäyttää virheisiin; palauttaa varoitukset."""
    ids = [a["id"] for a in anchors]
    if len(ids) != len(set(ids)):
        raise SystemExit("teemat.json: ankkureiden id:t eivät ole yksilöllisiä")
    extra = sorted(set(times) - set(ids))
    missing = sorted(set(ids) - set(times))
    if extra:
        raise SystemExit(f"ajat-tiedostossa on id:t, joita teemakartassa ei ole: {extra}")
    if missing:
        raise SystemExit(f"ajat-tiedostosta puuttuu ankkureiden aika: {missing}")
    for i, e in times.items():
        t = e.get("t")
        if e.get("varmuus") not in VARMUUDET:
            raise SystemExit(f"{i}: varmuus '{e.get('varmuus')}' ei ole {VARMUUDET}")
        if t is None:
            if e["varmuus"] != "arvio":
                raise SystemExit(f"{i}: t on null, mutta varmuus on '{e['varmuus']}' (pitää olla 'arvio')")
        else:
            if e["varmuus"] == "arvio":
                raise SystemExit(f"{i}: varmuus 'arvio' vaatii t: null (aika, jota ei voi perustella mittauksella, ei kuulu tähän)")
            if not isinstance(t, (int, float)) or not (0 <= t <= kesto):
                raise SystemExit(f"{i}: t={t} ei ole välillä 0–{kesto} s")
        if not e.get("peruste"):
            raise SystemExit(f"{i}: peruste puuttuu")
    warn = []
    for a in anchors:
        if a.get("tarina"):
            warn.append(f"{a['id']}: tarina ei ole tyhjä (käyttäjän kirjoittama; ok jos haastattelusta)")
    return warn


def build_sections(anchors, times, jaksot):
    by = {}
    for a in anchors:
        if a.get("tyyppi") == "jakso":
            by.setdefault(a["jakso"], {})[a["reuna"]] = a
    sections, open_ = [], []
    for sid, pair in by.items():
        if set(pair) != {"alku", "loppu"}:
            raise SystemExit(f"jakso '{sid}': alku- ja loppuankkuri molemmat vaaditaan (löytyi {sorted(pair)})")
        a, b = pair["alku"], pair["loppu"]
        ta, tb = times[a["id"]], times[b["id"]]
        if ta["t"] is None or tb["t"] is None:
            open_.append(sid)
            continue
        if not ta["t"] < tb["t"]:
            raise SystemExit(f"jakso '{sid}': alku {ta['t']} ei ole ennen loppua {tb['t']}")
        sections.append({
            "id": sid,
            "nimi": jaksot.get(sid, {}).get("nimi", sid),
            "start": ta["t"], "end": tb["t"], "kesto": round(tb["t"] - ta["t"], 3),
            "luokka": a["luokka"], "soi": a.get("soi", ""), "soittimet": a.get("soittimet", []),
            "kirjain": a.get("kirjain"), "tahti": a.get("tahti"), "tahti_loppu": a.get("tahti_loppu"),
            "ankkuri_alku": a["id"], "ankkuri_loppu": b["id"],
            "varmuus": worst([ta["varmuus"], tb["varmuus"]], VARMUUDET),
            "luottamus": worst([ta.get("luottamus", "ei"), tb.get("luottamus", "ei")], LUOTTAMUS),
            "vahvistettu": ta["varmuus"] == "vahvistettu" and tb["varmuus"] == "vahvistettu",
            "tarkista": bool(a.get("tarkista") or b.get("tarkista")),
        })
    sections.sort(key=lambda s: s["start"])
    return sections, open_


def nearest_hit(t, hits):
    best = None
    for h in hits:
        d = abs(h["t"] - t)
        if d <= ISKU_RAJA_S and (best is None or d < best[0]):
            best = (d, h)
    return best[1] if best else None


def build_cues(anchors, times, iskut):
    cues = []
    for a in anchors:
        e = times[a["id"]]
        c = {"id": a["id"], "ankkuri": a["id"], "t": e["t"]}
        if e.get("t_loppu") is not None:
            c["t_end"] = e["t_loppu"]
        c.update({"theme": a["luokka"], "luokka": a["luokka"], "tyyppi": a["tyyppi"]})
        if a.get("jakso"):
            c["jakso"], c["reuna"] = a["jakso"], a["reuna"]
        for k in ("nimi", "kirjain", "tahti", "tahti_loppu", "tahti_suhde", "soi", "soittimet", "tarina", "lahde"):
            c[k] = a.get(k)
        c["varmuus"] = e["varmuus"]
        c["lahde_aika"] = e["varmuus"]  # vanha kenttä: analyysi / arvio / vahvistettu
        c["luottamus"] = e.get("luottamus")
        c["peruste"] = e["peruste"]
        c["vahvistettu"] = e["varmuus"] == "vahvistettu"
        c["tarkista"] = bool(a.get("tarkista"))
        for k in ("vaihtoehdot", "ehdokkaat"):
            if e.get(k):
                c[k] = e[k]
        if a["luokka"] == "isku" and e["t"] is not None:
            h = nearest_hit(e["t"], iskut)
            if h:
                c["isku"] = {"t": h["t"], "z": h["z"], "tyyppi": h["tyyppi"], "ero_s": round(h["t"] - e["t"], 3)}
        cues.append(c)
    cues.sort(key=lambda c: (c["t"] is None, c["t"] if c["t"] is not None else 0.0))
    return cues



def _korvat_tapahtumat(rec):
    """Korvien (analysis/korvat.py) tunnistamat äänen tapahtumat levytyksen paketista."""
    pak = rec.get("paketti")
    f = ROOT / pak / "korvat.json" if pak else None
    if f is None or not f.exists():
        return []
    return json.loads(f.read_text(encoding="utf-8"))["tapahtumat"]


def _ohjaus(rec):
    """Kuvaa ohjaavien 30 fps -kanavien tiedosto ja kanavaluettelo."""
    pak = rec.get("paketti")
    f = ROOT / pak / "ohjaus.json" if pak else None
    if f is None or not f.exists():
        return None
    m = json.loads(f.read_text(encoding="utf-8"))
    out = {"tiedosto": f"{pak}/ohjaus.f32", "fps": m["fps"], "frames": m["frames"], "channels": m["channels"]}
    if m.get("spektri"):
        out["spektri"] = dict(m["spektri"], tiedosto=f"{pak}/{m['spektri']['tiedosto']}")
    return out


def _alut(rec):
    """Tarkat äänten alut kaistoittain (analysis/korvat.py --alut): [[t, voima], ...]; kuvan rytmiset elementit sidotaan näihin."""
    pak = rec.get("paketti")
    f = ROOT / pak / "alut.json" if pak else None
    if not f or not f.exists():
        return {}
    k = json.loads(f.read_text(encoding="utf-8"))
    return {b: k.get(b, []) for b in ("matala", "keski", "korkea")}


def _korvat_aanet(rec):
    """Korvien kuulemat pitkät äänet ja nuotit: kuva piirtää jokaisen niistä (alku, kesto, sävel, sointi)."""
    pak = rec.get("paketti")
    f = ROOT / pak / "korvat.json" if pak else None
    if f is None or not f.exists():
        return [], []
    k = json.loads(f.read_text(encoding="utf-8"))
    pitkat = [{"alku": p["alku"], "loppu": p["loppu"], "midi": p["midi"], "muoto": p.get("muoto"), "tremolo": p.get("tremolo"),
               "varina_hz": p.get("varina_hz"), "sointi": p.get("sointi")} for p in k.get("pitkat", [])]
    return pitkat, k.get("nuotit", [])


def leimaa_kasikirjoitus(cues, kesto):
    """Kirjoittaa kuvakäsikirjoituksen ottojen otsikoihin ajat ankkureista. Muualla käsikirjoituksessa ei ole aikoja."""
    if not STORYBOARD.exists():
        return None
    t = {c["id"]: c["t"] for c in cues}
    t.update({"tiedoston_alku": 0.0, "tiedoston_loppu": kesto})

    def mmss(x):
        return "?" if x is None else f"{int(x // 60)}:{int(x % 60):02d}"

    n = [0]

    def korvaa(m):
        n[0] += 1
        return f"{m.group(1)}<!--aika-->{mmss(t.get(m.group(2)))}–{mmss(t.get(m.group(3)))}<!--/aika-->"

    vanha = STORYBOARD.read_text(encoding="utf-8")
    uusi = OTTO_RE.sub(korvaa, vanha)
    if uusi != vanha:
        STORYBOARD.write_text(uusi, encoding="utf-8", newline="\n")
    return n[0]


def main():
    ap = argparse.ArgumentParser(description="annotations/cues.json teemakartasta, levytyksen ajoista ja iskuista")
    ap.add_argument("--levytys", help="levytyksen id (annotations/levytykset.json); oletus: ensimmäinen työlevytys")
    ap.add_argument("--paketti", type=Path, help="analyysipaketti, josta iskut luetaan (oletus: levytyksen 'paketti' levytykset.json:sta)")
    a = ap.parse_args()

    rec = pick_recording(a.levytys)
    levytys = rec["id"]
    pak = a.paketti or (Path(rec["paketti"]) if rec.get("paketti") else None)
    if pak is None:
        raise SystemExit(f"levytyksellä '{levytys}' ei ole 'paketti'-kenttää: anna --paketti")
    pak = pak if pak.is_absolute() else ROOT / pak

    if not THEMES_MAP.exists():
        raise SystemExit(f"{THEMES_MAP.relative_to(ROOT)} puuttuu")
    tm = read_json(THEMES_MAP)
    anchors = tm["ankkurit"]
    td = load_times(levytys)
    kesto = rec["kesto_s"]
    warn = check_times(anchors, td["ajat"], kesto)

    aks_file = pak / "aksentit.json"
    if not aks_file.exists():
        raise SystemExit(f"{aks_file.relative_to(ROOT)} puuttuu: aja aksentit.py paketille")
    aks = read_json(aks_file)
    iskut = [{"t": x["t"], "z": x["z"], "tyyppi": x["tyyppi"], "kontrasti_db": x.get("kontrasti_db"), "taso_db": x.get("taso_db"),
              "kaistat_z": x.get("kaistat_z"), "pisteet": x.get("pisteet")} for x in aks["aksentit"]]
    iskut.sort(key=lambda x: x["t"])

    sections, open_ = build_sections(anchors, td["ajat"], tm.get("jaksot", {}))
    cues = build_cues(anchors, td["ajat"], iskut)

    out = {
        "_ohje": ("Merkinnät, koneluettava vastine kuunteluoppaalle (annotations/kuunteluopas.md). GENEROITU: älä muokkaa käsin. "
                  "Sisältö: annotations/teemat.json; ajat: annotations/ajat_<levytys>.json (ainoa paikka, jossa aikoja kirjoitetaan käsin); "
                  "iskut: <paketti>/aksentit.json. Ajat sekunteina kuuntelukopion alusta. varmuus: vahvistettu / analyysi / arvio (t = null). "
                  "Luotu: .venv\\Scripts\\python.exe -I analysis/make_cues.py --levytys <id>."),
        "recording": {"levytys": levytys, "nimi": rec.get("nimi"), "lahde": rec.get("lahde"), "kuuntelukopio": rec.get("kuuntelukopio"),
                      "kesto_s": kesto, "rooli": rec.get("rooli")},
        "themes": tm.get("luokat", {}),
        "sections": sections,
        "cues": cues,
        "iskut": iskut,
        "tapahtumat": _korvat_tapahtumat(rec),
        "ohjaus": _ohjaus(rec),
        "pitkat": _korvat_aanet(rec)[0],
        "nuotit": _korvat_aanet(rec)[1],
        "alut": _alut(rec),
        "analyses": [{"levytys": levytys, "paketti": str(pak.relative_to(ROOT)).replace("\\", "/"),
                      "iskut_lahde": str(aks_file.relative_to(ROOT)).replace("\\", "/"),
                      "iskut_kynnys_z": aks.get("zmin"), "ajat_lahde": f"annotations/ajat_{levytys}.json"}],
        "puuttuu": {"ilman_aikaa": [c["id"] for c in cues if c["t"] is None], "jaksot_ilman_rajoja": open_},
    }
    CUES.parent.mkdir(parents=True, exist_ok=True)
    CUES.write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    n_t = sum(1 for c in cues if c["t"] is not None)
    n_conf = sum(1 for c in cues if c["vahvistettu"])
    print(f"{CUES.relative_to(ROOT)}: levytys {levytys}, {len(cues)} ankkuria ({n_t} ajalla, {len(cues) - n_t} ilman aikaa, {n_conf} vahvistettua), "
          f"{len(sections)} jaksoa, {len(iskut)} iskua")
    for w in warn:
        print("HUOM", w)
    if out["puuttuu"]["ilman_aikaa"]:
        print("ilman aikaa:", ", ".join(out["puuttuu"]["ilman_aikaa"]))
    n_otot = leimaa_kasikirjoitus(cues, kesto)
    if n_otot is not None:
        print(f"{STORYBOARD.relative_to(ROOT)}: {n_otot} oton ajat kirjoitettu ankkureista")


if __name__ == "__main__":
    main()
