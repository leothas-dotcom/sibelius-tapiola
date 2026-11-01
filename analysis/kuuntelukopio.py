r"""Kuuntelukopio: lähde -> config.json:n "kuuntelukopio" (nyt build/kuuntelu/rattle_kuuntelu.wav; aikojen ainoa totuus).

48 kHz, stereo, 24 bit, ei muuta käsittelyä (ei suodatusta, ei normalisointia). Dekoodaus ffmpegillä
samalla komennolla kuin kaikki johdetut äänet (analysis/lahde.py: decode). Lähteessä ei ole LAME/Xing-
otsikkoa, joten ffmpeg ei leikkaa mp3:n dekoodausviivettä pois; kopion ensimmäinen näyte on lähteen
ensimmäisen kehyksen ensimmäinen näyte.

Tekee myös lähteen "suoran dekoodauksen" vertailuksi ja mittaa kellot.py:n menetelmällä, että kuuntelukopio
on 0 ms sitä vasten:
  1. soundfile (libmpg123) lukee mp3:n suoraan, jos osaa: riippumaton dekooderi (ei webm/opus)
  2. ffmpeg-dekoodaus natiivilla 44,1 kHz:llä (build/kuuntelu/<levytys>_lahde_44k.wav)
  3. webm/opus: ffmpegin kaksi eri opus-dekooderia (natiivi `opus` ja `libopus`) 48 kHz:llä sekä
     config.json:n valinnainen "lahde_vertailu" (aiemmin dekoodattu wav)
Tulos: build/kuuntelu/<levytys>_kuuntelukopio.json (<levytys> = kuuntelukopion nimi ilman "_kuuntelu").

    .venv\Scripts\python.exe -I analysis/kuuntelukopio.py
"""
import argparse
import hashlib
import json
import subprocess
import sys
from pathlib import Path

import soundfile as sf

sys.path.insert(0, str(Path(__file__).resolve().parent))  # -I jättää skriptin kansion pois polulta
import kellot  # noqa: E402
import lahde  # noqa: E402


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for block in iter(lambda: f.read(1 << 20), b""):
            h.update(block)
    return h.hexdigest()


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser()
    ap.add_argument("--tol", type=float, default=1.0, help="hyväksyntäraja (ms)")
    a = ap.parse_args()
    cfg = lahde.config()
    src, out = lahde.source(cfg), lahde.listening_copy(cfg)
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = lahde.decode(src, out, cfg["kuuntelukopio_sr"], cfg["kuuntelukopio_kanavat"], cfg["kuuntelukopio_koodekki"])
    info = sf.info(str(out))
    print("komento: " + " ".join(cmd))
    print(f"{out.name}: {info.samplerate} Hz, {info.channels} kanavaa, {info.subtype}, {info.frames} näytettä = {info.duration:.4f} s")

    refs = []
    try:
        mp3 = sf.info(str(src))
        refs.append(("soundfile (libmpg123) suoraan mp3:sta", str(src), f"{mp3.samplerate} Hz, {mp3.frames} näytettä = {mp3.duration:.4f} s"))
    except Exception as e:  # noqa: BLE001
        print(f"soundfile ei lue lähdettä suoraan: {e}")
    tag = out.stem.removesuffix("_kuuntelu")
    ref44 = out.with_name(f"{tag}_lahde_44k.wav")
    lahde.decode(src, ref44, 44100, 2, "pcm_f32le")
    i44 = sf.info(str(ref44))
    refs.append(("ffmpeg-dekoodaus natiivilla 44,1 kHz:llä", str(ref44), f"{i44.frames} näytettä = {i44.duration:.4f} s"))
    if src.suffix.lower() in (".webm", ".opus", ".ogg"):
        # kaksi eri opus-dekooderia (ffmpegin natiivi ja libopus), 48 kHz = opuksen oma taajuus
        for dec in ("opus", "libopus"):
            ref = out.with_name(f"{tag}_lahde_{dec}_48k.wav")
            c = [lahde.ffmpeg_exe(), "-v", "error", "-y", "-c:a", dec, "-i", str(src), "-ar", "48000", "-ac", "2", "-c:a", "pcm_f32le", str(ref)]
            subprocess.run(c, check=True)
            ii = sf.info(str(ref))
            refs.append((f"ffmpeg, opus-dekooderi {dec}, 48 kHz", str(ref), f"{ii.frames} näytettä = {ii.duration:.4f} s"))
    if cfg.get("lahde_vertailu"):
        rp = lahde.path_of(cfg["lahde_vertailu"])
        ii = sf.info(str(rp))
        refs.append((f"aiemmin dekoodattu {rp.name}", str(rp), f"{ii.samplerate} Hz, {ii.frames} näytettä = {ii.duration:.4f} s"))

    result = {"komento": " ".join(cmd), "sha256": sha256(out), "nayttetta": info.frames, "kesto_s": round(info.duration, 4),
              "vertailut": []}
    bad = 0
    for label, ref, detail in refs:
        print(f"\n== vertailu: {label} ({detail})")
        worst, drift = kellot.check(out, 0.0, kellot.times_for(info.duration), out.name, ref)
        ok = worst == worst and worst <= a.tol
        bad += not ok
        result["vertailut"].append({"vertailu": label, "suurin_ero_ms": None if worst != worst else round(worst, 3),
                                    "ajautuminen_ppm": None if drift is None else round(drift, 2), "ok": bool(ok)})
    (out.parent / f"{tag}_kuuntelukopio.json").write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\n{f'KUUNTELUKOPIO 0 ms LÄHDETTÄ VASTEN (±{a.tol} ms)' if not bad else f'{bad} vertailua ylittää rajan'}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
