"""Polttaa englanninkieliset tekstit ja alkuruudun 4K-vedokseen (15.11.2026, käyttäjän pyyntö). Vain omaan katseluun (työäänitys).
  python -I runs/tekstitys_v2/poltto.py [--t 20]     # --t: vain alku (koe)
SRT -> ASS (3840x2160), alkuruutu ASS-tapahtumina; skaalaus ja värit Heldenlebenin 2160p-reseptillä (Lanczos 2x, bt709, CRF 20, katto 60M)."""
import os, re, subprocess, sys
K = 'runs/tekstitys_v2'; SRT = K + '/srt/tapiola.en.srt'; ASS = K + '/tapiola.en.ass'; SRC = 'runs/vedos_v8/koko.mp4'
OUT = 'runs/vedos_v8/tapiola_vedos8_en_2160p.mp4'
T = None
if '--t' in sys.argv: T = sys.argv[sys.argv.index('--t') + 1]; OUT = K + '/koe_2160p.mp4'
aika = lambda s: '%d:%02d:%05.2f' % (int(s[0:2]), int(s[3:5]), float(s[6:8] + '.' + s[9:12]))
HEAD = """[Script Info]
ScriptType: v4.00+
PlayResX: 3840
PlayResY: 2160
WrapStyle: 2
ScaledBorderAndShadow: yes
YCbCr Matrix: TV.709

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Teksti,Segoe UI,88,&H00F4F1EC,&H00F4F1EC,&H7810100C,&H96000000,0,0,0,0,100,100,1,0,1,3,2,2,200,200,150,1
Style: Otsikko,Georgia,280,&H00F4F1EC,&H00F4F1EC,&H96181410,&H96000000,0,0,0,0,100,100,70,0,1,0,3,5,0,0,0,1
Style: Pieni,Georgia,84,&H00E6E0D8,&H00E6E0D8,&H96181410,&H96000000,0,0,0,0,100,100,26,0,1,0,2,5,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = [
    'Dialogue: 1,0:00:00.70,0:00:06.60,Pieni,,0,0,0,,{\\an5\\pos(1920,800)\\fad(1400,1300)\\blur1}JEAN SIBELIUS',
    'Dialogue: 1,0:00:01.10,0:00:06.60,Otsikko,,0,0,0,,{\\an5\\pos(1955,1060)\\fad(1600,1300)\\blur1.5}TAPIOLA',
    'Dialogue: 1,0:00:01.80,0:00:06.60,Pieni,,0,0,0,,{\\an5\\pos(1920,1330)\\fad(1600,1300)\\blur1\\fs64\\fsp14}Tone poem, Op. 112 · 1926',
]
for b in open(SRT, encoding='utf-8').read().strip().split('\n\n'):
    l = b.split('\n'); a, e = l[1].split(' --> ')
    ev.append('Dialogue: 0,%s,%s,Teksti,,0,0,0,,{\\fad(220,220)\\blur1.2}%s' % (aika(a), aika(e), '\\N'.join(l[2:])))
open(ASS, 'w', encoding='utf-8-sig').write(HEAD + '\n'.join(ev) + '\n')
vf = ('scale=3840:2160:flags=lanczos+accurate_rnd+full_chroma_int:in_range=pc:out_range=tv:in_color_matrix=bt470bg:out_color_matrix=bt709,format=yuv420p,'
      'ass=' + ASS.replace('\\', '/'))
cmd = ['ffmpeg', '-v', 'error', '-stats', '-y', '-i', SRC] + (['-t', T] if T else []) + ['-vf', vf, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-maxrate', '60M', '-bufsize', '120M',
      '-profile:v', 'high', '-level', '5.1', '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
      '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-movflags', '+faststart', OUT]
print(' '.join(cmd)); sys.exit(subprocess.run(cmd).returncode)
