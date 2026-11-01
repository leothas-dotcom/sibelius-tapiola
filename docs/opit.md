# Opit

*Elävä dokumentti. Jokainen kierros kirjaa, mikä toimi ja mikä ei. Uusin ylimpänä.*

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
- Käyttäjän ideat kirjattiin heti omin sanoin `docs/haastattelu_tyyli.md`:hen, erillään tulkinnasta.
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
