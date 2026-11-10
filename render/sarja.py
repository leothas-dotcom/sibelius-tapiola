"""Liikesarja videosta: python -I sarja.py <video> <alku_s> <askel_ruutuja> <n> <ulos.png> [leveys] [palstat]"""
import subprocess, sys, os, glob, shutil
from PIL import Image, ImageDraw
src, t0, step, n, out = sys.argv[1], float(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
w = int(sys.argv[6]) if len(sys.argv) > 6 else 480
cols = int(sys.argv[7]) if len(sys.argv) > 7 else 4
tmp = out + "_tmp"; shutil.rmtree(tmp, ignore_errors=True); os.makedirs(tmp)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{t0:.3f}", "-i", src, "-frames:v", str(n * step), "-vf", "select=not(mod(n" + chr(92) + "," + str(step) + ")),scale=" + str(w) + ":-2", "-fps_mode", "vfr", os.path.join(tmp, "f_%03d.png")], check=True)
fs = sorted(glob.glob(os.path.join(tmp, "f_*.png")))[:n]
iw, ih = Image.open(fs[0]).size
im = Image.new("RGB", (cols * iw, ((len(fs) + cols - 1) // cols) * ih))
for i, f in enumerate(fs):
    x = Image.open(f).convert("RGB"); t = t0 + i * step / 30
    ImageDraw.Draw(x).text((6, 4), f"{int(t)//60}:{t%60:05.2f}", fill=(255, 255, 0))
    im.paste(x, ((i % cols) * iw, (i // cols) * ih))
im.save(out); shutil.rmtree(tmp); print(out, im.size)
