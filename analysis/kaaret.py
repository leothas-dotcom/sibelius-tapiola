r"""Sävelkaaret ja rekisterikerrokset spektristä (CPU, ei uusia riippuvuuksia).

Miksi: kuunteluopas tarvitsee lisää detaljia siitä, mitä soi millä hetkellä (käyttäjä 9.11.2026), erityisesti
"pienet nousevat ja laskevat kuviot", joilla puhaltimet tulevat esiin. CREPE antaa vain yhden hallitsevan sävelen,
ja PANNs on 2,5 s jäljessä. Tämä työkalu lukee paketin puhdistetun monon ja laskee:

  1. rekisterikerrokset 30 fps: matala (C1–H2), keski (C3–H4), korkea (C5–H5), kirkas (C6–C8): kunkin kaistan
     energia suhteessa kokonaisuuteen ja kaistan oma alkutiheys. Tämä on "mikä kerros puhuu" ilman soitinluokitinta.
  2. ylälinja: korkean ja kirkkaan kaistan vahvin harmoninen huippu ruuduittain (CQT + harmoninen summa),
     mediaanisuodatettuna; vain kun huippu on selvä.
  3. kaaret: ylälinjan nousu ja lasku (vähintään --min-span puolisävelaskelta ylös ja takaisin 0,4–5 s sisällä),
     tai pelkkä nousu / lasku. Jokaisesta: alku, huippu, loppu, alin ja ylin sävel, tyyppi.

Tulosteet pakettiin: kaaret.json (kaaret + asetukset), kaaret.f32/kaaret_kanavat.json (rekisterikerrokset 30 fps),
ja valinnainen kuva --plot A B. Ajat ovat kuuntelukopion aikaa (paketin alku + ruutu/30).

    .venv\Scripts\python.exe -I analysis\kaaret.py build\rattle_koko --plot 0 60
"""
import argparse
import json
import sys
from pathlib import Path

import librosa
import numpy as np
import scipy.ndimage as ndi
import soundfile as sf

FPS = 30
BANDS = [("matala", 24, 47), ("keski", 48, 71), ("korkea", 72, 83), ("kirkas", 84, 108)]  # midi-rajat
NOTE = ["C", "Cis", "D", "Es", "E", "F", "Fis", "G", "As", "A", "B", "H"]  # suomalaiset nimet: H = engl. B


def name(m):
    m = int(round(m))
    return f"{NOTE[m % 12]}{m // 12 - 1}"


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="sävelkaaret ja rekisterikerrokset")
    ap.add_argument("dir", type=Path)
    ap.add_argument("--min-span", type=float, default=3.0, help="kaaren vähimmäislaajuus puolisävelaskelina")
    ap.add_argument("--plot", type=float, nargs=2, metavar=("A", "B"), help="piirrä väli sekunteina (paketin aikaa)")
    a = ap.parse_args()
    d = a.dir
    prep = json.loads((d / "prepare.json").read_text(encoding="utf-8"))
    t0 = float(prep.get("start", 0.0))
    y, sr = sf.read(d / "clean_mono.wav")
    if y.ndim > 1:
        y = y.mean(axis=1)
    hop = int(round(sr / FPS))
    # CQT C1..C8, 36 kaistaa oktaavissa
    bpo, fmin = 36, librosa.midi_to_hz(24)
    n_bins = 7 * bpo
    # hop on oltava 2^k:n monikerta CQT:lle; lasketaan omalla hopilla ja interpoloidaan 30 fps:ään
    chop = 256 if sr <= 22050 else 512
    C = np.abs(librosa.cqt(y.astype(np.float32), sr=sr, hop_length=chop, fmin=fmin, n_bins=n_bins, bins_per_octave=bpo))
    tc = np.arange(C.shape[1]) * chop / sr
    n = int(len(y) / sr * FPS)
    tf = np.arange(n) / FPS
    idx = np.clip(np.searchsorted(tc, tf), 0, C.shape[1] - 1)
    C = C[:, idx]
    midi = 24 + np.arange(n_bins) / 3.0
    P = C ** 2
    tot = P.sum(axis=0) + 1e-12
    names, chans = [], []
    for bname, lo, hi in BANDS:
        sel = (midi >= lo) & (midi < hi + 1)
        e = P[sel].sum(axis=0)
        names.append(f"osuus_{bname}")
        chans.append(e / tot)
        # alkutiheys kaistassa: positiivinen spektrivuo, huiput / s (2 s ikkuna)
        L = np.log1p(100 * C[sel])
        flux = np.maximum(0, np.diff(L, axis=1, prepend=L[:, :1])).sum(axis=0)
        flux = flux / (np.percentile(flux, 99) + 1e-9)
        pk = (flux > 0.25) & (flux >= ndi.maximum_filter1d(flux, 5))
        dens = ndi.uniform_filter1d(pk.astype(float), 2 * FPS) * FPS
        names.append(f"alut_{bname}")
        chans.append(dens)
    level = 10 * np.log10(tot / tot.max() + 1e-12)

    # ylälinja: harmoninen summa (perusääni + 2. ja 3. osaääni) välillä C5..C7
    lo_b, hi_b = int((72 - 24) * 3), int((96 - 24) * 3)
    S = np.zeros((hi_b - lo_b, n))
    for i, b in enumerate(range(lo_b, hi_b)):
        s = C[b].copy()
        for h, w in ((2, 0.5), (3, 0.33)):
            hb = b + int(round(bpo * np.log2(h)))
            if hb < n_bins:
                s += w * C[hb]
        S[i] = s
    S = ndi.gaussian_filter(S, (1.0, 1.0))
    top = S.argmax(axis=0)
    sal = S.max(axis=0)
    band_e = P[(midi >= 72) & (midi <= 96)].sum(axis=0)
    clear = (sal > np.percentile(sal, 55)) & (band_e / tot > 0.03) & (level > -45)
    line = 72 + top / 3.0
    line = ndi.median_filter(line, 7)
    line[~clear] = np.nan

    # kaaret: pätkät, joissa linja on yhtenäinen (aukot enintään 0,25 s)
    arcs = []
    valid = ~np.isnan(line)
    i = 0
    gap = int(0.25 * FPS)
    while i < n:
        if not valid[i]:
            i += 1
            continue
        j, last = i, i
        while j < n and (valid[j] or j - last <= gap):
            if valid[j]:
                last = j
            j += 1
        seg = line[i:last + 1]
        if last - i >= int(0.4 * FPS):
            x = np.where(np.isnan(seg), np.interp(np.arange(len(seg)), np.flatnonzero(~np.isnan(seg)), seg[~np.isnan(seg)]), seg)
            x = ndi.uniform_filter1d(x, 5)
            k = int(np.argmax(x))
            kmin = int(np.argmin(x))
            up, down = x[k] - x[:k + 1].min(), x[k] - x[k:].min()
            typ = None
            if up >= a.min_span and down >= a.min_span and 2 <= k <= len(x) - 3:
                typ = "kaari (nousee ja laskee)"
            elif x[-1] - x[0] >= a.min_span and kmin < k:
                typ = "nousu"
            elif x[0] - x[-1] >= a.min_span and k < kmin:
                typ = "lasku"
            dur = (last - i) / FPS
            if typ and dur <= 6.0:
                arcs.append({"alku": round(t0 + i / FPS, 2), "huippu": round(t0 + (i + k) / FPS, 2), "loppu": round(t0 + last / FPS, 2),
                             "kesto": round(dur, 2), "alin": name(x.min()), "ylin": name(x.max()),
                             "laajuus_psa": round(float(x.max() - x.min()), 1), "tyyppi": typ,
                             "taso_db": round(float(level[i:last + 1].mean()), 1)})
        i = last + 1

    X = np.stack(chans + [level, np.nan_to_num(line, nan=0.0)], axis=1).astype(np.float32)
    names += ["taso_suht_db", "ylalinja_midi"]
    X.tofile(d / "kaaret.f32")
    (d / "kaaret_kanavat.json").write_text(json.dumps({"fps": FPS, "frames": int(n), "channels": names, "start": t0}, ensure_ascii=False, indent=1), encoding="utf-8")
    (d / "kaaret.json").write_text(json.dumps({"asetukset": {"min_span": a.min_span, "rekisteri": "C5-C7", "fps": FPS}, "kaaret": arcs}, ensure_ascii=False, indent=1), encoding="utf-8")
    kinds = {}
    for r in arcs:
        kinds[r["tyyppi"]] = kinds.get(r["tyyppi"], 0) + 1
    print(f"{d}: {len(arcs)} kuviota {kinds}; kanavat {len(names)} x {n} ruutua -> kaaret.json, kaaret.f32")

    if a.plot:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt
        A, B = a.plot
        ia, ib = int((A - t0) * FPS), int((B - t0) * FPS)
        fig, ax = plt.subplots(3, 1, figsize=(16, 9), sharex=True, gridspec_kw={"height_ratios": [3, 1.3, 1]})
        ext = [A, B, 24, 24 + n_bins / 3]
        ax[0].imshow(np.log1p(60 * C[:, ia:ib] / C.max()), origin="lower", aspect="auto", extent=ext, cmap="gray_r")
        tt = t0 + np.arange(ia, ib) / FPS
        ax[0].plot(tt, line[ia:ib], color="tab:red", lw=1.2, label="ylälinja C5–C7")
        for r in arcs:
            if A <= r["alku"] <= B:
                ax[0].axvspan(r["alku"], r["loppu"], color="tab:orange", alpha=0.18)
        for m_, lab in ((36, "C2"), (48, "C3"), (60, "C4"), (72, "C5"), (84, "C6"), (96, "C7")):
            ax[0].axhline(m_, color="k", lw=0.3, alpha=0.4)
            ax[0].text(A, m_, lab, fontsize=7, va="bottom")
        ax[0].set_ylabel("sävelkorkeus (midi)")
        ax[0].legend(loc="upper right", fontsize=8)
        ax[0].set_title(f"Sävelkaaret ja rekisterikerrokset {A:.0f}–{B:.0f} s · {d.name} (oranssi = nouseva/laskeva kuvio)")
        for (bname, _, _), col in zip(BANDS, ("tab:brown", "tab:green", "tab:blue", "tab:purple")):
            ax[1].plot(tt, chans[names.index(f"osuus_{bname}")][ia:ib], color=col, lw=0.9, label=bname)
            ax[2].plot(tt, chans[names.index(f"alut_{bname}")][ia:ib], color=col, lw=0.9)
        ax[1].set_ylabel("kaistan osuus")
        ax[1].legend(loc="upper right", fontsize=7, ncol=4)
        ax[2].set_ylabel("alkuja/s kaistassa")
        ax[2].set_xlabel("aika (s, kuuntelukopio)")
        plt.tight_layout()
        out = d / f"kaaret_{int(A):04d}-{int(B):04d}.png"
        plt.savefig(out, dpi=110)
        print("kuva:", out)


if __name__ == "__main__":
    main()
