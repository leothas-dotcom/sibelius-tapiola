r"""Yhteiset apufunktiot jaksojen, teemojen ja tapahtumien tunnistukseen (themes) sekä aikajanan pohjaksi.

Tässä on vain apufunktiot: paketin lataus (`load_chunk`), usean osapaketin yhdistäminen (`stitch`),
koko äänitteen yli normalisoidut kanavat (`channels`), kromamalli ja osajono-DTW (`cens`, `theme_search`),
jaksot (`runs`), sävellaji (`key_of`, Krumhansl-Schmuckler), dominanttiseptimi (`dom7_score`),
tahtiruudukon paikka (`bar_at`) ja `mmss`. Edellisen teoksen teema- ja tapahtumatunnistimet sekä lähteiden
tahtitaulukko on poistettu. Tapiolan tunnistinosa kirjoitetaan vaiheessa 5 teemakartan (annotations/teemat.json)
ja käyttäjän partituurista antamien kohtien pohjalta.

Kaikki ajat ovat kuuntelukopion aikaa.
"""
import json
import sys
from pathlib import Path

import librosa
import numpy as np
from scipy.ndimage import gaussian_filter1d, uniform_filter1d

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

ROOT = lahde.ROOT
FPS = 30
PCS = lahde.PITCHES


# --- yhdistäminen ---------------------------------------------------------------------------
def load_chunk(d):
    d = Path(d)
    am = json.loads((d / "analysis.json").read_text(encoding="utf-8"))
    A = np.fromfile(d / "analysis.f32", dtype=np.float32).reshape(am["frames"], -1)
    lm = json.loads((d / "listen.json").read_text(encoding="utf-8"))
    L = np.fromfile(d / "listen.f32", dtype=np.float32).reshape(lm["frames"], -1)
    beats = json.loads((d / "beats.json").read_text(encoding="utf-8")) if (d / "beats.json").exists() else {}
    ev = json.loads((d / "events.json").read_text(encoding="utf-8"))["events"] if (d / "events.json").exists() else []
    return {"dir": str(d), "start": am["start"], "dur": am["duration"], "A": A, "Ach": am["channels"], "L": L,
            "Lch": lm["channels"], "bars": beats.get("bars", []), "beats": beats.get("beats", []),
            "down": beats.get("downbeats_raaka", []), "keys": am.get("keys_5s", []), "onsets": am.get("onsets", []),
            "events": ev, "music_start": am.get("music_start", 0.0)}


def stitch(chunks):
    chunks = sorted(chunks, key=lambda c: c["start"])
    end = max(c["start"] + c["dur"] for c in chunks)
    n = int(round(end * FPS)) + 1
    # kanavat nimen mukaan: kaikissa osissa ei ole kaikkia kanavia (esim. stemmit tai sävelkorkeudet)
    ach = [x for x in chunks[0]["Ach"] if all(x in c["Ach"] for c in chunks)]
    lch = [x for x in chunks[0]["Lch"] if all(x in c["Lch"] for c in chunks)]
    A = np.zeros((n, len(ach)), np.float32)
    L = np.zeros((n, len(lch)), np.float32)
    # vaihtokohta: seuraavan osan alku + puolet limityksestä
    cuts = []
    for k in range(len(chunks) - 1):
        a, b = chunks[k], chunks[k + 1]
        ov = a["start"] + a["dur"] - b["start"]
        cuts.append(b["start"] + max(0.0, ov) / 2)
    cuts.append(end + 1)
    lo = 0.0
    bars, beats, down, onsets, keys, events = [], [], [], [], [], []
    for k, c in enumerate(chunks):
        hi = cuts[k]
        i0, i1 = int(round(lo * FPS)), min(n, int(round(hi * FPS)))
        j0 = i0 - int(round(c["start"] * FPS))
        m = min(i1 - i0, len(c["A"]) - j0, len(c["L"]) - j0)
        if m > 0:
            A[i0:i0 + m] = c["A"][j0:j0 + m][:, [c["Ach"].index(x) for x in ach]]
            L[i0:i0 + m] = c["L"][j0:j0 + m][:, [c["Lch"].index(x) for x in lch]]
        inside = lambda t: lo <= t < hi
        bars += [b["t"] for b in c["bars"] if inside(b["t"])]
        beats += [t for t in c["beats"] if inside(t)]
        down += [t for t in c["down"] if inside(t)]
        onsets += [t for t in c["onsets"] if inside(t)]
        keys += [k2 for k2 in c["keys"] if inside(k2["t"])]
        events += [e for e in c["events"] if inside(e["t"])]
        lo = hi
    return {"n": n, "A": A, "Ach": ach, "L": L, "Lch": lch, "bars": np.array(sorted(bars)), "beats": np.array(sorted(beats)),
            "down": np.array(sorted(down)), "onsets": np.array(sorted(onsets)), "keys": keys, "events": events,
            "music_start": chunks[0]["music_start"], "chunks": [c["dir"] for c in chunks]}


def channels(S):
    """Koko äänitteen yli normalisoidut kanavat."""
    A, L = S["A"], S["L"]
    ga = lambda name: A[:, S["Ach"].index(name)]
    # sävelkorkeus (CREPE) puuttuu paketeista, joissa savelet-vaihetta ei ajettu: nollat
    gl = lambda name: L[:, S["Lch"].index(name)] if name in S["Lch"] else np.zeros(len(L), np.float32)
    rel = ga("rel_db")
    music = rel > np.percentile(rel, 8)
    loud = np.clip(rel / max(1e-6, np.percentile(rel[music], 99)), 0, 1)
    loud = gaussian_filter1d(loud, 6)
    fam = lambda keys, sig=12: (lambda x: np.clip(x / max(1e-6, np.percentile(x[music], 95)), 0, 1.5))(
        gaussian_filter1d(np.minimum(1, sum(gl("panns_" + k) for k in keys)), sig))
    # Tapiolan kokoonpano: jouset, puupuhaltimet, vaskipuhaltimet ja patarummut (ei harppua, ei muita lyömäsoittimia)
    F = {
        "horns": fam(["french_horn"]), "tpt": fam(["trumpet", "trombone"]), "brass": fam(["brass_instrument"]),
        "violin": fam(["violin_fiddle"]), "strings": fam(["string_section", "bowed_string_instrument"]),
        "cello": fam(["cello"]), "bass": fam(["double_bass"]), "winds": fam(["wind_instrument_woodwind_instrument", "flute", "clarinet"]),
        "timp": fam(["timpani", "drum_roll"], 4), "tutti": fam(["orchestra"], 20),
    }
    chroma = np.stack([ga("chroma_" + p) for p in PCS], axis=1)
    reg = gaussian_filter1d(ga("register"), 15)
    return {"loud": loud, "rel": rel, "music": music, "F": F, "chroma": chroma, "reg": reg,
            "tempo": gl("tempo_bpm"), "mel": gl("johtava_midi"), "melc": gl("johtava_varmuus"),
            "bass": gl("basso_midi"), "bassc": gl("basso_varmuus")}


# --- teemahaku (osajono-DTW, 12 transponointia) -------------------------------------------------
def cens(chroma, down=6):
    """Kromasta CENS-tyyppinen: normalisointi, kvantisointi, tasoitus, harvennus (30 -> 5 fps)."""
    c = chroma / np.maximum(1e-6, chroma.sum(axis=1, keepdims=True))
    q = np.zeros_like(c)
    for th, v in [(0.4, 4), (0.2, 3), (0.1, 2), (0.05, 1)]:
        q[(c > th) & (q == 0)] = v
    q = uniform_filter1d(q, size=down * 2, axis=0)[::down]
    return q / np.maximum(1e-6, np.linalg.norm(q, axis=1, keepdims=True))


def theme_search(template, seq, max_hits=24, thr=None, min_gap=8.0, step_s=0.2):
    """Palauttaa osumat [(alku_s, loppu_s, kustannus, transponointi)]."""
    hits = []
    for shift in range(12):
        X = np.roll(template, shift, axis=1).T
        D, _ = librosa.sequence.dtw(X=X, Y=seq.T, metric="cosine", subseq=True, step_sizes_sigma=np.array([[1, 1], [1, 2], [2, 1]]))
        cost = D[-1] / X.shape[1]
        for j in range(1, len(cost) - 1):
            if cost[j] <= cost[j - 1] and cost[j] <= cost[j + 1]:
                hits.append((j, float(cost[j]), shift))
    hits.sort(key=lambda h: h[1])
    if thr is None:
        allc = np.array([h[1] for h in hits])
        thr = np.percentile(allc, 3)
    out = []
    L = template.shape[0]
    for j, c, sh in hits:
        if c > thr:
            break
        t_end = j * step_s
        t0 = max(0.0, t_end - L * step_s)
        if all(abs(t0 - o[0]) > min_gap for o in out):
            out.append((t0, t_end, c, sh))
        if len(out) >= max_hits:
            break
    return sorted(out)


# --- tapahtumat -----------------------------------------------------------------------------------
def runs(mask, min_len_s, fps=FPS):
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]:
                j += 1
            if (j - i) / fps >= min_len_s:
                out.append((i / fps, j / fps))
            i = j
        else:
            i += 1
    return out


def key_of(chroma_mean):
    """Krumhansl-Schmuckler: paras duuri/molli."""
    maj = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88])
    mnr = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])
    best = (-9, "")
    for k in range(12):
        for prof, name in [(maj, "duuri"), (mnr, "molli")]:
            r = np.corrcoef(chroma_mean, np.roll(prof, k))[0, 1]
            if r > best[0]:
                best = (r, f"{PCS[k]} {name}")
    return best[1], best[0]


def dom7_score(ch):
    """Dominanttiseptimisoinnun kroma: pohja, terssi, kvintti, pieni septimi (paras transponointi)."""
    c = ch / np.maximum(1e-6, ch.sum(axis=1, keepdims=True))
    best = np.zeros(len(c)), np.zeros(len(c), int)
    tpl = np.zeros(12)
    tpl[[0, 4, 7, 10]] = 1
    for k in range(12):
        s = c @ np.roll(tpl, k)
        better = s > best[0]
        best[0][better] = s[better]
        best[1][better] = k
    return best


def bar_at(bars, t):
    if len(bars) == 0:
        return None
    if t < bars[0]:
        return 1 + (t - bars[0]) / 2.0
    k = int(np.searchsorted(bars, t, side="right") - 1)
    if k >= len(bars) - 1:
        return k + 1 + (t - bars[-1]) / max(0.5, bars[-1] - bars[-2])
    return k + 1 + (t - bars[k]) / (bars[k + 1] - bars[k])


def mmss(t):
    return f"{int(t // 60)}:{t % 60:04.1f}"
