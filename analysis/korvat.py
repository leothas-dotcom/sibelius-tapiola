r"""Korvat: yksi työkalu, joka kuuntelee koko teoksen ja kertoo, mitä äänessä tapahtuu.

Korvaa 9.11.2026 tehdyt erilliset skriptit (kaaret, kerroskartta, tarkka, minuutit, linjat, tapahtumat, sointi).
Lukee paketin puhdistetun monon, laskee spektrin kerran (CQT, 60 kaistaa oktaavissa, noin 12 ms) ja tuottaa:

  <paketti>/korvat.json   sekunnit (bassolinja, kerrosten painopiste, ylälinja, uusia säveliä/s kerroksittain),
                          pitkät äänet (muoto, värinä, soinnin vihje), nuotit ja TAPAHTUMAT: nousu, lasku,
                          kerros katoaa / tulee, urkupiste, basso liikkuu / vaikenee, liike, purske, vuorottelu,
                          artikulaatio (staccato / legato), tremolo, paisuva ja hengittävä sointu, isku,
                          äkillinen muutos, hiljaisuus
  <paketti>/ohjaus.f32    kuvaa ohjaavat kanavat 30 fps (+ ohjaus.json): taso, rekisterikerrosten osuus, bassolinja,
                          painopisteet, ylälinja, liike kerroksittain, perheet, tremolo, suunta

Kuvaa ohjaavat vain annotations/cues.json (make_cues.py kokoaa: ankkurit + ajat + tapahtumat + iskut) ja ohjaus.f32.

    .venv\Scripts\python.exe -I analysis\korvat.py build\rattle_koko --levytys rattle2022 [--plot 176 236]
"""
import argparse
import json
import re
import sys
from collections import Counter
from pathlib import Path

import librosa
import numpy as np
import scipy.ndimage as ndi
import scipy.signal as sg
import soundfile as sf

NOTE = ["C", "Cis", "D", "Dis", "E", "F", "Fis", "G", "Gis", "A", "Ais", "H"]  # H = englannin B
BPO, FMIN, HOP = 60, 24, 256
LO, HI = 24, 107           # tutkittavat sävelet (midi)
LAYERS = [("matala", 24, 47), ("keski", 48, 71), ("korkea", 72, 107)]
THR = -34.0                # harjanteen kynnys dB suhteessa teoksen huippuun
FPS = 30


def name(m):
    m = int(round(m))
    return f"{NOTE[m % 12]}{m // 12 - 1}"


def mm(t):
    return f"{int(t) // 60}:{t % 60:04.1f}"


def runs(mask, min_len=1):
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


def spectrum(d):
    """Puolisävelaskelittain vahvin kaista koko teokselle (85 x n), minuutti kerrallaan."""
    t0 = float(json.loads((d / "prepare.json").read_text(encoding="utf-8")).get("start", 0.0))
    info = sf.info(d / "clean_mono.wav")
    sr, total = info.samplerate, info.frames
    midi = FMIN + np.arange(7 * BPO) * 12.0 / BPO
    sel = [np.flatnonzero((midi >= m - 0.35) & (midi <= m + 0.35)) for m in range(LO, HI + 1)]
    parts = []
    chunk = 60 * sr
    for s0 in range(0, total, chunk):
        y, _ = sf.read(d / "clean_mono.wav", start=max(0, s0 - sr), stop=min(total, s0 + chunk + sr))
        if y.ndim > 1:
            y = y.mean(axis=1)
        C = np.abs(librosa.cqt(y.astype(np.float32), sr=sr, hop_length=HOP, fmin=librosa.midi_to_hz(FMIN), n_bins=7 * BPO, bins_per_octave=BPO))
        lead = (min(s0, sr)) // HOP
        n = int(np.ceil(min(chunk, total - s0) / HOP))
        C = C[:, lead:lead + n]
        parts.append(np.stack([C[ix].max(axis=0) for ix in sel]).astype(np.float32))
    E = np.concatenate(parts, axis=1)
    return E, sr / HOP, t0


def analyse(d, levytys):
    E, fs, t0 = spectrum(d)
    semis = np.arange(LO, HI + 1)
    ref = float(np.percentile(E.max(axis=0), 99.9))
    EdB = 20 * np.log10(E / ref + 1e-6)
    nF = E.shape[1]
    tf = t0 + np.arange(nF) / fs
    up = np.vstack([EdB[1:], np.full((1, nF), -99.0)])
    dn = np.vstack([np.full((1, nF), -99.0), EdB[:-1]])
    R = (EdB > THR) & (EdB >= up - 0.5) & (EdB >= dn - 0.5)
    N = int(nF / fs)

    km = json.loads((d / "kanavat.json").read_text(encoding="utf-8"))
    K = np.fromfile(d / "kanavat.f32", dtype=np.float32).reshape(km["frames"], len(km["channels"]))
    kc = km["channels"]
    taso30 = K[:, kc.index("taso_dbfs")]
    fam30 = {f: K[:, kc.index(f)] for f in ("jouset", "puupuhaltimet", "vasket") if f in kc}
    N = min(N, len(taso30) // FPS)
    taso = np.array([taso30[i * FPS:(i + 1) * FPS].mean() for i in range(N)])

    # --- sekunnit
    onsets = R & ~np.roll(R, 1, axis=1)
    bass = np.full(N, np.nan)
    top = np.full(N, np.nan)
    cen = np.full((3, N), np.nan)
    ons = np.zeros((3, N))
    share = np.zeros((3, N))
    P = E.astype(np.float64) ** 2
    for s in range(N):
        a, b = int(s * fs), int((s + 1) * fs)
        act = np.flatnonzero(R[:, a:b].mean(axis=1) > 0.5)
        if len(act):
            if semis[act[0]] < 48:
                bass[s] = semis[act[0]]
            top[s] = semis[act[-1]]
        tot = P[:, a:b].sum() + 1e-18
        for k, (_, lo, hi) in enumerate(LAYERS):
            sel = (semis >= lo) & (semis <= hi)
            w = P[sel, a:b].sum(axis=1)
            share[k, s] = w.sum() / tot
            if w.sum() > (ref ** 2) * 1e-5 * (b - a):
                cen[k, s] = float((semis[sel] * w).sum() / w.sum())
            ons[k, s] = onsets[sel, a:b].sum()
    band = taso[None, :] + 10 * np.log10(share + 1e-6)

    # --- nuotit ja pitkät äänet
    notes, longs = [], []
    close = np.ones(max(1, int(0.12 * fs)))
    for k, m in enumerate(semis):
        if m < 28:
            continue
        r = ndi.binary_closing(R[k], structure=close)
        for i, j in runs(r, int(0.15 * fs)):
            du = (j - i) / fs
            notes.append((round(float(tf[i]), 2), round(du, 2), int(m)))
            if du < 1.5:
                continue
            env = E[k, i:j]
            edb = EdB[k, i:j]
            n3 = max(1, len(edb) // 3)
            a1, a2, a3 = edb[:n3].mean(), edb[n3:2 * n3].mean(), edb[2 * n3:].mean()
            muoto = "paisuu ja hiipuu" if (a2 - a1 > 3 and a2 - a3 > 3) else ("paisuu" if a3 - a1 > 4 else ("hiipuu" if a1 - a3 > 4 else "tasainen"))
            x = env / (ndi.uniform_filter1d(env, int(0.5 * fs)) + 1e-9) - 1.0
            f_, P_ = sg.periodogram(x * np.hanning(len(x)), fs=fs)
            bnd = (f_ >= 4) & (f_ <= 25)
            depth = float(np.sqrt(np.mean(x ** 2)))
            fpk = float(f_[bnd][np.argmax(P_[bnd])]) if bnd.any() and P_[bnd].sum() > 0 else 0.0
            ratio = float(P_[bnd].sum() / (P_[f_ > 0.5].sum() + 1e-12)) if bnd.any() else 0.0
            tremolo = depth > 0.18 and ratio > 0.5 and 8 <= fpk <= 22
            # soinnin vihje osaäänistä 2..5 (puolisävelaskelina +12, +19, +24, +28)
            rel = []
            for off in (12, 19, 24, 28):
                rel.append(float(20 * np.log10(E[k + off, i:j].mean() / (env.mean() + 1e-12) + 1e-9)) if k + off < len(semis) else np.nan)
            rich = float(np.nanmean(rel)) if not all(np.isnan(rel)) else np.nan
            oe = float(np.nanmean([rel[1], rel[3]]) - np.nanmean([rel[0], rel[2]])) if not np.isnan(rel[1]) else np.nan
            if np.isnan(rich):
                sointi = ""
            elif rich < -30:
                sointi = "puhdas (huilu tai käyrätorvi)"
            elif not np.isnan(oe) and oe >= 6:
                sointi = "parittomat osaäänet (klarinetti)"
            elif rel[0] >= 2:
                sointi = "oktaavikaksinnus tai oboe"
            elif rich >= -22:
                sointi = "runsas (jouset tai oboe)"
            else:
                sointi = "pehmeä"
            longs.append(dict(alku=round(float(tf[i]), 2), loppu=round(float(tf[j - 1]), 2), savel=name(m), midi=int(m), muoto=muoto,
                              tremolo=bool(tremolo), varina_hz=round(fpk, 1), sointi=sointi))
    notes.sort()
    longs.sort(key=lambda r: (r["alku"], r["midi"]))

    # --- tapahtumat
    Ev = []

    def ev(a, b, typ, kuvaus, voima=0.0):
        Ev.append(dict(alku=round(float(a), 1), loppu=round(float(b), 1), tyyppi=typ, kuvaus=kuvaus, voima=round(float(voima), 1)))

    def fill(v):
        x = v.copy()
        ok = ~np.isnan(x)
        if ok.sum() >= 2:
            x[~ok] = np.interp(np.flatnonzero(~ok), np.flatnonzero(ok), x[ok])
        return x

    def slope(v, w=8):
        x = ndi.median_filter(fill(v), 3)
        out = np.zeros(len(x))
        tt = np.arange(w)
        for i in range(len(x) - w):
            out[i + w // 2] = np.polyfit(tt, x[i:i + w], 1)[0] * 10
        return out
    s_mid, s_hi, s_top, s_bass = slope(cen[1]), slope(cen[2]), slope(top), slope(bass)
    suunta = np.zeros(N)
    for sign, typ in ((1, "nousu"), (-1, "lasku")):
        votes = (sign * s_mid >= 5).astype(int) + (sign * s_hi >= 3) + (sign * s_top >= 6) + (sign * s_bass >= 2)
        mask = ndi.binary_closing((votes >= 2) & (taso > -55), structure=np.ones(3))
        for i, j in runs(mask, 5):
            who = [w for w, c in (("basso", np.mean(sign * s_bass[i:j]) >= 1.5), ("keskikerros", np.mean(sign * s_mid[i:j]) >= 4),
                                  ("yläkerros", np.mean(sign * s_hi[i:j]) >= 2.5 or np.mean(sign * s_top[i:j]) >= 5)) if c]
            tl = fill(top)
            span = abs(float(np.nanmean(tl[max(i, j - 2):j]) - np.nanmean(tl[i:i + 2])))
            label = "koko orkesteri" if len(who) >= 3 else " ja ".join(who) if who else "kerrokset"
            ev(i, j, typ, f"{label} {'nousee' if sign > 0 else 'laskee'} {j - i} s (ylälinja {span:.0f} puolisävelaskelta)", span)
            suunta[i:j] = sign
    for k, lab in enumerate(("pohja (matala rekisteri)", "keskirekisteri", "ylärekisteri")):
        x = band[k]
        before = np.array([x[max(0, i - 4):i].mean() if i else x[0] for i in range(N)])
        after = np.array([x[i:i + 4].mean() for i in range(N)])
        last = -99
        for i in range(4, N - 4):
            if before[i] - after[i] >= 14 and after[i] < -52 and before[i] > -50 and taso[i:i + 4].mean() > -58 and i - last > 6:
                j = i
                while j < N and x[j] < -50:
                    j += 1
                if j - i >= 3:
                    ev(i, j, "kerros katoaa", f"{lab} katoaa {j - i} s; muu soi edelleen", before[i] - after[i])
                last = i
        last = -99
        for i in range(4, N - 4):
            if after[i] - before[i] >= 14 and before[i] < -52 and after[i] > -48 and i - last > 6:
                ev(i, i + 1, "kerros tulee", f"{lab} tulee", after[i] - before[i])
                last = i
    i = 0
    while i < N:
        if not np.isnan(bass[i]):
            j = i
            while j < N and (bass[j] == bass[i] or (np.isnan(bass[j]) and j + 1 < N and bass[j + 1] == bass[i])):
                j += 1
            if j - i >= 8:
                nxt = bass[j] if j < N else np.nan
                ev(i, j, "urkupiste", f"basso pysyy sävelellä {name(bass[i])} {j - i} s", j - i)
                if not np.isnan(nxt):
                    ev(j, j + 1, "basso liikkuu", f"basso lähtee liikkeelle {j - i} s paikallaan olon jälkeen: {name(bass[i])} → {name(nxt)}", j - i)
                else:
                    ev(j, j + 1, "basso vaikenee", f"basso vaikenee {j - i} s urkupisteen jälkeen ({name(bass[i])})", j - i)
            i = max(j, i + 1)
        else:
            i += 1
    tot = ons.sum(axis=0)
    hi = ndi.uniform_filter1d(ons[2], 2)
    bm = (hi >= 22) & (hi >= 2.2 * (ndi.median_filter(hi, 21) + 3))
    bursts = runs(bm)
    bt = [i for i, _ in bursts]
    for i, j in bursts:
        ev(i, j, "purske", f"ylärekisterin nopea purske ({hi[i:j].max():.0f} uutta säveltä/s)", hi[i:j].max())
    k = 0
    while k + 3 < len(bt):
        g = np.diff(bt[k:k + 4])
        if g.min() >= 3 and g.max() <= 12 and g.max() - g.min() <= 3:
            j = k + 3
            while j + 1 < len(bt) and 3 <= bt[j + 1] - bt[j] <= 12 and abs((bt[j + 1] - bt[j]) - np.median(g)) <= 3:
                j += 1
            ev(bt[k], bt[j] + 2, "vuorottelu", f"purskeet toistuvat noin {np.median(np.diff(bt[k:j + 1])):.0f} s välein, {j - k + 1} kertaa: kaksi ryhmää vuorottelee", j - k + 1)
            k = j + 1
        else:
            k += 1
    prev = None
    for s0 in range(0, N - 10, 10):
        v = tot[s0:s0 + 10].mean()
        cls = "hiljaisuus" if taso[s0:s0 + 10].mean() < -58 else ("hidas" if v < 12 else ("kohtalainen" if v < 30 else "nopea"))
        if cls != prev and cls != "hiljaisuus":
            ev(s0, s0 + 10, "liike", f"liike muuttuu: {prev or 'alku'} → {cls} ({v:.0f} uutta säveltä/s)", v)
        prev = cls
    art_prev = {}
    nt = np.array(notes) if notes else np.zeros((0, 3))
    for s0 in range(0, N - 5, 5):
        w = nt[(nt[:, 0] >= s0) & (nt[:, 0] < s0 + 5)]
        for lab, lo, hi_ in (("keskikerros", 48, 71), ("yläkerros", 72, 108)):
            ds = w[(w[:, 2] >= lo) & (w[:, 2] <= hi_), 1]
            art = None
            if len(ds) >= 8:
                short = float(np.mean(ds < 0.3))
                art = "staccato (lyhyet, irralliset)" if short >= 0.62 else ("legato (pitkät, sidotut)" if short <= 0.3 and ds.mean() >= 0.7 else None)
            if art and art != art_prev.get(lab):
                ev(s0, s0 + 5, "artikulaatio", f"{lab}: {art}", len(ds))
            if art:
                art_prev[lab] = art
            elif len(ds) < 4:
                art_prev[lab] = None
    tm = np.zeros(N, int)
    sw = np.zeros(N, int)
    for r in longs:
        if r["tremolo"]:
            tm[int(r["alku"]):min(N, int(r["loppu"]) + 1)] += 1
        if r["muoto"] == "paisuu ja hiipuu" and int(r["alku"]) < N:
            sw[int(r["alku"])] += 1
    for i, j in runs(ndi.binary_closing(tm >= 2, structure=np.ones(3)), 3):
        ms = [r["midi"] for r in longs if r["tremolo"] and r["alku"] < j and r["loppu"] > i]
        ev(i, j, "tremolo", f"pitkät äänet värisevät (tremolo), {len(ms)} ääntä välillä {name(min(ms))}–{name(max(ms))}", len(ms))
    st, last = [], -9
    for s in np.flatnonzero(ndi.uniform_filter1d(sw.astype(float), 2) * 2 >= 3):
        if s - last > 1:
            st.append(int(s))
        last = s
    k = 0
    while k < len(st):
        j = k
        while j + 1 < len(st) and st[j + 1] - st[j] <= 5:
            j += 1
        if j - k >= 3:
            ev(st[k], st[j] + 2, "hengittävä sointu", f"soinnut paisuvat ja hiipuvat vuorotellen, {j - k + 1} kertaa, noin {np.median(np.diff(st[k:j + 1])):.1f} s välein", j - k + 1)
        elif j == k:
            ev(st[k], st[k] + 2, "paisuva sointu", "sointu paisuu ja hiipuu", sw[st[k]])
        k = j + 1
    ap_ = d / "aksentit.json"
    if ap_.exists():
        aj = json.loads(ap_.read_text(encoding="utf-8"))
        for it in aj.get("aksentit", aj.get("iskut", aj if isinstance(aj, list) else [])):
            t_ = it.get("t", it.get("aika", it.get("alku")))
            z = float(it.get("z", 0))
            if t_ is not None and z >= 8:
                ev(float(t_), float(t_) + 0.1, "isku", f"isku ({it.get('tyyppi', 'aksentti')})", z)
    dl = np.diff(taso, prepend=taso[0])
    for i in range(1, N):
        if dl[i] >= 10 and taso[i] > -50:
            ev(i, i + 1, "äkillinen voimistuminen", "taso nousee äkkiä", dl[i])
        if dl[i] <= -10 and taso[i - 1] > -45:
            ev(i, i + 1, "äkillinen hiljeneminen", "taso putoaa äkkiä", -dl[i])
    for i, j in runs((taso < -58) & (np.arange(N) > 7) & (np.arange(N) < N - 22), 2):
        ev(i, j, "hiljaisuus", f"lähes hiljaista {j - i} s", j - i)
    for e in Ev:
        i0 = int((e["alku"] + 2.5) * FPS)
        i1 = max(i0 + FPS, int((min(e["loppu"], e["alku"] + 8) + 2.5) * FPS))
        v = {f: float(x[i0:i1].mean()) for f, x in fam30.items() if i0 < len(x)}
        e["perhe"] = max(v, key=v.get) if v and max(v.values()) >= 0.35 else ""
    Ev.sort(key=lambda e: (e["alku"], e["tyyppi"]))

    rows = [dict(t=s, basso=None if np.isnan(bass[s]) else name(bass[s]), painopiste=[None if np.isnan(c) else round(float(c), 1) for c in cen[:, s]],
                 ylalinja=None if np.isnan(top[s]) else name(top[s]), uusia=[int(x) for x in ons[:, s]], taso_dbfs=round(float(taso[s]), 1)) for s in range(N)]
    out = dict(levytys=levytys, tehty="analysis/korvat.py", sekunnit=rows, pitkat=longs, nuotit=notes, tapahtumat=Ev)
    (d / "korvat.json").write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")

    # --- ohjauskanavat 30 fps
    nfr = N * FPS
    rep = lambda v: np.repeat(np.nan_to_num(v, nan=0.0), FPS)[:nfr]
    chans = {"taso_dbfs": taso30[:nfr], "osuus_matala": rep(share[0]), "osuus_keski": rep(share[1]), "osuus_korkea": rep(share[2]),
             "bassolinja_midi": rep(bass), "painopiste_matala": rep(fill(cen[0])), "painopiste_keski": rep(fill(cen[1])), "painopiste_korkea": rep(fill(cen[2])),
             "ylalinja_midi": rep(fill(top)), "uusia_matala": rep(ons[0]), "uusia_keski": rep(ons[1]), "uusia_korkea": rep(ons[2]),
             "tremolo": rep((tm >= 2).astype(float)), "suunta": rep(suunta)}
    for f, x in fam30.items():
        chans[f] = x[:nfr]
    X = np.stack([np.asarray(v, dtype=np.float32) for v in chans.values()], axis=1)
    X.tofile(d / "ohjaus.f32")
    (d / "ohjaus.json").write_text(json.dumps({"fps": FPS, "frames": int(nfr), "channels": list(chans), "start": t0}, ensure_ascii=False, indent=1), encoding="utf-8")
    cnt = Counter(e["tyyppi"] for e in Ev)
    print(f"{d}: korvat.json ({N} s, {len(longs)} pitkää ääntä, {len(notes)} nuottia, {len(Ev)} tapahtumaa) ja ohjaus.f32 ({len(chans)} kanavaa x {nfr} ruutua)")
    print("tapahtumat: " + ", ".join(f"{k} {v}" for k, v in cnt.most_common()))
    return EdB, tf, fs, semis, longs, bass


def plot(d, EdB, tf, semis, longs, bass, A, B):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    sel = (tf >= A) & (tf < B)
    fig, ax = plt.subplots(figsize=(17, 8))
    ax.imshow(np.clip(EdB[:, sel], -50, 0), origin="lower", aspect="auto", extent=[A, B, LO, HI + 1], cmap="magma")
    for r in longs:
        if A <= r["alku"] < B:
            ax.plot([r["alku"], r["loppu"]], [r["midi"] + 0.5] * 2, color="lime" if r["tremolo"] else "cyan", lw=1)
    xs = [(s + 0.5, bass[s] + 0.5) for s in range(int(A), min(int(B), len(bass))) if not np.isnan(bass[s])]
    if xs:
        ax.plot([x for x, _ in xs], [y for _, y in xs], "w.", ms=5)
    for m_ in range(LO, HI + 1):
        if m_ % 12 in (11, 2, 6):
            ax.text(A, m_ + 0.5, name(m_), color="w", fontsize=6, va="center")
    ax.set_xlabel("aika (s)")
    ax.set_ylabel("sävel (midi)")
    ax.set_title(f"Korvat {mm(A)}–{mm(B)} · {d.name} · syaani = pitkä ääni, vihreä = tremolo, valkoinen piste = bassolinja")
    plt.tight_layout()
    png = d / f"korvat_{int(A):04d}-{int(B):04d}.png"
    plt.savefig(png, dpi=105)
    print("kuva:", png)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="korvat: yksi kuuntelutyökalu")
    ap.add_argument("dir", type=Path)
    ap.add_argument("--levytys", required=True)
    ap.add_argument("--plot", type=float, nargs=2, metavar=("A", "B"))
    a = ap.parse_args()
    EdB, tf, fs, semis, longs, bass = analyse(a.dir, a.levytys)
    if a.plot:
        plot(a.dir, EdB, tf, semis, longs, bass, *a.plot)


if __name__ == "__main__":
    main()
