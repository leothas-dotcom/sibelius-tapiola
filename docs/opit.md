# Opit

*Elävä dokumentti. Jokainen kierros kirjaa, mikä toimi ja mikä ei. Uusin ylimpänä.*

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
