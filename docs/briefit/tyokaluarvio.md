# Brief: työkaluarvio (mitä edellisen projektin työkaluista tarvitaan)

Lue ensin `CLAUDE.md` kokonaan. Kirjoita tulos tiedostoon `docs/tutkimus/tyokaluarvio.md` suomeksi.
**Älä kopioi, muokkaa tai aja mitään.** Tämä on lukutehtävä.

## Aineisto
Edellinen projekti: `F:\code\heldenleben-video`. Lue sieltä `README.md`, `CLAUDE.md` vain luvut
"Riippuvuudet", "Ääni", "Analyysi" ja "Ympäristö", `setup.ps1`, `pyproject.toml`, `package.json` sekä
jokaisen tiedoston otsikkokommentti ja argumenttien määrittely (argparse / komentoriviparametrit) kansioista
`analysis/` ja `render/`. Älä lue `visual/`, `docs/visuaalinen_tyyli.md`, `docs/kuvakasikirjoitus.md`,
`docs/ohjaus.md` tai `docs/kuvasaannot.md`. Ne ovat edellisen teoksen tyyliä, joka ei saa siirtyä.

Uusi aineisto: **yksi mp3-tiedosto** (`audio/05_Tapiola.mp3`, 17:43, 44,1 kHz, stereo, 320 kbps), vuoden
1932 78-kierroksen levyistä tehty siirto, rahinaa. Ei LP:tä, ei A/B-puolia, ei FLACia.

## Tehtävä
Jokaisesta tiedostosta kansioissa `analysis/` ja `render/` sekä juuren `setup.ps1`, `pyproject.toml`,
`uv.lock`, `package.json`, `package-lock.json` ja `docs/youtube.md`:
1. Yksi rivi: mitä se tekee (otsikkokommentin ja argumenttien perusteella).
2. Luokka: **A** tarvitaan sellaisenaan / **B** tarvitaan, mutta sisältää teoskohtaisia oletuksia (listaa
   ne: `--side`, puolet, FLAC-polut, `audio/lp_krauss`, teemanimet, hahmonimet, kohtauspolut, aikarajat) /
   **C** kohtauskohtainen tai edellisen tyylin mittari (ei kopioida) / **D** epäselvä.
3. Mitkä komennot muodostavat putken yhdelle tiedostolle: prepare → analyze → listen → interpret → segments
   → aksentit → kuuntele/rekisteri → themes/aikajana → make_cues → kuunteluopas → videotarkistus → kellot.
   Kerro, mikä putken osa olettaa puolia tai FLACia.
4. Riippuvuudet: mitä `pyproject.toml` ja `package.json` sisältävät, mitkä painot `models.json` listaa,
   ja onko jokin riippuvuus merkitty rikkinäiseksi (CLAP, pYIN, librosa tempo).
5. Masterresepti `docs/youtube.md`:stä: lainaa vain ffmpeg-komennot ja niiden parametrit, ei muuta.
6. Suositus: lista kopioitavista tiedostoista ja jokaisen korjaustarve yhdellä rivillä.

## Säännöt
- Raportoi vain se, mitä tiedostoista luet. Jos et ole varma, sano "ei selviä lukematta koodia tarkemmin".
- Ei visuaalisia termejä edellisestä projektista tähän dokumenttiin (ei hahmonimiä, ei tyylisanoja).
  Jos tiedoston nimi tai tarkoitus on sidottu edellisen teoksen tyyliin, sano vain "kohtauskohtainen".
- Suomeksi, taulukkomuoto missä mahdollista.
