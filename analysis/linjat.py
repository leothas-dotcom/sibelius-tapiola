r"""Linjat: mihin suuntaan musiikki liikkuu ja mitä pitkät äänet tekevät (nousu, lasku, tremolo, paisutus).

Miksi: käyttäjä 9.11.2026: "0:03:00 eteenpäin alkaa nousu, koko orkesteri nousee ylöspäin" ja "0:03:20
puupuhaltimet, mutta mitä viulut tekevät?" Näitä ei näy tasosta eikä soitinluokista. Tämä työkalu lukee
spektrin harjanteet (yksittäiset soivat sävelet) ja kertoo kerroksittain:

  - bassolinja: matalin vahva sävel ajan funktiona (nousee / laskee / pysyy / iskee)
  - kerrosten painopiste: matala (C1–H2), keski (C3–H4), korkea (C5–C7): energian keskisävel 1 s välein
  - ylälinja: korkein vahva sävel
  - pitkät äänet (>= --min-len s): alku, loppu, sävel ja mitä ääni tekee: tasainen / paisuu / hiipuu / paisuu ja
    hiipuu, sekä värinä: amplitudin vaihtelun taajuus (tremolo 8–20 Hz) ja syvyys
  - liike: kuinka monta uutta säveltä alkaa sekunnissa kussakin kerroksessa (viiva liikkuu nopeammin = enemmän liikettä)

    .venv\Scripts\python.exe -I analysis\linjat.py build\rattle_koko --from 176 --to 216 [--lo 28 --hi 96]
"""
import argparse
import json
import sys
from pathlib import Path

import librosa
import numpy as np
import scipy.ndimage as ndi
import scipy.signal as sg
import soundfile as sf

NOTE = ["C", "Cis", "D", "Dis", "E", "F", "Fis", "G", "Gis", "A", "Ais", "H"]
BPO, FMIN = 60, 24
LAYERS = [("matala", 24, 47), ("keski", 48, 71), ("korkea", 72, 96)]


def name(m):
    m = int(round(m))
    return f"{NOTE[m % 12]}{m // 12 - 1}"


def mm(t):
    return f"{int(t) // 60}:{t % 60:04.1f}"


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("dir", type=Path)
    ap.add_argument("--from", dest="a", type=float, required=True)
    ap.add_argument("--to", dest="b", type=float, required=True)
    ap.add_argument("--lo", type=int, default=28)
    ap.add_argument("--hi", type=int, default=96)
    ap.add_argument("--min-len", type=float, default=1.5)
    ap.add_argument("--thr", type=float, default=-32.0, help="harjanteen kynnys dB suhteessa välin huippuun")
    a = ap.parse_args()
    d = a.dir
    t0 = float(json.loads((d / "prepare.json").read_text(encoding="utf-8")).get("start", 0.0))
    sr = sf.info(d / "clean_mono.wav").samplerate
    y, _ = sf.read(d / "clean_mono.wav", start=int((a.a - t0) * sr), stop=int((a.b - t0) * sr))
    hop = 256
    nb = 7 * BPO
    C = np.abs(librosa.cqt(y.astype(np.float32), sr=sr, hop_length=hop, fmin=librosa.midi_to_hz(FMIN), n_bins=nb, bins_per_octave=BPO))
    fs = sr / hop
    t = a.a + np.arange(C.shape[1]) / fs
    midi = FMIN + np.arange(nb) * 12.0 / BPO
    ref = C.max()
    dB = 20 * np.log10(C / ref + 1e-6)

    # sävelittäin (puolisävelaskel) vahvin kaista
    semis = np.arange(a.lo, a.hi + 1)
    E = np.stack([C[(midi >= m - 0.35) & (midi <= m + 0.35)].max(axis=0) for m in semis])
    EdB = 20 * np.log10(E / ref + 1e-6)
    # harjanne: paikallinen huippu taajuudessa ja yli kynnyksen
    up = np.vstack([EdB[1:], np.full((1, EdB.shape[1]), -99)])
    dn = np.vstack([np.full((1, EdB.shape[1]), -99), EdB[:-1]])
    R = (EdB > a.thr) & (EdB >= up - 0.5) & (EdB >= dn - 0.5)

    # 1 s taulukko
    print(f"## Kerrokset 1 s välein ({mm(a.a)}–{mm(a.b)}): bassolinja | painopiste matala / keski / korkea | ylälinja | uusia säveliä/s m/k/k | taso dB")
    rows = []
    onsets = R & ~np.roll(R, 1, axis=1)
    for s0 in np.arange(a.a, a.b - 0.5, 1.0):
        sel = (t >= s0) & (t < s0 + 1)
        if not sel.any():
            continue
        act = R[:, sel].mean(axis=1) > 0.5
        strong = np.flatnonzero(act)
        bass = int(semis[strong[0]]) if len(strong) else None
        top = int(semis[strong[-1]]) if len(strong) else None
        cents, ons = [], []
        for _, lo, hi in LAYERS:
            k = (semis >= lo) & (semis <= hi)
            w = (E[k][:, sel] ** 2).sum(axis=1)
            cents.append(float((semis[k] * w).sum() / (w.sum() + 1e-12)) if w.sum() > (ref ** 2) * 1e-5 * sel.sum() else None)
            ons.append(int(onsets[k][:, sel].sum()))
        lv = float(dB[:, sel].max(axis=0).mean())
        rows.append((s0, bass, cents, top, ons, lv))
        f = lambda c: f"{c:5.1f}" if c is not None else "    –"
        print(f"  {mm(s0)}  {name(bass) if bass else '–':<5} | {f(cents[0])} {f(cents[1])} {f(cents[2])} | {name(top) if top else '–':<5} | {ons[0]:2d} {ons[1]:2d} {ons[2]:2d} | {lv:5.1f}")

    # suunta: bassolinjan ja painopisteiden kulmakerroin 8 s ikkunassa
    print("\n## Suunta (kulmakerroin puolisävelaskelta / 10 s, 8 s ikkuna, askel 4 s): basso | keski | korkea | ylälinja")
    tt = np.array([r[0] for r in rows])
    def series(i):
        if i == "bass":
            return np.array([r[1] if r[1] is not None else np.nan for r in rows], float)
        if i == "top":
            return np.array([r[3] if r[3] is not None else np.nan for r in rows], float)
        return np.array([r[2][i] if r[2][i] is not None else np.nan for r in rows], float)
    S = {"basso": series("bass"), "keski": series(1), "korkea": series(2), "ylälinja": series("top")}
    for s0 in np.arange(a.a, a.b - 8, 4.0):
        sel = (tt >= s0) & (tt < s0 + 8)
        out = []
        for k, v in S.items():
            x, yv = tt[sel], v[sel]
            ok = ~np.isnan(yv)
            out.append(f"{np.polyfit(x[ok], yv[ok], 1)[0] * 10:+5.1f}" if ok.sum() >= 4 else "    –")
        print(f"  {mm(s0)}–{mm(s0 + 8)}  " + " | ".join(out))

    # pitkät äänet ja niiden käytös
    print(f"\n## Pitkät äänet (>= {a.min_len} s): alku–loppu, sävel, taso, muoto, värinä")
    longs = []
    for k, m in enumerate(semis):
        r = ndi.binary_closing(R[k], structure=np.ones(int(0.12 * fs)))
        i = 0
        while i < len(r):
            if r[i]:
                j = i
                while j < len(r) and r[j]:
                    j += 1
                if (j - i) / fs >= a.min_len:
                    env = E[k, i:j]
                    edb = 20 * np.log10(env / ref + 1e-6)
                    n3 = max(1, len(edb) // 3)
                    a1, a2, a3 = edb[:n3].mean(), edb[n3:2 * n3].mean(), edb[2 * n3:].mean()
                    if a2 - a1 > 3 and a2 - a3 > 3:
                        shape = "paisuu ja hiipuu < >"
                    elif a3 - a1 > 4:
                        shape = "paisuu <"
                    elif a1 - a3 > 4:
                        shape = "hiipuu >"
                    else:
                        shape = "tasainen"
                    # värinä: verhokäyrän vaihtelu 4–25 Hz
                    x = env / (ndi.uniform_filter1d(env, int(0.5 * fs)) + 1e-9) - 1.0
                    f_, P_ = sg.periodogram(x * np.hanning(len(x)), fs=fs)
                    band = (f_ >= 4) & (f_ <= 25)
                    depth = float(np.sqrt(np.mean(x ** 2)))
                    if band.any() and P_[band].sum() > 0:
                        fpk = float(f_[band][np.argmax(P_[band])])
                        ratio = float(P_[band].sum() / (P_[(f_ > 0.5)].sum() + 1e-12))
                    else:
                        fpk, ratio = 0.0, 0.0
                    if depth > 0.18 and ratio > 0.5 and 8 <= fpk <= 22:
                        vib = f"tremolo noin {fpk:.0f} Hz (syvyys {depth:.2f})"
                    elif depth > 0.18 and ratio > 0.5:
                        vib = f"värisee noin {fpk:.0f} Hz (syvyys {depth:.2f})"
                    else:
                        vib = f"sileä (syvyys {depth:.2f})"
                    longs.append(dict(alku=round(float(t[i]), 2), loppu=round(float(t[j - 1]), 2), savel=name(m), midi=int(m),
                                      db=round(float(edb.max()), 1), muoto=shape, varina=vib))
                i = j
            else:
                i += 1
    longs.sort(key=lambda r: (r["alku"], r["midi"]))
    for r in longs:
        print(f"  {mm(r['alku'])}–{mm(r['loppu'])}  {r['savel']:<5} {r['db']:5.1f} dB  {r['muoto']:<20} {r['varina']}")

    out = {"vali": [a.a, a.b], "rivit": [dict(t=float(r[0]), basso=name(r[1]) if r[1] else None, painopiste=r[2], ylalinja=name(r[3]) if r[3] else None,
                                             uusia=r[4], taso_db=round(r[5], 1)) for r in rows], "pitkat": longs}
    (d / f"linjat_{int(a.a):04d}-{int(a.b):04d}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(2, 1, figsize=(17, 10), sharex=True, gridspec_kw={"height_ratios": [4, 1]})
    s1 = (midi >= a.lo) & (midi <= a.hi)
    ax[0].imshow(np.clip(dB[s1], -50, 0), origin="lower", aspect="auto", extent=[t[0], t[-1], a.lo, a.hi], cmap="magma")
    for m_ in range(a.lo, a.hi + 1):
        if m_ % 12 in (11, 2, 6):
            ax[0].text(t[0], m_, name(m_), color="w", fontsize=6, va="center")
            ax[0].axhline(m_, color="w", lw=0.2, alpha=0.3)
    for r in longs:
        col = "cyan" if "tremolo" not in r["varina"] else "lime"
        ax[0].plot([r["alku"], r["loppu"]], [r["midi"], r["midi"]], color=col, lw=1.0, alpha=0.9)
    bx = [(r[0] + 0.5, r[1]) for r in rows if r[1]]
    if bx:
        ax[0].plot([x for x, _ in bx], [m_ for _, m_ in bx], "w.", ms=5)
    ax[0].set_ylabel("sävel (midi)")
    ax[0].set_title(f"Linjat {mm(a.a)}–{mm(a.b)} · {d.name} · syaani = pitkä sileä ääni, vihreä = tremolo, valkoinen piste = bassolinja")
    for i_, (ln, _, _) in enumerate(LAYERS):
        ax[1].plot(tt + 0.5, S[["basso", "keski", "korkea"][i_]] if i_ else series(0), lw=1.2, label=f"painopiste {ln}")
    ax[1].legend(fontsize=7, ncol=3)
    ax[1].set_ylabel("painopiste (midi)")
    ax[1].set_xlabel("aika (s)")
    plt.tight_layout()
    png = d / f"linjat_{int(a.a):04d}-{int(a.b):04d}.png"
    plt.savefig(png, dpi=105)
    print("\nkuva:", png)


if __name__ == "__main__":
    main()
