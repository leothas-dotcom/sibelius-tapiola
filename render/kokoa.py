"""Vedoksen kokoaminen maailmojen osista ja sen mittaus (ohjaajan työkalu).
    python -I render/kokoa.py tila [--osa osa_v8.mp4]
    python -I render/kokoa.py kokoa <vedos> [--osa osa_v8.mp4]     esim. kokoa vedos_v7
    python -I render/kokoa.py vertaa <vedos> <vanha_vedos>         esim. vertaa vedos_v7 vedos_v6u
tila:   jokaisen osan ruutumäärä (odotus ankkureista) ja muutosaika.
kokoa:  kopioi osien kuvaraidat kansioon runs/<vedos>/osat, liittää ne, lisää kuuntelukopion äänen (build/kuuntelu), tekee
        720p- ja WhatsApp-version ja kontaktiarkin, mittaa saumat (viimeisen ja ensimmäisen ruudun keskiväri), lopun (11_12)
        kuvaraidan MD5:n ja äänen totuutta vasten (analysis/kellot.py).
vertaa: render/vertaa.py jokaiselle osalle vanhaa vedosta vastaan (regressiot).
--osa:  osatiedoston nimi moduulin kansiossa (oletus osa.mp4); 13.11.2026 alkaen myös 11_12 käyttää tätä (loppua muutettiin käyttäjän pyynnöstä, rivit 164-165).
Äänitystä ei viedä gittiin eikä julkaista: tiedostot ovat vain käyttäjän omaan katseluun (CLAUDE.md)."""
import json, os, subprocess, sys, time
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.stdout.reconfigure(encoding="utf-8")
C = json.load(open("annotations/cues.json", encoding="utf-8"))
A = {x["id"]: x["t"] for x in C["cues"] if x.get("t") is not None}
A["tiedoston_alku"] = 0.0
A["tiedoston_loppu"] = C["recording"]["kesto_s"]
FPS = 30
LOPUN_MD5 = "790baba21c0c8569ed0ca020d0c83947"      # 11_12:n kuvaraita vedoksissa 4-7 (käyttäjä: "Älä muuta lopusta enää mitään")
MOD = [("01_02", "tiedoston_alku", "fis_pitka_aani"), ("03_04", "fis_pitka_aani", "pohja_katoaa"), ("05", "pohja_katoaa", "pohja_vaihtuu_D"),
       ("06", "pohja_vaihtuu_D", "jousijakso_urkupiste_E_alku"), ("07_08", "jousijakso_urkupiste_E_alku", "M_raskaat_askeleet"),
       ("09", "M_raskaat_askeleet", "hiljaisuus_2_alku"), ("10", "hiljaisuus_2_alku", "huuto"), ("11_12", "huuto", "tiedoston_loppu")]
argv = sys.argv[1:]
OSA = "osa.mp4"
if "--osa" in argv:
    i = argv.index("--osa"); OSA = argv[i + 1]; del argv[i:i + 2]


def osa(k):
    kansio = "runs/alku_v4" if k == "01_02" else f"runs/maailma_{k}"
    return f"{kansio}/{OSA}"   # 13.11.2026: myös 11_12 käyttää --osa-tiedostoa (käyttäjä pyysi lopun revontuleen aallon ja sileän vaaran, rivit 164-165)


def probe(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries",
                        "stream=nb_read_packets,width,height,r_frame_rate,codec_name,pix_fmt", "-of", "json", p], capture_output=True, text=True)
    s = json.loads(r.stdout)["streams"][0]
    return int(s["nb_read_packets"]), f'{s["width"]}x{s["height"]} {s["r_frame_rate"]} {s["codec_name"]} {s["pix_fmt"]}'


def tila():
    ok, tot = True, 0
    for k, a, b in MOD:
        odot = round(A[b] * FPS) - round(A[a] * FPS)
        p = osa(k)
        if not os.path.exists(p):
            print(f"{k:6} PUUTTUU {p}"); ok = False; continue
        n, info = probe(p); tot += n
        print(f"{k:6} ruudut {n:5d} odotus {odot:5d} {'OK ' if n == odot else 'ERO'}  {info}  {time.strftime('%d.%m. %H:%M', time.localtime(os.path.getmtime(p)))}  {p}")
        ok &= n == odot
    print("yhteensä", tot, "odotus", round(A["tiedoston_loppu"] * FPS))
    return ok


def keskivari(src, arg):
    r = subprocess.run(["ffmpeg", "-v", "error", *arg, "-i", src, "-frames:v", "1", "-vf", "scale=1:1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True)
    return tuple(r.stdout[:3])


def kokoa(nimi):
    out = f"runs/{nimi}"
    os.makedirs(out + "/osat", exist_ok=True)
    with open(out + "/osat.txt", "w", encoding="utf-8") as f:
        for k, _, _ in MOD:
            q = os.path.abspath(f"{out}/osat/{k}.mp4").replace(chr(92), "/")
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", osa(k), "-map", "0:v:0", "-an", "-c:v", "copy", q], check=True)
            f.write(f"file '{q}'\n")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", out + "/osat.txt", "-i", "build/kuuntelu/rattle_kuuntelu.wav", "-map", "0:v", "-map", "1:a",
                    "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-t", f"{A['tiedoston_loppu']:.3f}", "-movflags", "+faststart", out + "/koko.mp4"], check=True)
    lyh = nimi.replace("vedos_v", "vedos")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", out + "/koko.mp4", "-vf", "scale=-2:720", "-c:v", "libx264", "-crf", "20", "-preset", "medium", "-c:a", "aac", "-b:a", "192k",
                    "-movflags", "+faststart", f"{out}/tapiola_{lyh}_720p.mp4"], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", out + "/koko.mp4", "-vf", "scale=854:480", "-c:v", "libx264", "-b:v", "600k", "-maxrate", "800k", "-bufsize", "1600k",
                    "-preset", "medium", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", f"{out}/tapiola_{lyh}_whatsapp.mp4"], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", out + "/koko.mp4", "-vf", "fps=1/15,scale=320:-1,tile=9x8", "-frames:v", "1", "-q:v", "4", out + "/kontakti.jpg"], check=True)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", out + "/koko.mp4", "-vn", "-ac", "2", "-ar", "44100", out + "/aani.wav"], check=True)
    print("koottu:", out)
    for (a, _, _), (b, _, _) in zip(MOD[:-1], MOD[1:]):
        ka, kb = keskivari(f"{out}/osat/{a}.mp4", ["-sseof", "-0.04"]), keskivari(f"{out}/osat/{b}.mp4", ["-ss", "0"])
        print(f"sauma {a} -> {b}: viimeinen {ka} ensimmäinen {kb} suurin ero {max(abs(x - y) for x, y in zip(ka, kb))}")
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{out}/osat/11_12.mp4", "-map", "0:v", "-c", "copy", "-f", "md5", "-"], capture_output=True, text=True)
    md5 = r.stdout.strip().replace("MD5=", "")
    print("loppu 11_12 kuvaraidan MD5:", md5, "SAMA kuin vedoksissa 4-7" if md5 == LOPUN_MD5 else "ERI: LOPPU ON MUUTTUNUT")
    k = subprocess.run([sys.executable, "-I", "analysis/kellot.py", "--file", out + "/aani.wav", "--start", "0"], capture_output=True, text=True, encoding="utf-8", errors="replace")
    print("ääni totuutta vasten:\n" + (k.stdout + k.stderr).strip())
    for f in sorted(os.listdir(out)):
        if f.endswith(".mp4"):
            print(f"  {os.path.getsize(os.path.join(out, f)) / 1e6:8.1f} Mt  {out}/{f}")


def vertaa(nimi, vanha):
    for k, a, _ in MOD:
        r = subprocess.run([sys.executable, "-I", "render/vertaa.py", f"runs/{vanha}/osat/{k}.mp4", f"runs/{nimi}/osat/{k}.mp4", f"{A[a]:.1f}", "2", "2.0"],
                           capture_output=True, text=True, encoding="utf-8", errors="replace")
        print(f"== {k}: {nimi} vastaan {vanha}\n{(r.stdout + r.stderr).strip()}")


if __name__ == "__main__":
    if not argv or argv[0] == "tila":
        tila()
    elif argv[0] == "kokoa":
        if not tila() and "--pakota" not in argv:
            raise SystemExit("ruutumäärät eivät täsmää: ei koota")
        kokoa(argv[1])
    elif argv[0] == "vertaa":
        vertaa(argv[1], argv[2])
