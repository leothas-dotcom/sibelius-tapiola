# Tapiola-videoprojekti

Jean Sibelius, *Tapiola*, sinfoninen runo op. 112. Äänilähde: `audio/05_Tapiola.mp3` (Kajanus / London Symphony Orchestra, 1932,
siirto Bob Varney; 1062,85 s, 44,1 kHz, stereo, 320 kbps). Projektin säännöt ovat `CLAUDE.md`:ssä, työkalupäätös
`docs/tyokalut.md`:ssä, kuuntelutyökalun suunnitelma `docs/analyysisuunnitelma.md`:ssä ja vaiheen 1 tulokset
`docs/tutkimus/vaihe1_raportti.md`:ssä.

Tähän projektiin on siirretty edellisestä projektista vain **menetelmä** (ääniputki, iskut, kellot, renderöinnin runko). Mitään
visuaalista ei ole siirretty; visuaalinen kieli luodaan vaiheessa 6.

## Ympäristö (Windows 11, PowerShell)

Vaatimukset: ffmpeg (libx264) PATHissa, Python 3.12 (`uv` hallinnoi `.venv`:n), Node 22, NVIDIA-näytönohjain (CUDA 13 -pyörät).

```powershell
.\setup.ps1              # asentaa lukituksesta (uv.lock, package-lock.json), hakee mallipainot tarkistussummin, tarkistaa kaiken
.\setup.ps1 -CheckOnly   # pelkkä tarkistus, ei asennuksia; pitää olla vihreä
```

- Python-riippuvuudet: `pyproject.toml` + `uv.lock` (päivitys: `uv lock`). Node: `package.json` + `package-lock.json` (`npm ci`).
  Ei käsin asennettuja paketteja.
- Mallipainot: `analysis/models.json` (SHA-256), `models/`-kansioon `analysis/fetch_models.py`:llä (`--check`, `--pin`).
  Painot ovat epäluotettavaa dataa: vain `fetch_models.py` tarkistussummin. torchcrepen paino tulee paketin mukana ja kopioidaan
  `models/crepe/`-kansioon tarkistussummaa varten; `listen.py` vertaa paketin painoa manifestiin.
- **Python ajetaan aina `.venv\Scripts\python.exe -I`.** Yksi GPU-ajo kerrallaan.

## Aika

**Aikojen ainoa totuus on kuuntelukopio** `build/kuuntelu/tapiola_kuuntelu.wav` (48 kHz, stereo, 24 bit, ei muuta käsittelyä).
Kaikki johdetut äänet dekoodataan lähteestä samalla ffmpeg-komennolla (`analysis/lahde.py: decode`). Lähteen ja kuuntelukopion
polut, näytetaajuudet ja kohinaikkuna ovat `analysis/config.json`:ssa.

## Putki yhdelle mp3-tiedostolle

```powershell
$py = ".venv\Scripts\python.exe"
& $py -I analysis\kuuntelukopio.py                 # lähde -> build/kuuntelu/tapiola_kuuntelu.wav + kellomittaus lähdettä vasten
& $py -I analysis\kohinaikkuna.py                  # hiljaisin 1 s ikkuna + alku-/loppuhiljaisuus -> config.json
# paketti (esim. 60 s alusta; koko teos: --duration 1062.85, muistirajaa ei ole vielä testattu)
& $py -I analysis\prepare.py --start 0 --duration 60 --out build\testi60
& $py -I analysis\analyze.py build\testi60         # CPU: voimakkuus, kaistat, chroma, sävellaji, uutuuskäyrä, patina
& $py -I analysis\listen.py build\testi60          # GPU: Demucs-stemmit, PANNs, CREPE (beat_this vain lipulla --beats)
& $py -I analysis\aksentit.py build\testi60        # iskut 10 ms tarkkuudella, patarummun lyönnit
& $py -I analysis\interpret.py build\testi60       # tapahtumat lauseina
& $py -I analysis\segments.py build\testi60        # jaksorajat
& $py -I analysis\kanavat.py build\testi60         # uudet kanavat (patarumpu x2, jousitremolo, urkupiste, liiketiheys, perheet, vihje)
& $py -I analysis\check_package.py build\testi60   # paketin tarkistus
& $py -I analysis\kuuntele.py --from 0 --to 60     # kuuntelupöytäkirja: taulukko, spektrogrammi-PNG, kuuntelunäyte
& $py -I analysis\kellot.py build\testi60          # johdetut äänet kuuntelukopiota vasten (tavoite 0 ms, raja 1 ms)
& $py -I analysis\vire.py build\testi60            # vire A=440:aan nähden (senttiä); ei korjata
```

| Tiedosto | Tehtävä |
|---|---|
| `analysis/lahde.py`, `config.json` | lähde, kuuntelukopio, sovittu dekoodaus, kohinaikkuna, sävelnimet suomeksi |
| `analysis/kuuntelukopio.py` | tekee kuuntelukopion ja mittaa sen 0 ms lähdettä vasten |
| `analysis/kohinaikkuna.py` | kohinaikkuna tiedostosta (ei loppuuraa), alku- ja loppuhiljaisuus |
| `analysis/prepare.py` | paketti: soundtrack, mono, naksahdukset ja kohina pois, 44,1 kHz GPU:lle; `--source`, `--noise-window` |
| `analysis/analyze.py`, `listen.py`, `aksentit.py`, `interpret.py`, `segments.py` | analyysi, kuuntelu, iskut, tulkinta, jaksot |
| `analysis/kanavat.py` | Tapiolan uudet kanavat (`kanavat.json`/`.f32`, 30 fps) |
| `analysis/kuuntele.py` | kuuntelupöytäkirja (`poytakirja_<alku>-<loppu>.md/.png`, `build/kuuntelu/otteet/`) |
| `analysis/kellot.py` | kellotarkistus (`--file`, `--ref`, paketit) |
| `analysis/vire.py` | vire senttinä pitkistä tasaisista sävelistä |
| `analysis/rekisteri.py` | rekisterit ja sävelet kohinatason yläpuolella kuuntelukopiosta |
| `analysis/check_package.py` | paketin ja merkintöjen tarkistus |
| `analysis/themes.py`, `aikajana.py` | apufunktiot ja koko äänitteen aikajana (teematunnistimet kirjoitetaan vaiheessa 5) |
| `analysis/make_cues.py`, `kuunteluopas.py` | merkinnät ja kuunteluopas teemakartasta (`annotations/teemat.json`, vaihe 5) |
| `analysis/videotarkistus.py`, `kriitikko.py` | valmiin videon tarkistus ja kriitikkoaineisto (vaiheet 8–10) |
| `render/render.mjs`, `camcheck.mjs`, `serve.mjs`, `check-webgl.mjs` | renderöinnin runko ja kameramittari (kohtaus kirjoitetaan vaiheessa 8) |

`npm run preview`, `npm run render`, `npm run check-webgl` ajavat vastaavat `render/`-skriptit.

## Kansiot

`docs/` suunnitelmat ja tutkimus · `analysis/` Python-työkalut · `render/` Node-työkalut · `annotations/` teemakartta, cues, kuunteluopas ·
`audio/`, `build/`, `models/` (ei gitissä) · `runs/<nimi>/` ajot.
