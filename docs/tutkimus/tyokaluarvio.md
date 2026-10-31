# Työkaluarvio: mitä edellisen projektin työkaluista tarvitaan Tapiolaan

Tehty briefin `docs/briefit/tyokaluarvio.md` mukaan. Lähde: `F:\code\heldenleben-video` (luettu vain sallittu aineisto:
README, CLAUDE.md:n luvut Riippuvuudet / Ääni / Analyysi / Ympäristö, `setup.ps1`, manifestit, `docs/youtube.md`,
`analysis/`- ja `render/`-tiedostojen otsikot, argumentit ja oletusarvot). Mitään ei kopioitu, muokattu eikä ajettu.
Rajaus: jos jokin ei selvinnyt otsikoista, argumenteista ja kohdistetuista hauista, se on merkitty
"ei selviä lukematta koodia tarkemmin".

Uusi aineisto: yksi tiedosto `audio/05_Tapiola.mp3` (17:43 = 1063 s, 44,1 kHz, stereo, 320 kbps), 78-kierroksen
levyiltä tehty siirto. Ei LP:tä, ei puolia, ei FLACia.

## 1. Yhteenveto

| Luokka | Merkitys | Tiedostoja |
|---|---|---|
| A | tarvitaan sellaisenaan | 6 |
| B | tarvitaan, sisältää teoskohtaisia oletuksia | 22 |
| C | kohtauskohtainen tai edellisen tyylin mittari (ei kopioida) | 10 |
| D | epäselvä | 2 |
| | yhteensä (`analysis/` 24, `render/` 10, juuri 5, `docs/youtube.md` 1) | 40 |

Luokitus on tiedostokohtainen. `analysis/__pycache__/` (käännetyt välimuistit) on jätetty pois.

Suurimmat korjaustarpeet yhden mp3-tiedoston lähteelle (tarkemmin luvuissa 3 ja 6):

| # | Korjaustarve | Missä |
|---|---|---|
| 1 | Lähdepolku ja `--side` kovakoodattu: `audio/lp_krauss/side{1,2}.flac`, `choices=(1,2)` | `prepare.py`; sama FLAC-taulukko `rekisteri.py`, `kellot.py`, `teemaviiva.py`, `viuluviiva.py` |
| 2 | Pintakohinan vertailukohta tulee levyn loppuurasta tai sisäänajourasta (`RUNOUT`, `NOISE`), joita mp3:ssa ei ole määritelty | `prepare.py` → `noise_floor_db` → `analyze.py` (musiikin alku, voimakkuus, naksahdukset), `kuuntele.py` (dB*), `rekisteri.py` (12 dB kohinan yli) |
| 3 | Puolen käsite (1/2, A/B) kulkee koko putken läpi: `--A` ja `--B` pakollisia, paketti- ja totuustiedostotaulukot, `cues`-tarkistus sallii vain puolet 1 ja 2 | `themes.py`, `aikajana.py`, `kuuntele.py`, `kuunteluopas.py`, `make_cues.py`, `check_package.py`, `videotarkistus.py`, `render.mjs` |
| 4 | Teoskohtaiset kiinteät tiedot koodissa: lähteiden tahtinumerot, teemojen tunnistimet, 17 ankkuri-ID:tä, kovakoodattu aloitusmerkintä, partituurin PDF | `themes.py`, `make_cues.py`, `kuunteluopas.py`, `videotarkistus.py`, `score.py` |
| 5 | Kuuntelukopion (`build/kuuntelu/…`) tuottavaa skriptiä ei ole tiedostoissa, mutta `render.mjs`, `videotarkistus.py` ja `kellot.py` olettavat sen nimen (`A_puoli_kuuntelu.wav`) | puuttuva vaihe, ks. 3.3 |
| 6 | Lähteen lukutapa: `soundfile` lukee lähdettä suoraan (`kellot`, `rekisteri`, viivatyökalut); onko mp3 luettavissa ja ajassa oikein, ei selviä lukematta koodia tarkemmin, mitattava vaiheessa 1 | `kellot.py`, `rekisteri.py` |
| 7 | Kuolleiden laskentojen poisto: pYIN, librosan tempo ja Es-duuri-kanava lasketaan edelleen | `analyze.py` |

## 2. Tiedostokohtainen arvio

### 2.1 `analysis/`

| Tiedosto | Mitä tekee (yksi rivi) | Luokka | Teoskohtaiset oletukset ja huomiot |
|---|---|---|---|
| `prepare.py` | Leikkaa LP-puolelta pätkän ja tekee ääniraidan (48 kHz stereo) sekä mono- ja puhdistetut kopiot, korjaa suodatinviiveen ja mittaa pintakohinan | B | `--side {1,2}` pakollinen; lähde `audio/lp_krauss/side{N}.flac`; `RUNOUT = {1: (1240, 50), 2: (1400, 60)}` (loppuuran paikka); `--start`/`--duration` (pakollinen) → pakettijako; analyysitaajuus 22 050 Hz; kirjoittaa `side` prepare.jsoniin |
| `analyze.py` | Signaalianalyysi 30 fps:llä (voimakkuus, kaistat, kroma, sävellaji, attakit, patina) → analysis.json/.f32, patina.json | B | Argumentti vain `dir`. Lukee `prepare.json`:n `side`- ja `noise_floor_db`-kentät. Musiikin alku = taso yli 10 dB kohinan päällä 1 s; naksahduskynnys johdetaan kohinasta. Kanava `eb_major` (teoksen sävellaji kiinteänä). Laskee myös pYIN-melodian ja librosan tempon (molemmat merkitty toimimattomiksi, ks. 4.4); alavirran työkalut käyttävät listen.py:n `tempo_bpm`-kanavaa |
| `listen.py` | GPU-kuuntelu: Demucs-stemmit, PANNs-soitinkanavat, (CLAP), beat_this-iskut/tahdit, torchcrepe-sävelet → listen.json/.f32, beats.json, notes.csv | B | Argumentit `dir`, `--steps` (oletus `stemmit,soittimet,iskut,savelet`; `clap` pois). Vaatii CUDAn. Painot kansiosta `models/`. CLAP-kuvaustekstit teoskohtaisia (luonnehdinnat), mutta vaihe on pois oletuksista. Ajat kirjoitetaan "puolen aikana" (`to_side_time`) |
| `interpret.py` | Muuttaa kanavat tapahtumiksi (soitin sisään/ulos, tempomuutos, äkilliset voimakkuusmuutokset, rakenteen muutos) → events.json, yhteenveto.md | B | Argumentti `dir`. Kynnykset kiinteitä (10-kertainen perheaktiivisuus, 6 % tempo, 10 dB/s). Tulostemuoto `[A/B m:ss]` puolesta (`side == 1`) |
| `segments.py` | Jaksotus uutuuskäyrästä (itsesamankaltaisuus), rajat tahdin alkuun → segments.json/.md | B | Argumentit `dir`, `--min-len 5.0`. Soitinperheet kiinteä luettelo. Otsikko "LP-puoli". Tahtiin kohdistus nojaa beats.json-ruudukkoon (ruudukon ajautumisesta: CLAUDE.md) |
| `themes.py` | Yhdistää osapaketit puolen mittaisiksi ja tunnistaa teemat ja tapahtumat äänestä → build/koko/A.npz, B.npz, teemat.json | B | `--A` ja `--B` molemmat pakollisia (`nargs="+"`). Kiinteä `SOURCE`-taulukko (lähteiden jaksot, tahtinumerot, harjoitusnumerot), teemahaku mallilla edellisen teoksen ensiesiintymästä, kiinteät tapahtumatunnistimet, kirjoittaa myös `annotations/themes.json` ja lisää `cues.json`:iin. Apufunktiot (`load_chunk`, `stitch`, `channels`, `key_of`, `runs`, `bar_at`, `theme_search`, `FPS`, `mmss`) ovat yleisiä, ja `aikajana.py` tuo niistä viisi. Raskain korjaus: tunnistinosa kirjoitetaan uudelleen, apufunktiot siirretään |
| `aikajana.py` | Koko levyn aikajana: jaksorajat, dynamiikka, uudet soittimet, soolot, tunnelman muutokset → build/koko/aikajana_A/B.md | B | `--A`, `--B` pakollisia, `--out`. Tuo funktioita `themes.py`:stä. `FAM_FI`-nimistö ja dynamiikka-asteikko kiinteitä. Otsikko "LP-puoli". Otsikkokommentti viittaa edellisen teoksen vahvistettuihin kohtiin (vain kommentti) |
| `make_cues.py` | Kokoaa `annotations/cues.json`:n teemakartasta, analyysipaketeista ja tahdeista; vahvistettuja kohtia ei muuteta | B | Argumentti `packages` (1+). Kiinteä erikoistapaus: jos paketti kattaa 7,6 s ja puoli on 1, lisätään kiinteällä id:llä ja teemanimellä alkumerkintä. `es_duuri`-merkintä sävellajista "Eb duuri". Tahdit puolittain (avaimet "1", "2"). Lukee `annotations/teemat.json` ja `cues.example.json` |
| `kuunteluopas.py` | Generoi kuunteluoppaan aikakoodatut osat (ankkurit, minuutit, tarkistettavat) teemakartasta | B | Ei argumentteja. `ANCHORS` = 17 teoskohtaista ankkuri-ID:tä kiinteänä; silmukka puolille `(1, 2)`; `"AB"[side-1]`; kirjoittaa `GEN:`-merkkien väliin tiedostoon `annotations/kuunteluopas.md`; lukee `build/koko`-aikajanan |
| `aksentit.py` | Iskut ja aksentit 10 ms tarkkuudella (spektrivuo, z-pisteet, kaistat, rumpustemmi, tremolot) → aksentit.json/.md | A | Argumentit `package`, `--top 80`, `--zmin 5.0`. Lukee paketin `analysis.json`, `clean_mono.wav`, valinnaisesti `stems/drums.wav` ja `patina.json`. "puoli" vain otsikkotekstissä. Kommentissa edellisen teoksen aikoja (ei vaikutusta) |
| `kuuntele.py` | Korvat yhteen taulukkoon: voimakkuus, stemmiosuudet, PANNs, CREPE-sävelet aikavälille | B | `--side` pakollinen, `--from`, `--to` pakollisia, `--step 0.5`, `--min-conf 0.6`. Kiinteä `PACKAGES = {1: [demo400, A2, A3], 2: [B1..B4]}`; paketti valitaan peiton mukaan. Tuloste "alkuperäisen FLACin aikaa" |
| `rekisteri.py` | Rekisterit ja sävelet alkuperäisestä äänestä levyn kohinaan verrattuna (taajuus "soi" kun yli 12 dB kohinan) | B | `--side` pakollinen, `--from`, `--to`, `--step 1.0`. `FILES` = FLAC-polut; `NOISE = {1: (4.0, 7.2), 2: (1400, 1406)}` (kohinan vertailukohta sekunteina); kaistat kiinteät. Lukee lähdettä suoraan `soundfile`lla |
| `kellot.py` | Mittaa ristikorrelaatiolla, soivatko johdetut tiedostot ja video samaa aikaa kuin vertailutiedosto (ero ms, ajautuminen ppm) | B | `packages`, `--file`, `--side`, `--start`, `--ref`. Oletusvertailu `FILES[side]` = FLAC; `--ref` ohittaa sen (tämä reitti toimii kuuntelukopiolla ilman puolia, kun `--side` ei tarvita). Hyväksyntäraja 2 ms, hiljaisuusraja -45 dB, ikkuna 6 s. Pakettitila lukee `prepare.json`:n `side`-kentän |
| `check_package.py` | Tarkistaa paketin JSON-/binääridatan sekä `cues.json`:n rakenteen | B | Argumentit `packages`, `--cues-only`. Vaatii 30 fps; sallii cues-kentässä `side` vain 1, 2 tai tyhjän; sallittuihin teemoihin kiinteästi `rakenteen_muutos`, `es_duuri`. Muuten yleinen |
| `fetch_models.py` | Lataa mallipainot `models.json`:n mukaan kansioon `models/` ja tarkistaa SHA-256 | A | `--check`, `--pin`. Tyypit `url`, `hf`, `package`. Vain User-Agent-merkkijono kantaa projektin nimeä |
| `models.json` | Mallipainojen manifesti (16 tiedostoa tarkistussummineen) | A | Sisältö ks. 4.3. CLAP-merkinnät (8 tiedostoa) liittyvät toimimattomaan vaiheeseen. Lisenssikentissä kaksi `[tarkista]` (PANNs-painot, beat_this-painot) |
| `score.py` | Renderöi partituurin sivut kuviksi ja tunnistaa tahtiviivat/tahtinumerot tarkistusta varten (PyMuPDF) | B | `--pdf`, `--pages`, `--first-page 3`. Oletus-PDF on edellisen teoksen IMSLP-tiedosto projektin juuressa; kommentit sivukohtaisista rajoituksista (sivunumerot) ja kiinteät tulosteen tarkistuskohdat; kynnykset (nuottiviiva yli 45 % leveydestä) viritetty yhdelle painokselle. Tapiolan partituuri ei ole kansiossa (CLAUDE.md: partituuri vain tarkistukseen) |
| `videotarkistus.py` | Valmiin videon tarkistus: ääni totuutta vasten (`kellot.py`), `isku`-kohtien ruudut, jähmettymät ennen yleistaukoa | B | `video`, `--start`, `--side`. `TRUTH = build/kuuntelu/{A,B}_puoli_kuuntelu.wav`; `PACKS` kiinteä; yleistauon ankkuri-ID kiinteä ja teoskohtainen; 33 ms -sääntö, `STILL`-kynnys 0,08; esimerkkipolku edellisen ajon videoon. Tuo `kellot.py`:n |
| `jatkuvuus.py` | Videosta paikallisen välkynnän (toistuva pulssi samassa pikselissä) ja äkillisten hyppyjen löytäminen | D | Yleinen tarkoitus, mutta kynnykset viritetty yhdelle ajolle (`youtube.md`: 1238 välkyntälöydöstä, joista 67 yli pisterajan, ja 425 hyppyä, joista 407 iskujen ulkopuolella, eli mittari ylihälyttää). Argumentit: `video`, `--start`, `--side 1`, `--from`, `--to`, `--amp 20`, `--repeat 3`, `--min-px 2`, `--jump-amp 25`, `--jump-ratio 6`, `--jump-blocks 4`, `--aksentit` (oletus `build/demo400/aksentit.json`), `--akz 4.0`, `--fail-score 150`, `--top 15`, `--json`. Otsikko viittaa edellisen tyyliohjeen lukuun. Päätös: kirjoitetaanko uudelleen vaiheessa 6 |
| `teemaviiva.py` | Melodian tarkka sävelkorkeus äänestä, kun muoto (sävelten järjestys) tunnetaan partituurista (CQT-salienssi, harmoninen summa) | D | `--side 1`, `--muoto` (JSON: tahtiankkurit, nuotit; pakollinen), `--out`, `--band 1.5`. `FILES` = FLAC, `NOISE` kuten rekisterissä. Menetelmä yleinen, mutta käyttö riippuu siitä, tarvitseeko Tapiola partituuriin sidotun sävelkorkeusviivan; ei selviä ennen vaihetta 6 |
| `viuluviiva.py` | Yhden soolosoittimen sävelkorkeus ilman partituuria (CQT-salienssi + Viterbi) | C | `--side 1`, `--from`, `--to` pakollisia, `--out`, `--stem vocals`, `--mode {suunta,viterbi}`, `--peak-ratio 2.0`, `--jump 1.05`, `--octave 8.0`. Soolosoittimen alue (G3–E7), `PACKS = {1: [build/A2, build/A3]}`, viittaa edellisen kohtauksen data.js:ään. Soitin- ja teoskohtainen |
| `opastarkistus.py` | Kuunteluoppaan ankkureiden ja soitinroolien tarkistus kuvaa vasten | C | `probe`, `--out`, `--vastaukset` ja `--roolit` (oletuksena edellisen kohtauksen kansion JSON-tiedostot). Lukee edellisen kohtauksen vastaus- ja roolitiedostoja; kohtauskohtainen |
| `liikekayra.py` | Videon rajatulta alueelta ruutu ruudulta mitattu luku → onko liike yksi kaari vai monta | C | `video`, `--start`, `--end` pakollisia, `--crop`, `--mode {luma,cover,red-y,red-x,dark-y}`, `--thr 140`, `--fps 10`, `--smooth 0.3`, `--vmin 0.03`, `--minseg 0.4`, `--png`, `--ffmpeg`. Värimoodit ja kynnykset kohtauskohtaisia; liikesääntö tulee vasta Tapiolan kuvasäännöistä |
| `kriitikko.py` | Kokoaa tuoreelle tarkistajalle aineiston: palautekohtien ruutusarjat, oton kaksi stilliä, liikekäyrät → index.md | B | `video`, `--items`, `--otot`, `--liikkeet`, `--out` (pakollinen), `--start`, `--end`, `--max-frames 60`, `--width 480`, `--ffmpeg`. Tekstit viittaavat edellisen projektin dokumentteihin (ohjaus, roolit, kuvasäännöt, "tyyli"-sarake); `--otot` jäsentää `camcheck`-tulosteen riviä regexillä ("kääntö"), joten riippuu `camcheck.mjs`:n tulostemuodosta; `--liikkeet` tuo `liikekayra.py`:n (C) vain, jos käytetään. Kriitikkoportti on Tapiolan CLAUDE.md:n sääntö |

### 2.2 `render/`

| Tiedosto | Mitä tekee (yksi rivi) | Luokka | Teoskohtaiset oletukset ja huomiot |
|---|---|---|---|
| `serve.mjs` | Staattinen palvelin projektin juuresta (esikatselu ja renderöinti), Range-tuki | A | Portti 5173 (`PORT`), 127.0.0.1; MIME-lista ei sisällä `.mp3`:a (palautuu `application/octet-stream`); esikatselutuloste viittaa `/visual/`-polkuun |
| `check-webgl.mjs` | Tarkistaa, että headless-Chrome saa WebGL2:n, ja tulostaa näytönohjaimen nimen | A | `--enable-gpu --ignore-gpu-blocklist`; `setup.ps1` kutsuu sitä |
| `render.mjs` | Renderöi: Puppeteer kutsuu `seek(t)` ruutu kerrallaan, ruudut ffmpegille osina, liitos, ääni ja kontaktiarkki | B | Argumentit `--page` (oletus `visual/index.html`), `--data` (oletus `build/demo`), `--out`, `--start`, `--end`, `--stills`, `--debug`, `--dir`, `--workers 1`, `--fade-out`, `--chunk 40`, `--quality 92`, `--audio`, `--side`. Äänen oletus `build/kuuntelu/{A,B}_puoli_kuuntelu.wav` puolen mukaan (`--audio` ohittaa). Kiinteä 1920×1080, 30 fps. Kohtaukselta vaaditaan `window.seek`, `sceneReady`, `sceneError`, `duration`, `contextOk`. ffmpeg-kutsut ks. luku 5 |
| `camcheck.mjs` | Käy ruudut läpi ilman piirtoa ja laskee otoittain kameran kulmanopeuden (°/s) ja siirtonopeuden | B | `--page` (oletus edellisen kohtauksen polku), `--data` (oletus `build/demo400`), `--max 20`, `--step 1`. Vaatii kohtaukselta `window.camProbe(t)` (kvaternio, sijainti, otto, leikkaus). Raja 20 °/s vastaa Tapiolan CLAUDE.md:n sääntöä |
| `kohtauscheck.mjs` | Lavasteiden reunojen tarkistus: kohtaus piirtää magenta-taustaa vasten, vuotava pikseli paljastaa peittämättömän kohdan | C | `--page`, `--data`, `--step 5`, `--from`, `--to`; vaatii `window.leakProbe`, kerrosten `userData.edge`; nojaa edellisen kohtauksen kerrosrakenteeseen. Idea (vuotomittari) mainittu Tapiolan CLAUDE.md:ssä, toteutus kirjoitetaan uudelleen |
| `draft.mjs` | Still jokaisesta kuvakäsikirjoituksen kohtauksesta elokuvaslaten (kohtaus, alku, kesto) kanssa | C | `--page`, `--dir`, `--only`, `--slate`; vaatii `window.sceneTimes()`; oletuspolut edellisen ajon kansioihin |
| `opascheck.mjs` | Kysyy kohtaukselta `window.opasProbe(t)` kunkin teemakartan ankkurin ympärillä ja aikajanalta → JSON `opastarkistus.py`:lle | C | `--page`, `--data`, `--from`, `--to`, `--out`, `--dt 0.1`, `--side 1`; lukee `cues.json`:n `teema`-kentän; oletuspolut edellisen kohtauksen kansioon |
| `otecheck.mjs` | Mittaa kämmenen ja varren etäisyyden annetuilla hetkillä (`window.gripProbe`) | C | `--page`, `--data`, `--times` tai `--from/--to/--step`, `--max 0.05`, `--json`; kohtauskohtainen |
| `karkicheck.mjs` | Mittaa vedon uusimman pään ja kärjen etäisyyden joka ruudulla (`opasProbe`.`karki_ero`) | C | `--page`, `--data`, `--from`, `--to`, `--step`, `--max 0.1`; kohtauskohtainen |
| `kaarevyys.mjs` | Kärjen korkeuden tasaisuus (toinen derivaatta ja Spearman teemaviivaan) | C | `--from`, `--to`, `--max`, `--skip`, `--dump`; edellisen kohtauksen sivupolku ja `build/demo400` kiinteänä; kohtauskohtainen |

### 2.3 Juuri ja dokumentit

| Tiedosto | Mitä tekee (yksi rivi) | Luokka | Teoskohtaiset oletukset ja huomiot |
|---|---|---|---|
| `setup.ps1` | Asentaa ja tarkistaa ympäristön: ffmpeg (libx264), Python 3.12, Node 18+, uv-lukitus, kirjastot, CUDA, mallipainot, Node-paketit, `npm audit`, WebGL2, Audacity (valinnainen), kansiot, äänite, `cues.json`, levytila | B | Parametrit `-CheckOnly`, `-WithAudacity`. Nimi "Heldenleben" ohjeessa; tarkistaa paketit `three`, `puppeteer`; viesti sisältää CLAP:n; luo kansion `output`; äänitetarkistus hyväksyy jo `.mp3`; virheilmoitus "WAV tai FLAC"; vähintään 50 Gt vapaata; Node-raja 18+ (Tapiola: Node 22) |
| `pyproject.toml` | Python-riippuvuudet (ks. 4.1) | B | Nimi ja kuvaus edellisen teoksen; `requires-python >=3.12,<3.13`; `package = false`; lukitus vain Windowsille; PyTorch cu130-indeksistä; `pymupdf` vain `score.py`:lle; `transformers` vain CLAP-vaiheelle |
| `uv.lock` | Lukitus pyproject.tomlille (81 pakettia) | A | Sisältää juuripaketin nimen `heldenleben-video` (virtual); jos pyproject.toml muuttuu, `uv lock` uudelleen |
| `package.json` | Node-riippuvuudet ja skriptit `preview`, `render`, `check-webgl` | B | `three ^0.170.0` (kirjasto, jonka tarve riippuu tyylistä) ja `puppeteer ^25.16.0` (devDependency); Tapiolan CLAUDE.md: tekniikka valitaan tyylin mukaan |
| `package-lock.json` | Lukitus (lockfileVersion 3, noin 28 `node_modules`-merkintää) | B | Seuraa package.jsonia: `three`-merkintä pois tai pysyy, jos kirjasto valitaan |
| `docs/youtube.md` | Edellisen videon julkaisusuunnitelma (oikeudet, tarkistukset, master, otsikko, kuvaus, vaiheet) | C | Dokumentti kohtauskohtainen. Vain luvun 3 ffmpeg-komento (master) on A, ks. luku 5 |

## 3. Putki yhdelle tiedostolle

### 3.1 Komentojen järjestys ja puoli-/FLAC-oletukset

| # | Vaihe | Komento (edellisen projektin muoto) | Syöttö → tuloste | Olettaa puolia tai FLACia? |
|---|---|---|---|---|
| 1 | prepare | `prepare.py --side N --start s --duration s --out build/<paketti>` | lähde → soundtrack.wav, orig/declick/clean_mono.wav, clean_44k.wav, prepare.json | **Kyllä**: `--side {1,2}`, `audio/lp_krauss/side{N}.flac`, `RUNOUT` |
| 2 | analyze | `analyze.py build/<paketti>` | prepare.json + wavit → analysis.json/.f32, patina.json, plots | Epäsuorasti: `prepare.json`:n `side`, `noise_floor_db`; kanava `eb_major` |
| 3 | listen | `listen.py build/<paketti> [--steps ...]` | clean_44k.wav → listen.json/.f32, beats.json, notes.csv, stems/, LUE_MINUT.md (GPU) | Epäsuorasti: kirjoittaa `side`; ajat "puolen aikaa" |
| 4 | interpret | `interpret.py build/<paketti>` | analysis+listen+beats → events.json, yhteenveto.md | Otsikko/aikaleima puolesta |
| 5 | segments | `segments.py build/<paketti> [--min-len]` | → segments.json, segments.md | Otsikko puolesta |
| 6 | aksentit | `aksentit.py build/<paketti> [--top --zmin]` | clean_mono.wav (+ drums-stemmi, patina) → aksentit.json/.md | Ei (vain otsikko) |
| 7 | kuuntele / rekisteri | `kuuntele.py --side N --from a --to b`; `rekisteri.py --side N --from a --to b` | paketit / lähde suoraan | **Kyllä**: molemmat `--side`; `PACKAGES`; `rekisteri` lukee FLACin ja `NOISE`-ikkunan |
| 8 | themes / aikajana | `themes.py --A ... --B ...`; `aikajana.py --A ... --B ...` | osapaketit → build/koko/A.npz, B.npz, aikajana_A/B.md | **Kyllä**: `--A` ja `--B` pakollisia; sisäinen `{1: ..., 2: ...}` |
| 9 | teemakartta (käsin) | muokataan `annotations/teemat.json` | aikajana → teemakartta | Teemakartan `side`-kenttä (tapahtumilla ja jaksoilla) |
| 10 | make_cues | `make_cues.py build/<paketti> [...]` | teemakartta + paketit → annotations/cues.json | **Kyllä**: puolittaiset tahdit, kiinteä aloitusmerkintä (puoli 1, 7,6 s) |
| 11 | kuunteluopas | `kuunteluopas.py` | teemakartta + aikajana → annotations/kuunteluopas.md (GEN-osat) | **Kyllä**: `(1, 2)`, `"AB"[side-1]`, 17 ankkuri-ID:tä |
| 12 | check_package | `check_package.py build/<paketti>`; `--cues-only` | paketti, cues.json → OK/VIRHE | Lievästi: `side` ∈ {1, 2, tyhjä} |
| 13 | videotarkistus | `render.mjs ...` → `videotarkistus.py video.mp4 [--start --side]` | video, teemakartan `isku`-kohdat → poikkeamat | **Kyllä**: `TRUTH`/`PACKS` puolittain |
| 14 | kellot | `kellot.py build/<paketti>`; `kellot.py --file ... --ref build/kuuntelu/... --start s` | johdetut tiedostot / video vs. vertailu → ero ms, ppm | **Kyllä** pakettitilassa (`FILES[side]` = FLAC); `--ref`-tila toimii kuuntelukopiolla |

### 3.2 Mitä putki olettaa lähteestä

| Oletus | Missä | Vaikutus mp3:lle |
|---|---|---|
| Pintakohina mitataan loppuurasta (`RUNOUT`) | `prepare.py` | 78-kierroksen siirrossa loppuuraa ei ole tiedossa; vertailukohta pitää valita ja mitata; ei selviä ilman kuuntelua, onko tiedostossa sisäänajouraa tai pelkkää kohinaa |
| Musiikin alku = taso yli 10 dB kohinan päällä 1 s ajan | `analyze.py` | Jos tiedosto alkaa suoraan musiikilla, `music_start` ja `loudness`-normalisointi on tarkistettava |
| Kohinan vertailu 12 dB `rekisteri.py`:ssa | `rekisteri.py` (`NOISE`) | Sama kohinaikkunakysymys; lähdetiedoston luku suoraan |
| Jakoalue 420 s osiin | README, CLAUDE.md (paketit demo400, A2, A3, B1–B4) | 1063 s tiedostoa ei ole pakko jakaa, mutta syy 420 s:iin ei selviä lukematta koodia tarkemmin; `themes.stitch` yhdistää limittäiset osat |
| Aikojen totuus on kuuntelukopio, ei lähde | CLAUDE.md (Ääni), `render.mjs`, `videotarkistus.py`, `kellot.py --ref` | Tapiolan CLAUDE.md sanoo saman (`build/kuuntelu/`) |
| 30 fps -ruutuaika, ruutu i = i/30 s | `analyze.py` (hop 735 @ 22 050 Hz), `check_package.py` | Siirtyy sellaisenaan |

### 3.3 Puuttuva vaihe: kuuntelukopio

`render.mjs` (äänen oletus), `videotarkistus.py` (`TRUTH`) ja `kellot.py` (esimerkit) viittaavat tiedostoihin
`build/kuuntelu/A_puoli_kuuntelu.wav` ja `B_puoli_kuuntelu.wav`. Mikään luetuista skripteistä ei tuota niitä.
Tuotantotapa ei selviä lukematta koodia tarkemmin; Tapiolassa se on määriteltävä erikseen (komento, nimi, näytetaajuus),
ja `render.mjs`:n äänen oletus sekä `videotarkistus.py`:n `TRUTH` ohjataan siihen.

## 4. Riippuvuudet

### 4.1 `pyproject.toml` (Python 3.12, `package = false`, lukitus vain `sys_platform == 'win32'`)

| Paketti | Versio (pyproject → uv.lock) | Käyttö | Huomio |
|---|---|---|---|
| librosa | `>=0.10` → 1.0.0 | signaalianalyysi | pYIN ja `tempo` siitä merkitty toimimattomiksi orkesterille |
| numpy | ei rajaa → 2.5.4 | | |
| scipy | ei rajaa → 1.18.1 | | |
| soundfile | ei rajaa → 0.14.0 | lähteen ja wavien luku | mp3-luku: ei selviä lukematta koodia tarkemmin |
| matplotlib | ei rajaa → 3.11.2 | kuvaajat | |
| torch | `==2.11.0` → 2.11.0+cu130 | GPU | cu130-indeksi pytorch.org |
| torchaudio | `==2.11.0` → 2.11.0+cu130 | beat_this, torchcrepe | |
| panns-inference | `==0.1.1` | soittimet (AudioSet CNN14) | lataa tiedostoja jo importissa (`setup.ps1`:n kommentti); korvataan painoilla `models/panns` ja luokkatiedoston kopioinnilla |
| transformers | `>=5.0` → 5.21.1 | vain CLAP-vaihe (`listen.py` rivi 210) | CLAP toimimaton; muita käyttäjiä ei löytynyt `listen.py`:stä |
| beat-this | `==1.1.0` | iskut, tahdit | paino `models/beat_this/final0.ckpt` |
| demucs | `==4.1.0` | stemmit | paino `models/demucs` |
| torchcrepe | `==0.0.24` | melodia, basso | painoja ei listattu `models.json`:ssa; ei selviä lukematta koodia tarkemmin, tuleeko ne paketin mukana |
| pymupdf | `>=1.24,<2` → 1.28.2 | `score.py` (partituurin sivut) | tarvitaan vain, jos partituuri luetaan kuviksi |

Lukituksessa on 81 pakettia. Uv-konfiguraatio: `[[tool.uv.index]] pytorch-cu130`, `explicit = true`, `torch` ja `torchaudio` sidottu siihen.

### 4.2 `package.json` ja `package-lock.json`

| Kohta | Sisältö |
|---|---|
| name / type | `heldenleben-video`, `"type": "module"`, private |
| scripts | `preview` = `node render/serve.mjs`, `render` = `node render/render.mjs`, `check-webgl` = `node render/check-webgl.mjs` |
| dependencies | `three ^0.170.0` (lukitus 0.170.0) |
| devDependencies | `puppeteer ^25.16.0` (lukitus 25.16.0) |
| lukitus | lockfileVersion 3; asennus `npm ci` |

### 4.3 `models.json` (SHA-256 tarkistettu, `fetch_models.py`)

| Nimi | Tyyppi | Tiedostoja | Tehtävä | Tila |
|---|---|---|---|---|
| `panns_cnn14_sed` | url (Zenodo) | 1 | soitinluokat ruuduittain (527 luokkaa) | käytössä |
| `audioset_labels` | url (Google Cloud) | 1 | AudioSet-luokkien nimet (PANNs lukee) | käytössä |
| `clap_music` | hf (laion/larger_clap_music, kiinnitetty revisio) | 8 | soittimet ja luonne tekstikuvauksilla | **rikki** (ks. 4.4) |
| `demucs_htdemucs_ft_bag` | package | 1 | neljän mallin kokoonpanon kuvaus (yaml) | käytössä |
| `demucs_htdemucs_ft_drums` | url (dl.fbaipublicfiles.com) | 1 | stemmi: rummut | käytössä |
| `demucs_htdemucs_ft_bass` | url | 1 | stemmi: basso | käytössä |
| `demucs_htdemucs_ft_other` | url | 1 | stemmi: muu | käytössä |
| `demucs_htdemucs_ft_vocals` | url | 1 | stemmi: "laulu" (orkesterissa johtava linja) | käytössä |
| `beat_this_final0` | url (cloud.cp.jku.at) | 1 | iskut ja tahdin alut | käytössä |
| yhteensä | | 16 | README: 1,45 Gt | |

### 4.4 Rikkinäiseksi merkityt

| Riippuvuus | Mistä merkintä | Mitä sanotaan | Miten koodissa |
|---|---|---|---|
| CLAP | CLAUDE.md (Analyysi), `pyproject.toml`, `listen.py` | painot (`laion/larger_clap_music`) antavat kaikille teksteille saman upotuksen (teksti–teksti 1,00; siniääni vs. kohina 0,97), vika painoissa, ei kirjastossa (`transformers` 5.21.1 ja 4.57.x) | `DEFAULT_STEPS` ei sisällä `clap`-vaihetta; `models.json` ja `setup.ps1` ylläpitävät sitä silti |
| pYIN | CLAUDE.md (Analyysi) | ei toimi orkesterissa | `analyze.py` laskee sen silti (`f0_midi`, `voiced_prob`); `interpret`/`segments`/`themes`/`aikajana`/`make_cues`/`kuuntele`/`check_package` eivät lukeneet näitä kanavia (haettu hauilla) |
| librosan tempo | CLAUDE.md (Analyysi) | ei toimi orkesterissa | `analyze.py` laskee kanavan `tempo`; alavirta käyttää `listen.py`:n `tempo_bpm` (beat_this) |
| tahtinumerot | CLAUDE.md, `themes.py`, `score.py` | tahtiruudukko ajautuu tempomuutoksissa; tahtinumeroita ei lasketa äänestä; partituurin tahtinumerot "suuntaa antavia [tarkista]" | koodi laskee ruudukon ja kirjaa sen diagnostiikkana |
| ff-tutin vaskisokeus | CLAUDE.md, `aikajana.py` | PANNs ei näe vaskea ff-tutissa; hiljaisissa kohdissa rahina näyttää lautasilta | huomioitu kommenteissa; ei koodikorjausta |

## 5. Masterresepti (`docs/youtube.md`, luku 3)

Dokumentin ainoa ffmpeg-komento (ajettu edellisellä projektilla; muuta tekstiä ei lainata):

```
ffmpeg -i <lähdevideo>.mp4 \
  -vf "scale=3840:2160:flags=lanczos+accurate_rnd+full_chroma_int:in_range=pc:out_range=tv:in_color_matrix=bt470bg:out_color_matrix=bt709,format=yuv420p" \
  -c:v libx264 -preset medium -crf 20 -maxrate 60M -bufsize 120M -profile:v high -level 5.1 \
  -g 15 -keyint_min 15 -bf 2 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a copy -movflags +faststart \
  <master>_youtube_2160p.mp4
```

(Tiedostopolut on korvattu paikanvaraajilla.)

| Parametri | Arvo | Huomio Tapiolalle |
|---|---|---|
| `scale` | `3840:2160:flags=lanczos+accurate_rnd+full_chroma_int` | Täsmälleen kaksinkertainen skaalaus 1920×1080 -lähteestä; vaatii, että kohtaus on kiinteästi 1080p |
| `in_range` / `out_range` | `pc` / `tv` | Lähde oletettu täyden alueen YUV:ksi (`yuvj420p`, JPEG-ruuduista, `bt470bg`); `render.mjs` koodaa osat `-pix_fmt yuv420p` (rivit 61–62), joten onko lähde oikeasti täyttä aluetta, ei selviä lukematta koodia tarkemmin: mitattava `ffprobe`lla ennen reseptin käyttöä |
| `in_color_matrix` / `out_color_matrix` | `bt470bg` / `bt709` | Sama kuin edellä |
| `format` | `yuv420p` | |
| `-c:v` | `libx264 -preset medium -crf 20 -maxrate 60M -bufsize 120M` | CRF valittu 15 s:n bittinopeusmittauksilla (CRF 16: 65–85, 19: 49–66, 21: 41–55 Mbit/s); valinta on kuvan sisällön mukainen, joten tarkistettava Tapiolan kuvalla |
| `-profile:v` / `-level` | `high` / `5.1` | |
| `-g` / `-keyint_min` / `-bf` | `15` / `15` / `2` | Suljettu GOP puoli ruututaajuutta (YouTube-suositus dokumentin mukaan) |
| väri | `-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv` | Loppuliitteen mukaan x264 ei kirjoittanut `primaries`- ja `transfer`-kenttiä ensimmäisellä kerralla, ja ne kirjoitettiin jälkikäteen `h264_metadata`-suodattimella; sen komentoa dokumentti ei anna |
| ääni | `-c:a copy` | Lähderenderin ääni on AAC 320 kbit/s (`render.mjs`) |
| `-movflags` | `+faststart` | `moov` tiedoston alkuun |

Edellisen ajon mittaus (1240 s, vain tulos): 3840×2160, 30 fps, 7,52 Gt, keskimäärin 48,2 Mbit/s, koodausaika 14 min.
Laskennallinen arvio Tapiolalle (1063 s, sama bittinopeus): noin 6,4 Gt. Se on laskelma, ei mittaus.

`render.mjs`:n omat ffmpeg-kutsut (luettu koodista, ei `youtube.md`:stä):

| Vaihe | Parametrit |
|---|---|
| Ruutuosan koodaus | `-f image2pipe -c:v mjpeg -framerate 30 -i - -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p <osa>` |
| Liitos ja ääni | `-f concat -safe 0 -i <lista> -ss <alku> -i <äänitiedosto> -map 0:v -map 1:a -c:v copy [-af afade=t=out:st=<..>:d=<..>] -c:a aac -b:a 320k -t <kesto> -movflags +faststart` |
| Kontaktiarkki | `-i <video> -vf fps=<30/kesto>,scale=480:-1,tile=6x5 -frames:v 1` |
| Muuttuja | `FFMPEG` ympäristömuuttuja ohittaa PATHin ffmpegin |

## 6. Suositus

### 6.1 Kopioitavat tiedostot ja korjaustarve

| Tiedosto | Luokka | Korjaustarve yhdellä rivillä |
|---|---|---|
| `analysis/fetch_models.py` | A | Sellaisenaan; vain User-Agent-nimi vaihdettavissa |
| `analysis/models.json` | A | Poista CLAP-merkinnät (8 tiedostoa), jos vaihe jää pois; muuten sellaisenaan (8 painotiedostoa jäljelle) |
| `analysis/aksentit.py` | A | Sellaisenaan; kommentin vanhat ajat voi poistaa |
| `render/serve.mjs` | A | Sellaisenaan; lisää `.mp3`/`.mp4` MIME-listaan tarvittaessa ja vaihda esikatselutulosteen polku |
| `render/check-webgl.mjs` | A | Sellaisenaan |
| `uv.lock` | A | Käy sellaisenaan, kunhan pyproject.toml säilyy; nimen vaihdon jälkeen `uv lock` |
| `analysis/prepare.py` | B | Korvaa `--side`/FLAC-polku lähdepolulla (`audio/05_Tapiola.mp3`); korvaa `RUNOUT` mitatulla kohinaikkunalla; älä pakota puolta |
| `analysis/analyze.py` | B | Poista pYIN, librosan tempo ja `eb_major`; tarkista `music_start`-logiikka ilman loppuuraa |
| `analysis/listen.py` | B | Poista `clap`-vaihe ja teoskohtaiset CLAP-tekstit; muuten kopioitavissa, `side` vakioksi |
| `analysis/interpret.py` | B | Poista `[A/B ...]`-aikaleima puolesta; muuten sellaisenaan |
| `analysis/segments.py` | B | Poista "LP-puoli"-otsikko; soitinperheluettelo tarkistettava Tapiolan kokoonpanolle |
| `analysis/themes.py` | B | Kirjoita tunnistinosa ja `SOURCE` uudelleen Tapiolalle; siirrä vain apufunktiot ja `stitch`; tee `--B` valinnaiseksi |
| `analysis/aikajana.py` | B | `--B` valinnaiseksi; irrota `themes.py`-riippuvuus erilliseen apumoduuliin; poista "LP-puoli" |
| `analysis/make_cues.py` | B | Poista kiinteä aloitusmerkintä (7,6 s, puoli 1) ja `es_duuri`; yksi tahtilista puolten sijaan |
| `analysis/kuunteluopas.py` | B | Korvaa 17 ankkuri-ID:tä Tapiolan teemakartan ankkureilla; poista puolisilmukka ja "AB"-etiketti |
| `analysis/kuuntele.py` | B | Poista `--side` ja `PACKAGES`-taulukko; lue paketit hakemistosta; muuta "alkuperäisen FLACin aikaa" |
| `analysis/rekisteri.py` | B | Korvaa `FILES`/`--side` mp3-polulla ja `NOISE` mitatulla ikkunalla; varmista mp3:n luku |
| `analysis/kellot.py` | B | Korvaa oletusvertailu FLAC lähteellä/kuuntelukopiolla; `--ref`-tila säilytetään; varmista mp3-luku |
| `analysis/check_package.py` | B | Poista `side ∈ {1,2}` ja `es_duuri`-teemaoletus |
| `analysis/score.py` | B | Vaihda oletus-PDF ja sivukohtaiset huomiot; kynnykset viritettävä uudelle painokselle; vaatii partituurin kansioon |
| `analysis/videotarkistus.py` | B | Korvaa `TRUTH`/`PACKS` yhdellä kuuntelukopiolla; yleistauon ankkuri-ID teemakartasta |
| `analysis/kriitikko.py` | B | Poista viittaukset edellisen dokumentteihin (tekstit); tarkista `camcheck`-tulosteen regex |
| `render/render.mjs` | B | Vaihda `--page`/`--data`-oletukset ja äänen oletus kuuntelukopioon (ei A/B-valintaa) |
| `render/camcheck.mjs` | B | Vaihda oletussivu/-data; vaatii `window.camProbe`-rajapinnan uudelta kohtaukselta |
| `setup.ps1` | B | Vaihda nimi, poista CLAP-maininta, päivitä Node-raja (22), äänitetarkistuksen viesti; `three` valinnaiseksi |
| `pyproject.toml` | B | Vaihda nimi/kuvaus; harkitse `transformers`- ja `pymupdf`-riippuvuuksien poistoa (CLAP, partituuri) |
| `package.json` | B | Vaihda nimi; `three` vasta tyylin valinnan jälkeen; `puppeteer` pysyy |
| `package-lock.json` | B | Luodaan uudelleen package.jsonista (`npm install`, sitten `npm ci`) |

### 6.2 Ei kopioida

| Tiedosto | Luokka | Perustelu |
|---|---|---|
| `analysis/viuluviiva.py`, `opastarkistus.py`, `liikekayra.py` | C | Soitin-, kohtaus- tai tyylisidonnaisia |
| `render/kohtauscheck.mjs`, `draft.mjs`, `opascheck.mjs`, `otecheck.mjs`, `karkicheck.mjs`, `kaarevyys.mjs` | C | Kohtauskohtaisia; idea (esim. vuotomittari) kirjoitetaan uudelleen vaiheessa 6 |
| `docs/youtube.md` | C | Julkaisudokumentti; vain luvun 5 ffmpeg-komento käytetään |
| `analysis/jatkuvuus.py`, `analysis/teemaviiva.py` | D | Päätetään vaiheessa 6 (ks. 2.1) |

### 6.3 Avoimet kysymykset (eivät selvinneet luetusta aineistosta)

| Kysymys | Miksi merkitsee |
|---|---|
| Voiko `soundfile` lukea mp3:n suoraan, ja onko aika oikein (dekoodausviive)? | `rekisteri.py`, `kellot.py`, viivatyökalut lukevat lähdettä suoraan |
| Tuottaako `prepare.py` mp3:sta oikeanpituiset wavit (`ffmpeg -ss -i`) ja mikä on kohinan vertailukohta? | Kohinataso ohjaa koko analyysia |
| Miksi paketit ovat 420 s? | Päättää, ajetaanko 1063 s yhtenä pakettina vai osissa |
| Tuleeko torchcrepen paino paketin mukana? | Ei ole `models.json`:ssa |
| Miten `build/kuuntelu/...`-kopio tuotettiin? | Ei tiedostossa |
