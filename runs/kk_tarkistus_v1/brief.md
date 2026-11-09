**Lue ensin `docs/visuaalinen_tyyli.md` kokonaan ja sen luvun 12 kuvasäännöt. Vasta sitten mitään muuta.**

# Brief: kuvakäsikirjoituksen tarkistus tyyliohjetta vasten (kk_tarkistus_v1, 9.11.2026)

Olet tuore lukija. Et ole kirjoittanut kumpaakaan tekstiä etkä tunne projektin aiempaa keskustelua. Kaikki sitova on
tässä tiedostossa ja alla nimetyissä tiedostoissa. Vastaa suomeksi.

## Tehtävä

Tarkista `docs/kuvakasikirjoitus.md` (versio 1) kohta kohdalta `docs/visuaalinen_tyyli.md`:tä (versio 1.2) vasten.
Tyyliohje voittaa aina. Etsi kohdat, joissa käsikirjoitus rikkoo tyyliohjetta, on sen kanssa ristiriidassa, jättää
säännön täyttymisen arvailun varaan tai on ristiriidassa itsensä kanssa. Tämä on tekstin tarkistus: kuvaa ei ole vielä
piirretty, mitään ei renderöidä.

Miksi: jokainen rikkomus, joka jää käsikirjoitukseen, päätyy piirrettäviin ottoihin. Kirjoittaja on tarkistanut
tekstin vain itse.

## Lue tässä järjestyksessä

1. `docs/visuaalinen_tyyli.md` kokonaan. Kuvasäännöt 0–21 ovat luvussa 12, soitin → elementti luvussa 7, ääni → kuva
   luvussa 7b, väri luvussa 3, tila luvussa 4, kamera luvussa 5.
2. `docs/kuvakasikirjoitus.md` kokonaan: luvut 0–9 ja kaikki 60 ottoa.
3. `docs/tutkimus/haastattelu.md`: käyttäjän omat sanat. Niitä vasten tarkistetaan kohta F.
4. `annotations/cues.json` vain tarvittaessa: ankkurien nimet ja ajat (`cues`), jaksot (`sections`), koneen kuulemat
   tapahtumat (`tapahtumat`), kanavat (`ohjaus.channels`). Lue Pythonilla: `.venv\Scripts\python.exe -I`.
5. `docs/kriitikko_kohdat.json`: kysymykset on kirjoitettu ruutusarjoille. Käytä niitä muistilistana tekstille.

## Mitä tarkistetaan

**A. Kuvasäännöt 0–21, jokainen erikseen.** Käy jokainen sääntö läpi kaikkia ottoja vasten. Erityisesti:
- 1–4 kamera: liikkuu aina sisään ja eteen, ei peruuta, ei palaa, ei pyöri, ei kallistu, ei reagoi iskuun.
  Pysähdyksiä saa olla vain kaksi, C-duurissa ja H-duurissa. Onko jossain otossa kameran rivi, joka tarkoittaa
  pysähdystä, peruutusta, paluuta tai kääntymistä, vaikka sitä ei sanota sillä sanalla?
- 5 kulut: jokainen maailmasta toiseen siirtyminen on kulku jonkin läpi, kestää vähintään 4 s, mittakaava muuttuu
  jatkuvasti. Kesto luetaan otsikoiden generoiduista ajoista.
- 6–8 kerrokset: nimeääkö jokainen otto tai sen maailman kuvaus vähintään kolme syvyyskerrosta? Onko jossain tyhjä
  tausta?
- 9 metsä näkyy: onko otto tai jakso, jossa katsoja ei tietäisi olevansa metsässä? Tyyliohje kieltää horisontin ennen
  tiettyä kohtaa: tarkista se.
- 10–11 iskut: iskun elementti on ympäristössä ja on jo kuvassa ennen iskua. Ilmestyykö, katoaako tai loikkaako jokin
  iskussa?
- 12: liikkuuko jossain otossa yli kolme elementtiä yhtä aikaa? Laske otoittain.
- 13: väike ja kajo kaukana, paino ja massa lähellä.
- 14: onko jokaisella valolla nimetty lähde jossain kerroksessa?
- 15–17 väri: lämpöä ei ennen loppua, punaista vain C-duurin taotussa auringossa, kajon väri vain H-duurissa, väri ei
  vaihdu iskussa.
- 18 hiljaisuus: kamera jatkaa, elementit lakkaavat, kuva ei pimene eikä jatka entistä. Tarkista kaikki hiljaisuudet.
- 19–21: ei mitään kielletystä listasta.

**B. Soitin → elementti (tyyliohjeen luku 7).** Käyttääkö jokainen otto soittimelle sitä elementtiä, jonka taulukko
antaa? Onko elementti, jota taulukossa ei ole?

**C. Ääni → kuva (tyyliohjeen luku 7b).** Saako jokainen otossa nimetty tapahtumatyyppi taulukon 7b mukaisen
vastineen? Tapahtuuko jossain otossa kuvassa jotain, jolle otto ei nimeä äänen syytä (ankkuri, tapahtumatyyppi tai
kanava)?

**D. Otto otolta.** Jokaisessa otossa on teko. Yksi ajatus per otto. Johtaja on nimetty ja se on se, joka musiikissa
puhuu. Kentät Teko, Tunne ja johtaja, Näkyy, Kamera, Iskut eivät ole keskenään ristiriidassa.

**E. Käsikirjoituksen sisäinen ristiriidattomuus.** Luvut 1–4 (kaari, maailmat, valon ja värin kaari, langat) sekä 6–7
(iskut ja kanavat, kameran nimetyt kohdat) vastaan otot. Esimerkki siitä, mitä etsitään: luku 3 sanoo valon tulevan
edestä, otto sanoo sivulta.

**F. Käyttäjän sanat (`haastattelu.md`).** Onko käsikirjoituksessa jotain, mikä on ristiriidassa käyttäjän sanojen
kanssa? Älä tulkitse laajasti: raportoi vain selvä ristiriita ja lainaa käyttäjän lause.

**G. Tyyliohjeen omat ristiriidat**, joita käsikirjoitus ei voi ratkaista. Raportoi, älä ratkaise.

## Mitä ei tarkisteta (jo mitattu tai jo tiedossa)

- `analysis/check_package.py --cues-only` mittaa jo: jokainen takahipsuissa oleva tunniste on ankkuri, jakso, kanava
  tai tapahtumatyyppi; jokainen ankkuri on käytetty; otot kattavat teoksen ilman aukkoja; ajat ovat generoituja;
  nimettyjä pysähdyksiä on kaksi. Älä toista näitä.
- Aikojen oikeellisuus äänessä: ei kuulu tähän.
- Käsikirjoituksen luvussa 8 luetellut avoimet päätökset ja puuttuva data ovat tiedossa. Älä raportoi niitä löydöksinä.
  Raportoi kuitenkin, jos jokin otto nojaa niihin tavalla, jota luku 8 ei mainitse.
- Kahdeksan maailmaa on käyttäjän hyväksymä runko. Älä ehdota maailmojen vaihtamista.

## Rajat

- Kirjoita vain yksi tiedosto: `runs/kk_tarkistus_v1/kriitikko.md`. Älä muuta mitään muuta tiedostoa. Älä lisää
  skriptejä repoon; apuskripti saa olla vain käyttöjärjestelmän temp-kansiossa.
- Ei verkkohakuja, ei äänen kuuntelua, ei partituurin lukemista, ei gittiä.
- Ei omia tyyliehdotuksia. Korjausehdotus on yksi lause kuvasääntöjen sanoin, ja se korjaa vain rikkomuksen.
- Lainaa tarkasti. Jokainen löydös lainaa käsikirjoituksen lauseen ja tyyliohjeen lauseen sanasta sanaan. Jos et löydä
  lainattavaa lausetta, löydös ei ole löydös. Lainauksia ei keksitä.
- Sävelnimet suomeksi (H = englannin B, B = englannin B♭). Musiikkisanasto muusikon suomeksi (sordiino, urkupiste,
  tremolo).

## Raportin muoto (`runs/kk_tarkistus_v1/kriitikko.md`)

1. **Yhteenveto:** montako löydöstä kussakin luokassa, kolme vakavinta.
2. **Löydökset**, numeroituna, vakavin ensin. Jokaisesta:
   - luokka: **RIKKOMUS** (teksti sanoo jotain, minkä sääntö kieltää), **RISTIRIITA** (käsikirjoitus on ristiriidassa
     itsensä tai käyttäjän sanojen kanssa), **AUKKO** (säännön täyttymistä ei voi lukea tekstistä) tai **HUOMIO**
   - otto tai luku
   - käsikirjoituksen lause lainattuna
   - sääntö tai tyyliohjeen kohta ja sen lause lainattuna
   - korjaus yhdellä lauseella
3. **Sääntötaulukko:** säännöt 0–21 riveinä, jokaiselle OK / löydösten numerot / ei voi tarkistaa tekstistä.
4. **Ottotaulukko:** otot 1–60 riveinä: kerroksia nimetty (määrä), liikkuvia elementtejä (määrä), valon lähde nimetty
   (kyllä/ei), löydösten numerot.
5. **Tyyliohjeen omat ristiriidat** (kohta G).

Älä pehmennä. Tyhjä löydöslista on kelvollinen tulos vain, jos sääntötaulukko ja ottotaulukko on täytetty kokonaan.

Palauta lopuksi viestinä enintään 300 sanan tiivistelmä: löydösten määrät ja vakavimmat.
