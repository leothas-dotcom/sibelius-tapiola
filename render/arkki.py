"""Kokoaa still-kuvat yhdeksi arkiksi, jotta ne voi katsoa kerralla.

Käyttö: python -I render/arkki.py <kansio, jossa stills/> [sarakkeita=4] [ruudun leveys=480]
Lukee <kansio>/stills/*.png (render.mjs --stills ... --dir <kansio>/stills), kirjoittaa <kansio>/arkki.png.
Ruudun vasempaan yläkulmaan tulee tiedoston nimi (aika sekunteina).
"""
import glob, os, re, sys
from PIL import Image, ImageDraw

d = sys.argv[1]
cols = int(sys.argv[2]) if len(sys.argv) > 2 else 4
w = int(sys.argv[3]) if len(sys.argv) > 3 else 480
def avain(f):
    m = re.search(r"(\d+(?:\.\d+)?)", os.path.basename(f))
    return float(m.group(1)) if m else 0.0
fs = sorted(glob.glob(os.path.join(d, "stills", "*.png")), key=avain)
if not fs:
    sys.exit("ei kuvia: " + os.path.join(d, "stills"))
ims = []
for f in fs:
    im = Image.open(f).convert("RGB")
    im = im.resize((w, round(im.height * w / im.width)))
    t = avain(f)
    ImageDraw.Draw(im).text((6, 4), f"{int(t // 60)}:{t % 60:04.1f}  ({t:.1f} s)", fill=(255, 255, 0))
    ims.append(im)
h = ims[0].height
rows = (len(ims) + cols - 1) // cols
arkki = Image.new("RGB", (cols * w, rows * h))
for i, im in enumerate(ims):
    arkki.paste(im, ((i % cols) * w, (i // cols) * h))
arkki.save(os.path.join(d, "arkki.png"))
print(len(ims), "kuvaa ->", os.path.join(d, "arkki.png"))
