r"""Kriitikkoportti: aineisto tuoreelle tarkistajalle, joka vertaa aikomusta kuvaan.

Tarkistaja lukee ensin kokonaan docs/visuaalinen_tyyli.md (kuvasäännöt luvussa 12);
palautekohdat ovat docs/kriitikko_kohdat.json. Kaksi osaa (kumpikin valinnainen, index.md kokoaa):

1. Palautekohdat (--items, oletus docs/kriitikko_kohdat.json): ruutusarja (tile) jokaisesta kohdasta,
   sarakkeet "piti näkyä / näkyy / ero".
2. Otot (--otot camcheck.txt): camcheckin ottolistasta jokaiselle otolle kaksi täysleveää stilliä (1/3 ja 2/3
   oton kestosta) rinnakkain, elementti-inventaariota varten: tarkistaja nimeää jokaisen kuvassa näkyvän
   elementin ja sen lähteen (kuvasäännöt, kuvakäsikirjoituksen otto). Elementti ilman lähdettä on bugi.

    .venv\Scripts\python.exe -I analysis/kriitikko.py <video.mp4> [--items docs/kriitikko_kohdat.json] \
        [--otot runs/<ajo>/camcheck.txt] --out runs/<ajo>/kriitikko [--start 0]

Ajat ovat kuuntelukopion aikaa; --start on videon ensimmäisen ruudun aika kuuntelukopiossa.
"""
import argparse
import json
import math
import os
import re
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)


def tile(ffmpeg, video, vt0, dur, fps, width, cols, rows_n, path, t0_label):
    vf = (f"fps={fps},scale={width}:-2,"
          f"drawtext=text='%{{eif\\:{t0_label}+t\\:d}}.%{{eif\\:mod(({t0_label}+t)*10\\,10)\\:d}}s':x=6:y=6:fontsize=18:"
          f"fontcolor=white:box=1:boxcolor=black@0.6,tile={cols}x{rows_n}")
    cmd = [ffmpeg, '-v', 'error', '-y', '-ss', f'{vt0:.3f}', '-t', f'{dur:.3f}', '-i', video, '-vf', vf, '-frames:v', '1', path]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:   # drawtext voi puuttua (fontconfig): ilman aikaleimaa
        vf2 = f"fps={fps},scale={width}:-2,tile={cols}x{rows_n}"
        subprocess.run([ffmpeg, '-v', 'error', '-y', '-ss', f'{vt0:.3f}', '-t', f'{dur:.3f}', '-i', video, '-vf', vf2, '-frames:v', '1', path], check=False)


def still_pair(ffmpeg, video, ta, tb, width, path):
    """Kaksi stilliä rinnakkain (ta ja tb) yhdeksi kuvaksi."""
    cmd = [ffmpeg, '-v', 'error', '-y', '-ss', f'{ta:.3f}', '-i', video, '-ss', f'{tb:.3f}', '-i', video,
           '-filter_complex', f'[0:v]scale={width}:-2[a];[1:v]scale={width}:-2[b];[a][b]hstack', '-frames:v', '1', path]
    subprocess.run(cmd, check=False, capture_output=True)


def parse_camcheck(path):
    """camcheck.mjs:n rivit muotoa '  229.0 s  <oton nimi>   kääntö max ...' -> [(t, nimi)]."""
    shots = []
    for line in open(path, encoding='utf-8', errors='replace'):
        m = re.match(r'\s*([0-9.]+) s\s+(.+?)\s{2,}kääntö', line)
        if m:
            shots.append((float(m.group(1)), m.group(2).strip()))
    return shots


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('video')
    ap.add_argument('--items', default=os.path.join(ROOT, 'docs', 'kriitikko_kohdat.json'))
    ap.add_argument('--otot', help='camcheck.txt, josta ottolista')
    ap.add_argument('--out', required=True)
    ap.add_argument('--start', type=float, default=0.0, help='videon ensimmäisen ruudun aika kuuntelukopiossa')
    ap.add_argument('--end', type=float, default=None, help='videon viimeinen aika kuuntelukopiossa (ottolistan rajaus)')
    ap.add_argument('--max-frames', type=int, default=60)
    ap.add_argument('--width', type=int, default=480)
    ap.add_argument('--ffmpeg', default=os.environ.get('FFMPEG', 'ffmpeg'))
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    md = [f"# Kriitikkoportti: {os.path.basename(a.video)}\n",
          "Lue ensin kokonaan `docs/visuaalinen_tyyli.md` (kuvasäännöt ovat luvussa 12). Se voittaa briefin ja palautteen.\n"]

    # 1. palautekohdat
    if os.path.exists(a.items):
        items = json.load(open(a.items, encoding='utf-8'))
        md.append("\n## 1. Palautekohdat\n\nJokaisesta kohdasta: mitä piti näkyä, mitä ruuduissa näkyy, ero. "
                  "Ruudut rivi riviltä vasemmalta oikealle; aika ruudun kulmassa.\n\n"
                  "| # | Kohta | Ruudut | Piti näkyä | Näkyy | Ero / tila |\n|---|---|---|---|---|---|")
        for it in items:
            t0, t1 = float(it['t0']), float(it['t1'])
            fps = float(it.get('fps', 1))
            n = fps * (t1 - t0)
            if n > a.max_frames:
                fps = a.max_frames / (t1 - t0)
                n = a.max_frames
            n = max(1, int(math.ceil(n)))
            cols = min(6, n) if fps <= 2 else min(8, n)
            fn = f"{it['id']}_{t0:.1f}-{t1:.1f}.png"
            tile(a.ffmpeg, a.video, t0 - a.start, t1 - t0, fps, a.width, cols, int(math.ceil(n / cols)), os.path.join(a.out, fn), t0)
            print(f"{it['id']:8s} {t0:7.1f}-{t1:7.1f} s  {n:3d} ruutua @ {fps:.2f} fps  -> {fn}")
            md.append(f"| {it['id']} | {it.get('otsikko','')} ({t0}–{t1} s, {fps:.2f} fps) | `{fn}` | {it.get('piti_nakya','')} |  |  |")
    else:
        print(f"ei palautekohtia ({a.items} puuttuu)")

    # 2. otot: elementti-inventaario
    if a.otot:
        shots = parse_camcheck(a.otot)
        md.append("\n## 2. Otot: elementti-inventaario\n\nJokaisesta otosta kaksi stilliä (1/3 ja 2/3 oton kestosta). "
                  "Tarkistaja luettelee JOKAISEN kuvassa näkyvän elementin ja sen lähteen (kuvakäsikirjoituksen otto, "
                  "kuvasäännöt). Elementti, jolle ei löydy lähdettä tai joka ei vastaa soivaa musiikkia, on bugi. "
                  "Sarake 'tyyli': onko still tyyliohjeen mukainen kuva.\n\n"
                  "| otto | aika | stillit | elementit ja lähde | irralliset elementit | tyyli | tila |\n|---|---|---|---|---|---|---|")
        os.makedirs(os.path.join(a.out, 'otot'), exist_ok=True)
        end_default = shots[-1][0] + 10 if shots else 0
        for i, (t, name) in enumerate(shots):
            t_end = shots[i + 1][0] if i + 1 < len(shots) else (a.end if a.end else end_default)
            if a.end and t >= a.end:
                break
            if t_end <= a.start:
                continue
            ta, tb = t + (t_end - t) / 3, t + 2 * (t_end - t) / 3
            safe = re.sub(r'[^0-9A-Za-zåäöÅÄÖ._-]+', '_', name)[:60]
            fn = f"otot/{i:03d}_{t:.1f}_{safe}.png"
            still_pair(a.ffmpeg, a.video, ta - a.start, tb - a.start, 800, os.path.join(a.out, fn))
            md.append(f"| {i} | {t:.1f}–{t_end:.1f} s | `{fn}` ({ta:.1f} / {tb:.1f} s) | {name} |  |  |  |")
        print(f"otot: {len(shots)}")

    with open(os.path.join(a.out, 'index.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(md) + '\n')
    print('index:', os.path.join(a.out, 'index.md'))


if __name__ == '__main__':
    main()
