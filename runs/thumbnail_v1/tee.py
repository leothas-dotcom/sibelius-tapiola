"""Kahdeksan pikkukuvaehdokasta (15.11.2026, käyttäjän pyyntö): neljä kohtausta vierekkäin, putki musiikki -> video (nuoli = magic),
teksti "Fable 5.2 ...". Kaikki koodilla: ruudut omasta videosta (runs/vedos_v8/koko.mp4), aaltomuoto työäänityksen äänestä (vain muoto).
  python -I runs/thumbnail_v1/tee.py"""
import wave, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
K = 'runs/thumbnail_v1/'; W, H = 1280, 720
F = 'C:/Windows/Fonts/'
def font(n, s): return ImageFont.truetype(F + n, s)
IMP = lambda s: font('impact.ttf', s); BAH = lambda s: font('bahnschrift.ttf', s); GEO = lambda s: font('georgiab.ttf', s); SEG = lambda s: font('segoeuib.ttf', s)
KELT, VALK, MUSTA, TURK, PUN = (255, 214, 64), (246, 243, 236), (8, 10, 14), (96, 232, 190), (255, 96, 80)

def ruutu(t, kirk=1.45, kontr=1.18, vari=1.35):
    im = Image.open(K + 'ruudut/r%d.png' % t).convert('RGB')
    im = ImageEnhance.Brightness(im).enhance(kirk); im = ImageEnhance.Contrast(im).enhance(kontr); return ImageEnhance.Color(im).enhance(vari)
R = {'metsa': ruutu(97, 1.9, 1.25), 'horisontti': ruutu(232, 1.5), 'jaa': ruutu(397, 1.9, 1.25), 'aurinko': ruutu(682, 1.15, 1.1, 1.2),
     'myrsky': ruutu(877, 1.25), 'revontuli': ruutu(967, 1.7, 1.2, 1.6), 'aamu': ruutu(1042, 1.35, 1.1, 1.4)}
NELJA = ['metsa', 'aurinko', 'myrsky', 'revontuli']

def tayta(im, w, h, cx=0.5, cy=0.5):
    s = max(w / im.width, h / im.height); a = im.resize((int(im.width * s + 1), int(im.height * s + 1)), Image.LANCZOS)
    x = int((a.width - w) * cx); y = int((a.height - h) * cy); return a.crop((x, y, x + w, y + h))

def aalto(n):
    w = wave.open('runs/vedos_v8/aani.wav'); a = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').reshape(-1, 2).mean(1)
    k = len(a) // n; e = np.sqrt((a[:k * n].reshape(n, k) ** 2).mean(1)); e = e / e.max(); return e ** 0.6
A = aalto(400)

def aaltokuva(w, h, vari=VALK, n=64, lev=0.62):
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im); e = np.array([c.mean() for c in np.array_split(A, n)]); e = e / e.max(); s = w / n
    for i, v in enumerate(e):
        b = max(4, v * h * 0.95); x = i * s + s * (1 - lev) / 2; d.rounded_rectangle((x, (h - b) / 2, x + s * lev, (h + b) / 2), radius=s * lev / 2, fill=vari + (255,))
    return im

def tahti(d, cx, cy, r, vari):
    p = []
    for i in range(8):
        a = np.pi / 4 * i - np.pi / 2; rr = r if i % 2 == 0 else r * 0.26; p.append((cx + rr * np.cos(a), cy + rr * np.sin(a)))
    d.polygon(p, fill=vari)

def nuoli(d, x0, x1, y, pak, vari):
    d.rectangle((x0, y - pak / 2, x1 - pak * 1.6, y + pak / 2), fill=vari); d.polygon([(x1 - pak * 2.2, y - pak * 1.7), (x1, y), (x1 - pak * 2.2, y + pak * 1.7)], fill=vari)

def teksti(d, xy, s, f, vari=VALK, reuna=6, ank='la', rv=MUSTA):
    d.text(xy, s, font=f, fill=vari, stroke_width=reuna, stroke_fill=rv, anchor=ank)

def varjo(im, ylh=0.0, alh=0.0, voima=235):
    g = Image.new('L', (1, H)); px = g.load()
    for y in range(H):
        v = 0
        if ylh and y < H * ylh: v = max(v, (1 - y / (H * ylh)) ** 1.3)
        if alh and y > H * (1 - alh): v = max(v, ((y - H * (1 - alh)) / (H * alh)) ** 1.3)
        px[0, y] = int(voima * v)
    im.paste(Image.new('RGB', (W, H), MUSTA), (0, 0), g.resize((W, H)))

def kaistat(im, nimet, x0, y0, w, h, rako=8, vino=0):
    n = len(nimet); kw = (w - rako * (n - 1)) / n
    for i, nm in enumerate(nimet):
        x = x0 + i * (kw + rako); osa = tayta(R[nm], int(kw + abs(vino) + 2), h, 0.5, 0.5)
        m = Image.new('L', osa.size, 0); ImageDraw.Draw(m).polygon([(abs(vino), 0), (osa.width, 0), (osa.width - abs(vino), h), (0, h)] if vino else [(0, 0), (osa.width, 0), (osa.width, h), (0, h)], fill=255)
        im.paste(osa, (int(x - abs(vino) / 2), y0), m)

def putki(im, y, vari=KELT, x0=60, x1=1220, f=None, pieni=False):
    """MUSIC [aalto] --magic--> VIDEO"""
    d = ImageDraw.Draw(im); f = f or BAH(54 if not pieni else 40); kh = 74 if not pieni else 54
    teksti(d, (x0, y), 'MUSIC', f, VALK, 5, 'lm'); mw = d.textlength('MUSIC', font=f); vw = d.textlength('VIDEO', font=f)
    aw = int((x1 - x0) * 0.26); a = aaltokuva(aw, kh, VALK, 40); im.paste(a, (int(x0 + mw + 22), int(y - kh / 2)), a)
    nx0 = x0 + mw + 22 + aw + 26; nx1 = x1 - vw - 26; nuoli(d, nx0, nx1, y, 12 if not pieni else 9, vari)
    mf = BAH(30 if not pieni else 24); teksti(d, ((nx0 + nx1) / 2 - 10, y - (34 if not pieni else 26)), 'MAGIC', mf, vari, 4, 'mm')
    tahti(d, (nx0 + nx1) / 2 - 10 - d.textlength('MAGIC', font=mf) / 2 - 22, y - (34 if not pieni else 26), 15, vari)
    tahti(d, (nx0 + nx1) / 2 - 10 + d.textlength('MAGIC', font=mf) / 2 + 22, y - (34 if not pieni else 26), 15, vari)
    teksti(d, (x1, y), 'VIDEO', f, VALK, 5, 'rm')

def k1():  # neljä pystykaistaa, iso otsikko, putki alla
    im = Image.new('RGB', (W, H), MUSTA); kaistat(im, NELJA, 0, 0, W, H, 6); varjo(im, 0.42, 0.34); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 96), 'FABLE 5.2 IS INSANE', IMP(128), KELT, 8, 'mm'); teksti(d, (W / 2, 196), "It turned Sibelius' Tapiola into this", SEG(46), VALK, 5, 'mm')
    putki(im, 640); return im

def k2():  # vasemmalla musiikki, oikealla 2x2
    im = Image.new('RGB', (W, H), (10, 13, 20)); gx, gw, gh = 560, 352, 198
    for i, nm in enumerate(NELJA): im.paste(tayta(R[nm], gw, gh), (gx + (i % 2) * (gw + 8), 150 + (i // 2) * (gh + 8)))
    d = ImageDraw.Draw(im); teksti(d, (40, 78), 'FABLE 5.2 IS UNREAL', IMP(96), KELT, 0, 'lm')
    a = aaltokuva(400, 200, VALK, 44); im.paste(a, (40, 250), a); teksti(d, (240, 200), 'MUSIC', BAH(52), VALK, 0, 'mm')
    nuoli(d, 452, 548, 350, 14, KELT); tahti(d, 500, 300, 22, KELT); teksti(d, (500, 408), 'MAGIC', BAH(30), KELT, 0, 'mm')
    teksti(d, (gx + gw + 4, 590), 'VIDEO', BAH(52), VALK, 0, 'mm'); teksti(d, (40, 640), "Sibelius · Tapiola", GEO(60), VALK, 0, 'lm'); teksti(d, (40, 520), 'Every frame drawn in code', SEG(34), (190, 196, 208), 0, 'lm'); return im

def k3():  # revontuli koko kuvana, kaistat alla
    im = tayta(R['revontuli'], W, H, 0.5, 0.35); varjo(im, 0.36, 0.5); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 86), 'AI HEARD SIBELIUS.', IMP(104), VALK, 7, 'mm'); teksti(d, (W / 2, 196), 'THEN IT DREW THIS.', IMP(104), TURK, 7, 'mm')
    kaistat(im, ['metsa', 'aurinko', 'myrsky', 'aamu'], 60, 440, 1160, 150, 10); putki(im, 652, TURK, pieni=True)
    teksti(d, (1220, 290), 'FABLE 5.2', BAH(46), KELT, 5, 'rm'); return im

def k4():  # punainen aurinko, putki keskellä
    im = tayta(R['aurinko'], W, H, 0.5, 0.5); varjo(im, 0.34, 0.36); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 92), 'FABLE 5.2 IS INSANE', IMP(124), VALK, 8, 'mm'); putki(im, 250, KELT)
    kaistat(im, ['metsa', 'jaa', 'myrsky', 'revontuli'], 60, 500, 1160, 160, 10); teksti(d, (W / 2, 690), "Sibelius · Tapiola · drawn note by note", SEG(30), VALK, 4, 'mm'); return im

def k5():  # vinot kaistat
    im = Image.new('RGB', (W, H), MUSTA); kaistat(im, NELJA, -40, 0, W + 80, H, 10, vino=90); varjo(im, 0.0, 0.5); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 150), fill=KELT); teksti(d, (W / 2, 76), 'FABLE 5.2 IS INSANE', IMP(120), MUSTA, 0, 'mm')
    putki(im, 560); teksti(d, (W / 2, 666), "An AI visualization of Sibelius' Tapiola", SEG(42), VALK, 5, 'mm'); return im

def k6():  # puolikkaat: ääni | kuva
    im = Image.new('RGB', (W, H), (6, 8, 12)); im.paste(tayta(R['revontuli'], 700, H, 0.55, 0.4), (580, 0))
    g = Image.new('L', (160, 1)); [g.putpixel((x, 0), int(255 * (1 - x / 159) ** 1.5)) for x in range(160)]; im.paste(Image.new('RGB', (160, H), (6, 8, 12)), (580, 0), g.resize((160, H)))
    d = ImageDraw.Draw(im); a = aaltokuva(480, 300, VALK, 48); im.paste(a, (50, 250), a)
    teksti(d, (290, 200), 'SOUND IN', BAH(56), VALK, 0, 'mm'); teksti(d, (930, 610), 'FOREST OUT', BAH(56), VALK, 5, 'mm')
    nuoli(d, 520, 690, 400, 16, KELT); tahti(d, 600, 340, 26, KELT); teksti(d, (600, 462), 'MAGIC', BAH(36), KELT, 5, 'mm')
    teksti(d, (W / 2, 80), 'FABLE 5.2 IS INSANE', IMP(112), KELT, 8, 'mm'); teksti(d, (290, 640), "Sibelius · Tapiola", GEO(48), VALK, 0, 'mm'); return im

def k7():  # 2x2 koko kuva, merkki keskellä
    im = Image.new('RGB', (W, H), MUSTA)
    for i, nm in enumerate(NELJA): im.paste(tayta(R[nm], 637, 357), ((i % 2) * 643, (i // 2) * 363))
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); do = ImageDraw.Draw(o); do.rounded_rectangle((250, 232, 1030, 488), radius=28, fill=(8, 10, 14, 232), outline=KELT + (255,), width=6); im.paste(o, (0, 0), o)
    d = ImageDraw.Draw(im); teksti(d, (W / 2, 300), 'FABLE 5.2 IS INSANE', IMP(86), KELT, 0, 'mm'); putki(im, 400, KELT, 290, 990, pieni=True)
    teksti(d, (W / 2, 458), "Sibelius · Tapiola", GEO(34), VALK, 0, 'mm'); return im

def k8():  # myrsky koko kuvana
    im = tayta(R['myrsky'], W, H); im = ImageEnhance.Brightness(im).enhance(0.8); varjo(im, 0.4, 0.42); d = ImageDraw.Draw(im)
    teksti(d, (60, 90), 'NO CAMERA.', IMP(118), VALK, 8, 'lm'); teksti(d, (60, 212), 'JUST MUSIC + FABLE 5.2', IMP(118), KELT, 8, 'lm')
    kaistat(im, ['metsa', 'aurinko', 'revontuli', 'aamu'], 60, 330, 1160, 190, 10); putki(im, 630); return im

# --- 9-12: "analyysi": aaltomuoto + voima + tuulen nopeus (sama malli kuin videossa: voimakkuus = voima, kitka, vauhti kertyy) ---
CON = lambda s: font('consolab.ttf', s); OTS = 'FABLE 5.2 IS INCREDIBLE'
def tuuli(n=400, tau=14.0):
    v = 0.0; o = np.zeros(n)
    for i in range(n): v += (A[i] ** 2 - v / tau) / 6; o[i] = v
    return o / o.max()
TU = tuuli()

def kayra(d, x, y, w, h, data, vari, pak=4, tayte=None):
    p = [(x + i * w / (len(data) - 1), y + h - v * h) for i, v in enumerate(data)]
    if tayte: d.polygon(p + [(x + w, y + h), (x, y + h)], fill=tayte)
    d.line(p, fill=vari, width=pak, joint='curve'); return p

def paneeli(im, x, y, w, h, kohta=0.72, tausta=(8, 12, 20, 225), fk=None):
    """Mittaripaneeli: AUDIO (aalto), FORCE (voimakkuus), WIND SPEED (kertymä kitkalla); pystyviiva = soittokohta."""
    o = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(o); d.rounded_rectangle((x, y, x + w, y + h), radius=18, fill=tausta, outline=(70, 90, 120, 255), width=2)
    m = 22; ix, iw = x + m, w - 2 * m; rh = (h - 2 * m) / 3
    for i in range(1, 8): d.line((ix + iw * i / 8, y + m, ix + iw * i / 8, y + h - m), fill=(50, 64, 86, 255), width=1)
    for r in range(1, 3): d.line((ix, y + m + rh * r, ix + iw, y + m + rh * r), fill=(70, 90, 120, 255), width=1)
    a = aaltokuva(int(iw), int(rh - 34), VALK, 90, 0.6); o.paste(a, (int(ix), int(y + m + 28)), a)
    kayra(d, ix, y + m + rh + 30, iw, rh - 40, A, KELT, 3, KELT + (50,)); p = kayra(d, ix, y + m + 2 * rh + 30, iw, rh - 40, TU, TURK, 5, TURK + (50,))
    f = CON(fk or max(15, int(h / 20))); d.text((ix, y + m), 'AUDIO  44.1 kHz', font=f, fill=(200, 208, 222, 255)); d.text((ix, y + m + rh + 4), 'LOUDNESS = FORCE', font=f, fill=KELT + (255,))
    d.text((ix, y + m + 2 * rh + 4), 'WIND SPEED  (F = ma)', font=f, fill=TURK + (255,))
    kx = ix + iw * kohta; d.line((kx, y + m, kx, y + h - m), fill=PUN + (255,), width=3); py = p[int(kohta * (len(p) - 1))][1]; d.ellipse((kx - 9, py - 9, kx + 9, py + 9), fill=PUN + (255,), outline=VALK + (255,), width=2)
    arvo = '%d %%' % round(TU[int(kohta * 399)] * 100); tw = d.textlength(arvo, font=f); bx = kx + 14 if kx + 24 + tw < x + w else kx - 24 - tw
    d.rounded_rectangle((bx, py - 34, bx + tw + 14, py - 6), radius=6, fill=PUN + (255,)); d.text((bx + 7, py - 31), arvo, font=f, fill=MUSTA + (255,))
    im.paste(o, (0, 0), o)

def k9():  # paneeli vasemmalla, nuoli, 2x2 oikealla
    im = Image.new('RGB', (W, H), (9, 12, 19)); gx, gw, gh = 700, 266, 232
    for i, nm in enumerate(NELJA): im.paste(tayta(R[nm], gw, gh), (gx + (i % 2) * (gw + 8), 176 + (i // 2) * (gh + 8)))
    paneeli(im, 40, 176, 520, 472); d = ImageDraw.Draw(im); teksti(d, (W / 2, 84), OTS, IMP(122), KELT, 0, 'mm')
    nuoli(d, 578, 686, 412, 16, KELT); tahti(d, 628, 352, 24, KELT); teksti(d, (628, 470), 'MAGIC', BAH(32), KELT, 0, 'mm')
    teksti(d, (300, 684), 'SOUND', BAH(44), VALK, 0, 'mm'); teksti(d, (970, 684), 'PICTURE', BAH(44), VALK, 0, 'mm'); return im

def k10():  # myrsky koko kuvana, paneeli päällä
    im = tayta(R['myrsky'], W, H); im = ImageEnhance.Brightness(im).enhance(0.85); varjo(im, 0.36, 0.3); paneeli(im, 50, 190, 560, 380, 0.8); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 90), OTS, IMP(122), KELT, 8, 'mm'); nuoli(d, 630, 800, 380, 16, KELT); tahti(d, 705, 322, 24, KELT); teksti(d, (705, 438), 'MAGIC', BAH(32), KELT, 5, 'mm')
    teksti(d, (1020, 380), 'SNOWSTORM', BAH(60), VALK, 6, 'mm'); teksti(d, (330, 630), 'SOUND', BAH(50), VALK, 6, 'mm'); teksti(d, (1020, 630), 'PICTURE', BAH(50), VALK, 6, 'mm')
    teksti(d, (W / 2, 692), "Sibelius · Tapiola", GEO(30), VALK, 4, 'mm'); return im

def k11():  # paneeli ylhäällä koko leveydeltä, neljä kohtausta alla
    im = Image.new('RGB', (W, H), (9, 12, 19)); kaistat(im, NELJA, 40, 520, 1200, 180, 10); paneeli(im, 40, 140, 1200, 320, 0.66, fk=24); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 76), OTS, IMP(118), KELT, 0, 'mm')
    for i in (0, 3):
        cx = 40 + 1200 / 8 * (2 * i + 1); d.rectangle((cx - 6, 464, cx + 6, 492), fill=KELT); d.polygon([(cx - 22, 490), (cx + 22, 490), (cx, 516)], fill=KELT)
    teksti(d, (500, 490), 'SOUND', BAH(42), VALK, 0, 'mm'); nuoli(d, 580, 690, 490, 10, KELT); teksti(d, (790, 490), 'PICTURE', BAH(42), VALK, 0, 'mm'); return im

def k12():  # revontuli koko kuvana, tuulikäyrä kuvan päällä
    im = tayta(R['revontuli'], W, H, 0.5, 0.35); varjo(im, 0.36, 0.42); o = Image.new('RGBA', im.size, (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    a = aaltokuva(1180, 150, VALK, 110, 0.55); o.paste(a, (50, 500), a); g = Image.new('RGBA', im.size, (0, 0, 0, 0)); kayra(ImageDraw.Draw(g), 50, 250, 1180, 220, TU, KELT + (255,), 22); g = g.filter(ImageFilter.GaussianBlur(14)); o.alpha_composite(g); d = ImageDraw.Draw(o); p = kayra(d, 50, 250, 1180, 220, TU, KELT, 8)
    i = int(0.72 * 399); x, y = p[i]; d.ellipse((x - 13, y - 13, x + 13, y + 13), fill=PUN + (255,), outline=VALK + (255,), width=3); im.paste(o, (0, 0), o); d = ImageDraw.Draw(im)
    teksti(d, (x + 24, y + 44), 'WIND SPEED %d %%' % round(TU[i] * 100), CON(34), VALK, 5, 'lm'); teksti(d, (W / 2, 90), OTS, IMP(122), KELT, 8, 'mm')
    teksti(d, (W / 2, 190), 'It listens. It measures. It draws.', SEG(44), VALK, 5, 'mm'); teksti(d, (60, 680), 'SOUND', BAH(46), VALK, 5, 'lm'); nuoli(d, 220, 1010, 680, 12, KELT)
    tahti(d, 560, 640, 18, KELT); teksti(d, (630, 642), 'MAGIC', BAH(30), KELT, 4, 'mm'); teksti(d, (1220, 680), 'PICTURE', BAH(46), VALK, 5, 'rm'); return im

ims = [k() for k in (k1, k2, k3, k4, k5, k6, k7, k8)]
uudet = [k() for k in (k9, k10, k11, k12)]
for i, im in enumerate(uudet): im.save(K + 'thumb_%d.jpg' % (i + 9), quality=93)
ark2 = Image.new('RGB', (W * 2 + 20, H * 2 + 20), (40, 40, 40))
for i, im in enumerate(uudet): ark2.paste(im, ((i % 2) * (W + 20), (i // 2) * (H + 20)))
ark2.resize((ark2.width // 2, ark2.height // 2), Image.LANCZOS).save(K + 'arkki_analyysi.jpg', quality=90)
for i, im in enumerate(ims): im.save(K + 'thumb_%d.jpg' % (i + 1), quality=93)
ark = Image.new('RGB', (W * 2 + 20, (H + 20) * 4 - 20), (40, 40, 40))
for i, im in enumerate(ims): ark.paste(im, ((i % 2) * (W + 20), (i // 2) * (H + 20)))
ark.resize((ark.width // 2, ark.height // 2), Image.LANCZOS).save(K + 'arkki.jpg', quality=90); print('ok')
