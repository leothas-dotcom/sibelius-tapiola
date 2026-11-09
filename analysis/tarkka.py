r"""Tarkka kuuntelu yhdestä kohdasta: pitkät äänet, niiden paisutukset, kuviot niiden ympärillä, yläsävelprofiili
ja matalan rekisterin alut. CPU, ei uusia riippuvuuksia.

Miksi: käyttäjä 9.11.2026: alussa puhaltimet soittavat lähes unisonossa gis-ääntä (h-mollin doorinen sävel), ne
"nousevat ja laskevat", ja basson huokaavat askeleet kuuluvat melkein koko alun yli. Nämä pitää kuulla datasta.

Menetelmä:
  - CQT 60 kaistaa oktaavissa (viidesosa puolisävelaskelta), askel noin 12 ms, puhdistetusta monosta.
  - Pitkä ääni: sävel, jonka kaista on vahvin ja pysyy; sen taso (dB) ajan funktiona = paisutukset < >.
  - Yläsävelprofiili: pitkän äänen osaäänet 1..6 (dB suhteessa perusääneen) sekunneittain. Kun samalle sävelelle
    tulee uusi soitin, profiili muuttuu (huilu: perusääni hallitsee; klarinetti: parittomat; oboe: paljon ylhäällä;
    käyrätorvi: pehmeä, 2. ja 3. vahvoja). Tämä on vihje, ei tunnistus.
  - Kuviot: muut sävelet välillä --lo..--hi, jotka nousevat esiin (harjanteet): alku, loppu, sävel, taso.
  - Matalat alut: kaistan C1–H2 spektrivuon huiput ja niiden sävel.

    .venv\Scripts\python.exe -I analysis\tarkka.py build\rattle_koko --from 6 --to 62
"""
import argparse
import json
import sys
from pathlib import Path

import librosa
import numpy as np
import scipy.ndimage as ndi
import soundfile as sf

NOTE = ["C", "Cis", "D", "Dis", "E", "F", "Fis", "G", "Gis", "A", "Ais", "H"]  # ylennyksin (h-molli); H = engl. B
BPO = 60
FMIN_MIDI = 24


def name(m):
    m = int(round(m))
    return f"{NOTE[m % 12]}{m // 12 - 1}"


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description="tarkka kuuntelu yhdestä kohdasta")
    ap.add_argument("dir", type=Path)
    ap.add_argument("--from", dest="a", type=float, required=True)
    ap.add_argument("--to", dest="b", type=float, required=True)
    ap.add_argument("--lo", type=int, default=57, help="kuvioiden alin sävel (midi)")
    ap.add_argument("--hi", type=int, default=88, help="kuvioiden ylin sävel (midi)")
    ap.add_argument("--pedal", type=int, default=None, help="pitkän äänen sävel (midi); oletus: etsitään")
    a = ap.parse_args()
    d = a.dir
    prep = json.loads((d / "prepare.json").read_text(encoding="utf-8"))
    t0 = float(prep.get("start", 0.0))
    info = sf.info(d / "clean_mono.wav")
    sr = info.samplerate
    y, _ = sf.read(d / "clean_mono.wav", start=int((a.a - t0) * sr), stop=int((a.b - t0) * sr))
    hop = 256
    n_bins = 7 * BPO
    C = np.abs(librosa.cqt(y.astype(np.float32), sr=sr, hop_length=hop, fmin=librosa.midi_to_hz(FMIN_MIDI), n_bins=n_bins,
                           bins_per_octave=BPO, filter_scale=1.0))
    t = a.a + np.arange(C.shape[1]) * hop / sr
    midi = FMIN_MIDI + np.arange(n_bins) * 12.0 / BPO
    dB = 20 * np.log10(C / C.max() + 1e-6)
    step = BPO // 12

    def band(m, half=0.35):
        sel = (midi >= m - half) & (midi <= m + half)
        return C[sel].max(axis=0)

    # 1. pitkä ääni
    semis = np.arange(a.lo, a.hi + 1)
    E = np.stack([band(m) for m in semis])  # (sävel, aika)
    EdB = 20 * np.log10(E / C.max() + 1e-6)
    if a.pedal is None:
        pres = (EdB > -32).mean(axis=1)
        ped = int(semis[int(np.argmax(pres))])
    else:
        ped = a.pedal
    pe = EdB[ped - a.lo]
    pe_s = ndi.uniform_filter1d(pe, int(0.3 * sr / hop))
    on = pe_s > -34
    runs, i = [], 0
    while i < len(on):
        if on[i]:
            j = i
            while j < len(on) and on[j]:
                j += 1
            if t[j - 1] - t[i] >= 1.0:
                runs.append((float(t[i]), float(t[j - 1])))
            i = j
        else:
            i += 1
    print(f"## Pitkä ääni: {name(ped)} (midi {ped})")
    print("jaksot, joissa se soi (taso yli -34 dB suhteessa huippuun):", ", ".join(f"{x:.1f}–{z:.1f} s" for x, z in runs) or "ei")
    # paisutukset: tason paikalliset huiput ja laaksot
    sm = ndi.uniform_filter1d(pe, int(0.6 * sr / hop))
    pk = np.flatnonzero((sm == ndi.maximum_filter1d(sm, int(1.5 * sr / hop))) & (sm > -30))
    vl = np.flatnonzero((sm == ndi.minimum_filter1d(sm, int(1.5 * sr / hop))) & (sm > -45))
    print("tason huiput (paisutuksen laki):", ", ".join(f"{t[k]:.1f} s {sm[k]:.0f} dB" for k in pk[:20]))
    print("tason laaksot:", ", ".join(f"{t[k]:.1f} s {sm[k]:.0f} dB" for k in vl[:20]))

    # 2. yläsävelprofiili sekunneittain
    print(f"\n## Yläsävelprofiili {name(ped)}: osaäänet 2..6 dB suhteessa perusääneen (1 s keskiarvot)")
    harm = [ped + 12 * np.log2(h) for h in range(1, 7)]
    H = np.stack([band(m, 0.3) for m in harm])
    prof_rows = []
    for s0 in np.arange(np.ceil(a.a), a.b, 1.0):
        sel = (t >= s0) & (t < s0 + 1)
        if not sel.any():
            continue
        f0 = H[0][sel].mean()
        if 20 * np.log10(f0 / C.max() + 1e-6) < -36:
            continue
        rel = [20 * np.log10(H[k][sel].mean() / f0 + 1e-6) for k in range(1, 6)]
        odd = np.mean([rel[1], rel[3]])   # 3. ja 5.
        even = np.mean([rel[0], rel[2], rel[4]])  # 2., 4., 6.
        prof_rows.append((s0, rel, odd - even))
        print(f"  {s0:5.0f} s  " + "  ".join(f"{r:6.1f}" for r in rel) + f"   parittomat-parilliset {odd - even:+5.1f} dB")

    # 3. kuviot: muut sävelet kuin pitkä ääni ja sen oktaavit
    print(f"\n## Kuviot (muut sävelet {name(a.lo)}–{name(a.hi)}, vähintään 0,15 s, taso yli -30 dB)")
    notes = []
    thr = -30
    for k, m in enumerate(semis):
        if (m - ped) % 12 == 0:
            continue
        # sävelen pitää olla paikallinen huippu taajuudessa (ei naapurin vuotoa)
        e = EdB[k]
        nb = np.maximum(EdB[k - 1] if k > 0 else -99, EdB[k + 1] if k + 1 < len(semis) else -99)
        act = (e > thr) & (e >= nb - 1.0)
        act = ndi.binary_closing(act, structure=np.ones(int(0.08 * sr / hop)))
        i = 0
        while i < len(act):
            if act[i]:
                j = i
                while j < len(act) and act[j]:
                    j += 1
                if t[j - 1] - t[i] >= 0.15:
                    notes.append((float(t[i]), float(t[j - 1]), int(m), float(e[i:j].max())))
                i = j
            else:
                i += 1
    notes.sort()
    for x, z, m, lv in notes:
        print(f"  {x:6.2f}–{z:6.2f}  {name(m):<5} ({m - ped:+d} psa pitkästä äänestä)  {lv:5.1f} dB")

    # 4. matalat alut
    print("\n## Matalan rekisterin alut (C1–H2)")
    sel = (midi >= 24) & (midi < 48)
    L = np.log1p(200 * C[sel] / C.max())
    flux = np.maximum(0, np.diff(L, axis=1, prepend=L[:, :1])).sum(axis=0)
    flux = ndi.uniform_filter1d(flux, 3)
    thrf = np.percentile(flux, 92)
    w = int(0.25 * sr / hop)
    pk = np.flatnonzero((flux == ndi.maximum_filter1d(flux, w)) & (flux > thrf))
    low = []
    for k in pk:
        seg = C[sel][:, k:k + int(0.2 * sr / hop)].mean(axis=1)
        m = midi[sel][int(np.argmax(seg))]
        lv = 20 * np.log10(seg.max() / C.max() + 1e-6)
        if lv > -40:
            low.append((float(t[k]), float(m), float(lv)))
    for x, m, lv in low:
        print(f"  {x:6.2f}  {name(m):<5} {lv:5.1f} dB")
    if len(low) > 2:
        gaps = np.diff([x for x, _, _ in low])
        print(f"  välit: mediaani {np.median(gaps):.2f} s, vaihtelu {gaps.min():.2f}–{gaps.max():.2f} s")

    out = {"vali": [a.a, a.b], "pitka_aani": {"savel": name(ped), "midi": ped, "jaksot": runs},
           "ylasavelprofiili": [{"t": float(s0), "rel_db": [round(float(r), 1) for r in rel], "parittomat_miinus_parilliset": round(float(dd), 1)} for s0, rel, dd in prof_rows],
           "kuviot": [{"alku": round(x, 2), "loppu": round(z, 2), "savel": name(m), "psa_pitkasta": m - ped, "db": round(lv, 1)} for x, z, m, lv in notes],
           "matalat_alut": [{"t": round(x, 2), "savel": name(m), "db": round(lv, 1)} for x, m, lv in low]}
    (d / f"tarkka_{int(a.a):04d}-{int(a.b):04d}.json").write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8")

    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    fig, ax = plt.subplots(3, 1, figsize=(17, 10), sharex=True, gridspec_kw={"height_ratios": [3.2, 1, 1]})
    s1 = (midi >= 26) & (midi <= 92)
    ax[0].imshow(np.clip(dB[s1], -55, 0), origin="lower", aspect="auto", extent=[t[0], t[-1], 26, 92], cmap="magma")
    for m_ in range(28, 92):
        if m_ % 12 in (11, 8):  # H ja Gis
            ax[0].axhline(m_, color="w", lw=0.25, alpha=0.35)
            ax[0].text(t[0], m_, name(m_), color="w", fontsize=6, va="center")
    for x, z, m, lv in notes:
        ax[0].plot([x, z], [m, m], color="cyan", lw=1.2)
    for x, m, lv in low:
        ax[0].plot(x, m, "^", color="lime", ms=4)
    ax[0].set_ylabel("sävel (midi)")
    ax[0].set_title(f"Tarkka kuuntelu {a.a:.0f}–{a.b:.0f} s · {d.name} · pitkä ääni {name(ped)} · syaani = kuviot, vihreä = matalat alut")
    ax[1].plot(t, sm, "w" if False else "k", lw=1)
    ax[1].set_ylabel(f"{name(ped)} taso dB")
    ax[1].set_ylim(-50, 0)
    if prof_rows:
        ax[2].plot([r[0] + 0.5 for r in prof_rows], [r[2] for r in prof_rows], "o-", ms=3, lw=0.8, color="tab:blue")
        ax[2].axhline(0, color="gray", lw=0.5)
    ax[2].set_ylabel("parittomat − parilliset dB")
    ax[2].set_xlabel("aika (s, kuuntelukopio)")
    plt.tight_layout()
    png = d / f"tarkka_{int(a.a):04d}-{int(a.b):04d}.png"
    plt.savefig(png, dpi=105)
    print("\nkuva:", png)


if __name__ == "__main__":
    main()
