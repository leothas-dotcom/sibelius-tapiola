# Projekti: Tapiola-musiikkivideo

*Yksi tiedosto: (1) suunnitelma ja tila, (2) palautelista, (3) opit.*

# 1. Suunnitelma ja tila

*Kirjoitettu 1.11.2026. Vaiheet 1–12 ovat sitovassa järjestyksessä. Jokainen vaihe alkaa vasta käyttäjän
pyynnöstä ja päättyy committiin sekä merkintään tämän tiedoston lukuun 3 (opit). Vaiheen tarkistuslista on sen
valmiuden ehto: "valmis tarkoittaa mitattua".*

Teos: Jean Sibelius, *Tapiola* op. 112. Työäänitys (1.11.2026 alkaen): Rattle / LSO 2022, 17:58; lopullinen
äänitys käyttäjän oma, myöhemmin. Kajanus 1932 on arkisto. Tarkemmat tiedot: `CLAUDE.md`, `docs/tapiola_tutkimus.md`.

## Tila

| Vaihe | Nimi | Tila |
|---|---|---|
| 0 | Perustus (CLAUDE.md, suunnitelma, git) | ✅ 1.11.2026 |
| 1 | Lähteet ja työkalut | 🔶 kopioitu ja korjattu 1.11.2026; putki toimii 60 s paketille; koko tiedosto, render.mjs ja camcheck testaamatta |
| 2 | Teos: taustatutkimus | ✅ synteesi `docs/tapiola_tutkimus.md` v2 (9.11.2026); auki: kirjaimet D–I ja N, Salmenhaara 1970, Rodziński-kirje (luku 14) |
| 3 | Ääni: kuuntelukopio ja totuus | ✅ Rattle-kuuntelukopio `build/kuuntelu/rattle_kuuntelu.wav`, kellot 0,00 ms, vire +5,6 c (ei korjattu); Kajanus arkisto |
| 4 | Kuuntelutyökalu | ✅ yksi työkalu `analysis/korvat.py`: 270 tapahtumaa, 17 ruutukanavaa (`build/rattle_koko/ohjaus.f32`); mitä ääni antaa ja mitä ei: tutkimuksen luku 13; **vääriä osumia ei ole karsittu korvalla** |
| 5 | Kuunteluopas ja teemakartta | 🔶 76 ankkuria (`annotations/teemat.json`), ajat Rattlesta, viisi käyttäjän vahvistamaa; opas kuulijan kielellä generoituu; **useimmat ajat mittausta, ei kuultuja** |
| 6 | Visuaalinen tyyli (haastattelu) | 🔶 tyyliohje v1.4 (luku 4b: kymmenen kuvatapaa vedoksen 1 palautteen jälkeen; metsä näkyy, synestesia, luku 7b ääni → kuva, kuvasäännöt luvussa 12; omat ristiriidat korjattu 9.11.2026); **odottaa käyttäjän hyväksyntää**; C-duurin punainen hyväksytty 9.11.2026 |
| 7 | Ohjaus ja kuvakäsikirjoitus | 🔶 `docs/kuvakasikirjoitus.md` v2.0 (9.11.2026: kirjoitettu uudestaan kuunteluoppaan 153 rivistä, 70 ottoa, tyyliohjeen 4c kielioppi; aiempi: v1.2 (luvut 1 ja 2: kuvatapa joka hetkelle; ottojen rivit kirjoitetaan uudestaan vedoksen 2 jälkeen; tuore lukija tarkisti tyyliohjetta vasten 9.11.2026, 27 löydöstä, korjattu: `runs/kk_tarkistus_v1/tarkistus.md`; 12 hetken kaari, 8 maailmaa, 7 kulkua, 60 ottoa, kaikki 76 ankkuria käytetty; tarkistus `check_package.py --cues-only`); **maailmat hyväksytty 9.11.2026**; **C-duuri punainen 9.11.2026**; D-duuri kelmeä ja hämärä 9.11.2026; auki: sana kajo, loppukuva, puuttuva data |
| 8 | Tekniikka ja mittarit | 🔶 tekniikka valittu vedosta varten (yksi säteenseurantavarjostin, WebGL2, ei uusia riippuvuuksia); `seek(t)` toistettava ja camcheck mitattu; muut mittarit puuttuvat |
| 9 | Perusta, sitten osat | ⬜ |
| 10 | Luonnokset ennen renderiä | 🔶 vedos 2: 19 stilliä, kymmenen kuvatapaa, ääni ohjaa säikeitä ja valoa (`runs/vedos_v2/`); vedos 1 hylätty palautteessa (rivipuut syvyydessä); **odottaa käyttäjän katsomista** |
| 11 | Kriitikko | ⬜ |
| 12 | Koko renderi ketjuna ja master | ⬜ |

---

## Data ja siirto omaan äänitykseen

**Luettavat tiedostot (kolme):** `annotations/kuunteluopas.md` (mitä kuuluu ja milloin, kuulijan kielellä),
`docs/visuaalinen_tyyli.md` (miten kuva vastaa), `docs/tapiola_tutkimus.md` (tausta). **Data (JSON):**

| Tiedosto | Sisältö | Kuka kirjoittaa |
|---|---|---|
| `annotations/teemat.json` | ankkurit: partituurin paikka (kirjain, tahti), mitä soi, etuala, tunnelma, tarina, merkinnät | käsin (ohjaaja, käyttäjä) |
| `annotations/ajat_<levytys>.json` | ankkurin aika tässä levytyksessä, varmuus (vahvistettu / analyysi / arvio), peruste | mittaus ja käyttäjän korva; vahvistettua ei kirjoiteta yli koneellisesti |
| `annotations/levytykset.json` | levytykset ja niiden rooli (työ, lopullinen, arkisto) | käsin |
| `annotations/cues.json` | generoitu: ankkurit aikoineen, jaksot, iskut, koneen kuulemat tapahtumat, osoite ruutukanaviin | `make_cues.py --levytys <id>` |
| `build/<paketti>/korvat.json`, `ohjaus.f32` | koneen kuulema: sekunnit, pitkät äänet, tapahtumat; 17 ruutukanavaa 30 fps | `korvat.py` |

**Siirto käyttäjän omaan äänitykseen:** (1) uusi levytys `levytykset.json`:iin, kuuntelukopio, sama putki
(prepare → analyze → listen → aksentit → kanavat → korvat); (2) jokaiselle ankkurille ehdotetaan aika uudesta
äänityksestä Rattlen aikojen ja mitattujen iskujen, jaksorajojen ja tapahtumien avulla (`varmuus: analyysi`);
kohdistustyökalua ei ole vielä kirjoitettu, se tehdään `korvat.py`:n osaksi, ei uudeksi skriptiksi; (3) käyttäjä
kuuntelee ja vahvistaa; (4) `make_cues.py --levytys <uusi>` ja `kuunteluopas.py --levytys <uusi>`.
Kuvakäsikirjoitus nimeää ankkurin id:n, ei aikaa, joten se ei muutu. Iskut ovat aina levytyskohtaisia.

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
- [ ] Opit (luku 3) ja commit.

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
- [ ] `docs/tutkimus/kanavakortti.md`: taulukko soitin → mitattu kanava → luotettavuus varmassa kohdassa
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
- [ ] Jokainen aika tarkistettu korvilla (käyttäjä kuuntelee kuuntelukopiosta) ja merkitty vahvistetuksi vasta sitten.
- [ ] `make_cues.py` → `annotations/cues.json`; `kuunteluopas.py` → oppaan aikakoodit. Ei käsin kirjoitettuja aikoja.
- [ ] `annotations/kuunteluopas.md`: tarina, tunnekaari, aikakoodatut kohdat.
- [ ] Oppaassa ei ole kuvakäsikirjoituksen sisältöä.
- [ ] Opit ja commit.

## Vaihe 6: Visuaalinen tyyli

**Haastattelu ennen yhtään kirjoitettua riviä.** Ohjaaja kysyy käyttäjän ideat: mitä Tapiola on kuvana,
mikä on ydinidea, mitkä elementit, mikä tila, mikä väri, mikä liike, mitä vältetään. Jos ohjaaja huomaa
ehdottavansa edellisen projektin tyyliä, se sanotaan ääneen ja hylätään.

Tarkistuslista:
- [ ] Haastattelu tehty ja käyttäjän sanat tallennettu `docs/tutkimus/haastattelu.md`:hen.
- [ ] `docs/visuaalinen_tyyli.md`: ydinidea, kielioppi, väri, tila, liike, henkilöt tai elementit,
  selkeyden säännöt, mitä vältämme, soitin → elementti -taulukko (jokainen soitin on elementti, ei esine).
- [x] Samalla kertaa johdettu: kuvasäännöt (tyyliohjeen luku 12), soitinroolit (luku 7) ja
  `docs/kriitikko_kohdat.json`. Yksi lähde; ristiriidattomuus tarkistettu.
- [ ] Käyttäjä on lukenut ja hyväksynyt tyyliohjeen.
- [ ] Tyyliohjeessa ei ole edellisen projektin visuaalisia termejä (tarkistettu hakemalla).
- [ ] Opit ja commit.

## Vaihe 7: Ohjaus ja kuvakäsikirjoitus

Tarkistuslista:
- [x] Ohjaus: ei omaa dokumenttia. Pääosasääntö ja kameran säännöt ovat tyyliohjeessa (luvut 2, 5, 8, 12);
  kuvakäsikirjoituksen jokaisessa otossa on kentät Teko ja Tunne ja johtaja; kameran nimetyt kohdat sen luvussa 7.
- [x] `docs/kuvakasikirjoitus.md`: jokainen otto nimeää alku- ja loppuankkurin, jokainen kuvan tapahtuma ankkurin,
  tapahtumatyypin tai kanavan. Ei käsin kirjoitettuja aikoja: otsikoiden ajat generoi `make_cues.py` (mitattu:
  `check_package.py --cues-only`).
- [x] Jokainen ankkuri löytyy teemakartasta ja jokainen teemakartan ankkuri on käytetty (mitattu, 76/76).
- [x] Kuvakäsikirjoituksessa ei ole kuunteluoppaan sisältöä (lähteet ja tulkinnat jäävät oppaaseen; ankkurin nimi vie sinne).
- [x] Ei keksittyjä lainauksia: lainaukset ovat käyttäjän sanoja haastattelusta; yksi Kalevala-viite on merkitty tulkinnaksi.
- [x] Iskujen elementit ovat ympäristössä (rivi Iskut otoissa, yleissääntö luvussa 6); hahmoja ei ole.
- [x] Tyyliohjeen kohta kohdalta -tarkistus tuoreella lukijalla (Sonnet, 9.11.2026): `runs/kk_tarkistus_v1/`
  (brief, kriitikon raportti, ohjaajan todennus). 27 löydöstä: 24 korjattu tai tarkennettu, 2 ei pitänyt, 1 ei vaatinut muutosta.
  Korjattua tekstiä ei ole luettu tuoreilla silmillä uudestaan.
- [ ] Puuttuva data (käsikirjoituksen luku 8) korjattu teemakarttaan tai kuuntelutyökaluun.
- [ ] Käyttäjä on lukenut ja hyväksynyt.
- [ ] Opit ja commit.

## Vaihe 8: Tekniikka ja mittarit

Tekniikka valitaan tyyliohjeen mukaan, ei etukäteen.

Tarkistuslista:
- [x] Tekniikkavalinta (ei omaa dokumenttia): tyyliohjeen luku 11 vaatii jatkuvan tilan, jossa kamera ajaa kerrosten läpi,
  syvyyssumun ja valon kerroksittain, kaiken koodilla ja `seek(t)`:n ilman tilaa. Valittu yksi säteenseurantavarjostin
  (WebGL2, `visual/metsa.glsl.js`): metsä on paikan funktio, joten se jatkuu loputtomiin eteenpäin, ja maailmat ovat saman
  funktion parametreja (`visual/kohtaus.js`). Ei uusia riippuvuuksia. Valinta koskee vedosta ja vahvistetaan, kun käyttäjä
  on nähnyt sen.
- [x] (mitattu 9.11.2026: kaksi ottoa eri järjestyksessä, sama sha256) Kohtausrajapinta: `seek(t)` puhdas aikafunktio; ei tilaa ruutujen välillä, ei ajastimia, ei
  siemenetöntä satunnaisuutta. Testi, joka renderöi saman ruudun kahdesti eri järjestyksessä ja vertaa.
- [ ] Ruudut putkeen ffmpegille, eksplisiittinen `-t`, osat tuoreella selaimella, keskeytynyt ajo jatkuu.
- [ ] Mittarit rakennettu ja testattu ennen ensimmäistä kohtausta: camcheck (≤ 20 °/s, ei pyörimistä),
  kohtauscheck (reunavuodot), jatkuvuus (välke, hypyt), hahmot kuvassa, asento- ja kärkiskannerit.
- [ ] Jatkuvuusbudjetti sovittu etukäteen (sallittu välke ja hypyt).
- [ ] Briefin malli (`runs/<nimi>/brief.md`, ei uutta dokumenttia): ensimmäinen rivi "lue tyyliohje kokonaan ja kuvasäännöt; ne voittavat
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

---

# 2. Palautelista

*Jokainen käyttäjän palaute yhdeksi riviksi. Tila: ✅ todennettu / 🔶 korjattu, ei todennettu / ❌ auki.
Todennus kirjataan riville (mittaus, still, kontaktiarkki tai kriitikon raportti). Mobiilipalaute
kirjataan heti aikakoodeineen (kuuntelukopion aikaa).*

| # | Pvm | Aika | Palaute (käyttäjän sanat) | Tila | Todennus |
|---|---|---|---|---|---|
| 1 | 1.11. | – | "Tämä ei ole LP. Miksi teet oletuksia edellisten projektien perusteella." | ✅ todennettu | LP-oletukset poistettu CLAUDE.md:stä ja suunnitelmasta; grep "puol\|liitos" tyhjä; muistiin kirjattu |
| 2 | 1.11. | – | "B-minor on suomeksi H-molli. Ole tarkka." | ✅ todennettu | grep "B-molli\|B-duuri" docs/ tyhjä; sääntö CLAUDE.md:ssä ja briefeissä |
| 3 | 1.11. | – | "Mykistin ei ole sana. Suomeksi se on sordiino." | ✅ todennettu | grep -i "mykist" docs/ tyhjä; sääntö CLAUDE.md:ssä ja briefeissä |
| 4 | 1.11. | – | "Alussa ei ole sordinoja, ensimmäinen con sord on harjoituskirjain J jälkeen." | ✅ kirjattu | tutkimus ja Geminin lista korjattu; Del Marin t. 130 merkitty [tarkista] |
| 5 | 1.11. | – | "Teos alkaa patarumpusoololla. Se on kiistaton." | ✅ todennettu | aksentit 1,61 s z14; matala kanava 1,60 s; pöytäkirja 0–60 s |
| 6 | 1.11. | – | "Tee sellaiset analyysityökalut että KUULET NÄMÄ ASIAT." | 🔶 osittain | V1 mitattu; V2–V3 vain PANNs, heikko; perhekanavat eivät erottele (kanavakortti) |
| 7 | 1.11. | 1,6 s | "nopea patarumputremolo. Tututum." | ✅ todennettu | käyttäjä kuuli; aksentit 1,61/1,79/1,88 s |
| 8 | 1.11. | 4,6–5,2 s | "Jouset, taustalla vasket." | ✅ todennettu | käyttäjä kuuli; vaskikanava 0,18–0,32 kohdassa 3–6,5 s ei ollut väärä positiivinen |
| 9 | 1.11. | – | "Sibelius on kirjoittanut mestarillisen soitinnuksen, ja se PITÄÄ tunnistaa." | 🔶 osittain | modernilla äänityksellä tunnistuu (vertailu60); 1932-levyllä ei vielä; vertailukartta ehdotettu |
| 10 | 9.11. | – | "Ei ole mielestäni oikein että metsää ei tuotaisi esille." | 🔶 korjattu, ei todennettu | tyyliohje v1.1: metsä näkyy (rungot, kuuset, oksisto, lumi, usva); todennetaan ensimmäisistä stilleistä |
| 11 | 9.11. | – | "Sibelius oli synesteetikko. Miten sitä tuodaan esiin? Tutki." | 🔶 tutkittu | F-duuri vihreä (Ainolan takka, useita toissijaisia lähteitä); C-duuri punainen, D-duuri keltainen (yksi heikko lähde); ehdotus tyyliohjeen lukuun 3, käyttäjä päättää |
| 12 | 9.11. | 0:45 | "tuulenpuuska alkaa heti alun vaski-iskun jälkeen" | ✅ todennettu | käyttäjän korva; ajat: tuulenpuuska 45,4 s vahvistettu |
| 13 | 9.11. | 2:09 | "bassojen jättiläisaskeleet on 2:09 eteenpäin oikein" | ✅ todennettu | käyttäjän korva; ajat: askeleet_B 129,67 s vahvistettu |
| 14 | 9.11. | – | "kuunteluopas on vielä kovin puutteellinen ... paljon lisää detailia - mitä soi, millä hetkellä" | 🔶 osittain | alkuun 5 uutta ankkuria (siemen toistuu, puhallinkuviot, patarumpu paisuu, fraasi ennen taukoa); kerroskartta 338 riviä; soittimen nimeäminen yhä korvan tai partituurin varassa |
| 15 | 9.11. | 0:25–0:45 | "puhaltimet soittavat alkuun lähes unisonossa Gis-ääntä ... Ne puhaltimet nousevat ja laskevat. Yritä kuulla se datasta." | ✅ todennettu | tarkka.py: Gis4 20,6–46,2 s yhtäjaksoisesti; 12 paisutusta 23–45 s; yläsävelprofiili vaihtuu sekunneittain; kuva tarkka_0006-0062.png |
| 16 | 9.11. | 1:25– | "Basson huokaavat askeleet kuuluu melkein koko alun yli" | 🔶 osittain | mitattu 1:24.8 alkaen (17 alkua, väli 1,83 s) ja 2:05–2:57 (28, väli 1,93 s); 0:21–0:43 ei näy yli −55 dB |
| 17 | 9.11. | – | "sitten ei seuraavilla minuuteilla tapahdu mitään? Jokainen minuutti pitää tarkasti miettiä." | 🔶 korjattu, ei todennettu | minuutit.py + 29 uutta ankkuria; jokaisella minuutilla vähintään kolme riviä; ajat analyysia, ei kuultu |
| 18 | 9.11. | 1:40 | "bassojen eritahtiset iskut alkavat, jatkuvat alttoviulujen alla. Altot vuorottelevat puhaltimien kanssa, Sellot tekevät sointumattoa" | ✅ todennettu | linjat.py: basso D2 → H1 1:40.1; sellorekisterin soinnut vuorottelevat 2 s välein < >; ylärekisterin purskeet 7 s välein; ankkurit askeleet_alkavat, fis_hengittaa |
| 19 | 9.11. | 3:00 | "alkaa nousu, koko orkesteri nousee ylöspäin, kuulitko tätä?" | ✅ todennettu | linjat.py: soinnut nousevat 2 s askelin h-urkupisteen päällä 2:56–3:12, ylälinja fis1 → e3; tapahtumat.py tunnisti itse (nousu 3:06, koko orkesteri); aiempi "metsä seisoo" poistettu |
| 20 | 9.11. | 3:20 | "puupuhaltimet, mutta mitä viulut tekevät? Tärkeä!" | 🔶 osittain | mitattu kaksi kerrosta (nopeat korkeat kuviot + hitaasti laskeva pitkien äänten linja, pitkät korkeat äänet värisevät); soitinta ei voi nimetä mittauksesta: käyttäjä kertoo |
| 21 | 9.11. | – | "sinun pitää ITSE pystyä tunnistamaan KAIKKI TUOLLAISET KOHDAT" | 🔶 korjattu, ei todennettu | tapahtumat.py: 271 tapahtumaa (nousu 29, lasku 25, kerros katoaa 8, urkupiste 13, basso liikkuu 6, tremolo 4 ...); löysi kolme esimerkkiä itse; vääriä osumia ei ole karsittu korvalla |
| 22 | 9.11. | – | "kuunteluopas ei ole tekninen kuvaus desibeleistä ... Tekninen data menee json fileen." | ✅ todennettu | kuunteluopas.md: 0 kpl "dBFS"; tekninen data annotations/tekninen_rattle2022.json |
| 23 | 9.11. | 0:12 | "'käyrätorvet vastaavat' ei ole oikein. Ne kuuluvat taustalla soittaen gis-ääntä koko ajan. Ne tulevat vain esiin kun jouset lopettavat." | ✅ todennettu | ankkuri gis_paljastuu; tarkka.py: Gis4 katkeamaton 8,7–17,8 s, jousten sävelet lakkaavat 12,0–12,9 s |
| 24 | 9.11. | – | "NE PITÄÄ NÄKYÄ VISUAALISESTI ... visualisaattoria ÄÄNELLE" | 🔶 kirjattu sääntönä | tyyliohje luku 7b (ääni → kuva), kuvasääntö 0, kriitikon kohta aani_nakyy; todennetaan ensimmäisestä renderistä |
| 25 | 9.11. | – | "NIIN MITÄHÄN NE VIULUT TEKEVÄT? ... ET VOI MINULTA KYSYÄ" | 🔶 korjattu, ei todennettu | kirjain C (t. 106): viulut div. pitkin sidotuin äänin, vajoavat hitaasti; huilut ja klarinetit kuvioivat; alttoviulut, sellot ja bassot tacet (ääni + partituurin s. 10); käyttäjä ei ole vielä vahvistanut |
| 26 | 9.11. | – | "ei voi olla niin että meillä on kymmenen tiedostoa, mihin data on ripoteltu ... MONTAKO DOC FILEÄ / ANALYSAATTORIA TARVITSET" | ✅ todennettu | luettavia tiedostoja kolme (kuunteluopas, tyyliohje, taustatutkimus) ja projekti.md; docs/ 17 → 4 tiedostoa + arkisto (koko docs 49 → 20 tiedostoa); analysis/ 30 → 16 skriptiä, yksi kuuntelutyökalu korvat.py; kuvaa ohjaa yksi cues.json; check_package: kaikki kunnossa |
| 27 | 9.11. | – | "älä siis vaan poista niitä, vaan ne täytyy lukea, syntetisoida ... käyttökelpoisessa" | ✅ todennettu | tapiola_tutkimus.md v2 kirjoitettu arkiston ja poistettujen tiedostojen pohjalta (15 lukua: periaatetaulukot mytologiasta, viitteistä ja 1920-luvun taiteesta, kirjain- ja tahtitaulukko, mitä ääni antaa); partituurin 25 sivun taulukko arkistoon; iskusarake tyyliohjeen lukuun 7; siirto omaan äänitykseen projekti.md:hen; mitään ei poistettu arkistosta |
| 28 | 9.11. | – | "Aloita käsikirjoitus" ... "tarkista ensin netistä, millainen on hyvä kuvakäsikirjoitus. Voitko löytää vaikka jonkun skillin" | 🔶 kirjoitettu, ei hyväksytty | `docs/kuvakasikirjoitus.md` v1; kriteerit haettu (9 lähdettä, käsikirjoituksen luku 9); skilliä ei löytynyt käyttäjän skilleistä, hakemiston kolme lähintä eivät sovi (oma tyyli tai eri laji); tarkistus: 60 ottoa, 76/76 ankkuria, ei käsin kirjoitettuja aikoja, kaksi nimettyä pysähdystä |
| 29 | 9.11. | – | "Hyväksyn maailmat" | ✅ todennettu | kahdeksan maailmaa ja seitsemän kulkua kirjattu hyväksytyiksi (`docs/kuvakasikirjoitus.md` alku, luku 2 ja luku 8 kohta 1); hyväksyntä koskee runkoa, ei luvun 8 muita päätöksiä |
| 30 | 9.11. | – | "C duuri voi olla punainen, sopii sibeliukseen." | ✅ todennettu | punainen kirjattu päätökseksi: tyyliohje luku 3 ja säännöt 15–16, käsikirjoitus luvut 3 ja 8, `kriitikko_kohdat.json`; messinki merkitty hylätyksi vaihtoehdoksi |
| 31 | 9.11. | – | "H-duuri on D mollin rinnakkaisduuri. Synkkä ja hämärä." | ✅ todennettu | käyttäjä myöhemmin 9.11.: "tämä oli virhe minun osaltani" (sävellajit ristissä); luettu: D-duuri on h-mollin rinnakkaisduuri, joten sen välähdykset ovat synkkiä ja hämäriä, eivät keltaisia (tyyliohje luku 3, käsikirjoitus luvut 3 ja 8). Lopun H-duuri pysyy hellänä; toista luentaa ei viety tekstiin |
| 32 | 9.11. | – | "Aja tarkistus" | ✅ todennettu | tuore Sonnet-lukija, brief tiedostona; raportti `runs/kk_tarkistus_v1/kriitikko.md` (9 rikkomusta, 5 ristiriitaa, 5 aukkoa, 8 huomiota, 12 tyyliohjeen omaa ristiriitaa); ohjaajan todennus löydös löydökseltä `runs/kk_tarkistus_v1/tarkistus.md`; käsikirjoitus v1.1 ja tyyliohje v1.3; mitattu `check_package.py --cues-only`: kaikki kunnossa, seitsemän kulkua vähintään 4 s |
| 33 | 9.11. | – | "Hyvä. Tee vedokset kohtauksista" | 🔶 tehty, ei katsottu | vedos 1: 16 stilliä (otot 2, 4, 7, 9, 16, 19, 22, 30, 37, 39, 47, 49, 50, 54, 56, 58), kontaktiarkki `runs/vedos_v1/stills/arkki.png`; mitattu: toistettavuus ja camcheck (0,8 °/s); kolme pahinta ongelmaa ja tekemättömät `runs/vedos_v1/run.json` |
| 34 | 9.11. | vedos 1 | "se nyt metsää kuvaa sillä tavalla, että sulla on vaan rivipuita. Jotka on niin kuin syvyydessä. Vaan se on niin kuin äärimmäisen tylsä." ... "tee vaikka semmoinen taidehistoriahaku" ... "sumussa näkyviä kaukaisia vuoria" ... "puun indikaatio" ... "en nyt nähnyt noista vedoksista ... miten se äänen korkeus siinä otettiin huomioon" ... "kuvan pitää seurata sitä ääntä. Milloin sen korkeutta, milloin sen intensiteettiä" ... "zoomataan kameralla staattisten puitten välissä, niin ei ole kauhean kiinnostava kokemus" ... "tää täytyy nyt niin kuin kirjoittaa uudelleen" (koko palaute: `docs/tutkimus/haastattelu.md`) | 🔶 korjattu, ei todennettu | taidehistoriahaku (`docs/tutkimus/taide1920.md` luku 7); tyyliohje v1.4 luku 4b kuvatavat; käsikirjoitus v1.2 luvut 1 ja 2; vedos 2 (`runs/vedos_v2/`): eri kuvatapa joka tunnelmalle, säikeet piirtävät ylälinjan korkeuden ja valo seuraa äänen tasoa; käyttäjä ei ole vielä katsonut |
| 35 | 9.11. | – | "Tee koepätkä" | 🔶 tehty, ei katsottu | `runs/vedos_v2/koepatka_alku.mp4`: alku ensimmäiseen D-duurin valoon, 75,2 s; latvojen huojunta ja iskujen vastineet lisätty; mitattu: ääni 0,00 ms kuuntelukopiosta, kuva muuttuu iskujen ruuduissa, ei leikkauksia (`runs/vedos_v2/run.json`) |
| 36 | 9.11. | koepätkä | "Lopeta kysely minulta. Työskentele, kunnes olet täysin tyytyväinen" ... "Olemme edelleen staattisessa metsässä. Puiden huojunta ei näy. Tuo viiva ... on kulmikas, nykivä. EI NÄIN." ... "torvet ja puhaltajat tulevat esiin jousien alta alussa. Miten se näkyy tässä?" ... "kunnes kuunteluoppaan KAIKKI asiat on visualisoitu VISUAALISEN TYYLIN mukaan. Muista, selkeys voittaa aina." ... lumi "on KAIKEN PÄÄLLÄ oleva maski" ... "alun metsä voisi olla vain 'siemen' metsästä" ... "gis-äänet ... kukkuloina - seurata sitä spektrin muotoa" ... "horisonttia - siksi lähes unisono - josta sitten nousee yksittäisiä soittajia puiden takaa - Jouset kuvaa sitä tummaa metsää" (koko palaute: `docs/tutkimus/haastattelu.md`) | ❌ hylätty: käyttäjä näki vedoksen 3 ja hylkäsi sen, ks. rivi 37 (aiemmin: kriitikon kriitikon kierrokset 5–7 ilman estäviä virheitä, `runs/vedos_v3/run.json`) | työ käynnissä: katso luku Työn tila heti tämän taulukon alla |
| 37 | 9.11. | vedos 3 (koko teos) | "pomppivat ja hyppivät kumikuuset" ... "METSÄ EI EDELLEENKÄÄN OLE RIVI PUITA" ... "Kaukaiset puut ... juuri ja juuri erottaa usvan seasta" ... "kalevalalainen metsä. Jossa on mystisiä olentoja" ... "Gis on ... horisontti - joka sitten hellävaraisesti muodostaa mäkiä" ... "Kameran piti koko ajan mennä eteenpäin, vääjäämättömästi" ... "joudut tekemään kaiken uusiksi". Hyvää: valot, lumisade. Koko teksti: `docs/tutkimus/haastattelu.md` | ❌ auki | tyyliohje v2.0: luku 4c hylätty, luku 4d kirjaa sanat; käsikirjoitus v2.2 merkitty hylätyksi; uutta kuvaa ei ole |
| 38 | 9.11. | vedos 3 (jatkoa) | "Sinun piti miettiä myös niitä kuvakulmia: miten se kamera liikkuu? Mitkä kuvakulmat luo sellaista vääjäämättömyyttä, toisaalta kunnioittaa sibeliuksen viimeistä teosta. Miten me kuvaamme sen että tähän se loppui? ... Sellaiseen hienoon hyväksyvään H-duuriin." | 🔶 ehdotus ja alkupätkä tehty, ei todennettu | ehdotus kirjoitettu (`docs/kuvakasikirjoitus.md`, Uusi runko: kamera, maailmat, loppu); kuvaa ei ole |
| 39 | 9.11. | alkupätkä alku_v4 | "MIKSI Musiikki ei nyt reagoi ... jousien intensiteetti kasvaa? EIKÄ KAMERA VOI AJAA MAAN LÄPI." ... "Aloitetaan alusta." ... "METSÄN VOI TEHDÄ MUUTENKIN KUIN PIIRTÄMÄLLÄ JOKAISEN PUUN ERIKSEEN" ... "SEN PITÄÄ ELÄÄ, SE ON LAAJA, TUMMA, JA SIBELIAANIINEN ... TAPIO JUMALAN ASUINPAIKKA" ... "haluan myös revontulia" | ❌ auki | tyyliohje 4d kohdat 9–13; uusi piirto tekeillä |
| 40 | 9.11. | alkupätkä alku_v4 | "Sinun piti tehdä 12 maailmaa. Miksi olet tehnyt vain yhden?" ... "Tämä ei ole valmis, ennen kuin olet oikeasti suunnitellut ne visualisaatiot. TAUSTATUTKIMUKSEN MUKAAN" ... "JOSKUS VOI OLLA YKSITTÄISIÄ PUITAKIN. MUTTA NIIDEN PITÄÄ OLLA HARKITTUJA. MITÄ TARINAA NE KERTOO????" | 🔶 suunnitelma kirjoitettu, ei hyväksytty | `docs/kuvakasikirjoitus.md` luku "Kaksitoista maailmaa": jokaisessa lähde, kuva, ääni ohjaa, kamera, puu ja siemen |
| 41 | 9.11. | maailmat 1–2, välivedos | "nyt se metsä alkaa näyttää siltä mitä pitää" ... "kummut siellä hienosti" ... parallaksi: "Lähellä olevat kappaleet liikkuvat nopeamin, kaukana hitaasti" ... "En ole varma pidänkö tuosta joulukuusesta etualalla" ... "gis-horisontti, joka elää 'hienovaraisesti' sen melodian mukana" ... ei spektrin värinää, "seurata sen melodian kaarta" ... "Ei teräviä vuoria" | 🔶 korjattu, ei todennettu | tyyliohje 4d kohdat 16–19; `visual/matka.js`: parallaksi, horisontti melodian kaaresta, sileä vaara, puu poistettu |
| 42 | 10.11. | maailmat 1–2 ja referenssit | 13 referenssikuvaa; "valo osuu puun latvoihin, siivilöityy ... oksien välistä" ... "VALON PITÄÄ reagoida musiikkiin" ... "Lopeta. Ei näin. Et voi ottaa yhtä kuvaa, ja muuttaa kaikkea. LUE AINA ENSIN VISUALINEN TYYLI" ... "Vanha toimi paremmin, kun ne ovat kaukana" ... "mihin ne 12 maailmaa jäi? ... laita tausta-agentit puuhaamaan niitä, ja valvo" ... kriitikko tarkistaa JOKAISEN tyyliohjeen säännön; maailmat uskottavia ja heijastavat alkuideaa | 🔶 tehty, ei todennettu | edellinen maailma 1 palautettu; tyyliohje 4d kohdat 20–22; yhteinen pohja `visual/yhteinen.js`, briefit `runs/maailmat/brief.md` ja `runs/maailma_XX/brief.md`; kuusi tausta-agenttia käynnistetty |
| 43 | 10.11. | brief ja tyyliohje | "miksi olet kirjoittanut 'mikään metsän osa ... ei heilahda iskusta' . . enhän sitä tarkoittanut. Totta kai metsä elää. ... Niiden tulee vain käyttäytyä kuten..puut. ... Tietysti niiden pitää liikkua tuulen mukana! Eli reagoida musiikkiin" | 🔶 korjattu, ei todennettu | tyyliohje 4d kohta 1 ja `runs/maailmat/brief.md` kohta 1 kirjoitettu uudestaan; korjaus lähetetty seitsemälle agentille |
| 44 | 10.11. | vedos 4, hyvää | "Loppu oli aivan älyttömän hieno. Siinä oli tuo valo, ja miten lumet valuu hienosti alas. Metsä oli myös vihdoin sen näköinen kun odotin." ... "Pidin valoista, jotka olivat kuin keijut." ... "Pidin siirtymistä" ... "jättiläisten askelista ... isoina, mutta pehmeinä" ... "Revontulet lopussa olivat hienot." | ✅ säilytetty | loppukriitikko: moduulit 03_04 ja 11_12 ovat videovirraltaan bitilleen samat kuin vedoksessa 4 (`runs/vedos_v5/kriitikko.md`) |
| 45 | 10.11. | vedos 4, 5:30–6:30 | "ei riittävästi tuo esiin musiikin tapahtumia. Siellä on ne jousten spiccatot, kärjessä ... nopeaa, leikkisää. Kuva on lähinnä staattinen. Lumi on stattinen. Ei staattista lunta. ... Ei toimi tuo jääkohtaus" | 🔶 korjattu, ei todennettu | moduuli 06: hyppijät jäällä mitatulla sykkeellä, lumi 13-37 hiutaletta ja liikkuu, jää virtaa; loppukriitikko: osin |
| 46 | 10.11. | vedos 4, 6:30 | "yllättäen paljon kovempi dynamiikka: Kuvassa ei tapahdu mitään." | 🔶 korjattu, ei todennettu | 32 hyppijää ja lumipuuska ankkurin ruudussa (`peikot_G_loppu`, 390,8 s); loppukriitikko: korjattu |
| 47 | 10.11. | vedos 4, 6:50 | "kuunteluopas: liike kiihtyy, ääniä tulee tiheään ei näy mitenkään. ... siitä alkaa uusi asia. Tähän taite?" | 🔶 korjattu, ei todennettu | uusi ankkuri `I_ratsastus` (409,3 s; partituuri: kirjain I, 12/8); jään vauhti 120 -> 630 -> 1140 px/s; loppukriitikko: korjattu, taite pieni |
| 48 | 10.11. | vedos 4, 7:00 | "kumiset puut tulee takaisin. Tässä kohtaa erityisesti ne näyttää koomiselta. Ja ei yhtään vastaa äänikuvaa. VYÖRY H-urkupistellä??" ... "On näköjään erittäin hienovaraista, milloin puiden heilunta näyttää kumiselta, milloin ei." | 🔶 korjattu, ei todennettu | rannan siluetti jäykkä (kriitikko: latvalinja sama pikselilleen kolmessa ruutuparissa); 'vyöry' oli ohjaajan nimi, korjattu oppaaseen (bassojen raskaat aksentit); Tapion valo jään alla lisätty loppukriitikon jälkeen, vain ohjaaja katsonut |
| 49 | 10.11. | vedos 4, 11:20 | "aurinko ei voi nykiä tuolla tavalla ylös alas. ... Sen pitää hitaasti alkaa nousta ja kohdassa 11:20 se täyttää valon ja valaisee tilan. Se oli hieno muuten" | 🔶 korjattu, ei todennettu | auringon korkeus monotoninen (koodista 1520 ruutua, ei laske); valo täyttää salin `auringonsade`ssa; loppukriitikko: korjattu |
| 50 | 10.11. | vedos 4, myrsky | "vähän boring, minuutti vaan ihan samaa. Se miten se nousi oli hieno." ... "intensiteetti pitää seurata jousia. Nyt se on staattinen. Ja se pyörre pitäisi ehkä liikkua. Sen pitäisi olla pintakerros, ja jotain syvempää näkyä taustalla?" | 🔶 korjattu, ei todennettu | moduuli 10 kierros 2: lumen määrän ja tason korrelaatio +0,75 (ennen -0,6), tausta raoissa, liikkuvat pyörteet; loppukriitikko: vaihtelu, pyörre ja syvyys korjattu, intensiteetti osin |
| 51 | 10.11. | vedos 4, alku | "[lopussa] oli paras renderöinti metsästä. Pitäisikö sitä käyttää alussa myös? Harkitse? (Ilman revontulia)" | 🔶 tehty, ei todennettu | uusi alku lopun kruunukentällä; edellinen tallessa (`visual/maailma_01_02_suo.js`, `runs/alku_v4/osa_suo.mp4`) |
| 52 | 10.11. | vedos 4, nymfit | "Sibeliuksen mainitsemat nymphit ei oikein nyt näy - se kappaleen leikkisä puoli. ... älä laita liikaa. Vain oikeisiin kohtiin. Kun jouset liikkuvat nopeasti, leikkisästi. Tai puupuhaltajat liikkuvat staccato, ja leikittelevät. Ja sitten se vastakohta siihen kun bassot jyrisevät tapiota." | 🔶 osin, ei todennettu | kuunteluoppaan lanka 4; valot kohdissa 3:51, 4:05, 4:42-5:01 (moduuli 05) ja 5:48-6:49 (moduuli 06); loppukriitikko: osin |
| 53 | 10.11. | vedos 4, rungot | "Jossain kohtaa, en muista missä, puun rungot bugitti - ne välkkyivät ja niissä näkyi jotain ihme värinöitä ja piikkejä." | 🔶 korjattu, ei todennettu | moduuli 09: syy kameran vauhti 3-10 m/s ja leveysväre; kriitikko todensi koko välin ruutueroista (`runs/maailma_09/kriitikko_v5.md`) |
| 54 | 10.11. | vedos 4, 8:15 | "sellosoolo? Kaunis! Nyt ei tapahdu mitään" | 🔶 korjattu, ei todennettu | partituuri: sellot div. a 4 con sord. mezza; usvanauha kulkee salin poikki melodian mukaan, painopiste sellot 0,3 / altot 0,5 / viulut 0,75; loppukriitikko: osin |
| 55 | 10.11. | vedos 4, 9:00 | "Voisiko siinä kohtaa kun altot soittaa, joku sumu tai muu tuoda vähän eloa? 9:00 eteenpäin?" | 🔶 korjattu, ei todennettu | usva kolmessa kerroksessa; loppukriitikko: korjattu; nopeutta ei saatu mitattua renderistä |
| 56 | 10.11. | vedos 4, kuuntelu ja kriitikko | "kuuntele vielä kappale, yritä tunnistaa ne nymphit, taitekohdat vielä paremmin ... milloin tapahtuu jotain uutta ja yllättävää" ... "päivitä kuunteluopas" ... "kriitikon pitäisi tarkemmin vahtia sitä, onko tyyliopas toteutunut. Ja onko nuo kuunteluoppaassa mainitut asiat näkyvissä." | 🔶 tehty | partituurin sivut 7-41 luettu (`docs/tutkimus/partituuri.md`), 12 uutta ankkuria ja 12 korjattua, opas generoitu; kriitikon lista `runs/vedos_v5/brief.md`; loppukriitikko lause lauseelta |
| 57 | 10.11. | alku, gis | "Se gis idea ei nyt oikein välity ... Jousien (eli metsän) takaa pitäsi jotenkin tulla ESIIN ne mäet (nousevat ja laskevat kulut). Eli dynaaminen. Mutta ... ei ole koomisia, vaan hitaita ja uljaita. Nythän ne on vaan tuossa kuvassa paikallaan." | 🔶 korjattu, ei todennettu | ohjaajan tulkinta (tyyliohje 4d kohta 30): vaarat paljastuvat; kriitikko: lukevat suomalaisina vaaroina, maisema kertyy; loppukriitikko: osin (hidas, mutta matala ja hento) |
| 58 | 10.11. | 10:28 ja 10:34 | "Trumpetti ja patarumpu kommentti kohdassa 10:28 on sinulta jäänyt täysin huomiotta - se on tärkeä! Tuleee ensimmäistä kertaa. Sitten 10:34 tempo alkaa nousta? Pitää näkyä kuvassa - intensiteetti nousee? Miksi ei näy mitenkään?" | 🔶 korjattu, ei todennettu | uusi ankkuri `trumpetit_patarummut_356` (626,3 s): seitsemän leikkausta (loppukriitikko: korjattu); `allegro_359` 634,5 s: lähirungot, lumi x3,9, kirkkaus +47 % (täsmäkorjaus loppukriitikon jälkeen, vain ohjaaja katsonut) |
| 59 | 10.11. | 14:30 | "Aksentti 14:30 ei näy" | 🔶 korjattu, ei todennettu | uusi ankkuri `myrsky_aksentti_537` (872,0 s; partituuri t. 537); rintama hyppää lähemmäs ja jää; loppukriitikko: osin |
| 60 | 10.11. | vedos 5 (mobiili), alku 0:08–0:45; puhaltimien kuviot 0:25–0:39 | "Kummut alussa. Et vieläkään tajunnut tätä gis-horisonttia. Vasta sitten kun sieltä nousee niitä melodioita, niiden pitää hellästi tulla vähitellen esiin usvasta. Ne eivät vain voi "ilmestyä" - mieti miten kummut toimivat maisemassa. Ei siinä yhtäkkiä ole kumpua." | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 61 | 10.11. | vedos 5 (mobiili), alku: yleistauko 0:58–1:01 (ja muut hiljaisuudet); viulujen kiihtyvä kuvio (0:45 puuska / 0:54 fraasi?) | "Video ei reagoi oikein GP (kenraalipaussi) taukoihin. Eikä viulujen nopeutuvaan kuvioon. Intensiteetti säilyy ihan samana. Älä nyt mene 100% toiseen suuntaan sitten, kaikkien liikkeiden pitää olla sulavia. Ei yllättäviä (paitsi silloin kun on yllättävä isku)" | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 62 | 10.11. | vedos 5 (mobiili), sauma 1:01,6 (01_02 → 03_04) | "Leikkaus ei toimi oikein, jos sen piti olla ensimmäisen GP tauon kohdalla?" | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 63 | 10.11. | vedos 5 (mobiili), pimeä metsä 1:02–3:23 (valo, sykkeet 1:40 / 2:09) | "Valo synkässä metsässä toimii hienosti! Bravo! Sykkeet tulee siinä upeasti. Voisiko lumi tai joku vähän reagoida alttoviulun kommentteihin" | ❌ auki (lisäys; nykyinen säilytetään) | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 64 | 10.11. | vedos 5 (mobiili), siirtymä kiteeseen n. 3:06–3:23 | "lumikristalliin mennessä puiden rungot bugittavat kummallisesti. Ne jatkuvat ylös asti? Mitä sillä on haettu? Ei joka tapauksessa toimi" | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 65 | 10.11. | vedos 5 (mobiili), 3:51–5:01 (puupuhaltimien leikki, juoksu 4:04, grazioso 4:40) | "Keijut tanssivat hienosti nyt. Mutta ei ihan musiikin tahtiin. Voisiko ne tarkemmin noudattaa puhaltajien kuvioita" | ❌ auki (lisäys; nykyinen säilytetään) | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 66 | 10.11. | vedos 5 (mobiili), lasipallo n. 5:28–5:36 | "Pallo nyksähtää jotenkin oudosti. Pitäisi liikkua sulavasti koko ajan." | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 67 | 10.11. | vedos 5 (mobiili), jää 5:48–6:30 | "Keijut jäällä: eivät tanssi musiikin tahdissa. Pitää olla juuri oikein." | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 68 | 10.11. | vedos 5 (mobiili), 6:30 joukko; 6:37 jouset pysähtyvät | "Ne yhtäkkiä lisääntyvät aivan liikaa. Se on vähän koominen efekti. Ja eivät tanssi forte-kohdassa loogiesti musiikin mukana. Jatkavat tanssia, vaikka musiikki ei. Tarkista vielä tarkempi sovitus musiikkiin" | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 69 | 10.11. | vedos 5 (mobiili), jään rengasaallot 5:48–6:49 | "Jään pintaan ei voi tulla loogisesti vesirenkaita - voi tulla halkeamia. Halkeama voi edetä musiikin tahdissa" | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 70 | 10.11. | vedos 5 (mobiili), sali: viulujen korkeat huiluäänet 9:40 eteenpäin (käyttäjän vahvistama aika) | "WAU Hienosti menee nuo valot tuossa tapion pöydässä! UPEA! Kun viulut tekevät korkeat äänensä. Mahtava efekti. Ja tykkään muutenkin tästä usvasta ja sumusta tässä kohtauksessa." | ✅ pidetty, ei muuteta | käyttäjä tarkensi 10.11. klo 18.31: "tarkoitin viulujen korkeilla (flasoletti) äänillä 9:40 eteenpäin tapahtuvia asioita. Sitä ei saa muuttaa." Muiden rivien ajat: "ajat muuten melko ok" |
| 71 | 10.11. | vedos 5 (mobiili), 10:26 trumpetit ja patarummut; fraasin toistot, myös talvimyrskyssä (14:33–15:45) | "Hienosti nyt trumpettien tuo kommentti tulee esille. Aina kun tuo trumpetit soittaa ff saman fraasin, se pitäisi nostaa esiin." | ❌ auki (lisäys; nykyinen säilytetään) | käyttäjä tarkensi 10.11. klo 18.48: "Tuo trumpettien ja patojen fraasi toistuu muuten talvimyrskyn aikana myös monesti. Se pitää tuoda esiin. Ehkä tässä kohtaa jollakin uudella tavalla, koska se tulee viimeistä kertaa. Mutta tunnistettavasti"; toistojen paikat haetaan partituurista ja kuuntelukopiosta |
| 72 | 10.11. | vedos 5 (mobiili), aurinko 11:05–11:24 (lähirunko auringon edessä) | "puun runko juuri auringon edess? Miksi? Blokkaa mun lempikohdan. Tietysti tuo varjo tulee hienosti esille, mutta voisiko sen sommitella vähän eri tavalla? Vai onko tarkoituksella näin?" | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 73 | 10.11. | vedos 5 (mobiili), pimeä metsä 11:32 → (tummat liikkuvat hahmot/varjot) | "seuraavassa kohtauksessa varjot tai nuo tummat liikkuvat jutut on erittäin hieno tapa tuoda esille juuri noita nymphejä. Upeaa! Tätä juuri tarkoitin miksi sinä olet olemassa. Toteutit hienosti tuon että ne pitää näkyä, vaikka ei saa näkyä. Juuri näin!" | ✅ pidetty, ei muuteta | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 74 | 10.11. | vedos 5 (mobiili), 12:50 → (jousiston kommentit) ja 13:02–13:05 (oktaavinousu bassoista viuluihin) | "12:50 eteenpäin jousiston kommentteihin enemmän näkyvyyttä - nousevat nopeasti usean oktaavin yli, mutta videossa ei tapahdu mitään? Lopetitko analysoinnin lopussa? Pitää jaksaa loppuun asti analysoida nämä asiat?" | ❌ auki | käyttäjä tarkensi 10.11. klo 18.46: "tuo jousisto oktaavit on 13:02 - 13:05 noin. Alkaa bassoista ja päättyy viuluihin. Mutta tuo silti 12:50 ei nuo jousiston kommentit oikein näy. Tuo kommentti pätee edelleen" |
| 75 | 10.11. | vedos 5 (mobiili), 13:31–13:33 (kirjain P 13:26 lähellä) | "13:31,32,33 ISO TAITE, SUURI MUUTOS mutta juuri mitään ei tapahdu. Koita oikeasti jaksaa analysoida biisi ihan loppuun asti - ja kuulla sieltä nämä asiat" | ❌ auki | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 76 | 10.11. | vedos 5 (mobiili), loppu (moduuli 11_12, 15:45–17:58) | "Kappaleen Loppu on UPEA!!!! ÄLYTÖMÄN HIENO. Olen katsonut sen jo muutaman kerran, ja joka kerta liikutun siitä miten hieno se on!!! Se H-duuri on mieletön, revontulineen ja viimeisenä auringon kajona. Upeaa *chefs kiss* Älä muuta lopusta enää mitään" | ✅ pidetty, ei muuteta | kohta on kirjaajan arvio kuunteluoppaasta ja stilleistä: tarkista videosta ja kuuntelukopiosta |
| 77 | 10.11. | vedos 5, yleinen | "Koita jaksaa kuunnella tosiaan sieltä vielä tarkemmin nuo rytmiset elementit, että ne osuu oikein. Ja tuolla loppupuolella on loppunut vähän jaksaminen kuulla nuo musiikin asiat." ... "tarkistamaan kriitikon avulla että kaikki kriitikon huomiot on myös otettu huomioon. Haluaisin illaksi uuden vedoksen." ... "Meillä muuten taisi olla auki jo palautelista ... Voisiko ne paketoida samaan fileen, ja hoitaa samalla kuntoon? Jos niitä siis ei ole vielä hoidettu." | ❌ auki | kaikki palaute on tässä listassa; myös aiemmat ❌- ja 🔶-rivit käydään läpi vedoksessa 6. Ristiriita: loppukriitikon U1/U4/U5 (salin vaakaviiva ja palkki eli Tapion pöytä, valoviivat) vastaan rivi 70 ("UPEA"): käyttäjän sana voittaa, salin valoja ja usvaa ei poisteta kriitikon perusteella; epäselvässä kysytään käyttäjältä |
| 78 | 10.11. | vedos 5 (mobiili), 13:40 ja loppupuolen analyysi | "Aa ja 13:40 tuulenpuuska ei näy. Tosiaan tuo analysointi on tainnut loppupuolelta olla vähän puutteellista. Se pitää tarkistaa." | ❌ auki | loppupuoli (noin 12:36 eteenpäin) kuunnellaan ja teemakartta tarkistetaan uudelleen ennen korjauksia; moduuli 11_12 pysyy silti ennallaan (rivi 76) |
| 79 | 10.11. | vedos 6, työmääräys (klo 19.05) | "käske paikallista instanssia alkaa työskennellä palautteen kanssa. ota huomioon kriitikon palautteet myös. työskentele kunnes kriitikko on tyytyväinen, ja antamani palaute on korjattu. käske että kaikki muutokset tarkistetaan ensikisi tyyliopasta, taustatutkimusta ja kuvakäsikirjoitusta vasten" ... (klo 18.48) "Miksi se ei tarkistaisi kaikkia avoinna olevia kohtia?" | ❌ auki | vedos 6: (1) jokainen muutos tarkistetaan ensin `docs/visuaalinen_tyyli.md`:tä, `docs/tapiola_tutkimus.md`:tä ja `docs/kuvakasikirjoitus.md`:tä vasten ennen toteutusta; (2) hoidetaan kaikki tämän listan ❌- ja 🔶-rivit sekä `runs/vedos_v5/kriitikko.md` ja `run.json`:n `tiedossa_auki`; (3) kierroksia jatketaan, kunnes kriitikon bugilista on tyhjä ja rivit 60–78 on todennettu; (4) säilytettävät rivit 63, 65, 70, 71, 73, 76 (moduuli 11_12 bitilleen sama); (5) lopuksi WhatsApp-versio. Kirjannut mobiili-istunto; se ei voinut käynnistää paikallista istuntoa |
| 80 | 10.11. | vedos 6, alku 0:23–0:45 | "Miten tuo yksi mäki ilmestyy noiden muiden mäkien eteen yhtäkkiä? Etkö ymmärrä että mäet ei toimi niin?" | ❌ auki | syy: vaarat paljastuivat satunnaisessa syvyysjärjestyksessä; korjaus: aina lähimmästä kauimpaan, uusi edellisten takaa |
| 81 | 10.11. | vedos 6, yleinen (puiden heilunta) | "Kumiset puut tuli takaisin. Ne heiluvat kuin kumipuut. PUUT EIVÄT SAA NÄYTTÄÄ KUMISILTA. KIRJOITA SE NYT OHJEESEEN." | ❌ auki | tyyliohje 4d kohta 31 kirjoitettu heti: puu ei taivu lainkaan; kuvan korjaus auki |
| 82 | 10.11. | vedos 6, siirtymä kiteeseen 3:04–3:15 | "Kristalliin lentäessä jotkut puut olivat vieläkin liian pitkiä? VAI MITÄ NE OLIVAT?" | ❌ auki | sama vika kuin rivi 64; loppukriitikko: rungot jatkuvat suorina ylös asti |
| 83 | 10.11. | vedos 6, puupuhaltimien rytmit (keijuvalot 3:51–5:01, 6:37) | "Et ol kuullut puupuhaltimien rytmejä oikein. Jos haluat että ne tanssii rytmissä, niiden rytmi pitää TÄSMÄLLEEN OSUA SOITETUILLE ÄÄNILLE." | ❌ auki | loppukriitikko mittasi 11/20 osumaa: ei riitä; rytmit kuunnellaan uudelleen partituuria vasten |
| 84 | 10.11. | vedos 6, 13:34 (taite t. 494) | "Vieläkään ei tapahtunut muutosta 13:34!!! SIINÄ PITÄÄ OLLA TODELLA ISO MUUTOS!!! TUNNELMAAN!!!" | ❌ auki | vedos 6: vain +37 % kirkkautta: ei riitä; tunnelman on vaihduttava |
| 85 | 10.11. | vedos 6, 13:28 alkaen (vaskisoinnut, kirjain P) | "Yritin sanoa että 13:28 alkaen on ISOT VASKISOINNUT!! MITÄÄN EI TAPAHDU???? ... Älä kuitenkaan liioittele - niiden pitää olla tyylikkäitä - tyylioppaan mukaisia" | ❌ auki | kuunnellaan ja luetaan partituurista s. 48 |
| 86 | 10.11. | vedos 6, lumi (yleinen) | "Lumi ei voi lennellä töksähdellen sinne tänne. Siitä tulee paha olo, oksennus. Ikäänkuin tasapainoaisti heittelisi." | ❌ auki | tyyliohje 4d kohta 32 kirjoitettu; paikat etsitään liikesarjoista |
| 87 | 10.11. | vedos 6, trumpetit ja patarummut (10:28 ja toistot) | "Tuossa patarumpu + trumpetti-teemassa pitää olla VIISI ISKUA: 1234+ viides aksentoitu." | ❌ auki | jokaisen toiston viisi iskua mitataan tarkoista aluista |
| 88 | 10.11. | vedos 6, alun metsä | "Alun metsässä näkyy muuten jotain bugeja nyt, ei näytä hyvältä." | ❌ auki | etsitään liikesarjoista |
| 89 | 10.11. | vedos 6, 4:07 (pikkolon juoksu, kirjain D) | "Tuulenpuuska on nyt hävinnyt kohdasta 4:07? Se oli siellä aikaisemmin? Miten muutat asioita pois, mitä en pyytänyt muuttamaan? Tekeekö kriitikko nyt oikeaa työtä meille, vai haittaa?" | ❌ auki | vedoksen 6 regressio moduulissa 05; vedos 5 ja 6 verrataan ruutu ruudulta, ja kaikki pyytämättä muuttunut palautetaan |
| 90 | 10.11. | vedos 6, 10:53–10:58 (ennen C-duuria 11:20) | "Lensimme puun rungon läpi, niin ei saa käydä, juuri ennen tuota c-duuri paikkaa" | ❌ auki | vedoksen 6 uusi virhe (lähirungot ja kameran sivusiirto); loppukriitikon este 1 |
| 91 | 10.11. | vedos 6, 13:03 eteenpäin (jousten oktaavinousu, t. 473) | "Ai niin ja jousten oktaavinousu ei näkynyt 13:03 eteenpäin. Se on niinkuin hitaasti nouseva tuulenpuuska minusta, vähemmän kuin puhaltajien edelliset, mutta sama ele jousilla." | ❌ auki | sama ele kuin puhaltimien puuska (4:07, 13:41), pienempi ja hitaammin nouseva; ankkuri `jousten_nousu_473` 13:01,2–13:05,3 |
| 92 | 10.11. | vedos 6, 11:40 eteenpäin (tummat liikkuvat varjot, rivi 73) | "Aah ja nyt ne mun kehumat varjot muuttui tunnistatmattomaksi 11:40 eteenpäin, mitä teit niille? Ne mielestäni toimi hyvin ennen? nyt tuntuu että ne on liian nopeita" | ❌ auki | vedoksen 6 regressio moduulissa 09; verrataan vedokseen 5 ruutu ruudulta ja palautetaan |
| 93 | 10.11. | vedos 6, jättiläisen askeleet (pimeä metsä 1:05–3:00; vedoksessa 5 paremmin) | "Vedoksessa 5 toimi muuten paremmin nuo jättiälisen askeleet. Ne pitää tulla paremmin esiin" | ❌ auki | vedoksen 6 regressio; verrataan vedokseen 5 ruutu ruudulta ja palautetaan askelten voima |
| 94 | 10.11. | puiden liike, yleinen (täsmentää riviä 81) | "SIIS NE NIIDEN PUIDEN PITÄÄ ELÄÄ!!!! ... MUTTA EI KUTEN KUMIPUUT. NIIDEN TULEE OLLA ELÄVIÄ, muttta hillitysti!!! KUTEN OIKEA PUU" ... "TÄMÄN OLEN KORJANNUT JO MONTA KERTAA. TÄMÄ SÄILYY: NE EIVÄT SAA HEILUA PALJON!!! MUTTA AAVISTUKSEN JA HIEMAN sopii tyyliin" | ❌ auki | ohjaajan virhe: sääntö 'ei taivu lainkaan' oli väärä ja korjattu heti (tyyliohje 4d.31); mitattu syy vedoksen 6 kumipuihin: alun puuskan (0:45–0:52) pidennys kasvatti latvojen taipuman lähes kaksinkertaiseksi seitsemäksi sekunniksi; muiden moduulien liike on sama kuin vedoksessa 5 |
| 95 | 11.11. | koko teos (vedoksen 7 jälkeen) | "Renderöi tämä, ja kokeile sen jälkeen laittaa jokaiseen kohtaukseen vähän taikaa. Suomalaisen ikimetsän taikuutta, ja samalla jotain uhkaavuutta. Niiden kahden leikki. Totellen tietysti visuaalista tyyliä, niinkuin aina. Mieti mikä nostaisi tämän videon vielä uudelle tasolle? Voitko ajasta uuden ajon aamulle ... Toivoisin että video on huomenna valmis." | ❌ auki | vedos 7 kootaan ensin; taika ja uhka tehdään vedoksena 8 lisäkerroksena, jonka voi kytkeä pois (regressio mitattavissa); loppu (11_12) pysyy koskemattomana (rivi 76) |

### Työn tila palautteen 36 jälkeen (ohjaajan muistilista; päivitetään joka vaiheessa)

Käyttäjä ei halua kysymyksiä. Työ jatkuu, kunnes kuunteluoppaan jokainen kohta näkyy kuvassa tyyliohjeen mukaan ja
kriitikon lista on tyhjä. Selkeys voittaa aina.

**Mitä löytyi:** (a) ohjauskanavat (`ylalinja_midi` ym.) on laskettu sekunnin tarkkuudella ja toistettu 30 ruutuun:
siksi viiva oli kulmikas; (b) `korvat.json` tuntee 10 873 nuottia ja 1 402 pitkää ääntä (alku, kesto, sävel, muoto,
soinnin vihje), mutta piirtäjä ei lukenut niitä; (c) staattinen 3D-metsä ei kanna kuvaa.

**Uusi rakenne (päätetty 9.11.2026):**
1. **Data:** `korvat.py` kirjoittaa spektrin ruututarkkuudella (`spektri.u8`), ja `make_cues.py` vie nuotit ja pitkät
   äänet ohjaustiedostoon. Kuva piirretään niistä: jokainen nuotti ja pitkä ääni on kuvan tapahtuma.
2. **Kuva:** kerrosmaisema. Kolme kerrostumaa ovat orkesterin kerrokset: **maa** (bassot, patarummut), **metsä**
   (jouset: tummat siluetit, joiden ääriviiva on jousten linja) ja **valo metsän takana** (käyrätorvet ja puhaltimet:
   horisontin viiva ja siitä nousevat kukkulat, muoto äänen yläsävelistä). Vasket leikkaavat pystysuoraan läpi, huilujen
   lyhyet äänet ovat pilkahduksia korkeuden mukaan, lumi kulkee kerrosten välissä.
3. **Alku on metsän idea:** vaakasuora horisontti (unisono gis). Jousten siemenmotiivi piirtää ensimmäisen metsän
   ääriviivan; kun jouset lakkaavat, metsä väistyy ja takana ollut viiva jää; puhaltajat nousevat siitä kukkuloina
   yksi kerrallaan. Kaikki myöhempi kasvaa tästä kuvasta.
4. **Kuvatavat** (tyyliohje 4b) ovat tämän saman kerrosmaiseman katsomispaikkoja.

**Järjestys:** data → kerrosmaiseman piirtäjä ja alku → kriitikko (ruudut kuunteluopasta vasten) → käsikirjoitus
uudestaan kuunteluoppaan jokaisesta kohdasta → kriitikko (käsikirjoitus kuunteluopasta vasten) → jaksot yksi
kerrallaan, jokaisen jälkeen kriitikko → koko renderi ketjuna.

**Tehty:**
- 9.11. Data: `korvat.py` kirjoittaa `spektri.u8` (30 r/s x 84 puolisävelaskelta); `make_cues.py` vie `pitkat`, `nuotit` ja
  spektrin osoitteen ohjaustiedostoon. `ohjaus.f32` ei muuttunut (tavu tavulta sama).
- 9.11. Piirtäjä: `visual/kerrokset.glsl.js` (kerrosmaisema) ja `visual/kohtaus.js` (kuva lasketaan nuoteista, spektristä
  ja iskuista joka ruudulle). Vanha `visual/metsa.glsl.js` (3D-metsä) ei ole käytössä; poistetaan, kun kuvatavat on
  toteutettu kerrosmaisemassa.
- 9.11. Tyyliohje v1.5 luku 4c: kerrosmaiseman kielioppi.
- 9.11. Alku 0:00–1:15 renderöity (`runs/vedos_v3/alku.mp4`); kriitikko katsoo ruudut (`runs/vedos_v3/brief.md`);
  toinen agentti käy kuunteluoppaan jokaisen rivin kuvaksi (`runs/kk_v2_luonnos/brief.md`).

- 9.11. Kriitikko 1 (alku): 18 virhettä, 5 estävää (`runs/vedos_v3/k1/kriitikko.md`). Korjattu: viiva pysyy, puut huojuvat
  näkyvästi ja ovat läpinäkymättömiä, leikkaus on lyhyt repeämä eikä viiva, lumi viidessä syvyydessä, metsän reuna on
  kuvassa aina (hiljaisuudessakin), kukkuloiden alta poistettu pystysäteet, yläsävelet suodatettu (basson ja vahvan
  äänen yläsävelet eivät ole soittajia), maa tummennettu, sysäys etenee maassa. Kriitikko 2 katsoo korjatun alun.
- 9.11. Luonnos (`runs/kk_v2_luonnos/luonnos.md`): kuunteluoppaan kaikki 153 riviä kuvaksi 4c:n sanoin, roolien aikajana
  koko teokselle ja kuusi puuttuvaa sääntöä (S1 liikkeen tiheys, S2 korkea tremolo, S3 hiljaisuus, S4 D-duuri,
  S5 maan korkeus bassosta, S6 vaskien pitkä ääni). Kuvatavat 6, 7 ja 9 ovat ristiriidassa 4c:n kanssa: 4c voittaa,
  ja kuvatavat määritellään uudestaan saman kerrosmaiseman rajauksina.

- 9.11. Kriitikko 2 (alku): 6 korjattu, 7 osin, 5 ennallaan. Korjattu sen jälkeen: huojunta (mitattu: 80 000 pikseliä
  vaihtuu puolessa sekunnissa puiden reunoilla), puut väistyvät vajoamalla eivätkä läpikuultavina, kukkula alkaa ja
  päättyy nollasta, leikkauksen jälkihohto lyhyt, jokainen isku sysää maata ja heilauttaa metsää.
- 9.11. Piirtäjä koko teokselle: pysyvä viisikerroksinen metsä (huojuu liikkeen tiheydestä, kohoaa rekistereittäin),
  kymmenen kuvatapaa saman kerrosmaiseman rajauksina (`visual/kohtaus.js`: K2_MAASTA … K10_YLHAALTA), roolit
  kuunteluoppaasta joka ankkurille. Koko teos renderöity (`runs/vedos_v3/koko.mp4`, ei gitissä).
- 9.11. Kuvakäsikirjoitus v2.0: generoitu luonnoksen 153 rivistä (70 ottoa, 9 kulkua, kaikki 76 ankkuria); generaattori
  oli kertakäyttöinen, käsikirjoitusta muokataan tästä eteenpäin käsin. `check_package.py` hyväksyy vähintään 7 kulkua.

- 9.11. Kolme kriitikkoa koko teokselle, kierros 1 (`runs/vedos_v3_a|b|c/palaute_k1.md`): 21 + 17 + 15 virhettä.
  Juurisyyt ja korjaukset: (1) ikisalo pudotti kerrostumat (vain pystyraitoja) → lähimmät puut runkoina, kaukainen
  metsä, viiva ja maa niiden välissä; (2) myrskyn lumi oli puiden edessä → lumen paino kauas, lähelle harvaa;
  (3) puut hyppivät myrskyssä → huojunta rajattu, tiheässä kohdassa vain pidemmät äänet saavat puun; (4) kajo ennen
  H-duuria → avain siirretty; (5) kuvatavan vaihtuessa kuva loittoni → kulut verhon läpi, mitattu ettei kamera peruuta
  näkyvästi; (6) hiljaisuus, nousu, viivan korkeus sävelkorkeutena, nimetyt iskut, äänen voima valon määränä.
- 9.11. Käsikirjoitus v2.1: hiljaisuus, liikkeen tiheys, legato ja nimetön isku määritelty; kuvatavat 5, 6, 8 kuvattu
  toteutuksen mukaan. Toinen koko renderi tehty (ääni 0,00 ms); kierros 2 käynnissä samoilla kolmella kriitikolla.

- 9.11. Kriitikoiden kierros 2 (`runs/vedos_v3_a|b|c/palaute_k2.md`): A 6/21 korjattu, B 4/17, C 2/15; loput osin tai
  ennallaan, uusia yhteensä 25. Korjattu sen jälkeen: kuusiryhmien välinen lumi harvaksi, verho on ajelehtivaa usvaa,
  kajo nousee H-duurin alusta kuudessa sekunnissa, huudon viiva pysyy kuvassa, nousussa viiva ei laske, maa pysyy
  kuvassa lähikuvassa, ikisalossa kaksi lähintä kerrosta ovat runkoja ja kolme kaukaisinta metsää, M on repeämien sarja,
  pimeässä äänen voima ja askeleet näyttävät metsän. Kolmas koko renderi ja kierros 3 käynnissä.
- **Opittua kriitikoista:** ruudukko kahden sekunnin välein ei näytä iskuja eikä verhon kestoa; liikesarjoja tarvitaan
  jokaisesta iskusta ja kulusta. Kriitikko löytää joka kierroksella uutta, koska korjaus paljastaa seuraavan kerroksen.

- 9.11. Kriitikoiden kierros 3 (`runs/vedos_v3_a|b|c/palaute_k3.md`): A 2/19, B 0/15, C 1/18 korjattu. Kolme asiaa
  jokaisesta osasta esti näyttämisen: A maa ei erotu, huurre paperinen, jättipuu peittää; B pylväsmetsä ei seuraa
  ääntä, iskut vajaita, punainen jatkuva; C kajo väärin päin, kulut tyhjän läpi, pitkät samannäköiset jaksot.
  Korjattu: kajon kerroin koskee myös liukua; kulut liukuvat jatkuvasti ja verho jää läpinäkyväksi; ikisalo on
  matalien jousten äänistä kasvava sininen metsä; punainen on kolme vilahdusta ennen C-duuria; maan lumipinta on leveä
  kaista; huurre on tumma. Neljäs koko renderi tehty. Käsikirjoitus v2.2.
- **Opittua:** (1) kuvatapa, joka ei synny äänestä (pylväsmetsä), on kriitikolle ja käyttäjälle sama virhe kuin
  staattinen metsä: ensin ääni, sitten rajaus. (2) Verho, joka peittää kuvan, on leikkaus. (3) Jokainen ehto, joka
  koskee aikaa avaimen jälkeen, pitää tarkistaa myös liu'un ajalta ennen avainta (kajo). (4) Kolme kriitikkokierrosta
  ei riitä tyhjään listaan: jokainen korjaus paljastaa seuraavan kerroksen, ja osa löydöksistä on makuasioita, jotka
  käyttäjä ratkaisee.

- 9.11. Kriitikoiden kierros 4 neljännestä renderistä (`runs/vedos_v3_a|b|c/kriitikko.md`): A 1/20 korjattu, 4 osin,
  15 ennallaan; B 5/21, 8 osin, 8 ennallaan; C 3/19, 7 osin, 9 ennallaan. Estävät: A maa puuttuu 0:26–1:06 ja
  3:02–5:24, puut läpikuultavia 3:22–5:18, viiva ei seuraa säveltä 1:02–3:06; B tutti-isku 10:21 ei näy; C ehdollisesti
  salaman ajoitus Q:ssa ja R:ssä sekä kulku 9 (15:38–15:45), jossa metsä lähes häviää.
- 9.11. Kierroksen 4 jälkeen korjattu koodiin, **ei renderöity eikä kriitikon tarkistama** (vain 12 stilliä): viivan ja
  äänten korkeus kuvassa riippuu vain sävelkorkeudesta, ei maan korkeudesta; puut ovat läpinäkymättömiä; maan korkeutta
  säädetty kuvatavoittain; kuusiryhmä kasvaa sekunnin aikana eikä iskun ruudussa.

- 9.11. Kierrokset 5, 6 ja 7 (renderit 5, 6 ja 7; `runs/vedos_v3/run.json`): **ei yhtään estävää virhettä** missään
  osassa kolmella peräkkäisellä kierroksella. Ääni 0,00 ms joka renderissä. Korjattu kierrosten välillä: maa on aina
  kuvassa (lähestymisen kiintopiste on viivan sävel ja lähikerrosten suurennos on rajattu); mikään kerros ei ole
  läpikuultava; nimetyt iskut ovat täysiä (tutti 10:21 luettiin heikosta aksentista); basson askeleet tulevat matalan
  kaistan tason nousuista; huojunnan ja lumen vaihe on jatkuva; metsän tiheys muuttuu paikallaan; maa on yölumen pinta.
  Tyyliohje v1.6 (luvun 4c tarkennukset).
- **Jäljellä (kriitikon "haittaa", vakiintunut lista, `run.json` kohta `ei_korjattu`):** lopun 44 s sama kuva ja
  vaarakerrokset; ikisalon sommitelma 3 min; nousut ja laskut eivät näy viivassa; kukkuloita enemmän kuin oppaan rivejä;
  muutama alle puolen minuutin samannäköinen jakso. Makuasiat ovat käyttäjän ratkaistavia (`kayttajan_ratkaistavat`).
- **Opittua:** (1) Parametri kertaa aika on vaihevirhe: jos nopeus (tuuli, taajuus) muuttuu, kuva hyppää. Matka pitää
  integroida. (2) Kerroksen osittainen näkyvyys ei saa olla läpinäkyvyyttä eikä ruudukon venytystä: tuleva asia kasvaa
  paikallaan. (3) Kun kriitikko sanoo "ei näy", syy voi olla datassa: basson askelia ei ollut nuottilistassa lainkaan.
  (4) Eksponentti ilman rajaa vuotaa: maan reunan kaava teki koko taivaasta mustan, ja sen näki vasta stilleistä.
  (5) Kriitikon 384 pikselin ruuduista ei erotu hieno lumi eikä pieni sysäys; ne pitää todeta täysikokoisesta kuvasta.
  (6) Kolmen kierroksen jälkeen ilman estäviä virheitä lista ei enää lyhene korjaamalla: jäljellä on käsikirjoituksen
  ratkaisuja, jotka käyttäjän pitää nähdä.

- 9.11. **Käyttäjä hylkäsi vedoksen 3** (palautelista rivi 37). Syy on ohjaajan: koepätkän palautteen jälkeen ohjaaja
  kirjoitti tyyliohjeeseen oman luvun 4c ("jousten ääni on kuusiryhmä, joka kasvaa maasta"), julisti sen voittavaksi,
  kirjoitti käsikirjoituksen sen mukaan uudestaan ja antoi kriitikoille briefit, jotka nojasivat siihen. Seitsemän
  renderiä ja seitsemän kriitikkokierrosta hioivat väärää kuvaa.
- **Opittua:** (1) Kriitikko, jonka brief on johdettu ohjaajan omasta tulkinnasta, ei voi huomata, että tulkinta on
  väärä. Kriitikon pitää saada käyttäjän sanat ja tyyliohjeen luvut 1, 2 ja 5 sellaisinaan ja kysymys "onko tämä se,
  mitä käyttäjä pyysi", ja hänen pitää nähdä liikettä, ei 2 s:n ruudukkoa. (2) Uusi kuvakielioppi näytetään käyttäjälle
  lyhyenä pätkänä ennen kuin koko teos renderöidään. (3) CLAUDE.md:n sääntö "elementit eivät ilmesty, katoa eivätkä
  loikkaa iskussa" koskee myös puita ja maata. (4) "Jouset kuvaa sitä tummaa metsää" tarkoitti, että metsä on tumma ja
  läsnä, ei että jokainen nuotti on puu.

- 9.11. Käsikirjoituksen uusi runko ehdotuksena (kamera, kaksitoista maailmaa, loppu). **Alkupätkä 0:00–1:04 uudella
  piirrolla** (`visual/matka.js`, `runs/alku_v4/run.json`): perspektiivi, kamera eteenpäin tasaista vauhtia, metsä
  kaukana vaaran rinteellä ja häipyy usvaan, gis horisontin valona ja hitaina mäkinä, vaskien isku pystyvalona, lumi
  syvyydessä. Mikään ei kasva eikä pompi äänen mukana. Kaksi kriitikkokierrosta: estävät korjattu osin; auki alun
  tyhjä alapuoli, pyöreälatvaiset männyt, kalevalaiset olennot puuttuvat. Pätkä näytetään käyttäjälle suunnan
  tarkistuksena ennen muuta työtä (tyyliohje 4d, prosessisääntö).

- 9.11. **Käyttäjä hylkäsi alkupätkän** (rivit 39 ja 40): jousten intensiteetti ei näkynyt, kamera ajoi maan läpi (rinne
  nousi, kameran korkeus ei), metsä piirrettiin puu kerrallaan, maailmoja oli yksi eikä kahtatoista, suunnittelu puuttui.
  **Opittua:** suunnitelma kaikille maailmoille taustatutkimuksesta ennen ensimmäistäkään ruutua; metsä massana;
  jokainen yksittäinen puu nimetään tarinoineen; kameran korkeus maasta omalla kohdallaan.
- 9.11. Kaksitoista maailmaa suunniteltu (`docs/kuvakasikirjoitus.md`, luku "Kaksitoista maailmaa"): jokaisessa lähde
  taustatutkimuksesta, kuva, mitatut signaalit, kamera, harkittu puu ja siemenen ele; kolme kaarta (siemen, Tapio,
  revontulet). Tyyliohje 4d kohdat 9–15.

- 10.11. Maailmat 1 ja 2 piirretty massametsänä suolta nähtynä (`visual/maailma_01_02.js`): käyttäjä "nyt se metsä alkaa
  näyttää siltä mitä pitää"; lisätty parallaksi, sileä vaara, horisontti melodian kaaresta; etualan puu poistettu.
  Ohjaaja vaihtoi kuvakulman latvojen yläpuolelle yhden referenssikuvan perusteella; käyttäjä pysäytti ("Lopeta. Ei
  näin"), ja edellinen versio palautettiin. **Opittua:** tyyliohje luetaan ennen jokaista päätöstä; yksi referenssi ei
  kaada sitä, mikä toimii; ohjaaja ei jää hiomaan yhtä maailmaa, kun maailmoja on kaksitoista.
- 10.11. Teos jaettu seitsemään moduuliin rajakuvin (`visual/yhteinen.js`: data, signaalit, piirtopohja, paletti, rajakuvat;
  `render/lukittu.mjs`: yksi renderi kerrallaan; `render/arkki.py`: still-arkki). Moduulit: 01_02 (ohjaaja), 03_04, 05, 06,
  07_08, 09, 10, 11_12 (Sonnet-tausta-agentit, briefit `runs/maailma_XX/brief.md`, yhteinen `runs/maailmat/brief.md`).

- 10.11. yö: seitsemän rakentaja-agenttia teki moduulit 03_04 ... 11_12, kuusi kriitikkoa kävi ne läpi sääntö säännöltä
  (07_08 jäi ilman), estävät virheet palautettiin rakentajille määräajalla. **Vedos 4 koottu** (`runs/vedos_v4/run.json`):
  17:58, ääni 0,00 ms, kaikki seitsemän saumaa täsmäävät (rajakuvat toimivat: ei leikkauksia). Käyttöraja katkaisi työn
  kahdesti; kaksi agenttia jouduttiin herättämään.
- **Opittua:** (1) Rajakuvat (`visual/yhteinen.js`) tekevät rinnakkaisesta työstä liitettävää: jokainen moduuli alkaa ja
  päättyy sovittuun koko ruudun kuvaan, ja saumat mitataan. (2) Rakentaja-agentit lopettavat heti, kun kuulevat määräajan:
  määräaika pitää antaa kellonaikana ja sanoa, paljonko aikaa on jäljellä. (3) Agentit katsovat stillejä, eivät liikettä:
  huojunta ja valon reaktio jäävät todentamatta, ellei brief vaadi liikesarjaa todisteeksi. (4) Sama virhe toistuu
  agentilta toiselle (terävät vuoret, rivimetsä, kova reunaviiva), vaikka se on briefissä kielletty: kriitikko ja ohjaajan
  oma katse täysikokoisiin ruutuihin ovat tarpeen. (5) Lukko (`render/lukittu.mjs`) riitti jakamaan näytönohjaimen.

- 10.11. päivä: käyttäjän palaute vedoksesta 4 (rivit 44-59). Ohjaaja kuunteli teoksen uudelleen: luki partituurin sivut,
  joita ei ollut luettu (kirjaimet D, F-K, N), ja mittasi kohdat. Kuunteluoppaassa oli kolme virhettä, joiden päälle kuva oli
  rakennettu: kirjain G 35 s väärässä kohdassa ja väärillä soittimilla, "vyöry" ohjaajan keksimä nimi, "vaskipulssit"
  oikeasti englannintorven soolo. Uusi lanka oppaaseen: Nymfit ja Tapio. **Vedos 5 koottu** (`runs/vedos_v5/run.json`).
- **Opittua:** (1) Partituurin sivukuvat (`build/partituuri/`) ovat luettavissa suoraan, ja ne ratkaisivat jokaisen käyttäjän
  nimeämän kohdan: mittaus ensin, partituuri heti perään, kuva vasta sitten. (2) Käyttäjän ajat ovat likimääräisiä; tarkka
  kohta on ohjaajan työ. (3) **Älä rakenna uudelleen maailmaa, jota käyttäjä ei moittinut:** maailmat 5 ja 7-8 rakennettiin
  uusiksi kahdesti ja kolmesti, hylättiin joka kerta, ja lopulta vedoksen 4 versio + käyttäjän nimeämät lisäykset oli oikea.
  (4) Kriitikko, joka mittaa liikkeestä (liikesarjat, ruutuerot, painopisteet) ja saa ohjaajan kysymykset, löytää sen, mikä
  stillikriitikolta meni läpi: jokainen ensimmäinen kierros hylättiin. (5) Rakentajan "mitattu" on usein mallista laskettu:
  vaadi mittaus valmiista renderistä, ja pidä erillään. (6) Viimeistelykierros voi tuoda uuden virheen (alun lopun piirretyt
  kuuset): loppukriitikko kootusta videosta ja ohjaajan oma liikesarja saumoista ovat tarpeen; kontaktiarkki ei riitä.
  (7) Rakentajalle kaava ja luku (kaari h·4u(1-u), tulo 1,4 s, px/s) toimii; adjektiivi ("pehmeä", "leikkisä") ei.

- 10.11. ilta ja 11.11. yö: **vedos 6** (mobiilipalaute, rivit 60-79) koottiin, ja käyttäjä hylkäsi siitä paljon (rivit 80-94):
  kumipuut palasivat alkuun, puuska 4:07 katosi, kehutut varjot (11:40 eteenpäin) muuttuivat, lumi nyki, vaskiteemassa väärä
  määrä iskuja, taite 13:34 ja vaskisoinnut 13:26 eivät näkyneet. **Vedos 7** korjaa nämä moduuli kerrallaan
  (`runs/vedos_v7/brief.md`); kuuntelu: nuottikohtaiset tarkat alut (`korvat.py --alut` → `cues.alut.nuotit`), vaskiteeman
  viisi iskua ja P:n soinnut (`iskut_t` ankkureissa).
- **Opittua:** (1) **Uusi vedos verrataan edelliseen ruutu ruudulta** (`render/vertaa.py`, `render/kokoa.py vertaa`): vedos 6
  muutti pyytämättä asioita, joista käyttäjä piti, eikä kukaan huomannut ennen käyttäjää. Brief kirjoitetaan muotoon "vain
  nämä numeroidut kohdat; kaikki muu ruudulleen sama", ja jokainen muuttunut jakso selitetään palautteen rivillä.
  (2) **Älä tulkitse palautetta ääripääksi:** "ei kumipuita" ei ole "puu ei liiku"; käyttäjä korjasi heti (rivi 94).
  (3) Kaistojen alut eivät löydä sidottuja juoksuja; nuottien tunnistus on 20-40 ms myöhässä: nuottikohtainen tarkennus
  yhdistää ne (spektrogrammista tarkistettu). (4) **Tarkista itse ennen kuin korjaat ohjetta:** renderin rajoista lähti
  kaksi väärää ohjetta peräkkäin (ruudut; moduulin oma aika), koska ohjaaja ei lukenut koodia; oikea on sekunnit teoksen
  ajassa (taulukko briefissä). (5) `lukittu.mjs` päästi yli 20 minuutin renderin päälle toisen: lukko pidetään nyt tuoreena.
  (6) Rakentaja voi poistaa hyvän asian, jos brief väittää sitä virheeksi (ikisalon lähirungot olivat vedoksen 5 kuvaa):
  väite "tämä on edellisen vedoksen lisäys" tarkistetaan gitistä ennen kuin se kirjoitetaan briefiin.

**Seuraavaksi (ohjaajan tilannekuva 11.11.2026 klo 0.45; päivitä tämä, kun tila muuttuu):**
1. **Vedos 7.** Hyväksytty ohjaajan omista liikesarjoista: 01_02, 05, 07_08, 10. Viimeisteltävänä (rakentajalla pyyntö
   sisässä): 06 (askelten kirkas ydin pois, halkeama ohueksi), 09 (pölyhunnun ruudukkokuvio pois, holvikaaren reunat pois
   avoimessa tilassa, sway enintään 1,5 %, kommenttisäie kaarevaksi). Raportoimatta: 03_04 (ylöskatse 3:03-3:23: rungot
   päättyvät latvukseen; lumen reaktio alttoviuluihin). Kun kaikki on hyväksytty: `python -I render/kokoa.py kokoa vedos_v7`
   (ääni 0 ms, saumat, lopun MD5), `python -I render/kokoa.py vertaa vedos_v7 vedos_v5` ja `... vedos_v6u`, tuore
   Sonnet-kriitikko kootusta videosta (rivit 60-94 yksi kerrallaan, liikesarjoista mitaten; `runs/vedos_v7/kriitikko.md`),
   palautelistan rivien 60-94 tilat ja todisteet, `runs/vedos_v7/run.json`, commit ja push. Käyttäjälle tiedostot
   `runs/vedos_v7/tapiola_vedos7_720p.mp4` ja `..._whatsapp.mp4`.
2. **Vedos 8: taika ja uhka** (rivi 95, tyyliohje 4d.37, `runs/vedos_v8/brief.md`): seitsemän Sonnet-rakentajaa, jokaiselle
   oma moduuli; lisäykset kytkimen `taika=1` takana, `taika=0` todistetaan samaksi kuin vedos 7 (0 muuttunutta jaksoa);
   osat `osa_v8.mp4`; kokoaminen `python -I render/kokoa.py kokoa vedos_v8 --osa osa_v8.mp4`; ohjaaja katsoo jokaisen
   lisäyksen liikesarjasta vedoksen 7 rinnalla ja hylkää sen, mikä on liikaa tai tyylin vastaista ("vähän taikaa");
   kriitikko; käyttäjälle molemmat vedokset (7 ilman, 8 taian kanssa). Käyttäjä toivoo videon valmiiksi 11.11.
3. Auki siivous: vanhat hylätyt otot kuvakäsikirjoituksessa (`check_package.py` kaksi virhettä), vanhat moottorit
   `visual/kohtaus.js` ym., master 2160p (`docs/youtube.md`) vasta käyttäjän omasta äänityksestä.

---

# 3. Opit

*Elävä dokumentti. Jokainen kierros kirjaa, mikä toimi ja mikä ei. Uusin ylimpänä.*

## 9.11.2026 – Vedos 2: kuvatapa joka tunnelmalle

- **Käyttäjän palaute vedoksesta 1:** metsä runkorivinä syvyydessä on "äärimmäisen tylsä", ääni ei näkynyt, ja ajo paikallaan
  seisovien puiden välissä ei ole kokemus. Koko palaute: `docs/tutkimus/haastattelu.md`.
- **Mikä oli vialla ajattelussa:** tein yhden tilan ja kahdeksan asetusta ja kutsuin niitä maailmoiksi. Tyyliohjeen lause
  "katsoja on metsän sisällä, runkojen keskellä" lukitsi kuvakulman ennen kuin yhtään tunnelmaa oli mietitty kuvana.
  Käsikirjoituksen sarake Katsoja kokee oli olemassa, mutta mikään ei sitonut sitä siihen, miltä kuva näyttää.
- **Mitä haku antoi** (`docs/tutkimus/taide1920.md` luku 7): metsä syntyy vihjeestä ja rajauksesta. Usva on tyhjää tilaa,
  usva erottaa etäisyyden tasot, lähikuva, rajaus ilman taivasta, katse rungon alta ylös, katse latvoista vaaroihin.
- **Mikä toimi:** kuvatapa on katsojan paikka ja rajaus, ei uusi puumalli. Sama tila näyttää eri kuvalta, kun katse on
  ylhäällä, maassa, jäässä tai latvojen yllä. Vaarat kerroksina usvassa syntyivät taivaan funktioon ilman geometriaa, ja
  niissä puu on pelkkä reunan vihje.
- **Ääni kuvaan:** säie piirtää ylälinjan korkeuden viiden sekunnin ikkunasta, joten melodian muoto näkyy stillissäkin.
  Valon määrä tulee äänen tasosta. Basso, iskut ja tapahtumat puuttuvat vielä.
- **Kolme pahinta ongelmaa** (`runs/vedos_v2/run.json`): usvakuva on yhä runkoja syvyydessä; metsän reuna ulkoa on lähellä
  tyynen järven kliseetä; latvat ylhäältä ovat piikkejä.
- **Koepätkä (75 s alusta):** liike mitattiin, ei arvattu. Ääni on 0,00 ms kuuntelukopiosta, ja kuva muuttuu iskujen ruuduissa
  neljä kertaa enemmän kuin niiden edellä. Ensimmäinen minuutti on silti ajo runkojen välissä: kuvatapa 1 ei vielä ole se,
  mitä tyyliohje lupaa. Renderöintityökalu vaatii kohtaukselta myös `contextOk`-funktion; se puuttui ja kaatoi ensimmäisen ajon.
- **Työkaluvirhe:** tiedoston kirjoitus epäonnistui, koska tiedostoa oli muokattu komentoriviltä lukemisen jälkeen, ja yksi
  kierros piirtyi vanhalla aikajanalla. Tulos pitää tarkistaa ennen renderiä, ei sen jälkeen.

## 9.11.2026 – Vedos 1: maailmat stilleinä

- **Mitä tehtiin:** käyttäjä pyysi vedokset kohtauksista. Tehtiin tekniikkavalinta, yhteinen runko ja 16 stilliä, ei videota.
  Ottojen ajat tulevat käsikirjoituksen otsikoista ja ohjaustiedostosta (`render.mjs --otot`), ei komentoriviltä.
- **Mikä toimi:** metsä paikan funktiona. Kahdeksan maailmaa syntyy samasta puusta ja samasta sumusta eri luvuilla, ja syvyys
  tulee sumusta: lähellä musta siluetti, kaukana sininen. Valo kannattaa pitää takana ja pinnat lähes valaisematta, koska
  suora valo paljastaa sileän pinnan.
- **Mikä ei toiminut ensin:** kartiokuuset näyttivät muovilta, kunnes oksakerrokset saivat riipunnan ja oksiston alaraja nousi
  silmän yläpuolelle. Valon leikkaus oli valkoinen seinä, koska gamma nostaa heikonkin tilavuusvalon näkyviin: voimakkuus
  pitää keskittää terään. Lumi oli ruudukossa. Tiheys 0 jätti silti puita aukealle (vertailu oli väärin päin).
- **Kolme pahinta ongelmaa** (`runs/vedos_v1/run.json`): puut läheltä liian sileitä; aukea, myrsky ja loppu latteita; jääkatto,
  ikisalo ja säikeet keskeneräisiä.
- **Ei tehty:** ääni ei ohjaa mitään, kulkuja ei ole suunniteltu, mittareista on vain camcheck, kriitikko ei ole katsonut.
- **Työkaluvirhe:** Bash-heredoc syö kenoviivat, joten säännöllinen lauseke rikkoutui kahdesti. Kenoviivoja sisältävä koodi
  kirjoitetaan tiedostotyökalulla.

## 9.11.2026 – Kuvakäsikirjoitus: ensin kaari, sitten otot, ja kaikki mitattavaksi

- **Mitä haettiin ensin:** millainen on hyvä kuvakäsikirjoitus (käyttäjän pyyntö). Tulos seitsemänä kohtana
  käsikirjoituksen luvussa 0: tunteen kaari ennen ottoja, yksi ajatus per otto, vakiokentät, värin kaari rinnalla,
  nimetyt hengähdykset, ajoitus sidottu musiikkiin etukäteen, ja käsikirjoitus on työkalu eikä taideteos.
- **Skilli:** käyttäjän omista skilleistä ei löytynyt; hakemiston lähimmät (animation-studio,
  scripting-and-storyboarding, CineFlo) tuovat oman tyylin tai ovat eri lajia. Yhteisön "Pixar story-driven
  storyboarding" -ohjeesta otettiin periaatteet (kaari, hengähdykset, värikaari), ei muotoa: se on hahmovetoinen.
- **Mikä toimi:** käsikirjoitus on teksti, mutta sen voi mitata. Jokainen tunniste takahipsuissa on ankkuri, jakso,
  kanava tai tapahtumatyyppi; tarkistus kaataa vieraan tunnisteen, käyttämättömän ankkurin, aukon ottojen välillä,
  käsin kirjoitetun ajan ja väärän määrän nimettyjä pysähdyksiä. Ajat otsikoihin generoidaan, joten ne vaihtuvat
  levytyksen mukana.
- **Mikä toimi:** koneen tapahtumalista aikajärjestyksessä ankkurien välissä (ei oppaan valikoima) näytti, mitä
  kussakin otossa oikeasti tapahtuu: esimerkiksi jyrkin nousu on kirjaimen R jälkeen, ja myrskyn sisältä ei löydy
  yhtään aksenttia.
- **Tyyliohjeen aukot, jotka kirjoittaminen paljasti:** sana kajo tarkoittaa sekä käyrätorvien valoa että
  H-duurin väriä; sääntö 13 (väike kaukana) ja luvun 7 taulukko (väike lähellä ja keskellä) ovat ristiriidassa.
  Väike on ratkaistu tyyliohjeessa v1.3 (koti kaukana, johtaessaan lähemmäs); sana kajo on yhä käyttäjän päätettävä.
- **Tuore lukija (9.11.2026) löysi sen, mitä kirjoittaja ei nähnyt:** oman iskusääntöni, joka rikkoi sääntöjä 10 ja 11;
  värin vaihtumisen iskussa kahdessa otossa; kolme ottoa ja yhden maailman, joissa metsä ei näkynyt; ja kaksitoista
  ristiriitaa tyyliohjeen sisällä. Kirjoittaja lukee tekstinsä sen mukaan, mitä tarkoitti.
- **Mikä toimi briefissä:** vaatimus lainata molemmat tekstit sanasta sanaan ja täyttää sääntö- ja ottotaulukko
  kokonaan. Jokainen löydös oli tarkistettavissa minuutissa, ja kaksi osoittautui vääriksi (kameran nousun ankkuri,
  väikkeen kerros).
- **Mikä ei toimi tekstistä:** liikkuvien elementtien määrä otossa on arvio. Se mitataan vasta kuvasta.
- **Tyyliohje oli itse ristiriitainen**, ja siksi käsikirjoitus ei voinut noudattaa sitä kokonaan. Ohje kannattaa
  tarkistuttaa tuoreella lukijalla ennen kuin siitä johdetaan mitään.
- **Ei tehty:** korjattua tekstiä ei ole luettu tuoreilla silmillä uudestaan. Maailmat olivat ohjaajan
  ehdotus, eivät käyttäjän sanoja. Kolmen C-duurin vilahduksen ajat ja vaskivuorottelun osapuolet puuttuvat datasta.

## 9.11.2026 – Vähemmän tiedostoja, ja synteesi ennen poistoa

- **Mikä meni vikaan:** jokainen kierros lisäsi dokumentin ja skriptin (docs 49 tiedostoa, analysis 30 skriptiä, generoituja
  tulosteita kolmessa paikassa). Kokonaisuutta ei voinut pitää mielessä, eikä kukaan tiennyt, mikä tiedosto ohjaa kuvaa.
  Käyttäjä: "LUOT VAIN LISÄÄ ASIAA KOKO AJAN."
- **Mikä meni vikaan toisen kerran:** siivosin poistamalla. Käyttäjä: tutkimus on maksettu, sitä ei poisteta vaan
  syntetisoidaan käyttökelpoiseksi. Poistettu tiedosto on gitissä tallessa, mutta tallessa ei ole sama kuin käytössä.
- **Mitä tehtiin:** kolme luettavaa tiedostoa (kuunteluopas, tyyliohje, taustatutkimus) ja JSON-data. Taustatutkimus
  kirjoitettiin uudestaan arkistosta: jokaisessa luvussa se, mitä asia antaa kuvalle, ja periaatetaulukot kokonaisina.
  Arkisto (`docs/tutkimus/`) jäi koskematta lähteiksi. Yksi kuuntelutyökalu, yksi generoitu ohjaustiedosto.
- **Sääntö:** uusi tieto menee olemassa olevan tiedoston lukuun. Uusi tiedosto tai skripti vaatii käyttäjän luvan.
  Ennen kuin jotain poistetaan, sen ainutkertainen sisältö siirretään: poistolistalta löytyi neljä asiaa, joita ei
  ollut muualla (25 partituurisivun taulukko, elementtien iskusarake, siirto omaan äänitykseen, kirjaintaulukko).
- **Ei tehty:** arkistosta luettiin kokonaan mytologia, soittimet, tehokeinot, viitteet, 1920-luvun taide ja kanavakortti; tiedostoista teos, konteksti, esitysmerkinnät ja auringonsäde luettiin yhteenveto- ja rakenneluvut (loput niistä on aiemman tiivistelmän varassa); haastattelua ja Kajanus-levytystä ei luettu uudelleen. Lähteitä ei tarkistettu uudelleen. Koneen
  kuulemia 270 tapahtumaa ei ole karsittu korvalla.

## 9.11.2026 – Visualisaattori äänelle: tunnistin, kuulijan opas, yksityiskohdat

**Ei toiminut**
- Ohjaaja kirjoitti minuutit 1–17 lukujen perusteella katsomatta kuvia ja kutsui nousua (3:00–3:16) sanoilla
  "metsä seisoo". Käyttäjä kuuli nousun. Sääntö: lue kuva ennen kuin kirjoitat, mitä siinä on.
- "Käyrätorvet vastaavat" oli väärä tulkinta: ne soittavat gis:tä taustalla koko ajan ja paljastuvat, kun jouset
  lopettavat. Mittaus näytti sen (gis katkeamaton), mutta ohjaaja sanoitti muutoksen uutena äänenä.
- Opas oli täynnä desibelejä ja keskiarvoja. Käyttäjä: opas on kuvaus kuulijalle, tekninen data JSONiin.

**Toimi**
- `linjat.py`: bassolinja, kerrosten painopiste, suunta, pitkien äänten muoto ja värinä. Sillä näkyi nousu soinnuittain
  ja tremolo ylälinjassa.
- `tapahtumat.py`: tunnistin löysi itse käyttäjän kolme esimerkkiä (nousu 3:06, basso lähtee 68 s jälkeen, pohja
  katoaa 3:25 42 sekunniksi) ja 271 tapahtumaa koko teoksesta. Vääriä osumia on; ei vielä kuultu.
- Opas generoituu nyt kuulijan kielellä; tekninen data `annotations/tekninen_rattle2022.json`.
- Tyyliohjeen luku 7b: jokaisella äänen tapahtumalla on kuvavastine, ja kriitikko tarkistaa sen.

**Oppi**
- Sibeliuksen kieli on usein poisottamista: kerros väistyy ja paljastaa toisen. Kun mittaus näyttää jatkuvan äänen ja
  muutoksen sen ympärillä, kysy ensin "mikä lakkasi", ei "mikä tuli".
- Käyttäjän esimerkit ovat esimerkkejä: sama pitää löytää itse koko teoksesta.

## 9.11.2026 – Jokainen minuutti, ei vain ensimmäinen

**Ei toiminut**
- Ohjaaja analysoi ensimmäisen minuutin tarkasti ja jätti loput karkeiksi. Käyttäjä: "sitten ei seuraavilla minuuteilla
  tapahdu mitään? Jokainen minuutti pitää tarkasti miettiä." Menetelmä, joka toimii yhdessä kohdassa, ajetaan heti
  koko teokselle.
- Rattlen videon kommenteissa oli vain yksi aikaleima; ne kelpaavat tunnelman lähteeksi, eivät ajoitukseen.

**Toimi**
- `tarkka.py` (CQT 60 kaistaa/oktaavi, 12 ms) vastasi käyttäjän kolmeen tarkkaan havaintoon: gis soi 25 s
  yhtäjaksoisesti, se paisuu 12 kertaa ja sen väri vaihtuu sekunneittain, ja basson askeleet näkyvät 1:25 alkaen
  noin 1,8 s välein. Kun kysymys on tarkka, spektri vastaa; yleinen soitinluokitin ei vastannut.
- `minuutit.py` ajoi saman 18 minuutille ja tiivisti jokaisen: pitkät äänet, matalat alut, kuvioiden tiheys.
  Siitä 29 uutta ankkuria ja kolme korjausta.
- Jo luetut partituurimerkinnät ja kirjaimet sijoitettiin mitattuihin tapahtumiin (tahti–aika-taulukko). Se
  paljasti kolme virhettä: "toinen hiljaisuus" on pp eikä tauko (t. 513), myrskyn isku t. 540 on noin 14:33 ja
  kohdassa 14:50 on Q (patarummut ja vasket), ja huuto on 15:36–15:55 eikä 16:10.

**Oppi**
- Työnjako, joka toimii: käyttäjä sanoo yhdellä lauseella, mitä kuulee; ohjaaja mittaa sen tarkasti ja etsii saman
  muualta. Ohjaaja ei kuule, vaan mittaa: soitinta se ei nimeä varmasti.

## 9.11.2026 – Metsä näkyy, synestesia, lisää detaljia edullisesti

**Ei toiminut**
- Tyyliohje v1 vei abstraktion liian pitkälle ("metsä uutetaan, ei kuvata"). Käyttäjä: metsä on lähtökohta ja se
  näkyy. Abstraktia on se, mitä soittimet tekevät metsässä, ei metsä.
- Koneluettavaa partituuria (MIDI, MusicXML) ei löytynyt kahdella haulla. basic-pitch ei asennu Python 3.12:een
  (tensorflow-riippuvuus); sääntö kieltää kiertotiet, jätettiin.
- Kaarentunnistin (`kaaret.py`) poimii jousimelodian yläsäveliä, ei puhaltimien kuvioita: sen kaarilistaa ei käytetä.
- Kerroskartan ensimmäinen versio sulautti alun hiljaisuuteen ja antoi liikkeeksi aina "nopea". Tarkistus kuvasta
  ja rivien lukeminen ennen raportointia paljasti sen.

**Toimi**
- Rekisterikerrokset CQT:stä (matala, keski, korkea, kirkas) erottelevat alun tapahtumat, joita soitinluokitin ei
  erotellut: patarummut yksin, siemen, käyrätorvien pitkä vastaus, siemen uudestaan, pitkä ääni ja sen yllä pienet
  korkeat kuviot, patarumpujen paisutus, puuska. Ei uusia riippuvuuksia, CPU, alle minuutti.
- Kerroskartta: 338 riviä koko teoksesta, noin 3 s välein, generoituna. Ei arvaa soitinta.
- Suppea haku (viisi hakua, ei agenttia) riitti synestesiaan ja MIDI-kysymykseen.

## 1.11.2026 – Tyyliohje v1

**Toimi**
- Tyyliohje kirjoitettiin vasta, kun käyttäjä antoi ydinidean (maailmoja maailmojen sisällä, kamera ajaa koko ajan,
  kerrokset, myrsky kaukaa). Ohjaajan omat valinnat merkittiin **[ohjaajan valinta]**, jotta käyttäjä näkee, mikä on
  hänen ja mikä ohjaajan.
- Yksi lähde, kolme näkymää: kuvasäännöt, soitinroolit ja kriitikon kohdat johdettiin samalla kertaa.
- Sääntö "sano ääneen, jos ehdotat edellisen tyyliä" toimi: kerrosajatuksen tekninen sukulaisuus edellisen
  monitasoon sanottiin ja ero kirjattiin (kerros on etäisyys ja valo, ei taso).

## 1.11.2026 – Merkittävyys

**Käyttäjän kritiikki:** en aina erota merkittävää merkityksettömästä. Sordiinot, painosten erot ja sivuittaiset
luettelot eivät vaikuta kuvaan; tunnelma, tempo, iskut ja se, mitä halutaan tuoda esiin, vaikuttavat.

**Oppi:** merkittävyyden testi ennen jokaista tehtävää (CLAUDE.md). Teemakartasta poistettiin sordiino-ankkuri.

## 1.11.2026 – Partituuri-PDF päätyi gittiin

**Ei toiminut**
- `git add docs/` vei IMSLP-skannauksen (ei PD EU:ssa ennen 2028) repoon ja GitHubiin. Huomattiin vasta, kun
  partituuria alettiin lukea.

**Korjaus**
- `*.pdf` gitignoreen, tiedosto pois seurannasta, ja käyttäjän luvalla historia kirjoitettiin uudestaan
  (`git filter-branch`, 31 commitia) ja pushattiin pakotetusti. Varmuuskopio .git-kansiosta scratchpadissa.

**Oppi**
- Lisää gittiin nimetyt tiedostot, ei kansioita. Tekijänoikeudenalainen lähdeaineisto (partituuri, äänitykset)
  kuuluu alusta asti gitignoreen, ei vain `audio/`.

## 1.11.2026 – Kaniinkuoppa: partituurin sivuittainen luettelo

**Ei toiminut**
- Käyttäjä pyysi katsomaan partituurista esitysmerkinnät lähteiden nimeämissä kohdissa. Ohjaaja briefasi agentin
  lukemaan kaikki 58 sivua ja tekemään kolme taulukkoa, ja haki rinnalla urtext-kysymyksiä. Yli tunti ja paljon
  krediittejä tulokseen, jota ei pyydetty. Käyttäjä pysäytti.

- Toinen virhe perään: käyttäjä pyysi *miettimään*, kannattaako työ viedä loppuun, ja ohjaaja pysäytti agentin
  heti. Käyttäjä: "Pyysin sinua miettimään, en pysäyttämään sitä työtä." Krediitit oli jo käytetty; oikea liike
  oli ottaa talteen kaikki, mitä agentti ehti lukea, ja päättää vasta sitten. Agentti herätettiin ja pyydettiin
  kirjoittamaan jo luettu ulos lukematta enempää.

- Pelastus onnistui: agentti kirjoitti 25 luettua sivua ulos (kirjaimet J–S, tempot, sordiinot, loppu), ja ohjaaja luki
  itse 11 kohdesivua. Yhdessä ne kattavat kaikki nimetyt kohdat paitsi kirjaimet C–I ja N.

**Oppi**
- Kun työ on jo maksettu, älä hylkää sitä: ota siitä irti se, mitä on. Pysäytys on päätös, ei refleksi.
- Ennen agentin käynnistystä: kuinka monta sivua tai kohtaa tehtävä oikeasti vaatii? Jos vastaus on "ne 10 kohtaa,
  jotka jo tiedetään", ohjaaja katsoo ne itse, eikä briefaa luetteloa.
- "Mitä partituurissa lukee" on eri kysymys kuin "mitä Sibelius tarkoitti"; käyttäjä kysyi ensimmäistä ja lähteistä
  toista, ei urtext-vertailua.

## 1.11.2026 – Opas sekuntilistaksi

**Toimi**
- Käyttäjä: tarina oli hyvä, mutta visualisointia varten se pitää olla sekunneilla. Ratkaisu: tarina, etuala ja
  tunnelma ovat teemakartan ankkurin kenttiä, ja opas generoi ne aikaleimojen viereen. Yksi lähde, ei kahta.
- Alku lyhennettiin Sibeliuksen omiin sanoihin (esipuhe, Damroschin alaotsikko, Jalas, sonaattimuoto, "iskevyys").
- Uudet kentät: `etuala` (kerrokset: mikä edessä, mikä takana; käyttäjän kuvataideanalogia syvyydestä) ja
  `tunnelma` (ahdistava, groteski valo, velloava; käyttäjä: monet kuulijat kokevat teoksen pelottavana).

**Oppi**
- Tarinamuoto oli oikea tapa löytää tulkinta, mutta väärä tapa säilyttää se. Kirjoita ensin vapaasti, siirrä sitten
  ankkureihin.

## 1.11.2026 – Kuunteluoppaan tarina

**Toimi**
- Käyttäjä antoi vuoron ohjaajalle: tarina on ohjaajan luova tulkinta, lähteet ja käyttäjän kuvat merkittyinä
  erikseen. Kolme ääntä (Lähteet / Käyttäjä / Ohjaaja) samassa tekstissä pitää tulkinnan rehellisenä.
- Tarina viittaa ankkureihin hakasulkeissa, ei sekunteihin; ajat ovat vain generoiduissa osissa.
- Hiljaisuus tehokeinona kulkee oppaan läpi lankana (käyttäjän ehdotus) ja antaa dramaturgialle syyn: viimeinen
  teos, jonka jälkeen hiljaisuus jatkui.

**Varottavaa**
- Oppaan tarina on kirjoitettu ennen kuin yhtään aikaa on kuultu. Jos korva siirtää ankkurin, tarina pysyy, koska se
  ei sisällä aikoja; mutta jaksojen järjestys (esim. "huuto" 16:10) voi muuttua.

## 1.11.2026 – Teemakartta (vaihe 5, luonnos)

**Toimi**
- Levytysriippumaton rakenne (ankkurit partituurista, ajat per levytys) toteutui: `make_cues.py --levytys` ja
  `kuunteluopas.py --levytys` lukevat sen, `check_package --cues-only` tarkistaa. 39 ankkuria, 36 ajalla.
- Agentti poisti cues.jsonista tahtiruudukon ja events-tapahtumat, koska ne sisälsivät äänestä laskettuja tahteja.
  Oikea tulkinta säännöstä.
- Käyttörajaan pysähtynyt agentti jatkoi `SendMessage`llä siitä mihin jäi; työ ei hävinnyt.

**Varottavaa**
- Kolme ankkuria (myrsky_iskee 890,5 s, allegro_moderato_O, huuto) valittiin tahtimäärän suhteella mitattujen
  ankkurien väliin. Sama arvio osui aiemmin 25 s pieleen, joten nämä ovat heikkoja ja vaativat korvan.
- Kolme ankkuria ilman aikaa (tuulenpuuska, askeleet_B, con_sord_J): kanavaa ei ole (askel) tai piirre ei näy
  spektristä (sordiino, oktatonisuus). Nämä tulevat käyttäjän korvalta tai partituuripohjaisesta kohdistuksesta.

## 1.11.2026 – Koko teos Rattlesta (vaiheet 3–4)

**Toimi**
- Koko 1078 s mahtui yhteen pakettiin (näytönmuisti 2,8 Gt), ei osia eikä stitchiä. Listen 229 s.
- Chroma-vihje löysi käyttäjän C-duurin: 680–685 s, 5,1 s, C+E+G 58 %, matala jännite, ja heti perään M:n isku
  (liiketiheys 0,05 → 2,2/s, vaski 0,01 → 0,34). Mittaus osui partituurihavaintoon ilman että sille annettiin aikaa.
- Karkea CPU-myrskykartta (taso + liike + tremolo-proxy) antoi kymmenen myrskymäistä jaksoa minuuteissa ja
  johti kysymykseen "useampi myrsky?", johon käyttäjä vastasi partituurista (523 ppp, 540 isku).
- Agentti poikkesi briefistä perustellusti (kohinaikkuna: digitaalinen hiljaisuus ohitettiin) ja kirjasi syyn.

**Ei toiminut**
- `jousitremolo` on kuollut myös modernilla äänityksellä (keskiarvo 0,014 myrskyssä): amplitudimodulaatio
  8–20 Hz ei näy orkesterin tutissa. Myrsky tunnistetaan jännitteestä, kromaattisuudesta, liiketiheydestä ja
  vaskista. Tremolo pitää mitata toisin (esim. spektrin aikavaihtelu kapealla kaistalla, tai luokitin).
- PANNs: trumpetti ja pasuuna eivät erotu (korrelaatio 0,87); kontrabasso ei nouse koskaan; oboelle, fagotille ja
  englannintorvelle ei ole luokkaa. Luokat 2,5–3 s jäljessä. Taso A ei riitä V10:een (käyrätorvi vs. trumpetti).
- Ohjaajan karkea tahtiosuus-arvio (M ≈ 63 % ≈ 11:00) osui 25 s pieleen (M = 11:25). Tempo ei ole tasainen;
  arviota ei käytetä muuhun kuin karkeaan haarukointiin.
- Ohjaaja committasi `git add docs/` kesken agentin työn toisen kerran. Sääntö: `git add` nimetyin tiedostoin.

## 1.11.2026 – Vertailu moderniin äänitykseen

**Toimi**
- Käyttäjän ehdotus: sama putki modernille äänitykselle (Rattle/LSO 2022) ratkaisi kysymyksen "äänitys vai
  työkalut" yhdellä ajolla: modernilla jouset, vasket ja puupuhaltimet erottuvat selvästi, 1932-levyllä eivät.
- yt-dlp lisättiin manifestiin valinnaisena ryhmänä (`uv add --optional vertailu`), ei käsin.
- Vertailuäänitys on vain kalibrointiin: ei totuus, ei videoon, ei gittiin.

**Oppi**
- Kun kanava ei erottele, testaa ensin lähde toisella äänityksellä ennen kuin viritetään menetelmää.
- Demucsin drums-stemmi ei tunnista patarumpuja kummassakaan äänityksessä; matala kaista ja aksentit tunnistavat.

## 1.11.2026 – Vaihe 1 ja ensimmäinen kuuntelu (60 s)

**Toimi**
- Putki kopioitiin ja korjattiin yhdelle mp3:lle yhdessä Sonnet-ajossa briefistä; kaikki johdetut äänet 0,00 ms
  kuuntelukopiota vasten. Yksi dekoodaustapa (`analysis/lahde.py`) kaikille äänille poisti viivekysymyksen.
- `aksentit.py` näytti patarumpusoolon 10 ms tarkkuudella (1,61 s) ilman virittämistä. Oppi edellisestä piti.
- Kohinaikkuna löytyi tiedostosta ilman loppuuraa (hiljaisin 1 s ikkuna).
- Pöytäkirja + kuva + kuuntelunäyte samasta välistä on oikea muoto: ohjaaja näki kuvasta saman kuin raportista.

**Ei toiminut**
- Demucs-stemmit eivät erottele orkesteria: patarummut menevät other-stemmiin, ja jouset, puupuhaltimet ja
  vasket nousevat perhekanavissa yhtä aikaa. Stemmipohjaiset perhekanavat ovat Tapiolassa kuolleita avauksessa.
  Seuraava yritys: perhekanavat spektristä, PANNs lyhyemmällä ikkunalla, tai molemmat.
- `patarumpu_tremolo` ja `jousitremolo` reagoivat transientteihin. Tremolo pitää mitata modulaationa pitkän
  äänen sisällä, ei iskuina.
- Ohjaaja committasi `git add -A`:lla kesken agentin työn ja vei keskeneräisiä tiedostoja mukaan. Jatkossa:
  commit vasta, kun agentti on palannut, tai `git add` vain omiin tiedostoihin.

## 1.11.2026 – Tutkimus (vaihe 2) ja käyttäjän korjaukset

**Ei toiminut**
- Agentin käännös englannista tuotti "B-molli" (= b-molli) ja "mykistin". Käyttäjä korjasi: h-molli, sordiino.
  Sääntö CLAUDE.md:hen ja briefeihin: sävelnimet H/B tarkistetaan aina; musiikkisanasto muusikon suomeksi.
- Ohjaaja ja agentit kirjoittivat ristiriitoja (patarumpuavaus, sordiinot) "tarkistettaviksi", vaikka käyttäjällä
  on partituuri. Nopeampi tapa: kysyä käyttäjältä partituurista heti, kun lähteet ovat eri mieltä.

**Toimi**
- Kuusi Sonnet-agenttia briefeistä: teos, levytys, viitteet, työkaluarvio, auringonsäde, soittimet. Jokainen
  kirjoitti tiedostoon ja raportoi epävarmat. Kolme kohdennettua hakua vastasi käyttäjän kysymyksiin samana päivänä.
- Äänilähteen tarkistussumma verrattiin Internet Archiveen: tiedosto on alkuperäinen.
- Tekoälyn vastaus (Gemini) tallennettiin tarkistuslistana, ei lähteenä.
- "Ei löytynyt" sanottiin suoraan (väärä toivo, vuoret, Tapio kuvana, animaatiot). Aukot ovat nyt tiedossa:
  Salmenhaara 1970 on tärkein lukematon lähde.

## 1.11.2026 – Käyttäjän ensimmäinen palaute ja tutkimuksen aloitus

**Ei toiminut**
- Oletin äänilähteen rakenteen edellisen projektin mukaan (LP, puolet, liitokset) ja kysyin siitä.
  Käyttäjä: "Tämä ei ole LP. Miksi teet oletuksia edellisten projektien perusteella." Sääntö: aineisto
  luetaan ja mitataan ensin, kirjoitetaan vasta sitten. Myös työkalutarve arvioidaan itse, ei kysytä listaa.

**Toimi**
- Käyttäjän ideat kirjattiin heti omin sanoin `docs/tutkimus/haastattelu.md`:hen, erillään tulkinnasta.
- Tutkimus jaettiin neljäksi briefiksi (`docs/briefit/`), ja jokainen Sonnet-agentti lukee briefinsä
  tiedostosta. Chatissa ei annettu yhtään ohjetta, jota brief ei sisällä.

## 1.11.2026 – Perustus (vaihe 0)

**Toimi**
- Git ja `.gitignore` päivästä yksi. Isot tiedostot (ääni, video, painot, build) eivät pääse repoon vahingossa.
- Prosessisäännöt kirjoitettu omin sanoin `CLAUDE.md`:hen ilman edellisen projektin visuaalisia termejä.

**Huomiot**
- Käyttäjän ensimmäinen viesti pyysi sekä taustatutkimusta heti että "älä aloita mitään vaihetta".
  Ristiriita jätettiin käyttäjän ratkaistavaksi kysymyksenä; tutkimus on vaihe 2.
- Äänilähde on yksi mp3-tiedosto (17:43, 44,1 kHz, 320 kbps), ei puolittain jaettu levy. Aikojen totuus
  on silti kuuntelukopio, ei mp3-soittimen kello.
