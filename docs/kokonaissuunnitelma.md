# Kokonaissuunnitelma: Tapiola-musiikkivideo

*Kirjoitettu 1.11.2026. Vaiheet 1–12 ovat sitovassa järjestyksessä. Jokainen vaihe alkaa vasta käyttäjän
pyynnöstä ja päättyy committiin sekä merkintään `docs/opit.md`:hen. Vaiheen tarkistuslista on sen
valmiuden ehto: "valmis tarkoittaa mitattua".*

Teos: Jean Sibelius, *Tapiola* op. 112. Työäänitys (1.11.2026 alkaen): Rattle / LSO 2022, 17:58; lopullinen
äänitys käyttäjän oma, myöhemmin. Kajanus 1932 on arkisto. Tarkemmat tiedot: `CLAUDE.md`, `docs/tapiola_tutkimus.md`.

## Tila

| Vaihe | Nimi | Tila |
|---|---|---|
| 0 | Perustus (CLAUDE.md, suunnitelma, git) | ✅ 1.11.2026 |
| 1 | Lähteet ja työkalut | 🔶 kopioitu ja korjattu 1.11.2026; putki toimii 60 s paketille; koko tiedosto, render.mjs ja camcheck testaamatta |
| 2 | Teos: tutkimusdokumentti | 🔶 verkkotutkimus valmis 1.11.2026; auki: jaksokartta kirjaimin partituurista, Salmenhaara 1970 |
| 3 | Ääni: kuuntelukopio ja totuus | ✅ Rattle-kuuntelukopio `build/kuuntelu/rattle_kuuntelu.wav`, kellot 0,00 ms, vire +5,6 c (ei korjattu); Kajanus arkisto |
| 4 | Kuuntelutyökalu ja kanavakortti | 🔶 koko teos analysoitu (`build/rattle_koko`, 105 jaksoa, 18 pöytäkirjaa); V1–V8 ehdokasajat `varmat_kohdat.md`; kanavakortti täydennetty; **mitään ei vielä kuultu** |
| 5 | Kuunteluopas ja teemakartta | 🔶 teemakartta 39 ankkuria (`annotations/teemat.json`), ajat Rattlesta analyysinä (36/39), cues ja oppaan GEN-osat generoituvat; **tarina kirjoitettu (ohjaajan tulkinta, 1.11.2026); kuulluksi vahvistus puuttuu**; partituuritarkistuslista `docs/partituuritarkistus.md` |
| 6 | Visuaalinen tyyli (haastattelu) | 🔶 haastattelu alkoi 1.11.2026 (docs/haastattelu_tyyli.md); tyyliohjetta ei kirjoiteta ennen vaiheita 3–5 |
| 7 | Ohjaus ja kuvakäsikirjoitus | ⬜ |
| 8 | Tekniikka ja mittarit | ⬜ |
| 9 | Perusta, sitten osat | ⬜ |
| 10 | Luonnokset ennen renderiä | ⬜ |
| 11 | Kriitikko | ⬜ |
| 12 | Koko renderi ketjuna ja master | ⬜ |

---

## Vaihe 1: Lähteet ja työkalut

Kopioidaan edellisestä projektista **vain menetelmä**: työkalut, manifestit ja masterresepti. Ei yhtään
visuaalista tiedostoa (ei `visual/`, ei tyyliohjetta, ei kuvakäsikirjoitusta, ei väritiedostoja).

Kopioitavat (käyttäjä vahvistaa listan ennen kopiointia):
- `analysis/`: prepare, analyze, listen, interpret, segments, aksentit, kuuntele, rekisteri, kellot, themes,
  aikajana, make_cues, kuunteluopas, videotarkistus, jatkuvuus, kriitikko, check_package, fetch_models,
  models.json. (Lisäksi harkittavat: score.py partituurin renderöintiin, opastarkistus.py.)
- `render/`: render, camcheck, kohtauscheck, otecheck. (Harkittavat: serve, check-webgl, karkicheck,
  kaarevyys, jos ne ovat yleisiä mittareita eivätkä kohtauskohtaisia.)
- `setup.ps1`, `pyproject.toml`, `uv.lock`, `package.json`, `package-lock.json`.
- `docs/youtube.md`: vain masterresepti (2160p).

Tarkistuslista:
- [ ] Jokainen kopioitu tiedosto on luettu, ja teoskohtaiset oletukset (puolet A/B, LP-ajat, FLAC-polut,
  teemanimet, hahmonimet, kohtauspolut) on listattu ja korjattu tai parametrisoitu.
- [ ] Kopioiduissa tiedostoissa ei ole edellisen projektin visuaalisia termejä tai kohtausviittauksia.
- [ ] `.\setup.ps1` ajaa läpi; `.\setup.ps1 -CheckOnly` vihreä. Ei käsin asennettuja paketteja.
- [ ] `uv lock` ja `npm ci` toimivat lukituksista.
- [ ] `fetch_models.py` hakee painot `models/`-kansioon, tarkistussummat täsmäävät.
- [ ] `check_package.py` ajettu pienelle testipaketille (esim. 60 s) ja se menee läpi.
- [ ] `README.md` kertoo työkalut ja niiden komennot tälle projektille.
- [ ] `docs/opit.md` ja commit.

## Vaihe 2: Teos

Tutkimusdokumentti `docs/tapiola_tutkimus.md`: synty ja tilaus, Sibeliuksen oma esipuhe (säkeet), rakenne
ja jaksot, teemat ja niiden muunnokset (yksi motiivi, monta muotoa), soitinnus, tempo- ja esitysmerkinnät,
Kajanuksen levytyksen historia, lähteet. Partituuri hankitaan tarkistusta varten (IMSLP tai muu julkinen
lähde; julkaisuoikeus tarkistetaan).

Tarkistuslista:
- [ ] Jokaisella väitteellä on lähde; epävarmat merkitty **[tarkista]**.
- [ ] Jaksot ja teemat kuvattu tahtinumeroin ja harjoituskirjaimin partituurista, ei muistista.
- [ ] Soitinnus listattu soittimittain (mitä kukin soittaa, missä se on yksin kuultavissa).
- [ ] Levytyksen tiedot: päivämäärä, paikka, orkesteri, julkaisu, siirron tekijä ja lähde **[tarkista]**.
- [ ] Partituuri projektissa, sivut renderöitävissä tarkistusta varten.
- [ ] Ei tulkintaa visuaaliksi vielä: dokumentti on musiikista.
- [ ] Opit ja commit.

## Vaihe 3: Ääni

Kuuntelukopio on aikojen ainoa totuus.

Tarkistuslista:
- [ ] Äänilähteen tekniset tiedot kirjattu (formaatti, näytteenottotaajuus, kesto, alkuperä, mahdollinen
  häviötön versio).
- [ ] Kuuntelukopio `build/kuuntelu/tapiola_kuuntelu.wav` tehty alkuperäisestä ilman aikaa muuttavaa käsittelyä;
  `kellot.py` mittaa sen alkuperäistä vasten ja tulos on 0 ms.
- [ ] Puhdistettu monokopio analyysiin; sen aika mitattu kuuntelukopiota vasten (afftdn-viive korjattu).
- [ ] Ääniraita videolle alkuperäisestä (48 kHz, ei muuta käsittelyä), aika mitattu.
- [ ] Lähde on yksi tiedosto. Mahdolliset siirron liitoskohdat tai katkokset etsitään mittaamalla (rahinan
  ja tason muutokset), ei oleteta.
- [ ] Käyttäjä kuuntelee kuuntelukopiota ja vahvistaa, että soittimen kello näyttää samaa.
- [ ] Opit ja commit.

## Vaihe 4: Kuuntelutyökalu ja kanavakortti

Suunnitelma: `docs/analyysisuunnitelma.md` (varmat kohdat V1–V8, uudet kanavat, kuuntelupöytäkirja).

Tarkistuslista:
- [ ] Varmat kohdat V1–V8 mitattu pöytäkirjalla ja käyttäjä on kuullut otteet.
- [ ] prepare → analyze → listen → interpret → segments → aksentit ajettu koko teokselle paketteina;
  `check_package.py` vihreä jokaiselle.
- [ ] `docs/kanavakortti.md`: taulukko soitin → mitattu kanava → luotettavuus varmassa kohdassa
  (partituurista tiedetty paikka, jossa soitin on yksin tai selvästi kuultavissa) → korvaava lähde.
- [ ] Jokainen kanava, jota kuva saattaa käyttää, on testattu vähintään yhdessä varmassa kohdassa.
- [ ] Kuolleet kanavat merkitty, eikä niitä ole saatavilla kuvan ajoitukseen (koodi hylkää ne).
- [ ] Korvaava lähde määritelty: partituuri + mitatut tahdinalut + spektrogrammi.
- [ ] Rahinan vaikutus kanaviin tarkistettu.
- [ ] Opit ja commit.

## Vaihe 5: Kuunteluopas ja teemakartta

Opas on käyttäjän tarina kuuntelijalle. Tarinat kysytään käyttäjältä, ei keksitä.

Tarkistuslista:
- [ ] Käyttäjän tarinat ja kuuntelukokemukset kirjattu haastattelusta (omina sanoina, lainattuna).
- [ ] `annotations/teemat.json` on ainoa paikka ajoille: jaksot, teemat, iskut, ankkurit tunnisteineen.
- [ ] Jokainen aika tarkistettu korvilla (`kuuntele.py`, `rekisteri.py`) ja merkitty kuulluksi vasta sitten.
- [ ] `make_cues.py` → `annotations/cues.json`; `kuunteluopas.py` → oppaan aikakoodit. Ei käsin kirjoitettuja aikoja.
- [ ] `annotations/kuunteluopas.md`: tarina, tunnekaari, aikakoodatut kohdat.
- [ ] Oppaassa ei ole kuvakäsikirjoituksen sisältöä.
- [ ] Opit ja commit.

## Vaihe 6: Visuaalinen tyyli

**Haastattelu ennen yhtään kirjoitettua riviä.** Ohjaaja kysyy käyttäjän ideat: mitä Tapiola on kuvana,
mikä on ydinidea, mitkä elementit, mikä tila, mikä väri, mikä liike, mitä vältetään. Jos ohjaaja huomaa
ehdottavansa edellisen projektin tyyliä, se sanotaan ääneen ja hylätään.

Tarkistuslista:
- [ ] Haastattelu tehty ja käyttäjän sanat tallennettu `docs/haastattelu_tyyli.md`:hen.
- [ ] `docs/visuaalinen_tyyli.md`: ydinidea, kielioppi, väri, tila, liike, henkilöt tai elementit,
  selkeyden säännöt, mitä vältämme, soitin → elementti -taulukko (jokainen soitin on elementti, ei esine).
- [ ] Samalla kertaa johdettu: `docs/kuvasaannot.md` (tiivistys), `docs/soitinroolit.md`,
  `docs/kriitikko_kohdat.json`. Yksi lähde, kolme näkymää; ristiriidattomuus tarkistettu.
- [ ] Käyttäjä on lukenut ja hyväksynyt tyyliohjeen.
- [ ] Tyyliohjeessa ei ole edellisen projektin visuaalisia termejä (tarkistettu hakemalla).
- [ ] Opit ja commit.

## Vaihe 7: Ohjaus ja kuvakäsikirjoitus

Tarkistuslista:
- [ ] `docs/ohjaus.md`: pääosasääntö (kuvaa johtaa se, joka musiikissa puhuu), jokaisessa otossa teko,
  otot ja leikkaukset, kameran säännöt.
- [ ] `docs/kuvakasikirjoitus.md`: jokainen rivi nimeää ankkurin, iskun tai mitatun kanavan. Ei sekunteja.
- [ ] Jokainen ankkuri löytyy teemakartasta; puuttuva ankkuri on virhe.
- [ ] Kuvakäsikirjoituksessa ei ole kuunteluoppaan sisältöä.
- [ ] Ei keksittyjä lainauksia; viittaukset lähteistetty ja merkitty tulkinnaksi.
- [ ] Iskujen elementit ovat ympäristössä, eivät hahmojen kehossa.
- [ ] Käyttäjä on lukenut ja hyväksynyt.
- [ ] Opit ja commit.

## Vaihe 8: Tekniikka ja mittarit

Tekniikka valitaan tyyliohjeen mukaan, ei etukäteen.

Tarkistuslista:
- [ ] Tekniikkavalinta perusteltu tyyliohjeesta `docs/tekniikka.md`:ssä.
- [ ] Kohtausrajapinta: `seek(t)` puhdas aikafunktio; ei tilaa ruutujen välillä, ei ajastimia, ei
  siemenetöntä satunnaisuutta. Testi, joka renderöi saman ruudun kahdesti eri järjestyksessä ja vertaa.
- [ ] Ruudut putkeen ffmpegille, eksplisiittinen `-t`, osat tuoreella selaimella, keskeytynyt ajo jatkuu.
- [ ] Mittarit rakennettu ja testattu ennen ensimmäistä kohtausta: camcheck (≤ 20 °/s, ei pyörimistä),
  kohtauscheck (reunavuodot), jatkuvuus (välke, hypyt), hahmot kuvassa, asento- ja kärkiskannerit.
- [ ] Jatkuvuusbudjetti sovittu etukäteen (sallittu välke ja hypyt).
- [ ] `docs/brief_malli.md` kirjoitettu: ensimmäinen rivi "lue tyyliohje kokonaan ja kuvasäännöt; ne voittavat
  tämän briefin"; lukujärjestys tyyli → kuvasäännöt → ohjaus → palaute → merkinnät; kielletyt muotoilut.
- [ ] Opit ja commit.

## Vaihe 9: Perusta, sitten osat

Tarkistuslista:
- [ ] Perusta (`visual/<nimi>/`): yhteinen runko, aikafunktio, ankkurien luku teemakartasta, iskujen luku.
- [ ] `docs/tuotantojako.md`: mitkä osat, kenen tiedostot, missä järjestyksessä.
- [ ] Jokainen osa omassa istunnossaan (`model: sonnet`) omilla tiedostoillaan; brief mallista;
  brief on `runs/<nimi>/brief.md`.
- [ ] Yhteisiin tiedostoihin vain ohjaaja; osat kirjoittavat pyynnöt `pyynnot.md`:hen.
- [ ] Osan palaute käännetty elementiksi kuvasääntöjen sanoin; käyttäjän sanat lainattu erikseen.
- [ ] Opit ja commit.

## Vaihe 10: Luonnokset ennen renderiä

Tarkistuslista:
- [ ] Stillit jokaisesta otosta ja jokaisesta iskusta.
- [ ] Kontaktiarkit (`fps=2`-ruudukko).
- [ ] Kolme pahinta ongelmaa nimetty ja korjattu ennen seuraavaa kierrosta.
- [ ] Osarenderit `--start/--end`, mitattu tiedostosta (ei esikatselusta).
- [ ] Palautelista päivitetty: tila ja todennus riville.
- [ ] Opit ja commit.

## Vaihe 11: Kriitikko

Tarkistuslista:
- [ ] Tuore Sonnet-agentti joka renderin jälkeen; se ei ole tehnyt kohtausta.
- [ ] Lukujärjestys: koko tyyliohje → kuvasäännöt → kriitikon kohdat → ruutusarjat.
- [ ] Kaksi tehtävää: jatkuvuus (tarkoitettu vai bugi) ja säännön henki (elementti vai esine).
- [ ] Ajoitus musiikkiin tarkistettu korvalla ja spektristä, ei vain ruuduista.
- [ ] Kriitikon "piti näkyä" kirjoitetaan elementtinä, ei esineenä.
- [ ] Raportti `runs/<nimi>/kriitikko.md`. **Bugilista tyhjä = renderi kelpaa.**
- [ ] Opit ja commit.

## Vaihe 12: Koko renderi ketjuna ja master

Tarkistuslista:
- [ ] Ketju yhdessä skriptissä: renderi → ääni totuutta vasten (`kellot.py`, 0 ms) → iskujen ruudut
  (`videotarkistus.py`) → jatkuvuus → kontaktiarkki → stillit → WhatsApp-versio (720p, ≤ 170 Mt).
- [ ] Ketju toimii ilman valvontaa (yö tai käyttöraja ei katkaise).
- [ ] Kriitikko ajettu ja bugilista tyhjä.
- [ ] Palautelistan jokainen rivi ✅ tai perusteltu ❌.
- [ ] Master `docs/youtube.md`:n reseptillä (2160p); ääni koskematta; värilippujen tarkistus.
- [ ] `runs/<nimi>/tarkistus.md` raportoi vain mitatun.
- [ ] Opit ja commit.

---

## Avoimet kysymykset (1.11.2026)
- Äänilähde: onko mp3 ainoa versio vai onko häviötön siirto saatavilla?
- Milloin käyttäjä haluaa pitää vaiheen 6 haastattelun?
- Mitkä edellisen projektin työkalut saa kopioida sellaisenaan (vaihe 1).
- Tutkimus (vaihe 2) alkaa vasta pyynnöstä; käyttäjän ensimmäinen viesti pyysi sitä ensimmäiseksi,
  mutta ensimmäinen tehtävä rajasi sen pois. Vahvistus tarvitaan.
