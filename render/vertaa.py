"""Regressiomittari: missä kahden renderin kuva eroaa. Käyttäjä 10.11.2026: "Miten muutat asioita pois, mitä en pyytänyt muuttamaan?"
    python -I render/vertaa.py <vanha.mp4> <uusi.mp4> [alku_s] [ikkuna_s] [raja_mse]
Tulostaa jokaisen ikkunan (oletus 2 s), jossa ruutujen keskimääräinen neliövirhe (384x216, 5 r/s) ylittää rajan (oletus 2,0),
koko teoksen aikana (alku_s = osan alku teoksessa). Jokaiselle tulostetulle ikkunalle pitää löytyä määräys briefistä;
ikkuna, jolle ei löydy, on pyytämätön muutos ja se palautetaan."""
import os, re, subprocess, sys, tempfile
a, b = sys.argv[1], sys.argv[2]
t0 = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
W = float(sys.argv[4]) if len(sys.argv) > 4 else 2.0
raja = float(sys.argv[5]) if len(sys.argv) > 5 else 2.0
fd, st = tempfile.mkstemp(suffix=".psnr"); os.close(fd)
stf = st.replace("\\", "/").replace(":", "\\:")
subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", a, "-i", b, "-an", "-lavfi",
                f"[0:v]fps=5,scale=384:216[a];[1:v]fps=5,scale=384:216[b];[a][b]psnr=stats_file='{stf}'", "-f", "null", "-"], check=True)
rows = []
for line in open(st):
    m = re.search(r"n:(\d+) mse_avg:([\d.]+)", line)
    if m:
        rows.append(((int(m.group(1)) - 1) / 5.0, float(m.group(2))))
os.remove(st)
mmss = lambda t: "%d:%04.1f" % (t // 60, t % 60)
buck = {}
for t, m in rows:
    buck.setdefault(int(t // W), []).append(m)
out, cur = [], None
for k in sorted(buck):
    v = sum(buck[k]) / len(buck[k])
    if v > raja:
        if cur and cur[1] == k * W:
            cur[1] = (k + 1) * W; cur[2] = max(cur[2], v)
        else:
            cur = [k * W, (k + 1) * W, v]; out.append(cur)
print(f"{b} vastaan {a}: {len(rows)} ruutua, {len(out)} muuttunutta jaksoa (raja mse {raja})")
for s, e, v in out:
    print(f"  {mmss(t0 + s)} - {mmss(t0 + e)}   suurin mse {v:.1f}   (osan aika {s:.0f}-{e:.0f} s)")
