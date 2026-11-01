r"""Varmat kohdat V1-V8 (docs/analyysisuunnitelma.md luku 2): ehdokasajat mitatuista kanavista, perusteineen.

Lukee paketin (analysis, listen, kanavat, aksentit, events, prepare) ja etsii jokaiselle varmalle kohdalle
ehdokasajan säännöllä, joka on kirjattu tähän tiedostoon (ei käsin kirjattuja sekunteja). Jokaiselle kohdalle
kirjataan mitattu peruste ja kanavien / soitinluokkien arvot siinä kohdassa. Varmuus on aina "analyysi": aikaa
ei ole kuultu, eikä tahtinumeroita lasketa äänestä. Partituurin mukainen kuvaus (käyttäjä 1.11.2026):

  V1 patarumpusoolo avaa; V2 jouset; V3 puhaltimet mukaan; V4 vaskien isku avaa Allegro moderaton;
  V5 puupuhallinjakso kirjain G (nopeat kuviot); V6 noin 5 tahtia C-duuria juuri ennen kirjainta M;
  V7 kirjain M, myrsky, kromaattinen jousitremolo; V8 loppu H-duuri divisi-jousissa.

Lisäksi: soitinluokkien (PANNs, kanavat soitin_<luokka>, raaka-arvot) erottuminen (käyrätorvi / trumpetti /
pasuuna, huilu / klarinetti, sello / kontrabasso) koko teoksessa, ja jokaisen luokan yläraja.

Tulosteet: <paketti>/varmat_kohdat.json ja varmat_kohdat.md. Ajat ovat kuuntelukopion aikaa.

    .venv\Scripts\python.exe -I analysis/varmat_kohdat.py build/rattle_koko
"""
import argparse
import json
import sys
from pathlib import Path

import numpy as np
import scipy.ndimage as ndi
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

FPS = 30
PITCHES = lahde.PITCHES
NAMES = {
    "violin_fiddle": "viulu", "cello": "sello", "double_bass": "kontrabasso", "string_section": "jousisektio",
    "bowed_string_instrument": "jousisoitin", "pizzicato": "pizzicato", "flute": "huilu", "clarinet": "klarinetti",
    "saxophone": "saksofoni", "wind_instrument_woodwind_instrument": "puupuhallin", "french_horn": "käyrätorvi",
    "trumpet": "trumpetti", "trombone": "pasuuna", "brass_instrument": "vaski", "timpani": "patarumpu",
    "drum_roll": "rumpujen pyörre", "orchestra": "orkesteri",
}


def load(d, name):
    meta = json.loads((d / f"{name}.json").read_text(encoding="utf-8"))
    x = np.fromfile(d / f"{name}.f32", dtype=np.float32).reshape(meta["frames"], -1)
    return meta, {c: x[:, i] for i, c in enumerate(meta["channels"])}


def mmss(t):
    return f"{int(t // 60)}:{t % 60:04.1f}"


def sl(t0, t1, n):
    return slice(max(0, int(round(t0 * FPS))), min(n, max(int(round(t0 * FPS)) + 1, int(round(t1 * FPS)))))


def runs(mask, min_s):
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]:
                j += 1
            if (j - i) / FPS >= min_s:
                out.append((i / FPS, j / FPS))
            i = j
        else:
            i += 1
    return out


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("dir", type=Path)
    a = ap.parse_args()
    d = a.dir if a.dir.is_absolute() else lahde.ROOT / a.dir
    am, A = load(d, "analysis")
    lm, L = load(d, "listen")
    km, K = load(d, "kanavat")
    prep = json.loads((d / "prepare.json").read_text(encoding="utf-8"))
    aks = json.loads((d / "aksentit.json").read_text(encoding="utf-8"))["aksentit"]
    cfg = lahde.config()
    n = km["frames"]
    cls = [c for c in K if c.startswith("soitin_")]
    lvl = K["taso_dbfs"]
    t_music = am["music_start"]
    huone = (cfg.get("kohinaikkuna") or {}).get("huone", {})
    t_end = huone.get("musiikki_loppuu_s") or (n / FPS)

    def classes(t0, t1):
        s = sl(t0, t1, n)
        return {c[7:]: round(float(K[c][s].max()), 3) for c in cls}

    def top_classes(t0, t1, k=4):
        r = classes(t0, t1)
        return ", ".join(f"{NAMES.get(c, c)} {v:.2f}" for c, v in sorted(r.items(), key=lambda kv: -kv[1])[:k] if v >= 0.02) or "ei yli 0,02"

    def chan(names, t0, t1, how="max"):
        s = sl(t0, t1, n)
        return {k: round(float(getattr(np, how)(K[k][s] if k in K else A[k][s])), 3) for k in names}

    out = {"paketti": str(d.relative_to(lahde.ROOT)).replace("\\", "/"), "kuuntelukopio": cfg["kuuntelukopio"], "kohdat": {}}
    V = out["kohdat"]

    # --- V1 patarumpusoolo ---------------------------------------------------------------------------
    clean, sr = sf.read(d / "clean_mono.wav", dtype="float64")
    h = int(0.005 * sr)
    r5 = 20 * np.log10(np.sqrt(np.convolve(clean ** 2, np.ones(h) / h, mode="same")[::h]) + 1e-12)
    floor = prep["noise_floor_db"]
    i0 = int(max(0.0, t_music - 3) / 0.005)
    onset = float(np.argmax(r5[i0:] > floor + 20) + i0) * 0.005
    strokes = [x for x in aks if onset - 0.1 <= x["t"] <= onset + 3]
    s1 = sl(onset - 0.2, onset + 3, n)
    k_peak = (int(np.argmax(K["patarumpu_matala"][s1])) + s1.start) / FPS
    tim = K["soitin_timpani"]
    tp = (int(np.argmax(tim[sl(onset, onset + 4, n)])) + sl(onset, onset + 4, n).start) / FPS
    below = np.where(tim[int((onset + 0.5) * FPS):int((onset + 6) * FPS)] < 0.02)[0]
    solo_end = onset + 0.5 + (below[0] / FPS if len(below) else 0)
    chroma = {p: float(A[f"chroma_{p}"][sl(onset + 0.2, solo_end - 0.2, n)].mean()) for p in PITCHES}
    top_ch = sorted(chroma.items(), key=lambda kv: -kv[1])[:3]
    V["V1"] = {
        "nimi": "patarumpusoolo avaa", "t": round(onset, 3), "alku": round(onset, 3), "loppu": round(solo_end, 2), "varmuus": "analyysi",
        "perusteet": [
            f"ensimmäinen ääni {onset:.3f} s (5 ms RMS > pintakohina {floor:.1f} dBFS + 20 dB); sitä ennen kohinaa ja digitaalista hiljaisuutta",
            f"aksentit.py: " + (", ".join(f"{x['t']:.2f} s (z {x['z']:.1f})" for x in strokes) or "ei iskuja ikkunassa"),
            f"patarumpu_matala huippu {k_peak:.2f} s (arvo {K['patarumpu_matala'][int(k_peak * FPS)]:.2f}); PANNs patarumpu huippu {tp:.2f} s (arvo {tim[int(tp * FPS)]:.2f})",
            f"soolo päättyy: PANNs patarumpu < 0,02 kohdassa {solo_end:.2f} s",
            "chroma soolon aikana: " + ", ".join(f"{p} {v:.2f}" for p, v in top_ch) + " (patarumpujen sävelet)",
        ],
        "kanavat": {**chan(["patarumpu_matala", "patarumpu_stemmi", "jouset", "puupuhaltimet", "vasket"], onset, solo_end),
                    "patarumpu_panns": chan(["patarumpu_panns"], onset, solo_end)["patarumpu_panns"]},
        "luokat": classes(onset, solo_end),
        "huom": "vasket-kanavan nousu iskun hetkellä on attakkiosa (PANNs-vaskiluokat 0,00); jouset ja puupuhaltimet lähellä nollaa soolon aikana",
    }

    # --- V2 jouset ---------------------------------------------------------------------------------------
    t2 = None
    for i in range(int((solo_end - 0.4) * FPS), int((solo_end + 4) * FPS)):
        prev = np.median(lvl[max(0, i - int(0.5 * FPS)):i])
        if lvl[i] - prev >= 5.0:
            t2 = i / FPS
            break
    t2 = t2 if t2 is not None else solo_end
    vio = K["soitin_violin_fiddle"]
    bow = K["soitin_bowed_string_instrument"]
    s2 = sl(t2, t2 + 8, n)
    first = lambda x, th, t0, t1: (int(np.argmax(x[sl(t0, t1, n)] > th)) + sl(t0, t1, n).start) / FPS if (x[sl(t0, t1, n)] > th).any() else None
    ev_str = [e for e in json.load(open(d / "events.json", encoding="utf-8"))["events"] if e.get("perhe") == "jouset" and e["tyyppi"] == "soitin_sisaan" and t2 - 2 <= e["t"] <= t2 + 8]
    v2_cls = first(vio, 0.05, t2, t2 + 10)
    V["V2"] = {
        "nimi": "jouset", "t": round(t2, 2), "alku": round(t2, 2), "loppu": round(t2 + 4, 2), "varmuus": "analyysi",
        "perusteet": [
            f"taso nousee {lvl[int(t2 * FPS)] - np.median(lvl[int((t2 - 0.5) * FPS):int(t2 * FPS)]):.1f} dB 0,5 s mediaaniin verrattuna kohdassa {t2:.2f} s, heti soolon ({solo_end:.1f} s) jälkeen",
            f"jouset-kanava: {K['jouset'][int(t2 * FPS)]:.2f} kohdassa {t2:.2f} s, huippu {K['jouset'][s2].max():.2f} ({(int(np.argmax(K['jouset'][s2])) + s2.start) / FPS:.1f} s)",
            f"PANNs viulu ylittää 0,05 vasta {v2_cls:.1f} s (raaka huippu {vio[s2].max():.2f} {(int(np.argmax(vio[s2])) + s2.start) / FPS:.1f} s); jousisoitin huippu {bow[s2].max():.2f}"
            if v2_cls else "PANNs viulu ei ylitä 0,05:tä 10 s:ssa",
            ("interpret.py: " + "; ".join(f"{e['t']:.1f} s {e['kuvaus']}" for e in ev_str)) if ev_str else "interpret.py: ei jousten sisääntuloa ikkunassa",
            f"patarumpu: PANNs {K['soitin_timpani'][s2].max():.3f}, patarumpu_matala {K['patarumpu_matala'][s2].max():.2f} (laskee soolon jälkeen)",
        ],
        "kanavat": chan(["jouset", "puupuhaltimet", "vasket", "patarumpu_matala"], t2, t2 + 4),
        "luokat": classes(t2, t2 + 8),
        "huom": "PANNs tunnistaa jouset vasta 2,5 s myöhemmin kuin tason ja spektrin muutos (ikkunan viive)",
    }

    # --- V3 puhaltimet mukaan ----------------------------------------------------------------------------
    puu = K["puupuhaltimet"]
    ww = K["soitin_flute"] + K["soitin_clarinet"] + K["soitin_wind_instrument_woodwind_instrument"]
    t3 = None
    for i in range(int((t2 + 3) * FPS), int(120 * FPS)):
        if puu[i] > 0.5 and ww[i:i + 2 * FPS].max() >= 0.05:
            t3 = i / FPS
            break
    # puhaltimet jousten jälkeen myös käyrätorvi / vaski: ensimmäinen vaskiluokan nousu
    horn = K["soitin_french_horn"]
    brass = K["soitin_brass_instrument"]
    t3a = first(brass, 0.1, t2 + 1, t2 + 20)
    s3a = sl(t3a - 0.5, t3a + 3, n) if t3a else None
    V["V3"] = {
        "nimi": "puhaltimet mukaan", "t": round(t3, 2) if t3 else None, "alku": round(t3, 2) if t3 else None, "loppu": round(t3 + 3, 2) if t3 else None, "varmuus": "analyysi",
        "perusteet": [
            f"puupuhaltimet-kanava ylittää 0,5 kohdassa {t3:.2f} s ja PANNs-puupuhallinluokista (huilu + klarinetti + puupuhallin) summa >= 0,05 seuraavan 2 s aikana",
            "PANNs klarinetti ylittää 0,05 " + (lambda t: f"{t:.1f} s" if t else "ei ikkunassa")(first(K['soitin_clarinet'], 0.05, t3 - 5, t3 + 10)) + ", huilu " + (lambda t: f"{t:.1f} s" if t else "ei 60 s:ssa")(first(K['soitin_flute'], 0.05, t3 - 5, t3 + 60)),
            "interpret.py: " + "; ".join(f"{e['t']:.1f} s {e['kuvaus']}" for e in json.load(open(d / "events.json", encoding="utf-8"))["events"]
                                         if e.get("perhe") in ("puupuhaltimet", "vaskipuhaltimet") and e["tyyppi"] == "soitin_sisaan" and t2 < e["t"] < t3 + 4),
        ] if t3 else ["ei ehdokasta säännöllä"],
        "kanavat": chan(["puupuhaltimet", "vasket", "jouset"], t3 - 0.5, t3 + 3) if t3 else {},
        "luokat": classes(t3 - 0.5, t3 + 3) if t3 else {},
        "vaihtoehto": {
            "nimi": "vaskipuhaltimet vastaavat jousille (käyrätorvet ensin)", "t": round(t3a, 2) if t3a else None,
            "perusteet": [f"PANNs vaski {brass[s3a].max():.2f}, käyrätorvi {horn[s3a].max():.2f}, trumpetti {K['soitin_trumpet'][s3a].max():.2f}, pasuuna {K['soitin_trombone'][s3a].max():.2f}; "
                          f"puupuhaltimet-kanava {puu[s3a].max():.2f} mutta huilu {K['soitin_flute'][s3a].max():.3f}, klarinetti {K['soitin_clarinet'][s3a].max():.3f} (puupuhaltimet-kanavan nousu tässä kohdassa ei ole PANNs-puupuhaltimia)"] if t3a else [],
        },
        "huom": "kaksi eri 'puhaltimien tuloa': vaski/käyrätorvi ensin, puupuhaltimet (klarinetti) myöhemmin; kumpaa partituuri tarkoittaa, ratkaisee korva ja partituuri",
    }

    # --- V4 vaskien isku, Allegro moderato -------------------------------------------------------------------
    cand = [x for x in aks if 30 <= x["t"] <= 120]
    best = max(cand, key=lambda x: x["z"])
    t4 = best["t"]
    s4 = sl(t4 - 1, t4 + 3, n)
    orch = K["soitin_orchestra"]
    V["V4"] = {
        "nimi": "vaskien isku, Allegro moderaton alku", "t": round(t4, 2), "alku": round(t4 - 0.1, 2), "loppu": round(t4 + 3, 2), "varmuus": "analyysi",
        "perusteet": [
            f"aksentit.py: vahvin isku välillä 30-120 s: {t4:.2f} s, z {best['z']:.1f}, {best['tyyppi']}, kaistat m/k/k {best['kaistat_z']['matala']}/{best['kaistat_z']['keski']}/{best['kaistat_z']['korkea']}, kontrasti {best['kontrasti_db']} dB",
            f"taso ennen iskua {lvl[sl(t4 - 1, t4 - 0.1, n)].mean():.1f} dBFS, iskun jälkeen {lvl[sl(t4 + 0.1, t4 + 1.5, n)].mean():.1f} dBFS",
            f"PANNs-vaskiluokat 3 s iskun jälkeen: käyrätorvi {horn[s4].max():.2f}, trumpetti {K['soitin_trumpet'][s4].max():.2f}, pasuuna {K['soitin_trombone'][s4].max():.2f}, vaski {brass[s4].max():.2f}; orkesteri {orch[s4].max():.2f}",
            f"PANNs pasuuna ylittää 0,1 kohdassa {first(K['soitin_trombone'], 0.1, t4 - 2, t4 + 4) or float('nan'):.1f} s, orkesteri 0,2 kohdassa {first(orch, 0.2, t4 - 2, t4 + 4) or float('nan'):.1f} s",
            f"interpret.py: " + "; ".join(f"{e['t']:.1f} s {e['kuvaus']}" for e in json.load(open(d / "events.json", encoding="utf-8"))["events"] if t4 - 2.5 <= e["t"] <= t4 + 3),
        ],
        "kanavat": chan(["vasket", "jouset", "puupuhaltimet", "patarumpu_matala"], t4 - 1, t4 + 3),
        "luokat": classes(t4 - 1, t4 + 3),
        "huom": "isku näkyy aksenteissa selvästi; PANNs ei erota vaskea orkesterista iskun hetkellä (vaskiluokat vain 0,0x)",
    }

    # --- V6 C-duuri ennen M (haetaan ennen V5:tä: V5:n haun yläraja) -------------------------------------
    cd = K["vihje_Cduuri"]
    c_runs = [(s, e) for s, e in runs(cd > 0.3, 3.0) if s > t4 + 30 and e < t_end - 60]
    rows6 = []
    for s, e in c_runs:
        ss = sl(s, e, n)
        ch = {p: float(A[f"chroma_{p}"][ss].mean()) for p in PITCHES}
        tot = sum(ch.values())
        after = sl(e, e + 3, n)
        rows6.append({"alku": round(s, 2), "loppu": round(e, 2), "kesto": round(e - s, 2), "vihje_keski": round(float(cd[ss].mean()), 3),
                      "CEG_osuus": round((ch["C"] + ch["E"] + ch["G"]) / tot, 2), "jannite": round(float(A["tension"][ss].mean()), 2),
                      "selkeys": round(float(A["key_clarity"][ss].mean()), 2), "taso_dbfs": round(float(lvl[ss].mean()), 1),
                      "liike_ennen": round(float(K["liiketiheys"][sl(s - 3, s, n)].mean()), 2), "liike_jalkeen_3s": round(float(K["liiketiheys"][after].mean()), 2),
                      "taso_jalkeen_3s": round(float(lvl[after].mean()), 1), "vaski_jalkeen_3s": round(float(brass[after].max()), 2)})
    prim6 = max(rows6, key=lambda r: r["kesto"]) if rows6 else None
    if prim6:
        s6, e6 = prim6["alku"], prim6["loppu"]
        ss = sl(s6, e6, n)
        V["V6"] = {
            "nimi": "C-duuri juuri ennen kirjainta M", "t": s6, "alku": s6, "loppu": e6, "varmuus": "analyysi",
            "perusteet": [
                f"pisin C-duuri-vihjejakso (vihje_Cduuri > 0,3, vähintään 3 s) kohdan {t4 + 30:.0f} s ja loppuhiljaisuuden välillä: {s6:.1f}-{e6:.1f} s ({prim6['kesto']:.1f} s)",
                f"chroma: C, E ja G muodostavat {prim6['CEG_osuus'] * 100:.0f} % chromasta; vihje_Cduuri keskiarvo {prim6['vihje_keski']:.2f}, huippu {cd[ss].max():.2f}",
                f"jännite {prim6['jannite']:.2f} ja sävellajin selkeys {prim6['selkeys']:.2f} (matala jännite, selkeä sävellaji); taso {prim6['taso_dbfs']:.1f} dBFS",
                f"heti jakson jälkeen: liiketiheys {prim6['liike_ennen']:.2f} -> {prim6['liike_jalkeen_3s']:.2f} alkua/s, PANNs-vaski {prim6['vaski_jalkeen_3s']:.2f}",
            ],
            "kanavat": {**chan(["vihje_Cduuri", "vihje_hmolli", "vihje_Hduuri", "vihje_Dduuri", "jouset", "puupuhaltimet", "vasket"], s6, e6, "mean"), "jousitremolo_max": float(K["jousitremolo"][ss].max())},
            "luokat": classes(s6, e6),
            "muut_ehdokkaat": [r for r in rows6 if r is not prim6],
            "huom": "tahteja ei lasketa äänestä; 'noin 5 tahtia' voidaan verrata vain jakson kestoon sekunteina",
        }

    # --- V7 kirjain M, myrsky ----------------------------------------------------------------------------
    if prim6:
        t7 = prim6["loppu"]
        sd = K["patarumpu_stemmi"]
        s7 = sl(t7 - 0.5, t7 + 2.5, n)
        spike = (int(np.argmax(sd[s7])) + s7.start) / FPS
        after = sl(t7, t7 + 35, n)
        before = sl(t7 - 6, t7 - 0.5, n)
        ak7 = [x for x in aks if t7 - 1 <= x["t"] <= t7 + 3]
        V["V7"] = {
            "nimi": "kirjain M, myrsky", "t": round(t7, 2), "alku": round(t7, 2), "loppu": round(t7 + 35, 1), "varmuus": "analyysi",
            "perusteet": [
                f"V6:n C-duuri-jakso päättyy {t7:.2f} s; samassa kohdassa tekstuuri muuttuu: liiketiheys {K['liiketiheys'][before].mean():.2f} -> {K['liiketiheys'][sl(t7, t7 + 3, n)].mean():.2f} alkua/s, "
                f"PANNs-vaski {brass[before].max():.2f} -> {brass[sl(t7, t7 + 3, n)].max():.2f}, taso {lvl[before].mean():.1f} -> {lvl[sl(t7, t7 + 3, n)].mean():.1f} dBFS",
                f"patarumpu_stemmi-kanavan piikki {spike:.2f} s (arvo {sd[int(spike * FPS)]:.2f}); aksentit.py ikkunassa {t7 - 1:.0f}-{t7 + 3:.0f} s: " + (", ".join(f"{x['t']:.2f} s z {x['z']:.1f}" for x in ak7) or "ei iskuja (z >= 5)"),
                f"myrskyikkuna {t7:.0f}-{t7 + 35:.0f} s: jännite {A['tension'][after].mean():.2f} (V6:ssa {prim6['jannite']:.2f}), sävellajin selkeys {A['key_clarity'][after].mean():.2f} (V6:ssa {prim6['selkeys']:.2f}), liiketiheys {K['liiketiheys'][after].mean():.2f}/s",
                f"jousitremolo-kanava myrskyikkunassa: keskiarvo {K['jousitremolo'][after].mean():.3f}, huippu {K['jousitremolo'][after].max():.2f}, ruutuja > 0,2: {int((K['jousitremolo'][after] > 0.2).sum())} / {after.stop - after.start}",
            ],
            "kanavat": {**chan(["jousitremolo", "liiketiheys", "vasket", "jouset", "puupuhaltimet"], t7, t7 + 35, "mean"), "jannite": float(A["tension"][after].mean()),
                        "selkeys": float(A["key_clarity"][after].mean())},
            "luokat": classes(t7, t7 + 35),
            "huom": "jousitremolo-kanava on tässä kuollut (ks. kanavakortti); myrsky tunnistetaan jännitteestä, kromaattisuudesta (matala selkeys), liiketiheydestä ja vaskista",
        }

    # --- V5 puupuhallinjakso (G, nopeat kuviot): ehdokkaat V4:n ja V6:n välissä ---------------------------------
    W = int(8 * FPS)
    sc = ndi.uniform_filter1d(puu, W) * ndi.uniform_filter1d(K["liiketiheys"], W)
    hi = (prim6["alku"] - 10) if prim6 else t_end
    order = np.argsort(-sc)
    used, cand5 = [], []
    for i in order:
        t = i / FPS
        if t < t4 + 5 or t > hi:
            continue
        if any(abs(t - u) < 20 for u in used):
            continue
        used.append(t)
        ss = sl(t - 4, t + 4, n)
        cand5.append({"alku": round(t - 4, 1), "loppu": round(t + 4, 1), "piste": round(float(sc[i]), 2), "puupuhaltimet": round(float(ndi.uniform_filter1d(puu, W)[i]), 2),
                      "liiketiheys": round(float(ndi.uniform_filter1d(K['liiketiheys'], W)[i]), 2), "huilu_max": round(float(K["soitin_flute"][ss].max()), 2),
                      "klarinetti_max": round(float(K["soitin_clarinet"][ss].max()), 2), "puupuhallin_max": round(float(K["soitin_wind_instrument_woodwind_instrument"][ss].max()), 2),
                      "taso_dbfs": round(float(lvl[ss].mean()), 1), "rekisteri": round(float(A["register"][ss].mean()), 2)})
        if len(cand5) >= 4:
            break
    if cand5:
        p5 = cand5[0]
        # jakson alku: lähin aikajanan / segments-raja ennen ikkunan keskikohtaa
        segs = json.loads((d / "segments.json").read_text(encoding="utf-8"))
        bnd = [s["alku"] for s in segs]
        t5s = max([b for b in bnd if b <= p5["alku"] + 4], default=p5["alku"])
        V["V5"] = {
            "nimi": "puupuhallinjakso, kirjain G (nopeat kuviot)", "t": round(t5s, 2), "alku": round(t5s, 2), "loppu": p5["loppu"], "varmuus": "analyysi",
            "perusteet": [
                f"säännöllä 'puupuhaltimet-kanava x liiketiheys' (8 s keskiarvo, kohdan {t4 + 5:.0f} s ja V6:n alun välillä) paras 8 s ikkuna {p5['alku']:.1f}-{p5['loppu']:.1f} s: puupuhaltimet {p5['puupuhaltimet']:.2f}, liiketiheys {p5['liiketiheys']:.2f} alkua/s",
                f"PANNs ikkunassa: huilu {p5['huilu_max']:.2f}, klarinetti {p5['klarinetti_max']:.2f}, puupuhallin {p5['puupuhallin_max']:.2f}; taso {p5['taso_dbfs']:.1f} dBFS, rekisteri {p5['rekisteri']:.2f}",
                f"jakson alku = lähin segments.py-raja ({t5s:.2f} s) ennen ikkunaa",
            ],
            "kanavat": chan(["puupuhaltimet", "liiketiheys", "vasket", "jouset"], p5["alku"], p5["loppu"], "mean"),
            "luokat": classes(p5["alku"], p5["loppu"]),
            "muut_ehdokkaat": cand5[1:],
            "huom": "heikoin V:istä: kirjain G:n paikkaa ei voi päätellä sekunneista; ehdokkaat on järjestetty säännön pistein, korva ja partituuri ratkaisevat",
        }

    # --- V8 loppu H-duuri --------------------------------------------------------------------------------
    hd = ndi.uniform_filter1d(K["vihje_Hduuri"], 3 * FPS)
    h_runs = [(s, e) for s, e in runs(hd > 0.5, 10.0) if e > t_end - 60]
    if h_runs:
        s8, e8 = h_runs[-1]
        ss = sl(s8 + 1, e8 - 1, n)
        ch = {p: float(A[f"chroma_{p}"][ss].mean()) for p in PITCHES}
        tot = sum(ch.values())
        V["V8"] = {
            "nimi": "loppu, H-duuri divisi-jousissa", "t": round(s8, 2), "alku": round(s8, 2), "loppu": round(e8, 2), "varmuus": "analyysi",
            "perusteet": [
                f"viimeinen jakso, jossa vihje_Hduuri (3 s tasoitus) > 0,5 vähintään 10 s: {s8:.1f}-{e8:.1f} s ({e8 - s8:.1f} s); musiikki loppuu {t_end:.1f} s (huoneen kohina + 10 dB), sen jälkeen hiljenemistä ja digitaalinen hiljaisuus {huone.get('viimeinen_ei_digitaalinen_s', '?')} s alkaen",
                "chroma jakson aikana (osuus kokonaisuudesta): " + ", ".join(f"{p} {ch[p] / tot:.2f}" for p in ("H", "Fis", "Es", "D", "B")) + " (H = perusääni, Fis = kvintti, Es = Dis = suuri terssi; D = pieni terssi)",
                f"sävellajin selkeys {A['key_clarity'][ss].mean():.2f} (Krumhansl-Schmuckler: {lahde.PITCHES[11]} duuri), taso {lvl[ss].mean():.1f} dBFS (teoksen huippu {lvl[:int(t_end * FPS)].max():.1f} dBFS)",
                f"patarumpu: PANNs {K['soitin_timpani'][ss].max():.3f}, drums-stemmi-kanava {K['patarumpu_stemmi'][ss].max():.2f}, patarumpu_matala {K['patarumpu_matala'][ss].max():.2f}",
            ],
            "kanavat": {**chan(["vihje_Hduuri", "vihje_hmolli", "vihje_Cduuri", "jouset", "puupuhaltimet", "vasket", "patarumpu_matala", "patarumpu_stemmi"], s8, e8, "mean")},
            "luokat": classes(s8, e8),
            "huom": "divisi-jouset eivät näy soitinluokissa (PANNs-jouset lähellä nollaa hiljaisessa kohdassa); H-duuri tulee chromasta",
        }

    # --- soitinluokkien erottuminen koko teoksessa ---------------------------------------------------------
    musiikki = slice(int(t_music * FPS), int(t_end * FPS))
    stat = {}
    for c in cls:
        x = K[c][musiikki]
        i = int(np.argmax(x))
        stat[c[7:]] = {"max": round(float(x.max()), 4), "max_aika_s": round(float((i + musiikki.start) / FPS), 1),
                       "ruutuja_yli_0.05_pros": round(100 * float((x > 0.05).mean()), 2), "ruutuja_yli_0.1_pros": round(100 * float((x > 0.1).mean()), 2),
                       "ensimmainen_yli_0.05_s": (round(float((int(np.argmax(x > 0.05)) + musiikki.start) / FPS), 1) if (x > 0.05).any() else None),
                       "ylittaa_0.05": bool((x > 0.05).any())}
    out["luokat_koko_teos"] = stat

    def pair(a_, b_):
        x, y = K[f"soitin_{a_}"][musiikki].astype(np.float64), K[f"soitin_{b_}"][musiikki].astype(np.float64)
        act = np.maximum(x, y) > 0.05
        k = FPS
        xs, ys = ndi.uniform_filter1d(x, k), ndi.uniform_filter1d(y, k)
        m = np.maximum(xs, ys) > 0.02
        r = float(np.corrcoef(xs[m], ys[m])[0, 1]) if m.sum() > 10 else None
        return {"a": a_, "b": b_, "ruutuja_jompikumpi_yli_0.05": int(act.sum()),
                "a_yli_2xb_pros": round(100 * float((x[act] > 2 * y[act]).mean()), 1) if act.any() else None,
                "b_yli_2xa_pros": round(100 * float((y[act] > 2 * x[act]).mean()), 1) if act.any() else None,
                "korkeintaan_kaksinkertainen_ero_pros": round(100 * float(((x[act] <= 2 * y[act]) & (y[act] <= 2 * x[act])).mean()), 1) if act.any() else None,
                "korrelaatio_1s": None if r is None else round(r, 2), "a_max": round(float(x.max()), 3), "b_max": round(float(y.max()), 3)}

    out["parit"] = [pair("french_horn", "trumpet"), pair("french_horn", "trombone"), pair("trumpet", "trombone"), pair("flute", "clarinet"),
                    pair("cello", "double_bass"), pair("violin_fiddle", "cello"), pair("french_horn", "brass_instrument")]
    # vaskiluokkien osuudet: ruuduissa, joissa vaski > 0,1
    act = brass[musiikki] > 0.1
    hh, tt_, tb = (K[f"soitin_{c}"][musiikki][act].astype(np.float64) for c in ("french_horn", "trumpet", "trombone"))
    tot = hh + tt_ + tb + 1e-9
    out["vaskijako"] = {"ruutuja_vaski_yli_0.1": int(act.sum()), "kayratorvi_hallitsee_pros": round(100 * float((hh / tot > 0.5).mean()), 1),
                        "trumpetti_hallitsee_pros": round(100 * float((tt_ / tot > 0.5).mean()), 1), "pasuuna_hallitsee_pros": round(100 * float((tb / tot > 0.5).mean()), 1),
                        "keskiosuudet": {"kayratorvi": round(float((hh / tot).mean()), 2), "trumpetti": round(float((tt_ / tot).mean()), 2), "pasuuna": round(float((tb / tot).mean()), 2)}}
    (d / "varmat_kohdat.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    # --- markdown ---------------------------------------------------------------------------------------
    L_ = [f"# Varmat kohdat V1-V8: ehdokasajat ({out['paketti']})", "",
          f"Ajat ovat kuuntelukopion (`{cfg['kuuntelukopio']}`) aikaa tiedoston alusta. Varmuus kaikilla: **analyysi** (ei kuultu). "
          f"Komento: `.venv\\Scripts\\python.exe -I analysis/varmat_kohdat.py {out['paketti']}`. Tahtinumeroita ei lasketa äänestä.", "",
          "| # | Kohta | Ehdokasaika | Väli | Varmuus |", "|---|---|---|---|---|"]
    for k in ("V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"):
        v = V.get(k)
        if v:
            L_.append(f"| {k} | {v['nimi']} | {mmss(v['t']) if v['t'] is not None else '–'} ({v['t']} s) | {v['alku']}-{v['loppu']} s | analyysi |")
    for k in ("V1", "V2", "V3", "V4", "V5", "V6", "V7", "V8"):
        v = V.get(k)
        if not v:
            continue
        L_ += ["", f"## {k} {v['nimi']}: {v['t']} s", ""] + [f"- {p}" for p in v["perusteet"]]
        if v.get("kanavat"):
            L_.append("- kanavat: " + ", ".join(f"`{c}` {x:.2f}" if isinstance(x, float) else f"`{c}` {x}" for c, x in v["kanavat"].items()))
        if v.get("luokat"):
            top = sorted(v["luokat"].items(), key=lambda kv: -kv[1])
            L_.append("- soitinluokat (PANNs raaka, suurin arvo välillä): " + ", ".join(f"{NAMES.get(c, c)} {x:.3f}" for c, x in top if x >= 0.01) + (
                "; muut < 0,01" if any(x < 0.01 for _, x in top) else ""))
        if v.get("vaihtoehto") and v["vaihtoehto"].get("t"):
            L_.append(f"- vaihtoehto: {v['vaihtoehto']['nimi']} {v['vaihtoehto']['t']} s: " + " ".join(v["vaihtoehto"]["perusteet"]))
        if v.get("muut_ehdokkaat"):
            L_.append("- muut ehdokkaat: " + "; ".join(json.dumps(m, ensure_ascii=False) for m in v["muut_ehdokkaat"]))
        L_.append(f"- huom: {v['huom']}")
    L_ += ["", "## Soitinluokat koko teoksessa (musiikin aikana, raaka-arvo 0..1, 30 fps)", "",
           "| Luokka | Suurin | Missä | > 0,05 (% ruuduista) | > 0,1 (%) | ensimmäinen > 0,05 |", "|---|---|---|---|---|---|"]
    for c, s in stat.items():
        L_.append(f"| {NAMES.get(c, c)} (`{c}`) | {s['max']:.3f} | {mmss(s['max_aika_s'])} | {s['ruutuja_yli_0.05_pros']} | {s['ruutuja_yli_0.1_pros']} | "
                  f"{mmss(s['ensimmainen_yli_0.05_s']) if s['ensimmainen_yli_0.05_s'] is not None else 'ei koskaan'} |")
    L_ += ["", "Luokat, jotka eivät koskaan ylitä 0,05:tä: " + (", ".join(f"{NAMES.get(c, c)}" for c, s in stat.items() if not s["ylittaa_0.05"]) or "ei yhtään"), "",
           "## Erottuvatko soittimet toisistaan (ruudut, joissa jompikumpi luokka > 0,05)", "",
           "| Pari | Ruutuja | a > 2b (%) | b > 2a (%) | erot alle 2x (%) | korrelaatio (1 s) | a max | b max |", "|---|---|---|---|---|---|---|---|"]
    for p in out["parit"]:
        L_.append(f"| {NAMES.get(p['a'], p['a'])} / {NAMES.get(p['b'], p['b'])} | {p['ruutuja_jompikumpi_yli_0.05']} | {p['a_yli_2xb_pros']} | {p['b_yli_2xa_pros']} | "
                  f"{p['korkeintaan_kaksinkertainen_ero_pros']} | {p['korrelaatio_1s']} | {p['a_max']} | {p['b_max']} |")
    vj = out["vaskijako"]
    L_ += ["", f"Vaskiruuduissa (PANNs vaski > 0,1; {vj['ruutuja_vaski_yli_0.1']} ruutua): käyrätorvi hallitsee {vj['kayratorvi_hallitsee_pros']} %, trumpetti {vj['trumpetti_hallitsee_pros']} %, "
           f"pasuuna {vj['pasuuna_hallitsee_pros']} % (hallitsee = yli puolet käyrätorven, trumpetin ja pasuunan summasta); keskimääräiset osuudet {vj['keskiosuudet']}."]
    (d / "varmat_kohdat.md").write_text("\n".join(L_) + "\n", encoding="utf-8")
    print("\n".join(L_))


if __name__ == "__main__":
    main()
