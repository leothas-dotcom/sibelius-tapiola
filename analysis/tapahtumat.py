r"""Tapahtumatunnistin: etsii koko teoksesta ne kohdat, joissa ÄÄNI muuttuu, ilman että niitä osoitetaan.

Käyttäjä 9.11.2026: "Jos koko orkesteri nousee, ja sitten spektristä katoaa puolet, ääni muuttuu! Etsi sieltä ne
kohdat ... sinun pitää ITSE pystyä tunnistamaan KAIKKI TUOLLAISET KOHDAT ... RYTMI, ÄÄNENKORKEUS, KETKÄ SOITTAVAT,
MITÄ ÄÄNESSÄ TAPAHTUU, HIDAS, NOPEA, STACCATO, LEGATO."

Lukee paketista minuuttien linjat_*.json ja tarkka_*.json (analysis/linjat.py, tarkka.py), kaaret.f32, kanavat.f32
ja aksentit.json. Tunnistaa:

  nousu / lasku        kerrosten painopiste ja ylälinja liikkuvat samaan suuntaan vähintään 5 s
  kerros katoaa / tulee  rekisterikaistan (matala C1–H2, keski C3–H4, korkea C5–) taso putoaa tai nousee >= 14 dB ja pysyy
  urkupiste            sama bassosävel vähintään 8 s; ja "basso lähtee liikkeelle", kun se päättyy vaihtoon
  liike                uusia säveliä sekunnissa: hidas / kohtalainen / nopea; purskeet ja niiden toistuminen
  artikulaatio         lyhyiden ja pitkien äänten suhde: staccato (lyhyet, irralliset) / legato (pitkät, sidotut)
  tremolo              pitkät äänet, joiden taso värisee 8–22 Hz
  paisuva sointu       useita pitkiä ääniä alkaa yhtä aikaa ja paisuu ja hiipuu < >
  isku                 aksentit.py:n iskut (z >= 8)
  äkillinen muutos     taso muuttuu >= 10 dB sekunnissa; hiljaisuus

Kirjoittaa: <paketti>/tapahtumat.json ja annotations/tapahtumat_<levytys>.md (generoitu).

    .venv\Scripts\python.exe -I analysis\tapahtumat.py build\rattle_koko --levytys rattle2022
"""
import argparse
import glob
import json
import re
import sys
from collections import Counter
from pathlib import Path

import numpy as np
import scipy.ndimage as ndi

ROOT = Path(__file__).resolve().parent.parent
NOTE = ["C", "Cis", "D", "Dis", "E", "F", "Fis", "G", "Gis", "A", "Ais", "H"]


def mm(t):
    return f"{int(t) // 60}:{t % 60:04.1f}"


def to_midi(n):
    if not n:
        return np.nan
    m = re.match(r"([A-Z][a-z]*)(-?\d)", n)
    return NOTE.index(m.group(1)) + 12 * (int(m.group(2)) + 1)


def name(m):
    m = int(round(m))
    return f"{NOTE[m % 12]}{m // 12 - 1}"


def runs(mask, min_len):
    out, i, n = [], 0, len(mask)
    while i < n:
        if mask[i]:
            j = i
            while j < n and mask[j]:
                j += 1
            if j - i >= min_len:
                out.append((i, j))
            i = j
        else:
            i += 1
    return out


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("dir", type=Path)
    ap.add_argument("--levytys", required=True)
    a = ap.parse_args()
    d = a.dir
    # --- sekuntisarjat linjoista
    rows, longs, notes = {}, [], []
    for f in sorted(glob.glob(str(d / "linjat_*.json"))):
        j = json.loads(Path(f).read_text(encoding="utf-8"))
        if j["vali"][1] - j["vali"][0] > 61:
            continue  # vain minuuttiajot
        for r in j["rivit"]:
            rows[int(round(r["t"]))] = r
        longs += j["pitkat"]
    for f in sorted(glob.glob(str(d / "tarkka_*.json"))):
        j = json.loads(Path(f).read_text(encoding="utf-8"))
        if j["vali"][1] - j["vali"][0] > 61 or j["vali"][0] % 60:
            continue
        notes += j["kuviot"]
    N = max(rows) + 1
    bass = np.full(N, np.nan)
    cen = np.full((3, N), np.nan)
    top = np.full(N, np.nan)
    ons = np.zeros((3, N))
    for s, r in rows.items():
        b = to_midi(r["basso"])
        bass[s] = b if (not np.isnan(b) and b < 48) else np.nan
        for k in range(3):
            if r["painopiste"][k] is not None:
                cen[k, s] = r["painopiste"][k]
        top[s] = to_midi(r["ylalinja"])
        ons[:, s] = r["uusia"]
    km = json.loads((d / "kanavat.json").read_text(encoding="utf-8"))
    K = np.fromfile(d / "kanavat.f32", dtype=np.float32).reshape(km["frames"], len(km["channels"]))
    taso30 = K[:, km["channels"].index("taso_dbfs")]
    fam = {f: K[:, km["channels"].index(f)] for f in ("jouset", "puupuhaltimet", "vasket") if f in km["channels"]}
    rm = json.loads((d / "kaaret_kanavat.json").read_text(encoding="utf-8"))
    R = np.fromfile(d / "kaaret.f32", dtype=np.float32).reshape(rm["frames"], len(rm["channels"]))
    sec = lambda x: np.array([x[i * 30:(i + 1) * 30].mean() for i in range(min(N, len(x) // 30))])
    taso = sec(taso30)
    N = min(N, len(taso))
    share = {b: sec(R[:, rm["channels"].index(f"osuus_{b}")])[:N] for b in ("matala", "keski", "korkea", "kirkas")}
    band = {"matala": taso[:N] + 10 * np.log10(share["matala"] + 1e-6),
            "keski": taso[:N] + 10 * np.log10(share["keski"] + 1e-6),
            "korkea": taso[:N] + 10 * np.log10(share["korkea"] + share["kirkas"] + 1e-6)}
    E = []

    def ev(t0, t1, typ, kuvaus, voima=0.0):
        E.append(dict(alku=round(float(t0), 1), loppu=round(float(t1), 1), tyyppi=typ, kuvaus=kuvaus, voima=round(float(voima), 1)))

    def fill(v):
        x = v.copy()
        ok = ~np.isnan(x)
        if ok.sum() < 2:
            return x
        x[~ok] = np.interp(np.flatnonzero(~ok), np.flatnonzero(ok), x[ok])
        return x

    # --- A. nousu / lasku
    def slope(v, w=8):
        x = ndi.median_filter(fill(v), 3)
        out = np.zeros(len(x))
        tt = np.arange(w)
        for i in range(len(x) - w):
            out[i + w // 2] = np.polyfit(tt, x[i:i + w], 1)[0] * 10
        return out
    s_mid, s_hi, s_top, s_bass = slope(cen[1, :N]), slope(cen[2, :N]), slope(top[:N]), slope(bass[:N])
    for sign, typ in ((1, "nousu"), (-1, "lasku")):
        votes = (sign * s_mid >= 5).astype(int) + (sign * s_hi >= 3).astype(int) + (sign * s_top >= 6).astype(int) + (sign * s_bass >= 2).astype(int)
        mask = (votes >= 2) & (taso[:N] > -55)
        mask = ndi.binary_closing(mask, structure=np.ones(3))
        for i, j in runs(mask, 5):
            who = []
            if np.mean(sign * s_bass[i:j]) >= 1.5:
                who.append("basso")
            if np.mean(sign * s_mid[i:j]) >= 4:
                who.append("keskikerros")
            if np.mean(sign * s_hi[i:j]) >= 2.5 or np.mean(sign * s_top[i:j]) >= 5:
                who.append("yläkerros")
            span = sign * (np.nanmean(fill(cen[1, :N])[max(i, j - 2):j]) - np.nanmean(fill(cen[1, :N])[i:i + 2]))
            label = "koko orkesteri" if len(who) >= 3 else " ja ".join(who) if who else "kerrokset"
            ev(i, j, typ, f"{label} {'nousee' if sign > 0 else 'laskee'} {j - i} s (keskikerros {span:+.0f} puolisävelaskelta)", abs(span))

    # --- B. kerros katoaa / tulee
    for b, lab in (("matala", "pohja (matala rekisteri)"), ("keski", "keskirekisteri"), ("korkea", "ylärekisteri")):
        x = band[b]
        before = np.array([x[max(0, i - 4):i].mean() if i > 0 else x[0] for i in range(N)])
        after = np.array([x[i:i + 4].mean() for i in range(N)])
        drop = before - after
        cand = [i for i in range(4, N - 4) if drop[i] >= 14 and after[i] < -52 and before[i] > -50 and taso[i:i + 4].mean() > -58]
        last = -99
        for i in cand:
            if i - last > 6:
                k = i
                while k < N and x[k] < -50:
                    k += 1
                if k - i >= 3:
                    ev(i, k, "kerros katoaa", f"{lab} katoaa {k - i} s ({before[i]:.0f} → {after[i]:.0f} dBFS); muu soi edelleen", drop[i])
                last = i
        cand = [i for i in range(4, N - 4) if -drop[i] >= 14 and before[i] < -52 and after[i] > -48]
        last = -99
        for i in cand:
            if i - last > 6:
                ev(i, i + 1, "kerros tulee", f"{lab} tulee ({before[i]:.0f} → {after[i]:.0f} dBFS)", -drop[i])
                last = i

    # --- C. urkupiste ja basson liikkeelle lähtö
    b = bass[:N]
    i = 0
    while i < N:
        if not np.isnan(b[i]):
            j = i
            while j < N and (b[j] == b[i] or (np.isnan(b[j]) and j + 1 < N and b[j + 1] == b[i])):
                j += 1
            if j - i >= 8:
                nxt = b[j] if j < N else np.nan
                ev(i, j, "urkupiste", f"basso pysyy sävelellä {name(b[i])} {j - i} s", j - i)
                if not np.isnan(nxt) and nxt != b[i]:
                    ev(j, j + 1, "basso liikkuu", f"basso lähtee liikkeelle {j - i} s paikallaan olon jälkeen: {name(b[i])} → {name(nxt)}", j - i)
                elif np.isnan(nxt):
                    ev(j, j + 1, "basso vaikenee", f"basso vaikenee {j - i} s urkupisteen jälkeen ({name(b[i])})", j - i)
            i = j
        else:
            i += 1

    # --- D. liike: luokka 10 s välein ja purskeet
    tot = ons[:, :N].sum(axis=0)
    hi = ndi.uniform_filter1d(ons[2, :N], 2)
    base = ndi.median_filter(hi, 21)
    bm = (hi >= 22) & (hi >= 2.2 * (base + 3))
    bursts = runs(bm, 1)
    bt = [i for i, _ in bursts]
    for k, (i, j) in enumerate(bursts):
        ev(i, j, "purske", f"ylärekisterin nopea purske ({hi[i:j].max():.0f} uutta säveltä/s)", hi[i:j].max())
    # toistuvat purskeet
    k = 0
    while k + 3 < len(bt):
        gaps = np.diff(bt[k:k + 4])
        if gaps.min() >= 3 and gaps.max() <= 12 and gaps.max() - gaps.min() <= 3:
            j = k + 3
            while j + 1 < len(bt) and 3 <= bt[j + 1] - bt[j] <= 12 and abs((bt[j + 1] - bt[j]) - np.median(gaps)) <= 3:
                j += 1
            ev(bt[k], bt[j] + 2, "vuorottelu", f"purskeet toistuvat noin {np.median(np.diff(bt[k:j + 1])):.0f} s välein, {j - k + 1} kertaa: kaksi ryhmää vuorottelee", j - k + 1)
            k = j + 1
        else:
            k += 1
    cls_prev = None
    for s0 in range(0, N - 10, 10):
        v = tot[s0:s0 + 10].mean()
        if taso[s0:s0 + 10].mean() < -58:
            cls = "hiljaisuus"
        else:
            cls = "hidas" if v < 12 else ("kohtalainen" if v < 30 else "nopea")
        if cls != cls_prev and cls != "hiljaisuus":
            ev(s0, s0 + 10, "liike", f"liike muuttuu: {cls_prev or 'alku'} → {cls} ({v:.0f} uutta säveltä/s)", v)
        cls_prev = cls

    # --- E. artikulaatio 5 s välein (yläkerros C5–, keskikerros C3–H4)
    nt = [(k["alku"], k["loppu"] - k["alku"], to_midi(k["savel"])) for k in notes]
    art_prev = {}
    for s0 in range(0, N - 5, 5):
        for lab, lo, hi_ in (("keskikerros", 48, 71), ("yläkerros", 72, 108)):
            ds = [du for t_, du, m_ in nt if s0 <= t_ < s0 + 5 and lo <= m_ <= hi_]
            if len(ds) < 8:
                art = None
            else:
                short = np.mean(np.array(ds) < 0.3)
                art = "staccato (lyhyet, irralliset)" if short >= 0.62 else ("legato (pitkät, sidotut)" if short <= 0.3 and np.mean(ds) >= 0.7 else None)
            if art and art != art_prev.get(lab):
                ev(s0, s0 + 5, "artikulaatio", f"{lab}: {art}; {len(ds)} ääntä 5 s:ssa, keskikesto {np.mean(ds):.2f} s", len(ds))
            if art:
                art_prev[lab] = art
            elif len(ds) < 4:
                art_prev[lab] = None

    # --- F. tremolo ja G. paisuvat soinnut
    tm = np.zeros(N, int)
    for r in longs:
        if "tremolo" in r["varina"]:
            tm[int(r["alku"]):min(N, int(r["loppu"]) + 1)] += 1
    for i, j in runs(ndi.binary_closing(tm >= 2, structure=np.ones(3)), 3):
        ms = [r["midi"] for r in longs if "tremolo" in r["varina"] and r["alku"] < j and r["loppu"] > i]
        ev(i, j, "tremolo", f"pitkät äänet värisevät (tremolo), {len(ms)} ääntä välillä {name(min(ms))}–{name(max(ms))}", len(ms))
    sw = np.zeros(N, int)
    for r in longs:
        if "< >" in r["muoto"]:
            sw[int(r["alku"])] += 1
    sc = np.flatnonzero(ndi.uniform_filter1d(sw.astype(float), 2) * 2 >= 3)
    grp = []
    for s in sc:
        if grp and s - grp[-1][-1] <= 1:
            grp[-1].append(s)
        else:
            grp.append([s])
    st = [g[0] for g in grp]
    k = 0
    while k < len(st):
        j = k
        while j + 1 < len(st) and st[j + 1] - st[j] <= 5:
            j += 1
        if j - k >= 3:
            ev(st[k], st[j] + 2, "hengittävä sointu", f"soinnut paisuvat ja hiipuvat vuorotellen, {j - k + 1} kertaa, noin {np.median(np.diff(st[k:j + 1])):.1f} s välein", j - k + 1)
        elif j == k:
            ev(st[k], st[k] + 2, "paisuva sointu", "sointu paisuu ja hiipuu < >", sw[st[k]])
        k = j + 1

    # --- H. iskut ja I. äkilliset muutokset
    ap_ = d / "aksentit.json"
    if ap_.exists():
        aj = json.loads(ap_.read_text(encoding="utf-8"))
        items = aj.get("aksentit", aj.get("iskut", aj if isinstance(aj, list) else []))
        for it in items:
            t_ = it.get("t", it.get("aika", it.get("alku")))
            z = float(it.get("z", 0))
            if t_ is not None and z >= 8:
                ev(float(t_), float(t_) + 0.1, "isku", f"isku ({it.get('tyyppi', 'aksentti')}, z {z:.0f})", z)
    dl = np.diff(taso[:N], prepend=taso[0])
    for i in range(1, N):
        if dl[i] >= 10 and taso[i] > -50:
            ev(i, i + 1, "äkillinen voimistuminen", f"taso nousee {dl[i]:+.0f} dB sekunnissa ({taso[i - 1]:.0f} → {taso[i]:.0f} dBFS)", dl[i])
        if dl[i] <= -10 and taso[i - 1] > -45:
            ev(i, i + 1, "äkillinen hiljeneminen", f"taso putoaa {dl[i]:+.0f} dB sekunnissa ({taso[i - 1]:.0f} → {taso[i]:.0f} dBFS)", -dl[i])
    for i, j in runs((taso[:N] < -58) & (np.arange(N) > 7) & (np.arange(N) < N - 22), 2):
        ev(i, j, "hiljaisuus", f"lähes hiljaista {j - i} s (keskitaso {taso[i:j].mean():.0f} dBFS)", j - i)

    # perhevihje jokaiselle tapahtumalle (PANNs, 2–3 s jäljessä: luetaan alusta + 2,5 s)
    for e in E:
        i0 = int((e["alku"] + 2.5) * 30)
        i1 = max(i0 + 30, int((min(e["loppu"], e["alku"] + 8) + 2.5) * 30))
        v = {f: float(x[i0:i1].mean()) for f, x in fam.items() if i0 < len(x)}
        e["perhe"] = max(v, key=v.get) if v and max(v.values()) >= 0.35 else ""
    E.sort(key=lambda e: (e["alku"], e["tyyppi"]))
    (d / "tapahtumat.json").write_text(json.dumps({"levytys": a.levytys, "tapahtumat": E}, ensure_ascii=False, indent=1), encoding="utf-8")
    cnt = Counter(e["tyyppi"] for e in E)
    L = [f"# Tapahtumat: {a.levytys}", "",
         "*Generoitu (`analysis/tapahtumat.py`), ei muokata käsin. Tunnistin käy koko äänen läpi ja etsii kohdat, joissa ääni muuttuu:",
         "nousut ja laskut, kerroksen katoaminen tai tulo, urkupisteet ja basson liikkeelle lähtö, liikkeen nopeus, purskeet ja",
         "vuorottelu, staccato ja legato, tremolo, paisuvat soinnut, iskut ja äkilliset muutokset. Soitinta ei nimetä varmasti:",
         "perhevihje on PANNs-luokittimesta. Ajat kuuntelukopion aikaa. Mikään ei ole kuultu.*", "",
         "Yhteensä " + ", ".join(f"{k} {v}" for k, v in cnt.most_common()) + ".", ""]
    cur = -1
    for e in E:
        m_ = int(e["alku"]) // 60
        if m_ != cur:
            cur = m_
            L += ["", f"## {m_}:00–{m_ + 1}:00", "", "| Aika | Kesto | Tapahtuma | Mitä äänessä tapahtuu | Perhevihje |", "|---|---|---|---|---|"]
        L.append(f"| {mm(e['alku'])} | {e['loppu'] - e['alku']:.0f} s | **{e['tyyppi']}** | {e['kuvaus']} | {e['perhe']} |")
    md = ROOT / "annotations" / f"tapahtumat_{a.levytys}.md"
    md.write_text("\n".join(L) + "\n", encoding="utf-8", newline="\n")
    print(f"{md.relative_to(ROOT)}: {len(E)} tapahtumaa; " + ", ".join(f"{k} {v}" for k, v in cnt.most_common()))


if __name__ == "__main__":
    main()
