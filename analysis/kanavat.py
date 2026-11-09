r"""Tapiolan uudet kanavat (docs/analyysisuunnitelma.md luku 3.2): patarumpu, jousitremolo, urkupiste,
liiketiheys, soitinperheet painotettuina ja karkea duuri/molli-vihje.

Lukee paketin (prepare, analyze, listen) ja kirjoittaa kanavat.json + kanavat.f32 (ruudut x kanavat,
30 fps, ruutu i = aika i/30 s paketin alusta = start + i/30 s kuuntelukopiossa). Jokainen kanava on
0..1 paitsi:  liiketiheys (alkua/s), urkupiste_midi (MIDI-numero, -1 = ei urkupistettä), taso_dbfs.

Kanavat ja menetelmät (ensimmäinen versio: kanavakortti ratkaisee luotettavuuden pöytäkirjasta):
  patarumpu_stemmi     drums-stemmin RMS-taso (dBFS -65..-20 -> 0..1), ei muuta käsittelyä
  patarumpu_matala     matalan kaistan 50-200 Hz iskuvoima puhdistetusta monosta (nollavaiheinen
                       Butterworth; 10 ms RMS-verhokäyrä; keskitetty nousu dB 40 ms:ssa, 20 dB = 1), 30 fps:n
                       ruutuun suurin arvo; vain kun kokonaistaso on yli 10 dB pintakohinan päällä.
                       RIIPPUMATON drums-stemmistä (Demucs voi vuotaa bassoon)
  patarumpu_tremolo    1, kun matalan kaistan iskuja on yli 8/s (1 s ikkuna)
  jousitremolo         amplitudimodulaation syvyys 8-20 Hz, 300-3000 Hz, other-stemmi (RMS 0,5 s,
                       suhteessa 1 s keskiarvoon; syvyys 0,10..0,40 -> 0..1), kerrottuna other-stemmin tasolla
  urkupiste            bass-stemmin CREPE-sävelen varmuus, kun sama sävel kestää yli 4 s (muuten 0)
  urkupiste_midi       sama sävel MIDI-numerona (muuten -1)
  liiketiheys          alkuja/s other-stemmissä, 2 s ikkuna
  jouset, puupuhaltimet, vasket   painotettu yhdistelmä: PANNs-perhe (suhteessa paketin 95. persentiiliin)
                       + other-/bass-stemmin taso, josta on vähennetty PANNsin patarumpu-osuus (Demucs
                       laittaa patarummun other-stemmiin) + kirkkaus (+ attakki); kaavat funktiossa
                       families(). PANNs yksin on sokea vaskille ff:ssä.
  kirkkaus             spektrin painopiste (log-asteikko 400-4000 Hz -> 0..1), puhdistettu mono
  vihje_hmolli, vihje_Dduuri, vihje_Cduuri, vihje_Hduuri
                       kolmisoinnun sävelten osuus 1 s chromasta, (osuus - 0,25) / 0,75. VAIN VIHJE.
  soitin_<luokka>      PANNsin yksittäiset soitinluokat sellaisinaan (raaka-arvo 0..1, 30 fps): violin_fiddle, cello, double_bass,
                       string_section, bowed_string_instrument, pizzicato, flute, clarinet, saxophone (diagnostiikka),
                       wind_instrument_woodwind_instrument, french_horn, trumpet, trombone, brass_instrument, timpani,
                       drum_roll, orchestra. Luokat puuttuvat kanavista, jos listen.py on ajettu ilman niitä.
  patarumpu_panns      PANNsin timpani + drum roll, suhteessa paketin 95. persentiiliin (kolmas, apukanava)
  stem_*_taso          stemmien absoluuttinen taso 0..1 (apukanava)
  taso_dbfs            kokonaistaso dBFS (puhdistettu mono)

    .venv\Scripts\python.exe -I analysis/kanavat.py build/testi60
"""
import argparse
import csv
import json
import sys
from pathlib import Path

import librosa
import numpy as np
import scipy.ndimage as ndi
import scipy.signal as sps
import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import lahde  # noqa: E402

ROOT = lahde.ROOT
FPS = 30
PITCHES = lahde.PITCHES
STEM_DB = (-65.0, -20.0)  # stemmin taso dBFS -> 0..1

PANNS = {
    "jouset": ["violin_fiddle", "cello", "double_bass", "string_section", "bowed_string_instrument", "pizzicato"],
    "vasket": ["french_horn", "trumpet", "trombone", "brass_instrument"],
    "puu": ["wind_instrument_woodwind_instrument", "flute", "clarinet"],
}
# Yksittäiset PANNs-soitinluokat sellaisinaan kanavina soitin_<luokka> (raaka-arvo 0..1, 30 fps, ei normalisointia,
# ei tasoitusta). AudioSetissä ei ole oboe-, fagotti- eikä englannintorvi-luokkaa; "brass section" = brass_instrument.
SOITIN = ["violin_fiddle", "cello", "double_bass", "string_section", "bowed_string_instrument", "pizzicato",
          "flute", "clarinet", "saxophone", "wind_instrument_woodwind_instrument",
          "french_horn", "trumpet", "trombone", "brass_instrument", "timpani", "drum_roll", "orchestra"]
# Kolmisoinnut (pykälät sävelestä C=0): suomalaiset nimet, H = englannin B.
TRIADS = {
    "vihje_hmolli": ("h-molli", [11, 2, 6]),     # H, D, Fis
    "vihje_Dduuri": ("D-duuri", [2, 6, 9]),      # D, Fis, A
    "vihje_Cduuri": ("C-duuri", [0, 4, 7]),      # C, E, G
    "vihje_Hduuri": ("H-duuri", [11, 3, 6]),     # H, Dis (=Es), Fis
}


def load(d, name):
    meta = json.loads((d / f"{name}.json").read_text(encoding="utf-8"))
    x = np.fromfile(d / f"{name}.f32", dtype=np.float32).reshape(meta["frames"], -1)
    return meta, {c: x[:, i] for i, c in enumerate(meta["channels"])}


def fit(x, n):
    return x[:n] if len(x) >= n else np.pad(x, (0, n - len(x)), mode="edge")


def scale01(db, lo, hi):
    return np.clip((db - lo) / (hi - lo), 0, 1)


def frame_rms_db(x, sr, n):
    hop = sr // FPS
    rms = librosa.feature.rms(y=x, frame_length=2 * hop, hop_length=hop)[0]
    return 20 * np.log10(fit(rms, n) + 1e-10)


def frame_max(x, sr, n, win_s=1 / FPS):
    """Korkean näytetaajuuden käyrä -> 30 fps:n ruutuun suurin arvo ruudun ympäriltä (ruutu i = aika i/30)."""
    half = max(1, int(round(win_s * sr / 2)))
    m = ndi.maximum_filter1d(x, size=2 * half + 1, mode="nearest")
    idx = np.clip(np.round(np.arange(n) / FPS * sr).astype(int), 0, len(m) - 1)
    return m[idx]


def envelope(x, attack_s, release_s):
    att = 1 - np.exp(-1 / max(attack_s * FPS, 1e-9)) if attack_s > 0 else 1.0
    rel = 1 - np.exp(-1 / (release_s * FPS))
    y = np.empty_like(x)
    acc = x[0]
    for i, v in enumerate(x):
        acc += (att if v > acc else rel) * (v - acc)
        y[i] = acc
    return y


def read_stem(d, name, n):
    f = d / "stems" / f"{name}.wav"
    if not f.exists():
        raise SystemExit(f"{f} puuttuu: aja ensin listen.py (stemmit)")
    x, sr = sf.read(f, dtype="float32")
    x = x if x.ndim == 1 else x.mean(axis=1)
    return x, sr, frame_rms_db(x, sr, n)


# --- patarumpu ------------------------------------------------------------------------------------
def kick_low(clean, sr, n, noise_floor_db):
    """Matalan kaistan (50-200 Hz) iskuvoima: keskitetty nousu dB 40 ms:ssa, 20 dB = 1."""
    sos = sps.butter(4, [50, 200], btype="bandpass", fs=sr, output="sos")
    y = sps.sosfiltfilt(sos, clean.astype(np.float64))
    hop = int(round(sr * 0.010))
    win = 2 * hop
    pw = np.convolve(y ** 2, np.ones(win) / win, mode="same")[::hop]
    e_db = 10 * np.log10(pw + 1e-12)
    floor = np.percentile(e_db, 5)
    # keskitetty: nousu 20 ms ennen -> 20 ms jälkeen, joten huippu osuu iskun alkuun (+-10 ms)
    ahead = np.concatenate([e_db[2:], np.full(2, e_db[-1])])
    behind = np.concatenate([np.full(2, e_db[0]), e_db[:-2]])
    rise = np.maximum(0.0, ahead - behind)
    rise[e_db < floor + 10] = 0.0  # kaistan kohinan päällä vain yli 10 dB
    # kokonaistason on oltava yli 10 dB pintakohinan päällä (muuten kyse on kohinan vaihtelusta)
    tot = 10 * np.log10(np.convolve(clean.astype(np.float64) ** 2, np.ones(win) / win, mode="same")[::hop] + 1e-12)
    m = min(len(tot), len(rise))
    rise[:m][tot[:m] < noise_floor_db + 10] = 0.0
    strength = np.clip(rise / 20.0, 0, 1)
    return frame_max(strength, 1 / 0.010, n), strength


def roll_flag(strength, n):
    """Iskuja yli 8/s: huiput (>0,25) 1 s ikkunassa."""
    pk, _ = sps.find_peaks(strength, height=0.25, distance=2)
    cnt = np.zeros(n)
    cnt[pk] = 1
    rate = ndi.uniform_filter1d(cnt, size=FPS, mode="nearest") * FPS
    return (rate > 8).astype(float), rate


# --- jousitremolo ---------------------------------------------------------------------------------
def tremolo_depth(other, sr, n):
    """Amplitudimodulaation syvyys 8-20 Hz kantoaaltokaistalla 300-3000 Hz."""
    x = librosa.resample(other.astype(np.float64), orig_sr=sr, target_sr=11025)
    sos = sps.butter(4, [300, 3000], btype="bandpass", fs=11025, output="sos")
    xb = sps.sosfiltfilt(sos, x)
    env = sps.sosfiltfilt(sps.butter(4, 50, btype="low", fs=11025, output="sos"), np.abs(xb))
    env = np.maximum(env, 0)
    fs2 = 200
    env2 = sps.resample_poly(env, fs2, 11025)
    env2 = np.maximum(env2, 0)
    mean = ndi.uniform_filter1d(env2, size=fs2, mode="nearest")
    rel = env2 / (mean + 1e-9) - 1.0
    bp = sps.sosfiltfilt(sps.butter(3, [8, 20], btype="bandpass", fs=fs2, output="sos"), rel)
    depth = np.sqrt(ndi.uniform_filter1d(bp ** 2, size=fs2 // 2, mode="nearest"))
    idx = np.clip(np.round(np.arange(n) / FPS * fs2).astype(int), 0, len(depth) - 1)
    return depth[idx]


# --- urkupiste ------------------------------------------------------------------------------------
def pedal_points(midi, conf, level, min_s=4.0, max_gap=6, tol=0.7):
    """Sama sävel (±0,7 pykälää) yli min_s sekuntia; enintään max_gap ruudun aukot. level = bass-stemmin taso 0..1."""
    n = len(midi)
    valid = (midi > 0) & (level > 0.15)
    out_conf, out_midi, runs = np.zeros(n), np.full(n, -1.0), []
    i = 0
    while i < n:
        if not valid[i]:
            i += 1
            continue
        start, last, vals, gap = i, i, [midi[i]], 0
        j = i + 1
        while j < n:
            if valid[j] and abs(midi[j] - np.median(vals)) <= tol:
                vals.append(midi[j])
                last, gap = j, 0
            elif valid[j]:
                break
            else:
                gap += 1
                if gap > max_gap:
                    break
            j += 1
        if (last - start + 1) / FPS >= min_s:
            seg = slice(start, last + 1)
            ok = valid[seg]
            out_conf[seg] = float(conf[seg][ok].mean())
            out_midi[seg] = float(np.median(midi[seg][ok]))
            runs.append((start / FPS, (last + 1) / FPS, round(float(np.median(midi[seg][ok])), 1)))
        i = last + 1
    return out_conf, out_midi, runs


# --- liiketiheys ----------------------------------------------------------------------------------
def motion_density(other, sr, level_db, n):
    x = librosa.resample(other.astype(np.float32), orig_sr=sr, target_sr=22050)
    on = librosa.onset.onset_detect(y=x, sr=22050, hop_length=220, units="time")
    cnt = np.zeros(n)
    for t in on:
        i = int(round(t * FPS))
        if 0 <= i < n and level_db[i] > -60.0:  # other-stemmin kohina ei ole liikettä
            cnt[i] += 1
    return ndi.uniform_filter1d(cnt, size=2 * FPS, mode="nearest") * FPS, on


# --- perheet --------------------------------------------------------------------------------------
def panns_group(L, keys, n):
    x = sum(L[f"panns_{k}"] for k in keys if f"panns_{k}" in L)
    return ndi.gaussian_filter1d(np.minimum(x, 1.0), 0.25 * FPS)


def brightness(clean, sr, n):
    S = np.abs(librosa.stft(clean, n_fft=2048, hop_length=sr // FPS))
    cen = fit(librosa.feature.spectral_centroid(S=S, sr=sr)[0], n)
    return np.clip(np.log2(np.maximum(cen, 1.0) / 400.0) / np.log2(4000.0 / 400.0), 0, 1)


def families(P, S_other, S_bass, timp, bright, attack, trem):
    """Painotetut perheet. P = PANNs-ryhmät suhteessa paketin 95. persentiiliin (0..1), S = stemmitasot 0..1,
    timp = PANNsin patarumpu-osuus 0..1 (vähennetään stemmeistä: Demucs laittaa patarummun other-stemmiin)."""
    other = S_other * (1 - timp)
    bass = S_bass * (1 - timp)
    jouset = 0.8 * P["jouset"] + 0.1 * other * (1 - bright) + 0.1 * bass
    puu = 0.8 * P["puu"] + 0.2 * other * bright * (1 - trem)
    vasket = 0.5 * P["vasket"] + 0.25 * other * bright + 0.25 * other * attack
    return np.clip(jouset, 0, 1), np.clip(puu, 0, 1), np.clip(vasket, 0, 1)


# --- duuri/molli-vihje ----------------------------------------------------------------------------
def triad_hints(A, n):
    ch = np.stack([A[f"chroma_{p}"] for p in PITCHES]).astype(np.float64)
    ch = ndi.uniform_filter1d(ch, size=FPS, axis=1, mode="nearest")
    ch = ch / (ch.sum(axis=0, keepdims=True) + 1e-9)
    out = {}
    for key, (_, idx) in TRIADS.items():
        out[key] = np.clip((ch[idx].sum(axis=0) - 0.25) / 0.75, 0, 1)
    return out


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("dir", type=Path)
    a = ap.parse_args()
    d = a.dir if a.dir.is_absolute() else ROOT / a.dir
    prep = json.loads((d / "prepare.json").read_text(encoding="utf-8"))
    ameta, A = load(d, "analysis")
    lmeta, L = load(d, "listen")
    n, start = ameta["frames"], ameta["start"]
    assert lmeta["frames"] == n, "analysis ja listen: eri ruutumäärä"
    clean, sr = sf.read(d / "clean_mono.wav", dtype="float32")

    # stemmit
    drums, sr_s, drums_db = read_stem(d, "drums", n)
    bass, _, bass_db = read_stem(d, "bass", n)
    other, _, other_db = read_stem(d, "other", n)
    S_drums, S_bass, S_other = (scale01(x, *STEM_DB) for x in (drums_db, bass_db, other_db))

    # patarumpu
    kick, _ = kick_low(clean, sr, n, prep["noise_floor_db"])
    tremolo_flag, kick_rate = roll_flag(kick, n)

    # jousitremolo
    depth = tremolo_depth(other, sr_s, n)
    trem = np.clip((depth - 0.10) / 0.30, 0, 1) * S_other

    # urkupiste
    ped_conf, ped_midi, ped_runs = pedal_points(L["basso_midi"], L["basso_varmuus"], S_bass)

    # liiketiheys
    density, on_other = motion_density(other, sr_s, other_db, n)

    # perheet
    bright = brightness(clean, sr, n)
    music = start + np.arange(n) / FPS >= ameta["music_start"]
    rel = lambda x: np.clip(x / (np.percentile(x[music], 95) + 1e-4), 0, 1)
    P = {k: rel(panns_group(L, PANNS[k], n)) for k in PANNS}
    timp = rel(panns_group(L, ["timpani", "drum_roll"], n))
    attack = np.clip(A["flux"], 0, 1)
    jouset, puu, vasket = families(P, S_other, S_bass, timp, bright, attack, trem)

    # vihje
    hints = triad_hints(A, n)

    level = fit(20 * np.log10(librosa.feature.rms(y=clean, frame_length=2048, hop_length=sr // FPS)[0] + 1e-10), n)
    ch = {
        "patarumpu_stemmi": S_drums, "patarumpu_matala": kick, "patarumpu_tremolo": tremolo_flag,
        "jousitremolo": trem, "urkupiste": ped_conf, "urkupiste_midi": ped_midi, "liiketiheys": density,
        "jouset": jouset, "puupuhaltimet": puu, "vasket": vasket, "kirkkaus": bright, **hints,
        "stem_drums_taso": S_drums, "patarumpu_panns": timp, "stem_bass_taso": S_bass, "stem_other_taso": S_other, "taso_dbfs": level,
    }
    for k in SOITIN:
        if f"panns_{k}" in L:
            ch[f"soitin_{k}"] = L[f"panns_{k}"]
    # patarumpu_stemmi ja stem_drums_taso ovat sama luku; jälkimmäinen pois turhana
    ch.pop("stem_drums_taso")
    names = list(ch)
    data = np.stack([np.asarray(fit(np.asarray(v, dtype=np.float64), n), dtype=np.float32) for v in ch.values()], axis=1)
    assert np.isfinite(data).all(), "kanavissa NaN/inf"
    data.tofile(d / "kanavat.f32")
    meta = {
        "fps": FPS, "frames": n, "start": start, "duration": ameta["duration"], "music_start": ameta["music_start"],
        "channels": names, "dtype": "float32", "layout": "frames x channels",
        "ajat": "ruutu i = start + i/30 s kuuntelukopiossa",
        "menetelmat": (__doc__ or "").split("\n\n")[1] if "\n\n" in (__doc__ or "") else "",
        "parametrit": {"stem_db": STEM_DB, "panns_normalisointi": "paketin 95. persentiili musiikin ajalta", "tremolo_syvyys_alue": [0.10, 0.40],
                       "urkupiste_min_s": 4.0, "patarumpu_tremolo_raja_per_s": 8,
                       "kolmisoinnut": {k: v[0] for k, v in TRIADS.items()}},
        "urkupisteet": [{"alku": round(start + t0, 2), "loppu": round(start + t1, 2), "midi": m} for t0, t1, m in ped_runs],
        "soitinluokat": [k for k in SOITIN if f"panns_{k}" in L],
        "soitinluokat_huom": "soitin_* = PANNs raaka-arvo sellaisenaan; AudioSetissä ei ole oboe-, fagotti- eikä englannintorvi-luokkaa",
        "huom": "Kanavat ovat ensimmäinen versio; luotettavuus: docs/tapiola_tutkimus.md luku 13 ja docs/tutkimus/kanavakortti.md.",
    }
    (d / "kanavat.json").write_text(json.dumps(meta, indent=1, ensure_ascii=False), encoding="utf-8")
    print(f"{n} ruutua x {len(names)} kanavaa -> {d / 'kanavat.f32'}")
    for nm in names:
        v = ch[nm]
        print(f"  {nm:<18} min {np.min(v):7.3f}  mediaani {np.median(v):7.3f}  p95 {np.percentile(v, 95):7.3f}  max {np.max(v):7.3f}")
    print(f"urkupisteet (>4 s): {meta['urkupisteet'] or 'ei yhtään'}")


if __name__ == "__main__":
    main()
