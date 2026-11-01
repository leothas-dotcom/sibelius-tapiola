# Vaiheen 1 raportti: työkalut ja ensimmäinen kuuntelu (60 s)

*Tehty 1.11.2026 briefin `docs/briefit/vaihe1_tyokalut.md` mukaan. Raportoidaan vain se, minkä mittaus näytti; komennot on kirjattu.
Python on ajettu aina `.venv\Scripts\python.exe -I`. Mitään ei ole commitattu. `CLAUDE.md`:tä ja muita `docs/`-tiedostoja ei ole muutettu.
Ajat ovat kuuntelukopion aikaa (`build/kuuntelu/tapiola_kuuntelu.wav`), 0 = tiedoston ensimmäinen näyte.*

## 1. Yhteenveto

- **Putki toimii 60 s paketille** (`build/testi60`): prepare → analyze → listen → aksentit → interpret → segments → kanavat → check_package →
  kuuntele → kellot → vire. `check_package.py`: "Kaikki tarkistukset kunnossa". `setup.ps1 -CheckOnly`: "Kaikki pakolliset kunnossa".
- **Kellot: 0,00 ms** kaikille johdetuille äänille kuuntelukopiota vasten, ja kuuntelukopio 0,00 ms lähteen suoraa dekoodausta vasten.
- **Vire: +7,8 senttiä** A=440:stä (mediaani 14 pitkästä sävelestä, keskihajonta 4,9 c, MAD 2,3 c). Ei korjattu.
- **V1 (patarumpusoolo) näkyy**, mutta vain toisessa kahdesta patarumpukanavasta: matalan kaistan kanava (50–200 Hz) ja aksentit näyttävät
  iskut 1,61 / 1,79 / 1,88 s, drums-stemmikanava näyttää nollaa. **V2 näkyy heikosti, V3 ei erotu** (luku 7). Kanavakortin ensimmäiset rivit ovat luvussa 8.

## 2. Mitä kopioitiin ja mitä muutettiin

Lähde `F:\code\heldenleben-video`; kopioitu vain `docs/tyokalut.md`:n luokkien A ja B tiedostot (ei `visual/`, ei tyylidokumentteja, ei luokan C
tiedostoja). Kopioista poistettiin teos-, puoli-, FLAC- ja edellisen teoksen kommentit ja tekstit; kaavio- ja kuvaajavärit vaihdettiin neutraaleiksi.

| Tiedosto | Muutos |
|---|---|
| `analysis/models.json` (A) | CLAP-merkintä (8 tiedostoa) pois; `torchcrepe_full` lisätty (paketin mukana tuleva `full.pth`, SHA-256 kirjattu `--pin`:llä) |
| `analysis/fetch_models.py` (A) | vain User-Agent-nimi |
| `analysis/aksentit.py` (A) | otsikko ja kommentit: puoli/vanhat ajat pois; tyyppi "lautaset/korkea isku" → "korkea isku" |
| `render/serve.mjs`, `check-webgl.mjs` (A) | serve: `.mp3`/`.mp4`-MIME, oletusdata `build/testi60`; check-webgl sellaisenaan |
| `uv.lock` (A) | luotu uudelleen `uv lock` (70 pakettia, nimi `sibelius-tapiola`) |
| `analysis/prepare.py` (B) | `--side`/FLAC/`RUNOUT` pois; `--source` (oletus `config.json`), `--noise-window ALKU KESTO`, kohinataso `config.json`:n kohinaikkunasta; dekoodaus `lahde.decode()` (`-ss`/`-t` tulostiedoston valitsimina, näytetarkka); `side` pois `prepare.json`:sta |
| `analysis/analyze.py` (B) | pYIN, librosan tempo, `eb_major` ja niiden kuvaajat pois; sävelnimet suomeksi (`lahde.PITCHES`, H = englannin B); musiikin alku = ensimmäinen ruutu, josta taso pysyy yli 10 dB kohinan yläpuolella 1 s (tiedosto voi alkaa suoraan musiikilla → 0); `side` pois |
| `analysis/listen.py` (B) | CLAP-vaihe, tekstit ja `transformers` pois; beat_this vain lipulla `--beats`; PANNs-luokista pois harppu, lautaset, virveli, isorumpu, kellopeli; `to_side_time` → `to_copy_time`; torchcrepen paino tarkistetaan manifestia vasten ennen ajoa |
| `analysis/interpret.py`, `segments.py` (B) | `[A/B m:ss]`-aikaleimat ja "LP-puoli"-otsikot pois; perheet: jouset, puupuhaltimet, vaskipuhaltimet, patarummut (ei harppua); tahdit/tempo valinnaisia (vain jos `beats.json`) |
| `analysis/themes.py` (B) | teemahaun mallit, tunnistimet, `SOURCE`-taulukko ja `--A/--B` pois; jäljellä apufunktiot ja `stitch` (`load_chunk`, `channels`, `cens`, `theme_search`, `runs`, `key_of`, `dom7_score`, `bar_at`); Tapiolan tunnistinosa vaiheessa 5 |
| `analysis/aikajana.py` (B) | `--A/--B` → `packages`; yksi aikajana `build/koko/aikajana.md/.json`; perhenimistö Tapiolalle |
| `analysis/make_cues.py` (B) | aloitusmerkintä, `es_duuri`, puolilogiikka pois; tahdit yhtenä listana; teemakartta valinnainen |
| `analysis/kuunteluopas.py` (B) | 17 kiinteää ankkuria ja puolisilmukka pois; ankkurit = teemakartan tapahtumat, joilla `"ankkuri": true`; rakenne dokumentoitu otsikossa |
| `analysis/check_package.py` (B) | `side`, `es_duuri`, puolitaulukot pois; `beats.json` valinnainen; lisätty `kanavat.json/.f32`-tarkistus (30 fps, ruutumäärä, ei NaN) |
| `analysis/kuuntele.py` (B) | kirjoitettu uudestaan: pöytäkirja (taulukko 0,5 s, PNG, kuuntelunäyte); `--side`, `PACKAGES` pois, paketti valitaan `build/*/kanavat.json`:sta |
| `analysis/rekisteri.py` (B) | FLAC-polut ja `NOISE` pois; lukee kuuntelukopiota, kohinaikkuna `config.json`:sta; sävelnimet suomeksi |
| `analysis/kellot.py` (B) | FLAC-vertailu ja `--side` pois; oletusvertailu kuuntelukopio; hyväksyntäraja 1,0 ms (`--tol`); paluukoodi 1, jos mittaus puuttuu tai ylittää rajan |
| `analysis/videotarkistus.py` (B) | `TRUTH`/`PACKS` → yksi kuuntelukopio ja `build/*/aksentit.json`; yleistauko `--tauko` / `--tauko-id` (ei kiinteää ankkuria) |
| `analysis/kriitikko.py` (B) | viittaukset edellisen dokumentteihin pois; lukee `docs/visuaalinen_tyyli.md`, `docs/kuvasaannot.md`, `docs/kriitikko_kohdat.json`; liikekäyräosa pois (se tuonti oli luokan C tiedostosta) |
| `render/render.mjs`, `camcheck.mjs` (B) | oletuspolut yleisiksi (`visual/index.html`, `build/testi60`); äänen oletus `build/kuuntelu/tapiola_kuuntelu.wav`; `--side` pois; `camProbe`-rajapinta jää vaiheeseen 8 |
| `setup.ps1` (B) | nimi, CLAP/`transformers`/`three` pois, Node 22+, äänitteen viesti |
| `pyproject.toml` (B) | nimi `sibelius-tapiola`; `transformers` ja `pymupdf` pois (`score.py` ei kopioitu) |
| `package.json`, `package-lock.json` (B) | nimi; `three` pois, `puppeteer` jää; lock `npm install` → `npm ci` (27 pakettia) |

**Ei kopioitu:** `analysis/score.py` (partituuria ei ole kansiossa; `pymupdf` poistettu sen vuoksi), `jatkuvuus.py`, `teemaviiva.py` (luokka D), luokan C tiedostot.

**Uusia tiedostoja:** `analysis/lahde.py` (yhteinen dekoodaus, polut, sävelnimet), `analysis/config.json` (lähde, kuuntelukopion polku,
kohinaikkuna, näytetaajuudet), `analysis/kuuntelukopio.py`, `analysis/kohinaikkuna.py`, `analysis/kanavat.py`, `analysis/vire.py`, `README.md`.

## 3. Ympäristö

`.\setup.ps1 -CheckOnly` (tulos tiedostossa `build/setup_checkonly.log`): ffmpeg 9.0.2 + libx264 OK; Python 3.12 OK; Node v22.19.0 OK; `uv.lock` vastaa
`pyproject.toml`ia; `.venv` täsmälleen lukituksen mukainen; librosa 1.0.0, numpy 2.5.4, scipy 1.18.1, matplotlib 3.11.2; **torch 2.11.0+cu130, NVIDIA GeForce RTX 4070 SUPER,
12,0 Gt**; PANNs, beat_this, Demucs, CREPE löytyvät; mallipainot 9 tiedostoa, tarkistussummat täsmäävät; puppeteer 25.16.0; `npm audit` ei haavoittuvuuksia;
WebGL2 headless-selaimessa: ANGLE (NVIDIA RTX 4070 SUPER, Direct3D11); levytilaa 205 Gt. Kaikki pakolliset kunnossa.

Ensimmäisellä `.\setup.ps1`-ajolla yksi pakollinen tarkistus jäi punaiseksi: `torchcrepe_full`-painolla ei ollut vielä tarkistussummaa. Kirjattu
`.venv\Scripts\python.exe -I analysis\fetch_models.py --pin` (lataus vain `fetch_models.py`:llä; ei käsin asennettuja paketteja, ei `--no-deps`).

| Paino (`models/`) | SHA-256 |
|---|---|
| `panns/Cnn14_DecisionLevelMax_mAP=0.385.pth` (327 428 481 t) | `dd3b4043a87d4ec13df8082c0fcfee3fb5084151808e47e060987a95eabdd142` |
| `panns/class_labels_indices.csv` | `cdd1049833c4b86127c2773ac0d14a2754b6a6d0d1798002ed5c66e699708429` |
| `demucs/htdemucs_ft.yaml` | `69470b8c1bbd674437b51bc9fb491327a10ab0396b702c93389b9cf750016346` |
| `demucs/f7e0c4bc-ba3fe64a.th` (drums) | `ba3fe64ae8ef66ac9a4857222ce48efbdc5eb3ad375cb79dd13debee5aaa4066` |
| `demucs/d12395a8-e57c48e6.th` (bass) | `e57c48e6b0e38af4f7118d7bd08c49f0a0c0edf7d09143bdd902ea0d237303e6` |
| `demucs/92cfc3b6-ef3bcb9c.th` (other) | `ef3bcb9c8b40d14ae5d51b6db2587339cc12c6b77c0be151ce6d69002e087bf2` |
| `demucs/04573f0d-f3cf25b2.th` (vocals) | `f3cf25b222c4eed7cd49dd8b2c9597d50c18bd154090f7b919cfa5f93cf22c49` |
| `beat_this/final0.ckpt` | `8c328b45f59d8dd3dff219253ff6a8d6482be57d0133a29140e2febbf8eb8331` |
| `crepe/full.pth` (torchcrepe-paketin mukana, 88 991 291 t; **ensimmäinen kirjaus**) | `133225604dedd2e4005f8bbd1bd0a2ec073ba8b7a6cd31ff6d5edbbfa3539986` |

GPU-ajo `listen.py build/testi60` (60 s): Demucs 10,7 s (VRAM-huippu 554 Mt), PANNs 1,5 s (635 Mt), CREPE 11,1 s (2680 Mt); yhteensä 18–25 s; kortin muisti
2435–2557 → 5893–6257 Mt (perustaso sisältää muiden sovellusten käytön). `prepare.py` 3 s, `analyze.py` 2–12 s. **Koko tiedoston (1063 s) yhtenä pakettina ajon
muistirajaa ei testattu** (vaihe vaatii pyynnön).

## 4. Lähde, dekoodaus, kohinaikkuna, hiljaisuudet

**Dekoodaus.** `ffprobe`: mp3, 44,1 kHz, stereo, 320 kbps, `start_time` 0. Tiedostossa on ID3v2-otsake (550 t), ei Xing/LAME-otsikkoa: ffmpeg
ilmoittaa "Estimating duration from bitrate" eikä leikkaa mp3:n dekoodausviivettä pois. Kehysskannaus (40 687 kehystä 320 kbps / 44,1 kHz, ei virheellisiä
kehyksiä; skannausskripti oli väliaikainen): 40 687 × 1152 / 44100 = 1062,844 s = ffmpeg-dekoodauksen pituus (51 016 516 näytettä 48 kHz:llä). Tiedoston lopussa on 388 tavua
tulkitsematonta jäännöstä; sen vuoksi ffmpeg tulostaa kahdesti "Header missing" (ei vaikutusta aikoihin, kehykset ennen sitä ovat ehjiä).

**Miten viive hoidetaan:** ei leikata. Kuuntelukopio ja kaikki johdetut äänet dekoodataan samalla ffmpeg-komennolla (`analysis/lahde.py: decode`):
`ffmpeg -i <lähde> [-af <suodatin>] [-ss <alku> -t <kesto>] -ar <sr> -ac <kanavat> -c:a <koodekki> <ulos>`. `-ss`/`-t` ovat tulostiedoston valitsimia (dekoodaus
alusta, ei hakua mp3:n hakutaulukon varassa). Kuuntelukopio: `-ar 48000 -ac 2 -c:a pcm_s24le`; SHA-256 `8411e861e8a35d3428a22456b5af2fa2cde188b1f5ac14a21de1b99482eb7b3d`.
`soundfile` (libmpg123) **lukee mp3:n suoraan**: 46 867 880 näytettä = 1062,7637 s, eli 80,4 ms lyhyempi kuin ffmpeg-dekoodaus (loppu leikkautuu), mutta alku ja kaikki
mitatut kohdat ovat samassa ajassa (alla). Muu kuin kuuntelukopion ffmpeg-dekoodaus ei siis ole tarpeen; silti kaikki työkalut lukevat kuuntelukopiota tai
`lahde.decode()`:lla tehtyjä wav-tiedostoja, eivät mp3:a.

**Kohinaikkuna** (`kohinaikkuna.py`, kuuntelukopiosta, 1 s ikkuna, askel 50 ms, RMS dBFS, mono = 0,5 L + 0,5 R):

| Haku | Ikkuna | Taso |
|---|---|---|
| alku (ensimmäiset 30 s) | 0,000–1,000 s | −68,59 dBFS |
| loppu (viimeiset 30 s) | 1060,150–1061,150 s | −47,43 dBFS |
| **koko tiedosto** (valittu, kirjattu `config.json`:iin) | **49,600–50,600 s** | **−71,22 dBFS** |

Valittu ikkuna on yleistauon sisällä (48,0–50,5 s taso −70 dBFS; musiikki päättyy 47,0 s ja jatkuu 50,5 s, mitattu 0,5 s RMS-askelin). `prepare.py` mittasi
tästä pintakohinaksi −71,45 dBFS (`afftdn nf=-71`). Alun ja yleistauon kohina on sama (−68…−71 dBFS), joten ero valinnassa on pieni.

**Hiljaisuudet** (`kohinaikkuna.py`, `onset`-mittaus 5 ms RMS-ikkunalla): ensimmäiset 1,6 s ovat pelkkää kohinaa (0–1,5 s keskiarvo −68,2 dBFS); **ensimmäinen
patarumpuääni alkaa 1,620 s** (5 ms RMS yli 20 dB kohinan päällä; `aksentit.py` 10 ms: isku 1,606 s). Lopussa viimeinen yli 30 dB kohinan päällä oleva ääni päättyy 1062,185 s
ja tiedosto päättyy 1062,844 s: viimeiset noin 0,5–0,65 s ovat −61…−73 dBFS (kohinatason lähellä). Lopun 30 sekuntia ei ole hiljaista (pp-loppusointu
−38…−47 dBFS), joten lopusta ei saa kohinaikkunaa. Komento: `kohinaikkuna.py` (`config.json` → `kohinaikkuna.hiljaisuudet`: 100 ms verhokäyrä ylittää kohinatason +10 dB ensimmäisen kerran 1,6 s, viimeisen kerran 0,44 s ennen loppua).

## 5. Kellot

Menetelmä: ristikorrelaatio 8 kHz:llä, 6 s ikkunat, parabolinen tarkennus (`kellot.py`); raja 1,0 ms. Toimivuus varmistettu: 22 näytettä (0,998 ms) viivästetty
`clean_mono.wav` mittautui +1,00 ms.

| Mitattu | Vertailu | Suurin ero | Ajautuminen | Komento |
|---|---|---|---|---|
| `tapiola_kuuntelu.wav` (koko tiedosto, 18 ikkunaa) | mp3 suoraan `soundfile`lla | 0,00 ms | 0,0 ppm | `kuuntelukopio.py` |
| `tapiola_kuuntelu.wav` (koko tiedosto, 18 ikkunaa) | ffmpeg-dekoodaus 44,1 kHz | 0,00 ms | 0,0 ppm | `kuuntelukopio.py` |
| `build/testi60/soundtrack.wav` | kuuntelukopio | 0,00 ms | −0,0 ppm | `kellot.py build/testi60` |
| `orig_mono.wav`, `declick_mono.wav` | kuuntelukopio | 0,00 ms | −0,0 ppm | sama |
| **`clean_mono.wav`** (22,05 kHz), `clean_44k.wav` | kuuntelukopio | **0,00 ms** | −0,0 ppm | sama |
| Demucs-stemmit yhteen laskettuna | kuuntelukopio | 0,00 ms | 0,0 ppm | sama |
| `build/kuuntelu/otteet/0000-0060.wav` (kuuntelunäyte) | kuuntelukopio | 0,00 ms | −0,0 ppm | `kellot.py --file build/kuuntelu/otteet/0000-0060.wav --start 0` |

`afftdn`-kohinanpoisto viivästi ääntä 551 näytettä (25 ms 22,05 kHz:llä) ja 1102 näytettä (44,1 kHz); `prepare.py` korjasi sen (`corrected_lag_samples` `prepare.json`:ssa),
minkä jälkeen mittaus näyttää 0,00 ms. Mittausikkunat 5, 28 ja 52 s; täysin hiljaisia ikkunoita ei mitattu (raja −45 dB).

## 6. Vire

Komento: `.venv\Scripts\python.exe -I analysis\vire.py build\testi60` (väli 0–60 s; CREPE `full`, kiinteä satunnaissiemen; valitaan sävelet, joiden korkeus pysyy ±0,5 puolisävelaskelen
sisällä vähintään 1,0 s, varmuus ≥ 0,7). Poikkeama = sentit lähimmästä A=440-tasavireen sävelestä (−50…+50 c).

| Lähde | Säveliä | Mediaani | Ympyräkeskiarvo | Keskihajonta | MAD |
|---|---|---|---|---|---|
| **kaikki** | **14** | **+7,8 c** | +9,3 c | **4,9 c** | 2,3 c |
| other-stemmi (jousisävelet) | 6 | +8,9 c | +9,7 c | 2,4 c | 1,2 c |
| vocals-stemmi (johtava linja) | 5 | +7,0 c | +9,5 c | 7,4 c | 1,0 c |
| bass-stemmi | 3 | +5,4 c | +8,1 c | 5,7 c | 1,1 c |

Säveliä: As3 (56) ja As4 (68) toistuvina pitkinä sävelinä 5,7–33,8 s (kesto 1,0–5,3 s) ja D3 (50) 38,0–43,9 s. Yksittäiset poikkeamat +4,3…+22,7 c (`build/testi60/vire.json`).
**Havainnot ja rajat:** (a) vire on mitattu vain modulo puolisävelaskel: onko levy +8 c korkealla vai lähes puoli sävelaskelta matalalla toisen sävelen suhteen, kertoo vain partituuri.
(b) Pitkät mitatut sävelet ovat As- ja D-sävelet, ei h-mollin H; `analyze.py`:n sävellajiarvio on 0–35 s ajan "As molli" (selkeys 0,57–0,78) ja 45–60 s "H molli" (0,62–0,76):
avausjakson sävellajia ei voi tästä päätellä, tarkistettava partituurista. (c) Demucs käyttää satunnaisia siirtoja (`shifts=2`), joten säveljoukko vaihtelee ajosta toiseen: kahdessa ajossa
mediaani oli +8,0 c (12 säveltä) ja +7,8 c (14 säveltä). **Vireeseen ei ole koskettu.**

## 7. Kuuntelupöytäkirja V1–V3 (0–60 s)

Tiedostot: `build/testi60/poytakirja_0000-0060.md` (taulukko 0,5 s), `build/testi60/poytakirja_0000-0060.png` (spektrogrammi + kanavat päälle), kuuntelunäyte
`build/kuuntelu/otteet/0000-0060.wav` (kuuntelukopiosta, 48 kHz, 24 bit; **ei vielä kuultu**). Komento: `.venv\Scripts\python.exe -I analysis\kuuntele.py --from 0 --to 60`.
Kanavat ovat 30 fps (ruutu ±17 ms); tarkemmat ajat (10 ms) tulevat `aksentit.py`:stä ja matalan kaistan iskuvoiman raakakäyrästä (`kanavat.kick_low`).

### V1: patarumpusoolo

| Kanava / mittari | Mitattu |
|---|---|
| Ensimmäinen ääni | 1,620 s (5 ms RMS > kohina + 20 dB); sitä ennen kohinaa −68 dBFS |
| `aksentit.py` iskut (10 ms) | **1,61 s** (z 12,0; matala kaista z 31), **1,79 s** (z 14,2), **1,88 s** (z 9,0); seuraava isku 6,53 s (z 7,7) |
| **`patarumpu_matala`** (50–200 Hz iskuvoima) | huippu **1,60 s** (30 fps, arvo 1,00); 10 ms käyrällä 1,63 s (1,00) ja 1,72 / 1,79 / 1,87 s (0,42 / 0,43 / 0,51) |
| **`patarumpu_stemmi`** (drums-stemmin taso) | **0,00 koko avauksessa**; drums-stemmin huippu 0–10 s on −61,6 dBFS, other-stemmin RMS 1,5–3 s on −26,6 dBFS. Koko 60 s:n suurin arvo 0,33 kohdassa 44,53 s |
| PANNs `timpani` (apukanava `patarumpu_panns`) | huippu 1,93 s (0,162); nousee 1,2 s, laskee nollaan 2,75 s mennessä |

**Näyttävätkö molemmat patarumpukanavat saman? Ei.** Matala kaista ja aksentit (sekä PANNs timpani) näyttävät patarumpuiskut 1,6–1,9 s; drums-stemmikanava ei näe niitä lainkaan:
Demucs laittaa avauksen patarummut other-stemmiin. **Kanavakortti: `patarumpu_stemmi` on avauksessa (V1) kuollut, älä käytä; `patarumpu_matala` näyttää V1:n, mutta ei ole
selektiivinen** (mediaani 0,10, 95. persentiili 0,68, arvo 1,00 myös 6,51 s kohdassa ja monessa muussa orkesterin matalan kaistan alussa; se on iskuvoima, ei "patarumpu vs. muu").
`patarumpu_tremolo` (matalan kaistan iskuja yli 8/s) on 1 monessa kohdassa (7,0–8,0 s, 9,3–12,0 s, 31,7–36,0 s), joissa ei ole patarumpua varmistettu; `aksentit.py` löytää samalta pätkältä 0 tremoloa. Kanava reagoi kaistan kohinaan: ei luotettava.

### V2: jouset tulevat

| Kanava | Mitattu |
|---|---|
| `jouset` (painotettu) | ensimmäinen ruutu yli 0,05: **3,03 s**; yli 0,10: **4,63 s**; yli 0,20: **5,23 s**; huippu 0–10 s: 5,37 s (0,21) |
| PANNs `bowed_string_instrument` / `violin_fiddle` | huippu **5,13 s** (0,046 / 0,042); nousu alkaa 4,5 s |
| `interpret.py` (PANNs-perheet) | "Jouset tulevat sisään" [0:02.9] (aktiivisuus 0,001 → 0,049) |
| `patarumpu_matala` samaan aikaan | ei laske selvästi: 0,34–0,92 koko 2–6 s |
| `patarumpu_panns` | laskee nollaan 2,75 s; PANNs `timpani` ei enää soi 2,75 s jälkeen |

### V3: puhaltimet tulevat

| Kanava | Mitattu |
|---|---|
| `puupuhaltimet` | ensimmäinen ruutu yli 0,05: 2,97 s; yli 0,10: 5,17 s; **yli 0,15: 16,17 s**; huippu 0–10 s: 5,87 s (0,11), koko 60 s: 29,63 s (0,88) |
| `vasket` | yli 0,10: 2,93 s; yli 0,20: 3,40 s; huippu 0–10 s: 6,57 s (0,43) |
| PANNs puhallinluokat | clarinet huippu **16,97 s** (0,081); wind instrument 18,27 s (0,053); flute 18,27 s (0,013); brass 16,97 s (0,058); french horn 16,67 s (0,021) |
| `interpret.py` | "Vaskipuhaltimet tulevat sisään" [0:04.1] (0,001 → 0,020); "Puupuhaltimet tulevat sisään" [0:15.5] (0,001 → 0,081, x46) |

**Mitä pöytäkirja näyttää:** patarumpuiskut 1,61–1,88 s → luokittelematon, voimakas soiva massa 2,4–4,5 s (other-stemmin taso 0,95 jo 2,75 s; spektrogrammissa harmoniset viivat; PANNs ei
tunnista sitä jousiksi, puhaltimiksi eikä vaskiksi: PANNs-perheluokat < 0,01 kohdassa 2,75–4,25 s) → jouset PANNsin mukaan 4,5–5,5 s → puhaltimet ja vasket PANNsin mukaan 16–18 s.
**Kolme perhekanavaa (`jouset`, `puupuhaltimet`, `vasket`) nousevat 2,9–3,0 s tienoilla yhtä aikaa**, koska kaavassa on yhteinen other-stemmi-osa; ne **eivät erota V2:ta ja V3:a** tällä
60 sekunnin pätkällä. V2:n ja V3:n järjestystä (jouset ennen puhaltimia) tukee vain PANNs (jouset 4,5–5,5 s, puhaltimet 16–18 s), ja sekin on heikko (PANNs-arvot 0,01–0,08). Koska
"partituuri sanoo jouset heti patarumpujen jälkeen", mutta mittaus näyttää 2,4–4,5 s jakson, jota mikään perhekanava ei tunnista, tämä jakso on tarkistettava kuulemalla
(`build/kuuntelu/otteet/0000-0060.wav`, erityisesti 1,5–6 s).

Muuta pöytäkirjasta: yleistauko noin 47,5–50,5 s (taso −70 dBFS 48,0–50,5 s, perhekanavat 0); iskut z ≥ 15: 36,63 s (tutti-isku, z 20,2), 44,44–44,51 s (z 16,3 / 19,9). Duuri/molli-vihjeet: H-duuri
0,26–0,29 kohdissa 10,0–11,5 s; h-molli jopa 0,6 kohdassa 55 s; C-duuri ≤ 0,14 koko 60 s (V6 ja V8 eivät ole tässä pätkässä). Urkupisteitä (> 4 s) ei löytynyt.

## 8. Kanavakortin ensimmäiset rivit (mitattu V1–V3:ssa; muut kohdat V4–V8 testaamatta)

| Kanava | Ensimmäinen rivi |
|---|---|
| `patarumpu_stemmi` | **Kuollut V1:ssä** (0,00; Demucs ei laita avauksen patarumpuja drums-stemmiin). Ei käytetä kuvan ajoitukseen |
| `patarumpu_matala` | Näyttää V1:n (huippu 1,60 s), mutta ei selektiivinen: iskuvoima reagoi kaikkiin matalan kaistan alkuihin |
| `patarumpu_tremolo` | **Epäluotettava**: antaa 1 kohdissa 7,0–8,0 / 9,3–12,0 / 31,7–36,0 s, joissa `aksentit.py` ei löydä tremoloa (0 kpl); ei varmaa tremolokohtaa 60 s:ssa |
| `jousitremolo` | Ei testattu varmassa kohdassa (V7 ei ole pätkässä); yli 0,2 vain 13,00–13,33 s (isku 13,11 s, z 6,4) ja 54,23–54,53 s: **herkkä transienteille** (13,0 s on iskun kohta) |
| `urkupiste` | Ei urkupisteitä > 4 s 60 s:ssa; ei testattu |
| `liiketiheys` | Arvot 0–16 alkua/s (2 s ikkuna); ei testattu varmassa kohdassa (V5) |
| `jouset`, `puupuhaltimet`, `vasket` | **Eivät erotu avauksessa**: nousevat samaan aikaan 2,9–3,0 s (yhteinen other-stemmi-osa); vain PANNs-osa on erotteleva |
| `vihje_*` | Karkea; V6 ja V8 eivät ole pätkässä; ei testattu |

## 9. Mikä ei toiminut ja mitä jäi tekemättä

**Ei toiminut / epäluotettavaa (kirjattu, ei kierretty):**
- `patarumpu_stemmi` kuollut avauksessa; `patarumpu_matala` ja `patarumpu_tremolo` eivät ole selektiivisiä (luku 7).
- Perhekanavat (`jouset`, `puupuhaltimet`, `vasket`) eivät erota V2:ta ja V3:a; kaavojen painot ovat ensimmäinen versio, eikä niitä ole viritetty pöytäkirjaan sopiviksi.
- `analyze.py`:n sävellajiarvio antaa avaukselle "As molli", mikä ei vastaa odotettua h-mollia; syy ratkaisematta (vire, avauksen sävellaji tai chroma patarummun hallitsemassa kohdassa).
- Demucs ei ole toistettavissa bitilleen (`shifts=2` satunnainen): `aksentit.py`:n patarummun lyöntejä 30 → 24 ja vireen säveljoukko muuttui ajojen välillä.
- Ensimmäinen `setup.ps1` jäi punaiseksi torchcrepen puuttuvan tarkistussumman vuoksi (korjattu `--pin`:llä).

**Jäi tekemättä:**
- Koko tiedoston (1063 s) ajo ja muistirajan selvitys (yksi paketti vai 420 s osat); beat_this (`--beats`) ei ajettu; V4–V8 testaamatta.
- Ihmiskorva: kuuntelunäytettä ei ole kuultu eikä mikään kanava ole "käytössä" (analyysisuunnitelma luku 6: käyttäjän kuuleminen).
- Teemakartta, `make_cues.py` ja `kuunteluopas.py` oikealla aineistolla (`annotations/teemat.json` ei ole olemassa; `make_cues.py` testattu ajamalla paketille ja poistamalla tuotettu
  `cues.json`; `kuunteluopas.py` ilmoittaa puuttuvan teemakartan); `themes.py`:n tunnistinosa (vaihe 5).
- `videotarkistus.py` ja `kriitikko.py` testattu vain synteettisellä testivideolla (ääni 0,00 ms, iskujen ruudut luettelona); `render.mjs` ja `camcheck.mjs` vain syntaksin osalta (`node --check`),
  koska `visual/`-kohtausta ei ole.
- `score.py` ja partituuri; `docs/master.md` (masterresepti luvusta 5 ei kirjattu); vireen korjaus (käyttäjän päätös).
- `~/panns_data/class_labels_indices.csv` (kotikansio) on edellisen projektin 29.10. tekemä; `listen.py` kopioi sen sinne vain jos puuttuu (panns_inference lukee sen importissa).
