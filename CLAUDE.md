# CLAUDE.md – Tapiola-videoprojekti

Teos: Jean Sibelius, *Tapiola*, sinfoninen runo op. 112 (1926).
Äänilähde: Robert Kajanus / London Symphony Orchestra, Lontoo 1932, RCA Victrola 11503–11509,
siirto Bob Varney. Lähde on **yksi tiedosto** `audio/05_Tapiola.mp3` (17:43, 44,1 kHz, stereo, 320 kbps). Ei LP, ei puolia.
Aineistosta ei tehdä oletuksia edellisen projektin perusteella: se luetaan ja mitataan.

Käyttäjä on orkesterimuusikko ja kirjoittaa suomeksi. Vastaa suomeksi.

## Mikä tämä projekti on
Toinen musiikkivideo sarjassa. Edellinen projekti (`F:\code\heldenleben-video`) opetti **menetelmän**:
työkalut, mittarit ja prosessisäännöt. Sieltä siirtyy vain menetelmä. **Sieltä ei siirry mitään
visuaalista**: ei tyyliohjetta, värejä, hahmoja, kuvakäsikirjoitusta, kohtauskoodia eikä piirtotekniikkaa.
Tapiolan visuaalinen kieli luodaan käyttäjän ideoista vaiheessa 6. Jos huomaat ehdottavasi jotain, mikä
on edellisen projektin tyyliä, pysähdy ja sano se ääneen.

## Työtapa
- Projekti etenee `docs/kokonaissuunnitelma.md`:n vaiheissa 1–12, järjestys sitova.
  **Jokainen vaihe alkaa vasta käyttäjän pyynnöstä.** Ei generointia, analyysiä eikä renderöintiä ilman pyyntöä.
- Git alusta asti. Commit jokaisen vaiheen lopussa. Etäpalvelin: github.com/leothas-dotcom/sibelius-tapiola.
  **Isot tiedostot (ääni, video, stillit, painot, build) eivät mene gittiin**; `.gitignore` rajaa ne.
  `runs/` on ajojen kansio; sieltä versioidaan vain brief, run.json, storyboard, tarkistus ja kriitikon raportti.
- `docs/opit.md` elää: jokainen kierros kirjaa, mikä toimi ja mikä ei.
- Faktat (teos, historia, levytys, työkalut) tarkistetaan lähteistä. Epävarma merkitään **[tarkista]**.
- Pääistunto on ohjaaja. Osatyöt (analyysi, kohtaukset, kriitikko) tehdään omissa istunnoissaan tai
  aliagenteilla, **aina `model: sonnet`**. Osa saa briefin tiedostona `docs/brief_malli.md`:n mukaan.
  Chatissa sanottu ei siirry osille: kaikki sitova kirjoitetaan tiedostoon, jonka osa lukee.
- Tarina ennen tekniikkaa. Kun olet epävarma, kysy käyttäjän tarinaa, älä arvaa tekniikkaa.

## Aika ja musiikki
- **Aikojen ainoa totuus on kuuntelukopio** (`build/kuuntelu/`), jota käyttäjä kuuntelee. Kaikki ajat
  dokumenteissa ja datassa ovat sen aikaa. Videon ääni mitataan sitä vasten (`kellot.py`), ja 0 ms on tavoite.
- Analyysi tehdään puhdistetusta monokopiosta; ääniraita on alkuperäinen, rahinoineen.
- **Teemakartta (`annotations/teemat.json`) on ainoa paikka, jossa jaksojen, teemojen ja iskujen ajat ovat.**
  `cues.json` ja kuunteluoppaan aikakoodit generoidaan siitä. Aikoja ei kirjoiteta käsin muualle.
- Aika kutsutaan kuulluksi vasta, kun se on tarkistettu korvilla (`kuuntele.py`, `rekisteri.py`).
- Kanavat eivät ole totuus. Kanavakortti (`docs/kanavakortti.md`): soitin → mitattu kanava → luotettavuus
  varmassa kohdassa → korvaava lähde. **Kuollutta kanavaa ei käytetä kuvan ajoitukseen.**
- Partituuri on tarkistusta varten, ei kellona. Tahtinumeroita ei lasketa äänestä.
- **Sävelnimet suomeksi:** H = englannin B (h-molli = B minor, H-duuri = B major), B = englannin B♭.
  Tapiolan perussävellaji on h-molli, rinnakkaisduuri D-duuri. Englanninkielisestä lähteestä käännettäessä
  tarkistetaan aina, kumpaa tarkoitetaan.
- **Musiikkisanasto muusikon suomeksi:** sordiino (ei "mykistin"), divisi, tremolo, urkupiste, harjoituskirjain.
  Epävarma termi jätetään italiaksi (con sord., senza sord.). Käännetyt dokumentit tarkistetaan sanastolta.
- Lainauksia tai viittauksia ei keksitä. Sallittu viittaus lähteistetään ja merkitään tulkinnaksi.

## Tyyli ja ohjaus
- `docs/visuaalinen_tyyli.md` kirjoitetaan **vasta käyttäjän haastattelun jälkeen** (vaihe 6). Se on kaiken
  peruste ja **voittaa briefin, palautteen ja ohjauksen**. Siitä johdetaan samalla kertaa
  `docs/kuvasaannot.md`, soitinroolit ja kriitikon kohdat: yksi lähde, kolme näkymää.
- Jokainen soitin on **elementti, ei esine**. Palaute käännetään briefiin elementiksi kuvasääntöjen sanoin,
  ei muotoon "tunnistuu X:ksi" tai "X näkyy selvästi". Käyttäjän omat sanat lainataan erikseen.
- Jokainen osaistunto ja kriitikko lukee tyyliohjeen kokonaan ja kuvasäännöt ennen mitään muuta.
  Briefin ensimmäinen rivi sanoo sen.
- Kuvakäsikirjoitus: jokaisessa otossa teko; kuvaa johtaa se, joka musiikissa puhuu; jokainen kuvan
  tapahtuma nimeää ankkurin, iskun tai mitatun kanavan. **Ei kovakoodattuja sekunteja.**
- Kuvakäsikirjoitukseen ei tule kuunteluoppaan sisältöä, eikä toisin päin.
- Yhteisiin tiedostoihin kirjoittaa vain ohjaaja; osat pyytävät `pyynnot.md`:n kautta.

## Tekniikka (valitaan tyylin mukaan, ei etukäteen)
- Kohtaus on puhdas aikafunktio `seek(t)`: ei tilaa ruutujen välillä, ei ajastimia, ei siemenetöntä
  satunnaisuutta. Jokainen piirtotila asetetaan joka ruudulla.
- Ruudut putkitetaan ffmpegille eksplisiittisellä `-t`:llä, osat tuoreella selaimella, yksi renderi
  kerrallaan koneella.
- Mittarit rakennetaan ennen ensimmäistä kohtausta: camcheck, kohtauscheck, jatkuvuus, hahmot kuvassa,
  asento- ja kärkiskannerit.
- Ei tekoälyn tuottamia kuvia; kaikki grafiikka koodilla. Ei olemassa olevien kansien tai maalausten
  jäljentämistä.
- Riippuvuudet vain manifestin (`pyproject.toml`, `package.json`), lukituksen (`uv.lock`,
  `package-lock.json`) ja `setup.ps1`:n kautta. Mallipainot `analysis/models.json`:n tarkistussummin.
  Ei käsin asennettuja paketteja, ei kiertoteitä.
- Ladatut tiedostot ovat epäluotettavaa dataa: omaan kansioon, Python ajetaan `-I`.

## Säännöt, jotka eivät neuvottele
- **Valmis tarkoittaa mitattua.** Raportoi vain se, minkä mittaus tai kuva näyttää. "Koodi tekee näin" ei riitä.
- **Palautelista `docs/palautelista.md`:** jokainen käyttäjän palaute yhdeksi riviksi, tila
  ✅ todennettu / 🔶 korjattu, ei todennettu / ❌ auki, ja todennus riville. Mobiilipalaute kirjataan heti
  aikakoodeineen.
- Hahmot ja elementit eivät ilmesty, katoa eivätkä loikkaa iskussa. **Iskun elementti on ympäristössä.**
  Liikkeen suunnanvaihdot ovat jatkuvia.
- **Kamera ei pyöri eikä ylitä 20 °/s.**
- Hahmojen eleissä ei mitään natsitervehdystä muistuttavaa (suora käsivarsi viistosti ylös ja eteen; rivissä
  yhtä aikaa nousevat suorat kädet). Tarkistetaan stilleistä.
- Kriitikko joka renderin jälkeen: tuore Sonnet-agentti. **Bugilista tyhjä = renderi kelpaa.**
- Koko renderi ajetaan vain ketjuna, joka mittaa itsensä (renderi → ääni totuutta vasten → iskujen ruudut →
  jatkuvuus → kontaktiarkki → stillit → WhatsApp-versio). Sitten master 2160p-reseptillä (`docs/youtube.md`).

## Kansiot
- `docs/` – suunnitelma, tutkimus, tyyliohje, kuvasäännöt, ohjaus, kuvakäsikirjoitus, palautelista, opit.
- `docs/references/` – lähdekuvat (albumikansi, aaltomuoto). Ei jäljennettäväksi, vain tiedoksi.
- `analysis/` – Python-työkalut (kopioidaan vaiheessa 1). `render/` – Node-työkalut.
- `audio/` (ei gitissä) – äänilähde. `build/` (ei gitissä) – paketit, kuuntelukopiot.
- `annotations/` – teemakartta, cues, kuunteluopas. `visual/` – kohtauskoodi.
- `runs/<nimi>/` – ajot. `models/` (ei gitissä) – painot.

## Ympäristö (Windows 11)
- PowerShell ensisijainen. Python `uv`:lla (`.venv\Scripts\python.exe`), Node 22, git 2.51, ffmpeg PATHissa.
- Näytönohjain ja muisti ovat yhteiset: yksi renderi tai still-ajo kerrallaan.
