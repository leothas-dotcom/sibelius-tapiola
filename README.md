# Tapiola-videoprojekti

Jean Sibelius, *Tapiola*, sinfoninen runo op. 112. Projektin säännöt ovat `CLAUDE.md`:ssä, työkalupäätös `docs/tyokalut.md`:ssä, kuuntelutyökalun suunnitelma
`docs/analyysisuunnitelma.md`:ssä, vaiheen 1 tulokset `docs/tutkimus/vaihe1_raportti.md`:ssä ja vaiheiden 3–4 tulokset (koko Rattle-äänitys)
`docs/tutkimus/vaihe3_4_raportti.md`:ssä.

**Äänitykset (päätös 1.11.2026):** työäänitys on Rattle / London Symphony Orchestra 2022 (`audio/vertailu/rattle_lso_2022.webm`, opus 48 kHz, 1078,02 s).
Kajanus / LSO 1932 (`audio/05_Tapiola.mp3`, siirto Bob Varney; 1062,85 s, 44,1 kHz) on arkisto. Lopullinen äänitys tulee myöhemmin käyttäjältä, ja silloin sama
putki ajetaan sille. Levytykset: `annotations/levytykset.json`. **Rattle-ääni ei mene gittiin eikä videoon.**

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

**Aikojen ainoa totuus on kuuntelukopio**, nyt `build/kuuntelu/rattle_kuuntelu.wav` (48 kHz, stereo, 24 bit, ei muuta käsittelyä). Kaikki johdetut äänet
dekoodataan lähteestä samalla ffmpeg-komennolla (`analysis/lahde.py: decode`). Lähteen ja kuuntelukopion polut, näytetaajuudet ja kohinaikkuna ovat
`analysis/config.json`:ssa. Ajat ovat kuuntelukopion aikaa tiedoston alusta (digitaalinen hiljaisuus mukaan lukien); alkua ei leikata.

**Arkisto (Kajanus 1932):** asetukset `analysis/config_kajanus1932.json`. Aja työkalut niillä asettamalla ennen ajoa
`$env:TAPIOLA_CONFIG = "analysis\config_kajanus1932.json"` (ympäristömuuttuja ohittaa `config.json`:n; kuuntelukopio `build/kuuntelu/tapiola_kuuntelu.wav`).

## Putki: Rattle / LSO 2022, koko teos yhtenä pakettina

Ajat (RTX 4070 SUPER, 12 Gt): kuuntelukopio 50 s, prepare 32 s, analyze 11 s, listen 229 s (Demucs 124 s, PANNs 2 s, CREPE 101 s), beat_this 2 s,
aksentit 4,5 s, kanavat 6,4 s, interpret 2 s, segments 1 s, kellot 64 s. Näytönmuistin huippu 2792 Mt (CREPE; koko kortti 6051 Mt, perustaso 2450 Mt),
joten 1078 s mahtuu yhtenä pakettina eikä osia tarvita.

```powershell
$py = ".venv\Scripts\python.exe"
& $py -I analysis\kuuntelukopio.py                 # lähde -> build/kuuntelu/rattle_kuuntelu.wav + kellomittaus (4 vertailua, tavoite 0 ms)
& $py -I analysis\kohinaikkuna.py --choose start   # hiljaisin EI-digitaalinen 1 s ikkuna -> config.json; digitaaliset jaksot ja huone
& $py -I analysis\prepare.py --start 0 --duration 1078.016 --out build\rattle_koko
& $py -I analysis\afftdn_vertailu.py build\rattle_koko   # afftdn: orig_mono vs clean_mono hiljaisissa kohdissa
& $py -I analysis\analyze.py build\rattle_koko     # CPU: voimakkuus, kaistat, chroma, sävellaji, uutuuskäyrä, patina
& $py -I analysis\listen.py build\rattle_koko --steps stemmit,soittimet,savelet   # GPU: Demucs, PANNs (+ saksofoni), CREPE
& $py -I analysis\listen.py build\rattle_koko --steps iskut --beats               # GPU: beat_this (tahteja ei raportoida tahtinumeroina)
& $py -I analysis\aksentit.py build\rattle_koko    # iskut 10 ms tarkkuudella, patarummun lyönnit
& $py -I analysis\kanavat.py build\rattle_koko     # kanavat + soitin_<luokka> (PANNs-luokat raakana)
& $py -I analysis\interpret.py build\rattle_koko   # tapahtumat lauseina
& $py -I analysis\segments.py build\rattle_koko    # jaksorajat
& $py -I analysis\check_package.py build\rattle_koko
& $py -I analysis\kellot.py build\rattle_koko      # johdetut äänet kuuntelukopiota vasten (tavoite 0 ms, raja 1 ms)
& $py -I analysis\aikajana.py build\rattle_koko --out build\rattle_koko   # aikajana.md: jaksot, hiljaiset kohdat, 10 vahvinta rajaa
& $py -I analysis\varmat_kohdat.py build\rattle_koko   # V1-V8 ehdokasajat perusteineen, soitinluokkien erottuminen
& $py -I analysis\vire.py build\rattle_koko --from 0 --to 60   # vire A=440:aan nähden (senttiä); ei korjata
# kuuntelupöytäkirjat 60 s paloina + kuuntelunäytteet build/kuuntelu/otteet/rattle2022_<alku>-<loppu>.wav
& $py -I analysis\kuuntele.py --from 0 --to 60 --package build\rattle_koko         # ... 60 120 ... 1020 1080 (18 kpl)
& $py -I analysis\kuuntele.py --from 0 --to 1078.016 --step 1.0 --no-sample --name koko --package build\rattle_koko   # yleiskuva poytakirja_koko.png
& $py -I analysis\kellot.py --file build\kuuntelu\otteet\rattle2022_0000-0060.wav --start 0   # kuuntelunäyte kuuntelukopiota vasten
```

Lyhyempi paketti (esim. 60 s alusta): `prepare.py --start 0 --duration 60 --out build\testi60`; loput samoin. Jos muisti ei riitä (muu GPU-käyttö), ajetaan 420 s osina
limittäin (30 s) ja `themes.stitch` / `aikajana.py` yhdistää ne (`aikajana.py build\osa1 build\osa2 ...`); Rattlella tätä ei tarvittu.

| Tiedosto | Tehtävä |
|---|---|
| `analysis/lahde.py`, `config.json`, `config_kajanus1932.json` | lähde, kuuntelukopio, sovittu dekoodaus, kohinaikkuna, sävelnimet suomeksi; `TAPIOLA_CONFIG` valitsee asetustiedoston |
| `annotations/levytykset.json` | levytysten luettelo: `rattle2022` (työ), `kajanus1932` (arkisto) |
| `analysis/kuuntelukopio.py` | tekee kuuntelukopion ja mittaa sen 0 ms lähdettä vasten (webm/opus: kaksi opus-dekooderia + aiempi wav) |
| `analysis/kohinaikkuna.py` | kohinaikkuna tiedostosta (ei digitaalista hiljaisuutta), digitaaliset jaksot, huoneen kohina, ensimmäinen ääni ja musiikin loppu |
| `analysis/prepare.py` | paketti: soundtrack, mono, naksahdukset ja kohina pois, 44,1 kHz GPU:lle; `--source`, `--noise-window` |
| `analysis/afftdn_vertailu.py` | `afftdn`-kohinanpoiston vaikutus (orig_mono / clean_mono) valituissa ikkunoissa |
| `analysis/analyze.py`, `listen.py`, `aksentit.py`, `interpret.py`, `segments.py` | analyysi, kuuntelu, iskut, tulkinta, jaksot |
| `analysis/kanavat.py` | Tapiolan kanavat (`kanavat.json`/`.f32`, 30 fps) ja yksittäiset PANNs-soitinluokat `soitin_<luokka>` |
| `analysis/kuuntele.py` | kuuntelupöytäkirja (`poytakirja_<alku>-<loppu>.md/.png`, soitinluokkataulukko ja -kuva, näytteet `build/kuuntelu/otteet/`) |
| `analysis/varmat_kohdat.py` | V1–V8 ehdokasajat (analyysi, ei kuultu) ja soitinluokkien erottuminen (`varmat_kohdat.md/.json`) |
| `analysis/kellot.py` | kellotarkistus (`--file`, `--ref`, paketit) |
| `analysis/vire.py` | vire senttinä pitkistä tasaisista sävelistä |
| `analysis/rekisteri.py` | rekisterit ja sävelet kohinatason yläpuolella kuuntelukopiosta |
| `analysis/check_package.py` | paketin ja merkintöjen tarkistus |
| `analysis/themes.py`, `aikajana.py` | apufunktiot ja koko äänitteen aikajana (jaksot, hiljaiset kohdat, 10 vahvinta rajaa; teematunnistimet kirjoitetaan vaiheessa 5) |
| `analysis/make_cues.py`, `kuunteluopas.py` | `cues.json` ja kuunteluoppaan GEN-osat teemakartasta (`annotations/teemat.json`) ja levytyksen ajoista (`annotations/ajat_<levytys>.json`); `--levytys <id>` (vaihe 5) |
| `analysis/videotarkistus.py`, `kriitikko.py` | valmiin videon tarkistus ja kriitikkoaineisto (vaiheet 8–10) |
| `render/render.mjs`, `camcheck.mjs`, `serve.mjs`, `check-webgl.mjs` | renderöinnin runko ja kameramittari (kohtaus kirjoitetaan vaiheessa 8) |

`npm run preview`, `npm run render`, `npm run check-webgl` ajavat vastaavat `render/`-skriptit.

## Teemakartta, ajat ja merkinnät (vaihe 5)

Rakenne: `docs/teemakartta_rakenne.md`. Ankkurit (`annotations/teemat.json`) ovat levytysriippumattomia partituurin paikkoja ilman sekunteja ja ilman tarinaa;
ajat ovat levytyskohtaisia (`annotations/ajat_rattle2022.json`: aika, varmuus `analyysi` / `arvio` / `vahvistettu`, luottamus, peruste). Mikään aika ei ole vahvistettu, ennen kuin käyttäjä
on kuullut sen. Aikajanan sanallistus: `docs/aikajana_tulkinta.md`; vaiheen raportti: `docs/tutkimus/vaihe5_raportti.md`.

```powershell
$py = ".venv\Scripts\python.exe"
& $py -I analysis\make_cues.py --levytys rattle2022       # annotations/cues.json: ankkurit + ajat + levytyksen iskut (build/rattle_koko/aksentit.json)
& $py -I analysis\kuunteluopas.py --levytys rattle2022    # täyttää annotations/kuunteluopas.md:n GEN-osat (ankkurit, minuutti minuutilta, tarkistuslista)
& $py -I analysis\check_package.py --cues-only            # tarkistaa teemat.json + ajat + cues.json keskenään
```

Uusi levytys: lisää se `annotations/levytykset.json`:iin (kentät `kuuntelukopio`, `kesto_s`, `paketti`), kirjoita `ajat_<id>.json` ja aja samat komennot `--levytys <id>`:llä.

## Kansiot

`docs/` suunnitelmat ja tutkimus · `analysis/` Python-työkalut · `render/` Node-työkalut · `annotations/` levytykset, teemakartta, cues, kuunteluopas ·
`audio/`, `build/`, `models/` (ei gitissä) · `runs/<nimi>/` ajot.
