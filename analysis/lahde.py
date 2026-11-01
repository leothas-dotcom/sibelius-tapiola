"""Lähde, kuuntelukopio ja yksi sovittu dekoodaustapa (kaikkien työkalujen yhteinen osa).

Aikojen ainoa totuus on kuuntelukopio (config.json: "kuuntelukopio"). Se ja kaikki johdetut äänet
(prepare.py: soundtrack, mono, puhdistettu; kuuntelunäytteet) dekoodataan lähteestä SAMALLA ffmpeg-
komennolla, jonka muoto on `decode()`:

    ffmpeg -i <lähde> [-af <suodatin>] [-ss <alku> -t <kesto>] -ar <sr> -ac <kanavat> -c:a <koodekki> <ulos>

-ss ja -t ovat tulostiedoston valitsimia (dekoodaus lähteen alusta, ei hakua), joten leikkaus on näytetarkka
eikä riipu mp3:n hakutaulukosta. Lähteessä ei ole LAME/Xing-otsikkoa, joten ffmpeg ei poista mp3:n
dekoodausviivettä: dekoodatun virran ensimmäinen näyte on ensimmäisen mp3-kehyksen ensimmäinen näyte.
Kaikki ajat ovat tämän virran aikaa (0 = ensimmäinen dekoodattu näyte).
"""
import json
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "analysis" / "config.json"
# Sävelnimet suomeksi: H = englannin B (h-molli = B minor, H-duuri = B major), B = englannin B-flat.
PITCHES = ["C", "Cis", "D", "Es", "E", "F", "Fis", "G", "As", "A", "B", "H"]


def config():
    return json.loads(CONFIG.read_text(encoding="utf-8"))


def save_config(cfg):
    CONFIG.write_text(json.dumps(cfg, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def path_of(rel):
    p = Path(rel)
    return p if p.is_absolute() else ROOT / p


def source(cfg=None):
    return path_of((cfg or config())["lahde"])


def listening_copy(cfg=None):
    return path_of((cfg or config())["kuuntelukopio"])


def ffmpeg_exe():
    exe = shutil.which("ffmpeg")
    if not exe:
        raise SystemExit("ffmpeg puuttuu (aja setup.ps1)")
    return exe


def decode(src, out, sr, channels, codec, af=None, start=None, dur=None):
    """Sovittu dekoodaus: lähde -> wav. Kaikki johdetut äänet tehdään tällä."""
    cmd = [ffmpeg_exe(), "-v", "error", "-y", "-i", str(src)]
    if af:
        cmd += ["-af", af]
    if start:
        cmd += ["-ss", f"{start}"]
    if dur is not None:
        cmd += ["-t", f"{dur}"]
    cmd += ["-ar", str(sr), "-ac", str(channels), "-c:a", codec, str(out)]
    subprocess.run(cmd, check=True)
    return cmd
