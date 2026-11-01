r"""Kuunteluoppaan aikakoodatut osat teemakartasta (annotations/teemat.json).

Kirjoittaa annotations/kuunteluopas.md:n merkittyjen kohtien väliin:
  <!-- GEN:ankkurit -->  varmimmat kohdat (teemakartan tapahtumat, joilla "ankkuri": true)
  <!-- GEN:minuutit --> minuutti minuutilta: jakso, dynamiikka (aikajanasta) ja tapahtumat
  <!-- GEN:tarkista --> tarkistettavat kohdat
Käsin kirjoitettu osa (tarina, henkilöt, menetelmä) jää ennalleen, eikä siinä ole aikoja: kaikki
ajat tulevat teemakartasta, joten opas ja cues.json eivät voi olla ristiriidassa.

Teemakartan rakenne (annotations/teemat.json; kirjoitetaan vaiheessa 5, ajat kuuntelukopion aikaa):
  sections: [{id, fi, title, start, end, kuvaus, peruste, tarkista?}]
  events:   [{id, t, t1?, luokka (soitin|isku|tunnelma|soolo|huippu|tauko), theme, kuuluu, tarina,
              varmuus, peruste, ankkuri?, tarkista?, vahvistettu?}]

    .venv\Scripts\python.exe -I analysis/kuunteluopas.py      (aja make_cues.py samalla, jos teemat.json muuttui)
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

ROOT = lahde.ROOT
MAP = ROOT / "annotations" / "teemat.json"
GUIDE = ROOT / "annotations" / "kuunteluopas.md"
TIMELINE = ROOT / "build" / "koko"
LUOKKA = {"soitin": "uusi soitin", "isku": "isku", "tunnelma": "tunnelma", "soolo": "soolo", "huippu": "huippu", "tauko": "tauko"}


def mm(t):
    m = int(t // 60)
    return f"{m}:{t - 60 * m:04.1f}"


def when(e):
    return mm(e["t"]) + (f"–{mm(e['t1'])}" if "t1" in e else "")


def varmuus(e):
    v = {"vahvistettu": "**vahvistettu**", "lahde+analyysi": "lähde+analyysi"}.get(e.get("varmuus"), e.get("varmuus", "–"))
    return v + (" **[tarkista]**" if e.get("tarkista") else "")


def dyn_line(rows, a, b):
    """Dynamiikka minuutin sisällä aikajanan jaksoista."""
    seq, peak = [], (0.0, None)
    for r in rows:
        if r["loppu"] <= a or r["alku"] >= b:
            continue
        if not seq or seq[-1] != r["dyn"]:
            seq.append(r["dyn"])
        if r["huippu"] > peak[0]:
            peak = (r["huippu"], max(r["alku"], a))
    if not seq:
        return ""
    s = " → ".join(seq)
    return f"Dynamiikka: {s}" + (f" (voimakkain jakso alkaa {mm(peak[1])}, huippu {peak[0]:.2f})" if peak[1] is not None else "")


def section_at(secs, t):
    for s in secs:
        if s["start"] - 1e-6 <= t < s["end"]:
            return s
    return None


def gen_minutes(m):
    secs = m.get("sections", [])
    rows = []
    f = TIMELINE / "aikajana.json"
    if f.exists():
        rows = json.loads(f.read_text(encoding="utf-8"))
    evs = sorted(m.get("events", []), key=lambda e: e["t"])
    end = max([s["end"] for s in secs] + [e.get("t1", e["t"]) for e in evs] + [60.0])
    out, shown = [], set()
    for minute in range(0, int(math.ceil(end / 60))):
        a, b = 60.0 * minute, 60.0 * (minute + 1)
        for s in secs:
            if a <= s["start"] < b and s["id"] not in shown:
                shown.add(s["id"])
                out.append(f"#### {s['fi']} ({s.get('title', '')}): {mm(s['start'])}–{mm(s['end'])}\n")
                out.append(s.get("kuvaus", "") + (" **[tarkista jakson raja]**" if s.get("tarkista") else "") + "\n")
        names = []
        for t in (a + 0.01, (a + b) / 2, b - 0.01):
            s = section_at(secs, t)
            if s and s["fi"] not in names:
                names.append(s["fi"])
        out.append(f"##### {minute}:00–{minute + 1}:00" + (" · " + " → ".join(names) if names else "") + "\n")
        dl = dyn_line(rows, a, b)
        if dl:
            out.append(dl + "\n")
        here = [e for e in evs if a <= e["t"] < b]
        if not here:
            out.append("*(ei uusia tapahtumia: edellinen jatkuu)*\n")
            continue
        out.append("| Aika | Mitä | Mitä kuuluu | Merkitys | Varmuus |\n|---|---|---|---|---|")
        for e in here:
            key = e.get("luokka") in ("soitin", "soolo", "isku") or e.get("varmuus") == "vahvistettu"
            t = f"**{when(e)}**" if key else when(e)
            out.append(f"| {t} | {LUOKKA.get(e.get('luokka'), '–')} | {e.get('kuuluu', '')} | {e.get('tarina') or '–'} | {varmuus(e)} |")
        out.append("")
    return "\n".join(out)


def gen_anchors(m):
    lines = ["| Kohta | Aika | Mistä tunnistaa | Varmuus |", "|---|---|---|---|"]
    for e in m.get("events", []):
        if e.get("ankkuri"):
            lines.append(f"| {(e.get('tarina') or '').split(';')[0] or e.get('kuuluu', '')} | {when(e)} | {e.get('peruste', '')} | {varmuus(e)} |")
    return "\n".join(lines)


def gen_check(m):
    lines = []
    for e in sorted([e for e in m.get("events", []) if e.get("tarkista")], key=lambda e: e["t"]):
        lines.append(f"- **{when(e)}** {e.get('kuuluu', '')}: {e.get('tarina') or 'tarkista'}")
    for s in m.get("sections", []):
        if s.get("tarkista"):
            lines.append(f"- Jakson raja: **{s['fi']}** alkaa {mm(s['start'])} ({s.get('peruste', '')})")
    return "\n".join(lines)


def replace(text, name, body):
    pat = re.compile(rf"(<!-- GEN:{name} -->\n).*?(<!-- /GEN:{name} -->)", re.S)
    if not pat.search(text):
        raise SystemExit(f"merkintä GEN:{name} puuttuu kuunteluoppaasta")
    return pat.sub(lambda mt: mt.group(1) + body.rstrip("\n") + "\n" + mt.group(2), text)


def main():
    if not MAP.exists():
        raise SystemExit(f"{MAP.relative_to(ROOT)} puuttuu: teemakartta kirjoitetaan vaiheessa 5")
    if not GUIDE.exists():
        raise SystemExit(f"{GUIDE.relative_to(ROOT)} puuttuu: oppaan käsin kirjoitettu runko (GEN-merkit) tehdään vaiheessa 5")
    m = json.loads(MAP.read_text(encoding="utf-8"))
    text = GUIDE.read_text(encoding="utf-8")
    text = replace(text, "ankkurit", gen_anchors(m))
    text = replace(text, "minuutit", gen_minutes(m))
    text = replace(text, "tarkista", gen_check(m))
    GUIDE.write_bytes(text.replace("\r\n", "\n").encode("utf-8"))
    print(f"{GUIDE.relative_to(ROOT)}: {len(m.get('events', []))} tapahtumaa, {len(m.get('sections', []))} jaksoa")


if __name__ == "__main__":
    main()
