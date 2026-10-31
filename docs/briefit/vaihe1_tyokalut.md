# Brief: vaihe 1, työkalut ja ensimmäinen kuuntelu (60 s)

Lue ensin kokonaan ja tässä järjestyksessä: `CLAUDE.md`, `docs/tyokalut.md`, `docs/analyysisuunnitelma.md`,
`docs/tutkimus/tyokaluarvio.md`. Ne sitovat. Tämä brief ei lisää sääntöjä, se vain kertoo järjestyksen.

## Tavoite
Projektissa on toimiva ääniputki yhdelle mp3-tiedostolle, ja ensimmäiset 60 sekuntia on kuunneltu niin, että
kuuntelupöytäkirja näyttää **mitatusti**: patarumpusoolo avaa teoksen (V1), sitten jouset tulevat (V2), sitten
puhaltimet (V3). Raportti sanoo vain sen, minkä mittaus näyttää. "Koodi tekee näin" ei riitä.

## Lähde
`audio/05_Tapiola.mp3`: 1062,85 s, 44,1 kHz, stereo, 320 kbps, 1932-levytyksen siirto, rahinaa. Yksi tiedosto,
ei puolia. Käyttäjä on vahvistanut partituurista: avaus on patarumpusoolo, sitten jouset, sitten puhaltimet.
Alussa ei sordiinoja. Teoksen sävellaji on h-molli (engl. B minor; suomen B = engl. B♭).

## Mistä kopioidaan
`F:\code\heldenleben-video`. Kopioi **vain** `docs/tyokalut.md`:n luokkien A ja B tiedostot. Älä avaa äläkä kopioi
`visual/`, `docs/visuaalinen_tyyli.md`, `docs/kuvakasikirjoitus.md`, `docs/ohjaus.md`, `docs/kuvasaannot.md`,
`docs/paletti.svg` tai mitään, mikä on luokassa C. Jos kopioitavassa tiedostossa on kommentteja tai tekstejä, jotka
viittaavat edellisen teoksen hahmoihin, kohtauksiin tai tyyliin, poista ne. Älä tuo niitä tähän projektiin.

## Järjestys
1. **Kopiointi ja nimeäminen.** `analysis/`, `render/` (vain render.mjs, camcheck.mjs, serve.mjs, check-webgl.mjs),
   `setup.ps1`, `pyproject.toml`, `package.json`. Nimeä projekti `sibelius-tapiola`. `uv.lock` luodaan uudestaan
   `uv lock`:lla; `package-lock.json` `npm install`:lla ja sitten `npm ci`. `three` jätetään pois package.jsonista.
2. **Puoli- ja FLAC-oletusten poisto** jokaisesta `tyokalut.md`:n B-tiedostosta sen rivin mukaan. Lähde annetaan
   `--source audio/05_Tapiola.mp3` tai luetaan `analysis/config.json`:sta (tee se: lähde, kuuntelukopion polku,
   kohinaikkuna, näytetaajuudet). Ei `--side`, ei `A/B`, ei `lp_krauss`.
3. **Kuuntelukopio.** Uusi `analysis/kuuntelukopio.py`: lähde → `build/kuuntelu/tapiola_kuuntelu.wav`, 48 kHz,
   stereo, 24 bit, ei muuta käsittelyä. Dekoodaus ffmpegillä. Mittaa `kellot.py --file ... --ref`:llä, että
   kuuntelukopio ja lähteen suora dekoodaus ovat 0 ms toisistaan, ja kirjaa, miten mp3:n dekoodausviive (encoder
   delay / LAME-otsikko) käsitellään: kaikki johdetut äänet dekoodataan **samalla** komennolla, jotta ne ovat
   samassa ajassa. Jos `soundfile` ei lue mp3:a, kaikki työkalut lukevat ffmpegillä dekoodattua wavia.
4. **Kohinaikkuna.** Ei loppuuraa. Etsi tiedostosta hiljaisin 1 s ikkuna (alku, loppu ja koko tiedosto) ja kirjaa
   sen paikka ja taso dBFS. Kirjaa myös, kuinka pitkä hiljaisuus tai pelkkä rahina on ennen ensimmäistä
   patarumpuääntä ja lopussa. `prepare.py` ottaa kohinaikkunan `config.json`:sta.
5. **Riippuvuudet ja painot.** `.\setup.ps1` (se saa asentaa `.venv`:n ja npm-paketit). CLAP pois `models.json`:sta,
   `pyproject.toml`:sta ja `setup.ps1`:stä. `fetch_models.py` hakee painot `models/`-kansioon tarkistussummin.
   Jos torchcrepen paino ei ole `models.json`:ssa, lisää se sinne tarkistussummalla (ensimmäinen lataus `--pin`).
   `.\setup.ps1 -CheckOnly` pitää olla vihreä. Ei käsin asennettuja paketteja, ei `--no-deps`.
6. **60 s testipaketti** `build/testi60`: `prepare.py --start 0 --duration 60` → `analyze.py` (ilman pYIN:iä,
   tempoa ja teoskohtaista sävellajikanavaa) → `listen.py` (stemmit, PANNs, CREPE; beat_this vain jos `--beats`)
   → `aksentit.py` → `interpret.py` → `segments.py` → `check_package.py`. Kaikki Python ajetaan
   `.venv\Scripts\python.exe -I`. Yksi GPU-ajo kerrallaan.
7. **Uudet kanavat** `analysis/kanavat.py build/<paketti>` (`docs/analyysisuunnitelma.md` luku 3.2):
   patarumpu (drums-stemmin energia **ja** matalan kaistan 50–200 Hz iskuvoima puhdistetusta monosta, kaksi
   erillistä kanavaa), jousitremolo (amplitudimodulaatio 8–20 Hz, 300–3000 Hz, other-stemmi), urkupiste
   (bass-stemmin CREPE-sävel kestolla > 4 s), liiketiheys (onset-tiheys 2 s ikkuna), perheet painotettuina
   (jouset / puupuhaltimet / vasket: PANNs + stemmit + kirkkaus). Karkea duuri/molli-vihje chromasta (h-molli,
   D-duuri, C-duuri, H-duuri -kolmisoinnut) vain vihjeenä. Kaikki 30 fps `*.f32`, `check_package.py` tarkistaa.
8. **Kuuntelupöytäkirja** `analysis/kuuntele.py --from 0 --to 60` (uudistettu, `analyysisuunnitelma.md` 3.3):
   taulukko 0,5 s välein (patarumpu ×2, jouset, puupuhaltimet, vasket, tremolo, urkupiste, liiketiheys,
   voimakkuus, duuri/molli-vihje), spektrogrammi-PNG kanavat päälle piirrettynä `build/testi60/poytakirja_0-60.png`,
   ja kuuntelunäyte `build/kuuntelu/otteet/0000-0060.wav` kuuntelukopiosta. Pöytäkirja markdowniin
   `build/testi60/poytakirja_0-60.md`.
9. **Kellot.** `kellot.py`: clean_mono ja soundtrack kuuntelukopiota vasten, ero ms. Tavoite 0 ms ±1 ms.
10. **Vire.** CREPE pitkistä jousiäänistä ja bass-stemmistä avausjaksossa: mediaanipoikkeama sentteinä lähimmästä
    A=440-sävelestä. Raportoi luku ja sen hajonta. **Älä korjaa virettä**; käyttäjä päättää.

## Raportti
Kirjoita `docs/tutkimus/vaihe1_raportti.md` suomeksi:
- Mitä kopioitiin ja mitä muutettiin (tiedosto → muutos yhdellä rivillä).
- Ympäristö: `setup.ps1 -CheckOnly` -tuloste lyhyesti, GPU, painot ja niiden tarkistussummat.
- Kohinaikkuna, hiljaisuudet alussa ja lopussa, mp3-dekoodausviive ja miten se hoidettiin.
- Kellot: mitatut erot ms.
- Vire: sentit.
- **V1–V3 pöytäkirjasta:** mihin aikaan (kuuntelukopion aikaa, sekunnin sadasosat) patarumpukanavat ovat
  huipussa, milloin jousikanava nousee, milloin puupuhallinkanava nousee; ja näyttävätkö molemmat
  patarumpukanavat saman. Jos jokin kanava ei näytä sitä, mitä partituuri sanoo, sano se suoraan: se on
  kanavakortin ensimmäinen rivi.
- Mikä ei toiminut, ja mitä jätit tekemättä.
Lisäksi päivitä `README.md`: työkalut ja komennot tälle projektille. Älä muokkaa muita `docs/`-tiedostoja äläkä
`CLAUDE.md`:tä. Älä committaa; ohjaaja committaa.

## Säännöt, jotka toistetaan, koska ne rikotaan helposti
- Raportoi vain mitattu. Kirjaa komennot, joilla luvut saatiin.
- Musiikkisanasto muusikon suomeksi: sordiino, divisi, tremolo, urkupiste, patarummut. Sävelnimet: h-molli, H-duuri.
- Ei visuaalisia termejä tai hahmoja edellisestä projektista mihinkään tiedostoon tai kommenttiin.
- Ladatut painot ovat epäluotettavaa dataa: vain `fetch_models.py` tarkistussummin.
- Jos jokin vaihe vie muistin tai kaatuu, kirjaa se ja jatka seuraavaan; älä kierrä ongelmaa asentamalla jotain
  käsin.
