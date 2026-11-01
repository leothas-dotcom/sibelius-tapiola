r"""Merkintäluonnos analyysista: kirjoittaa/päivittää annotations/cues.json.

Lukee analyysipaketit (build/<ajo>/: analysis.json, events.json, beats.json jos on) ja kokoaa:
  sections  jaksot teemakartasta (annotations/teemat.json, jos se on olemassa)
  cues      teemakartan tapahtumat (teema_*) + paketin tapahtumat (interpret.py)
  bars      tahdit (beat_this, vain jos beats.json on ajettu; ei tahtinumeroita äänestä)
Jokaisessa kohdassa on "lahde" (analyysi / arvio / vahvistettu) ja "vahvistettu".
Kohtia, joissa "vahvistettu": true, ei koskaan muuteta eikä poisteta; muut luodaan uudelleen.
Jaksojen, teemojen ja iskujen ajat ovat vain teemakartassa (CLAUDE.md): tämä työkalu ei keksi niitä.
Ajat ovat kuuntelukopion aikaa (s).

  .venv\Scripts\python.exe -I analysis/make_cues.py build/testi60 [build/muu ...]
"""
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

ROOT = lahde.ROOT
CUES = ROOT / "annotations" / "cues.json"
EXAMPLE = ROOT / "annotations" / "cues.example.json"

# Jaksot ja teemat: annotations/teemat.json (teemakartta; ainoa paikka, jossa ajat ovat).
THEMES_MAP = ROOT / "annotations" / "teemat.json"
GENERATED_THEMES = {
    "soitin_sisaan": "Analyysi: soitinperhe tulee sisään (kenttä 'perhe')",
    "soitin_ulos": "Analyysi: soitinperhe vaikenee (kenttä 'perhe')",
    "tempo_muutos": "Analyysi: tahtitempo muuttuu (kenttä 'tiedot'; vain jos beats.json on ajettu)",
    "hiljenee_akkia": "Analyysi: voimakkuus putoaa äkkiä (esim. yleistauko)",
    "voimistuu_akkia": "Analyysi: voimakkuus nousee äkkiä",
    "rakenteen_muutos": "Analyysi: uutuuskäyrän huippu ja mitä siinä muuttui",
}


def from_theme_map():
    """Jaksot ja teemamerkinnät teemakartasta. Kartan 'vahvistettu' siirtyy merkintään."""
    if not THEMES_MAP.exists():
        return [], [], {}
    m = json.loads(THEMES_MAP.read_text(encoding="utf-8"))
    sections = [{**sec, "vahvistettu": bool(sec.get("vahvistettu"))} for sec in m.get("sections", [])]
    cues = []
    for e in m.get("events", []):
        c = {"id": e.get("cue_id", f"teema_{e['id']}"), "teema": e["id"], "t": e["t"], "theme": e["theme"]}
        if "t1" in e:
            c["t_end"] = e["t1"]
        for k in ("luokka", "lead"):
            if k in e:
                c[k] = e[k]
        c["lahde"] = e.get("varmuus", "arvio")
        c["note"] = e.get("kuuluu", "") + (f". {e['tarina']}" if e.get("tarina") else "") + (" [tarkista]" if e.get("tarkista") else "")
        c["peruste"] = e.get("peruste", "")
        c["vahvistettu"] = bool(e.get("vahvistettu"))
        cues.append(c)
    return sections, cues, m.get("themes", {})


def generated_entry(**kw):
    return {**kw, "vahvistettu": False}


def from_package(d):
    """Tapahtumat ja tahdit yhdestä analyysipaketista."""
    meta = json.loads((d / "analysis.json").read_text(encoding="utf-8"))
    start = meta["start"]
    cues = []
    events_file = d / "events.json"
    if events_file.exists():
        for e in json.loads(events_file.read_text(encoding="utf-8"))["events"]:
            extra = {k: e[k] for k in ("perhe", "tahti", "tiedot") if k in e}
            cues.append(generated_entry(id=f"cue_{e['tyyppi']}_{e['t']:.1f}" + (f"_{e['perhe']}" if "perhe" in e else ""),
                                        t=e["t"], theme=e["tyyppi"], varmuus=e["varmuus"], **extra,
                                        lahde="analyysi", note=e["kuvaus"]))
    bars = []
    beats_file = d / "beats.json"
    if beats_file.exists():
        beats = json.loads(beats_file.read_text(encoding="utf-8"))
        bars = [{"bar": b["bar"], "t": round(b["t"], 3), "lahde": "analyysi"} for b in beats["bars"]]
    info = {"start": start, "duration": meta["duration"], "paketti": str(d.relative_to(ROOT)).replace("\\", "/")}
    return cues, bars, info


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("packages", nargs="+", type=Path)
    a = ap.parse_args()

    if CUES.exists():
        base = json.loads(CUES.read_text(encoding="utf-8"))
    elif EXAMPLE.exists():
        base = json.loads(EXAMPLE.read_text(encoding="utf-8"))
    else:
        base = {"recording": {"lahde": "audio/05_Tapiola.mp3", "kuuntelukopio": "build/kuuntelu/tapiola_kuuntelu.wav"}, "themes": {}}
    map_secs, cues, map_themes = from_theme_map()
    # Teemakartta on käsin ylläpidetty ja kantaa omat vahvistuksensa, joten sen merkinnät ja jaksot
    # tulevat aina kartasta. Muut vahvistetut merkinnät (cues.json:iin suoraan merkityt) säilyvät.
    map_ids = {c["id"] for c in cues}
    keep_cues = [c for c in base.get("cues", []) if c.get("vahvistettu") and c.get("id") not in map_ids
                 and not str(c.get("id", "")).startswith("teema_")]
    keep_ids = {c.get("id") for c in keep_cues}
    bars, analyses = [], []
    for d in a.packages:
        d = d if d.is_absolute() else ROOT / d
        c, b, info = from_package(d)
        cues += c
        bars += b
        analyses.append(info)
    cues = keep_cues + [c for c in cues if c["id"] not in keep_ids]
    cues.sort(key=lambda c: c["t"] if c["t"] is not None else 1e9)

    out = {
        "_ohje": ("Merkinnät, koneluettava vastine kuunteluoppaalle (annotations/kuunteluopas.md). "
                  "Ajat sekunteina kuuntelukopion alusta. lahde: analyysi / arvio / vahvistettu. "
                  "Aseta \"vahvistettu\": true - make_cues.py ei koskaan muuta vahvistettuja kohtia. "
                  "Luotu: .venv\\Scripts\\python.exe -I analysis/make_cues.py <paketit>."),
        "recording": base["recording"],
        "themes": {**base.get("themes", {}), **map_themes, **GENERATED_THEMES},
        "sections": map_secs,
        "cues": cues,
        "bars": sorted(bars, key=lambda b: b["t"]),
        "analyses": analyses,
    }
    CUES.parent.mkdir(parents=True, exist_ok=True)
    CUES.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    n_conf = sum(1 for c in cues if c.get("vahvistettu"))
    print(f"{CUES.relative_to(ROOT)}: {len(map_secs)} jaksoa, {len(cues)} tapahtumaa ({n_conf} vahvistettua), tahteja {len(out['bars'])}")


if __name__ == "__main__":
    main()
