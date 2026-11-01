r"""Kuuntelupöytäkirja: mitä aikavälillä soi, kuuntelukopion ajassa (docs/analyysisuunnitelma.md luku 3.3).

Annetulle välille tuottaa kolme asiaa:
  1. taulukon (ruutu = --step, oletus 0,5 s): patarumpu x 2 (drums-stemmi ja matala 50-200 Hz isku), jouset,
     puupuhaltimet, vasket, jousitremolo, urkupiste, liiketiheys, voimakkuus (dBFS), isku (aksentit),
     duuri/molli-vihje (vain vihje) ja CREPE-sävelet; markdowniin <paketti>/poytakirja_<alku>-<loppu>.md
  2. spektrogrammin (kuuntelukopiosta) PNG:nä, kanavat piirrettynä päälle:
     <paketti>/poytakirja_<alku>-<loppu>.png
  3. kuuntelunäytteen build/kuuntelu/otteet/<alku>-<loppu>.wav kuuntelukopiosta (48 kHz, 24 bit), jotta
     käyttäjä kuulee saman kohdan ja vahvistaa tai hylkää

Taulukon arvot: 0..1 kanavat ovat ruudun keskiarvoja, paitsi patarumpukanavat (suurin arvo ruudussa:
isku on lyhyt). Kanava ei ole totuus: pöytäkirja on se, jolla kanavakortti täytetään.

    .venv\Scripts\python.exe -I analysis/kuuntele.py --from 0 --to 60 [--package build/testi60] [--step 0.5]
"""
import argparse
import csv
import json
import sys
from pathlib import Path

import librosa
import numpy as np
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

ROOT = lahde.ROOT
FPS = 30
SRC = {"melodia_laulu": "L", "melodia_muu": "M", "basso": "B"}
HINT = {"vihje_hmolli": "h-molli", "vihje_Dduuri": "D-duuri", "vihje_Cduuri": "C-duuri", "vihje_Hduuri": "H-duuri"}
# Yksittäiset PANNs-soitinluokat (kanavat soitin_<luokka>, raaka-arvo): sarakeotsikko, luokka
SOITIN_COLS = [("viulu", "violin_fiddle"), ("sello", "cello"), ("kb", "double_bass"), ("jousisekt", "string_section"),
               ("jousi", "bowed_string_instrument"), ("pizz", "pizzicato"), ("huilu", "flute"), ("klar", "clarinet"),
               ("saks", "saxophone"), ("puu", "wind_instrument_woodwind_instrument"), ("torvi", "french_horn"),
               ("trumpetti", "trumpet"), ("pasuuna", "trombone"), ("vaski", "brass_instrument"), ("patar", "timpani"),
               ("rumpu-ps", "drum_roll"), ("orkesteri", "orchestra")]
TYPE = {"tutti-isku": "tutti", "korkea isku": "korkea", "aksentti": "aks"}


def mmss(t):
    m, s = divmod(t, 60)
    return f"{int(m)}:{s:04.1f}"


def fi_note(midi):
    midi = int(round(midi))
    return f"{lahde.PITCHES[midi % 12]}{midi // 12 - 1}"


def load(d, name):
    meta = json.loads((d / f"{name}.json").read_text(encoding="utf-8"))
    x = np.fromfile(d / f"{name}.f32", dtype=np.float32).reshape(meta["frames"], -1)
    return meta, {c: x[:, i] for i, c in enumerate(meta["channels"])}


def pick(t0, t1, package=None):
    if package:
        d = package if package.is_absolute() else ROOT / package
        return d
    best = None
    for f in sorted((ROOT / "build").glob("*/kanavat.json")):
        m = json.loads(f.read_text(encoding="utf-8"))
        cover = min(m["start"] + m["duration"], t1) - max(m["start"], t0)
        if best is None or cover > best[0]:
            best = (cover, f.parent)
    if best is None:
        raise SystemExit("yhtään pakettia (build/*/kanavat.json) ei löydy: aja prepare, analyze, listen, kanavat")
    if best[0] < t1 - t0 - 1e-6:
        print(f"huom: {best[1].name} kattaa vain {best[0]:.1f}/{t1 - t0:.1f} s; jaa väli kahteen kyselyyn")
    return best[1]


def spectrogram(y, sr, t0, t1):
    seg = y[int(t0 * sr):int(t1 * sr)]
    S = librosa.feature.melspectrogram(y=seg, sr=sr, n_fft=4096, hop_length=512, n_mels=128, fmin=40, fmax=8000)
    D = librosa.power_to_db(S, ref=np.max(S) + 1e-12, top_db=70)
    return D, librosa.mel_frequencies(n_mels=128, fmin=40, fmax=8000)


def plot(path, y, sr, t0, t1, K, A, tt, start, soitin, title):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    D, freqs = spectrogram(y, sr, t0, t1)
    nrow = 4 if soitin else 3
    fig, ax = plt.subplots(nrow, 1, figsize=(16, 13 + (3.5 if soitin else 0)), sharex=True, facecolor="#FFFFFF",
                           gridspec_kw={"height_ratios": [3.2, 1.3, 1.1, 2.0][:nrow]})
    ax0 = ax[0]
    ax0.imshow(D, origin="lower", aspect="auto", extent=[t0, t1, 0, len(freqs)], cmap="Greys", vmin=-70, vmax=0)
    ticks = [100, 200, 500, 1000, 2000, 4000, 8000]
    ax0.set_yticks([int(np.argmin(np.abs(freqs - f))) for f in ticks], [str(f) for f in ticks])
    ax0.set_ylabel("taajuus (Hz), spektrogrammi (mel)")
    ax0.set_title(title, loc="left")
    over = [("patarumpu_stemmi", "#C0392B", "-"), ("patarumpu_matala", "#E67E22", "-"), ("jouset", "#1F4E8C", "-"),
            ("puupuhaltimet", "#27AE60", "-"), ("vasket", "#8E44AD", "-"), ("jousitremolo", "#16A085", "--")]
    ax1 = ax0.twinx()
    for name, col, ls in over:
        ax1.plot(tt, K[name], color=col, lw=0.6 if name == "patarumpu_matala" else 1.4, ls=ls, label=name, alpha=0.6 if name == "patarumpu_matala" else 0.9)
    ax1.set_ylim(0, 1.02)
    ax1.set_ylabel("kanavat 0..1")
    ax1.legend(loc="upper right", fontsize=8, ncol=3)

    ax[1].plot(tt, K["taso_dbfs"], color="#222222", lw=1.0, label="taso dBFS")
    ax[1].set_ylabel("taso (dBFS)")
    ax[1].set_ylim(-90, 0)
    ax2 = ax[1].twinx()
    ax2.plot(tt, K["liiketiheys"], color="#E67E22", lw=1.0, label="liiketiheys /s")
    m = K["urkupiste_midi"] > 0
    if m.any():
        ax2.scatter(tt[m], np.full(m.sum(), -0.5), s=8, color="#8E44AD", label="urkupiste")
    ax2.set_ylabel("liiketiheys (alkua/s)")
    ax[1].legend(loc="upper left", fontsize=8)
    ax2.legend(loc="upper right", fontsize=8)

    for key, lab in HINT.items():
        ax[2].plot(tt, K[key], lw=1.0, label=lab)
    ax[2].set_ylim(0, 1)
    ax[2].set_ylabel("duuri/molli-vihje")
    ax[2].set_xlabel("aika (s, kuuntelukopio)")
    ax[2].legend(loc="upper right", fontsize=8, ncol=4)
    ax[2].set_xlim(t0, t1)
    if soitin:
        M = np.stack([v for _, v in soitin])
        ax[3].imshow(M, aspect="auto", origin="lower", cmap="Oranges", vmin=0, vmax=max(0.1, float(np.percentile(M, 99.5))),
                     extent=[tt[0], tt[-1] + 1 / FPS, -0.5, len(soitin) - 0.5], interpolation="nearest")
        ax[3].set_yticks(range(len(soitin)), [lab for lab, _ in soitin], fontsize=7)
        ax[3].set_ylabel("soitinluokat (PANNs raaka)")
        ax[3].set_xlabel("aika (s, kuuntelukopio)")
        ax[3].set_xlim(t0, t1)
    fig.tight_layout()
    fig.savefig(path, dpi=80, facecolor="#FFFFFF")
    plt.close(fig)


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--from", dest="t0", type=float, required=True)
    ap.add_argument("--to", dest="t1", type=float, required=True)
    ap.add_argument("--step", type=float, default=0.5)
    ap.add_argument("--package", type=Path, default=None, help="paketti (oletus: peiton mukaan build/*/)")
    ap.add_argument("--min-conf", type=float, default=0.6, help="nuottien vähimmäisvarmuus")
    ap.add_argument("--no-sample", action="store_true", help="ei kuuntelunäytettä")
    ap.add_argument("--name", default=None, help="tiedostonimi tunnisteen sijaan: poytakirja_<name>.md/.png (oletus <alku>-<loppu>)")
    a = ap.parse_args()
    d = pick(a.t0, a.t1, a.package)
    am, A = load(d, "analysis")
    km, K = load(d, "kanavat")
    lm, L = load(d, "listen")
    start, n = km["start"], km["frames"]
    notes = []
    if (d / "notes.csv").exists():
        with open(d / "notes.csv", encoding="utf-8") as f:
            notes = [r for r in csv.DictReader(f) if float(r["varmuus"]) >= a.min_conf]
    aks = json.loads((d / "aksentit.json").read_text(encoding="utf-8"))["aksentit"] if (d / "aksentit.json").exists() else []

    cfg = lahde.config()
    copy = lahde.listening_copy(cfg)
    stamp = a.name or f"{int(round(a.t0)):04d}-{int(round(a.t1)):04d}"
    sample_stamp = (f"{cfg['levytys']}_" if cfg.get("levytys") else "") + f"{int(round(a.t0)):04d}-{int(round(a.t1)):04d}"
    soitin = [(lab, K[f"soitin_{k}"]) for lab, k in SOITIN_COLS if f"soitin_{k}" in K]
    tt = start + np.arange(n) / FPS
    lines = [
        f"# Kuuntelupöytäkirja {mmss(a.t0)}–{mmss(a.t1)} (kuuntelukopion aikaa)", "",
        f"Paketti `{d.relative_to(ROOT).as_posix()}`, ruutu {a.step} s. Komento: `.venv\\Scripts\\python.exe -I analysis/kuuntele.py "
        f"--from {a.t0:g} --to {a.t1:g} --package {d.relative_to(ROOT).as_posix()}" + (f" --step {a.step:g}" if a.step != 0.5 else "") + f"`. Ajat: kuuntelukopio `{Path(cfg['kuuntelukopio']).as_posix()}`, aika = ruudun alku.", "",
        "Arvot 0..1 ruudun keskiarvoja; patarumpu-sarakkeet ruudun suurin arvo. rumpu = drums-stemmin taso (dBFS -65..-20 -> 0..1), "
        "matala = 50-200 Hz iskuvoima (20 dB nousu 40 ms:ssa = 1). Kanava ei ole totuus, vaan tämä taulukko on kanavakortin pohja. "
        "Vihje (duuri/molli) on pelkkä vihje chromasta: kolmisoinnun sävelten osuus 1 s ikkunassa, vain jos > 0,25.",
        "Sävelet: L = vocals-stemmi, M = other-stemmi, B = bass-stemmi (CREPE, varmuus suluissa, nimet suomeksi: H = englannin B).", "",
        "| aika | rumpu | matala | jouset | puu | vasket | tremolo | urkupiste | tiheys/s | dBFS | isku | vihje | sävelet |",
        "|---|---|---|---|---|---|---|---|---|---|---|---|---|",
    ]
    rows, srows = [], []
    for t in np.arange(a.t0, a.t1, a.step):
        s = slice(int(round((t - start) * FPS)), max(int(round((t - start) * FPS)) + 1, int(round((t + a.step - start) * FPS))))
        if s.start < 0 or s.start >= n:
            continue
        mean = lambda name: float(K[name][s].mean())
        mx = lambda name: float(K[name][s].max())
        ped = K["urkupiste_midi"][s].max()
        ped_s = fi_note(ped) if ped > 0 else "–"
        hs = {lab: mean(key) for key, lab in HINT.items()}
        bh = max(hs, key=hs.get)
        hint = f"{bh} {hs[bh]:.2f}" if hs[bh] > 0.25 else "–"
        ak = [x for x in aks if t <= x["t"] < t + a.step]
        ak_s = ", ".join(f"{TYPE.get(x['tyyppi'], x['tyyppi'].split()[0])} z{x['z']:.0f}" for x in sorted(ak, key=lambda x: -x["z"])[:2]) or "–"
        ns = [r for r in notes if t <= float(r["alku_s"]) < t + a.step]
        nt = " ".join(f"{SRC.get(r['lahde'], '?')}:{fi_note(int(r['midi']))}({float(r['varmuus']):.2f})" for r in ns) or "–"
        row = (mmss(t), mx("patarumpu_stemmi"), mx("patarumpu_matala"), mean("jouset"), mean("puupuhaltimet"), mean("vasket"),
               mean("jousitremolo"), ped_s, mean("liiketiheys"), mean("taso_dbfs"), ak_s, hint, nt)
        rows.append(row)
        srows.append("| " + " | ".join([mmss(t)] + [f"{float(v[s].max()):.2f}" for _, v in soitin]) + " |")
        lines.append("| " + " | ".join([row[0]] + [f"{v:.2f}" for v in row[1:7]] + [row[7], f"{row[8]:.1f}", f"{row[9]:.0f}", row[10], row[11], row[12]]) + " |")

    if soitin:
        lines += ["", "### Yksittäiset soitinluokat (PANNs, raaka-arvo ruudun suurin, 0..1; ei normalisoitu)", "",
                  "AudioSetissä ei ole oboe-, fagotti- eikä englannintorvi-luokkaa; vaski = brass_instrument, saks = saksofoni (diagnostiikka).", "",
                  "| aika | " + " | ".join(lab for lab, _ in soitin) + " |", "|---|" + "---|" * len(soitin)] + srows
    out_md = d / f"poytakirja_{stamp}.md"
    out_png = d / f"poytakirja_{stamp}.png"
    if len(lines) < 400:
        print("\n".join(lines))
    y, sr = sf.read(str(copy), dtype="float32", always_2d=True)
    ym = y.mean(axis=1)
    plot(out_png, ym, sr, a.t0, a.t1, K, A, tt, start, soitin, f"Pöytäkirja {mmss(a.t0)}–{mmss(a.t1)} · {d.name}")
    extras = ["", f"Kuva: `{out_png.relative_to(ROOT).as_posix()}`"]
    if not a.no_sample:
        sample = ROOT / "build" / "kuuntelu" / "otteet" / f"{sample_stamp}.wav"
        sample.parent.mkdir(parents=True, exist_ok=True)
        sf.write(str(sample), y[int(a.t0 * sr):int(a.t1 * sr)], sr, subtype="PCM_24")
        extras.append(f"Kuuntelunäyte: `{sample.relative_to(ROOT).as_posix()}` (kuuntelukopiosta, {sr} Hz, 24 bit)")
    out_md.write_text("\n".join(lines + extras) + "\n", encoding="utf-8")
    print("\n".join(extras))
    print(f"Pöytäkirja: {out_md}")


if __name__ == "__main__":
    main()
