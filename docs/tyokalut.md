# Työkalupäätös (vaihe 1)

*Ohjaajan päätös 1.11.2026 arvion `docs/tutkimus/tyokaluarvio.md` perusteella. Arvio luki edellisen projektin
40 tiedostoa kopioimatta tai ajamatta mitään. Tämä dokumentti sanoo, mitä kopioidaan, mitä korjataan ja mitä
jätetään. Kopiointi alkaa vasta käyttäjän pyynnöstä.*

## Lähtökohta
Lähde on yksi tiedosto, `audio/05_Tapiola.mp3` (1062,85 s, 44,1 kHz, stereo, 320 kbps). Se on bitilleen sama
kuin Bob Varneyn Internet Archiveen lataama (MD5 9609ea33…, SHA-1 4d13744b…; tarkistettu 1.11.2026). Ei puolia,
ei FLACia, ei loppuuraa. Edellisen projektin putki oletti kaksi FLAC-puolta, levyn loppuuran kohinamittaan ja
teoskohtaisia ankkureita. Nämä oletukset poistetaan, ei kierretä.

## Periaate
Kopioidaan vain **menetelmä**: ääniputki, iskut, kellot, kriitikko, renderöinnin runko ja kameramittari.
Kohtauskohtaiset mittarit ja viivatyökalut jätetään; ne kirjoitetaan tarvittaessa uudestaan vaiheessa 8 tyylin
mukaan. Yhtään tiedostoa kansiosta `visual/` tai tyylidokumenteista ei kopioida.

## Kopioidaan sellaisenaan (A)
| Tiedosto | Huomio |
|---|---|
| `analysis/aksentit.py` | iskut 10 ms tarkkuudella |
| `analysis/fetch_models.py` + `models.json` | CLAP-painot (8 kpl) poistetaan listasta: CLAP on todettu rikkinäiseksi |
| `render/serve.mjs`, `render/check-webgl.mjs` | esikatselu ja WebGL-tarkistus |
| `uv.lock` | lukitaan uudestaan `uv lock`, kun pyproject on nimetty |

## Kopioidaan ja korjataan (B)
| Tiedosto | Korjaus |
|---|---|
| `prepare.py` | `--side`/FLAC → `--source audio/05_Tapiola.mp3`; kohinaikkuna mitataan tiedostosta (`--noise-window a b`), ei loppuurasta; dekoodaus ffmpegillä yhdellä sovitulla tavalla, jotta kaikki johdetut äänet ovat samassa ajassa |
| `analyze.py` | pois pYIN, librosan tempo ja teoskohtainen sävellajikanava; `music_start` tarkistettava, koska tiedosto voi alkaa suoraan musiikilla |
| `listen.py` | CLAP-vaihe ja sen tekstit pois; `side` pois |
| `interpret.py`, `segments.py` | puolen aikaleimat ja otsikot pois; soitinperhelista Tapiolan kokoonpanolle (ei harppua, ei lyömäsoittimia patarumpujen lisäksi) |
| `themes.py`, `aikajana.py` | yksi lähde, `--B` pois; tunnistinosa kirjoitetaan Tapiolalle vaiheessa 5, apufunktiot ja `stitch` säilyvät |
| `make_cues.py`, `kuunteluopas.py`, `check_package.py` | kiinteät ankkurit, aloitusmerkintä ja puolilogiikka pois; ankkurit luetaan teemakartasta |
| `kuuntele.py`, `rekisteri.py`, `kellot.py` | `--side`/FLAC-taulukot → lähde ja kuuntelukopio; mp3:n luku soundfilella testataan, muuten ffmpeg-dekoodaus wav:iin |
| `videotarkistus.py` | yksi totuustiedosto `build/kuuntelu/tapiola_kuuntelu.wav`; yleistauon ankkuri teemakartasta |
| `kriitikko.py` | tekstiviittaukset edellisen dokumentteihin pois; lukee `docs/visuaalinen_tyyli.md`, `docs/kuvasaannot.md`, `docs/kriitikko_kohdat.json` |
| `render/render.mjs`, `render/camcheck.mjs` | oletuspolut ja äänen oletus kuuntelukopioon; `camProbe`-rajapinta määritellään vaiheessa 8 |
| `setup.ps1`, `pyproject.toml`, `package.json`, `package-lock.json` | nimi, CLAP pois, `transformers` ja `pymupdf` tarpeen mukaan (pymupdf jää, jos partituuri renderöidään); `three` vasta tyylin valinnan jälkeen; lock luodaan uudestaan |
| `analysis/score.py` | vain jos partituuri-PDF hankitaan; oletuspolku ja sivuhuomiot vaihdetaan |

## Jätetään (C) ja päätetään myöhemmin (D)
- Ei kopioida: `viuluviiva.py`, `opastarkistus.py`, `liikekayra.py`, `kohtauscheck.mjs`, `draft.mjs`,
  `opascheck.mjs`, `otecheck.mjs`, `karkicheck.mjs`, `kaarevyys.mjs`. Ne ovat kohtaus- tai soitinsidonnaisia.
  Reunavuoto- ja otemittarin **idea** kirjoitetaan uudestaan vaiheessa 8, kun tyyli on tiedossa.
- `jatkuvuus.py`: kynnykset viritetty yhdelle ajolle; kopioidaan runkona vaiheessa 8 ja viritetään uudestaan.
- `teemaviiva.py`: päätetään vaiheessa 6.
- `docs/youtube.md`: vain luvun 5 ffmpeg-masterkomento otetaan `docs/master.md`:hen (2160p Lanczos, pc→tv,
  bt470bg→bt709, libx264 crf 20, maxrate 60M, ääni kopioidaan). Lähteen värialue mitataan ffprobella ennen käyttöä.

## Uusi tiedosto, jota edellisessä ei ollut
- `analysis/kuuntelukopio.py`: tekee `build/kuuntelu/tapiola_kuuntelu.wav` (48 kHz, stereo, ei muuta käsittelyä)
  lähteestä ja kirjaa `kellot.py`:llä, että sen aika on 0 ms lähdettä vasten. Edellisessä projektissa kopio tehtiin
  käsin, eikä skriptiä ollut.

## Avoimet asiat, jotka selviävät vasta ajamalla (vaihe 1, tarkistuslista)
- Lukeeko `soundfile` mp3:n ja onko dekoodausviive 0? Jos ei, kaikki lukevat samaa ffmpeg-dekoodattua wavia.
- Ajetaanko 1063 s yhtenä pakettina vai 420 s osina (muistiraja GPU:lla)? Testataan 60 s paketilla ensin.
- Tuleeko torchcrepen paino paketin mukana vai lisätäänkö `models.json`:iin?
- Onko lähteessä alussa tai lopussa pelkkää kohinaa, josta kohinaikkuna otetaan? Kuunnellaan ja mitataan.
