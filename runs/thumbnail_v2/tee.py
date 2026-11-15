"""Pikkukuvat, kierros 2 (15.11.2026): ääni MUUTTUU kuvaksi. Aaltomuodon pylväät levenevät ja kasvavat ikkunoiksi, joista metsä näkyy:
vasemmalla pelkkä ääni, oikealla koko kuva. Tekstit käyttäjän omista reaktioista (haastattelu): kylmät väreet, itku, alttoviulut = tuuli.
Kaikki koodilla: ruudut omasta videosta, pylväiden korkeudet äänen voimakkuudesta.
  python -I runs/thumbnail_v2/tee.py"""
import wave, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
K = 'runs/thumbnail_v2/'; RU = 'runs/thumbnail_v1/ruudut/'; W, H = 1280, 720; F = 'C:/Windows/Fonts/'
font = lambda n, s: ImageFont.truetype(F + n, s); IMP = lambda s: font('impact.ttf', s); BAH = lambda s: font('bahnschrift.ttf', s); SEG = lambda s: font('segoeuib.ttf', s)
KELT, VALK, MUSTA = (255, 214, 64), (248, 246, 240), (5, 7, 11)

def ruutu(t, kirk, kontr=1.15, vari=1.3):
    im = Image.open(RU + 'r%d.png' % t).convert('RGB'); im = ImageEnhance.Brightness(im).enhance(kirk); im = ImageEnhance.Contrast(im).enhance(kontr); return ImageEnhance.Color(im).enhance(vari)
def tayta(im, w, h, cx=0.5, cy=0.5):
    s = max(w / im.width, h / im.height); a = im.resize((int(im.width * s + 1), int(im.height * s + 1)), Image.LANCZOS); x = int((a.width - w) * cx); y = int((a.height - h) * cy); return a.crop((x, y, x + w, y + h))
R = {'metsa': ruutu(97, 1.9, 1.25), 'aurinko': ruutu(682, 1.15, 1.1, 1.2), 'myrsky': ruutu(877, 1.3), 'revontuli': ruutu(967, 1.7, 1.2, 1.6), 'aamu': ruutu(1042, 1.35, 1.1, 1.4), 'jaa': ruutu(397, 1.9, 1.25)}

def verho(n):
    w = wave.open('runs/vedos_v8/aani.wav'); a = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').reshape(-1, 2).mean(1)
    a = a[int(775 * 44100):int(850 * 44100)]  # 12:55-14:10: myrskyn nousu, isoin dynamiikka
    e = np.array([np.sqrt((c.astype('f8') ** 2).mean()) for c in np.array_split(a, n)]); return (e / e.max()) ** 0.8
N = 46; E = verho(N)

def muunnos(nimi, cx=0.5, cy=0.5, alku=0.24, keski=0.56):
    """Ääni -> kuva: pylväs i on ikkuna kuvaan; leveys ja korkeus kasvavat vasemmalta oikealle, valkoinen täyttö haihtuu."""
    kuva = tayta(R[nimi], W, H, cx, cy); im = Image.new('RGB', (W, H), MUSTA); m = Image.new('L', (W, H), 0); dm = ImageDraw.Draw(m)
    v = Image.new('L', (W, H), 0); dv = ImageDraw.Draw(v); slot = W / N; yk = H * keski
    for i in range(N):
        p = i / (N - 1); q = 0 if p < alku else ((p - alku) / (1 - alku)) ** 1.5; x = (i + 0.5) * slot
        lev = 12 + (slot + 2 - 12) * min(1, q * 1.9); kor = (0.08 + 0.50 * E[i]) * H * (1 - q) + H * 2.2 * q
        y0, y1 = max(0, yk - kor / 2), min(H, yk + kor / 2); r = lev / 2 * (1 - min(1, q * 1.6))
        dm.rounded_rectangle((x - lev / 2, y0, x + lev / 2, y1), radius=r, fill=255)
        dv.rounded_rectangle((x - lev / 2, y0, x + lev / 2, y1), radius=r, fill=int(255 * (1 - min(1, q * 2.4)) ** 1.2))
    im.paste(kuva, (0, 0), m); im.paste(Image.new('RGB', (W, H), VALK), (0, 0), v)
    g = im.filter(ImageFilter.GaussianBlur(10)); hm = Image.new('L', (W, H), 0); ImageDraw.Draw(hm).rectangle((0, 0, int(W * 0.62), H), fill=70); return Image.composite(g, im, hm.filter(ImageFilter.GaussianBlur(80))) if False else im

def tahti(d, cx, cy, r, vari):
    d.polygon([(cx + (r if i % 2 == 0 else r * 0.22) * np.cos(np.pi / 4 * i - np.pi / 2), cy + (r if i % 2 == 0 else r * 0.22) * np.sin(np.pi / 4 * i - np.pi / 2)) for i in range(8)], fill=vari)
def kipinat(im, x0, x1, siemen, vari=KELT, n=26):
    """Taika: tähtiä muunnoksen saumassa (siemenellinen satunnaisuus)."""
    rng = np.random.default_rng(siemen); o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o)
    for _ in range(n):
        x = rng.uniform(x0, x1); y = H * 0.56 + rng.normal(0, 120); r = rng.uniform(5, 22); tahti(d, x, y, r, vari + (int(rng.uniform(150, 255)),))
    h = o.filter(ImageFilter.GaussianBlur(9)); im.paste(h, (0, 0), h); im.paste(o, (0, 0), o)
def teksti(d, xy, s, f, vari=VALK, reuna=7, ank='la'): d.text(xy, s, font=f, fill=vari, stroke_width=reuna, stroke_fill=MUSTA, anchor=ank)
def varjo(im, ylh=0.0, alh=0.0, voima=230):
    g = Image.new('L', (1, H)); px = g.load()
    for y in range(H):
        a = (1 - y / (H * ylh)) ** 1.3 if ylh and y < H * ylh else 0; b = ((y - H * (1 - alh)) / (H * alh)) ** 1.3 if alh and y > H * (1 - alh) else 0; px[0, y] = int(voima * max(a, b))
    im.paste(Image.new('RGB', (W, H), MUSTA), (0, 0), g.resize((W, H)))
def alarivi(im, vasen='SOUND', oikea='PICTURE', vari=KELT):
    d = ImageDraw.Draw(im); f = BAH(50); teksti(d, (44, 668), vasen, f, VALK, 6, 'lm'); teksti(d, (W - 44, 668), oikea, f, VALK, 6, 'rm')
    x0 = 44 + d.textlength(vasen, font=f) + 26; x1 = W - 44 - d.textlength(oikea, font=f) - 26; d.rectangle((x0 - 3, 659, x1 - 26, 677), fill=MUSTA); d.polygon([(x1 - 40, 642), (x1 + 4, 668), (x1 - 40, 694)], fill=MUSTA)
    d.rectangle((x0, 662, x1 - 28, 674), fill=vari); d.polygon([(x1 - 36, 648), (x1, 668), (x1 - 36, 688)], fill=vari)

def a1():  # metsä: otsikko käyttäjän pyynnön mukaan
    im = muunnos('metsa', 0.42, 0.5); varjo(im, 0.34, 0.26); kipinat(im, 330, 700, 1); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 92), 'FABLE 5.2 IS INCREDIBLE', IMP(124), KELT, 9, 'mm'); alarivi(im); return im
def a2():  # punainen aurinko: se kuuli tämän ja piirsi tämän
    im = muunnos('aurinko', 0.5, 0.5); varjo(im, 0.36, 0.26); kipinat(im, 330, 700, 2); d = ImageDraw.Draw(im)
    teksti(d, (44, 86), 'IT HEARD THIS', IMP(118), VALK, 9, 'lm'); teksti(d, (W - 44, 212), 'AND DREW THIS', IMP(118), KELT, 9, 'rm'); alarivi(im, 'SIBELIUS', 'FABLE 5.2'); return im
def a3():  # revontuli: käyttäjän oma reaktio ("itken täällä")
    im = muunnos('revontuli', 0.5, 0.3); varjo(im, 0.36, 0.26); kipinat(im, 330, 700, 3); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 92), 'AN AI MADE ME CRY', IMP(138), KELT, 9, 'mm'); teksti(d, (W / 2, 198), 'I play in an orchestra. Fable 5.2 drew what I hear.', SEG(40), VALK, 5, 'mm'); alarivi(im); return im
def a4():  # lumimyrsky: alttoviulut ovat tuuli
    im = muunnos('myrsky', 0.5, 0.5); varjo(im, 0.36, 0.26); kipinat(im, 330, 700, 4, VALK); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 92), 'THE VIOLAS ARE THE WIND', IMP(124), KELT, 9, 'mm'); teksti(d, (W / 2, 196), 'Fable 5.2 turned an orchestra into a forest', SEG(42), VALK, 5, 'mm'); alarivi(im, 'SOUND', 'SNOWSTORM'); return im
def a5():  # aamu (loppu): kylmät väreet
    im = muunnos('aamu', 0.5, 0.45); varjo(im, 0.36, 0.26); kipinat(im, 330, 700, 5); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 92), 'THIS GAVE ME CHILLS', IMP(132), KELT, 9, 'mm'); teksti(d, (W / 2, 198), "Sibelius' last forest, drawn from sound by Fable 5.2", SEG(40), VALK, 5, 'mm'); alarivi(im); return im
def a6():  # metsä, lyhyin lupaus
    im = muunnos('metsa', 0.42, 0.5); varjo(im, 0.36, 0.26); kipinat(im, 330, 700, 6); d = ImageDraw.Draw(im)
    teksti(d, (44, 86), 'SOUND IN.', IMP(118), VALK, 9, 'lm'); teksti(d, (W - 44, 212), 'FOREST OUT.', IMP(118), KELT, 9, 'rm'); alarivi(im, 'SIBELIUS', 'FABLE 5.2'); return im

ims = [k() for k in (a1, a2, a3, a4, a5, a6)]
for i, im in enumerate(ims): im.save(K + 'thumb_%s.jpg' % 'ABCDEF'[i], quality=93)
ark = Image.new('RGB', (W * 2 + 20, (H + 20) * 3 + 200), (40, 40, 40))
for i, im in enumerate(ims): ark.paste(im, ((i % 2) * (W + 20), (i // 2) * (H + 20))); ark.paste(im.resize((320, 180), Image.LANCZOS), (i * 340, 3 * (H + 20)))
ark.resize((ark.width // 2, ark.height // 2), Image.LANCZOS).save(K + 'arkki.jpg', quality=90); print('ok')

# --- Lopullinen suunta (käyttäjä 15.11.2026): iso keltainen FABLE 5.2, SOUND -> SNOWSTORM, Sibelius ja Tapiola mainittu ---
R['myrsky'] = ruutu(877, 1.45, 1.3, 1.35); GEO = lambda s: font('georgiab.ttf', s)
def l1():  # otsikko vasemmalla ylhäällä, Sibelius · Tapiola sen alla
    im = muunnos('myrsky', 0.5, 0.5, 0.22, 0.60); varjo(im, 0.30, 0.26); kipinat(im, 330, 700, 4, KELT, 30); d = ImageDraw.Draw(im)
    teksti(d, (40, 112), 'FABLE 5.2', IMP(210), KELT, 11, 'lm'); teksti(d, (W - 44, 84), 'SIBELIUS', BAH(74), VALK, 7, 'rm'); teksti(d, (W - 44, 164), 'TAPIOLA', BAH(74), VALK, 7, 'rm')
    alarivi(im, 'SOUND', 'SNOWSTORM'); return im
def l2():  # otsikko keskellä, Sibelius: Tapiola rivinä alla
    im = muunnos('myrsky', 0.5, 0.5, 0.22, 0.62); varjo(im, 0.34, 0.26); kipinat(im, 330, 700, 4, KELT, 30); d = ImageDraw.Draw(im)
    teksti(d, (W / 2, 104), 'FABLE 5.2', IMP(196), KELT, 11, 'mm'); teksti(d, (W / 2, 226), "draws Sibelius' Tapiola", GEO(60), VALK, 7, 'mm'); alarivi(im, 'SOUND', 'SNOWSTORM'); return im
def l3():  # kuten l1, mutta alarivillä Sibelius ja Tapiola
    im = muunnos('myrsky', 0.5, 0.5, 0.22, 0.58); varjo(im, 0.30, 0.30); kipinat(im, 330, 700, 4, KELT, 30); d = ImageDraw.Draw(im)
    teksti(d, (40, 112), 'FABLE 5.2', IMP(210), KELT, 11, 'lm'); teksti(d, (W - 44, 100), 'SOUND', BAH(60), VALK, 7, 'rm'); teksti(d, (W - 44, 176), '→ SNOWSTORM', font('segoeuib.ttf', 60), VALK, 7, 'rm')
    teksti(d, (W / 2, 664), 'SIBELIUS · TAPIOLA', BAH(64), VALK, 7, 'mm'); return im
lo = [k() for k in (l1, l2, l3)]
for i, im in enumerate(lo): im.save(K + 'lopullinen_%d.jpg' % (i + 1), quality=94)
ark = Image.new('RGB', (W * 3 + 40, H + 200), (40, 40, 40))
for i, im in enumerate(lo): ark.paste(im, (i * (W + 20), 0)); ark.paste(im.resize((320, 180), Image.LANCZOS), (i * (W + 20), H + 10))
ark.resize((ark.width // 2, ark.height // 2), Image.LANCZOS).save(K + 'lopullinen_arkki.jpg', quality=92)

# --- Kierros 3 (käyttäjä 15.11.2026: kuvasta pitää SELVITÄ mitä tapahtuu ilman tekstiä): ääni -> koodi -> kuva yhdessä kuvassa.
# Vasemmalla aaltomuoto, keskellä sama kuva piirtyy projektin oikeasta koodista (visual/maailma_09.js, myrskyn moduuli), oikealla valmis kuva.
CONB = lambda s: font('consolab.ttf', s)
def koodirivit():
    t = open('visual/maailma_09.js', encoding='utf-8').read(); o = []
    for r in t.replace('\t', '  ').split('\n'):
        for p in r.split('; '):
            p = p.strip()
            if 12 < len(p) and not p.startswith('//') and not p.startswith('*') and all(ord(c) < 128 for c in p): o.append(p)
    return o
KR = koodirivit()
def ss(a, b, x): t = np.clip((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)

def kolmivaihe(nimi, cx=0.5, cy=0.5, fs=23, siemen=7, alku=160):
    kuva = np.asarray(tayta(R[nimi], W, H, cx, cy)).astype('f4') / 255; X = np.linspace(0, 1, W)[None, :, None]
    # koodi maskina
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m); f = CONB(fs); lh = fs + 5; rng = np.random.default_rng(siemen)
    for i in range(H // lh + 1):
        s = KR[(alku + i) % len(KR)]; d.text((int(W * 0.20) + int(rng.integers(0, 4)) * 26, i * lh), s[:70], font=f, fill=255)
    M = np.asarray(m).astype('f4')[:, :, None] / 255
    kirkas = np.clip(kuva * 2.3 + 0.12, 0, 1); kvari = np.array([0.72, 0.90, 1.0])[None, None, :] * (1 - ss(0.30, 0.52, X)) + kirkas * ss(0.30, 0.52, X)
    ka = M * ss(0.20, 0.27, X) * (1 - ss(0.60, 0.74, X)); ia = ss(0.47, 0.70, X)
    out = np.zeros((H, W, 3), 'f4') + np.array(MUSTA)[None, None, :] / 255; out = out * (1 - ka) + kvari * ka; out = out * (1 - ia) + kuva * ia
    im = Image.fromarray((np.clip(out, 0, 1) * 255).astype('u1'))
    # aaltomuoto vasemmalla
    d = ImageDraw.Draw(im); n = 15; slot = W * 0.215 / n
    for i in range(n):
        x = 26 + (i + 0.5) * slot; k = (0.10 + 0.55 * E[i * 2 + 6]) * H * 0.62; d.rounded_rectangle((x - 6, H * 0.56 - k / 2, x + 6, H * 0.56 + k / 2), radius=6, fill=VALK)
    return im

def merkit(im, sanat, vari=KELT):
    """Kolme sanaa alhaalla vyöhykkeiden alla, nuolet välissä."""
    d = ImageDraw.Draw(im); f = BAH(52); xs = [W * 0.125, W * 0.435, W * 0.82]; y = 668
    for s, x in zip(sanat, xs): teksti(d, (x, y), s, f, VALK, 7, 'mm')
    for i in range(2):
        a = xs[i] + d.textlength(sanat[i], font=f) / 2 + 22; b = xs[i + 1] - d.textlength(sanat[i + 1], font=f) / 2 - 22
        d.rectangle((a - 3, y - 9, b - 22, y + 9), fill=MUSTA); d.polygon([(b - 34, y - 26), (b + 5, y), (b - 34, y + 26)], fill=MUSTA)
        d.rectangle((a, y - 6, b - 24, y + 6), fill=vari); d.polygon([(b - 30, y - 20), (b, y), (b - 30, y + 20)], fill=vari)

def m1():
    im = kolmivaihe('myrsky'); varjo(im, 0.30, 0.24); kipinat(im, 700, 860, 11, KELT, 16); d = ImageDraw.Draw(im)
    teksti(d, (40, 112), 'FABLE 5.2', IMP(210), KELT, 11, 'lm'); teksti(d, (W - 44, 84), 'SIBELIUS', BAH(74), VALK, 7, 'rm'); teksti(d, (W - 44, 164), 'TAPIOLA', BAH(74), VALK, 7, 'rm')
    merkit(im, ('SOUND', 'CODE', 'SNOWSTORM')); return im
def m2():
    im = kolmivaihe('aurinko', 0.62, 0.5, siemen=8); varjo(im, 0.30, 0.24); kipinat(im, 700, 860, 12, KELT, 16); d = ImageDraw.Draw(im)
    teksti(d, (40, 112), 'FABLE 5.2', IMP(210), KELT, 11, 'lm'); teksti(d, (W - 44, 84), 'SIBELIUS', BAH(74), VALK, 7, 'rm'); teksti(d, (W - 44, 164), 'TAPIOLA', BAH(74), VALK, 7, 'rm')
    merkit(im, ('SOUND', 'CODE', 'FOREST')); return im
def m3():  # ilman alarivin sanoja: kuva yksin
    im = kolmivaihe('myrsky'); varjo(im, 0.30, 0.0); kipinat(im, 700, 860, 11, KELT, 16); d = ImageDraw.Draw(im)
    teksti(d, (40, 112), 'FABLE 5.2', IMP(210), KELT, 11, 'lm'); teksti(d, (W - 44, 650), 'SIBELIUS · TAPIOLA', BAH(60), VALK, 7, 'rm'); return im
mm = [k() for k in (m1, m2, m3)]
for i, im in enumerate(mm): im.save(K + 'koodi_%d.jpg' % (i + 1), quality=94)
ark = Image.new('RGB', (W * 3 + 40, H + 200), (40, 40, 40))
for i, im in enumerate(mm): ark.paste(im, (i * (W + 20), 0)); ark.paste(im.resize((320, 180), Image.LANCZOS), (i * (W + 20), H + 10)); ark.paste(im.resize((168, 94), Image.LANCZOS), (i * (W + 20) + 340, H + 10))
ark.resize((ark.width // 2, ark.height // 2), Image.LANCZOS).save(K + 'koodi_arkki.jpg', quality=92)

# --- Kierros 4 (käyttäjä valitsi: ääniaalto -> lumimyrsky; "tee monta versiota", "mieti luettavuutta", pari vastaavaa muilla kuvilla) ---
R['metsa'] = ruutu(97, 2.0, 1.3, 1.35); R['revontuli'] = ruutu(967, 1.8, 1.25, 1.7); R['aurinko'] = ruutu(682, 1.2, 1.15, 1.25)
def muunnos2(nimi, n=30, pak=18, cx=0.5, cy=0.5, alku=0.22, keski=0.60, kiinni=0.5):
    """Kuten muunnos, mutta luettavampi: vähemmän ja paksummat pylväät, ja kuva sulkeutuu ehjäksi (ei rakoja) kun q > kiinni."""
    e = np.array([c.mean() for c in np.array_split(E, n)]); e = e / e.max()
    kuva = tayta(R[nimi], W, H, cx, cy); im = Image.new('RGB', (W, H), MUSTA); m = Image.new('L', (W, H), 0); dm = ImageDraw.Draw(m); v = Image.new('L', (W, H), 0); dv = ImageDraw.Draw(v); slot = W / n; yk = H * keski
    for i in range(n):
        p = i / (n - 1); q = 0 if p < alku else ((p - alku) / (1 - alku)) ** 1.4; x = (i + 0.5) * slot
        if q > kiinni: dm.rectangle((x - slot / 2 - 1, 0, W, H), fill=255); break
        lev = pak + (slot + 2 - pak) * min(1, q / kiinni) ** 1.2; kor = (0.08 + 0.50 * e[i]) * H * (1 - q) + H * 2.4 * q / kiinni * 0.6
        y0, y1 = max(0, yk - kor / 2), min(H, yk + kor / 2); r = lev / 2 * (1 - min(1, q / kiinni * 1.3))
        dm.rounded_rectangle((x - lev / 2, y0, x + lev / 2, y1), radius=r, fill=255); dv.rounded_rectangle((x - lev / 2, y0, x + lev / 2, y1), radius=r, fill=int(255 * (1 - min(1, q / kiinni * 1.5)) ** 1.1))
    im.paste(kuva, (0, 0), m); im.paste(Image.new('RGB', (W, H), VALK), (0, 0), v); return im
def alarivi2(im, vasen, oikea, fs=62, vari=KELT):
    d = ImageDraw.Draw(im); f = BAH(fs); y = 662; teksti(d, (40, y), vasen, f, VALK, 8, 'lm'); teksti(d, (W - 40, y), oikea, f, VALK, 8, 'rm')
    x0 = 40 + d.textlength(vasen, font=f) + 28; x1 = W - 40 - d.textlength(oikea, font=f) - 28; d.rectangle((x0 - 4, y - 12, x1 - 30, y + 12), fill=MUSTA); d.polygon([(x1 - 46, y - 32), (x1 + 6, y), (x1 - 46, y + 32)], fill=MUSTA)
    d.rectangle((x0, y - 8, x1 - 32, y + 8), fill=vari); d.polygon([(x1 - 40, y - 25), (x1, y), (x1 - 40, y + 25)], fill=vari)
def otsikot(im, tyyli=1):
    d = ImageDraw.Draw(im)
    if tyyli == 1: teksti(d, (40, 112), 'FABLE 5.2', IMP(210), KELT, 11, 'lm'); teksti(d, (W - 40, 80), 'SIBELIUS', BAH(80), VALK, 8, 'rm'); teksti(d, (W - 40, 166), 'TAPIOLA', BAH(80), VALK, 8, 'rm')
    if tyyli == 2: teksti(d, (W / 2, 104), 'FABLE 5.2', IMP(200), KELT, 11, 'mm')
    if tyyli == 3: teksti(d, (40, 104), 'FABLE 5.2', IMP(190), KELT, 11, 'lm'); teksti(d, (44, 232), 'SIBELIUS · TAPIOLA', BAH(66), VALK, 8, 'lm')
def n1():  # valittu, luettavampi: 30 paksua pylvästä, ehjä kuva, isommat tekstit
    im = muunnos2('myrsky'); varjo(im, 0.30, 0.26); kipinat(im, 300, 640, 4, KELT, 22); otsikot(im, 1); alarivi2(im, 'SOUND', 'SNOWSTORM'); return im
def n2():  # ilman tähtiä, isompi kuva-alue
    im = muunnos2('myrsky', 26, 22, alku=0.16, kiinni=0.42); varjo(im, 0.30, 0.26); otsikot(im, 1); alarivi2(im, 'SOUND', 'SNOWSTORM'); return im
def n3():  # otsikko keskellä, Sibelius · Tapiola alhaalla, ei nuoliriviä
    im = muunnos2('myrsky', 26, 22); varjo(im, 0.32, 0.24); kipinat(im, 300, 640, 4, KELT, 22); otsikot(im, 2); teksti(ImageDraw.Draw(im), (W / 2, 660), 'SIBELIUS · TAPIOLA', BAH(72), VALK, 8, 'mm'); return im
def n4():  # Sibelius · Tapiola otsikon alla vasemmalla
    im = muunnos2('myrsky', 30, 18, keski=0.64); varjo(im, 0.36, 0.26); kipinat(im, 300, 640, 4, KELT, 22); otsikot(im, 3); alarivi2(im, 'SOUND', 'SNOWSTORM'); return im
def n5():  # metsä
    im = muunnos2('metsa', cx=0.42); varjo(im, 0.30, 0.26); kipinat(im, 300, 640, 5, KELT, 22); otsikot(im, 1); alarivi2(im, 'SOUND', 'FOREST'); return im
def n6():  # punainen aurinko
    im = muunnos2('aurinko', cx=0.6); varjo(im, 0.30, 0.26); kipinat(im, 300, 640, 6, KELT, 22); otsikot(im, 1); alarivi2(im, 'SOUND', 'RED SUN'); return im
def n7():  # revontuli
    im = muunnos2('revontuli', cy=0.3); varjo(im, 0.30, 0.26); kipinat(im, 300, 640, 7, KELT, 22); otsikot(im, 1); alarivi2(im, 'SOUND', 'NORTHERN LIGHTS', 56); return im
def n8():  # lopun aamu
    im = muunnos2('aamu', cy=0.45); varjo(im, 0.30, 0.26); kipinat(im, 300, 640, 8, KELT, 22); otsikot(im, 1); alarivi2(im, 'SOUND', 'SUNRISE'); return im
nn = [k() for k in (n1, n2, n3, n4, n5, n6, n7, n8)]
for i, im in enumerate(nn): im.save(K + 'v4_%d.jpg' % (i + 1), quality=94)
ark = Image.new('RGB', (W * 2 + 20, (H + 20) * 4 + 110), (40, 40, 40))
for i, im in enumerate(nn): ark.paste(im, ((i % 2) * (W + 20), (i // 2) * (H + 20))); ark.paste(im.resize((168, 94), Image.LANCZOS), (i * 180, 4 * (H + 20)))
ark.resize((ark.width // 2, ark.height // 2), Image.LANCZOS).save(K + 'v4_arkki.jpg', quality=92)
pien = Image.new('RGB', (4 * 330 + 10, 2 * 190 + 10), (24, 24, 24))
for i, im in enumerate(nn): pien.paste(im.resize((320, 180), Image.LANCZOS), (10 + (i % 4) * 330, 10 + (i // 4) * 190))
pien.save(K + 'v4_listakoko.jpg', quality=93)
