#!/usr/bin/env python3
"""Shortsit: pystyvideot (1080x1920) ankkurista ankkuriin, teksteineen.

    python -I render/shortsit.py runs/julkaisu_v1/shortsit.json [--vain S8_revontulen_aalto] [--kieli fi] [--ei-renderia]

Jokainen Short renderöidään kohtauksesta pystyyn (render/lukittu.mjs --koko 1080x1920), ei rajata vaakakuvasta. Rajat ovat ankkureita
(annotations/cues.json), joten sama määrittely toimii käyttäjän omalle äänitykselle, kun cues on generoitu sille. Tekstit piirretään
läpinäkyviksi kuviksi ja häivytetään videon päälle (alku ja loppu 0,6 s); tekstit tasavälein tai ankkuriin sidottuina ('alut'). Tulokset: <kansio>/shorts/<id>_raaka.mp4 (ilman tekstiä),
<id>_<kieli>.mp4 ja kontakti_<kieli>.jpg. Katseluversioiden ääni on työäänitys: ei julkaisuun.
"""
import io, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTTI = 'C:/Windows/Fonts/georgia.ttf'
VARI = (232, 240, 250)          # halla, hieman vaalennettuna luettavuuden vuoksi
KOKO_PT, RIVIVALI, Y_KESKI = 58, 78, 1330   # tekstin keskikohta: Shortsin turva-alueella (ei alimman viidenneksen eikä oikean reunan päällä)


def tekstikuva(teksti, W, H, polku):
    from PIL import Image, ImageDraw, ImageFont, ImageFilter
    f = ImageFont.truetype(FONTTI, KOKO_PT)
    rivit = teksti.split('\n')
    varjo = Image.new('L', (W, H), 0)
    dv = ImageDraw.Draw(varjo)
    y0 = Y_KESKI - RIVIVALI * len(rivit) // 2
    for i, r in enumerate(rivit):
        w = dv.textlength(r, font=f)
        if w > W - 120:
            raise SystemExit(f"rivi liian leveä ({w:.0f} px): {r}")
        dv.text(((W - w) / 2, y0 + i * RIVIVALI), r, font=f, fill=255)
    pehmea = varjo.filter(ImageFilter.GaussianBlur(9)).point(lambda v: min(255, int(v * 2.2)))
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    im.paste(Image.new('RGBA', (W, H), (6, 10, 16, 255)), (0, 0), pehmea)      # pehmeä tumma tausta kirjainten ympärillä
    im.paste(Image.new('RGBA', (W, H), VARI + (255,)), (0, 0), varjo)
    im.save(polku)


def main():
    sys.stdout.reconfigure(encoding='utf-8')
    a = sys.argv[1:]
    lahde = a[0]
    vain = a[a.index('--vain') + 1] if '--vain' in a else None
    kieli = a[a.index('--kieli') + 1] if '--kieli' in a else 'fi'
    L = json.load(io.open(lahde, encoding='utf-8'))
    cues = json.load(io.open(os.path.join(ROOT, 'annotations', 'cues.json'), encoding='utf-8'))
    A = {c['id']: float(c['t']) for c in cues['cues'] if c.get('t') is not None}
    A.update({c['id'] + '.loppu': float(c['t_end']) for c in cues['cues'] if c.get('t_end') is not None})
    W, H = (int(x) for x in L['koko'].split('x'))
    out = os.path.join(os.path.dirname(lahde), 'shorts')
    os.makedirs(os.path.join(out, 'tyo'), exist_ok=True)
    valmiit = []
    for s in L['shortsit']:
        if vain and s['id'] != vain:
            continue
        t0, t1 = A[s['a']] + s.get('a_lisa', 0.0), A[s['b']] + s.get('b_lisa', 0.0)
        kesto = t1 - t0
        raaka = os.path.join(out, s['id'] + '_raaka.mp4')
        if '--ei-renderia' not in a:
            sivu = f"visual/maailma.html?m={s['m']}&aa=2" + ('&taika=1' if s.get('taika') else '')
            r = subprocess.run(['node', 'render/lukittu.mjs', '--data', 'build/rattle_koko', '--page', sivu, '--koko', L['koko'], '--start', f'{t0:.3f}',
                                '--end', f'{t1:.3f}', '--workers', '2', '--chunk', '40', '--out', raaka], cwd=ROOT, capture_output=True, text=True, encoding='utf-8', errors='replace')
            if r.returncode != 0 or not os.path.exists(raaka):
                print(f"{s['id']}: RENDERI EPÄONNISTUI\n{(r.stdout or '')[-600:]}\n{(r.stderr or '')[-600:]}")
                continue
        tekstit = s.get(kieli) or []
        n = len(tekstit)
        # tekstien alut: tasavälein, tai 'alut': [null | [ankkuri, lisä s], ...] sitoo tekstin ankkuriin (esim. aalto alkaa)
        alut = [0.6 + i * (kesto - 1.2) / max(n, 1) for i in range(n)]
        for i, x in enumerate(s.get('alut') or []):
            if x and i < n:
                alut[i] = A[x[0]] + x[1] - t0
        cmd = ['ffmpeg', '-y', '-v', 'error', '-i', raaka]
        filt, edel = [], '0:v'
        for i, t in enumerate(tekstit):
            png = os.path.join(out, 'tyo', f"{s['id']}_{kieli}_{i + 1}.png")
            tekstikuva(t, W, H, png)
            ta, tb = alut[i], (alut[i + 1] - 0.5 if i + 1 < n else kesto - 0.6)
            cmd += ['-loop', '1', '-t', f'{kesto:.3f}', '-i', png]
            filt.append(f"[{i + 1}:v]format=rgba,fade=t=in:st={ta:.2f}:d=0.6:alpha=1,fade=t=out:st={tb - 0.6:.2f}:d=0.6:alpha=1[t{i}]")
            filt.append(f"[{edel}][t{i}]overlay=0:0:enable='between(t,{ta:.2f},{tb:.2f})'[v{i}]")
            edel = f'v{i}'
        valmis = os.path.join(out, f"{s['id']}_{kieli}.mp4")
        if n:
            cmd += ['-filter_complex', ';'.join(filt), '-map', f'[{edel}]', '-map', '0:a?']
        cmd += ['-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '256k', '-t', f'{kesto:.3f}', '-movflags', '+faststart', valmis]
        r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
        if r.returncode != 0:
            print(f"{s['id']}: TEKSTIEN LISÄYS EPÄONNISTUI\n{r.stderr[-800:]}")
            continue
        p = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=codec_type,width,height', '-of', 'csv=p=0', valmis], capture_output=True, text=True).stdout.split()
        print(f"{s['id']}: {t0:.2f}-{t1:.2f} s ({kesto:.1f} s) -> {os.path.relpath(valmis, ROOT)}  [{' '.join(p)}]")
        s['_alut'] = alut
        valmiit.append((s, valmis, kesto))
    if valmiit:
        from PIL import Image
        w, h = 270, 480
        arkki = Image.new('RGB', (w * 4, h * len(valmiit)))
        for j, (s, v, kesto) in enumerate(valmiit):
            n = max(1, len(s.get(kieli) or []))
            ajat = [0.2] + [x + 1.5 for x in (s.get('_alut') or [])][:3]
            for i, t in enumerate(ajat[:4]):
                raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', v, '-frames:v', '1', '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
                if len(raw) >= w * h * 3:
                    arkki.paste(Image.frombytes('RGB', (w, h), raw[:w * h * 3]), (i * w, j * h))
        arkki.save(os.path.join(out, f'kontakti_{kieli}.jpg'), quality=88)
        print('kontaktiarkki:', os.path.relpath(os.path.join(out, f'kontakti_{kieli}.jpg'), ROOT))


if __name__ == '__main__':
    main()
