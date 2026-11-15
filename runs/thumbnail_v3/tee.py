"""Pikkukuvat, kierros 5 (15.11.2026): ääni kulkee nauhana metsän läpi, runkojen takaa ja edestä. Kaikki koodilla:
ruutu omasta videosta (koko.mp4, 1:09), nauhan muoto äänen voimakkuuskäyrästä, etualan rungot erotettu ruudusta (reunat lumen kohdalta, suora jatke ylös).
  python -I runs/thumbnail_v3/tee.py"""
import wave, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
K = 'runs/thumbnail_v3/'; W, H = 1280, 720; F = 'C:/Windows/Fonts/'
font = lambda n, s: ImageFont.truetype(F + n, s); IMP = lambda s: font('impact.ttf', s); BAH = lambda s: font('bahnschrift.ttf', s); GEO = lambda s: font('georgiab.ttf', s)
KELT, VALK, MUSTA, ORA, KERMA = (255, 214, 64), (248, 246, 240), (5, 7, 11), (236, 104, 40), (240, 230, 208)

def ruutu(t, kirk=1.9, kontr=1.3, vari=1.5):
    im = Image.open(K + 'ruudut/r%d.png' % t).convert('RGB').resize((W, H), Image.LANCZOS); im = ImageEnhance.Brightness(im).enhance(kirk); im = ImageEnhance.Contrast(im).enhance(kontr); return ImageEnhance.Color(im).enhance(vari)

def rungot(im, y0=0.60, y1=0.97, minlev=16):
    """Etualan rungot: tummat juoksut lumen kohdalla (rivin mediaani = lumi), reunoille suora sovite, jatke ylös kuvan yläreunaan."""
    L = np.asarray(im.convert('L')).astype('f4'); rows = range(int(H * y0), int(H * y1), 4); polut = []
    for y in rows:
        r = L[y]; d = r < 0.62 * np.median(r); x = 0
        while x < W:
            if d[x]:
                x2 = x
                while x2 < W and d[x2]: x2 += 1
                if x2 - x >= minlev:
                    for p in polut:
                        if p[-1][0] >= y - 12 and min(x2, p[-1][2]) - max(x, p[-1][1]) > 0.5 * min(x2 - x, p[-1][2] - p[-1][1]): p.append((y, x, x2)); break
                    else: polut.append([(y, x, x2)])
                x = x2
            else: x += 1
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    for p in polut:
        if len(p) < 8: continue
        ys = np.array([a[0] for a in p]); va = np.polyfit(ys, [a[1] for a in p], 1); oi = np.polyfit(ys, [a[2] for a in p], 1); yb = ys.max() + 6
        d.polygon([(np.polyval(va, 0), 0), (np.polyval(oi, 0), 0), (np.polyval(oi, yb), yb), (np.polyval(va, yb), yb)], fill=255)
    return m.filter(ImageFilter.GaussianBlur(1.2))

def verho(n, a0=775, a1=850):
    w = wave.open('runs/vedos_v8/aani.wav'); a = np.frombuffer(w.readframes(w.getnframes()), dtype='<i2').reshape(-1, 2).mean(1)[int(a0 * 44100):int(a1 * 44100)]
    e = np.array([np.sqrt((c.astype('f8') ** 2).mean()) for c in np.array_split(a, n)]); return e / e.max()

def nauha(e, yk, amp, pak, vari, hehku=True, pehm=9):
    """Äänikäyrä nauhana: keskilinja = voimakkuus (pehmennetty), paksuus kasvaa voimakkuuden mukana."""
    k = np.convolve(np.pad(e, pehm, mode='edge'), np.hanning(2 * pehm + 1) / np.hanning(2 * pehm + 1).sum(), mode='valid'); k = (k - k.min()) / (k.max() - k.min())
    xs = np.linspace(-20, W + 20, len(k)); yc = yk - (k - 0.5) * amp; t = pak * (0.55 + 0.75 * k)
    o = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(o); d.polygon(list(zip(xs, yc - t / 2)) + list(zip(xs[::-1], (yc + t / 2)[::-1])), fill=vari + (255,))
    d.line(list(zip(xs, yc - t / 2 + 5)), fill=tuple(min(255, c + 50) for c in vari) + (255,), width=4)
    if hehku: g = o.filter(ImageFilter.GaussianBlur(22)); g.putalpha(g.getchannel('A').point(lambda v: int(v * 0.55))); g.alpha_composite(o); return g
    return o

def teksti(d, xy, s, f, vari=VALK, reuna=8, ank='la'): d.text(xy, s, font=f, fill=vari, stroke_width=reuna, stroke_fill=MUSTA, anchor=ank)
def varjo(im, ylh=0.0, alh=0.0, voima=225):
    g = Image.new('L', (1, H)); px = g.load()
    for y in range(H):
        a = (1 - y / (H * ylh)) ** 1.3 if ylh and y < H * ylh else 0; b = ((y - H * (1 - alh)) / (H * alh)) ** 1.3 if alh and y > H * (1 - alh) else 0; px[0, y] = int(voima * max(a, b))
    im.paste(Image.new('RGB', (W, H), MUSTA), (0, 0), g.resize((W, H)))

def pohja(t=69, yk=0.50, amp=250, pak=58, vari=ORA, e=None):
    im = ruutu(t); m = rungot(im); alku = im.copy(); n = nauha(verho(90) if e is None else e, H * yk, amp, pak, vari); im.paste(n, (0, 0), n); im.paste(alku, (0, 0), m); return im, m

def p1():  # iso keltainen FABLE 5.2 ylhäällä, musta alapalkki kuten julisteessa
    im, _ = pohja(); varjo(im, 0.30, 0.0); d = ImageDraw.Draw(im); d.rectangle((0, 606, W, H), fill=MUSTA)
    teksti(d, (W / 2, 104), 'FABLE 5.2', IMP(200), KELT, 11, 'mm'); teksti(d, (W / 2, 664), 'SIBELIUS · TAPIOLA', GEO(76), KERMA, 0, 'mm'); return im
def p2():  # otsikko vasemmalla, SOUND -> FOREST
    im, _ = pohja(yk=0.54); varjo(im, 0.30, 0.24); d = ImageDraw.Draw(im)
    teksti(d, (40, 112), 'FABLE 5.2', IMP(210), KELT, 11, 'lm'); teksti(d, (W - 40, 80), 'SIBELIUS', BAH(80), VALK, 8, 'rm'); teksti(d, (W - 40, 166), 'TAPIOLA', BAH(80), VALK, 8, 'rm')
    teksti(d, (W / 2, 664), 'SOUND BECOMES A FOREST', BAH(62), VALK, 8, 'mm'); return im
def p3():  # kermanvärinen teksti, ei keltaista: nauha on ainoa lämmin väri
    im, _ = pohja(); varjo(im, 0.30, 0.0); d = ImageDraw.Draw(im); d.rectangle((0, 606, W, H), fill=MUSTA)
    teksti(d, (W / 2, 104), 'FABLE 5.2', IMP(200), KERMA, 11, 'mm'); teksti(d, (W / 2, 664), 'SIBELIUS · TAPIOLA', GEO(76), ORA, 0, 'mm'); return im
def p4():  # pelkkä kuva ja nauha, pieni teksti: julistemaisin
    im, _ = pohja(amp=300, pak=70); d = ImageDraw.Draw(im); d.rectangle((0, 606, W, H), fill=MUSTA); teksti(d, (40, 664), 'FABLE 5.2', IMP(96), KELT, 0, 'lm'); teksti(d, (W - 40, 664), 'SIBELIUS · TAPIOLA', GEO(60), KERMA, 0, 'rm'); return im
def p5():  # keltainen nauha (sama väri kuin otsikossa)
    im, _ = pohja(vari=(250, 200, 50)); varjo(im, 0.30, 0.0); d = ImageDraw.Draw(im); d.rectangle((0, 606, W, H), fill=MUSTA)
    teksti(d, (W / 2, 104), 'FABLE 5.2', IMP(200), KELT, 11, 'mm'); teksti(d, (W / 2, 664), 'SIBELIUS · TAPIOLA', GEO(76), KERMA, 0, 'mm'); return im
def p6():  # toinen ruutu (1:06)
    im, _ = pohja(66); varjo(im, 0.30, 0.0); d = ImageDraw.Draw(im); d.rectangle((0, 606, W, H), fill=MUSTA)
    teksti(d, (W / 2, 104), 'FABLE 5.2', IMP(200), KELT, 11, 'mm'); teksti(d, (W / 2, 664), 'SIBELIUS · TAPIOLA', GEO(76), KERMA, 0, 'mm'); return im

# --- Tyylitelty kuva (käyttäjä 15.11.2026: ääniaalto muuttuu kuvaksi, kuva voisi olla tyylitelty): oma ruutu painojäljeksi koodilla ---
PAL = [(8, 11, 22), (20, 40, 82), (52, 98, 158), (150, 182, 214), (240, 230, 208)]
def tyylittele(im, rasteri=7, voima=0.20, rajat=(0.10, 0.26, 0.46, 0.68)):
    """Juliste: valoisuus viiteen sävyyn (yönsininen -> kerma), sävyrajoilla pisterasteri 45 asteen kulmassa."""
    L = np.asarray(im.convert('L')).astype('f4') / 255; y, x = np.mgrid[0:H, 0:W]; u = (x + y) / np.sqrt(2); v = (x - y) / np.sqrt(2)
    L = L + (np.cos(2 * np.pi * u / rasteri) * np.cos(2 * np.pi * v / rasteri)) * voima * 0.5; q = np.digitize(L, rajat); return Image.fromarray(np.array(PAL, 'u1')[q])
def kuvalahde(nimi):
    t = {'metsa': (69, 1.9, 1.3), 'myrsky': (877, 1.5, 1.35), 'revontuli': (967, 1.9, 1.3), 'aurinko': (682, 1.2, 1.15)}[nimi]
    src = (K + 'ruudut/r%d.png' % t[0]) if t[0] == 69 else ('runs/thumbnail_v1/ruudut/r%d.png' % t[0]); im = Image.open(src).convert('RGB').resize((W, H), Image.LANCZOS)
    return ImageEnhance.Color(ImageEnhance.Contrast(ImageEnhance.Brightness(im).enhance(t[1])).enhance(t[2])).enhance(1.4)
def muunnos(kuva, n=28, pak=20, alku=0.20, keski=0.58, kiinni=0.45, vari=KERMA):
    """Ääniaalto -> kuva: pylväät levenevät ikkunoiksi kuvaan ja sulkeutuvat ehjäksi kuvaksi."""
    e = verho(n); im = Image.new('RGB', (W, H), MUSTA); m = Image.new('L', (W, H), 0); dm = ImageDraw.Draw(m); v = Image.new('L', (W, H), 0); dv = ImageDraw.Draw(v); slot = W / n; yk = H * keski
    for i in range(n):
        p = i / (n - 1); q = 0 if p < alku else ((p - alku) / (1 - alku)) ** 1.4; x = (i + 0.5) * slot
        if q > kiinni: dm.rectangle((x - slot / 2 - 1, 0, W, H), fill=255); break
        lev = pak + (slot + 2 - pak) * min(1, q / kiinni) ** 1.2; kor = (0.08 + 0.50 * e[i]) * H * (1 - q) + H * 1.5 * q / kiinni
        y0, y1 = max(0, yk - kor / 2), min(H, yk + kor / 2); r = lev / 2 * (1 - min(1, q / kiinni * 1.3))
        dm.rounded_rectangle((x - lev / 2, y0, x + lev / 2, y1), radius=r, fill=255); dv.rounded_rectangle((x - lev / 2, y0, x + lev / 2, y1), radius=r, fill=int(255 * (1 - min(1, q / kiinni * 1.5)) ** 1.1))
    im.paste(kuva, (0, 0), m); im.paste(Image.new('RGB', (W, H), vari), (0, 0), v); return im
def otsikot(im, ala='SIBELIUS · TAPIOLA', vari=KELT):
    d = ImageDraw.Draw(im); d.rectangle((0, 612, W, H), fill=MUSTA); teksti(d, (40, 108), 'FABLE 5.2', IMP(200), vari, 11, 'lm'); teksti(d, (W / 2, 667), ala, GEO(72), KERMA, 0, 'mm')
def s1():  # tyylitelty metsä, oranssi ääni
    im = muunnos(tyylittele(kuvalahde('metsa')), vari=ORA); otsikot(im); return im
def s2():  # tyylitelty lumimyrsky (käyttäjän valitsema kohtaus), oranssi ääni
    im = muunnos(tyylittele(kuvalahde('myrsky'), rajat=(0.16, 0.32, 0.50, 0.70)), vari=ORA); otsikot(im); return im
def s3():  # tyylitelty metsä, ääni jatkuu nauhana kuvan läpi runkojen takaa
    raaka = kuvalahde('metsa'); ty = tyylittele(raaka); m = rungot(raaka); n = nauha(verho(90), H * 0.50, 230, 54, ORA, hehku=False); k = ty.copy(); k.paste(n, (0, 0), n); k.paste(ty, (0, 0), m)
    im = muunnos(k, vari=ORA, keski=0.52); otsikot(im); return im
def s4():  # tyylitelty revontuli
    im = muunnos(tyylittele(kuvalahde('revontuli')), vari=ORA); otsikot(im); return im
def s5():  # monta kuvaa: kolme tyyliteltyä kohtausta kaistoina (vertailuksi: meneekö sekavaksi)
    k = Image.new('RGB', (W, H), MUSTA); nimet = ['metsa', 'myrsky', 'revontuli']; x0 = int(W * 0.40); kw = (W - x0) // 3
    for i, nm in enumerate(nimet):
        t = tyylittele(kuvalahde(nm)); k.paste(t.crop((W // 2 - kw // 2, 0, W // 2 + kw // 2, H)), (x0 + i * kw, 0)); ImageDraw.Draw(k).rectangle((x0 + i * kw - 3, 0, x0 + i * kw + 3, H), fill=MUSTA)
    t0 = tyylittele(kuvalahde('metsa')); k.paste(t0.crop((0, 0, x0, H)), (0, 0)); im = muunnos(k, vari=ORA); otsikot(im); return im
def s6():  # tyylitelty lumimyrsky, kermanvärinen ääni ja keltainen vain otsikossa
    im = muunnos(tyylittele(kuvalahde('myrsky'), rajat=(0.16, 0.32, 0.50, 0.70)), vari=KERMA); otsikot(im); return im

if __name__ == '__main__':
    im = ruutu(69); m = rungot(im); dbg = Image.composite(Image.new('RGB', (W, H), (255, 0, 255)), im, m.point(lambda v: v // 2)); dbg.save(K + 'debug_rungot.jpg', quality=85)
    ims = [k() for k in (p1, p2, p3, p4, p5, p6)]
    for i, x in enumerate(ims): x.save(K + 'p%d.jpg' % (i + 1), quality=94)
    ark = Image.new('RGB', (W * 2 + 20, (H + 20) * 3 + 200), (40, 40, 40))
    for i, x in enumerate(ims): ark.paste(x, ((i % 2) * (W + 20), (i // 2) * (H + 20))); ark.paste(x.resize((320, 180), Image.LANCZOS), (i * 340, 3 * (H + 20)))
    ark.resize((ark.width // 2, ark.height // 2), Image.LANCZOS).save(K + 'arkki.jpg', quality=92); print('ok')
    ss = [k() for k in (s1, s2, s3, s4, s5, s6)]
    for i, x in enumerate(ss): x.save(K + 's%d.jpg' % (i + 1), quality=94)
    ark = Image.new('RGB', (W * 2 + 20, (H + 20) * 3 + 200), (40, 40, 40))
    for i, x in enumerate(ss): ark.paste(x, ((i % 2) * (W + 20), (i // 2) * (H + 20))); ark.paste(x.resize((320, 180), Image.LANCZOS), (i * 340, 3 * (H + 20)))
    ark.resize((ark.width // 2, ark.height // 2), Image.LANCZOS).save(K + 'arkki_tyylitelty.jpg', quality=92); print('ok2')
